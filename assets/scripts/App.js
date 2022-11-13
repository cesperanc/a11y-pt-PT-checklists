import Logo from "./Logo.js";
import InputFields from "./InputFields.js";
import AppMenu from "./AppMenu.js";
import TestsLoader from "./TestsLoader.js";

document.documentElement.classList.replace('no-js', 'js');

const executeOnContentLoaded = (callback)=>{
    if(typeof callback === 'function'){
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }
};

// Prepare the UI
executeOnContentLoaded(()=>{
    Logo();
    InputFields();
    AppMenu();
});

// Load the tests
export default (tests)=>{
    executeOnContentLoaded(()=>{
        TestsLoader(tests||[]);
    });
};

