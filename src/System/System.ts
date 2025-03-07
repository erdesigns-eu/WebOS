/**
 * Changelog:
 * - v1.0.0 (2023-10-20): Initial release
 */

import { Kernel } from "./Kernel/Kernel";
import { KernelModule } from "./Kernel/KernelModule";
import { PermissionManager, permissionRequestCallbackFunction, defaultPermissionRequestCallback } from "./Permission/Manager";
import { RegisterManager, RegisterRecordObject } from "./Register/Manager";
import { WindowManager } from "./Window/Manager";
import { FilesystemManager } from "./Filesystem/Manager";
import { ThemeManagerTheme } from "./Theme/Modules/Theme";
import { ThemeManager } from "./Theme/Manager";

import { Screen } from "./Utilities/Screen";
import { Utility } from "./Utilities/Utility";
import { Shell } from "./Utilities/Shell";

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
  #filesystem : FilesystemManager;  // The filesystem manager of the system
  #theme      : ThemeManager;       // The theme manager of the system

  #screen     : Screen;             // The screen of the system
  #utility    : Utility;            // The utility of the system
  #shell      : Shell;              // The shell of the system

  /**
   * Creates a new SystemManager instance
   * @param kernelModules The kernel modules to load
   * @param permissionCallback The permission callback function
   * @param registerRoot The register root
   * @param themes The themes to load
   * @throws {PermissionManagerError} If the PermissionManager is already instantiated
   * @throws {PermissionManagerError} If the PermissionManager class is extended instead of instantiated
   * @fires SystemManager#ready
   */
  constructor(kernelModules: Array<KernelModule> = [], permissionCallback: permissionRequestCallbackFunction = defaultPermissionRequestCallback, registerRoot: Array<RegisterRecordObject> = [], themes: ThemeManagerTheme[] = []) {
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

    // Instatiate the Kernel, PermissionManager, RegisterManager, WindowManager and FilesystemManager
    this.#kernel      = new Kernel(kernelModules);
    this.#permission  = new PermissionManager(permissionCallback);
    this.#register    = new RegisterManager(registerRoot);
    this.#window      = new WindowManager();
    this.#filesystem  = new FilesystemManager();
    this.#theme       = new ThemeManager(themes);

    // Instantiate the Screen and Utility
    this.#screen      = new Screen();
    this.#utility     = Utility;
    this.#shell       = Shell;

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
   * @param themes The themes to load
   */
  static getInstance(kernelModules: Array<KernelModule> = [], permissionCallback: permissionRequestCallbackFunction = defaultPermissionRequestCallback, registerRoot: Array<RegisterRecordObject> = [], themes: ThemeManagerTheme[] = []): SystemManager {
    // Check if the instance is already instantiated
    if (!SystemManager.#instance) {
      // Instantiate the SystemManager
      SystemManager.#instance = new SystemManager(kernelModules, permissionCallback, registerRoot, themes);
    }
    // Return the instance of the SystemManager
    return SystemManager.#instance;
  }

  /**
   * Instantiates the SystemManager
   * @param kernelModules The kernel modules to load
   * @param permissionCallback The permission callback function
   * @param registerRoot The register root
   * @param themes The themes to load
   */
  static instantiate(kernelModules: Array<KernelModule> = [], permissionCallback: permissionRequestCallbackFunction = defaultPermissionRequestCallback, registerRoot: Array<RegisterRecordObject> = [], themes: ThemeManagerTheme[] = []): void {
    // Instantiate the SystemManager
    SystemManager.getInstance(kernelModules, permissionCallback, registerRoot, themes);
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

  /**
   * Returns the filesystem manager of the system
   * @readonly
   */
  get filesystem(): FilesystemManager {
    return this.#filesystem;
  }

  /**
   * Returns the theme manager of the system
   * @readonly
   */
  get theme(): ThemeManager {
    return this.#theme;
  }

  /**
   * Returns the Screen Utility class of the system
   * @readonly
   */
  get screen(): Screen {
    return this.#screen;
  }

  /**
   * Returns the Utility class of the system
   * @readonly
   */
  get utility(): Utility {
    return this.#utility;
  }

  /**
   * Returns the Shell Utility class of the system
   * @readonly
   */
  get shell(): Shell {
    return this.#shell;
  }

}

// Export the SystemManager class
export { SystemManager };