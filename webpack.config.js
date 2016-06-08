var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');

var plugins = [
  new webpack.DefinePlugin({
    	'process.env': { NODE_ENV: '"production"'}
  })
];

module.exports = {
  entry: ['./src/react-tiles.js'],

  output: {
    path: __dirname + "/dist/",
    library: 'react-tiles',
    libraryTarget: 'umd',
    filename: 'react-tiles.js'
  },

	module: {
		loaders: [
			{ test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/, query: {presets: ['es2015', 'react']} },
			{ test: /\.scss$/, loader: "style!css!postcss-loader!sass" }
		]
	},

  resolve: {
    extensions: ['', '.js', '.scss']
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'Router'
  },

  plugins: plugins,
	postcss: [ autoprefixer ]
};
