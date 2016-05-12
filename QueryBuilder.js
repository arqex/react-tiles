var UrlParser = require('./UrlParser'),
  assign = require('object-assign'),
  utils = require('./TileUtils')
;

var tileCounter = 0;

var TileQueryBuilder = function( route ){
  this.setRoute( route );
};

assign( TileQueryBuilder.prototype, {
  setRoute: function( route ){
    this.layout = UrlParser.parse( route );
  },

  setLayout: function( layout ){
    this.layout = layout;
  },

  toColumnLayout: function( options ){
    var ops = options || {},
      layout = toLayout( this.layout, 'column', ops )
    ;

    return this.layoutToPath( layout, ops.update );
  },

  toRowLayout: function( options ){
    var ops = options || {},
      layout = toLayout( this.layout, 'row', ops )
    ;
    return this.layoutToPath( layout, ops.update );
  },

  addTile: function( ops ){
    this.handleErrors( 'addTile', ops );

    var found = find( this.layout, ops.target );
    if( !found ){
      this.throwError('`addTile` could not find the target.');
    }

    var pos = ops.position !== undefined ? ops.position : found[0].children.length;
    found[0].children.splice( pos, 0, createTile( ops ) );

    return this.layoutToPath( found[1], ops.update );
  },

  addTileAndWrapper( ops ){
    this.handleErrors( 'addWrapper', ops );

    var pos = ops.position !== undefined ? ops.position : this.layout.children.length,
      type = this.layout.type === 'row' ? 'column' : 'row',
      layout = cloneLayout( this.layout )
    ;

    layout.children.splice( pos, 0, {
      type: type,
      id: ops.id || utils.tid(type[0]),
      children: [ createTile( ops.tile ) ]
    });

    return this.layoutToPath( layout, ops.update );
  },

  removeTile( id, update ){
    if( !id ){
      this.throwError("`removeTile` needs a tile id.");
    }

    var found = find( this.layout, id, true );

    if( !found ){
      return console.log("Tile " + id + " not found to remove." );
    }

    found[0].children.splice( found[2], 1 );

    if( !found[0].children.length ){
      // Remove the empty wrapper
      var i = found[1].children.length,
        removed = false
      ;

      while( !removed && i-- > 0 ){
        if( found[1].children[i] === found[0] ){
          found[1].children.splice(i, 1);
          removed = true;
        }
      }
    }

    return this.layoutToPath( found[1], update );
  },

  setTileRoute( id, route, update ){
    if( !id || !route ){
      this.throwError("`setTileRoute` needs a tile id and a route.");
    }

    var found = find( this.layout, id );

    if( !found ){
      return console.log("Tile " + id + " not found to set the route." );
    }

    found[0].route = route;

    return this.layoutToPath( found[1], update );
  },

  resetWrapper( id, tile, update ){
    if( !id || !tile || !tile.route ){
      this.throwError("`resetWrapper` needs a wrapper id and a new tile data with a route.");
    }

    var found = find( this.layout, id );

    if( !found ){
      return console.log("Wrapper " + id + " not found to reset." );
    }

    found[0].children = [ createTile(tile) ];

    return this.layoutToPath( found[1], update );
  },

  handleErrors( type, payload ){
    if( !payload ){
      this.throwError( '`' + type + '` called without parameters.' );
    }
    if( type === 'addTitle' ){
      if( !payload.route ){
        this.throwError('`addTile` needs a route.');
      }
      else if( !payload.target ){
        this.throwError('`addTile` needs a target.');
      }
      else if( this.layout.type === 'free' ){
        this.throwError('A column or row layout is needed to add a tile.');
      }
    }
    if( type === 'addWrapper' ){
      var currentType = this.layout.type;
      if( !payload.tile ){
        this.throwError('`addTileAndWrapper` needs tile information.');
      }
      if( !payload.tile.route ){
        this.throwError('`addTileAndWrapper` needs a tile route.');
      }
      if( currentType === 'free' && payload.type !== 'column' && payload.type !== 'row' ){
        this.throwError('`addTileAndWrapper` needs a valid wrapper type (column or row) because the layout is free.');
      }
      if( payload.type && (currentType === 'column' && payload.type !== 'row' || currentType === 'row' && payload.type !== 'column' )){
        this.throwError('Current ' + currentType + ' layout does not accept wrappers of type ' + payload.type );
      }
    }
  },
  throwError: function( reason ){
    throw new Error( 'QueryBuilder ERROR: ' + reason );
  },
  layoutToPath: function( layout, update ){
    var q = layout.path + '?t=' + UrlParser.stringify( layout );
    if( update ){
      this.setRoute( q );
    }
    return q;
  }
});

module.exports = TileQueryBuilder;


/** HELPERS **/
var toLayout = function( currentLayout, toType, ops ){
  var currentType = currentLayout.type,
    otherType = currentType === 'row' ? 'column' : 'row',
    q, layout
  ;

  if( currentType === toType ){
    // Same type, return it unmodified
    return currentLayout;
  }
  else if( otherType === toType ){
    // Swap types
    layout = assign({}, currentLayout, {type: toType, children:[]});
    currentLayout.children.forEach( function( child ){
      layout.children.push( assign({}, child, {type:otherType}) );
    });
  }
  else {
    // Free type wrapper, switch it to the desired type and add a otherType child with the tile
    layout = assign({}, currentLayout, {type: toType, id: ops.columnId || utils.tid(toType[0]), children:[
      {type: otherType, id: ops.rowId || utils.tid(otherType[0]), children: currentLayout.children }
    ]});
  }

  return layout;
};

var cloneLayout = function( l ){
  var clone = assign({},l);
  clone.children = l.children.slice();
  return clone;
};

var find = function( originalLayout, id, parent ){
  var layout = cloneLayout( originalLayout ),
    i = layout.children.length,
    found = 0,
    j
  ;

  while( i-- > 0 && !found ){
    if( layout.children[i].id === id ){
      layout.children[i] = cloneLayout( layout.children[i] );
      return [layout.children[i], layout];
    }

    j = layout.children[i].children.length;
    while( j-- > 0 && !found ){
      if( layout.children[i].children[j].id === id ){
        layout.children[i] = cloneLayout( layout.children[i] );
        if( parent ){
          return [layout.children[i], layout, j];
        }
        return [layout.children[i].children[j], layout];
      }
    }
  }
}

var createTile = function( ops ){
  return {
    id: ops.id || utils.tid('t'),
    route: ops.route,
    type: 'tile'
  };
}
