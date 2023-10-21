/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @typedef {string} WindowStateType
 * @description The state of a window
 * @property {string} wsNormal The window is in normal state
 * @property {string} wsMinimized The window is minimized
 * @property {string} wsMaximized The window is maximized
 * @property {string} wsFullScreen The window is in full screen
 */
type WindowStateType = "wsNormal" | "wsMinimized" | "wsMaximized" | "wsFullScreen";

// Export the types
export type { WindowStateType };