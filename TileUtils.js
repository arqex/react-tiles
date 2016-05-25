var idCounter = 0;

module.exports = {
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
