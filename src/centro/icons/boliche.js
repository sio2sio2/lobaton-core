import {getPath, rgb2hex, HSLtoRGB} from "app/utils/misc.js";
import "./images/boliche.svg";

// Definición del icono de centro
const converter = new L.utils.Converter(["numvac", "tipo", "numofer", "bil", "ofervar", "sel"])
                             .define("tipo", "mod.dif", t => t || "normal")
                             .define("numvac", "adj", a => a.length)
                             .define("ofervar", "mod.cam", c => c || 0)
                             .define("sel");

// Para calcular la cantidad de oferta se considera
// 1 una enseñanza deseable y 1/3 una que no lo es.
converter.define("numofer", "oferta", function(oferta) {
   let res = 0;
   for(const ens of oferta) {
      if(ens.filters.length>0) continue
      res += ens.mar?3:1;
   }
   return Math.round(res/3);
});

converter.define("bil", "oferta", function(oferta) {
   // Array.from(oferta) y no oferta, para usar el iterador y tener disponible "filters".
   const idiomas = Array.from(oferta).map(ens => ens.filters.length===0 && ens.idi)
                                            // Eliminamos valores nulos y valores repetidos.
                                            .filter((idi, i, arr) => idi && arr.indexOf(idi) === i)

   switch(idiomas.length) {
      case 0:
         return null;
         break;
      case 1:
         return idiomas[0];
         break;
      default:
         return "multi";
   }
});

const updater = (function(o) {
   const paletaOferta = new Array(5).fill(null);
   const paletaPlazas = new Array(7).fill(null);

   // Devuelve blanco o negro dependiendo de cuál contraste mejor con el
   // color RGB suministrado como argumento
   function blancoNegro(rgb) {
      var y = 2.2;

      return (0.2126*Math.pow(rgb[0]/255, y) + 0.7152*Math.pow(rgb[1]/255, y) + 0.0722*Math.pow(rgb[2]/255, y) > Math.pow(0.5, y))?"#000":"#fff";
   }

   paletaOferta[0] = "black";
   for(let i=1; i < paletaOferta.length; i++) {
      paletaOferta[i] = rgb2hex(HSLtoRGB(i/(paletaOferta.length-1)));
   }

   var tintaPlazas = new Array(paletaPlazas).fill(null);
   paletaPlazas[0] = tintaPlazas[0] = "black";
   for(let i=1; i < paletaPlazas.length; i++) {
      let color = HSLtoRGB(i/(paletaPlazas.length-1));
      paletaPlazas[i] = rgb2hex(color);
      tintaPlazas[i] = blancoNegro(color);
   }

   function updater(o) {
      const defs = this.querySelector("defs");
      const content = this.querySelector(".content");

      var e = this.querySelector(".ofervac");
      if(o.numofer !== undefined) {
         let x = e.querySelector("circle");
         x.setAttribute("fill", paletaOferta[Math.min(paletaOferta.length-1, o.numofer)]);
      }

      if(o.numvac !== undefined) {
         let i = Math.min(paletaPlazas.length-1, o.numvac);
         e = e.querySelector("path");
         e.setAttribute("fill", paletaPlazas[i]);
         e = e.nextElementSibling;
         e.textContent = o.numvac;
         e.setAttribute("fill", tintaPlazas[i]);
      }

      if(o.ofervar !== undefined) {
         e = this.querySelector(".ofervar");
         if(!o.ofervar) e.setAttribute("display", "none");
         else {
            e.removeAttribute("display");
            e = e.firstElementChild.nextElementSibling;
            if(o.ofervar > 0) e.removeAttribute("display");
            else e.setAttribute("display", "none");
         }
      }

      if(o.bil !== undefined) {
         e = content.querySelector(".bil");
         if(e) defs.appendChild(e);
         if(o.bil !== null) content.appendChild(defs.querySelector(".bil." + o.bil));
      }

      if(o.tipo !== undefined) {
         e = content.querySelector(".tipo");
         if(o.tipo === "normal") {
            if(e) defs.appendChild(e);
         }
         else {
            if(!e) {
               e = defs.querySelector(".tipo");
               content.appendChild(e);
            }
            if(o.tipo === "dificil") e.setAttribute("fill", "#c13");
            else e.setAttribute("fill", "#13b"); 
         }
      }

      if(o.sel !== undefined) {
         e = content.querySelector(".selected");
         if(!o.sel) {
            if(e) defs.appendChild(e);
         }
         else if(!e) {
            e = defs.querySelector(".selected");
            content.prepend(e);
         }
      }
   }

   return updater;
})();

const url = getPath("images/boliche.svg");

export {converter, url, updater}
