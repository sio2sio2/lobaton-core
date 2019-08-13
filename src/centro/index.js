import createCorrections from "./corrections.js";
import createFilters from "./filters.js";
import catalogo from "./icons/index.js";

/**
* Crea la clase de marca para los centros y le
* añade las correcciones y filtros definidos para ella.
* @this {MapAdjOfer} El objeto que implemnta el mapa
* @private
*/
function create() {
   /**
   * Clase de marca para los centros educativos.
   * @memberof MapAdjOfer.prototype
   * @type {Marker}
   */
   this.Centro = L.Marker.Mutable.extend({
      statics: {
         /**
          * Obtiene la marca de un centro a partir de su código.
          * @param {String|Number} codigo  El código del centro.
          * @returns {L.Marker} La marca del centro cuyo código es el suministrado.
          */
         get: function(codigo) {
            if(typeof codigo === "string" && codigo.endsWith("C")) codigo = codigo.slice(0, -1);
            for(const c of this.store) {
               if(c.getData().id.cod == codigo) return c;
            }
         }
      },
      options: {
         mutable: "feature.properties",
         filter: this.cluster,
      }
   });

   createCorrections.call(this);
   createFilters.call(this);
}

export {create, catalogo}
