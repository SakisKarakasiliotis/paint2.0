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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _paint = __webpack_require__(1);

var _paint2 = _interopRequireDefault(_paint);

var _DOM = __webpack_require__(2);

var _DOM2 = _interopRequireDefault(_DOM);

var _hook = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = _DOM2.default._;

var pCanvas = void 0;
var canvas = _("#paintArea");
var color = _("#color");
var size = _("#size");
var exportAsPNG = _("#export");
var reset = _("#reset");
var tool = _("#tool");

window.addEventListener("load", setup);

function setup() {

    pCanvas = new _paint2.default(canvas, 1024, 652, color.value, size.value, '#ffffff', _hook.hooks);
    pCanvas.modes.forEach(function (mode) {
        return tool.innerHTML += '<option value="' + mode + '">' + mode + '</option>';
    });

    document.onkeydown = function (e) {
        var eventobj = window.event ? window.event : e;
        if (eventobj.key === 'z' && eventobj.ctrlKey && !eventobj.shiftKey) {
            pCanvas.undo();
        } else if (eventobj.key === 'Z' && eventobj.ctrlKey && eventobj.shiftKey) {
            pCanvas.redo();
        }
    };

    color.onchange = function (e) {
        pCanvas.strokeStyle = e.target.value;
    };
    size.onchange = function (e) {
        pCanvas.linewidth = e.target.value;
    };
    exportAsPNG.onclick = function () {
        pCanvas.export();
    };
    reset.onclick = function () {
        pCanvas.reset();
    };
    tool.onclick = function (e) {
        pCanvas.mode = e.target.value;
    };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Paint = function () {
    function Paint(element) {
        var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
        var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
        var strokeStyle = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#ccc';
        var linewidth = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '5';

        var _this = this;

        var backgroundColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '#ffffff';
        var hooks = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

        _classCallCheck(this, Paint);

        this._hooks = hooks;
        this.call("beforeCreate");
        // User parameters
        this._element = element;
        this._element.width = width;
        this._element.height = height;
        this._strokeStyle = strokeStyle;
        this._linewidth = linewidth;
        this._backgroundColor = backgroundColor;
        // Utility parameters
        this._drawing = false;
        this._dragging = false;
        this._mousePosition = { x: 0, y: 0 };
        this._previousPosition = {};
        this._ctx = this._element.getContext("2d");
        this._mode = 'free';
        this._ctx.fillStyle = this._backgroundColor;
        this._ctx.fillRect(0, 0, this._element.width, this._element.height);
        // Helpers
        this._modes = ['free', 'rect', 'eraser', 'line'];
        this._undo = [];
        this._undo.push(this._element.toDataURL());
        this._redo = [];
        // Listeners
        var listeners = ["onmousedown", "onmouseup", "onmousemove", "onmouseout"];
        listeners.forEach(function (listener) {
            _this._element.addEventListener(listener, function (e) {
                return _this.listener(e);
            });
        });
        this.addResizeListeners();
        // Init paint
        this.drawloop();
        this.call("afterCreate");
    }

    _createClass(Paint, [{
        key: 'resize',
        value: function resize(width, height) {
            this.call("beforeResize");
            this.save();
            var memory = document.createElement('canvas');
            var memoryCtx = memory.getContext('2d');
            memory.width = this._element.width;
            memory.height = this._element.height;
            memoryCtx.drawImage(this._element, 0, 0);
            if (this.isset(width) && this.isset(height)) {
                if (width <= 0 || height <= 0) {
                    console.error("Invalid parameters on resize()");
                    return 0;
                }
                this._element.width = width;
                this._element.height = height;
                this._ctx.fillStyle = this._backgroundColor;
                this._ctx.fillRect(0, 0, this._element.width, this._element.height);
                this._ctx.drawImage(memory, 0, 0);
                this.call("afterResize");

                return 1;
            }
            console.error("Parameter missing on resize()");
            return 0;
        }
    }, {
        key: 'getMousePosition',
        value: function getMousePosition(event) {
            this.call("beforeGetMousePosition");
            var rect = this._element.getBoundingClientRect();
            var pos = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
            this.call("afterGetMousePosition");
            return pos;
        }
    }, {
        key: 'listener',
        value: function listener(event) {
            this.call("beforeListener");
            if (event.type === 'mouseout') {
                this._drawing = false;
            }
            if (this._mode === 'line' || this.mode === 'rect') {
                if (event.type === 'mousedown') {
                    this._drawing = false;
                    this._previousPosition = this.getMousePosition(event);
                } else if (event.type === 'mouseup') {
                    this.save();
                    this._drawing = true;
                    this._mousePosition = this.getMousePosition(event);
                }
            } else {
                if (event.type === 'mousedown') {
                    this.save();
                    this._drawing = true;
                    this._previousPosition = this.getMousePosition(event);
                } else if (event.type === 'mouseup') {
                    this._drawing = false;
                } else if (event.type === 'mousemove') {
                    this._mousePosition = this.getMousePosition(event);
                }
            }
            this.call("afterListener");
        }
    }, {
        key: 'render',
        value: function render() {
            this.call("beforeRender");
            if (this._drawing) {
                if (this._mode === "free" || this._mode === "eraser" || this._mode === 'line') {
                    this._ctx.beginPath();
                    this._ctx.globalCompositeOperation = this._mode === "eraser" ? 'destination-out' : 'source-over';
                    this._ctx.strokeStyle = this._mode === "eraser" ? "rgba(0,0,0,1)" : this._strokeStyle;
                    this._ctx.lineWidth = this._linewidth;
                    this._ctx.lineCap = 'round';
                    this._ctx.moveTo(this._previousPosition.x, this._previousPosition.y);
                    this._ctx.lineTo(this._mousePosition.x, this._mousePosition.y);
                    this._ctx.stroke();
                    this._ctx.closePath();
                    this._previousPosition = this._mode === 'line' ? {} : this._mousePosition;
                } else if (this._mode === "rect") {
                    this._ctx.beginPath();
                    this._ctx.fillStyle = this._strokeStyle;
                    var quadrant = {
                        x: this._mousePosition.x < this._previousPosition.x ? this._mousePosition.x : this._previousPosition.x,
                        y: this._mousePosition.y < this._previousPosition.y ? this._mousePosition.y : this._previousPosition.y
                    };
                    this._ctx.rect(quadrant.x, quadrant.y, Math.abs(this._mousePosition.x - this._previousPosition.x), Math.abs(this._mousePosition.y - this._previousPosition.y));
                    this._ctx.fill();
                    this._ctx.closePath();
                    this._drawing = false;
                }
            }
            this.call("afterRender");
        }
    }, {
        key: 'drawloop',
        value: function drawloop() {
            var _this2 = this;

            requestAnimationFrame(function () {
                return _this2.drawloop();
            });
            this.render();
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.call("beforeReset");
            this._ctx.fillStyle = this._backgroundColor;
            this._ctx.fillRect(0, 0, this._element.width, this._element.height);
            this._ctx.beginPath();
            this._previousPosition = { x: 0, y: 0 };
            this._mousePosition = { x: 0, y: 0 };
            this._ctx.closePath();
            this._undo = [];
            this._redo = [];
            this.call("afterReset");
        }
    }, {
        key: 'isset',
        value: function isset(parameter) {
            return typeof parameter !== 'undefined';
        }

        // Much needed credits for undo/redo functionality https://codepen.io/abidibo/

    }, {
        key: 'save',
        value: function save() {
            var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._undo;
            var keepRedo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.call("beforeSave");
            if (!keepRedo) this._redo = [];
            list.push(this._element.toDataURL());
            this.call("afterSave");
        }
    }, {
        key: 'restore',
        value: function restore(pop, push) {
            var _this3 = this;

            var resize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            this.call("beforeRestore");
            if (pop.length && !resize) {
                this.save(push, true);
                var reset = pop.pop();
                var img = document.createElement('img');
                img.src = reset;
                img.onload = function () {
                    _this3._ctx.clearRect(0, 0, _this3._element.width, _this3._element.height);
                    _this3._ctx.beginPath();
                    _this3._ctx.closePath();
                    _this3._ctx.drawImage(img, 0, 0, _this3._element.width, _this3._element.height, 0, 0, _this3._element.width, _this3._element.height);
                };
            } else if (resize) {
                while (pop.length > 1) {
                    pop.pop();
                }
                this.restore(pop, push);
            }
            this.call("afterRestore");
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.call("beforeUndo");
            this.restore(this._undo, this._redo);
            this.call("afterUndo");
        }
    }, {
        key: 'redo',
        value: function redo() {
            this.call("beforeRedo");
            this.restore(this._redo, this._undo);
            this.call("afterRedo");
        }

        // TODO: BUG ON EDGE NEED TO FIX THE EXPORT METHOD WITH A BETTER ONE

    }, {
        key: 'export',
        value: function _export() {
            this.call("beforeExport");
            window.location.href = this._element.toDataURL("image/png").replace("image/png", "image/octet-stream");
            this.call("afterExport");
        }
    }, {
        key: 'addResizeListeners',
        value: function addResizeListeners() {
            var _this4 = this;

            this.call("beforeAddResizeListeners");
            document.onmousedown = function (e) {
                var pos = _this4.getMousePosition(e);
                if (pos.x >= _this4._element.width && pos.x < _this4._element.width + 10 && pos.y >= _this4._element.height && pos.y < _this4._element.height + 10) {
                    _this4._dragging = true;
                }
                _this4.listener(e);
            };
            document.onmouseup = function (e) {
                if (!_this4._dragging) {
                    _this4.listener(e);
                    return;
                }
                _this4._dragging = false;
                var pos = _this4.getMousePosition(e);
                _this4.resize(pos.x, pos.y);
            };
            document.onmousemove = function (e) {
                if (!_this4._dragging) {
                    _this4.listener(e);
                    return;
                }
                var pos = _this4.getMousePosition(e);
                _this4.resize(pos.x, pos.y);
            };
            this.call("afterAddResizeListeners");
        }
    }, {
        key: 'call',
        value: function call(hook) {
            if (this.isset(this._hooks[hook])) this._hooks[hook].callback(this._hooks[hook].args);
        }
    }, {
        key: 'hooks',
        get: function get() {
            return this._hooks;
        },
        set: function set(value) {
            this._hooks = value;
        }
    }, {
        key: 'element',
        get: function get() {
            return this._element;
        },
        set: function set(value) {
            this._element = value;
        }
    }, {
        key: 'strokeStyle',
        get: function get() {
            return this._strokeStyle;
        },
        set: function set(value) {
            this._strokeStyle = value;
        }
    }, {
        key: 'linewidth',
        get: function get() {
            return this._linewidth;
        },
        set: function set(value) {
            this._linewidth = value;
        }
    }, {
        key: 'mode',
        get: function get() {
            return this._mode;
        },
        set: function set(value) {
            this._mode = value;
        }
    }, {
        key: 'modes',
        get: function get() {
            return this._modes;
        }
    }]);

    return Paint;
}();

exports.default = Paint;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOM = function () {
    function DOM() {
        _classCallCheck(this, DOM);
    }

    _createClass(DOM, null, [{
        key: '_',
        value: function _(selectors) {
            var selectorType = 'querySelectorAll';
            if (selectors.indexOf('#') === 0) {
                selectorType = 'getElementById';
                selectors = selectors.substr(1, selectors.length);
            }
            return document[selectorType](selectors);
        }
    }, {
        key: 'hasClass',
        value: function hasClass(el, className) {
            return el.classList.contains(className);
        }
    }, {
        key: 'addClass',
        value: function addClass(el, className) {
            el.classList.add(className);
        }
    }, {
        key: 'removeClass',
        value: function removeClass(el, className) {
            el.classList.remove(className);
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(el, className) {
            el.classList.toggle(className);
        }
    }]);

    return DOM;
}();

exports.default = DOM;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hook = exports.Hook = function () {
    function Hook(event, time, callback, args) {
        _classCallCheck(this, Hook);

        this._event = event;
        this._time = time;
        this._callback = callback;
        this._args = args;
    }

    _createClass(Hook, [{
        key: "hook",
        value: function hook(callback, args) {
            this._callback = callback;
            this._args = args;
        }
    }, {
        key: "event",
        get: function get() {
            return this._event;
        },
        set: function set(value) {
            this._event = value;
        }
    }, {
        key: "time",
        get: function get() {
            return this._time;
        },
        set: function set(value) {
            this._time = value;
        }
    }, {
        key: "callback",
        get: function get() {
            return this._callback;
        },
        set: function set(value) {
            this._callback = value;
        }
    }, {
        key: "args",
        get: function get() {
            return this._args;
        },
        set: function set(value) {
            this._args = value;
        }
    }]);

    return Hook;
}();

var hooks = {};
var timings = ["before", "after"];
var events = ["Create", "Resize", "GetMousePosition", "Listener", "Render", "Reset", "Save", "Restore", "Undo", "Redo", "Export", "AddResizeListeners"];
timings.forEach(function (timing) {
    events.forEach(function (event) {
        return hooks[timing + event] = new Hook(event, timing, function () {}, []);
    });
});
exports.hooks = hooks;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map