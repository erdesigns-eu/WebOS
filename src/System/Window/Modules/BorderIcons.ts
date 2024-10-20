/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @class BorderIconsError
 * @description An error that is thrown when a border icon is invalid
 * @extends Error
 */
class BorderIconsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BorderIconsError";
  }
}

/**
 * @class BaseBorderIcons
 * @description The base class for border icons
 * @abstract
 */
class BaseBorderIcons extends EventTarget {
  #systemMenu  : boolean = true;
  #closeButton : boolean = true;
  #helpButton  : boolean = true;

  constructor() {
    // Call the super constructor
    super();
    // Make sure this class is not instantiated because it is a base class
    if (this.constructor === BaseBorderIcons) {
      throw new BorderIconsError("Cannot construct BaseBorderIcons instances directly, extend it instead.");
    }
  }

  /**
   * systemMenu
   * @description Returns whether the system menu is visible
   * @type {boolean}
   */
  get systemMenu(): boolean {
    return this.#systemMenu;
  }

  /**
   * systemMenu
   * @description Sets whether the system menu is visible
   * @param {boolean} value
   * @returns {void}
   */
  set systemMenu(value: boolean) {
    // Set the value
    this.#systemMenu = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { systemMenu: value } }));
  }

  /**
   * closeButton
   * @description Returns whether the close button is enabled
   * @type {boolean}
   */
  get closeButton(): boolean {
    return this.#closeButton;
  }

  /**
   * closeButton
   * @description Sets whether the close button is enabled
   * @param {boolean} value
   */
  set closeButton(value: boolean) {
    // Set the value
    this.#closeButton = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { closeButton: value } }));
  }

  /**
   * helpButton
   * @description Returns whether the help button is visible
   * @type {boolean}
   */
  get helpButton(): boolean {
    return this.#helpButton;
  }

  /**
   * helpButton
   * @description Sets whether the help button is visible
   * @param {boolean} value
   */
  set helpButton(value: boolean) {
    // Set the value
    this.#helpButton = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { helpButton: value } }));
  }
}

/**
 * @class DialogBorderIcons
 * @description The border icons for a window with a borderStyle of bsDialog or bsToolWindow
 * @extends BaseBorderIcons
 */
class DialogBorderIcons extends BaseBorderIcons {
  constructor() {
    super();
  }
}

/**
 * @class SingleBorderIcons
 * @description The border icons for a window with a borderStyle of bsSingle
 */
class SingleBorderIcons extends BaseBorderIcons {
  #minimizeButton : boolean = true;
  #maximizeButton : boolean = true;
  
  constructor() {
    super();
  }

  /**
   * minimizeButton
   * @description Returns whether the minimize button is enabled
   * @type {boolean}
   */
  get minimizeButton(): boolean {
    return this.#minimizeButton;
  }

  /**
   * minimizeButton
   * @description Sets whether the minimize button is enabled
   * @param {boolean} value
   */
  set minimizeButton(value: boolean) {
    // Set the value
    this.#minimizeButton = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { minimizeButton: value } }));
  }

  /**
   * maximizeButton
   * @description Returns whether the maximize button is enabled
   * @type {boolean}
   */
  get maximizeButton(): boolean {
    return this.#maximizeButton;
  }

  /**
   * maximizeButton
   * @description Sets whether the maximize button is enabled
   * @param {boolean} value
   */
  set maximizeButton(value: boolean) {
    // Set the value
    this.#maximizeButton = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { maximizeButton: value } }));
  }
}

/**
 * @class SizeableBorderIcons
 * @description The border icons for a window with a borderStyle of bsSizeable
 * @extends SingleBorderIcons
 */
class SizeableBorderIcons extends SingleBorderIcons {
  constructor() {
    super();
  }
}

export { DialogBorderIcons, SingleBorderIcons, SizeableBorderIcons };