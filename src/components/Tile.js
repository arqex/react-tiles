var React = require('react'),
  ReactDOM = require('react-dom'),
  IframeTile = require('./IframeTile'),
  assign = require('object-assign')
;

class Tile extends React.Component {
  constructor( props ){
    super(props);
    this.state = {
      firstRendering: true,
      route: props.layout.route,
      isIframe: false,
      C: false
    };

    this.resizeKeys = ['n','e','s','w','nw','ne','se','sw'];
  }

  render(){
    var className = 'singletile ' + this.props.layout.id + ' ' + this.props.wrapper.type + 'singletile',
      C = this.state.C,
      content, overlay
    ;

    if( C ){
      className += ' tile_' + C.name;
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
      <div ref={ el => this.el = el } data-wrapper={ this.props.wrapper.id} data-layout={ this.props.layout.id} className={ className } style={ assign({},this.props.dimensions) } onClick={ () => this.onClick() }>
        <div className="tilecontrols" onMouseDown={ e => this.onMoveStart(e) }>
          { this.renderControls() }
        </div>
        { overlay }
        <TileContent resizing={ this.props.resizing }>
          { content }
        </TileContent>
        { this.renderResizers() }
      </div>
    )
  }
  componentDidMount(){
    var me = this;
    setTimeout( function(){
      me.setState({firstRendering: false});
    });
    this.updateRouteComponent( this.props );
  }

  componentWillReceiveProps( nextProps ){
    if( nextProps.layout.route && nextProps.layout.route !== "undefined" && this.state.route !== nextProps.layout.route ){
      this.updateRouteComponent( nextProps );
    }
  }

  updateRouteComponent( props ){
    var me = this,
      route = props.layout.route
    ;

    if( route.match(/^https?:\/\//i) ){
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
  }
  closeTile(){
    var url = this.props.builder.remove( this.props.layout.id );
    this.props.resolver.navigate( url );
  }
  renderControls(){
    return (
      <a onClick={ () => this.closeTile() }>x</a>
    );
  }
  renderResizers(){
    if( this.props.layout.type !== 'floating' ){
      return;
    }

    var resizers = this.resizeKeys.map( k => (
      <div key={k}
        className={"resizer-" + k}
        onMouseDown={ this.props.onResizeStart(k, this.props.layout.id) } />
    ));

    return (
      <div className="tileResizers">
        { resizers }
      </div>
    );
  }
  onClick(){
    return this.props.onClick && this.props.onClick( this.props.layout.id );
  }
  onMoveStart( e ){
    if(this.props.onMoveStart && e.target.tagName !== 'INPUT'){
      this.props.onMoveStart( e, this.props.layout, this.el.getBoundingClientRect() );
    }
  }
};

// This is a dumb component that prevents the content of a tile to be re-rendered
// in a tile resize
class TileContent extends React.Component {
  render(){
    return (
      <div className="tilecontent">
        { this.props.children }
      </div>
    );
  }
  shouldComponentUpdate(){
    return !this.props.resizing;
  }
}

module.exports = Tile;
