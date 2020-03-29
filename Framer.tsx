/**
 * @author Nathan Gordon
 * @version v0.0.1
 * @description A janky-ish, in-development, web-framework. If you have VSCode most of the hard setup has been done for you, just download the example project and get started. In the example project you will find I have predefined two helpful VSCode snippets, cfa and cfc. cfa creates a template for a Framer Application and cfc creates a template for a Framer Component.
 */
export default abstract class Framer {

    static stagedInitFunctions: Array<string> = [];
    rootElement: HTMLElement;
    periodicInterval: number;

    /**
     * @description Creates a new Framer Application
     * @param {string} rootElementSelector The query selector of the element that the application is to be placed in
     * @param {boolean} enablePeriodic Specifies whether or not to call the periodic method at FPS set by `setPeriodicFPS(fps)`, defaults to 2 calls per second
     * @constructor Creates a Framer Application
     */
    constructor(rootElementSelector, enablePeriodic=false) {

        this.rootElement = document.querySelector(rootElementSelector);

        while(Framer.stagedInitFunctions.length > 0) {

            eval(Framer.stagedInitFunctions[0]);
            Framer.stagedInitFunctions.splice(0, 1);

        }

        if(!globalThis["framerInstances"])
            globalThis["framerInstances"] = [];
        globalThis["framerInstances"].push(this);

        this.setPeriodicFPS(enablePeriodic ? 2: 0);
        this.init();

    }

    /**
     * @description Removes all children from the root element
     */
    clearRoot(): void {

        let children = [...this.rootElement.children]
        children.forEach(child => child.remove());

    }

    /**
     * @description Sets how often the `periodic()` function gets called
     * @param {number} fps How many times you want the `periodic()` function called per second
     */
    setPeriodicFPS(fps: number): void {

        clearInterval(this.periodicInterval);
        this.periodicInterval = setInterval(() => {
        
            this.periodic();
        
        }, 1000/fps);

        if(fps == 0)
            clearInterval(this.periodicInterval);
    
    }

    /**
     * @description Imports a stylesheet
     * @param {string} src The source of the style sheet
     */
    css(src: string): void {

        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", src);
        this.rootElement.appendChild(link);

    }

    /**
     * @description Appends child(ren) to the application's root element
     * @param htmlCollection The child(ren) to add to the root element
     */
    append(htmlCollection: Node): void {

        this.rootElement.append(htmlCollection);

    }

    /**
     * @static
     * @description Adds a stylesheet to the queue of stylesheets to import, queue is gone through automatically
     * @param {string} src The source of the stylesheet to import 
     */
    static css(src: string): void {

        Framer.stagedInitFunctions.push(`this.css("${src}")`);

    }

    /**
     * @static
     * @description Takes transpiled JSX expressions and converts them into injectable HTML
     * @param {string} tag What the tag of the HTML element to create is
     * @param {Object} attributes What attributes to assign the element
     * @param children Any children the element may have
     */
    static createElement(tag, attributes: Object, ...children): HTMLElement {

        if(typeof tag == "function") {

            let tagName = `${tag.name}-comp`.toLowerCase();

            if(!customElements.get(tagName))
                customElements.define(tagName, tag);

            tag = tagName;

        }

        let element = document.createElement(tag);
        element = Object.assign(element, attributes);
        element.props = attributes;
        for(let child of children) {

            if(Array.isArray(child)) {

                element.append(...child);

            } else {

                element.append(child);

            }

        }
        return element;

    }

    /**
     * @abstract
     * @description Function called when the app is initialized
     */
    abstract init(): void;

    /**
     * @abstract
     * @description Function called periodically, how often it is called can be set by `instance.setPeriodicFPS(x);` the default is 2fps
     */
    abstract periodic(): void;

}

export abstract class FramerComponent extends HTMLElement {

    props;

    /**
     * @description Function called automatically by the browser when a custom element is appended to the DOM 
     */
    connectedCallback(): void {

        this.init();

    }

    /**
     * @description A pain in the ass to accomplish masterpiece, this function is used to add a listener for when a specified property or attribute changes.
     * @param name The name of the property to listen for change of
     * @param callback The function to call when the property has changed, receives two parameters: `(newVal, oldVal)`
     */
    onPropertyChange(name, callback) {

        let initialValue = `${this[name]}`;
        let initialCall = true;

        let instance = this;

        Object.defineProperty(this, name, { 
            set: function(val) { let oldVal = "" + this[`_${name}`]; this[`_${name}`] = val; this.props[`_${name}`] = val; if(!initialCall) callback(val, oldVal); },
        });

        Object.defineProperty(this, name, { 
            get: function() { return this[`_${name}`]; },
        });

        Object.defineProperty(this.props, name, { 
            set: function(val) { let oldVal = "" + this[`_${name}`]; this[`_${name}`] = val; instance[`_${name}`] = val; if(!initialCall) callback(val, oldVal); },
        });

        Object.defineProperty(this.props, name, { 
            get: function() { return this[`_${name}`]; },
        });

        this[name] = initialValue;
        initialCall = false;

    }

    /**
     * @description Function called when the component is added to the DOM
     */
    abstract init(): void;

}
