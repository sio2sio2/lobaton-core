import {getPath} from "app/utils/misc.js";
import "./images/zoom-in.png";
import "./images/zoom-out.png";

/**
* Define el menú contextual del mapa.
* @this {MapAdjOfer}  El objeto del mapa de adjudicaciones.
*/
function map() {
   return {
      contextmenu: true,
      contextmenuItems: [
         {
            text: "Fijar origen de viaje",
            callback: e => this.setOrigen(e.latlng)
         },
         {
            text: "Centrar el mapa aquí",
            callback: e => this.map.panTo(e.latlng)
         },
         "-",
         {
            text: "Ampliar escala",
            icon: getPath("images/zoom-in.png"),
            callback: e => this.map.zoomIn()
         },
         {
            text: "Reducir escala",
            icon: getPath("images/zoom-out.png"),
            callback: e => this.map.zoomOut()
         }
      ]
   }
}


/**
* Define el menú contextual del punto de origen
* @this {MapAdjOfer}  El objeto del mapa de adjudicaciones.
*
* @param {String} espera  Cuál es la acción por la que se está esperando.
*/
function origen() {
   const items = [
      {
         text: "Geolocalizar este origen",
         disabled: !!this.origen.postal || this.ors.espera.indexOf("geocode") !== -1,
         callback: e => this.calcularOrigen()
      }
   ]

   if(this.isocronas) {
      items.push({
         text: "Eliminar isocronas",
         callback: e => this.setIsocronas(null)
      });
   }
   else {
      items.push({
         text: "Generar isocronas",
         disabled: this.ors.espera.indexOf("isocronas") !== -1,
         callback: e => this.setIsocronas(true)
      });
   }

   if(this.ruta || this.ors.espera.indexOf("ruta") !== -1) {
      items.push({
         text: "Eliminar ruta",
         disabled: this.ors.espera.indexOf("ruta") !== -1,
         callback: e => this.setRuta(null)
      });
   }
   else {
      items.push({
         text: "Crear ruta al centro seleccionado",
         disabled: !this.seleccionado,
         callback: e => this.setRuta(this.seleccionado)
      });
   }

   items.push.apply(items, [
      "-",
      {
         text: "Eliminar este origen",
         callback: e => this.setOrigen(null)
      }
   ]);

   return {
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: items
   }
}

function centro(marker) {

   const seleccion = this.seleccionado !== marker,
         texto = (seleccion?"Seleccionar":"Deseleccionar") + " el centro",
         items = [
            {
               text: texto,
               callback: e => this.seleccionado = (seleccion?marker:null)
            }
         ]

   if(this.ruta && this.ruta.destino === marker) {
      items.push({
         text: "Eliminar la ruta",
         callback: e => this.setRuta(null)
      });
   }
   else {
      items.push({
         text: "Crear ruta desde el origien",
         disabled: !this.origen || this.ors.espera.indexOf("ruta") !== -1,
         callback: e => this.setRuta(marker)
      });
   }

   return {
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: items
   }
}

export {map, origen, centro}
