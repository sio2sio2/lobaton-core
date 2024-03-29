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
propio:

.. code-block:: js

   import "@lobaton/core/dist/core.bundle.css";
   import * as Lo from "@lobaton/core";

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

     <!-- Plugin: mutatismutandis -->
     <script src="https://unpkg.com/leaflet.mutatismutandis/dist/leaflet.mutatismutandis.js"></script>

     <!-- turf (polígonos): para isocronas -->
     <script src='https://npmcdn.com/@turf/turf/turf.min.js'></script>

     <!-- Lobatón Core -->
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core.js"></script>

* ``core.bundle.js``, que incluye todas las dependencias y es más aconsejable de
  usar (excluida la opción de desarrollar con NodeJS_):
   
  .. code-block:: html

     <!-- Lobatón Core + Dependencias -->
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core.bundle.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core.bundle.js"></script>

* ``core-debug.js``, que es la versión de desarrollo de la librería y es
  sólo útil para labores de depuración con el navegador, aunque para tal labor
  es aconsejable utilizar NodeJS_. Requiere cargar las mismas dependencias y
  sólo difiere en cómo cargar el propio **Lobatón**:

  .. code-block:: html

     <!-- Las mismas dependencias expuestas para core.js -->

     <!-- Lobatón Core -->
     <link rel="stylesheet" href="https://sio2sio2.github.io/lobaton-core/dist/core-debug.css">
     <script src="https://sio2sio2.github.io/lobaton-core/dist/core-debug.js"></script>

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
  adjref_:

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
El paquete facilita, mediante la función ``lobaton``, la creación de un objeto
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
   normalizado\ [#]_ del centro:

   .. code-block:: js

      centro.getData().id.cod;  // código numérico de los datos: 23001111
      centro.getData().codigo;  // Código normalizado: 23001111C

.. _general:

``general``
   Almacena la información general del GeoJSON_ de Datos_ (o sea, la primera
   *feature*).

.. _status:

``status``
   Devuelve el estado actual del mapa (origen, filtros correcciones, etc.). El
   estado adicional que aporte la interfaz visual se encontrará dentro de su
   atributo *visual*. Este estado es dinámico y varía cada vez que se realiza una
   acción sobre el mapa que modifica el estado. excepto *visual*, que como
   recoge caractarísticas del estado de la interfaz ajenas al mapa, mantendrá
   sus valores iniciales. Para más información eche un ojo al método
   `getStatus()`_.

.. _seleccionado:

``seleccionado``
   Establece un centro como el seleccionado, lo que se notará visualmente
   rodeando el icono con una circunferencia roja. Es la única propiedad a la que
   podemos asociar valor directamente:

   .. code-block:: js

      g.seleccionado = g.Centro.get(21002100);  // Seleccionamos el centro 21002100.
      g.seleccionado = null;     // Deshacemos la selección.

   La selección de un centro tiene asociado el evento markerselect_.

.. _origen:

``origen``
   Marca que representa el origen del viaje. Puede no existir, si no se ha
   definido ningún origen. El establecimniento del origen está asociado al
   evento originset_.

   La asignación de un valor a g.origen.postal tiene asociado el evento geocode_
   aplicable a la propia marca de origen.

.. _contador:

``contador``
   Número de consultas realizadas al servicio de OpenRouteService_.

.. _direccion:

``direccion``
   Almacena el resultado de una geocodificación. Si se realizó la consulta de la
   dirección postal de unas coordenadas contendrá una cadena; y, si se pretendió
   obtener las coordenadas de una dirección postal, el objeto GeoJSON_ con todas
   las localizaciones posibles.

.. _isocronas:

``isocronas``
   Array con las marcas que representan las áreas de los anillos que se forman
   entre isocronas. Tales marcas tienen asociadas mediante su atributo *feature*
   el objeto GeoJSON_ que define el área.

.. _ruta:

``ruta``
   Objeto que contiene dos atributos: *ruta.destino*, que es la marca de centro
   que se usó como destino de la ruta; y *ruta.layer* que es la capa que
   representa la ruta (la cual a su vez tendrá asociada en su atributo *feature*
   el objeto GeoJSON_ que define la ruta).

Métodos
=======

.. _agregarCentros():

``agregarCentros(datos)``
   Método apropiado para agregar los centros asociados a una especialidad. Los
   datos pueden ser el objeto GeoJSON_ o la dirección URL de la que descargar
   dicho objeto. Por tanto, para cargar una nueva especialidad basta:

   .. code-block:: js

      g.agregarCentros("json/590107.json");

   Ahora bien, de haber una especialidad previa, convendría antes eliminar todo
   lo que se hubiera hecho anteriormente:

   .. code-block:: js

      g.on("dataloaded", e => {
         console.log("Acabo de terminar de cargar los datos");
      });

      g.cluster.clearLayers();  // Eliminamos los anteriores centros.
      g.Centro.reset();         // Eliminamos correcciones aplicadas.
      g.setRuta(null);          // Eliminamos la ruta dibujada.
      g.seleccionado = null;    // Deseleccionamos el centro.

      // Cargamos unos nuevos datos.
      g.agregarCentros("json/590107.json");

   El fin de la carga de datos está asociado al evento dataloaded_.

.. _calcularOrigen():

``calcularOrigen()``
   Obtiene la dirección postal del origen, si de este sólo se conocen las
   coordenadas. La dirección se almacenará en ``g.origen.postal``. Es útil
   cuando el origen se ha obtenido pinchando sobre el mapa. En caso de que el
   origen se establezca escribiendo una dirección a través de la interfaz
   virtual, lo conveniente sería:

   - Utilizar `geoCodificar()`_ a partir de la dirección suministrada por el
     usuario, para obtener los distintos candidatos.

   - Permitir al usuario escoger uno de los candidatos, del cual se podrá
     obtener tanto las coordenadas como la dirección postal.

   - Usar `setOrigen()`_ para establecer el origen.

   - Fijar la dirección postal, haciendo:

     .. code-block:: js

        g.origen.postal = direccion_postal_del_candidato;

.. _geoCodificar():

``geoCodificar(query)``
   Obtiene la dirección postal de unas coordenadas, si se suministra un
   punto; o un objeto GeoJSON_ con posibles ubicaciones si se suministra una
   dirección. En el primer caso, el punto debe ser un objeto con los atributos
   *lat* y *lng*; y en el segundo, una cadena.

   La geocodificación tiene asociado el evento addressset_.

.. _getIcon():

``getIcon(estilo)``
   Devuelve la clase de icono cuyo nombre se especifica en el argumento:

   .. code-block:: js

      const Boliche = g,getIcon("boliche");

.. _getIsocronas():

``getIsocronas(maciza)``
   Si *maciza* es ``false`` (u otro valor evaluable a falso), devuelve un
   *array* con las capas que se dibujan al crear las isocronas. De lo contrario,
   devuelve un *array* con la definición en formato GeoJSON_ de las áreas que
   encierran las isocronas. Lo primero es útil si se quiere manipular desde la
   interfaz visual el dibujo de las isocronas (por ejemplo, asociando eventos de
   ratón a tales capas). Lo segundo es útil si se desea aplicar el filtro lejos_.

.. _setOrigen():

``setOrigen(latlng)``
   Establece el origen de los viajes en el punto pasado como argumento. La
   obtención del origen tiene asociado el evento originset_.

.. _getStatus():

``getStatus(extra)``
   Devuelve una cadena que describe el estado actual del mapa (centro, zoom,
   origen, isocronas, correcciones, filtros. etc.). La cadena es la
   codificación en base64 del objeto que devuelve el atributo *status*. El
   argumento extra deberá aportar las caracterísicas que depende de la interfaz
   y sobreescribirá las opciones incluidas dentro del atrbuto visual de dicho
   atributo.

   El retorno proporcionado por este método es apto como valor de la opción
   status que se puede pasar al crear el objeto_.

.. _setIcon():

``setIcon(estilo)``
   Define un nuevo estilo para el icono de las marcas de centro. El parámetro es
   una cadena con el nombre del nuevo estilo que puede ser:

   * *boliche*, que se el predeterminado.
   * *chupachups*, estilo alternativo al anterior, pero basado en *CSS* y mucho
     más sencillo.
   * *solicitud*, que es un estilo pensado para el futuro módulo de peticiones.

   El método modifica el estilo para todas las marcas y luego las redibuja. Si
   lo que se pretende es alterar el estilo de nuevas marcas que se añadan,
   entonces debería alterarse la opción *icon* del objeto_:

   .. code-block:: js

      g.options.icon = "solicitud";

   Y si se pretende alterar el estilo de una marca ya existente usar el meodo
   homónimo para la marca en particular:

   .. code-block:: js

      // centro es una marca que representa un centro concreto.
      const Icono = g.getIcon("solicitud");
      centro.setIcon(new Icono());

.. _setIsocronas():

``setIsocronas(point)``
   Genera las isocronas referidas al punto suministrado. Si no se suministra
   ninguno, se entiende que el punto es el origen del viaje, y si ``nul``, se
   eliminan las isocronas que pudieran haberse generado anterioremente. No puede
   haber más de un juego de isocronas

   La generación de las isocronas tiene asociado el evento isochroneset_.

.. _setRuta():

``setRuta(destino)``
   Calcula una ruta entre el origen de viajes y el centro de destino
   suministrado. Como argumento debe usarse la marca del centro. Si se
   proporciona ``null``, la ruta anteriomente calculada y dibujada, se elimina.

   La generación de la ruta tiene asociado el evento routeset_.

.. _setStatus():

``setStatus()``
   Aplica la configuración proporcionada a través de la opción *status* al crear
   el objeto. Sólo es necesario en caso de que se haya establecido la opción
   *autostatus* a ``false``.

Eventos
=======
Hay toda una serie de eventos asociados al objeto_ que pueden ayudarnos a
capturar acciones que se realizan sobre el mapa:

.. _dataloaded:

``dataloaded``
   Se desencadena al terminar de cargar los datos el método `agregarCentros()`_.

.. _markerselect:

``markerselect``
   Se desencadena al seleccionar o deseleccionar un centro. En el objeto de
   evento ``e.oldval`` y ``e.newval`` contienen respectivamente la marca
   anteriormente y posteriomente seleccionadas:

   .. code-block:: js

      g.on("markerselect", e => {
         if(e.oldval) {
            const nombre = e.oldval.getData().id.nom;
            console.log(`Antes tenía seleccionado el centro ${nombre}`);
         }
         if(e.newval) {
            const nombre = e.newval.getData().id.nom;
            console.log(`Acaba de seleccionar el centro ${nombre}`);
         }
      });

.. _addressset:

``addressset``
   Se desencadena tras resolver una geocodificación con OpenRouteService_ a
   través del método `geoCodificar()`_. ``e.newval`` contiene el resultado de la
   geocodificación.

.. _originset:

``originset``
   Se desencadena tras establecer un origen de viajes. Dispone de ``e.oldval`` y
   ``e.newval`` como el evento markerselect_.

.. _isochroneset:

``isochroneset``
   Se desencadena al terminar de generar un juego de isocronas a través del
   método `setIsocronas()`_. ``e.newval`` proporcionará el nuevo valor del
   atributo *isocronasi*.

.. _routeset:

``routeset``
   Se desencadena al terminar de generar la ruta entre el origen y el centro
   definido como destino mediante el método `setRuta()`_. ``e.newval``
   proporcionará el nuevo calor del atributo ruta.

.. _statuschange:

``statuschange``
   Se desencadena siempre que se lleva a cabo una acción que provoca un cambio
   en el mapa desde crear un origen o cambiar de zoom. Para conocer cuál es la
   acción, puede consultarse el atributo *attr* del evento:

   .. code-block:: js

      g.on("statuschange", e => console.log(`El culpable soy yo, ${e.attr}`));

.. _statusset:

``statusset``
   Se desencadena al acabar de aplicar el estado inicial del mapa. El evento
   dispone del atributo *status* para saber si se aplicó una configuración
   guardada.

Centro
******
Los centros son objetos de las características propias del tipo
`L.Marker.Mutable`_ que definen:


* Si el centro es el origen de los viajes tiene definido un evento adicional:

  .. _geocode:

  ``geocode``
      Se desencadena cuando se asigna valor al atributo *postal* de la marca:

      g.on("originset", e => {
         if(!e.newval) return;
         e.newval.once("geocode", f => {
            console.log(`Pues sí, estoy en '${f.newval}'`);
         });
      });


en concreto las
siguientes correcciones y filtros:

Correcciones
============
Se pueden definir correcciones bien sobre la **oferta**, bien las
**adjudicaciones**. 

Oferta
------

.. _bilingue:

``bilingue``
   Permite corregir las enseñanzas impartidas basándose en los planes de
   bilingüismo. Se aplica así:

   .. code-block:: js

      Centro.correct("bilingue", {
         bil: [ "Inglés", "Francés"],
         inv: false
      }):

   Su sentido es el de eliminar las enseñanzas que sean bilingües en alguno de
   los idiomas mencionados. Este sentido se produce cuando no se incluye la
   opción *inv* o se hace con un valor falso. Añadir *inv* con valor true
   implica invertir el significado, por lo que en este caso concreto:

   .. code-block:: js

      Centro.correct("bilingue", {
         bil: [ "Inglés", "Francés"],
         inv: true
      }):

   significa no eliminar las enseñanzas que sean bilingües en inglés o francés.

   .. note:: Hay otras correcciones que admiten la opción inv como inversor de
      significado. Se notará a partir de ahora incluyéndola como en el primer
      ejemplo con su valor a ``false``, pero sin detallar más para no resultar
      tedioso.

   Si se añade un añade un tercer argumento ``true``:

   .. code-block:: js

      Centro.correct("bilingue", {
         bil: [ "Inglés", "Francés"],
         inv: false
      }, true):

   lanza automáticamente una corrección adjpue_ que elimina los puestos
   bilingües asociados.

   .. note:: A partir de ahora, si la corrección es capaz de lanzar
      automáticamente alguna otra, se notará este hecho incluyendo im tercer
      argumento ``false``.

.. _ofens:

   Elimina las enseñanzas que se sumunistran:

   .. code-block:: js

      Centro.correct("ofens", {
         ens: ["23GMSMR168", "23GSASI820"],
         inv: false
      }, false);

   En este caso, se eliminarán de las oferta de cada centro las enseñanzas
   con esos dos códigos.

   Si se habilita el encadenamiento, se lanzará una corrección adjpue_ que
   elimina los puestos que sólo puedan impartir clase en las enseñanzas
   eliminadas.

.. _deseable:

``deseable``
   Elimina enseñanzas no desables, que son aquellas no marcadas como preferentes
   en la base de datos. Por ejemplo, para una especialidad como Matemáticas
   los bachilleratos (frente a la enseñanza secundaria):

   .. code-block:: js

      Centro.conrrect("deseable", {});

   .. note:: En realidad, la corrección está implementada como una una
      corrección que no filtra nada, sino que lanza automáticamente una
      corrección ofens_. No es necesario añadir el tercer argumentoa true,
      porque el encadenamiento se lanza automáticamente.``

.. _turno:

``turno``
   Elimina enseñanzas que sean del turno indicado, de manera que **1**
   representa la mañana, y **2** la tarde:

   .. code-block:: js

      Centro.correct("turno", {
         turno : 1,
         inv: false
      });

   En este caso, se eliminan las enseñanzas que se impartan por la mañana.

.. _nueva:

``nueva``
   Elimina enseñanzas que no sean de nueva implantación:

   .. code-block:: js

      Centro.correct("nueva", {});

Adjudicaciones
--------------

.. _vt+:

``vt+``
   Agrega a las adjudicaciones del procedimiento, las aparecidas en septiembre
   como consecuencia del aumento en las plantillas de funcionamiento. Son las
   que se notan como telefónicas en la aplicación. No requiere opciones:

   .. code-block:: js

      Centro.correct("vt+", {});

.. _adjpue:

``adjpue``
   Elimina adjudicaciones según el puesto. En este caso:

   .. code-block:: js

      Centro.correct("adj", {
         puesto: [ "00590059", "11590107" ],
         inv: false
      });

   elimina las adjudicaciones que sean de los puestos *00590059* y *11590107*.

.. _vt:

``vt``
   Elimina adjudicaciones que no hayan sido telefónicas:

   .. code-block:: js

      Centro.correct("vt", {});

.. _adjref:

``adjref``
   Elimina las adjudicaciones hechas a adjudicatarios con mayor prioridad que el
   adjudicatario que se proporciona como referencia. Para establecer este
   referente se proporcionan tres opciones:

   * *col*, que representa el colectivo, según la letra que tiene asignada
     (véase el GeoJSON_ de datos_).

   * *ts*, que es el tiempo de servicio del funcionario y se expresa como un
     *array* de tres enteros (``[años, meses, días]``). Si no se proporciona
     este tiempo para los funcionarios no interinos, se estima basándose en el
     escalafón.

   * *esc*, que es el número de escalafón de los funcionarios de carrera y en
     prácticas.

   Por ejemplo:

   .. code-block:: js

      Centro.correct("adjref", {
         colectivo: "DB",  // Funcioanrio con comisión de servicios.
         esc: 20041111,
         ts: [9, 10, 2]
      });
      
.. note:: Recuerde que la aplicación y desaplicación de correcciones tiene
   asociados eventos. Consulte `estos eventos en la documentación de
   Leaflet.mutatismutandis
   <https://github.com/sio2sio2/leaflet.mutatismutandis#api-para-correcciones>`_

Filtros
=======
Hay definidos los siguientes filtros:

.. _adj:

``adj``
   Elimina centros que se tengan menos de un determinado número de
   adjudicaciones. Requiere pasar el atributo *min*:

   .. code-block:: js

      g.Centro.filter("adj", {min: 1});

   En este caso, se filtrarán los centros sin ninguna adjudicación.

.. _oferta:

``oferta``
   Elimina centros que se hayan quedado con menos de un determinado número de
   enseñanzas. Se usa exactamente del mismo modo que el anterior:

   .. code-block:: js

      g.Centro.filter("oferta", {min: 1});

.. _tipo:

``tipo``
   Elimina centros según su dificultad, que puede ser normal, compensataria (1)
   dificil [desempeño] (2). Debe pasársele un atributo *tipo* cuyo valor debe
   ser la suma de los tipos de centro que se quieren filtrar:

   .. code-block:: js

      g.Centro.filter("tipo", {tipo: 1});  // Filtra de compensatoria.
      g.Centro.filter("tipo", {tipo: 2});  // Filtra de difícil desempeño.
      g.Centro.filter("tipo", {tipo: 3});  // Filtra de ambos tipos.

   Es posible añadir la atributo *inv* para invertir el sentido del filtro:

   .. code-block:: js

      g.Centro.filter("tipo", {tipo: 3, inv: true});  // Filtra centros normales.

.. _lejos:

``lejos``
   Elimina centros que se encuentren fuera de una determinada área. El nombre
   deriva de que se aplica a las áreas que encierran las isocronas y, en
   consecuencia, filtra centros más lejano en tiempo al que define la isocrona.
   Puede aplicarse pasando un *area* en formato GeoJSON_:

   .. code-block:: js

      const iso20 = g.getIsocronas(true)[1];  // // Área que encierra la isocrona de 20 min
      g.Centro.filter("lejos", {area: iso20}); // Filtro centros alejados en más de 20 min


.. note::  Recuerde que la aplicación y desaplicación de filtros tiene
   asociados eventos. Consulte `estos eventos en la documentación de
   Leaflet.mutatismutandis
   <https://github.com/sio2sio2/leaflet.mutatismutandis#api-para-filtros>`_

Peticiones de destino
*********************
Para facilitar la creación de una lista de peticiones el objeto_ de acceso al
mapa y las marcas de centro añaden algunos atributos y eventos; y se crea un
nuevo tipo de marcas mutables (Localidad_) y un nuevo tipo de `objeto
solicitud`_.

Objeto_ de manipulación del mapa
================================

Atributos
---------

.. _mode:

``mode``
   Modo de trabajo. Hay definidos dos:
  
   * el modo «*normal*», que provoca que un click de ratón sobre la marca de
     un centro lo seleccione; y
    
   * el modo «solicitud», que en vez de seleccionar el centro, lanza el evento
     requestclick_. En este segundo modo, el evento también se lanza cuando se
     hace click sobre la marca de una localidad_.

   .. note:: Esto es cierto siempre que la opción *light* del objeto sea
      verdadera. Si no es el caso, no hay ninguna acción asociada al click sobre
      el centro.
   
   .. note:: Pulsar sobre un centro en modo "solicitud", no provoca ningún
      cambio en la lista de peticiones: sólo desencadena el método requestclick_.

.. _solicitud:

``solicitud``
   Objeto que permite manipular la lista de peticiones. Tiene sus propios
   métodos y atributos que será necesario conocer si se implementa la solicitud
   de centros. Por ejemplo, esta orden:

   .. code-block:: js

      g.solicitud.add(11004866);

   añade al final de la lista de peticiones el centro con el código indicado.

``Localidad``
   Tipo de Marca mutable, análoga a Centro_, para representar localidades:

   .. code-block:: js

      g.Localidad.store.length;  // Cantidad de localidad cargadas.

   Más adelante volveremos a tratar Localidad_.

Eventos
-------

.. _modeset:

``modeset``
   Se lanza cuando cambia el modo de trabajo. Como en otros tipos de eventos, el
   objeto evento guarda en el atributo *oldval* el modo viejo y en *newval* el
   nuevo:

   .. code-block:: js

      g.on("modeset", e => {
         if(e.oldval !== e.newval) {
            console.log(`Ha pasado de ${e.oldval} a ${e.newval}`);
         }
      });
   
.. _requestclick:

``requestclick``
   Se lanza cada vez que se pulsa un centro o localidad en el
   modo "solicitud" (y la opción *light* sea ``true``). El evento añade el
   atributo *marker* que identifica la marca sobre la que se ha pulsado:

   .. code-block:: js

      g.on("requestclick", e => {
         const data = e.marker.getData(),
               nombre = data.nom?data.nom:data.id.nom;

         console.log("Parece que quiere pedir", nombre);
      });

.. _requestset:

``requestset``
   Se lanza cada vez que un centro modifica su atributo de petición. El evento
   dispone de los atributos *oldval* y *newval* para conocer los valores de las
   peticiones; y *marker* para conocer cuál fue el centro que modificó el
   atributo:

   .. code-block:: js

      g.on("requestset", e => {
         const data = e.marker.getData(),
          nom = data.id?data.id.nom:data.nom;

         if(e.newval === 0) {
            console.log(`Deja de pedirse '${nom}'`);
         }
         else {
            console.log(`Se pide '${nom}' en la petición ${e.newval}`);
         }
      });

.. _requestchange:

``requestchange``
   Se lanza cada vez que se cambia la lista de peticiones. El evento dispone de
   un atributo markers que es un array que contiene todas las marcas de los
   centros y localidades que han modificado su valor.

   .. note:: Advierta que cuando se provoca un cambio en la lista, este evento
      se desencadena una vez y el anterior lo hace tantas veces como cuentros
      hayan modificado su petición.

.. _locloaded:

``locloaded``
   Se lanza cuando acaban de cargarse las localidades de su archivo GeoJSON_
   correspondiente:

   .. code-block:: js

      g.on("locloaded", e => {
         console.log(`Las ${g.Localidad.store.length} localidades ya están disponibles`);
      });

Centro
======
Se define el estilo de icono "*solicitud*", distinto radicalmente al estilo
"boliche", y que sólo muestra como dato relevante el número de **petición**.

.. _peticion:

Además, los datos incorporan uno llamado *petición*, que indica en que posición
se ha pedido el centro. Si el centro no está pedido, vale 0, que es el valor
asignado en un comienzo a todos los centros:

.. code-block:: js

   const centro = g.Centro.get(21002100);
   centro.getData().peticion > 0  // true, si el centro se ha solicitado.

Para posibilitar el **filtrado** de centros según se soliciten, se añade el
filtro:

.. _solicitado:

``solicitado``

   Elimina los centros que se hayan solicitado, a menos que se incluya la opción
   *inv* como ``true``, en cuyo caso tendrá el sentido contrario:

   .. code-block:: js

      g.Centro.filter("solicitado", {});  // Filtra los centros solicitados.

Objeto solicitud
================
El objeto solicitud enganchado al objeto_ de manipulación del mapa presenta la
siguiente *API*:

Atributos
---------
.. _list:

``list``
   *Array* con los códigos de los centros y localidades solicitadas. En el caso
   de los centros el código se muestra como una cadena de 9 caracteres el último
   de los cuales es el carácter *C*; y en el caso de las localidad_\ es, como una
   cadena de 10 caracteres el último de los cuales es el carácter *L*.

``BolicheIcono``
   Devuelve el icono del *boliche*. Por tanto:

   .. code-block:: js

      g.getIcon("boliche") === g.solicitud.BolicheIcono  // true

``SolicitudIcono``
   Devuelve el icono de *solicitud*. Por tanto:

Métodos
-------
.. warning:: Cuando un método acepta como argumento un centro o localidad,
   admite el código numérico, el código de cadena y el código normalizado (el
   que acaba en "*C*" o "*L*").

.. _add():

``add(centro|localidad)``
   Añade el centro (o localidad) suministrado al final de la lista de
   peticiones. El argumento puede ser el código (en cualquiera de sus tres
   versiones) o el objeto marca que lo representa en el mapa.

   Si la adición tiene éxito, devuelve el propio centro; en caso contrario (p.e.
   porque el centro no existe o porque ya se encontraba en la lista, devuelve
   ``null``).

   .. code-block:: js

      g.solicitud.add(11004866);
      g.solicitud.add(21002100);
      g.solicitud.add("23001111C");
      g.solicitud.add(g.Centro.get(11700603));
      g.solicitud.list;  // Devuelve ["11004866C", "21002100C", "23001111C", "11700603C"]

.. _getCentro():

``getCentro(pos)``
   Devuelve la marca del centro (o localidad) que ocupa la posición *pos* en la
   lista de peticiones. Devuelve ``null``, si la posición no existe:

   .. code-block:: js

      const centro = g.solicitud.getCentro(1);
      centro.getData().id.cod;  // Devuelve 11004866

.. _getPosition():

``getPosition(centro|localidad)``
   Devuelve la posición en la lista de peticiones del centro (o localidad)
   suministrado. Si no se encuentra el centro, se devuelve **0**:

   .. code-block:: js

      g.solicitud.getPosition(11004866);  // Devuelve 1.

.. _remove():

``remove(centro|localidad)``
   Elimina el centro solicitado de la lista de peticiones. Devuelve un *array* con
   todos los centros afectados, esto es, un array que contiene el propio centro
   y todos los posteriores:

   .. code-block:: js

      g.solicitud.remove(23001111);
      g.solicitud.list;  // Devuelve ["11004866C", "21002100C", "11700603C"]

.. _delete():

``delete(pos, cuantos)``
   Elimina de la listas tantos centros (o localidades) como se especifique en
   cuántos a partir de la posición indicada. Si no se especifica cuántos, borra
   hasta el final de la lista:

   .. code-block:: js

      g.solicitud.delete(2, 2);
      g.solicitud.list;  // Devuelve ["11004866C", "11700603C"]

   Devuelve un array con las marcas de los centros afectados por la eliminación,
   o sea, los eliminados y todos los que iban por detrás en lista de peticiones.

.. _insert():

``insert(centro, pos)``
   Agrega un centro (o localidad) en la posición indicada de la lista de
   peticiones. Devuelve un *array* con las marcas de los centros afectados por
   la eliminación:

   .. code-block:: js

      g.solicitud.insert(11004039, 3);

.. _move():

``move(pos1. pos2, cuantos)``
   Mueve tantos centros como especifique cuantos desde la *pos1* a la posición
   necesaria para que se inserten antes del que ocupa la *pos2*:

   .. code-block:: js

      g.solicitud.list;  // Devuelve ["11004866C", "21002100C", "23001111C", "11700603C"]
      g.solicitud.move(1, 4, 2);
      g.solicitud.list;  // Devuelve ["23001111C", "11004866C", "21002100C", "11700603C"]

   Devuelve, como el resto de métodos, un *array* con todos los centros.

.. note:: Todos los métodos que alteran la lista de peticiones, se encargan de
   modificar el atributo peticion_ de los datos de cada centro que sufre cambios
   en su número de petición. También alteran el valor de *status* para incorporar
   la nueva lista.

.. note:: La lista de peticiones se conserva, aunque se cambie de especialidad.
   Los centros solicitados que en la nueva especialidad no existan, carecerán de
   marca, por lo que internamente se almacenará para ellos no una marca, sino el
   código correspondiente. Esto tiene repercusión en los valores de retorno de
   aquellos métodos que devuelven las marcas de los centros afectados por un
   cambio en la lista, ya que consecuentemente no devolverán las marcas de estos
   centros inexistentes, sino sus códigos normalizados.

Localidad
=========
Como además de pedirse centros pueden pedirse localidades, el objeto incorpora
también este tipo de marca mutable cuya única opción de dibujo depende de si la
localidad se pidió o no. De modo análogo a Centro_ incorpora un método:

``get(codigo)``
   Obtiene la marca correspondiente a partir de su código, en cualquiera de las
   tres versiones posibles:

   .. code-block:: js

      jerez = g.Localidad.get(110200014);
      jerez = g.Localidad.get("110200014");
      jerez = g.Localidad.get("110200014L");

Además, también como se hace con Centro, se incorporta un *getter* a los datos
que proporciona el código normalizado:

.. code-block:: js

   jerez.getData().cod;     // Devuelve 110200014
   jerez.getData().codigo;  // Devuelve 110200014L

Estas localidades se cargan en la propia capa cluster a partir de un archivo
GeoJSON_ con el siguiente aspecto:

.. code-block:: json

   {
      "type": "FeatureCollection",
      "features": [
         {
            "type": "Feature",
            "geometry": {
               "type": "Point",
               "coordinates": [-6.116667, 36.7]
            },
            "properties": {
               "nom": "Jerez de la Frontera",
               "cod": "110200014"
            }
         },
         {
            "type": "Feature",
            "geometry": {
               "type": "Point",
               "coordinates": [-5.983333, 37.383333]
            },
            "properties": {
               "nom": "Sevilla",
               "cod": "410910002"
            }
         }
      ]
   }

Como se observa, los únicos datos de interés de cada localidad son sus
coordenadas, su nombre y su código.

Las localidades sólo tiene habilitados dos **filtros**:

.. _invisible:

``invisible``
   Filtra todas las localidades indiscriminadamente:

   .. code-block:: js
   
      g.Localidad.filter("invisiable", {});

   Este filtro es el responsable de que no se vea ningún centro al abrir el
   mapa, ya que está aplicado por defecto,

``solicitado``
   Filtro análogo al homónimo solicitado_ de Centro_, por lo que filtra las
   localidades que hayan sido solicitadas.

Recetas
=======
Cambiar icono al solicitar centro
---------------------------------
.. code-block:: js

   g.on("requestset", e => {
      e.marker.refresh();
      if(e.marker instanceof e.target.Centro) {
         // Solo si pasa de pedido a no pedido
         // o viceversa debe cambiarse el icono.
         if(!!e.newval !== !!e.oldval) {
            const tipo = e.newval === 0?"BolicheIcono":"SolicitudIcono",
                  Icono = e.target.solicitud[tipo];

            Icono.onready(() => e.marker.setIcon(new Icono()));
         }
      }
   });

Ocultar centros filtrados
-------------------------
.. code-block:: js

   g.Centro.filter("solicitado", {});

Mostrar localidades sin bloquear la interfaz
--------------------------------------------
.. code-block:: js

   g.Centro.unfilter("invisible");
   g.Centro.invoke("refresh", g.progressBar);

.. [#] Lo cual no significa que devuelve todas las marcas de centro, ya que
   puede haber centros que no se encuentren sobre el mapa porque hayan ido
   desaparecido al filtrarse. Para obtener todos los centros necesitaría
   recurrir a ``g.Centro.store``.

.. [#] Los códigos normalizados son cadenas de ocho dígitos y una letra "C" para
   centros y nuevo dígitos y una letra "L" para localidades.

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
