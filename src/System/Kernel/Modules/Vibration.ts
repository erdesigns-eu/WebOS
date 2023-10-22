/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Vibration",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class Vibration
 * @description Provides vibration functionality from the Vibration API
 * @extends KernelModule
 * @fires Vibration#ready
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */
class Vibration extends KernelModule {

  /**
   * Creates a new Vibration instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the module as ready
    this.setReady();
  }

  /**
   * Ensures that the dependencies are available
   * @throws {KernelModuleError} If the dependencies are not available
   */
  ensureDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator && navigator.vibrate !== undefined) {
        resolve();
      }
      reject(new KernelModuleError("Vibration API not supported"));
    });
  }

  /**
   * Vibrates the device
   * @param pattern The vibration pattern
   * @throws {KernelModuleError} If the pattern is invalid
   */
  vibrate(pattern: number | number[]): boolean {
    // Check if the pattern is an array
    if (Array.isArray(pattern)) {
      // Check if the pattern is valid
      if (pattern.length === 0) {
        throw new KernelModuleError("Invalid vibration pattern");
      }
    }
    // Vibrate the device
    return navigator.vibrate(pattern);
  }

  /**
   * Stops the device vibration
   */
  stop(): boolean {
    // Stop the device vibration
    return navigator.vibrate(0);
  }

}

// Export the module
export { Vibration };