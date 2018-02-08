class Paint {

    constructor(element, width, height, strokeStyle, linewidth) {
        // User parameters
        this._element = element;
        this._element.width = width;
        this._element.height = height;
        this._strokeStyle = strokeStyle;
        this._linewidth = linewidth;
        // Utility parameters
        this._drawing = false;
        this._mousePosition = {x: 0, y: 0};
        this._previousPosition = {};
        this._ctx = this._element.getContext("2d");
        this._mode = 'free';
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
        this._element.addEventListener("mousedown", (e) => this.listener(e));
        this._element.addEventListener("mouseup", (e) => this.listener(e));
        this._element.addEventListener("mousemove", (e) => this.listener(e));
        // Init paint
        this.drawloop();
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
            this._ctx.drawImage(memory, 0, 0);

            return 1;
        }
        console.error("Parameter missing on resize()");
        return 0;
    }

    getMousePosition(event) {
        let rect = this._element.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    listener(event) {
        if (this._mode === 'line'
            || this.mode === 'rect') {
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
    }

    render() {
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
            }
        }
    }

    drawloop() {
        requestAnimationFrame(() => this.drawloop());
        this.render();
    }

    reset() {
        this._ctx.clearRect(0, 0, this._element.width, this._element.height);
        this._ctx.beginPath();
        this._previousPosition = {x: 0, y: 0};
        this._mousePosition = {x: 0, y: 0};
        this._ctx.closePath();
        this._undo = [];
        this._redo = [];
    }

    isset(parameter) {
        return typeof parameter !== 'undefined';
    }

    // Much needed credits for undo/redo functionality https://codepen.io/abidibo/
    save(list = this._undo, keepRedo = false) {
        if (!keepRedo)
            this._redo = [];
        list.push(this._element.toDataURL());
    }

    restore(pop, push, resize = false) {
        if (pop.length && !resize) {
            this.save(push, true);
            const reset = pop.pop();
            let img = document.createElement('img');
            img.src = reset;
            img.onload = () => {
                this._ctx.clearRect(0, 0, this._element.width, this._element.height);
                this._ctx.drawImage(img, 0, 0, this._element.width, this._element.height, 0, 0, this._element.width, this._element.height);
            };
        } else if (resize) {
            while (pop.length > 1) {
                pop.pop();
            }
            this.restore(pop, push);
        }
    }

    undo() {
        this.restore(this._undo, this._redo);
    }

    redo() {
        this.restore(this._redo, this._undo);
    }

    //TODO: Export canvas to PNG format
    export() {

    }
}

export default Paint;
