class Paint {
    constructor(element, width = 500, height = 500, strokeStyle = '#ccc', linewidth = '5', backgroundColor = '#ffffff', hooks = {}) {
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
        this._mousePosition = {x: 0, y: 0};
        this._previousPosition = {};
        this._ctx = this._element.getContext("2d");
        this._mode = 'free';
        this._ctx.fillStyle = this._backgroundColor;
        this._element.style.backgroundColor = "white";
        // Helpers
        this._modes = [
            'free',
            'rect',
            'eraser',
            'line',
        ];
        this._undo = [];
        this._undo.push(this._element.toDataURL());
        this._redo = [];
        // Listeners
        const listeners = ["onmousedown", "onmouseup", "onmousemove", "onmouseout", "touchstart", "touchmove", "touchend"];
        listeners.forEach(listener => {
            this._element.addEventListener(listener, e => this.listener(e));
        });
        this.addResizeListeners();
        // Init paint
        this.drawloop();
        this.call("afterCreate");

    }

    get hooks() {
        return this._hooks;
    }

    set hooks(value) {
        this._hooks = value;
    }

    get element() {
        return this._element;
    }

    set element(value) {
        this._element = value;
    }

    get strokeStyle() {
        return this._strokeStyle;
    }

    set strokeStyle(value) {
        this._strokeStyle = value;
    }

    get linewidth() {
        return this._linewidth;
    }

    set linewidth(value) {
        this._linewidth = value;
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;
    }

    get modes() {
        return this._modes;
    }

    resize(width, height) {
        this.call("beforeResize");
        this.save();
        const memory = document.createElement('canvas');
        let memoryCtx = memory.getContext('2d');
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

    getMousePosition(event) {
        this.call("beforeGetMousePosition");
        let rect = this._element.getBoundingClientRect();
        let pos;
        if (!(this.isset(event.clientX) && this.isset(event.clientY))) {
            pos = {
                x: event.changedTouches[0].clientX - rect.left,
                y: event.changedTouches[0].clientY - rect.top
            };
        } else {
            pos = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }
        this.call("afterGetMousePosition");
        return pos;
    }

    listener(event) {
        this.call("beforeListener");
        if (event.type === 'mouseout') {
            this._drawing = false;
        }
        if (this._mode === 'line'
            || this.mode === 'rect') {
            if (event.type === 'mousedown'
                || event.type === 'touchstart') {
                this._drawing = false;
                this._previousPosition = this.getMousePosition(event);
            } else if (event.type === 'mouseup'
                || event.type === 'touchend') {
                this.save();
                this._drawing = true;
                this._mousePosition = this.getMousePosition(event);
            }
        } else {
            if (event.type === 'mousedown'
                || event.type === 'touchstart') {
                this.save();
                this._drawing = true;
                this._previousPosition = this.getMousePosition(event);
            } else if (event.type === 'mouseup'
                || event.type === 'touchend') {
                this._drawing = false;
            } else if (event.type === 'mousemove'
                || event.type === 'touchmove') {
                this._mousePosition = this.getMousePosition(event);
            }
        }

        this.call("afterListener");
    }

    render() {
        this.call("beforeRender");
        if (this._drawing) {
            if (this._mode === "free"
                || this._mode === "eraser"
                || this._mode === 'line') {
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
                const quadrant = {
                    x: this._mousePosition.x < this._previousPosition.x
                        ? this._mousePosition.x : this._previousPosition.x,
                    y: this._mousePosition.y < this._previousPosition.y
                        ? this._mousePosition.y : this._previousPosition.y
                };
                this._ctx.rect(
                    quadrant.x,
                    quadrant.y,
                    Math.abs(this._mousePosition.x - this._previousPosition.x),
                    Math.abs(this._mousePosition.y - this._previousPosition.y)
                );
                this._ctx.fill();
                this._ctx.closePath();
                this._drawing = false;
            }
        }
        this.call("afterRender");
    }

    drawloop() {
        requestAnimationFrame(() => this.drawloop());
        this.render();
    }

    reset() {
        this.call("beforeReset");
        this._ctx.fillStyle = "#ffffff";
        this._ctx.fillRect(0, 0, this._element.width, this._element.height);
        this._ctx.beginPath();
        this._previousPosition = {x: 0, y: 0};
        this._mousePosition = {x: 0, y: 0};
        this._ctx.closePath();
        this._undo = [];
        this._redo = [];
        this.call("afterReset");
    }

    isset(parameter) {
        return typeof parameter !== 'undefined';
    }

    // Much needed credits for undo/redo functionality https://codepen.io/abidibo/
    save(list = this._undo, keepRedo = false) {
        this.call("beforeSave");
        if (!keepRedo)
            this._redo = [];
        list.push(this._element.toDataURL());
        this.call("afterSave");
    }

    restore(pop, push, resize = false) {
        this.call("beforeRestore");
        if (pop.length && !resize) {
            this.save(push, true);
            const reset = pop.pop();
            let img = document.createElement('img');
            img.src = reset;
            img.onload = () => {
                this._ctx.clearRect(0, 0, this._element.width, this._element.height);
                this._ctx.beginPath();
                this._ctx.closePath();
                this._ctx.drawImage(img, 0, 0, this._element.width, this._element.height, 0, 0, this._element.width, this._element.height);
            };
        } else if (resize) {
            while (pop.length > 1) {
                pop.pop();
            }
            this.restore(pop, push);
        }
        this.call("afterRestore");
    }

    undo() {
        this.call("beforeUndo");
        this.restore(this._undo, this._redo);
        this.call("afterUndo");
    }

    redo() {
        this.call("beforeRedo");
        this.restore(this._redo, this._undo);
        this.call("afterRedo");
    }

    // TODO: BUG ON EDGE NEED TO FIX THE EXPORT METHOD WITH A BETTER ONE
    export() {
        this.call("beforeExport");
        window.location.href = this._element.toDataURL("image/png").replace("image/png", "image/octet-stream");
        this.call("afterExport");
    }

    addResizeListeners() {
        this.call("beforeAddResizeListeners");
        document.onmousedown = e => {
            let pos = this.getMousePosition(e);
            if (pos.x >= this._element.width
                && pos.x < this._element.width + 10
                && pos.y >= this._element.height
                && pos.y < this._element.height + 10) {
                this._dragging = true;
            }
            this.listener(e);
        };
        document.onmouseup = e => {
            if (!this._dragging) {
                this.listener(e);
                return;
            }
            this._dragging = false;
            let pos = this.getMousePosition(e);
            this.resize(pos.x, pos.y);
        };
        document.onmousemove = e => {
            if (!this._dragging) {
                this.listener(e);
                return;
            }
            let pos = this.getMousePosition(e);
            this.resize(pos.x, pos.y);
        };
        this.call("afterAddResizeListeners");

    }

    call(hook) {
        if (this.isset(this._hooks[hook]))
            this._hooks[hook].callback(this._hooks[hook].args);
    }
}

export default Paint;
