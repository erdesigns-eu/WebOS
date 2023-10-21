/**
 * Changelog:
 * - v1.0.0 (2023-10-20): Initial release
 */

import { RegisterFolder } from "./Modules/Folder";
import type { RegisterRecordObject, RegisterRecordType } from "./Modules/Record";
import { RegisterRecord } from "./Modules/Record";

/**
 * @class RegisterManagerError
 * @description The error thrown by the RegisterManager class
 * @extends Error
 * @property name The name of the error
 */
class RegisterManagerError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "RegisterManagerError";
  }
}

/**
 * @class RegisterManager
 * @description The class that manages the register (like the register found on Windows).
 * @singleton
 * @extends EventTarget
 */
class RegisterManager extends EventTarget {
  static #instance : RegisterManager;

  #root   : RegisterFolder  = new RegisterFolder();   // The root folder of the register
  #ready  : boolean         = false;                  // Whether the register manager is ready or not

  /**
   * Creates a new SystemManager instance
   * @throws {RegisterManagerError} If the PermissionManager is already instantiated
   * @throws {RegisterManagerError} If the PermissionManager class is extended instead of instantiated
   * @fires SystemManager#ready
   */
  constructor(root: Array<RegisterRecordObject> = []) {
    // Call the super constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the register manager is not already instantiated
    if (RegisterManager.#instance) {
      throw new RegisterManagerError("RegisterManager is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== RegisterManager) {
      throw new RegisterManagerError("Cannot extend RegisterManager class, must instantiate it instead of extending it!");
    }

    // Set the root folder
    RegisterFolder.arrayToFolder(root, this.#root);

    // Set the instance of the RegisterManager
    RegisterManager.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));
  }

  /**
   * Returns the RegisterManager instance
   * @readonly
   * @static
   */
  static getInstance(): RegisterManager {
    // Check if the instance is already instantiated
    if (!RegisterManager.#instance) {
      // Instantiate the RegisterManager
      RegisterManager.#instance = new RegisterManager();
    }
    // Return the instance of the RegisterManager
    return RegisterManager.#instance;
  }

  /**
   * Adds a folder to the register
   * @param name The name of the folder to add
   * @throws {RegisterManagerError} If the name is not a string
   * @throws {RegisterManagerError} If the folder already exists
   */
  addFolder(name: string): RegisterFolder {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }

    // Make sure the folder does not already exist
    if (this.#root.hasFolder(name)) {
      throw new RegisterManagerError("The folder already exists!");
    }

    // Create the folder
    this.#root.addFolder(name);

    // Emit the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { folder: this.#root.getFolder(name) } }));

    // Return the folder
    return this.#root.getFolder(name);
  }

  /**
   * Adds a record to the register
   * @param name The name of the record to add
   * @param type The type of the record to add
   * @param value The value of the record to add
   * @throws {RegisterManagerError} If the name is not a string
   * @throws {RegisterManagerError} If the type is not a string
   * @throws {RegisterManagerError} If the value is not a string, number, boolean, or Date
   * @throws {RegisterManagerError} If the record already exists
   */
  addRecord(name: string, type: RegisterRecordType, value: string | number | boolean | Date): RegisterRecord {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }

    // Make sure the type is a string
    if (typeof type !== "string") {
      throw new RegisterManagerError("The type must be a string!");
    }

    // Make sure the value is a string, number, boolean, or Date
    if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" && !(value instanceof Date)) {
      throw new RegisterManagerError("The value must be a string, number, boolean, or Date!");
    }

    // Make sure the record does not already exist
    if (this.#root.hasRecord(name)) {
      throw new RegisterManagerError("The record already exists!");
    }

    // Create the record
    this.#root.addRecord(name, type, value);

    // Emit the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { record: this.#root.getRecord(name) } }));

    // Return the record
    return this.#root.getRecord(name);
  }

  /**
   * Removes a folder from the register
   * @param name The name of the folder to remove
   * @throws {RegisterManagerError} If the name is not a string
   * @throws {RegisterManagerError} If the folder does not exist
   */
  removeFolder(name: string): void {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }

    // Make sure the folder exists
    if (!this.#root.hasFolder(name)) {
      throw new RegisterManagerError("The folder does not exist!");
    }

    // Remove the folder
    this.#root.removeFolder(name);
  
    // Emit the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { folder: name, removed: true } }));
  }

  /**
   * Removes a record from the register
   * @param name The name of the record to remove
   * @throws {RegisterManagerError} If the name is not a string
   * @throws {RegisterManagerError} If the record does not exist
   */
  removeRecord(name: string): void {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }

    // Make sure the record exists
    if (!this.#root.hasRecord(name)) {
      throw new RegisterManagerError("The record does not exist!");
    }

    // Remove the record
    this.#root.removeRecord(name);

    // Emit the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { record: name, removed: true } }));
  }

  /**
   * Returns a folder from the register
   * @param name The name of the folder to return
   * @throws {RegisterManagerError} If the name is not a string
   * @throws {RegisterManagerError} If the folder does not exist
   */
  getFolder(name: string): RegisterFolder {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }

    // Make sure the folder exists
    if (!this.#root.hasFolder(name)) {
      throw new RegisterManagerError("The folder does not exist!");
    }

    // Return the folder
    return this.#root.getFolder(name);
  }

  /**
   * Returns a record from the register
   * @param name The name of the record to return
   * @throws {RegisterManagerError} If the name is not a string
   * @throws {RegisterManagerError} If the record does not exist
   */
  getRecord(name: string): RegisterRecord {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }

    // Make sure the record exists
    if (!this.#root.hasRecord(name)) {
      throw new RegisterManagerError("The record does not exist!");
    }

    // Return the record
    return this.#root.getRecord(name);
  }

  /**
   * Returns whether a folder exists in the register
   * @param name The name of the folder to check
   * @throws {RegisterManagerError} If the name is not a string
   */
  hasFolder(name: string): boolean {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }
    // Return whether the folder exists
    return this.#root.hasFolder(name);
  }

  /**
   * Returns whether a record exists in the register
   * @param name The name of the record to check
   * @throws {RegisterManagerError} If the name is not a string
   */
  hasRecord(name: string): boolean {
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new RegisterManagerError("The name must be a string!");
    }
    // Return whether the record exists
    return this.#root.hasRecord(name);
  }

  /**
   * Returns a folder from the register from a path
   * @param path The path of the folder to return
   */
  getFolderFromPath(path: string): RegisterFolder {
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
   * Returns a record from the register from a path
   * @param path The path of the record to return
   */
  getRecordFromPath(path: string): RegisterRecord {
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
   * Returns whether the register manager is ready or not
   * @readonly
   */
  get ready(): boolean {
    return this.#ready;
  }

  /**
   * Returns the root folder of the register
   * @readonly
   */
  get root(): RegisterFolder {
    return this.#root;
  }

  /**
   * Returns the register as an array 
   */
  static registerToArray(): Array<RegisterRecordObject> {
    return RegisterFolder.folderToArray(RegisterManager.getInstance().root);
  }

  /**
   * Returns the register as an array 
   */
  static arrayToRegister(array: Array<RegisterRecordObject>): void {
    RegisterFolder.arrayToFolder(array, RegisterManager.getInstance().root);
  }

}

// Export the RegisterManager class
export { RegisterManager, RegisterRecordObject };