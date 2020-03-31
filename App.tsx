
// Helpful hint: as of right now to import any .tsx framer component you need to import it as ./path/component_name.js
// Recommendation: for better organization consider storing components in the framer_components folder

// Imports the Framer class so we can create an app that extends it 
import Framer from './framer_components/Framer.js';

// Imports the ExampleComponent class so we can use it
import ExampleComponent from './framer_components/ExampleComponent.js';

// Imports the styles.css file
Framer.css('styles.css');

// Declares a framer app class
class App extends Framer {

    constructor() {

        // our app will be put in the element with id of root in our page, see index.html if you don't understand
        super("#root");

    }

    init() {

        // append the above html elements to our component. You could pass components to add as paramaters separated by commas, as an array or just write HTML between the paranthesis - for multiple HTML elements separate them with commas
        this.append(<ExampleComponent/>);

    }

}

// instantiates an app when the page loads 
export default (new App());
