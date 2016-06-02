var React = require('react'),
  ReactDom = require('react-dom'),
  Router = require('react-router'),
  TileWrapper = require('./components/TileWrapper'),
  FloatingWrapper = require('./components/FloatingWrapper'),
  TileLink = require('./components/TileLink'),
  Tile = require('./components/Tile'),
  QueryBuilder = require('./utils/QueryBuilder'),
  utils = require('./utils/TileUtils'),
  UrlParser = require('./utils/UrlParser'),
  qs = require('qs')
;

require('./tiles.scss');

var minSizes = {
  column: 200, // For column wrappers this is the minimun height of a row
  row: 320 // For row wrappers this is the minumum width of a column
};

var Tiles = React.createClass({
  getInitialState: function(){
    Tiles.getQueryBuilder = this.getQueryBuilder;

    Tiles.getWrapperInfo = id => {
      return this.getQueryBuilder().getWrapperInfo( id );
    }

    this.setPathFormat();

    return {
      layout: UrlParser.parse( this.getRoute() ),
      currentLocation: location.href,
      dimensions: {
        height: window.innerHeight,
        width: window.innerWidth
      },
      resizing: false,
      moving: false
    };
  },

  render(){
    window.queryBuilder = this.getQueryBuilder();

    var className = 'tilecontainer';
    if( this.state.resizing ){
      className += ' tileresizing';
    }
    if( this.state.moving ){
      className += ' tilemoving';
    }

    return (
      <div className={ className }>
        <TileWrapper {...this.props}
          ref="wrapper"
          layout={this.state.layout}
          dimensions={ this.state.dimensions }
          onResizeStart={ () => this.setState({resizing: true}) }
          onResizeEnd={ () => this.setState({resizing: false}) }
          onDragStart={ (e, boundaries) => this.onDragStart(e, boundaries) }
          movingTile={ this.state.moving }
          minSizes={ minSizes }
        />
      <FloatingWrapper {...this.props}
        minSizes={ minSizes }
        tiles={ this.state.layout.floating }
        onMove={ this.onMove }
        onStopMove={ this.onStopMove } />
      </div>
    );
  },

  componentDidMount(){
    this.setState({ dimensions: this.calculateDimensions() });
    window.addEventListener( 'resize', () => {
      if( this.ticking ){
        return;
      }
      this.ticking = true;
      utils.requestAnimationFrame( () => {
        this.setState({ dimensions: this.calculateDimensions() });
        this.ticking = false;
      });
    });
  },

  calculateDimensions(){
    var node = ReactDom.findDOMNode( this );
    return {
      width: node.clientWidth,
      height: node.clientHeight
    };
  },

  getRoute(){
    var location = this.props.location;
    if( location ){
      return location.pathname + '?' + qs.stringify( location.query );
    }
    else {
      var route = location.href.split(location.host);
      if( route.slice(0,2) == '/#' ){
        route = route.slice(2);
      }
      return route;
    }
  },
  componentDidUpdate(){
    if( this.state.currentLocation !== location.href ){
      var layout = UrlParser.parse(this.getRoute());
      this.setState({
        layout: layout,
        currentLocation: location.href
      });
    }
  },
  getQueryBuilder(){
    var queryBuilder = new QueryBuilder('/');
    queryBuilder.setLayout( this.state.layout );
    return queryBuilder;
  },
  setPathFormat(){
    var routeParts = location.href.split(location.host);
    if( routeParts[1] && routeParts[1].slice(0,2) === '/#' ){
      QueryBuilder.setPathFormat('/#');
    }
  },
  onMove: function( tileData ){
    this.setState({moving: tileData});
  },
  onStopMove: function( tileData ){
    var wrapper = this.refs.wrapper.receiveTile( tileData );
    if( wrapper ){
      var builder = this.getQueryBuilder(),
        tileRoute = this.state.layout.floating[ tileData.id ],
        wrapperId = wrapper.isNew ? utils.tid( wrapper.type[0] ) : wrapper.id
      ;

      builder.remove( tileData.id, true );
      var type = wrapper.isNew ? wrapper.type : 'tile',
        route = builder.setTile({
          id: tileData.id,
          route: tileRoute,
          type: type,
          target: wrapperId
        })
      ;

      location.href = route;
    }

    this.setState({moving: false});
  },
  onDragStart: function( e, boundaries ){
    console.log( boundaries );
  }
});

Tiles.Link = TileLink;
TileLink.setManager( Tiles );

module.exports = Tiles;
