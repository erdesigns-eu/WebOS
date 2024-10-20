/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Notifications",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class Notifications
 * @description Provides notifications functionality from the Notifications API
 * @extends KernelModule
 * @fires Notifications#ready
 * @fires Notifications#click
 * @fires Notifications#close
 * @fires Notifications#error
 * @fires Notifications#show
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
 */
class Notifications extends KernelModule {

  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the notifications API
    const events = ["click", "close", "error", "show"];
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
  ensureDependencies(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window && window.Notification) {
        resolve();
      }
      reject(new KernelModuleError("Notifications API not supported"));
    });
  }

  /**
   * Requests the notification permission
   * @resolve {void}
   * @reject {KernelModuleError} If the notification permission is not granted
   */
  requestPermission(): Promise<void> {
    return new Promise((resolve, reject) => {
      const hasPermission = Notification.permission === 'granted';
      // Check if the notification permission is granted
      if (hasPermission) {
        // Resolve the promise
        resolve(void 0);
      } else {
        // Request the notification permission
        Notification.requestPermission().then((permission) => {
          // Check if the notification permission is granted
          if (permission === 'granted') {
            // Resolve the promise
            resolve(void 0);
          } else {
            // Reject the promise
            reject(new KernelModuleError("Notification permission not granted"));
          }
        });
      }
    });
  }

  /**
   * Creates a new notification
   * @param title The notification title
   * @param  options The notification options
   * @resolve {Notification} The notification
   * @reject {KernelModuleError} If the notification permission is not granted
   * @reject {KernelModuleError} If the notification title is invalid
   * @reject {KernelModuleError} If the notification options are invalid
   */
  notify(title: string, options?: NotificationOptions): Promise<Notification> {
    return new Promise((resolve, reject) => {
      const hasPermission = Notification.permission === 'granted';
      // Check if the notification permission is granted
      if (hasPermission) {
        // Check if the title is valid
        if (typeof title !== "string") {
          // Reject the promise
          reject(new KernelModuleError("Invalid notification title"));
        }
        // Check if the options are valid
        if (options && typeof options !== "object") {
          // Reject the promise
          reject(new KernelModuleError("Invalid notification options"));
        }
        // Create a new notification
        const notification = new Notification(title, options);
        // Add event listener for click event
        notification.addEventListener("click", () => {
          // Dispatch the click event
          this.dispatchEvent(new CustomEvent("click", { detail: notification }));
        });
        // Add event listener for close event
        notification.addEventListener("close", () => {
          // Dispatch the close event
          this.dispatchEvent(new CustomEvent("close", { detail: notification }));
        });
        // Add event listener for error event
        notification.addEventListener("error", () => {
          // Dispatch the error event
          this.dispatchEvent(new CustomEvent("error", { detail: notification }));
        });
        // Add event listener for show event
        notification.addEventListener("show", () => {
          // Dispatch the show event
          this.dispatchEvent(new CustomEvent("show", { detail: notification }));
        });
        // Resolve the promise
        resolve(notification);
      } else {
        // Reject the promise
        reject(new KernelModuleError("Notification permission not granted"));
      }
    });
  }

}

// Export the module
export { Notifications };