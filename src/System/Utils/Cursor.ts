/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @method isValidCursor
 * @description Checks whether or not the given cursor is valid
 * @param cursor The cursor to check
 */
export const isValidCursor = (cursor: string): boolean => {
  // Valid CSS cursors (https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
  const validCursors = [
    "alias", "all-scroll", "auto", "cell", "context-menu", "col-resize",
    "copy", "crosshair", "default", "e-resize", "ew-resize", "grab", "grabbing",
    "help", "move", "n-resize", "ne-resize", "nesw-resize", "no-drop", "none",
    "not-allowed", "ns-resize", "nw-resize", "nwse-resize", "pointer", "progress",
    "row-resize", "s-resize", "se-resize", "sw-resize", "text", "vertical-text",
    "w-resize", "wait", "zoom-in", "zoom-out"
  ];

  // Check if the cursor is a valid CSS cursor
  if (validCursors.includes(cursor)) {
    return true;
  }

  // Check for URLs
  if (cursor.startsWith("url(") && cursor.endsWith(")")) {
    return true;
  }

  // Return false if the cursor is invalid
  return false;
};