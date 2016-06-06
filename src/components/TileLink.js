var React = require('react');
var utils = require('../utils/TileUtils');

var TileManager;
/**
 * A component to load new routes on the layout. By default it opens the route
 * in the current tile, but it's possible to specify the tileId of the tile to open
 * the route.
 * If the tile is given and it can be found on the layout, it creates a new tile.
 * It's possible to pass "floating" as the wrapper to make the tile floating.
 *
 */
var TileLink = React.createClass({
  contextTypes: {
    tileLayout: React.PropTypes.object,
    wrapperId: React.PropTypes.string
  },

  render: function(){
    // console.log( this.context.tileLayout );
    return (
      <a href={ this.getUrl() } className={ this.props.className } style={ this.props.style }>
        { this.props.children }
      </a>
    );
  },

  getUrl: function(){
    if( !this.props.to ){
      return;
    }

    var builder = TileManager.getQueryBuilder(),
      tileData = {
        route: this.props.to,
        id: this.props.tile || (this.props.wrapper === 'floating' ? utils.tid('t') : this.context.tileLayout.id),
        target: this.props.wrapper || this.context.wrapperId,
        type: this.props.type,
        position: this.props.position
      }
    ;

    return builder.setTile( tileData );
  }
});

TileLink.setManager = function( tm ){
  TileManager = tm;
}

module.exports = TileLink;
