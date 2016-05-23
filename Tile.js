var React = require('react'),
  Router = require('react-router')
;

var Tile = React.createClass({
  getInitialState: function(){
    return {
      firstRendering: true,
      C: false
    };
  },
  render: function(){
    var dimensions = this.props.dimensions,
      className = 'singletile ' + this.props.layout.id,
      C = this.state.C,
      content
    ;
    if( this.state.C ){
      content = <C {...this.props} />;
    }

    if( this.state.firstRendering ){
      className += ' tileentering';
    }

    return (
      <div className={ className } style={ this.props.dimensions }>
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
    this.updateRouteComponent();
  },
  componentDidUpdate: function( prevProps ){
    if( this.props.layout.route !== prevProps.layout.route ){
      this.updateRouteComponent();
    }
  },
  updateRouteComponent: function(){
    var me = this;
    Router.match({ routes: this.props.routes, location: this.props.layout.route }, function(error, redirection, state){
      console.log( state.routes );
      var C = state.routes[1].component;
      if( me.state.C !== C ){
        me.setState({C:C});
      }
    })
  }
});

module.exports = Tile;
