/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

import { isValidColor, colorToRGBA, hslToRgb, namedColorToRGB, toHexColor, adjustHexColorBrightness } from "../Utils/Color";
import { isValidCursor } from "../Utils/Cursor";
import { downloadFile, downloadTextFile } from "../Utils/Download";
import { isValidFont } from "../Utils/Font";
import { stringContainsHTML, removeHTMLFromString, getHTMLFromString, sanitizeHTML, isImageURLOrDataURL } from "../Utils/HTML";
import { asString } from "../Utils/String";
import { createWindowHandle } from "../Utils/Window";
import { debounce, createWorker} from "../Utils/Other";

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
  static readonly isValidColor             = isValidColor;
  static readonly colorToRGBA              = colorToRGBA;
  static readonly hslToRgb                 = hslToRgb;
  static readonly namedColorToRGB          = namedColorToRGB;
  static readonly toHexColor               = toHexColor;
  static readonly adjustHexColorBrightness = adjustHexColorBrightness;

  // Cursor utilities
  static readonly isValidCursor            = isValidCursor;

  // Download utilities
  static readonly downloadFile             = downloadFile;
  static readonly downloadTextFile         = downloadTextFile;

  // Font utilities
  static readonly isValidFont              = isValidFont;

  // HTML utilities
  static readonly stringContainsHTML       = stringContainsHTML;
  static readonly removeHTMLFromString     = removeHTMLFromString;
  static readonly getHTMLFromString        = getHTMLFromString;
  static readonly sanitizeHTML             = sanitizeHTML;
  static readonly isImageURLOrDataURL      = isImageURLOrDataURL;

  // String utilities
  static readonly asString                 = asString;

  // Window utilities
  static readonly createWindowHandle       = createWindowHandle;

  // Other utilities
  static readonly debounce                 = debounce;
  static readonly createWorker             = createWorker;

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