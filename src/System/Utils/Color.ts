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
  return s.color !== "";
};

/**
 * Converts a color to RGBA
 * @param color The color to convert
 * @param alpha The alpha to use
 */
export const colorToRGBA = (color: string, alpha: number = 1): string => {
  // If the color is an RGBA string, update the alpha and return it
  if (color.toLowerCase().startsWith("rgba(")) {
    return color.replace(/[^,]+(?=\))/, " " + alpha.toString());
  }

  // If the color is an RGB string, convert it to RGBA and add alpha
  if (color.toLowerCase().startsWith("rgb(")) {
    const match = color.match(/\d+/g);
    if (match!.length === 3) {
      const [r, g, b] = match!;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }

  // If the color is a hex string, convert it to RGBA and add alpha
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // If nothing matches, return white
  return "rgba(255, 255, 255, 1)";
}

/**
 * Converts a HSL color to RGB
 * @param h The hue
 * @param s The saturation
 * @param l The lightness
 */
export const hslToRgb = (h: number, s: number, l: number): number[] => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r, g, b];
}

/**
 * Converts a named color to hex
 * @param color The color to convert
 */
export const namedColorToRGB = (color: string): string => {
  // Create a new temporary element
  const temp = document.createElement("div");
  // Set the color of the element
  temp.style.color = color;
  // Append the element to the body
  document.body.appendChild(temp);
  // Get the computed color
  const computedColor = window.getComputedStyle(temp).color;
  // Remove the element from the body
  document.body.removeChild(temp);
  // Return the computed color
  return computedColor;
}

/**
 * Converts a color to hex format
 * @param color The color to convert
 */
export const toHexColor = (color: string): string => {
  // Remove extra spaces and convert to lowercase
  color = color.trim().toLowerCase();

  // Check for named color
  if (/^[a-z]+$/.test(color)) {
    color = namedColorToRGB(color);
  }

  // Check for HEX color
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color)) {
    return color.length === 4 ? "#" + Array.from(color.slice(1)).map(c => c + c).join("") : color;
  }

  // Check for RGB or RGBA color
  const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+(?:\.\d+)?)?\)$/);
  if (rgbMatch) {
    return "#" + rgbMatch.slice(1, 4).map(n => parseInt(n, 10).toString(16).padStart(2, "0")).join("");
  }

  // Check for HSL or HSLA color
  const hslMatch = color.match(/^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*\d+(?:\.\d+)?)?\)$/);
  if (hslMatch) {
    const [_, h, s, l] = hslMatch.map(Number);
    const rgb = hslToRgb(h, s, l);
    return "#" + rgb.map(n => n.toString(16).padStart(2, "0")).join("");
  }

  return "#000000";
}

/**
 * Adjusts the brightness of a hex color
 * @param color The color to adjust (e.g. "#000000")
 * @param percentage The percentage to adjust the brightness by (positive for brighter, negative for darker)
 */
export const adjustHexColorBrightness = (color: string, percentage: number): string => {
  // Remove the hash sign if it exists in the color string
  color = color.replace('#', '');

  // Parse RGB values from the color string
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate the adjusted RGB values based on the percentage
  const adjustColor = (color: number) => {
    const newColor = Math.round(color * (1 + percentage / 100));
    return Math.min(255, Math.max(0, newColor)).toString(16).padStart(2, '0');
  };

  // Create the new hex string with adjusted RGB values
  const newHex = adjustColor(r) + adjustColor(g) + adjustColor(b);

  return `#${newHex}`;
}