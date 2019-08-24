/**
 * @name MapAdjOfer
 * @class
 * @hideconstructor
 * @classdesc Implementa un mapa que muestra la adjudicación de vacantes provisionales
 * y la oferta educativa de los centros públicos dependientes de la Junta de Andalucía.
 *
 * @param {String} id  Identificador del elemento HTML
 * donde se incrustará el mapa.
 * @param {Obj} opts Opciones de configuración.
 * @param {String} opts.path Ruta relativa desde el directorio en que
 * se encuentra la página web al directorio ``dist``.
 * @param {Boolean} opts.light Si ``true``, define el comportamiento del evento
 * *click* como "seleccionar el centro pulsado" y el evento *contextmenu* muestra
 * un menú contextual que permite generar crear rutas e isocronas. Esto libera de
 * tener que realizar en la interfaz la definición de cómo seleccionar centro y cómo
 * ordenar que se creen rutas e isocronas.
 * @param {String} opts.ors  La clave para el uso de los servios de OpenRouteService.
 * @param {Function} opts.chunkProgress   Función que se ejecuta periódicamente
 * si se demora demasiado la creación de las isoronas.
 */
import * as status from "./status.js";
import * as iface from "app/interface/index.js";
import loadMap from "./load.js";
import * as centro from "app/centro/index.js";
import createLoc from "app/localidad/index.js";
import Solicitud from "app/solicitud";

const MapAdjOfer = L.Evented.extend({
   /** @lends MapAdjOfer.prototype */

   options: {
      id: "map",
      center: [37.45, -4.5],
      loading: true,    // Presenta un gif que ameniza la carga.
      zoom: 8,
      centeredZoom: 12,
      unclusterZoom: 14,
      autostatus: true, // Aplica el status inicial directamente.
      light: true,      // Issue #41
      search: true,     // Issue #51
      ors: false,       // Issue #42
      icon: "boliche"   // Estilo con que se definen las nuevas marcas.
   },

   statics: {
   },

   initialize: function(options) {
      L.Util.setOptions(this, options);

      let center = this.options.center,
          zoom   = this.options.zoom;

      delete this.options.center;
      delete this.options.zoom;

      if(this.options.loading === true) this.options.loading = iface.loading;

      loadMap.call(this);
      centro.create.call(this);
      // Issue #79
      createLoc.call(this);
      this.solicitud = new Solicitud(this);
      // Fin issue #79
      status.build.call(this);  // Issue #62

      new Promise(resolve => {
         // Si se proporcionó centro, no se calcula la posición.
         if(!options.center && navigator.geolocation.getCurrentPosition) {
            navigator.geolocation.getCurrentPosition(pos => {
               const coords = pos.coords;
               resolve({
                  zoom: this.options.centeredZoom,
                  center: [coords.latitude, coords.longitude]
               });
            }, function (err) {
               console.warn("No es posible establecer la ubicación del dispositivo");
               resolve({
                  zoom: zoom,
                  center: center
               });
            }, {
               timeout: 5000,
               maximumAge: 1800000
            });
         }
         else resolve({zoom: zoom, center: center});

      }).then(opts => {
         this.map.setView(opts.center, opts.zoom, {animate: false});
         this.tileLayer.addTo(this.map);
         this.cluster.addTo(this.map);

         if(options.autostatus && options.status) {
            this.setStatus();  // Issue #57
            this.fire("statusset", {status: true});
         }
      });
   },

   /**
    * Devuelve la clase de icono cuyo nombre es el estilo suuministrado.
    * @param {String} estilo  Nombre del estilo.
    * @returns {L.DivIcon}
    */
   getIcon: function(estilo) {
      return centro.catalogo[estilo] || null;
   },

   /**
    * Cambia el estilo de icono de todos las marcas de centro existentes.
    * En cambio, si la pretensión fuera empezar a dibujar marcas con
    * distinto estilo de icono, habría que hacer:
    *
    * @example
    *
    * mapadjofer.options.icon = "otro_estilo";
    *
    * @param {String} estilo     El estilo deseado para el icono.
    */
   setIcon: function(estilo) {
      const Icono = this.getIcon(estilo);
      if(!Icono) throw new Error(`${estilo}: Estilo de icono desconocido`);

      Icono.onready(() => this.Centro.store.forEach(m => m.setIcon(new Icono())));
      this.options.icon = estilo;

      return this;
   },

   /**
    * Agregar centros al mapa.
    *
    * @param {String|Object} datos  Datos en formato GeoJSON o URL donde conseguirlos.
    */
   agregarCentros: function(datos) {
      const Icono = centro.catalogo[this.options.icon];
      Icono.onready(() => {
         if(typeof datos === "string") {  // Es una URL.
            if(this.options.loading) this.options.loading();
            L.Mutable.utils.load({
               url: datos,
               callback: xhr => {
                  const datos = JSON.parse(xhr.responseText);
                  if(this.options.loading) this.options.loading();
                  this.agregarCentros(datos);
               }
            });
         }
         else {
            this.general = datos.features[0].properties;
            // Capa intermedia capaz de leer objetos GeoJSON.
            const layer = L.geoJSON(datos, {
               pointToLayer: (f, p) => {
                  const centro = new this.Centro(p, {
                     icon: new Icono(),
                     title: f.properties.id.nom
                  });

                  // Issue #33, #79
                  centro.on("dataset", e => {
                     // Para cada centro que creemos hay que añadir a los datos
                     // la propiedad que indica si la marca está o no seleccionada.
                     e.target.changeData({sel: false, peticion: 0});
                     Object.defineProperty(e.target.getData(), "codigo", {
                        get: function() {
                           return this.id.cod.toString().padStart(8, "0") + "C";
                        }
                     });
                  });


                  // Issue #41
                  if(this.options.light) centro.once("dataset", e => {
                     e.target.on("click", e => {
                        switch(this.mode) {
                           case "normal":
                              this.seleccionado = this.seleccionado === e.target?null:e.target
                              break;
                           case "solicitud":
                              this.fire("requestclick", {marker: e.target});
                              break;
                        }
                     });
                  });
                  // Fin issue #33, #41, #79

                  return centro;
               },
               onEachFeature: (f, l) => {
                  if(this.options.light) l.bindContextMenu(iface.contextMenu.centro.call(this, l));
               }
            });

            this.cluster.addLayer(layer);
            this.fire("dataloaded");
         }
      });
   },

   /**
    * Calcula la dirección postal del origen
    */
   calcularOrigen: function() {
      if(!this.origen) return;
      this.geoCodificar(this.origen.getLatLng());
      this.once("addressset", e => {
         if(typeof this.direccion === "string") this.origen.postal = this.direccion;
      });
      // Deshabilitamos inmediatamente en el menú contextual
      // la entrada correspondiente a geolocalizar el origen.
      if(this.options.light) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
      }
   },

   /**
    * Establece el origen de los viajes.
    *
    * @param {L.LatLng} latlng  Coordenadas en las que fijarlo.
    */
   setOrigen: function(latlng) {
      if(latlng) {
         this.origen = new L.Marker(latlng, {
            title: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
         });
         if(this.options.light) {
            this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
         }
      }
      else this.origen = null;
   },

   /**
    * Establece las isocronas referidas a un origen
    * @param {?L.LatLng|L.Marker} o Referencia para la isocronas. Si no ser
    * proporciona se entenderá que es el origen de coordenadas.
    */
   setIsocronas: function(o) {
      if(o && o.getLatLng) o = o.getLanLng();
      if(o === true) o = undefined;
      this.isocronas = o;
      if(o && this.options.light && this.origen) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
      }
   },

   /**
    * Devuelve las capas de las áreas de las isocronas dibujadas en el mapa.
    *
    * @returns {Array}
    */
   getIsocronas: function(maciza) {
      return this.ors.isocronas.get(maciza);
   },

   /**
    * Establece la ruta entre el origen y un centro
    */
   setRuta: function(centro) {
      this.ruta = centro;
      if(centro && this.options.light && this.origen) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
      }
   },

   geoCodificar: function(query) {
      this.direccion = query
   },

   getStatus: status.get,
   setStatus: status.set,
   progressBar: iface.progressBar
});

export default function(opts) {
   if(opts.status) opts = Object.assign(opts, status.getOpts(opts.status));  // Issue #62
   return new MapAdjOfer(opts);
}
