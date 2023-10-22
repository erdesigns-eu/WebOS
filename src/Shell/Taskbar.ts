/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { SystemManager } from "../System/System";

/**
 * The Taskbar class
 * @class Taskbar
 * @description The custom element that represents the WebOS Taskbar
 * @extends HTMLElement
 */
class Taskbar extends HTMLElement {

  static elementName = "web-os-taskbar"; // The name of the custom element (used for registering the custom element)
  _height: number    = 40;               // The height of the taskbar
  
  /**
   * Creates a new Taskbar HTML element
   * @constructor
   * @description Creates a new Taskbar HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ['height'];
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
    // Make sure the value is different
    if (oldValue === newValue) {
      return;
    }
    // Handle the attribute change
    switch (name) {
      case 'height':
        this._height = parseInt(newValue);
        this.style.height = `${this._height}px`;
        break;
    }
  }

  /**
   * Returns the height of the taskbar
   * @property height
   */
  get height(): number {
    return this._height;
  }

  /**
   * Sets the height of the taskbar
   * @property height
   */
  set height(value: number) {
    this.setAttribute('height', value.toString());
  }

  /**
   * Returns the SystemManager instance
   */
  get system(): SystemManager {
    return SystemManager.getInstance();
  }

}

// Export the Taskbar class as a custom element
export { Taskbar };