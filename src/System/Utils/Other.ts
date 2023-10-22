/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

/**
 * @function debounce
 * @description Debounces a function
 * @param callback The callback function
 * @param delay The delay in milliseconds
 */
export const debounce = (callback: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(null, args), delay);
  };
};