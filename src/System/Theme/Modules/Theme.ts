/**
 * Changelog:
 * - v1.0.0 (2023-11-01): Initial release
 */

import { isValidColor, toHexColor, adjustHexColorBrightness } from "../../Utils/Color";

/**
 * @class ThemeManagerThemeError
 * @description The error thrown by the ThemeManagerTheme class
 * @extends Error
 * @property name The name of the error
 */
class ThemeManagerThemeError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "ThemeManagerThemeError";
  }
}

// The maximum and minimum length of a theme name
const maxThemeNameLength = 32;
const minThemeNameLength = 3;

/**
 * The skip root rule
 * @description The skip root rule is used to prevent the theme manager from removing the CSS variables.
 * @type string
 */
const skipRootRule = "--skip-root: \"true\";";

/**
 * @class ThemeManagerTheme
 * @description The class that represents a theme in the theme manager system.
 */
abstract class ThemeManagerTheme {
  #name         : string = ""; // The name of the theme
  #version      : string = ""; // The version of the theme
  #author       : string = ""; // The author of the theme
  #description  : string = ""; // The description of the theme
  #accentColor  : string = ""; // The accent color of the theme

  /**
   * @constructor
   * @param name The name of the theme
   * @param version The version of the theme
   * @param author The author of the theme
   * @param description The description of the theme 
   */
  constructor(name: string, version: string, author: string, description: string, accentColor: string) {
    // Ensure that the name is valid
    this.#ensureName(name);
    // Ensure that the version is valid
    this.#ensureVersion(version);
    // Ensure that the author is valid
    this.#ensureAuthor(author);
    // Ensure that the description is valid
    this.#ensureDescription(description);
    // Ensure that the accent color is valid
    this.#ensureAccentColor(accentColor);
    
    // Set the theme properties
    this.#name        = name;
    this.#version     = version;
    this.#author      = author;
    this.#description = description;
    this.accentColor  = accentColor;
  }

  /**
   * @method ensureName
   * @description Ensures that the given name is valid and throws an error if it is not.
   * @param name The name to check
   */
  #ensureName(name: string) : void {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new ThemeManagerThemeError("Invalid theme name! The theme name must be a string.");
    }
    // Make sure the name is not empty
    if (name.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid theme name! The theme name cannot be empty.");
    }
    // Make sure the name is not too long
    if (name.length > maxThemeNameLength) {
      throw new ThemeManagerThemeError(`Invalid theme name! The theme name cannot be longer than ${maxThemeNameLength} characters.`);
    }
    // Make sure the name is not too short
    if (name.length < minThemeNameLength) {
      throw new ThemeManagerThemeError(`Invalid theme name! The theme name cannot be shorter than ${minThemeNameLength} characters.`);
    }
  }

  /**
   * @method ensureVersion
   * @description Ensures that the given version is valid and throws an error if it is not.
   * @param version The version to check
   */
  #ensureVersion(version: string) : void {
    // Make sure the version is a string
    if (typeof version !== "string") {
      throw new ThemeManagerThemeError("Invalid theme version! The theme version must be a string.");
    }
    // Make sure the version is not empty
    if (version.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid theme version! The theme version cannot be empty.");
    }
  }

  /**
   * @method ensureAuthor
   * @description Ensures that the given author is valid and throws an error if it is not.
   * @param author The author to check
   */
  #ensureAuthor(author: string) : void {
    // Make sure the author is a string
    if (typeof author !== "string") {
      throw new ThemeManagerThemeError("Invalid theme author! The theme author must be a string.");
    }
    // Make sure the author is not empty
    if (author.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid theme author! The theme author cannot be empty.");
    }
  }

  /**
   * @method ensureDescription
   * @description Ensures that the given description is valid and throws an error if it is not.
   * @param description The description to check
   */
  #ensureDescription(description: string) : void {
    // Make sure the description is a string
    if (typeof description !== "string") {
      throw new ThemeManagerThemeError("Invalid theme description! The theme description must be a string.");
    }
    // Make sure the description is not empty
    if (description.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid theme description! The theme description cannot be empty.");
    }
  }

  /**
   * @method ensureAccentColor
   * @description Ensures that the given accent color is valid and throws an error if it is not.
   * @param color The accent color to check
   */
  #ensureAccentColor(color: string) : void {
    // Make sure the accent color is a string
    if (typeof color !== "string") {
      throw new ThemeManagerThemeError("Invalid accent color! The accent color must be a string.");
    }
    // Make sure the accent color is not empty
    if (color.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid accent color! The accent color cannot be empty.");
    }
    // Make sure the accent color is a valid color
    if (!isValidColor(color)) {
      throw new ThemeManagerThemeError("Invalid accent color! The accent color must be a valid CSS color.");
    }
  }

  /**
   * @method getSkipRootStyleSheet
   * @description Returns the style sheet that contains the CSS variable -skip-root: \"true\"; rule or null if it does not exist.
   */
  #getSkipRootStyleSheet(): CSSStyleSheet {
    // Find the stylesheet that contains the CSS variable -skip-root: \"true\"; rule
    let skipRootStyleSheet : CSSStyleSheet | null = null;
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i] as CSSStyleSheet;
      // Check if the sheet contains the skip root rule
      if (sheet.cssRules.length > 0) {
        for (let j = 0; j < sheet.cssRules.length; j++) {
          const rule = sheet.cssRules[j];
          // Check if the rule is the skip root rule
          if (rule.cssText.includes(skipRootRule)) {
            skipRootStyleSheet = sheet;
            break;
          }
        }
      }
      // Check if the skip root style sheet was found
      if (skipRootStyleSheet !== null) {
        break;
      }
    }
    // Return the skip root style sheet
    return skipRootStyleSheet as CSSStyleSheet;
  }

  /**
   * Returns the accent color with the increased brightness
   * @param amount The amount to increase the brightness by
   */
  protected brightenAccentColor(amount: number) : string {
    return adjustHexColorBrightness(this.accentColor, amount);
  }

  /**
   * Returns the accent color with the decreased brightness
   * @param amount The amount to decrease the brightness by
   */
  protected darkenAccentColor(amount: number) : string {
    return adjustHexColorBrightness(this.accentColor, -amount);
  }

  /**
   * Sets a CSS variable to the given value on the document element
   * @param name The name of the CSS variable
   * @param value The value of the CSS variable 
   */
  protected setCSSVariable(name: string, value: string) : void {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new ThemeManagerThemeError("Invalid CSS variable name! The CSS variable name must be a string.");
    }
    // Make sure the name is not empty
    if (name.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid CSS variable name! The CSS variable name cannot be empty.");
    }
    // Make sure the value is a string
    if (typeof value !== "string") {
      throw new ThemeManagerThemeError("Invalid CSS variable value! The CSS variable value must be a string.");
    }
    // Convert camel/pascal case to kebab case
    name = name.replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1').toLowerCase();
    // Convert the name to the CSS variable format
    if (!name.startsWith("--")) {
      name = "--" + name;
    }
    // Get the style sheet of the document
    const styleSheet = this.#getSkipRootStyleSheet();
    // Remove the old CSS variable if it exists
    if (styleSheet.cssRules.length > 0) {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        // Check if the rule is a CSS variable rule
        if (rule.cssText.startsWith(":root {")) {
          // Check if the rule is the skip root rule (this is used to prevent the theme manager from removing the CSS variables)
          if (rule.cssText.includes(skipRootRule)) {
            continue;
          }
          // If the rule is not the skip root rule, remove it
          styleSheet.deleteRule(i);
          // Decrement the index
          i--;
        }
      }
    }
    // Set the CSS variable
    styleSheet.insertRule(`:root { ${name}: ${value}; }`, styleSheet.cssRules.length);
  }

  /**
   * Sets the given CSS variables on the :root
   * @param variables The CSS variables to set
   */
  protected setCSSVariables(variables: { [name: string]: string }) : void {
    // Make sure the variables is an object
    if (typeof variables !== "object") {
      throw new ThemeManagerThemeError("Invalid CSS variables! The CSS variables must be an object.");
    }
    // Make sure the variables is not null
    if (variables === null) {
      throw new ThemeManagerThemeError("Invalid CSS variables! The CSS variables cannot be null.");
    }
    // Make sure the variables is not undefined
    if (variables === undefined) {
      throw new ThemeManagerThemeError("Invalid CSS variables! The CSS variables cannot be undefined.");
    }
    // Make sure the variables is not an array
    if (Array.isArray(variables)) {
      throw new ThemeManagerThemeError("Invalid CSS variables! The CSS variables cannot be an array.");
    }
    // Get the style sheet of the document
    const styleSheet = this.#getSkipRootStyleSheet();
    // Remove the old CSS variables if they exist
    if (styleSheet.cssRules.length > 0) {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        // Check if the rule is a CSS variable rule
        if (rule.cssText.startsWith(":root {")) {
          // Check if the rule is the skip root rule (this is used to prevent the theme manager from removing the CSS variables)
          if (rule.cssText.includes(skipRootRule)) {
            continue;
          }
          // If the rule is not the skip root rule, remove it
          styleSheet.deleteRule(i);
          // Decrement the index
          i--;
        }
      }
    }
    // Set the CSS variables
    styleSheet.insertRule(`:root { ${Object.keys(variables).map(key => `${this.getVariableAsCSSString(key, variables[key])}`).join(" ")} }`, styleSheet.cssRules.length);
  }

  /**
   * Returns the value of the given CSS variable on the document element
   * @param name The name of the CSS variable
   */
  protected getCSSVariable(name: string) : string {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new ThemeManagerThemeError("Invalid CSS variable name! The CSS variable name must be a string.");
    }
    // Make sure the name is not empty
    if (name.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid CSS variable name! The CSS variable name cannot be empty.");
    }
    // Convert the name to the CSS variable format
    if (!name.startsWith("--")) {
      name = "--" + name;
    }
    // Get the CSS variable
    return document.documentElement.style.getPropertyValue(name);
  }

  /**
   * Returns the given variable as a CSS string
   * @param name The name of the CSS variable
   * @param value The value of the CSS variable
   */
  protected getVariableAsCSSString(name: string, value: string) : string {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new ThemeManagerThemeError("Invalid CSS variable name! The CSS variable name must be a string.");
    }
    // Make sure the name is not empty
    if (name.trim().length === 0) {
      throw new ThemeManagerThemeError("Invalid CSS variable name! The CSS variable name cannot be empty.");
    }
    // Make sure the value is a string
    if (typeof value !== "string") {
      throw new ThemeManagerThemeError("Invalid CSS variable value! The CSS variable value must be a string.");
    }
    // Convert camel/pascal case to kebab case
    name = name.replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1').toLowerCase();
    // Convert the name to the CSS variable format
    if (!name.startsWith("--")) {
      name = "--" + name;
    }
    // Return the CSS variable as a string
    return `${name}: ${value};`;
  }

  /**
   * @getter name
   * @description Returns the name of the theme.
   */
  get name() : string {
    return this.#name;
  }

  /**
   * @getter version
   * @description Returns the version of the theme.
   */
  get version() : string {
    return this.#version;
  }

  /**
   * @getter author
   * @description Returns the author of the theme.
   */
  get author() : string {
    return this.#author;
  }

  /**
   * @getter description
   * @description Returns the description of the theme.
   */
  get description() : string {
    return this.#description;
  }

  /**
   * @getter accentColor
   * @description Returns the accent color of the theme as a hex string (e.g. "#000000").
   */
  get accentColor() : string {
    return this.#accentColor;
  }

  /**
   * @setter accentColor
   * @description Sets the accent color of the theme as a hex string (e.g. "#000000").
   * @param color The accent color to set (valid CSS color e.g. "#000000", "black", "rgb(0, 0, 0)", "rgba(0, 0, 0, 1)"
   */
  set accentColor(color: string) {
    // Ensure that the accent color is valid
    this.#ensureAccentColor(color);
    // Set the accent color
    this.#accentColor = toHexColor(color);
  }

  /**
   * @method apply
   * @description Applies the theme to the WebOS system.
   * @param accentColor The accent color to apply to the theme
   */
  abstract apply(accentColor?: string) : void;

  /**
   * @method css
   * @description Returns the CSS for the theme.
   */
  abstract css() : string;
}

// Export the ThemeManagerTheme class
export { ThemeManagerTheme };