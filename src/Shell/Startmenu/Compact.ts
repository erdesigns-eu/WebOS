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

// Export the StartmenuCompactSide class as a custom element
export { StartmenuCompactMain, StartmenuCompactSide };