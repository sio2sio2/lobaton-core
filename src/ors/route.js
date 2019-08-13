import {addDescriptor} from "app/utils/misc.js";

function Ruta(ORS, opts) {
   const defaults = {
      profile: "driving-car"
   }

   this.url = ORS.URLBase + "/v2/directions";
   this.ORS = ORS;
   this.options = Object.assign({api_key: ORS.ors.key}, defaults);
   this.setOptions(opts);

   this.layer = L.geoJSON(undefined, {
      style: f => new Object({
                     color: "#77f",
                     weight: 5,
                     opacity: 0.9
                  }),
      onEachFeature: (f, l) => {
         if(ORS.ors.rutaPopup) {
            l.bindPopup(ORS.ors.rutaPopup(this.calc.destino, f));
         }
      }
   });

   addDescriptor(this, "value", false, true); // value= {polilinea, destino}
   addDescriptor(this, "calc", {origen: null,
                                destino: null,
                                layer: null}, true);
}

Ruta.prototype.setOptions = function(opts) {
   Object.assign(this.options, opts);
}

Ruta.prototype.create = async function(destino) {
   if(this.value) this.remove();

   return new Promise((resolve, reject) => {
      if(this.value === null) {
         resolve(null);
         return;
      }

      if(mismoPunto(adjofer.origen, this.calc.origen) &&
         mismoPunto(destino, this.calc.destino)) {

         dibujarRuta.call(this);
         this.value = {
            layer: this.calc.layer,
            destino: this.calc.destino
         }
         resolve(false);
         return;
      }

      this.ORS.espera.push("rutas");

      this.value = this.calc.destino = this.calc.layer = null;
      this.calc.origen = adjofer.origen;

      const origen = adjofer.origen.getLatLng(),
            fin    = destino.getLatLng(),
            params = Object.assign({
                        start: origen.lng + "," + origen.lat,
                        end: fin.lng + "," + fin.lat,
                     }, this.options),
            furl = this.url + "/" + params.profile;

      delete params.profile;
      
      if(this.ORS.ors.loading) this.ORS.ors.loading("ruta");
      L.utils.load({
         url: furl,
         method: "GET",
         params: params,
         callback: xhr => { 
            crearRuta.call(this, xhr, destino);
            this.ORS.espera.remove("rutas");
            resolve(true);
         },
         failback: xhr => {
            failback(xhr);
            this.ORS.espera.remove("rutas");
            resolve(undefined);
         }
      });
   });
}

function crearRuta(xhr, destino) {
   if(this.ORS.ors.loading) this.ORS.ors.loading("ruta");

   const data = JSON.parse(xhr.responseText);
   this.calc.destino = destino;
   this.calc.origen = adjofer.origen;
   this.value = {destino: destino};

   this.calc.layer = this.value.layer = dibujarRuta.call(this, data);
}

function dibujarRuta(ruta) {
   let layer;

   // Si no se proporciona ruta, es porque
   // se reaprovecha la marca almacenada en calc.
   if(ruta === undefined) {
      layer = this.calc.layer;
      ruta = layer.feature;
      this.layer.addLayer(layer);
   }
   else {
      this.layer.addData(ruta);
      ruta = ruta.features[0];
      layer = this.layer.getLayers()[0];
   }

   this.layer.addTo(adjofer.map);

   const coords = ruta.geometry.coordinates,
         point  = coords[Math.floor(.9*coords.length)];

   if(this.ORS.ors.rutaPopup) layer.openPopup({lat: point[1], lng: point[0]});
   return layer;
}

Ruta.prototype.remove = function() {
   if(!this.value) return false;

   this.layer.clearLayers();
   this.layer.removeFrom(adjofer.map);
   this.value = false;
   return this;
}
// Fin issue #47

export default Ruta;
