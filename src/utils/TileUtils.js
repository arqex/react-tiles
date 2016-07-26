var qs = require('qs');

var idCounter = 0;

var tileUtils = {
  tid: function( prefix ){
    return (prefix || '') + (idCounter++);
  },
  updateTid: function( tid ){
    var validId = tid.match(/^[rct](\d+)$/);
    if( validId ){
      validId = parseInt( validId[1] );
      if( validId >= idCounter ){
        idCounter = validId + 1;
      }
    }
  },
  getRouteParts: function( route ){
    var parts = route.split('?');
    return {
      pathname: parts[0],
      query: qs.parse( parts[1] || '' ),
      route: route
    };
  }
};

module.exports = tileUtils;
