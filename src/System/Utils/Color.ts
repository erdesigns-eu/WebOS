/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @method isValidColor
 * @description Checks whether or not the given color is valid
 * @param color The color to check
 */
export const isValidColor = (color: string): boolean => {
  // Create a new option element
  const s = new Option().style;
  // Set the color to the input color
  s.color = color;
  // Return whether or not the color is valid (i.e. not empty)
  return s.color !== '';
};