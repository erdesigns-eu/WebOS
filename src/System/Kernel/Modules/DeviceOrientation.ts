/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "DeviceOrientation",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class DeviceOrientation
 * @description Provides device orientation information from the Device orientation Events
 * @extends KernelModule
 * @fires DeviceOrientation#ready
 * @fires DeviceOrientation#deviceorientation
 * @fires DeviceOrientation#devicemotion
 * @fires DeviceOrientation#deviceMotionEventAcceleration
 * @fires DeviceOrientation#deviceMotionEventRotationRate
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events
 */
class DeviceOrientation extends KernelModule {
  
  /**
   * Creates a new DeviceOrientation instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the device orientation
    const events = ["deviceorientation", "devicemotion", "deviceMotionEventAcceleration", "deviceMotionEventRotationRate"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the device orientation
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
  ensureDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if the device orientation API is available
      const hasDeviceOrientation = window && window.DeviceOrientationEvent;
      // Check if the device motion API is available
      const hasDeviceMotion = window && window.DeviceMotionEvent;
      // Check if the device motion event acceleration API is available
      const hasDeviceMotionEventAcceleration = window && 'DeviceMotionEventAcceleration' in window;
      // Check if the device motion event rotation rate API is available
      const hasDeviceMotionEventRotationRate = window && 'DeviceMotionEventRotationRate' in window;

      // If none of the APIs are available, reject the promise
      if (!hasDeviceOrientation && !hasDeviceMotion && !hasDeviceMotionEventAcceleration && !hasDeviceMotionEventRotationRate) {
        reject(new KernelModuleError("DeviceOrientation API not supported"));
        return;
      }

      // Resolve the promise
      resolve();
    });
  }

}

// Export the module
export { DeviceOrientation };