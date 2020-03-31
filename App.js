import Framer from './framer_components/Framer.js';
import ExampleComponent from './framer_components/ExampleComponent.js';
Framer.css('styles.css');
class App extends Framer {
    constructor() {
        super("#root");
    }
    init() {
        this.append(Framer.createElement(ExampleComponent, null));
    }
}
export default (new App());
