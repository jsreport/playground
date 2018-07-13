/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	var _save = __webpack_require__(2);
	
	var _save2 = _interopRequireDefault(_save);
	
	var _initialize = __webpack_require__(55);
	
	var _initialize2 = _interopRequireDefault(_initialize);
	
	var _setDefault = __webpack_require__(66);
	
	var _setDefault2 = _interopRequireDefault(_setDefault);
	
	var _addToolbarComponents = __webpack_require__(67);
	
	var _addToolbarComponents2 = _interopRequireDefault(_addToolbarComponents);
	
	var _Startup = __webpack_require__(71);
	
	var _Startup2 = _interopRequireDefault(_Startup);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	var getQueryParameter = function getQueryParameter(name) {
	  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	
	var originalError = console.error.bind(console);
	var errorLimit = 10;
	var logError = function logError(m) {
	  if (errorLimit-- < 0) {
	    return;
	  }
	
	  _jsreportStudio2.default.api.post('/odata/errors', { data: { message: m, url: window.location.href } });
	};
	
	window.onerror = function (msg, url, line, col, error) {
	  var extra = !col ? '' : '\ncolumn: ' + col;
	  extra += !error ? '' : '\nerror: ' + error;
	  msg += '\nurl: ' + url + '\nline: ' + line + extra;
	  logError(msg);
	};
	
	console.error = function () {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var msg = args.map(function (a) {
	    return a.stack || a;
	  }).join();
	  logError(msg);
	  originalError.apply(undefined, args);
	};
	
	_jsreportStudio2.default.workspaces = {
	  current: {},
	  save: _save2.default,
	  setDefault: _setDefault2.default
	};
	var isEmbed = getQueryParameter('embed') != null;
	(0, _addToolbarComponents2.default)(isEmbed);
	
	_jsreportStudio2.default.addEditorComponent('Help', _Startup2.default);
	_jsreportStudio2.default.shouldOpenStartupPage = false;
	_jsreportStudio2.default.initializeListeners.push(_initialize2.default);
	_jsreportStudio2.default.locationResolver = function () {
	  return '/studio/workspace/' + _jsreportStudio2.default.workspaces.current.shortid + '/' + _jsreportStudio2.default.workspaces.current.version;
	};
	_jsreportStudio2.default.removeHandler = function (id) {
	  return _jsreportStudio2.default.removeEntity(id);
	};
	
	_jsreportStudio2.default.previewListeners.push(function (req, entities) {
	  req.template.workspaceShortid = _jsreportStudio2.default.workspaces.current.shortid;
	  req.template.workspaceVersion = _jsreportStudio2.default.workspaces.current.version;
	});
	
	_jsreportStudio2.default.readyListeners.push(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	  var entities, entity;
	  return regeneratorRuntime.wrap(function _callee$(_context) {
	    while (1) {
	      switch (_context.prev = _context.next) {
	        case 0:
	          if (isEmbed) {
	            _jsreportStudio2.default.collapseLeftPane();
	          } else {
	            _jsreportStudio2.default.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Get Started' });
	          }
	
	          entities = _jsreportStudio2.default.getAllEntities();
	
	          if (!(entities.length < 5)) {
	            _context.next = 5;
	            break;
	          }
	
	          _context.next = 5;
	          return Promise.all(entities.map(function (v) {
	            return _jsreportStudio2.default.openTab({ _id: v._id });
	          }));
	
	        case 5:
	
	          if (_jsreportStudio2.default.workspaces.current.default) {
	            entity = _jsreportStudio2.default.getEntityByShortid(_jsreportStudio2.default.workspaces.current.default, false);
	
	            if (entity) {
	              _jsreportStudio2.default.openTab({ _id: entity._id });
	            }
	          }
	
	        case 6:
	        case 'end':
	          return _context.stop();
	      }
	    }
	  }, _callee, undefined);
	})));
	
	_jsreportStudio2.default.referencesLoader = function () {
	  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(entitySet) {
	    var nameAttribute, referenceAttributes, response;
	    return regeneratorRuntime.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:
	            nameAttribute = _jsreportStudio2.default.entitySets[entitySet].nameAttribute;
	            referenceAttributes = _jsreportStudio2.default.entitySets[entitySet].referenceAttributes;
	            _context2.next = 4;
	            return _jsreportStudio2.default.api.get('/odata/' + entitySet + '?$filter=workspaceVersion eq ' + _jsreportStudio2.default.workspaces.current.version + ' and workspaceShortid eq \'' + _jsreportStudio2.default.workspaces.current.shortid + '\'&$select=' + referenceAttributes + '&$orderby=' + nameAttribute);
	
	          case 4:
	            response = _context2.sent;
	            return _context2.abrupt('return', response.value);
	
	          case 6:
	          case 'end':
	            return _context2.stop();
	        }
	      }
	    }, _callee2, undefined);
	  }));
	
	  return function (_x) {
	    return _ref2.apply(this, arguments);
	  };
	}();

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Studio;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	var _assign2 = __webpack_require__(3);
	
	var _assign3 = _interopRequireDefault(_assign2);
	
	var _bluebird = __webpack_require__(54);
	
	var _bluebird2 = _interopRequireDefault(_bluebird);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	exports.default = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
	  var entities, template, previousVersion;
	  return regeneratorRuntime.wrap(function _callee2$(_context2) {
	    while (1) {
	      switch (_context2.prev = _context2.next) {
	        case 0:
	          _jsreportStudio2.default.startProgress();
	
	          entities = _jsreportStudio2.default.getAllEntities();
	
	
	          if (!_jsreportStudio2.default.workspaces.current.name) {
	            template = entities.find(function (e) {
	              return e.__entitySet === 'templates';
	            });
	
	            if (template) {
	              _jsreportStudio2.default.workspaces.current.name = template.name;
	            }
	          }
	
	          previousVersion = _jsreportStudio2.default.workspaces.current.version;
	          _context2.next = 6;
	          return _jsreportStudio2.default.api.post('/odata/workspaces', {
	            data: {
	              shortid: _jsreportStudio2.default.workspaces.current.shortid,
	              name: _jsreportStudio2.default.workspaces.current.name,
	              default: _jsreportStudio2.default.workspaces.current.default
	            }
	          });
	
	        case 6:
	          _jsreportStudio2.default.workspaces.current = _context2.sent;
	
	
	          _jsreportStudio2.default.setRequestHeader('workspace-shortid', _jsreportStudio2.default.workspaces.current.shortid);
	          _jsreportStudio2.default.setRequestHeader('workspace-version', _jsreportStudio2.default.workspaces.current.version);
	
	          _context2.next = 11;
	          return _bluebird2.default.all(entities.map(function () {
	            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(e) {
	              var post, loaded, oldId, response;
	              return regeneratorRuntime.wrap(function _callee$(_context) {
	                while (1) {
	                  switch (_context.prev = _context.next) {
	                    case 0:
	                      post = (0, _assign3.default)({}, e);
	
	                      if (!(!e.__isLoaded && !e.__isNew)) {
	                        _context.next = 6;
	                        break;
	                      }
	
	                      _context.next = 4;
	                      return _jsreportStudio2.default.api.get('/odata/' + e.__entitySet + '?$filter=workspaceVersion eq ' + previousVersion + ' and workspaceShortid eq \'' + _jsreportStudio2.default.workspaces.current.shortid + '\' and shortid eq \'' + e.shortid + '\'');
	
	                    case 4:
	                      loaded = _context.sent;
	
	                      post = (0, _assign3.default)({}, loaded.value[0], post);
	
	                    case 6:
	
	                      post = _jsreportStudio2.default.entities.actions.prune(post);
	
	                      post.workspaceShortid = _jsreportStudio2.default.workspaces.current.shortid;
	                      post.workspaceVersion = _jsreportStudio2.default.workspaces.current.version;
	                      oldId = post._id;
	
	                      delete post._id;
	                      _context.next = 13;
	                      return _jsreportStudio2.default.api.post('/odata/' + e.__entitySet, { data: post });
	
	                    case 13:
	                      response = _context.sent;
	
	                      post._id = response._id;
	                      post.__entitySet = e.__entitySet;
	                      post.__isLoaded = e.__isLoaded || e.__isNew;
	
	                      _jsreportStudio2.default.replaceEntity(oldId, post);
	
	                    case 18:
	                    case 'end':
	                      return _context.stop();
	                  }
	                }
	              }, _callee, undefined);
	            }));
	
	            return function (_x) {
	              return _ref2.apply(this, arguments);
	            };
	          }()));
	
	        case 11:
	
	          _jsreportStudio2.default.stopProgress();
	
	          return _context2.abrupt('return', 'block');
	
	        case 13:
	        case 'end':
	          return _context2.stop();
	      }
	    }
	  }, _callee2, undefined);
	}));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(4),
	    copyObject = __webpack_require__(22),
	    createAssigner = __webpack_require__(23),
	    isArrayLike = __webpack_require__(33),
	    isPrototype = __webpack_require__(36),
	    keys = __webpack_require__(37);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns own enumerable string keyed properties of source objects to the
	 * destination object. Source objects are applied from left to right.
	 * Subsequent sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object` and is loosely based on
	 * [`Object.assign`](https://mdn.io/Object/assign).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.10.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @see _.assignIn
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * function Bar() {
	 *   this.c = 3;
	 * }
	 *
	 * Foo.prototype.b = 2;
	 * Bar.prototype.d = 4;
	 *
	 * _.assign({ 'a': 0 }, new Foo, new Bar);
	 * // => { 'a': 1, 'c': 3 }
	 */
	var assign = createAssigner(function(object, source) {
	  if (isPrototype(source) || isArrayLike(source)) {
	    copyObject(source, keys(source), object);
	    return;
	  }
	  for (var key in source) {
	    if (hasOwnProperty.call(source, key)) {
	      assignValue(object, key, source[key]);
	    }
	  }
	});
	
	module.exports = assign;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(5),
	    eq = __webpack_require__(21);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignValue;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var defineProperty = __webpack_require__(6);
	
	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}
	
	module.exports = baseAssignValue;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(7);
	
	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());
	
	module.exports = defineProperty;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsNative = __webpack_require__(8),
	    getValue = __webpack_require__(20);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(9),
	    isMasked = __webpack_require__(17),
	    isObject = __webpack_require__(16),
	    toSource = __webpack_require__(19);
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	module.exports = baseIsNative;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isObject = __webpack_require__(16);
	
	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(11),
	    getRawTag = __webpack_require__(14),
	    objectToString = __webpack_require__(15);
	
	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}
	
	module.exports = baseGetTag;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(12);
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	module.exports = Symbol;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(13);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ },
/* 13 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(11);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
	
	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];
	
	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}
	
	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}
	
	module.exports = getRawTag;


/***/ },
/* 15 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var coreJsData = __webpack_require__(18);
	
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());
	
	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}
	
	module.exports = isMasked;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(12);
	
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];
	
	module.exports = coreJsData;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	module.exports = toSource;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}
	
	module.exports = getValue;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(4),
	    baseAssignValue = __webpack_require__(5);
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	
	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;
	
	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}
	
	module.exports = copyObject;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(24),
	    isIterateeCall = __webpack_require__(32);
	
	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;
	
	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;
	
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(25),
	    overRest = __webpack_require__(26),
	    setToString = __webpack_require__(28);
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}
	
	module.exports = baseRest;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(27);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}
	
	module.exports = overRest;


/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	module.exports = apply;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var baseSetToString = __webpack_require__(29),
	    shortOut = __webpack_require__(31);
	
	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);
	
	module.exports = setToString;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var constant = __webpack_require__(30),
	    defineProperty = __webpack_require__(6),
	    identity = __webpack_require__(25);
	
	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
	  return defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant(string),
	    'writable': true
	  });
	};
	
	module.exports = baseSetToString;


/***/ },
/* 30 */
/***/ function(module, exports) {

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}
	
	module.exports = constant;


/***/ },
/* 31 */
/***/ function(module, exports) {

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;
	
	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;
	
	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);
	
	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}
	
	module.exports = shortOut;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(21),
	    isArrayLike = __webpack_require__(33),
	    isIndex = __webpack_require__(35),
	    isObject = __webpack_require__(16);
	
	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(9),
	    isLength = __webpack_require__(34);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	module.exports = isArrayLike;


/***/ },
/* 34 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 35 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}
	
	module.exports = isIndex;


/***/ },
/* 36 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	module.exports = isPrototype;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var arrayLikeKeys = __webpack_require__(38),
	    baseKeys = __webpack_require__(51),
	    isArrayLike = __webpack_require__(33);
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}
	
	module.exports = keys;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(39),
	    isArguments = __webpack_require__(40),
	    isArray = __webpack_require__(43),
	    isBuffer = __webpack_require__(44),
	    isIndex = __webpack_require__(35),
	    isTypedArray = __webpack_require__(47);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;
	
	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = arrayLikeKeys;


/***/ },
/* 39 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	module.exports = baseTimes;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsArguments = __webpack_require__(41),
	    isObjectLike = __webpack_require__(42);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};
	
	module.exports = isArguments;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isObjectLike = __webpack_require__(42);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}
	
	module.exports = baseIsArguments;


/***/ },
/* 42 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 43 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(12),
	    stubFalse = __webpack_require__(46);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined;
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
	
	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse;
	
	module.exports = isBuffer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(45)(module)))

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 46 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsTypedArray = __webpack_require__(48),
	    baseUnary = __webpack_require__(49),
	    nodeUtil = __webpack_require__(50);
	
	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
	
	module.exports = isTypedArray;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(10),
	    isLength = __webpack_require__(34),
	    isObjectLike = __webpack_require__(42);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;
	
	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}
	
	module.exports = baseIsTypedArray;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}
	
	module.exports = baseUnary;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(13);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && freeGlobal.process;
	
	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());
	
	module.exports = nodeUtil;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(45)(module)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var isPrototype = __webpack_require__(36),
	    nativeKeys = __webpack_require__(52);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = baseKeys;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(53);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);
	
	module.exports = nativeKeys;


/***/ },
/* 53 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = Studio.libraries['bluebird'];

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	var _shortid = __webpack_require__(56);
	
	var _shortid2 = _interopRequireDefault(_shortid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	var workspaceRegex = /\/studio\/workspace\/([^/]+)\/([^/]+)/;
	var playgroundRegex = /[/]?playground\/([^/]+)[/]?([^/]+)?/;
	
	exports.default = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	  var match, response, oldMatch;
	  return regeneratorRuntime.wrap(function _callee$(_context) {
	    while (1) {
	      switch (_context.prev = _context.next) {
	        case 0:
	          match = workspaceRegex.exec(window.location.pathname);
	
	          if (!match) {
	            _context.next = 8;
	            break;
	          }
	
	          _context.next = 4;
	          return _jsreportStudio2.default.api.get('/odata/workspaces?$filter=shortid eq \'' + match[1] + '\' and version eq ' + parseInt(match[2]));
	
	        case 4:
	          response = _context.sent;
	
	
	          _jsreportStudio2.default.workspaces.current = response.value.length ? response.value[0] : {
	            shortid: match[1],
	            version: parseInt(match[2])
	          };
	          _context.next = 13;
	          break;
	
	        case 8:
	          oldMatch = playgroundRegex.exec(window.location.hash);
	
	
	          if (oldMatch) {
	            window.location = '/studio/workspace/' + oldMatch[1] + (oldMatch[2] ? '/' + oldMatch[2] : '/1');
	          }
	
	          _jsreportStudio2.default.workspaces.current.shortid = _shortid2.default.generate();
	          _jsreportStudio2.default.workspaces.current.version = 1;
	          _jsreportStudio2.default.updateHistory();
	
	        case 13:
	
	          _jsreportStudio2.default.setRequestHeader('workspace-shortid', _jsreportStudio2.default.workspaces.current.shortid);
	          _jsreportStudio2.default.setRequestHeader('workspace-version', _jsreportStudio2.default.workspaces.current.version);
	
	        case 15:
	        case 'end':
	          return _context.stop();
	      }
	    }
	  }, _callee, undefined);
	}));

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = __webpack_require__(57);


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var alphabet = __webpack_require__(58);
	var encode = __webpack_require__(60);
	var decode = __webpack_require__(62);
	var build = __webpack_require__(63);
	var isValid = __webpack_require__(64);
	
	// if you are using cluster or multiple servers use this to make each instance
	// has a unique value for worker
	// Note: I don't know if this is automatically set when using third
	// party cluster solutions such as pm2.
	var clusterWorkerId = __webpack_require__(65) || 0;
	
	/**
	 * Set the seed.
	 * Highly recommended if you don't want people to try to figure out your id schema.
	 * exposed as shortid.seed(int)
	 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
	 */
	function seed(seedValue) {
	    alphabet.seed(seedValue);
	    return module.exports;
	}
	
	/**
	 * Set the cluster worker or machine id
	 * exposed as shortid.worker(int)
	 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
	 * returns shortid module so it can be chained.
	 */
	function worker(workerId) {
	    clusterWorkerId = workerId;
	    return module.exports;
	}
	
	/**
	 *
	 * sets new characters to use in the alphabet
	 * returns the shuffled alphabet
	 */
	function characters(newCharacters) {
	    if (newCharacters !== undefined) {
	        alphabet.characters(newCharacters);
	    }
	
	    return alphabet.shuffled();
	}
	
	/**
	 * Generate unique id
	 * Returns string id
	 */
	function generate() {
	  return build(clusterWorkerId);
	}
	
	// Export all other functions as properties of the generate function
	module.exports = generate;
	module.exports.generate = generate;
	module.exports.seed = seed;
	module.exports.worker = worker;
	module.exports.characters = characters;
	module.exports.decode = decode;
	module.exports.isValid = isValid;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var randomFromSeed = __webpack_require__(59);
	
	var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
	var alphabet;
	var previousSeed;
	
	var shuffled;
	
	function reset() {
	    shuffled = false;
	}
	
	function setCharacters(_alphabet_) {
	    if (!_alphabet_) {
	        if (alphabet !== ORIGINAL) {
	            alphabet = ORIGINAL;
	            reset();
	        }
	        return;
	    }
	
	    if (_alphabet_ === alphabet) {
	        return;
	    }
	
	    if (_alphabet_.length !== ORIGINAL.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
	    }
	
	    var unique = _alphabet_.split('').filter(function(item, ind, arr){
	       return ind !== arr.lastIndexOf(item);
	    });
	
	    if (unique.length) {
	        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
	    }
	
	    alphabet = _alphabet_;
	    reset();
	}
	
	function characters(_alphabet_) {
	    setCharacters(_alphabet_);
	    return alphabet;
	}
	
	function setSeed(seed) {
	    randomFromSeed.seed(seed);
	    if (previousSeed !== seed) {
	        reset();
	        previousSeed = seed;
	    }
	}
	
	function shuffle() {
	    if (!alphabet) {
	        setCharacters(ORIGINAL);
	    }
	
	    var sourceArray = alphabet.split('');
	    var targetArray = [];
	    var r = randomFromSeed.nextValue();
	    var characterIndex;
	
	    while (sourceArray.length > 0) {
	        r = randomFromSeed.nextValue();
	        characterIndex = Math.floor(r * sourceArray.length);
	        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
	    }
	    return targetArray.join('');
	}
	
	function getShuffled() {
	    if (shuffled) {
	        return shuffled;
	    }
	    shuffled = shuffle();
	    return shuffled;
	}
	
	/**
	 * lookup shuffled letter
	 * @param index
	 * @returns {string}
	 */
	function lookup(index) {
	    var alphabetShuffled = getShuffled();
	    return alphabetShuffled[index];
	}
	
	module.exports = {
	    characters: characters,
	    seed: setSeed,
	    lookup: lookup,
	    shuffled: getShuffled
	};


/***/ },
/* 59 */
/***/ function(module, exports) {

	'use strict';
	
	// Found this seed-based random generator somewhere
	// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)
	
	var seed = 1;
	
	/**
	 * return a random number based on a seed
	 * @param seed
	 * @returns {number}
	 */
	function getNextValue() {
	    seed = (seed * 9301 + 49297) % 233280;
	    return seed/(233280.0);
	}
	
	function setSeed(_seed_) {
	    seed = _seed_;
	}
	
	module.exports = {
	    nextValue: getNextValue,
	    seed: setSeed
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var randomByte = __webpack_require__(61);
	
	function encode(lookup, number) {
	    var loopCounter = 0;
	    var done;
	
	    var str = '';
	
	    while (!done) {
	        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte() );
	        done = number < (Math.pow(16, loopCounter + 1 ) );
	        loopCounter++;
	    }
	    return str;
	}
	
	module.exports = encode;


/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto
	
	function randomByte() {
	    if (!crypto || !crypto.getRandomValues) {
	        return Math.floor(Math.random() * 256) & 0x30;
	    }
	    var dest = new Uint8Array(1);
	    crypto.getRandomValues(dest);
	    return dest[0] & 0x30;
	}
	
	module.exports = randomByte;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var alphabet = __webpack_require__(58);
	
	/**
	 * Decode the id to get the version and worker
	 * Mainly for debugging and testing.
	 * @param id - the shortid-generated id.
	 */
	function decode(id) {
	    var characters = alphabet.shuffled();
	    return {
	        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
	        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
	    };
	}
	
	module.exports = decode;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var encode = __webpack_require__(60);
	var alphabet = __webpack_require__(58);
	
	// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
	// This number should be updated every year or so to keep the generated id short.
	// To regenerate `new Date() - 0` and bump the version. Always bump the version!
	var REDUCE_TIME = 1459707606518;
	
	// don't change unless we change the algos or REDUCE_TIME
	// must be an integer and less than 16
	var version = 6;
	
	// Counter is used when shortid is called multiple times in one second.
	var counter;
	
	// Remember the last time shortid was called in case counter is needed.
	var previousSeconds;
	
	/**
	 * Generate unique id
	 * Returns string id
	 */
	function build(clusterWorkerId) {
	
	    var str = '';
	
	    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);
	
	    if (seconds === previousSeconds) {
	        counter++;
	    } else {
	        counter = 0;
	        previousSeconds = seconds;
	    }
	
	    str = str + encode(alphabet.lookup, version);
	    str = str + encode(alphabet.lookup, clusterWorkerId);
	    if (counter > 0) {
	        str = str + encode(alphabet.lookup, counter);
	    }
	    str = str + encode(alphabet.lookup, seconds);
	
	    return str;
	}
	
	module.exports = build;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var alphabet = __webpack_require__(58);
	
	function isShortId(id) {
	    if (!id || typeof id !== 'string' || id.length < 6 ) {
	        return false;
	    }
	
	    var characters = alphabet.characters();
	    var len = id.length;
	    for(var i = 0; i < len;i++) {
	        if (characters.indexOf(id[i]) === -1) {
	            return false;
	        }
	    }
	    return true;
	}
	
	module.exports = isShortId;


/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = 0;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  if (_jsreportStudio2.default.workspaces.current.default === _jsreportStudio2.default.getActiveEntity().shortid) {
	    _jsreportStudio2.default.workspaces.current.default = undefined;
	  } else {
	    _jsreportStudio2.default.workspaces.current.default = _jsreportStudio2.default.getActiveEntity().shortid;
	  }
	  _jsreportStudio2.default.workspaces.save();
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(68);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _ChangeNameModal = __webpack_require__(69);
	
	var _ChangeNameModal2 = _interopRequireDefault(_ChangeNameModal);
	
	var _ShareModal = __webpack_require__(70);
	
	var _ShareModal2 = _interopRequireDefault(_ShareModal);
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var buttonsForFull = function buttonsForFull() {
	  _jsreportStudio2.default.addToolbarComponent(function (props) {
	    return _react2.default.createElement(
	      'div',
	      {
	        className: 'toolbar-button', onClick: function onClick() {
	          return _jsreportStudio2.default.workspaces.save();
	        } },
	      _react2.default.createElement('i', { className: 'fa fa-floppy-o' }),
	      'Save All'
	    );
	  });
	
	  var currentDefault = function currentDefault() {
	    return _jsreportStudio2.default.getActiveEntity() && _jsreportStudio2.default.getActiveEntity().shortid === _jsreportStudio2.default.workspaces.current.default;
	  };
	  _jsreportStudio2.default.addToolbarComponent(function (props) {
	    return _react2.default.createElement(
	      'div',
	      {
	        className: 'toolbar-button', style: { color: currentDefault() ? 'yellow' : 'inherit' }, onClick: _jsreportStudio2.default.workspaces.setDefault },
	      _react2.default.createElement('i', { className: 'fa fa-star' }),
	      'Default'
	    );
	  });
	
	  _jsreportStudio2.default.addToolbarComponent(function (props) {
	    return _react2.default.createElement(
	      'div',
	      {
	        className: 'toolbar-button',
	        onClick: function onClick() {
	          return _jsreportStudio2.default.openModal(_ShareModal2.default, { workspace: _jsreportStudio2.default.workspaces.current });
	        } },
	      _react2.default.createElement('i', { className: 'fa fa-unlock' }),
	      'Share'
	    );
	  }, 'right');
	
	  _jsreportStudio2.default.addToolbarComponent(function (props) {
	    return _react2.default.createElement(
	      'div',
	      {
	        className: 'toolbar-button', onClick: function onClick() {
	          return window.location = '/';
	        } },
	      _react2.default.createElement('i', { className: 'fa fa-plus' }),
	      'New'
	    );
	  }, 'right');
	};
	
	var buttonsForEmbed = function buttonsForEmbed() {
	  _jsreportStudio2.default.addToolbarComponent(function (props) {
	    return _react2.default.createElement(
	      'div',
	      {
	        className: 'toolbar-button', onClick: function onClick() {
	          return window.open(window.location.href.split('?')[0], '_blank');
	        } },
	      _react2.default.createElement('i', { className: 'fa fa-desktop' }),
	      'Full'
	    );
	  }, 'right');
	};
	
	exports.default = function (isEmbed) {
	  _jsreportStudio2.default.toolbarVisibilityResolver = function (text) {
	    return text === 'Run' || text === 'Download' || text === 'Run to new tab' || text === 'Reformat';
	  };
	
	  _jsreportStudio2.default.addToolbarComponent(function (props) {
	    return _react2.default.createElement(
	      'div',
	      {
	        className: 'toolbar-button', onClick: function onClick() {
	          return _jsreportStudio2.default.openModal(_ChangeNameModal2.default, {});
	        } },
	      _react2.default.createElement('i', { className: 'fa fa-pencil' }),
	      _react2.default.createElement(
	        'span',
	        { id: 'workspaceName' },
	        _jsreportStudio2.default.workspaces.current.name || 'Anonymous'
	      )
	    );
	  }, 'right');
	
	  if (isEmbed) {
	    buttonsForEmbed();
	  } else {
	    buttonsForFull();
	  }
	};

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = Studio.libraries['react'];

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(68);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ChangeNameModal = function (_Component) {
	  _inherits(ChangeNameModal, _Component);
	
	  function ChangeNameModal() {
	    _classCallCheck(this, ChangeNameModal);
	
	    return _possibleConstructorReturn(this, (ChangeNameModal.__proto__ || Object.getPrototypeOf(ChangeNameModal)).apply(this, arguments));
	  }
	
	  _createClass(ChangeNameModal, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'form-group' },
	          _react2.default.createElement(
	            'label',
	            null,
	            'Workspace name'
	          ),
	          _react2.default.createElement('input', { type: 'text', ref: 'name', defaultValue: _jsreportStudio2.default.workspaces.current.name || '' })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'button-bar' },
	          _react2.default.createElement(
	            'button',
	            {
	              className: 'button confirmation',
	              onClick: function onClick() {
	                _jsreportStudio2.default.workspaces.current.name = _this2.refs.name.value;
	                _jsreportStudio2.default.workspaces.save();
	                _this2.props.close();
	              } },
	            'ok'
	          )
	        )
	      );
	    }
	  }]);
	
	  return ChangeNameModal;
	}(_react.Component);
	
	ChangeNameModal.propTypes = {
	  close: _react2.default.PropTypes.func.isRequired,
	  options: _react2.default.PropTypes.object.isRequired
	};
	exports.default = ChangeNameModal;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(68);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var ShareModal = function (_Component) {
	  _inherits(ShareModal, _Component);
	
	  function ShareModal() {
	    _classCallCheck(this, ShareModal);
	
	    return _possibleConstructorReturn(this, (ShareModal.__proto__ || Object.getPrototypeOf(ShareModal)).apply(this, arguments));
	  }
	
	  _createClass(ShareModal, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        { style: { padding: '3rem' } },
	        _react2.default.createElement(
	          'code',
	          null,
	          '<iframe src=\'',
	          window.location.href,
	          '?embed=1\' width="100%" height="400" frameborder="0"></iframe>'
	        )
	      );
	    }
	  }]);
	
	  return ShareModal;
	}(_react.Component);
	
	ShareModal.propTypes = {
	  close: _react2.default.PropTypes.func.isRequired,
	  options: _react2.default.PropTypes.object.isRequired
	};
	exports.default = ShareModal;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(68);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _jsreportStudio = __webpack_require__(1);
	
	var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Startup = function (_Component) {
	  _inherits(Startup, _Component);
	
	  function Startup() {
	    _classCallCheck(this, Startup);
	
	    var _this = _possibleConstructorReturn(this, (Startup.__proto__ || Object.getPrototypeOf(Startup)).call(this));
	
	    _this.state = {};
	    return _this;
	  }
	
	  _createClass(Startup, [{
	    key: 'componentDidMount',
	    value: function () {
	      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
	        var response;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.next = 2;
	                return _jsreportStudio2.default.api.get('/odata/workspaces?$orderby=creationDate desc&$top=10');
	
	              case 2:
	                response = _context.sent;
	
	
	                this.setState({ lastCreated: response.value });
	
	              case 4:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, _callee, this);
	      }));
	
	      function componentDidMount() {
	        return _ref.apply(this, arguments);
	      }
	
	      return componentDidMount;
	    }()
	  }, {
	    key: 'renderExamples',
	    value: function renderExamples() {
	      return _react2.default.createElement(
	        'table',
	        { className: 'table' },
	        _react2.default.createElement(
	          'tbody',
	          null,
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/SyUrRILTg/198', target: '_blank' },
	                'Invoice pdf'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/SkDFywLpe/3', target: '_blank' },
	                'Orders with data fetch script'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/ry0peD8pl/9', target: '_blank' },
	                'Population Excel'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/HkqlE-Ww/318', target: '_blank' },
	                'Live dashboard'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/Y3BG0fnPa/1201', target: '_blank' },
	                'Html table to Excel'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/gkxJuycgR5/1', target: '_blank' },
	                'Pdf rendering with Apache FOP'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/ZJZMyHgm2e/204', target: '_blank' },
	                'Chrome based pdf rendering using electron'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/bkBXJqNOae/119', target: '_blank' },
	                'wkhtmltopdf with page numbers'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/Y3QQDfP9a/34', target: '_blank' },
	                'csv'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/HkM7PSFSl/15', target: '_blank' },
	                'Template layouts'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/HyGQQ-KHl/28', target: '_blank' },
	                'Custom font in pdf'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/gyHJRWnpn/79', target: '_blank' },
	                'Pdf page breaks'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/r1vaurbw/3', target: '_blank' },
	                'Add row to Excel'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/ryaUvq21e/3', target: '_blank' },
	                'Excel debug'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/Hkr4xanxg/145', target: '_blank' },
	                'Update excel cell'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/rkWcRiHog/128', target: '_blank' },
	                'Dynamic formula in excel'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/BkcNMahxg/6', target: '_blank' },
	                'Auto recalculate excel formulas'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/Hy_V2BSh/4', target: '_blank' },
	                'Excel table'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/SyL6aErP/2', target: '_blank' },
	                'Add sheet to excel'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/rkX89bHD/2', target: '_blank' },
	                'Merged excel cells'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/H1BHqBZw/9', target: '_blank' },
	                'Conditional excel formatting'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/BJa5OBWD/2', target: '_blank' },
	                'Rename excel sheet'
	              )
	            )
	          ),
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'td',
	              { className: 'selection' },
	              _react2.default.createElement(
	                'a',
	                { href: '/studio/workspace/HyQH-eKv/115', target: '_blank' },
	                'Excel pivot table'
	              )
	            )
	          )
	        )
	      );
	    }
	  }, {
	    key: 'open',
	    value: function open(w) {
	      window.open('/studio/workspace/' + w.shortid + '/' + w.version, '_blank');
	    }
	  }, {
	    key: 'renderLastCreated',
	    value: function renderLastCreated() {
	      var _this2 = this;
	
	      return _react2.default.createElement(
	        'table',
	        { className: 'table' },
	        _react2.default.createElement(
	          'thead',
	          null,
	          _react2.default.createElement(
	            'tr',
	            null,
	            _react2.default.createElement(
	              'th',
	              null,
	              'name'
	            ),
	            _react2.default.createElement(
	              'th',
	              null,
	              'version'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'tbody',
	          null,
	          (this.state.lastCreated || []).map(function (w) {
	            return _react2.default.createElement(
	              'tr',
	              { key: w._id, onClick: function onClick() {
	                  return _this2.open(w);
	                } },
	              _react2.default.createElement(
	                'td',
	                { className: 'selection' },
	                w.name || 'Anonymous'
	              ),
	              _react2.default.createElement(
	                'td',
	                null,
	                w.version
	              )
	            );
	          })
	        )
	      );
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this3 = this;
	
	      return _react2.default.createElement(
	        'div',
	        { className: 'custom-editor', style: { overflow: 'auto' } },
	        _react2.default.createElement(
	          'h2',
	          null,
	          'quick start'
	        ),
	        _react2.default.createElement(
	          'button',
	          { className: 'button confirmation', onClick: function onClick() {
	              return _jsreportStudio2.default.openNewModal('templates');
	            } },
	          _react2.default.createElement('i', { className: 'fa fa-plus' }),
	          ' Create template'
	        ),
	        _react2.default.createElement(
	          'button',
	          { className: 'button confirmation', onClick: function onClick() {
	              return _this3.refs.lastCreatedWorkspaces.scrollIntoView();
	            } },
	          _react2.default.createElement('i', { className: 'fa fa-user' }),
	          ' Last created workspaces'
	        ),
	        _react2.default.createElement(
	          'h2',
	          null,
	          'playground samples'
	        ),
	        this.renderExamples(),
	        _react2.default.createElement(
	          'h2',
	          { ref: 'lastCreatedWorkspaces' },
	          'last created workspaces'
	        ),
	        this.renderLastCreated()
	      );
	    }
	  }]);
	
	  return Startup;
	}(_react.Component);
	
	exports.default = Startup;

/***/ }
/******/ ]);