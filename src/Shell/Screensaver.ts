/**
 * Changelog:
 * - v1.0.0 (2023-11-01): Initial release
 */

import { Screensaver } from "./Screensaver/Index";
import { Logo } from "./Screensaver/Logo";

/**
 * The ScreenSaverError class
 * @class ScreenSaverError
 * @description The custom error class for the ScreenSaver class
 * @extends Error
 */
class ScreenSaverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScreenSaverError";
  }
}

/**
 * The ScreenSaver class
 * @class ScreenSaver
 * @description The custom element that represents the WebOS screensaver
 * @extends HTMLElement
 */
class ScreenSaver extends HTMLElement {

  #backgroundElement : HTMLCanvasElement|null   = null;   // The background element
  #animation         : Screensaver|null         = null;   // The screensaver animation instance
  #resizeObserver    : ResizeObserver|null      = null;   // The resize observer instance

  static elementName = "web-os-screensaver"; // The name of the custom element (used for registering the custom element)

  _screensaver : string   = "logo"; // The screensaver animation to use
  _active      : boolean  = false;  // The screensaver animation active state
  
  /**
   * Creates a new ScreenSaver HTML element
   * @constructor
   * @description Creates a new ScreenSaver HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Create the shadow DOM
    const shadowRoot = this.attachShadow({ mode: "closed" });
    // Create the background element
    this.#backgroundElement                   = document.createElement("canvas");
    this.#backgroundElement.width             = innerWidth;
    this.#backgroundElement.height            = innerHeight;
    // Set the background element"s styles
    this.#backgroundElement.style.position    = "absolute";
    this.#backgroundElement.style.top         = "0";
    this.#backgroundElement.style.left        = "0";
    this.#backgroundElement.style.width       = "100%";
    this.#backgroundElement.style.height      = "100%";
    this.#backgroundElement.style.background  = "transparent";
    // Add a resize observer to the background element to resize it accordingly when the window is resized
    this.#resizeObserver = new ResizeObserver(this.#handleResize.bind(this));
    this.#resizeObserver.observe(this);
    // Add the background element to the shadow DOM
    shadowRoot.appendChild(this.#backgroundElement);
    // Set the screensaver to the default screensaver
    this.#setScreensaver(this._screensaver, false);
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["screensaver", "active"];
  }

  /**
   * Handles the resize event
   * @method handleResize
   * @description Handles the resize event and resizes the animation element accordingly
   */
  #handleResize(entries: ResizeObserverEntry[]) {
    if (entries.length) {
      const { width, height } = entries[0].contentRect;
      this.#backgroundElement!.width = width;
      this.#backgroundElement!.height = height;
      if (this.#animation && this.#animation.active) {
        this.#animation.stop();
        this.#animation.start();
      }
    }
  }

  /**
   * Handles the mouse move event
   * @method handleMouseMove
   * @description Handles the mouse move event and stops the screensaver animation.
   */
  #handleMouseMove() {
    if (this.#animation && this.#animation.active) {
      this.#animation.stop();
      this._active = false;
      this.setAttribute("active", "false");
    }
  }

  /**
   * Sets the screensaver animation
   * @method setScreensaver
   * @description Sets the screensaver animation to the specified animation
   * @param {string} screensaver The screensaver animation to set
   */
  #setScreensaver(screensaver: string, start: boolean = true) {
    // Remove the old screensaver
    if (this.#animation) {
      this.#animation.stop();
      this.#animation = null;
    }
    // Create the new screensaver
    switch (screensaver) {
      case "logo":
        this.#animation = new Logo(this.#backgroundElement!, this.#backgroundElement!.getContext("2d")!);
        break;
      default:
        throw new ScreenSaverError(`The screensaver "${screensaver}" does not exist!`);
    }
    // Start the screensaver
    if (start) {
      this.#animation?.start();
    }
  }

  /**
   * Sets the screensaver animation active state
   * @method setActive
   * @description Sets the screensaver animation active state to the specified state
   * @param {boolean} active The screensaver animation active state to set
   */
  #setActive(active: boolean) {
    if (active) {
      this.#animation?.start();
    } else {
      this.#animation?.stop();
    }
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    // Add a event listener to the document to stop the screensaver when the mouse is moved
    document.addEventListener("mousemove", this.#handleMouseMove.bind(this));
    // Add a event listener to the document to stop the screensaver when the mouse is clicked
    document.addEventListener("click", this.#handleMouseMove.bind(this));
    // Add a event listener to the document to stop the screensaver when a key is pressed
    document.addEventListener("keydown", this.#handleMouseMove.bind(this));
    // Add a event listener to the document to stop the screensaver when the mouse wheel is scrolled
    document.addEventListener("wheel", this.#handleMouseMove.bind(this));
    // Add a event listener to the document to stop the screensaver when the touch screen is touched
    document.addEventListener("touchstart", this.#handleMouseMove.bind(this));
  }

  /**
   * The disconnectedCallback method
   * @method
   * @description The disconnectedCallback method is called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Remove the event listener from the document to stop the screensaver when the mouse is moved
    document.removeEventListener("mousemove", this.#handleMouseMove.bind(this));
    // Remove the event listener from the document to stop the screensaver when the mouse is clicked
    document.removeEventListener("click", this.#handleMouseMove.bind(this));
    // Remove the event listener from the document to stop the screensaver when a key is pressed
    document.removeEventListener("keydown", this.#handleMouseMove.bind(this));
    // Remove the event listener from the document to stop the screensaver when the mouse wheel is scrolled
    document.removeEventListener("wheel", this.#handleMouseMove.bind(this));
    // Remove the event listener from the document to stop the screensaver when the touch screen is touched
    document.removeEventListener("touchstart", this.#handleMouseMove.bind(this));
  }

  /**
   * The attributeChangedCallback method
   * @method
   * @description The attributeChangedCallback method is called when an attribute is added, removed, updated, or replaced on the element
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Make sure the value actually changed
    if (oldValue === newValue) {
      return;
    }
    // Update accordingly based on the attribute name
    switch (name) {
      case "screensaver":
        this.#setScreensaver(newValue);
        break;
      case "active":
        this.#setActive(newValue === "true" ? true : false);
        break;
    }
  }

  /**
   * Returns the screensaver that is currently active
   * @getter screensaver
   */
  get screensaver() : string {
    return this._screensaver;
  }

  /**
   * Sets the screensaver to the specified screensaver
   * @setter screensaver
   */
  set screensaver(screensaver: string) {
    this._screensaver = screensaver;
    this.setAttribute("screensaver", screensaver);
  }

  /**
   * Returns the screensaver active state
   * @getter active
   */
  get active() : boolean {
    return this._active;
  }

  /**
   * Sets the screensaver active state to the specified state
   * @setter active
   */
  set active(active: boolean) {
    this._active = active;
    this.setAttribute("active", active ? "true" : "false");
  }

}

// Export the Desktop class as a custom element
export { ScreenSaver };