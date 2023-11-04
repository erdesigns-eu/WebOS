/**
 * Changelog:
 * - v1.0.0 (2023-11-04): Initial release
 */

/**
 * The ShowDesktop class
 * @class ShowDesktop
 * @description The custom element that represents the WebOS show desktop button (in the taskbar)
 * @extends HTMLElement
 */
class ShowDesktop extends HTMLElement {

  static elementName = "web-os-taskbar-show-desktop"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new ShowDesktop HTML element
   * @constructor
   * @description Creates a new ShowDesktop HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }
  
}

// Export the ShowDesktop class as a custom element
export { ShowDesktop };