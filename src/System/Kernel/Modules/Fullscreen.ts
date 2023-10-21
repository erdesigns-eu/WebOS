/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Fullscreen",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class Fullscreen
 * @description Provides fullscreen functionality from the Fullscreen API
 * @extends KernelModule
 * @fires Fullscreen#ready
 * @fires Fullscreen#fullscreenchange
 * @fires Fullscreen#fullscreenerror
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 */
class Fullscreen extends KernelModule {

  /**
   * Creates a new Fullscreen instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the fullscreen API
    const events = ["fullscreenchange", "fullscreenerror"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the window
      window.addEventListener(event, () => {
        // Dispatch the event
        this.dispatchEvent(new CustomEvent(event, { detail: null }));
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
  static ensureDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document && document.fullscreenEnabled) {
        resolve();
      }
      reject(new KernelModuleError("Fullscreen API not supported"));
    });
  }

  /**
   * Requests fullscreen for the given element or the document element
   * @param element The element to request fullscreen for
   * @throws {KernelModuleError} If the element is not a valid element
   * @throws {KernelModuleError} If fullscreen is not enabled
   * @throws {KernelModuleError} If fullscreen is already active
   */
  requestFullscreen(element: Element): Promise<void> {
    // Check if the element is valid
    if (element && !(element instanceof Element)) {
      throw new KernelModuleError("Invalid element");
    }
    // Check if fullscreen is enabled
    if (!this.enabled) {
      throw new KernelModuleError("Fullscreen is not enabled");
    }
    // Check if fullscreen is already active
    if (this.active) {
      throw new KernelModuleError("Fullscreen is already active");
    }
    // If the element is not defined, use the document element
    if (!element) {
      element = document.documentElement;
    }
    // Request fullscreen for the given element
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    }
    return Promise.resolve();
  }

  /**
   * Exits fullscreen mode
   * @throws {KernelModuleError} If fullscreen is not enabled
   * @throws {KernelModuleError} If fullscreen is not active
   */
  exitFullscreen(): Promise<void> {
    // Check if fullscreen is enabled
    if (!this.enabled) {
      throw new KernelModuleError("Fullscreen is not enabled");
    }
    // Check if fullscreen is not active
    if (!this.active) {
      throw new KernelModuleError("Fullscreen is not active");
    }
    // Exit fullscreen
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    }
    return Promise.resolve();
  }

  /**
   * Checks if fullscreen is enabled
   * @readonly
   */
  get enabled(): boolean {
    return document.fullscreenEnabled;
  }

  /**
   * Checks if fullscreen is active
   * @readonly
   */
  get active(): boolean {
    return document.fullscreenElement !== null;
  }
  
  /**
   * Gets the fullscreen element
   * @readonly
   */
  get element(): Element|null {
    return document.fullscreenElement;
  }

}

export { Fullscreen };