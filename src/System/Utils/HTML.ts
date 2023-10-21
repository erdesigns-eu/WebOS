/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @method stringContainsHTML
 * @description Checks whether or not the given string contains HTML
 * @param string The string to check
 */
export const stringContainsHTML = (string: string): boolean => {
  // Pattern for HTML tags
  const htmlPattern = /<([A-Z][A-Z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/i;
  // Return whether or not the string contains HTML
  return htmlPattern.test(string);
}

/**
 * @method removeHTMLFromString
 * @description Removes HTML from the given string
 * @param string The string to remove HTML from
 */
export const removeHTMLFromString = (string: string): string => {
  // Pattern for HTML tags
  const htmlPattern = /<([A-Z][A-Z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/i;
  // Return the string with HTML removed
  return string.replace(htmlPattern, "");
}

/**
 * @method getHTMLFromString
 * @description Gets the HTML from the given string
 * @param string The string to get HTML from
 */
export const getHTMLFromString = (string: string): string => {
  // Pattern for HTML tags
  const htmlPattern = /<([A-Z][A-Z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/i;
  // Check if there is a match before returning
  const match = string.match(htmlPattern);
  // Return the match if there is one
  return match ? match[0] : "";
}

/**
 * @method sanitizeHTML
 * @description Removes HTML from the given string
 * @param string The string to sanitize
 */
export const sanitizeHTML = (string: string): string => {
  // Create a new DOMParser instance
  const parser = new DOMParser();
  // Create a new HTML document
  const doc = parser.parseFromString(string, 'text/html');
  // Return the sanitized string
  return doc.body.innerText;
}

/**
 * @method isImageURLOrDataURL
 * @description Checks whether or not the given string is an image URL or data URL
 * @param string The string to check
 */
export const isImageURLOrDataURL = (string: string): boolean => {
  // Pattern for image URLs
  const imageURLPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
  // Pattern for data URLs
  const dataURLPattern = /^data:image\/(jpeg|png|gif|bmp|svg\+xml|webp)/i;
  // Return whether or not the string is an image URL or data URL
  return imageURLPattern.test(string) || dataURLPattern.test(string);
}