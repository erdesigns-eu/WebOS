/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Gamepad",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class Gamepads
 * @description Provides gamepad functionality from the Gamepad API
 * @extends KernelModule
 * @fires Gamepads#ready
 * @fires Gamepads#gamepadconnected
 * @fires Gamepads#gamepaddisconnected
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
 */
class Gamepads extends KernelModule {
  #controllers : { [key: number]: Gamepad } = {};   // The list of controllers
  #scanHandle  : NodeJS.Timeout | null      = null; // The scan handle
  
  /**
   * Creates a new Gamepads instance
   */
  constructor(options: { interval: number, autoScan?: boolean }) {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the gamepad API
    const events = ["gamepadconnected", "gamepaddisconnected", "webkitgamepadconnected", "webkitgamepaddisconnected"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the window
      window.addEventListener(event, (e) => {
        if (event === "gamepadconnected" || event === "webkitgamepadconnected") {
          // Cast the event to CustomEvent to access the detail property
          const customEvent = e as CustomEvent;
          // Dispatch the event
          this.dispatchEvent(new CustomEvent("gamepadconnected", { detail: customEvent.detail }));
        }
        if (event === "gamepaddisconnected" || event === "webkitgamepaddisconnected") {
          // Cast the event to CustomEvent to access the detail property
          const customEvent = e as CustomEvent;
          // Dispatch the event
          this.dispatchEvent(new CustomEvent("gamepaddisconnected", { detail: customEvent.detail }));
        }
      });
      // Register the event
      this.registerEvent(event);
    }
    // Set the options
    options = Object.assign({ interval: 500, autoScan: false }, options);
    // Check if auto scan is enabled
    if (options.autoScan === true) {
      // Start scanning for gamepads every interval milliseconds
      this.autoScan(options.interval);
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
      if (window && window.GamepadEvent) {
        resolve();
      }
      reject(new KernelModuleError("Gamepad API not supported"));
    });
  }

  /**
   * Adds the gamepad to the list of controllers
   * @param gamepad The gamepad to add
   */
  #addGamepad(gamepad: Gamepad) {
    this.#controllers[gamepad.index] = gamepad;
  }

  /**
   * Scans for gamepads and updates the list of controllers
   */
  scanGamepads(): void {
    // Clear the list of controllers
    this.#controllers = {};
    // Grab gamepads from browser API
    const gamepads = navigator.getGamepads();
    if (gamepads) {
      for (let i = 0; i < gamepads.length; i++) {
        // Check if the gamepad is valid
        const gamepad = gamepads[i];
        if (gamepad) {
          // Check if the gamepad is already in the list of controllers
          if (gamepad.index in this.#controllers) {
            // Update the gamepad
            this.#controllers[gamepad.index] = gamepad;
          } else {
            // Add the gamepad
            this.#addGamepad(gamepad);
          }
        }
      }
    }
  }

  /**
   * Start auto scanning for gamepads
   * @param interval The interval in milliseconds to scan for gamepads
   */
  autoScan(interval: number): void {
    // Check if auto scan is already enabled
    if (this.#scanHandle) {
      throw new KernelModuleError("Auto scan is already enabled");
    }
    // Check if the interval is valid
    if (typeof interval !== "number" || interval < 100) {
      throw new KernelModuleError("Invalid interval, must be a number greater than 100");
    }
    // Stop scanning for gamepads
    this.stopScan();
    // Start scanning for gamepads every interval milliseconds
    this.#scanHandle = setInterval(this.scanGamepads, interval);
  }

  /**
   * Stop auto scanning for gamepads
   */
  stopScan(): void {
    // Check if auto scan is not enabled
    if (!this.#scanHandle) {
      throw new KernelModuleError("Auto scan is not enabled");
    }
    // Clear the scan handle
    clearInterval(this.#scanHandle);
    this.#scanHandle = null;
  }

  /**
   * Gets the list of controllers
   * @returns The list of controllers
   * @readonly
   */
  get controllers(): Gamepad[] {
    return Object.values(this.#controllers);
  }

}

// Export the module
export { Gamepads };