import Paint from './classes/paint.js';
import DOM from './classes/DOM.js';
import {hooks} from './classes/hook.js';

const _ = DOM._;

let pCanvas;
let canvas = _("#paintArea");
let color = _("#color");
let size = _("#size");
let exportAsPNG = _("#export");
let reset = _("#reset");
let tool = _("#tool");


window.addEventListener("load", setup);


function setup() {
    pCanvas = new Paint(canvas, 1024, 652, color.value, size.value, '#ffffff', hooks);
    pCanvas.modes.forEach((mode) =>
        tool.innerHTML += `<option value="${mode}">${mode}</option>`
    );

    document.onkeydown = (e) => {
        let eventobj = window.event ? window.event : e;
        if (eventobj.key === 'z' && eventobj.ctrlKey && !eventobj.shiftKey) {
            pCanvas.undo();
        }
        else if (eventobj.key === 'Z' && eventobj.ctrlKey && eventobj.shiftKey) {
            pCanvas.redo();
        }
    };

    color.onchange = (e) => {
        pCanvas.strokeStyle = e.target.value
    };
    size.onchange = (e) => {
        pCanvas.linewidth = e.target.value
    };
    exportAsPNG.onclick = () => {
        pCanvas.export();
    };
    reset.onclick = () => {
        pCanvas.reset();
    };
    tool.onclick = (e) => {
        pCanvas.mode = e.target.value;
    };

}

