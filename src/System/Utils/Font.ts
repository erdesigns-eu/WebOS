/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @method isValidFont
 * @description Checks whether or not the given font is valid
 * @param font The font to check
 */
export const isValidFont = (font: string): boolean => {
  // Create a new option element
  const s = new Option().style;
  // Set the font to the input font
  s.font = font;
  // Return whether or not the font is valid (i.e. not empty)
  return s.font !== '';
};