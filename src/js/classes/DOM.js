class DOM {
    static _(selectors) {
        let selectorType = 'querySelectorAll';
        if (selectors.indexOf('#') === 0) {
            selectorType = 'getElementById';
            selectors = selectors.substr(1, selectors.length);
        }
        return document[selectorType](selectors);
    }

    static hasClass(el, className) {
        return el.classList.contains(className);
    }

    static addClass(el, className) {
        el.classList.add(className);
    }

    static removeClass(el, className) {
        el.classList.remove(className);
    }

    static toggleClass(el, className) {
        el.classList.toggle(className);
    }
}

export default DOM;