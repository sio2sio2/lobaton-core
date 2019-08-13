/**
 * Registra las correcciones disponibles.
 * @this {MapAdjOfer} El objeto que implemnta el mapa
 * @private
 */
export default function() {
   const self = this;

   // Función para determinar si unas condiciones implican otras.
   // Es aplicable a opciones que consisten en un array con valores.
   // Por ejemplo: {bil: ["Inglés", "Francés"]} que implica que se
   // eliminan enseñanzas que cumplan con alguno de los valores. En
   // este caso, bilingües de Inglés o de Francés.
   // Sin tener en cuenta inv, si los elementos antiguos incluyen a
   // todos los nuevos, la corrección antigua incluye a la nueva.
   // Por tanto, debe devolverse verdadero cuando
   // (N=nuevos; y=interseccion; o=unión; A=antiguos):
   //
   // NyA = N
   // !AyN = Vacio
   // !Ny!A = !A
   // Ao!N = Todos
   function applyConInv(attr, todos, oldopts, newopts) {
      if(!oldopts.inv && newopts.inv) {  //A, !N
         const union = [].concat(oldopts[attr]);
         for(const p of newopts[attr]) {
            if(oldopts[attr].indexOf(p) === -1) union.push(p);
         }
         return union.length === todos.length;
      }
      else {
         const inters = [];
         for(const p of newopts[attr]) {
            if(oldopts[attr].indexOf(p) !== -1) inters.push(p);
         }
         if(newopts.inv) return inters.length === oldopts[attr].length;  //!N, !A
         else {
            if(oldopts.inv) return inters.length === 0;  // !A, N
            else return inters.length === newopts[attr].length; // N, A
         }
      }
   }

   // El GeoJSON con carácter informativo incluye el primer año
   // de su extinción una enseñanza ya desaparecida. Debemos
   // eliminarla aplicándole esta corrección atuomáticamente.
   this.Centro.register("extinta", {
      attr: "oferta",
      // opts= {}
      func: function(idx, oferta, opts) {
         return oferta[idx].ext;
      }
   });
   this.on("dataloaded", e => {
      this.Centro.correct("extinta", {});
   });

   // Elimina enseñanzas bilingües
   this.Centro.register("bilingue", {
      attr: "oferta",
      // opts= { bil: ["Inglés", "Francés"] } => Elimina enseñanzas bilingües de inglés y francés.
      func: function(idx, oferta, opts) {
         return !!(opts.inv ^ (opts.bil.indexOf(oferta[idx].idi) !== -1));
      },
      apply: function(oldopts, newopts) {
         // Las enseñanzas que no son bilingües, tiene idi a null.
         return applyConInv("bil", ["Inglés", "Francés", "Alemán", null], oldopts, newopts);
      },
      // Sólo son pertinentes los puestos no bilingües (o sí, si inv=true).
      chain: [{
         corr: "adjpue",
         func: function(opts) {
            const map = {  // TODO: Esto debería sacarse de la base de datos y estar en el geoJSON
               "Francés": 10,
               "Inglés": 11,
               "Alemán": 12
            };
            const cod = Object.keys(map)
                              .filter(idi => opts.bil.indexOf(idi) !== -1)
                              .map(e => map[e]);
            //Puestos a eliminar.
            const puestos = Object.keys(self.general.puestos)
                                  .filter(pue => opts.inv ^ cod.some(c => pue.startsWith(c)));
            return puestos.length>0?{puesto: puestos}:false;
         }
      }]
   });

   // Añade vacantes telefónicas a las adjudicaciones.
   this.Centro.register("vt+", {
      attr: "adj",
      add: true,
      func: function(idx, adj, opts) {
         const data = this.getData(),
               res = [];
         for(const puesto in data.pla) {
            for(let i=0; i<data.pla[puesto].vt; i++) res.push({
               col: "J",
               esc: [0, 0, 0],
               pue: puesto,
               pet: null,
               // TODO:: ¿Qué narices es esto?A Posiblemente CGT.
               per: false,
               ubi: false
            });
         }
         return res;
      }
   });

   // Elimina las adjudicaciones de los puestos suministrados.
   this.Centro.register("adjpue", {
      attr: "adj",
      // opts= {puesto: ["00590059", "11590107"], inv: false}
      func: function(idx, adj, opts) {
         return !!(opts.inv ^ (opts.puesto.indexOf(adj[idx].pue) !== -1));
      },
      apply: function(oldopts, newopts) {
         return applyConInv("puesto", Object.keys(self.general.puestos), oldopts, newopts);
      }
   });

   // Elimina las enseñanzas suministradas
   this.Centro.register("ofens", {
      attr: "oferta",
      // opts= {ens: ["23GMSMR168", "23GSASI820"], inv: false}
      func: function(idx, oferta, opts) {
         return !!(opts.inv ^ (opts.ens.indexOf(oferta[idx].ens) !== -1));
      },
      apply: function(oldopts, newopts) {
         return applyConInv("ens", Object.keys(self.general.ens), oldopts, newopts);
      },
      chain: [{
         corr: "adjpue",
         // Si alguna de las enseñanzas eliminadas, es la única
         // que puede impartir un puesto, entonces debe eliminarse tal puesto.
         func: function(opts) {
            const ens = self.general.ens;
            // Interesan las enseñanzas que no se eliminan.
            if(!opts.inv) opts = {ens: Object.keys(ens).filter(e => opts.ens.indexOf(e) === -1)};

            // Puestos impartidos exclusivamente por las enseñanzas eliminadas.
            const pue = [];
            for(let p of self.general.puestos) {
               let impartido = false;
               for(let e of opts.ens) {
                  if(ens[e].puestos.indexOf(p) !== -1) {
                     impartido = true;
                     break;
                  }
               }
               if(!impartido) pue.push(p);
            }

            return pue.length?{puesto: pue}:false;
         }
      }]
   });

   // Elimina adjudicaciones no telefónicas.
   this.Centro.register("vt", {
      attr: "adj",
      // Las peticiones telefónicas son las que tiene pet=null
      func: (idx, adj, opts) => adj[idx].pet !== null
   });

   // Elimina adjudicaciones que no responden a vacantes iniciales.
   this.Centro.register("vi", {
      attr: "adj",
      // opts= {}
      func: function(idx, adj, opts) {
         const puesto = adj[idx].pue,
               vi = this.getData().pla[puesto].vi;
         let i, num = 0;
         for(i=0; i<=idx; i++) {
            if(adj[i].pue === puesto) num++;
         }
         return i>vi;
      }
   });

   // Elimina las enseñanzas no deseables.
   /*
   this.Centro.register("deseable", {
      attr: "oferta",
      func: (idx, oferta, opts) => !oferta[idx].mar
   });
   */
   // Esta implementación alternativa tiene la ventaja
   // de que está expresada en términos de enseñanzas (ofens).
   this.Centro.register("deseable", {
      attr: "oferta",
      autochain: true,
      func: opts => false,
      chain: [{
         corr: "ofens",
         func: function(opts) {
            // Hay que montar este cirio, porque la característica mar (deseable)
            // aparece en las enseñanzas de centro, pero no en la relación general
            // de enseñanzas. Debería corregirse el geojson.
            const indeseables = [];
            for(const ens in self.general.ens) {
               for(const c of this.store) {
                  let found = false;
                  for(const o of c.getData().oferta) {
                     if(o.ens === ens) {
                        found = true;
                        if(!o.mar) indeseables.push(ens);
                        break;
                     }
                  }
                  if(found) break;
               }
            }
            return indeseables.length?{ens: indeseables}:false;
         }
      }]
   });

   // Elimina las enseñanzas que sean del turno indicado.
   this.Centro.register("turno", {
      attr: "oferta",
      // opts= {turno: 1, inv: true}  => 1: mañana, 2: tarde
      func: function(idx, oferta, opts) {
         if(oferta[idx].tur === null) return false; // Semipresenciales
         const map = {
            "matutino": 1,
            "vespertino": 2,
            "ambos": 3
         }
         // ESO y BAC no tiene turno,
         // pero si es enseñanza de adultos es por la tarde.
         const turno = map[oferta[idx].tur || (oferta[idx].adu?"vespertino":"matutino")];

         return !(opts.inv ^ !(turno & opts.turno));
      }
   });

   // Función para comprobar el adjudicatario de referencia.
   function adjref(idx, adj, opts) {
      // Pasa el tiempo de servicio a un pseudoescalafon:
      // Debe cumplir que a mayor tiempo de servicio, menor escalafón.
      function ts2esc(ts) {
         const hoy = new Date();

         return hoy.getFullYear() +
                String(hoy.getMonth()).padStart(2, "0") +
                String(hoy.getDate()).padStart(2, "0") -
                ts.map(e => String(e).padStart(2, "0")).join("");
      }

      // Calcula un escalafón intercolectivo. Está constituido por la
      // concatenación de:
      // - Una primera parte que identifica la prioridad del colectivo.
      //   (1, el más prioritario; 2 el segundo, etc.)
      // - Un escalafón que se calcula del siguiente modo:
      //     + El propio escalafón, si es un func. de carrera que no ha
      //       cogido nunca excedencia.
      //     + Para interinos, funcionarios sin escalafón o funcionarios
      //       que en algún momento cogieron excedencia, un
      //       escalafón obtenido con ts2esc().
      function escEquiv(opts) {
         let esc = opts.esc,
             ts = opts.ts,
             col = String(self.general.colectivos[opts.col].o);

         // TODO: En el geojson los interinos deberían tener su ts
         // en la propiedad ts; y los funcionarios tener un esc y un ts.
         if(opts.col === "J") {
            if(esc && esc.length) {  // Precaución: los interinos tiene ts en esc.
               ts = esc;
               esc = undefined;
            }
         }
         else if(ts !== undefined) {  // Func. de carrera con dato de ts.
            const aa = (new Date()).getFullYear() - esc.substring(0, 4) - 1;
            // Esto significa que nunca ha cogido excendencia
            if(aa === ts[0]) ts = undefined;
         }

         if(ts !== undefined) esc = ts2esc(ts);

         return Number(col + esc);
      }

      if(!opts.hasOwnProperty("_ref")) opts._ref = escEquiv(opts);
      return escEquiv(adj[idx]) < opts._ref;
   }

   // Elimina las adjudicaciones que sean más prioritarias
   // que el adjudicatario de referencia que se defina.
   this.Centro.register("adjref", {
      attr: "adj",
      // opts= {ts: [10, 3, 22], esc: 20104120, col: "DB"}
      // ts=tiempo-servicio (aa-mm-dd), esc=escalafon, col=colectivo
      func: adjref
   });

   // Elimina enseñanzas que no sean nuevas
   this.Centro.register("nueva", {
      attr: "oferta",
      func: function(idx, oferta, opts) {
         return oferta[idx].nue === 0;
      }
   });

}
