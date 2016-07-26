var UrlParser = require('./UrlParser2'),
  assign = require('object-assign'),
  utils = require('./TileUtils'),
  qs = require('qs')
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

  swapType: function( update ){
    if( this.layout.type === 'free' ){
      return this.layout.query;
    }

    var type = this.layout.type === 'row' ? 'column' : 'row',
      nextLayout = toLayout( this.layout, type )
    ;

    this.returnNext( nextLayout, update );
  },

  remove: function( id, update, returnLayout ){
    if( !id ){
      this.throwError("`remove` needs a tile id.");
    }

    var nextLayout = cloneLayout( this.layout ),
      i = nextLayout.children.length,
      tileIndex, wrapper
    ;

    if( nextLayout.floating[ id ] ){
      nextLayout.floating = assign( {}, nextLayout.floating );
      delete nextLayout.floating[ id ];
    }
    else {
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
            nextLayout.children[0] = cloneLayout( nextLayout.children[0] );
            if( nextLayout.children[0].children.length === 1 ){
              nextLayout.type = 'free';
              nextLayout.children[0].type = 'freeChild';
            }
          }

          return this.returnNext( nextLayout, update, returnLayout );
        }
      }
    }

    return this.returnNext( nextLayout, update, returnLayout );
  },

  resetWrapper: function( id, tile, update, returnLayout ){
    if( !id || !tile || !tile.route ){
      this.throwError("`resetWrapper` needs a wrapper id and a new tile data with a route.");
    }

    var found = find( this.layout, id );

    if( !found ){
      return console.log("Wrapper " + id + " not found to reset." );
    }

    found[0].children = [ createTile(tile) ];

    return this.returnNext( found[1], update, returnLayout );
  },

  handleErrors( type, payload ){
    if( !payload ){
      this.throwError( '`' + type + '` called without parameters.' );
    }
    if( type === 'setTile' ){
      if( !payload.route ){
        this.throwError('`setTile` needs a route.');
      }
    }
  },
  throwError: function( reason ){
    throw new Error( 'QueryBuilder ERROR: ' + reason );
  },

  setTile: function( ops, returnLayout ){
    this.handleErrors('setTile', ops);
    var nextLayout = cloneLayout( this.layout ),
      children = nextLayout.children,
      routeParts = utils.getRouteParts( ops.route )
    ;

    // If the tile id exists open the route there, ignore anything else
    // Look for it in the floating tiles
    if( nextLayout.floating[ ops.tile ] ){
      nextLayout.floating = assign({}, nextLayout.floating);
      nextLayout.floating[ ops.tile ] = ops.route;
      return this.returnNext( nextLayout, ops.update, returnLayout );
    }
    // And in the not floating ones
    if( ops.tile ){
      var i = children.length,
        j
      ;

      while( i-- > 0){
        j = children[i].children.length;
        while( j-- > 0 ){
          if( children[i].children[j].id === ops.tile ){
            children[i] = cloneLayout( children[i] );
            children[i].children[j] = cloneLayout( children[i].children[j] );
            assign( children[i].children[j], routeParts );

            // Return here
            return this.returnNext( nextLayout, ops.update, returnLayout );
          }
        }
      }
    }

    // Check if the tile is floating
    if( ops.wrapper === 'floating' ){
      nextLayout.floating = assign({}, nextLayout.floating);
      nextLayout.floating[ ops.tile ] = routeParts;
      return this.returnNext( nextLayout, ops.update, returnLayout );
    }

    var position = ops.wrapperPosition !== undefined ? ops.wrapperPosition : nextLayout.children.length,
      wrapper = { children: [] }
    ;

    // If the layout is free we need to create a new wrapper for the tile
    if( nextLayout.type === 'free' ){
      // the default layout is a column one
      nextLayout.type = ops.type === 'row' ? 'column' : 'row';
      wrapper.type = nextLayout.type === 'row' ? 'column' : 'row';
      children[0] = cloneLayout( children[0] );
      children[0].type = wrapper.type;
      wrapper.id = ops.wrapper && ops.wrapper !== children[0].id ? ops.wrapper : utils.tid( wrapper.type[0] );

      // Add the wrapper to the layout
      children.splice( position, 0, wrapper );
    }
    else {
      // If the wrapper is already there use it
      var wrapperIndex = findIndex( nextLayout, ops.wrapper );
      if( wrapperIndex !== -1 ){
        wrapper = cloneLayout( children[ wrapperIndex ] );

        // Add the wrapper to the layout
        children[ wrapperIndex ] = wrapper;
      }
      else {
        wrapper.type = children[0].type;
        wrapper.id = ops.wrapper || utils.tid( wrapper.type[0] );

        // Add the wrapper to the layout
        children.splice( position, 0, wrapper );
      }
    }

    // Add the tile to the wrapper
    wrapper.children.splice( ops.position || wrapper.children.length, 0, createTile( ops ) );

    return this.returnNext( nextLayout, ops.update, returnLayout );
  },

  getWrapperInfo: function( id ){
    var index = findIndex( this.layout, id );
    return index !== -1 && cloneLayout( this.layout.children[index] );
  },

  setFloating: function( id, update, returnLayout ){

    // Needs to get the layout from remove
    var i = this.layout.children.length,
      found = false,
      tileIndex
    ;

    if( this.layout.floating[id] ){
      return this.returnNext( cloneLayout(this.layout), update, returnLayout );
    }

    while( i-- > 0 && !found ){
      tileIndex = findIndex( nextLayout.children[i], id );
      if( tileIndex !== -1 ){
        found = nextLayout.children[ i ].children[ tileIndex ];
      }
    }

    if( !found ){
      this.throwError("`setFloating` tile " + id  + " not found.");
    }

    var nextLayout = this.remove( id, false, true );
    nextLayout.floating[ id ] = found.route;
    return this.returnNext( nextLayout, update, returnLayout );
  },

  returnNext( layout, update, returnLayout ){
    if( update ){
      this.layout = layout;
    }

    return returnLayout ? layout : UrlParser.stringify( layout );
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
  var tile = utils.getRouteParts( ops.route );
  tile.id = ops.tile || utils.tid('t');
  tile.type = 'tile';
  return tile;
};
