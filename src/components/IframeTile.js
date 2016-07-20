var React = require('react');

var IframeTile = React.createClass({
  render: function(){
    return (
      <iframe src={ this.props.layout.route } sandbox="allow-same-origin allow-scripts allow-popups allow-forms"/>
    )
  }
});

module.exports = IframeTile;
