**************
Lobatón (core)
**************
**Lobaton** desarrolla, a través del plugin `leaflet.mutatismutandis`_ de
Leaflet_ un mapa de adjudicaciones provisionales y oferta de centros educativos,
pero sin implementar la interfaz que permite al usuario controlar la aplicación
de filtros y correcciones, hacer solicitudes o consultar la información
detallada de cada centro. Es, pues, la librería base para contruir una
aplicación web completa con la heramienta que se desee (VueJS_, AngularJS_,
React_ o, claro está, directamente VanillaJS_)

La librería define un objeto que posibilita:

- Disponer sobre el mapa marcas que representan centros educativos y cuyo
  aspecto despende de su oferta educativa, sus planes de bilinguismo, su tipo y
  sus adjudicaciones.

- Agrupar marcas usando el plugin `Leaflet.MarkerCluster`_.

- Realizar `Correcciones`_ sobre las adjudicaciones y la
  oferta educativa.

- Aplicar `Filtros`_ predefinidos.
  
- Definir un origen de viajes, a fin de:

  + Consultar el tiempo y la distancia de trayecto a cualquier centro.
  + Consultar las isocronas de 10, 20, 30, 40, 50 y 60 minutos, y poder
    usarlas como criterio de filtro.

Un ejemplo con una interfaz muy simple de aplicación, que permite manipular
mínimamente los datos del mapa es `éste <https://sio2sio2.github.io/examples>`_.

Instalación
***********
Para el desarrollo de la interfaz con NodeJS_ basta con instalar el paquete:

.. code-block:: console

   $ npm install @lobaton/core

e importar la función que crear el objeto de manipulación del mapa en el código
propio\ [#]_:

.. code-block:: js

   import "@lobaton/core/dist/core.bundle.css";
   import lobaton from "@lobaton/core/dist/core.bundle.js";

Si nuestra intención es usar la librería directamente en el **navegador**,
disponemos de tres sabores distintos:

* ``core.js`` que contiene la versión minimizada de la librería sin
  dependencias, por lo que exige hacer referencia a todas ellas en el *HTML*:

  .. code-block:: html

     <!-- Leaflet -->
     <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css>
     <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>

     <!-- Plugin: Markercluster -->
     <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css">
     <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css">
     <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"></script>

     <!-- Plugin: Menú contextual -->
     <link rel="stylesheet" href="https://unpkg.com/leaflet-contextmenu@1.4.0/dist/leaflet.contextmenu.min.css">
     <script src="https://unpkg.com/leaflet-contextmenu@1.4.0/dist/leaflet.contextmenu.min.js"></script>

     <!-- Plugin: Búsqueda -->
     <link rel="stylesheet" 
           href="https://unpkg.com/leaflet-search@2.9.8/dist/leaflet-search.min.css">
     <link rel="alternate stylesheet"
           href="https://unpkg.com/leaflet-search@2.9.8/dist/leaflet-search.mobile.min.css">
     <script src="https://unpkg.com/leaflet-search@2.9.8/dist/leaflet-search.src.js"></script>
     <!-- Fuse.js: Fuzzy-search -->
     <script src="https://unpkg.com/fuse.js"></script>

     <!-- Plugin: mutatismutandis -->
     <script src="https://unpkg.com/leaflet.mutatismutandis"></script>

     <!-- turf (polígonos): para isocronas -->
     <script src='https://npmcdn.com/@turf/turf/turf.min.js'></script>

     <!-- Lobatón Core -->
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core.bundle.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core.bundle.js"></script>

* ``core-src.js``, que es la versión de desarrollo de la librería y es
  sólo útil para labores de depuración con el navehador, aunque para tal labor
  es aconsejable utilizar NodeJS_. Requiere cargar las mismas dependencias y
  sólo difiere en cómo cargar el propio lobatón:

  .. code-block:: html

     <!-- Las mismas dependencias expuestas arriba -->

     <!-- Lobatón Core -->
     <link rel="stylesheet" href="https://unpkg.com/@lobaton/core/dist/core-src.css">
     <script src="https://unpkg.com/@lobaton/core/dist/core-src.js"></script>

* ``core.bundle.js``, que incluye todas las dependencias y es la versión
  que se aconseja usar, si el desarrollo de la interfaz no se hace con NodeJS_:
   
  .. code-block:: html

     <!-- Lobatón Core + Dependencias -->
     <link rel="stylesheet" href="https://unpkg.com/@lobaton/core/dist/core.bundle.css">
     <script src="https://unpkg.com/@lobaton/core/dist/core.bundle.js"></script>

.. [#] El sabor *bundle* contienen todas las dependencias necesarias, incluidos
      los iconos png necesarios para `L.Icon.Default`_ en forma de `dataURI
      <https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs>`.
      Hay otra versión (:file:`@lobaton/core/dist/core.js`) sin dependencias
      pero obliga a declararlas al construir el paquete. Si su intención es usar
      esta versión sin dependencias, échele un ojo al :file:`webpack.config.js`
      que trae el paquete.


.. _Leaflet: https://leafletjs.com
.. _leaflet.mutatismutandis: https://github.com/sio2sio2/leaflet.mutatismutandis
.. _VanillaJS: http://vanilla-js.com
.. _React: https://es.reactjs.org/
.. _AngularJS: https://angularjs.org/
.. _VueJS: https://vuejs.org/
.. _Leaflet.MarkerCluster: https://github.com/Leaflet/Leaflet.markercluster
.. _NodeJS: https://nodejs.org
.. _L.Icon.Default: https://leafletjs.com/reference-1.5.0.html#icon-default
