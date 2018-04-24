var React = require('react');
var utils = require('../utils/TileUtils');
var ContextQueryBuilder = require('../utils/ContextQueryBuilder')

/**
 * A component to load new routes on the layout. By default it opens the route
 * in the current tile, but it's possible to specify the tileId of the tile to open
 * the route.
 * If the tile is given and it can be found on the layout, it creates a new tile.
 * It's possible to pass "floating" as the wrapper to make the tile floating.
 */
class TileLink extends React.Component {
  constructor(props){
    super(props);
    this.tid = utils.tid('t');
    this.state = {};
  }

  render(){

    return (
      <a href={ this.getUrl() } className={ this.props.className } style={ this.props.style } onClick={ e => this.navigate( e ) } ref={link => this.link = link}>
        { this.props.children }
      </a>
    );
  }

  getUrl( routeUrl ){
    var route = routeUrl || this.props.route || this.props.to;
    if( route === undefined ){
      return;
    }

    var routeParts = route.split('#'),
      url
    ;

    if( this.props.single ){
      return route;
    }

    var ids = this.getIds();

    var tileData = {
        route: routeParts[0] || '/',
        tile: this.props.tile || (this.props.wrapper ? this.tid : ids.layout),
        wrapper: this.props.wrapper || ids.wrapper,
        type: this.props.type,
        position: this.props.position
      }
    ;

    url = ContextQueryBuilder.setTile( tileData );

    if( routeParts.length > 1 ){
      url += '#' + routeParts[ routeParts.length - 1 ];
    }

    return url;
  }

  navigate( e, url ){
    if( this.props.onClick ){
      this.props.onClick( e );
    }

    e && e.preventDefault();
    ContextQueryBuilder.resolver.navigate( this.getUrl(url) );
    this.tid = utils.tid('t');
  }

  getIds( node ){
    var n = node || this.link;
    if( !n ) return {};
    if( n.dataset.wrapper ){
      return {
        wrapper: n.dataset.wrapper,
        layout: n.dataset.layout
      };
    }
    else {
      return this.getIds( n.parentNode );
    }
  }
};

module.exports = TileLink;
