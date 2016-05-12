var React = require('react'),
  Router = require('react-router'),
  Tile = require('./Tile')
;

var TileWrapper = React.createClass({
  render: function(){
    var wrapperClass = [
        'tilewrapper',
        'tile' + this.props.type,
        this.props.id
      ].join(' '),
      dimensions = this.props.dimensions,
      style
    ;

    if( this.props.type === 'column' ){
      style = {
        height: dimensions.height,
        width: this.isNumeric(dimensions.width) ? '100%' : dimensions.width
      }
    }
    else {
      style = {
        height: this.isNumeric(dimensions.height) ? '100%' : dimensions.height,
        width: '100%'
      }
    }

    return (
      <div className={ wrapperClass } style={ style }>
        { this.renderChildren() }
      </div>
    )
  },
  renderChildren: function(){
    var props = this.props;
    var dimensions;

    if( this.props.type === 'column' ){
      dimensions = {
        height: (100 / props.children.length) + '%',
        width: this.props.dimensions.width
      }
    }
    else {
      dimensions = {
        height: this.props.dimensions.height,
        width: (100 / props.children.length) + '%'
      }
    }
    return props.children.map( function( child ){
      var Component = child.type === 'tile' ? Tile : TileWrapper;
      return <Component {...props} {...child} key={ child.id } dimensions={ dimensions } />;
    });
  },
  isNumeric: function( n ){
    return parseFloat(n) === n;
  }
});

module.exports = TileWrapper;
