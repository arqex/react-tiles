var React = require('react'),
  Router = require('react-router')
;

var Tile = React.createClass({
  render: function(){
    var dimensions = this.props.dimensions;

    return (
      <div className={ 'singletile ' + this.props.id } style={ this.props.dimensions }>
        { this.props.route }
      </div>
    )
  }
});

module.exports = Tile;
