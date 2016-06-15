/******/ (function(modules) { // webpackBootstrap
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

	'use strict';

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _util = __webpack_require__(21);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(88);

	var Cabin = __webpack_require__(92);

	var Renderer = function () {
	  function Renderer() {
	    (0, _classCallCheck3.default)(this, Renderer);

	    this.animate = this.animate.bind(this);
	    this.render = this.render.bind(this);
	    this.onWindowResize = this.onWindowResize.bind(this);

	    this._center = new THREE.Vector3(0, 0, 0);
	    this._gridDisplay = false;
	    this._gridFactor = 3;

	    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	    this.camera.position.z = 20;

	    this.renderer = new THREE.WebGLRenderer();
	    this.renderer.setSize(window.innerWidth, window.innerHeight);
	    this.renderer.setClearColor(0x111111);

	    this._container = document.querySelector('#container');
	    this._container.appendChild(this.renderer.domElement);

	    this._progress = document.createElement('canvas');
	    this._progress.classList.add('progress');
	    this._container.appendChild(this._progress);

	    this.scene = new THREE.Scene();
	    this._cabanes = new THREE.Group();
	    this._cabanesObject = {};
	    this.loadCabins();

	    this.scene.add(this._cabanes);

	    /*var axisHelper = new THREE.AxisHelper(2);
	    this.scene.add(axisHelper);*/

	    /*this.controls = new THREE.TrackballControls(this.camera);
	    this.controls.rotateSpeed = 2.0;
	    this.controls.zoomSpeed = 1.2;
	    this.controls.panSpeed = 0.8;
	    this.controls.noZoom = false;
	    this.controls.noPan = false;
	    this.controls.staticMoving = true;
	    this.controls.dynamicDampingFactor = 0.3;*/

	    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	    this.controls.enableDamping = true;
	    this.controls.dampingFactor = 0.25;
	    this.controls.enableZoom = true;

	    this.controls.addEventListener('change', this.render);

	    window.addEventListener('resize', this.onWindowResize, false);
	  }

	  (0, _createClass3.default)(Renderer, [{
	    key: 'unfoldCabins',
	    value: function unfoldCabins() {
	      for (var k in this._cabanesObject) {
	        this._cabanesObject[k].toggleUnfold();
	      }

	      this.render();

	      document.getElementById('container').classList.toggle('fold');
	    }
	  }, {
	    key: 'loadCabins',
	    value: function loadCabins() {
	      var _this = this;

	      document.querySelector('#container .loader').classList.add('active');

	      var req = new XMLHttpRequest();
	      req.open('GET', 'cabins.json', true);

	      req.onprogress = function (e) {
	        var percentComplete = Math.floor(e.position / e.totalSize * 100);
	        _this.progress = 'Downloading cabanes list... [' + percentComplete + '%]';
	      };

	      req.onreadystatechange = function () {
	        if (req.readyState == 4) {
	          if (req.status == 200) {
	            (function () {
	              _this.progress = "Creating cabanes mesh...";

	              var cabanes = JSON.parse(req.responseText).cabins,
	                  i = 0;

	              _this.scene.remove(_this._cabanes);
	              _this._cabanes = new THREE.Group();
	              _this.scene.add(_this._cabanes);

	              _this._cabanesObject = {};

	              var minX = cabanes[0].x,
	                  maxX = cabanes[0].x,
	                  minY = cabanes[0].y,
	                  maxY = cabanes[0].y;

	              var count = 0;

	              cabanes.forEach(function (cabane) {
	                _this.progress = 'Creating cabanes mesh... ' + ++i + '/' + cabanes.length;
	                cabane.colors = (0, _util.randomStripes)();

	                minX = Math.min(minX, cabane.x);
	                maxX = Math.max(maxX, cabane.x);
	                minY = Math.min(minY, cabane.y);
	                maxY = Math.max(maxY, cabane.y);

	                var c = new Cabin(cabane, _this);
	                _this._cabanesObject[c.id] = c;
	                _this._cabanes.add(c.mesh);

	                c.gridX = count % 10;
	                c.gridY = Math.floor(count / 10);
	                count++;

	                requestAnimationFrame(_this.render);
	              });

	              _this._center.set((minX + maxX) / 2, 0, (minY + maxY) / 2);

	              //this.progress = "";

	              //
	              // Load colors
	              //

	              _this.loadColors();
	            })();
	          } else {
	            console.log("Impossible de télécharger la liste des cabanes.");
	          }
	        }
	      };

	      req.send(null);
	    }
	  }, {
	    key: 'loadColors',
	    value: function loadColors() {
	      var _this2 = this;

	      var req = new XMLHttpRequest();
	      req.open('GET', 'colors.json', true);

	      req.onreadystatechange = function () {
	        if (req.readyState == 4) {
	          if (req.status == 200) {
	            var colors = JSON.parse(req.responseText).colors;

	            for (var k in _this2._cabanesObject) {
	              var color = colors[k];

	              if (color) {
	                _this2._cabanesObject[k].colors = color.stripes;
	              } else {
	                console.log("Missing color for cabin", k);
	              }
	            }

	            requestAnimationFrame(_this2.render);
	          } else {
	            console.log("Impossible de télécharger la liste des couleurs.");
	          }
	        }

	        document.querySelector('#container .loader').classList.remove('active');
	      };

	      req.send(null);
	    }
	  }, {
	    key: 'gridDisplay',
	    value: function gridDisplay() {
	      for (var k in this._cabanesObject) {
	        this._cabanesObject[k].goOnGrid(this._gridFactor, this);
	      }

	      this.render();
	      this._gridDisplay = true;

	      document.getElementById('container').classList.add('grid-display');
	    }
	  }, {
	    key: 'normalDisplay',
	    value: function normalDisplay() {
	      for (var k in this._cabanesObject) {
	        this._cabanesObject[k].resetPosition(this._gridFactor / 5.0);
	      }

	      this.render();
	      this._gridDisplay = false;

	      document.getElementById('container').classList.remove('grid-display');
	    }
	  }, {
	    key: 'toggleDisplay',
	    value: function toggleDisplay() {
	      if (this._gridDisplay) {
	        this.normalDisplay();
	      } else {
	        this.gridDisplay();
	      }
	    }
	  }, {
	    key: 'resetCamera',
	    value: function resetCamera() {
	      if (this._gridDisplay) {
	        this.camera.position.set(this._gridFactor * 5, 10, 5);
	        this.camera.up = new THREE.Vector3(0, 1, 0);
	        this.camera.updateProjectionMatrix();

	        this.controls.target = new THREE.Vector3(this._gridFactor * 5, 0, 5);
	        this.controls.update();
	      } else {
	        this.camera.position.set(0, 0, 20);
	        this.camera.updateProjectionMatrix();
	        this.controls.target = new THREE.Vector3(0, 0, 0);
	        this.controls.update();
	      }
	    }
	  }, {
	    key: 'animate',
	    value: function animate() {
	      requestAnimationFrame(this.animate);
	      this.controls.update();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.renderer.render(this.scene, this.camera);
	    }
	  }, {
	    key: 'topView',
	    value: function topView() {
	      this.camera.position.set(this._center.x, 300, this._center.z);
	      this.camera.up = new THREE.Vector3(0, 1, 0);
	      this.camera.updateProjectionMatrix();

	      this.controls.target = this._center.clone();
	      this.controls.update();
	    }
	  }, {
	    key: 'onWindowResize',
	    value: function onWindowResize() {
	      this.camera.aspect = window.innerWidth / window.innerHeight;
	      this.camera.updateProjectionMatrix();
	      this.renderer.setSize(window.innerWidth, window.innerHeight);

	      this.render();
	    }
	  }, {
	    key: 'askForRendering',
	    value: function askForRendering() {
	      var _this3 = this;

	      if (!this._willRender) {
	        this._willRender = true;

	        requestAnimationFrame(function () {
	          _this3.render();
	          _this3._willRender = false;
	        });
	      }
	    }
	  }, {
	    key: 'gridFactor',
	    set: function set(factor) {
	      this._gridFactor = factor;

	      if (this._gridDisplay) {
	        this.gridDisplay();
	      } else {
	        this.normalDisplay();
	      }
	    }
	  }, {
	    key: 'trackedCabin',
	    set: function set(cabinId) {
	      if (cabinId == null || !cabinId) {
	        for (var k in this._cabanesObject) {
	          this._cabanesObject[k].transparent = 1;
	        }

	        requestAnimationFrame(this.render);
	      } else if (this._cabanesObject[cabinId]) {
	        var cabin = this._cabanesObject[cabinId];
	        console.log("Cabin found");

	        this.camera.position.set(cabin.x, 10, cabin.z + 20);
	        this.camera.up = new THREE.Vector3(0, 1, 0);
	        this.camera.updateProjectionMatrix();

	        this.controls.target = new THREE.Vector3(cabin.x, 0, cabin.z);
	        this.controls.update();

	        for (var _k in this._cabanesObject) {
	          this._cabanesObject[_k].transparent = 0.25;
	        }

	        cabin.transparent = 1;

	        requestAnimationFrame(this.render);
	      } else {
	        console.log("Can not find cabin");
	      }
	    }
	  }, {
	    key: 'progress',
	    set: function set(text) {
	      var ctx = this._progress.getContext('2d');
	      ctx.textAlign = "left";
	      ctx.fontStyle = "red";
	      ctx.fillText(text, this._progress.width - 5, this._progress.height / 2);
	    }
	  }, {
	    key: 'rendererDomElement',
	    get: function get() {
	      return this.renderer.domElement;
	    }
	  }]);
	  return Renderer;
	}();

	var renderer = new Renderer();
	renderer.render();
	renderer.animate();

	document.querySelector('#container .finder').addEventListener('keypress', function (e) {
	  if (e.key == 'Enter') {
	    var cabinId = e.target.value;
	    console.log("tracked cabin", cabinId, cabinId.length);
	    renderer.trackedCabin = cabinId.length == 0 ? null : cabinId;
	  }
	});

	function actionListener(e) {
	  switch (this.dataset.action) {
	    case 'unfolder':
	      renderer.unfoldCabins();
	      break;
	    case 'clear-tracked-cabin':
	      document.querySelector('#container .search-box input').value = '';
	      renderer.trackedCabin = null;
	      break;
	    case 'top-view':
	      renderer.topView();
	      break;
	    case 'toggle-display':
	      renderer.toggleDisplay();
	      break;
	    case 'set-grid-factor':
	      renderer.gridFactor = parseInt(this.value);
	      break;
	    case 'reset-camera':
	      renderer.resetCamera();
	      break;
	    default:
	      console.log("Unknown action", this.dataset.action);
	      break;
	  }
	}

	var actioners = document.querySelectorAll('#container .action');

	for (var i = 0; i < actioners.length; i++) {
	  actioners[i].addEventListener(actioners[i].dataset.type || 'click', actionListener.bind(actioners[i]));
	}

	document.querySelector('#container .open-finder').addEventListener('click', function (e) {
	  document.querySelector('#container .finder').classList.toggle('opened');
	});

	renderer.rendererDomElement.focus();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(3);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(4), __esModule: true };

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(5);
	var $Object = __webpack_require__(8).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(16), 'Object', {defineProperty: __webpack_require__(12).f});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(7)
	  , core      = __webpack_require__(8)
	  , ctx       = __webpack_require__(9)
	  , hide      = __webpack_require__(11)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 7 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(10);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(12)
	  , createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(16) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(13)
	  , IE8_DOM_DEFINE = __webpack_require__(15)
	  , toPrimitive    = __webpack_require__(19)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(16) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(16) && !__webpack_require__(17)(function(){
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(17)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(14)
	  , document = __webpack_require__(7).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(14);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getPrototypeOf = __webpack_require__(22);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(33);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function rnd(n) {
	  return Math.floor(Math.random() * n);
	}

	var uvs = [[[0, 0], [0, 1], [1, 0], [1, 1]], [[0, 1], [1, 1], [0, 0], [1, 0]]];

	var UnfoldCubeBufferGeometry = function (_THREE$BufferGeometry) {
	  (0, _inherits3.default)(UnfoldCubeBufferGeometry, _THREE$BufferGeometry);

	  function UnfoldCubeBufferGeometry() {
	    var base = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	    var thickness = arguments.length <= 1 || arguments[1] === undefined ? 0.1 : arguments[1];
	    (0, _classCallCheck3.default)(this, UnfoldCubeBufferGeometry);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UnfoldCubeBufferGeometry).call(this));

	    _this.type = 'UnfoldCubeBufferGeometry';

	    var points = [[-base / 2, 1.5 * base], // 0
	    [base / 2, 1.5 * base], // 1
	    [-1.5 * base, base / 2], // 2
	    [-base / 2, base / 2], // 3
	    [base / 2, base / 2], // 4
	    [1.5 * base, base / 2], // 5
	    [-1.5 * base, -base / 2], // 6
	    [-base / 2, -base / 2], // 7
	    [base / 2, -base / 2], // 8
	    [1.5 * base, -base / 2], // 9
	    [-base / 2, -1.5 * base], // 10
	    [base / 2, -1.5 * base] // 11
	    ];

	    var faceCount = 22,
	        vertexCount = faceCount * 4 //points.length * 2
	    ,
	        indexCount = faceCount * 6; //22 * 6;

	    _this.vertexBufferOffset = 0;
	    _this.uvBufferOffset = 0;
	    _this.indexBufferOffset = 0;
	    _this.groupStart = 0;
	    _this.numberOfVertices = 0;

	    _this.indices = new Uint16Array(indexCount);
	    _this.vertices = new Float32Array(vertexCount * 3);
	    _this.normals = new Float32Array(vertexCount * 3);
	    _this.uvs = new Float32Array(vertexCount * 2);

	    _this.buildFace('x', 'y', 'z', -base / 2, thickness, base / 2, base, base, 0, 0);
	    _this.buildFace('x', 'y', 'z', -base / 2, -thickness, base / 2, base, base, 0, 0);
	    _this.buildFace('x', 'z', 'y', -base / 2, 1.5 * base, -thickness, base, 2 * thickness, 0, 0, true);

	    _this.buildFace('x', 'y', 'z', -1.5 * base, thickness, -base / 2, base, base, 1, 1);
	    _this.buildFace('x', 'y', 'z', -1.5 * base, -thickness, -base / 2, base, base, 1, 1);
	    _this.buildFace('z', 'x', 'y', -base / 2, -1.5 * base, -thickness, base, 2 * thickness, 1, 0);

	    _this.buildFace('x', 'y', 'z', -base / 2, thickness, -base / 2, base, base, 2, 0);
	    _this.buildFace('x', 'y', 'z', -base / 2, -thickness, -base / 2, base, base, 3, 0);

	    _this.buildFace('x', 'z', 'y', -1.5 * base, -base / 2, -thickness, base, 2 * thickness, 2, 0, true);
	    _this.buildFace('x', 'z', 'y', 0.5 * base, -base / 2, -thickness, base, 2 * thickness, 2, 0, true);
	    _this.buildFace('x', 'z', 'y', -1.5 * base, base / 2, -thickness, base, 2 * thickness, 2, 0, true);
	    _this.buildFace('x', 'z', 'y', 0.5 * base, base / 2, -thickness, base, 2 * thickness, 2, 0, true);

	    _this.buildFace('z', 'x', 'y', -1.5 * base, -base / 2, -thickness, base, 2 * thickness, 2, 0);
	    _this.buildFace('z', 'x', 'y', 0.5 * base, -base / 2, -thickness, base, 2 * thickness, 2, 0);
	    _this.buildFace('z', 'x', 'y', -1.5 * base, base / 2, -thickness, base, 2 * thickness, 2, 0);
	    _this.buildFace('z', 'x', 'y', 0.5 * base, base / 2, -thickness, base, 2 * thickness, 2, 0);

	    _this.buildFace('x', 'y', 'z', base / 2, thickness, -base / 2, base, base, 4, 1);
	    _this.buildFace('x', 'y', 'z', base / 2, -thickness, -base / 2, base, base, 4, 1);
	    _this.buildFace('z', 'x', 'y', -base / 2, 1.5 * base, -thickness, base, 2 * thickness, 4, 0);

	    _this.buildFace('x', 'y', 'z', -base / 2, thickness, -1.5 * base, base, base, 5, 0);
	    _this.buildFace('x', 'y', 'z', -base / 2, -thickness, -1.5 * base, base, base, 5, 0);
	    _this.buildFace('x', 'z', 'y', -base / 2, -1.5 * base, -thickness, base, 2 * thickness, 5, 0, true);

	    _this.setIndex(new THREE.BufferAttribute(_this.indices, 1));
	    _this.addAttribute('position', new THREE.BufferAttribute(_this.vertices, 3));
	    _this.addAttribute('normal', new THREE.BufferAttribute(_this.normals, 3));
	    _this.addAttribute('uv', new THREE.BufferAttribute(_this.uvs, 2));
	    return _this;
	  }

	  (0, _createClass3.default)(UnfoldCubeBufferGeometry, [{
	    key: 'buildFace',
	    value: function buildFace(ax, ay, az, x, y, z, w, h, mat) {
	      var _this2 = this;

	      var uvo = arguments.length <= 9 || arguments[9] === undefined ? 0 : arguments[9];
	      var forceNormal = arguments.length <= 10 || arguments[10] === undefined ? false : arguments[10];

	      var vertexCounter = 0,
	          groupCount = 0,
	          vector = new THREE.Vector3();

	      [x, x + w].forEach(function (ix) {
	        [z, z + h].forEach(function (iz) {
	          vector[ax] = ix;
	          vector[ay] = y;
	          vector[az] = iz;

	          _this2.vertices[_this2.vertexBufferOffset + 0] = vector.x;
	          _this2.vertices[_this2.vertexBufferOffset + 1] = vector.y;
	          _this2.vertices[_this2.vertexBufferOffset + 2] = vector.z;

	          vector[ax] = 0;
	          vector[ay] = y > 0 ? 1 : -1;
	          vector[az] = 0;

	          _this2.normals[_this2.vertexBufferOffset + 0] = vector.x;
	          _this2.normals[_this2.vertexBufferOffset + 1] = vector.y;
	          _this2.normals[_this2.vertexBufferOffset + 2] = vector.z;

	          _this2.uvs[_this2.uvBufferOffset + 0] = uvs[uvo][vertexCounter][0]; //(ix - x) / w;
	          _this2.uvs[_this2.uvBufferOffset + 1] = uvs[uvo][vertexCounter][1]; //(iz - z) / h;

	          _this2.vertexBufferOffset += 3;
	          _this2.uvBufferOffset += 2;

	          vertexCounter++;
	        });
	      });

	      var a = this.numberOfVertices,
	          b = this.numberOfVertices + 1,
	          c = this.numberOfVertices + 2,
	          d = this.numberOfVertices + 3;

	      if (y < 0 && !forceNormal || y > 0 && forceNormal) {
	        c = this.numberOfVertices + 1;
	        b = this.numberOfVertices + 2;
	      }

	      this.indices[this.indexBufferOffset + 0] = a;
	      this.indices[this.indexBufferOffset + 1] = b;
	      this.indices[this.indexBufferOffset + 2] = c;

	      this.indices[this.indexBufferOffset + 3] = c;
	      this.indices[this.indexBufferOffset + 4] = b;
	      this.indices[this.indexBufferOffset + 5] = d;

	      this.indexBufferOffset += 6;
	      groupCount += 6;
	      this.numberOfVertices += vertexCounter;

	      this.addGroup(this.groupStart, groupCount, mat);
	      this.groupStart += groupCount;
	    }
	  }]);
	  return UnfoldCubeBufferGeometry;
	}(THREE.BufferGeometry);

	var UnfoldCubeGeometry = function (_THREE$Geometry) {
	  (0, _inherits3.default)(UnfoldCubeGeometry, _THREE$Geometry);

	  function UnfoldCubeGeometry() {
	    var base = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	    var thickness = arguments.length <= 1 || arguments[1] === undefined ? 0.1 : arguments[1];
	    (0, _classCallCheck3.default)(this, UnfoldCubeGeometry);

	    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UnfoldCubeGeometry).call(this));

	    _this3.fromBufferGeometry(new UnfoldCubeBufferGeometry(base, thickness));
	    _this3.mergeVertices();
	    return _this3;
	  }

	  return UnfoldCubeGeometry;
	}(THREE.Geometry);

	module.exports = {
	  randomStripes: function randomStripes() {
	    var c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	        w = [0, 1, 2, 3, 4, 5],
	        x1 = rnd(w.length),
	        x2 = rnd(w.length - 1);

	    if (x2 >= x1) x2++;

	    w.push(x1);w.push(x2);

	    var stripes = [];

	    for (var i = 0; i < 8; i++) {
	      var j = rnd(c.length);
	      var s = c[j];
	      c.splice(j, 1);
	      j = rnd(w.length);
	      s += 10 * w[j];
	      w.splice(j, 1);
	      stripes.push(s);
	    }

	    return stripes;
	  },

	  UnfoldCubeGeometry: UnfoldCubeGeometry,

	  createUnfoldCube2: function createUnfoldCube2() {
	    var base = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	    var thickness = arguments.length <= 1 || arguments[1] === undefined ? 0.1 : arguments[1];

	    var openedCube = new THREE.Geometry();

	    var vertices = [new THREE.Vector3(-base / 2, 0, 1.5 * base), // 0
	    new THREE.Vector3(base / 2, 0, 1.5 * base), // 1
	    new THREE.Vector3(-1.5 * base, 0, base / 2), // 2
	    new THREE.Vector3(-base / 2, 0, base / 2), // 3
	    new THREE.Vector3(base / 2, 0, base / 2), // 4
	    new THREE.Vector3(1.5 * base, 0, base / 2), // 5
	    new THREE.Vector3(-1.5 * base, 0, -base / 2), // 6
	    new THREE.Vector3(-base / 2, 0, -base / 2), // 7
	    new THREE.Vector3(base / 2, 0, -base / 2), // 8
	    new THREE.Vector3(1.5 * base, 0, -base / 2), // 9
	    new THREE.Vector3(-base / 2, 0, -1.5 * base), // 10
	    new THREE.Vector3(base / 2, 0, -1.5 * base) // 11
	    ];

	    var faces = [[3, 0, 1, 0, [[0, 0], [0, 1], [1, 1]]], [1, 4, 3, 0, [[1, 1], [1, 0], [0, 0]]], [2, 3, 6, 1, [[1, 1], [1, 0], [1, 0]]], [3, 7, 6, 1, [[1, 1], [0, 0], [0, 1]]], [3, 4, 7, 2, [[0, 1], [1, 1], [0, 0]]], [4, 8, 7, 3, [[1, 1], [1, 0], [0, 0]]], [4, 5, 8, 4, [[0, 0], [0, 1], [1, 0]]], [5, 9, 8, 4, [[0, 1], [1, 1], [1, 0]]], [7, 8, 10, 5, [[1, 0], [0, 0], [1, 1]]], [8, 11, 10, 5, [[0, 0], [0, 1], [1, 1]]]];

	    var vertexOffset = 0,
	        faceOffset = 0;

	    faces.forEach(function (f) {
	      if (!openedCube.faceVertexUvs[f[3]]) {
	        openedCube.faceVertexUvs[f[3]] = [];
	      }

	      openedCube.vertices.push(vertices[f[0]].clone().setY(thickness), vertices[f[1]].clone().setY(thickness), vertices[f[2]].clone().setY(thickness));

	      openedCube.faces.push(new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2, null, null, f[3]));

	      if (!openedCube.faceVertexUvs[f[3]][faceOffset]) {
	        openedCube.faceVertexUvs[faceOffset] = [];
	      }

	      for (var i = 0; i < 3; i++) {
	        openedCube.faceVertexUvs[f[3]][faceOffset].push(new THREE.Vector2(f[4][i][0], f[4][i][0]));
	      }

	      faceOffset++;
	      vertexOffset += 3;

	      openedCube.vertices.push(vertices[f[0]].clone().setY(-thickness), vertices[f[2]].clone().setY(-thickness), vertices[f[1]].clone().setY(-thickness));

	      if (!openedCube.faceVertexUvs[f[3]][faceOffset]) {
	        openedCube.faceVertexUvs[faceOffset] = [];
	      }

	      openedCube.faces.push(new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2, null, null, f[3]));

	      [0, 2, 1].forEach(function (i) {
	        openedCube.faceVertexUvs[f[3]][faceOffset].push(new THREE.Vector2(f[4][i][0], f[4][i][0]));
	      });

	      faceOffset++;
	      vertexOffset += 3;
	    });

	    /*[thickness, -thickness].forEach((y) => {
	      openedCube.vertices.push(
	        vertices[0],
	      );
	    });
	     let addFace = (a, b, c, mat) => {
	      openedCube.faces.push(
	        new THREE.Face3(a, b, c,  null, null, mat),
	        new THREE.Face3(a + 12, c + 12, b + 12,  null, null, mat)
	      );
	    };
	     addFace(3, 0, 1, 0);
	    addFace(1, 4, 3, 0);
	    addFace(2, 3, 6, 1);
	    addFace(3, 7, 6, 1);
	    addFace(3, 4, 7, 2);
	    addFace(4, 8, 7, 3);
	    addFace(4, 5, 8, 4);
	    addFace(5, 9, 8, 4);
	    addFace(7, 8, 10, 5);
	    addFace(8, 11, 10, 5);*/

	    function sideFace(a, b, normal) {
	      var mat = arguments.length <= 3 || arguments[3] === undefined ? 2 : arguments[3];

	      openedCube.vertices.push(vertices[a].clone().setY(thickness), vertices[a].clone().setY(-thickness), vertices[b].clone().setY(thickness));

	      openedCube.faces.push(new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2, null, null, mat));

	      vertexOffset += 3;

	      openedCube.vertices.push(vertices[b].clone().setY(thickness), vertices[a].clone().setY(-thickness), vertices[b].clone().setY(-thickness));

	      openedCube.faces.push(new THREE.Face3(vertexOffset, vertexOffset + 1, vertexOffset + 2, null, null, mat));

	      vertexOffset += 3;
	    }

	    sideFace(3, 0);
	    sideFace(6, 2);
	    sideFace(10, 7);
	    sideFace(0, 1);
	    sideFace(2, 3);
	    sideFace(4, 5);
	    sideFace(1, 4);
	    sideFace(5, 9);
	    sideFace(8, 11);
	    sideFace(9, 8);
	    sideFace(11, 10);
	    sideFace(7, 6);

	    openedCube.elementsNeedUpdate = true;
	    openedCube.verticesNeedUpdate = true;
	    openedCube.groupsNeedUpdate = true;
	    openedCube.uvsNeedUpdate = true;
	    openedCube.sortFacesByMaterialIndex();
	    openedCube.computeBoundingSphere();
	    openedCube.computeFaceNormals();

	    /*let geometry = new THREE.BufferGeometry();
	    geometry.fromGeometry(openedCube);*/

	    return openedCube;
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(23), __esModule: true };

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(24);
	module.exports = __webpack_require__(8).Object.getPrototypeOf;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(25)
	  , $getPrototypeOf = __webpack_require__(27);

	__webpack_require__(32)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(26);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(28)
	  , toObject    = __webpack_require__(25)
	  , IE_PROTO    = __webpack_require__(29)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(30)('keys')
	  , uid    = __webpack_require__(31);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(6)
	  , core    = __webpack_require__(8)
	  , fails   = __webpack_require__(17);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(34);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(35);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(64);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(36), __esModule: true };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(37);
	__webpack_require__(59);
	module.exports = __webpack_require__(63).f('iterator');

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(38)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(40)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(39)
	  , defined   = __webpack_require__(26);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(41)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(42)
	  , hide           = __webpack_require__(11)
	  , has            = __webpack_require__(28)
	  , Iterators      = __webpack_require__(43)
	  , $iterCreate    = __webpack_require__(44)
	  , setToStringTag = __webpack_require__(57)
	  , getPrototypeOf = __webpack_require__(27)
	  , ITERATOR       = __webpack_require__(58)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(45)
	  , descriptor     = __webpack_require__(20)
	  , setToStringTag = __webpack_require__(57)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(11)(IteratorPrototype, __webpack_require__(58)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(13)
	  , dPs         = __webpack_require__(46)
	  , enumBugKeys = __webpack_require__(55)
	  , IE_PROTO    = __webpack_require__(29)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(18)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(56).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(12)
	  , anObject = __webpack_require__(13)
	  , getKeys  = __webpack_require__(47);

	module.exports = __webpack_require__(16) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(48)
	  , enumBugKeys = __webpack_require__(55);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(28)
	  , toIObject    = __webpack_require__(49)
	  , arrayIndexOf = __webpack_require__(52)(false)
	  , IE_PROTO     = __webpack_require__(29)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(50)
	  , defined = __webpack_require__(26);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(51);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(49)
	  , toLength  = __webpack_require__(53)
	  , toIndex   = __webpack_require__(54);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(39)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(39)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 55 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7).document && document.documentElement;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(12).f
	  , has = __webpack_require__(28)
	  , TAG = __webpack_require__(58)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(30)('wks')
	  , uid        = __webpack_require__(31)
	  , Symbol     = __webpack_require__(7).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);
	var global        = __webpack_require__(7)
	  , hide          = __webpack_require__(11)
	  , Iterators     = __webpack_require__(43)
	  , TO_STRING_TAG = __webpack_require__(58)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(61)
	  , step             = __webpack_require__(62)
	  , Iterators        = __webpack_require__(43)
	  , toIObject        = __webpack_require__(49);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(40)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(58);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	__webpack_require__(77);
	__webpack_require__(78);
	__webpack_require__(79);
	module.exports = __webpack_require__(8).Symbol;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(7)
	  , has            = __webpack_require__(28)
	  , DESCRIPTORS    = __webpack_require__(16)
	  , $export        = __webpack_require__(6)
	  , redefine       = __webpack_require__(42)
	  , META           = __webpack_require__(67).KEY
	  , $fails         = __webpack_require__(17)
	  , shared         = __webpack_require__(30)
	  , setToStringTag = __webpack_require__(57)
	  , uid            = __webpack_require__(31)
	  , wks            = __webpack_require__(58)
	  , wksExt         = __webpack_require__(63)
	  , wksDefine      = __webpack_require__(68)
	  , keyOf          = __webpack_require__(69)
	  , enumKeys       = __webpack_require__(70)
	  , isArray        = __webpack_require__(73)
	  , anObject       = __webpack_require__(13)
	  , toIObject      = __webpack_require__(49)
	  , toPrimitive    = __webpack_require__(19)
	  , createDesc     = __webpack_require__(20)
	  , _create        = __webpack_require__(45)
	  , gOPNExt        = __webpack_require__(74)
	  , $GOPD          = __webpack_require__(76)
	  , $DP            = __webpack_require__(12)
	  , $keys          = __webpack_require__(47)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(75).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(72).f  = $propertyIsEnumerable;
	  __webpack_require__(71).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(41)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(11)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(31)('meta')
	  , isObject = __webpack_require__(14)
	  , has      = __webpack_require__(28)
	  , setDesc  = __webpack_require__(12).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(17)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(7)
	  , core           = __webpack_require__(8)
	  , LIBRARY        = __webpack_require__(41)
	  , wksExt         = __webpack_require__(63)
	  , defineProperty = __webpack_require__(12).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(47)
	  , toIObject = __webpack_require__(49);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(47)
	  , gOPS    = __webpack_require__(71)
	  , pIE     = __webpack_require__(72);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 72 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(51);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(49)
	  , gOPN      = __webpack_require__(75).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(48)
	  , hiddenKeys = __webpack_require__(55).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(72)
	  , createDesc     = __webpack_require__(20)
	  , toIObject      = __webpack_require__(49)
	  , toPrimitive    = __webpack_require__(19)
	  , has            = __webpack_require__(28)
	  , IE8_DOM_DEFINE = __webpack_require__(15)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(16) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68)('asyncIterator');

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68)('observable');

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(81);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(85);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(34);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83);
	module.exports = __webpack_require__(8).Object.setPrototypeOf;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(6);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(84).set});

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(14)
	  , anObject = __webpack_require__(13);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(9)(Function.call, __webpack_require__(76).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87);
	var $Object = __webpack_require__(8).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(6)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(45)});

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(89);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(91)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(90)();
	// imports


	// module
	exports.push([module.id, "html, body {\n  margin: 0px;\n  background-color: #111111; }\n\n#container {\n  min-height: 100%;\n  min-width: 100%;\n  height: 100%;\n  width: 100%;\n  overflow: hidden;\n  position: relative; }\n  #container .on-grid-display {\n    display: none; }\n  #container .on-normal-display {\n    display: block; }\n  #container.grid-display .on-grid-display {\n    display: block; }\n  #container.grid-display .on-normal-display {\n    display: none; }\n  #container .on-unfold {\n    display: none; }\n  #container .on-fold {\n    display: block; }\n  #container.fold .on-unfold {\n    display: block; }\n  #container.fold .on-fold {\n    display: none; }\n  #container canvas {\n    width: 100%;\n    height: 100%; }\n  #container .progress {\n    position: absolute;\n    bottom: 15px;\n    right: 15px;\n    width: 256px;\n    height: 64px;\n    background-color: transparent;\n    color: #efefef;\n    font-size: 16px;\n    font-weight: bold; }\n  #container .finder {\n    position: absolute;\n    top: 15px;\n    right: 15px; }\n    #container .finder .open-finder, #container .finder .loader {\n      position: absolute;\n      right: 0px;\n      top: 0px; }\n      #container .finder .open-finder .fa-circle, #container .finder .loader .fa-circle {\n        color: #2e0e4b; }\n    #container .finder .loader {\n      top: 4px;\n      right: 3em;\n      display: none; }\n      #container .finder .loader.active {\n        display: block; }\n    #container .finder .finder-content {\n      display: none;\n      background-color: rgba(85, 26, 139, 0.75);\n      color: #efefef;\n      border-radius: 6px;\n      padding: 10px;\n      padding-top: 40px;\n      list-style-type: none; }\n      #container .finder .finder-content li {\n        margin: 5px; }\n    #container .finder.opened .finder-content {\n      display: block; }\n    #container .finder input, #container .finder button {\n      padding: 10px;\n      font-size: 16px;\n      width: 100%;\n      border: 1px solid #2e0e4b;\n      border-radius: 4px;\n      color: #efefef; }\n    #container .finder input {\n      background-color: #481676; }\n    #container .finder input::-webkit-input-placeholder {\n      color: #200a35; }\n    #container .finder button {\n      background-color: #2e0e4b; }\n      #container .finder button:hover {\n        background-color: #481676; }\n    #container .finder .search-box {\n      position: relative; }\n      #container .finder .search-box .fa-search {\n        position: absolute;\n        top: 10px;\n        left: 5px;\n        color: #2e0e4b; }\n      #container .finder .search-box .action.clear {\n        position: absolute;\n        top: 10px;\n        right: 5px;\n        color: #2e0e4b; }\n      #container .finder .search-box input {\n        padding-left: 26px;\n        padding-right: 26px; }\n    #container .finder input[type=\"range\"] {\n      -webkit-appearance: none !important;\n      /*Needed to reset default slider styles */\n      width: 100%;\n      height: 15px;\n      background-color: #481676;\n      border: 1px solid #2e0e4b;\n      border-radius: 10px;\n      margin: auto;\n      transition: all 0.3s ease; }\n      #container .finder input[type=\"range\"]:hover {\n        background-color: #3b1260; }\n    #container .finder input[type=\"range\"]::-webkit-slider-thumb {\n      -webkit-appearance: none !important;\n      width: 20px;\n      height: 20px;\n      background-color: #2e0e4b;\n      border-radius: 30px;\n      box-shadow: 0px 0px 3px #2e0e4b;\n      transition: all 0.5s ease; }\n      #container .finder input[type=\"range\"]::-webkit-slider-thumb:hover {\n        background-color: #200a35; }\n", ""]);

	// exports


/***/ },
/* 90 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
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


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
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

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
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

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _getIterator2 = __webpack_require__(93);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _classCallCheck2 = __webpack_require__(1);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(2);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _util = __webpack_require__(21);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var COLORS = __webpack_require__(98).colors,
	    WIDTHS = [2 / 11.0, 3 / 11.0, 5 / 11.0, 7 / 11.0, 9 / 11.0, 1],
	    cube = new THREE.BoxGeometry(1.75, 1.75, 1.75),
	    unfoldCube = new _util.UnfoldCubeGeometry(0.5, 0.05)
	//, openCabin     = createUnfoldCube(1, 0.05)
	,
	    whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
	    redMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 }); //canvasMaterial(whiteCanvas());

	var materials = {};

	function getFaceMaterial(s1, s2) {
	  var id = s1 + '_' + s2;

	  if (!materials[id]) {
	    materials[id] = faceMaterial(s1, s2);
	  }

	  return materials[id];
	}

	function faceMaterial(s1, s2) {
	  var c1 = s1 % COLORS.length,
	      w1 = Math.floor(s1 / COLORS.length),
	      c2 = s2 % COLORS.length,
	      w2 = Math.floor(s2 / COLORS.length),
	      canvas = whiteCanvas(),
	      ctx = canvas.getContext("2d");

	  ctx.fillStyle = COLORS[c1];
	  ctx.fillRect(64 * (1 - WIDTHS[w1]), 0, 128 * WIDTHS[w1], 256);
	  ctx.fillStyle = COLORS[c2];
	  ctx.fillRect(128 + 64 * (1 - WIDTHS[w2]), 0, 128 * WIDTHS[w2], 256);

	  return canvasMaterial(canvas);
	}

	function whiteCanvas() {
	  var canvas = document.createElement("canvas");
	  var ctx = canvas.getContext("2d");

	  canvas.width = canvas.height = 256;
	  ctx.fillStyle = "#fff";
	  ctx.fillRect(0, 0, 256, 256);

	  return canvas;
	}

	function canvasMaterial(canvas) {
	  var map = new THREE.Texture(canvas);
	  map.needsUpdate = true;

	  return new THREE.MeshBasicMaterial({ map: map });
	}

	function convertColorsToMaterial(colors) {
	  var w = whiteMaterial.clone();

	  var materials = [faceMaterial(colors[2], colors[3]), faceMaterial(colors[6], colors[7]), w, w, faceMaterial(colors[0], colors[1]), faceMaterial(colors[4], colors[5])];

	  return new THREE.MultiMaterial(materials);
	}

	var Cabin = function () {
	  function Cabin(data, renderer) {
	    (0, _classCallCheck3.default)(this, Cabin);

	    this._id = data.id;
	    this._x = data.x;
	    this._z = data.y;
	    this._angle = data.angle * Math.PI / 180;
	    this._unfold = false;
	    this._renderer = renderer;

	    //this._mesh = new THREE.Mesh(unfoldCube, whiteMaterial);
	    this._mesh = new THREE.Mesh(cube, whiteMaterial); //convertColorsToMaterial(data.colors));
	    this._mesh.position.x = this._x;
	    this._mesh.position.z = this._z;
	    this._mesh.rotation.y = this._angle;
	    this._mesh.matrixAutoUpdate = false;
	    this._mesh.updateMatrix();
	  }

	  (0, _createClass3.default)(Cabin, [{
	    key: 'toggleUnfold',
	    value: function toggleUnfold() {
	      this._unfold = !this._unfold;

	      if (this._unfold) {
	        this._mesh.geometry = unfoldCube;
	      } else {
	        this._mesh.geometry = cube;
	      }

	      this._mesh.geometry.needsUpdate = true;
	    }
	  }, {
	    key: 'goOnGrid',
	    value: function goOnGrid() {
	      var _this = this;

	      var factor = arguments.length <= 0 || arguments[0] === undefined ? 3 : arguments[0];

	      createjs.Tween.get(this._mesh.rotation).to({ y: 0 }, 1000);
	      createjs.Tween.get(this._mesh.position).to({
	        x: this.gridX * factor,
	        z: this.gridY * factor
	      }, 1000).addEventListener("change", function () {
	        _this._mesh.matrixAutoUpdate = false;
	        _this._mesh.updateMatrix();

	        _this._renderer.askForRendering();
	      });

	      /*this._mesh.position.x = this.gridX * factor;
	      this._mesh.position.z = this.gridY * factor;
	       this._mesh.rotation.y = 0;
	      this._mesh.matrixAutoUpdate = false;
	      this._mesh.updateMatrix();*/
	    }
	  }, {
	    key: 'resetPosition',
	    value: function resetPosition() {
	      var _this2 = this;

	      var factor = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	      createjs.Tween.get(this._mesh.rotation).to({ y: this._angle }, 1000);
	      createjs.Tween.get(this._mesh.position).to({
	        x: factor * this._x,
	        z: factor * this._z
	      }, 1000).addEventListener("change", function () {
	        _this2._mesh.matrixAutoUpdate = false;
	        _this2._mesh.updateMatrix();

	        _this2._renderer.askForRendering();
	      });

	      /*this._mesh.position.x = this._x;
	      this._mesh.position.z = this._z;
	      this._mesh.rotation.y = this._angle;
	      this._mesh.matrixAutoUpdate = false;
	      this._mesh.updateMatrix();*/
	    }
	  }, {
	    key: 'id',
	    get: function get() {
	      return this._id;
	    }
	  }, {
	    key: 'mesh',
	    get: function get() {
	      return this._mesh;
	    }
	  }, {
	    key: 'x',
	    get: function get() {
	      return this._x;
	    }
	  }, {
	    key: 'z',
	    get: function get() {
	      return this._z;
	    }
	  }, {
	    key: 'colors',
	    set: function set(colors) {
	      var material = convertColorsToMaterial(colors);
	      material.needsUpdate = true;

	      this._colors = colors;
	      this._mesh.material = material;
	    }
	  }, {
	    key: 'gridX',
	    set: function set(gridX) {
	      this._gridX = gridX;
	    },
	    get: function get() {
	      return this._gridX;
	    }
	  }, {
	    key: 'gridY',
	    set: function set(gridY) {
	      this._gridY = gridY;
	    },
	    get: function get() {
	      return this._gridY;
	    }
	  }, {
	    key: 'transparent',
	    set: function set(v) {
	      var t = true,
	          o = v;

	      if (v >= 1) {
	        t = false;
	        o = 1;
	      }

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = (0, _getIterator3.default)(this._mesh.material.materials), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var material = _step.value;

	          material.transparent = t;
	          material.opacity = o;
	          material.needsUpdate = true;
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      this._mesh.material.needsUpdate = true;
	    }
	  }]);
	  return Cabin;
	}();

	module.exports = Cabin;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(94), __esModule: true };

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59);
	__webpack_require__(37);
	module.exports = __webpack_require__(95);

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(13)
	  , get      = __webpack_require__(96);
	module.exports = __webpack_require__(8).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(97)
	  , ITERATOR  = __webpack_require__(58)('iterator')
	  , Iterators = __webpack_require__(43);
	module.exports = __webpack_require__(8).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(51)
	  , TAG = __webpack_require__(58)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = {
		"colors": [
			"#e53517",
			"#ff9f00",
			"#ffed00",
			"#4df18c",
			"#00acff",
			"#6e1ec7",
			"#bee1e9",
			"#fadde4",
			"#97adc5",
			"#4b575f"
		]
	};

/***/ }
/******/ ]);