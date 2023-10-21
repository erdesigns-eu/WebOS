/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @class WindowConstraintError
 * @description The error thrown when there is a problem with a WindowConstraint
 * @extends Error
 * @property {string} message The error message
 */
class WindowConstraintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WindowConstraintError";
  }
}

/**
 * @class WindowConstraint
 * @description The constraints of a window (min/max size)
 * @extends EventTarget
 * @property {number} minHeight The minimum height of the window
 * @property {number} minWidth The minimum width of the window
 * @property {number} maxHeight The maximum height of the window
 * @property {number} maxWidth The maximum width of the window
 * @fires WindowConstraint#change
 */
class WindowConstraint extends EventTarget {
  #minHeight : number = 0;
  #minWidth  : number = 0;
  #maxHeight : number = 0;
  #maxWidth  : number = 0;

  constructor(minHeight?: number, minWidth?: number, maxHeight?: number, maxWidth?: number) {
    // Call the super constructor
    super();
    // Set the values
    this.minHeight = minHeight ?? 0;
    this.minWidth  = minWidth  ?? 0;
    this.maxHeight = maxHeight ?? 0;
    this.maxWidth  = maxWidth  ?? 0;
  }

  /**
   * minHeight
   * @returns {number} The minimum height of the window
   */
  get minHeight(): number {
    return this.#minHeight;
  }

  /**
   * minHeight
   * @param {number} value The minimum height of the window
   * @returns {void}
   */
  set minHeight(value: number) {
    // Make sure the value is greater than or equal to 0
    if (value < 0) {
      throw new WindowConstraintError("minHeight must be greater than or equal to 0");
    }
    // Make sure the value is less than or equal to maxHeight
    if (value > this.#maxHeight) {
      throw new WindowConstraintError("minHeight must be less than or equal to maxHeight");
    }
    // Set the value
    this.#minHeight = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { minHeight: value } }));
  }

  /**
   * minWidth
   * @returns {number} The minimum width of the window
   */
  get minWidth(): number {
    return this.#minWidth;
  }

  /**
   * minWidth
   * @param {number} value The minimum width of the window
   * @returns {void}
   */
  set minWidth(value: number) {
    // Make sure the value is greater than or equal to 0
    if (value < 0) {
      throw new WindowConstraintError("minWidth must be greater than or equal to 0");
    }
    // Make sure the value is less than or equal to maxWidth
    if (value > this.#maxWidth) {
      throw new WindowConstraintError("minWidth must be less than or equal to maxWidth");
    }
    // Set the value
    this.#minWidth = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { minWidth: value } }));
  }

  /**
   * maxHeight
   * @returns {number} The maximum height of the window
   */
  get maxHeight(): number {
    return this.#maxHeight;
  }

  /**
   * maxHeight
   * @param {number} value The maximum height of the window
   * @returns {void}
   */
  set maxHeight(value: number) {
    // Make sure the value is greater than or equal to 0
    if (value < 0) {
      throw new WindowConstraintError("maxHeight must be greater than or equal to 0");
    }
    // Make sure the value is greater than or equal to minHeight
    if (value < this.#minHeight) {
      throw new WindowConstraintError("maxHeight must be greater than or equal to minHeight");
    }
    // Set the value
    this.#maxHeight = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { maxHeight: value } }));
  }

  /**
   * maxWidth
   * @returns {number} The maximum width of the window
   */
  get maxWidth(): number {
    return this.#maxWidth;
  }

  /**
   * maxWidth
   * @param {number} value The maximum width of the window
   * @returns {void}
   */
  set maxWidth(value: number) {
    // Make sure the value is greater than or equal to 0
    if (value < 0) {
      throw new WindowConstraintError("maxWidth must be greater than or equal to 0");
    }
    // Make sure the value is greater than or equal to minWidth
    if (value < this.#minWidth) {
      throw new WindowConstraintError("maxWidth must be greater than or equal to minWidth");
    }
    // Set the value
    this.#maxWidth = value;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { maxWidth: value } }));
  }

  /**
   * toString
   * @returns {string} The string representation of the window constraint for use in CSS
   */
  toString(): string {
    return `min-height: ${this.#minHeight}px; min-width: ${this.#minWidth}px; max-height: ${this.#maxHeight}px; max-width: ${this.#maxWidth}px;`;
  }

}

export { WindowConstraint };