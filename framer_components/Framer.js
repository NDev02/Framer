export default class Framer {
    constructor(rootElementSelector, enablePeriodic = false) {
        this.rootElement = document.querySelector(rootElementSelector);
        while (Framer.stagedInitFunctions.length > 0) {
            eval(Framer.stagedInitFunctions[0]);
            Framer.stagedInitFunctions.splice(0, 1);
        }
        if (!globalThis["framerInstances"])
            globalThis["framerInstances"] = [];
        globalThis["framerInstances"].push(this);
        this.setPeriodicFPS(enablePeriodic ? 2 : 0);
        this.init();
    }
    clearRoot() {
        let children = [...this.rootElement.children];
        children.forEach(child => child.remove());
    }
    setPeriodicFPS(fps) {
        clearInterval(this.periodicInterval);
        this.periodicInterval = setInterval(() => {
            this.periodic();
        }, 1000 / fps);
        if (fps == 0)
            clearInterval(this.periodicInterval);
    }
    css(src) {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", src);
        this.rootElement.appendChild(link);
    }
    append(...htmlCollection) {
        if (htmlCollection.length > 1) {
            htmlCollection.forEach(node => { this.rootElement.append(node); });
        }
        else if (Array.isArray(htmlCollection[0])) {
            htmlCollection[0].forEach(node => { this.rootElement.append(node); });
        }
        else {
            this.rootElement.append(htmlCollection[0]);
        }
    }
    static css(src) {
        Framer.stagedInitFunctions.push(`this.css("${src}")`);
    }
    static isMobileSize() {
        return (window.innerWidth < 800);
    }
    static createElement(tag, attributes, ...children) {
        if (typeof tag == "function") {
            let tagName = `${tag.name}-comp`.toLowerCase();
            if (!customElements.get(tagName))
                customElements.define(tagName, tag);
            tag = tagName;
        }
        let element = document.createElement(tag);
        element = Object.assign(element, attributes);
        element.props = attributes;
        for (let child of children) {
            if (Array.isArray(child)) {
                element.append(...child);
            }
            else {
                element.append(child);
            }
        }
        return element;
    }
    periodic() { }
}
Framer.stagedInitFunctions = [];
export class FramerComponent extends HTMLElement {
    connectedCallback() {
        this.clear();
        this.init();
    }
    onPropertyChange(name, callback) {
        callback = callback.bind(this);
        let initialValue = `${this[name]}`;
        let initialCall = true;
        let instance = this;
        Object.defineProperty(this, name, {
            set: function (val) { let oldVal = "" + this[`_${name}`]; this[`_${name}`] = val; this.props[`_${name}`] = val; if (!initialCall)
                callback(val, oldVal); },
        });
        Object.defineProperty(this, name, {
            get: function () { return this[`_${name}`]; },
        });
        Object.defineProperty(this.props, name, {
            set: function (val) { let oldVal = "" + this[`_${name}`]; this[`_${name}`] = val; instance[`_${name}`] = val; if (!initialCall)
                callback(val, oldVal); },
        });
        Object.defineProperty(this.props, name, {
            get: function () { return this[`_${name}`]; },
        });
        this[name] = initialValue;
        initialCall = false;
    }
    clear() {
        let children = [...this.children];
        children.forEach(child => child.remove());
    }
}
