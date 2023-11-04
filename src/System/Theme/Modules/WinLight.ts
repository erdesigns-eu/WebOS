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
      // Taskbar
      taskbarHeightSmall: "30px",
      taskbarHeightMedium: "40px",
      taskbarHeightLarge: "50px",
      taskbarHeightXlarge: "60px",
      taskbarBackdropFilter: "blur(15px)",
      taskbarBackgroundColor: "rgba(255, 255, 255, 0.4)",
      taskbarBorderTop: "1px solid rgba(0, 0, 0, 0.125)",
      taskbarBorderBottom: "none",
      taskbarBorderLeft: "none",
      taskbarBorderRight: "none",
      // Start button
      startButtonWidthSmall: "30px",
      startButtonHeightSmall: "30px",
      startButtonIconSizeSmall: "18px",
      startButtonWidthMedium: "40px",
      startButtonHeightMedium: "40px",
      startButtonIconSizeMedium: "28px",
      startButtonWidthLarge: "50px",
      startButtonHeightLarge: "50px",
      startButtonIconSizeLarge: "38px",
      startButtonWidthXlarge: "60px",
      startButtonHeightXlarge: "60px",
      startButtonIconSizeXlarge: "48px",
      startButtonHoverIconColor: "rgba(0, 0, 0, 0.75)",
      startButtonHoverBackgroundColor: "rgba(0, 0, 0, 0.1)",
      startButtonActiveIconColor: "rgba(0, 0, 0, 0.9)",
      startButtonActiveBackgroundColor: "rgba(0, 0, 0, 0.2)",
      startButtonNormalIconColor: "rgba(0, 0, 0, 0.5)",
      startButtonBackgroundColor: "transparent",
      startButtonBorderRadius: "5px",
      // Clock
      clockFontSizeSmall: "10px",
      clockFontSizeMedium: "12px",
      clockFontSizeLarge: "14px",
      clockFontSizeXlarge: "16px",
      clockGapSmall: "0px",
      clockGapMedium: "2px",
      clockGapLarge: "2px",
      clockGapXlarge: "2px",
      clockHoverBackgroundColor: "rgba(0, 0, 0, 0.1)",
      clockHoverColor: "rgba(0, 0, 0, 0.75)",
      clockActiveBackgroundColor: "rgba(0, 0, 0, 0.2)",
      clockActiveColor: "rgba(0, 0, 0, 0.9)",
      clockNormalColor: "rgba(0, 0, 0, 0.75)",
      clockPaddingVertical: "2px",
      clockPaddingHorizontal: "5px",
      clockBorderRadius: "5px",
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