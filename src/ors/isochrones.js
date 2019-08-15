import {addDescriptor, rgb2hex, HSLtoRGB} from "app/utils/misc.js";
import {mismoPunto, failback} from "./utils.js";

function Isocronas(ORS, opts) {
   const defaults = {
      profile: "driving-car",
      range_type: "time",
      interval: 600,
      range: 3600,
      location_type: "start",
      intersections: false,
   }

   // Para la interrupción del cálculo de las
   // isocronas. cuando se demora mucho su cálculo.
   this.progress = {
      interval: 200,
      delay: 50
   }

   /*
   try {
      turf
   }
   catch(e) {
      throw new ReferenceError("No se encuentra cargado turf. ¿Ha olvidado cargar la librería en el HTML?");
   }
   */

   this.ORS = ORS;
   this.url = ORS.URLBase + "/v2/isochrones";
   this.options = Object.assign({}, defaults);
   this.setOptions(opts);

   this.layer = L.geoJSON(undefined, {
      style: f => new Object({
                     color: rgb2hex(HSLtoRGB(f.properties.ratio, .75, .30)),
                     opacity: 0.6
                  }),
      onEachFeature: (f, l) => {
         l.bindContextMenu(contextMenuArea.call(this, l, this.layer));
      },
      pane: "isochronePane"
   });

   addDescriptor(this, "areas", false, true);  //false: no hecha, null: en proceso.
   // Resultado del último cálculo, por si se piden
   // otra vez las isocronas definidas por el mismo origen.
   addDescriptor(this, "calc", {origen: null, areas: null}, false);
}

Isocronas.prototype.setOptions = function(opts) {
   Object.assign(this.options, opts);
   if(!(this.options.range instanceof Array)) {
      this.options.range = [this.options.range];
   }
   return this;
}

/**
 * Crea las isocronas, en principio tomando como referencia la marca de origen.
 * Es función asíncrona cuya promesa devuelve ``null`` si ya había otra petición
 * en curso; ``false``, si se recuperaron las últimas isocronas, ``true``, si
 * se generaron unas nuevas; e ``undefined`, si se produjo un error.
 *
 * @param {L.LatLng} point  Punto que se tomará como referencia
 * para el cálculo de las isocronas. Si no se proporciona, se
 * toma el origen de los viajes.
 */
Isocronas.prototype.create = async function(point) {
   point = point || this.ORS.adjofer.origen.getLatLng();

   return new Promise((resolve, reject) => {
      if(this.areas === null) {
         resolve(null);
         return;
      }

      this.ORS.espera.push("isocronas");

      // Si repetimos origen, entonces rescatamos las isocronas calculadas.
      if(mismoPunto(point, this.calc.origen)) {
         if(!this.areas) {  // Se llegaron a borrar.
            redibujarAnillos.call(this);
            this.layer.addTo(this.ORS.adjofer.map);
            this.areas = this.calc.areas;
         }
         resolve(false);
         return;
      }
      else {
         if(this.areas) this.remove();
         this.areas = this.calc.origen = this.calc.areas = null;
      }

      let params = Object.assign({locations: [[point.lng, point.lat]]},
                                  this.options);

      if(this.ORS.ors.loading) this.ORS.ors.loading("isocronas");
      L.utils.load({
         url: this.url + "/" + params.profile,
         headers: { Authorization: this.ORS.ors.key },
         contentType: "application/json; charset=UTF-8",
         params: params,
         callback: xhr => {
            crearIsocronas.call(this, xhr, point).then(() => {
               this.ORS.espera.remove("isocronas");
               resolve(true);
            });
         },
         failback: xhr => { 
            failback(xhr);
            this.ORS.espera.remove("isocronas");
            resolve(undefined);
         }
      });
   });
}


async function crearIsocronas(xhr, point) {
   if(this.ORS.ors.loading) this.ORS.ors.loading("isocronas");

   const started = (new Date()).getTime();
   // Estos polígonos son completamente macizos, es decir,
   // el referido a la isocrona de 30 minutos, contiene
   // también las áreas de 10 y 20 minutos.
   const data = JSON.parse(xhr.responseText);
   this.layer.addTo(this.ORS.adjofer.map);

   return new Promise(resolve => {
      // La ejecución a intervalos se ha tomado del codigo de Leaflet.markercluster
      let i=0;
      const process = () => {
         const start = (new Date()).getTime();
         for(; i<data.features.length; i++) {
            const lapso = (new Date()).getTime() - start;

            // Al superar el intervalo, rompemos el bucle y
            // liberamos la ejecución por un breve periodo.
            if(this.ORS.ors.chunkProgress && lapso > this.progress.interval) break;

            const anillo = i>0?turf.difference(data.features[i], data.features[i-1]):
                           Object.assign({}, data.features[0]);

            // turf hace que anillo y data.features[i] compartan properties,
            // pero se necesita que sean objetos diferentes para que uno tenga
            // la propiedad area y el otro no.
            anillo.properties = Object.assign({}, data.features[i].properties, {
               ratio:  1 - i/data.features.length,
               area: data.features[i]  // Las área macizas sirven para filtrado.
            });
            data.features[i].properties.ratio = anillo.properties.ratio;

            this.layer.addData(anillo);
         }

         if(this.ORS.ors.chunkProgress) {
            this.ORS.ors.chunkProgress(i, data.features.length,
                                       (new Date().getTime() - started));
         }

         if(i === data.features.length) {
            this.calc.origen = point;
            this.areas = this.calc.areas = this.layer.getLayers();
            resolve();
         }
         else setTimeout(process, this.progress.delay);
      }
      process();
   });
}


/**
 * Elimina las isocronas.
 */
Isocronas.prototype.remove = function() {
   if(!this.areas) return false;
   this.layer.clearLayers();
   this.layer.removeFrom(this.ORS.adjofer.map);
   this.areas = false;
   return this;
}


function contextMenuArea(area) {
   // Los anillos tienen entre sus propiedades el área maciza,
   // pero las áreas macizas, no tienen área alguna.
   const es_anillo = !!area.feature.properties.area;

   const items = [
      {
         text: "Eliminar isocronas",
         callback: e => this.ORS.adjofer.setIsocronas(null),
         index: 0,
      }
   ]

   if(es_anillo) {
      items.push({
         text: `Filtrar centros alejados más de ${area.feature.properties.value/60} min`,
         callback: e => {
            const maciza = area.feature.properties.area;
            let idx;
            for(idx in this.areas) {
               if(this.areas[idx] === area) break;
            }

            this.ORS.adjofer.Centro.filter("lejos", {area: maciza, idx: Number(idx)});
            this.ORS.adjofer.Centro.invoke("refresh");
            this.dibujarAreaMaciza(maciza);
         },
         index: 1,
      })
   }
   else {
      items.push({
         text: `Mostrar centros alejados más de ${area.feature.properties.value/60} min`,
         callback: e => {
            this.ORS.adjofer.Centro.unfilter("lejos");
            this.ORS.adjofer.Centro.invoke("refresh");
            redibujarAnillos.call(this);
         },
         index: 1
      });
   }

   items.push({separator: true, index: 2});

   return {
      contextmenu: true,
      contextmenuInheritItems: true,
      contextmenuItems: items
   }
}

Isocronas.prototype.dibujarAreaMaciza = function(area) {
   this.layer.clearLayers().addData(area);
   const a = this.layer.getLayers()[0];
   a.bindContextMenu(contextMenuArea.call(this, a));
}

function redibujarAnillos() {
   this.layer.clearLayers();
   for(const a of this.calc.areas) this.layer.addLayer(a);
}


/**
 * Devuelve las capas de las áreas que constityen las isocronas.
 */
Isocronas.prototype.get = function(maciza) {
   let areas = this.calc.areas;
   if(maciza) areas = areas.map(a => a.feature.properties.area);
   return areas;
}

export default Isocronas;
