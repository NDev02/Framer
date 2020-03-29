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
    append(htmlCollection) {
        this.rootElement.append(htmlCollection);
    }
    static css(src) {
        Framer.stagedInitFunctions.push(`this.css("${src}")`);
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
}
Framer.stagedInitFunctions = [];
export class FramerComponent extends HTMLElement {
    connectedCallback() {
        this.init();
    }
}
