/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "ScreenOrientation",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class ScreenOrientation
 * @description Provides screen orientation functionality from the Screen Orientation API
 * @extends KernelModule
 * @fires ScreenOrientation#ready
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 */
class ScreenOrientation extends KernelModule {

  /**
   * Creates a new ScreenOrientation instance
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
      if (screen && screen.orientation) {
        resolve();
      }
      reject(new KernelModuleError("Screen Orientation API not supported"));
    });
  }

  /**
   * Gets the current orientation angle
   * @returns The current orientation angle
   * @readonly
   */
  get angle(): number {
    return screen.orientation.angle;
  }

  /**
   * Gets the current orientation type
   * @returns The current orientation type
   * @readonly
   */
  get type(): string {
    return screen.orientation.type;
  }

}

export { ScreenOrientation };