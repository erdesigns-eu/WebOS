/**
 * Changelog:
 * - v1.0.0 (2023-10-29): Initial release
 */

import { FilesystemDisk } from "./Disk";
import { FilesystemFolder } from "./Folder";

/**
 * @class FilesystemFileError
 * @description The error thrown by the FilesystemFile class
 * @extends Error
 * @property name The name of the error
 */
class FilesystemFileError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "FilesystemFileError";
  }
}

/**
 * FilesystemFileProperties
 * @property readonly Whether the file is readonly
 * @property hidden Whether the file is hidden
 * @property system Whether the file is a system file
 * @property locked Whether the file is locked
 * @property password The password to unlock the file
 */
type FilesystemFileProperties = {
  readonly : boolean,
  hidden   : boolean,
  system   : boolean,
  locked   : boolean,
  password : string
};

/**
 * The default properties of a file
 * @constant defaultFilesystemFileProperties
 * @type {FilesystemFileProperties}
 * @description The default properties of a file
 */
const defaultFilesystemFileProperties: FilesystemFileProperties = {
  readonly : false, // Whether the file is readonly
  hidden   : false, // Whether the file is hidden
  system   : false, // Whether the file is a system file
  locked   : false, // Whether the file is locked
  password : ""     // The password to unlock the file
};

// Invalid characters for a file name
const invalidCharacters: string[] = [
  "\\", "/", ":", "*", "?", "\"", "<", ">", "|"
];

// Maximum length of a file name
const maximumLength: number = 255;

/**
 * @class FilesystemFile
 * @description The base class that represents a file in the filesystem of the WebOS.
 * @extends EventTarget
 */
abstract class FilesystemFile extends EventTarget {

  /**
   * @constructor
   * @param name The name of the file
   * @param content The content of the file
   * @param properties The properties of the file
   * @description Creates a new instance of the FilesystemFile class 
   */
  constructor(name: string, content: any, properties: FilesystemFileProperties = defaultFilesystemFileProperties, parent: FilesystemFolder | FilesystemDisk | null = null) {
    // Call the super constructor
    super();
    // Ensure that the file name is valid
    this.ensureFileName(name);
    // Ensure that the properties are valid
    this.ensureFileProperties(properties);
    // Use the file content if provided
    if (content) {
      // Not implemented
    }
    // Use the parent folder if provided
    if (parent) {
      // Not implemented
    }
  }

  /**
   * Ensures that the name of the file is valid
   * @function ensureFileName
   * @param name The name of the file
   */
  protected ensureFileName(name: string): void {
    // Check if the name is a string
    if (typeof name !== "string") {
      throw new FilesystemFileError("The name must be a string");
    }
    // Check if the name contains invalid characters
    for (let i = 0; i < invalidCharacters.length; i++) {
      if (name.includes(invalidCharacters[i])) {
        throw new FilesystemFileError(`The name of the file cannot contain the character "${invalidCharacters[i]}"!`);
      }
    }
    // Check if the name is not empty
    if (name.trim().length === 0) {
      throw new FilesystemFileError("The name of the file cannot be empty!");
    }
    // Check if the name is too long
    if (name.length > maximumLength) {
      throw new FilesystemFileError(`The name of the file cannot be longer than ${maximumLength} characters!`);
    }
  }

  /**
   * Ensures that the properties of the file are valid
   * @function ensureFileProperties
   * @param properties The properties of the file
   */
  protected ensureFileProperties(properties: FilesystemFileProperties): void {
    // Check if the properties is an object
    if (typeof properties !== "object") {
      throw new FilesystemFileError("The properties must be an object!");
    }
    // Check if the readonly property is a boolean
    if (typeof properties.readonly !== "boolean") {
      throw new FilesystemFileError("The readonly property must be a boolean!");
    }
    // Check if the hidden property is a boolean
    if (typeof properties.hidden !== "boolean") {
      throw new FilesystemFileError("The hidden property must be a boolean!");
    }
    // Check if the system property is a boolean
    if (typeof properties.system !== "boolean") {
      throw new FilesystemFileError("The system property must be a boolean!");
    }
    // Check if the locked property is a boolean
    if (typeof properties.locked !== "boolean") {
      throw new FilesystemFileError("The locked property must be a boolean!");
    }
    // Check if the password property is a string
    if (typeof properties.password !== "string") {
      throw new FilesystemFileError("The password property must be a string!");
    }
  }

  /**
   * Ensures that the file is not locked
   * @function ensureFileIsNotLocked
   */
  abstract ensureFileIsNotLocked(): void;
  
  /**
   * Returns the name of the file
   * @method getName
   */
  abstract getName() : Promise<string>;

  /**
   * Sets the name of the file
   * @method setName
   */
  abstract setName(name: string) : Promise<any>;

  /**
   * Returns the content of the file
   * @method getContent
   */
  abstract getContent() : Promise<any>;

  /**
   * Sets the content of the file
   * @method setContent
   */
  abstract setContent(content: string) : Promise<any>;

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
   * Returns the size of the file in bytes
   * @method getSize
   */
  abstract getSize() : Promise<number>;

  /**
   * Locks the file
   * @method lock
   */
  abstract lock(password: string) : Promise<any>;

  /**
   * Unlocks the file
   * @method unlock
   */
  abstract unlock(password: string) : Promise<any>;

  /**
   * Clears the content of the file
   * @method clear
   */
  abstract clear() : Promise<any>;

  /**
   * Appends content to the file
   * @method append
   */
  abstract append(content: string) : Promise<any>;

  /**
   * Prepends content to the file
   * @method prepend
   */
  abstract prepend(content: string) : Promise<any>;

  /**
   * Writes content to the file
   * @method write
   */
  abstract write(content: string) : Promise<any>;

  /**
   * Returns the parent folder of the file
   * @getter parent
   */
  abstract get parent(): FilesystemFolder | FilesystemDisk | null;

  /**
   * Returns the path of the file
   * @getter path
   */
  abstract get path(): string;

}

/**
 * @class LocalFilesystemFile
 * @description The class that represents a local file in the filesystem of the WebOS.
 * @extends FilesystemFile
 */
class LocalFilesystemFile extends FilesystemFile {
  #parent   : FilesystemFolder | FilesystemDisk | null = null; // The parent folder of the file
  
  #readonly : boolean = false; // Whether the file is readonly
  #hidden   : boolean = false; // Whether the file is hidden
  #system   : boolean = false; // Whether the file is a system file
  #locked   : boolean = false; // Whether the file is locked
  #password : string  = "";    // The password to unlock the file

  #name     : string  = "";    // The name of the file
  #content  : string  = "";    // The content of the file

  /**
   * @constructor
   * @param name The name of the file
   * @param content The content of the file
   * @param properties The properties of the file
   * @description Creates a new instance of the LocalFilesystemFile class
   */
  constructor(name: string, content: any, properties: FilesystemFileProperties = defaultFilesystemFileProperties, parent: FilesystemFolder | FilesystemDisk | null = null) {
    // Call the super constructor
    super(name, content, properties);
    // Use the file name if provided
    if (name) {
      this.#name = name;
    }
    // Use the file properties if provided
    if (properties) {
      this.#readonly  = properties.readonly;  // Whether the file is readonly
      this.#hidden    = properties.hidden;    // Whether the file is hidden
      this.#system    = properties.system;    // Whether the file is a system file
      this.#locked    = properties.locked;    // Whether the file is locked
      this.#password  = properties.password;  // The password to unlock the file
    }
    // Use the file content if provided
    if (content) {
      this.#content = content;
    }
    // Use the parent folder if provided
    if (parent) {
      this.#parent = parent;
    }
  }

  /**
   * Ensures that the file is not locked
   * @function ensureFileIsNotLocked
   */
  ensureFileIsNotLocked(): void {
    if (this.#locked) {
      throw new FilesystemFileError("The file is locked!");
    }
  }

  /**
   * Returns the name of the file
   * @method getName
   */
  getName() : Promise<string> {
    return new Promise((resolve) => {
      resolve(this.#name);
    });
  }

  /**
   * Sets the name of the file
   * @method setName
   */
  setName(name: string) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file name is valid
      this.ensureFileName(name);
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Set the name of the file
      this.#name = name;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { name: name } }));
      // Resolve the promise
      resolve({ name, success: true });
    });
  }

  /**
   * Returns the content of the file
   * @method getContent
   */
  getContent() : Promise<any> {
    return new Promise((resolve) => {
      resolve(this.#content);
    });
  }

  /**
   * Sets the content of the file
   * @method setContent
   */
  setContent(content: string) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the content is a string
      if (typeof content !== "string") {
        throw new FilesystemFileError("The content must be a string!");
      }
      // Set the content of the file
      this.#content = content;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { content: content } }));
      // Resolve the promise
      resolve({ content, success: true });
    });
  }

  /**
   * Returns the readonly property
   * @method getReadonly
   */
  getReadonly() : Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.#readonly);
    });
  }

  /**
   * Sets the readonly property
   * @method setReadonly
   */
  setReadonly(readonly: boolean) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the readonly property is a boolean
      if (typeof readonly !== "boolean") {
        throw new FilesystemFileError("The readonly property must be a boolean!");
      }
      // Set the readonly property
      this.#readonly = readonly;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { readonly: readonly } }));
      // Resolve the promise
      resolve({ readonly, success: true });
    });
  }

  /**
   * Returns the hidden property
   * @method getHidden
   */
  getHidden() : Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.#hidden);
    });
  }

  /**
   * Sets the hidden property
   * @method setHidden
   */
  setHidden(hidden: boolean) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the hidden property is a boolean
      if (typeof hidden !== "boolean") {
        throw new FilesystemFileError("The hidden property must be a boolean!");
      }
      // Set the hidden property
      this.#hidden = hidden;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { hidden: hidden } }));
      // Resolve the promise
      resolve({ hidden, success: true });
    });
  }

  /**
   * Returns the system property
   * @method getSystem
   */
  getSystem() : Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.#system);
    });
  }

  /**
   * Sets the system property
   * @method setSystem
   */
  setSystem(system: boolean) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the system property is a boolean
      if (typeof system !== "boolean") {
        throw new FilesystemFileError("The system property must be a boolean!");
      }
      // Set the system property
      this.#system = system;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { system: system } }));
      // Resolve the promise
      resolve({ system, success: true });
    });
  }

  /**
   * Returns the locked property
   * @method getLocked
   */
  getLocked() : Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.#locked);
    });
  }

  /**
   * Returns the size of the file in bytes
   * @method getSize
   */
  getSize() : Promise<number> {
    return new Promise((resolve) => {
      // Return the size of the file in bytes (1 character = 2 bytes)
      resolve(this.#content.length * 2);
    });
  }

  /**
   * Locks the file
   * @method lock
   */
  lock(password: string) : Promise<any> {
    return new Promise((resolve) => {
      // Check if the file is locked
      if (this.#locked) {
        throw new FilesystemFileError("The file is already locked!");
      }
      // Check if the password is a string
      if (typeof password !== "string") {
        throw new FilesystemFileError("The password must be a string!");
      }
      // Set the password
      this.#password = password;
      // Lock the file
      this.#locked = true;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { locked: true } }));
      // Resolve the promise
      resolve({ locked: true, success: true });
    });
  }

  /**
   * Unlocks the file
   * @method unlock
   */
  unlock(password: string) : Promise<any> {
    return new Promise((resolve) => {
      // Check if the file is locked
      if (!this.#locked) {
        throw new FilesystemFileError("The file is not locked!");
      }
      // Check if the password is a string
      if (typeof password !== "string") {
        throw new FilesystemFileError("The password must be a string");
      }
      // Check if the password is correct
      if (password !== this.#password) {
        throw new FilesystemFileError("The password is incorrect");
      }
      // Unlock the file
      this.#locked = false;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { locked: false } }));
      // Resolve the promise
      resolve({ locked: false, success: true });
    });
  }

  /**
   * Clears the content of the file
   * @method clear
   */
  clear() : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Clear the content of the file
      this.#content = "";
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { content: "" } }));
      // Resolve the promise
      resolve({ content: "", success: true });
    });
  }

  /**
   * Appends content to the file
   * @method append
   */
  append(content: string) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the content is a string
      if (typeof content !== "string") {
        throw new FilesystemFileError("The content must be a string!");
      }
      // Append the content to the file
      this.#content += content;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { content: this.#content } }));
      // Resolve the promise
      resolve({ content: this.#content, success: true });
    });
  }

  /**
   * Prepends content to the file
   * @method prepend
   */
  prepend(content: string) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the content is a string
      if (typeof content !== "string") {
        throw new FilesystemFileError("The content must be a string!");
      }
      // Prepend the content to the file
      this.#content = content + this.#content;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { content: this.#content } }));
      // Resolve the promise
      resolve({ content: this.#content, success: true });
    });
  }

  /**
   * Writes content to the file
   * @method write
   */
  write(content: string) : Promise<any> {
    return new Promise((resolve) => {
      // Ensure that the file is not locked
      this.ensureFileIsNotLocked();
      // Check if the content is a string
      if (typeof content !== "string") {
        throw new FilesystemFileError("The content must be a string!");
      }
      // Write the content to the file
      this.#content = content;
      // Dispatch the change event
      this.dispatchEvent(new CustomEvent("change", { detail: { content: this.#content } }));
      // Resolve the promise
      resolve({ content: this.#content, success: true });
    });
  }

  /**
   * Returns the parent folder of the file
   * @getter parent
   */
  get parent(): FilesystemFolder | FilesystemDisk | null {
    return this.#parent;
  }

  /**
   * Returns the path of the file
   * @getter path
   */
  get path(): string {
    // Check if the file has a parent folder
    if (this.#parent) {
      // Return the path of the file
      return `${this.#parent.path}${this.#name}`;
    }
    // Return the name of the file
    return this.#name;
  }

}

// Export the FilesystemFile class
export { FilesystemFile, LocalFilesystemFile };
// Export the FilesystemFileProperties type
export type { FilesystemFileProperties };