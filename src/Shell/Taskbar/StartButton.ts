/**
 * Changelog:
 * - v1.0.0 (2023-11-02): Initial release
 */

import { Taskbar } from "../Taskbar";

/**
 * The startButtonSize type
 * @type startButtonSize
 * @description The startButtonSize type represents the size of the start button
 */
type startButtonSize = "small" | "medium" | "large" | "xlarge";

/**
 * The startButtonIcon SVG
 * @description The startButtonIcon SVG represents the SVG for the start button icon (imported as a raw string)
 */
import startButtonIconSVG from "/assets/logo.svg?raw";

/**
 * The StartButton class
 * @class StartButton
 * @description The custom element that represents the WebOS Start Button
 * @extends HTMLElement
 */
class StartButton extends HTMLElement {

  static elementName = "web-os-start-button"; // The name of the custom element (used for registering the custom element)
  _size: startButtonSize = "medium";          // The height of the taskbar
  
  /**
   * Creates a new Taskbar HTML element
   * @constructor
   * @description Creates a new Taskbar HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Set the innerHTML
    this.innerHTML = startButtonIconSVG;
    // Add type attribute
    this.setAttribute("type", "button");
    // Add tabindex attribute
    this.setAttribute("tabindex", "0");
    // Add aria-label attribute
    this.setAttribute("aria-label", "Start");
    // Add aria-role attribute
    this.setAttribute("role", "button");
  }

  /**
   * Updates the taskbar size
   * @method updateTaskbarSize
   * @description Updates the taskbar size
   */
  #updateTaskbarSize() {
    // Get the taskbar element
    const taskbar = this.taskbar;
    // Make sure the taskbar exists
    if (taskbar) {
      // Make sure the taskbar size attribute is not the same as the start button size attribute
      if (taskbar.getAttribute("size")?.localeCompare(this.size) === 0) {
        return;
      }
      // Set the taskbar size
      taskbar.setAttribute('size', this.size);
    }
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ['size'];
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
      case 'size':
        this._size = newValue as startButtonSize;
        this.#updateTaskbarSize();
        break;
    }
  }

  /**
   * Returns the size of the start button
   * @getter size
   */
  get size(): startButtonSize {
    return this._size;
  }

  /**
   * Sets the size of the start button
   * @getter size
   */
  set size(value: startButtonSize) {
    this.setAttribute('size', value);
  }

  /**
   * Returns the taskbar element
   * @getter taskbar
   */
  get taskbar(): Taskbar {
    return document.querySelector("web-os-taskbar") as Taskbar;
  }

}

// Export the Taskbar class as a custom element
export { StartButton };