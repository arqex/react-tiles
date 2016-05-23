var React = require('react'),
  Router = require('react-router')
;

var Tile = React.createClass({
  render: function(){
    return (
      <iframe src={ this.props.layout.route } />
    )
  }
});

module.exports = Tile;
