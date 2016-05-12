var idCounter = 0;

module.exports = {
  tid: function( prefix ){
    return (prefix || '') + (idCounter++);
  }
}
