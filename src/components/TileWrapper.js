var React = require('react'),
  ReactDOM = require('react-dom'),
  Tile = require('./Tile'),
  Animate = require('rc-animate').default,
  utils = require('../utils/TileUtils')
;

var sizeTypes = {
  column: 'clientHeight',
  row: 'clientWidth'
}

class TileWrapper extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      sizes: this.getInitialSizes( props.layout.children.length ),
      updatingSizes: false,
      resizing: false,
      firstRendering: true,
      rect: false
    };
  }

  getInitialSizes( count ){
    var i = 0,
      sizes = []
    ;

    while( i++ < count ){
      sizes.push( 100 / count );
    }

    return sizes;
  }

  render(){
    var wrapperClass = [
        'tilewrapper',
        'tile' + this.props.layout.type,
        this.props.layout.id,
        this.state.updatingSizes ? 'tileResizing' : '',
        this.state.firstRendering ? 'tileentering' : 'tileentered',
      ].join(' '),
      dimensions = this.props.dimensions,
      placeholder = this.getPlaceholder( this.props.movingTile ),
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

    if( placeholder ){
      wrapperClass += ' phwrapper';
    }

    return (
      <Animate ref="animate" component="div" className={ wrapperClass } style={ style } transitionName="tilewrapper">
        { this.renderChildren( placeholder ) }
        { this.renderSeparators() }
      </Animate>
    )
  }

  renderChildren( placeholder ){
    var me = this,
      props = this.props,
      layout = props.layout,
      sizes = this.state.sizes,
      i = 0,
      placeholder = this.getPlaceholder( this.props.movingTile ),
      factor = {
        column: 1,
        row: 1
      }
    ;

    if( placeholder ){
      factor[ placeholder ] = .8;
    }

    var children = layout.children.map( function( child ){
      var Component = child.type === 'tile' ? Tile : TileWrapper,
        dimensions
      ;

      if( layout.type === 'column' ){
        dimensions = {
          height: (sizes[i++]*factor.row) + '%',
          width: props.dimensions.width
        }
      }
      else if( layout.type === 'row' ){
        dimensions = {
          height: props.dimensions.height,
          width: (sizes[i++]*factor.column) + '%'
        }
      }
      else {
        dimensions = {
          height: (100 * factor.row) + '%',
          width: (100 * factor.column) + '%'
        }
      }

      return <Component {...props}
        layout={child}
        key={ child.id }
        ref={ child.id }
        dimensions={ dimensions }
        wrapper={ layout }
        resizing={ me.state.resizing }
        movingTile={ me.props.movingTile }
        onMoveStart={ me.props.onMoveStart }
        onResizeStart={ me.props.onResizeStart }
        onResizeEnd={ me.props.onResizeEnd } />;
    });

    if( placeholder ){
      children.push( this.renderPlaceholder( placeholder ) );
    }

    return children;
  }

  renderSeparators(){
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
  }

  renderPlaceholder( type ){
    if( type === 'column'){
      return <div className="tileph rowph" key="rph"></div>;
    }
    else {
      return <div className="tileph columnph" key="cph"></div>;
    }
  }

  getPlaceholder( moving ){
    if( !moving || !this.state.rect ){
      return;
    }
    var layout = this.props.layout,
      rect = this.state.rect,
      colFactor = rect.height / (layout.children.length + 1 ),
      rowFactor = rect.width / (layout.children.length + 1 )
    ;



    if( (layout.type === 'free' || layout.type === 'row') && moving.x >= rect.right - 200 && moving.y >= rect.top && moving.y <= rect.bottom && rowFactor > this.props.minSizes.row ){
      return 'column';
    }
    else if( (layout.type === 'free' || layout.type === 'column') && moving.y >= rect.bottom - 200 && moving.x >= rect.left && moving.x <= rect.right && colFactor > this.props.minSizes.column ){
      return 'row';
    }
  }

  isNumeric( n ){
    return parseFloat(n) === n;
  }

  calculateSizes( separatorIndex, nextPercent ){
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
  }

  updateSizesStart( separatorIndex, e ){
    var me = this,
      type = this.props.layout.type,
      offset = type === 'row' ? 'left' : 'top',
      size = type === 'row' ? 'width' : 'height',
      dimension = type === 'row' ? 'clientX' : 'clientY',
      wrapper = ReactDOM.findDOMNode(this).getBoundingClientRect(),
      updatingSizes = {
        wrapperOffset: wrapper[offset],
        wrapperSize: wrapper[size],
        separatorIndex: separatorIndex,
        minPercentage: this.props.minSizes[ this.props.layout.type ] / wrapper[size] * 100,
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
  }

  componentWillReceiveProps( nextProps ){
    var childrenCount = nextProps.layout.children.length;
    if( childrenCount !== this.props.layout.children.length ){
      this.setState({ sizes: this.getInitialSizes(childrenCount), entering: true });
    }
  }

  componentDidMount(){
    var me = this;
    setTimeout( function(){
      me.setState({firstRendering: false});
    });
  }

  componentDidUpdate( prevProps ){
    if( prevProps.movingTile && !this.props.movingTile ){
      this.setState({rect:false});
    }
    else if( !prevProps.movingTile && this.props.movingTile ){
      this.setState({rect: ReactDOM.findDOMNode(this).getBoundingClientRect()});
    }
  }

  receiveTile( position ){
    var type;

    if( type = this.getPlaceholder( position ) ){
      return {
        id: this.props.layout.id,
        type: type,
        isNew: true
      };
    };

    var children = this.props.layout.children,
      i = children.length,
      id
    ;

    while( i-- > 0 ){
      if( children.type !== 'tile' ){
        if( type = this.refs[ children[i].id ].getPlaceholder( position ) ){
          return {
            id: children[i].id,
            type: children[i].type
          };
        }
      }
    }
  }
};

module.exports = TileWrapper;
