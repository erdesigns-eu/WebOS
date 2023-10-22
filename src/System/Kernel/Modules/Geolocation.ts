/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Geolocation",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class Geolocation
 * @description Provides geolocation functionality from the Geolocation API
 * @extends KernelModule
 * @fires Geolocation#ready
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */
class Geolocation extends KernelModule {

  /**
   * Creates a new Geolocation instance
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
      if (navigator && navigator.geolocation) {
        resolve();
      }
      reject(new KernelModuleError("Geolocation API not supported"));
    });
  }

  /**
   * Gets the current geolocation
   * @resolve The current geolocation
   * @reject {PositionError} The error that occurred
   */
  geoLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get the geolocation
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * Watches the geolocation
   * @param options The options to use
   * @resolve The current geolocation
   * @reject The error that occurred
   */
  watchGeoLocation(options: PositionOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      // Set the options
      options = Object.assign({ enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }, options);
      // Watch the geolocation
      navigator.geolocation.watchPosition((position) => {
        resolve(position);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * Clears the watch
   * @param watchId The watch id to clear
   */
  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

}

// Export the module
export { Geolocation };