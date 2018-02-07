class Paint {


    constructor(element, width, height, strokeStyle, linewidth) {
        const self = this;
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
        this._element.addEventListener("mousedown", (e) => self.listener(e));
        this._element.addEventListener("mouseup", (e) => self.listener(e));
        this._element.addEventListener("mousemove", (e) => self.listener(e));
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
    //TODO: FIX dont lose data on resize
    resize(width, height) {
        if (this.isset(width) && this.isset(height)) {
            if (width <= 0 || height <= 0) {
                console.error("Invalid parameters on resize()");
                return 0;
            }
            this._element.width = width;
            this._element.height = height;
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
    //TODO: Figure out a way to save canvas state
    save(){

    }
    //TODO: Export canvas to PNG format
    export(){

    }
}

export default Paint;
