/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

import { isValidColor, colorToRGBA } from "../Utils/Color";
import { isValidCursor } from "../Utils/Cursor";
import { downloadFile, downloadTextFile } from "../Utils/Download";
import { isValidFont } from "../Utils/Font";
import { stringContainsHTML, removeHTMLFromString, getHTMLFromString, sanitizeHTML, isImageURLOrDataURL } from "../Utils/HTML";
import { asString } from "../Utils/String";
import { createWindowHandle } from "../Utils/Window";
import { debounce } from "../Utils/Other";

/**
 * The UtilityError class
 * @class UtilityError
 * @description The class that represents the UtilityError class
 */
class UtilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UtilityError";
  }
}

/**
 * The Utility class
 * @class Utility
 * @description The class that represents the Utility class with all the utility functions
 * @static
 */
class Utility {

  // Color utilities
  static isValidColor         = isValidColor;
  static colorToRGBA          = colorToRGBA;

  // Cursor utilities
  static isValidCursor        = isValidCursor;

  // Download utilities
  static downloadFile         = downloadFile;
  static downloadTextFile     = downloadTextFile;

  // Font utilities
  static isValidFont          = isValidFont;

  // HTML utilities
  static stringContainsHTML   = stringContainsHTML;
  static removeHTMLFromString = removeHTMLFromString;
  static getHTMLFromString    = getHTMLFromString;
  static sanitizeHTML         = sanitizeHTML;
  static isImageURLOrDataURL  = isImageURLOrDataURL;

  // String utilities
  static asString             = asString;

  // Window utilities
  static createWindowHandle   = createWindowHandle;

  // Other utilities
  static debounce             = debounce;

  /**
   * Creates a new Utility instance
   * @constructor
   */
  constructor() {
    throw new UtilityError(`The ${this.constructor.name} class may not be instantiated! Use static methods instead!`);
  }

}

// Export the Utility class
export { Utility };