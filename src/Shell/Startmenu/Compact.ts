/**
 * Changelog:
 * - v1.0.0 (2023-11-04): Initial release
 */

/**
 * The StartmenuCompactMain class
 * @class StartmenuCompactMain
 * @description The custom element that represents the WebOS startmenu compact main area
 * @extends HTMLElement
 */
class StartmenuCompactMain extends HTMLElement {

  static elementName = "web-os-start-menu-compact-main"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new StartmenuCompactMain HTML element
   * @constructor
   * @description Creates a new StartmenuCompactMain HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }

}

/**
 * The StartmenuCompactSide class
 * @class StartmenuCompactSide
 * @description The custom element that represents the WebOS startmenu compact side area
 * @extends HTMLElement
 */
class StartmenuCompactSide extends HTMLElement {

  static elementName = "web-os-start-menu-compact-side"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new StartmenuCompactSide HTML element
   * @constructor
   * @description Creates a new StartmenuCompactSide HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }

}

/**
 * The StartmenuCompactSideButton class
 * @class StartmenuCompactSideButton
 * @description The custom element that represents the WebOS startmenu compact side area button
 */
class StartmenuCompactSideButton extends HTMLElement {
  
    static elementName = "web-os-start-menu-compact-side-button"; // The name of the custom element (used for registering the custom element)

    /**
     * Creates a new StartmenuCompactSideButton HTML element
     * @constructor
     * @description Creates a new StartmenuCompactSideButton HTML element
     * @extends HTMLElement
     */
    constructor() {
      // Call the super constructor
      super();
      // Set role attribute
      this.setAttribute("role", "button");
      // Set tabindex attribute
      this.setAttribute("tabindex", "0");
    }

    /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["mdi-style", "mdi-icon", "tooltip"];
  }

  /**
   * The render method
   * @method render
   * @description The render method renders the element content.
   */
  #render() {
    this.innerHTML = `<web-os-mdi mdi-style="${this.getAttribute("mdi-style")}" mdi-icon="${this.getAttribute("mdi-icon")}"></web-os-mdi>`;
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    // Initialization code
    this.#render();
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
  attributeChangedCallback() {
    this.#render();
  }

}

/**
 * The StartmenuCompactSideDivider class
 * @class StartmenuCompactSideDivider
 * @description The custom element that represents the WebOS startmenu compact side area divider
 */
class StartmenuCompactSideDivider extends HTMLElement {

  static elementName = "web-os-start-menu-compact-side-divider"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new StartmenuCompactSideDivider HTML element
   * @constructor
   * @description Creates a new StartmenuCompactSideDivider HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }

}

// Export the StartmenuCompactSide class as a custom element
export { StartmenuCompactMain, StartmenuCompactSide, StartmenuCompactSideButton, StartmenuCompactSideDivider };