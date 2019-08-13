export default function(n, total, lapso) {
   const map = L.DomUtil.get("map"),
         progress = L.DomUtil.get("leaflet-progress") || 
                    L.DomUtil.create("progress", "leaflet-message leaflet-control", map);
   progress.id = "leaflet-progress";
   progress.setAttribute("value", n/total);
   if(n === total) setTimeout(() => L.DomUtil.remove(progress), 500);
}
