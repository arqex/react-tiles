const webpack = require('webpack');
const {join} = require('path');

module.exports = {
  output: {
    path: join(__dirname, "../dist/"),
    filename: '[name].js'
  },

	module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: [
            ["env", { "loose":true }],
            "react"
          ]
        }
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
  }
};
