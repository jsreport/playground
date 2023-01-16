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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = Studio.libraries['react'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = Studio;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _onClick = props.onClick || function (href) {
    window.location.href = href;
  };

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'a',
      { target: '_top', title: 'facebook', onClick: function onClick() {
          return _onClick('/login/facebook');
        }, style: { color: '#3b5998', marginRight: '0.5rem', cursor: 'pointer' } },
      _react2.default.createElement('i', { className: 'fa fa-facebook-square fa-3x' })
    ),
    _react2.default.createElement(
      'a',
      { target: '_top', title: 'twitter', onClick: function onClick() {
          return _onClick('/login/twitter');
        }, style: { color: '#2fc2ef', marginRight: '0.5rem', cursor: 'pointer' } },
      _react2.default.createElement('i', { className: 'fa fa-twitter-square fa-3x' })
    ),
    _react2.default.createElement(
      'a',
      { target: '_top', title: 'github', onClick: function onClick() {
          return _onClick('/login/github');
        }, style: { color: '#337ab7', marginRight: '0.5rem', cursor: 'pointer' } },
      _react2.default.createElement('i', { className: 'fa fa-github fa-3x' })
    )
  );
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"workspacesTable":"x-playground-styles-workspacesTable","tabs":"x-playground-styles-tabs","selectedTab":"x-playground-styles-selectedTab","searchBox":"x-playground-styles-searchBox","newBox":"x-playground-styles-newBox","contextMenu":"x-playground-styles-contextMenu","contextMenuContainer":"x-playground-styles-contextMenuContainer","contextButton":"x-playground-styles-contextButton","code":"x-playground-styles-code"};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _styles = __webpack_require__(3);

var _styles2 = _interopRequireDefault(_styles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WorkspacesList = function (_Component) {
  _inherits(WorkspacesList, _Component);

  function WorkspacesList() {
    _classCallCheck(this, WorkspacesList);

    var _this = _possibleConstructorReturn(this, (WorkspacesList.__proto__ || Object.getPrototypeOf(WorkspacesList)).call(this));

    _this.state = _this.initialState();
    _this.tryHide = _this.tryHide.bind(_this);
    return _this;
  }

  _createClass(WorkspacesList, [{
    key: 'initialState',
    value: function initialState() {
      return { items: [] };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mounted = true;
      window.addEventListener('click', this.tryHide);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.mounted = false;
      window.removeEventListener('click', this.tryHide);
    }
  }, {
    key: 'contextMenu',
    value: function contextMenu(e, entity) {
      e.preventDefault();
      this.setState({ contextMenuId: entity._id });
    }
  }, {
    key: 'tryHide',
    value: function tryHide(ev) {
      if (this.state.contextMenuId) {
        ev.preventDefault();
        ev.stopPropagation();
        this.setState({ contextMenuId: null });
      }
    }
  }, {
    key: 'onTabActive',
    value: function onTabActive() {
      this.fetch();
    }
  }, {
    key: 'fetch',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.fetchRequested) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return');

              case 2:

                this.fetchRequested = true;

                response = void 0;
                _context.prev = 4;
                _context.next = 7;
                return _jsreportStudio2.default.api.get(this.props.url);

              case 7:
                response = _context.sent;

              case 8:
                _context.prev = 8;

                this.fetchRequested = false;
                return _context.finish(8);

              case 11:

                if (this.mounted) {
                  this.setState({
                    items: response.items
                  });
                }

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4,, 8, 11]]);
      }));

      function fetch() {
        return _ref.apply(this, arguments);
      }

      return fetch;
    }()
  }, {
    key: 'openUser',
    value: function openUser(e, u) {
      if (!u) {
        return;
      }

      e.stopPropagation();
      _jsreportStudio2.default.openTab({ key: 'playgroundUser' + u._id, editorComponentKey: 'playgroundUser', title: u.fullName, user: u });
    }
  }, {
    key: 'renderContextMenu',
    value: function renderContextMenu(w) {
      var _this2 = this;

      var onRemove = this.props.onRemove;


      return _react2.default.createElement(
        'div',
        { key: 'entity-contextmenu', className: _styles2.default.contextMenuContainer },
        _react2.default.createElement(
          'div',
          { className: _styles2.default.contextMenu },
          _react2.default.createElement(
            'div',
            {
              className: _styles2.default.contextButton,
              onClick: function onClick(e) {
                e.stopPropagation();
                onRemove && onRemove(w);
                _this2.tryHide(e);
              }
            },
            _react2.default.createElement('i', { className: 'fa fa-trash' }),
            ' Delete'
          )
        )
      );
    }
  }, {
    key: 'renderItem',
    value: function renderItem(w) {
      var _this3 = this;

      var contextMenuId = this.state.contextMenuId;
      var editable = this.props.editable;


      var isOwner = false;

      if (_jsreportStudio2.default.playground.user && _jsreportStudio2.default.playground.user._id === w.userId) {
        isOwner = true;
      }

      return _react2.default.createElement(
        'tr',
        {
          key: w._id,
          onClick: function onClick() {
            return contextMenuId == null && _jsreportStudio2.default.playground.open(w);
          },
          onContextMenu: function onContextMenu(e) {
            if (!isOwner) {
              e.preventDefault();
              return;
            }

            _this3.contextMenu(e, w);
          },
          title: w.description
        },
        _react2.default.createElement(
          'td',
          { className: 'selection' },
          w.name,
          editable !== false && contextMenuId === w._id ? this.renderContextMenu(w) : null
        ),
        _react2.default.createElement(
          'td',
          { onClick: function onClick(e) {
              return contextMenuId == null && _this3.openUser(e, w.user);
            }, style: { color: '#007ACC' } },
          w.user ? w.user.fullName : '',
          isOwner && _react2.default.createElement('i', { className: 'fa fa-bolt', title: 'You are the owner of this workspace' })
        ),
        _react2.default.createElement(
          'td',
          null,
          w.modificationDate.toLocaleDateString()
        ),
        _react2.default.createElement(
          'td',
          null,
          w.views || 0,
          _react2.default.createElement('i', { className: 'fa fa-eye' })
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var items = this.state.items;


      return _react2.default.createElement(
        'table',
        { className: 'table ' + _styles2.default.workspacesTable },
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
              'user'
            ),
            _react2.default.createElement(
              'th',
              null,
              'modified'
            ),
            _react2.default.createElement('th', null)
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          items.map(function (i) {
            return _this4.renderItem(i);
          })
        )
      );
    }
  }]);

  return WorkspacesList;
}(_react.Component);

exports.default = WorkspacesList;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _Startup = __webpack_require__(6);

var _Startup2 = _interopRequireDefault(_Startup);

var _ToolbarSaveForkButton = __webpack_require__(10);

var _ToolbarSaveForkButton2 = _interopRequireDefault(_ToolbarSaveForkButton);

var _LogoutButton = __webpack_require__(11);

var _LogoutButton2 = _interopRequireDefault(_LogoutButton);

var _AboutModal = __webpack_require__(12);

var _AboutModal2 = _interopRequireDefault(_AboutModal);

var _LoginModal = __webpack_require__(14);

var _LoginModal2 = _interopRequireDefault(_LoginModal);

var _SaveModal = __webpack_require__(15);

var _SaveModal2 = _interopRequireDefault(_SaveModal);

var _ShareModal = __webpack_require__(16);

var _ShareModal2 = _interopRequireDefault(_ShareModal);

var _RenameModal = __webpack_require__(17);

var _RenameModal2 = _interopRequireDefault(_RenameModal);

var _playground = __webpack_require__(18);

var _playground2 = _interopRequireDefault(_playground);

var _UserEditor = __webpack_require__(19);

var _UserEditor2 = _interopRequireDefault(_UserEditor);

var _utils = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_jsreportStudio2.default.setAboutModal(_AboutModal2.default);

_jsreportStudio2.default.playground = (0, _playground2.default)();

_jsreportStudio2.default.locationResolver = function () {
  if (_jsreportStudio2.default.playground.current.__isInitial) {
    return '/';
  }

  return _jsreportStudio2.default.playground.current.user != null ? '/w/' + _jsreportStudio2.default.playground.current.user.username + '/' + _jsreportStudio2.default.playground.current.shortid : '/w/anon/' + _jsreportStudio2.default.playground.current.shortid;
};

_jsreportStudio2.default.toolbarVisibilityResolver = function (text) {
  return text === 'Run' || text === 'Run (full profile)' || text === 'Download' || text === 'settings';
};

(0, _utils.removeFacebookQuery)();
var isEmbed = (0, _utils.getQueryParameter)('embed') != null;

_jsreportStudio2.default.shouldOpenStartupPage = false;
_jsreportStudio2.default.addEditorComponent('Help', _Startup2.default);
_jsreportStudio2.default.addEditorComponent('playgroundUser', _UserEditor2.default);

_jsreportStudio2.default.initializeListeners.push(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _jsreportStudio2.default.playground.init();

        case 2:

          if (_jsreportStudio2.default.playground.user) {
            _jsreportStudio2.default.addToolbarComponent(function () {
              return _react2.default.createElement(
                'div',
                { className: 'toolbar-button' },
                _react2.default.createElement(
                  'span',
                  null,
                  _react2.default.createElement('i', { className: 'fa fa-user' }),
                  ' ',
                  _jsreportStudio2.default.playground.user.fullName
                )
              );
            }, 'settingsBottom');
            _jsreportStudio2.default.addToolbarComponent(_LogoutButton2.default, 'settingsBottom');
          } else {
            _jsreportStudio2.default.addToolbarComponent(function () {
              return _react2.default.createElement(
                'div',
                { className: 'toolbar-button', onClick: function onClick() {
                    return _jsreportStudio2.default.openModal(_LoginModal2.default);
                  } },
                _react2.default.createElement(
                  'span',
                  null,
                  _react2.default.createElement('i', { className: 'fa fa-sign-in' }),
                  ' Login'
                )
              );
            }, 'settingsBottom');
          }

        case 3:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));

function save() {
  if (_jsreportStudio2.default.playground.user || !_jsreportStudio2.default.playground.current.__isInitial && _jsreportStudio2.default.playground.current.canEdit) {
    return _jsreportStudio2.default.playground.save();
  }

  _jsreportStudio2.default.openModal(_SaveModal2.default);
}

_jsreportStudio2.default.readyListeners.push(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
  var entities, defaultEntity;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!isEmbed) {
            _jsreportStudio2.default.addToolbarComponent(function (props) {
              return _react2.default.createElement(_ToolbarSaveForkButton2.default, {
                enabled: _jsreportStudio2.default.getAllEntities().some(function (e) {
                  return e.__isDirty;
                }),
                canEdit: _jsreportStudio2.default.playground.current.__isInitial ? true : _jsreportStudio2.default.playground.current.canEdit,
                save: save
              });
            });
          }

          _jsreportStudio2.default.addToolbarComponent(function (props) {
            return _react2.default.createElement(
              'div',
              {
                style: { backgroundColor: '#E67E22', float: 'right' },
                className: 'toolbar-button',
                onClick: function onClick() {
                  if (!isEmbed) {
                    _jsreportStudio2.default.openModal(_RenameModal2.default);
                  }
                }
              },
              _react2.default.createElement('i', { className: 'fa fa-' + (!isEmbed ? 'pencil' : 'flag') }),
              _react2.default.createElement(
                'h1',
                { style: { display: 'inline', fontSize: '1rem', color: '#FFFFFF' } },
                _jsreportStudio2.default.playground.current.name ? (0, _utils.trim)(_jsreportStudio2.default.playground.current.name) : 'Untitled ...'
              )
            );
          }, 'right');

          if (!isEmbed) {
            _jsreportStudio2.default.addToolbarComponent(function (props) {
              return _react2.default.createElement(
                'div',
                {
                  className: 'toolbar-button',
                  style: { backgroundColor: '#2ECC71' },
                  onClick: function onClick() {
                    return _jsreportStudio2.default.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' });
                  }
                },
                _react2.default.createElement('i', { className: 'fa fa-home' }),
                'Home'
              );
            }, 'right');

            if (_jsreportStudio2.default.playground.user) {
              _jsreportStudio2.default.addToolbarComponent(function (props) {
                return _react2.default.createElement(
                  'div',
                  { className: 'toolbar-button' },
                  _react2.default.createElement('i', { className: 'fa fa-user' }),
                  _jsreportStudio2.default.playground.user.fullName
                );
              }, 'right');
            }

            _jsreportStudio2.default.addToolbarComponent(function (props) {
              return _react2.default.createElement(
                'div',
                {
                  className: 'toolbar-button ' + (_jsreportStudio2.default.playground.current.name == null ? 'disabled' : ''),
                  onClick: function onClick() {
                    if (_jsreportStudio2.default.playground.current.name) {
                      _jsreportStudio2.default.openModal(_ShareModal2.default);
                    }
                  }
                },
                _react2.default.createElement('i', { className: 'fa fa-share' }),
                'Share'
              );
            }, 'right');
          } else {
            _jsreportStudio2.default.addToolbarComponent(function (props) {
              return _react2.default.createElement(
                'div',
                {
                  className: 'toolbar-button',
                  onClick: function onClick() {
                    return window.open(window.location.href.split('?')[0], '_blank');
                  }
                },
                _react2.default.createElement('i', { className: 'fa fa-desktop' }),
                'Full'
              );
            }, 'right');
          }

          if (isEmbed) {
            _jsreportStudio2.default.collapseLeftPane();
          } else {
            _jsreportStudio2.default.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' });
          }

          if (_jsreportStudio2.default.playground.current.default) {
            entities = _jsreportStudio2.default.getAllEntities();
            defaultEntity = entities.find(function (e) {
              return e.shortid === _jsreportStudio2.default.playground.current.default;
            });


            if (defaultEntity) {
              _jsreportStudio2.default.collapseEntity({ _id: defaultEntity._id }, false, { parents: true, self: false });
              _jsreportStudio2.default.openTab({ _id: defaultEntity._id });
            }
          }

        case 5:
        case 'end':
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
})));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

var _login = __webpack_require__(2);

var _login2 = _interopRequireDefault(_login);

var _styles = __webpack_require__(3);

var _styles2 = _interopRequireDefault(_styles);

var _lodash = __webpack_require__(7);

var _lodash2 = _interopRequireDefault(_lodash);

var _DeleteWorkspaceModal = __webpack_require__(9);

var _DeleteWorkspaceModal2 = _interopRequireDefault(_DeleteWorkspaceModal);

var _WorkspacesList = __webpack_require__(4);

var _WorkspacesList2 = _interopRequireDefault(_WorkspacesList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Startup = function (_Component) {
  _inherits(Startup, _Component);

  function Startup(props) {
    _classCallCheck(this, Startup);

    var _this = _possibleConstructorReturn(this, (Startup.__proto__ || Object.getPrototypeOf(Startup)).call(this, props));

    _this.state = {
      tab: _jsreportStudio2.default.playground.user ? 'my' : 'examples',
      searchTerm: ''
    };

    _this.handleSearchChange = (0, _lodash2.default)(_this.handleSearchChange.bind(_this), 500);

    _this.examplesRef = _react2.default.createRef();
    _this.popularRef = _react2.default.createRef();
    _this.myRef = _react2.default.createRef();
    _this.searchRef = _react2.default.createRef();
    return _this;
  }

  _createClass(Startup, [{
    key: 'handleSearchChange',
    value: function handleSearchChange() {
      this.reloadTab(this.state.tab);
    }
  }, {
    key: 'handleRemove',
    value: function handleRemove(w) {
      _jsreportStudio2.default.openModal(_DeleteWorkspaceModal2.default, {
        workspace: w
      });
    }
  }, {
    key: 'onTabActive',
    value: function onTabActive() {
      this.reloadTab(this.state.tab);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      _jsreportStudio2.default.playground.startupReload = function () {
        _this2.reloadTab(_this2.state.tab);
      };

      this.reloadTab(this.state.tab);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _jsreportStudio2.default.playground.startupReload = null;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.tab !== this.state.tab) {
        this.reloadTab(this.state.tab);
      }
    }
  }, {
    key: 'reloadTab',
    value: function reloadTab(tab) {
      var ref = this[tab + 'Ref'];

      if (ref && ref.current) {
        ref.current.onTabActive();
      }
    }
  }, {
    key: 'renderPinnedExamples',
    value: function renderPinnedExamples() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_WorkspacesList2.default, {
          ref: this.examplesRef,
          key: 'examples',
          url: '/api/playground/workspaces/examples',
          onRemove: this.handleRemove
        })
      );
    }
  }, {
    key: 'renderPopularWorkspaces',
    value: function renderPopularWorkspaces() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_WorkspacesList2.default, {
          ref: this.popularRef,
          key: 'popular',
          url: '/api/playground/workspaces/popular',
          onRemove: this.handleRemove
        })
      );
    }
  }, {
    key: 'renderUserWorkspaces',
    value: function renderUserWorkspaces() {
      return _jsreportStudio2.default.playground.user ? this.renderForUser() : this.renderForAnonym();
    }
  }, {
    key: 'renderForUser',
    value: function renderForUser() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_WorkspacesList2.default, {
          ref: this.myRef,
          key: 'my',
          url: '/api/playground/workspaces/user/' + _jsreportStudio2.default.playground.user._id,
          onRemove: this.handleRemove
        })
      );
    }
  }, {
    key: 'renderForAnonym',
    value: function renderForAnonym() {
      return _react2.default.createElement(
        'div',
        null,
        (0, _login2.default)()
      );
    }
  }, {
    key: 'renderActions',
    value: function renderActions() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          null,
          'actions'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'button',
            { className: 'button confirmation', onClick: function onClick() {
                return _jsreportStudio2.default.playground.create();
              } },
            'new workspace'
          ),
          _react2.default.createElement(
            'button',
            { className: 'button confirmation' },
            'search'
          )
        )
      );
    }
  }, {
    key: 'renderSearch',
    value: function renderSearch() {
      var _this3 = this;

      var searchTerm = this.state.searchTerm;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: _styles2.default.searchBox },
          _react2.default.createElement(
            'label',
            null,
            'search for a workspace...'
          ),
          _react2.default.createElement('input', {
            type: 'text',
            value: searchTerm,
            onChange: function onChange(ev) {
              return _this3.setState({ searchTerm: ev.target.value });
            },
            onKeyUp: this.handleSearchChange
          })
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_WorkspacesList2.default, {
            ref: this.searchRef,
            url: '/api/playground/search?q=' + encodeURIComponent(searchTerm != null ? searchTerm : ''),
            editable: false
          })
        )
      );
    }
  }, {
    key: 'renderTab',
    value: function renderTab() {
      switch (this.state.tab) {
        case 'examples':
          return _react2.default.createElement(
            'div',
            null,
            this.renderPinnedExamples()
          );
        case 'my':
          return _react2.default.createElement(
            'div',
            null,
            this.renderUserWorkspaces()
          );
        case 'popular':
          return _react2.default.createElement(
            'div',
            null,
            this.renderPopularWorkspaces()
          );
        case 'search':
          return _react2.default.createElement(
            'div',
            null,
            this.renderSearch()
          );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _react2.default.createElement(
        'div',
        { className: 'custom-editor block' },
        _react2.default.createElement(
          'div',
          null,
          _jsreportStudio2.default.playground.user ? _react2.default.createElement(
            'h2',
            null,
            'welcome ',
            _react2.default.createElement(
              'b',
              null,
              _jsreportStudio2.default.playground.user.fullName
            )
          ) : ''
        ),
        _react2.default.createElement(
          'div',
          { className: _styles2.default.newBox },
          'Start by creating a new workspace',
          _react2.default.createElement(
            'button',
            {
              className: 'button confirmation',
              onClick: function onClick() {
                return _jsreportStudio2.default.playground.create();
              },
              title: 'create template in new workspace'
            },
            _react2.default.createElement('i', { className: 'fa fa-plus-square' })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: _styles2.default.tabs },
          _react2.default.createElement(
            'div',
            { className: this.state.tab === 'examples' ? _styles2.default.selectedTab : '', onClick: function onClick() {
                return _this4.setState({ tab: 'examples' });
              } },
            'Examples'
          ),
          _react2.default.createElement(
            'div',
            { className: this.state.tab === 'my' ? _styles2.default.selectedTab : '', onClick: function onClick() {
                return _this4.setState({ tab: 'my' });
              } },
            'My workspaces'
          ),
          _react2.default.createElement(
            'div',
            { className: this.state.tab === 'popular' ? _styles2.default.selectedTab : '', onClick: function onClick() {
                return _this4.setState({ tab: 'popular' });
              } },
            'Popular workspaces'
          ),
          _react2.default.createElement(
            'div',
            { className: this.state.tab === 'search' ? _styles2.default.selectedTab : '', onClick: function onClick() {
                return _this4.setState({ tab: 'search' });
              } },
            _react2.default.createElement('i', { className: 'fa fa-search' }),
            ' Search'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'block-item', style: { overflow: 'auto' } },
          this.renderTab()
        )
      );
    }
  }]);

  return Startup;
}(_react.Component);

exports.default = Startup;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

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
  return !!value && (type == 'object' || type == 'function');
}

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
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteWorkspaceModal = function (_Component) {
  _inherits(DeleteWorkspaceModal, _Component);

  function DeleteWorkspaceModal(props) {
    _classCallCheck(this, DeleteWorkspaceModal);

    var _this = _possibleConstructorReturn(this, (DeleteWorkspaceModal.__proto__ || Object.getPrototypeOf(DeleteWorkspaceModal)).call(this, props));

    _this.cancelRef = _react2.default.createRef();
    return _this;
  }

  _createClass(DeleteWorkspaceModal, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      setTimeout(function () {
        return _this2.cancelRef.current && _this2.cancelRef.current.focus();
      }, 0);
    }
  }, {
    key: 'remove',
    value: function remove() {
      var workspace = this.props.options.workspace;

      this.props.close();

      _jsreportStudio2.default.playground.remove(workspace);
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.props.close();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var workspace = this.props.options.workspace;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          null,
          'Are you sure you want to delete workspace ',
          _react2.default.createElement(
            'b',
            null,
            workspace.name
          ),
          '?'
        ),
        _react2.default.createElement(
          'p',
          null,
          _react2.default.createElement(
            'small',
            null,
            _react2.default.createElement(
              'i',
              null,
              '*This action is irreversible and all examples and links to this workspace will stop working'
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'button-bar' },
          _react2.default.createElement(
            'button',
            { className: 'button danger', onClick: function onClick() {
                return _this3.remove();
              } },
            'Yes'
          ),
          _react2.default.createElement(
            'button',
            { className: 'button confirmation', ref: this.cancelRef, onClick: function onClick() {
                return _this3.cancel();
              } },
            'Cancel'
          )
        )
      );
    }
  }]);

  return DeleteWorkspaceModal;
}(_react.Component);

exports.default = DeleteWorkspaceModal;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isMac = function isMac() {
  return window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
};

var ToolbarSaveForkButton = function (_Component) {
  _inherits(ToolbarSaveForkButton, _Component);

  function ToolbarSaveForkButton(props) {
    _classCallCheck(this, ToolbarSaveForkButton);

    var _this = _possibleConstructorReturn(this, (ToolbarSaveForkButton.__proto__ || Object.getPrototypeOf(ToolbarSaveForkButton)).call(this, props));

    _this.handleShortcut = _this.handleShortcut.bind(_this);
    return _this;
  }

  _createClass(ToolbarSaveForkButton, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('keydown', this.handleShortcut);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('keydown', this.handleShortcut);
    }
  }, {
    key: 'handleShortcut',
    value: function handleShortcut(e) {
      if (
      // ctrl + s
      e.ctrlKey && e.which === 83 ||
      // handles CMD + S on Mac
      isMac() && e.metaKey && e.which === 83) {
        e.preventDefault();

        if (this.props.save) {
          this.props.save();
          return false;
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          save = _props.save,
          canEdit = _props.canEdit,
          enabled = _props.enabled;


      return _react2.default.createElement(
        'div',
        {
          className: 'toolbar-button ' + (!enabled && canEdit ? 'disabled' : ''), onClick: function onClick() {
            return save();
          }
        },
        canEdit ? _react2.default.createElement(
          'span',
          { title: 'Save workspace (CTRL+S)' },
          _react2.default.createElement('i', { className: 'fa fa-floppy-o' }),
          ' Save'
        ) : _react2.default.createElement(
          'span',
          { title: 'Fork workspace' },
          _react2.default.createElement('i', { className: 'fa fa-clone' }),
          ' Fork'
        )
      );
    }
  }]);

  return ToolbarSaveForkButton;
}(_react.Component);

exports.default = ToolbarSaveForkButton;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogoutButton = function (_Component) {
  _inherits(LogoutButton, _Component);

  function LogoutButton(props) {
    _classCallCheck(this, LogoutButton);

    var _this = _possibleConstructorReturn(this, (LogoutButton.__proto__ || Object.getPrototypeOf(LogoutButton)).call(this, props));

    _this.logoutRef = _react2.default.createRef();
    return _this;
  }

  _createClass(LogoutButton, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { onClick: function onClick() {
            return _this2.logoutRef.current.click();
          }, style: { cursor: 'pointer' } },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'form',
            { method: 'POST', action: _jsreportStudio2.default.resolveUrl('/logout') },
            _react2.default.createElement('input', { ref: this.logoutRef, type: 'submit', id: 'logoutBtn', style: { display: 'none' } })
          ),
          _react2.default.createElement('i', { className: 'fa fa-power-off' }),
          ' Logout'
        )
      );
    }
  }]);

  return LogoutButton;
}(_react.Component);

exports.default = LogoutButton;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(13);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI4AAAAmCAIAAACd0DTcAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAq5SURBVHhe7ZhnUFRZFsf321Ttl/2wsx+mdres1UW7yU1ochaaIFmC4KJgKByRXQVdzGEMiC4gZnTHRUVMjAkFBclJhiBagw4mUAyIokCToXv/cC5t0zRIO+DA2L96Be+ee97r+97/nnPPfb/jjA9cLpedKRkjxkuq0aCUUyF+TamUKIRSqkmDUqpJg1KqSYNSqkmDUqpJw+eQSlmUjwnjKJW3t3dCQkJZWVl1dXVlZWVycvLixYvV1NRY9+hwmO3rvTjEMyhYS0eXmb5UxkUqPp9/6dIlsTxKSkoEAgHzGwV/iMn86tL7ry40TrNwYKYvlbGXytDQEDHElJFH/evXbm5uzPtjfBOX9fW1pq9T3qkopWL/xwJ1dXVdPf2rqalME7G4qqpq+/btyHtr164tLCxkVrH45+pqeLLLRmRK2J4/7838y66U6YYWzDSZWb58eXl5ua+vL2srwthIZW5nL9iZMOXkT7559SKRiPRISkqSWZkgG3WBDf+JY9YviT179uDZly1bxtqKMAZSuSxd+adLDX9Mbfl9SsuZum5SoqKiQm4Fcf78eXLIuVfD0dRm1k9DVY2jqsrOhwFjGDoMWFQ/6UIZcJOP+hBwozI4JiYGz7506VKyK8QvlYrrEzw1QzglXajyQ61g88GqZy9JiXXr1jGPwfj4+JBDa49Yd0XUDJ4e6xgGldDIaQeypkVd4OjwmUlNXWXRummHcqcm3Z96qgonf119RMvEkjqRbLOzs/X19e3t7VHaNDc3Hz16lLrwssLDw0tLS9++ffvs2bNTp05ZWrKrgKamZkpKSkRExMyZM69du/b69etXr17dvHlz/vz5zEMKLy+vK1euPH/+HLe6e/furl27dHUHFajnzp3bsWMHTpD579y5U1tbe+LEiby8PJzg2e/du5eTk4PaePPmzeQ/Gn6ZVFo6aqerpt9sNTpzx8jUXEtL6+VLJpWfnx/zGYyJiUlTUxMckCXdS9r/fvEZJ2A565PH9OgUlQyhyrUGjoEZs2xN6rNIHd9cF5rPZyll06ZNuHl8fDxE6u7ufvTo0datW6kLrw9d+PWioiLYcY4XZ25uTr08Hg/avHnzBg7v37+HD14ofADuST4E3n5vby/scIDbu3fvcA498GjkgDlRU1MDC5XBUD0jIwPzQCgUtre3w4ITaNzV1YVx0iWj4ROl4nJVZ1g5aazez8tpm5HZJvDqE0ZbW/vp06cYChguxjHZOzs74dDV3eNe1Kya1cbJbHMNG3ZycaNTuJmt3LQ3TCr72X1NHIdzOf7LOHNCOKGRf4vLMPEN6nfnrF+/ngZw8OBBAwMDMoKNGzfCiFeGgCPL3r17YUlMTKQmBv/ixQtYoqOjUR+RMTg4GKPF+7WzsyOLq6srZkBLS0tQEPtFaHzx4kVcCGHIAqlI5idPnsybN4+SJP2lH0VxgXPE8SjzJ/EpUlnbO5r/L183t52f166T225+plLyPQJxjaEAybhliIqKIofHNbU8Rw/N74v189rV0ptsnN2Zx2DUYq9qZLdpXH/L7ZdKNWBFXzO7DSfkwBgYAEkFnahJYFF5+PAh4szY2JiZkBH6cwAiCSKhib8IKbxcmWUMEx833L17NzVPnjyJ5rZt26hJIPshoyLUSFG8jQcPHkBRicASYmNjcXlISAhrK4LCUlnZOfCv1unldZgWdBilvdTNbHLY/0EVmrwEzR1p3N3dKV2A7xOTYFE1NDO6UqOT1yGIPk0+MmjGXuXltPNuNHIN+6VyC+hr5rRrX6nTWH1A1SOQK1nD+iGpkKNYux+8MtSlEAYF2IEB4uLi6uvre3p6sDjBh6R6/PixZNoRAQEBuCFWL2pSuNAl0pCE9Mi4AxIs7kaTQBqS6jNVgLbx6YYFnWaZjbwFK7nauhoGxobGLEcDTFXspTAagFx85MgRgUCgo6NjYWGBNaOxsZG6WltbHZyc6BK91XvNCjttLz/U0NAgizQ6cVcRu/oZTCrAizoHi+TQv16vunIPEjL1klQyRY2klhkK8pujoyN8JFLJRJWLiwvcCgoKcI6nQxRiJdPTk62GIiMj4UbRBqkQxFiNkBupV8Lnk8rSVmCcJ7S91WUYspGZpMAbWbNmDTZPVDgQeBeYvG1tbazdD4KPXQMxAv5pXdzlktNgYGjITFLo7b1mjPDNfIf4YyauqoZnoO72RINzVcb57ejVzu1wCv+OOuVK5enpCWNubi6KCCyWMtAUGU4qb29vXHvjxg2cY2lBJYKlSzqREvv27YMbRfOEkGp2QJBVcbdHsVDX3JqZBpBsb7Hknj17lqrSoXR0dMgUVPyQzYKSbteMOp6ODjNJYbAv1byo0yz7/QeppNDyWWyWJ0SUuxy7SRa5UpmamuJ3kZRGWMZJKvjIJEAkA9wQCZOaWVlZaEpqCgkIO9jpM8QIUtEW+HPsq1znzLX9sWd2eRdf4MxM/Uh/hgDFxcWYd9jQ1NXVUV0L8CIuXLgwa9Ysds0AM08WOZT2uJ3IZe3BGO9PtSnuss5pUuuXCn/VjD98YdKY6Wyd22xa2OV5NJUscqUC6enpsKO6Y+0BJMJAKlTVGKSk5gY4R72AC7GRIsuqVavQLCkpQTIkC0CUwIjMT1NhBKlQnsBToe2UBMWk4hsZO2Q1uFf0Wu3+UAVgr4eflwa7DepCMrGysnJzc8PCLncpMl23z6Oi1+7HXs9vw5hpMGYH0xBzdnnNakZ9GyC94LWCW52WSWXm8RkWx4tsc96h16yo235JOPlv2LABAxgqFaYIVTQYG94U5nVYWBhqgdOn2YNAKmxp4dDQ0ICSGg6IJ2yPYMFmmXwAnghbbBghDKYF3I4fP45iD+WJJNQgFaJTrlTYoeNazAmMATWIQqWgwmWF147DTmUi79siweE0XZ+FoZF9ES1Np0gcse+Y3Ww/p7lBjn7zBd7+OBd4+TvMmQcLO/wDvUIjZiUWet0WeVSIfI/1rQRysTyU5lTa7VDQrE5SLQhDU/pwLG7Tj9hDzgAiYQwyFSDh7Oycn58v+URJJCcnUy9FFbSBMKxPLMayhNQnkzZRJcEHRRNzEosRQ9IfNSBVdXU17jZUKgBp2WX9yyezjgKFpdLU0vJLyHCrEM2+LfrXfVEHS2+MbpE4pkbsWCaaVS5yHvFwKRf5VIp8K0V2RzN4usN+XrI+lOZa1uNc2EJScdU1eK5+RqFbTNfGmayO5S9apWFmQ54EdrhOTk6Sfe5QbGxsAgMDEQ34i5pbOgHSWkU+2PwuXLjQzEzOAkmgpl2wYAHug5plaMLAHZBIZCoUCQ4ODkuWLEGEWVvLLvkjoLBUAJt5z39vdbpyf8tPrUyifrp6emJ+FnoWC/9R2vrRw7/wrceZWyaLwlHRsfvKwzb+OjKkW7GQpBo/SKqhFeDE4VOkIjAfLayssC0nnVCUrwgP5xsYmppbjObQ5w/aug6H09kyr9u9HvmN6nzZ+nhs+S1LRdja2iYmJl6+fHnu3LnM9ItxdHVzXfmdvv8Smx0JyJA4XH64w/rGjd++VOPBvOURdmVYycTeA4fBvFDWN26gBIBUQ78BThwmolRuvv6Bafe/zakNTq/2++9VE88xi9cRwAK8c+fOLVu2SAqNicZElArgfeHdTdgJ/qswQaVSMhSlVJMGpVSTBqVUkwalVJMEDuf/bVJm+WGUlhAAAAAASUVORK5CYII=';

var AboutModal = function (_Component) {
  _inherits(AboutModal, _Component);

  function AboutModal() {
    _classCallCheck(this, AboutModal);

    return _possibleConstructorReturn(this, (AboutModal.__proto__ || Object.getPrototypeOf(AboutModal)).apply(this, arguments));
  }

  _createClass(AboutModal, [{
    key: 'render',
    value: function render() {
      var _props$options = this.props.options,
          version = _props$options.version,
          extensions = _props$options.extensions;

      var playgroundVersion = extensions.playground.options.version;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h2',
          null,
          'About'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement('img', { src: logo, style: { width: '100px', height: 'auto', marginBottom: '15px' } })
        ),
        _react2.default.createElement(
          'div',
          null,
          'playground version: ',
          _react2.default.createElement(
            'b',
            null,
            playgroundVersion
          )
        ),
        _react2.default.createElement(
          'div',
          null,
          'jsreport version: ',
          _react2.default.createElement(
            'b',
            null,
            version
          )
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'div',
          null,
          'See more information about the playground release in the release notes'
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'a',
            {
              className: 'button confirmation',
              href: 'https://github.com/jsreport/playground/releases/tag/' + playgroundVersion,
              target: '_blank',
              rel: 'noreferrer',
              style: { marginLeft: 0 }
            },
            'Release notes'
          )
        )
      );
    }
  }]);

  return AboutModal;
}(_react.Component);

AboutModal.propTypes = {
  options: _propTypes2.default.object.isRequired
};

exports.default = AboutModal;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = Studio.libraries['prop-types'];

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h3',
      null,
      'login'
    ),
    _react2.default.createElement(
      'div',
      null,
      (0, _login2.default)()
    )
  );
};

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _login = __webpack_require__(2);

var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _login = __webpack_require__(2);

var _login2 = _interopRequireDefault(_login);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SaveModal = function (_Component) {
  _inherits(SaveModal, _Component);

  function SaveModal() {
    _classCallCheck(this, SaveModal);

    return _possibleConstructorReturn(this, (SaveModal.__proto__ || Object.getPrototypeOf(SaveModal)).apply(this, arguments));
  }

  _createClass(SaveModal, [{
    key: 'save',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(href) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _jsreportStudio2.default.playground.save();

              case 2:
                this.props.close();

                if (href) {
                  window.location.href = href;
                }

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function save(_x) {
        return _ref.apply(this, arguments);
      }

      return save;
    }()
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          null,
          'save to your account'
        ),
        _react2.default.createElement(
          'p',
          null,
          'You will be able to come back anytime and find it.'
        ),
        _react2.default.createElement(
          'div',
          null,
          (0, _login2.default)({ onClick: function onClick(href) {
              return _this2.save(href);
            } })
        ),
        _react2.default.createElement(
          'h3',
          { style: { marginTop: '2rem' } },
          'save as anonym'
        ),
        _react2.default.createElement(
          'p',
          null,
          'Not so cool but quick'
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'button',
            { className: 'button confirmation', style: { float: 'left', marginLeft: 0 }, onClick: function onClick() {
                return _this2.save();
              } },
            _react2.default.createElement('i', { className: 'fa fa-floppy' }),
            ' Save as anonym'
          )
        )
      );
    }
  }]);

  return SaveModal;
}(_react.Component);

exports.default = SaveModal;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _styles = __webpack_require__(3);

var _styles2 = _interopRequireDefault(_styles);

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
        { style: { padding: '1.5rem' } },
        _react2.default.createElement(
          'h3',
          null,
          'simple link'
        ),
        _react2.default.createElement(
          'p',
          null,
          'You can just copy paste browser url to share the playground workspace:',
          _react2.default.createElement('br', null),
          _react2.default.createElement(
            'a',
            { href: window.location.href },
            window.location.href
          )
        ),
        _react2.default.createElement(
          'h3',
          null,
          'embed into website'
        ),
        _react2.default.createElement(
          'p',
          null,
          'If you want embed playground into another page, you can use this html code:',
          _react2.default.createElement('br', null),
          _react2.default.createElement(
            'code',
            { className: _styles2.default.code },
            '<iframe src="',
            window.location.href,
            '?embed=1" width="100%" height="400" frameborder="0"></iframe>'
          )
        )
      );
    }
  }]);

  return ShareModal;
}(_react.Component);

exports.default = ShareModal;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RenameModal = function (_Component) {
  _inherits(RenameModal, _Component);

  function RenameModal(props) {
    _classCallCheck(this, RenameModal);

    var _this = _possibleConstructorReturn(this, (RenameModal.__proto__ || Object.getPrototypeOf(RenameModal)).call(this, props));

    _this.state = { default: _jsreportStudio2.default.playground.current.default };
    _this.nameRef = _react2.default.createRef();
    _this.descriptionRef = _react2.default.createRef();
    return _this;
  }

  _createClass(RenameModal, [{
    key: 'change',
    value: function change(event) {
      this.setState({ default: event.target.value });
    }
  }, {
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
            'workspace name'
          ),
          _react2.default.createElement('input', { type: 'text', ref: this.nameRef, defaultValue: _jsreportStudio2.default.playground.current.name || '' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'form-group' },
          _react2.default.createElement(
            'label',
            null,
            'description'
          ),
          _react2.default.createElement('textarea', { ref: this.descriptionRef, rows: '4', defaultValue: _jsreportStudio2.default.playground.current.description || '' })
        ),
        _react2.default.createElement(
          'div',
          { className: 'form-group' },
          _react2.default.createElement(
            'label',
            null,
            'default entity'
          ),
          _react2.default.createElement(
            'select',
            {
              value: this.state.default != null ? this.state.default : '', onChange: function onChange(e) {
                return _this2.change(e);
              }
            },
            [_react2.default.createElement(
              'option',
              { key: '<default>', value: '' },
              '<none>'
            )].concat(_jsreportStudio2.default.getAllEntities().filter(function (e) {
              return e.__entitySet !== 'folders';
            }).map(function (e) {
              return _react2.default.createElement(
                'option',
                { key: e._id, value: e.shortid },
                e.name + ' (' + e.__entitySet + ')'
              );
            }))
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'button-bar' },
          _react2.default.createElement(
            'button',
            {
              className: 'button confirmation',
              onClick: _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _jsreportStudio2.default.playground.current.name = _this2.nameRef.current.value;
                        _jsreportStudio2.default.playground.current.description = _this2.descriptionRef.current.value;
                        _jsreportStudio2.default.playground.current.default = _this2.state.default;

                        if (!_jsreportStudio2.default.playground.current._id) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 6;
                        return _jsreportStudio2.default.playground.save();

                      case 6:

                        _this2.props.close();

                      case 7:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this2);
              }))
            },
            'save'
          )
        )
      );
    }
  }]);

  return RenameModal;
}(_react.Component);

exports.default = RenameModal;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsreportStudio = __webpack_require__(1);

var _jsreportStudio2 = _interopRequireDefault(_jsreportStudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function updateTitle(workspaceName) {
  document.title = workspaceName || 'jsreport playground';
}

exports.default = function () {
  return {
    init: function init() {
      var _this = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _jsreportStudio2.default.api.get('api/playground/user');

              case 2:
                _this.user = _context.sent;
                _context.next = 5;
                return _jsreportStudio2.default.api.get('api/playground/workspace');

              case 5:
                _this.current = _context.sent;

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }))();
    },
    save: function save() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var isNewWorkspace, shouldInvokeSave, entities;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!_this2.lock) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return');

              case 2:
                _context2.prev = 2;

                updateTitle(_this2.current.name);

                _context2.next = 6;
                return _jsreportStudio2.default.store.dispatch(_jsreportStudio2.default.entities.actions.flushUpdates());

              case 6:

                _this2.lock = true;

                isNewWorkspace = _this2.current.__isInitial === true;
                shouldInvokeSave = _this2.current.canEdit === true;
                entities = _jsreportStudio2.default.getAllEntities().filter(function (e) {
                  return e.__isLoaded;
                }).map(function (e) {
                  return _jsreportStudio2.default.entities.actions.prune(e);
                });
                _context2.next = 12;
                return _jsreportStudio2.default.api.post('/api/playground/workspace', {
                  data: {
                    workspace: _extends({
                      name: 'untitled'
                    }, _this2.current),
                    entities: entities
                  }
                });

              case 12:
                _this2.current = _context2.sent;
                _context2.next = 15;
                return _jsreportStudio2.default.store.dispatch(_jsreportStudio2.default.editor.actions.updateHistory());

              case 15:
                if (!shouldInvokeSave) {
                  _context2.next = 23;
                  break;
                }

                _context2.next = 18;
                return _jsreportStudio2.default.store.dispatch(_jsreportStudio2.default.editor.actions.saveAll());

              case 18:
                _context2.next = 20;
                return _jsreportStudio2.default.api.get('api/playground/workspace');

              case 20:
                _this2.current = _context2.sent;
                _context2.next = 28;
                break;

              case 23:
                if (!isNewWorkspace) {
                  _context2.next = 26;
                  break;
                }

                _context2.next = 26;
                return _jsreportStudio2.default.store.dispatch(_jsreportStudio2.default.editor.actions.saveAll());

              case 26:
                _context2.next = 28;
                return _this2.open(_this2.current);

              case 28:

                if (_this2.startupReload) {
                  _this2.startupReload();
                }

              case 29:
                _context2.prev = 29;

                _this2.lock = false;
                return _context2.finish(29);

              case 32:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this2, [[2,, 29, 32]]);
      }))();
    },
    open: function open(w) {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var entities, defaultEntity;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                updateTitle(w.name);

                _this3.current = w;

                _context3.next = 4;
                return _jsreportStudio2.default.store.dispatch(_jsreportStudio2.default.editor.actions.updateHistory());

              case 4:
                _context3.next = 6;
                return _jsreportStudio2.default.api.get('api/playground/workspace');

              case 6:
                _this3.current = _context3.sent;
                _context3.next = 9;
                return _jsreportStudio2.default.reset();

              case 9:

                _jsreportStudio2.default.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' });

                if (_jsreportStudio2.default.playground.current.default) {
                  entities = _jsreportStudio2.default.getAllEntities().filter(function (e) {
                    return e.__entitySet !== 'folders';
                  });
                  defaultEntity = entities.find(function (e) {
                    return e.shortid === _jsreportStudio2.default.playground.current.default;
                  });


                  if (defaultEntity) {
                    _jsreportStudio2.default.collapseEntity({ _id: defaultEntity._id }, false, { parents: true, self: false });
                    _jsreportStudio2.default.openTab({ _id: defaultEntity._id });
                  }
                }

              case 11:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this3);
      }))();
    },
    create: function create() {
      var _this4 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                updateTitle(null);
                _this4.current = { canEdit: true, __isInitial: true };
                _context4.next = 4;
                return _jsreportStudio2.default.reset();

              case 4:
                _jsreportStudio2.default.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' });
                _jsreportStudio2.default.openNewModal('templates');

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this4);
      }))();
    },
    remove: function remove(w) {
      var _this5 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var wid;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                wid = w._id;
                _context5.next = 3;
                return _jsreportStudio2.default.api.del('api/playground/workspaces/' + wid + '/remove');

              case 3:
                if (!(w._id === _this5.current._id)) {
                  _context5.next = 12;
                  break;
                }

                _this5.current = { canEdit: true, __isInitial: true };
                updateTitle(null);
                _context5.next = 8;
                return _jsreportStudio2.default.reset();

              case 8:
                _context5.next = 10;
                return _jsreportStudio2.default.api.get('api/playground/workspace');

              case 10:
                _this5.current = _context5.sent;

                _jsreportStudio2.default.openTab({ key: 'Help', editorComponentKey: 'Help', title: 'Home' });

              case 12:

                if (_this5.startupReload) {
                  _this5.startupReload();
                }

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this5);
      }))();
    }
  };
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _WorkspacesList = __webpack_require__(4);

var _WorkspacesList2 = _interopRequireDefault(_WorkspacesList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserEditor = function (_Component) {
  _inherits(UserEditor, _Component);

  function UserEditor(props) {
    _classCallCheck(this, UserEditor);

    var _this = _possibleConstructorReturn(this, (UserEditor.__proto__ || Object.getPrototypeOf(UserEditor)).call(this, props));

    _this.workspacesRef = _react2.default.createRef();
    return _this;
  }

  _createClass(UserEditor, [{
    key: 'reloadTab',
    value: function reloadTab() {
      if (this.workspacesRef.current) {
        this.workspacesRef.current.onTabActive();
      }
    }
  }, {
    key: 'onTabActive',
    value: function onTabActive() {
      this.reloadTab();
    }
  }, {
    key: 'render',
    value: function render() {
      var user = this.props.tab.user;


      return _react2.default.createElement(
        'div',
        { className: 'custom-editor block' },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'h2',
            null,
            user.fullName
          )
        ),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_WorkspacesList2.default, { ref: this.workspacesRef, url: '/api/playground/workspaces/user/' + user._id })
        )
      );
    }
  }]);

  return UserEditor;
}(_react.Component);

exports.default = UserEditor;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryParameter = getQueryParameter;
exports.removeFacebookQuery = removeFacebookQuery;
exports.trim = trim;
function getQueryParameter(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function removeFacebookQuery() {
  if (window.location.hash === '#_=_') {
    history.replaceState ? history.replaceState(null, null, window.location.href.split('#')[0]) : window.location.hash = '';
  }
}

function trim(str) {
  if (str.length > 30) {
    return str.substring(0, 25) + ' ...';
  }
  return str;
}

/***/ })
/******/ ]);