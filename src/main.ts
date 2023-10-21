// Import the main scss file to be compiled into the main.css file
import "../styles/main.scss";

// Import the SystemManager class
import { SystemManager } from "./System/System";
// Instantiate the SystemManager instance and load the kernel modules, register root, and permission callback.
SystemManager.instantiate();

// Import the WebOS custom element registration function
import { registerWebOSElements } from "./register-elements";
// Register the WebOS custom elements with the browser
registerWebOSElements();