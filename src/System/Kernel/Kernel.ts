/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelLogger, logLevel } from "./KernelLogger";
import { KernelModuleError, KernelModule } from "./KernelModule";

/**
 * kernelLogLevel
 * @description The log level for the kernel logger
 * @readonly
 */
const kernelLogLevel: logLevel = import.meta.env.VITE_KERNEL_LOG_LEVEL || "debug"; 

/**
 * @class KernelError
 * @description The error thrown when there is a problem with the kernel
 * @extends Error
 * @property message The error message
 */
class KernelError extends Error { 
  constructor(message: string) {
    super(message);
    this.name = "KernelError";
  }
}

/**
 * @class Kernel
 * @description The kernel is the core of the WebOS. It is responsible for registering and managing kernel modules. It also provides a way to call functions on registered modules.
 * @singleton
 * @extends EventTarget
 */
class Kernel extends EventTarget {
  static #instance: Kernel;

  #logger       : KernelLogger;                                                                                 // The kernel logger
  #modules      : WeakMap<Symbol, { module: KernelModule, name: string, available: boolean }> = new WeakMap();  // The list of registered modules
  #moduleNames  : { [key: string]: Symbol }                                                   = {};             // The list of registered module names
  #ready        : boolean                                                                     = false;          // The ready state of the kernel

  /**
   * Creates a new Kernel instance
   * @param {KernelModule[]} modules The modules to register
   */
  constructor(modules: KernelModule[]) {
    // Call the super constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the kernel is not already instantiated
    if (Kernel.#instance) {
      throw new KernelError("Kernel is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== Kernel) {
      throw new KernelError("Cannot extend Kernel class, must instantiate it instead of extending it!");
    }

    // Create the logger
    this.#logger = new KernelLogger(kernelLogLevel);

    // Create an array to hold the promises
    const promises: Promise<void>[] = [];
    // Loop through the modules
    for (const module of modules) {
      // Log the module registration
      this.#logger.debug(`[constructor] Registering module ${module.name}`);
      // Register the module
      promises.push(this.registerModule(module));
    }
    
    /**
     * @function onWindowError
     * @description The function to call when there is an error on the window
     * @param message The error message
     * @param source The source of the error
     * @param line The line number of the error
     * @param col The column number of the error
     * @param error The error object
     * @returns {void} 
     */
    const onWindowError = (message: string, source: string, line: number, col: number, error: Error) => {
      // Log the error
      this.#logger.error(`[onWindowError] ${message} (${source}:${line}:${col})`);
      // Dispatch the error event
      this.dispatchEvent(new CustomEvent("error", { detail: { message, source, line, col, error } }));
      // Return true to prevent the default error handler from being called
      return true;
    }
    
    // Wait for all the promises to resolve
    Promise.all(promises).then()
    .catch((error) => {
      // Handle the rejection of the promises
      this.#logger.error(`[constructor] Error registering modules: ${error.message}`);
    })
    // Finally
    .finally(() => {
      // Set the window.onerror handler (cannot be changed)
      Object.defineProperty(window, "onerror", { value: onWindowError, writable: false, configurable: false });
      // Log the ready state
      this.#logger.debug("[constructor] Kernel ready");
      // Set the kernel instance
      Kernel.#instance = this;
      // Set the ready state
      this.#ready = true;
      // Dispatch the ready event
      this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));
    });
  }

  /**
   * Returns the kernel instance
   * @readonly
   * @static
   */
  static getInstance(): Kernel {
    // Check if the kernel instance is already set
    if (!this.#instance) {
      // Throw an error if the kernel is not instantiated
      throw new KernelError("Kernel is not instantiated!");
    }
    // Return the kernel instance
    return this.#instance;
  }

  /**
   * Checks if the kernel is instantiated
   * @readonly
   */
  static get kernelIsInstantiated(): boolean {
    return !!this.#instance;
  }

  /**
   * Registers a kernel module
   * @param {KernelModule} module The module to register
   * @throws {KernelModuleTypeError} If the module is not an instance of KernelModule
   * @throws {KernelModuleError} If the module is already registered
   * @resolves {void} When the module is registered
   * @rejects {KernelModuleError} If the dependencies are not available
   */
  registerModule(module: KernelModule): Promise<void> {
    // Check if the module is already registered
    if (this.checkModuleIsRegistered(module.name)) {
      // Log the error
      this.#logger.error(`[registerModule] Module ${module.name} is already registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${module.name} is already registered!`);
    }

    // Add the module to the list of registered modules
    const addModule = (available: boolean) => {
      // Create a unique symbol as the key for the module
      const key = Symbol(module.name);
      // Add the module to the WeakMap
      this.#modules.set(key, { module, name: module.name, available });
      // Add the module name to the list of registered modules
      this.#moduleNames[module.name] = key;
      // Add event listeners for the events registered by the module
      for (const event of module.events) {
        // Log the event listener registration
        this.#logger.debug(`[registerModule] Adding event listener for ${event} on module ${module.name}`);
        // Add the event listener to the module
        module.addEventListener(event, (e) => {
          // Cast the event to CustomEvent to access the detail property
          const customEvent = e as CustomEvent;
          // Dispatch the event
          this.dispatchEvent(new CustomEvent(event, { detail: customEvent.detail }));
        });
      }
    };

    // Return a promise
    return new Promise((resolve, reject) => {
      // Ensure the module's dependencies are available
      module.ensureDependencies()
        .then(() => {
          // Log the module registration
          this.#logger.debug(`[registerModule] Module ${module.name} registered`);
          // Add the module to the list of registered modules and mark it as available
          addModule(true);
          // Resolve the promise
          resolve();
        })
        .catch((error: Error) => {
          // Log the error
          this.#logger.warn(`[registerModule] Module ${module.name} failed to enure dependencies!`);
          // Add the module to the list of registered modules and mark it as unavailable
          addModule(false);
          // Reject the promise with the error
          reject(error);
        });
    });
  }

  /**
   * Unregisters a kernel module
   * @param moduleName The name of the module to unregister
   * @throws {KernelModuleError} If the module is not registered
   */
  unregisterModule(moduleName: string): void {
    // Check if the module is registered
    if (!this.checkModuleIsRegistered(moduleName)) {
      // Log the error
      this.#logger.error(`[unregisterModule] Module ${moduleName} is not registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not registered!`);
    }
    // Get the key for the module
    const key = this.#moduleNames[moduleName];
    // Unregister the module by removing it from the WeakMap
    this.#modules.delete(key);
    // Log the module unregistration
    this.#logger.debug(`[unregisterModule] Module ${moduleName} unregistered`);
    // Remove the module name from the list of registered modules
    delete this.#moduleNames[moduleName];
  }

  /**
   * Checks if a kernel module is registered
   * @param moduleName The name of the module to check
   */
  checkModuleIsRegistered(moduleName: string): boolean {
    return moduleName in this.#moduleNames;
  }

  /**
   * Checks if a kernel module is available (registered and dependencies are available)
   * @param moduleName The name of the module to check
   * @throws {KernelModuleError} If the module is not registered
   */
  checkModuleIsAvailable(moduleName: string): boolean {
    // Check if the module is registered
    if (!this.checkModuleIsRegistered(moduleName)) {
      // Log the error
      this.#logger.error(`[checkModuleIsAvailable] Module ${moduleName} is not registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not registered!`);
    }

    // Get the key for the module
    const key = this.#moduleNames[moduleName];
    // Get the module from WeakMap
    const module = this.#modules.get(key);

    // Return the available state of the module
    return !!module?.available;
  }

  /**
   * Checks if a kernel module is ready
   * @param moduleName The name of the module to check
   * @throws {KernelModuleError} If the module is not registered
   */
  checkModuleIsReady(moduleName: string): boolean {
    // Check if the module is registered
    if (!this.checkModuleIsRegistered(moduleName)) {
      // Log the error
      this.#logger.error(`[checkModuleIsReady] Module ${moduleName} is not registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not registered!`);
    }

    // Get the key for the module
    const key = this.#moduleNames[moduleName];
    // Get the module from WeakMap
    const module = this.#modules.get(key);
    // Log the module ready state check
    this.#logger.debug(`[checkModuleIsReady] Module ${moduleName} is ${module?.module.ready ? "" : "not "}ready`);

    // Return the ready state of the module
    return !!module?.module.ready;
  }

  /**
   * Calls a function on a registered module based on the module name
   * @param moduleName The name of the module
   * @param functionName The name of the function to call on the module
   * @param {any} args The arguments for the function
   * @throws {KernelModuleError} If the module is not registered
   * @throws {KernelModuleError} If the module is not available
   * @throws {KernelModuleError} If the function is not available on the module
   */
  callModuleFunction(moduleName: string, functionName: string, ...args: any): any {
    // Check if the module is registered
    if (!this.checkModuleIsRegistered(moduleName)) {
      // Log the error
      this.#logger.error(`[callModuleFunction] Module ${moduleName} is not registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not registered!`);
    }

    // Check if the module is available
    if (!this.checkModuleIsAvailable(moduleName)) {
      // Log the error
      this.#logger.error(`[callModuleFunction] Module ${moduleName} is not available!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not available!`);
    }

    // Get the key for the module
    const key = this.#moduleNames[moduleName];
    // Get the module from WeakMap
    const module = this.#modules.get(key);

    // Check if the function is available on the module
    // @ts-expect-error
    if (typeof module?.module[functionName] !== "function") {
      // Log the error
      this.#logger.error(`[callModuleFunction] Function ${functionName} is not available on module ${moduleName}!`);
      // Throw the error
      throw new KernelModuleError(`Function ${functionName} is not available on module ${moduleName}`);
    }

    // Call the function on the module
    try {
      // Log the function call
      this.#logger.debug(`[callModuleFunction] Calling function ${functionName} on module ${moduleName}`);
      // Call the function on the module and return the result
      // @ts-expect-error
      return module[functionName](...args);
    } catch (error) {
      // Log the error
      this.#logger.error(`[callModuleFunction] Function ${functionName} on module ${moduleName} failed with error: ${error}`);
      // Throw the error
      throw new KernelModuleError(`Function ${functionName} on module ${moduleName} failed! [${error}]`);
    }
  }

  /**
   * Gets a value from a registered module based on the module name
   * @param moduleName The name of the module
   */
  getModuleValue(moduleName: string, valueName: string): any {
    // Check if the module is registered
    if (!this.checkModuleIsRegistered(moduleName)) {
      // Log the error
      this.#logger.error(`[getModuleValue] Module ${moduleName} is not registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not registered!`);
    }

    // Check if the module is available
    if (!this.checkModuleIsAvailable(moduleName)) {
      // Log the error
      this.#logger.error(`[getModuleValue] Module ${moduleName} is not available!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not available!`);
    }

    // Get the key for the module
    const key = this.#moduleNames[moduleName];
    // Get the module from WeakMap
    const module = this.#modules.get(key);

    // Check if the value is available on the module
    // @ts-expect-error
    if (typeof module?.module[valueName] === "undefined") {
      // Log the error
      this.#logger.error(`[getModuleValue] Value ${valueName} is not available on module ${moduleName}!`);
      // Throw the error
      throw new KernelModuleError(`Value ${valueName} is not available on module ${moduleName}`);
    }

    // Return the value
    // @ts-expect-error
    return module?.module[valueName];
  }

  /**
   * Sets a value on a registered module based on the module name
   * @param moduleName The name of the module
   */
  setModuleValue(moduleName: string, valueName: string, value: any): void {
    // Check if the module is registered
    if (!this.checkModuleIsRegistered(moduleName)) {
      // Log the error
      this.#logger.error(`[setModuleValue] Module ${moduleName} is not registered!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not registered!`);
    }

    // Check if the module is available
    if (!this.checkModuleIsAvailable(moduleName)) {
      // Log the error
      this.#logger.error(`[setModuleValue] Module ${moduleName} is not available!`);
      // Throw the error
      throw new KernelModuleError(`Module ${moduleName} is not available!`);
    }

    // Get the key for the module
    const key = this.#moduleNames[moduleName];
    // Get the module from WeakMap
    const module = this.#modules.get(key);

    // Check if the value is available on the module
    // @ts-expect-error
    if (typeof module?.module[valueName] === "undefined") {
      // Log the error
      this.#logger.error(`[setModuleValue] Value ${valueName} is not available on module ${moduleName}!`);
      // Throw the error
      throw new KernelModuleError(`Value ${valueName} is not available on module ${moduleName}`);
    }

    // Set the value on the module
    if (module && module.module && valueName) {
      // Log the value set
      this.#logger.debug(`[setModuleValue] Setting value ${valueName} on module ${moduleName} to ${value}`);
      // @ts-expect-error
      module.module[valueName] = value;
    }
  }

  /**
   * Returns an array of names of all (registered) kernel modules
   * @returns {string[]}
   * @readonly
   */
  get modules(): string[] {
    return Object.keys(this.#moduleNames);
  }

  /**
   * Returns an array of names of available (registered) kernel modules
   * @returns {string[]}
   * @readonly
   */
  get available(): string[] {
    // Array to hold the available modules
    const modules: string[] = [];
    // Loop through the values of the #moduleNames object
    for (const key of Object.values(this.#moduleNames)) {
      // Check if the module is available
      const module = this.#modules.get(key);
      // Add the module name to the list of available modules if it's available
      if (module?.available && key && typeof key.description === 'string') {
        modules.push(key.description);
      }
    }
    // Return the list of available modules
    return modules;
  }

  /**
   * Returns an array of names of unavailable (registered) kernel modules
   * @returns {string[]}
   * @readonly
   */
  get unavailable(): string[] {
    // Array to hold the unavailable modules
    const modules: string[] = [];
    // Loop through the values of the #moduleNames object
    for (const key of Object.values(this.#moduleNames)) {
      // Check if the module is available
      const module = this.#modules.get(key);
      // Add the module name to the list of unavailable modules if it's not available
      if (!module?.available && key && typeof key.description === 'string') {
        modules.push(key.description);
      }
    }
    // Return the list of unavailable module names
    return modules;
  }

  /**
   * Returns the ready state of the kernel

   * @readonly
   */
  get ready(): boolean {
    return this.#ready;
  }

  /**
   * Returns the kernel logger
   * @returns {KernelLogger}
   * @readonly
   */
  get logger(): KernelLogger {
    return this.#logger;
  }

}

/**
 * kernelInstance
 * @description Returns the kernel instance
 * @returns {Kernel}
 */
const kernelInstance = (): Kernel => {
  return Kernel.getInstance();
}

// Export the Kernel class and the kernelIsInstantiated constant
export { Kernel as default, Kernel, kernelInstance };