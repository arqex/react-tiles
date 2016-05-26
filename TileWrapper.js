var React = require('react'),
  ReactDom = require('react-dom'),
  Tile = require('./Tile'),
  Animate = require('rc-animate')
;

var minSizes = {
  column: 200, // For column wrappers this is the minimun height of a row
  row: 320 // For row wrappers this is the minumum width of a column
};

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
      firstRendering: true
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
      i = 0
    ;


    return layout.children.map( function( child ){
      var Component = child.type === 'tile' ? Tile : TileWrapper,
        dimensions
      ;

      if( layout.type === 'column' ){
        dimensions = {
          height: sizes[i++] + '%',
          width: props.dimensions.width
        }
      }
      else {
        dimensions = {
          height: props.dimensions.height,
          width: sizes[i++] + '%'
        }
      }

      console.log( child );
      return <Component {...props}
        layout={child}
        key={ child.id }
        dimensions={ dimensions }
        wrapper={ layout }
        onResizeStart={ me.props.onResizeStart.bind( me ) }
        onResizeEnd={ me.props.onResizeEnd.bind( me ) } />;
    });
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
        minPercentage: minSizes[ this.props.layout.type ] / wrapper[size] * 100,
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
    console.log( updatingSizes );

    window.addEventListener( 'mousemove', mm = function( e ){
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
    });
    window.addEventListener( 'mouseup', mu = function( e ){
      me.setState({updatingSizes: false, resizing: false});
      console.log( me.state );
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
  }
});

module.exports = TileWrapper;
