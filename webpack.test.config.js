var config = require('./webpack.config');
var nodeExternals = require('webpack-node-externals');

config.plugins = [];

config.target = 'node';
config.externals =[ nodeExternals() ];

config.module.loaders[0].loaders = ['babel'];

config.node = {
  console: 'empty',
  fs: 'empty',
  net: 'empty',
  tls: 'empty'
};

module.exports = config;
