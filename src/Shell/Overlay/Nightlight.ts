/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

/**
 * The Nightlight Overlay class
 * @class Nightlight
 * @description The custom element that represents the WebOS nightlight overlay
 * @extends HTMLElement
 */
class Nightlight extends HTMLElement {

  #overlayElement : HTMLElement|null = null; // The overlay element

  static elementName = "web-os-nightlight";

  _backgroundColor = "hsla(14, 100%, 50%, .2)";   // The background color of the overlay
  _opacity         = "0";                         // The opacity of the overlay
  _transition      = "opacity .5s ease-in-out";   // The transition of the overlay
  
  /**
   * Creates a new Nightlight Overlay HTML element
   * @constructor
   * @description Creates a new Nightlight Overlay HTML element
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
    overlayElement.style.transition       = `opacity 3s var(${this._transition});`
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
    return ["brightness", "color", "transition"];
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
   * Sets the transition of the overlay
   * @method setTransition
   * @description Sets the transition of the overlay
   * @param transition The transition to set
   */
  #setTransition(transition: string) {
    this.#overlayElement!.style.transition = `opacity 3s var(${transition});`
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
      case "transition":
        this.#setTransition(newValue);
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

  /**
   * Overlay transition getter
   * @getter
   */
  get transition(): string {
    return this._transition;
  }

  /**
   * Overlay transition setter
   * @setter
   */
  set transition(value: string) {
    this._transition = value;
    this.setAttribute("transition", value);
  }

}

// Export the Nightlight Overlay class as a custom element
export { Nightlight };