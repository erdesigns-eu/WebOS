/**
 * Changelog:
 * - v1.0.0 (2023-10-20): Initial release
 */

import { RegisterRecord, RegisterRecordObject, RegisterRecordType } from "./Record";

/**
 * @class RegisterFolderError
 * @description The error thrown by the RegisterFolder class
 * @extends Error
 * @property name The name of the error
 */
class RegisterFolderError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "RegisterFolderError";
  }
}

type RegisterFolderData = { [key: string]: RegisterRecord | RegisterFolder | any };

/**
 * @class RegisterFolder
 * @description The class that represents a folder in the register
 * @property data The data of the folder
 * @property keys The keys of the folder
 */
class RegisterFolder {
  #data: RegisterFolderData = {};

  /**
   * Creates a new RegisterFolder instance
   * @param data The data of the folder
   * @throws {RegisterFolderError} If the data is not an object
   */
  constructor(data?: RegisterFolderData) {
    // If the data is provided
    if (data) {
      // Make sure the data is an object
      if ( typeof data !== "object") {
        throw new RegisterFolderError("The data must be an object!");
      }

      // Loop through the data
      for (const key in data) {
        // Make sure the key is a string
        if (typeof key !== "string") {
          throw new RegisterFolderError("The key must be a string!");
        }

        // Make sure the value is an instance of RegisterRecord or RegisterFolder
        if (!(data[key] instanceof RegisterRecord) && !(data[key] instanceof RegisterFolder)) {
          throw new RegisterFolderError("The value must be an instance of RegisterRecord or RegisterFolder!");
        }
      }

      // Set the data
      this.#data = data;
    }
  }

  /**
   * Adds a record to the folder
   * @param name The name of the record to add
   * @param type The type of the record to add
   * @param value The value of the record to add
   * @throws {RegisterFolderError} If the record is not an object
   * @throws {RegisterFolderError} If the record does not have a name
   * @throws {RegisterFolderError} If the record does not have a type
   * @throws {RegisterFolderError} If the record does not have a value
   */
  addRecord(name: string, type: RegisterRecordType, value: string | number | boolean | Date | RegisterFolder) : RegisterRecord {
    // Make sure the name is set
    if (!name) {
      throw new RegisterFolderError("The record must have a name!");
    }

    // Make sure the type is set
    if (!type) {
      throw new RegisterFolderError("The record must have a type!");
    }

    // Make sure the value is set
    if (!value) {
      throw new RegisterFolderError("The record must have a value!");
    }

    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterFolderError("The name must be a string!");
    }

    // Make sure the type is a string
    if (typeof type !== "string") {
      throw new RegisterFolderError("The type must be a string!");
    }

    // Make sure the value is a string, number, boolean, or Date instance or RegisterFolder instance
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" && !(value instanceof Date) && !(value instanceof RegisterFolder)) {
      throw new RegisterFolderError("The value must be a string, number, boolean, Date instance, or RegisterFolder instance!");
    }

    // Add the record to the data
    this.#data[name] = new RegisterRecord(name, type, value);

    // Return the record
    return this.#data[name];
  }

  /**
   * Adds a folder to the folder
   * @param name The name of the folder to add
   * @throws {RegisterFolderError} If the name is not a string
   */
  addFolder(name: string) : RegisterFolder {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterFolderError("The name must be a string!");
    }

    // Add the folder to the data
    this.#data[name] = new RegisterFolder();

    // Return the folder
    return this.#data[name];
  }

  /**
   * Removes a record from the folder
   * @param name The name of the record to remove
   * @throws {RegisterFolderError} If the name is not a string
   * @throws {RegisterFolderError} If the record does not exist
   */
  removeRecord(name: string) : void {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterFolderError("The name must be a string!");
    }

    // Make sure the record exists
    if (!this.#data[name]) {
      throw new RegisterFolderError("The record does not exist!");
    }

    // Make sure the record is a record
    if (this.#data[name].type === "folder") {
      throw new RegisterFolderError("The record is not a record!");
    }

    // Remove the record
    delete this.#data[name];
  }

  /**
   * Removes a folder from the folder
   * @param name The name of the folder to remove
   * @throws {RegisterFolderError} If the name is not a string
   * @throws {RegisterFolderError} If the folder does not exist
   * @throws {RegisterFolderError} If the folder is not a folder
   */
  removeFolder(name: string) : void {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterFolderError("The name must be a string!");
    }

    // Make sure the folder exists
    if (!this.#data[name]) {
      throw new RegisterFolderError("The folder does not exist!");
    }

    // Make sure the folder is a folder
    if (this.#data[name].type !== "folder") {
      throw new RegisterFolderError("The folder is not a folder!");
    }

    // Remove the folder
    delete this.#data[name];
  }

  /**
   * Returns a record from the folder
   * @param name The name of the record to return
   */
  getRecord(name: string) : RegisterRecord {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterFolderError("The name must be a string!");
    }

    // Make sure the record exists
    if (!this.#data[name]) {
      throw new RegisterFolderError("The record does not exist!");
    }

    // Make sure the record is a record
    if (this.#data[name].type === "folder") {
      throw new RegisterFolderError("The record is not a record!");
    }

    // Return the record
    return this.#data[name];
  }

  /**
   * Gets a folder from the folder
   * @param name The name of the folder to get
   * @throws {RegisterFolderError} If the name is not a string
   * @throws {RegisterFolderError} If the folder does not exist
   * @throws {RegisterFolderError} If the folder is not a folder
   */
  getFolder(name: string) : RegisterFolder {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterFolderError("The name must be a string!");
    }

    // Make sure the folder exists
    if (!this.#data[name]) {
      throw new RegisterFolderError("The folder does not exist!");
    }

    // Make sure the folder is a folder
    if (!(this.#data[name] instanceof RegisterFolder)) {
      throw new RegisterFolderError("The folder is not a folder!");
    }

    // Return the folder
    return this.#data[name];
  }

  /**
   * Gets a record from a path
   * @param path The path of the record to get
   */
  getRecordFromPath(path: string) : RegisterRecord {
    // Split the path
    const pathParts = path.split("/");
    // Get the record name
    const recordName = pathParts.pop() || "";
    // Get the folder
    const folder = this.getFolderFromPath(pathParts.join("/"));
    // Return the record
    return folder.getRecord(recordName);
  }

  /**
   * Gets a folder from a path
   * @param path The path of the folder to get
   */
  getFolderFromPath(path: string) : RegisterFolder {
    // Split the path
    const pathParts = path.split("/");
    // Get the folder name
    const folderName = pathParts.pop() || "";
    // Get the folder
    const folder = this.getFolder(pathParts.join("/"));
    // Return the folder
    return folder.getFolder(folderName);
  }

  /**
   * Returns whether the folder has a record or not
   * @param name The name of the record to check
   */
  hasRecord(name: string) : boolean {
    return this.#data[name] && this.#data[name].type !== "folder";
  }

  /**
   * Returns whether the folder has a folder or not
   * @param name The name of the folder to check
   */
  hasFolder(name: string) : boolean {
    return this.#data[name] && this.#data[name].type === "folder";
  }

  /**
   * Returns the data of the folder
   * @readonly
   */
  get data() : RegisterFolderData {
    return this.#data;
  }

  /**
   * Returns the keys of the folder
   * @readonly
   */
  get keys() : string[] {
    return Object.keys(this.#data);
  }

  /**
   * Returns the records of the folder
   * @readonly
   */
  get folders() : string[] {
    return this.keys.filter(key => this.#data[key] instanceof RegisterFolder);
  }

  /**
   * Returns the records of the folder
   * @readonly
   */
  get records() : string[] {
    return this.keys.filter(key => this.#data[key] instanceof RegisterRecord);
  }

  /**
   * Converts a folder to an array
   * @param folder The folder to convert
   * @throws {RegisterFolderError} If the folder is not an instance of RegisterFolder
   */
  static folderToArray(folder: RegisterFolder) : Array<RegisterRecordObject> {
    // Make sure the folder is a folder
    if (!(folder instanceof RegisterFolder)) {
      throw new RegisterFolderError("The folder must be an instance of RegisterFolder!");
    }
    // The array
    const arr: Array<RegisterRecordObject> = [];
    // Loop through the records
    for (let i = 0; i < folder.records.length; i++) {
      // Push the record to the array
      arr.push(folder.data[i].saveToObject());
    }
    // Return the array
    return arr;
  }

  /**
   * Converts an array to a folder
   * @param arr The array to convert
   * @param folder The folder to add the records to
   * @throws {RegisterFolderError} If the array is not an array
   * @throws {RegisterFolderError} If the array is not an array of RegisterObjects
   * @throws {RegisterFolderError} If the folder is not an instance of RegisterFolder
   */
  static arrayToFolder(arr: Array<RegisterRecordObject>, folder?: RegisterFolder) : RegisterFolder {
    // Make sure the array is an array
    if (!Array.isArray(arr)) {
      throw new RegisterFolderError("The array must be an array!");
    }
    // Make sure the array is an array of RegisterObjects
    for (let i = 0; i < arr.length; i++) {
      if (!RegisterRecord.objectIsRecord(arr[i])) {
        throw new RegisterFolderError("The array must be an array of RegisterObjects!");
      }
    }
    // If the folder is provided, make sure it is a folder
    if (folder && !(folder instanceof RegisterFolder)) {
      throw new RegisterFolderError("The folder must be an instance of RegisterFolder!");
    }
    // If the folder is not provided, create a new one
    if (!folder) {
      folder = new RegisterFolder();
    }
    // Loop through the array
    for (let i = 0; i < arr.length; i++) {
      //
      let recordValue: string | number | boolean | Date | RegisterFolder;
      // If the value is an array, convert it to a folder
      if (Array.isArray(arr[i].value)) {
        recordValue = RegisterFolder.arrayToFolder(arr[i].value as Array<RegisterRecordObject>);
      } else {
        recordValue = arr[i].value as string | number | boolean | Date;
      } 
      // Add the record to the folder
      folder.addRecord(arr[i].name, arr[i].type, recordValue);
    }
    // Return the folder
    return folder;
  }

}

// Export the RegisterFolder class
export { RegisterFolderError, RegisterFolder };