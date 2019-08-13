const webpack = require("webpack"),
      merge = require("webpack-merge"),
      path = require("path"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      CopyPlugin = require('copy-webpack-plugin'),
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
                  "leaflet-contextmenu/dist/leaflet.contextmenu.css",
                  "leaflet.markercluster/dist/MarkerCluster.css",
                  "leaflet.markercluster/dist/MarkerCluster.Default.css",
                  "leaflet-search/dist/leaflet-search.min.css",
                  "leaflet-search/dist/leaflet-search.mobile.min.css"]
      }
   }
}


// Configuración sin dependencias
function confNoDeps() {
   return {
      externals: {
         leaflet: {
            root: "L",
            amd: "leaflet",
            commonjs: "leaflet",
            commonjs2: "leaflet"
         },
         turf: {
            root: "turf",
            amd: "turf",
            commonjs: "turf",
            commonjs2: "turf"
         },
         "leaflet-search": "search",
         "leaflet.markercluster": "cluster",
         "leaflet-contextmenu": "contextmenu",
         "leaflet.mutatismutandis": "mutatis",
         Fuse: {
            root: "Fuse",
            amd: "Fuse",
            commonjs: "Fuse",
            commonjs2: "Fuse"
         }
         /*
         "leaflet-search": {
            root: "seach",
            amd: "search",
            commonjs: "search",
            comonjs2: "search"
         },
         "leaflet.markercluster": {
            root: "markercluster",
            amd: "markercluster",
            commonjs: "markercluster",
            commonjs2: "markercluster"
         },
         "leaflet.mutatismutandis": {
            root: "mutatis",
            amd: "mutatis",
            commonjs: "mutatis",
            commonjs2: "mutatis"
         },
         */
      },
      output: {
         libraryTarget: "umd",
         umdNamedDefine: true,
         library: "lobaton",
         libraryExport: "default"
      }
   }
} 

// Configuración para desarrollo
// (los mapeos de código fuente en fichero aparte)
function confDev(filename) {
   return {
      devtool: false,
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: `${filename}.map`
         })
      ]
   }
}


//Configuración adicional para depuración
//(Se requiere copiar el ejemplo en el servidor)
function confDebug() {
   return {
      devServer: {
         contentBase: false,
         open: "chromium",
         //openPage: "index.html"
      },
      plugins: [
         new CopyPlugin([
            {from: "examples", to: ".", ignore: ["*.swp"] }
         ])
      ]
   }
}

module.exports = env => {
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
         filename = "[name].js";
         break;
      case "debug":
         filename = "dist/[name].js";
         break;
      case "src":
         filename = "[name]-src.js";
         break
      default:
         filename = `[name].${env.output}.js`;
   }

   const common = {
      mode: mode,
      entry: {
         [name]: ["./src/index.js"]
      },
      resolve: {
         alias: {
            app: path.resolve(__dirname, "src")
         }
      },
      output: {
         filename: filename
      },
      module: {
         rules: [
            {
               test: /\.(css|sass)$/,
               oneOf: [
                  {
                     // El CSS de los iconos va cada uno a su fichero respectivo.
                     include: path.resolve(__dirname, "src/centro/icons"),
                     use: ["file-loader?name=css/[name].css",
                           "extract-loader",
                           "css-loader",
                           "sass-loader"]
                  },
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
               oneOf: [
                  {  // Las imágenes propios deben permanecer independientes.
                     include: path.resolve(__dirname, "src"),
                     use: [ 'file-loader?name=images/[name].[ext]' ]
                  },
                  {
                     use: [ 'url-loader?limit=4096&name=images/[name].[ext]' ]
                  }
               ]
            }
         ]
      },
      plugins: [
         new webpack.ProvidePlugin({
            L: "leaflet",
            turf: "app/utils/turf.js",
            Fuse: "fuse.js",
            search: "leaflet-search",
            markercluster: "leaflet.markercluster",
            contextmenu: "leaflet-contextmenu",
            mutatis: "leaflet.mutatismutandis"
         }),
         new MiniCssExtractPlugin({
            filename: env.output === "bundle"?"css/[name].bundle.css":"css/[name].css",
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
