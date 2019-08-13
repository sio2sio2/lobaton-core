/**
 * Registra los filtros definidos para este tipo de mapa.
 * @this {MapAdjOfer} El objeto que implemnta el mapa
 * @private
 */
export default function() {
   // Filtra según cantidad de adjudicaciones.
   this.Centro.registerF("adj", {
      attrs: "adj",
      // opts= {min: 0, inv: false}
      func: function(opts) {
          return !!(opts.inv ^ this.getData().adj.length < opts.min);
      }
   });

   // Filtra según número de enseñanzas.
   this.Centro.registerF("oferta", {
      attrs: "oferta",
      // opts= {min: 0, inv: false}
      func: function(opts) {
          return !!(opts.inv ^ this.getData().oferta.length < opts.min);
      }
   });

   // Elimina los tipos facilitados
   this.Centro.registerF("tipo", {
      attrs: "mod.dif",
      // opts= {tipo: 1, inv: false}  //tipo: 1=normal 2=compensatoria, 4=difícil desempeño
      func: function(opts) {
         const map  = { "compensatoria": 2, "dificil": 4 },
               tipo = map[this.getData().mod.dif] || 1;

         return !!(opts.inv ^ !!(tipo & opts.tipo));
      }
   });

   // Elimina los centros que tengan alguna enseñanza del turno suministrado.
   this.Centro.registerF("turno", {
      attrs: "oferta",
      // opts= {turno: 1}  => 1: mañana, 2: tarde.
      func: function(opts) {
         const map = {
            "matutino": 1,
            "vespertino": 2,
            "ambos": 3
         }
         for(const ens of this.getData().oferta.correctable) {
            if(ens.filters.length > 0) continue; // Está filtrado.
            if(ens.tur === null) continue;  // Semipresenciales.
            const turno = map[ens.tur || (ens.adu?"vespertino":"matutino")];
            if(turno & opts.turno) return true;
         }
         return false;
      }
   });

   // Elimina las marcas que se hallen fuera del área
   this.Centro.registerF("lejos", {
      attrs: "no.existe",
      // opts={area: geojson}
      func: function(opts) {
         const latlng = this.getLatLng(),
               point = {
                  type: "Feature",
                  geometry: {
                     type: "Point",
                     coordinates: [latlng.lng, latlng.lat]
                  }
               }

         return !turf.booleanPointInPolygon(point, opts.area);
      }
   });

   // Al eliminar las isocronas, desaplicamos el filtro lejos.
   this.on("isochroneset", e => {
      if(!e.newval && this.Centro.hasFilter("lejos")) {
         this.Centro.unfilter("lejos");
         this.Centro.invoke("refresh");
      }
   });
}
