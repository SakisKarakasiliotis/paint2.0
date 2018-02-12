export class Hook {
    constructor(event, time, callback, args) {
        this._event = event;
        this._time = time;
        this._callback = callback;
        this._args = args;
    }

    get event() {
        return this._event;
    }

    set event(value) {
        this._event = value;
    }

    get time() {
        return this._time;
    }

    set time(value) {
        this._time = value;
    }

    get callback() {
        return this._callback;
    }

    set callback(value) {
        this._callback = value;
    }

    get args() {
        return this._args;
    }

    set args(value) {
        this._args = value;
    }

    hook(callback, args){
        this._callback = callback;
        this._args = args;
    }
}

let hooks = {};
const timings = ["before", "after"];
const events = [
    "Create",
    "Resize",
    "GetMousePosition",
    "Listener",
    "Render",
    "Reset",
    "Save",
    "Restore",
    "Undo",
    "Redo",
    "Export",
    "AddResizeListeners"
];
timings.forEach(timing => {
    events.forEach(event => hooks[timing + event] = new Hook(event, timing, () => {
    }, []));
});
export {hooks};

