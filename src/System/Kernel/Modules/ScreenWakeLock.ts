/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "ScreenWakeLock",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class ScreenWakeLock
 * @description Provides screen wake lock functionality from the Screen Wake Lock API
 * @extends KernelModule
 * @fires ScreenWakeLock#ready
 * @fires ScreenWakeLock#lock
 * @fires ScreenWakeLock#unlock
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
 */
class ScreenWakeLock extends KernelModule {
  #wakeLock : WakeLockSentinel | null = null;   // The screen wake lock
  #locked   : boolean                 = false;  // The screen lock state

  /**
   * Creates a new ScreenWakeLock instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the screen wake lock
    const events = ["lock", "unlock"];
    // Loop through the events
    for (const event of events) {
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
  static ensureDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator && navigator.wakeLock) {
        resolve();
      }
      reject(new KernelModuleError("Screen Wake Lock API not supported"));
    });
  }

  /**
   * Locks the screen
   * @throws {KernelModuleError} If the screen is already locked
   */
  lock(): Promise<void> {
    // Check if the screen is already locked
    if (this.#wakeLock) {
      throw new KernelModuleError("Screen is already locked");
    }
    // Request the screen wake lock
    return new Promise((resolve, reject) => {
      navigator.wakeLock.request("screen").then((wakeLock) => {
        // Set the wake lock
        this.#wakeLock = wakeLock as WakeLockSentinel;
        // Set the locked state
        this.#locked = true;
        // Dispatch the lock event
        this.dispatchEvent(new CustomEvent("lock", { detail: this.#wakeLock }));
        // Add event listener for release event to dispatch unlock event and clear the wake lock
        this.#wakeLock.addEventListener("release", () => {
          // Clear the wake lock
          this.#wakeLock = null;
          // Dispatch the unlock event
          this.dispatchEvent(new CustomEvent("unlock", { detail: null }));
          // Add event listener for visibility change to lock the screen again
          const visibilityChangeHandler = async () => {
            // Check if the document is visible again
            if (document.visibilityState === "visible") {
              // Lock the screen again
              await this.lock();
              // Remove the event listeners for visibility change
              document.removeEventListener("visibilitychange", visibilityChangeHandler);
              document.removeEventListener("webkitvisibilitychange", visibilityChangeHandler);
              document.removeEventListener("msvisibilitychange", visibilityChangeHandler);
            }
          };
          // Add event listener for visibility change
          document.addEventListener("visibilitychange", visibilityChangeHandler);
          // Add event listener for webkit visibility change
          document.addEventListener("webkitvisibilitychange", visibilityChangeHandler);
          // Add event listener for ms visibility change
          document.addEventListener("msvisibilitychange", visibilityChangeHandler);
        });
        // Resolve the promise
        resolve(void 0);
      }).catch((error) => {
        // Reject the promise with the error
        reject(error);
      });
    });
  }

  /**
   * Unlocks the screen
   * @throws {KernelModuleError} If the screen is not locked
   */
  unlock(): Promise<void> {
    // Check if the screen is locked
    if (!this.#wakeLock) {
      throw new KernelModuleError("Screen is not locked");
    }
    return new Promise((resolve, reject) => {
      if (!this.#wakeLock) {
        reject(new KernelModuleError("Screen is not locked"));
        return;
      }
      this.#wakeLock.release().then(() => {
        // Clear the wake lock
        this.#wakeLock = null;
        // Set the locked state
        this.#locked = false;
        // Dispatch the unlock event
        this.dispatchEvent(new Event("unlock"));
        // Resolve the promise
        resolve(void 0);
      }).catch((error) => {
        // Reject the promise with the error
        reject(error);
      });
    });
  }

  /**
   * Gets the current screen lock state
   * @returns True if the screen is locked, false otherwise
   * @readonly
   */
  get locked(): boolean {
    return this.#locked;
  }

}

// Export the module
export { ScreenWakeLock };