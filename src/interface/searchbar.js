// Issue #51
function searchBar() {
   // CodidoProvincial: Nombre del instituto
   const label = (d) => `${String(d.id.cp).substring(0,2)}: ${d.id.nom}`;

   const control = new L.Control.Search({
      position: "topright",
      textPlaceholder: "Busque por nombre",
      textErr: "No encontrado",
      initial: false,
      // Así nos aseguramos que se ve la marca seleccionada.
      zoom: this.cluster.options.disableClusteringAtZoom,
      marker: false,
      minLength: 3,
      sourceData: (text, callback) => {
         callback(this.cluster.getLayers().map(m => {
            const data = m.getData();
            return {
               title: label(data),
               loc: m.getLatLng()
            }
         }));

         return { abort: function() {}}
      },
      filterData: (text, records)  => {
         const ret = {},
         pathData = this.Centro.prototype.options.mutable,
         coincidentes = new Fuse(
            this.cluster.getLayers(), {
               keys: [pathData + ".id.nom"],
               minMatchCharLength: 2,
            }).search(text);

         for(const idx in coincidentes) {
            const data = coincidentes[idx].getData(),
                  title = label(data),
                  centro = records[title];

            if(!centro) continue;

            ret[title] = centro;
            // Encchufamos la marca del centro para tenerla
            // disponible en el evento search:locationfound.
            centro.layer = coincidentes[idx];
         }

         return ret;
      }
   });

   control.on("search:locationfound", e => {
      this.seleccionado = e.layer;
      control.collapse();
   });

   return control;
}
// Fin issue #51

export default searchBar;
