import {getPath} from "app/utils/misc.js";
import svg from "./images/localidad.svg";

const converter = new L.Mutable.utils.Converter(["peticion"])
                                     .define("peticion");

function updater(o) {
   if(o.peticion === undefined) return;
   const text = this.querySelector("text"),
         textInDefs = this.querySelector("defs").querySelector("text");

   text.textContent = o.peticion;
   if(o.peticion > 0) {
      if(textInDefs) this.querySelector("defs").parentNode.appendChild(text);
      if(o.peticion > 99) {
         text.setAttribute("y", "235");
         text.setAttribute("font-size", "180");
      }
      else {
         text.setAttribute("y", "265");
         text.setAttribute("font-size", "230");
      }
   }
   else if(!textInDefs) this.querySelector("defs").appendChild(text);
   
   const color = o.peticion === 0?"#0ae":"#d70"
   this.querySelector("path").setAttribute("fill", color);
}

export default L.Mutable.utils.createMutableIconClass("localidad", {
   iconSize: [26, 40],
   iconAnchor: [13, 39.43],
   url: getPath(svg),
   converter: converter,
   updater: updater
});
