/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "OnlineOffline",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class OnlineOffline
 * @description Provides online offline information from the navigator onLine property
 * @extends KernelModule
 * @fires OnlineOffline#ready
 * @fires OnlineOffline#online
 * @fires OnlineOffline#offline
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
 */
class OnlineOffline extends KernelModule {

  /**
   * Creates a new OnlineOffline instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the online offline API
    const events = ["online", "offline"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the window
      window.addEventListener(event, (e) => {
        // Cast the event to CustomEvent to access the detail property
        const customEvent = e as CustomEvent;
        // Dispatch the event
        this.dispatchEvent(new CustomEvent(event, { detail: customEvent.detail }));
      });
      // Register the event
      this.registerEvent(event);
    }
    // Set the module as ready
    this.setReady();
  }

  /**
   * Ensures that the dependencies are available
   * @throws {KernelModuleError} If the dependencies are not available
   */
  ensureDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator && navigator.onLine !== undefined) {
        resolve();
      }
      reject(new KernelModuleError("Online Offline API not supported"));
    });
  }

  /**
   * Checks if the device is online
   * @returns True if the device is online, false otherwise
   * @readonly
   */
  get online(): boolean {
    return navigator.onLine;
  }

  /**
   * Checks if the device is offline
   * @returns True if the device is offline, false otherwise
   * @readonly
   */
  get offline(): boolean {
    return !navigator.onLine;
  }

}

// Export the module
export { OnlineOffline };