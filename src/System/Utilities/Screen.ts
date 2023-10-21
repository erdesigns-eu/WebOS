/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @class ScreenError
 * @description The error thrown when there is a problem with the screen
 * @extends Error
 */
class ScreenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScreenError";
  }
}

/**
 * @class Screen
 * @description The class that manages the screen of the device (Utility class)
 * @singleton
 * @extends EventTarget
 */
class Screen extends EventTarget {
  static #instance : Screen;          // The instance of the Screen
  #ready           : boolean = false; // The ready state of the Screen

  /**
   * Creates a new Screen instance
   * @throws {ScreenError} Thrown when the Screen is already instantiated
   * @throws {ScreenError} Thrown when the Screen is extended instead of instantiated
   * @fires Screen#ready
   */
  constructor() {
    // Call the parent constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the permission manager is not already instantiated
    if (Screen.#instance) {
      throw new ScreenError("Screen is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== Screen) {
      throw new ScreenError("Cannot extend Screen class, must instantiate it instead of extending it!");
    }

    // Set the instance of the Screen
    Screen.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));
  }

  /**
   * Returns the Screen instance
   * @readonly
   * @static
   */
  static getInstance(): Screen {
    // Check if the instance is already instantiated
    if (!Screen.#instance) {
      // Instantiate the Screen
      Screen.#instance = new Screen();
    }
    // Return the instance of the Screen
    return Screen.#instance;
  }

  /**
   * availableHeight
   * @description The height of the screen excluding the operating system's interface
   */
  get availableHeight(): number {
    return window.screen.availHeight;
  }

  /**
   * availableWidth
   * @description The width of the screen excluding the operating system's interface
   */
  get availableWidth(): number {
    return window.screen.availWidth;
  }

  /**
   * colorDepth
   * @description The color depth of the screen
   */
  get colorDepth(): number {
    return window.screen.colorDepth;
  }

  /**
   * height
   * @description The height of the screen
   */
  get height(): number {
    return window.screen.height;
  }

  /**
   * orientation
   * @description The orientation of the screen
   * @returns {string}
   */
  get orientation(): string {
    return window.screen.orientation.type;
  }

  /**
   * angle
   * @description The angle of the screen
   */
  get angle(): number {
    return window.screen.orientation.angle;
  }

  /**
   * pixelDepth
   * @description The pixel depth of the screen
   */
  get pixelDepth(): number {
    return window.screen.pixelDepth;
  }

  /**
   * width
   * @description The width of the screen
   */
  get width(): number {
    return window.screen.width;
  }

  /**
   * zoom
   * @description The zoom of the screen
   */
  get zoom(): number {
    return (window.outerWidth - 8) / window.innerWidth;
  }

  /**
   * @description The ready state of the Screen
   * @readonly
   */
  get ready(): boolean {
    return this.#ready;
  }

}

// Export the Screen class
export { Screen as default, Screen };