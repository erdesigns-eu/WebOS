/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @class WindowPaddingError
 * @description The error thrown when there is a problem with a WindowPadding
 * @extends Error
 * @property {string} message The error message
 */
class WindowPaddingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WindowPaddingError";
  }
}

/**
 * @class WindowPadding
 * @description The padding of a window
 * @extends EventTarget
 * @property top The top padding of the window
 * @property right The right padding of the window
 * @property bottom The bottom padding of the window
 * @property left The left padding of the window
 * @fires WindowPadding#change
 */
class WindowPadding extends EventTarget {
  #top    : number = 0;
  #right  : number = 0;
  #bottom : number = 0;
  #left   : number = 0;

  constructor(top?: number, right?: number, bottom?: number, left?: number) {
    // Call the super constructor
    super();
    // Set the values
    this.top    = top    ?? 0;
    this.right  = right  ?? 0;
    this.bottom = bottom ?? 0;
    this.left   = left   ?? 0;
  }

  /**
   * top
   * @returns The top padding of the window
   */
  get top(): number {
    return this.#top;
  }

  /**
   * top
   * @param value The top padding of the window
   * @returns {void}
   */
  set top(value: number) {
    // Make sure the value is not below 0
    if (value < 0) {
      throw new WindowPaddingError("The top padding of a window cannot be below 0");
    }
    // Set the value
    this.#top = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { top: value } }));
  }

  /**
   * right
   * @returns The right padding of the window
   */
  get right(): number {
    return this.#right;
  }

  /**
   * right
   * @param value The right padding of the window
   * @returns {void}
   */
  set right(value: number) {
    // Make sure the value is not below 0
    if (value < 0) {
      throw new WindowPaddingError("The right padding of a window cannot be below 0");
    }
    // Set the value
    this.#right = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { right: value } }));
  }

  /**
   * bottom
   * @returns The bottom padding of the window
   */
  get bottom(): number {
    return this.#bottom;
  }

  /**
   * bottom
   * @param value The bottom padding of the window
   * @returns {void}
   */
  set bottom(value: number) {
    // Make sure the value is not below 0
    if (value < 0) {
      throw new WindowPaddingError("The bottom padding of a window cannot be below 0");
    }
    // Set the value
    this.#bottom = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { bottom: value } }));
  }

  /**
   * left
   * @returns The left padding of the window
   */
  get left(): number {
    return this.#left;
  }

  /**
   * left
   * @param value The left padding of the window
   * @returns {void}
   */
  set left(value: number) {
    // Make sure the value is not below 0
    if (value < 0) {
      throw new WindowPaddingError("The left padding of a window cannot be below 0");
    }
    // Set the value
    this.#left = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { left: value } }));
  }

  /**
   * toString
   * @returns {string} The string representation of the padding for use in CSS
   */
  toString(): string {
    return `padding: ${this.#top}px ${this.#right}px ${this.#bottom}px ${this.#left}px;`;
  }
}

export { WindowPadding };