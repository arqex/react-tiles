var React = require('react'),
  Router = require('react-router')
;

var Tile = React.createClass({
  getInitialState: function(){
    return {
      firstRendering: true
    };
  },
  render: function(){
    var dimensions = this.props.dimensions,
      className = 'singletile ' + this.props.layout.id
    ;

    if( this.state.firstRendering ){
      className += ' tileentering';
    }

    return (
      <div className={ className } style={ this.props.dimensions }>
        { this.props.layout.route }
      </div>
    )
  },
  componentDidMount: function(){
    var me = this;
    setTimeout( function(){
      me.setState({firstRendering: false});
    });
  }
});

module.exports = Tile;
