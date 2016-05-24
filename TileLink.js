var React = require('react');

var TileManager;

var TileLink = React.createClass({
  contextTypes: {
    tileLayout: React.PropTypes.object,
    wrapperId: React.PropTypes.string
  },

  render: function(){
    // console.log( this.context.tileLayout );
    return <a href={ this.getUrl() }>{ this.props.children }</a>;
  },

  getUrl: function(){
    var builder = TileManager.getQueryBuilder(),
      tileData = {
        route: this.props.to,
        id: this.props.tile || this.context.tileLayout.id,
        target: this.props.wrapper || this.context.wrapperId,
        type: this.props.type,
        position: this.props.position
      }
    ;

    return builder.setTile( tileData );
  }
});

TileLink.setManager = function( tm ){
  TileManager = tm;
}

module.exports = TileLink;
