var React = require('react'),
  Router = require('react-router'),
  ReactDom = require('react-dom'),
  IframeTile = require('./IframeTile')
;

var Tile = React.createClass({
  getInitialState: function(){
    return {
      firstRendering: true,
      route: this.props.layout.route,
      isIframe: false,
      C: false
    };
  },
  childContextTypes: {
    tileLayout: React.PropTypes.object,
    wrapperId: React.PropTypes.string
  },
  getChildContext: function(){
    return {
      tileLayout: this.props.layout,
      wrapperId: this.props.wrapper.id
    };
  },
  render: function(){
    var dimensions = this.props.dimensions,
      className = 'singletile ' + this.props.layout.id + ' ' + this.props.wrapper.type + 'singletile',
      C = this.state.C,
      content, overlay
    ;

    if( C ){
      content = <C {...this.props} />;
    }

    if( this.state.firstRendering ){
      className += ' tileentering';
    }
    if( C === IframeTile ){
      className += ' tileiframe';
    }
    if( this.props.isCurrentTile ){
      className += ' tilecurrent';
    }

    if( this.state.isIframe ){
      overlay = <div className="tileiframeOverlay"></div>;
    }

    return (
      <div className={ className } style={ this.props.dimensions } onClick={ () => this.onClick() }>
        <div className="tilecontrols" onMouseDown={ e => this.onDragStart(e) }>
          <a onClick={ () => this.closeTile() }>x</a>
        </div>
        { overlay }
        <TileContent resizing={ this.props.resizing }>
          { content }
        </TileContent>
        { this.renderResizers() }
      </div>
    )
  },
  componentDidMount: function(){
    var me = this;
    setTimeout( function(){
      me.setState({firstRendering: false});
    });
    this.updateRouteComponent( this.props );
  },

  componentWillReceiveProps( nextProps ){
    if( this.state.route !== nextProps.layout.route ){
      this.updateRouteComponent( nextProps );
    }
  },

  updateRouteComponent: function( props ){
    var me = this,
      route = props.layout.route
    ;

    if( route.match(/https?:\/\//i) ){
      return me.setState({C: IframeTile, isIframe: true});

    }

    Router.match({ routes: props.routes, location: props.layout.route }, function(error, redirection, state){
      var C = state.routes[1].component;
      if( me.state.C !== C ){
        me.setState({
          C: C,
          route: route,
          isIframe: false
        });
      }
    })
  },
  closeTile: function(){
    var builder = require('./TileManager').getQueryBuilder();
    var url = builder.remove( this.props.layout.id );
    location.href = url;
  },
  renderResizers: function(){
    if( this.props.layout.type !== 'floating' ){
      return;
    }

    return (
      <div className="tileResizers">
        <div className="resizer-n" onMouseDown={ this.props.onResizeStart('n') }></div>
        <div className="resizer-e" onMouseDown={ this.props.onResizeStart('e') }></div>
        <div className="resizer-s" onMouseDown={ this.props.onResizeStart('s') }></div>
        <div className="resizer-w" onMouseDown={ this.props.onResizeStart('w') }></div>
        <div className="resizer-nw" onMouseDown={ this.props.onResizeStart('nw') }></div>
        <div className="resizer-ne" onMouseDown={ this.props.onResizeStart('ne') }></div>
        <div className="resizer-se" onMouseDown={ this.props.onResizeStart('se') }></div>
        <div className="resizer-sw" onMouseDown={ this.props.onResizeStart('sw') }></div>
      </div>
    );
  },
  onClick: function(){
    return this.props.onClick && this.props.onClick( this.props.layout.id );
  },
  onDragStart: function( e ){
    if(this.props.onDragStart){
      this.props.onDragStart( e, this.props.layout.id, ReactDom.findDOMNode(this).getBoundingClientRect() );
    }
  }
});

// This is a dumb component that prevents the content of a tile to be re-rendered
// in a tile resize
var TileContent = React.createClass({
  render: function(){
    return (
      <div className="tilecontent">
        { this.props.children }
      </div>
    );
  },
  shouldComponentUpdate: function(){
    return !this.props.resizing;
  }
})

module.exports = Tile;
