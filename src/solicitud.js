// Issue #79
// Módulo para gestionar las solicitudes de centro.

import {normalizeCodigo} from "app/utils/misc.js";

/**
 * centros debe ser la propiedad donde se almacenan los centros
 * y localidades la propiedad donde se almacenan localidades,
 * Puede usarse la notación de punto.
 */
function Solicitud(adjofer) {
   Object.defineProperties(this, {
      store: {
         value: [],
         writable: false,
         enumerable: false,
         configurable: false,
      },
      adjofer: {
         value: adjofer,
         writable: false,
         enumerable: false,
         configurable: false
      },
      BolicheIcono: {
         value: adjofer.getIcon("boliche"),
         writable: false,
         enumerable: true,
         configurable: false
      },
      SolicitudIcono: {
         value: adjofer.getIcon("solicitud"),
         writable: false,
         enumerable: true,
         configurable: false
      }
   });

   // Define un filtro para eliminar centros seleccionados
   adjofer.Centro.registerF("solicitado", {
      attrs: "peticion",
      // opts= {inv: false}  // Si inv=true, elimina los no seleccionados.
      func: function(opts) {
         return !!(opts.inv ^ (this.getData().peticion > 0))
      }
   });

   // Al cargar datos cambian las marcas de centro,
   // pero queremos conservar la lista de peticiones,
   // así que recostruimos "store" a partir de la lista
   // de "status" y dejamos el código, si el centro no existe.
   adjofer.on("dataloaded", e => {
      this.store.length = 0;
      if(!e.target.status.list) return;
      for(let i=0; i<e.target.status.list.length; i++) {
         const cod = e.target.status.list[i];
         if(cod instanceof L.Marker.Mutable) continue;

         const tipo = cod.endsWith("L")?"Localidad":"Centro",
               entidad = e.target[tipo].get(cod);

         if(entidad) {
            this.store[i] = entidad;
            entidad.changeData({peticion: i+1});
            e.target.fire("requestset", {marker: entidad, oldval: 0, newval: i+1});
         }
         else this.store[i] = cod;
      }
   });

   adjofer.on("locloaded", e => {
      if(!e.target.status.list) return;
      for(let i=0; i<e.target.status.list.length; i++) {
         const cod = e.target.status.list[i];
         if(cod instanceof L.Marker && cod.endsWith("C")) continue;

         const localidad = e.target.Localidad.get(cod);
         if(localidad) {
            this.store[i] = localidad;
            localidad.changeData({peticion: i});
         }
         else this.store[i] = cod;
      }
   });
}

Object.defineProperties(Solicitud.prototype, {
   centros: {
      get: function() {
         return this.adjofer.Centro.store;
      },
      enumerable: false,
      configurable: false,
   },
   localidades: {
      get: function() {
         return this.adjofer.localidades.getLayers();
      },
      enumerable: false,
      configurable: false,
   },
   list: {
      get: function() {
         return this.store.map(normalizeCodigo.bind(this));
      },
      enumerable: true,
      configurable: false
   }
});


// Obtiene la marca de un centro o una localidad a partir del código.
function getMarker(centro) {
   if(centro instanceof L.Marker) return centro;

   centro = normalizeCodigo.call(this, centro);
   if(!centro) return null;

   const last = centro.charAt(centro.length-1);
   return last === "C"?this.adjofer.Centro.get(centro):
                       this.adjofer.Localidad.get(centro);
}

/**
 * Devuelve cuál es el centro que ocupa la petición N. null, si no
 * ocupa ninguna petición.
 */
Solicitud.prototype.getCentro = function(position) {
   return this.store[position - 1] || null;
}

/**
 * Devuelve qué petición ocupa el centro. 0, si no está pedido.
 */
Solicitud.prototype.getPosition = function(centro) {
   centro = getMarker.call(this, centro);
   if(!centro) return 0;

   for(let i=0; i<this.store.length; i++) {
      if(this.store[i] === centro) return i+1;
   }
   return 0;
}


/**
 * Añade un centro al final de la lista de peticiones.
 * @param {L.Marker|Number|String} centro El centro a añadir.
 *
 * @returns {L.Marker} El propio centro si se añadió, o null
 * si no se hizo.
 */
Solicitud.prototype.add = function(centro) {
   centro = getMarker.call(this, centro);
   if(!centro || this.getPosition(centro)) return null;

   this.store.push(centro);
   centro.changeData({peticion: this.store.length});
   this.adjofer.fire("requestset", {
      marker: centro,
      oldval: 0,
      newval: this.store.length
   });
   this.adjofer.fire("requestchange", {markers: [centro]});
   return centro;
}


function actualiza(pos1, pos2) {
   pos2 = pos2 || this.store.length;
   for(let i=pos1 - 1; i < pos2; i++) {
      const centro = this.store[i];

      if(centro instanceof L.Marker.Mutable) {
         const pos = centro.getData().peticion;
         centro.changeData({peticion: i+1});
         this.adjofer.fire("requestset", {
            marker: centro,
            oldval: pos,
            newval: i+1
         });
      }
   }
   return this.store.slice(pos1 - 1, pos2);
}

/**
 * Elimina uno o varios centros por su posición en la lista.
 * @param {Number} pos  Posición a partir de la cuál se eliminarán centros.
 * @param {Number} cuantos  Cuantos centros se quieren borrar. Si no
 * se especifican, se borran todos hasta el final.
 *
 * @returns Array  Un array con los centros afectados.
 */
Solicitud.prototype.delete = function(pos, cuantos) {
   if(pos<1 || pos>this.store.length) return [];

   const restantes = this.store.length - pos + 1;
   if(cuantos === undefined || cuantos > restantes) cuantos = restantes;
   const eliminados = this.store.splice(pos-1, cuantos);
   for(const centro of eliminados) {
      if(!(centro instanceof L.Marker.Mutable)) continue;

      const pos = centro.getData().peticion;
      centro.changeData({peticion: 0});
      this.adjofer.fire("requestset", {
         marker: centro,
         oldval: pos,
         newval: 0
      });
   }
   const actualizados = actualiza.call(this, pos),
         ret = eliminados.concat(actualizados);

   this.adjofer.fire("requestchange", {markers: ret});
   return ret
}

/**
 * Elimina un centro de la lista de peticiones.
 * @param {L.Marker|Number|String} centro El centro a añadir.
 * 
 * @returns Array  Un array con los centros afectados.
 */
Solicitud.prototype.remove = function(centro) {
   centro = getMarker.call(this, centro);
   if(!centro) return [];
   const pos = this.getPosition(centro),
         ret = pos > 0?this.delete(pos, 1):[];

   return ret;
}


/**
 * Inserta un centro en la posición indicada de la lista de peticiones.
 * @param {L.Marker|Number|String} centro El centro a añadir.
 * @param Number pos  La posición que debe ocupar en la lista.
 * 
 * @returns Array  Un array con los centros afectados.
 */
Solicitud.prototype.insert = function(centro, pos) {
   centro = getMarker.call(this, centro);
   if(!centro || this.getPosition(centro)) return [];

   this.store.splice(pos - 1, 0, centro);
   const ret = actualiza.call(this, pos);

   this.adjofer.fire("requestchange", {markers: ret});
   return ret;
}


/**
 * Mueve de una posición a otra de la lista un número determinado de centros.
 */
Solicitud.prototype.move = function(pos1, pos2, cuantos) {
   pos2 = Math.max(pos2, 1);
   pos2 = Math.min(pos2, this.store.length + 1);

   const restantes = this.store.length - pos1 + 1;
   if(cuantos === undefined || cuantos > restantes) cuantos = restantes;

   const incr = pos2 - pos1,
         tam = this.store.length;
         

   let ret;
   if(incr < 0) { // El bloque de movidos sube en la lista.
      const movidos = this.store.splice(pos1 - 1, cuantos);
      Array.prototype.splice.apply(this.store, [pos2 - 1, 0].concat(movidos));
      ret = actualiza.call(this, pos2, pos1 + cuantos - 1);
   }
   else {
      const pos_f = pos2 - cuantos;
      if(pos_f <= pos1) return [];

      const movidos = this.store.splice(pos1 - 1, cuantos);
      Array.prototype.splice.apply(this.store, [pos_f - 1, 0].concat(movidos));
      ret = actualiza.call(this, pos1, pos2 - 1);
   }

   this.adjofer.fire("requestchange", {markers: ret});
   return ret;
}
// Fin issue #79

export default Solicitud;
