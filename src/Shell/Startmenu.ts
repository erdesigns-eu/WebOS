/**
 * Changelog:
 * - v1.0.0 (2023-11-04): Initial release
 */

import { StartmenuCompactMain, StartmenuCompactSide } from "./Startmenu/Compact";

/**
 * The StartmenuStyle type
 * @type {string}
 * @description The type of the startmenu style (compact or full)
 */
type startMenuStyle = "compact" | "full";

/**
 * The StartmenuSize type
 * @type {string}
 * @description The startmenu type represents the size of the startmenu
 */
type startMenuSize = "small" | "medium" | "large" | "xlarge";

/**
 * The Startmenu class
 * @class Startmenu
 * @description The custom element that represents the WebOS startmenu
 * @extends HTMLElement
 */
class Startmenu extends HTMLElement {

  static elementName = "web-os-start-menu"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new Startmenu HTML element
   * @constructor
   * @description Creates a new Startmenu HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    //
    this.innerHTML = `
    <web-os-start-menu-compact-main></web-os-start-menu-compact-main>
    <web-os-start-menu-compact-side>
      <div class="top"></div>
      <div class="bottom">
        <button role="button">
          <web-os-mdi mdi-style="round" mdi-icon="power_settings_new"></web-os-mdi>
        </button>
      </div>
    </web-os-start-menu-compact-side>
    `;
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["size", "menu-style"];
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
   * Returns the startmenu size
   * @getter size
   */
  get size(): startMenuSize {
    return this.getAttribute("size") as startMenuSize;
  }

  /**
   * Sets the startmenu size
   * @setter size
   */
  set size(value: startMenuSize) {
    this.setAttribute("size", value);
  }

  /**
   * Returns the menu style
   * @getter menuStyle
   */
  get menuStyle(): startMenuStyle {
    return this.getAttribute("menu-style") as startMenuStyle;
  }

  /**
   * Sets the menu style
   * @setter menuStyle
   */
  set menuStyle(value: startMenuStyle) {
    this.setAttribute("menu-style", value);
  }

}

// Export the Startmenu class as a custom element
export { Startmenu, StartmenuCompactMain, StartmenuCompactSide };