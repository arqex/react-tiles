const webpack = require('webpack');

module.exports = {
  mode: 'production',

  entry: {
    "react-tiles": "./react-tiles.js",
    "react-tiles.min": "./react-tiles.js"
  },

  output: {
    path: __dirname + "/dist/",
    filename: '[name].js'
  },

	module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }, {
				test: /\.scss$/,
				use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
			}
    ]
  },

  resolve: {
    extensions: ['.js', '.scss']
  },

  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  },

  plugins: []
};
