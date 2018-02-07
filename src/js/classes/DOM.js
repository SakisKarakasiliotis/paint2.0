class DOM{
     static _(selectors){
        let selectorType = 'querySelectorAll';
        if (selectors.indexOf('#') === 0) {
            selectorType = 'getElementById';
            selectors = selectors.substr(1, selectors.length);
        }
        return document[selectorType](selectors);
    }
}

export default DOM;