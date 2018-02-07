import Paint from './classes/paint.js';
import DOM from './classes/DOM.js';

let pCanvas;
let _ = DOM._;

window.addEventListener("load", setup);


function setup() {
    let canvas = _("#paintArea");
    let color = _("#color");
    let size = _("#size");
    let exportAsPNG = _("#export");
    let reset = _("#reset");
    let tool = _("#tool");
    pCanvas = new Paint(canvas, 1024, 652, color.value, size.value);
    color.onchange = (e) => {
        pCanvas.strokeStyle = e.target.value
    };
    size.onchange = (e) => {
        pCanvas.linewidth = e.target.value
    };
    exportAsPNG.onclick = () => {
        window.location.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    };
    reset.onclick = () => {
        pCanvas.reset();
    };
    tool.onclick = (e) => {
        pCanvas.mode = e.target.value;
    };

}

