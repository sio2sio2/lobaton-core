// status: Issues #57 y #62.

function getOpts(status) {
   status = JSON.parse(atob(status));

   const ret = {
      zoom: status.zoo,
      center: status.cen
   }
   delete status.zoo;
   delete status.cen;
   ret.status = status;

   return ret;
}


// Issue #62
/**
 * Construye el status según se producen eventos sobre el mapa.
 * @this MapAdjOfer.prototype
 */
function build() {
   Object.defineProperty(this, "status", {
      value: {},
      writable:false,
      enumerable: true,
      configurable: false,
   });

   Object.defineProperties(this.status, {
      zoo: {
         get: () => this.map.getZoom(),
         enumerable: true
      },
      cen: {
         get: () => getCoords(this.map.getCenter()),
         enumerable: true
      }
   })

   // Reduce los decimales de las coordenadas a 4.
   function getCoords(point) {
      return [Number(point.lat.toFixed(4)), Number(point.lng.toFixed(4))];
   }

   this.map.on("zoomend", e => { 
      this.fire("statuschange", {attr: "zoo"});
   });

   this.map.on("moveend", e => { 
      this.fire("statuschange", {attr: "cen"});
   });

   this.on("originset", e => {
      if(e.newval) this.status.ori = getCoords(e.newval.getLatLng());
      else delete this.status.ori;
      if(e.newval !== e.oldval) this.fire("statuschange", {attr: "ori"});
   });

   // Especialidad
   this.on("dataloaded", e => {
      if(this.general) this.status.esp = this.general.entidad[0];
      this.fire("statuschange", {attr: "esp"});
   });

   this.on("markerselect", e => {
      if(e.newval) this.status.sel = this.seleccionado.getData().id.cod;
      else delete this.status.sel;
      if(e.newval !== e.oldval) this.fire("statuschange", {attr: "sel"});
   });

   this.on("isochroneset", e => {
      const oldiso = this.status.iso;
      if(e.newval) this.status.iso = 1;
      else delete this.status.iso;
      if(oldiso !== this.status.iso) this.fire("statuschange", {attr: "iso"});
   })

   this.on("routeset", e => {
      if(e.newval) this.status.des = this.ruta.destino.getData().id.cod;
      else delete this.status.des;
      if(e.oldval !== e.newval) this.fire("statuschange", {attr: "des"});
   })

   // Anota en el estado un filtro
   function filterStatus(Marker, e) {
      const filter = this[Marker].prototype.options.filter;
      this.status.fil = this.status.fil || {};
      this.status.fil[Marker] = this.status.fil[Marker] || {};

      this.status.fil[Marker][e.name] = filter.getParams(e.name);
      if(Marker === "Centro" && e.name === "lejos") {
         // Nos cargamos el área que puede volver
         // a hallarse y ocupa muchísimo espacio.
         delete this.status.fil[Marker].lejos.area;
      }
      this.fire("statuschange", {attr: `fil.${Marker}.${e.name}`});
   }

   // Desanota en el estado un filtro.
   function unfilterStatus(Marker, e) {
      delete this.status.fil[Marker][e.name];
      if(Object.keys(this.status.fil[Marker]).length === 0) delete this.status.fil[Marker];
      if(Object.keys(this.status.fil).length === 0) delete this.status.fil;
      this.fire("statuschange", {attr: `fil.${Marker}.${e.name}`});
   }

   this.Centro.on("filter:*", filterStatus.bind(this, "Centro"));
   this.Centro.on("unfilter:*", unfilterStatus.bind(this, "Centro"));
   this.Localidad.on("filter:*", filterStatus.bind(this, "Localidad"));
   this.Localidad.on("unfilter:*", unfilterStatus.bind(this, "Localidad"));

   this.Centro.on("correct:*", e => {
      if(e.auto || e.name === "extinta") return;  // Sólo se apuntan las manuales.
      const corr = this.Centro.prototype.options.corr,
            opts = corr.getOptions(e.name);

      this.status.cor = this.status.cor || {};
      this.status.cor[e.name] = {par: opts.params, aut: opts.auto};
      this.fire("statuschange", {attr: `cor.${e.name}`});
   });
            
   this.Centro.on("uncorrect:*", e => {
      if(e.auto || e.name === "extinta") return;

      delete this.status.cor[e.name];
      if(Object.keys(this.status.cor).length === 0) delete this.status.cor;
      this.fire("statuschange", {attr: `cor.${e.name}`});
   });

   this.on("requestchange", e => {
      this.status.list = this.solicitud.list;
      this.fire("statuschange", {attr: "pet"});
   });
}
// Fin issue #62


/**
 * Fija la vista inicial del mapa en función del estado
 * que se haya pasado a través del parámetro URL status.
 *
 */
function set() {
   const status = this.options.status;

   let lejos;

   // Los filtros pueden aplicarse antes de obtener datos.
   if(status.fil) {
      // Pero este lo dejamos para después.
      if(status.fil.Centro && status.fil.Centro.lejos) {
         lejos = status.fil.Centro.lejos;
         delete status.fil.Centro.lejos;
      }
      for(const Marker in status.fil) {
         for(const name in status.fil[Marker]) {
            this[Marker].filter(name, status.fil[Marker][name]);
         }
      }
   }

   if(status.esp) {  // Debe cargarse una especialidad.
      this.once("dataloaded", e => {
         if(status.sel) this.seleccionado = this.Centro.get(status.sel);

         if(status.cor) {
            // Diferimos un cuarto de segundo la ejecución de las correcciones
            // para darle tiempo a la interfaz visual a prepararse.
            setTimeout(() => {
               for(const name in status.cor) {
                  const opts = status.cor[name];
                  this.Centro.correct(name, opts.par, !!opts.aut);
               }
               this.Centro.invoke("refresh");
            }, 250);
         }

         if(this.ors && status.des) {
            const destino = this.Centro.get(status.des);
            if(status.iso) this.on("routeset", e => this.setIsocronas());
            this.setRuta(destino);
         }
      });
      this.agregarCentros(`../../json/${status.esp}.json`);
   }

   // Origen
   if(status.ori) this.setOrigen({lat: status.ori[0], lng: status.ori[1]});

   // Isocronas: se está suponiendo que tardan bastante más
   // que en cargar los datos de los centros. En puridad, habría
   // que meterlo dentro del dataloaded anterior
   if(this.ors && status.iso) {
      if(lejos) {
         this.once("isochroneset", e => {
            const area = this.getIsocronas(true)[lejos.idx];
            this.ors.isocronas.dibujarAreaMaciza(area);
            this.Centro.filter("lejos", {area: area, idx: lejos.idx});
            this.Centro.invoke("refresh");
         });
      }
      // Si hay que pintar una ruta, se generan las isocronas
      // después para evitar que interfieran las dos cargas (ambas cargan loading).
      if(!status.des) this.setIsocronas();
   }

   this.status.list = status.list;

}


/**
 * Obtiene un objeto codificado en base64 que describe el estado del mapa.
 * @param {Object} extra   Opciones extra que proporciona la interfaz visual
 * y que se añadiran al estado a través del atributo ``extra``.
 */
function get(extra) {
                  // Issue #66
   const status = extra?Object.assign({visual: extra}, this.status)
                       :this.status;
   return btoa(JSON.stringify(status));
}

export {getOpts, build, set, get}
