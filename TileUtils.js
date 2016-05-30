var idCounter = 0;

var tileUtils = {
  tid: function( prefix ){
    return (prefix || '') + (idCounter++);
  },
  updateTid: function( tid ){
    var validId = tid.match(/^[rct](\d+)$/);
    if( validId ){
      validId = parseInt( validId[1] );
      if( validId >= idCounter ){
        idCounter = validId + 1;
      }
    }
  }
}



// Adds requestAnimationFrame to the utils
var lastTime = 0;
var vendors = ['webkit', 'moz'];
if( window.requestAnimationFrame ){
  tileUtils.requestAnimationFrame = window.requestAnimationFrame;
  tileUtils.cancelAnimationFrame = window.cancelAnimationFrame;
}
else {
  for(var x = 0; x < vendors.length && !tileUtils.requestAnimationFrame; ++x) {
    tileUtils.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    tileUtils.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
      window[vendors[x]+'CancelRequestAnimationFrame']
    ;
  }
}

if (!tileUtils.requestAnimationFrame){
  tileUtils.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); },
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}
else {
  tileUtils.requestAnimationFrame = tileUtils.requestAnimationFrame.bind( window );
}

if (!tileUtils.cancelAnimationFrame){
  tileUtils.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}
else {
  tileUtils.cancelAnimationFrame = tileUtils.cancelAnimationFrame.bind( window );
}

module.exports = tileUtils;
