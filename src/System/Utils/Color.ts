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

/**
 * Converts a color to RGBA
 * @param color The color to convert
 * @param alpha The alpha to use
 */
export const colorToRGBA = (color: string, alpha: number = 1) => {
  // If the color is an RGBA string, update the alpha and return it
  if (color.toLowerCase().startsWith('rgba(')) {
    return color.replace(/[^,]+(?=\))/, " " + alpha.toString());
  }

  // If the color is an RGB string, convert it to RGBA and add alpha
  if (color.toLowerCase().startsWith('rgb(')) {
    const match = color.match(/\d+/g);
    if (match!.length === 3) {
      const [r, g, b] = match!;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  // If the color is a hex string, convert it to RGBA and add alpha
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // If nothing matches, return white
  return 'rgba(255, 255, 255, 1)';
}