export default {
  /**
   * Updates an array of percentages (sizes) by moving a separator index to nextPercent
   * position, respecting the min size given by minPercent.
   */
  updateSizes( sizes, separator, nextPercent, minPercent ){
    // None or sizes to the left or right can't be smaller than min percent
    if( nextPercent < separator * minPercent || (100-nextPercent) < (sizes.length - separator) * minPercent ){
      return false;
    }

    // Calculate where was the separator
    var prevPercent = sizes[0],
      i = 1
    ;
    while( i < separator ){
      prevPercent += sizes[i++];
    }

    // Calculate the change of sizes to left and right
    var leftChange = nextPercent - prevPercent,
      rightChange = -leftChange
    ;

    // Try to apply the change to the closest size on the right
    i = separator;
    while( rightChange ){
      if( sizes[i] + rightChange > minPercent ){
        sizes[i] += rightChange;
        rightChange = 0;
      }
      else {
        rightChange += sizes[i] - minPercent;
        sizes[i] = minPercent;
      }
      i++;
    }

    // Try to apply the change to the closest size on the left
    i = separator - 1;
    while( leftChange ){
      if( sizes[i] + leftChange > minPercent ){
        sizes[i] += leftChange;
        leftChange = 0;
      }
      else {
        leftChange += sizes[i] - minPercent;
        sizes[i] = minPercent;
      }
      i--;
    }

    return true;
  },

  updateLayoutSizes( prevLayout, nextLayout, sizes, el, middlePoint ){
    var prevElements = {};
    var total = 0;
    var nextSizes = {
      wrappers: {},
      tiles: {}
    };

    var arrays = [{type:'wrappers', ids: nextLayout.wrapperOrder}];
    nextLayout.wrapperOrder.forEach( wid => {
      arrays.push({type: 'tiles', ids: nextLayout.wrappers[wid]});
    });

    arrays.forEach( arr => {
      var minSize = 100 / (arr.ids.length - 1 || 1),
        sum = 0, factor
      ;

      arr.ids.forEach( id => {
        var w = sizes[arr.type][id] && sizes[arr.type][id].size ? sizes[arr.type][id] : {size: minSize};
        nextSizes[arr.type][id] = w;
        sum += w.size;
      });

      factor = 100 / (sum || 1);
      sum = 0;
      arr.ids.forEach( id => {
        var size = nextSizes[arr.type][id].size * factor;
        nextSizes[arr.type][id] = { size: size, from: sum };
        sum += size;
      });
    });

    var maxWidth = el.clientWidth,
      maxHeight = el.clientHeight
    ;

    nextLayout.floating.forEach( (tid, i) => {
      var tile = prevLayout.tiles[tid],
        tileSize = {
          width: maxWidth / 2, height: maxHeight /2,
          left: 150, top: 150
        }
      ;

      if( tile ){
        if( tile.wrapper ){
          // Undocking a tile
          if( middlePoint ){
            tileSize.left = middlePoint.left - (tileSize.width / 2 );
            tileSize.top = middlePoint.top - 10;
          }
          else if( sizes.wrappers[ tile.wrapper ] ){
            if( nextLayout.type === 'column' ){
              tileSize.left = sizes.wrappers[ tile.wrapper ].from / 100 * maxWidth;
              tileSize.top = sizes.tiles[ tid ].from / 100 * maxHeight;
            }
            else {
              tileSize.top = sizes.wrappers[ tile.wrapper ].from / 100 * maxWidth;
              tileSize.left = sizes.tiles[ tid ].from / 100 * maxHeight;
            }
          }
        }
        else {
          tileSize = sizes.tiles[tid];
        }
      }

      nextSizes.tiles[ tid ] = tileSize;
    });

    return nextSizes;
  }
}
