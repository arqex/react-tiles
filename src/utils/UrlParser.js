var qs = require('qs'),
  utils = require('./TileUtils'),
  assign = require('object-assign')
;

var UrlParser = {
  stringify: function( layout ){
    if( layout.type === 'tile' ){
      return layout.id + ':' + encodeURIComponent( encodeURIComponent(layout.route) );
    }

    var me = this,
      children = layout.children.map( function( child ){
        return me.stringify( child );
      }),
      query, str
    ;

    if( layout.floating ){
      // we are in the root layout node
      query = assign( {}, layout.query );

      if( layout.type === 'free' ){
        query = layout.children[0].children[0].query;
        layout.pathname = layout.children[0].children[0].pathname;
        query.tw = [layout.id, layout.children[0].id, layout.children[0].children[0].id].join(':');
        delete query.t;
      }
      else {
        str = (layout.type === 'row' ? 'r' : 'c');
        query.t = str + ':' + layout.id + '{' + children.join(',') + '}';
      }

      if( Object.keys(layout.floating).length ){
        query.ft = this.stringifyFloating( layout );
      }
      else {
        delete query.ft;
      }

      return layout.pathname + '?' + qs.stringify( query, {encoder: qsEncoder} );
    }
    else {
      str = (layout.type === 'row' ? 'r' : 'c');
      return str + ':' + layout.id + '{' + children.join(',') + '}';
    }
  },

  parse: function( route ){
    var parts = route.split('?'),
      pathname = parts[0],
      query = parts[1] && qs.parse( parts[1] ) || {},
      layout
    ;

    if( query.t ){
      // We have more than one tile
      layout = this.parseQuery( query.t );
    }
    else {
      // we only have one tile
      var layoutId = 'm', // after main
        wrapperId = 'mc', // after main child
        tileId = 'mct',
        tileQuery = assign({}, query),
        tileRoute = pathname,
        queryString, ids
      ;

      // the tw parameter has the ids
      if( query.tw ){
        ids = query.tw.split(':');
        if( ids[2].indexOf('#') !== -1 ){
          // There is a fragment in the url
          ids[2] = ids[2].split('#')[0];
        }
        if( ids.length == 3 ){
          layoutId = ids[0];
          wrapperId = ids[1];
          tileId = ids[2];
        }
      }

      // delete the tw & ft parameters if any
      delete tileQuery.tw;
      delete tileQuery.ft;

      queryString = qs.stringify( tileQuery, {encoder: qsEncoder} );
      if( queryString ){
        tileRoute += '?' + queryString;
      }

      layout = {
        type: 'free',
        id: layoutId,
        children: [{
          type: 'freeChild',
          id: wrapperId,
          children: [{
            type: 'tile',
            route: tileRoute,
            pathname: pathname,
            query: tileQuery,
            id: tileId
          }]
        }]
      };
    }

    // floating tiles are in the format {id:route}
    layout.floating = this.parseFloating( query.ft );

    layout.route = route;
    layout.pathname = parts[0];
    layout.query = query;

    return layout;
  },

  stringifyFloating: function( layout ){
    if(!layout.floating){
      return false;
    }
    var floating = [];
    Object.keys(layout.floating).forEach( function( tid ){
      floating.push( tid + ':' + encodeURIComponent(encodeURIComponent(layout.floating[tid].route || layout.floating[tid])) );
    });
    return floating.join(',');
  },

  parseQuery: function( tileQuery ){
    var tokens = this.tokenize( tileQuery ),
      layout = this.parseWrapper( tokens )
    ;

    return layout;
  },

  tokenize: function( tileQuery ){
    var tokens = [],
        buffer = ''
    ;

    for (var i = 0; i < tileQuery.length; i++) {
      var current = tileQuery[i];

      if(current == '{') {
          if(buffer.length){
              tokens.push({type: 'wrapperId', value: buffer});
              buffer = '';
          }
          tokens.push({type: 'wrapperOpen', value: current});
      }
      else if(current == '}') {
          if(buffer.length){
              tokens.push({type: 'wrapperId', value: buffer});
              buffer = '';
          }
          tokens.push({type: 'wrapperClose', value: current});
      }
      else if(current == ',') {
          if(buffer.length){
              tokens.push({type: 'wrapperId', value: buffer});
              buffer = '';
          }
          tokens.push({type: 'separator', value: current});
      }
      else {
          buffer += current;
      }
    }

    if(buffer.length){
      throw this.getError('Unexpected ' + buffer);
    }

    return tokens;
  },

  parseWrapper: function( tokens ){
    var token = tokens.shift();

    if( token.type !== 'wrapperId' ){
      throw this.getError('Unexpected ' + token.value );
    }

    var layout = this.parseId( token );
    if( layout.type === 'tile' ){
      return layout;
    }

    token = tokens.shift();
    if( token.type !== 'wrapperOpen' ){
      throw this.getError('Unexpected ' + token.value + ' after a column or row declaration.');
    }
    layout.children = this.parseChildren( tokens );

    return layout;
  },

  parseId( token ){
    var parts = token.value.split(':');

    if( parts.length !== 2 ){
      throw this.getError('Id ' + token.value + ' not valid.');
    }

    var layout = {
      id: parts[1]
    };

    if( parts[0] === 'c' ){
      layout.type = 'column';
    }
    else if( parts[0] === 'r' ){
      layout.type = 'row';
    }
    else {
      var route = decodeURIComponent(parts[1]);
      layout = utils.getRouteParts( decodeURIComponent(parts[1]) );
      layout.type = 'tile';
      layout.id = parts[0];
    }

    utils.updateTid( layout.id );

    return layout;
  },

  parseChildren( tokens ){
    var children = [],
      token
    ;
    while( tokens.length ){
      if( tokens[0].type !== 'wrapperId' ){
        throw this.getError('Unexpected ' + tokes[0].value + ' after a column or row declaration.');
      }
      children.push( this.parseWrapper( tokens ) );
      token = tokens.shift();
      if( token.type === 'wrapperClose' ){
        return children;
      }
      else if( token.type !== 'separator' ){
        throw this.getError('Unexpected ' + token.value );
      }
    }

    // If we reach here, we failed to close a parenthesis.
    throw this.getError('Unexpected End');
  },

  getError: function(msg) {
      return new Error("Tile query parse error: " + msg);
  },

  parseFloating: function( param ){
    if( !param ) return {};
    var tiles = param.split(','),
      floating = {},
      parts, route
    ;

    for( var i = 0; i<tiles.length; i++ ){
      parts = tiles[i].split(':');
      if( parts.length == 2 ){
        route = decodeURIComponent(parts[1]);
        floating[ parts[0] ] = utils.getRouteParts( route );
      }
    }

    return floating;
  }
};

// We don't need qs to encode our paramters, since they are already encoded
var qsEncoder = function( c ) { return c; };

module.exports = UrlParser;
