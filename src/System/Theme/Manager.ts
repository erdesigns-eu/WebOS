/**
 * Changelog:
 * - v1.0.0 (2023-10-31): Initial release
 */

import { ThemeManagerTheme } from "./Modules/Theme";

/**
 * @class ThemeManagerError
 * @description The error thrown by the ThemeManager class
 * @extends Error
 * @property name The name of the error
 */
class ThemeManagerError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "ThemeManagerError";
  }
}

/**
 * @interface ThemeMap
 * @description The interface for the theme map used by the ThemeManager class.
 * @property key The key of the theme
 * @property value The value of the theme
 */
interface ThemeMap {
  [key: string]: ThemeManagerTheme;
}

/**
 * @class ThemeManager
 * @description The class that manages the themes on the system.
 * @singleton
 * @extends EventTarget
 */
class ThemeManager extends EventTarget {
  static #instance : ThemeManager;

  #themes       : ThemeMap                  = {};     // The themes that are managed by the manager
  #activeTheme  : ThemeManagerTheme | null  = null;   // The active theme in the theme manager
  #ready        : boolean                   = false;  // The ready state of the ThemeManager instance

  /**
   * @constructor
   */
  constructor(themes?: ThemeManagerTheme[]) {
    // Call the super constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the thememanager manager is not already instantiated
    if (ThemeManager.#instance) {
      throw new ThemeManagerError("ThemeManager is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== ThemeManager) {
      throw new ThemeManagerError("Cannot extend ThemeManager class, must instantiate it instead of extending it!");
    }

    // Register the themes
    if (themes) {
      themes.forEach((theme) => {
        // Register the theme in the theme manager
        this.registerTheme(theme);
      });
    }

    // Set the instance of the ThemeManager class
    ThemeManager.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));
  }

  /**
   * Returns the ThemeManager instance
   * @readonly
   * @static
   */
  static getInstance(): ThemeManager {
    // Check if the instance is already instantiated
    if (!ThemeManager.#instance) {
      // Instantiate the ThemeManager
      ThemeManager.#instance = new ThemeManager();
    }
    // Return the instance of the ThemeManager
    return ThemeManager.#instance;
  }

  /**
   * @method registerTheme
   * @description Registers a theme in the theme manager.
   * @param theme The theme to register
   */
  registerTheme(theme: ThemeManagerTheme) : void {
    // Make sure the theme is valid
    if (!(theme instanceof ThemeManagerTheme)) {
      throw new ThemeManagerError("Invalid theme! The theme must be an instance of ThemeManagerTheme.");
    }
    // Make sure the theme is not already registered
    if (this.#themes[theme.name]) {
      throw new ThemeManagerError("Invalid theme! The theme is already registered.");
    }
    // Register the theme
    this.#themes[theme.name] = theme;
    // Dispatch the theme registered event
    this.dispatchEvent(new CustomEvent("registered", { detail: { theme: theme } }));
  }

  /**
   * @method unregisterTheme
   * @description Unregisters a theme from the theme manager.
   * @param theme The theme to unregister
   */
  unregisterTheme(theme: ThemeManagerTheme) : void {
    // Make sure the theme is valid
    if (!(theme instanceof ThemeManagerTheme)) {
      throw new ThemeManagerError("Invalid theme! The theme must be an instance of ThemeManagerTheme.");
    }
    // Make sure the theme is registered
    if (!this.#themes[theme.name]) {
      throw new ThemeManagerError("Invalid theme! The theme is not registered.");
    }
    // Unregister the theme
    delete this.#themes[theme.name];
    // Dispatch the theme unregistered event
    this.dispatchEvent(new CustomEvent("unregistered", { detail: { theme: theme } }));
  }

  /**
   * @method getTheme
   * @description Gets a theme from the theme manager.
   * @param name The name of the theme to get
   */
  getTheme(name: string) : ThemeManagerTheme {
    // Make sure the theme is registered
    if (!this.#themes[name]) {
      throw new ThemeManagerError("Invalid theme! The theme is not registered.");
    }
    // Return the theme
    return this.#themes[name];
  }

  /**
   * @method getThemes
   * @description Gets all themes from the theme manager.
   */
  getThemes() : ThemeManagerTheme[] {
    // Return the themes
    return Object.values(this.#themes);
  }

  /**
   * @method applyTheme
   * @description Applies a theme from the theme manager to the system.
   * @param theme The theme to apply
   */
  applyTheme(theme: ThemeManagerTheme, accentColor?: string) : void {
    // Make sure the theme is valid
    if (!(theme instanceof ThemeManagerTheme)) {
      throw new ThemeManagerError("Invalid theme! The theme must be an instance of ThemeManagerTheme.");
    }
    // Make sure the theme is registered
    if (!this.#themes[theme.name]) {
      throw new ThemeManagerError("Invalid theme! The theme is not registered.");
    }
    // Apply the theme
    theme.apply(accentColor);
    // Set the active theme
    this.#activeTheme = theme;
    // Dispatch the theme change event
    this.dispatchEvent(new CustomEvent("change", { detail: { theme: theme } }));
  }

  /**
   * Returns the active theme in the theme manager
   * @getter
   */
  get activeTheme() : ThemeManagerTheme | null {
    return this.#activeTheme;
  }

  /**
   * Returns the ready state of the ThemeManager instance
   * @getter
   */
  get ready() : boolean {
    return this.#ready;
  }

  /**
   * Returns the accent color of the active theme
   * @getter
   */
  get accentColor() : string {
    return getComputedStyle(document.documentElement).getPropertyValue("--accent-color");
  }

}

// Export the ThemeManager class
export { ThemeManager };