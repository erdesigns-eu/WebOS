/**
 * Changelog:
 * - v1.0.0 (2023-10-20): Initial release
 */

import { RegisterFolder } from "./Folder";

/**
 * @class RegisterRecordError
 * @description The class that represents an error in the register record
 * @extends Error
 * @param message The message of the error
 */
class RegisterRecordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegisterRecordError";
  }
}

/**
 * The RegisterRecordType type
 * @type {string}
 * @description The type of the register record
 */
type RegisterRecordType = "string" | "number" | "boolean" | "date" | "folder";

/**
 * The RegisterRecordObject interface
 * @interface RegisterRecordObject
 */
interface RegisterRecordObject {
  name  : string;
  type  : RegisterRecordType;
  value : string | number | boolean | Date | Array<RegisterRecordObject>;
}

/**
 * @class RegisterRecord
 * @description The class that represents a record in the register
 */
class RegisterRecord {
  #name  : string                                             = "";         // The name of the record
  #type  : RegisterRecordType                                 = "string";   // The type of the record
  #value : string | number | boolean | Date | RegisterFolder  = "";         // The value of the record

  /**
   * Creates a new RegisterRecord instance
   * @param name The name of the record
   * @param type The type of the record
   * @param value The value of the record
   * @throws {RegisterRecordError} The name of the record must be a string
   * @throws {RegisterRecordError} The type of the record must be a string
   * @throws {RegisterRecordError} The value of the record must be a string, number, boolean, date or folder
   */
  constructor(name: string, type: RegisterRecordType, value: string | number | boolean | Date | RegisterFolder) {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterRecordError("The name of the record must be a string");
    }
    // Make sure the type is a string
    if (typeof type !== "string") {
      throw new RegisterRecordError("The type of the record must be a string");
    }
    // Make sure the value is a string, number, boolean, date or folder
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" && !(value instanceof Date) && !(value instanceof RegisterFolder)) {
      throw new RegisterRecordError("The value of the record must be a string, number, boolean, date or folder");
    }
    // If the value is a string, make sure the length is not greater than 1024
    if (typeof value === "string" && value.length > 1024) {
      throw new RegisterRecordError("The value of the record must not be greater than 1024 characters");
    }
    // Set the name
    this.#name = name;
    // Set the type
    this.#type = type;
    // Set the value
    this.#value = value;
  }

  /**
   * Gets the name of the record
   * @returns {string} The name of the record
   */
  get name() : string {
    return this.#name;
  }

  /**
   * Sets the name of the record
   * @param name The name of the record
   */
  set name(name : string) {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterRecordError("The name of the record must be a string");
    }
    // Set the name
    this.#name = name;
  }

  /**
   * Gets the type of the record
   * @returns {RegisterRecordType} The type of the record
   */
  get type() : RegisterRecordType {
    return this.#type;
  }

  /**
   * Sets the type of the record
   * @param type The type of the record
   * @throws {RegisterRecordError} The type of the record must be a string
   * @throws {RegisterRecordError} The type of the record must be a valid type
   */
  set type(type : RegisterRecordType) {
    // Make sure the type is a string
    if (typeof type !== "string") {
      throw new RegisterRecordError("The type of the record must be a string");
    }
    // If the type is not a valid type, throw an error
    if (type !== "string" && type !== "number" && type !== "boolean" && type !== "date" && type !== "folder") {
      throw new RegisterRecordError("The type of the record must be a valid type");
    }
    // If the type is different than the current type
    if (type !== this.#type) {
      switch (type) {
        case "string"  : this.#value = "";                   break;
        case "number"  : this.#value = 0;                    break;
        case "boolean" : this.#value = false;                break;
        case "date"    : this.#value = new Date();           break;
        case "folder"  : this.#value = new RegisterFolder(); break;
      }
      // Set the type
      this.#type = type;
    }
  }

  /**
   * Gets the value of the record
   * @returns {string | number | boolean | Date | RegisterFolder} The value of the record
   */
  get value() : string | number | boolean | Date | RegisterFolder {
    return this.#value;
  }

  /**
   * Sets the value of the record
   * @param value The value of the record
   */
  set value(value : string | number | boolean | Date | RegisterFolder) {
    // Make sure the value is a string, number, boolean, date or folder
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" && !(value instanceof Date) && !(value instanceof RegisterFolder)) {
      throw new RegisterRecordError("The value of the record must be a string, number, boolean, date or folder");
    }
    // If the value is a string, make sure the length is not greater than 1024
    if (typeof value === "string" && value.length > 1024) {
      throw new RegisterRecordError("The value of the record must not be greater than 1024 characters");
    }
    // Set the value
    this.#value = value;
  }

  /**
   * Checks if an object is a valid record
   * @param obj The object
   */
  static objectIsRecord(obj: object) : boolean {
    // Make sure the object is an object
    if (typeof obj !== "object") {
      return false;
    }
    // Make sure the object has a name
    if (!("name" in obj)) {
      return false;
    }
    // Make sure the object has a type
    if (!("type" in obj)) {
      return false;
    }
    // Make sure the object has a value
    if (!("value" in obj)) {
      return false;
    }
    // Make sure the name is a string
    if (typeof obj.name !== "string") {
      return false;
    }
    // Make sure the type is a string
    if (typeof obj.type !== "string") {
      return false;
    }
    // Make sure the value is a string, number, boolean, date or an array of records
    if (typeof obj.value !== "string" && typeof obj.value !== "number" && typeof obj.value !== "boolean" && !(obj.value instanceof Date) && !Array.isArray(obj.value)) {
      return false;
    }
    // If the value is an array, make sure it is an array of records
    if (Array.isArray(obj.value)) {
      // Loop through the array
      for (let i = 0; i < obj.value.length; i++) {
        // Make sure the object is a valid record
        if (!RegisterRecord.objectIsRecord(obj.value[i])) {
          return false;
        }
      }
    }
    // Return true
    return true;
  }

  /**
   * Converts a record to an object
   * @param record The record
   * @throws {RegisterRecordError} The record must be an instance of RegisterRecord
   */
  static recordToObject(record: RegisterRecord) : RegisterRecordObject {
    // Make sure the record is an instance of RegisterRecord
    if (!(record instanceof RegisterRecord)) {
      throw new RegisterRecordError("The record must be an instance of RegisterRecord");
    }
    // Return the object
    return {
      name  : record.name,
      type  : record.type,
      value : record.value instanceof RegisterFolder ? RegisterFolder.folderToArray(record.value) : record.value
    };
  }

  /**
   * Converts an object to a record
   * @param obj The object
   * @param record The record
   * @throws {RegisterRecordError} The object is not a valid record
   * @throws {RegisterRecordError} The record must be an instance of RegisterRecord
   */
  static ObjectToRecord(obj: RegisterRecordObject, record?: RegisterRecord) : RegisterRecord {
    // Make sure the object is a valid record
    if (!RegisterRecord.objectIsRecord(obj)) {
      throw new RegisterRecordError("The object is not a valid record");
    }
    // If record is defined, make sure it is an instance of RegisterRecord
    if (record && !(record instanceof RegisterRecord)) {
      throw new RegisterRecordError("The record must be an instance of RegisterRecord");
    }
    // If the record is not defined, create a new one
    if (!record) {
      record = new RegisterRecord(obj.name, obj.type, obj.value instanceof Array ? RegisterFolder.arrayToFolder(obj.value as Array<RegisterRecordObject>) : obj.value as string | number | boolean | Date);
    } else {
      // Set the name
      record.name = obj.name;
      // Set the type
      record.type = obj.type;
      // Set the value
      record.value = obj.value instanceof Array ? RegisterFolder.arrayToFolder(obj.value as Array<RegisterRecordObject>) : obj.value as string | number | boolean | Date;
    }
    // Return the record
    return record;
  }

}

// Export the RegisterRecord interface
export type { RegisterRecordType, RegisterRecordObject };
export { RegisterRecord, };