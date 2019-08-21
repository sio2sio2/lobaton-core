const webpack = require("webpack"),
      merge = require("webpack-merge"),
      path = require("path"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      pack = require("./package.json"),
      name = pack.name.split("/").pop();


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
                  "./src/index.js"]
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
         "leaflet.markercluster": {
            root: "L",
            amd: "leaflet.markercluster",
            commonjs: "leaflet.markercluster",
            commonjs2: "leaflet.markercluster"
         },
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
      ],
      devServer: {
         contentBase: path.resolve(__dirname, "examples"),
         publicPath: "/dist/",
         watchContentBase: true,
         open: "chromium"
      }
   }
}


module.exports = env => {
   let filename;

   switch(env.output) {
      case "debug":
      case "srcdebug":
         env.mode = "development";
         break;
      default:
         env.mode = "production";
   }

   switch(env.output) {
      case "min":
      case "debug":
         filename = "[name]";
         break;
      case "src":
         filename = "[name]-src";
         break
      case "srcdebug":
         filename = "[name]-debug";
         break
      default:
         filename = `[name].${env.output}`;
   }

   const common = {
      mode: env.mode,
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
         library: "Lo",
      },
      module: {
         rules: [
            {
               test: /\.(css|sass)$/i,
               oneOf: [
                  {
                     include: path.resolve(__dirname, "src"),
                     use: [MiniCssExtractPlugin.loader,
                           `css-loader${env.mode === "production"?"":"?sourceMap=true"}`,
                           {
                              loader: "postcss-loader",
                              options: {
                                 plugins: [
                                    require("autoprefixer"),
                                    require("cssnano")({preset: "default"})
                                 ]
                              }
                           },
                           `sass-loader${env.mode === "production"?"":"?sourceMap=true"}`]
                  },
                  {
                     use: [MiniCssExtractPlugin.loader,
                           "css-loader",
                           {
                              loader: "postcss-loader",
                              options: {
                                 plugins: [
                                    require("cssnano")({preset: "default"})
                                 ]
                              }
                           }]
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
         new webpack.DefinePlugin({
            "process.env": {
               output: JSON.stringify(env.output),
               version: JSON.stringify(pack.version),
               mode: JSON.stringify(env.mode)
            }
         }),
         new webpack.ProvidePlugin({
            L: "leaflet",
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
      env.mode === "production"?confBabel(env):confDev(filename),
      env.output === "src"?{optimization: {minimize: false}}:null,
      env.output === "bundle"?confBundle():confNoDeps()
   )
}
