var React = require('react'),
  ReactDom = require('react-dom'),
  IframeTile = require('./IframeTile'),
  assign = require('object-assign')
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
    wrapperId: React.PropTypes.string,
    builder: React.PropTypes.object,
    resolver: React.PropTypes.object
  },
  getChildContext: function(){
    return {
      tileLayout: this.props.layout,
      wrapperId: this.props.wrapper.id,
      builder: this.props.builder,
      resolver: this.props.resolver
    };
  },
  render: function(){
    var className = 'singletile ' + this.props.layout.id + ' ' + this.props.wrapper.type + 'singletile',
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
      <div className={ className } style={ assign({},this.props.dimensions) } onClick={ () => this.onClick() }>
        <div className="tilecontrols" onMouseDown={ e => this.onMoveStart(e) }>
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

    this.props.resolver.resolve( props.layout.route, function( C ){
      if( me.state.C !== C ){
        me.setState({
          C: C,
          route: route,
          isIframe: false
        });
      }
    });
  },
  closeTile: function(){
    var url = this.props.builder.remove( this.props.layout.id );
    this.props.resolver.navigate( url );
  },
  renderResizers: function(){
    var layout = this.props.layout;

    if( layout.type !== 'floating' ){
      return;
    }

    return (
      <div className="tileResizers">
        <div className="resizer-n" onMouseDown={ this.props.onResizeStart('n', layout.id) }></div>
        <div className="resizer-e" onMouseDown={ this.props.onResizeStart('e', layout.id) }></div>
        <div className="resizer-s" onMouseDown={ this.props.onResizeStart('s', layout.id) }></div>
        <div className="resizer-w" onMouseDown={ this.props.onResizeStart('w', layout.id) }></div>
        <div className="resizer-nw" onMouseDown={ this.props.onResizeStart('nw', layout.id) }></div>
        <div className="resizer-ne" onMouseDown={ this.props.onResizeStart('ne', layout.id) }></div>
        <div className="resizer-se" onMouseDown={ this.props.onResizeStart('se', layout.id) }></div>
        <div className="resizer-sw" onMouseDown={ this.props.onResizeStart('sw', layout.id) }></div>
      </div>
    );
  },
  onClick: function(){
    return this.props.onClick && this.props.onClick( this.props.layout.id );
  },
  onMoveStart: function( e ){
    if(this.props.onMoveStart){
      this.props.onMoveStart( e, this.props.layout, ReactDom.findDOMNode(this).getBoundingClientRect() );
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
