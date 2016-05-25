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

  remove: function( id, update ){
    if( !id ){
      this.throwError("`removeTile` needs a tile id.");
    }

    var nextLayout = cloneLayout( this.layout ),
      i = nextLayout.children.length,
      tileIndex, wrapper
    ;

    while( i-- > 0 ){
      tileIndex = findIndex( nextLayout.children[i], id );
      if( tileIndex !== -1 ){
        if( nextLayout.children[i].children.length === 1 ){

          // If it was the only child, remove the wrapper
          nextLayout.children.splice( i, 1 );
        }
        else {
          wrapper = cloneLayout( nextLayout.children[i] );
          wrapper.children.splice( tileIndex, 1 );
          nextLayout.children[i] = wrapper;
        }
        if( nextLayout.children.length === 1 ){
          nextLayout.type = 'free';
          nextLayout.children[0] = cloneLayout( nextLayout.children[0] );
          nextLayout.children[0].type = 'freeChild';
        }
        return this.layoutToPath( nextLayout, update );
      }
    }

    return this.layoutToPath( this.layout, update );
  },

  resetWrapper: function( id, tile, update ){
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
    if( type === 'setTile' ){
      if( !payload.route ){
        this.throwError('`setTile` needs a route.');
      }
      else if( !payload.target ){
        this.throwError('`setTile` needs a target.');
      }
      else if( this.layout.type === 'free' && !payload.type && payload.target !== this.layout.children[0].id ){
        this.throwError('A column or row layout is needed to add a tile.');
      }
    }
  },
  throwError: function( reason ){
    throw new Error( 'QueryBuilder ERROR: ' + reason );
  },
  layoutToPath: function( layout, update ){
    if( layout.type === 'free' ){
      return pathFormat + layout.children[0].children[0].route + '?tw=' + layout.id + ':' + layout.children[0].id;
    }

    var q = layout.path + '?t=' + UrlParser.stringify( layout );
    if( update ){
      this.setRoute( q );
    }

    return pathFormat + q;
  },

  setTile: function( ops ){
    this.handleErrors('setTile', ops);
    var nextLayout = cloneLayout( this.layout );
    var wrapperIndex = findIndex( nextLayout, ops.target );
    var position, wrapper;

    if( wrapperIndex === -1 ){
      // Wrapper not found
      position = ops.targetPosition !== undefined ? ops.targetPosition : nextLayout.children.length;
      wrapper = {
        id: ops.target,
        children: []
      };

      if( nextLayout.type === 'free' ){
        if( ops.target === nextLayout.children[0].id ){
          wrapper = cloneLayout( nextLayout.children[0] );
          wrapper.children[0] = cloneLayout( wrapper.children[0] );
          wrapper.children[0].route = ops.route;
          nextLayout.children[0] = wrapper;

          return this.layoutToPath( nextLayout, ops.update );
        }
        nextLayout.type = ops.type === 'row' ? 'column' : 'row';
        wrapper.type = ops.type;
      }
      else {
        wrapper.type = nextLayout.children[0].type;
      }
      nextLayout.children.splice( position, 0, wrapper );
    }
    else {
      wrapper = assign({}, nextLayout.children[wrapperIndex], {children: nextLayout.children[wrapperIndex].children.slice()});
      nextLayout.children[wrapperIndex] = wrapper;
    }

    var tileIndex = findIndex( wrapper, ops.id );
    if( tileIndex === -1 ){
      position = ops.position !== undefined ? ops.position : wrapper.children.length;
      wrapper.children.splice(position, 0, createTile( ops ) );
    }
    else {
      wrapper.children[tileIndex] = assign({}, wrapper.children[tileIndex], {route: ops.route});
    }

    return this.layoutToPath( nextLayout, ops.update );
  },
  getWrapperInfo: function( id ){
    var index = findIndex( this.layout, id );
    return index !== -1 && cloneLayout( this.layout.children[index] );
  }
});

var pathFormat = '';
TileQueryBuilder.setPathFormat = function( format ){
  pathFormat = format;
}

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
  clone.children = l.children && l.children.slice();
  return clone;
};


var findIndex = function( layout, id ){
  if( !id ){
    return -1;
  }

  var i = layout.children.length;
  while( i-- > 0 ){
    if( layout.children[i].id === id ){
      return i;
    }
  }

  return -1;
};


var createTile = function( ops ){
  return {
    id: ops.id || utils.tid('t'),
    route: ops.route,
    type: 'tile'
  };
};
