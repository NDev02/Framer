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

        let children = [...this.rootElement.children];
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
     * @param htmlCollection The child(ren) to add to the root element. If you want to pass in multiple children you can either put them in an array and pass in the array or comma separate each child as its own paramter to the method
     */
    append(...htmlCollection): void {

        if(htmlCollection.length > 1) {

            htmlCollection.forEach(node => {this.rootElement.append(node)});
            
        } else if(Array.isArray(htmlCollection[0])) {

            htmlCollection[0].forEach(node => {this.rootElement.append(node)});

        } else {
        
            this.rootElement.append(htmlCollection[0]);

        }

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
     * @description Returns whether or not Framer thinks the display size is small enough to be a mobile device
     */
    static isMobileSize() {

        return (window.innerWidth < 800);

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
     * @description Function called periodically, how often it is called can be set by `instance.setPeriodicFPS(x);` the default is 2fps if it has not been disabled upon initialization
     */
    periodic(): void {}

}

export abstract class FramerComponent extends HTMLElement {

    props;

    /**
     * @description Function called automatically by the browser when a custom element is appended to the DOM 
     */
    connectedCallback(): void {

        this.clear();
        this.init();

    }

    /**
     * @description A pain in the ass to accomplish masterpiece, this function is used to add a listener for when a specified property or attribute changes.
     * @param {string} name The name of the property to listen for change of
     * @param {Function} callback The function to call when the property has changed, receives two parameters: `(newVal, oldVal)`. The callback function you pass in will have `.bind(this)` applied to it automatically to ensure that `this` refers to this FramerComponent inside the callback.
     */
    onPropertyChange(name: string, callback: Function): void {

        callback = callback.bind(this);
        let initialValue = `${this[name]}`;
        let initialCall = true;

        let instance = this;

        Object.defineProperty(this, name, { 
            set: function(val) { let oldVal = "" + this[`_${name}`]; this[`_${name}`] = val; this.props[`_${name}`] = val; if(!initialCall) callback(val, oldVal) },
        });

        Object.defineProperty(this, name, { 
            get: function() { return this[`_${name}`]; },
        });

        Object.defineProperty(this.props, name, { 
            set: function(val) { let oldVal = "" + this[`_${name}`]; this[`_${name}`] = val; instance[`_${name}`] = val; if(!initialCall) callback(val, oldVal) },
        });

        Object.defineProperty(this.props, name, { 
            get: function() { return this[`_${name}`]; },
        });

        this[name] = initialValue;
        initialCall = false;

    }

    /**
     * @description Removes all children from this component
     */
    clear(): void {

        let children = [...this.children];
        children.forEach(child => child.remove());

    }

    /**
     * @description Function called when the component is added to the DOM
     */
    abstract init(): void;

}