import Paint from './classes/paint.js';

let pCanvas;

window.addEventListener("load", setup);
window.addEventListener("resize", resize);


function setup() {
    let canvas = document.getElementById("paintArea");
    let color = document.getElementById("color");
    let size = document.getElementById("size");
    let exportAsPNG = document.getElementById("export");
    let reset = document.getElementById("reset");
    let tool = document.getElementById("tool");
    pCanvas = new Paint(1024, 532, canvas, color.value, size.value);
    pCanvas.resize(1024, 532);
    pCanvas.drawloop();
    color.onchange = (e) => {pCanvas.strokeStyle = e.target.value};
    size.onchange = (e) => {pCanvas.linewidth = e.target.value};
    exportAsPNG.onclick = (e) => {
       let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
       window.location.href = image;
    };
    reset.onclick = (e) => {
      pCanvas.reset();
    };
    tool.onclick = (e) => {
      pCanvas.mode = e.target.value;
    };

}

function resize() {
    pCanvas.resize(1024, 532);
}