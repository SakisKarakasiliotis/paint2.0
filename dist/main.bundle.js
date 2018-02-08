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

    pCanvas = new _paint2.default(canvas, 1024, 652, color.value, size.value);
    pCanvas.modes.forEach(function (mode) {
        return tool.innerHTML += '<option value="' + mode + '">' + mode + '</option>';
    });
    color.onchange = function (e) {
        pCanvas.strokeStyle = e.target.value;
    };
    size.onchange = function (e) {
        pCanvas.linewidth = e.target.value;
    };
    exportAsPNG.onclick = function () {
        window.location.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
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
    function Paint(element, width, height, strokeStyle, linewidth) {
        var _this = this;

        _classCallCheck(this, Paint);

        this._element = element;
        this._element.width = width;
        this._element.height = height;
        this._drawing = false;
        this._mousePosition = { x: 0, y: 0 };
        // this._previousPosition = {x: 0, y: 0};
        this._previousPosition = {};
        this._ctx = this.element.getContext("2d");
        this._strokeStyle = strokeStyle;
        this._linewidth = linewidth;
        this._mode = 'free';
        this._memory = document.createElement('canvas');
        this._memoryCtx = this._memory.getContext('2d');
        this._modes = ['free', 'rect', 'eraser', 'line'];
        this._element.addEventListener("mousedown", function (e) {
            return _this.listener(e);
        });
        this._element.addEventListener("mouseup", function (e) {
            return _this.listener(e);
        });
        this._element.addEventListener("mousemove", function (e) {
            return _this.listener(e);
        });
        this.drawloop();
    }

    _createClass(Paint, [{
        key: 'resize',
        value: function resize(width, height) {
            this.save();
            if (this.isset(width) && this.isset(height)) {
                if (width <= 0 || height <= 0) {
                    console.error("Invalid parameters on resize()");
                    return 0;
                }
                this._element.width = width;
                this._element.height = height;
                this.restore();
                return 1;
            }
            console.error("Parameter missing on resize()");
            return 0;
        }
    }, {
        key: 'getMousePosition',
        value: function getMousePosition(event) {
            var rect = this._element.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
    }, {
        key: 'listener',
        value: function listener(event) {
            if (this._mode === 'line' || this.mode === 'rect') {
                if (event.type === 'mousedown') {
                    this._drawing = false;
                    this._previousPosition = this.getMousePosition(event);
                } else if (event.type === 'mouseup') {
                    this._drawing = true;
                    this._mousePosition = this.getMousePosition(event);
                }
            } else {
                if (event.type === 'mousedown') {
                    this._drawing = true;
                    this._previousPosition = this.getMousePosition(event);
                } else if (event.type === 'mouseup') {
                    this._drawing = false;
                } else if (event.type === 'mousemove') {
                    this._mousePosition = this.getMousePosition(event);
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
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
                    this._ctx.save();
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
                }
            }
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
            // this._ctx.clearRect(0, 0, this._element.width, this._element.height);
            // this._ctx.beginPath();
            // this._previousPosition = {x: 0, y: 0};
            // this._mousePosition = {x: 0, y: 0};
            // this._ctx.closePath();
            this._ctx.restore();
        }
    }, {
        key: 'isset',
        value: function isset(parameter) {
            return typeof parameter !== 'undefined';
        }
    }, {
        key: 'save',
        value: function save() {
            this._memory.width = this._element.width;
            this._memory.height = this._element.height;
            this._memoryCtx.drawImage(this._element, 0, 0);
        }
    }, {
        key: 'restore',
        value: function restore() {
            this._ctx.drawImage(this._memory, 0, 0);
        }

        //TODO: Export canvas to PNG format

    }, {
        key: 'export',
        value: function _export() {}
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
    }]);

    return DOM;
}();

exports.default = DOM;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map