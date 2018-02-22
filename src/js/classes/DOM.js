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

NodeList.prototype.get = function (i) {
    return this[i];
}
NodeList.prototype.hasClass = function (className) {
    return this[0].classList.contains(className);
}
Node.prototype.hasClass = function (className) {
    return this.classList.contains(className);
}
NodeList.prototype.addClass = function (className) {
    return this[0].classList.add(className);
}
Node.prototype.addClass = function (className) {
    return this.classList.add(className);
}
NodeList.prototype.removeClass = function (className) {
    return this[0].classList.remove(className);
}
Node.prototype.removeClass = function (className) {
    return this.classList.remove(className);
}
NodeList.prototype.toggleClass = function (className) {
    return this[0].classList.toggle(className);
}
Node.prototype.toggleClass = function (className) {
    return this.classList.toggle(className);
}


export default DOM;