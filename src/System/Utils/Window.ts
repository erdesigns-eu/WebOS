/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @method createWindowHandle
 * @description Creates a unique window handle for a window
 */
export const createWindowHandle = (): string => {
  // Generate a unique id for the window handle
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
