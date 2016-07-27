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

  it('Should create a free layout for any uncoded route', function(){
    var route = '/myRoute?foo=bar',
      b = new QueryBuilder( route ),
      layout = b.layout,
      tile = layout.children[0].children[0]
    ;

    assert.equal( layout.type, 'free' );
    assert.equal( layout.route, route );
    assert.equal( layout.pathname, route.split('?')[0] );
    assert.equal( layout.query.foo, 'bar');
    assert.equal( layout.children.length, 1 );
    assert.equal( layout.children[0].children.length, 1);
    assert.equal( tile.route, route);
    assert.equal( tile.pathname, route.split('?')[0] );
    assert.equal( tile.query.foo, 'bar' );
  })

  it('Should recognize the tw paramter for free layouts', function(){
    var route = '/myRoute?tw=one:two:three',
      b = new QueryBuilder( route ),
      layout = b.layout,
      tile = layout.children[0].children[0]
    ;

    assert.equal( layout.id, 'one' );
    assert.equal( layout.children[0].id, 'two');
    assert.equal( tile.id, 'three' );
  });

  it('Should parse row layout', function(){
    var route = '/myRoute?t=c:root{r:row1{t1:/tileRoute},r:row2{t2:/tileRoute2}}',
      b = new QueryBuilder( route ),
      layout = b.layout,
      tile1 = layout.children[0].children[0],
      tile2 = layout.children[1].children[0]
    ;

    assert.equal( layout.id, 'root' );
    assert.equal( layout.type, 'column');
    assert.equal( layout.children.length, 2 );
    assert.equal( layout.children[0].type, 'row' );
    assert.equal( layout.children[0].id, 'row1' );
    assert.equal( layout.children[1].type, 'row' );
    assert.equal( layout.children[1].id, 'row2' );
    assert.equal( tile1.id, 't1');
    assert.equal( tile1.route, '/tileRoute');
    assert.equal( tile2.id, 't2');
    assert.equal( tile2.route, '/tileRoute2');
  });

  it('Should parse column layout', function(){
    var route = '/myRoute?t=r:root{c:c1{t1:/tileRoute},c:c2{t2:/tileRoute2}}',
      b = new QueryBuilder( route ),
      layout = b.layout,
      tile1 = layout.children[0].children[0],
      tile2 = layout.children[1].children[0]
    ;

    assert.equal( layout.id, 'root' );
    assert.equal( layout.type, 'row');
    assert.equal( layout.children.length, 2 );
    assert.equal( layout.children[0].type, 'column' );
    assert.equal( layout.children[0].id, 'c1' );
    assert.equal( layout.children[1].type, 'column' );
    assert.equal( layout.children[1].id, 'c2' );
    assert.equal( tile1.id, 't1');
    assert.equal( tile1.route, '/tileRoute');
    assert.equal( tile2.id, 't2');
    assert.equal( tile2.route, '/tileRoute2');
  });

  it('Should parse wrappers with more than one tile', function(){
    var route = '/myRoute?t=r:root{c:c1{t1:/tileRoute,t3:/tileRoute3},c:c2{t2:/tileRoute2,t4:/tileRoute4,t5:/tileRoute5}}',
      b = new QueryBuilder( route ),
      layout = b.layout,
      c1 = layout.children[0],
      c2 = layout.children[1]
    ;

    assert.equal( c1.children.length, 2 );
    assert.equal( c2.children.length, 3 );
    assert.equal( c1.children[0].id, 't1' );
    assert.equal( c1.children[1].id, 't3' );
    assert.equal( c2.children[0].id, 't2' );
    assert.equal( c2.children[1].id, 't4' );
    assert.equal( c2.children[2].id, 't5' );
    assert.equal( c1.children[0].route, '/tileRoute' );
    assert.equal( c1.children[1].route, '/tileRoute3' );
    assert.equal( c2.children[0].route, '/tileRoute2' );
    assert.equal( c2.children[1].route, '/tileRoute4' );
    assert.equal( c2.children[2].route, '/tileRoute5' );
  });

  it("Should parse tile queries", function(){
    var route = '/myRoute?t=r:root{c:c1{t1:' + encodeURIComponent('/tileRoute?foo=bar&amy=bob') +
      '},c:c2{t2:' + encodeURIComponent('/tileRoute2?chris=dave') + '}}',
      b = new QueryBuilder( route ),
      layout = b.layout,
      tile1 = layout.children[0].children[0],
      tile2 = layout.children[1].children[0]
    ;

    assert.equal( tile1.route, '/tileRoute?foo=bar&amy=bob');
    assert.equal( tile1.pathname, '/tileRoute' );
    assert.equal( tile1.query.foo, 'bar' );
    assert.equal( tile1.query.amy, 'bob' );
    assert.equal( tile2.route, '/tileRoute2?chris=dave');
    assert.equal( tile2.pathname, '/tileRoute2' );
    assert.equal( tile2.query.chris, 'dave' );
  });
});
