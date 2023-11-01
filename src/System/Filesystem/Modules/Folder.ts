/**
 * Changelog:
 * - v1.0.0 (2023-10-29): Initial release
 */

import { FilesystemDisk } from "./Disk";
import { FilesystemFile, LocalFilesystemFile } from "./File";
import type { FilesystemFileProperties } from "./File";

/**
 * @class FilesystemFolderError
 * @description The error thrown by the FilesystemFolder class
 * @extends Error
 * @property name The name of the error
 */
class FilesystemFolderError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "FilesystemFolderError";
  }
}

/**
 * FilesystemFolderProperties
 * @property readonly Whether the folder is readonly
 * @property hidden Whether the folder is hidden
 * @property system Whether the folder is a system folder
 * @property locked Whether the folder is locked
 * @property password The password to unlock the folder
 */
type FilesystemFolderProperties = {
  readonly : boolean,
  hidden   : boolean,
  system   : boolean,
  locked   : boolean,
  password : string
};

/**
 * The default properties of a folder
 * @constant defaultFilesystemFolderProperties
 * @type {FilesystemFolderProperties}
 */
export const defaultFilesystemFolderProperties: FilesystemFolderProperties = {
  readonly  : false,  // Whether the folder is readonly
  hidden    : false,  // Whether the folder is hidden
  system    : false,  // Whether the folder is a system folder
  locked    : false,  // Whether the folder is locked
  password  : ""      // The password to unlock the folder
};

// Invalid characters for a folder name
const invalidCharacters: string[] = [
  "\\", "/", ":", "*", "?", "\"", "<", ">", "|"
];

// Maximum length of a folder name
const maximumLength: number = 255;

/**
 * @class FilesystemFolder
 * @description The class that represents a folder in the filesystem of the WebOS.
 * @extends EventTarget
 */
abstract class FilesystemFolder extends EventTarget {

  /**
   * @constructor
   * @param name The name of the folder
   * @param properties The properties of the folder
   * @description Creates a new instance of the FilesystemFolder class
   */
  constructor(name: string, properties: FilesystemFolderProperties = defaultFilesystemFolderProperties, items: FilesystemFolder[] | FilesystemFile[] = [], parent: FilesystemFolder | FilesystemDisk | null = null) {
    // Call the super constructor
    super();
    // Check if the name is valid
    this.ensureFolderName(name);
    // Check if the properties are valid
    this.ensureFolderProperties(properties);
    // Use the items if provided
    if (items.length > 0) {
      // Add the change event listener to the items
      items.forEach(item => {
        if (item instanceof FilesystemFolder) {
          // @ts-expect-error
          item.addEventListener("change", this.handleFolderChange.bind(this));
        } else if (item instanceof FilesystemFile) {
          // @ts-expect-error
          item.addEventListener("change", this.handleFileChange.bind(this));
        }
      });
    }
    // Use the parent if provided
    if (parent !== null) {
      // Not implemented
    }
  }

  /**
   * Ensures that the name of the folder is valid
   * @method ensureFolderName
   */
  protected ensureFolderName(name: string) : void {
    // Check if the name is a string
    if (typeof name !== "string") {
      throw new FilesystemFolderError("The name of the folder must be a string!");
    }
    // Check if the name contains invalid characters
    for (let i = 0; i < invalidCharacters.length; i++) {
      if (name.includes(invalidCharacters[i])) {
        throw new FilesystemFolderError(`The name of the folder cannot contain the character "${invalidCharacters[i]}"!`);
      }
    }
    // Check if the name is empty
    if (name.trim().length === 0) {
      throw new FilesystemFolderError("The name of the folder cannot be empty!");
    }
    // Check if the name is too long
    if (name.length > maximumLength) {
      throw new FilesystemFolderError(`The name of the folder cannot be longer than ${maximumLength} characters!`);
    }
  }

  /**
   * Ensures that the folder is unique
   * @method ensureFolderIsUnique
   */
  protected abstract ensureFolderIsNotLocked() : void;

  /**
   * Ensures that the properties of the folder are valid
   * @method ensureFolderProperties
   */
  protected ensureFolderProperties(properties: FilesystemFolderProperties) : void {
    if (typeof properties !== "object") {
      throw new FilesystemFolderError("The properties of the folder must be an object!");
    }
    if (typeof properties.readonly !== "boolean") {
      throw new FilesystemFolderError("The readonly property of the folder must be a boolean!");
    }
    if (typeof properties.hidden !== "boolean") {
      throw new FilesystemFolderError("The hidden property of the folder must be a boolean!");
    }
    if (typeof properties.system !== "boolean") {
      throw new FilesystemFolderError("The system property of the folder must be a boolean!");
    }
    if (typeof properties.locked !== "boolean") {
      throw new FilesystemFolderError("The locked property of the folder must be a boolean!");
    }
    if (typeof properties.password !== "string") {
      throw new FilesystemFolderError("The password property of the folder must be a string!");
    }
  }

  /**
   * Handles the change event
   * @method handleFolderChange
   * @param event The event
   */
  protected handleFolderChange(event: CustomEvent) : void {
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: event.detail }));
  }

  /**
   * Handles the change event
   * @method handleFileChange
   * @param event The event
   */
  protected handleFileChange(event: CustomEvent) : void {
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: event.detail }));
  }

  /**
   * Returns the name of the folder
   * @method getName
   */
  abstract getName() : Promise<string>;

  /**
   * Sets the name of the folder
   * @method setName
   */
  abstract setName(name: string) : Promise<any>;

  /**
   * Returns the readonly property
   * @method getReadonly
   */
  abstract getReadonly() : Promise<boolean>;

  /**
   * Sets the readonly property
   * @method setReadonly
   */
  abstract setReadonly(readonly: boolean) : Promise<any>;

  /**
   * Returns the hidden property
   * @method getHidden
   */
  abstract getHidden() : Promise<boolean>;

  /**
   * Sets the hidden property
   * @method setHidden
   */
  abstract setHidden(hidden: boolean) : Promise<any>;

  /**
   * Returns the system property
   * @method getSystem
   */
  abstract getSystem() : Promise<boolean>;

  /**
   * Sets the system property
   * @method setSystem
   */
  abstract setSystem(system: boolean) : Promise<any>;

  /**
   * Returns the locked property
   * @method getLocked
   */
  abstract getLocked() : Promise<boolean>;

  /**
   * Returns the folders in the folder
   * @method getFolders
   */
  abstract getFolders() : Promise<FilesystemFolder[]>;

  /**
   * Returns the files in the folder
   * @method getFiles
   */
  abstract getFiles() : Promise<FilesystemFile[]>;

  /**
   * Returns the size of the folder (including the size of the files in the folder and the size of the folders in the folder) in bytes
   * @method getSize
   */
  abstract getSize() : Promise<number>;

  /**
   * Locks the folder
   * @method lock
   * @param password The password to lock the folder
   */
  abstract lock(password: string) : Promise<any>;

  /**
   * Unlocks the folder
   * @method unlock
   * @param password The password to unlock the folder
   */
  abstract unlock(password: string) : Promise<any>;

  /**
   * Returns whether the folder has a folder with the specified name
   * @method hasFolder
   * @param name The name of the folder
   */
  abstract hasFolder(name: string) : Promise<boolean>;

  /**
   * Returns whether the folder has a folder with the specified name in the path
   * @method hasFolderInPath
   */
  abstract hasFolderInPath(path: string, name: string) : Promise<boolean>;

  /**
   * Returns whether the folder has a file with the specified name
   * @method hasFile
   * @param name The name of the file
   */
  abstract hasFile(name: string) : Promise<boolean>;

  /**
   * Returns whether the folder has a file with the specified name in the path
   * @method hasFileInPath
   */
  abstract hasFileInPath(path: string, name: string) : Promise<boolean>;

  /**
   * Adds an item to the folder
   * @method addItem
   */
  abstract addItem(item: FilesystemFolder | FilesystemFile) : Promise<any>;

  /**
   * Adds items to the folder
   * @method addItems
   */
  abstract addItems(items: (FilesystemFolder | FilesystemFile)[]) : Promise<any>;

  /**
   * Adds a folder to the folder with the specified name and properties
   * @method addFolder
   * @param name The name of the folder
   * @param properties The properties of the folder
   */
  abstract addFolder(name: string, properties: FilesystemFolderProperties) : Promise<any>;

  /**
   * Adds a file to the folder with the specified name and properties
   * @method addFile
   * @param name The name of the file
   * @param properties The properties of the file
   */
  abstract addFile(name: string, content: any, properties: FilesystemFileProperties) : Promise<any>;

  /**
   * Removes a folder from the folder with the specified name
   * @method removeFolder
   * @param name The name of the folder
   */
  abstract removeFolder(name: string) : Promise<any>;

  /**
   * Removes a file from the folder with the specified name
   * @method removeFile
   * @param name The name of the file
   */
  abstract removeFile(name: string) : Promise<any>;

  /**
   * Returns the folder with the specified name
   * @method getFolder
   * @param name The name of the folder
   */
  abstract getFolder(name: string) : Promise<FilesystemFolder>;

  /**
   * Returns the file with the specified name
   * @method getFile
   * @param name The name of the file
   */
  abstract getFile(name: string) : Promise<FilesystemFile>;

  /**
   * Returns the folder from the specified path
   * @method getFolderFromPath
   */
  abstract getFolderFromPath(path: string) : Promise<FilesystemFolder>;

  /**
   * Returns the file from the specified path
   * @method getFileFromPath
   */
  abstract getFileFromPath(path: string) : Promise<FilesystemFile>;

  /**
   * Returns the parent folder
   * @method getParent
   */
  abstract get parent() : FilesystemFolder | FilesystemDisk | null;

  /**
   * Returns the path of the folder
   * @method getPath
   */
  abstract get path() : string;

}

/**
 * @class LocalFilesystemFolder
 * @description The class that represents a folder in the filesystem of the WebOS.
 * @extends FilesystemFolder
 */
class LocalFilesystemFolder extends FilesystemFolder {
  #parent   : FilesystemFolder | FilesystemDisk | null = null; // The parent folder or disk

  #readonly : boolean = false; // Whether the folder is readonly
  #hidden   : boolean = false; // Whether the folder is hidden
  #system   : boolean = false; // Whether the folder is a system folder
  #locked   : boolean = false; // Whether the folder is locked
  #password : string  = "";    // The password to unlock the folder

  #name     : string                                = ""; // The name of the folder
  #items    : FilesystemFolder[] | FilesystemFile[] = []; // The items in the folder

  /**
   * @constructor
   * @param name The name of the folder
   * @param properties The properties of the folder
   * @param items The items in the folder (Folders and files)
   * @description Creates a new instance of the FilesystemFolder class
   */
  constructor(name: string, properties: FilesystemFolderProperties, items: FilesystemFolder[] | FilesystemFile[] = [], parent: FilesystemFolder | FilesystemDisk | null = null) {
    // Call the super constructor
    super(name, properties, items);
    // Set the name of the folder
    this.#name = name;
    // Set the items in the folder
    this.#items = items;
    // Set the properties of the folder
    this.#readonly  = properties.readonly;  // Whether the folder is readonly
    this.#hidden    = properties.hidden;    // Whether the folder is hidden
    this.#system    = properties.system;    // Whether the folder is a system folder
    this.#locked    = properties.locked;    // Whether the folder is locked
    this.#password  = properties.password;  // The password to unlock the folder
    // Set the parent folder
    this.#parent = parent;
  }

  /**
   * Ensures that the folder is not locked
   * @method ensureFolderIsNotLocked
   */
  protected ensureFolderIsNotLocked() : void {
    if (this.#locked) {
      throw new FilesystemFolderError("The folder is locked!");
    }
  }

  /**
   * Returns the name of the folder
   * @method getName
   */
  async getName() : Promise<string> {
    return this.#name;
  }

  /**
   * Sets the name of the folder
   * @method setName
   */
  async setName(name: string) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the name is valid
    this.ensureFolderName(name);
    // Set the name of the folder
    this.#name = name;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { name: name } }));
    // Resolve the promise
    return { name, success: true };
  }

  /**
   * Returns the readonly property
   * @method getReadonly
   */
  async getReadonly() : Promise<boolean> {
    return this.#readonly;
  }

  /**
   * Sets the readonly property
   * @method setReadonly
   */
  async setReadonly(readonly: boolean) : Promise<any> {
    if (this.#locked) {
      throw new FilesystemFolderError("The readonly property cannot be changed because the folder is locked!");
    }
    if (typeof readonly !== "boolean") {
      throw new FilesystemFolderError("The readonly property must be a boolean!");
    }
    // Set the readonly property
    this.#readonly = readonly;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { readonly: readonly } }));
    // Resolve the promise
    return { readonly, success: true };
  }

  /**
   * Returns the hidden property
   * @method getHidden
   */
  async getHidden() : Promise<boolean> {
    return this.#hidden;
  }

  /**
   * Sets the hidden property
   * @method setHidden
   */
  async setHidden(hidden: boolean) : Promise<any> {
    if (this.#locked) {
      throw new FilesystemFolderError("The hidden property cannot be changed because the folder is locked!");
    }
    if (typeof hidden !== "boolean") {
      throw new FilesystemFolderError("The hidden property must be a boolean!");
    }
    // Set the hidden property
    this.#hidden = hidden;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { hidden: hidden } }));
    // Resolve the promise
    return { hidden, success: true };
  }

  /**
   * Returns the system property
   * @method getSystem
   */
  async getSystem() : Promise<boolean> {
    return this.#system;
  }

  /**
   * Sets the system property
   * @method setSystem
   */
  async setSystem(system: boolean) : Promise<any> {
    if (this.#locked) {
      throw new FilesystemFolderError("The system property cannot be changed because the folder is locked!");
    }
    if (typeof system !== "boolean") {
      throw new FilesystemFolderError("The system property must be a boolean!");
    }
    // Set the system property
    this.#system = system;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { system: system } }));
    // Resolve the promise
    return { system, success: true };
  }

  /**
   * Returns the locked property
   * @method getLocked
   */
  async getLocked() : Promise<boolean> {
    return this.#locked;
  }

  /**
   * Returns the folders in the folder
   * @method getFolders
   */
  async getFolders() : Promise<FilesystemFolder[]> {
    return this.#items.filter(item => item instanceof FilesystemFolder) as FilesystemFolder[];
  }

  /**
   * Returns the files in the folder
   * @method getFiles
   */
  async getFiles() : Promise<FilesystemFile[]> {
    return this.#items.filter(item => item instanceof FilesystemFile) as FilesystemFile[];
  }

  /**
   * Returns the size of the folder (including the size of the files in the folder and the size of the folders in the folder) in bytes
   * @method getSize
   */
  async getSize() : Promise<number> {
    let size = 0;
    this.#items.forEach(async (item) => {
      if (item instanceof FilesystemFolder) {
        size += await item.getSize();
      } else if (item instanceof FilesystemFile) {
        size += await item.getSize();
      }
    });
    return size;
  }

  /**
   * Locks the folder
   * @method lock
   * @param password The password to lock the folder
   */
  async lock(password: string) : Promise<any> {
    if (this.#locked) {
      throw new FilesystemFolderError("The folder is already locked!");
    }
    if (typeof password !== "string") {
      throw new FilesystemFolderError("The password must be a string!");
    }
    // Set the password
    this.#password = password;
    // Lock the folder
    this.#locked = true;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { locked: true } }));
    // Resolve the promise
    return { success: true };
  }

  /**
   * Unlocks the folder
   * @method unlock
   * @param password The password to unlock the folder
   */
  async unlock(password: string) : Promise<any> {
    if (typeof password !== "string") {
      throw new FilesystemFolderError("The password must be a string");
    }
    if (password !== this.#password) {
      throw new FilesystemFolderError("The password is incorrect");
    }
    // Unlock the folder
    this.#locked = false;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { locked: false } }));
    // Resolve the promise
    return { success: true };
  }

  /**
   * Returns whether the folder has a folder with the specified name
   * @method hasFolder
   * @param name The name of the folder
   */
  async hasFolder(name: string) : Promise<boolean> {
    // Filter the items to get all the folders in the folder
    const folders = this.#items.filter(item => item instanceof FilesystemFolder) as FilesystemFolder[];
    // First resolve the promises
    const folderNames = await Promise.all(folders.map(async (folder) => await folder.getName()));
    // Return whether the folder exists
    return folderNames.some(folderName => folderName.localeCompare(name) === 0);
  }

  /**
   * Returns whether the folder has a folder with the specified name in the path
   * @method hasFolderInPath
   */
  async hasFolderInPath(path: string, name: string) : Promise<boolean> {
    // Check if the path is valid
    if (typeof path !== "string") {
      throw new FilesystemFolderError("The path must be a string!");
    }
    // Check if the path is empty
    if (path.trim().length === 0) {
      throw new FilesystemFolderError("The path cannot be empty!");
    }
    // Check if the path is absolute
    if (path.startsWith("\\")) {
      throw new FilesystemFolderError("The path cannot be absolute!");
    }
    // Check if the path is relative
    if (path.startsWith("..")) {
      throw new FilesystemFolderError("The path cannot be relative!");
    }
    // Split the path
    const parts = path.split("\\");

    // Get the folder
    let folder: FilesystemFolder = this;
    for (let i = 0; i < parts.length - 1; i++) {
      // Check if the folder exists
      if (!await folder.hasFolder(parts[i])) {
        return false;
      }
      // Get the folder
      folder = await folder.getFolder(parts[i]);
    }
    // Return whether the folder exists
    return await folder.hasFolder(name);
  }

  /**
   * Returns whether the folder has a file with the specified name
   * @method hasFile
   * @param name The name of the file
   */
  async hasFile(name: string) : Promise<boolean> {
    // Filter the items to get all the files in the folder
    const files = this.#items.filter(item => item instanceof FilesystemFile) as FilesystemFile[];
    // First resolve the promises
    const fileNames = await Promise.all(files.map(async (file) => await file.getName()));
    // Return whether the file exists
    return fileNames.some(fileName => fileName.localeCompare(name) === 0);
  }

  /**
   * Returns whether the folder has a file with the specified name in the path
   * @method hasFileInPath
   */
  async hasFileInPath(path: string, name: string) : Promise<boolean> {
    // Check if the path is valid
    if (typeof path !== "string") {
      throw new FilesystemFolderError("The path must be a string!");
    }
    // Check if the path is empty
    if (path.trim().length === 0) {
      throw new FilesystemFolderError("The path cannot be empty!");
    }
    // Check if the path is absolute
    if (path.startsWith("\\")) {
      throw new FilesystemFolderError("The path cannot be absolute!");
    }
    // Check if the path is relative
    if (path.startsWith("..")) {
      throw new FilesystemFolderError("The path cannot be relative!");
    }
    // Split the path
    const parts = path.split("\\");

    // Get the folder
    let folder: FilesystemFolder = this;
    for (let i = 0; i < parts.length - 1; i++) {
      // Check if the folder exists
      if (!await folder.hasFolder(parts[i])) {
        return false;
      }
      // Get the folder
      folder = await folder.getFolder(parts[i]);
    }
    // Return whether the folder exists
    return await folder.hasFile(name);
  }

  /**
   * Adds an item to the folder
   * @method addItem
   */
  async addItem(item: FilesystemFolder | FilesystemFile) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the item is a folder or a file
    if (!(item instanceof FilesystemFolder) && !(item instanceof FilesystemFile)) {
      throw new FilesystemFolderError("The item must be a folder or a file!");
    }
    // Add the change event listener to the item
    if (item instanceof FilesystemFolder) {
      // @ts-expect-error
      item.addEventListener("change", this.handleFolderChange.bind(this));
    } else if (item instanceof FilesystemFile) {
      // @ts-expect-error
      item.addEventListener("change", this.handleFileChange.bind(this));
    }
    // Add the item to the items
    // @ts-expect-error
    this.#items.push(item);
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { item: item } }));
    // Resolve the promise
    return { item, success: true };
  }

  /**
   * Adds items to the folder
   * @method addItems
   */
  async addItems(items: (FilesystemFolder | FilesystemFile)[]) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the items are folders or files
    if (!items.every(item => item instanceof FilesystemFolder || item instanceof FilesystemFile)) {
      throw new FilesystemFolderError("The items must be folders or files!");
    }
    // Add the change event listener to the items
    items.forEach(item => {
      if (item instanceof FilesystemFolder) {
        // @ts-expect-error
        item.addEventListener("change", this.handleFolderChange.bind(this));
      } else if (item instanceof FilesystemFile) {
        // @ts-expect-error
        item.addEventListener("change", this.handleFileChange.bind(this));
      }
    });
    // Add the items to the items
    // @ts-expect-error
    this.#items.push(...items);
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { items: items } }));
    // Resolve the promise
    return { items, success: true };
  }

  /**
   * Adds a folder to the folder with the specified name and properties
   * @method addFolder
   * @param name The name of the folder
   * @param properties The properties of the folder
   */
  async addFolder(name: string, properties: FilesystemFolderProperties) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the name is valid
    this.ensureFolderName(name);
    // Check if the folder is unique
    if (await this.hasFolder(name)) {
      throw new FilesystemFolderError(`A folder with the name "${name}" already exists!`);
    }
    // Create the folder
    const folder = new LocalFilesystemFolder(name, properties);
    // Add the change event listener to the folder
    // @ts-expect-error
    folder.addEventListener("change", this.handleFolderChange.bind(this));
    // Add the folder to the items
    // @ts-expect-error 
    this.#items.push(folder);
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { folders: await this.getFolders() } }));
    // Return the folder
    return folder;
  }

  /**
   * Adds a file to the folder with the specified name and properties
   * @method addFile
   * @param name The name of the file
   * @param properties The properties of the file
   */
  async addFile(name: string, content: any, properties: FilesystemFileProperties) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the name is valid
    this.ensureFolderName(name);
    // Check if the file is unique
    if (await this.hasFile(name)) {
      throw new FilesystemFolderError(`A file with the name "${name}" already exists!`);
    }
    // Create the file
    const file = new LocalFilesystemFile(name, content, properties);
    // Add the change event listener to the file
    // @ts-expect-error
    file.addEventListener("change", this.handleFileChange.bind(this));
    // Add the file to the items
    // @ts-expect-error
    this.#items.push(file);
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { files: await this.getFiles() } }));
    // Return the file
    return file;
  }

  /**
   * Removes a folder from the folder with the specified name
   * @method removeFolder
   * @param name The name of the folder
   */
  async removeFolder(name: string) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the folder exists
    if (!await this.hasFolder(name)) {
      throw new FilesystemFolderError(`A folder with the name "${name}" does not exist!`);
    }
    // Remove the folder
    this.#items = (this.#items.filter(async (item) => item instanceof FilesystemFolder && await item.getName() !== name) as FilesystemFolder[]);
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { folders: await this.getFolders() } }));
    // Resolve the promise
    return { name, success: true };    
  }

  /**
   * Removes a file from the folder with the specified name
   * @method removeFile
   * @param name The name of the file
   */
  async removeFile(name: string) : Promise<any> {
    // Check if the folder is locked
    this.ensureFolderIsNotLocked();
    // Check if the file exists
    if (!await this.hasFile(name)) {
      throw new FilesystemFolderError(`A file with the name "${name}" does not exist!`);
    }
    // Remove the file
    this.#items = (this.#items.filter(async (item) => item instanceof FilesystemFile && await item.getName() !== name) as FilesystemFile[]);
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { files: await this.getFiles() } }));
    // Resolve the promise
    return { name, success: true };
  }

  /**
   * Returns the folder with the specified name
   * @method getFolder
   * @param name The name of the folder
   */
  async getFolder(name: string) : Promise<FilesystemFolder> {
    // Check if the folder exists
    if (!await this.hasFolder(name)) {
      throw new FilesystemFolderError(`A folder with the name "${name}" does not exist!`);
    }
    // Return the folder
    return this.#items.filter(async (item) => item instanceof FilesystemFolder && await item.getName() === name)[0] as FilesystemFolder;
  }

  /**
   * Returns the file with the specified name
   * @method getFile
   * @param name The name of the file
   */
  async getFile(name: string) : Promise<FilesystemFile> {
    // Check if the file exists
    if (!await this.hasFile(name)) {
      throw new FilesystemFolderError(`A file with the name "${name}" does not exist!`);
    }
    // Return the file
    return this.#items.filter(async (item) => item instanceof FilesystemFile && await item.getName() === name)[0] as FilesystemFile;
  }

  /**
   * Returns the folder from the specified path
   * @method getFolderFromPath
   */
  async getFolderFromPath(path: string) : Promise<FilesystemFolder> {
    // Check if the path is valid
    if (typeof path !== "string") {
      throw new FilesystemFolderError("The path must be a string!");
    }
    // Check if the path is empty
    if (path.trim().length === 0) {
      throw new FilesystemFolderError("The path cannot be empty!");
    }
    // Check if the path is absolute
    if (path.startsWith("\\")) {
      throw new FilesystemFolderError("The path cannot be absolute!");
    }
    // Check if the path is relative
    if (path.startsWith("..")) {
      throw new FilesystemFolderError("The path cannot be relative!");
    }
    // Split the path
    const parts = path.split("\\");
    // Get the folder
    let folder: FilesystemFolder = this;
    for (let i = 0; i < parts.length; i++) {
      // Get the folder
      folder = await folder.getFolder(parts[i]);
    }
    // Return the folder
    return folder;
  }

  /**
   * Returns the file from the specified path
   * @method getFileFromPath
   */
  async getFileFromPath(path: string) : Promise<FilesystemFile> {
    // Check if the path is valid
    if (typeof path !== "string") {
      throw new FilesystemFolderError("The path must be a string!");
    }
    // Check if the path is empty
    if (path.trim().length === 0) {
      throw new FilesystemFolderError("The path cannot be empty!");
    }
    // Check if the path is absolute
    if (path.startsWith("\\")) {
      throw new FilesystemFolderError("The path cannot be absolute!");
    }
    // Check if the path is relative
    if (path.startsWith("..")) {
      throw new FilesystemFolderError("The path cannot be relative!");
    }
    // Split the path
    const parts = path.split("\\");
    // Get the folder
    let folder: FilesystemFolder = this;
    for (let i = 0; i < parts.length - 1; i++) {
      // Get the folder
      folder = await folder.getFolder(parts[i]);
    }
    // Return the file
    return await folder.getFile(parts[parts.length - 1]);
  }

  /**
   * Returns the parent folder
   * @method getParent
   */
  get parent() : FilesystemFolder | FilesystemDisk | null {
    return this.#parent;
  }

  /**
   * Returns the path of the folder
   * @method getPath
   */
  get path() : string {
    return this.#parent === null ? this.#name : `${this.#parent.path}${this.#name}\\`;
  }

}

// Export the FilesystemFolder class
export { FilesystemFolder, LocalFilesystemFolder };
// Export the FilesystemFolderProperties type
export type { FilesystemFolderProperties };