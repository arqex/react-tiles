var React = require('react'),
  Router = require('react-router')
;

var IframeTile = React.createClass({
  render: function(){
    return (
      <iframe src={ this.props.layout.route } />
    )
  }
});

module.exports = IframeTile;
