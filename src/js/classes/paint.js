class Paint {


    constructor(element, width, height, strokeStyle, linewidth) {
        this._element = element;
        this._element.width = width;
        this._element.height = height;
        this._drawing = false;
        this._mousePosition = {x: 0, y: 0};
        this._previousPosition = {x: 0, y: 0};
        this._ctx = this.element.getContext("2d");
        this._strokeStyle = strokeStyle;
        this._linewidth = linewidth;
        this._mode = "free";
        this._memory = document.createElement('canvas');
        this._memoryCtx = this._memory.getContext('2d');
        this._element.addEventListener("mousedown", (e) => this.listener(e));
        this._element.addEventListener("mouseup", (e) => this.listener(e));
        this._element.addEventListener("mousemove", (e) => this.listener(e));
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

    resize(width, height) {
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

    getMousePosition(event) {
        let rect = this._element.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    listener(event) {
        if (event.type === 'mousedown') {
            this._drawing = true;
            this._previousPosition = this.getMousePosition(event);
        } else if (event.type === 'mouseup') {
            this._drawing = false;
        } else if (event.type === 'mousemove') {
            this._mousePosition = this.getMousePosition(event);
        }
    }

    render() {
        if (this._drawing) {
            if (this._mode === "free"
                || this._mode === "eraser") {
                this._ctx.beginPath();
                this._ctx.globalCompositeOperation = this._mode === "eraser" ? 'destination-out' : 'source-over';
                this._ctx.strokeStyle = this._mode === "eraser" ? "rgba(0,0,0,1)" : this._strokeStyle;
                this._ctx.lineWidth = this._linewidth;
                this._ctx.lineCap = 'round';
                this._ctx.moveTo(this._previousPosition.x, this._previousPosition.y);
                this._ctx.lineTo(this._mousePosition.x, this._mousePosition.y);
                this._ctx.stroke();
                this._ctx.closePath();
                this._previousPosition = this._mousePosition;
            } else if (this._mode === "rect") {
                this._ctx.beginPath();
                this._ctx.fillStyle = this._strokeStyle;
                this._ctx.rect(
                    this._mousePosition.x,
                    this._mousePosition.y,
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
    }

    isset(parameter) {
        return typeof parameter !== 'undefined';
    }

    save() {
        this._memory.width = this._element.width;
        this._memory.height = this._element.height;
        this._memoryCtx.drawImage(this._element, 0, 0);
    }

    restore() {
        this._ctx.drawImage(this._memory, 0, 0);
    }

    //TODO: Export canvas to PNG format
    export() {

    }
}

export default Paint;
