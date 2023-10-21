/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @typedef {string} WindowPositionType
 * @description The initial position of a window on the screen
 * @property {string} poDefault The default position of the window
 * @property {string} poDefaultPosOnly The default position of the window, but not the size
 * @property {string} poDefaultSizeOnly The default size of the window, but not the position
 * @property {string} poDesigned The position of the window is the one saved in the designer
 * @property {string} poDesktopCenter The window is centered on the desktop
 * @property {string} poScreenCenter The window is centered on the screen
 */
type WindowPositionType = "poDefault" | "poDefaultPosOnly" | "poDefaultSizeOnly" | "poDesigned" | "poDesktopCenter" | "poScreenCenter";

// Export the types
export type { WindowPositionType };