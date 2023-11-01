/**
 * Changelog:
 * - v1.0.0 (2023-11-01): Initial release
 */

import { ThemeManagerTheme } from "./Theme";

const themeProperties = {
  name        : "Windows Light",
  version     : "v1.0.0",
  author      : "Ernst Reidinga",
  description : "Windows based theme with a light color scheme.",
  accentColor : "#ff8c00"
}

/**
 * @class WinLight
 * @description The class that represents the WinLight theme.
 * @extends ThemeManagerTheme
 */
class WinLight extends ThemeManagerTheme {
  
  /**
   * @constructor
   * @description Creates a new instance of the WinLight class.
   * @param name The name of the theme.
   * @param version The version of the theme.
   * @param author The author of the theme.
   * @param description The description of the theme.
   * @param accentColor The accent color of the theme.
   */
  constructor() {
    // Call the super constructor
    super(themeProperties.name, themeProperties.version, themeProperties.author, themeProperties.description, themeProperties.accentColor);
  }

  /**
   * @method apply
   * @description Applies the theme to the WebOS system.
   * @param accentColor The accent color of the theme.
   */
  apply(accentColor?: string | undefined) : void {
    // Set the accent color if it is defined
    if (accentColor) {
      this.accentColor = accentColor;
    }
    // Set the accent color
    this.setCSSVariables({
      accentColor: this.accentColor,
      rgbAccentColor: this.accentColor
    });
  }

  /**
   * @method css
   * @description Returns the CSS of the theme as a string.
   */
  css() : string {
    return "";
  }

}

// Export the WinLight class
export { WinLight };