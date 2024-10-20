/**
 * Changelog:
 * - v1.0.0 (2023-10-29): Initial release
 */

import { FilesystemDisk, LocalFilesystemDisk } from "./Modules/Disk";
import { FilesystemFolder } from "./Modules/Folder";
import { FilesystemFile } from "./Modules/File";

/**
 * @class FilesystemManagerError
 * @description The error thrown by the FilesystemManager class
 * @extends Error
 * @property name The name of the error
 */
class FilesystemManagerError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "FilesystemManagerError";
  }
}

/**
 * @interface DiskMap
 * @description The interface for the disk map used by the FilesystemManager class.
 * @property key The key of the disk
 * @property value The value of the disk
 */
interface DiskMap {
  [key: string]: FilesystemDisk;
}

/**
 * @class FilesystemManager
 * @description The class that manages the filesystem disks and files and folders on the system.
 * @singleton
 * @extends EventTarget
 */
class FilesystemManager extends EventTarget {
  static #instance : FilesystemManager;

  #disks : DiskMap = {};    // The disks that are managed by the manager
  #ready : boolean = false; // The ready state of the PermissionManager instance

  constructor() {
    // Call the super constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the filesystem manager is not already instantiated
    if (FilesystemManager.#instance) {
      throw new FilesystemManagerError("FilesystemManager is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== FilesystemManager) {
      throw new FilesystemManagerError("Cannot extend FilesystemManager class, must instantiate it instead of extending it!");
    }

    // Set the instance of the FilesystemManager class
    FilesystemManager.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));

    // Create the system disk
    this.createDisk("C", "Local Disk");
  }

  /**
   * Returns the FilesystemManager instance
   * @readonly
   * @static
   */
  static getInstance(): FilesystemManager {
    // Check if the instance is already instantiated
    if (!FilesystemManager.#instance) {
      // Instantiate the FilesystemManager
      FilesystemManager.#instance = new FilesystemManager();
    }
    // Return the instance of the FilesystemManager
    return FilesystemManager.#instance;
  }

  /**
   * @method createDisk
   * @description Create a disk and add it to the manager
   * @param letter The letter of the disk (e.g. "C")
   * @param label The label of the disk (e.g. "Local Disk (C:)")
   * @param path The path of the disk (e.g. "C:\")
   * @param items The items of the disk (e.g. [FilesystemFile, FilesystemFolder])
   */
  createDisk(letter: string, label: string, items: Array<FilesystemFile | FilesystemFolder> = []) : void {
    // Convert the letter to uppercase
    letter = letter.toUpperCase();
    // Check if the disk already exists
    if (this.#disks[letter] !== undefined) {
      throw new FilesystemManagerError(`Disk ${letter} already exists`);
    }
    // Create the disk
    this.#disks[letter] = new LocalFilesystemDisk(label, `${letter}:\\`, items);
    // Emit the disk created event
    this.dispatchEvent(new CustomEvent("created", { detail: { disk: this.#disks[letter], letter, label } }));
  }

  /**
   * @method addDisk
   * @description Add a disk to the manager
   * @param letter The letter of the disk (e.g. "C")
   * @param disk The disk to add
   */
  addDisk(letter: string, disk: FilesystemDisk) : void {
    // Convert the letter to uppercase
    letter = letter.toUpperCase();
    // Check if the disk already exists
    if (this.#disks[letter] !== undefined) {
      throw new FilesystemManagerError(`Disk ${letter} already exists`);
    }
    // Check if the disk is a FilesystemDisk instance
    if (!(disk instanceof FilesystemDisk)) {
      throw new FilesystemManagerError("Disk must be an instance of FilesystemDisk");
    }
    // Add the disk
    this.#disks[letter] = disk;
    // Set the disk path
    this.#disks[letter].path = `${letter}:\\`;
    // Emit the add event
    this.dispatchEvent(new CustomEvent("add", { detail: { disk: this.#disks[letter], letter } }));
  }

  /**
   * @method removeDisk
   * @description Remove a disk from the manager
   * @param letter The letter of the disk (e.g. "C")
   */
  removeDisk(letter: string) : void {
    // Convert the letter to uppercase
    letter = letter.toUpperCase();
    // Check if the disk exists
    if (this.#disks[letter] === undefined) {
      throw new FilesystemManagerError(`Disk ${letter} not found`);
    }
    // Remove the disk
    delete this.#disks[letter];
    // Emit the remove event
    this.dispatchEvent(new CustomEvent("remove", { detail: { letter } }));
  }

  /**
   * @method getDisk
   * @description Get a disk by name
   * @param letter The letter of the disk (e.g. "C")
   */
  getDisk(letter: string) : FilesystemDisk {
    // Convert the letter to uppercase
    letter = letter.toUpperCase();
    // Check if the disk exists
    if (this.#disks[letter] === undefined) {
      throw new FilesystemManagerError(`Disk ${letter} not found`);
    }
    // Return the disk
    return this.#disks[letter];
  }

  /**
   * @method statistics
   * @description Get the statistics of the disks and the total statistics of the manager (size, files, folders)
   */
  async statistics() : Promise<any> {
    // Create the statistics object
    const statistics: Record<string, any> = {
      total: {
        size: 0,
        files: 0,
        folders: 0,
      },
      disks: {},
    };
    // Loop through the disks
    for (const [letter, disk] of Object.entries(this.#disks)) {
      // Get the disk statistics
      const diskStatistics = await disk.statistics();
      // Add the disk statistics to the statistics object
      statistics.disks[letter] = diskStatistics;
      // Add the disk statistics to the total statistics
      statistics.total.size += diskStatistics.size;
      statistics.total.files += diskStatistics.files;
      statistics.total.folders += diskStatistics.folders;
    }
    // Return the statistics
    return statistics;
  }

  /**
   * Returns the disks
   * @getter disks
   */
  get disks() {
    // Return the disks as an array
    return Object.entries(this.#disks).map(([letter, disk]) => {
      return {
        letter  : letter,
        label   : disk.label,
        path    : disk.path,
        local   : disk instanceof LocalFilesystemDisk,
        disk    : disk,
      };
    });
  }

  /**
   * Returns the ready state of the FilesystemManager instance
   * @getter ready
   */
  get ready() : boolean {
    return this.#ready;
  }

}

// Export the FilesystemManager class
export { FilesystemManager };