/**
 * Changelog:
 * - v1.0.0 (2023-10-20): Initial release
 */

import { Kernel } from "./Kernel/Kernel";
import { KernelModule } from "./Kernel/KernelModule";
import { PermissionManager, permissionRequestCallbackFunction, defaultPermissionRequestCallback } from "./Permission/Manager";
import { RegisterManager, RegisterRecordObject } from "./Register/Manager";
import { WindowManager } from "./Window/Manager";

/**
 * The SystemManagerError class
 * @class
 * @description The error thrown by the SystemManager class
 * @extends Error
 * @property name The name of the error
 */
class SystemManagerError extends Error {
  constructor(message : string) {
    super(message);
    this.name = "SystemManagerError";
  }
}

/**
 * @class SystemManager
 * @description The class that manages the system and its components
 * @singleton
 * @extends EventTarget
 */
class SystemManager extends EventTarget {
  static #instance : SystemManager;

  #ready      : boolean = false;    // Whether the system is ready or not
  #kernel     : Kernel;             // The kernel of the system
  #permission : PermissionManager;  // The permission manager of the system
  #register   : RegisterManager;    // The register manager of the system
  #window     : WindowManager;      // The window manager of the system

  /**
   * Creates a new SystemManager instance
   * @param kernelModules The kernel modules to load
   * @param permissionCallback The permission callback function
   * @param registerRoot The register root
   * @throws {PermissionManagerError} If the PermissionManager is already instantiated
   * @throws {PermissionManagerError} If the PermissionManager class is extended instead of instantiated
   * @fires SystemManager#ready
   */
  constructor(kernelModules: Array<KernelModule> = [], permissionCallback: permissionRequestCallbackFunction = defaultPermissionRequestCallback, registerRoot: Array<RegisterRecordObject> = []) {
    // Call the super constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the system manager is not already instantiated
    if (SystemManager.#instance) {
      throw new SystemManagerError("SystemManager is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== SystemManager) {
      throw new SystemManagerError("Cannot extend SystemManager class, must instantiate it instead of extending it!");
    }

    // Instatiate the Kernel, PermissionManager, RegisterManager and WindowManager
    this.#kernel      = new Kernel(kernelModules);
    this.#permission  = new PermissionManager(permissionCallback);
    this.#register    = new RegisterManager(registerRoot);
    this.#window      = new WindowManager();

    // Add the system manager to the global scope
    Object.defineProperty(window, "system", {
      value: this,
      writable: false,
      enumerable: true,
      configurable: false
    });

    // Set the instance of the SystemManager
    SystemManager.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));
  }

  /**
   * Returns the SystemManager instance
   * @param kernelModules The kernel modules to load
   * @param permissionCallback The permission callback function
   * @param registerRoot The register root
   */
  static getInstance(kernelModules: Array<KernelModule> = [], permissionCallback: permissionRequestCallbackFunction = defaultPermissionRequestCallback, registerRoot: Array<RegisterRecordObject> = []): SystemManager {
    // Check if the instance is already instantiated
    if (!SystemManager.#instance) {
      // Instantiate the SystemManager
      SystemManager.#instance = new SystemManager(kernelModules, permissionCallback, registerRoot);
    }
    // Return the instance of the SystemManager
    return SystemManager.#instance;
  }

  /**
   * Instantiates the SystemManager
   * @param kernelModules The kernel modules to load
   * @param permissionCallback The permission callback function
   * @param registerRoot The register root
   */
  static instantiate(kernelModules: Array<KernelModule> = [], permissionCallback: permissionRequestCallbackFunction = defaultPermissionRequestCallback, registerRoot: Array<RegisterRecordObject> = []): void {
    // Instantiate the SystemManager
    SystemManager.getInstance(kernelModules, permissionCallback, registerRoot);
  }

  /**
   * Returns whether the system is ready or not
   * @readonly
   */
  get ready(): boolean {
    return this.#ready;
  }

  /**
   * Returns the kernel of the system
   * @readonly
   */
  get kernel(): Kernel {
    return this.#kernel;
  }

  /**
   * Returns the permission manager of the system
   * @readonly
   */
  get permission(): PermissionManager {
    return this.#permission;
  }

  /**
   * Returns the register manager of the system
   * @readonly
   */
  get register(): RegisterManager {
    return this.#register;
  }

  /**
   * Returns the window manager of the system
   * @readonly
   */
  get window(): WindowManager {
    return this.#window;
  }

}

// Export the SystemManager class
export { SystemManager };