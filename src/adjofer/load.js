import {crearAttrEvent} from "app/utils/misc.js";
import * as iface from "app/interface/index.js";
import ORS from "app/ors";

/**
 * Carga el mapa y crea la capa de cluster donde se agregan los centros.
 * @this {MapAdjOfer.prototype} El objeto que implemnta el mapa
 * @private
 */
function load() {

   const options = {},
         nooptions = ["light", "ors", "id", "icon",
                      "unclusterZoom", "centeredZoom", "loading"];

   for(const name in this.options) {
      if(nooptions.indexOf(name) !== -1) continue
      options[name] = this.options[name];
   }

   if(this.options.light) Object.assign(options, iface.contextMenu.map.call(this));

   this.map = L.map(this.options.id, options);
   this.map.zoomControl.setPosition('bottomright');

   Object.defineProperty(this, "tileLayer", {
      value: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
             }),
      enumerable: false,
      configurable: false
   });

   /**
    * Capa donde se agregan las marcas
    * @memberof MapaAdjOfer.prototype
    * @type {L.MarkerClusterGroup}
    */
   this.cluster = new L.MarkerClusterGroup({
      showCoverageOnHover: false,
      // Al llegar a este nivel de zoom se ven todas las marcas.
      disableClusteringAtZoom: this.options.unclusterZoom,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: L.Mutable.utils.noFilteredIconCluster,
   });

   // Como clearLayers, pero no se carga las localidades.
   this.cluster.clearCentros = () => {
      for(const marker of this.cluster.getLayers()) {
         if(marker instanceof this.Centro) this.cluster.removeLayer(marker);
      }
   }

   // Issue #27
   crearAttrEvent.call(this, "origen", "originset");
   crearAttrEvent.call(this, "seleccionado", "markerselect");
   // Fin issue #27

   crearAttrEvent.call(this, "mode", "modeset", "normal"); // Issue #79

   // Aplicación de issue #33: Cambiamos la marca
   // al seleccionarla o deseleccionarla.
   this.on("markerselect", function(e) {
      if(e.oldval) {
         e.oldval.changeData({sel: false});
         e.oldval.refresh();
      }
      if(e.newval) {
         e.newval.changeData({sel: true});
         e.newval.refresh();
      }
   });

   // Al seleccionar/deseleccionar, hay que cambiar los
   // menús contextuales de las marcas implicadas y
   // el del origen (su entrada sobre rutas).
   this.on("markerselect", e => {
      if(!this.options.light) return;
      for(const c of [e.oldval, e.newval]) {
         if(c) {
            c.unbindContextMenu();
            c.bindContextMenu(iface.contextMenu.centro.call(this, c));
         }
      }
      if(this.origen) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
      }
   });

   // Fijar un origen, implica crear una marca sobre
   // el mapa y destruir la antigua.
   this.on("originset", e => {
      if(e.oldval) e.oldval.removeFrom(this.map);
      if(e.newval) e.newval.addTo(this.map);
   });

   if(this.options.ors) {
      /**
       * Objecto de acceso a los servicios de OpenRouteService.
       * @memberof {MapAdjOfer.prototype}
       * @type {ORS}
       */
      this.ors = new ORS(this);
      Object.defineProperty(this, "ors", {writable: false, configurable: false});

      crearAttrEvent.call(this, "contador", "counteradd", 0);

      Object.defineProperties(this, {
         /** @lends MapAdjOfer.prototype */
         "isocronas": {
            get: function() {
               return this.ors.isocronas.areas;
            },
            set: function(value) {
               const old = this.isocronas;
               if(value || value === undefined) {
                  this.ors.isocronas.create(value).then((response) => {
                     if(response || response === undefined) this.contador++;
                     if(response !== null) { 
                        this.fire("isochroneset", {oldval: old, newval: this.isocronas});
                     }
                  });
               }
               else {
                  this.ors.isocronas.remove();
                  this.fire("isochroneset", {oldval: old, newval: this.isocronas});
               }
            },
            enumerable: true,
            configurable: false
         },
         // Issue #46
         "direccion": {
            get: function() {
               return this.ors.geocode.value;
            },
            set: function(value) {  // Cadena con la dirección o coordenadas.
               const old = this.ors.geocode.value;
               if(value) {
                  this.ors.geocode.query(value).then((response) => {
                     if(response !== null) {
                        this.contador++;
                        this.fire("addressset", {oldval: old, newval: value});
                     }
                  });
               }
               else console.warn("No tiene sentido calcular con valor nulo una dirección");
            },
            enumerable: true,
            configurable: false
         },
         // Fin issue #46
         // Issue #47
         "ruta": {
            get: function() {
               return this.ors.ruta.value;
            },
            set: function(destino) {
               const old = this.ruta;
               if(destino) {
                  this.ors.ruta.create(destino).then((response) => {
                     if(response || response === undefined) this.contador++;
                     if(response !== null) { 
                        this.fire("routeset", {oldval: old, newval: this.ruta});
                     }
                  });
               }
               else {
                  this.ors.ruta.remove();
                  this.fire("routeset", {oldval: old, newval: this.ruta});
               }

            },
            enumerable: true,
            configurable: false
         }
         // Fin issue #47
      });
      
      // modifica el menú contextual del origen.
      this.on("isochroneset", e => {
         if(this.options.light && this.origen) {
            this.origen.unbindContextMenu();
            this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
         }
      });

      // Issue #46
      // Asociamos un evento "geocode" al momento en que
      // averiguamos la dirección postal del origen.
      this.on("originset", e => {
         if(!e.newval) return;
         crearAttrEvent.call(e.newval, "postal", "geocode");
         // Incluimos la dirección como title y deshabilitamos
         // la posibilidad de obtenerla a través del menú contextual.
         e.newval.on("geocode", x => {
            e.newval.getElement().setAttribute("title", x.newval);
            if(this.options.light) {
               e.newval.unbindContextMenu();
               e.newval.bindContextMenu(iface.contextMenu.origen.call(this));
            }
         });
      });

      // Elimina la isocrona al fijar un nuevo origen.
      this.on("originset", e => this.setIsocronas(null));
      // Fin issue #46

      // Issue #47
      this.on("routeset", e => {
         if(!this.options.light) return;

         if(e.newval) {
            const destino = e.newval.destino;
            destino.unbindContextMenu();
            destino.bindContextMenu(iface.contextMenu.centro.call(this, destino));
         }
         if(e.oldval) {
            const destino = e.oldval.destino;
            destino.unbindContextMenu();
            destino.bindContextMenu(iface.contextMenu.centro.call(this, destino));
         }
         if(this.origen) {
            this.origen.unbindContextMenu();
            this.origen.bindContextMenu(iface.contextMenu.origen.call(this));
         }
      });
      // Al cambiar de origen, hay que cambiar los menús contextuales de
      // todas las marcas, ya que no tiene sentido la entrada de crear ruta.
      this.on("originset", e => {
         if(this.ruta) this.setRuta(null);

         if(!this.options.light) return;
         for(const c of this.Centro.store) {
            c.unbindContextMenu();
            c.bindContextMenu(iface.contextMenu.centro.call(this, c));
         }
      });
      // Fin issue #47

      // Issue #55
      this.on("routeset", e => {
         if(e.newval) {
            e.newval.destino.once("remove", e => {
               // Al desaparecer el centro, hay ruta y él es el destino.
               if(this.ruta.destino === e.target) {
                  this.setRuta(null);
                  // La ruta se despidió a la francesa; vamos, que se fue
                  // porque desapareció el destino, y no por haberse eliminado.
                  e.target._francesa = true;
               }
            });
            e.newval.destino.once("add", e => {
               // Al volver a aparecer, él sigue siendo el destino
               if(this.ors.ruta.calc.destino === e.target && e.target._francesa) {
                  this.setRuta(e.target);
               }
               delete e.target._francesa;
            });
         }
      });
      // Fin issue #55
   }
}

export default load;
