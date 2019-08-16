const webpack = require("webpack"),
      merge = require("webpack-merge"),
      path = require("path"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      name = require("./package.json").name.split("/").pop();


// Configuración para Babel
function confBabel(env) {
   return {
      module: {
         rules: [
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: "babel-loader",
                  options: {
                     presets: [["@babel/env", {
                        debug: env.debug,
                        corejs: 3,
                        useBuiltIns: "usage"
                     }]]
                  }
               }
            }
         ]
      }
  }
}
// Configuración adicional para el sabor bundle,
// o sea, el que contiene todas las dependencias.
function confBundle() {
   return {
      entry: {
         [name]: ["leaflet/dist/leaflet.css",
                  "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css",
                  "leaflet-contextmenu/dist/leaflet.contextmenu.css",
                  "leaflet.markercluster/dist/MarkerCluster.css",
                  "leaflet.markercluster/dist/MarkerCluster.Default.css",
                  "leaflet-search/dist/leaflet-search.min.css",
                  "leaflet/dist/images/marker-shadow.png",
                  "leaflet/dist/images/marker-icon-2x.png",
                  // "leaflet-search/dist/leaflet-search.mobile.min.css",
                  "./src/index.js"]
      }
   }
}


// Configuración sin dependencias
function confNoDeps() {
   return {
      externals: {
         leaflet: "L",
         "leaflet-defaulticon-compatibility": "L.Compatibility",
         turf: "turf",
         Fuse: "Fuse",
         "leaflet.markercluster": "L",
         Fuse: {
            root: "Fuse",
            amd: "Fuse",
            commonjs: "Fuse",
            commonjs2: "Fuse"
         },
         "leaflet-search": {
            root: ["L", "Control", "Search"],
            amd: "leaflet-search",
            commonjs: "leaflet-search",
            commonjs2: "leaflet-search"
         },
         "leaflet-contextmenu": {
            root: ["L", "Map", "ContextMenu"],
            amd: "leaflet-contextmenu",
            commonjs: "leaflet-contextmenu",
            commonjs2: "leaflet-contextmenu"
         },
         "leaflet.mutatismutandis": {
            root: ["L", "Marker", "Mutable"],
            amd: "leaflet.mutatismutandis",
            commonjs: "leaflet.mutatismutandisx",
            commonjs2: "leaflet.mutatismutandis"
         }
      },
   }
} 

// Configuración para desarrollo
// (los mapeos de código fuente en fichero aparte)
function confDev(filename) {
   return {
      devtool: false,
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: `${filename}.js.map`
         })
      ]
   }
}


//Configuración adicional para depuración
//(Se requiere copiar el ejemplo en el servidor)
function confDebug() {
   return {
      devServer: {
         contentBase: path.resolve(__dirname, "examples"),
         publicPath: "/dist/",
         watchContentBase: true,
         open: "chromium"
      }
   }
}

module.exports = env => {
   let mode, filename;

   switch(env.output) {
      case "debug":
      case "src":
         mode = "development";
         break;
      default:
         mode = "production";
   }

   switch(env.output) {
      case "min":
      case "debug":
         filename = "[name]";
         break;
      case "src":
         filename = "[name]-src";
         break
      default:
         filename = `[name].${env.output}`;
   }

   const common = {
      mode: mode,
      entry: {
         [name]: "./src/index.js"
      },
      resolve: {
         alias: {
            app: path.resolve(__dirname, "src")
         }
      },
      output: {
         filename: `${filename}.js`,
         libraryTarget: "umd",
         umdNamedDefine: true,
         library: "lobaton",
         libraryExport: "default"
      },
      module: {
         rules: [
            {
               test: /\.(css|sass)$/,
               oneOf: [
                  {
                     include: path.resolve(__dirname, "src"),
                     use: [MiniCssExtractPlugin.loader,
                           `css-loader${env.mode === "production"?"":"?sourceMap=true"}`,
                           `sass-loader${env.mode === "production"?"":"?sourceMap=true"}`]
                  },
                  {
                     use: [MiniCssExtractPlugin.loader,
                           "css-loader"]
                  }
               ]
            },
            {
               test: /\.(png|jpe?g|gif|svg)$/i,
               use: [ 'url-loader?name=images/[name].[ext]' ]
            }
         ]
      },
      plugins: [
         new webpack.ProvidePlugin({
            L: "leaflet",
            "L.compatibility": "leaflet-defaulticon-compatibility",
            turf: "app/utils/turf.js",
            Fuse: "fuse.js",
            "L.Control.Search": "leaflet-search",
            "L.MarkerClusterGroup": ["leaflet.markercluster", "MarkerClusterGroup"],
            "L.Map.ContextMenu": "leaflet-contextmenu",
            "L.Marker.Mutable": "leaflet.mutatismutandis"
         }),
         new MiniCssExtractPlugin({
            filename: `${filename}.css`,
            chunkFilename: "[id].css"
         })
      ]
   }

   return merge.smart(
      common,
      mode === "production"?confBabel(env):confDev(filename),
      env.output === "bundle"?confBundle():confNoDeps(),
      env.output === "debug"?confDebug():null
   )
}
