/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { WebOS } from "./Shell/WebOS";

/**
 * The register function
 * @function registerWebOSElements
 * @description Registers the WebOS custom elements with the browser
 * @returns {void}
 */
const registerWebOSElements = (): void => {
  // Register the WebOS custom element
  customElements.define(WebOS.elementName, WebOS);
};

// Export the register function
export { registerWebOSElements };