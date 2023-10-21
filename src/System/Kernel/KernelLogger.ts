/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { downloadTextFile } from "../Utils/Download";

/**
 * Log level
 * @typedef {string} logLevel
 * @readonly
 * @property {string} debug The debug log level
 * @property {string} info The info log level
 * @property {string} warn The warn log level
 * @property {string} error The error log level
 * @property {string} fatal The fatal log level
 */
type logLevel = "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Stack size (How many log entries should be stored in the log stack)
 * @type {number}
 * @readonly
 */
const stackSize: number = import.meta.env.VITE_KERNEL_LOGGER_STACK_SIZE || -1;

/**
 * @class KernelLoggerError
 * @description An error that is thrown when a kernel logger error occurs
 * @extends Error
 * @property message The error message
 */
class KernelLoggerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KernelLoggerError";
  }
}

/**
 * @class KernelLogger
 * @description A class that represents a logger for the kernel
 * @extends EventTarget
 * @property logLevel The log level
 */
class KernelLogger extends EventTarget {
  #logLevel : logLevel      = "debug";  // The log level
  #logStack : Array<string> = [];       // The log stack

  /**
   * @class KernelLogger
   * @description A class that represents a logger for the kernel
   * @extends EventTarget
   * @property logLevel The log level
   */
  constructor(logLevel: logLevel = "debug") {
    // Call the super constructor
    super();

    // Set the log level
    this.setLogLevel(logLevel);

    // Create the log stack
    this.#logStack = [];
  }

  /**
   * Should log
   * @description Check if the logger should log
   * @param logLevel The log level
   * @private
   */
  #shouldLog(logLevel: logLevel): boolean {
    // If the log level is greater than or equal to the current log level, return true
    return logLevel >= this.#logLevel;
  }

  /**
   * Console log
   * @param logLevel The log level
   * @param message The message
   */
  #consoleLog(logLevel: logLevel, message: string): void {
    // Get the current timestamp
    const timestamp = new Date().toISOString();
    // Create the log entry
    const logEntry = `%cKERNEL%c [${timestamp}] %c[${logLevel.toUpperCase()}]%c ${message}`;
    //
    let logLevelColor: string = "";
    // Check the log level
    switch (logLevel) {
      case "debug":
        logLevelColor = "#17a2b8";
        break;
      case "info":
        logLevelColor = "#17a2b8";
        break;
      case "warn":
        logLevelColor = "#ffc107";
        break;
      case "error":
        logLevelColor = "#dc3545";
        break;
      case "fatal":
        logLevelColor = "#dc3545";
        break;
    }
    // Log the message
    console.log(logEntry, "color: #17a2b8; font-weight: 600;", "color: inherit; font-weight: normal;", `color: ${logLevelColor}; font-weight: 600;`, "color: inherit; font-weight: normal;");
  }

  /**
   * Set the log level
   * @param logLevel The log level
   */
  setLogLevel(logLevel: logLevel): void {
    // Get the log levels as an array
    const logLevelsArray = Object.values(logLevel);
    // Get the minimum log level
    const minLogLevel = logLevelsArray[0];
    // Get the maximum log level
    const maxLogLevel = logLevelsArray[logLevelsArray.length - 1];

    // If the log level is not a valid log level, throw an error
    if (logLevel < minLogLevel || logLevel > maxLogLevel) {
      throw new KernelLoggerError(`Invalid log level: ${logLevel}! Valid log levels are: ${Object.keys(logLevel).join(", ")}`);
    }

    // Set the log level
    this.#logLevel = logLevel;
  }

  /**
   * Log
   * @param logLevel The log level
   * @param message The message
   */
  log(logLevel: logLevel, message: string): void {
    // If the logger should log, log the message
    if (this.#shouldLog(logLevel)) {
      // Get the current timestamp
      const timestamp = new Date().toISOString();
      
      // Emit the log event
      this.dispatchEvent(new CustomEvent(logLevel.toUpperCase(), {
        detail: {
          timestamp,
          message
        }
      }));

      // Create the log entry
      const logEntry = `[${timestamp}] [${logLevel.toUpperCase()}] ${message}`;
      
      // Check if the stack size is greater than 0 and if the log stack is greater than or equal to the stack size
      if (stackSize > 0 && this.#logStack.length >= stackSize) {
        // Remove the first element from the log stack
        this.#logStack.shift();
      }
      // Add the log entry to the log stack
      this.#logStack.push(logEntry);
      // Log the message to the console
      this.#consoleLog(logLevel, message);
    }
  }

  /**
   * Debug
   * @param message The message
   */
  debug(message: string): void {
    this.log("debug", message);
  }

  /**
   * Info
   * @param message The message
   */
  info(message: string): void {
    this.log("info", message);
  }

  /**
   * Warn
   * @param message The message
   */
  warn(message: string): void {
    this.log("warn", message);
  }

  /**
   * Error
   * @param message The message
   */
  error(message: string): void {
    this.log("error", message);
  }

  /**
   * Fatal
   * @param message The message
   */
  fatal(message: string): void {
    this.log("fatal", message);
  }

  /**
   * Download the log stack
   */
  downloadStack(): void {
    downloadTextFile(this.#logStack, "kernel-log.txt");
  }

  /**
   * Clear the log stack
   */
  clearStack(): void {
    // Clear the console
    console.clear();
    // Clear the log stack
    this.#logStack = [];
  }

  /**
   * Get the log stack
   * @readonly
   */
  get logStack(): Array<string> {
    return this.#logStack;
  }

}

// Export the kernel logger and the log level
export type { logLevel };
export { KernelLogger };