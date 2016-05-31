var React = require('react'),
  ReactDom = require('react-dom'),
  Tile = require('./Tile'),
  Animate = require('rc-animate'),
  utils = require('./TileUtils')
;

var sizeTypes = {
  column: 'clientHeight',
  row: 'clientWidth'
}

var TileWrapper = React.createClass({
  getInitialState: function(){
    return {
      sizes: this.getInitialSizes( this.props.layout.children.length ),
      updatingSizes: false,
      resizing: false,
      firstRendering: true,
      rect: false
    };
  },
  getInitialSizes( count ){
    var i = 0,
      sizes = []
    ;

    while( i++ < count ){
      sizes.push( 100 / count );
    }

    return sizes;
  },
  render: function(){
    var wrapperClass = [
        'tilewrapper',
        'tile' + this.props.layout.type,
        this.props.layout.id,
        this.state.updatingSizes ? 'tileResizing' : '',
        this.state.firstRendering ? 'tileentering' : 'tileentered',
      ].join(' '),
      dimensions = this.props.dimensions,
      style
    ;

    if( this.props.layout.type === 'column' ){
      style = {
        height: dimensions.height,
        width: this.isNumeric(dimensions.width) ? '100%' : dimensions.width
      }
    }
    else {
      style = {
        height: this.isNumeric(dimensions.height) ? dimensions.height : dimensions.height,
        width: '100%'
      }
    }

    return (
      <Animate ref="animate" component="div" className={ wrapperClass } style={ style } transitionName="tilewrapper">
        { this.renderChildren() }
        { this.renderSeparators() }
      </Animate>
    )
  },

  renderChildren: function(){
    var me = this,
      props = this.props,
      layout = props.layout,
      sizes = this.state.sizes,
      i = 0,
      placeholder = this.renderPlaceholder()
    ;

    var children = layout.children.map( function( child ){
      var Component = child.type === 'tile' ? Tile : TileWrapper,
        phrowfactor = placeholder && props.layout.type === 'row' ? .8 : 1,
        phcolfactor = placeholder && props.layout.type === 'column' ? .8 : 1,
        dimensions
      ;

      if( layout.type === 'column' ){
        dimensions = {
          height: (sizes[i++]*phcolfactor) + '%',
          width: props.dimensions.width
        }
      }
      else {
        dimensions = {
          height: (props.dimensions.height*phcolfactor),
          width: (sizes[i++]*phrowfactor) + '%'
        }
      }

      return <Component {...props}
        layout={child}
        key={ child.id }
        dimensions={ dimensions }
        wrapper={ layout }
        resizing={ me.state.resizing }
        onDragStart={ function(){} }
        onResizeStart={ me.props.onResizeStart.bind( me ) }
        onResizeEnd={ me.props.onResizeEnd.bind( me ) } />;
    });

    if( placeholder ){
      children.push( placeholder );
    }
    return children;
  },
  renderSeparators: function(){
    var separators = [],
      acc = 0,
      dim = this.props.layout.type === 'row' ? 'left' : 'top',
      className = 'separator separator-' + this.props.layout.type,
      style
    ;
    for( var i=0; i < this.state.sizes.length - 1; i++){
      style = {};
      acc += this.state.sizes[i];
      style[dim] = acc + '%';
      separators.push( <div key={ 's' + i } className={className} style={style} onMouseDown={ this.updateSizesStart.bind(this, i) } />)
    }
    return separators;
  },

  renderPlaceholder: function(){
    var moving = this.props.movingTile;
    if( !moving || !this.state.rect ){
      return;
    }
    var rect = this.state.rect,
      layout = this.props.layout,
      factor = rect.width / this.props.layout.children.length
    ;

    if( (layout.type === 'free' || layout.type === 'row') && moving.x >= rect.right - 200 && moving.y >= rect.top && moving.y <= rect.bottom ){
      return <div className="tileph rowph" key="rph"></div>;
    }
    else if( (layout.type === 'free' || layout.type === 'column') && moving.y >= rect.bottom - 200 && moving.x >= rect.left && moving.x <= rect.right ){
      return <div className="tileph columnph" key="cph"></div>;
    }
  },

  isNumeric: function( n ){
    return parseFloat(n) === n;
  },
  calculateSizes: function( separatorIndex, nextPercent ){
    var updatingSizes = this.state.updatingSizes,
      sizes = updatingSizes.sizes,
      nextSizes = new Array( sizes.length ),
      prevPercent = updatingSizes.initialPercent,
      remaining, i, factor, nextPercentage
    ;

    if( nextPercent < 0 || nextPercent > 100 ){
      return;
    }

    // We want to respect the minimum size, so let's check the
    // tiles that are shrinking
    if( prevPercent > nextPercent ){
      // Moving left/up
      remaining = nextPercent;
      for( i = 0; i<=separatorIndex; i++ ){
        factor = remaining / prevPercent;
        // Min needed to not to increase the cell with the minPercentage
        nextPercentage = Math.min(sizes[i], Math.max(sizes[i] * factor, updatingSizes.minPercentage));
        nextSizes[i] = nextPercentage;
        remaining -= nextPercentage;
        prevPercent -= nextPercentage;
      }

      factor = (100 - nextPercent + remaining) /*current remaining*/ - (100 - updatingSizes.initialPercent) /*previous remaning*/;
      for( i = separatorIndex + 1; i < sizes.length; i++ ){
        if( i == separatorIndex + 1){
          nextSizes[i] = sizes[i] + factor;
        }
        else {
          nextSizes[i] = sizes[i];
        }
      }
    }
    else {
      // Moving right/down
      remaining = 100 - nextPercent;
      prevPercent = 100 - prevPercent;
      for( i = sizes.length - 1; i>separatorIndex; i-- ){
        factor = remaining / prevPercent;

        // Min needed to not to increase the cell with the minPercentage
        nextPercentage = Math.min(sizes[i], Math.max(sizes[i] * factor, updatingSizes.minPercentage));
        nextSizes[i] = nextPercentage;
        remaining -= nextPercentage;
        prevPercent -= nextPercentage
      }

      factor = (nextPercent + remaining) /*current remaining*/ - updatingSizes.initialPercent /*previous remaining*/;
      for( i = separatorIndex; i >= 0; i-- ){
        if( i == separatorIndex){
          nextSizes[i] = sizes[i] + factor;
        }
        else {
          nextSizes[i] = sizes[i];
        }
      }
    }

    this.setState({sizes: nextSizes});
  },
  updateSizesStart: function( separatorIndex, e ){
    var me = this,
      type = this.props.layout.type,
      offset = type === 'row' ? 'left' : 'top',
      size = type === 'row' ? 'width' : 'height',
      dimension = type === 'row' ? 'clientX' : 'clientY',
      wrapper = ReactDom.findDOMNode(this).getBoundingClientRect(),
      updatingSizes = {
        wrapperOffset: wrapper[offset],
        wrapperSize: wrapper[size],
        separatorIndex: separatorIndex,
        minPercentage: this.minSizes[ this.props.layout.type ] / wrapper[size] * 100,
        sizes: this.state.sizes,
        startingPoint: e[dimension],
        initialPercent: 0
      },
      mm, mu
    ;

    for( var i = 0; i <= separatorIndex; i++ ) {
      updatingSizes.initialPercent += this.state.sizes[i];
    }

    this.props.onResizeStart();

    this.setState( {
      updatingSizes: updatingSizes,
      resizing: false
    });


    window.addEventListener( 'mousemove', mm = function( e ){
      if( me.ticking ) return;

      me.ticking = true;
      utils.requestAnimationFrame( () => {
        var sizes = me.state.updatingSizes;
        var nextPercent = (e[dimension] - sizes.wrapperOffset) / sizes.wrapperSize * 100;
        if( !me.state.resizing && Math.abs(sizes.startingPoint - e[dimension] ) > 5){
          me.setState({resizing: true});
          // console.log( 'Resizing', nextPercent );
          me.calculateSizes( separatorIndex, nextPercent );
        }
        else if( me.state.resizing ){
          // console.log( nextPercent );
          me.calculateSizes( separatorIndex, nextPercent );
        }
        me.ticking = false;
      });
    });
    window.addEventListener( 'mouseup', mu = function( e ){
      me.setState({updatingSizes: false, resizing: false});

      me.props.onResizeEnd();
      window.removeEventListener( 'mousemove', mm );
      window.removeEventListener( 'mouseup', mu );
    });
  },

  componentWillReceiveProps: function( nextProps ){
    var childrenCount = nextProps.layout.children.length;
    if( childrenCount !== this.props.layout.children.length ){
      this.setState({ sizes: this.getInitialSizes(childrenCount), entering: true });
    }

  },
  componentDidMount: function(){
    var me = this;
    setTimeout( function(){
      me.setState({firstRendering: false});
    });
  },
  componentDidUpdate: function( prevProps ){
    if( prevProps.movingTile && !this.props.movingTile ){
      this.setState({rect:false});
    }
    else if( !prevProps.movingTile && this.props.movingTile ){
      this.setState({rect: ReactDom.findDOMNode(this).getBoundingClientRect()});
    }
  }
});

module.exports = TileWrapper;
