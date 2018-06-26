import React, { Component } from 'react';
import layouter from './layouter';
import Tile from './Tile';
import Separator from './Separator';
import resizerTools from './resizerTools';

import './react-tiles.scss';


var singleton;
const layoutDimensions = {
  column: {tfrom: 'top', wfrom: 'left', tsize: 'height', wsize: 'width', wsep: 'v', tsep: 'h' },
  row: {tfrom: 'left', wfrom: 'top', tsize: 'width', wsize: 'height', wsep: 'h', tsep: 'v' }
};
const MIN_HEIGHT = 200;
const MIN_WIDTH = 300;

class Tiles extends Component {
  constructor( props ){
    super(props);

    singleton = this;

    this.props.resolver.init();

    this.onSepStart = this.onSepStart.bind(this);
    this.onSepMove = this.onSepMove.bind(this);
    this.onSepEnd = this.onSepEnd.bind(this);

    this.onTileStart = this.onTileStart.bind(this);
    this.onTileMove = this.onTileMove.bind(this);
    this.onTileEnd = this.onTileEnd.bind(this);

    this.onResizeStart = this.onResizeStart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onResizeEnd = this.onResizeEnd.bind(this);

    this.calculateZIndex = this.calculateZIndex.bind(this);
    this.close = this.close.bind(this);
    /*
    // Bind some quick methods
    this.onMoveStart = this.onMoveStart.bind(this);
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onMoveStop = this.onMoveStop.bind(this);
    */

    this.lastRoute = this.getRoute();
    var layout = layouter.toLayout( this.lastRoute );

    var state = this.calculateInitialSizes( layout );
    state.layout = layout.type;
    state.resizing = false;
    state.moving = false;
    state.current = layout;
    state.deleting = {}; // Intermediate state for tiles and wrappers when closing tiles

    this.state = state;
  }

  render() {
    var cn = "rtcontainer rt" + this.state.layout,
      dimensions = this.state.layout === 'column' ? layoutDimensions.column : layoutDimensions.row
    ;
    if( this.moving ){
      cn += ` rtupdating rt${this.moving.type}`;
      if( this.moving.placeholder === 'wrapper' ){
        cn += ' rtwph';
      }
    }
    return (
      <div className={cn} ref={ el => this.el = el }>
        { this.renderTiles( dimensions ) }
        { this.renderSeparators( dimensions ) }
        <div className="tIframeOverlay"></div>
      </div>
    );
  }

  renderTiles( d ){
    var state = this.state,
      layout = state.current,
      updating = state.resizing || state.moving
    ;

    return state.tileOrder.map( tid => {
      var ltile = layout.tiles[tid] || state.deleting[tid],
        tile = state.tiles[tid] || ltile.sizes,
        style = {},
        wrapper
      ;
      if( ltile.wrapper ){
        wrapper = state.wrappers[ ltile.wrapper ] || state.deleting[ ltile.wrapper ];
        style[ d.tfrom ] = tile.from + '%';
        style[ d.wfrom ] = wrapper.from + '%';
        style[ d.tsize ] = tile.size + '%';
        style[ d.wsize ] = wrapper.size + '%';
        style.zIndex = state.zIndexes.tiles[tid];
      }
      else {
        style = Object.assign({zIndex: this.state.zIndexes.tiles[tid] + 1000}, tile);
      }

      return (
        <Tile key={ tid }
          onMoveStart={ this.onTileStart }
          onMove={ this.onTileMove }
          onMoveEnd={ this.onTileEnd }
          onResizeStart={ this.onResizeStart }
          onResize={ this.onResize }
          onResizeEnd={ this.onResizeEnd }
          onClick={ this.calculateZIndex }
          onClose={ this.close }
          deleting={ ltile.deleting }
          withPlaceholder={ this.moving && this.moving.placeholder && this.moving.placeholder === ltile.wrapper }
          tid={ tid }
          floating={ !ltile.wrapper }
          url={ ltile.location.route }
          style={ style }
          resolver={ this.props.resolver }
          updating={ updating } />
      );
    });
  }

  renderSeparators( d ){
    var state = this.state,
      separators = []
    ;

    this.state.current.wrapperOrder.forEach( (wid, i) => {
      var style = {};
      if( i ){
        style[ d.wfrom ] = state.wrappers[wid].from + '%';
        style[ d.tfrom ] = 0;
        style[ d.tsize ] = '100%';
        separators.push( this.renderSeparator( d.wsep, style, 'w', i, wid ) );
      }

      this.state.current.wrappers[wid].forEach( (tid, j) => {
        if( !j ) return;

        var tstyle = {};
        tstyle[ d.wfrom ] = state.wrappers[wid].from + '%';
        tstyle[ d.tfrom ] = state.tiles[tid].from + '%';
        tstyle[ d.wsize ] = state.wrappers[wid].size + '%';
        separators.push( this.renderSeparator( d.tsep, tstyle, i, j, tid ) );
      });
    });

    return separators;
  }

  renderSeparator( type, style, wrapper, tile, key ){
    return (
      <Separator key={ `ts_${key}` } style={ style } type={ type }
        withPlaceholder={ tile && this.moving && this.moving.placeholder && this.moving.placeholder === this.state.current.wrapperOrder[wrapper] }
        wrapper={ wrapper } tile={ tile }
        onMoveStart={ this.onSepStart }
        onMove={ this.onSepMove }
        onMoveEnd={ this.onSepEnd } />
    );
  }

  calculateInitialSizes( layout ){
    var tiles = {},
      wrappers = {},
      tileOrder = [],
      zIndexes = {tiles: {}, order: []}
    ;

    var wsize = 100 / layout.wrapperOrder.length;
    layout.wrapperOrder.forEach( (wid,i) => {
      wrappers[wid] = {
        from: i*wsize,
        size: wsize
      };

      var tsize = 100 / layout.wrappers[wid].length;
      layout.wrappers[wid].forEach( (tid, j) => {
        tiles[ tid ] = {
          from: j*tsize,
          size: tsize
        };
        tileOrder.push( tid );
        zIndexes.order.push(tid);
        zIndexes.tiles[tid] = zIndexes.order.length;
      });
    });

    layout.floating.forEach( (tid, i) => {
      tiles[tid] = {
        top: 150 + (80*i),
        left: 150 + (80*i),
        width: 350,
        height: 250
      };
      tileOrder.push(tid);
      zIndexes.order.push(tid);
      zIndexes.tiles[tid] = zIndexes.order.length;
    });

    return {tiles, wrappers, tileOrder, zIndexes};
  }

  close( tid ){
    var layout = layouter.clone(this.state.current);
    layouter.removeTileFromLayout(layout, tid);
    this.setLayout(layout);
  }

  getRoute(){
    return this.props.resolver.getPath();
  }

  setLayout( layout ){
    var url = layouter.toUrl( layout );

    this.props.resolver.navigate( '?' + url );
  }

  onSepStart( wrapper, sid, coord ){
    var layout = this.state.current,
      separators = [],
      el = this.el,
      minPercentage, targets, sizes, maxSize
    ;

    if( wrapper === 'w' ){
      targets = layout.wrapperOrder.map( wid => this.state.wrappers[wid] );
      minPercentage = layout.type === 'row' ? (MIN_HEIGHT / el.clientHeight * 100) : (MIN_WIDTH / el.clientWidth * 100);
      maxSize = layout.type === 'row' ? el.clientHeight : el.clientWidth;
    }
    else {
      targets = layout.wrappers[ layout.wrapperOrder[wrapper] ].map( tid => this.state.tiles[tid] );
      minPercentage = layout.type === 'row' ? (MIN_WIDTH / el.clientWidth * 100) : (MIN_HEIGHT / el.clientHeight * 100);
      maxSize = layout.type === 'row' ? el.clientWidth : el.clientHeight;
    }

    sizes = targets.map( t => t.size );
    // Targets are the tiles/wrappers in the state
    this.moving = {
      type: 'separatorMoving',
      targets, sizes, minPercentage, maxSize
    };
    this.onSepMove(sid, coord);
  }

  onSepMove( sid, coord ){
    var moving = this.moving;
    if( !moving ) return;
    if( resizerTools.updateSizes( moving.sizes, sid, coord / moving.maxSize * 100, moving.minPercentage ) ){
      var sum = 0;
      moving.targets.forEach( (t,i) => {
        t.size = moving.sizes[i];
        t.from = sum;
        sum += moving.sizes[i];
      });
      this.forceUpdate();
    }
  }

  onSepEnd( sid, coord ){
    this.onSepMove(sid, coord);
    this.moving = false;
    this.forceUpdate();
  }

  onTileStart( tid ){
    this.moving = {
      type: 'moving',
      tid: tid,
      target: this.state.tiles[tid],
      start: Object.assign( {}, this.state.tiles[tid] ),
      wrapper: this.state.current.tiles[ tid ].wrapper,
      reRendering: false,
      placeholder: false
    };
    this.forceUpdate();
  }

  onTileMove( left, top, eventLeft, eventTop ){
    var moving = this.moving;

    if( !moving ) return;

    var layout = this.state.current;
    if( moving.wrapper && !moving.reRendering ){
      layout = layouter.clone( layout );
      layouter.moveTile( layout, moving.tid, 'floating' );
      moving.reRendering = {left: eventLeft, top: eventTop};
      return this.setLayout( layout ); // We need to re-render
    }
    else if( moving.reRendering ){
      moving.target = this.state.tiles[moving.tid];
      if( moving.target.size ) return; // Not re rendered yet

      moving.reRendering = false;
      moving.wrapper = false;
      moving.start = Object.assign( {}, moving.target );
    }

    this.state.tiles[moving.tid] = moving.target = Object.assign( {}, moving.target,
      { left: moving.start.left + left, top: moving.start.top + top}
    );

    // Calculate placeholder
    var right = this.el.clientWidth - 200,
      bottom = this.el.clientHeight - 200,
      layoutType = layout.type,
      percentage, ph
    ;

    if( eventTop > bottom && layoutType === 'column' || eventLeft > right && layoutType === 'row' ){
      // Tile placeholder
      var tSizes = layoutType === 'row' ? {size: eventTop, coord: 'clientHeight'} : {size: eventLeft, coord: 'clientWidth'};

      percentage = tSizes.size / this.el[ tSizes.coord ] * 100;
      layout.wrapperOrder.forEach( (wid, i) => {
        if( !i || ph ) return;

        if(this.state.wrappers[wid].from > percentage ){
          ph = layout.wrapperOrder[i-1];
        }
      });
      if( !ph ){
        ph = layout.wrapperOrder[ layout.wrapperOrder.length - 1 ];
      }
    }
    else if( eventTop > bottom || eventLeft > right ){
      // Wrapper placeholder
      ph = 'wrapper';
    }
    else {
      ph = false;
    }

    moving.placeholder = ph;

    this.forceUpdate();
  }

  onTileEnd( left, top ){
    var moving = this.moving;
    this.moving = false;

    if( left === undefined || !moving ){
      return this.moving = false;
    }

    this.state.tiles[moving.tid] = moving.target = Object.assign( {}, moving.target,
      { left: moving.start.left + left, top: moving.start.top + top }
    );

    var ph = moving.placeholder;
    if( ph ){
      var layout = layouter.clone(this.state.current);
      layouter.moveTile(layout, moving.tid, ph != 'wrapper' && ph);
      this.setLayout( layout );
    }
    else {
      this.forceUpdate();
    }
  }

  onResizeStart( tid, origin, directions ){
    var sizes = this.state.tiles[tid];
    this.moving = {
      type: 'resize',
      maxN: origin.top + sizes.height - MIN_HEIGHT,
      maxW: origin.left + sizes.width - MIN_WIDTH,
      initial: Object.assign( {}, sizes ),
      tid, origin, directions, sizes
    }
    this.forceUpdate();
  }

  onResize( e ){
    let {maxN,maxW,sizes,origin,directions,initial} = this.moving;
    var dim;

    if( directions.e ){
      sizes.width = Math.max(initial.width + e.clientX - origin.left, MIN_WIDTH);
    }
    if( directions.s ){
      sizes.height = Math.max(initial.height + e.clientY - origin.top, MIN_HEIGHT);
    }
    if( directions.n ){
      dim = Math.min( maxN, e.clientY );
      sizes.height = initial.height + origin.top - dim;
      sizes.top = initial.top - origin.top + dim;
    }
    if( directions.w ){
      dim = Math.min( maxW, e.clientX );
      sizes.width = initial.width + origin.left - dim;
      sizes.left = initial.left - origin.left + dim;
    }

    this.forceUpdate();
  }

  onResizeEnd( e ){
    this.onResize(e);
    this.moving = false;
    this.forceUpdate();
  }

  calculateZIndex( tid ){
    var order = this.state.zIndexes.order;
    if( order[ order.length -1 ] === tid ) return;

    var i = order.indexOf( tid );
    if( i !== -1 ){
      order.splice(i, 1);
    }
    order.push( tid );
    var tiles = {};
    order.forEach( (tid, i) => {
      tiles[tid] = i+1;
    });

    this.setState({ zIndexes: {order,tiles} });
  }

  componentWillUpdate(){
    var route = this.getRoute();
    if( route !== this.lastRoute ){
      this.lastRoute = route;

      var layout = layouter.toLayout( route ),
        currentLayout = this.state.current,
        update = {current: layout},
        sizes = resizerTools.updateLayoutSizes( this.state.current, layout, {
          tiles: this.state.tiles,
          wrappers: this.state.wrappers
        }, this.el, this.moving && this.moving.reRendering ),
        tileOrder = this.state.tileOrder.slice()
      ;

      update.tiles = sizes.tiles;
      update.wrappers = sizes.wrappers;

      // Check if there is some closed tile
      tileOrder.forEach( tid => {
        if( !layout.tiles[tid] ){
          var tile = currentLayout.tiles[tid];
          tile.sizes = this.state.tiles[tid];
          tile.deleting = true;
          this.state.deleting[ tid ] = tile;
          if( tile.wrapper && currentLayout.wrappers[tile.wrapper].length <= 1 ){
            this.state.deleting[ tile.wrapper ] = this.state.wrappers[ tile.wrapper ];
          }
          setTimeout( () => {
            var nextOrder = this.state.tileOrder.slice(),
              i = nextOrder.indexOf(tid)
            ;

            if( i !== -1 ){
              nextOrder.splice(i, 1);
              this.setState({
                tileOrder: nextOrder,
                deleting: {}
              });
            }
          }, 300);
        }
      });

      // Check if there is some new tile
      Object.keys( layout.tiles ).forEach( tid => {
        if( tileOrder.indexOf(tid) === -1 ){
          tileOrder.push(tid);
          update.tileOrder = tileOrder;
        }
      });

      this.setState( update );
    }
  }

  static setTile( tid, route, wid ){
    var layout = singleton.getLayout();
    layouter.updateLayout( layout, tid, route, wid );
    singleton.setLayout( layout );
  }
}

export default Tiles;
