/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { SystemManager } from "../System/System";

/**
 * The Desktop class
 * @class Desktop
 * @description The custom element that represents the WebOS desktop
 * @extends HTMLElement
 */
class Desktop extends HTMLElement {

  static elementName = "web-os-desktop"; // The name of the custom element (used for registering the custom element)
  
  /**
   * Creates a new Desktop HTML element
   * @constructor
   * @description Creates a new Desktop HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    // Initialization code
  }

  /**
   * The disconnectedCallback method
   * @method
   * @description The disconnectedCallback method is called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Uninitialization code
  }

  /**
   * The attributeChangedCallback method
   * @method
   * @description The attributeChangedCallback method is called when an attribute is added, removed, updated, or replaced on the element
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Attribute change code
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
  }

  /**
   * Returns the SystemManager instance
   */
  get system(): SystemManager {
    return SystemManager.getInstance();
  }

}

// Export the Desktop class as a custom element
export { Desktop };