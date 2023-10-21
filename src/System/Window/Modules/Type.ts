/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @typedef {string} WindowType
 * @description The type of a window
 * @property {string} dialog The window is a dialog
 * @property {string} single The window is a single window
 * @property {string} sizeable The window is sizeable
 * @property {string} tool The window is a tool
 * @property {string} sizeableTool The window is a sizeable tool
 * @property {string} custom The window is a custom window
 */
type WindowType = "dialog" | "single" | "sizeable" | "tool" | "sizeableTool" | "custom";

// Export the types
export type { WindowType };