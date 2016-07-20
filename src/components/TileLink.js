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
    wrapperId: React.PropTypes.string,
    builder: React.PropTypes.object,
    resolver: React.PropTypes.object
  },

  getInitialState: function(){
    this.tid = utils.tid('t');
    return {};
  },

  render: function(){
    // console.log( this.context.tileLayout );
    return (
      <a href={ this.getUrl() } className={ this.props.className } style={ this.props.style } onClick={ e => this.navigate( e ) }>
        { this.props.children }
      </a>
    );
  },

  getUrl: function(){
    var route = this.props.route || this.props.to;
    if( !route ){
      return;
    }

    var routeParts = route.split('#'),
      url
    ;

    if( this.props.single ){
      return route;
    }

    var builder = this.context.builder,
      tileData = {
        route: routeParts[0],
        tile: this.props.tile || (this.props.wrapper ? this.tid : this.context.tileLayout.id),
        wrapper: this.props.wrapper || this.context.wrapperId,
        type: this.props.type,
        position: this.props.position
      }
    ;

    url = builder.setTile( tileData );

    if( routeParts.length > 1 ){
      url += '#' + routeParts[ routeParts.length - 1 ];
    }

    return url;
  },

  navigate: function( e ){
    if( this.props.onClick ){
      this.props.onClick( e );
    }

    e.preventDefault();
    this.context.resolver.navigate( this.getUrl() );
    this.tid = utils.tid('t');
  }
});

TileLink.setManager = function( tm ){
  TileManager = tm;
}

module.exports = TileLink;
