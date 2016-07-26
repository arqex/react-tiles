(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("qs"), require("object-assign"), require("assert"));
	else if(typeof define === 'function' && define.amd)
		define(["qs", "object-assign", "assert"], factory);
	else if(typeof exports === 'object')
		exports["react-tiles"] = factory(require("qs"), require("object-assign"), require("assert"));
	else
		root["react-tiles"] = factory(root["qs"], root["object-assign"], root["assert"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var testsContext = __webpack_require__(1);

	var runnable = testsContext.keys();

	runnable.forEach(testsContext);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./url.test.js": 2
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UrlParser = __webpack_require__(3);
	var QueryBuilder = __webpack_require__(7);
	var assert = __webpack_require__(8);

	global.window = {};

	console.log(global);

	describe('queryBuilder tests', function () {
	  it('Should create a free layout for the root route', function () {
	    var route = '/',
	        b = new QueryBuilder(route),
	        layout = b.layout;

	    console.log(layout);

	    assert.equal(layout.type, 'free');
	    assert.equal(layout.route, route);
	    assert.equal(layout.children.length, 1);
	    assert.equal(layout.children[0].children.length, 1);
	    assert.equal(layout.children[0].children[0].route, route);
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var qs = __webpack_require__(4),
	    utils = __webpack_require__(5),
	    assign = __webpack_require__(6);

	var UrlParser = {
	  stringify: function stringify(layout) {
	    if (layout.type === 'tile') {
	      return layout.id + ':' + encodeURIComponent(encodeURIComponent(layout.route));
	    }

	    var me = this,
	        children = layout.children.map(function (child) {
	      return me.stringify(child);
	    }),
	        query,
	        str;

	    if (layout.floating) {
	      // we are in the root layout node
	      query = assign({}, layout.query);

	      if (layout.type === 'free') {
	        query.tw = [layout.id, layout.children[0].id, layout.children[0].children[0].id].join(':');
	        delete query.t;
	      } else {
	        str = layout.type === 'row' ? 'r' : 'c';
	        query.t = str + ':' + layout.id + '{' + children.join(',') + '}';
	      }

	      if (Object.keys(layout.floating).length) {
	        query.ft = this.stringifyFloating(layout);
	      } else {
	        delete query.ft;
	      }

	      return layout.pathname + '?' + qs.stringify(query, { encoder: qsEncoder });
	    } else {
	      str = layout.type === 'row' ? 'r' : 'c';
	      return str + ':' + layout.id + '{' + children.join(',') + '}';
	    }
	  },

	  parse: function parse(route) {
	    var parts = route.split('?'),
	        pathname = parts[0],
	        query = parts[1] && qs.parse(parts[1]) || {},
	        layout;

	    if (query.t) {
	      // We have more than one tile
	      layout = this.parseQuery(query.t);
	    } else {
	      // we only have one tile
	      var layoutId = 'm',
	          // after main
	      wrapperId = 'mc',
	          // after main child
	      tileId = 'mct',
	          tileQuery = assign({}, query),
	          tileRoute = pathname,
	          queryString,
	          ids;

	      // the tw parameter has the ids
	      if (query.tw) {
	        ids = query.tw.split(':');
	        if (ids[2].indexOf('#') !== -1) {
	          // There is a fragment in the url
	          ids[2] = ids[2].split('#')[0];
	        }
	        if (ids.length == 3) {
	          layoutId = ids[0];
	          wrapperId = ids[1];
	          tileId = ids[2];
	        }
	      }

	      // delete the tw & ft parameters if any
	      delete tileQuery.tw;
	      delete tileQuery.ft;

	      queryString = qs.stringify(tileQuery, { encoder: qsEncoder });
	      if (queryString) {
	        tileRoute += '?' + queryString;
	      }

	      layout = {
	        type: 'free',
	        id: layoutId,
	        children: [{
	          type: 'freeChild',
	          id: wrapperId,
	          children: [{
	            type: 'tile',
	            route: tileRoute,
	            pathname: pathname,
	            query: tileQuery,
	            id: tileId
	          }]
	        }]
	      };
	    }

	    // floating tiles are in the format {id:route}
	    layout.floating = this.parseFloating(query.ft);

	    layout.route = route;
	    layout.pathname = parts[0];
	    layout.query = query;

	    return layout;
	  },

	  stringifyFloating: function stringifyFloating(layout) {
	    if (!layout.floating) {
	      return false;
	    }
	    var floating = [];
	    Object.keys(layout.floating).forEach(function (tid) {
	      floating.push(tid + ':' + encodeURIComponent(encodeURIComponent(layout.floating[tid].route)));
	    });
	    return floating.join(',');
	  },

	  parseQuery: function parseQuery(tileQuery) {
	    var tokens = this.tokenize(tileQuery),
	        layout = this.parseWrapper(tokens);

	    return layout;
	  },

	  tokenize: function tokenize(tileQuery) {
	    var tokens = [],
	        buffer = '';

	    for (var i = 0; i < tileQuery.length; i++) {
	      var current = tileQuery[i];

	      if (current == '{') {
	        if (buffer.length) {
	          tokens.push({ type: 'wrapperId', value: buffer });
	          buffer = '';
	        }
	        tokens.push({ type: 'wrapperOpen', value: current });
	      } else if (current == '}') {
	        if (buffer.length) {
	          tokens.push({ type: 'wrapperId', value: buffer });
	          buffer = '';
	        }
	        tokens.push({ type: 'wrapperClose', value: current });
	      } else if (current == ',') {
	        if (buffer.length) {
	          tokens.push({ type: 'wrapperId', value: buffer });
	          buffer = '';
	        }
	        tokens.push({ type: 'separator', value: current });
	      } else {
	        buffer += current;
	      }
	    }

	    if (buffer.length) {
	      throw this.getError('Unexpected ' + buffer);
	    }

	    return tokens;
	  },

	  parseWrapper: function parseWrapper(tokens) {
	    var token = tokens.shift();

	    if (token.type !== 'wrapperId') {
	      throw this.getError('Unexpected ' + token.value);
	    }

	    var layout = this.parseId(token);
	    if (layout.type === 'tile') {
	      return layout;
	    }

	    token = tokens.shift();
	    if (token.type !== 'wrapperOpen') {
	      throw this.getError('Unexpected ' + token.value + ' after a column or row declaration.');
	    }
	    layout.children = this.parseChildren(tokens);

	    return layout;
	  },

	  parseId: function parseId(token) {
	    var parts = token.value.split(':');

	    if (parts.length !== 2) {
	      throw this.getError('Id ' + token.value + ' not valid.');
	    }

	    var layout = {
	      id: parts[1]
	    };

	    if (parts[0] === 'c') {
	      layout.type = 'column';
	    } else if (parts[0] === 'r') {
	      layout.type = 'row';
	    } else {
	      layout = {
	        type: 'tile',
	        id: parts[0],
	        route: decodeURIComponent(parts[1])
	      };
	    }

	    utils.updateTid(layout.id);

	    return layout;
	  },
	  parseChildren: function parseChildren(tokens) {
	    var children = [],
	        token;
	    while (tokens.length) {
	      if (tokens[0].type !== 'wrapperId') {
	        throw this.getError('Unexpected ' + tokes[0].value + ' after a column or row declaration.');
	      }
	      children.push(this.parseWrapper(tokens));
	      token = tokens.shift();
	      if (token.type === 'wrapperClose') {
	        return children;
	      } else if (token.type !== 'separator') {
	        throw this.getError('Unexpected ' + token.value);
	      }
	    }

	    // If we reach here, we failed to close a parenthesis.
	    throw this.getError('Unexpected End');
	  },


	  getError: function getError(msg) {
	    return new Error("Tile query parse error: " + msg);
	  },

	  parseFloating: function parseFloating(param) {
	    if (!param) return {};
	    var tiles = param.split(','),
	        floating = {},
	        parts,
	        route;

	    for (var i = 0; i < tiles.length; i++) {
	      parts = tiles[i].split(':');
	      if (parts.length == 2) {
	        route = decodeURIComponent(parts[1]);
	        floating[parts[0]] = utils.getRouteParts(route);
	      }
	    }

	    return floating;
	  }
	};

	// We don't need qs to encode our paramters, since they are already encoded
	var qsEncoder = function qsEncoder(c) {
	  return c;
	};

	module.exports = UrlParser;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("qs");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var qs = __webpack_require__(4);

	var idCounter = 0;

	var tileUtils = {
	  tid: function tid(prefix) {
	    return (prefix || '') + idCounter++;
	  },
	  updateTid: function updateTid(tid) {
	    var validId = tid.match(/^[rct](\d+)$/);
	    if (validId) {
	      validId = parseInt(validId[1]);
	      if (validId >= idCounter) {
	        idCounter = validId + 1;
	      }
	    }
	  },
	  getRouteParts: function getRouteParts(route) {
	    var parts = route.split('?');
	    return {
	      pathname: parts[0],
	      query: qs.parse(parts[1] || ''),
	      route: route
	    };
	  }
	};

	module.exports = tileUtils;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("object-assign");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UrlParser = __webpack_require__(3),
	    assign = __webpack_require__(6),
	    utils = __webpack_require__(5),
	    qs = __webpack_require__(4);

	var tileCounter = 0;

	var TileQueryBuilder = function TileQueryBuilder(route) {
	  this.setRoute(route);
	};

	assign(TileQueryBuilder.prototype, {
	  setRoute: function setRoute(route) {
	    this.layout = UrlParser.parse(route);
	  },

	  setLayout: function setLayout(layout) {
	    this.layout = layout;
	  },

	  swapType: function swapType(update) {
	    if (this.layout.type === 'free') {
	      return this.layout.query;
	    }

	    var type = this.layout.type === 'row' ? 'column' : 'row',
	        nextLayout = toLayout(this.layout, type);

	    this.returnNext(nextLayout, update);
	  },

	  remove: function remove(id, update, returnLayout) {
	    if (!id) {
	      this.throwError("`remove` needs a tile id.");
	    }

	    var nextLayout = cloneLayout(this.layout),
	        i = nextLayout.children.length,
	        tileIndex,
	        wrapper;

	    if (nextLayout.floating[id]) {
	      nextLayout.floating = assign({}, nextLayout.floating);
	      delete nextLayout.floating[id];
	    } else {
	      while (i-- > 0) {
	        tileIndex = findIndex(nextLayout.children[i], id);
	        if (tileIndex !== -1) {
	          if (nextLayout.children[i].children.length === 1) {

	            // If it was the only child, remove the wrapper
	            nextLayout.children.splice(i, 1);
	          } else {
	            wrapper = cloneLayout(nextLayout.children[i]);
	            wrapper.children.splice(tileIndex, 1);
	            nextLayout.children[i] = wrapper;
	          }
	          if (nextLayout.children.length === 1) {
	            nextLayout.children[0] = cloneLayout(nextLayout.children[0]);
	            if (nextLayout.children[0].children.length === 1) {
	              nextLayout.type = 'free';
	              nextLayout.children[0].type = 'freeChild';
	            }
	          }

	          return this.returnNext(nextLayout, update, returnLayout);
	        }
	      }
	    }

	    return this.returnNext(nextLayout, update, returnLayout);
	  },

	  resetWrapper: function resetWrapper(id, tile, update, returnLayout) {
	    if (!id || !tile || !tile.route) {
	      this.throwError("`resetWrapper` needs a wrapper id and a new tile data with a route.");
	    }

	    var found = find(this.layout, id);

	    if (!found) {
	      return console.log("Wrapper " + id + " not found to reset.");
	    }

	    found[0].children = [createTile(tile)];

	    return this.returnNext(found[1], update, returnLayout);
	  },

	  handleErrors: function handleErrors(type, payload) {
	    if (!payload) {
	      this.throwError('`' + type + '` called without parameters.');
	    }
	    if (type === 'setTile') {
	      if (!payload.route) {
	        this.throwError('`setTile` needs a route.');
	      }
	    }
	  },

	  throwError: function throwError(reason) {
	    throw new Error('QueryBuilder ERROR: ' + reason);
	  },

	  setTile: function setTile(ops, returnLayout) {
	    this.handleErrors('setTile', ops);
	    var nextLayout = cloneLayout(this.layout),
	        children = nextLayout.children,
	        routeParts = utils.getRouteParts(ops.route);

	    // If the tile id exists open the route there, ignore anything else
	    // Look for it in the floating tiles
	    if (nextLayout.floating[ops.tile]) {
	      nextLayout.floating = assign({}, nextLayout.floating);
	      nextLayout.floating[ops.tile] = ops.route;
	      return this.returnNext(nextLayout, ops.update, returnLayout);
	    }
	    // And in the not floating ones
	    if (ops.tile) {
	      var i = children.length,
	          j;

	      while (i-- > 0) {
	        j = children[i].children.length;
	        while (j-- > 0) {
	          if (children[i].children[j].id === ops.tile) {
	            children[i] = cloneLayout(children[i]);
	            children[i].children[j] = cloneLayout(children[i].children[j]);
	            assign(children[i].children[j], routeParts);

	            // Return here
	            return this.returnNext(nextLayout, ops.update, returnLayout);
	          }
	        }
	      }
	    }

	    // Check if the tile is floating
	    if (ops.wrapper === 'floating') {
	      nextLayout.floating = assign({}, nextLayout.floating);
	      nextLayout.floating[ops.tile] = routeParts;
	      return this.returnNext(nextLayout, ops.update, returnLayout);
	    }

	    var position = ops.wrapperPosition !== undefined ? ops.wrapperPosition : nextLayout.children.length,
	        wrapper = { children: [] };

	    // If the layout is free we need to create a new wrapper for the tile
	    if (nextLayout.type === 'free') {
	      // the default layout is a column one
	      nextLayout.type = ops.type === 'row' ? 'column' : 'row';
	      wrapper.type = nextLayout.type === 'row' ? 'column' : 'row';
	      children[0] = cloneLayout(children[0]);
	      children[0].type = wrapper.type;
	      wrapper.id = ops.wrapper && ops.wrapper !== children[0].id ? ops.wrapper : utils.tid(wrapper.type[0]);

	      // Add the wrapper to the layout
	      children.splice(position, 0, wrapper);
	    } else {
	      // If the wrapper is already there use it
	      var wrapperIndex = findIndex(nextLayout, ops.wrapper);
	      if (wrapperIndex !== -1) {
	        wrapper = cloneLayout(children[wrapperIndex]);

	        // Add the wrapper to the layout
	        children[wrapperIndex] = wrapper;
	      } else {
	        wrapper.type = children[0].type;
	        wrapper.id = ops.wrapper || utils.tid(wrapper.type[0]);

	        // Add the wrapper to the layout
	        children.splice(position, 0, wrapper);
	      }
	    }

	    // Add the tile to the wrapper
	    wrapper.children.splice(ops.position || wrapper.children.length, 0, createTile(ops));

	    return this.returnNext(nextLayout, ops.update, returnLayout);
	  },

	  getWrapperInfo: function getWrapperInfo(id) {
	    var index = findIndex(this.layout, id);
	    return index !== -1 && cloneLayout(this.layout.children[index]);
	  },

	  setFloating: function setFloating(id, update, returnLayout) {

	    // Needs to get the layout from remove
	    var i = this.layout.children.length,
	        found = false,
	        tileIndex;

	    if (this.layout.floating[id]) {
	      return this.returnNext(cloneLayout(this.layout), update, returnLayout);
	    }

	    while (i-- > 0 && !found) {
	      tileIndex = findIndex(nextLayout.children[i], id);
	      if (tileIndex !== -1) {
	        found = nextLayout.children[i].children[tileIndex];
	      }
	    }

	    if (!found) {
	      this.throwError("`setFloating` tile " + id + " not found.");
	    }

	    var nextLayout = this.remove(id, false, true);
	    nextLayout.floating[id] = found.route;
	    return this.returnNext(nextLayout, update, returnLayout);
	  },

	  returnNext: function returnNext(layout, update, returnLayout) {
	    if (update) {
	      this.layout = layout;
	    }

	    return returnLayout ? layout : UrlParser.stringify(layout);
	  }
	});

	module.exports = TileQueryBuilder;

	/** HELPERS **/
	var toLayout = function toLayout(currentLayout, toType, ops) {
	  var currentType = currentLayout.type,
	      otherType = currentType === 'row' ? 'column' : 'row',
	      q,
	      layout;

	  if (currentType === toType) {
	    // Same type, return it unmodified
	    return currentLayout;
	  } else if (otherType === toType) {
	    // Swap types
	    layout = assign({}, currentLayout, { type: toType, children: [] });
	    currentLayout.children.forEach(function (child) {
	      layout.children.push(assign({}, child, { type: otherType }));
	    });
	  } else {
	    // Free type wrapper, switch it to the desired type and add a otherType child with the tile
	    layout = assign({}, currentLayout, { type: toType, id: ops.columnId || utils.tid(toType[0]), children: [{ type: otherType, id: ops.rowId || utils.tid(otherType[0]), children: currentLayout.children }] });
	  }

	  return layout;
	};

	var cloneLayout = function cloneLayout(l) {
	  var clone = assign({}, l);
	  clone.children = l.children && l.children.slice();
	  return clone;
	};

	var findIndex = function findIndex(layout, id) {
	  if (!id) {
	    return -1;
	  }

	  var i = layout.children.length;
	  while (i-- > 0) {
	    if (layout.children[i].id === id) {
	      return i;
	    }
	  }

	  return -1;
	};

	var createTile = function createTile(ops) {
	  var tile = utils.getRouteParts(ops.route);
	  tile.id = ops.tile || utils.tid('t');
	  tile.type = 'tile';
	  return tile;
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("assert");

/***/ }
/******/ ])
});
;