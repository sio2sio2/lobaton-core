function popupRuta(destino, ruta) {
   const container = document.createElement("article"),
         distancia = Math.floor(ruta.properties.summary.distance / 1000),
         tiempo = (function(t) {  // Pasa segundos a horas y minutos.
            let m = Math.floor(t/60);
            if(m > 60) {
               const h = Math.floor(m/60);
               m %= 60;
               return `${h}h ${m}m`;
            }
            else return m + "m";
         })(ruta.properties.summary.duration);

   let e = document.createElement("h3");

   e.textContent = destino.getData().id.nom;
   container.appendChild(e);

   let ul = document.createElement("ul"),
       li = document.createElement("li");

   ul.appendChild(li);
   e = document.createElement("b");
   e.textContent = "Distancia";
   li.appendChild(e);
   li.appendChild(document.createTextNode(`: ${distancia} Km`));
   
   li = document.createElement("li");
   ul.appendChild(li);

   e = document.createElement("b");
   e.textContent = "Tiempo est.";
   li.appendChild(e);
   li.appendChild(document.createTextNode(`: ${tiempo}`));

   container.appendChild(ul);

   return container;
}

export default popupRuta;
