import {getPath} from "app/utils/misc.js";
import "./images/solicitud.svg";

// Definición del icono de solicitud
const converter = new L.utils.Converter(["peticion", "sel"])
                             .define("peticion")
                             .define("sel");

function updater(o) {
   var text = this.querySelector("text");
   if(o.peticion !== undefined) {
      text.textContent = o.peticion;
      var size = (o.peticion.toString().length > 2)?28:32;
      text.setAttribute("font-size", size);
   }

   if(o.sel !== undefined) {
      const content = this.querySelector(".content"),
            defs    = this.querySelector("defs");
      let   e       = content.querySelector(".selected");
      if(!o.sel) {
         if(e) defs.appendChild(e);
      }
      else if(!e) {
         e = defs.querySelector(".selected");
         content.prepend(e);
      }
   }
   return this;
}

const url = getPath("images/solicitud.svg");

export {converter, url, updater}
