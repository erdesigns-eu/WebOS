/**
 * Changelog:
 * - v1.0.0 (2023-11-02): Initial release
 */

import { Taskbar } from "../Taskbar";
import { Startmenu } from "../Startmenu";

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
  _size   : startButtonSize = "medium";       // The height of the taskbar
  _opened : boolean         = false;          // Whether or not the start menu is opened
  
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
   * The handleClick method
   * @method handleClick
   * @description The handleClick method handles the click event on the start button
   */
  #handleClick() {
    // Get the start menu element
    const startMenu = this.startMenu;
    // Make sure the start menu exists
    if (startMenu) {
      // Toggle the start menu
      startMenu.toggle();
    }
  }

  /**
   * The handleKeydown method
   * @method handleKeydown
   * @description The handleKeydown method handles the keydown event on the start button
   */
  #handleKeydown(event: KeyboardEvent) {
    // Get the start menu element
    const startMenu = this.startMenu;
    // Make sure the start menu exists
    if (startMenu) {
      // Make sure the key is the enter key
      if (event.key === "Enter") {
        // Toggle the opened attribute
        startMenu.toggle();
      }
    }
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["size", "opened"];
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    // Add the click event listener
    this.addEventListener("click", this.#handleClick);
    // Add the keydown event listener
    this.addEventListener("keydown", this.#handleKeydown);
  }

  /**
   * The disconnectedCallback method
   * @method
   * @description The disconnectedCallback method is called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Remove the click event listener
    this.removeEventListener("click", this.#handleClick);
    // Remove the keydown event listener
    this.removeEventListener("keydown", this.#handleKeydown);
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
      case "size":
        // Nothing to do here.
        break;
      case "opened":
        // Nothing to do here.
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
    this.setAttribute("size", value);
  }

  /**
   * Returns the taskbar element
   * @getter taskbar
   */
  get taskbar(): Taskbar {
    return document.querySelector("web-os-taskbar") as Taskbar;
  }

  /**
   * Returns the start menu element
   * @getter startMenu
   */
  get startMenu(): Startmenu {
    return document.querySelector("web-os-start-menu") as Startmenu;
  }

}

// Export the Taskbar class as a custom element
export { StartButton };