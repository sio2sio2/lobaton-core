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
  sólo útil para labores de depuración con el navegador, aunque para tal labor
  es aconsejable utilizar NodeJS_. Requiere cargar las mismas dependencias y
  sólo difiere en cómo cargar el propio **Lobatón**:

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

Objeto
******
El paquete facilita, mediante cr función ``lobaton``, la creación de un objeto
para el acceso a la manipulación del mapa:

Creación
========

.. _lobaton:

**lobaton(opts)**
   Crea un objeto para interactuar con el mapa:

   .. code-block:: js

      g = lobaton({
         center: [37.45, -4.5],
         pathLoc: "json/localidades.json",
         unclusterZoom: 13,
         zoom: 8,
         ors: {key: "###--KEY--###"}
      });

   A la función pueden facilitarse cualquiera de las opciones para la creación
   de un objeto `L.Map`_ (como *zoom* o *center*) y las siguientes:

   +---------------+----------------------------------------------------------+
   | Opción        | Descripción                                              |
   +===============+==========================================================+
   | autostatus    | Aplica automáticamente la configuración proporcionada a  |
   |               | través de la opción *status*. Por defecto, ``true``.     |
   |               | Véase el método `setStatus()`_                           |
   +---------------+----------------------------------------------------------+
   | icon          | Estilo del icono. Puede ser "*boliche*" o "*chupachups*".|
   |               | Por defecto, "*boliche*".                                |
   +---------------+----------------------------------------------------------+
   | id            | Identificador del elemento *HTML* donde se incrustará el |
   |               | mapa.                                                    |
   +---------------+----------------------------------------------------------+
   | light         | Si ``true`` (su valor por defecto), se implementan       |
   |               | algunos aspectos del comportamiento del mapa:            |
   |               |                                                          |
   |               | * *Click* sobre el centro, lo selecciona.                |
   |               | * Crea menús contextuales al pulsar el botón derecho     |
   |               |   sobre el mapa, los centros, el origen de los viajes    |
   |               |   y las áreas que encierran las isocronas.               |
   +---------------+----------------------------------------------------------+
   | loading       | Función que construye un indicador para notar la carga   |
   |               | de datos remotos. Si es ``true``, se usa el indicador    |
   |               | interno; y si ``false``, se prescindirá de indicador     |
   |               | alguno. Valor predeterminado: ``true``.                  |
   +---------------+----------------------------------------------------------+
   | ors           | Objeto que proporciona las opciones para generar         |
   |               | isocronas, crear rutas y geocodificar puntos utilizando  |
   |               | la *API* de OpenRouteService_.                           |
   +---------------+----------------------------------------------------------+
   | search        | Crea un cajetín para localizar centros por nombre. Por   |
   |               | defecto, ``true``.                                       |
   +---------------+----------------------------------------------------------+
   | status        | Pasa un objeto de configuración del estado inicial       |
   |               | codificado en base64. Su decodificación pasará a ser el  |
   |               | valor inicial del atributo status_.                      |
   +---------------+----------------------------------------------------------+
   | unclusterZoom | Zoom a partir del cual las marcas de centro se mostrarán |
   |               | siembre desagregadas. Por defecto, **14**.               |
   +---------------+----------------------------------------------------------+

   A su vez, el objeto *ors* puede tener estos atributos:

   +---------------+----------------------------------------------------------+
   | Opción        | Descripción                                              |
   +===============+==========================================================+
   | chunkProgress | Función para mostrar el progreso en operaciones lentas   |
   |               | (cálculo de isocronas). Si ``true``, se usa el indicador |
   |               | interno, y si ``false``, se prescinde de indicador.      |
   |               | Por defecto, ``true``.                                   |
   +---------------+----------------------------------------------------------+
   | key           | Clave para el uso de la API REST de OpenRouteService_.   |
   +---------------+----------------------------------------------------------+
   | loading       | Tiene exactamente el mismo significado que la opción     |
   |               | general. Su valor predeterminado es el que tenga la      |
   |               | opción general.                                          |
   +---------------+----------------------------------------------------------+
   | routaPopup    | Función que construye el *popup* con información sobre   |
   |               | la ruta generada. La función recibe como primer          |
   |               | argumento la marca de origen, como segundo la marca del  |
   |               | centro destino y como último argumento el objeto         |
   |               | GeoJSON_ que representa la ruta. También admite los      |
   |               | valores ``true`` si se desea usar la función             |
   |               | predefinida, o false si no desea mostrar popup. Por      |
   |               | defecto, ``true``.                                       |
   +---------------+----------------------------------------------------------+

.. note:: Si no se facilita centro (opción *center*), la aplicación intentará
   averiguar las coordenadas del dispositivo para situar en ellas el centro.

Atributos
=========
.. warning:: No sobreescriba los valores de estos atributos. Limítese a
   consultarlos y usarlos. Para cambiarlos existen métodos específicos.

.. _cluster:

``cluster``
   Es la capa a la que se añaden las marcas de centro. En consecuencia:

   .. code-block:: js

      g.cluster.getLayers()

   nos devolvería todas las marcas de centro que se encuentren sobre el mapa\
   [#]_. No presenta ninguna característica extendida.

.. _Centro:

``Centro``
   Clase de iconos mutables (`L.Marker.Mutable`_) a la que pertenecen las marcas
   de centro. Sobra esta clase se aplicar las Correcciones_ y Filtros_, que
   trataremos más adelante.

   Además, esta clase añade dos particularidades a los atributos propios de
   `L.Marker.Mutable`_:

   .. _get():

   ``.get(codigo)``,
      que permite obtener la amrca del centro cuyo código es el suministrado
      en cualquiera de sus variantes:

      .. code-block:: js

         centro = g.Centro.get(23001111);     // Variante numérica.
         centro = g.Centro.get("23001111");   // Variante de cadena.
         centro = g.Centro.get("23001111C");   // Variante normalizada.


   Además, a los datos se incorpora un *getter*, que permite obtener el código
   normalizado del centro:

   .. code-block:: js

      centro.getData().id.cod;  // código numérico de los datos: 23001111
      centro.getData().codigo;  // Código normalizado: 23001111C

.. _general:

``general``
   Almacena la información general del GeoJSON_ de Datos_ (o sea, la primera
   *feature*).

``status``
   Devuelve el estado actual del mapa (origen, filtros correcciones, etc.). El
   estado adicional que aporte la interfaz visual se encontrará dentro de su
   atributo *visual*. Este estado es dinámico y varía cada vez que se realiza una
   acción sobre el mapa que modifica el estado. excepto *visual*, que como
   recoge caractarísticas del estado de la interfaz ajenas al mapa, mantendrá
   sus valores iniciales. Para más información eche un ojo al método
   `getStatus()`_.

``seleccionado``
   Establece un centro como el seleccionado, lo que se notará visualmente
   rodeando el icono con una circunferencia roja. Es la única propiedad a la que
   podemos asociar valor directamente:

   .. code-block:: js

      g.seleccionado = g.Centro.get(21002100);  // Seleccionamos el centro 21002100.
      g.seleccionado = null;     // Deshacemos la selección.

   La selección de un centro tiene asociado el evento markerselect_.

``origen``
   Marca que representa el origen del viaje. Puede no existir, si no se ha
   definido ningún origen. El establecimniento del origen está asociado al
   evento originset_.

   La asignación de un valor a g.origen.postal tiene asociado el evento geocode_
   aplicable a la propia marca de origen:

   .. code-block:: js

      g.on("originset", e => {
         if(!e.newval) return;
         e.newval.once("geocode", x => {
            console.log(`Pues sí, estoy en '${x.newval}'`);
         });
      });

``contador``
   Número de consultas realizadas al servicio de OpenRouteService_.

``direccion``
   Almacena el resultado de una geocodificación. Si se realizó la consulta de la
   dirección postal de unas coordenadas contendrá una cadena; y, si se pretendió
   obtener las coordenadas de una dirección postal, el objeto GeoJSON_ con todas
   las localizaciones posibles.

``isocronas``
   Array con las marcas que representan las áreas de los anillos que se forman
   entre isocronas. Tales marcas tienen asociadas mediante su atributo *feature*
   el objeto GeoJSON_ que define el área.

``ruta``
   Objeto que contiene dos atributos: *ruta.destino*, que es la marca de centro
   que se usó como destino de la ruta; y *ruta.layer* que es la capa que
   representa la ruta (la cual a su vez tendrá asociada en su atributo *feature*
   el objeto GeoJSON_ que define la ruta).

Métodos
=======

Eventos
=======

Centros
*******

.. [#] El sabor *bundle* contienen todas las dependencias necesarias, incluidos
   los iconos png necesarios para `L.Icon.Default`_ en forma de `dataURI
   <https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs>`_.
   Hay otra versión (``@lobaton/core/dist/core.js``) sin dependencias pero
   obliga a declararlas al construir el paquete. Si su intención es usar esta
   versión sin dependencias, échele un ojo al ``webpack.config.js`` que trae el
   paquete.

.. [#] Lo cual no significa que devuelve todas las marcas de centro, ya que
   puede haber centros que no se encuentren sobre el mapa porque hayan ido
   desaparecido al filtrarse. Para obtener todos los centros necesitaría
   recurrir a ``g.Centro.store``.

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
.. _L.Map: https://leafletjs.com/reference-1.5.0.html#map
.. _OpenRouteService: https://openrouteservice.org
.. _L.Marker.Mutable: https://github.com/sio2sio2/leaflet.mutatismutandis#l-marker-mutable
