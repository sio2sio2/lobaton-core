function failback(xhr) {
   const response = JSON.parse(xhr.responseText);
   console.error("Error " + response.error.code + ": " + response.error.message);
}

function mismoPunto(x, y) {
   if(x === null || y === null) return false;
   if(x.getLatLng) x = x.getLatLng();
   if(y.getLatLng) y = y.getLatLng();
   return x.lat === y.lat && x.lng === y.lng;
}

export {failback, mismoPunto}
