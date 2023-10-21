/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

/**
 * @class StringUtilError
 * @description An error thrown when a string util method fails
 * @extends Error
 */
class StringUtilError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StringUtilError";
  }
}

/**
 * @method asString
 * @description Converts the value to a string
 * @param value The value to convert
 * @throws {StringUtilError} If the value cannot be converted to a string
 */
export const asString = (value: any): string => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  if (typeof value === "function") {
    return asString(value());
  }
  if (value === undefined) {
    return "undefined";
  }
  if (value === null) {
    return "null";
  }
  if (value instanceof Symbol) {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value instanceof Error) {
    return value.toString();
  }
  throw new StringUtilError("Invalid value");
};
