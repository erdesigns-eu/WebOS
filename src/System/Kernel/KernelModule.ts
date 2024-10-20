/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { logLevel } from "./KernelLogger";
import Kernel from "./Kernel";

/**
 * @class KernelModuleError
 * @description An error that is thrown when a kernel module error occurs
 * @extends Error
 * @property message The error message
 */
class KernelModuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KernelModuleError";
  }
}

/**
 * @class KernelModuleTypeError
 * @description An error that is thrown when a kernel module type error occurs
 * @extends TypeError
 * @property message The error message
 */
class KernelModuleTypeError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = "KernelModuleTypeError";
  }
}

/**
 * @interface KernelModuleInformation
 * @description An interface that represents the information of a kernel module
 * @property name The name of the module
 * @property version The version of the module
 * @property date The date of the module
 * @property author The author of the module
 */
interface KernelModuleInformation {
  name    : string,
  version : string,
  date    : string,
  author  : string
}

/**
 * @class KernelModule
 * @description A class that represents a kernel module
 * @extends EventTarget
 * @property name The name of the module
 * @property version The version of the module
 * @property date The date of the module
 * @property author The author of the module
 */
abstract class KernelModule extends EventTarget {
  #name     : string = "";
  #version  : string = "";
  #date     : string = "";
  #author   : string = "";
  #ready    : boolean = false;
  #events   : Array<string> = [];

  /**
   * Creates a new KernelModule instance
   * @param name The name of the module
   * @param version The version of the module
   * @param date The date of the module
   * @param author The author of the module
   */
  constructor(name: string, version: string, date: string, author: string) {
    // Call the super constructor
    super();
    
    // Make sure this class is not instantiated directly
    if (new.target === KernelModule) {
      throw new KernelModuleTypeError("Cannot construct KernelModule instances directly");
    }

    // Set the name, version, date, and author
    this.#name    = name;
    this.#version = version;
    this.#date    = date;
    this.#author  = author;

    // Set the ready state
    this.#ready = false;

    // Set the events, which are registered by the module and add the ready event which is implemented in every module.
    this.#events = ["ready", "log"];
  }

  /**
   * Ensures that the dependencies are available
   * @rejects {KernelModuleError} If the dependencies are not available
   */
  ensureDependencies(): Promise<void> {
    return Promise.reject(new KernelModuleError("ensureDependencies() is not implemented"));
  }

  /**
   * Logs a message
   * @param logLevel The log level of the message
   * @param message The message to log 
   */
  log(logLevel: logLevel, message: string): void {
    if (Kernel.kernelIsInstantiated) {
      // Get the kernel instance
      const kernel = Kernel.getInstance();
      // Log the message using the kernel logger
      kernel.logger.log(logLevel, message);
    }
    // Dispatch the log event
    this.dispatchEvent(new CustomEvent("log", { detail: { logLevel, message } }));
  }

  /**
   * Logs a debug message
   * @param message The message to log
   */
  debug(message: string): void {
    this.log("debug", message);
  }

  /**
   * Logs an info message
   * @param message The message to log
   */
  info(message: string): void {
    this.log("info", message);
  }

  /**
   * Logs a warning message
   * @param message The message to log
   */
  warn(message: string): void {
    this.log("warn", message);
  }

  /**
   * Logs an error message
   * @param message The message to log
   */
  error(message: string): void {
    this.log("error", message);
  }

  /**
   * Logs a fatal message
   * @param message The message to log
   */
  fatal(message: string): void {
    this.log("fatal", message);
  }

  /**
   * Registers an event
   * @param event The event to register
   */
  registerEvent(event: string): void {
    // Check if the event is already registered
    if (this.#events.includes(event)) {
      throw new KernelModuleError(`The event '${event}' is already registered!`);
    }
    // Log the event registration
    this.debug(`Registered event '${event}' in module '${this.name}'`);
    // Add the event to the events array
    this.#events.push(event);
  }

  /**
   * Sets the module as ready
   * @fires KernelModule#ready
   */
  setReady(): void {
    // Set the ready state to true
    this.#ready = true;
    // Log the ready state
    this.debug(`Module '${this.name}' is ready`);
    // Dispatch the ready event
    this.dispatchEvent(new Event("ready"));
  }

  /**
   * Returns the name of the module
   * @readonly
   */
  get name(): string {
    return this.#name;
  }

  /**
   * Returns the version of the module
   * @readonly
   */
  get version(): string {
    return this.#version;
  }

  /**
   * Returns the date of the module
   * @readonly
   */
  get date(): Date {
    return new Date(this.#date);
  }

  /**
   * Returns the author of the module
   * @readonly
   */
  get author(): string {
    return this.#author;
  }

  /**
   * Returns whether the module is ready
   * @readonly
   */
  get ready(): boolean {
    return this.#ready;
  }

  /**
   * Returns the events of the module
   * @readonly
   */
  get events(): Array<string> {
    return this.#events;
  }

  /**
   * Allow dynamic properties.
   */
  [key: string]: any;

}

// Export the KernelModule class
export type { KernelModuleInformation };
export { KernelModule, KernelModuleError, KernelModuleTypeError };