import Paint from './classes/paint.js';
import DOM from './classes/DOM.js';

const _ = DOM._;
const _t = DOM.toggleClass;

let pCanvas;
let canvas = _("#paintArea");
let color = _("#color");
let size = _("#size");
let exportAsPNG = _("#export");
let reset = _("#reset");
let tool = _("#tool");
let dragging = true;


window.addEventListener("load", setup);


function setup() {

    pCanvas = new Paint(canvas, 1024, 652, color.value, size.value);
    pCanvas.modes.forEach((mode) =>
        tool.innerHTML += `<option value="${mode}">${mode}</option>`
    );

    // TODO: add in class logic + bound to fathers size
    document.onmousedown = (event) => {
        let rect = canvas.getBoundingClientRect();
        let a =  {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        if(a.x >= canvas.width
            && a.x < canvas.width + 10
            && a.y >= canvas.height
            && a.y < canvas.height + 10){

            dragging = true;

        }

    };

    document.onmouseup = (event) => {
        console.log(event);
        if(!dragging) return;
        dragging = !dragging;
        let rect = canvas.getBoundingClientRect();
        let a =  {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        pCanvas.resize(a.x, a.y);
        _t(_("#main"), "draggable");
        _t(canvas, "draggable")


    };

    document.onmouseover = (event) => {
        let rect = canvas.getBoundingClientRect();
        let a =  {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

        if(a.x >= canvas.width
            && a.x < canvas.width + 10
            && a.y >= canvas.height
            && a.y < canvas.height + 10){

            _t(_("#main"), "draggable");
            _t(canvas, "draggable")
        }
    }

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
        window.location.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    };
    reset.onclick = () => {
        pCanvas.reset();
    };
    tool.onclick = (e) => {
        pCanvas.mode = e.target.value;
    };

}

