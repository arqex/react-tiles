/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./react-tiles.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Separator.js":
/*!**********************!*\
  !*** ./Separator.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Separator = function (_Component) {
  _inherits(Separator, _Component);

  function Separator() {
    _classCallCheck(this, Separator);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.omd = _this.onMouseDown.bind(_this);
    _this.state = {
      mounting: true
    };
    return _this;
  }

  Separator.prototype.render = function render() {
    var cn = 'rtseparator rts' + this.props.type;
    if (this.props.withPlaceholder) {
      cn += ' rttph';
    }
    if (this.state.mounting) {
      cn += ' rtmounting';
    }
    return _react2.default.createElement('div', { className: cn,
      style: this.props.style,
      onMouseDown: this.omd });
  };

  Separator.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    setTimeout(function () {
      _this2.setState({ mounting: false });
    }, 150);
  };

  Separator.prototype.onMouseDown = function onMouseDown(e) {
    var _this3 = this;

    var dimension = this.props.type === 'v' ? 'pageX' : 'pageY';
    var tile = this.props.tile;
    var mm, _mu, ticking, ev;

    this.props.onMoveStart(this.props.wrapper, tile, e[dimension]);
    window.addEventListener('mousemove', mm = function mm(e) {
      ev = e;
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        _this3.props.onMove(tile, ev[dimension]);
        ticking = false;
      });
    });

    window.addEventListener('mouseup', _mu = function mu(e) {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', _mu);
      _this3.props.onMoveEnd(tile, e[dimension]);
    });
  };

  return Separator;
}(_react.Component);

exports.default = Separator;

/***/ }),

/***/ "./Tile.js":
/*!*****************!*\
  !*** ./Tile.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var resizeKeys = ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'];

var Tile = function (_React$Component) {
  _inherits(Tile, _React$Component);

  function Tile(props) {
    _classCallCheck(this, Tile);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onMoveStart = _this.onMoveStart.bind(_this);
    _this.onClick = function () {
      _this.props.onClick(_this.props.tid);
    };

    _this.state = {
      moving: false,
      docking: false,
      mounting: true
    };
    return _this;
  }

  Tile.prototype.render = function render() {
    var _this2 = this;

    var cn = 'rtile';
    if (this.props.floating) {
      cn += ' floating';
    }
    ['moving', 'docking', 'mounting'].forEach(function (c) {
      if (_this2.state[c]) {
        cn += ' ' + c;
      }
    });
    if (this.props.withPlaceholder) {
      cn += ' rttph';
    }
    if (this.props.deleting) {
      cn += ' deleting';
    }
    return _react2.default.createElement(
      'div',
      { className: cn, style: this.props.style, ref: function ref(el) {
          return _this2.el = el;
        }, onMouseDown: this.onClick },
      _react2.default.createElement(
        'div',
        { className: 'rtheader', onMouseDown: this.onMoveStart },
        this.renderTileHeader()
      ),
      _react2.default.createElement(TileContent, { url: this.props.url }),
      this.renderResizers()
    );
  };

  Tile.prototype.renderTileHeader = function renderTileHeader() {
    return this.props.tileHeader ? this.props.tileHeader() : this.renderDefaultHeader();
  };

  Tile.prototype.renderDefaultHeader = function renderDefaultHeader() {
    var _this3 = this;

    return _react2.default.createElement(
      'a',
      { className: 'rtclose', onClick: function onClick() {
          return _this3.props.onClose(_this3.props.tid);
        } },
      'X'
    );
  };

  Tile.prototype.renderResizers = function renderResizers() {
    var _this4 = this;

    if (!this.props.floating) {
      return;
    }

    var resizers = resizeKeys.map(function (k) {
      return _react2.default.createElement('div', { key: k,
        className: "trresizer-" + k,
        onMouseDown: function onMouseDown(e) {
          return _this4.onResizeStart(e, k);
        } });
    });

    return _react2.default.createElement(
      'div',
      { className: 'trResizers' },
      resizers
    );
  };

  Tile.prototype.onResizeStart = function onResizeStart(e, direction) {
    var _this5 = this;

    var origin = { left: e.clientX, top: e.clientY },
        directions = {
      n: direction.indexOf('n') != -1,
      s: direction.indexOf('s') != -1,
      e: direction.indexOf('e') != -1,
      w: direction.indexOf('w') != -1
    },
        ticking = false,
        mm,
        _mu,
        ev;

    this.props.onResizeStart(this.props.tid, origin, directions);
    window.addEventListener('mousemove', mm = function mm(e) {
      ev = e;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        _this5.props.onResize(ev);
      });
    });

    window.addEventListener('mouseup', _mu = function mu(e) {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', _mu);
      _this5.props.onResizeEnd(e);
    });
  };

  Tile.prototype.onMoveStart = function onMoveStart(e) {
    var _this6 = this;

    // Only left click and not a control
    if (e.button || e.target.tagName.toLowerCase() == 'a') return;

    var moveStarted = false,
        start = { left: e.clientX, top: e.clientY },
        ticking = false,
        el = this.el,
        mm,
        _mu2,
        ev;

    this.props.onMoveStart(this.props.tid, {
      left: el.offsetLeft, top: el.offsetTop,
      width: el.offsetWidth, height: el.offsetHeight
    });

    window.addEventListener('mousemove', mm = function mm(e) {
      ev = e;
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function () {
        ticking = false;

        var left = ev.clientX - start.left,
            top = ev.clientY - start.top;

        if (!moveStarted && Math.abs(left) < 20 && Math.abs(top) < 20) return;
        moveStarted = true;

        _this6.props.onMove(left, top, ev.clientX, ev.clientY);
      });
    });

    window.addEventListener('mouseup', _mu2 = function mu(e) {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', _mu2);

      var left = moveStarted ? ev.clientX - start.left : 0,
          top = moveStarted ? ev.clientY - start.top : 0;

      _this6.props.onMoveEnd(left, top);
      _this6.setState({ moving: false });
    });

    this.setState({ moving: true });
  };

  Tile.prototype.componentWillUpdate = function componentWillUpdate(nextProps) {
    var _this7 = this;

    if (this.props.floating !== nextProps.floating) {
      // This will keep the z-index while the docking animation is on
      this.setState({ docking: true });
      setTimeout(function () {
        return _this7.setState({ docking: false });
      }, 300);
    }
  };

  Tile.prototype.componentDidMount = function componentDidMount() {
    var _this8 = this;

    setTimeout(function () {
      return _this8.setState({ mounting: false });
    }, 100);
  };

  return Tile;
}(_react2.default.Component);

;

var TileContent = function (_React$Component2) {
  _inherits(TileContent, _React$Component2);

  function TileContent() {
    _classCallCheck(this, TileContent);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  TileContent.prototype.render = function render() {
    var C = this.props.component;

    if (C) {
      return _react2.default.createElement(
        'div',
        { className: 'rtcontent' },
        _react2.default.createElement(C, null)
      );
    }

    return _react2.default.createElement('iframe', { src: this.props.url, sandbox: 'allow-same-origin allow-scripts allow-popups allow-forms' });
  };

  TileContent.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    return !this.props.updating;
  };

  return TileContent;
}(_react2.default.Component);

exports.default = Tile;

/***/ }),

/***/ "./layouter.js":
/*!*********************!*\
  !*** ./layouter.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _qs = __webpack_require__(/*! qs */ "./node_modules/qs/lib/index.js");

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Counter to create ids
var counter = 0;
// Link to parse urls
/*
layout = {
  type: 'free' | 'row' | 'column',
  wrapperOrder: [ 'w1', 'w2', ... ''] // wrapper's ids
  wrappers: { 'w1': ['t1', 't2'], 'w2': ['t3'] } // every wrapper contains tile order
  floating: ['t4','t5'] // floating tiles
  tiles: {t1: {parent, location}, t2: {parent, location} } // tiles with their location object
}

url
---
?layout=row&wrappers=w1,w2&floating=t4,t5&w1=t1,t2&w2=t3&t1=encoded(/myRoute?foo=bar)

tiles are printed always in the same order and all should be absolutelly positioned



chrome-extension://dfcnpbpjpcnlclhnbamicjcnhehbndfj/newtab.html#?layout=column&wrappers=w1,w2,w3&w1=t1&w2=t2,t3&w3=t4&t1=%2Fbrowser%3Furl%3Dhttp%253A%252F%252Fas.com&t2=%23%2Fbrowser%3Furl%3Dhttps%253A%252F%252Fgithub.com&t3=%2Fbrowser%3Furl%3Dhttp%253A%252F%252Fas.com&t4=%2Fbrowser%3Furl%3Dhttp%253A%252F%252Fas.com
 */

var link = document.createElement('a');

var layouter = {
  toLayout: function toLayout(url) {
    var _this = this;

    var q = _qs2.default.parse(url.split('?')[1] || ''),
        wrapperOrder = q.wrappers && q.wrappers.split(',') || [],
        floating = q.floating && q.floating.split(',') || [],
        wrappers = {},
        tiles = {},
        i = wrapperOrder.length,
        tileOrder,
        w,
        type;

    if (!wrapperOrder.length) {
      wrapperOrder = ['w1'];
      wrappers = { w1: ['t1'] };
      tiles = {
        t1: {
          wrapper: 'w1',
          location: this.toLocation('/')
        }
      };
    } else {
      // Wrappers
      while (i-- > 0) {
        tileOrder = q[wrapperOrder[i]];
        if (!tileOrder) {
          wrapperOrder.splice(i, 1);
        }

        w = [];
        tileOrder.split(',').forEach(function (tid) {
          if (q[tid]) {
            tiles[tid] = {
              wrapper: wrapperOrder[i],
              location: _this.toLocation(decodeURIComponent(q[tid]))
            };
            w.push(tid);
          }
        });
        if (w.length) {
          wrappers[wrapperOrder[i]] = w;
        }
      }

      // Floating
      i = floating.length;
      while (i-- > 0) {
        if (q[floating[i]]) {
          tiles[floating[i]] = {
            wrapper: false,
            location: this.toLocation(decodeURIComponent(q[floating[i]]))
          };
        } else {
          floating.splice(i, 1);
        }
      }
    }

    type = q.layout;

    // If there is no layout type set, it's free or column
    if (!type) {
      type = wrapperOrder.length > 1 ? 'column' : 'free';
    }

    return {
      type: type, wrapperOrder: wrapperOrder, wrappers: wrappers, floating: floating, tiles: tiles
    };
  },

  toUrl: function toUrl(layout) {
    var url = [];
    Object.keys(layout.tiles).forEach(function (tid) {
      url.push(tid + '=' + encodeURIComponent(layout.tiles[tid].location.route));
    });
    Object.keys(layout.wrappers).forEach(function (wid) {
      url.push(wid + '=' + layout.wrappers[wid].join(','));
    });

    url.push('layout=' + layout.type);
    url.push('wrappers=' + layout.wrapperOrder.join(','));
    url.push('floating=' + layout.floating.join(','));

    return url.join('&');
  },

  updateLayout: function updateLayout(layout, tid, route, wid) {
    var tile = layout.tiles[tid];

    if (tile) {
      // Just update the route
      if (route) {
        tile.location = this.toLocation(route);
        return;
      }

      // We are removing a tile
      return this.removeTile(layout, tid);
    }

    // No tile and no route
    if (!route) {
      return console.warn('Setting no route in no tile.');
    }

    // No tile but route, create a tile
    if (!wid) {

      // Create a new wrapper
      wid = this.createWid(layout);
      layout.wrapperOrder.push(wid);
      layout.wrappers[wid] = [];

      // Free layout become a column one
      if (layout.type === 'free') {
        layout.type = 'column';
      }
    }

    var ids = wid === 'floating' ? layout.floating : layout.wrappers[wid],
        tileId = !tid || layout.tiles[tid] ? this.createTid(layout) : tid;

    ids.push(tileId);
    layout.tiles[tileId] = {
      wrapper: wid !== 'floating' && wid,
      location: this.toLocation(route)
    };
  },

  removeTileFromLayout: function removeTileFromLayout(layout, tid) {
    var tile = layout.tiles[tid];
    if (!tile) {
      return console.warn(tid + ' doesn\'t exist. Can\'t remove.');
    }

    if (layout.type === 'free') {
      return console.warn("Can't remove tile from free layout");
    }

    // Remove tile from the wrapper
    var wrapper = tile.wrapper ? layout.wrappers[tile.wrapper] : layout.floating,
        i = wrapper.length;

    while (i--) {
      if (wrapper[i] === tid) {
        wrapper.splice(i, 1);
      }
    }

    // If the wrapper is empty remove it too
    if (tile.wrapper && !wrapper.length) {
      delete layout.wrappers[tile.wrapper];
      i = layout.wrapperOrder.length;
      while (i--) {
        if (layout.wrapperOrder[i] === tile.wrapper) {
          layout.wrapperOrder.splice(i, 1);
        }
      }

      // Getting 1 wrapper is going back to a free layout
      if (layout.wrapperOrder.length === 1 && layout.wrappers[layout.wrapperOrder[0]].length === 1) {
        layout.type = 'free';
      }
    }

    delete layout.tiles[tid];
  },
  moveTile: function moveTile(layout, tid, wid) {
    var tile = layout.tiles[tid];
    if (!tile) return console.warn("Can't move unexistent tile.");
    this.removeTileFromLayout(layout, tid);
    this.updateLayout(layout, tid, tile.location.route, wid);
  },
  clone: function clone(layout) {
    var clone = Object.assign({}, layout);
    clone.wrapperOrder = clone.wrapperOrder.slice();
    clone.wrappers = Object.assign({}, clone.wrappers);
    clone.tiles = Object.assign({}, clone.tiles);
    Object.keys(clone.tiles).forEach(function (tid) {
      clone.tiles[tid] = Object.assign({}, clone.tiles[tid]);
    });
    return clone;
  },
  toLocation: function toLocation(url) {
    link.href = url;
    var location = {};
    ['protocol', 'host', 'port', 'pathname', 'search', 'hash'].forEach(function (p) {
      location[p] = link[p];
    });

    location.query = _qs2.default.parse(location.search);
    location.route = url;

    return location;
  },


  // Use base 36 for creating ids
  createId: function createId(layout, type) {
    var prefix = type[0],
        id = prefix + (++counter).toString(36);

    while (layout[type][id]) {
      id = prefix + (++counter).toString(36);
    }

    return id;
  },
  createWid: function createWid(layout) {
    return this.createId(layout, 'wrappers');
  },
  createTid: function createTid(layout) {
    return this.createId(layout, 'tiles');
  }
};

exports.default = layouter;

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./react-tiles.scss":
/*!*********************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./react-tiles.scss ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ./node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".rtcontainer {\n  position: relative;\n  height: 100%;\n  background: #999; }\n\n.rtile {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  background: #f9f9f9;\n  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);\n  transition: box-shadow .3s, width .3s, height .3s, transform .3s, top .3s, left .3s, opacity .3s; }\n  .rtile.floating {\n    z-index: 3;\n    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);\n    transform: none !important; }\n    .rtile.floating.moving {\n      box-shadow: 0 2px 30px rgba(0, 0, 0, 0.3);\n      z-index: 5; }\n  .rtile iframe {\n    width: 100%;\n    height: 100%;\n    border: 0; }\n  .rtile.docking {\n    transition: box-shadow .3s, width .3s, height .3s, transform .3s, top .3s, left .3s !important;\n    z-index: 1001 !important; }\n  .rtile.deleting {\n    transition: transform .3s, opacity .3s;\n    transform: scale(1.8);\n    opacity: 0; }\n  .rtile.mounting {\n    transform: scale(0.2);\n    opacity: 0; }\n\n.rtseparator {\n  position: absolute;\n  z-index: 1000;\n  background: yellow;\n  transition: width .3s, height .3s, top .3s, left .3s, opacity .3s, transform .3s; }\n  .rtseparator.rtmounting {\n    opacity: 0; }\n  .rtseparator.rtsv {\n    width: 5px;\n    margin-left: -2px;\n    cursor: ew-resize; }\n    .rtseparator.rtsv.rtmounting {\n      height: 0 !important; }\n  .rtseparator.rtsh {\n    height: 5px;\n    margin-top: -2px;\n    cursor: ns-resize; }\n    .rtseparator.rtsh.rtmounting {\n      width: 0 !important; }\n\n.tIframeOverlay {\n  z-index: -1;\n  position: absolute;\n  width: 100%;\n  height: 100%; }\n\n.rtupdating {\n  user-select: none;\n  -webkit-touch-callout: none;\n  /* Disable Android and iOS callouts*/ }\n  .rtupdating .tIframeOverlay {\n    z-index: 10000; }\n\n.rtmoving .rtile.moving {\n  transition: box-shadow .3s, transform .3s, width .3s, height .3s; }\n\n.rtseparatorMoving .rtile {\n  transition: box-shadow .3s, transform .3s; }\n\n.rtseparatorMoving .rtseparator {\n  transition: transform .3s; }\n\n.rtheader {\n  height: 50px;\n  background: red; }\n\n.rtcontent {\n  flex-grow: 1; }\n\n.trResizers > div {\n  position: absolute;\n  z-index: 5;\n  background: #0f0; }\n\n.trresizer-n {\n  height: 5px;\n  width: 100%;\n  left: 0;\n  top: -2px;\n  cursor: ns-resize; }\n\n.trresizer-ne {\n  width: 5px;\n  height: 5px;\n  z-index: 6;\n  top: -2px;\n  right: -2px;\n  cursor: nesw-resize; }\n\n.trresizer-e {\n  width: 5px;\n  height: 100%;\n  top: -2px;\n  right: -2px;\n  cursor: ew-resize; }\n\n.trresizer-se {\n  width: 5px;\n  height: 5px;\n  z-index: 6;\n  bottom: -2px;\n  right: -2px;\n  cursor: nwse-resize; }\n\n.trresizer-s {\n  height: 5px;\n  width: 100%;\n  left: -2px;\n  bottom: -2px;\n  cursor: ns-resize; }\n\n.trresizer-sw {\n  width: 5px;\n  height: 5px;\n  z-index: 6;\n  bottom: -2px;\n  left: -2px;\n  cursor: nesw-resize; }\n\n.trresizer-w {\n  width: 5px;\n  height: 100%;\n  top: -2px;\n  left: -2px;\n  cursor: ew-resize; }\n\n.trresizer-nw {\n  width: 5px;\n  height: 5px;\n  z-index: 6;\n  top: -2px;\n  left: -2px;\n  cursor: nwse-resize; }\n\n/* placeholders */\n.rtcolumn.rtwph .rtile, .rtcolumn.rtwph .rtseparator {\n  transform: translateX(-200px); }\n\n.rtrow.rtwph .rtile, .rtrow.rtwph .rtseparator {\n  transform: translateY(-200px); }\n\n.rtrow .rttph {\n  transform: translateX(-200px); }\n\n.rtcolumn .rttph {\n  transform: translateY(-200px); }\n\n.rtclose {\n  float: right;\n  margin: 16px 16px 0 0; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/qs/lib/formats.js":
/*!****************************************!*\
  !*** ./node_modules/qs/lib/formats.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),

/***/ "./node_modules/qs/lib/index.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(/*! ./stringify */ "./node_modules/qs/lib/stringify.js");
var parse = __webpack_require__(/*! ./parse */ "./node_modules/qs/lib/parse.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/qs/lib/formats.js");

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ "./node_modules/qs/lib/parse.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/parse.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/qs/lib/utils.js");

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder);
            val = options.decoder(part.slice(pos + 1), defaults.decoder);
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]') {
            obj = [];
            obj = obj.concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),

/***/ "./node_modules/qs/lib/stringify.js":
/*!******************************************!*\
  !*** ./node_modules/qs/lib/stringify.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/qs/lib/utils.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/qs/lib/formats.js");

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ "./node_modules/qs/lib/utils.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/utils.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

var encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./react-tiles.js":
/*!************************!*\
  !*** ./react-tiles.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _react = __webpack_require__(/*! react */ "react");

var _react2 = _interopRequireDefault(_react);

var _layouter = __webpack_require__(/*! ./layouter */ "./layouter.js");

var _layouter2 = _interopRequireDefault(_layouter);

var _Tile = __webpack_require__(/*! ./Tile */ "./Tile.js");

var _Tile2 = _interopRequireDefault(_Tile);

var _Separator = __webpack_require__(/*! ./Separator */ "./Separator.js");

var _Separator2 = _interopRequireDefault(_Separator);

var _resizerTools = __webpack_require__(/*! ./resizerTools */ "./resizerTools.js");

var _resizerTools2 = _interopRequireDefault(_resizerTools);

__webpack_require__(/*! ./react-tiles.scss */ "./react-tiles.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var singleton;
var layoutDimensions = {
  column: { tfrom: 'top', wfrom: 'left', tsize: 'height', wsize: 'width', wsep: 'v', tsep: 'h' },
  row: { tfrom: 'left', wfrom: 'top', tsize: 'width', wsize: 'height', wsep: 'h', tsep: 'v' }
};
var MIN_HEIGHT = 200;
var MIN_WIDTH = 300;

var Tiles = function (_Component) {
  _inherits(Tiles, _Component);

  function Tiles(props) {
    _classCallCheck(this, Tiles);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    singleton = _this;

    _this.props.resolver.init();

    _this.onSepStart = _this.onSepStart.bind(_this);
    _this.onSepMove = _this.onSepMove.bind(_this);
    _this.onSepEnd = _this.onSepEnd.bind(_this);

    _this.onTileStart = _this.onTileStart.bind(_this);
    _this.onTileMove = _this.onTileMove.bind(_this);
    _this.onTileEnd = _this.onTileEnd.bind(_this);

    _this.onResizeStart = _this.onResizeStart.bind(_this);
    _this.onResize = _this.onResize.bind(_this);
    _this.onResizeEnd = _this.onResizeEnd.bind(_this);

    _this.calculateZIndex = _this.calculateZIndex.bind(_this);
    _this.close = _this.close.bind(_this);
    /*
    // Bind some quick methods
    this.onMoveStart = this.onMoveStart.bind(this);
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onMoveStop = this.onMoveStop.bind(this);
    */

    _this.lastRoute = _this.getRoute();
    var layout = _layouter2.default.toLayout(_this.lastRoute);

    var state = _this.calculateInitialSizes(layout);
    state.layout = layout.type;
    state.resizing = false;
    state.moving = false;
    state.current = layout;
    state.deleting = {}; // Intermediate state for tiles and wrappers when closing tiles

    _this.state = state;
    return _this;
  }

  Tiles.prototype.render = function render() {
    var _this2 = this;

    var cn = "rtcontainer rt" + this.state.layout,
        dimensions = this.state.layout === 'column' ? layoutDimensions.column : layoutDimensions.row;
    if (this.moving) {
      cn += ' rtupdating rt' + this.moving.type;
      if (this.moving.placeholder === 'wrapper') {
        cn += ' rtwph';
      }
    }
    return _react2.default.createElement(
      'div',
      { className: cn, ref: function ref(el) {
          return _this2.el = el;
        } },
      this.renderTiles(dimensions),
      this.renderSeparators(dimensions),
      _react2.default.createElement('div', { className: 'tIframeOverlay' })
    );
  };

  Tiles.prototype.renderTiles = function renderTiles(d) {
    var _this3 = this;

    var state = this.state,
        layout = state.current,
        updating = state.resizing || state.moving;

    return state.tileOrder.map(function (tid) {
      var ltile = layout.tiles[tid] || state.deleting[tid],
          tile = state.tiles[tid] || ltile.sizes,
          style = {},
          wrapper;
      if (ltile.wrapper) {
        wrapper = state.wrappers[ltile.wrapper] || state.deleting[ltile.wrapper];
        style[d.tfrom] = tile.from + '%';
        style[d.wfrom] = wrapper.from + '%';
        style[d.tsize] = tile.size + '%';
        style[d.wsize] = wrapper.size + '%';
        style.zIndex = state.zIndexes.tiles[tid];
      } else {
        style = Object.assign({ zIndex: _this3.state.zIndexes.tiles[tid] + 1000 }, tile);
      }

      return _react2.default.createElement(_Tile2.default, { key: tid,
        onMoveStart: _this3.onTileStart,
        onMove: _this3.onTileMove,
        onMoveEnd: _this3.onTileEnd,
        onResizeStart: _this3.onResizeStart,
        onResize: _this3.onResize,
        onResizeEnd: _this3.onResizeEnd,
        onClick: _this3.calculateZIndex,
        onClose: _this3.close,
        deleting: ltile.deleting,
        withPlaceholder: _this3.moving && _this3.moving.placeholder && _this3.moving.placeholder === ltile.wrapper,
        tid: tid,
        floating: !ltile.wrapper,
        url: ltile.location.route,
        style: style,
        updating: updating });
    });
  };

  Tiles.prototype.renderSeparators = function renderSeparators(d) {
    var _this4 = this;

    var state = this.state,
        separators = [];

    this.state.current.wrapperOrder.forEach(function (wid, i) {
      var style = {};
      if (i) {
        style[d.wfrom] = state.wrappers[wid].from + '%';
        style[d.tfrom] = 0;
        style[d.tsize] = '100%';
        separators.push(_this4.renderSeparator(d.wsep, style, 'w', i, wid));
      }

      _this4.state.current.wrappers[wid].forEach(function (tid, j) {
        if (!j) return;

        var tstyle = {};
        tstyle[d.wfrom] = state.wrappers[wid].from + '%';
        tstyle[d.tfrom] = state.tiles[tid].from + '%';
        tstyle[d.wsize] = state.wrappers[wid].size + '%';
        separators.push(_this4.renderSeparator(d.tsep, tstyle, i, j, tid));
      });
    });

    return separators;
  };

  Tiles.prototype.renderSeparator = function renderSeparator(type, style, wrapper, tile, key) {
    return _react2.default.createElement(_Separator2.default, { key: 'ts_' + key, style: style, type: type,
      withPlaceholder: tile && this.moving && this.moving.placeholder && this.moving.placeholder === this.state.current.wrapperOrder[wrapper],
      wrapper: wrapper, tile: tile,
      onMoveStart: this.onSepStart,
      onMove: this.onSepMove,
      onMoveEnd: this.onSepEnd });
  };

  Tiles.prototype.calculateInitialSizes = function calculateInitialSizes(layout) {
    var tiles = {},
        wrappers = {},
        tileOrder = [],
        zIndexes = { tiles: {}, order: [] };

    var wsize = 100 / layout.wrapperOrder.length;
    layout.wrapperOrder.forEach(function (wid, i) {
      wrappers[wid] = {
        from: i * wsize,
        size: wsize
      };

      var tsize = 100 / layout.wrappers[wid].length;
      layout.wrappers[wid].forEach(function (tid, j) {
        tiles[tid] = {
          from: j * tsize,
          size: tsize
        };
        tileOrder.push(tid);
        zIndexes.order.push(tid);
        zIndexes.tiles[tid] = zIndexes.order.length;
      });
    });

    layout.floating.forEach(function (tid, i) {
      tiles[tid] = {
        top: 150 + 80 * i,
        left: 150 + 80 * i,
        width: 350,
        height: 250
      };
      tileOrder.push(tid);
      zIndexes.order.push(tid);
      zIndexes.tiles[tid] = zIndexes.order.length;
    });

    return { tiles: tiles, wrappers: wrappers, tileOrder: tileOrder, zIndexes: zIndexes };
  };

  Tiles.prototype.close = function close(tid) {
    var layout = _layouter2.default.clone(this.state.current);
    _layouter2.default.removeTileFromLayout(layout, tid);
    this.setLayout(layout);
  };

  Tiles.prototype.getRoute = function getRoute() {
    return this.props.resolver.getPath();
  };

  Tiles.prototype.setLayout = function setLayout(layout) {
    var url = _layouter2.default.toUrl(layout);

    this.props.resolver.navigate('?' + url);
  };

  Tiles.prototype.onSepStart = function onSepStart(wrapper, sid, coord) {
    var _this5 = this;

    var layout = this.state.current,
        separators = [],
        el = this.el,
        minPercentage,
        targets,
        sizes,
        maxSize;

    if (wrapper === 'w') {
      targets = layout.wrapperOrder.map(function (wid) {
        return _this5.state.wrappers[wid];
      });
      minPercentage = layout.type === 'row' ? MIN_HEIGHT / el.clientHeight * 100 : MIN_WIDTH / el.clientWidth * 100;
      maxSize = layout.type === 'row' ? el.clientHeight : el.clientWidth;
    } else {
      targets = layout.wrappers[layout.wrapperOrder[wrapper]].map(function (tid) {
        return _this5.state.tiles[tid];
      });
      minPercentage = layout.type === 'row' ? MIN_WIDTH / el.clientWidth * 100 : MIN_HEIGHT / el.clientHeight * 100;
      maxSize = layout.type === 'row' ? el.clientWidth : el.clientHeight;
    }

    sizes = targets.map(function (t) {
      return t.size;
    });
    // Targets are the tiles/wrappers in the state
    this.moving = {
      type: 'separatorMoving',
      targets: targets, sizes: sizes, minPercentage: minPercentage, maxSize: maxSize
    };
    this.onSepMove(sid, coord);
  };

  Tiles.prototype.onSepMove = function onSepMove(sid, coord) {
    var moving = this.moving;
    if (!moving) return;
    if (_resizerTools2.default.updateSizes(moving.sizes, sid, coord / moving.maxSize * 100, moving.minPercentage)) {
      var sum = 0;
      moving.targets.forEach(function (t, i) {
        t.size = moving.sizes[i];
        t.from = sum;
        sum += moving.sizes[i];
      });
      this.forceUpdate();
    }
  };

  Tiles.prototype.onSepEnd = function onSepEnd(sid, coord) {
    this.onSepMove(sid, coord);
    this.moving = false;
    this.forceUpdate();
  };

  Tiles.prototype.onTileStart = function onTileStart(tid) {
    this.moving = {
      type: 'moving',
      tid: tid,
      target: this.state.tiles[tid],
      start: Object.assign({}, this.state.tiles[tid]),
      wrapper: this.state.current.tiles[tid].wrapper,
      reRendering: false,
      placeholder: false
    };
    this.forceUpdate();
  };

  Tiles.prototype.onTileMove = function onTileMove(left, top, eventLeft, eventTop) {
    var _this6 = this;

    var moving = this.moving;

    if (!moving) return;

    var layout = this.state.current;
    if (moving.wrapper && !moving.reRendering) {
      layout = _layouter2.default.clone(layout);
      _layouter2.default.moveTile(layout, moving.tid, 'floating');
      moving.reRendering = { left: eventLeft, top: eventTop };
      return this.setLayout(layout); // We need to re-render
    } else if (moving.reRendering) {
      moving.target = this.state.tiles[moving.tid];
      if (moving.target.size) return; // Not re rendered yet

      moving.reRendering = false;
      moving.wrapper = false;
      moving.start = Object.assign({}, moving.target);
    }

    this.state.tiles[moving.tid] = moving.target = Object.assign({}, moving.target, { left: moving.start.left + left, top: moving.start.top + top });

    // Calculate placeholder
    var right = this.el.clientWidth - 200,
        bottom = this.el.clientHeight - 200,
        layoutType = layout.type,
        percentage,
        ph;

    if (eventTop > bottom && layoutType === 'column' || eventLeft > right && layoutType === 'row') {
      // Tile placeholder
      var tSizes = layoutType === 'row' ? { size: eventTop, coord: 'clientHeight' } : { size: eventLeft, coord: 'clientWidth' };

      percentage = tSizes.size / this.el[tSizes.coord] * 100;
      layout.wrapperOrder.forEach(function (wid, i) {
        if (!i || ph) return;

        if (_this6.state.wrappers[wid].from > percentage) {
          ph = layout.wrapperOrder[i - 1];
        }
      });
      if (!ph) {
        ph = layout.wrapperOrder[layout.wrapperOrder.length - 1];
      }
    } else if (eventTop > bottom || eventLeft > right) {
      // Wrapper placeholder
      ph = 'wrapper';
    } else {
      ph = false;
    }

    moving.placeholder = ph;

    this.forceUpdate();
  };

  Tiles.prototype.onTileEnd = function onTileEnd(left, top) {
    var moving = this.moving;
    this.moving = false;

    if (left === undefined || !moving) {
      return this.moving = false;
    }

    this.state.tiles[moving.tid] = moving.target = Object.assign({}, moving.target, { left: moving.start.left + left, top: moving.start.top + top });

    var ph = moving.placeholder;
    if (ph) {
      var layout = _layouter2.default.clone(this.state.current);
      _layouter2.default.moveTile(layout, moving.tid, ph != 'wrapper' && ph);
      this.setLayout(layout);
    } else {
      this.forceUpdate();
    }
  };

  Tiles.prototype.onResizeStart = function onResizeStart(tid, origin, directions) {
    var sizes = this.state.tiles[tid];
    this.moving = {
      type: 'resize',
      maxN: origin.top + sizes.height - MIN_HEIGHT,
      maxW: origin.left + sizes.width - MIN_WIDTH,
      initial: Object.assign({}, sizes),
      tid: tid, origin: origin, directions: directions, sizes: sizes
    };
    this.forceUpdate();
  };

  Tiles.prototype.onResize = function onResize(e) {
    var _moving = this.moving,
        maxN = _moving.maxN,
        maxW = _moving.maxW,
        sizes = _moving.sizes,
        origin = _moving.origin,
        directions = _moving.directions,
        initial = _moving.initial;

    var dim;

    if (directions.e) {
      sizes.width = Math.max(initial.width + e.clientX - origin.left, MIN_WIDTH);
    }
    if (directions.s) {
      sizes.height = Math.max(initial.height + e.clientY - origin.top, MIN_HEIGHT);
    }
    if (directions.n) {
      dim = Math.min(maxN, e.clientY);
      sizes.height = initial.height + origin.top - dim;
      sizes.top = initial.top - origin.top + dim;
    }
    if (directions.w) {
      dim = Math.min(maxW, e.clientX);
      sizes.width = initial.width + origin.left - dim;
      sizes.left = initial.left - origin.left + dim;
    }

    this.forceUpdate();
  };

  Tiles.prototype.onResizeEnd = function onResizeEnd(e) {
    this.onResize(e);
    this.moving = false;
    this.forceUpdate();
  };

  Tiles.prototype.calculateZIndex = function calculateZIndex(tid) {
    var order = this.state.zIndexes.order;
    if (order[order.length - 1] === tid) return;

    var i = order.indexOf(tid);
    if (i !== -1) {
      order.splice(i, 1);
    }
    order.push(tid);
    var tiles = {};
    order.forEach(function (tid, i) {
      tiles[tid] = i + 1;
    });

    this.setState({ zIndexes: { order: order, tiles: tiles } });
  };

  Tiles.prototype.componentWillUpdate = function componentWillUpdate() {
    var _this7 = this;

    var route = this.getRoute();
    if (route !== this.lastRoute) {
      this.lastRoute = route;

      var layout = _layouter2.default.toLayout(route),
          currentLayout = this.state.current,
          update = { current: layout },
          sizes = _resizerTools2.default.updateLayoutSizes(this.state.current, layout, {
        tiles: this.state.tiles,
        wrappers: this.state.wrappers
      }, this.el, this.moving && this.moving.reRendering),
          tileOrder = this.state.tileOrder.slice();

      update.tiles = sizes.tiles;
      update.wrappers = sizes.wrappers;

      // Check if there is some closed tile
      tileOrder.forEach(function (tid) {
        if (!layout.tiles[tid]) {
          var tile = currentLayout.tiles[tid];
          tile.sizes = _this7.state.tiles[tid];
          tile.deleting = true;
          _this7.state.deleting[tid] = tile;
          if (tile.wrapper && currentLayout.wrappers[tile.wrapper].length <= 1) {
            _this7.state.deleting[tile.wrapper] = _this7.state.wrappers[tile.wrapper];
          }
          setTimeout(function () {
            var nextOrder = _this7.state.tileOrder.slice(),
                i = nextOrder.indexOf(tid);

            if (i !== -1) {
              nextOrder.splice(i, 1);
              _this7.setState({
                tileOrder: nextOrder,
                deleting: {}
              });
            }
          }, 300);
        }
      });

      // Check if there is some new tile
      Object.keys(layout.tiles).forEach(function (tid) {
        if (tileOrder.indexOf(tid) === -1) {
          tileOrder.push(tid);
          update.tileOrder = tileOrder;
        }
      });

      this.setState(update);
    }
  };

  Tiles.setTile = function setTile(tid, route, wid) {
    var layout = singleton.getLayout();
    _layouter2.default.updateLayout(layout, tid, route, wid);
    singleton.setLayout(layout);
  };

  return Tiles;
}(_react.Component);

exports.default = Tiles;

/***/ }),

/***/ "./react-tiles.scss":
/*!**************************!*\
  !*** ./react-tiles.scss ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./react-tiles.scss */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./react-tiles.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ./node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./resizerTools.js":
/*!*************************!*\
  !*** ./resizerTools.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.default = {
  /**
   * Updates an array of percentages (sizes) by moving a separator index to nextPercent
   * position, respecting the min size given by minPercent.
   */
  updateSizes: function updateSizes(sizes, separator, nextPercent, minPercent) {
    // None or sizes to the left or right can't be smaller than min percent
    if (nextPercent < separator * minPercent || 100 - nextPercent < (sizes.length - separator) * minPercent) {
      return false;
    }

    // Calculate where was the separator
    var prevPercent = sizes[0],
        i = 1;
    while (i < separator) {
      prevPercent += sizes[i++];
    }

    // Calculate the change of sizes to left and right
    var leftChange = nextPercent - prevPercent,
        rightChange = -leftChange;

    // Try to apply the change to the closest size on the right
    i = separator;
    while (rightChange) {
      if (sizes[i] + rightChange > minPercent) {
        sizes[i] += rightChange;
        rightChange = 0;
      } else {
        rightChange += sizes[i] - minPercent;
        sizes[i] = minPercent;
      }
      i++;
    }

    // Try to apply the change to the closest size on the left
    i = separator - 1;
    while (leftChange) {
      if (sizes[i] + leftChange > minPercent) {
        sizes[i] += leftChange;
        leftChange = 0;
      } else {
        leftChange += sizes[i] - minPercent;
        sizes[i] = minPercent;
      }
      i--;
    }

    return true;
  },
  updateLayoutSizes: function updateLayoutSizes(prevLayout, nextLayout, sizes, el, middlePoint) {
    var prevElements = {};
    var total = 0;
    var nextSizes = {
      wrappers: {},
      tiles: {}
    };

    var arrays = [{ type: 'wrappers', ids: nextLayout.wrapperOrder }];
    nextLayout.wrapperOrder.forEach(function (wid) {
      arrays.push({ type: 'tiles', ids: nextLayout.wrappers[wid] });
    });

    arrays.forEach(function (arr) {
      var minSize = 100 / (arr.ids.length - 1 || 1),
          sum = 0,
          factor;

      arr.ids.forEach(function (id) {
        var w = sizes[arr.type][id] && sizes[arr.type][id].size ? sizes[arr.type][id] : { size: minSize };
        nextSizes[arr.type][id] = w;
        sum += w.size;
      });

      factor = 100 / (sum || 1);
      sum = 0;
      arr.ids.forEach(function (id) {
        var size = nextSizes[arr.type][id].size * factor;
        nextSizes[arr.type][id] = { size: size, from: sum };
        sum += size;
      });
    });

    var maxWidth = el.clientWidth,
        maxHeight = el.clientHeight;

    nextLayout.floating.forEach(function (tid, i) {
      var tile = prevLayout.tiles[tid],
          tileSize = {
        width: maxWidth / 2, height: maxHeight / 2,
        left: 150, top: 150
      };

      if (tile) {
        if (tile.wrapper) {
          // Undocking a tile
          if (middlePoint) {
            tileSize.left = middlePoint.left - tileSize.width / 2;
            tileSize.top = middlePoint.top - 10;
          } else if (sizes.wrappers[tile.wrapper]) {
            if (nextLayout.type === 'column') {
              tileSize.left = sizes.wrappers[tile.wrapper].from / 100 * maxWidth;
              tileSize.top = sizes.tiles[tid].from / 100 * maxHeight;
            } else {
              tileSize.top = sizes.wrappers[tile.wrapper].from / 100 * maxWidth;
              tileSize.left = sizes.tiles[tid].from / 100 * maxHeight;
            }
          }
        } else {
          tileSize = sizes.tiles[tid];
        }
      }

      nextSizes.tiles[tid] = tileSize;
    });

    return nextSizes;
  }
};

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ })

/******/ });
//# sourceMappingURL=react-tiles.js.map