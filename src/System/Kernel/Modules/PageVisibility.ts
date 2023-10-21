/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "PageVisibility",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class PageVisibility
 * @description Provides page visibility information from the Page Visibility API
 * @extends KernelModule
 * @fires PageVisibility#ready
 * @fires PageVisibility#visibilitychange
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
class PageVisibility extends KernelModule {

  /**
   * Creates a new PageVisibility instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the page visibility
    const events = ["visibilitychange", "webkitvisibilitychange", "msvisibilitychange"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the document
      document.addEventListener(event, () => {
        // Dispatch the event
        this.dispatchEvent(new CustomEvent("visibilitychange", { detail: this.visible }));
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
      if (document && (document.hidden !== undefined)) {
        resolve();
      }
      reject(new KernelModuleError("Page Visibility API not supported"));
    });
  }

  /**
   * Checks if the page is visible
   * @returns True if the page is visible, false otherwise
   */
  get visible(): boolean {
    return !document.hidden;
  }

}

// Export the module
export { PageVisibility };