var React = require('react'),
  Tile = require('./Tile'),
  assign = require('object-assign'),
  Animate = require('rc-animate'),
  utils = require('./TileUtils')
;

var FloatingWrapper = React.createClass({
  getInitialState: function(){
    var dimensions = {},
      i = 0
    ;

    Object.keys(this.props.tiles).forEach( tileId => {
      dimensions[ tileId ] = this.getInitialTileDimensions(i++);
    });

    return {
      dimensions: dimensions,
      moving: false,
      currentTile: false
    };
  },

  render: function(){
    var className = 'floatingWrapper';

    return (
      <Animate ref="animate" component="div" className={ className } transitionName="tilewrapper">
        { this.renderTiles() }
      </Animate>
    );
  },
  renderTiles: function() {
    var tiles = this.props.tiles,
      me = this,
      floating = []
    ;

    Object.keys( tiles ).forEach( tileId => {
      floating.push(
        <Tile {...me.props}
          key={ tileId }
          layout={ {id: tileId, route: tiles[ tileId ], type:'floating'} }
          dimensions={ this.state.dimensions[ tileId ] }
          resizing={ this.state.resizing }
          onDragStart={ me.onDragStart( tileId ) }
          onResizeStart={ me.onResizeStart( tileId ) }
          wrapper={ {id: 'floating', type: 'floating'} } />
      );
    });

    return floating;
  },
  getInitialTileDimensions: function( i ){
    return {
      width: 400,
      height: 300,
      top: 100 + 50*i,
      left: 100 + 50*i
    }
  },
  onDragStart: function( tid ){
		var me = this;
		return function( e ){

			// Only left click
			if( e.button || e.target.tagName.toLowerCase() == 'a' )
				return;

			var start = { left: e.clientX, top: e.clientY },
        style = assign({}, me.state.dimensions[ tid ] ),
				moveStarted = false, // Flag to not to stop when the movement has started
				pos = {
					left: style.left,
					top: style.top
				},
				ticking = false,
				dragState = {moving: true, currentTile: tid},
				finished = false, // A flag to prevent reqAnimFrame to move after finish
				mm, mu
			;

			me.setState( dragState );

			window.addEventListener( 'mousemove', mm = function( e ){
				if( !ticking ){
					ticking = true;
					utils.requestAnimationFrame( function(){
						if( finished )
							return;
						var now = { left: e.clientX, top: e.clientY },
							left = now.left - start.left,
							top = now.top - start.top
						;
						if( moveStarted || Math.abs( left ) > 20 || Math.abs( top ) > 20 ){
							moveStarted = true;
              me.props.onMove({id: tid, x: e.clientX, y: e.clientY});
							var dimensions = assign({}, me.state.dimensions );
              dimensions[tid] = assign({}, dimensions[tid], {
                left: pos.left + left,
                top: pos.top + top
              });
							me.setState( {dimensions: dimensions} );
						}
						ticking = false;
					})
				}
			});

			window.addEventListener( 'mouseup', mu = function( e ){
				var update = {moving: false},
					tiles = assign( {}, me.state.dimensions )
				;

        var now = { left: e.clientX, top: e.clientY },
          left = now.left - start.left,
          top = now.top - start.top
        ;
        if( moveStarted ){
          var dimensions = assign({}, me.state.dimensions );
          dimensions[tid] = assign({}, dimensions[tid], {
            left: pos.left + left,
            top: pos.top + top
          });
          update.dimensions = dimensions;
        }

        me.props.onStopMove({id: tid, x: e.clientX, y: e.clientY});

				finished = true;

				me.setState( update );

				window.removeEventListener( 'mousemove', mm );
				window.removeEventListener( 'mouseup', mu );
			});
		}
	},
  onResizeStart: function( tid ){
		var me = this;
		return function( direction ){

			return function( e ){
				var origin = { left: e.clientX, top: e.clientY },
					initial = assign({}, me.state.dimensions[ tid ]),
					ticking = false,
					finished = false, // A flag to prevent reqAnimFrame to move after finish
					directions = {
						n: direction.indexOf('n') != -1,
						s: direction.indexOf('s') != -1,
						e: direction.indexOf('e') != -1,
						w: direction.indexOf('w') != -1,
					},
          maxN = origin.top + initial.height - me.props.minSizes.column,
          maxW = origin.left + initial.width - me.props.minSizes.row,
					mm, mu
				;

				me.setState({moving: true, currentTile: tid});
				window.addEventListener( 'mousemove', mm = function( e ){
					if( !ticking ){
						ticking = true;
						window.requestAnimationFrame( function(){
							if( finished )
								return;

							var dimensions = assign({}, me.state.dimensions ),
								style = assign({}, dimensions[ tid ]),
                dim
							;

							if( directions.e ){
								style.width = Math.max(initial.width + e.clientX - origin.left, me.props.minSizes.row);
							}
							if( directions.s ){
								style.height = Math.max(initial.height + e.clientY - origin.top, me.props.minSizes.column);
							}
							if( directions.n ){
                dim = Math.min( maxN, e.clientY );
								style.height = initial.height + origin.top - dim;
								style.top = initial.top - origin.top + dim;
							}
							if( directions.w ){
                dim = Math.min( maxW, e.clientX );
								style.width = initial.width + origin.left - dim;
								style.left = initial.left - origin.left + dim;
							}

              dimensions[tid] = style;

							me.setState({ dimensions: dimensions });
							ticking = false;
						});
					}
				});
				window.addEventListener( 'mouseup', mu = function( e ){
					me.setState({moving: false});
					window.removeEventListener( 'mousemove', mm );
					window.removeEventListener( 'mouseup', mu );
				});
			};
		}
	},
});

module.exports = FloatingWrapper;
