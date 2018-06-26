let config = require('./webpack.common');
config.mode = 'development';
config.devtool = 'source-map';
config.entry = {
  "react-tiles": "./react-tiles.js"
}

module.exports = config;
