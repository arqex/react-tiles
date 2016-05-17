var React = require('react'),
  Router = require('react-router')
;

var Tile = React.createClass({
  render: function(){
    var dimensions = this.props.dimensions;

    return (
      <div className={ 'singletile ' + this.props.layout.id } style={ this.props.dimensions }>
        { this.props.layout.route }
      </div>
    )
  }
});

module.exports = Tile;
