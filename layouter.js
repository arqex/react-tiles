/*
layout = {
  type: 'free' | 'row' | 'column',
  wrapperOrder: [ 'w1', 'w2', ... ''] // wrapper's ids
  wrappers: { 'w1': ['t1', 't2'], 'w2': ['t3'] } // every wrapper contains tile order
  floating: ['t4','t5'] // floating tiles
  tiles: {t1: {parent, location}, t2: {parent, location} } // tiles with their location object
}

url
---
?layout=row&wrappers=w1,w2&floating=t4,t5&w1=t1,t2&w2=t3&t1=encoded(/myRoute?foo=bar)

tiles are printed always in the same order and all should be absolutelly positioned



chrome-extension://dfcnpbpjpcnlclhnbamicjcnhehbndfj/newtab.html#?layout=column&wrappers=w1,w2,w3&w1=t1&w2=t2,t3&w3=t4&t1=%2Fbrowser%3Furl%3Dhttp%253A%252F%252Fas.com&t2=%23%2Fbrowser%3Furl%3Dhttps%253A%252F%252Fgithub.com&t3=%2Fbrowser%3Furl%3Dhttp%253A%252F%252Fas.com&t4=%2Fbrowser%3Furl%3Dhttp%253A%252F%252Fas.com
 */


import qs from 'qs';

// Counter to create ids
var counter = 0;
// Link to parse urls
var link = document.createElement('a');


var layouter = {
  toLayout: function( url ){
    var q = qs.parse( url.split('?')[1] || '' ),
      wrapperOrder = q.wrappers && q.wrappers.split(',') || [],
      floating = q.floating && q.floating.split(',') || [],
      wrappers = {},
      tiles = {},
      i = wrapperOrder.length,
      tileOrder, w, type
    ;

    if( !wrapperOrder.length ){
      wrapperOrder = ['w1'];
      wrappers = {w1: ['t1']};
      tiles = {
        t1: {
          wrapper: 'w1',
          location: this.toLocation( '/' )
        }
      }
    }
    else {
      // Wrappers
      while( i-- > 0 ){
        tileOrder = q[wrapperOrder[i]];
        if( !tileOrder ){
          wrapperOrder.splice( i, 1 );
        }

        w = [];
        tileOrder.split(',').forEach( tid => {
          if( q[tid] ){
            tiles[tid] = {
              wrapper: wrapperOrder[i],
              location: this.toLocation( decodeURIComponent(q[tid]) )
            };
            w.push(tid);
          }
        })
        if( w.length ){
          wrappers[ wrapperOrder[i] ] = w;
        }
      }

      // Floating
      i = floating.length;
      while( i-- > 0 ){
        if( q[floating[i]] ){
          tiles[floating[i]] = {
            wrapper: false,
            location: this.toLocation( decodeURIComponent(q[floating[i]]) )
          };
        }
        else {
          floating.splice( i, 1 );
        }
      }
    }


    type = q.layout;

    // If there is no layout type set, it's free or column
    if( !type ){
      type = wrapperOrder.length > 1 ? 'column' : 'free';
    }

    return {
      type, wrapperOrder, wrappers, floating, tiles
    };
  },

  toUrl: function( layout ){
    var url = [];
    Object.keys( layout.tiles ).forEach( tid => {
      url.push( `${tid}=${ encodeURIComponent( layout.tiles[tid].location.route ) }` );
    });
    Object.keys( layout.wrappers ).forEach( wid => {
      url.push( `${wid}=${ layout.wrappers[wid].join(',') }`);
    });

    url.push( `layout=${layout.type}` );
    url.push( `wrappers=${ layout.wrapperOrder.join(',')}` );
    url.push( `floating=${ layout.floating.join(',')}` );

    return url.join('&');
  },

  updateLayout: function( layout, tid, route, wid ){
    var tile = layout.tiles[tid];

    if( tile ){
      // Just update the route
      if( route ){
        tile.location = this.toLocation( route );
        return;
      }

      // We are removing a tile
      return this.removeTile( layout, tid );
    }

    // No tile and no route
    if( !route ){
      return console.warn('Setting no route in no tile.');
    }

    // No tile but route, create a tile
    if( !wid ){

      // Create a new wrapper
      wid = this.createWid(layout);
      layout.wrapperOrder.push(wid);
      layout.wrappers[ wid ] = [];

      // Free layout become a column one
      if( layout.type === 'free' ){
        layout.type = 'column';
      }
    }

    var ids = wid === 'floating' ? layout.floating : layout.wrappers[wid],
      tileId = !tid || layout.tiles[tid] ? this.createTid(layout) : tid
    ;

    ids.push(tileId);
    layout.tiles[tileId] = {
      wrapper: wid !== 'floating' && wid,
      location: this.toLocation( route )
    };
  },

  removeTileFromLayout( layout, tid ){
    var tile = layout.tiles[tid];
    if( !tile ){
      return console.warn(`${tid} doesn't exist. Can't remove.`);
    }

    if( layout.type === 'free' ){
      return console.warn("Can't remove tile from free layout");
    }

    // Remove tile from the wrapper
    var wrapper = tile.wrapper ? layout.wrappers[tile.wrapper] : layout.floating,
      i = wrapper.length
    ;

    while( i-- ){
      if( wrapper[i] === tid ){
        wrapper.splice( i, 1 );
      }
    }

    // If the wrapper is empty remove it too
    if( tile.wrapper && !wrapper.length ){
      delete layout.wrappers[ tile.wrapper ];
      i = layout.wrapperOrder.length;
      while( i-- ){
        if( layout.wrapperOrder[i] === tile.wrapper ){
          layout.wrapperOrder.splice( i, 1 );
        }
      }

      // Getting 1 wrapper is going back to a free layout
      if( layout.wrapperOrder.length === 1 && layout.wrappers[layout.wrapperOrder[0]].length === 1 ){
        layout.type = 'free';
      }
    }

    delete layout.tiles[tid];
  },

  moveTile( layout, tid, wid ){
    var tile = layout.tiles[tid];
    if( !tile ) return console.warn("Can't move unexistent tile.");
    this.removeTileFromLayout(layout, tid);
    this.updateLayout(layout, tid, tile.location.route, wid);
  },

  clone( layout ) {
    var clone = Object.assign({}, layout);
    clone.wrapperOrder = clone.wrapperOrder.slice();
    clone.wrappers = Object.assign({}, clone.wrappers);
    clone.tiles = Object.assign({}, clone.tiles);
    Object.keys( clone.tiles ).forEach( tid => {
      clone.tiles[tid] = Object.assign({}, clone.tiles[tid]);
    });
    return clone;
  },

  toLocation( url ){
    link.href = url;
    var location = {};
    ['protocol', 'host', 'port', 'pathname', 'search', 'hash'].forEach( p => {
      location[p] = link[p];
    });

    location.query = qs.parse( location.search );
    location.route = url;

    return location;
  },

  // Use base 36 for creating ids
  createId( layout, type ){
    var prefix = type[0],
      id = prefix + (++counter).toString(36)
    ;

    while( layout[type][id] ){
      id = prefix + (++counter).toString(36);
    }

    return id;
  },

  createWid( layout ){
    return this.createId( layout, 'wrappers' );
  },

  createTid( layout ){
    return this.createId( layout, 'tiles' );
  }
}

export default layouter;
