(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("leaflet"));
	else if(typeof define === 'function' && define.amd)
		define("lobaton", ["leaflet"], factory);
	else if(typeof exports === 'object')
		exports["lobaton"] = factory(require("leaflet"));
	else
		root["lobaton"] = factory(root["L"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_leaflet__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@turf/area/index.js":
/*!******************************************!*\
  !*** ./node_modules/@turf/area/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = __webpack_require__(/*! @turf/meta */ "./node_modules/@turf/meta/index.js");
// Note: change RADIUS => earthRadius
var RADIUS = 6378137;
/**
 * Takes one or more features and returns their area in square meters.
 *
 * @name area
 * @param {GeoJSON} geojson input GeoJSON feature(s)
 * @returns {number} area in square meters
 * @example
 * var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
 *
 * var area = turf.area(polygon);
 *
 * //addToMap
 * var addToMap = [polygon]
 * polygon.properties.area = area
 */
function area(geojson) {
    return meta_1.geomReduce(geojson, function (value, geom) {
        return value + calculateArea(geom);
    }, 0);
}
exports.default = area;
/**
 * Calculate Area
 *
 * @private
 * @param {Geometry} geom GeoJSON Geometries
 * @returns {number} area
 */
function calculateArea(geom) {
    var total = 0;
    var i;
    switch (geom.type) {
        case "Polygon":
            return polygonArea(geom.coordinates);
        case "MultiPolygon":
            for (i = 0; i < geom.coordinates.length; i++) {
                total += polygonArea(geom.coordinates[i]);
            }
            return total;
        case "Point":
        case "MultiPoint":
        case "LineString":
        case "MultiLineString":
            return 0;
    }
    return 0;
}
function polygonArea(coords) {
    var total = 0;
    if (coords && coords.length > 0) {
        total += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
            total -= Math.abs(ringArea(coords[i]));
        }
    }
    return total;
}
/**
 * @private
 * Calculate the approximate area of the polygon were it projected onto the earth.
 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere",
 * JPL Publication 07-03, Jet Propulsion
 * Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * @param {Array<Array<number>>} coords Ring Coordinates
 * @returns {number} The approximate signed geodesic area of the polygon in square meters.
 */
function ringArea(coords) {
    var p1;
    var p2;
    var p3;
    var lowerIndex;
    var middleIndex;
    var upperIndex;
    var i;
    var total = 0;
    var coordsLength = coords.length;
    if (coordsLength > 2) {
        for (i = 0; i < coordsLength; i++) {
            if (i === coordsLength - 2) {
                lowerIndex = coordsLength - 2;
                middleIndex = coordsLength - 1;
                upperIndex = 0;
            }
            else if (i === coordsLength - 1) {
                lowerIndex = coordsLength - 1;
                middleIndex = 0;
                upperIndex = 1;
            }
            else {
                lowerIndex = i;
                middleIndex = i + 1;
                upperIndex = i + 2;
            }
            p1 = coords[lowerIndex];
            p2 = coords[middleIndex];
            p3 = coords[upperIndex];
            total += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
        }
        total = total * RADIUS * RADIUS / 2;
    }
    return total;
}
function rad(num) {
    return num * Math.PI / 180;
}


/***/ }),

/***/ "./node_modules/@turf/boolean-point-in-polygon/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@turf/boolean-point-in-polygon/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var invariant_1 = __webpack_require__(/*! @turf/invariant */ "./node_modules/@turf/invariant/index.js");
// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
/**
 * Takes a {@link Point} and a {@link Polygon} or {@link MultiPolygon} and determines if the point
 * resides inside the polygon. The polygon can be convex or concave. The function accounts for holes.
 *
 * @name booleanPointInPolygon
 * @param {Coord} point input point
 * @param {Feature<Polygon|MultiPolygon>} polygon input polygon or multipolygon
 * @param {Object} [options={}] Optional parameters
 * @param {boolean} [options.ignoreBoundary=false] True if polygon boundary should be ignored when determining if
 * the point is inside the polygon otherwise false.
 * @returns {boolean} `true` if the Point is inside the Polygon; `false` if the Point is not inside the Polygon
 * @example
 * var pt = turf.point([-77, 44]);
 * var poly = turf.polygon([[
 *   [-81, 41],
 *   [-81, 47],
 *   [-72, 47],
 *   [-72, 41],
 *   [-81, 41]
 * ]]);
 *
 * turf.booleanPointInPolygon(pt, poly);
 * //= true
 */
function booleanPointInPolygon(point, polygon, options) {
    if (options === void 0) { options = {}; }
    // validation
    if (!point) {
        throw new Error("point is required");
    }
    if (!polygon) {
        throw new Error("polygon is required");
    }
    var pt = invariant_1.getCoord(point);
    var geom = invariant_1.getGeom(polygon);
    var type = geom.type;
    var bbox = polygon.bbox;
    var polys = geom.coordinates;
    // Quick elimination if point is not inside bbox
    if (bbox && inBBox(pt, bbox) === false) {
        return false;
    }
    // normalize to multipolygon
    if (type === "Polygon") {
        polys = [polys];
    }
    var insidePoly = false;
    for (var i = 0; i < polys.length && !insidePoly; i++) {
        // check if it is in the outer ring first
        if (inRing(pt, polys[i][0], options.ignoreBoundary)) {
            var inHole = false;
            var k = 1;
            // check for the point in any of the holes
            while (k < polys[i].length && !inHole) {
                if (inRing(pt, polys[i][k], !options.ignoreBoundary)) {
                    inHole = true;
                }
                k++;
            }
            if (!inHole) {
                insidePoly = true;
            }
        }
    }
    return insidePoly;
}
exports.default = booleanPointInPolygon;
/**
 * inRing
 *
 * @private
 * @param {Array<number>} pt [x,y]
 * @param {Array<Array<number>>} ring [[x,y], [x,y],..]
 * @param {boolean} ignoreBoundary ignoreBoundary
 * @returns {boolean} inRing
 */
function inRing(pt, ring, ignoreBoundary) {
    var isInside = false;
    if (ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) {
        ring = ring.slice(0, ring.length - 1);
    }
    for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        var xi = ring[i][0];
        var yi = ring[i][1];
        var xj = ring[j][0];
        var yj = ring[j][1];
        var onBoundary = (pt[1] * (xi - xj) + yi * (xj - pt[0]) + yj * (pt[0] - xi) === 0) &&
            ((xi - pt[0]) * (xj - pt[0]) <= 0) && ((yi - pt[1]) * (yj - pt[1]) <= 0);
        if (onBoundary) {
            return !ignoreBoundary;
        }
        var intersect = ((yi > pt[1]) !== (yj > pt[1])) &&
            (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
        if (intersect) {
            isInside = !isInside;
        }
    }
    return isInside;
}
/**
 * inBBox
 *
 * @private
 * @param {Position} pt point [x,y]
 * @param {BBox} bbox BBox [west, south, east, north]
 * @returns {boolean} true/false if point is inside BBox
 */
function inBBox(pt, bbox) {
    return bbox[0] <= pt[0] &&
        bbox[1] <= pt[1] &&
        bbox[2] >= pt[0] &&
        bbox[3] >= pt[1];
}


/***/ }),

/***/ "./node_modules/@turf/difference/index.js":
/*!************************************************!*\
  !*** ./node_modules/@turf/difference/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var martinez = __webpack_require__(/*! martinez-polygon-clipping */ "./node_modules/martinez-polygon-clipping/dist/martinez.umd.js");
var area = _interopDefault(__webpack_require__(/*! @turf/area */ "./node_modules/@turf/area/index.js"));
var helpers = __webpack_require__(/*! @turf/helpers */ "./node_modules/@turf/helpers/index.js");
var invariant = __webpack_require__(/*! @turf/invariant */ "./node_modules/@turf/invariant/index.js");
var meta = __webpack_require__(/*! @turf/meta */ "./node_modules/@turf/meta/index.js");

/**
 * Finds the difference between two {@link Polygon|polygons} by clipping the second polygon from the first.
 *
 * @name difference
 * @param {Feature<Polygon|MultiPolygon>} polygon1 input Polygon feature
 * @param {Feature<Polygon|MultiPolygon>} polygon2 Polygon feature to difference from polygon1
 * @returns {Feature<Polygon|MultiPolygon>|null} a Polygon or MultiPolygon feature showing the area of `polygon1` excluding the area of `polygon2` (if empty returns `null`)
 * @example
 * var polygon1 = turf.polygon([[
 *   [128, -26],
 *   [141, -26],
 *   [141, -21],
 *   [128, -21],
 *   [128, -26]
 * ]], {
 *   "fill": "#F00",
 *   "fill-opacity": 0.1
 * });
 * var polygon2 = turf.polygon([[
 *   [126, -28],
 *   [140, -28],
 *   [140, -20],
 *   [126, -20],
 *   [126, -28]
 * ]], {
 *   "fill": "#00F",
 *   "fill-opacity": 0.1
 * });
 *
 * var difference = turf.difference(polygon1, polygon2);
 *
 * //addToMap
 * var addToMap = [polygon1, polygon2, difference];
 */
function difference(polygon1, polygon2) {
    var geom1 = invariant.getGeom(polygon1);
    var geom2 = invariant.getGeom(polygon2);
    var properties = polygon1.properties || {};

    // Issue #721 - JSTS/Martinez can't handle empty polygons
    geom1 = removeEmptyPolygon(geom1);
    geom2 = removeEmptyPolygon(geom2);
    if (!geom1) return null;
    if (!geom2) return helpers.feature(geom1, properties);

    var differenced = martinez.diff(geom1.coordinates, geom2.coordinates);
    if (differenced.length === 0) return null;
    if (differenced.length === 1) return helpers.polygon(differenced[0], properties);
    return helpers.multiPolygon(differenced, properties);
}

/**
 * Detect Empty Polygon
 *
 * @private
 * @param {Geometry<Polygon|MultiPolygon>} geom Geometry Object
 * @returns {Geometry<Polygon|MultiPolygon>|null} removed any polygons with no areas
 */
function removeEmptyPolygon(geom) {
    switch (geom.type) {
    case 'Polygon':
        if (area(geom) > 1) return geom;
        return null;
    case 'MultiPolygon':
        var coordinates = [];
        meta.flattenEach(geom, function (feature) {
            if (area(feature) > 1) coordinates.push(feature.geometry.coordinates);
        });
        if (coordinates.length) return {type: 'MultiPolygon', coordinates: coordinates};
    }
}

module.exports = difference;


/***/ }),

/***/ "./node_modules/@turf/helpers/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@turf/helpers/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module helpers
 */
/**
 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
 *
 * @memberof helpers
 * @type {number}
 */
exports.earthRadius = 6371008.8;
/**
 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.factors = {
    centimeters: exports.earthRadius * 100,
    centimetres: exports.earthRadius * 100,
    degrees: exports.earthRadius / 111325,
    feet: exports.earthRadius * 3.28084,
    inches: exports.earthRadius * 39.370,
    kilometers: exports.earthRadius / 1000,
    kilometres: exports.earthRadius / 1000,
    meters: exports.earthRadius,
    metres: exports.earthRadius,
    miles: exports.earthRadius / 1609.344,
    millimeters: exports.earthRadius * 1000,
    millimetres: exports.earthRadius * 1000,
    nauticalmiles: exports.earthRadius / 1852,
    radians: 1,
    yards: exports.earthRadius / 1.0936,
};
/**
 * Units of measurement factors based on 1 meter.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.unitsFactors = {
    centimeters: 100,
    centimetres: 100,
    degrees: 1 / 111325,
    feet: 3.28084,
    inches: 39.370,
    kilometers: 1 / 1000,
    kilometres: 1 / 1000,
    meters: 1,
    metres: 1,
    miles: 1 / 1609.344,
    millimeters: 1000,
    millimetres: 1000,
    nauticalmiles: 1 / 1852,
    radians: 1 / exports.earthRadius,
    yards: 1 / 1.0936,
};
/**
 * Area of measurement factors based on 1 square meter.
 *
 * @memberof helpers
 * @type {Object}
 */
exports.areaFactors = {
    acres: 0.000247105,
    centimeters: 10000,
    centimetres: 10000,
    feet: 10.763910417,
    inches: 1550.003100006,
    kilometers: 0.000001,
    kilometres: 0.000001,
    meters: 1,
    metres: 1,
    miles: 3.86e-7,
    millimeters: 1000000,
    millimetres: 1000000,
    yards: 1.195990046,
};
/**
 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
 *
 * @name feature
 * @param {Geometry} geometry input geometry
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature} a GeoJSON Feature
 * @example
 * var geometry = {
 *   "type": "Point",
 *   "coordinates": [110, 50]
 * };
 *
 * var feature = turf.feature(geometry);
 *
 * //=feature
 */
function feature(geom, properties, options) {
    if (options === void 0) { options = {}; }
    var feat = { type: "Feature" };
    if (options.id === 0 || options.id) {
        feat.id = options.id;
    }
    if (options.bbox) {
        feat.bbox = options.bbox;
    }
    feat.properties = properties || {};
    feat.geometry = geom;
    return feat;
}
exports.feature = feature;
/**
 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
 * For GeometryCollection type use `helpers.geometryCollection`
 *
 * @name geometry
 * @param {string} type Geometry Type
 * @param {Array<any>} coordinates Coordinates
 * @param {Object} [options={}] Optional Parameters
 * @returns {Geometry} a GeoJSON Geometry
 * @example
 * var type = "Point";
 * var coordinates = [110, 50];
 * var geometry = turf.geometry(type, coordinates);
 * // => geometry
 */
function geometry(type, coordinates, options) {
    if (options === void 0) { options = {}; }
    switch (type) {
        case "Point": return point(coordinates).geometry;
        case "LineString": return lineString(coordinates).geometry;
        case "Polygon": return polygon(coordinates).geometry;
        case "MultiPoint": return multiPoint(coordinates).geometry;
        case "MultiLineString": return multiLineString(coordinates).geometry;
        case "MultiPolygon": return multiPolygon(coordinates).geometry;
        default: throw new Error(type + " is invalid");
    }
}
exports.geometry = geometry;
/**
 * Creates a {@link Point} {@link Feature} from a Position.
 *
 * @name point
 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Point>} a Point feature
 * @example
 * var point = turf.point([-75.343, 39.984]);
 *
 * //=point
 */
function point(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "Point",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.point = point;
/**
 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
 *
 * @name points
 * @param {Array<Array<number>>} coordinates an array of Points
 * @param {Object} [properties={}] Translate these properties to each Feature
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Point>} Point Feature
 * @example
 * var points = turf.points([
 *   [-75, 39],
 *   [-80, 45],
 *   [-78, 50]
 * ]);
 *
 * //=points
 */
function points(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return point(coords, properties);
    }), options);
}
exports.points = points;
/**
 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
 *
 * @name polygon
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<Polygon>} Polygon Feature
 * @example
 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
 *
 * //=polygon
 */
function polygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
        var ring = coordinates_1[_i];
        if (ring.length < 4) {
            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
            // Check if first point of Polygon contains two numbers
            if (ring[ring.length - 1][j] !== ring[0][j]) {
                throw new Error("First and last Position are not equivalent.");
            }
        }
    }
    var geom = {
        type: "Polygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.polygon = polygon;
/**
 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
 *
 * @name polygons
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
 * @example
 * var polygons = turf.polygons([
 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
 * ]);
 *
 * //=polygons
 */
function polygons(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return polygon(coords, properties);
    }), options);
}
exports.polygons = polygons;
/**
 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
 *
 * @name lineString
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<LineString>} LineString Feature
 * @example
 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
 *
 * //=linestring1
 * //=linestring2
 */
function lineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    if (coordinates.length < 2) {
        throw new Error("coordinates must be an array of two or more positions");
    }
    var geom = {
        type: "LineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.lineString = lineString;
/**
 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
 *
 * @name lineStrings
 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
 * associated with the FeatureCollection
 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
 * @example
 * var linestrings = turf.lineStrings([
 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
 * ]);
 *
 * //=linestrings
 */
function lineStrings(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    return featureCollection(coordinates.map(function (coords) {
        return lineString(coords, properties);
    }), options);
}
exports.lineStrings = lineStrings;
/**
 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
 *
 * @name featureCollection
 * @param {Feature[]} features input features
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {FeatureCollection} FeatureCollection of Features
 * @example
 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
 *
 * var collection = turf.featureCollection([
 *   locationA,
 *   locationB,
 *   locationC
 * ]);
 *
 * //=collection
 */
function featureCollection(features, options) {
    if (options === void 0) { options = {}; }
    var fc = { type: "FeatureCollection" };
    if (options.id) {
        fc.id = options.id;
    }
    if (options.bbox) {
        fc.bbox = options.bbox;
    }
    fc.features = features;
    return fc;
}
exports.featureCollection = featureCollection;
/**
 * Creates a {@link Feature<MultiLineString>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiLineString
 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiLineString>} a MultiLineString feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
 *
 * //=multiLine
 */
function multiLineString(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiLineString",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiLineString = multiLineString;
/**
 * Creates a {@link Feature<MultiPoint>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPoint
 * @param {Array<Array<number>>} coordinates an array of Positions
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPoint>} a MultiPoint feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
 *
 * //=multiPt
 */
function multiPoint(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPoint",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiPoint = multiPoint;
/**
 * Creates a {@link Feature<MultiPolygon>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name multiPolygon
 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<MultiPolygon>} a multipolygon feature
 * @throws {Error} if no coordinates are passed
 * @example
 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
 *
 * //=multiPoly
 *
 */
function multiPolygon(coordinates, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "MultiPolygon",
        coordinates: coordinates,
    };
    return feature(geom, properties, options);
}
exports.multiPolygon = multiPolygon;
/**
 * Creates a {@link Feature<GeometryCollection>} based on a
 * coordinate array. Properties can be added optionally.
 *
 * @name geometryCollection
 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
 * @param {Object} [options={}] Optional Parameters
 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
 * @param {string|number} [options.id] Identifier associated with the Feature
 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
 * @example
 * var pt = turf.geometry("Point", [100, 0]);
 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
 * var collection = turf.geometryCollection([pt, line]);
 *
 * // => collection
 */
function geometryCollection(geometries, properties, options) {
    if (options === void 0) { options = {}; }
    var geom = {
        type: "GeometryCollection",
        geometries: geometries,
    };
    return feature(geom, properties, options);
}
exports.geometryCollection = geometryCollection;
/**
 * Round number to precision
 *
 * @param {number} num Number
 * @param {number} [precision=0] Precision
 * @returns {number} rounded number
 * @example
 * turf.round(120.4321)
 * //=120
 *
 * turf.round(120.4321, 2)
 * //=120.43
 */
function round(num, precision) {
    if (precision === void 0) { precision = 0; }
    if (precision && !(precision >= 0)) {
        throw new Error("precision must be a positive number");
    }
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(num * multiplier) / multiplier;
}
exports.round = round;
/**
 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name radiansToLength
 * @param {number} radians in radians across the sphere
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} distance
 */
function radiansToLength(radians, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = exports.factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return radians * factor;
}
exports.radiansToLength = radiansToLength;
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @name lengthToRadians
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} radians
 */
function lengthToRadians(distance, units) {
    if (units === void 0) { units = "kilometers"; }
    var factor = exports.factors[units];
    if (!factor) {
        throw new Error(units + " units is invalid");
    }
    return distance / factor;
}
exports.lengthToRadians = lengthToRadians;
/**
 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
 *
 * @name lengthToDegrees
 * @param {number} distance in real units
 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
 * meters, kilometres, kilometers.
 * @returns {number} degrees
 */
function lengthToDegrees(distance, units) {
    return radiansToDegrees(lengthToRadians(distance, units));
}
exports.lengthToDegrees = lengthToDegrees;
/**
 * Converts any bearing angle from the north line direction (positive clockwise)
 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
 *
 * @name bearingToAzimuth
 * @param {number} bearing angle, between -180 and +180 degrees
 * @returns {number} angle between 0 and 360 degrees
 */
function bearingToAzimuth(bearing) {
    var angle = bearing % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}
exports.bearingToAzimuth = bearingToAzimuth;
/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
function radiansToDegrees(radians) {
    var degrees = radians % (2 * Math.PI);
    return degrees * 180 / Math.PI;
}
exports.radiansToDegrees = radiansToDegrees;
/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
function degreesToRadians(degrees) {
    var radians = degrees % 360;
    return radians * Math.PI / 180;
}
exports.degreesToRadians = degreesToRadians;
/**
 * Converts a length to the requested unit.
 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
 *
 * @param {number} length to be converted
 * @param {Units} [originalUnit="kilometers"] of the length
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted length
 */
function convertLength(length, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "kilometers"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(length >= 0)) {
        throw new Error("length must be a positive number");
    }
    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
}
exports.convertLength = convertLength;
/**
 * Converts a area to the requested unit.
 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
 * @param {number} area to be converted
 * @param {Units} [originalUnit="meters"] of the distance
 * @param {Units} [finalUnit="kilometers"] returned unit
 * @returns {number} the converted distance
 */
function convertArea(area, originalUnit, finalUnit) {
    if (originalUnit === void 0) { originalUnit = "meters"; }
    if (finalUnit === void 0) { finalUnit = "kilometers"; }
    if (!(area >= 0)) {
        throw new Error("area must be a positive number");
    }
    var startFactor = exports.areaFactors[originalUnit];
    if (!startFactor) {
        throw new Error("invalid original units");
    }
    var finalFactor = exports.areaFactors[finalUnit];
    if (!finalFactor) {
        throw new Error("invalid final units");
    }
    return (area / startFactor) * finalFactor;
}
exports.convertArea = convertArea;
/**
 * isNumber
 *
 * @param {*} num Number to validate
 * @returns {boolean} true/false
 * @example
 * turf.isNumber(123)
 * //=true
 * turf.isNumber('foo')
 * //=false
 */
function isNumber(num) {
    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
}
exports.isNumber = isNumber;
/**
 * isObject
 *
 * @param {*} input variable to validate
 * @returns {boolean} true/false
 * @example
 * turf.isObject({elevation: 10})
 * //=true
 * turf.isObject('foo')
 * //=false
 */
function isObject(input) {
    return (!!input) && (input.constructor === Object);
}
exports.isObject = isObject;
/**
 * Validate BBox
 *
 * @private
 * @param {Array<number>} bbox BBox to validate
 * @returns {void}
 * @throws Error if BBox is not valid
 * @example
 * validateBBox([-180, -40, 110, 50])
 * //=OK
 * validateBBox([-180, -40])
 * //=Error
 * validateBBox('Foo')
 * //=Error
 * validateBBox(5)
 * //=Error
 * validateBBox(null)
 * //=Error
 * validateBBox(undefined)
 * //=Error
 */
function validateBBox(bbox) {
    if (!bbox) {
        throw new Error("bbox is required");
    }
    if (!Array.isArray(bbox)) {
        throw new Error("bbox must be an Array");
    }
    if (bbox.length !== 4 && bbox.length !== 6) {
        throw new Error("bbox must be an Array of 4 or 6 numbers");
    }
    bbox.forEach(function (num) {
        if (!isNumber(num)) {
            throw new Error("bbox must only contain numbers");
        }
    });
}
exports.validateBBox = validateBBox;
/**
 * Validate Id
 *
 * @private
 * @param {string|number} id Id to validate
 * @returns {void}
 * @throws Error if Id is not valid
 * @example
 * validateId([-180, -40, 110, 50])
 * //=Error
 * validateId([-180, -40])
 * //=Error
 * validateId('Foo')
 * //=OK
 * validateId(5)
 * //=OK
 * validateId(null)
 * //=Error
 * validateId(undefined)
 * //=Error
 */
function validateId(id) {
    if (!id) {
        throw new Error("id is required");
    }
    if (["string", "number"].indexOf(typeof id) === -1) {
        throw new Error("id must be a number or a string");
    }
}
exports.validateId = validateId;
// Deprecated methods
function radians2degrees() {
    throw new Error("method has been renamed to `radiansToDegrees`");
}
exports.radians2degrees = radians2degrees;
function degrees2radians() {
    throw new Error("method has been renamed to `degreesToRadians`");
}
exports.degrees2radians = degrees2radians;
function distanceToDegrees() {
    throw new Error("method has been renamed to `lengthToDegrees`");
}
exports.distanceToDegrees = distanceToDegrees;
function distanceToRadians() {
    throw new Error("method has been renamed to `lengthToRadians`");
}
exports.distanceToRadians = distanceToRadians;
function radiansToDistance() {
    throw new Error("method has been renamed to `radiansToLength`");
}
exports.radiansToDistance = radiansToDistance;
function bearingToAngle() {
    throw new Error("method has been renamed to `bearingToAzimuth`");
}
exports.bearingToAngle = bearingToAngle;
function convertDistance() {
    throw new Error("method has been renamed to `convertLength`");
}
exports.convertDistance = convertDistance;


/***/ }),

/***/ "./node_modules/@turf/invariant/index.js":
/*!***********************************************!*\
  !*** ./node_modules/@turf/invariant/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(/*! @turf/helpers */ "./node_modules/@turf/helpers/index.js");
/**
 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
 *
 * @name getCoord
 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
 * @returns {Array<number>} coordinates
 * @example
 * var pt = turf.point([10, 10]);
 *
 * var coord = turf.getCoord(pt);
 * //= [10, 10]
 */
function getCoord(coord) {
    if (!coord) {
        throw new Error("coord is required");
    }
    if (!Array.isArray(coord)) {
        if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
            return coord.geometry.coordinates;
        }
        if (coord.type === "Point") {
            return coord.coordinates;
        }
    }
    if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
        return coord;
    }
    throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
exports.getCoord = getCoord;
/**
 * Unwrap coordinates from a Feature, Geometry Object or an Array
 *
 * @name getCoords
 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
 * @returns {Array<any>} coordinates
 * @example
 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
 *
 * var coords = turf.getCoords(poly);
 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
 */
function getCoords(coords) {
    if (Array.isArray(coords)) {
        return coords;
    }
    // Feature
    if (coords.type === "Feature") {
        if (coords.geometry !== null) {
            return coords.geometry.coordinates;
        }
    }
    else {
        // Geometry
        if (coords.coordinates) {
            return coords.coordinates;
        }
    }
    throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
}
exports.getCoords = getCoords;
/**
 * Checks if coordinates contains a number
 *
 * @name containsNumber
 * @param {Array<any>} coordinates GeoJSON Coordinates
 * @returns {boolean} true if Array contains a number
 */
function containsNumber(coordinates) {
    if (coordinates.length > 1 && helpers_1.isNumber(coordinates[0]) && helpers_1.isNumber(coordinates[1])) {
        return true;
    }
    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
        return containsNumber(coordinates[0]);
    }
    throw new Error("coordinates must only contain numbers");
}
exports.containsNumber = containsNumber;
/**
 * Enforce expectations about types of GeoJSON objects for Turf.
 *
 * @name geojsonType
 * @param {GeoJSON} value any GeoJSON object
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function geojsonType(value, type, name) {
    if (!type || !name) {
        throw new Error("type and name required");
    }
    if (!value || value.type !== type) {
        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + value.type);
    }
}
exports.geojsonType = geojsonType;
/**
 * Enforce expectations about types of {@link Feature} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name featureOf
 * @param {Feature} feature a feature with an expected geometry type
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} error if value is not the expected type.
 */
function featureOf(feature, type, name) {
    if (!feature) {
        throw new Error("No feature passed");
    }
    if (!name) {
        throw new Error(".featureOf() requires a name");
    }
    if (!feature || feature.type !== "Feature" || !feature.geometry) {
        throw new Error("Invalid input to " + name + ", Feature with geometry required");
    }
    if (!feature.geometry || feature.geometry.type !== type) {
        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
    }
}
exports.featureOf = featureOf;
/**
 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
 * Internally this uses {@link geojsonType} to judge geometry types.
 *
 * @name collectionOf
 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
 * @param {string} type expected GeoJSON type
 * @param {string} name name of calling function
 * @throws {Error} if value is not the expected type.
 */
function collectionOf(featureCollection, type, name) {
    if (!featureCollection) {
        throw new Error("No featureCollection passed");
    }
    if (!name) {
        throw new Error(".collectionOf() requires a name");
    }
    if (!featureCollection || featureCollection.type !== "FeatureCollection") {
        throw new Error("Invalid input to " + name + ", FeatureCollection required");
    }
    for (var _i = 0, _a = featureCollection.features; _i < _a.length; _i++) {
        var feature = _a[_i];
        if (!feature || feature.type !== "Feature" || !feature.geometry) {
            throw new Error("Invalid input to " + name + ", Feature with geometry required");
        }
        if (!feature.geometry || feature.geometry.type !== type) {
            throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
        }
    }
}
exports.collectionOf = collectionOf;
/**
 * Get Geometry from Feature or Geometry Object
 *
 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
 * @returns {Geometry|null} GeoJSON Geometry Object
 * @throws {Error} if geojson is not a Feature or Geometry Object
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getGeom(point)
 * //={"type": "Point", "coordinates": [110, 40]}
 */
function getGeom(geojson) {
    if (geojson.type === "Feature") {
        return geojson.geometry;
    }
    return geojson;
}
exports.getGeom = getGeom;
/**
 * Get GeoJSON object's type, Geometry type is prioritize.
 *
 * @param {GeoJSON} geojson GeoJSON object
 * @param {string} [name="geojson"] name of the variable to display in error message
 * @returns {string} GeoJSON type
 * @example
 * var point = {
 *   "type": "Feature",
 *   "properties": {},
 *   "geometry": {
 *     "type": "Point",
 *     "coordinates": [110, 40]
 *   }
 * }
 * var geom = turf.getType(point)
 * //="Point"
 */
function getType(geojson, name) {
    if (geojson.type === "FeatureCollection") {
        return "FeatureCollection";
    }
    if (geojson.type === "GeometryCollection") {
        return "GeometryCollection";
    }
    if (geojson.type === "Feature" && geojson.geometry !== null) {
        return geojson.geometry.type;
    }
    return geojson.type;
}
exports.getType = getType;


/***/ }),

/***/ "./node_modules/@turf/meta/index.js":
/*!******************************************!*\
  !*** ./node_modules/@turf/meta/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var helpers = __webpack_require__(/*! @turf/helpers */ "./node_modules/@turf/helpers/index.js");

/**
 * Callback for coordEach
 *
 * @callback coordEachCallback
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

/**
 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
 *
 * @name coordEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function coordEach(geojson, callback, excludeWrapCoord) {
    // Handles null Geometry -- Skips this GeoJSON
    if (geojson === null) return;
    var j, k, l, geometry, stopG, coords,
        geometryMaybeCollection,
        wrapShrink = 0,
        coordIndex = 0,
        isGeometryCollection,
        type = geojson.type,
        isFeatureCollection = type === 'FeatureCollection',
        isFeature = type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
            (isFeature ? geojson.geometry : geojson));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
            var multiFeatureIndex = 0;
            var geometryIndex = 0;
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

            // Handles null Geometry -- Skips this geometry
            if (geometry === null) continue;
            coords = geometry.coordinates;
            var geomType = geometry.type;

            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

            switch (geomType) {
            case null:
                break;
            case 'Point':
                if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                coordIndex++;
                multiFeatureIndex++;
                break;
            case 'LineString':
            case 'MultiPoint':
                for (j = 0; j < coords.length; j++) {
                    if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                    coordIndex++;
                    if (geomType === 'MultiPoint') multiFeatureIndex++;
                }
                if (geomType === 'LineString') multiFeatureIndex++;
                break;
            case 'Polygon':
            case 'MultiLineString':
                for (j = 0; j < coords.length; j++) {
                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
                        if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                        coordIndex++;
                    }
                    if (geomType === 'MultiLineString') multiFeatureIndex++;
                    if (geomType === 'Polygon') geometryIndex++;
                }
                if (geomType === 'Polygon') multiFeatureIndex++;
                break;
            case 'MultiPolygon':
                for (j = 0; j < coords.length; j++) {
                    geometryIndex = 0;
                    for (k = 0; k < coords[j].length; k++) {
                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                            if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
                            coordIndex++;
                        }
                        geometryIndex++;
                    }
                    multiFeatureIndex++;
                }
                break;
            case 'GeometryCollection':
                for (j = 0; j < geometry.geometries.length; j++)
                    if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;
                break;
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
    }
}

/**
 * Callback for coordReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback coordReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Array<number>} currentCoord The current coordinate being processed.
 * @param {number} coordIndex The current index of the coordinate being processed.
 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 */

/**
 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
 *
 * @name coordReduce
 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentCoord
 *   //=coordIndex
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentCoord;
 * });
 */
function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
    var previousValue = initialValue;
    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
    }, excludeWrapCoord);
    return previousValue;
}

/**
 * Callback for propEach
 *
 * @callback propEachCallback
 * @param {Object} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
 *
 * @name propEach
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentProperties, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propEach(features, function (currentProperties, featureIndex) {
 *   //=currentProperties
 *   //=featureIndex
 * });
 */
function propEach(geojson, callback) {
    var i;
    switch (geojson.type) {
    case 'FeatureCollection':
        for (i = 0; i < geojson.features.length; i++) {
            if (callback(geojson.features[i].properties, i) === false) break;
        }
        break;
    case 'Feature':
        callback(geojson.properties, 0);
        break;
    }
}


/**
 * Callback for propReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback propReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {*} currentProperties The current Properties being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Reduce properties in any GeoJSON object into a single value,
 * similar to how Array.reduce works. However, in this case we lazily run
 * the reduction, so an array of all properties is unnecessary.
 *
 * @name propReduce
 * @param {FeatureCollection|Feature} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
 *   //=previousValue
 *   //=currentProperties
 *   //=featureIndex
 *   return currentProperties
 * });
 */
function propReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    propEach(geojson, function (currentProperties, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
        else previousValue = callback(previousValue, currentProperties, featureIndex);
    });
    return previousValue;
}

/**
 * Callback for featureEach
 *
 * @callback featureEachCallback
 * @param {Feature<any>} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Iterate over features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name featureEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.featureEach(features, function (currentFeature, featureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 * });
 */
function featureEach(geojson, callback) {
    if (geojson.type === 'Feature') {
        callback(geojson, 0);
    } else if (geojson.type === 'FeatureCollection') {
        for (var i = 0; i < geojson.features.length; i++) {
            if (callback(geojson.features[i], i) === false) break;
        }
    }
}

/**
 * Callback for featureReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback featureReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name featureReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {"foo": "bar"}),
 *   turf.point([36, 53], {"hello": "world"})
 * ]);
 *
 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   return currentFeature
 * });
 */
function featureReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    featureEach(geojson, function (currentFeature, featureIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex);
    });
    return previousValue;
}

/**
 * Get all coordinates from any GeoJSON object.
 *
 * @name coordAll
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @returns {Array<Array<number>>} coordinate position array
 * @example
 * var features = turf.featureCollection([
 *   turf.point([26, 37], {foo: 'bar'}),
 *   turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * var coords = turf.coordAll(features);
 * //= [[26, 37], [36, 53]]
 */
function coordAll(geojson) {
    var coords = [];
    coordEach(geojson, function (coord) {
        coords.push(coord);
    });
    return coords;
}

/**
 * Callback for geomEach
 *
 * @callback geomEachCallback
 * @param {Geometry} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {Object} featureProperties The current Feature Properties being processed.
 * @param {Array<number>} featureBBox The current Feature BBox being processed.
 * @param {number|string} featureId The current Feature Id being processed.
 */

/**
 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
 *
 * @name geomEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @returns {void}
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 * });
 */
function geomEach(geojson, callback) {
    var i, j, g, geometry, stopG,
        geometryMaybeCollection,
        isGeometryCollection,
        featureProperties,
        featureBBox,
        featureId,
        featureIndex = 0,
        isFeatureCollection = geojson.type === 'FeatureCollection',
        isFeature = geojson.type === 'Feature',
        stop = isFeatureCollection ? geojson.features.length : 1;

    // This logic may look a little weird. The reason why it is that way
    // is because it's trying to be fast. GeoJSON supports multiple kinds
    // of objects at its root: FeatureCollection, Features, Geometries.
    // This function has the responsibility of handling all of them, and that
    // means that some of the `for` loops you see below actually just don't apply
    // to certain inputs. For instance, if you give this just a
    // Point geometry, then both loops are short-circuited and all we do
    // is gradually rename the input until it's called 'geometry'.
    //
    // This also aims to allocate as few resources as possible: just a
    // few numbers and booleans, rather than any temporary arrays as would
    // be required with the normalization approach.
    for (i = 0; i < stop; i++) {

        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
            (isFeature ? geojson.geometry : geojson));
        featureProperties = (isFeatureCollection ? geojson.features[i].properties :
            (isFeature ? geojson.properties : {}));
        featureBBox = (isFeatureCollection ? geojson.features[i].bbox :
            (isFeature ? geojson.bbox : undefined));
        featureId = (isFeatureCollection ? geojson.features[i].id :
            (isFeature ? geojson.id : undefined));
        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

        for (g = 0; g < stopG; g++) {
            geometry = isGeometryCollection ?
                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

            // Handle null Geometry
            if (geometry === null) {
                if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
                continue;
            }
            switch (geometry.type) {
            case 'Point':
            case 'LineString':
            case 'MultiPoint':
            case 'Polygon':
            case 'MultiLineString':
            case 'MultiPolygon': {
                if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
                break;
            }
            case 'GeometryCollection': {
                for (j = 0; j < geometry.geometries.length; j++) {
                    if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) return false;
                }
                break;
            }
            default:
                throw new Error('Unknown Geometry Type');
            }
        }
        // Only increase `featureIndex` per each feature
        featureIndex++;
    }
}

/**
 * Callback for geomReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback geomReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Geometry} currentGeometry The current Geometry being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {Object} featureProperties The current Feature Properties being processed.
 * @param {Array<number>} featureBBox The current Feature BBox being processed.
 * @param {number|string} featureId The current Feature Id being processed.
 */

/**
 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
 *
 * @name geomReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.point([36, 53], {hello: 'world'})
 * ]);
 *
 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
 *   //=previousValue
 *   //=currentGeometry
 *   //=featureIndex
 *   //=featureProperties
 *   //=featureBBox
 *   //=featureId
 *   return currentGeometry
 * });
 */
function geomReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    geomEach(geojson, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
        else previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
    });
    return previousValue;
}

/**
 * Callback for flattenEach
 *
 * @callback flattenEachCallback
 * @param {Feature} currentFeature The current flattened feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 */

/**
 * Iterate over flattened features in any GeoJSON object, similar to
 * Array.forEach.
 *
 * @name flattenEach
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 * });
 */
function flattenEach(geojson, callback) {
    geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
        // Callback for single geometry
        var type = (geometry === null) ? null : geometry.type;
        switch (type) {
        case null:
        case 'Point':
        case 'LineString':
        case 'Polygon':
            if (callback(helpers.feature(geometry, properties, {bbox: bbox, id: id}), featureIndex, 0) === false) return false;
            return;
        }

        var geomType;

        // Callback for multi-geometry
        switch (type) {
        case 'MultiPoint':
            geomType = 'Point';
            break;
        case 'MultiLineString':
            geomType = 'LineString';
            break;
        case 'MultiPolygon':
            geomType = 'Polygon';
            break;
        }

        for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
            var coordinate = geometry.coordinates[multiFeatureIndex];
            var geom = {
                type: geomType,
                coordinates: coordinate
            };
            if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false) return false;
        }
    });
}

/**
 * Callback for flattenReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback flattenReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature} currentFeature The current Feature being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 */

/**
 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
 *
 * @name flattenReduce
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var features = turf.featureCollection([
 *     turf.point([26, 37], {foo: 'bar'}),
 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
 * ]);
 *
 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
 *   //=previousValue
 *   //=currentFeature
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   return currentFeature
 * });
 */
function flattenReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    flattenEach(geojson, function (currentFeature, featureIndex, multiFeatureIndex) {
        if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
        else previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
    });
    return previousValue;
}

/**
 * Callback for segmentEach
 *
 * @callback segmentEachCallback
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 * @returns {void}
 */

/**
 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //=currentSegment
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   //=segmentIndex
 * });
 *
 * // Calculate the total number of segments
 * var total = 0;
 * turf.segmentEach(polygon, function () {
 *     total++;
 * });
 */
function segmentEach(geojson, callback) {
    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
        var segmentIndex = 0;

        // Exclude null Geometries
        if (!feature.geometry) return;
        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
        var type = feature.geometry.type;
        if (type === 'Point' || type === 'MultiPoint') return;

        // Generate 2-vertex line segments
        var previousCoords;
        var previousFeatureIndex = 0;
        var previousMultiIndex = 0;
        var prevGeomIndex = 0;
        if (coordEach(feature, function (currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
            // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
            if (previousCoords === undefined || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
                previousCoords = currentCoord;
                previousFeatureIndex = featureIndex;
                previousMultiIndex = multiPartIndexCoord;
                prevGeomIndex = geometryIndex;
                segmentIndex = 0;
                return;
            }
            var currentSegment = helpers.lineString([previousCoords, currentCoord], feature.properties);
            if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false) return false;
            segmentIndex++;
            previousCoords = currentCoord;
        }) === false) return false;
    });
}

/**
 * Callback for segmentReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback segmentReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentSegment The current Segment being processed.
 * @param {number} featureIndex The current index of the Feature being processed.
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
 * @param {number} geometryIndex The current index of the Geometry being processed.
 * @param {number} segmentIndex The current index of the Segment being processed.
 */

/**
 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {void}
 * @example
 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
 *
 * // Iterate over GeoJSON by 2-vertex segments
 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
 *   //= previousSegment
 *   //= currentSegment
 *   //= featureIndex
 *   //= multiFeatureIndex
 *   //= geometryIndex
 *   //= segmentInex
 *   return currentSegment
 * });
 *
 * // Calculate the total number of segments
 * var initialValue = 0
 * var total = turf.segmentReduce(polygon, function (previousValue) {
 *     previousValue++;
 *     return previousValue;
 * }, initialValue);
 */
function segmentReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    var started = false;
    segmentEach(geojson, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
        if (started === false && initialValue === undefined) previousValue = currentSegment;
        else previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
        started = true;
    });
    return previousValue;
}

/**
 * Callback for lineEach
 *
 * @callback lineEachCallback
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 */

/**
 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
 * similar to Array.forEach.
 *
 * @name lineEach
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @example
 * var multiLine = turf.multiLineString([
 *   [[26, 37], [35, 45]],
 *   [[36, 53], [38, 50], [41, 55]]
 * ]);
 *
 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 * });
 */
function lineEach(geojson, callback) {
    // validation
    if (!geojson) throw new Error('geojson is required');

    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
        if (feature.geometry === null) return;
        var type = feature.geometry.type;
        var coords = feature.geometry.coordinates;
        switch (type) {
        case 'LineString':
            if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false) return false;
            break;
        case 'Polygon':
            for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
                if (callback(helpers.lineString(coords[geometryIndex], feature.properties), featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
            }
            break;
        }
    });
}

/**
 * Callback for lineReduce
 *
 * The first time the callback function is called, the values provided as arguments depend
 * on whether the reduce method has an initialValue argument.
 *
 * If an initialValue is provided to the reduce method:
 *  - The previousValue argument is initialValue.
 *  - The currentValue argument is the value of the first element present in the array.
 *
 * If an initialValue is not provided:
 *  - The previousValue argument is the value of the first element present in the array.
 *  - The currentValue argument is the value of the second element present in the array.
 *
 * @callback lineReduceCallback
 * @param {*} previousValue The accumulated value previously returned in the last invocation
 * of the callback, or initialValue, if supplied.
 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
 * @param {number} featureIndex The current index of the Feature being processed
 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
 * @param {number} geometryIndex The current index of the Geometry being processed
 */

/**
 * Reduce features in any GeoJSON object, similar to Array.reduce().
 *
 * @name lineReduce
 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
 * @returns {*} The value that results from the reduction.
 * @example
 * var multiPoly = turf.multiPolygon([
 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
 * ]);
 *
 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
 *   //=previousValue
 *   //=currentLine
 *   //=featureIndex
 *   //=multiFeatureIndex
 *   //=geometryIndex
 *   return currentLine
 * });
 */
function lineReduce(geojson, callback, initialValue) {
    var previousValue = initialValue;
    lineEach(geojson, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
        if (featureIndex === 0 && initialValue === undefined) previousValue = currentLine;
        else previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
    });
    return previousValue;
}

/**
 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 * Point & MultiPoint will always return null.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.segmentIndex=0] Segment Index
 * @param {Object} [options.properties={}] Translate Properties to output LineString
 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
 * @param {number|string} [options.id={}] Translate Id to output LineString
 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findSegment(multiLine);
 * // => Feature<LineString<[[10, 10], [50, 30]]>>
 *
 * // First Segment of 2nd Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
 *
 * // Last Segment of Last Multi Feature
 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
 */
function findSegment(geojson, options) {
    // Optional Parameters
    options = options || {};
    if (!helpers.isObject(options)) throw new Error('options is invalid');
    var featureIndex = options.featureIndex || 0;
    var multiFeatureIndex = options.multiFeatureIndex || 0;
    var geometryIndex = options.geometryIndex || 0;
    var segmentIndex = options.segmentIndex || 0;

    // Find FeatureIndex
    var properties = options.properties;
    var geometry;

    switch (geojson.type) {
    case 'FeatureCollection':
        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
        properties = properties || geojson.features[featureIndex].properties;
        geometry = geojson.features[featureIndex].geometry;
        break;
    case 'Feature':
        properties = properties || geojson.properties;
        geometry = geojson.geometry;
        break;
    case 'Point':
    case 'MultiPoint':
        return null;
    case 'LineString':
    case 'Polygon':
    case 'MultiLineString':
    case 'MultiPolygon':
        geometry = geojson;
        break;
    default:
        throw new Error('geojson is invalid');
    }

    // Find SegmentIndex
    if (geometry === null) return null;
    var coords = geometry.coordinates;
    switch (geometry.type) {
    case 'Point':
    case 'MultiPoint':
        return null;
    case 'LineString':
        if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
        return helpers.lineString([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
    case 'Polygon':
        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
        if (segmentIndex < 0) segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
        return helpers.lineString([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
    case 'MultiLineString':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
        return helpers.lineString([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
    case 'MultiPolygon':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
        return helpers.lineString([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
    }
    throw new Error('geojson is invalid');
}

/**
 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
 *
 * Negative indexes are permitted.
 *
 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
 * @param {Object} [options={}] Optional parameters
 * @param {number} [options.featureIndex=0] Feature Index
 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
 * @param {number} [options.geometryIndex=0] Geometry Index
 * @param {number} [options.coordIndex=0] Coord Index
 * @param {Object} [options.properties={}] Translate Properties to output Point
 * @param {BBox} [options.bbox={}] Translate BBox to output Point
 * @param {number|string} [options.id={}] Translate Id to output Point
 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
 * @example
 * var multiLine = turf.multiLineString([
 *     [[10, 10], [50, 30], [30, 40]],
 *     [[-10, -10], [-50, -30], [-30, -40]]
 * ]);
 *
 * // First Segment (defaults are 0)
 * turf.findPoint(multiLine);
 * // => Feature<Point<[10, 10]>>
 *
 * // First Segment of the 2nd Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
 * // => Feature<Point<[-10, -10]>>
 *
 * // Last Segment of last Multi-Feature
 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
 * // => Feature<Point<[-30, -40]>>
 */
function findPoint(geojson, options) {
    // Optional Parameters
    options = options || {};
    if (!helpers.isObject(options)) throw new Error('options is invalid');
    var featureIndex = options.featureIndex || 0;
    var multiFeatureIndex = options.multiFeatureIndex || 0;
    var geometryIndex = options.geometryIndex || 0;
    var coordIndex = options.coordIndex || 0;

    // Find FeatureIndex
    var properties = options.properties;
    var geometry;

    switch (geojson.type) {
    case 'FeatureCollection':
        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
        properties = properties || geojson.features[featureIndex].properties;
        geometry = geojson.features[featureIndex].geometry;
        break;
    case 'Feature':
        properties = properties || geojson.properties;
        geometry = geojson.geometry;
        break;
    case 'Point':
    case 'MultiPoint':
        return null;
    case 'LineString':
    case 'Polygon':
    case 'MultiLineString':
    case 'MultiPolygon':
        geometry = geojson;
        break;
    default:
        throw new Error('geojson is invalid');
    }

    // Find Coord Index
    if (geometry === null) return null;
    var coords = geometry.coordinates;
    switch (geometry.type) {
    case 'Point':
        return helpers.point(coords, properties, options);
    case 'MultiPoint':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        return helpers.point(coords[multiFeatureIndex], properties, options);
    case 'LineString':
        if (coordIndex < 0) coordIndex = coords.length + coordIndex;
        return helpers.point(coords[coordIndex], properties, options);
    case 'Polygon':
        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
        if (coordIndex < 0) coordIndex = coords[geometryIndex].length + coordIndex;
        return helpers.point(coords[geometryIndex][coordIndex], properties, options);
    case 'MultiLineString':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex].length + coordIndex;
        return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
    case 'MultiPolygon':
        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
        return helpers.point(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
    }
    throw new Error('geojson is invalid');
}

exports.coordEach = coordEach;
exports.coordReduce = coordReduce;
exports.propEach = propEach;
exports.propReduce = propReduce;
exports.featureEach = featureEach;
exports.featureReduce = featureReduce;
exports.coordAll = coordAll;
exports.geomEach = geomEach;
exports.geomReduce = geomReduce;
exports.flattenEach = flattenEach;
exports.flattenReduce = flattenReduce;
exports.segmentEach = segmentEach;
exports.segmentReduce = segmentReduce;
exports.lineEach = lineEach;
exports.lineReduce = lineReduce;
exports.findSegment = findSegment;
exports.findPoint = findPoint;


/***/ }),

/***/ "./node_modules/fuse.js/dist/fuse.js":
/*!*******************************************!*\
  !*** ./node_modules/fuse.js/dist/fuse.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Fuse.js v3.4.5 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
!function(e,t){ true?module.exports=t():undefined}(this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=function(e){return Array.isArray?Array.isArray(e):"[object Array]"===Object.prototype.toString.call(e)}},function(e,t,n){function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=n(2),a=n(8),s=n(0),c=function(){function e(t,n){var r=n.location,o=void 0===r?0:r,i=n.distance,s=void 0===i?100:i,c=n.threshold,h=void 0===c?.6:c,l=n.maxPatternLength,u=void 0===l?32:l,f=n.caseSensitive,d=void 0!==f&&f,v=n.tokenSeparator,p=void 0===v?/ +/g:v,g=n.findAllMatches,y=void 0!==g&&g,m=n.minMatchCharLength,k=void 0===m?1:m,S=n.id,x=void 0===S?null:S,b=n.keys,M=void 0===b?[]:b,_=n.shouldSort,L=void 0===_||_,w=n.getFn,A=void 0===w?a:w,C=n.sortFn,I=void 0===C?function(e,t){return e.score-t.score}:C,O=n.tokenize,j=void 0!==O&&O,P=n.matchAllTokens,F=void 0!==P&&P,T=n.includeMatches,z=void 0!==T&&T,E=n.includeScore,K=void 0!==E&&E,$=n.verbose,J=void 0!==$&&$;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:s,threshold:h,maxPatternLength:u,isCaseSensitive:d,tokenSeparator:p,findAllMatches:y,minMatchCharLength:k,id:x,keys:M,includeMatches:z,includeScore:K,shouldSort:L,getFn:A,sortFn:I,verbose:J,tokenize:j,matchAllTokens:F},this.setCollection(t)}var t,n,c;return t=e,(n=[{key:"setCollection",value:function(e){return this.list=e,e}},{key:"search",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{limit:!1};this._log('---------\nSearch pattern: "'.concat(e,'"'));var n=this._prepareSearchers(e),r=n.tokenSearchers,o=n.fullSearcher,i=this._search(r,o),a=i.weights,s=i.results;return this._computeScore(a,s),this.options.shouldSort&&this._sort(s),t.limit&&"number"==typeof t.limit&&(s=s.slice(0,t.limit)),this._format(s)}},{key:"_prepareSearchers",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=[];if(this.options.tokenize)for(var n=e.split(this.options.tokenSeparator),r=0,o=n.length;r<o;r+=1)t.push(new i(n[r],this.options));return{tokenSearchers:t,fullSearcher:new i(e,this.options)}}},{key:"_search",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,n=this.list,r={},o=[];if("string"==typeof n[0]){for(var i=0,a=n.length;i<a;i+=1)this._analyze({key:"",value:n[i],record:i,index:i},{resultMap:r,results:o,tokenSearchers:e,fullSearcher:t});return{weights:null,results:o}}for(var s={},c=0,h=n.length;c<h;c+=1)for(var l=n[c],u=0,f=this.options.keys.length;u<f;u+=1){var d=this.options.keys[u];if("string"!=typeof d){if(s[d.name]={weight:1-d.weight||1},d.weight<=0||d.weight>1)throw new Error("Key weight has to be > 0 and <= 1");d=d.name}else s[d]={weight:1};this._analyze({key:d,value:this.options.getFn(l,d),record:l,index:c},{resultMap:r,results:o,tokenSearchers:e,fullSearcher:t})}return{weights:s,results:o}}},{key:"_analyze",value:function(e,t){var n=e.key,r=e.arrayIndex,o=void 0===r?-1:r,i=e.value,a=e.record,c=e.index,h=t.tokenSearchers,l=void 0===h?[]:h,u=t.fullSearcher,f=void 0===u?[]:u,d=t.resultMap,v=void 0===d?{}:d,p=t.results,g=void 0===p?[]:p;if(null!=i){var y=!1,m=-1,k=0;if("string"==typeof i){this._log("\nKey: ".concat(""===n?"-":n));var S=f.search(i);if(this._log('Full text: "'.concat(i,'", score: ').concat(S.score)),this.options.tokenize){for(var x=i.split(this.options.tokenSeparator),b=[],M=0;M<l.length;M+=1){var _=l[M];this._log('\nPattern: "'.concat(_.pattern,'"'));for(var L=!1,w=0;w<x.length;w+=1){var A=x[w],C=_.search(A),I={};C.isMatch?(I[A]=C.score,y=!0,L=!0,b.push(C.score)):(I[A]=1,this.options.matchAllTokens||b.push(1)),this._log('Token: "'.concat(A,'", score: ').concat(I[A]))}L&&(k+=1)}m=b[0];for(var O=b.length,j=1;j<O;j+=1)m+=b[j];m/=O,this._log("Token score average:",m)}var P=S.score;m>-1&&(P=(P+m)/2),this._log("Score average:",P);var F=!this.options.tokenize||!this.options.matchAllTokens||k>=l.length;if(this._log("\nCheck Matches: ".concat(F)),(y||S.isMatch)&&F){var T=v[c];T?T.output.push({key:n,arrayIndex:o,value:i,score:P,matchedIndices:S.matchedIndices}):(v[c]={item:a,output:[{key:n,arrayIndex:o,value:i,score:P,matchedIndices:S.matchedIndices}]},g.push(v[c]))}}else if(s(i))for(var z=0,E=i.length;z<E;z+=1)this._analyze({key:n,arrayIndex:z,value:i[z],record:a,index:c},{resultMap:v,results:g,tokenSearchers:l,fullSearcher:f})}}},{key:"_computeScore",value:function(e,t){this._log("\n\nComputing score:\n");for(var n=0,r=t.length;n<r;n+=1){for(var o=t[n].output,i=o.length,a=1,s=1,c=0;c<i;c+=1){var h=e?e[o[c].key].weight:1,l=(1===h?o[c].score:o[c].score||.001)*h;1!==h?s=Math.min(s,l):(o[c].nScore=l,a*=l)}t[n].score=1===s?a:s,this._log(t[n])}}},{key:"_sort",value:function(e){this._log("\n\nSorting...."),e.sort(this.options.sortFn)}},{key:"_format",value:function(e){var t=[];if(this.options.verbose){var n=[];this._log("\n\nOutput:\n\n",JSON.stringify(e,function(e,t){if("object"===r(t)&&null!==t){if(-1!==n.indexOf(t))return;n.push(t)}return t})),n=null}var o=[];this.options.includeMatches&&o.push(function(e,t){var n=e.output;t.matches=[];for(var r=0,o=n.length;r<o;r+=1){var i=n[r];if(0!==i.matchedIndices.length){var a={indices:i.matchedIndices,value:i.value};i.key&&(a.key=i.key),i.hasOwnProperty("arrayIndex")&&i.arrayIndex>-1&&(a.arrayIndex=i.arrayIndex),t.matches.push(a)}}}),this.options.includeScore&&o.push(function(e,t){t.score=e.score});for(var i=0,a=e.length;i<a;i+=1){var s=e[i];if(this.options.id&&(s.item=this.options.getFn(s.item,this.options.id)[0]),o.length){for(var c={item:s.item},h=0,l=o.length;h<l;h+=1)o[h](s,c);t.push(c)}else t.push(s.item)}return t}},{key:"_log",value:function(){var e;this.options.verbose&&(e=console).log.apply(e,arguments)}}])&&o(t.prototype,n),c&&o(t,c),e}();e.exports=c},function(e,t,n){function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=n(3),i=n(4),a=n(7),s=function(){function e(t,n){var r=n.location,o=void 0===r?0:r,i=n.distance,s=void 0===i?100:i,c=n.threshold,h=void 0===c?.6:c,l=n.maxPatternLength,u=void 0===l?32:l,f=n.isCaseSensitive,d=void 0!==f&&f,v=n.tokenSeparator,p=void 0===v?/ +/g:v,g=n.findAllMatches,y=void 0!==g&&g,m=n.minMatchCharLength,k=void 0===m?1:m;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.options={location:o,distance:s,threshold:h,maxPatternLength:u,isCaseSensitive:d,tokenSeparator:p,findAllMatches:y,minMatchCharLength:k},this.pattern=this.options.isCaseSensitive?t:t.toLowerCase(),this.pattern.length<=u&&(this.patternAlphabet=a(this.pattern))}var t,n,s;return t=e,(n=[{key:"search",value:function(e){if(this.options.isCaseSensitive||(e=e.toLowerCase()),this.pattern===e)return{isMatch:!0,score:0,matchedIndices:[[0,e.length-1]]};var t=this.options,n=t.maxPatternLength,r=t.tokenSeparator;if(this.pattern.length>n)return o(e,this.pattern,r);var a=this.options,s=a.location,c=a.distance,h=a.threshold,l=a.findAllMatches,u=a.minMatchCharLength;return i(e,this.pattern,this.patternAlphabet,{location:s,distance:c,threshold:h,findAllMatches:l,minMatchCharLength:u})}}])&&r(t.prototype,n),s&&r(t,s),e}();e.exports=s},function(e,t){var n=/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;e.exports=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:/ +/g,o=new RegExp(t.replace(n,"\\$&").replace(r,"|")),i=e.match(o),a=!!i,s=[];if(a)for(var c=0,h=i.length;c<h;c+=1){var l=i[c];s.push([e.indexOf(l),l.length-1])}return{score:a?.5:1,isMatch:a,matchedIndices:s}}},function(e,t,n){var r=n(5),o=n(6);e.exports=function(e,t,n,i){for(var a=i.location,s=void 0===a?0:a,c=i.distance,h=void 0===c?100:c,l=i.threshold,u=void 0===l?.6:l,f=i.findAllMatches,d=void 0!==f&&f,v=i.minMatchCharLength,p=void 0===v?1:v,g=s,y=e.length,m=u,k=e.indexOf(t,g),S=t.length,x=[],b=0;b<y;b+=1)x[b]=0;if(-1!==k){var M=r(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});if(m=Math.min(M,m),-1!==(k=e.lastIndexOf(t,g+S))){var _=r(t,{errors:0,currentLocation:k,expectedLocation:g,distance:h});m=Math.min(_,m)}}k=-1;for(var L=[],w=1,A=S+y,C=1<<S-1,I=0;I<S;I+=1){for(var O=0,j=A;O<j;){r(t,{errors:I,currentLocation:g+j,expectedLocation:g,distance:h})<=m?O=j:A=j,j=Math.floor((A-O)/2+O)}A=j;var P=Math.max(1,g-j+1),F=d?y:Math.min(g+j,y)+S,T=Array(F+2);T[F+1]=(1<<I)-1;for(var z=F;z>=P;z-=1){var E=z-1,K=n[e.charAt(E)];if(K&&(x[E]=1),T[z]=(T[z+1]<<1|1)&K,0!==I&&(T[z]|=(L[z+1]|L[z])<<1|1|L[z+1]),T[z]&C&&(w=r(t,{errors:I,currentLocation:E,expectedLocation:g,distance:h}))<=m){if(m=w,(k=E)<=g)break;P=Math.max(1,2*g-k)}}if(r(t,{errors:I+1,currentLocation:g,expectedLocation:g,distance:h})>m)break;L=T}return{isMatch:k>=0,score:0===w?.001:w,matchedIndices:o(x,p)}}},function(e,t){e.exports=function(e,t){var n=t.errors,r=void 0===n?0:n,o=t.currentLocation,i=void 0===o?0:o,a=t.expectedLocation,s=void 0===a?0:a,c=t.distance,h=void 0===c?100:c,l=r/e.length,u=Math.abs(s-i);return h?l+u/h:u?1:l}},function(e,t){e.exports=function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=[],r=-1,o=-1,i=0,a=e.length;i<a;i+=1){var s=e[i];s&&-1===r?r=i:s||-1===r||((o=i-1)-r+1>=t&&n.push([r,o]),r=-1)}return e[i-1]&&i-r>=t&&n.push([r,i-1]),n}},function(e,t){e.exports=function(e){for(var t={},n=e.length,r=0;r<n;r+=1)t[e.charAt(r)]=0;for(var o=0;o<n;o+=1)t[e.charAt(o)]|=1<<n-o-1;return t}},function(e,t,n){var r=n(0);e.exports=function(e,t){return function e(t,n,o){if(n){var i=n.indexOf("."),a=n,s=null;-1!==i&&(a=n.slice(0,i),s=n.slice(i+1));var c=t[a];if(null!=c)if(s||"string"!=typeof c&&"number"!=typeof c)if(r(c))for(var h=0,l=c.length;h<l;h+=1)e(c[h],s,o);else s&&e(c,s,o);else o.push(c.toString())}else o.push(t);return o}(e,t,[])}}])});

/***/ }),

/***/ "./node_modules/martinez-polygon-clipping/dist/martinez.umd.js":
/*!*********************************************************************!*\
  !*** ./node_modules/martinez-polygon-clipping/dist/martinez.umd.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * martinez v0.4.3
 * Martinez polygon clipping algorithm, does boolean operation on polygons (multipolygons, polygons with holes etc): intersection, union, difference, xor
 *
 * @author Alex Milevski <info@w8r.name>
 * @license MIT
 * @preserve
 */

(function (global, factory) {
   true ? factory(exports) :
  undefined;
}(this, (function (exports) { 'use strict';

  function DEFAULT_COMPARE (a, b) { return a > b ? 1 : a < b ? -1 : 0; }

  var SplayTree = function SplayTree(compare, noDuplicates) {
    if ( compare === void 0 ) compare = DEFAULT_COMPARE;
    if ( noDuplicates === void 0 ) noDuplicates = false;

    this._compare = compare;
    this._root = null;
    this._size = 0;
    this._noDuplicates = !!noDuplicates;
  };

  var prototypeAccessors = { size: { configurable: true } };


  SplayTree.prototype.rotateLeft = function rotateLeft (x) {
    var y = x.right;
    if (y) {
      x.right = y.left;
      if (y.left) { y.left.parent = x; }
      y.parent = x.parent;
    }

    if (!x.parent)              { this._root = y; }
    else if (x === x.parent.left) { x.parent.left = y; }
    else                        { x.parent.right = y; }
    if (y) { y.left = x; }
    x.parent = y;
  };


  SplayTree.prototype.rotateRight = function rotateRight (x) {
    var y = x.left;
    if (y) {
      x.left = y.right;
      if (y.right) { y.right.parent = x; }
      y.parent = x.parent;
    }

    if (!x.parent)             { this._root = y; }
    else if(x === x.parent.left) { x.parent.left = y; }
    else                       { x.parent.right = y; }
    if (y) { y.right = x; }
    x.parent = y;
  };


  SplayTree.prototype._splay = function _splay (x) {
      var this$1 = this;

    while (x.parent) {
      var p = x.parent;
      if (!p.parent) {
        if (p.left === x) { this$1.rotateRight(p); }
        else            { this$1.rotateLeft(p); }
      } else if (p.left === x && p.parent.left === p) {
        this$1.rotateRight(p.parent);
        this$1.rotateRight(p);
      } else if (p.right === x && p.parent.right === p) {
        this$1.rotateLeft(p.parent);
        this$1.rotateLeft(p);
      } else if (p.left === x && p.parent.right === p) {
        this$1.rotateRight(p);
        this$1.rotateLeft(p);
      } else {
        this$1.rotateLeft(p);
        this$1.rotateRight(p);
      }
    }
  };


  SplayTree.prototype.splay = function splay (x) {
      var this$1 = this;

    var p, gp, ggp, l, r;

    while (x.parent) {
      p = x.parent;
      gp = p.parent;

      if (gp && gp.parent) {
        ggp = gp.parent;
        if (ggp.left === gp) { ggp.left= x; }
        else               { ggp.right = x; }
        x.parent = ggp;
      } else {
        x.parent = null;
        this$1._root = x;
      }

      l = x.left; r = x.right;

      if (x === p.left) { // left
        if (gp) {
          if (gp.left === p) {
            /* zig-zig */
            if (p.right) {
              gp.left = p.right;
              gp.left.parent = gp;
            } else { gp.left = null; }

            p.right = gp;
            gp.parent = p;
          } else {
            /* zig-zag */
            if (l) {
              gp.right = l;
              l.parent = gp;
            } else { gp.right = null; }

            x.left  = gp;
            gp.parent = x;
          }
        }
        if (r) {
          p.left = r;
          r.parent = p;
        } else { p.left = null; }

        x.right= p;
        p.parent = x;
      } else { // right
        if (gp) {
          if (gp.right === p) {
            /* zig-zig */
            if (p.left) {
              gp.right = p.left;
              gp.right.parent = gp;
            } else { gp.right = null; }

            p.left = gp;
            gp.parent = p;
          } else {
            /* zig-zag */
            if (r) {
              gp.left = r;
              r.parent = gp;
            } else { gp.left = null; }

            x.right = gp;
            gp.parent = x;
          }
        }
        if (l) {
          p.right = l;
          l.parent = p;
        } else { p.right = null; }

        x.left = p;
        p.parent = x;
      }
    }
  };


  SplayTree.prototype.replace = function replace (u, v) {
    if (!u.parent) { this._root = v; }
    else if (u === u.parent.left) { u.parent.left = v; }
    else { u.parent.right = v; }
    if (v) { v.parent = u.parent; }
  };


  SplayTree.prototype.minNode = function minNode (u) {
      if ( u === void 0 ) u = this._root;

    if (u) { while (u.left) { u = u.left; } }
    return u;
  };


  SplayTree.prototype.maxNode = function maxNode (u) {
      if ( u === void 0 ) u = this._root;

    if (u) { while (u.right) { u = u.right; } }
    return u;
  };


  SplayTree.prototype.insert = function insert (key, data) {
    var z = this._root;
    var p = null;
    var comp = this._compare;
    var cmp;

    if (this._noDuplicates) {
      while (z) {
        p = z;
        cmp = comp(z.key, key);
        if (cmp === 0) { return; }
        else if (comp(z.key, key) < 0) { z = z.right; }
        else { z = z.left; }
      }
    } else {
      while (z) {
        p = z;
        if (comp(z.key, key) < 0) { z = z.right; }
        else { z = z.left; }
      }
    }

    z = { key: key, data: data, left: null, right: null, parent: p };

    if (!p)                        { this._root = z; }
    else if (comp(p.key, z.key) < 0) { p.right = z; }
    else                           { p.left= z; }

    this.splay(z);
    this._size++;
    return z;
  };


  SplayTree.prototype.find = function find (key) {
    var z  = this._root;
    var comp = this._compare;
    while (z) {
      var cmp = comp(z.key, key);
      if    (cmp < 0) { z = z.right; }
      else if (cmp > 0) { z = z.left; }
      else            { return z; }
    }
    return null;
  };

  /**
   * Whether the tree contains a node with the given key
   * @param{Key} key
   * @return {boolean} true/false
   */
  SplayTree.prototype.contains = function contains (key) {
    var node     = this._root;
    var comparator = this._compare;
    while (node){
      var cmp = comparator(key, node.key);
      if    (cmp === 0) { return true; }
      else if (cmp < 0) { node = node.left; }
      else              { node = node.right; }
    }

    return false;
  };


  SplayTree.prototype.remove = function remove (key) {
    var z = this.find(key);

    if (!z) { return false; }

    this.splay(z);

    if (!z.left) { this.replace(z, z.right); }
    else if (!z.right) { this.replace(z, z.left); }
    else {
      var y = this.minNode(z.right);
      if (y.parent !== z) {
        this.replace(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.replace(z, y);
      y.left = z.left;
      y.left.parent = y;
    }

    this._size--;
    return true;
  };


  SplayTree.prototype.removeNode = function removeNode (z) {
    if (!z) { return false; }

    this.splay(z);

    if (!z.left) { this.replace(z, z.right); }
    else if (!z.right) { this.replace(z, z.left); }
    else {
      var y = this.minNode(z.right);
      if (y.parent !== z) {
        this.replace(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.replace(z, y);
      y.left = z.left;
      y.left.parent = y;
    }

    this._size--;
    return true;
  };


  SplayTree.prototype.erase = function erase (key) {
    var z = this.find(key);
    if (!z) { return; }

    this.splay(z);

    var s = z.left;
    var t = z.right;

    var sMax = null;
    if (s) {
      s.parent = null;
      sMax = this.maxNode(s);
      this.splay(sMax);
      this._root = sMax;
    }
    if (t) {
      if (s) { sMax.right = t; }
      else { this._root = t; }
      t.parent = sMax;
    }

    this._size--;
  };

  /**
   * Removes and returns the node with smallest key
   * @return {?Node}
   */
  SplayTree.prototype.pop = function pop () {
    var node = this._root, returnValue = null;
    if (node) {
      while (node.left) { node = node.left; }
      returnValue = { key: node.key, data: node.data };
      this.remove(node.key);
    }
    return returnValue;
  };


  /* eslint-disable class-methods-use-this */

  /**
   * Successor node
   * @param{Node} node
   * @return {?Node}
   */
  SplayTree.prototype.next = function next (node) {
    var successor = node;
    if (successor) {
      if (successor.right) {
        successor = successor.right;
        while (successor && successor.left) { successor = successor.left; }
      } else {
        successor = node.parent;
        while (successor && successor.right === node) {
          node = successor; successor = successor.parent;
        }
      }
    }
    return successor;
  };


  /**
   * Predecessor node
   * @param{Node} node
   * @return {?Node}
   */
  SplayTree.prototype.prev = function prev (node) {
    var predecessor = node;
    if (predecessor) {
      if (predecessor.left) {
        predecessor = predecessor.left;
        while (predecessor && predecessor.right) { predecessor = predecessor.right; }
      } else {
        predecessor = node.parent;
        while (predecessor && predecessor.left === node) {
          node = predecessor;
          predecessor = predecessor.parent;
        }
      }
    }
    return predecessor;
  };
  /* eslint-enable class-methods-use-this */


  /**
   * @param{forEachCallback} callback
   * @return {SplayTree}
   */
  SplayTree.prototype.forEach = function forEach (callback) {
    var current = this._root;
    var s = [], done = false, i = 0;

    while (!done) {
      // Reach the left most Node of the current Node
      if (current) {
        // Place pointer to a tree node on the stack
        // before traversing the node's left subtree
        s.push(current);
        current = current.left;
      } else {
        // BackTrack from the empty subtree and visit the Node
        // at the top of the stack; however, if the stack is
        // empty you are done
        if (s.length > 0) {
          current = s.pop();
          callback(current, i++);

          // We have visited the node and its left
          // subtree. Now, it's right subtree's turn
          current = current.right;
        } else { done = true; }
      }
    }
    return this;
  };


  /**
   * Walk key range from `low` to `high`. Stops if `fn` returns a value.
   * @param{Key}    low
   * @param{Key}    high
   * @param{Function} fn
   * @param{*?}     ctx
   * @return {SplayTree}
   */
  SplayTree.prototype.range = function range (low, high, fn, ctx) {
      var this$1 = this;

    var Q = [];
    var compare = this._compare;
    var node = this._root, cmp;

    while (Q.length !== 0 || node) {
      if (node) {
        Q.push(node);
        node = node.left;
      } else {
        node = Q.pop();
        cmp = compare(node.key, high);
        if (cmp > 0) {
          break;
        } else if (compare(node.key, low) >= 0) {
          if (fn.call(ctx, node)) { return this$1; } // stop if smth is returned
        }
        node = node.right;
      }
    }
    return this;
  };

  /**
   * Returns all keys in order
   * @return {Array<Key>}
   */
  SplayTree.prototype.keys = function keys () {
    var current = this._root;
    var s = [], r = [], done = false;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          r.push(current.key);
          current = current.right;
        } else { done = true; }
      }
    }
    return r;
  };


  /**
   * Returns `data` fields of all nodes in order.
   * @return {Array<Value>}
   */
  SplayTree.prototype.values = function values () {
    var current = this._root;
    var s = [], r = [], done = false;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          r.push(current.data);
          current = current.right;
        } else { done = true; }
      }
    }
    return r;
  };


  /**
   * Returns node at given index
   * @param{number} index
   * @return {?Node}
   */
  SplayTree.prototype.at = function at (index) {
    // removed after a consideration, more misleading than useful
    // index = index % this.size;
    // if (index < 0) index = this.size - index;

    var current = this._root;
    var s = [], done = false, i = 0;

    while (!done) {
      if (current) {
        s.push(current);
        current = current.left;
      } else {
        if (s.length > 0) {
          current = s.pop();
          if (i === index) { return current; }
          i++;
          current = current.right;
        } else { done = true; }
      }
    }
    return null;
  };

  /**
   * Bulk-load items. Both array have to be same size
   * @param{Array<Key>}  keys
   * @param{Array<Value>}[values]
   * @param{Boolean}     [presort=false] Pre-sort keys and values, using
   *                                       tree's comparator. Sorting is done
   *                                       in-place
   * @return {AVLTree}
   */
  SplayTree.prototype.load = function load (keys, values, presort) {
      if ( keys === void 0 ) keys = [];
      if ( values === void 0 ) values = [];
      if ( presort === void 0 ) presort = false;

    if (this._size !== 0) { throw new Error('bulk-load: tree is not empty'); }
    var size = keys.length;
    if (presort) { sort(keys, values, 0, size - 1, this._compare); }
    this._root = loadRecursive(null, keys, values, 0, size);
    this._size = size;
    return this;
  };


  SplayTree.prototype.min = function min () {
    var node = this.minNode(this._root);
    if (node) { return node.key; }
    else    { return null; }
  };


  SplayTree.prototype.max = function max () {
    var node = this.maxNode(this._root);
    if (node) { return node.key; }
    else    { return null; }
  };

  SplayTree.prototype.isEmpty = function isEmpty () { return this._root === null; };
  prototypeAccessors.size.get = function () { return this._size; };


  /**
   * Create a tree and load it with items
   * @param{Array<Key>}        keys
   * @param{Array<Value>?}      [values]

   * @param{Function?}          [comparator]
   * @param{Boolean?}           [presort=false] Pre-sort keys and values, using
   *                                             tree's comparator. Sorting is done
   *                                             in-place
   * @param{Boolean?}           [noDuplicates=false] Allow duplicates
   * @return {SplayTree}
   */
  SplayTree.createTree = function createTree (keys, values, comparator, presort, noDuplicates) {
    return new SplayTree(comparator, noDuplicates).load(keys, values, presort);
  };

  Object.defineProperties( SplayTree.prototype, prototypeAccessors );


  function loadRecursive (parent, keys, values, start, end) {
    var size = end - start;
    if (size > 0) {
      var middle = start + Math.floor(size / 2);
      var key    = keys[middle];
      var data   = values[middle];
      var node   = { key: key, data: data, parent: parent };
      node.left    = loadRecursive(node, keys, values, start, middle);
      node.right   = loadRecursive(node, keys, values, middle + 1, end);
      return node;
    }
    return null;
  }


  function sort(keys, values, left, right, compare) {
    if (left >= right) { return; }

    var pivot = keys[(left + right) >> 1];
    var i = left - 1;
    var j = right + 1;

    while (true) {
      do { i++; } while (compare(keys[i], pivot) < 0);
      do { j--; } while (compare(keys[j], pivot) > 0);
      if (i >= j) { break; }

      var tmp = keys[i];
      keys[i] = keys[j];
      keys[j] = tmp;

      tmp = values[i];
      values[i] = values[j];
      values[j] = tmp;
    }

    sort(keys, values,  left,     j, compare);
    sort(keys, values, j + 1, right, compare);
  }

  var NORMAL               = 0;
  var NON_CONTRIBUTING     = 1;
  var SAME_TRANSITION      = 2;
  var DIFFERENT_TRANSITION = 3;

  var INTERSECTION = 0;
  var UNION        = 1;
  var DIFFERENCE   = 2;
  var XOR          = 3;

  /**
   * @param  {SweepEvent} event
   * @param  {SweepEvent} prev
   * @param  {Operation} operation
   */
  function computeFields (event, prev, operation) {
    // compute inOut and otherInOut fields
    if (prev === null) {
      event.inOut      = false;
      event.otherInOut = true;

    // previous line segment in sweepline belongs to the same polygon
    } else {
      if (event.isSubject === prev.isSubject) {
        event.inOut      = !prev.inOut;
        event.otherInOut = prev.otherInOut;

      // previous line segment in sweepline belongs to the clipping polygon
      } else {
        event.inOut      = !prev.otherInOut;
        event.otherInOut = prev.isVertical() ? !prev.inOut : prev.inOut;
      }

      // compute prevInResult field
      if (prev) {
        event.prevInResult = (!inResult(prev, operation) || prev.isVertical())
          ? prev.prevInResult : prev;
      }
    }

    // check if the line segment belongs to the Boolean operation
    event.inResult = inResult(event, operation);
  }


  /* eslint-disable indent */
  function inResult(event, operation) {
    switch (event.type) {
      case NORMAL:
        switch (operation) {
          case INTERSECTION:
            return !event.otherInOut;
          case UNION:
            return event.otherInOut;
          case DIFFERENCE:
            // return (event.isSubject && !event.otherInOut) ||
            //         (!event.isSubject && event.otherInOut);
            return (event.isSubject && event.otherInOut) ||
                    (!event.isSubject && !event.otherInOut);
          case XOR:
            return true;
        }
        break;
      case SAME_TRANSITION:
        return operation === INTERSECTION || operation === UNION;
      case DIFFERENT_TRANSITION:
        return operation === DIFFERENCE;
      case NON_CONTRIBUTING:
        return false;
    }
    return false;
  }
  /* eslint-enable indent */

  var SweepEvent = function SweepEvent (point, left, otherEvent, isSubject, edgeType) {

    /**
     * Is left endpoint?
     * @type {Boolean}
     */
    this.left = left;

    /**
     * @type {Array.<Number>}
     */
    this.point = point;

    /**
     * Other edge reference
     * @type {SweepEvent}
     */
    this.otherEvent = otherEvent;

    /**
     * Belongs to source or clipping polygon
     * @type {Boolean}
     */
    this.isSubject = isSubject;

    /**
     * Edge contribution type
     * @type {Number}
     */
    this.type = edgeType || NORMAL;


    /**
     * In-out transition for the sweepline crossing polygon
     * @type {Boolean}
     */
    this.inOut = false;


    /**
     * @type {Boolean}
     */
    this.otherInOut = false;

    /**
     * Previous event in result?
     * @type {SweepEvent}
     */
    this.prevInResult = null;

    /**
     * Does event belong to result?
     * @type {Boolean}
     */
    this.inResult = false;


    // connection step

    /**
     * @type {Boolean}
     */
    this.resultInOut = false;

    this.isExteriorRing = true;
  };


  /**
   * @param{Array.<Number>}p
   * @return {Boolean}
   */
  SweepEvent.prototype.isBelow = function isBelow (p) {
    var p0 = this.point, p1 = this.otherEvent.point;
    return this.left
      ? (p0[0] - p[0]) * (p1[1] - p[1]) - (p1[0] - p[0]) * (p0[1] - p[1]) > 0
      // signedArea(this.point, this.otherEvent.point, p) > 0 :
      : (p1[0] - p[0]) * (p0[1] - p[1]) - (p0[0] - p[0]) * (p1[1] - p[1]) > 0;
      //signedArea(this.otherEvent.point, this.point, p) > 0;
  };


  /**
   * @param{Array.<Number>}p
   * @return {Boolean}
   */
  SweepEvent.prototype.isAbove = function isAbove (p) {
    return !this.isBelow(p);
  };


  /**
   * @return {Boolean}
   */
  SweepEvent.prototype.isVertical = function isVertical () {
    return this.point[0] === this.otherEvent.point[0];
  };


  SweepEvent.prototype.clone = function clone () {
    var copy = new SweepEvent(
      this.point, this.left, this.otherEvent, this.isSubject, this.type);

    copy.inResult     = this.inResult;
    copy.prevInResult = this.prevInResult;
    copy.isExteriorRing = this.isExteriorRing;
    copy.inOut        = this.inOut;
    copy.otherInOut   = this.otherInOut;

    return copy;
  };

  function equals(p1, p2) {
    if (p1[0] === p2[0]) {
      if (p1[1] === p2[1]) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  // const EPSILON = 1e-9;
  // const abs = Math.abs;
  // TODO https://github.com/w8r/martinez/issues/6#issuecomment-262847164
  // Precision problem.
  //
  // module.exports = function equals(p1, p2) {
  //   return abs(p1[0] - p2[0]) <= EPSILON && abs(p1[1] - p2[1]) <= EPSILON;
  // };

  /**
   * Signed area of the triangle (p0, p1, p2)
   * @param  {Array.<Number>} p0
   * @param  {Array.<Number>} p1
   * @param  {Array.<Number>} p2
   * @return {Number}
   */
  function signedArea(p0, p1, p2) {
    return (p0[0] - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (p0[1] - p2[1]);
  }

  /**
   * @param  {SweepEvent} e1
   * @param  {SweepEvent} e2
   * @return {Number}
   */
  function compareEvents(e1, e2) {
    var p1 = e1.point;
    var p2 = e2.point;

    // Different x-coordinate
    if (p1[0] > p2[0]) { return 1; }
    if (p1[0] < p2[0]) { return -1; }

    // Different points, but same x-coordinate
    // Event with lower y-coordinate is processed first
    if (p1[1] !== p2[1]) { return p1[1] > p2[1] ? 1 : -1; }

    return specialCases(e1, e2, p1, p2);
  }


  /* eslint-disable no-unused-vars */
  function specialCases(e1, e2, p1, p2) {
    // Same coordinates, but one is a left endpoint and the other is
    // a right endpoint. The right endpoint is processed first
    if (e1.left !== e2.left)
      { return e1.left ? 1 : -1; }

    // const p2 = e1.otherEvent.point, p3 = e2.otherEvent.point;
    // const sa = (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1])
    // Same coordinates, both events
    // are left endpoints or right endpoints.
    // not collinear
    if (signedArea(p1, e1.otherEvent.point, e2.otherEvent.point) !== 0) {
      // the event associate to the bottom segment is processed first
      return (!e1.isBelow(e2.otherEvent.point)) ? 1 : -1;
    }

    return (!e1.isSubject && e2.isSubject) ? 1 : -1;
  }
  /* eslint-enable no-unused-vars */

  /**
   * @param  {SweepEvent} se
   * @param  {Array.<Number>} p
   * @param  {Queue} queue
   * @return {Queue}
   */
  function divideSegment(se, p, queue)  {
    var r = new SweepEvent(p, false, se,            se.isSubject);
    var l = new SweepEvent(p, true,  se.otherEvent, se.isSubject);

    /* eslint-disable no-console */
    if (equals(se.point, se.otherEvent.point)) {

      console.warn('what is that, a collapsed segment?', se);
    }
    /* eslint-enable no-console */

    r.contourId = l.contourId = se.contourId;

    // avoid a rounding error. The left event would be processed after the right event
    if (compareEvents(l, se.otherEvent) > 0) {
      se.otherEvent.left = true;
      l.left = false;
    }

    // avoid a rounding error. The left event would be processed after the right event
    // if (compareEvents(se, r) > 0) {}

    se.otherEvent.otherEvent = l;
    se.otherEvent = r;

    queue.push(l);
    queue.push(r);

    return queue;
  }

  //const EPS = 1e-9;

  /**
   * Finds the magnitude of the cross product of two vectors (if we pretend
   * they're in three dimensions)
   *
   * @param {Object} a First vector
   * @param {Object} b Second vector
   * @private
   * @returns {Number} The magnitude of the cross product
   */
  function crossProduct(a, b) {
    return (a[0] * b[1]) - (a[1] * b[0]);
  }

  /**
   * Finds the dot product of two vectors.
   *
   * @param {Object} a First vector
   * @param {Object} b Second vector
   * @private
   * @returns {Number} The dot product
   */
  function dotProduct(a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]);
  }

  /**
   * Finds the intersection (if any) between two line segments a and b, given the
   * line segments' end points a1, a2 and b1, b2.
   *
   * This algorithm is based on Schneider and Eberly.
   * http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf
   * Page 244.
   *
   * @param {Array.<Number>} a1 point of first line
   * @param {Array.<Number>} a2 point of first line
   * @param {Array.<Number>} b1 point of second line
   * @param {Array.<Number>} b2 point of second line
   * @param {Boolean=}       noEndpointTouch whether to skip single touchpoints
   *                                         (meaning connected segments) as
   *                                         intersections
   * @returns {Array.<Array.<Number>>|Null} If the lines intersect, the point of
   * intersection. If they overlap, the two end points of the overlapping segment.
   * Otherwise, null.
   */
  function intersection (a1, a2, b1, b2, noEndpointTouch) {
    // The algorithm expects our lines in the form P + sd, where P is a point,
    // s is on the interval [0, 1], and d is a vector.
    // We are passed two points. P can be the first point of each pair. The
    // vector, then, could be thought of as the distance (in x and y components)
    // from the first point to the second point.
    // So first, let's make our vectors:
    var va = [a2[0] - a1[0], a2[1] - a1[1]];
    var vb = [b2[0] - b1[0], b2[1] - b1[1]];
    // We also define a function to convert back to regular point form:

    /* eslint-disable arrow-body-style */

    function toPoint(p, s, d) {
      return [
        p[0] + s * d[0],
        p[1] + s * d[1]
      ];
    }

    /* eslint-enable arrow-body-style */

    // The rest is pretty much a straight port of the algorithm.
    var e = [b1[0] - a1[0], b1[1] - a1[1]];
    var kross    = crossProduct(va, vb);
    var sqrKross = kross * kross;
    var sqrLenA  = dotProduct(va, va);
    //const sqrLenB  = dotProduct(vb, vb);

    // Check for line intersection. This works because of the properties of the
    // cross product -- specifically, two vectors are parallel if and only if the
    // cross product is the 0 vector. The full calculation involves relative error
    // to account for possible very small line segments. See Schneider & Eberly
    // for details.
    if (sqrKross > 0/* EPS * sqrLenB * sqLenA */) {
      // If they're not parallel, then (because these are line segments) they
      // still might not actually intersect. This code checks that the
      // intersection point of the lines is actually on both line segments.
      var s = crossProduct(e, vb) / kross;
      if (s < 0 || s > 1) {
        // not on line segment a
        return null;
      }
      var t = crossProduct(e, va) / kross;
      if (t < 0 || t > 1) {
        // not on line segment b
        return null;
      }
      if (s === 0 || s === 1) {
        // on an endpoint of line segment a
        return noEndpointTouch ? null : [toPoint(a1, s, va)];
      }
      if (t === 0 || t === 1) {
        // on an endpoint of line segment b
        return noEndpointTouch ? null : [toPoint(b1, t, vb)];
      }
      return [toPoint(a1, s, va)];
    }

    // If we've reached this point, then the lines are either parallel or the
    // same, but the segments could overlap partially or fully, or not at all.
    // So we need to find the overlap, if any. To do that, we can use e, which is
    // the (vector) difference between the two initial points. If this is parallel
    // with the line itself, then the two lines are the same line, and there will
    // be overlap.
    //const sqrLenE = dotProduct(e, e);
    kross = crossProduct(e, va);
    sqrKross = kross * kross;

    if (sqrKross > 0 /* EPS * sqLenB * sqLenE */) {
    // Lines are just parallel, not the same. No overlap.
      return null;
    }

    var sa = dotProduct(va, e) / sqrLenA;
    var sb = sa + dotProduct(va, vb) / sqrLenA;
    var smin = Math.min(sa, sb);
    var smax = Math.max(sa, sb);

    // this is, essentially, the FindIntersection acting on floats from
    // Schneider & Eberly, just inlined into this function.
    if (smin <= 1 && smax >= 0) {

      // overlap on an end point
      if (smin === 1) {
        return noEndpointTouch ? null : [toPoint(a1, smin > 0 ? smin : 0, va)];
      }

      if (smax === 0) {
        return noEndpointTouch ? null : [toPoint(a1, smax < 1 ? smax : 1, va)];
      }

      if (noEndpointTouch && smin === 0 && smax === 1) { return null; }

      // There's overlap on a segment -- two points of intersection. Return both.
      return [
        toPoint(a1, smin > 0 ? smin : 0, va),
        toPoint(a1, smax < 1 ? smax : 1, va)
      ];
    }

    return null;
  }

  /**
   * @param  {SweepEvent} se1
   * @param  {SweepEvent} se2
   * @param  {Queue}      queue
   * @return {Number}
   */
  function possibleIntersection (se1, se2, queue) {
    // that disallows self-intersecting polygons,
    // did cost us half a day, so I'll leave it
    // out of respect
    // if (se1.isSubject === se2.isSubject) return;
    var inter = intersection(
      se1.point, se1.otherEvent.point,
      se2.point, se2.otherEvent.point
    );

    var nintersections = inter ? inter.length : 0;
    if (nintersections === 0) { return 0; } // no intersection

    // the line segments intersect at an endpoint of both line segments
    if ((nintersections === 1) &&
        (equals(se1.point, se2.point) ||
         equals(se1.otherEvent.point, se2.otherEvent.point))) {
      return 0;
    }

    if (nintersections === 2 && se1.isSubject === se2.isSubject) {
      // if(se1.contourId === se2.contourId){
      // console.warn('Edges of the same polygon overlap',
      //   se1.point, se1.otherEvent.point, se2.point, se2.otherEvent.point);
      // }
      //throw new Error('Edges of the same polygon overlap');
      return 0;
    }

    // The line segments associated to se1 and se2 intersect
    if (nintersections === 1) {

      // if the intersection point is not an endpoint of se1
      if (!equals(se1.point, inter[0]) && !equals(se1.otherEvent.point, inter[0])) {
        divideSegment(se1, inter[0], queue);
      }

      // if the intersection point is not an endpoint of se2
      if (!equals(se2.point, inter[0]) && !equals(se2.otherEvent.point, inter[0])) {
        divideSegment(se2, inter[0], queue);
      }
      return 1;
    }

    // The line segments associated to se1 and se2 overlap
    var events        = [];
    var leftCoincide  = false;
    var rightCoincide = false;

    if (equals(se1.point, se2.point)) {
      leftCoincide = true; // linked
    } else if (compareEvents(se1, se2) === 1) {
      events.push(se2, se1);
    } else {
      events.push(se1, se2);
    }

    if (equals(se1.otherEvent.point, se2.otherEvent.point)) {
      rightCoincide = true;
    } else if (compareEvents(se1.otherEvent, se2.otherEvent) === 1) {
      events.push(se2.otherEvent, se1.otherEvent);
    } else {
      events.push(se1.otherEvent, se2.otherEvent);
    }

    if ((leftCoincide && rightCoincide) || leftCoincide) {
      // both line segments are equal or share the left endpoint
      se2.type = NON_CONTRIBUTING;
      se1.type = (se2.inOut === se1.inOut)
        ? SAME_TRANSITION : DIFFERENT_TRANSITION;

      if (leftCoincide && !rightCoincide) {
        // honestly no idea, but changing events selection from [2, 1]
        // to [0, 1] fixes the overlapping self-intersecting polygons issue
        divideSegment(events[1].otherEvent, events[0].point, queue);
      }
      return 2;
    }

    // the line segments share the right endpoint
    if (rightCoincide) {
      divideSegment(events[0], events[1].point, queue);
      return 3;
    }

    // no line segment includes totally the other one
    if (events[0] !== events[3].otherEvent) {
      divideSegment(events[0], events[1].point, queue);
      divideSegment(events[1], events[2].point, queue);
      return 3;
    }

    // one line segment includes the other one
    divideSegment(events[0], events[1].point, queue);
    divideSegment(events[3].otherEvent, events[2].point, queue);

    return 3;
  }

  /**
   * @param  {SweepEvent} le1
   * @param  {SweepEvent} le2
   * @return {Number}
   */
  function compareSegments(le1, le2) {
    if (le1 === le2) { return 0; }

    // Segments are not collinear
    if (signedArea(le1.point, le1.otherEvent.point, le2.point) !== 0 ||
      signedArea(le1.point, le1.otherEvent.point, le2.otherEvent.point) !== 0) {

      // If they share their left endpoint use the right endpoint to sort
      if (equals(le1.point, le2.point)) { return le1.isBelow(le2.otherEvent.point) ? -1 : 1; }

      // Different left endpoint: use the left endpoint to sort
      if (le1.point[0] === le2.point[0]) { return le1.point[1] < le2.point[1] ? -1 : 1; }

      // has the line segment associated to e1 been inserted
      // into S after the line segment associated to e2 ?
      if (compareEvents(le1, le2) === 1) { return le2.isAbove(le1.point) ? -1 : 1; }

      // The line segment associated to e2 has been inserted
      // into S after the line segment associated to e1
      return le1.isBelow(le2.point) ? -1 : 1;
    }

    if (le1.isSubject === le2.isSubject) { // same polygon
      var p1 = le1.point, p2 = le2.point;
      if (p1[0] === p2[0] && p1[1] === p2[1]/*equals(le1.point, le2.point)*/) {
        p1 = le1.otherEvent.point; p2 = le2.otherEvent.point;
        if (p1[0] === p2[0] && p1[1] === p2[1]) { return 0; }
        else { return le1.contourId > le2.contourId ? 1 : -1; }
      }
    } else { // Segments are collinear, but belong to separate polygons
      return le1.isSubject ? -1 : 1;
    }

    return compareEvents(le1, le2) === 1 ? 1 : -1;
  }

  function subdivide(eventQueue, subject, clipping, sbbox, cbbox, operation) {
    var sweepLine = new SplayTree(compareSegments);
    var sortedEvents = [];

    var rightbound = Math.min(sbbox[2], cbbox[2]);

    var prev, next, begin;

    while (eventQueue.length !== 0) {
      var event = eventQueue.pop();
      sortedEvents.push(event);

      // optimization by bboxes for intersection and difference goes here
      if ((operation === INTERSECTION && event.point[0] > rightbound) ||
          (operation === DIFFERENCE   && event.point[0] > sbbox[2])) {
        break;
      }

      if (event.left) {
        next  = prev = sweepLine.insert(event);
        begin = sweepLine.minNode();

        if (prev !== begin) { prev = sweepLine.prev(prev); }
        else                { prev = null; }

        next = sweepLine.next(next);

        var prevEvent = prev ? prev.key : null;
        var prevprevEvent = (void 0);
        computeFields(event, prevEvent, operation);
        if (next) {
          if (possibleIntersection(event, next.key, eventQueue) === 2) {
            computeFields(event, prevEvent, operation);
            computeFields(event, next.key, operation);
          }
        }

        if (prev) {
          if (possibleIntersection(prev.key, event, eventQueue) === 2) {
            var prevprev = prev;
            if (prevprev !== begin) { prevprev = sweepLine.prev(prevprev); }
            else                    { prevprev = null; }

            prevprevEvent = prevprev ? prevprev.key : null;
            computeFields(prevEvent, prevprevEvent, operation);
            computeFields(event,     prevEvent,     operation);
          }
        }
      } else {
        event = event.otherEvent;
        next = prev = sweepLine.find(event);

        if (prev && next) {

          if (prev !== begin) { prev = sweepLine.prev(prev); }
          else                { prev = null; }

          next = sweepLine.next(next);
          sweepLine.remove(event);

          if (next && prev) {
            possibleIntersection(prev.key, next.key, eventQueue);
          }
        }
      }
    }
    return sortedEvents;
  }

  /**
   * @param  {Array.<SweepEvent>} sortedEvents
   * @return {Array.<SweepEvent>}
   */
  function orderEvents(sortedEvents) {
    var event, i, len, tmp;
    var resultEvents = [];
    for (i = 0, len = sortedEvents.length; i < len; i++) {
      event = sortedEvents[i];
      if ((event.left && event.inResult) ||
        (!event.left && event.otherEvent.inResult)) {
        resultEvents.push(event);
      }
    }
    // Due to overlapping edges the resultEvents array can be not wholly sorted
    var sorted = false;
    while (!sorted) {
      sorted = true;
      for (i = 0, len = resultEvents.length; i < len; i++) {
        if ((i + 1) < len &&
          compareEvents(resultEvents[i], resultEvents[i + 1]) === 1) {
          tmp = resultEvents[i];
          resultEvents[i] = resultEvents[i + 1];
          resultEvents[i + 1] = tmp;
          sorted = false;
        }
      }
    }


    for (i = 0, len = resultEvents.length; i < len; i++) {
      event = resultEvents[i];
      event.pos = i;
    }

    // imagine, the right event is found in the beginning of the queue,
    // when his left counterpart is not marked yet
    for (i = 0, len = resultEvents.length; i < len; i++) {
      event = resultEvents[i];
      if (!event.left) {
        tmp = event.pos;
        event.pos = event.otherEvent.pos;
        event.otherEvent.pos = tmp;
      }
    }

    return resultEvents;
  }


  /**
   * @param  {Number} pos
   * @param  {Array.<SweepEvent>} resultEvents
   * @param  {Object>}    processed
   * @return {Number}
   */
  function nextPos(pos, resultEvents, processed, origIndex) {
    var newPos = pos + 1;
    var length = resultEvents.length;
    if (newPos > length - 1) { return pos - 1; }
    var p  = resultEvents[pos].point;
    var p1 = resultEvents[newPos].point;


    // while in range and not the current one by value
    while (newPos < length && p1[0] === p[0] && p1[1] === p[1]) {
      if (!processed[newPos]) {
        return newPos;
      } else   {
        newPos++;
      }
      p1 = resultEvents[newPos].point;
    }

    newPos = pos - 1;

    while (processed[newPos] && newPos >= origIndex) {
      newPos--;
    }
    return newPos;
  }


  /**
   * @param  {Array.<SweepEvent>} sortedEvents
   * @return {Array.<*>} polygons
   */
  function connectEdges(sortedEvents, operation) {
    var i, len;
    var resultEvents = orderEvents(sortedEvents);

    // "false"-filled array
    var processed = {};
    var result = [];
    var event;

    for (i = 0, len = resultEvents.length; i < len; i++) {
      if (processed[i]) { continue; }
      var contour = [[]];

      if (!resultEvents[i].isExteriorRing) {
        if (operation === DIFFERENCE && !resultEvents[i].isSubject && result.length === 0) {
          result.push(contour);
        } else if (result.length === 0) {
          result.push([[contour]]);
        } else {
          result[result.length - 1].push(contour[0]);
        }
      } else if (operation === DIFFERENCE && !resultEvents[i].isSubject && result.length > 1) {
        result[result.length - 1].push(contour[0]);
      } else {
        result.push(contour);
      }

      var ringId = result.length - 1;
      var pos = i;

      var initial = resultEvents[i].point;
      contour[0].push(initial);

      while (pos >= i) {
        event = resultEvents[pos];
        processed[pos] = true;

        if (event.left) {
          event.resultInOut = false;
          event.contourId   = ringId;
        } else {
          event.otherEvent.resultInOut = true;
          event.otherEvent.contourId   = ringId;
        }

        pos = event.pos;
        processed[pos] = true;
        contour[0].push(resultEvents[pos].point);
        pos = nextPos(pos, resultEvents, processed, i);
      }

      pos = pos === -1 ? i : pos;

      event = resultEvents[pos];
      processed[pos] = processed[event.pos] = true;
      event.otherEvent.resultInOut = true;
      event.otherEvent.contourId   = ringId;
    }

    // Handle if the result is a polygon (eg not multipoly)
    // Commented it again, let's see what do we mean by that
    // if (result.length === 1) result = result[0];
    return result;
  }

  var tinyqueue = TinyQueue;
  var default_1 = TinyQueue;

  function TinyQueue(data, compare) {
      var this$1 = this;

      if (!(this instanceof TinyQueue)) { return new TinyQueue(data, compare); }

      this.data = data || [];
      this.length = this.data.length;
      this.compare = compare || defaultCompare;

      if (this.length > 0) {
          for (var i = (this.length >> 1) - 1; i >= 0; i--) { this$1._down(i); }
      }
  }

  function defaultCompare(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
  }

  TinyQueue.prototype = {

      push: function (item) {
          this.data.push(item);
          this.length++;
          this._up(this.length - 1);
      },

      pop: function () {
          if (this.length === 0) { return undefined; }

          var top = this.data[0];
          this.length--;

          if (this.length > 0) {
              this.data[0] = this.data[this.length];
              this._down(0);
          }
          this.data.pop();

          return top;
      },

      peek: function () {
          return this.data[0];
      },

      _up: function (pos) {
          var data = this.data;
          var compare = this.compare;
          var item = data[pos];

          while (pos > 0) {
              var parent = (pos - 1) >> 1;
              var current = data[parent];
              if (compare(item, current) >= 0) { break; }
              data[pos] = current;
              pos = parent;
          }

          data[pos] = item;
      },

      _down: function (pos) {
          var this$1 = this;

          var data = this.data;
          var compare = this.compare;
          var halfLength = this.length >> 1;
          var item = data[pos];

          while (pos < halfLength) {
              var left = (pos << 1) + 1;
              var right = left + 1;
              var best = data[left];

              if (right < this$1.length && compare(data[right], best) < 0) {
                  left = right;
                  best = data[right];
              }
              if (compare(best, item) >= 0) { break; }

              data[pos] = best;
              pos = left;
          }

          data[pos] = item;
      }
  };
  tinyqueue.default = default_1;

  var max = Math.max;
  var min = Math.min;

  var contourId = 0;


  function processPolygon(contourOrHole, isSubject, depth, Q, bbox, isExteriorRing) {
    var i, len, s1, s2, e1, e2;
    for (i = 0, len = contourOrHole.length - 1; i < len; i++) {
      s1 = contourOrHole[i];
      s2 = contourOrHole[i + 1];
      e1 = new SweepEvent(s1, false, undefined, isSubject);
      e2 = new SweepEvent(s2, false, e1,        isSubject);
      e1.otherEvent = e2;

      if (s1[0] === s2[0] && s1[1] === s2[1]) {
        continue; // skip collapsed edges, or it breaks
      }

      e1.contourId = e2.contourId = depth;
      if (!isExteriorRing) {
        e1.isExteriorRing = false;
        e2.isExteriorRing = false;
      }
      if (compareEvents(e1, e2) > 0) {
        e2.left = true;
      } else {
        e1.left = true;
      }

      var x = s1[0], y = s1[1];
      bbox[0] = min(bbox[0], x);
      bbox[1] = min(bbox[1], y);
      bbox[2] = max(bbox[2], x);
      bbox[3] = max(bbox[3], y);

      // Pushing it so the queue is sorted from left to right,
      // with object on the left having the highest priority.
      Q.push(e1);
      Q.push(e2);
    }
  }


  function fillQueue(subject, clipping, sbbox, cbbox, operation) {
    var eventQueue = new tinyqueue(null, compareEvents);
    var polygonSet, isExteriorRing, i, ii, j, jj; //, k, kk;

    for (i = 0, ii = subject.length; i < ii; i++) {
      polygonSet = subject[i];
      for (j = 0, jj = polygonSet.length; j < jj; j++) {
        isExteriorRing = j === 0;
        if (isExteriorRing) { contourId++; }
        processPolygon(polygonSet[j], true, contourId, eventQueue, sbbox, isExteriorRing);
      }
    }

    for (i = 0, ii = clipping.length; i < ii; i++) {
      polygonSet = clipping[i];
      for (j = 0, jj = polygonSet.length; j < jj; j++) {
        isExteriorRing = j === 0;
        if (operation === DIFFERENCE) { isExteriorRing = false; }
        if (isExteriorRing) { contourId++; }
        processPolygon(polygonSet[j], false, contourId, eventQueue, cbbox, isExteriorRing);
      }
    }

    return eventQueue;
  }

  var EMPTY = [];


  function trivialOperation(subject, clipping, operation) {
    var result = null;
    if (subject.length * clipping.length === 0) {
      if        (operation === INTERSECTION) {
        result = EMPTY;
      } else if (operation === DIFFERENCE) {
        result = subject;
      } else if (operation === UNION ||
                 operation === XOR) {
        result = (subject.length === 0) ? clipping : subject;
      }
    }
    return result;
  }


  function compareBBoxes(subject, clipping, sbbox, cbbox, operation) {
    var result = null;
    if (sbbox[0] > cbbox[2] ||
        cbbox[0] > sbbox[2] ||
        sbbox[1] > cbbox[3] ||
        cbbox[1] > sbbox[3]) {
      if        (operation === INTERSECTION) {
        result = EMPTY;
      } else if (operation === DIFFERENCE) {
        result = subject;
      } else if (operation === UNION ||
                 operation === XOR) {
        result = subject.concat(clipping);
      }
    }
    return result;
  }


  function boolean(subject, clipping, operation) {
    if (typeof subject[0][0][0] === 'number') {
      subject = [subject];
    }
    if (typeof clipping[0][0][0] === 'number') {
      clipping = [clipping];
    }
    var trivial = trivialOperation(subject, clipping, operation);
    if (trivial) {
      return trivial === EMPTY ? null : trivial;
    }
    var sbbox = [Infinity, Infinity, -Infinity, -Infinity];
    var cbbox = [Infinity, Infinity, -Infinity, -Infinity];

    //console.time('fill queue');
    var eventQueue = fillQueue(subject, clipping, sbbox, cbbox, operation);
    //console.timeEnd('fill queue');

    trivial = compareBBoxes(subject, clipping, sbbox, cbbox, operation);
    if (trivial) {
      return trivial === EMPTY ? null : trivial;
    }
    //console.time('subdivide edges');
    var sortedEvents = subdivide(eventQueue, subject, clipping, sbbox, cbbox, operation);
    //console.timeEnd('subdivide edges');

    //console.time('connect vertices');
    var result = connectEdges(sortedEvents, operation);
    //console.timeEnd('connect vertices');
    return result;
  }

  function union (subject, clipping) {
    return boolean(subject, clipping, UNION);
  }

  function diff (subject, clipping) {
    return boolean(subject, clipping, DIFFERENCE);
  }

  function xor (subject, clipping){
    return boolean(subject, clipping, XOR);
  }

  function intersection$1 (subject, clipping) {
    return boolean(subject, clipping, INTERSECTION);
  }

  /**
   * @enum {Number}
   */
  var operations = { UNION: UNION, DIFFERENCE: DIFFERENCE, INTERSECTION: INTERSECTION, XOR: XOR };

  exports.union = union;
  exports.diff = diff;
  exports.xor = xor;
  exports.intersection = intersection$1;
  exports.operations = operations;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=martinez.umd.js.map


/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/punycode/punycode.js":
/*!**************************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/punycode/punycode.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports =  true && exports &&
		!exports.nodeType && exports;
	var freeModule =  true && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return punycode;
		}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

}(this));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module), __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/querystring-es3/decode.js":
/*!************************************************!*\
  !*** ./node_modules/querystring-es3/decode.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ "./node_modules/querystring-es3/encode.js":
/*!************************************************!*\
  !*** ./node_modules/querystring-es3/encode.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ "./node_modules/querystring-es3/index.js":
/*!***********************************************!*\
  !*** ./node_modules/querystring-es3/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ "./node_modules/querystring-es3/decode.js");
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ "./node_modules/querystring-es3/encode.js");


/***/ }),

/***/ "./node_modules/url/url.js":
/*!*********************************!*\
  !*** ./node_modules/url/url.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(/*! punycode */ "./node_modules/node-libs-browser/node_modules/punycode/punycode.js");
var util = __webpack_require__(/*! ./util */ "./node_modules/url/util.js");

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(/*! querystring */ "./node_modules/querystring-es3/index.js");

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),

/***/ "./node_modules/url/util.js":
/*!**********************************!*\
  !*** ./node_modules/url/util.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/adjofer/index.js":
/*!******************************!*\
  !*** ./src/adjofer/index.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var _status_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./status.js */ "./src/adjofer/status.js");
/* harmony import */ var app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/interface/index.js */ "./src/interface/index.js");
/* harmony import */ var _load_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./load.js */ "./src/adjofer/load.js");
/* harmony import */ var app_centro_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/centro/index.js */ "./src/centro/index.js");
/* harmony import */ var app_localidad_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/localidad/index.js */ "./src/localidad/index.js");
/* harmony import */ var app_solicitud__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/solicitud */ "./src/solicitud.js");
/**
 * @name MapAdjOfer
 * @class
 * @hideconstructor
 * @classdesc Implementa un mapa que muestra la adjudicación de vacantes provisionales
 * y la oferta educativa de los centros públicos dependientes de la Junta de Andalucía.
 *
 * @param {String} id  Identificador del elemento HTML
 * donde se incrustará el mapa.
 * @param {Obj} opts Opciones de configuración.
 * @param {String} opts.path Ruta relativa desde el directorio en que
 * se encuentra la página web al directorio ``dist``.
 * @param {Boolean} opts.light Si ``true``, define el comportamiento del evento
 * *click* como "seleccionar el centro pulsado" y el evento *contextmenu* muestra
 * un menú contextual que permite generar crear rutas e isocronas. Esto libera de
 * tener que realizar en la interfaz la definición de cómo seleccionar centro y cómo
 * ordenar que se creen rutas e isocronas.
 * @param {String} opts.ors  La clave para el uso de los servios de OpenRouteService.
 * @param {Function} opts.chunkProgress   Función que se ejecuta periódicamente
 * si se demora demasiado la creación de las isoronas.
 */







const MapAdjOfer = L.Evented.extend({
   /** @lends MapAdjOfer.prototype */

   options: {
      id: "map",
      center: [37.45, -4.5],
      loading: true,    // Presenta un gif que ameniza la carga.
      zoom: 8,
      centeredZoom: 12,
      unclusterZoom: 14,
      autostatus: true, // Aplica el status inicial directamente.
      light: true,      // Issue #41
      search: true,     // Issue #51
      ors: false,       // Issue #42
      icon: "boliche"   // Estilo con que se definen las nuevas marcas.
   },

   statics: {
   },

   initialize: function(options) {
      L.Util.setOptions(this, options);

      let center = this.options.center,
          zoom   = this.options.zoom;

      delete this.options.center;
      delete this.options.zoom;

      if(this.options.loading === true) this.options.loading = app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["loading"];

      _load_js__WEBPACK_IMPORTED_MODULE_2__["default"].call(this);
      app_centro_index_js__WEBPACK_IMPORTED_MODULE_3__["create"].call(this);
      // Issue #79
      app_localidad_index_js__WEBPACK_IMPORTED_MODULE_4__["default"].call(this);
      this.solicitud = new app_solicitud__WEBPACK_IMPORTED_MODULE_5__["default"](this);
      // Fin issue #79
      _status_js__WEBPACK_IMPORTED_MODULE_0__["build"].call(this);  // Issue #62

      new Promise(resolve => {
         // Si se proporcionó centro, no se calcula la posición.
         if(!options.center && navigator.geolocation.getCurrentPosition) {
            navigator.geolocation.getCurrentPosition(pos => {
               const coords = pos.coords;
               resolve({
                  zoom: this.options.centeredZoom,
                  center: [coords.latitude, coords.longitude]
               });
            }, function (err) {
               console.warn("No es posible establecer la ubicación del dispositivo");
               resolve({
                  zoom: zoom,
                  center: center
               });
            }, {
               timeout: 5000,
               maximumAge: 1800000
            });
         }
         else resolve({zoom: zoom, center: center});

      }).then(opts => {
         this.map.setView(opts.center, opts.zoom, {animate: false});
         this.tileLayer.addTo(this.map);
         this.cluster.addTo(this.map);

         if(options.autostatus && options.status) {
            this.setStatus();  // Issue #57
            this.fire("statusset", {status: true});
         }
      });
   },

   /**
    * Devuelve la clase de icono cuyo nombre es el estilo suuministrado.
    * @param {String} estilo  Nombre del estilo.
    * @returns {L.DivIcon}
    */
   getIcon: function(estilo) {
      return app_centro_index_js__WEBPACK_IMPORTED_MODULE_3__["catalogo"][estilo] || null;
   },

   /**
    * Cambia el estilo de icono de todos las marcas de centro existentes.
    * En cambio, si la pretensión fuera empezar a dibujar marcas con
    * distinto estilo de icono, habría que hacer:
    *
    * @example
    *
    * mapadjofer.options.icon = "otro_estilo";
    *
    * @param {String} estilo     El estilo deseado para el icono.
    */
   setIcon: function(estilo) {
      const Icono = this.getIcon(estilo);
      if(!Icono) throw new Error(`${estilo}: Estilo de icono desconocido`);

      Icono.onready(() => this.Centro.store.forEach(m => m.setIcon(new Icono())));
      this.options.icon = estilo;

      return this;
   },

   /**
    * Agregar centros al mapa.
    *
    * @param {String|Object} datos  Datos en formato GeoJSON o URL donde conseguirlos.
    */
   agregarCentros: function(datos) {
      const Icono = app_centro_index_js__WEBPACK_IMPORTED_MODULE_3__["catalogo"][this.options.icon];
      Icono.onready(() => {
         if(typeof datos === "string") {  // Es una URL.
            if(this.options.loading) this.options.loading();
            L.utils.load({
               url: datos,
               callback: xhr => {
                  const datos = JSON.parse(xhr.responseText);
                  if(this.options.loading) this.options.loading();
                  this.agregarCentros(datos);
               }
            });
         }
         else {
            this.general = datos.features[0].properties;
            // Capa intermedia capaz de leer objetos GeoJSON.
            const layer = L.geoJSON(datos, {
               pointToLayer: (f, p) => {
                  const centro = new this.Centro(p, {
                     icon: new Icono(),
                     title: f.properties.id.nom
                  });

                  // Issue #33, #79
                  centro.on("dataset", e => {
                     // Para cada centro que creemos hay que añadir a los datos
                     // la propiedad que indica si la marca está o no seleccionada.
                     e.target.changeData({sel: false, peticion: 0});
                     Object.defineProperty(e.target.getData(), "codigo", {
                        get: function() {
                           return this.id.cod.toString().padStart(8, "0") + "C";
                        }
                     });
                  });


                  // Issue #41
                  if(this.options.light) centro.once("dataset", e => {
                     e.target.on("click", e => {
                        switch(this.mode) {
                           case "normal":
                              this.seleccionado = this.seleccionado === e.target?null:e.target
                              break;
                           case "solicitud":
                              this.fire("requestclick", {marker: e.target});
                              break;
                        }
                     });
                  });
                  // Fin issue #33, #41, #79

                  return centro;
               },
               onEachFeature: (f, l) => {
                  if(this.options.light) l.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].centro.call(this, l));
               }
            });

            this.cluster.addLayer(layer);
            this.fire("dataloaded");
         }
      });
   },

   /**
    * Calcula la dirección postal del origen
    */
   calcularOrigen: function() {
      if(!this.origen) return;
      this.geoCodificar(this.origen.getLatLng());
      this.once("addressset", e => {
         if(typeof this.direccion === "string") this.origen.postal = this.direccion;
      });
      // Deshabilitamos inmediatamente en el menú contextual
      // la entrada correspondiente a geolocalizar el origen.
      if(this.options.light) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
      }
   },

   /**
    * Establece el origen de los viajes.
    *
    * @param {L.LatLng} latlng  Coordenadas en las que fijarlo.
    */
   setOrigen: function(latlng) {
      if(latlng) {
         this.origen = new L.Marker(latlng, {
            title: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
         });
         if(this.options.light) {
            this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
         }
      }
      else this.origen = null;
   },

   /**
    * Establece las isocronas referidas a un origen
    * @param {?L.LatLng|L.Marker} o Referencia para la isocronas. Si no ser
    * proporciona se entenderá que es el origen de coordenadas.
    */
   setIsocronas: function(o) {
      if(o && o.getLatLng) o = o.getLanLng();
      if(o === true) o = undefined;
      this.isocronas = o;
      if(o && this.options.light && this.origen) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
      }
   },

   /**
    * Devuelve las capas de las áreas de las isocronas dibujadas en el mapa.
    *
    * @returns {Array}
    */
   getIsocronas: function(maciza) {
      return this.ors.isocronas.get(maciza);
   },

   /**
    * Establece la ruta entre el origen y un centro
    */
   setRuta: function(centro) {
      this.ruta = centro;
      if(centro && this.options.light && this.origen) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
      }
   },

   geoCodificar: function(query) {
      this.direccion = query
   },

   getStatus: _status_js__WEBPACK_IMPORTED_MODULE_0__["get"],
   setStatus: _status_js__WEBPACK_IMPORTED_MODULE_0__["set"],
   progressBar: app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["progressBar"]
});

/* harmony default export */ __webpack_exports__["default"] = (function(opts) {
   if(opts.status) opts = Object.assign(opts, _status_js__WEBPACK_IMPORTED_MODULE_0__["getOpts"](opts.status));  // Issue #62
   return new MapAdjOfer(opts);
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/adjofer/load.js":
/*!*****************************!*\
  !*** ./src/adjofer/load.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/interface/index.js */ "./src/interface/index.js");
/* harmony import */ var app_ors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/ors */ "./src/ors/index.js");




/**
 * Carga el mapa y crea la capa de cluster donde se agregan los centros.
 * @this {MapAdjOfer.prototype} El objeto que implemnta el mapa
 * @private
 */
function load() {

   const options = {},
         nooptions = ["light", "ors", "id", "search", "icon",
                      "unclusterZoom", "centeredZoom", "loading"];

   for(const name in this.options) {
      if(nooptions.indexOf(name) !== -1) continue
      options[name] = this.options[name];
   }

   if(this.options.light) Object.assign(options, app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].map.call(this));

   this.map = L.map(this.options.id, options);
   this.map.zoomControl.setPosition('bottomright');

   Object.defineProperty(this, "tileLayer", {
      value: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
             }),
      enumerable: false,
      configurable: false
   });

   /**
    * Capa donde se agregan las marcas
    * @memberof MapaAdjOfer.prototype
    * @type {L.MarkerClusterGroup}
    */
   this.cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      // Al llegar a este nivel de zoom se ven todas las marcas.
      disableClusteringAtZoom: this.options.unclusterZoom,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: L.utils.noFilteredIconCluster,
   });

   // Como clearLayers, pero no se carga las localidades.
   this.cluster.clearCentros = () => {
      for(const marker of this.cluster.getLayers()) {
         if(marker instanceof this.Centro) this.cluster.removeLayer(marker);
      }
   }

   if(this.options.search) this.map.addControl(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["searchBar"].call(this));  // Issue #51

   // Issue #27
   app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["crearAttrEvent"].call(this, "origen", "originset");
   app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["crearAttrEvent"].call(this, "seleccionado", "markerselect");
   // Fin issue #27

   app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["crearAttrEvent"].call(this, "mode", "modeset", "normal"); // Issue #79

   // Aplicación de issue #33: Cambiamos la marca
   // al seleccionarla o deseleccionarla.
   this.on("markerselect", function(e) {
      if(e.oldval) {
         e.oldval.changeData({sel: false});
         e.oldval.refresh();
      }
      if(e.newval) {
         e.newval.changeData({sel: true});
         e.newval.refresh();
      }
   });

   // Al seleccionar/deseleccionar, hay que cambiar los
   // menús contextuales de las marcas implicadas y
   // el del origen (su entrada sobre rutas).
   this.on("markerselect", e => {
      if(!this.options.light) return;
      for(const c of [e.oldval, e.newval]) {
         if(c) {
            c.unbindContextMenu();
            c.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].centro.call(this, c));
         }
      }
      if(this.origen) {
         this.origen.unbindContextMenu();
         this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
      }
   });

   // Fijar un origen, implica crear una marca sobre
   // el mapa y destruir la antigua.
   this.on("originset", e => {
      if(e.oldval) e.oldval.removeFrom(this.map);
      if(e.newval) e.newval.addTo(this.map);
   });

   if(this.options.ors) {
      /**
       * Objecto de acceso a los servicios de OpenRouteService.
       * @memberof {MapAdjOfer.prototype}
       * @type {ORS}
       */
      this.ors = new app_ors__WEBPACK_IMPORTED_MODULE_2__["default"](this);
      Object.defineProperty(this, "ors", {writable: false, configurable: false});

      app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["crearAttrEvent"].call(this, "contador", "counteradd", 0);

      Object.defineProperties(this, {
         /** @lends MapAdjOfer.prototype */
         "isocronas": {
            get: function() {
               return this.ors.isocronas.areas;
            },
            set: function(value) {
               const old = this.isocronas;
               if(value || value === undefined) {
                  this.ors.isocronas.create(value).then((response) => {
                     if(response || response === undefined) this.contador++;
                     if(response !== null) { 
                        this.fire("isochroneset", {oldval: old, newval: this.isocronas});
                     }
                  });
               }
               else {
                  this.ors.isocronas.remove();
                  this.fire("isochroneset", {oldval: old, newval: this.isocronas});
               }
            },
            enumerable: true,
            configurable: false
         },
         // Issue #46
         "direccion": {
            get: function() {
               return this.ors.geocode.value;
            },
            set: function(value) {  // Cadena con la dirección o coordenadas.
               const old = this.ors.geocode.value;
               if(value) {
                  this.ors.geocode.query(value).then((response) => {
                     if(response !== null) {
                        this.contador++;
                        this.fire("addressset", {oldval: old, newval: value});
                     }
                  });
               }
               else console.warn("No tiene sentido calcular con valor nulo una dirección");
            },
            enumerable: true,
            configurable: false
         },
         // Fin issue #46
         // Issue #47
         "ruta": {
            get: function() {
               return this.ors.ruta.value;
            },
            set: function(destino) {
               const old = this.ruta;
               if(destino) {
                  this.ors.ruta.create(destino).then((response) => {
                     if(response || response === undefined) this.contador++;
                     if(response !== null) { 
                        this.fire("routeset", {oldval: old, newval: this.ruta});
                     }
                  });
               }
               else {
                  this.ors.ruta.remove();
                  this.fire("routeset", {oldval: old, newval: this.ruta});
               }

            },
            enumerable: true,
            configurable: false
         }
         // Fin issue #47
      });
      
      // modifica el menú contextual del origen.
      this.on("isochroneset", e => {
         if(this.options.light && this.origen) {
            this.origen.unbindContextMenu();
            this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
         }
      });

      // Issue #46
      // Asociamos un evento "geocode" al momento en que
      // averiguamos la dirección postal del origen.
      this.on("originset", e => {
         if(!e.newval) return;
         app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["crearAttrEvent"].call(e.newval, "postal", "geocode");
         // Incluimos la dirección como title y deshabilitamos
         // la posibilidad de obtenerla a través del menú contextual.
         e.newval.on("geocode", x => {
            e.newval.getElement().setAttribute("title", x.newval);
            if(this.options.light) {
               e.newval.unbindContextMenu();
               e.newval.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
            }
         });
      });

      // Elimina la isocrona al fijar un nuevo origen.
      this.on("originset", e => this.setIsocronas(null));
      // Fin issue #46

      // Issue #47
      this.on("routeset", e => {
         if(!this.options.light) return;

         if(e.newval) {
            const destino = e.newval.destino;
            destino.unbindContextMenu();
            destino.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].centro.call(this, destino));
         }
         if(e.oldval) {
            const destino = e.oldval.destino;
            destino.unbindContextMenu();
            destino.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].centro.call(this, destino));
         }
         if(this.origen) {
            this.origen.unbindContextMenu();
            this.origen.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].origen.call(this));
         }
      });
      // Al cambiar de origen, hay que cambiar los menús contextuales de
      // todas las marcas, ya que no tiene sentido la entrada de crear ruta.
      this.on("originset", e => {
         if(this.ruta) this.setRuta(null);

         if(!this.options.light) return;
         for(const c of this.Centro.store) {
            c.unbindContextMenu();
            c.bindContextMenu(app_interface_index_js__WEBPACK_IMPORTED_MODULE_1__["contextMenu"].centro.call(this, c));
         }
      });
      // Fin issue #47

      // Issue #55
      this.on("routeset", e => {
         if(e.newval) {
            e.newval.destino.once("remove", e => {
               // Al desaparecer el centro, hay ruta y él es el destino.
               if(this.ruta.destino === e.target) {
                  this.setRuta(null);
                  // La ruta se despidió a la francesa; vamos, que se fue
                  // porque desapareció el destino, y no por haberse eliminado.
                  e.target._francesa = true;
               }
            });
            e.newval.destino.once("add", e => {
               // Al volver a aparecer, él sigue siendo el destino
               if(this.ors.ruta.calc.destino === e.target && e.target._francesa) {
                  this.setRuta(e.target);
               }
               delete e.target._francesa;
            });
         }
      });
      // Fin issue #55
   }
}

/* harmony default export */ __webpack_exports__["default"] = (load);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/adjofer/status.js":
/*!*******************************!*\
  !*** ./src/adjofer/status.js ***!
  \*******************************/
/*! exports provided: getOpts, build, set, get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOpts", function() { return getOpts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "build", function() { return build; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
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




/***/ }),

/***/ "./src/centro/corrections.js":
/*!***********************************!*\
  !*** ./src/centro/corrections.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Registra las correcciones disponibles.
 * @this {MapAdjOfer} El objeto que implemnta el mapa
 * @private
 */
/* harmony default export */ __webpack_exports__["default"] = (function() {
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

});


/***/ }),

/***/ "./src/centro/filters.js":
/*!*******************************!*\
  !*** ./src/centro/filters.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(turf) {/**
 * Registra los filtros definidos para este tipo de mapa.
 * @this {MapAdjOfer} El objeto que implemnta el mapa
 * @private
 */
/* harmony default export */ __webpack_exports__["default"] = (function() {
   // Filtra según cantidad de adjudicaciones.
   this.Centro.registerF("adj", {
      attrs: "adj",
      // opts= {min: 0, inv: false}
      func: function(opts) {
          return !!(opts.inv ^ this.getData().adj.length < opts.min);
      }
   });

   // Filtra según número de enseñanzas.
   this.Centro.registerF("oferta", {
      attrs: "oferta",
      // opts= {min: 0, inv: false}
      func: function(opts) {
          return !!(opts.inv ^ this.getData().oferta.length < opts.min);
      }
   });

   // Elimina los tipos facilitados
   this.Centro.registerF("tipo", {
      attrs: "mod.dif",
      // opts= {tipo: 1, inv: false}  //tipo: 1=normal 2=compensatoria, 4=difícil desempeño
      func: function(opts) {
         const map  = { "compensatoria": 2, "dificil": 4 },
               tipo = map[this.getData().mod.dif] || 1;

         return !!(opts.inv ^ !!(tipo & opts.tipo));
      }
   });

   // Elimina los centros que tengan alguna enseñanza del turno suministrado.
   this.Centro.registerF("turno", {
      attrs: "oferta",
      // opts= {turno: 1}  => 1: mañana, 2: tarde.
      func: function(opts) {
         const map = {
            "matutino": 1,
            "vespertino": 2,
            "ambos": 3
         }
         for(const ens of this.getData().oferta.correctable) {
            if(ens.filters.length > 0) continue; // Está filtrado.
            if(ens.tur === null) continue;  // Semipresenciales.
            const turno = map[ens.tur || (ens.adu?"vespertino":"matutino")];
            if(turno & opts.turno) return true;
         }
         return false;
      }
   });

   // Elimina las marcas que se hallen fuera del área
   this.Centro.registerF("lejos", {
      attrs: "no.existe",
      // opts={area: geojson}
      func: function(opts) {
         const latlng = this.getLatLng(),
               point = {
                  type: "Feature",
                  geometry: {
                     type: "Point",
                     coordinates: [latlng.lng, latlng.lat]
                  }
               }

         return !turf.booleanPointInPolygon(point, opts.area);
      }
   });

   // Al eliminar las isocronas, desaplicamos el filtro lejos.
   this.on("isochroneset", e => {
      if(!e.newval && this.Centro.hasFilter("lejos")) {
         this.Centro.unfilter("lejos");
         this.Centro.invoke("refresh");
      }
   });
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! app/utils/turf.js */ "./src/utils/turf.js")))

/***/ }),

/***/ "./src/centro/icons/boliche.js":
/*!*************************************!*\
  !*** ./src/centro/icons/boliche.js ***!
  \*************************************/
/*! exports provided: converter, url, updater */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "converter", function() { return converter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "url", function() { return url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updater", function() { return updater; });
/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var _images_boliche_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/boliche.svg */ "./src/centro/icons/images/boliche.svg");
/* harmony import */ var _images_boliche_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_boliche_svg__WEBPACK_IMPORTED_MODULE_1__);



// Definición del icono de centro
const converter = new L.utils.Converter(["numvac", "tipo", "numofer", "bil", "ofervar", "sel"])
                             .define("tipo", "mod.dif", t => t || "normal")
                             .define("numvac", "adj", a => a.length)
                             .define("ofervar", "mod.cam", c => c || 0)
                             .define("sel");

// Para calcular la cantidad de oferta se considera
// 1 una enseñanza deseable y 1/3 una que no lo es.
converter.define("numofer", "oferta", function(oferta) {
   let res = 0;
   for(const ens of oferta) {
      if(ens.filters.length>0) continue
      res += ens.mar?3:1;
   }
   return Math.round(res/3);
});

converter.define("bil", "oferta", function(oferta) {
   // Array.from(oferta) y no oferta, para usar el iterador y tener disponible "filters".
   const idiomas = Array.from(oferta).map(ens => ens.filters.length===0 && ens.idi)
                                            // Eliminamos valores nulos y valores repetidos.
                                            .filter((idi, i, arr) => idi && arr.indexOf(idi) === i)

   switch(idiomas.length) {
      case 0:
         return null;
         break;
      case 1:
         return idiomas[0];
         break;
      default:
         return "multi";
   }
});

const updater = (function(o) {
   const paletaOferta = new Array(5).fill(null);
   const paletaPlazas = new Array(7).fill(null);

   // Devuelve blanco o negro dependiendo de cuál contraste mejor con el
   // color RGB suministrado como argumento
   function blancoNegro(rgb) {
      var y = 2.2;

      return (0.2126*Math.pow(rgb[0]/255, y) + 0.7152*Math.pow(rgb[1]/255, y) + 0.0722*Math.pow(rgb[2]/255, y) > Math.pow(0.5, y))?"#000":"#fff";
   }

   paletaOferta[0] = "black";
   for(let i=1; i < paletaOferta.length; i++) {
      paletaOferta[i] = Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["rgb2hex"])(Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["HSLtoRGB"])(i/(paletaOferta.length-1)));
   }

   var tintaPlazas = new Array(paletaPlazas).fill(null);
   paletaPlazas[0] = tintaPlazas[0] = "black";
   for(let i=1; i < paletaPlazas.length; i++) {
      let color = Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["HSLtoRGB"])(i/(paletaPlazas.length-1));
      paletaPlazas[i] = Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["rgb2hex"])(color);
      tintaPlazas[i] = blancoNegro(color);
   }

   function updater(o) {
      const defs = this.querySelector("defs");
      const content = this.querySelector(".content");

      var e = this.querySelector(".ofervac");
      if(o.numofer !== undefined) {
         let x = e.querySelector("circle");
         x.setAttribute("fill", paletaOferta[Math.min(paletaOferta.length-1, o.numofer)]);
      }

      if(o.numvac !== undefined) {
         let i = Math.min(paletaPlazas.length-1, o.numvac);
         e = e.querySelector("path");
         e.setAttribute("fill", paletaPlazas[i]);
         e = e.nextElementSibling;
         e.textContent = o.numvac;
         e.setAttribute("fill", tintaPlazas[i]);
      }

      if(o.ofervar !== undefined) {
         e = this.querySelector(".ofervar");
         if(!o.ofervar) e.setAttribute("display", "none");
         else {
            e.removeAttribute("display");
            e = e.firstElementChild.nextElementSibling;
            if(o.ofervar > 0) e.removeAttribute("display");
            else e.setAttribute("display", "none");
         }
      }

      if(o.bil !== undefined) {
         e = content.querySelector(".bil");
         if(e) defs.appendChild(e);
         if(o.bil !== null) content.appendChild(defs.querySelector(".bil." + o.bil));
      }

      if(o.tipo !== undefined) {
         e = content.querySelector(".tipo");
         if(o.tipo === "normal") {
            if(e) defs.appendChild(e);
         }
         else {
            if(!e) {
               e = defs.querySelector(".tipo");
               content.appendChild(e);
            }
            if(o.tipo === "dificil") e.setAttribute("fill", "#c13");
            else e.setAttribute("fill", "#13b"); 
         }
      }

      if(o.sel !== undefined) {
         e = content.querySelector(".selected");
         if(!o.sel) {
            if(e) defs.appendChild(e);
         }
         else if(!e) {
            e = defs.querySelector(".selected");
            content.prepend(e);
         }
      }
   }

   return updater;
})();

const url = Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["getPath"])("images/boliche.svg");



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/centro/icons/css.js":
/*!*********************************!*\
  !*** ./src/centro/icons/css.js ***!
  \*********************************/
/*! exports provided: converter, html, updater */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "converter", function() { return converter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "html", function() { return html; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updater", function() { return updater; });
// Definición de los iconos CSS (comparten todo menos el estilo)
const converter = new L.utils.Converter(["numvac", "tipo"])
                             .define("tipo", "mod.dif", t => t || "normal")
                             .define("numvac", "adj", a => a.length);

function updater(o) {
   const content = this.querySelector(".content");
   if(o.tipo) content.className = "content " + o.tipo;
   if(o.numvac !== undefined) content.firstElementChild.textContent = o.numvac;
   return this;
}

const html = '<div class="content"><span></span></div><div class="arrow"></div>';



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/centro/icons/images/boliche.svg":
/*!*********************************************!*\
  !*** ./src/centro/icons/images/boliche.svg ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/boliche.svg";

/***/ }),

/***/ "./src/centro/icons/images/solicitud.svg":
/*!***********************************************!*\
  !*** ./src/centro/icons/images/solicitud.svg ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/solicitud.svg";

/***/ }),

/***/ "./src/centro/icons/index.js":
/*!***********************************!*\
  !*** ./src/centro/icons/index.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var _css_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css.js */ "./src/centro/icons/css.js");
/* harmony import */ var _boliche_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boliche.js */ "./src/centro/icons/boliche.js");
/* harmony import */ var _solicitud_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./solicitud.js */ "./src/centro/icons/solicitud.js");
/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var _sass_piolin_sass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sass/piolin.sass */ "./src/centro/icons/sass/piolin.sass");
/* harmony import */ var _sass_piolin_sass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_sass_piolin_sass__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _sass_chupachups_sass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sass/chupachups.sass */ "./src/centro/icons/sass/chupachups.sass");
/* harmony import */ var _sass_chupachups_sass__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_sass_chupachups_sass__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Catálogo de iconos para el centro
 */







/* harmony default export */ __webpack_exports__["default"] = ({
   piolin: L.utils.createMutableIconClass("piolin", {
      iconSize: null,
      iconAnchor: [12.5, 34],
      css: Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_3__["getPath"])("css/piolin.css"),
      html: _css_js__WEBPACK_IMPORTED_MODULE_0__["html"],
      converter: _css_js__WEBPACK_IMPORTED_MODULE_0__["converter"],
      updater: _css_js__WEBPACK_IMPORTED_MODULE_0__["updater"]
   }),
   chupachups: L.utils.createMutableIconClass("chupachups", {
      iconSize: [25, 34],
      iconAnchor: [12.5, 34],
      css: Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_3__["getPath"])("css/chupachups.css"),
      html: _css_js__WEBPACK_IMPORTED_MODULE_0__["html"],
      converter: _css_js__WEBPACK_IMPORTED_MODULE_0__["converter"],
      updater: _css_js__WEBPACK_IMPORTED_MODULE_0__["updater"]
   }),
   solicitud: L.utils.createMutableIconClass("solicitud", {
      iconSize: [40, 40],
      iconAnchor: [19.556, 35.69],
      url: _solicitud_js__WEBPACK_IMPORTED_MODULE_2__["url"],
      converter: _solicitud_js__WEBPACK_IMPORTED_MODULE_2__["converter"],
      updater: _solicitud_js__WEBPACK_IMPORTED_MODULE_2__["updater"]
   }),
   boliche: L.utils.createMutableIconClass("boliche", {
      iconSize: [40, 40],
      iconAnchor: [19.556, 35.69],
      url: _boliche_js__WEBPACK_IMPORTED_MODULE_1__["url"],
      converter: _boliche_js__WEBPACK_IMPORTED_MODULE_1__["converter"],
      updater: _boliche_js__WEBPACK_IMPORTED_MODULE_1__["updater"],
   })
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/centro/icons/sass/chupachups.sass":
/*!***********************************************!*\
  !*** ./src/centro/icons/sass/chupachups.sass ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "css/chupachups.css";

/***/ }),

/***/ "./src/centro/icons/sass/piolin.sass":
/*!*******************************************!*\
  !*** ./src/centro/icons/sass/piolin.sass ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "css/piolin.css";

/***/ }),

/***/ "./src/centro/icons/solicitud.js":
/*!***************************************!*\
  !*** ./src/centro/icons/solicitud.js ***!
  \***************************************/
/*! exports provided: converter, url, updater */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "converter", function() { return converter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "url", function() { return url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updater", function() { return updater; });
/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var _images_solicitud_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/solicitud.svg */ "./src/centro/icons/images/solicitud.svg");
/* harmony import */ var _images_solicitud_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_solicitud_svg__WEBPACK_IMPORTED_MODULE_1__);



// Definición del icono de solicitud
const converter = new L.utils.Converter(["peticion", "sel"])
                             .define("peticion")
                             .define("sel");

function updater(o) {
   var text = this.querySelector("text");
   if(o.peticion !== undefined) {
      text.textContent = o.peticion;
      var size = (o.peticion.toString().length > 2)?28:32;
      text.setAttribute("font-size", size);
   }

   if(o.sel !== undefined) {
      const content = this.querySelector(".content"),
            defs    = this.querySelector("defs");
      let   e       = content.querySelector(".selected");
      if(!o.sel) {
         if(e) defs.appendChild(e);
      }
      else if(!e) {
         e = defs.querySelector(".selected");
         content.prepend(e);
      }
   }
   return this;
}

const url = Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["getPath"])("images/solicitud.svg");



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/centro/index.js":
/*!*****************************!*\
  !*** ./src/centro/index.js ***!
  \*****************************/
/*! exports provided: create, catalogo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony import */ var _corrections_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./corrections.js */ "./src/centro/corrections.js");
/* harmony import */ var _filters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./filters.js */ "./src/centro/filters.js");
/* harmony import */ var _icons_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./icons/index.js */ "./src/centro/icons/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "catalogo", function() { return _icons_index_js__WEBPACK_IMPORTED_MODULE_2__["default"]; });





/**
* Crea la clase de marca para los centros y le
* añade las correcciones y filtros definidos para ella.
* @this {MapAdjOfer} El objeto que implemnta el mapa
* @private
*/
function create() {
   /**
   * Clase de marca para los centros educativos.
   * @memberof MapAdjOfer.prototype
   * @type {Marker}
   */
   this.Centro = L.Marker.Mutable.extend({
      statics: {
         /**
          * Obtiene la marca de un centro a partir de su código.
          * @param {String|Number} codigo  El código del centro.
          * @returns {L.Marker} La marca del centro cuyo código es el suministrado.
          */
         get: function(codigo) {
            if(typeof codigo === "string" && codigo.endsWith("C")) codigo = codigo.slice(0, -1);
            for(const c of this.store) {
               if(c.getData().id.cod == codigo) return c;
            }
         }
      },
      options: {
         mutable: "feature.properties",
         filter: this.cluster,
      }
   });

   _corrections_js__WEBPACK_IMPORTED_MODULE_0__["default"].call(this);
   _filters_js__WEBPACK_IMPORTED_MODULE_1__["default"].call(this);
}



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _adjofer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./adjofer/index.js */ "./src/adjofer/index.js");

/* harmony default export */ __webpack_exports__["default"] = (_adjofer_index_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/interface/contextmenu.js":
/*!**************************************!*\
  !*** ./src/interface/contextmenu.js ***!
  \**************************************/
/*! exports provided: map, origen, centro */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "origen", function() { return origen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "centro", function() { return centro; });
/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var _images_zoom_in_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/zoom-in.png */ "./src/interface/images/zoom-in.png");
/* harmony import */ var _images_zoom_in_png__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_zoom_in_png__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _images_zoom_out_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./images/zoom-out.png */ "./src/interface/images/zoom-out.png");
/* harmony import */ var _images_zoom_out_png__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_images_zoom_out_png__WEBPACK_IMPORTED_MODULE_2__);




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
            icon: Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["getPath"])("images/zoom-in.png"),
            callback: e => this.map.zoomIn()
         },
         {
            text: "Reducir escala",
            icon: Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["getPath"])("images/zoom-out.png"),
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




/***/ }),

/***/ "./src/interface/images/ajax-loader.gif":
/*!**********************************************!*\
  !*** ./src/interface/images/ajax-loader.gif ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/ajax-loader.gif";

/***/ }),

/***/ "./src/interface/images/zoom-in.png":
/*!******************************************!*\
  !*** ./src/interface/images/zoom-in.png ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/zoom-in.png";

/***/ }),

/***/ "./src/interface/images/zoom-out.png":
/*!*******************************************!*\
  !*** ./src/interface/images/zoom-out.png ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/zoom-out.png";

/***/ }),

/***/ "./src/interface/index.js":
/*!********************************!*\
  !*** ./src/interface/index.js ***!
  \********************************/
/*! exports provided: contextMenu, loading, popupRuta, progressBar, searchBar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _contextmenu_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contextmenu.js */ "./src/interface/contextmenu.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "contextMenu", function() { return _contextmenu_js__WEBPACK_IMPORTED_MODULE_0__; });
/* harmony import */ var _loading_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loading.js */ "./src/interface/loading.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loading", function() { return _loading_js__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _popupruta_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./popupruta.js */ "./src/interface/popupruta.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "popupRuta", function() { return _popupruta_js__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _progressbar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./progressbar.js */ "./src/interface/progressbar.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "progressBar", function() { return _progressbar_js__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _searchbar_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./searchbar.js */ "./src/interface/searchbar.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "searchBar", function() { return _searchbar_js__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _sass_adjofer_sass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./sass/adjofer.sass */ "./src/interface/sass/adjofer.sass");
/* harmony import */ var _sass_adjofer_sass__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_sass_adjofer_sass__WEBPACK_IMPORTED_MODULE_5__);











/***/ }),

/***/ "./src/interface/loading.js":
/*!**********************************!*\
  !*** ./src/interface/loading.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var _images_ajax_loader_gif__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/ajax-loader.gif */ "./src/interface/images/ajax-loader.gif");
/* harmony import */ var _images_ajax_loader_gif__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_ajax_loader_gif__WEBPACK_IMPORTED_MODULE_1__);



// tipo: isocronas, geocode, ruta.
function ajaxGif(tipo) {
   let loading;
   
   if(loading = L.DomUtil.get("leaflet-loading")) {
      L.DomUtil.remove(loading);
   }
   else {
      loading = L.DomUtil.create("div", "leaflet-message leaflet-control", 
                                 L.DomUtil.get("map"));
      loading.id = "leaflet-loading";
      const img = document.createElement("img");
      img.setAttribute("src", Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["getPath"])("images/ajax-loader.gif"));
      loading.appendChild(img);
   }
}

/* harmony default export */ __webpack_exports__["default"] = (ajaxGif);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/interface/popupruta.js":
/*!************************************!*\
  !*** ./src/interface/popupruta.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (popupRuta);


/***/ }),

/***/ "./src/interface/progressbar.js":
/*!**************************************!*\
  !*** ./src/interface/progressbar.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony default export */ __webpack_exports__["default"] = (function(n, total, lapso) {
   const map = L.DomUtil.get("map"),
         progress = L.DomUtil.get("leaflet-progress") || 
                    L.DomUtil.create("progress", "leaflet-message leaflet-control", map);
   progress.id = "leaflet-progress";
   progress.setAttribute("value", n/total);
   if(n === total) setTimeout(() => L.DomUtil.remove(progress), 500);
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/interface/sass/adjofer.sass":
/*!*****************************************!*\
  !*** ./src/interface/sass/adjofer.sass ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/interface/searchbar.js":
/*!************************************!*\
  !*** ./src/interface/searchbar.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L, Fuse) {// Issue #51
function searchBar() {
   // CodidoProvincial: Nombre del instituto
   const label = (d) => `${String(d.id.cp).substring(0,2)}: ${d.id.nom}`;

   const control = new L.Control.Search({
      position: "topright",
      textPlaceholder: "Busque por nombre",
      textErr: "No encontrado",
      initial: false,
      // Así nos aseguramos que se ve la marca seleccionada.
      zoom: this.cluster.options.disableClusteringAtZoom,
      marker: false,
      minLength: 3,
      sourceData: (text, callback) => {
         callback(this.cluster.getLayers().map(m => {
            const data = m.getData();
            return {
               title: label(data),
               loc: m.getLatLng()
            }
         }));

         return { abort: function() {}}
      },
      filterData: (text, records)  => {
         const ret = {},
         pathData = this.Centro.prototype.options.mutable,
         coincidentes = new Fuse(
            this.cluster.getLayers(), {
               keys: [pathData + ".id.nom"],
               minMatchCharLength: 2,
            }).search(text);

         for(const idx in coincidentes) {
            const data = coincidentes[idx].getData(),
                  title = label(data),
                  centro = records[title];

            if(!centro) continue;

            ret[title] = centro;
            // Encchufamos la marca del centro para tenerla
            // disponible en el evento search:locationfound.
            centro.layer = coincidentes[idx];
         }

         return ret;
      }
   });

   control.on("search:locationfound", e => {
      this.seleccionado = e.layer;
      control.collapse();
   });

   return control;
}
// Fin issue #51

/* harmony default export */ __webpack_exports__["default"] = (searchBar);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet"), __webpack_require__(/*! fuse.js */ "./node_modules/fuse.js/dist/fuse.js")))

/***/ }),

/***/ "./src/localidad/icon.js":
/*!*******************************!*\
  !*** ./src/localidad/icon.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
/* harmony import */ var _images_localidad_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./images/localidad.svg */ "./src/localidad/images/localidad.svg");
/* harmony import */ var _images_localidad_svg__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_images_localidad_svg__WEBPACK_IMPORTED_MODULE_1__);



const converter = new L.utils.Converter(["peticion"])
                             .define("peticion");

function updater(o) {
   if(o.peticion === undefined) return;
   const text = this.querySelector("text"),
         textInDefs = this.querySelector("defs").querySelector("text");

   text.textContent = o.peticion;
   if(o.peticion > 0) {
      if(textInDefs) this.querySelector("defs").parentNode.appendChild(text);
      if(o.peticion > 99) {
         text.setAttribute("y", "235");
         text.setAttribute("font-size", "180");
      }
      else {
         text.setAttribute("y", "265");
         text.setAttribute("font-size", "230");
      }
   }
   else if(!textInDefs) this.querySelector("defs").appendChild(text);
   
   const color = o.peticion === 0?"#0ae":"#d70"
   this.querySelector("path").setAttribute("fill", color);
}

/* harmony default export */ __webpack_exports__["default"] = (L.utils.createMutableIconClass("localidad", {
   iconSize: [26, 40],
   iconAnchor: [13, 39.43],
   url: Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["getPath"])("images/localidad.svg"),
   converter: converter,
   updater: updater
}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/localidad/images/localidad.svg":
/*!********************************************!*\
  !*** ./src/localidad/images/localidad.svg ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/localidad.svg";

/***/ }),

/***/ "./src/localidad/index.js":
/*!********************************!*\
  !*** ./src/localidad/index.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var _icon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./icon.js */ "./src/localidad/icon.js");


// Issue #79, #83
/**
 * Crea la capa con las localidades
 */
function create() {

   /**
    * Capa para almacenar las localidades.
    * @memberof MadAdjOfer.prototype
    * @type {L.GeoJSON}
    *
    */
   const localidades = L.geoJSON(undefined, {
      pointToLayer: (f, p) => {
         const localidad = new this.Localidad(p, {
            icon: new Icono(),
            title: f.properties.nom
         });
         localidad.on("dataset", e => {
            e.target.changeData({peticion: 0});
            Object.defineProperty(e.target.getData(), "codigo", {
               get: function() {
                  return this.cod.toString().padStart(9, "0") + "L";
               }
            });
         });
         if(this.options.light) localidad.once("dataset", e => {
            e.target.on("click", e => {
               if(this.options.light && this.mode === "solicitud") {
                  this.fire("requestclick", {marker: e.target});
               }
            });
         });
         return localidad;
      }
   });

   /**
    * Marca para localidad
    * @memberof MadAdjOfer.prototype
    * @type {Marker}
    */
   this.Localidad = L.Marker.Mutable.extend({
      statics: {
         get: function(cod) {
            if(typeof cod === "string" && cod.endsWith("L")) cod = cod.slice(0, -1);
            for(const loc of this.store) {
               if(loc.getData().cod == cod) return loc;
            }
            return null;
         }
      },
      options: {
         mutable: "feature.properties",
         filter: this.cluster,
      }
   });

   // Filtro indiscriminado: sirve para ocultar de inicio las localidades.
   this.Localidad.registerF("invisible", {
      attrs: [],
      func: function(opts) {
         return true;
      }
   });

   
   // Las localidades, por defecto, no se ven.
   this.on("statusset", e => {
      if(!e.status) this.Localidad.filter("invisible", {});
   });

   // Como el de centro: filtra las localidades solicitadas.
   this.Localidad.registerF("solicitado", {
      attrs: "peticion",
      func: function(opts) {
         return !!(opts.inv ^ (this.getData().peticion > 0))
      }
   });

   const Icono = _icon_js__WEBPACK_IMPORTED_MODULE_0__["default"];

   if(!this.options.pathLoc) {
      console.error("No pueden cargarse las localidades");
      return;
   }


   // Elimina los municipios de los que no se sabe el código
   // y la declaración de la provincia de las propiedades
   function limpiaDatos(data) {
      data.features = data.features.filter(f => !!f.properties.cod);
      data.features.forEach(f => delete f.properties.pro);
   }


   Icono.onready(() => {
      L.utils.load({
         url: this.options.pathLoc,
         callback: xhr => {
            const data = JSON.parse(xhr.responseText);
            limpiaDatos(data);
            localidades.addData(data);
            this.cluster.addLayer(localidades);
            this.Localidad.invoke("refresh");  // Por alguna extraña razón, a veces se ven
            this.fire("locloaded");
         },
         failback: xhr => console.error("No pueden cargarse los datos de localidad"),
      });
   });
}
// Fin issue #79, #83

/* harmony default export */ __webpack_exports__["default"] = (create);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/ors/geocode.js":
/*!****************************!*\
  !*** ./src/ors/geocode.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");


// Issue #46
function Geocode(ORS, opts) {
   const defaults = {
      "boundary.country": "ES"  // Restringimos las búsquedas a España.
   }

   this.url = ORS.URLBase + "/geocode";
   this.ORS = ORS;
   this.options = Object.assign({api_key: ORS.ors.key}, defaults);
   this.setOptions(opts);

   Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["addDescriptor"])(this, "value", false, true);
}

Geocode.prototype.setOptions = function(opts) {
   Object.assign(this.options, opts);
}

/**
 * Realiza la consulta de geocodificación de manera que obtiene
 * unas coordenadas si se introduce una dirección o una dirección
 * si se introducen unas coordenadas.
 *
 * @param {String, L.LatLng} data  Los datos de la consulta.
 *
 */
Geocode.prototype.query = async function(data) {
   return new Promise((resolve, reject) => {
      if(this.value === null) {
         resolve(null);
         return;
      }

      this.value = null;
      this.ORS.espera.push("geocode");

      if(this.ORS.ors.loading) this.ORS.ors.loading("geocodificacion");

      let furl, params;
      if(typeof data === "string") { // Es una dirección.
         furl = this.url + "/search";
         params = Object.assign({text: data}, this.options);
      }
      else {  // Es una coordenada.
         furl = this.url + "/reverse";
         params = Object.assign({"point.lon": data.lng, "point.lat": data.lat}, this.options);
      }

      L.utils.load({
         url: furl,
         method: "GET",
         params: params,
         callback: xhr => {
            if(this.ORS.ors.loading) this.ORS.ors.loading("geocode");
            const response = JSON.parse(xhr.responseText),
                  parser = typeof data === "string"?obtenerCoordenadas:obtenerDireccion;
            this.value = parser(response, data);
            this,ORS.espera.remove("geocode");
            resolve(true);
         },
         failback: xhr => {
            if(this.ORS.ors.loading) this.ORS.ors.loading("geocode");
            failback(xhr);
            this.value = JSON.parse(xhr.responseText).error;
            this,ORS.espera.remove("geocode");
            resolve(undefined);
         }
      });
   });
}

// TODO:: La obtención de direcciones habría que estudiarla bien.
function obtenerDireccion(data) {
   return data.features.length === 0?"Dirección desconocida":data.features[0].properties.label;
}

function obtenerCoordenadas(data, search) {
   if(data.features.length === 0) {
      console.error(`Imposible localizar '${search}'`);
      return null;
   }

   return data.features;
}
// Fin issue #46

/* harmony default export */ __webpack_exports__["default"] = (Geocode);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/ors/index.js":
/*!**************************!*\
  !*** ./src/ors/index.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var app_interface_popupruta_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/interface/popupruta.js */ "./src/interface/popupruta.js");
/* harmony import */ var _isochrones_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isochrones.js */ "./src/ors/isochrones.js");
/* harmony import */ var _geocode_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./geocode.js */ "./src/ors/geocode.js");
/* harmony import */ var _route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./route.js */ "./src/ors/route.js");






function ORS(adjofer) {
   const defaults = {
            chunkProgress: true,
            rutaPopup: true
         };

   this.URLBase = "https://api.openrouteservice.org";

   this.espera = [];
   this.espera.remove = function(value) {
      const idx = this.indexOf(value);
      if(idx !== -1) {
         this.splice(idx, 1)
         return true;
      }
      return false;
   }

   this.adjofer = adjofer;

   this.ors = Object.assign({}, defaults, adjofer.options.ors);
   Object.assign(this.ors, {
      chunkProgress: this.ors.chunkProgress && adjofer.progressBar,
      loading: this.ors.loading || adjofer.options.loading && app_interface_popupruta_js__WEBPACK_IMPORTED_MODULE_0__["default"],
      rutaPopup: this.ors.rutaPopup && app_interface_popupruta_js__WEBPACK_IMPORTED_MODULE_0__["default"]
   });

   this.isocronas = new _isochrones_js__WEBPACK_IMPORTED_MODULE_1__["default"](this);
   // Colocamos las isocronas por debajo de 400, para que siempre
   // queden por debajo de otros polígonos y segmentos (como las rutas).
   adjofer.map.createPane("isochronePane").style.zIndex = 390;

   this.ruta = new _route_js__WEBPACK_IMPORTED_MODULE_3__["default"](this);
   this.geocode = new _geocode_js__WEBPACK_IMPORTED_MODULE_2__["default"](this);

}

/* harmony default export */ __webpack_exports__["default"] = (ORS);


/***/ }),

/***/ "./src/ors/isochrones.js":
/*!*******************************!*\
  !*** ./src/ors/isochrones.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(turf, L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");


function Isocronas(ORS, opts) {
   const defaults = {
      profile: "driving-car",
      range_type: "time",
      interval: 600,
      range: 3600,
      location_type: "start",
      intersections: false,
      // Para la interrupción del cálculo de las
      // isocronas. cuando se demora mucho su cálculo.
      isocronas: {
         interval: 200,
         delay: 50
      }
   };

   try {
      turf
   }
   catch(e) {
      throw new ReferenceError("No se encuentra cargado turf. ¿Ha olvidado cargar la librería en el HTML?");
   }

   this.ORS = ORS;
   this.url = ORS.URLBase + "/v2/isochrones";
   this.options = Object.assign({}, defaults);
   this.setOptions(opts);

   this.layer = L.geoJSON(undefined, {
      style: f => new Object({
                     color: rgb2hex(HSLtoRGB(f.properties.ratio, .75, .30)),
                     opacity: 0.6
                  }),
      onEachFeature: (f, l) => {
         l.bindContextMenu(contextMenuArea.call(this, l, this.layer));
      },
      pane: "isochronePane"
   });

   Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["addDescriptor"])(this, "areas", false, true);  //false: no hecha, null: en proceso.
   // Resultado del último cálculo, por si se piden
   // otra vez las isocronas definidas por el mismo origen.
   Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["addDescriptor"])(this, "calc", {origen: null, areas: null}, false);
}

Isocronas.prototype.setOptions = function(opts) {
   Object.assign(this.options, opts);
   if(!(this.options.range instanceof Array)) {
      this.options.range = [this.options.range];
   }
   return this;
}

/**
 * Crea las isocronas, en principio tomando como referencia la marca de origen.
 * Es función asíncrona cuya promesa devuelve ``null`` si ya había otra petición
 * en curso; ``false``, si se recuperaron las últimas isocronas, ``true``, si
 * se generaron unas nuevas; e ``undefined`, si se produjo un error.
 *
 * @param {L.LatLng} point  Punto que se tomará como referencia
 * para el cálculo de las isocronas. Si no se proporciona, se
 * toma el origen de los viajes.
 */
Isocronas.prototype.create = async function(point) {
   point = point || this.ORS.adjofer.origen.getLatLng();

   return new Promise((resolve, reject) => {
      if(this.areas === null) {
         resolve(null);
         return;
      }

      this.ORS.espera.push("isocronas");

      // Si repetimos origen, entonces rescatamos las isocronas calculadas.
      if(mismoPunto(point, this.calc.origen)) {
         if(!this.areas) {  // Se llegaron a borrar.
            redibujarAnillos.call(this);
            this.layer.addTo(this.ORS.adjofer.map);
            this.areas = this.calc.areas;
         }
         resolve(false);
         return;
      }
      else {
         if(this.areas) this.remove();
         this.areas = this.calc.origen = this.calc.areas = null;
      }

      let params = Object.assign({locations: [[point.lng, point.lat]]},
                                  this.options);

      if(this.ORS.ors.loading) this.ORS.ors.loading("isocronas");
      L.utils.load({
         url: this.url + "/" + params.profile,
         headers: { Authorization: this.ORS.ors.key },
         contentType: "application/json; charset=UTF-8",
         params: params,
         callback: xhr => {
            crearIsocronas.call(this, xhr, point).then(() => {
               this.ORS.espera.remove("isocronas");
               resolve(true);
            });
         },
         failback: xhr => { 
            failback();
            this.ORS.espera.remove("isocronas");
            resolve(undefined);
         }
      });
   });
}


async function crearIsocronas(xhr, point) {
   if(this.ORS.ors.loading) this.ORS.ors.loading("isocronas");

   const started = (new Date()).getTime();
   // Estos polígonos son completamente macizos, es decir,
   // el referido a la isocrona de 30 minutos, contiene
   // también las áreas de 10 y 20 minutos.
   const data = JSON.parse(xhr.responseText);
   this.layer.addTo(this.ORS.adjofer.map);

   return new Promise(resolve => {
      // La ejecución a intervalos se ha tomado del codigo de Leaflet.markercluster
      let i=0;
      const process = () => {
         const start = (new Date()).getTime();
         for(; i<data.features.length; i++) {
            const lapso = (new Date()).getTime() - start;

            // Al superar el intervalo, rompemos el bucle y
            // liberamos la ejecución por un breve periodo.
            if(this.ORS.ors.chunkProgress && lapso > this.options.isocronas.interval) break;

            const anillo = i>0?turf.difference(data.features[i], data.features[i-1]):
                           Object.assign({}, data.features[0]);

            // turf hace que anillo y data.features[i] compartan properties,
            // pero se necesita que sean objetos diferentes para que uno tenga
            // la propiedad area y el otro no.
            anillo.properties = Object.assign({}, data.features[i].properties, {
               ratio:  1 - i/data.features.length,
               area: data.features[i]  // Las área macizas sirven para filtrado.
            });
            data.features[i].properties.ratio = anillo.properties.ratio;

            this.layer.addData(anillo);
         }

         if(this.ORS.ors.chunkProgress) {
            this.ORS.ors.chunkProgress(i, data.features.length,
                                       (new Date().getTime() - started));
         }

         if(i === data.features.length) {
            this.calc.origen = point;
            this.areas = this.calc.areas = this.layer.getLayers();
            resolve();
         }
         else setTimeout(process, this.options.isocronas.delay);
      }
      process();
   });
}


/**
 * Elimina las isocronas.
 */
Isocronas.prototype.remove = function() {
   if(!this.areas) return false;
   this.layer.clearLayers();
   this.layer.removeFrom(this.ORS.adjofer.map);
   this.areas = false;
   return this;
}


function contextMenuArea(area) {
   // Los anillos tienen entre sus propiedades el área maciza,
   // pero las áreas macizas, no tienen área alguna.
   const es_anillo = !!area.feature.properties.area;

   const items = [
      {
         text: "Eliminar isocronas",
         callback: e => this.ORS.adjofer.setIsocronas(null),
         index: 0,
      }
   ]

   if(es_anillo) {
      items.push({
         text: `Filtrar centros alejados más de ${area.feature.properties.value/60} min`,
         callback: e => {
            const maciza = area.feature.properties.area;
            let idx;
            for(idx in this.areas) {
               if(this.areas[idx] === area) break;
            }

            this.ORS.adjofer.Centro.filter("lejos", {area: maciza, idx: Number(idx)});
            this.ORS.adjofer.Centro.invoke("refresh");
            this.dibujarAreaMaciza(maciza);
         },
         index: 1,
      })
   }
   else {
      items.push({
         text: `Mostrar centros alejados más de ${area.feature.properties.value/60} min`,
         callback: e => {
            this.ORS.adjofer.Centro.unfilter("lejos");
            this.ORS.adjofer.Centro.invoke("refresh");
            redibujarAnillos.call(this);
         },
         index: 1
      });
   }

   items.push({separator: true, index: 2});

   return {
      contextmenu: true,
      contextmenuInheritItems: true,
      contextmenuItems: items
   }
}

Isocronas.prototype.dibujarAreaMaciza = function(area) {
   this.layer.clearLayers().addData(area);
   const a = this.layer.getLayers()[0];
   a.bindContextMenu(contextMenuArea.call(this, a));
}

function redibujarAnillos() {
   this.layer.clearLayers();
   for(const a of this.calc.areas) this.layer.addLayer(a);
}


/**
 * Devuelve las capas de las áreas que constityen las isocronas.
 */
Isocronas.prototype.get = function(maciza) {
   let areas = this.calc.areas;
   if(maciza) areas = areas.map(a => a.feature.properties.area);
   return areas;
}

/* harmony default export */ __webpack_exports__["default"] = (Isocronas);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! app/utils/turf.js */ "./src/utils/turf.js"), __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/ors/route.js":
/*!**************************!*\
  !*** ./src/ors/route.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");


function Ruta(ORS, opts) {
   const defaults = {
      profile: "driving-car"
   }

   this.url = ORS.URLBase + "/v2/directions";
   this.ORS = ORS;
   this.options = Object.assign({api_key: ORS.ors.key}, defaults);
   this.setOptions(opts);

   this.layer = L.geoJSON(undefined, {
      style: f => new Object({
                     color: "#77f",
                     weight: 5,
                     opacity: 0.9
                  }),
      onEachFeature: (f, l) => {
         if(ORS.ors.rutaPopup) {
            l.bindPopup(ORS.ors.rutaPopup(this.calc.destino, f));
         }
      }
   });

   Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["addDescriptor"])(this, "value", false, true); // value= {polilinea, destino}
   Object(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["addDescriptor"])(this, "calc", {origen: null,
                                destino: null,
                                layer: null}, true);
}

Ruta.prototype.setOptions = function(opts) {
   Object.assign(this.options, opts);
}

Ruta.prototype.create = async function(destino) {
   if(this.value) this.remove();

   return new Promise((resolve, reject) => {
      if(this.value === null) {
         resolve(null);
         return;
      }

      if(mismoPunto(adjofer.origen, this.calc.origen) &&
         mismoPunto(destino, this.calc.destino)) {

         dibujarRuta.call(this);
         this.value = {
            layer: this.calc.layer,
            destino: this.calc.destino
         }
         resolve(false);
         return;
      }

      this.ORS.espera.push("rutas");

      this.value = this.calc.destino = this.calc.layer = null;
      this.calc.origen = adjofer.origen;

      const origen = adjofer.origen.getLatLng(),
            fin    = destino.getLatLng(),
            params = Object.assign({
                        start: origen.lng + "," + origen.lat,
                        end: fin.lng + "," + fin.lat,
                     }, this.options),
            furl = this.url + "/" + params.profile;

      delete params.profile;
      
      if(this.ORS.ors.loading) this.ORS.ors.loading("ruta");
      L.utils.load({
         url: furl,
         method: "GET",
         params: params,
         callback: xhr => { 
            crearRuta.call(this, xhr, destino);
            this.ORS.espera.remove("rutas");
            resolve(true);
         },
         failback: xhr => {
            failback(xhr);
            this.ORS.espera.remove("rutas");
            resolve(undefined);
         }
      });
   });
}

function crearRuta(xhr, destino) {
   if(this.ORS.ors.loading) this.ORS.ors.loading("ruta");

   const data = JSON.parse(xhr.responseText);
   this.calc.destino = destino;
   this.calc.origen = adjofer.origen;
   this.value = {destino: destino};

   this.calc.layer = this.value.layer = dibujarRuta.call(this, data);
}

function dibujarRuta(ruta) {
   let layer;

   // Si no se proporciona ruta, es porque
   // se reaprovecha la marca almacenada en calc.
   if(ruta === undefined) {
      layer = this.calc.layer;
      ruta = layer.feature;
      this.layer.addLayer(layer);
   }
   else {
      this.layer.addData(ruta);
      ruta = ruta.features[0];
      layer = this.layer.getLayers()[0];
   }

   this.layer.addTo(adjofer.map);

   const coords = ruta.geometry.coordinates,
         point  = coords[Math.floor(.9*coords.length)];

   if(this.ORS.ors.rutaPopup) layer.openPopup({lat: point[1], lng: point[0]});
   return layer;
}

Ruta.prototype.remove = function() {
   if(!this.value) return false;

   this.layer.clearLayers();
   this.layer.removeFrom(adjofer.map);
   this.value = false;
   return this;
}
// Fin issue #47

/* harmony default export */ __webpack_exports__["default"] = (Ruta);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/solicitud.js":
/*!**************************!*\
  !*** ./src/solicitud.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony import */ var app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! app/utils/misc.js */ "./src/utils/misc.js");
// Issue #79
// Módulo para gestionar las solicitudes de centro.



/**
 * centros debe ser la propiedad donde se almacenan los centros
 * y localidades la propiedad donde se almacenan localidades,
 * Puede usarse la notación de punto.
 */
function Solicitud(adjofer) {
   Object.defineProperties(this, {
      store: {
         value: [],
         writable: false,
         enumerable: false,
         configurable: false,
      },
      adjofer: {
         value: adjofer,
         writable: false,
         enumerable: false,
         configurable: false
      },
      BolicheIcono: {
         value: adjofer.getIcon("boliche"),
         writable: false,
         enumerable: true,
         configurable: false
      },
      SolicitudIcono: {
         value: adjofer.getIcon("solicitud"),
         writable: false,
         enumerable: true,
         configurable: false
      }
   });

   // Define un filtro para eliminar centros seleccionados
   adjofer.Centro.registerF("solicitado", {
      attrs: "peticion",
      // opts= {inv: false}  // Si inv=true, elimina los no seleccionados.
      func: function(opts) {
         return !!(opts.inv ^ (this.getData().peticion > 0))
      }
   });

   // Al cargar datos cambian las marcas de centro,
   // pero queremos conservar la lista de peticiones,
   // así que recostruimos "store" a partir de la lista
   // de "status" y dejamos el código, si el centro no existe.
   adjofer.on("dataloaded", e => {
      this.store.length = 0;
      if(!e.target.status.list) return;
      for(let i=0; i<e.target.status.list.length; i++) {
         const cod = e.target.status.list[i];
         if(cod instanceof L.Marker.Mutable) continue;

         const tipo = cod.endsWith("L")?"Localidad":"Centro",
               entidad = e.target[tipo].get(cod);

         if(entidad) {
            this.store[i] = entidad;
            entidad.changeData({peticion: i+1});
            e.target.fire("requestset", {marker: entidad, oldval: 0, newval: i+1});
         }
         else this.store[i] = cod;
      }
   });

   adjofer.on("locloaded", e => {
      if(!e.target.status.list) return;
      for(let i=0; i<e.target.status.list.length; i++) {
         const cod = e.target.status.list[i];
         if(cod instanceof L.Marker && cod.endsWith("C")) continue;

         const localidad = e.target.Localidad.get(cod);
         if(localidad) {
            this.store[i] = localidad;
            localidad.changeData({peticion: i});
         }
         else this.store[i] = cod;
      }
   });
}

Object.defineProperties(Solicitud.prototype, {
   centros: {
      get: function() {
         return this.adjofer.Centro.store;
      },
      enumerable: false,
      configurable: false,
   },
   localidades: {
      get: function() {
         return this.adjofer.localidades.getLayers();
      },
      enumerable: false,
      configurable: false,
   },
   list: {
      get: function() {
         return this.store.map(app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["normalizeCodigo"].bind(this));
      },
      enumerable: true,
      configurable: false
   }
});


// Obtiene la marca de un centro o una localidad a partir del código.
function getMarker(centro) {
   if(centro instanceof L.Marker) return centro;

   centro = app_utils_misc_js__WEBPACK_IMPORTED_MODULE_0__["normalizeCodigo"].call(this, centro);
   if(!centro) return null;

   const last = centro.charAt(centro.length-1);
   return last === "C"?this.adjofer.Centro.get(centro):
                       this.adjofer.Localidad.get(centro);
}

/**
 * Devuelve cuál es el centro que ocupa la petición N. null, si no
 * ocupa ninguna petición.
 */
Solicitud.prototype.getCentro = function(position) {
   return this.store[position - 1] || null;
}

/**
 * Devuelve qué petición ocupa el centro. 0, si no está pedido.
 */
Solicitud.prototype.getPosition = function(centro) {
   centro = getMarker.call(this, centro);
   if(!centro) return 0;

   for(let i=0; i<this.store.length; i++) {
      if(this.store[i] === centro) return i+1;
   }
   return 0;
}


/**
 * Añade un centro al final de la lista de peticiones.
 * @param {L.Marker|Number|String} centro El centro a añadir.
 *
 * @returns {L.Marker} El propio centro si se añadió, o null
 * si no se hizo.
 */
Solicitud.prototype.add = function(centro) {
   centro = getMarker.call(this, centro);
   if(!centro || this.getPosition(centro)) return null;

   this.store.push(centro);
   centro.changeData({peticion: this.store.length});
   this.adjofer.fire("requestset", {
      marker: centro,
      oldval: 0,
      newval: this.store.length
   });
   this.adjofer.fire("requestchange", {markers: [centro]});
   return centro;
}


function actualiza(pos1, pos2) {
   pos2 = pos2 || this.store.length;
   for(let i=pos1 - 1; i < pos2; i++) {
      const centro = this.store[i];

      if(centro instanceof L.Marker.Mutable) {
         const pos = centro.getData().peticion;
         centro.changeData({peticion: i+1});
         this.adjofer.fire("requestset", {
            marker: centro,
            oldval: pos,
            newval: i+1
         });
      }
   }
   return this.store.slice(pos1 - 1, pos2);
}

/**
 * Elimina uno o varios centros por su posición en la lista.
 * @param {Number} pos  Posición a partir de la cuál se eliminarán centros.
 * @param {Number} cuantos  Cuantos centros se quieren borrar. Si no
 * se especifican, se borran todos hasta el final.
 *
 * @returns Array  Un array con los centros afectados.
 */
Solicitud.prototype.delete = function(pos, cuantos) {
   if(pos<1 || pos>this.store.length) return [];

   const restantes = this.store.length - pos + 1;
   if(cuantos === undefined || cuantos > restantes) cuantos = restantes;
   const eliminados = this.store.splice(pos-1, cuantos);
   for(const centro of eliminados) {
      if(!(centro instanceof L.Marker.Mutable)) continue;

      const pos = centro.getData().peticion;
      centro.changeData({peticion: 0});
      this.adjofer.fire("requestset", {
         marker: centro,
         oldval: pos,
         newval: 0
      });
   }
   const actualizados = actualiza.call(this, pos),
         ret = eliminados.concat(actualizados);

   this.adjofer.fire("requestchange", {markers: ret});
   return ret
}

/**
 * Elimina un centro de la lista de peticiones.
 * @param {L.Marker|Number|String} centro El centro a añadir.
 * 
 * @returns Array  Un array con los centros afectados.
 */
Solicitud.prototype.remove = function(centro) {
   centro = getMarker.call(this, centro);
   if(!centro) return [];
   const pos = this.getPosition(centro),
         ret = pos > 0?this.delete(pos, 1):[];

   return ret;
}


/**
 * Inserta un centro en la posición indicada de la lista de peticiones.
 * @param {L.Marker|Number|String} centro El centro a añadir.
 * @param Number pos  La posición que debe ocupar en la lista.
 * 
 * @returns Array  Un array con los centros afectados.
 */
Solicitud.prototype.insert = function(centro, pos) {
   centro = getMarker.call(this, centro);
   if(!centro || this.getPosition(centro)) return [];

   this.store.splice(pos - 1, 0, centro);
   const ret = actualiza.call(this, pos);

   this.adjofer.fire("requestchange", {markers: ret});
   return ret;
}


/**
 * Mueve de una posición a otra de la lista un número determinado de centros.
 */
Solicitud.prototype.move = function(pos1, pos2, cuantos) {
   pos2 = Math.max(pos2, 1);
   pos2 = Math.min(pos2, this.store.length + 1);

   const restantes = this.store.length - pos1 + 1;
   if(cuantos === undefined || cuantos > restantes) cuantos = restantes;

   const incr = pos2 - pos1,
         tam = this.store.length;
         

   let ret;
   if(incr < 0) { // El bloque de movidos sube en la lista.
      const movidos = this.store.splice(pos1 - 1, cuantos);
      Array.prototype.splice.apply(this.store, [pos2 - 1, 0].concat(movidos));
      ret = actualiza.call(this, pos2, pos1 + cuantos - 1);
   }
   else {
      const pos_f = pos2 - cuantos;
      if(pos_f <= pos1) return [];

      const movidos = this.store.splice(pos1 - 1, cuantos);
      Array.prototype.splice.apply(this.store, [pos_f - 1, 0].concat(movidos));
      ret = actualiza.call(this, pos1, pos2 - 1);
   }

   this.adjofer.fire("requestchange", {markers: ret});
   return ret;
}
// Fin issue #79

/* harmony default export */ __webpack_exports__["default"] = (Solicitud);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/utils/misc.js":
/*!***************************!*\
  !*** ./src/utils/misc.js ***!
  \***************************/
/*! exports provided: addDescriptor, crearAttrEvent, HSLtoRGB, rgb2hex, normalizeCodigo, getPath */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(L) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDescriptor", function() { return addDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crearAttrEvent", function() { return crearAttrEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HSLtoRGB", function() { return HSLtoRGB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgb2hex", function() { return rgb2hex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeCodigo", function() { return normalizeCodigo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPath", function() { return getPath; });
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url */ "./node_modules/url/url.js");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_0__);


// Issue #27
/**
 * Crea una propiedad a la que se asocia un tipo de evento,
 * de manera que cuando se le da valor a la propiedad se lanzan
 * las acciones asociadas al evento *on*, y cuando se da valor null
 * se lanzan las acciones asociadas al evento *off*.
 *
 * @this El objeto al que se asocia el atributo.
 * @param {String} attr  El nombre del atributo que se creará.
 * @param {String} tipo  Nombre del tipo.
 * @param {*}  value     Valor inicial
 */
function crearAttrEvent(attr, tipo, value=null) {
   if(this.fire === undefined) throw new Error("El objeto no puede lanzar eventos");

   addDescriptor(this, "_" + attr, value, true);
   Object.defineProperty(this, attr, {
      get: function() { return this["_" + attr]; },
      set: function(value) {
         const old = this[attr];
         this["_" + attr] = value;
         this.fire(tipo, {oldval: old, newval: value});
      },
      configurable: false,
      enumerable: true
   });
}
// Fin issue #27;


/**
 * Define una propiedad mediante un descriptor que no configurable ni enumerable.
 *
 * @param {Object} obj        Objeto en el que se define el descritor
 * @param {String}  name      Nombre de la propiedad
 * @param {Boolean} writable  Define si es o no escribible.
 */
function addDescriptor(obj, name, value, writable) {
   Object.defineProperty(obj, name, {
      value: value,
      writable: !!writable,
      enumerable: false,
      configurable: false
   });
}


// Obtiene una gama de colores RGB distinguibles entre sí.
// En principio, si se desea obtener 4 colores, habrá que pasar:
// como ratio 1/4, 2/4, 3/4 y 4/4.
function HSLtoRGB(h, s, l) {
   s = s || .65;
   l = l || .45;

   var r, g, b;

   if(s == 0){
      r = g = b = l;
   }
   else {
      function hue2rgb(p, q, t) {
         if(t < 0) t += 1;
         if(t > 1) t -= 1;
         if(t < 1/6) return p + (q - p) * 6 * t;
         if(t < 1/2) return q;
         if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
         return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
   }

   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


// Convierte un array de tres enteros (RGB) en notación hexadecimal.
function rgb2hex(rgb) {
   return "#" + rgb.map(dec => ("0" + dec.toString(16)).slice(-2)).join("");
}


function normalizeCodigo(centro) {
   if(centro instanceof L.Marker.Mutable) {
      return centro.getData().codigo;
   }

   centro = centro.toString();
   let ret;

   // Ya era un código normalizado.
   const last = centro.charAt(centro.length-1);
   switch(last) {
      case "C":
         ret = centro.padStart(9, "0");
         break;

      case "L":
         ret = centro.padStart(10, "0");
         break;

      default:
         switch(centro.length) {
            case 7:  // Es con seguridad un centro
               ret = (centro + "C").padStart(9, "0");
               break;

            case 9:  // Es con seguridad una localidad
               ret = (centro + "L").padStart(10, "0");
               break;

            case 8:
               // Es un centro a menos que empiece por 41,
               // en cuyo caso puede ser una localidad de Almería
               // o un centro de Sevilla.
               if(!centro.startsWith("41")) {
                  ret = (centro + "C").padStart(9, "0");
               }
               else {
                  // Si hay una localidad con ese código, resolvemos
                  // que es la localidad y, si no, suponemos un centro.
                  ret = this.adjofer.Localidad.get(centro);
                  ret = ret?`0${centro}L`:`${centro}C`;
               }
               break;

            default:
               return null;
         }
   }
   return ret;

}


const scriptPath = document.currentScript;

/**
 * Obtiene la ruta absoluta de un recurso cuya ruta relativa
 * se proporcionó respecto a la ruta absoluta de otro. Se
 * sobreentiende que se proporciona el recurso y no el directorio
 * que contiene el recurso. O sea, http://example.com/index.html
 * y no http://example.com
 *
 * @param {String} resource  Ruta relativa de otro recurso
 *    respecto al primero
 * @param {String} script    Ruta absoluta de un recurso. Si
 * no se especifica es la ruta de este mismo script.
 *
 * @returns {String} Ruta absoluta del segundo recurso.
 */
function getPath(resource, script) {
   script = script || scriptPath.src;
   script = script.slice(0, script.lastIndexOf("/"));
   return url__WEBPACK_IMPORTED_MODULE_0___default.a.resolve(script, resource);
}




/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! leaflet */ "leaflet")))

/***/ }),

/***/ "./src/utils/turf.js":
/*!***************************!*\
  !*** ./src/utils/turf.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _turf_difference_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @turf/difference/index.js */ "./node_modules/@turf/difference/index.js");
/* harmony import */ var _turf_difference_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_turf_difference_index_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _turf_boolean_point_in_polygon_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @turf/boolean-point-in-polygon/index.js */ "./node_modules/@turf/boolean-point-in-polygon/index.js");
/* harmony import */ var _turf_boolean_point_in_polygon_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_turf_boolean_point_in_polygon_index_js__WEBPACK_IMPORTED_MODULE_1__);
// Exporta las únicas librerías de turf necesarias.




/* harmony default export */ __webpack_exports__["default"] = ({difference: (_turf_difference_index_js__WEBPACK_IMPORTED_MODULE_0___default()), booleanPointInPolygon: (_turf_boolean_point_in_polygon_index_js__WEBPACK_IMPORTED_MODULE_1___default())});


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.js */"./src/index.js");


/***/ }),

/***/ "leaflet":
/*!****************************************************************************************!*\
  !*** external {"root":"L","amd":"leaflet","commonjs":"leaflet","commonjs2":"leaflet"} ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_leaflet__;

/***/ })

/******/ })["default"];
});
//# sourceMappingURL=core-src.js.map