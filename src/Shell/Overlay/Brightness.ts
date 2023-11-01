/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

/**
 * The Brightness Overlay class
 * @class Brightness
 * @description The custom element that represents the WebOS brightness overlay
 * @extends HTMLElement
 */
class Brightness extends HTMLElement {

  #overlayElement : HTMLElement|null = null; // The overlay element

  static elementName = "web-os-brightness";

  _backgroundColor = "#000";  // The background color of the overlay
  _opacity         = "0";     // The opacity of the overlay
  
  /**
   * Creates a new Brightness Overlay HTML element
   * @constructor
   * @description Creates a new Brightness Overlay HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Create the shadow DOM
    const shadowRoot = this.attachShadow({ mode: "closed" });
    // Create the overlay element
    const overlayElement = document.createElement("div");
    overlayElement.style.position         = "fixed";
    overlayElement.style.top              = "0";
    overlayElement.style.left             = "0";
    overlayElement.style.width            = "100%";
    overlayElement.style.height           = "100%";
    overlayElement.style.pointerEvents    = "none";
    overlayElement.style.backgroundColor  = this._backgroundColor;
    overlayElement.style.opacity          = this._opacity;
    // Set the overlay element
    this.#overlayElement = overlayElement;
    // Add the overlay element to the shadow DOM
    shadowRoot.appendChild(overlayElement);
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["brightness", "color"];
  }

  /**
   * Sets the brightness of the overlay
   * @method setBrightness
   * @description Sets the brightness of the overlay
   * @param brightness The brightness to set
   */
  #setBrightness(brightness: string) {
    this.#overlayElement!.style.opacity = brightness;
  }

  /**
   * Sets the color of the overlay
   * @method setColor
   * @description Sets the color of the overlay
   * @param color The color to set
   */
  #setColor(color: string) {
    this.#overlayElement!.style.backgroundColor = color;
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
    // Make sure the value actually changed
    if (oldValue === newValue) {
      return;
    }
    // Update accordingly based on the attribute name
    switch (name) {
      case "brightness":
        this.#setBrightness(String(parseFloat(newValue) / 100));
        break;
      case "color":
        this.#setColor(newValue);
        break;
    }
  }

  /**
   * Overlay brightness getter
   * @getter
   */
  get brightness(): number {
    return parseFloat(this._opacity);
  }

  /**
   * Overlay brightness setter
   * @setter
   */
  set brightness(value: number) {
    const val: string = String(value);
    this._opacity = val;
    this.setAttribute("brightness", val);
  }

  /**
   * Overlay color getter
   * @getter
   */
  get color(): string {
    return this._backgroundColor;
  }

  /**
   * Overlay color setter
   * @setter
   */
  set color(value: string) {
    this._backgroundColor = value;
    this.setAttribute("color", value);
  }

}

// Export the Brightness Overlay class as a custom element
export { Brightness };