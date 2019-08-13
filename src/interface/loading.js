import {getPath} from "app/utils/misc.js";
import "./images/ajax-loader.gif";

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
      img.setAttribute("src", getPath("images/ajax-loader.gif"));
      loading.appendChild(img);
   }
}

export default ajaxGif;
