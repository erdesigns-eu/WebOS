/**
 * Changelog:
 * - v1.0.0 (2023-10-29): Initial release
 */

import { FilesystemFolder, LocalFilesystemFolder, defaultFilesystemFolderProperties } from "./Folder";
import type { FilesystemFolderProperties } from "./Folder";
import { FilesystemFile, LocalFilesystemFile } from "./File";
import type { FilesystemFileProperties } from "./File";

/**
 * @class FilesystemDiskError
 * @description The error thrown by the FilesystemDisk class
 * @extends Error
 * @property name The name of the error
 */
class FilesystemDiskError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "FilesystemDiskError";
  }
}

// Invalid characters for a disk label
const invalidLabelCharacters: string[] = [
  "\\", "/", ":", "*", "?", "\"", "<", ">", "|"
];

// Invalid characters for a disk path
const invalidPathCharacters: string[] = [
  "*", "?", "\"", "<", ">", "|"
];

// Maximum length of a disk label
const maximumLength: number = 255;

/**
 * @class FilesystemDisk
 * @description The class that represents a disk in the filesystem of the WebOS.
 * @extends EventTarget
 */
abstract class FilesystemDisk extends EventTarget {
  protected diskLabel : string = ""; // The label of the disk
  protected diskPath  : string = ""; // The path of the disk
  
  constructor(label: string, path: string, items: Array<FilesystemFolder | FilesystemFile> = []) {
    // Call the super constructor
    super();
    // Ensure the disk label
    this.ensureDiskLabel(label);
    // Set the label
    this.diskLabel = label;
    // Ensure the disk path
    this.ensureDiskPath(path);
    // Set the path
    if (!path.endsWith(":\\")) {
      path = `${path}\\`;
    }
    this.diskPath = path;
    // Use the items if provided
    if (items.length > 0) {
      // Not implemented
    }
  }

  /**
   * Ensure the disk label is valid
   * @method ensureDiskLabel
   */
  abstract ensureDiskLabel(label: string): void;

  /**
   * Ensure the disk path is valid
   * @method ensureDiskPath
   */
  abstract ensureDiskPath(path: string): void;

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
   * Returns the label of the disk
   * @getter label
   */
  abstract get label(): string;

  /**
   * Set the label of the disk
   * @setter label
   */
  abstract set label(label: string);

  /**
   * Returns the folders on the disk
   * @getter folders
   */
  abstract getFolders() : Promise<FilesystemFolder[]>;

  /**
   * Returns the files on the disk
   * @getter files
   */
  abstract getFiles() : Promise<FilesystemFile[]>;

  /**
   * Returns the size of the disk
   * @getter size
   */
  abstract getSize() : Promise<number>;

  /**
   * Returns whether the disk has a folder with the specified name
   * @method hasFolder
   * @param name The name of the folder
   */
  abstract hasFolder(name: string) : Promise<boolean>;

  /**
   * Returns whether the disk has a folder with the specified name in the specified path
   * @method hasFolderInPath
   * @param path The path to the folder
   * @param name The name of the folder
   */
  abstract hasFolderInPath(path: string, name: string) : Promise<boolean>;

  /**
   * Returns whether the disk has a file with the specified name
   * @method hasFile
   * @param name The name of the file
   */
  abstract hasFile(name: string) : Promise<boolean>;

  /**
   * Returns whether the disk has a file with the specified name in the specified path
   * @method hasFileInPath
   * @param path The path to the file
   * @param name The name of the file
   */
  abstract hasFileInPath(path: string, name: string) : Promise<boolean>;

  /**
   * Returns the folder with the specified name
   * @method getFolder
   * @param name The name of the folder
   */
  abstract getFolder(name: string) : Promise<FilesystemFolder>;

  /**
   * Returns the folder with the specified name in the specified path
   * @method getFolderInPath
   */
  abstract getFolderInPath(path: string, name: string) : Promise<FilesystemFolder>;

  /**
   * Returns the file with the specified name
   * @method getFile
   * @param name The name of the file
   */
  abstract getFile(name: string) : Promise<FilesystemFile>;

  /**
   * Returns the file with the specified name in the specified path
   * @method getFileInPath
   */
  abstract getFileInPath(path: string, name: string) : Promise<FilesystemFile>;

  /**
   * Returns the items in the specified path
   * @method getItemsInPath
   */
  abstract getItemsInPath(path: string) : Promise<Array<FilesystemFolder | FilesystemFile>>;

  /**
   * Creates a folder with the specified name
   * @method createFolder
   * @param name The name of the folder
   */
  abstract createFolder(name: string, properties: FilesystemFolderProperties) : Promise<FilesystemFolder>;

  /**
   * Creates a file with the specified name
   * @method createFile
   * @param name The name of the file
   */
  abstract createFile(name: string, content: any, properties: FilesystemFileProperties) : Promise<FilesystemFile>;

  /**
   * Deletes the folder with the specified name
   * @method deleteFolder
   * @param name The name of the folder
   */
  abstract deleteFolder(name: string) : Promise<void>;

  /**
   * Deletes the file with the specified name
   * @method deleteFile
   * @param name The name of the file
   */
  abstract deleteFile(name: string) : Promise<void>;

  /**
   * Adds the specified items to the disk
   * @method addItems
   * @param items The items to add
   */
  abstract addItems(items: Array<FilesystemFolder | FilesystemFile>): void;

  /**
   * Returns the statistics of the disk
   * @method statistics
   */
  abstract statistics(): Promise<any>;

  /**
   * Returns the path of the disk
   * @getter path
   */
  abstract get path(): string;
  
  /**
   * Set the path of the disk
   * @setter path
   */
  abstract set path(path: string);
}

/**
 * @class LocalFilesystemDisk
 * @description The class that represents a disk in the filesystem of the WebOS.
 * @extends FilesystemDisk
 */
class LocalFilesystemDisk extends FilesystemDisk {
  private items: Array<FilesystemFolder | FilesystemFile> = []; // The items on the disk

  constructor(label: string, path: string, items: Array<FilesystemFolder | FilesystemFile> = []) {
    // Call the super constructor
    super(label, path, items);
    // Set the items
    this.items = items;
    // Add the event listeners
    this.items.forEach((item) => {
      if (item instanceof FilesystemFolder) {
        // @ts-expect-error
        item.addEventListener("change", this.handleFolderChange.bind(this));
      } else if (item instanceof FilesystemFile) {
        // @ts-expect-error
        item.addEventListener("change", this.handleFileChange.bind(this));
      }
    });
  }

  /**
   * Ensure the disk label is valid
   * @method ensureDiskLabel
   */
  ensureDiskLabel(label: string): void {
    // Check if the label is a string
    if (typeof label !== "string") {
      throw new FilesystemDiskError("The label must be a string");
    }
    // Check if the label is empty
    if (label.trim().length === 0) {
      throw new FilesystemDiskError("The label must not be empty");
    }
    // Check if the label is too long
    if (label.length > maximumLength) {
      throw new FilesystemDiskError(`The label must be less than ${maximumLength} characters`);
    }
    // Check if the name contains invalid characters
    for (let i = 0; i < invalidLabelCharacters.length; i++) {
      if (label.includes(invalidLabelCharacters[i])) {
        throw new FilesystemDiskError(`The label of the disk cannot contain the character "${invalidLabelCharacters[i]}"!`);
      }
    }
  }

  /**
   * Ensure the disk path is valid
   * @method ensureDiskPath
   */
  ensureDiskPath(path: string): void {
    // Check if the path is a string
    if (typeof path !== "string") {
      throw new FilesystemDiskError("The path must be a string");
    }
    // Check if the path is empty
    if (path.trim().length === 0) {
      throw new FilesystemDiskError("The path must not be empty");
    }
    // Check if the path is too long
    if (path.length > maximumLength) {
      throw new FilesystemDiskError(`The path must be less than ${maximumLength} characters`);
    }
    // Check if the path contains invalid characters
    for (let i = 0; i < invalidPathCharacters.length; i++) {
      if (path.includes(invalidPathCharacters[i])) {
        throw new FilesystemDiskError(`The path of the disk cannot contain the character "${invalidPathCharacters[i]}"!`);
      }
    }
  }

  /**
   * Handles the change event of a folder
   * @method handleFolderChange
   */
  handleFolderChange(event: CustomEvent) : void {
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: event.detail }));
  }

  /**
   * Handles the change event of a file
   * @method handleFileChange
   */
  handleFileChange(event: CustomEvent) : void {
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: event.detail }));
  }

  /**
   * Returns the label of the disk
   * @getter label
   */
  get label(): string {
    return this.diskLabel;
  }

  /**
   * Set the label of the disk
   * @setter label
   */
  set label(label: string) {
    // Ensure the disk label
    this.ensureDiskLabel(label);
    // Set the label
    this.diskLabel = label;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { label: label } }));
  }

  /**
   * Returns the folders on the disk
   * @getter folders
   */
  async getFolders() : Promise<FilesystemFolder[]> {
    return this.items.filter((item) => item instanceof FilesystemFolder) as FilesystemFolder[];
  }

  /**
   * Returns the files on the disk
   * @getter files
   */
  async getFiles() : Promise<FilesystemFile[]> {
    return this.items.filter((item) => item instanceof FilesystemFile) as FilesystemFile[];
  }

  /**
   * Returns the size of the disk
   * @getter size
   */
  async getSize() : Promise<number> {
    let size: number = 0;
    for (let i = 0; i < this.items.length; i++) {
      size += await this.items[i].getSize();
    }
    return size;
  }

  /**
   * Returns whether the disk has a folder with the specified name
   * @method hasFolder
   * @param name The name of the folder
   */
  async hasFolder(name: string) : Promise<boolean> {
    // Filter the items to get all the folders in the folder
    const folders = this.items.filter(item => item instanceof FilesystemFolder);
    // First resolve the promises
    const folderNames = await Promise.all(folders.map(async (folder) => await (folder.getName())));
    // Return whether the folder exists
    return folderNames.filter(n => n.localeCompare(name) === 0).length > 0;
  }

  /**
   * Returns whether the disk has a folder with the specified name in the specified path
   * @method hasFolderInPath
   * @param path The path to the folder
   * @param name The name of the folder
   */
  async hasFolderInPath(path: string, name: string) : Promise<boolean> {
    // Filter the items to get all the folders in the folder
    const folders = this.items.filter(item => item instanceof FilesystemFolder);
    // First resolve the promises
    const folderNames = await Promise.all(folders.map(async (folder) => {
      if (folder instanceof FilesystemFolder) {
        const folderPath = folder.path;
        return folderPath.localeCompare(path) === 0 ? await (folder.getName()) : "";
      }
      return "";
    }));
    // Return whether the folder exists
    return folderNames.filter(n => n.localeCompare(name) === 0).length > 0;
  }

  /**
   * Returns whether the disk has a file with the specified name
   * @method hasFile
   * @param name The name of the file
   */
  async hasFile(name: string) : Promise<boolean> {
    // Filter the items to get all the files in the folder
    const files = this.items.filter(item => item instanceof FilesystemFile);
    // First resolve the promises
    const fileNames = await Promise.all(files.map(async (file) => await (file.getName())));
    // Return whether the file exists
    return fileNames.filter(n => n.localeCompare(name) === 0).length > 0;
  }

  /**
   * Returns whether the disk has a file with the specified name in the specified path
   * @method hasFileInPath
   * @param path The path to the file
   * @param name The name of the file
   */
  async hasFileInPath(path: string, name: string) : Promise<boolean> {
    // Filter the items to get all the files in the folder
    const files = this.items.filter(item => item instanceof FilesystemFile);
    // First resolve the promises
    const fileNames = await Promise.all(files.map(async (file) => {
      if (file instanceof FilesystemFile) {
        const filePath = file.path;
        return filePath.localeCompare(path) === 0 ? await (file.getName()) : "";
      }
      return "";
    }));
    // Return whether the file exists
    return fileNames.filter(n => n.localeCompare(name) === 0).length > 0;
  }

  /**
   * Returns the folder with the specified name
   * @method getFolder
   * @param name The name of the folder
   */
  async getFolder(name: string) : Promise<FilesystemFolder> {
    // Filter the items to get all the folders in the folder
    const folders = this.items.filter(item => item instanceof FilesystemFolder);
    // Return the folder
    const matchingFolders = folders.filter(async (folder) => await (folder.getName()).then(n => n.localeCompare(name)) === 0);
    if (matchingFolders.length > 0) {
      const folder = matchingFolders[0];
      if (folder instanceof FilesystemFolder) {
        return folder;
      } else {
        throw new FilesystemDiskError(`Item ${name} is not a folder`);
      }
    } else {
      throw new FilesystemDiskError(`Folder ${name} not found`);
    }
  }

  /**
   * Returns the folder with the specified name in the specified path
   * @method getFolderInPath
   */
  async getFolderInPath(path: string, name: string) : Promise<FilesystemFolder> {
    // Filter the items to get all the folders in the folder
    const folders = this.items.filter(item => item instanceof FilesystemFolder);
    // Return the folder
    const matchingFolders = folders.filter(async (folder) => {
      if (folder instanceof FilesystemFolder) {
        const folderPath = folder.path;
        return folderPath.localeCompare(path) === 0 && await (folder.getName()).then(n => n.localeCompare(name)) === 0;
      }
      return false;
    });
    if (matchingFolders.length > 0) {
      const folder = matchingFolders[0];
      if (folder instanceof FilesystemFolder) {
        return folder;
      } else {
        throw new FilesystemDiskError(`Item ${name} is not a folder`);
      }
    } else {
      throw new FilesystemDiskError(`Folder ${name} not found`);
    }
  }

  /**
   * Returns the file with the specified name
   * @method getFile
   * @param name The name of the file
   */
  async getFile(name: string) : Promise<FilesystemFile> {
    // Filter the items to get all the files in the folder
    const files = this.items.filter(item => item instanceof FilesystemFile);
    // Return the file
    const matchingFiles = files.filter(async (file) => await (file.getName()).then(n => n.localeCompare(name)) === 0);
    if (matchingFiles.length > 0) {
      const file = matchingFiles[0];
      if (file instanceof FilesystemFile) {
        return file;
      } else {
        throw new FilesystemDiskError(`Item ${name} is not a file`);
      }
    } else {
      throw new FilesystemDiskError(`File ${name} not found`);
    }
  }

  /**
   * Returns the file with the specified name in the specified path
   * @method getFileInPath
   */
  async getFileInPath(path: string, name: string) : Promise<FilesystemFile> {
    // Filter the items to get all the files in the folder
    const files = this.items.filter(item => item instanceof FilesystemFile);
    // Return the file
    const matchingFiles = files.filter(async (file) => {
      if (file instanceof FilesystemFile) {
        const filePath = file.path;
        return filePath.localeCompare(path) === 0 && await (file.getName()).then(n => n.localeCompare(name)) === 0;
      }
      return false;
    });
    if (matchingFiles.length > 0) {
      const file = matchingFiles[0];
      if (file instanceof FilesystemFile) {
        return file;
      } else {
        throw new FilesystemDiskError(`Item ${name} is not a file`);
      }
    } else {
      throw new FilesystemDiskError(`File ${name} not found`);
    }
  }

  /**
   * Creates a folder with the specified name
   * @method createFolder
   * @param name The name of the folder
   */
  async createFolder(name: string, properties: FilesystemFolderProperties = defaultFilesystemFolderProperties) : Promise<FilesystemFolder> {
    // Check if the folder already exists
    if (await this.hasFolder(name)) {
      throw new FilesystemDiskError(`Folder ${name} already exists`);
    }
    // Create the folder
    const folder = new LocalFilesystemFolder(name, properties, [], this);
    // Add the folder to the items
    this.items.push(folder);
    // Add the event listener
    // @ts-expect-error
    folder.addEventListener("change", this.handleFolderChange.bind(this));
    // Return the folder
    return folder;
  }

  /**
   * Returns the items in the specified path
   * @method getItemsInPath
   */
  async getItemsInPath(path: string) : Promise<Array<FilesystemFolder | FilesystemFile>> {
    // Filter the items to get all the folders in the folder
    const folders = this.items.filter(item => item instanceof FilesystemFolder);
    // Filter the items to get all the files in the folder
    const files = this.items.filter(item => item instanceof FilesystemFile);
    // Return the items
    return folders.filter(async (folder) => {
      if (folder instanceof FilesystemFolder) {
        const folderPath = folder.path;
        return folderPath.localeCompare(path) === 0;
      }
      return false;
    }).concat(files.filter(async (file) => {
      if (file instanceof FilesystemFile) {
        const filePath = file.path;
        return filePath.localeCompare(path) === 0;
      }
      return false;
    }));
  }

  /**
   * Creates a file with the specified name
   * @method createFile
   * @param name The name of the file
   */
  async createFile(name: string, content: any, properties: FilesystemFileProperties) : Promise<FilesystemFile> {
    // Check if the file already exists
    if (await this.hasFile(name)) {
      throw new FilesystemDiskError(`File ${name} already exists`);
    }
    // Create the file
    const file = new LocalFilesystemFile(name, content, properties, this);
    // Add the file to the items
    this.items.push(file);
    // Add the event listener
    // @ts-expect-error
    file.addEventListener("change", this.handleFileChange.bind(this));
    // Return the file
    return file;
  }

  /**
   * Deletes the folder with the specified name
   * @method deleteFolder
   * @param name The name of the folder
   */
  async deleteFolder(name: string) : Promise<void> {
    // Filter the items to get all the folders in the folder
    const folders = this.items.filter(item => item instanceof FilesystemFolder);
    // Return the folder
    const matchingFolders = folders.filter(async (folder) => await (folder.getName()).then(n => n.localeCompare(name)) === 0);
    if (matchingFolders.length > 0) {
      const folder = matchingFolders[0];
      // Check if the folder is a FilesystemFolder
      if (folder instanceof FilesystemFolder) {
        // Remove the folder event listener
        // @ts-expect-error
        folder.removeEventListener("change", this.handleFolderChange.bind(this));
        // Remove the folder from the items
        this.items.splice(this.items.indexOf(folder), 1);
      } else {
        throw new FilesystemDiskError(`Item ${name} is not a folder`);
      }
    } else {
      throw new FilesystemDiskError(`Folder ${name} not found`);
    }
  }

  /**
   * Deletes the file with the specified name
   * @method deleteFile
   * @param name The name of the file
   */
  async deleteFile(name: string) : Promise<void> {
    // Filter the items to get all the files in the folder
    const files = this.items.filter(item => item instanceof FilesystemFile);
    // Return the file
    const matchingFiles = files.filter(async (file) => await (file.getName()).then(n => n.localeCompare(name)) === 0);
    if (matchingFiles.length > 0) {
      const file = matchingFiles[0];
      // Check if the file is a FilesystemFile
      if (file instanceof FilesystemFile) {
        // Remove the file event listener
        // @ts-expect-error
        file.removeEventListener("change", this.handleFileChange.bind(this));
        // Remove the file from the items
        this.items.splice(this.items.indexOf(file), 1);
      } else {
        throw new FilesystemDiskError(`Item ${name} is not a file`);
      }
    } else {
      throw new FilesystemDiskError(`File ${name} not found`);
    }
  }

  /**
   * Adds the specified items to the disk
   * @method addItems
   * @param items The items to add
   */
  addItems(items: Array<FilesystemFolder | FilesystemFile>): void {
    // Add the items
    this.items.push(...items);
    // Add the event listeners
    items.forEach((item) => {
      if (item instanceof FilesystemFolder) {
        // @ts-expect-error
        item.addEventListener("change", this.handleFolderChange.bind(this));
      } else if (item instanceof FilesystemFile) {
        // @ts-expect-error
        item.addEventListener("change", this.handleFileChange.bind(this));
      }
    });
  }

  /**
   * Returns the statistics of the disk
   * @method statistics
   */
  async statistics() : Promise<any> {
    // Get the folders
    const folders = await this.getFolders();
    // Get the files
    const files = await this.getFiles();
    // Get the size
    const size = await this.getSize();
    // Return the statistics
    return {
      files: files.length,
      folders: folders.length,
      size: size,
    };
  }

  /**
   * Returns the path of the disk
   * @getter path
   */
  get path(): string {
    return this.diskPath;
  }

  /**
   * Set the path of the disk
   * @setter path
   */
  set path(path: string) {
    // Ensure the disk path
    this.ensureDiskPath(path);
    // Set the path
    if (!path.endsWith(":\\")) {
      path = `${path}\\`;
    } 
    this.diskPath = path;
    // Dispatch the change event
    this.dispatchEvent(new CustomEvent("change", { detail: { path: path } }));
  }

}

// Export the classes
export { FilesystemDisk, LocalFilesystemDisk };