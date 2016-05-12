var React = require('react'),
  ReactDom = require('react-dom'),
  Router = require('react-router'),
  UrlParser = require('./UrlParser'),
  TileWrapper = require('./TileWrapper'),
  QueryBuilder = require('./QueryBuilder'),
  qs = require('qs')
;

require('./tiles.scss');

var TileManager = React.createClass({
  getInitialState: function(){
    return {
      layout: UrlParser.parse( this.getRoute() ),
      currentLocation: location.href,
      dimensions: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    };
  },

  render(){
    window.queryBuilder = this.getQueryBuilder();

    return (
      <div className="tilecontainer">
        <TileWrapper {...this.props} {...this.state.layout} dimensions={ this.state.dimensions } />
      </div>
    );
  },

  componentDidMount(){
    this.setState({ dimensions: this.calculateDimensions() });
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
      this.setState({
        layout: UrlParser.parse(this.getRoute()),
        currentLocation: location.href
      });
    }
  },
  getQueryBuilder(){
    var queryBuilder = new QueryBuilder('/');
    queryBuilder.setLayout( this.state.layout );
    return queryBuilder;
  }
});



module.exports = TileManager;
