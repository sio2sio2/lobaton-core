/**
 * Catálogo de iconos para el centro
 */
import * as css from "./css.js";
import * as boliche from "./boliche.js";
import * as solicitud from "./solicitud.js";
import {getPath} from "app/utils/misc.js";
import "./sass/piolin.sass";
import "./sass/chupachups.sass";

export default {
   piolin: L.Mutable.utils.createMutableIconClass("piolin", {
      iconSize: null,
      iconAnchor: [12.5, 34],
      // css: getPath("css/piolin.css"),  // Incluimos las reglas en el CSS general
      html: css.html,
      converter: css.converter,
      updater: css.updater
   }),
   chupachups: L.Mutable.utils.createMutableIconClass("chupachups", {
      iconSize: [25, 34],
      iconAnchor: [12.5, 34],
      // css: getPath("css/chupachups.css"),
      html: css.html,
      converter: css.converter,
      updater: css.updater
   }),
   solicitud: L.Mutable.utils.createMutableIconClass("solicitud", {
      iconSize: [40, 40],
      iconAnchor: [19.556, 35.69],
      url: solicitud.url,
      converter: solicitud.converter,
      updater: solicitud.updater
   }),
   boliche: L.Mutable.utils.createMutableIconClass("boliche", {
      iconSize: [40, 40],
      iconAnchor: [19.556, 35.69],
      url: boliche.url,
      converter: boliche.converter,
      updater: boliche.updater,
   })
}
