/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Share",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * @class Share
 * @description Provides share functionality from the Share API
 * @extends KernelModule
 * @fires Share#ready
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
 */
class Share extends KernelModule {

  /**
   * Creates a new Share instance
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
      if (navigator && navigator.share !== undefined) {
        resolve();
      }
      reject(new KernelModuleError("Share API not supported"));
    });
  }

  /**
   * Shares the specified text
   * @param title The title of the shared text
   * @param text The text to share
   * @throws {KernelModuleError} If the title is invalid
   * @throws {KernelModuleError} If the text is invalid
   * @throws {KernelModuleError} If the title is empty
   * @throws {KernelModuleError} If the text is empty
   */
  shareText(title: string, text: string): Promise<void> {
    // Check if the title is valid
    if (typeof title !== "string") {
      throw new KernelModuleError("Invalid title! Must be a string");
    }
    // Check if the title is empty
    if (title.length === 0) {
      throw new KernelModuleError("Invalid title! Must not be empty");
    }
    // Check if the text is valid
    if (typeof text !== "string") {
      throw new KernelModuleError("Invalid text! Must be a string");
    }
    // Check if the text is empty
    if (text.length === 0) {
      throw new KernelModuleError("Invalid text! Must not be empty");
    }
    // Share the text
    return new Promise((resolve, reject) => {
      navigator.share({
        title: title,
        text: text
      }).then(() => {
        resolve(void 0);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Shares the specified url
   * @param title The title of the shared url
   * @param url The url to share
   * @throws {KernelModuleError} If the title is invalid
   * @throws {KernelModuleError} If the url is invalid
   * @throws {KernelModuleError} If the title is empty
   * @throws {KernelModuleError} If the url is empty
   * @throws {KernelModuleError} If the url is not a valid url
   */
  shareUrl(title: string, url: string): Promise<void> {
    // Method to check if the url is valid
    const isValidUrl = (urlString: string): boolean => {
      var urlPattern = new RegExp('^(https?:\\/\\/)?'+      // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+                      // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+                  // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+                         // validate query string
        '(\\#[-a-z\\d_]*)?$','i');                          // validate fragment locator
      return !!urlPattern.test(urlString);
    }
    // Check if the title is valid
    if (typeof title !== "string") {
      throw new KernelModuleError("Invalid title! Must be a string.");
    }
    // Check if the title is empty
    if (title.length === 0) {
      throw new KernelModuleError("Invalid title! Must not be empty.");
    }
    // Check if the url is valid
    if (typeof url !== "string") {
      throw new KernelModuleError("Invalid url! Must be a string.");
    }
    // Check if the url is empty
    if (url.length === 0) {
      throw new KernelModuleError("Invalid url! Must not be empty.");
    }
    // Check if the url is a valid url
    if (!isValidUrl(url)) {
      throw new KernelModuleError("Invalid url! Please provide a valid url (e.g. https://www.example.com).");
    }
    // Share the url
    return new Promise((resolve, reject) => {
      navigator.share({
        title: title,
        url: url
      }).then(() => {
        resolve(void 0);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * Shares the specified files
   * @param title The title of the shared files
   * @param files The files to share
   * @throws {KernelModuleError} If the title is invalid
   * @throws {KernelModuleError} If the files is invalid
   * @throws {KernelModuleError} If the title is empty
   * @throws {KernelModuleError} If the files is empty
   * @throws {KernelModuleError} If the files is not an array of File objects
   */
  shareFiles(title: string, files: File[]): Promise<void> {
    // Check if the title is valid
    if (typeof title !== "string") {
      throw new KernelModuleError("Invalid title! Must be a string.");
    }
    // Check if the title is empty
    if (title.length === 0) {
      throw new KernelModuleError("Invalid title! Must not be empty.");
    }
    // Check if the files is valid
    if (!Array.isArray(files)) {
      throw new KernelModuleError("Invalid files! Must be an array.");
    }
    // Check if the files is empty
    if (files.length === 0) {
      throw new KernelModuleError("Invalid files! Must not be empty.");
    }
    // Check if the files is valid
    if (files.some((file) => !(file instanceof File))) {
      throw new KernelModuleError("Invalid files! Must be an array of File objects.");
    }
    // Share the files
    return new Promise((resolve, reject) => {
      navigator.share({
        title: title,
        files: files
      }).then(() => {
        resolve(void 0);
      }).catch((error) => {
        reject(error);
      });
    });
  }

}

// Export the module
export { Share };