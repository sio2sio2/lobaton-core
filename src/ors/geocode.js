import {addDescriptor} from "app/utils/misc.js"

// Issue #46
function Geocode(ORS, opts) {
   const defaults = {
      "boundary.country": "ES"  // Restringimos las búsquedas a España.
   }

   this.url = ORS.URLBase + "/geocode";
   this.ORS = ORS;
   this.options = Object.assign({api_key: ORS.ors.key}, defaults);
   this.setOptions(opts);

   addDescriptor(this, "value", false, true);
}

Geocode.prototype.setOptions = function(opts) {
   Object.assign(this.options, opts);
}

/**
 * Realiza la consulta de geocodificación de manera que obtiene
 * unas coordenadas si se introduce una dirección o una dirección
 * si se introducen unas coordenadas.
 *
 * @param {String, L.LatLng} data  Los datos de la consulta.
 *
 */
Geocode.prototype.query = async function(data) {
   return new Promise((resolve, reject) => {
      if(this.value === null) {
         resolve(null);
         return;
      }

      this.value = null;
      this.ORS.espera.push("geocode");

      if(this.ORS.ors.loading) this.ORS.ors.loading("geocodificacion");

      let furl, params;
      if(typeof data === "string") { // Es una dirección.
         furl = this.url + "/search";
         params = Object.assign({text: data}, this.options);
      }
      else {  // Es una coordenada.
         furl = this.url + "/reverse";
         params = Object.assign({"point.lon": data.lng, "point.lat": data.lat}, this.options);
      }

      L.utils.load({
         url: furl,
         method: "GET",
         params: params,
         callback: xhr => {
            if(this.ORS.ors.loading) this.ORS.ors.loading("geocode");
            const response = JSON.parse(xhr.responseText),
                  parser = typeof data === "string"?obtenerCoordenadas:obtenerDireccion;
            this.value = parser(response, data);
            this,ORS.espera.remove("geocode");
            resolve(true);
         },
         failback: xhr => {
            if(this.ORS.ors.loading) this.ORS.ors.loading("geocode");
            failback(xhr);
            this.value = JSON.parse(xhr.responseText).error;
            this,ORS.espera.remove("geocode");
            resolve(undefined);
         }
      });
   });
}

// TODO:: La obtención de direcciones habría que estudiarla bien.
function obtenerDireccion(data) {
   return data.features.length === 0?"Dirección desconocida":data.features[0].properties.label;
}

function obtenerCoordenadas(data, search) {
   if(data.features.length === 0) {
      console.error(`Imposible localizar '${search}'`);
      return null;
   }

   return data.features;
}
// Fin issue #46

export default Geocode;
