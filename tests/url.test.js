var UrlParser = require('../src/utils/UrlParser');
var QueryBuilder = require('../src/utils/QueryBuilder');
var assert = require('assert');

global.window = {};

console.log( global );

describe('queryBuilder tests', function(){
  it('Should create a free layout for the root route', function(){
    var route = '/',
      b = new QueryBuilder( route ),
      layout = b.layout
    ;

    assert.equal( layout.type, 'free' );
    assert.equal( layout.route, route );
    assert.equal( layout.children.length, 1 );
    assert.equal( layout.children[0].children.length, 1);
    assert.equal( layout.children[0].children[0].route, route);
  });
});
