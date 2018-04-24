var React = require('react'),
  Tile = require('./Tile'),
  assign = require('object-assign'),
  Animate = require('rc-animate').default,
  utils = require('../utils/TileUtils')
;

class FloatingWrapper extends React.Component {
  constructor(props){
    super(props);
    var dimensions = {},
      i = 0
    ;

    Object.keys(props.tiles).forEach( tileId => {
      dimensions[ tileId ] = this.getInitialTileDimensions(i++);
    });

    this.state = {
      dimensions: dimensions,
      moving: false,
      currentTile: false
    };
  }

  render(){
    var className = 'floatingWrapper';

    return (
      <Animate ref="animate" component="div" className={ className } transitionName="tilewrapper">
        { this.renderTiles() }
      </Animate>
    );
  }

  renderTiles() {
    var tiles = this.props.tiles,
      me = this,
      floating = [],
      isMovingHandled = !this.props.moving
    ;

    Object.keys( tiles ).forEach( tileId => {
      if( !isMovingHandled ){
        isMovingHandled = tileId === this.props.movingTile.id;
      }
      floating.push( this.renderTile( tileId ) );
    });

    if( !isMovingHandled ){
      floating.push( this.renderTile( this.props.movingTile.id ) );
    }

    return floating;
  }

  renderTile( tileId ){
    var tile = this.props.tiles[ tileId ];
    return (
      <Tile {...this.props}
        key={ tileId }
        layout={ assign({id: tileId, type: 'floating'}, tile) }
        dimensions={ this.props.boxes[ tileId ] }
        resizing={ this.state.resizing }
        onMoveStart={ this.props.onMoveStart }
        onResizeStart={ this.props.onResizeStart }
        onClick={ tid => this.setState( {currentTile: tid } ) }
        isCurrentTile={ tileId === this.state.currentTile }
        wrapper={ {id: 'floating', type: 'floating'} } />
    );
  }

  componentWillReceiveProps( nextProps ){
    if( nextProps.tiles !== this.props.tiles ){
      var i = Object.keys(this.state.dimensions).length,
        dimensions = {},
        update = {}
      ;

      Object.keys( nextProps.tiles ).forEach( tileId => {
        dimensions[ tileId ] = this.state.dimensions[ tileId ];
        if( !dimensions[ tileId ] ){
          // new tile!
          dimensions[ tileId ] = this.getInitialTileDimensions( i++ );
          update.currentTile = tileId;
        }
      });

      update.dimensions = dimensions;
      this.setState( update );
    }
  }
  getInitialTileDimensions( i ){
    return {
      width: 400,
      height: 300,
      top: 100 + 50*i,
      left: 100 + 50*i
    }
  }
};

module.exports = FloatingWrapper;
