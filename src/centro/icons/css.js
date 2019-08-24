// Definición de los iconos CSS (comparten todo menos el estilo)
const converter = new L.Mutable.utils.Converter(["numvac", "tipo"])
                                     .define("tipo", "mod.dif", t => t || "normal")
                                     .define("numvac", "adj", a => a.length);

function updater(o) {
   const content = this.querySelector(".content");
   if(o.tipo) content.className = "content " + o.tipo;
   if(o.numvac !== undefined) content.firstElementChild.textContent = o.numvac;
   return this;
}

const html = '<div class="content"><span></span></div><div class="arrow"></div>';

export {converter, html, updater};
