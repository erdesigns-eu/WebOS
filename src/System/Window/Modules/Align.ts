/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @typedef {string} WindowAlignType
 * @description The alignment of a window on the screen
 * @property {string} alNone The window is not aligned
 * @property {string} alTop The window is aligned to the top
 * @property {string} alBottom The window is aligned to the bottom
 * @property {string} alLeft The window is aligned to the left
 * @property {string} alRight The window is aligned to the right
 * @property {string} alClient The window is aligned to the client
 */
type WindowAlignType = "alNone" | "alTop" | "alBottom" | "alLeft" | "alRight" | "alClient";

// Export the types
export type { WindowAlignType };