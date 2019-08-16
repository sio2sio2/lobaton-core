import {getPath} from "app/utils/misc.js";
import loader from "./images/ajax-loader.gif";

// tipo: isocronas, geocode, ruta.
function ajaxGif(tipo) {
   let loading;
   
   if(loading = L.DomUtil.get("leaflet-loading")) {
      L.DomUtil.remove(loading);
   }
   else {
      loading = L.DomUtil.create("div", "leaflet-message leaflet-control", 
                                 L.DomUtil.get("map"));
      loading.id = "leaflet-loading";
      const img = document.createElement("img");
      img.setAttribute("src", getPath(loader));
      loading.appendChild(img);
   }
}

export default ajaxGif;
