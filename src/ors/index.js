import popupRuta from "app/interface/popupruta.js";
import loading from "app/interface/popupruta.js";
import Isocronas from "./isochrones.js";
import Geocode from "./geocode.js";
import Ruta from "./route.js";

function ORS(adjofer) {
   const defaults = {
            chunkProgress: true,
            rutaPopup: true
         };

   this.URLBase = "https://api.openrouteservice.org";

   this.espera = [];
   this.espera.remove = function(value) {
      const idx = this.indexOf(value);
      if(idx !== -1) {
         this.splice(idx, 1)
         return true;
      }
      return false;
   }

   this.adjofer = adjofer;

   this.ors = Object.assign({}, defaults, adjofer.options.ors);
   Object.assign(this.ors, {
      chunkProgress: this.ors.chunkProgress && adjofer.progressBar,
      loading: this.ors.loading || adjofer.options.loading && loading,
      rutaPopup: this.ors.rutaPopup && popupRuta
   });

   this.isocronas = new Isocronas(this);
   // Colocamos las isocronas por debajo de 400, para que siempre
   // queden por debajo de otros polígonos y segmentos (como las rutas).
   adjofer.map.createPane("isochronePane").style.zIndex = 390;

   this.ruta = new Ruta(this);
   this.geocode = new Geocode(this);

}

export default ORS;
