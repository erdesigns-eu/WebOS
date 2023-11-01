/**
 * Changelog:
 * - v1.0.0 (2023-11-01): Initial release
 */

import { ThemeManagerTheme } from "./Theme";

const themeProperties = {
  name        : "Windows Dark",
  version     : "v1.0.0",
  author      : "Ernst Reidinga",
  description : "Windows based theme with a dark color scheme.",
  accentColor : "#ff8c00"
}

/**
 * @class WinDark
 * @description The class that represents the WinDark theme.
 * @extends ThemeManagerTheme
 */
class WinDark extends ThemeManagerTheme {
  
  /**
   * @constructor
   * @description Creates a new instance of the WinDark class.
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

// Export the WinDark class
export { WinDark };