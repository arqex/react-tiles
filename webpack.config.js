var webpack = require('webpack');
// var autoprefixer = require('autoprefixer-core');

var plugins = [
  new webpack.DefinePlugin({
    	'process.env': { NODE_ENV: '"production"'}
  })
];

module.exports = {
  entry: ['./src/react-tiles.js'],

  output: {
    path: __dirname + "/dist/",
    // library: 'react-tiles',
    // libraryTarget: 'umd',
    filename: 'react-tiles.js'
  },

	module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }, {
				test: /\.(sass|scss)$/,
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
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM'
    }
  },

  plugins: plugins
};
