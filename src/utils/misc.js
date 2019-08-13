import url from "url";

// Issue #27
/**
 * Crea una propiedad a la que se asocia un tipo de evento,
 * de manera que cuando se le da valor a la propiedad se lanzan
 * las acciones asociadas al evento *on*, y cuando se da valor null
 * se lanzan las acciones asociadas al evento *off*.
 *
 * @this El objeto al que se asocia el atributo.
 * @param {String} attr  El nombre del atributo que se creará.
 * @param {String} tipo  Nombre del tipo.
 * @param {*}  value     Valor inicial
 */
function crearAttrEvent(attr, tipo, value=null) {
   if(this.fire === undefined) throw new Error("El objeto no puede lanzar eventos");

   addDescriptor(this, "_" + attr, value, true);
   Object.defineProperty(this, attr, {
      get: function() { return this["_" + attr]; },
      set: function(value) {
         const old = this[attr];
         this["_" + attr] = value;
         this.fire(tipo, {oldval: old, newval: value});
      },
      configurable: false,
      enumerable: true
   });
}
// Fin issue #27;


/**
 * Define una propiedad mediante un descriptor que no configurable ni enumerable.
 *
 * @param {Object} obj        Objeto en el que se define el descritor
 * @param {String}  name      Nombre de la propiedad
 * @param {Boolean} writable  Define si es o no escribible.
 */
export function addDescriptor(obj, name, value, writable) {
   Object.defineProperty(obj, name, {
      value: value,
      writable: !!writable,
      enumerable: false,
      configurable: false
   });
}


// Obtiene una gama de colores RGB distinguibles entre sí.
// En principio, si se desea obtener 4 colores, habrá que pasar:
// como ratio 1/4, 2/4, 3/4 y 4/4.
function HSLtoRGB(h, s, l) {
   s = s || .65;
   l = l || .45;

   var r, g, b;

   if(s == 0){
      r = g = b = l;
   }
   else {
      function hue2rgb(p, q, t) {
         if(t < 0) t += 1;
         if(t > 1) t -= 1;
         if(t < 1/6) return p + (q - p) * 6 * t;
         if(t < 1/2) return q;
         if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
         return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
   }

   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


// Convierte un array de tres enteros (RGB) en notación hexadecimal.
function rgb2hex(rgb) {
   return "#" + rgb.map(dec => ("0" + dec.toString(16)).slice(-2)).join("");
}


function normalizeCodigo(centro) {
   if(centro instanceof L.Marker.Mutable) {
      return centro.getData().codigo;
   }

   centro = centro.toString();
   let ret;

   // Ya era un código normalizado.
   const last = centro.charAt(centro.length-1);
   switch(last) {
      case "C":
         ret = centro.padStart(9, "0");
         break;

      case "L":
         ret = centro.padStart(10, "0");
         break;

      default:
         switch(centro.length) {
            case 7:  // Es con seguridad un centro
               ret = (centro + "C").padStart(9, "0");
               break;

            case 9:  // Es con seguridad una localidad
               ret = (centro + "L").padStart(10, "0");
               break;

            case 8:
               // Es un centro a menos que empiece por 41,
               // en cuyo caso puede ser una localidad de Almería
               // o un centro de Sevilla.
               if(!centro.startsWith("41")) {
                  ret = (centro + "C").padStart(9, "0");
               }
               else {
                  // Si hay una localidad con ese código, resolvemos
                  // que es la localidad y, si no, suponemos un centro.
                  ret = this.adjofer.Localidad.get(centro);
                  ret = ret?`0${centro}L`:`${centro}C`;
               }
               break;

            default:
               return null;
         }
   }
   return ret;

}


const scriptPath = document.currentScript;

/**
 * Obtiene la ruta absoluta de un recurso cuya ruta relativa
 * se proporcionó respecto a la ruta absoluta de otro. Se
 * sobreentiende que se proporciona el recurso y no el directorio
 * que contiene el recurso. O sea, http://example.com/index.html
 * y no http://example.com
 *
 * @param {String} resource  Ruta relativa de otro recurso
 *    respecto al primero
 * @param {String} script    Ruta absoluta de un recurso. Si
 * no se especifica es la ruta de este mismo script.
 *
 * @returns {String} Ruta absoluta del segundo recurso.
 */
function getPath(resource, script) {
   script = script || scriptPath.src;
   script = script.slice(0, script.lastIndexOf("/"));
   return url.resolve(script, resource);
}


export {crearAttrEvent, HSLtoRGB, rgb2hex, normalizeCodigo, getPath}
