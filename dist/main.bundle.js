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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCanvas = void 0;

window.addEventListener("load", setup);
window.addEventListener("resize", resize);

function setup() {
    var canvas = document.getElementById("paintArea");
    var color = document.getElementById("color");
    var size = document.getElementById("size");
    var exportAsPNG = document.getElementById("export");
    var reset = document.getElementById("reset");
    var tool = document.getElementById("tool");
    pCanvas = new _paint2.default(1024, 532, canvas, color.value, size.value);
    pCanvas.resize(1024, 532);
    pCanvas.drawloop();
    color.onchange = function (e) {
        pCanvas.strokeStyle = e.target.value;
    };
    size.onchange = function (e) {
        pCanvas.linewidth = e.target.value;
    };
    exportAsPNG.onclick = function (e) {
        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href = image;
    };
    reset.onclick = function (e) {
        pCanvas.reset();
    };
    tool.onclick = function (e) {
        pCanvas.mode = e.target.value;
    };
}

function resize() {
    pCanvas.resize(1024, 532);
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
    function Paint(width, height, element, strokeStyle, linewidth) {
        _classCallCheck(this, Paint);

        var self = this;
        this._width = width;
        this._height = height;
        this._element = element;
        this._element.width = this._width;
        this._element.height = this._height;
        this._drawing = false;
        this._mousePosition = { x: 0, y: 0 };
        this._previousPosition = { x: 0, y: 0 };
        this._ctx = this.element.getContext("2d");
        this._strokeStyle = strokeStyle;
        this._linewidth = linewidth;
        this._mode = "free";
        this.element.addEventListener("mousedown", function (e) {
            return self.listener(e);
        });
        this.element.addEventListener("mouseup", function (e) {
            return self.listener(e);
        });
        this.element.addEventListener("mousemove", function (e) {
            return self.listener(e);
        });
    }

    _createClass(Paint, [{
        key: "resize",
        value: function resize(width, height) {

            if (height / width > window.innerHeight / window.innerWidth) {
                this.height = window.innerHeight - 100;
                this.width = this.height * (width / height);
            } else {
                this.width = window.innerWidth - 100;
                this.height = this.width * (height / width);
            }

            this.element.width = this.width;
            this.element.height = this.height;
        }
    }, {
        key: "getMousePosition",
        value: function getMousePosition(event) {
            var rect = this.element.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
    }, {
        key: "listener",
        value: function listener(event) {
            if (event.type === 'mousedown') {
                this._drawing = true;
                this._previousPosition = this.getMousePosition(event);
            } else if (event.type === 'mouseup') {
                this._drawing = false;
            } else if (event.type === 'mousemove') {
                this._mousePosition = this.getMousePosition(event);
            }
        }
    }, {
        key: "render",
        value: function render() {
            if (this._drawing) {
                if (this._mode === "free") {
                    this._ctx.beginPath();
                    this._ctx.strokeStyle = this._strokeStyle;
                    this._ctx.lineWidth = this._linewidth;
                    this._ctx.moveTo(this._previousPosition.x, this._previousPosition.y);
                    this._ctx.lineTo(this._mousePosition.x, this._mousePosition.y);
                    this._ctx.stroke();
                    this._ctx.closePath();
                    this._previousPosition = this._mousePosition;
                } else if (this._mode === "rect") {
                    this._ctx.beginPath();
                    this._ctx.fillStyle = this._strokeStyle;
                    // this._ctx.lineWidth = this._linewidth;
                    this._ctx.rect(this._mousePosition.x, this._mousePosition.y, Math.abs(this._mousePosition.x - this._previousPosition.x), Math.abs(this._mousePosition.y - this._previousPosition.y));
                    this._ctx.fill();
                    this._ctx.closePath();
                }
            }
        }
    }, {
        key: "drawloop",
        value: function drawloop() {
            var _this = this;

            requestAnimationFrame(function () {
                return _this.drawloop();
            });
            this.render();
        }
    }, {
        key: "reset",
        value: function reset() {
            this._ctx.clearRect(0, 0, this.width, this.height);
            this._ctx.beginPath();
            this._previousPosition = { x: 0, y: 0 };
            this._mousePosition = { x: 0, y: 0 };
            this._ctx.closePath();
        }
    }, {
        key: "width",
        get: function get() {
            return this._width;
        },
        set: function set(value) {
            this._width = value;
        }
    }, {
        key: "height",
        get: function get() {
            return this._height;
        },
        set: function set(value) {
            this._height = value;
        }
    }, {
        key: "element",
        get: function get() {
            return this._element;
        },
        set: function set(value) {
            this._element = value;
        }
    }, {
        key: "strokeStyle",
        get: function get() {
            return this._strokeStyle;
        },
        set: function set(value) {
            this._strokeStyle = value;
        }
    }, {
        key: "linewidth",
        get: function get() {
            return this._linewidth;
        },
        set: function set(value) {
            this._linewidth = value;
        }
    }, {
        key: "mode",
        get: function get() {
            return this._mode;
        },
        set: function set(value) {
            this._mode = value;
        }
    }]);

    return Paint;
}();

exports.default = Paint;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map