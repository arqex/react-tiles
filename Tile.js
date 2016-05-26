var React = require('react'),
  Router = require('react-router'),
  IframeTile = require('./IframeTile')
;

var Tile = React.createClass({
  getInitialState: function(){
    return {
      firstRendering: true,
      route: this.props.layout.route,
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
      content
    ;

    console.log( this.props.layout );

    if( C ){
      content = <C {...this.props} />;
    }

    if( this.state.firstRendering ){
      className += ' tileentering';
    }

    if( C === IframeTile ){
      className += ' tileiframe';
    }

    return (
      <div className={ className } style={ this.props.dimensions }>
        <div className="tilecontrols">
          <a onClick={ () => this.closeTile() }>x</a>
        </div>
        <div className="tileiframeOverlay"></div>
        <div className="tilecontent">
          { content }
        </div>
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
    console.log("NOW:", this.state.route, "NEXT:" + nextProps.layout.route );
    if( this.state.route !== nextProps.layout.route ){
      this.updateRouteComponent( nextProps );
    }
  },

  updateRouteComponent: function( props ){
    var me = this,
      route = props.layout.route
    ;

    if( route.match(/https?:\/\//i) ){
      return me.setState({C: IframeTile});
    }

    Router.match({ routes: props.routes, location: props.layout.route }, function(error, redirection, state){
      var C = state.routes[1].component;
      if( me.state.C !== C ){
        me.setState({
          C: C,
          route: route
        });
      }
    })
  },
  closeTile: function(){
    var builder = require('./TileManager').getQueryBuilder();
    var url = builder.remove( this.props.layout.id );
    location.href = url;
  }
});

module.exports = Tile;
