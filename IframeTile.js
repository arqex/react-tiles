var React = require('react'),
  Router = require('react-router')
;

var Tile = React.createClass({
  render: function(){
    return (
      <div className="tileiframeContainer">
        <div className="tileiframeOverlay"></div>
        <iframe src={ this.props.layout.route } />
      </div>
    )
  }
});

module.exports = Tile;
