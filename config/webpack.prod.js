let config = require('./webpack.common');
config.mode = 'production';
config.entry = {
  "react-tiles.min": "./react-tiles.js"
}

module.exports = config;
