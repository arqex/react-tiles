var React = require('react');

var IframeTile = React.createClass({
  render: function(){
    return (
      <iframe src={ this.props.layout.route } />
    )
  }
});

module.exports = IframeTile;
