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
mínimamente los datos del mapa es `éste
<https://sio2sio2.github.io/lobaton-core/examples>`_.

Instalación
***********
Para el desarrollo de la interfaz con NodeJS_ basta con instalar el paquete:

.. code-block:: console

   $ npm install git+https://github.com/sio2sio2/lobaton-core

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
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core.js"></script>

* ``core-src.js``, que es la versión de desarrollo de la librería y es
  sólo útil para labores de depuración con el navehador, aunque para tal labor
  es aconsejable utilizar NodeJS_. Requiere cargar las mismas dependencias y
  sólo difiere en cómo cargar el propio lobatón:

  .. code-block:: html

     <!-- Las mismas dependencias expuestas arriba -->

     <!-- Lobatón Core -->
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core-src.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core-src.js"></script>

* ``core.bundle.js``, que incluye todas las dependencias y es la versión
  que se aconseja usar, si el desarrollo de la interfaz no se hace con NodeJS_:
   
  .. code-block:: html

     <!-- Lobatón Core + Dependencias -->
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core.bundle.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core.bundle.js"></script>

Datos
*****
Los datos se facilitan en un formato `GeoJSON`_ en que la primera *feature*
describe aspectos generales de los datos suministrados (p.e. qué nombre se
corresponde con cada código de puesto) y cada una de las restantes *features*
los datos detallados de cada centro.

.. code-block:: json

   {
      "type": "FeatureCollection",
      "features": [
         {
            "type": "Feature",
            "properties": {
               "curso": "2018\/19",
               "tipo": "adjoferta",
               "objetivo": "especialidad",
               "entidad": [
                  590107
               ],
               "spider": {
                  "cgt": false,
                  "vt": true,
                  "organica": "2018\/19",
                  "ofertafp": "2018\/19",
                  "ofertasec": "2019\/20"
               },
               "limite": false,
               "puestos": {
                  "00590059": "APOYO AL ÁREA CIENTÍFICA O TECNOLÓGICA",
                  "00590107": "Informática P.E.S",
                  "11590107": "Informática (Inglés) P.E.S.",
                  "CI590107": "Informática (Nueva implantación) P.E.S.",
                  "DU590107": "Informática (Dual) P.E.S.",
                  "ED590107": "Informática (IEDA) P.E.S.",
                  "SP590107": "Informática (Semipresencial) P.E.S."
               },
               "colectivos": {
                  "B": {
                     "o": 0,
                     "v": "Suprimido"
                  },
                  "C": {
                     "o": 1,
                     "v": "Desplazado"
                  },
                  "N": {
                     "o": 2,
                     "v": "ExDirector"
                  },
                  "E": {
                     "o": 3,
                     "v": "Adscrito"
                  },
                  "F": {
                     "o": 4,
                     "v": "Reingresado"
                  },
                  "DA": {
                     "o": 5,
                     "v": "SaludPropia"
                  },
                  "DB": {
                     "o": 6,
                     "v": "Conciliación"
                  },
                  "DC": {
                     "o": 6,
                     "v": "CargoElecto"
                  },
                  "G": {
                     "o": 8,
                     "v": "Provisional"
                  },
                  "M": {
                     "o": 9,
                     "v": "PueEspec"
                  },
                  "H": {
                     "o": 10,
                     "v": "EnPracticas"
                  },
                  "I": {
                     "o": 11,
                     "v": "Aprobado"
                  },
                  "DZ": {
                     "o": 12,
                     "v": "InterCom"
                  },
                  "J": {
                     "o": 13,
                     "v": "Interino"
                  }
               },
               "ens": {
                  "23GMSMR168": {
                     "nombre": "Sistemas Microinformáticos y Redes",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ],
                     "grado": "CFGM"
                  },
                  "23GSASI820": {
                     "nombre": "Administración de Sistemas Informáticos en Red",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ],
                     "grado": "CFGS"
                  },
                  "23GSDA859": {
                     "nombre": "Desarrollo de Aplicaciones Web",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ],
                     "grado": "CFGS"
                  },
                  "23GSDAM517": {
                     "nombre": "Desarrollo de Aplicaciones Multiplataforma",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ],
                     "grado": "CFGS"
                  },
                  "BAE": {
                     "nombre": "Bachillerato de Artes Escénicas",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "CI590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ]
                  },
                  "BAP": {
                     "nombre": "Bachillerato de Artes Plásticas",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "CI590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ]
                  },
                  "BCT": {
                     "nombre": "Bachillerato de Ciencias",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "CI590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ]
                  },
                  "BHCS": {
                     "nombre": "Bachillerato de Humanidades y Ciencias Sociales",
                     "puestos": [
                        "00590107",
                        "11590107",
                        "CI590107",
                        "DU590107",
                        "ED590107",
                        "SP590107"
                     ]
                  }
               },
               "version": 0.2
            }
         },
         {
            "type": "Feature",
            "geometry": {
               "type": "Point",
               "coordinates": [
                  -3.0248339999999998,
                  36.746941
               ]
            },
            "properties": {
               "id": {
                  "cod": 4000110,
                  "nom": "I.E.S. Abdera",
                  "dom": "C\/ Marisma, 6",
                  "mun": "Adra",
                  "cp": 4770,
                  "pro": "Almeria"
               },
               "oferta": [
                  {
                     "ens": "BHCS",
                     "mod": "semi",
                     "idi": null,
                     "adu": true,
                     "ext": false,
                     "ene": false,
                     "nue": 0,
                     "mar": false
                  },
                  {
                     "ens": "BHCS",
                     "mod": "pres",
                     "idi": "Inglés",
                     "adu": false,
                     "ext": false,
                     "ene": false,
                     "nue": 0,
                     "mar": false
                  },
                  {
                     "ens": "BCT",
                     "mod": "pres",
                     "idi": "Inglés",
                     "adu": false,
                     "ext": false,
                     "ene": false,
                     "nue": 0,
                     "mar": false
                  },
                  {
                     "ens": "23GSDA859",
                     "mod": "pres",
                     "idi": null,
                     "adu": false,
                     "ext": false,
                     "ene": false,
                     "nue": 0,
                     "tur": "matutino",
                     "esp": null,
                     "pla": 20,
                     "pro": false,
                     "mar": true
                  }
               ],
               "mod": {
                  "bil": [
                     11
                  ]
               },
               "pla": {
                  "00590107": {
                     "fun": 3,
                     "org": 3,
                     "norg": null,
                     "vi": 1,
                     "vt": 0
                  }
               },
               "adj": [
                  {
                     "col": "J",
                     "esc": [
                        2,
                        9,
                        7
                     ],
                     "pue": "00590107",
                     "pet": "15",
                     "per": false,
                     "ubi": false
                  },
                  {
                     "col": "J",
                     "esc": [
                        1,
                        7,
                        6
                     ],
                     "pue": "00590107",
                     "pet": "7",
                     "per": false,
                     "ubi": false
                  }
               ]
            }
         }
      ]
   }

Los datos son bastante elocuentes, pero algunos requieren explicación:

- La "*o*" en los colectivos representa el orden de prelación de cada colectivo.
  Cuanto menor sea, mayor será la prelación. El dato es útil para la corrección
  `Adjudicatario de referencia`_.

- Las características de cada enseñanza son las siguientes:

  * *ens*, código de la enseñanza.
  * *mod*, modalidad de enseñanza que puede ser *pres* (presencial),
    *semi* (semipresencial) y *dist* (a distancia).
  * *idi*, idioma (Inglés, Francés o Alemán).
  * *adu*, enseñanza de adultos.
  * *ext*, ``true``, si la enseñanza se extinguió y el curso presente ya no existe.
  * *ene*, ``true``, en extinción, pero sigue aún existiendo.
  * *nue*, nueva implantación: **1**, en primer año; **2**, en segundo año;
    **0**, no es una nueva enseñanza.
  * *mar*, ``true`` si la enseñanza es deseable.
  * *tur*, que puede ser *matutino*, *vespertino* o *ambos*. Sólo aparece en
    enseñanzas de formación profesional. En las enseñanzas de secundaria y
    bachillerato, se sobreentiende que la enseñanza de adultos es por la tarde.
  * *esp*, *especial* que puede ser "*parcial*", "*dual*"
  * *pla*, número de plazas (F.P.).
  * *aum*, que representa la variación de plazas y puede ser un número positivo
    o negativo.
  * *pro*, ``true`` si es un programa específico de formación profesional.

- Las características de cada adjudicación son las siguientes:

  * *col*, letra que representa al colectivo.
  * *esc*, escalafón o tiempo de servicio, si es funcionario interino.
  * *pue*, puesto de adjudicación.
  * *pet*, número de petición.
  * *per*, ``true`` si la vacante se adjudicó en el concurso de traslados y,
    consecuentemente, no estará disponible más en el procedimiento.
  * *ubi*, ``true`` si el funcionario obtuvo plaza en el concurso de traslados y,
    en principio, no volverá a ocupar esa plaza.


.. [#] El sabor *bundle* contienen todas las dependencias necesarias, incluidos
      los iconos png necesarios para `L.Icon.Default`_ en forma de `dataURI
      <https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs>`_.
      Hay otra versión (``@lobaton/core/dist/core.js``) sin dependencias
      pero obliga a declararlas al construir el paquete. Si su intención es usar
      esta versión sin dependencias, échele un ojo al ``webpack.config.js``
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
.. _GeoJSON: https://geojson.org/
