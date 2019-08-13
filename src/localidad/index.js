import icono from "./icon.js"

// Issue #79, #83
/**
 * Crea la capa con las localidades
 */
function create() {

   /**
    * Capa para almacenar las localidades.
    * @memberof MadAdjOfer.prototype
    * @type {L.GeoJSON}
    *
    */
   const localidades = L.geoJSON(undefined, {
      pointToLayer: (f, p) => {
         const localidad = new this.Localidad(p, {
            icon: new Icono(),
            title: f.properties.nom
         });
         localidad.on("dataset", e => {
            e.target.changeData({peticion: 0});
            Object.defineProperty(e.target.getData(), "codigo", {
               get: function() {
                  return this.cod.toString().padStart(9, "0") + "L";
               }
            });
         });
         if(this.options.light) localidad.once("dataset", e => {
            e.target.on("click", e => {
               if(this.options.light && this.mode === "solicitud") {
                  this.fire("requestclick", {marker: e.target});
               }
            });
         });
         return localidad;
      }
   });

   /**
    * Marca para localidad
    * @memberof MadAdjOfer.prototype
    * @type {Marker}
    */
   this.Localidad = L.Marker.Mutable.extend({
      statics: {
         get: function(cod) {
            if(typeof cod === "string" && cod.endsWith("L")) cod = cod.slice(0, -1);
            for(const loc of this.store) {
               if(loc.getData().cod == cod) return loc;
            }
            return null;
         }
      },
      options: {
         mutable: "feature.properties",
         filter: this.cluster,
      }
   });

   // Filtro indiscriminado: sirve para ocultar de inicio las localidades.
   this.Localidad.registerF("invisible", {
      attrs: [],
      func: function(opts) {
         return true;
      }
   });

   
   // Las localidades, por defecto, no se ven.
   this.on("statusset", e => {
      if(!e.status) this.Localidad.filter("invisible", {});
   });

   // Como el de centro: filtra las localidades solicitadas.
   this.Localidad.registerF("solicitado", {
      attrs: "peticion",
      func: function(opts) {
         return !!(opts.inv ^ (this.getData().peticion > 0))
      }
   });

   const Icono = icono;

   if(!this.options.pathLoc) {
      console.error("No pueden cargarse las localidades");
      return;
   }


   // Elimina los municipios de los que no se sabe el código
   // y la declaración de la provincia de las propiedades
   function limpiaDatos(data) {
      data.features = data.features.filter(f => !!f.properties.cod);
      data.features.forEach(f => delete f.properties.pro);
   }


   Icono.onready(() => {
      L.utils.load({
         url: this.options.pathLoc,
         callback: xhr => {
            const data = JSON.parse(xhr.responseText);
            limpiaDatos(data);
            localidades.addData(data);
            this.cluster.addLayer(localidades);
            this.Localidad.invoke("refresh");  // Por alguna extraña razón, a veces se ven
            this.fire("locloaded");
         },
         failback: xhr => console.error("No pueden cargarse los datos de localidad"),
      });
   });
}
// Fin issue #79, #83

export default create;
