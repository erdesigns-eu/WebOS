/**
 * Changelog:
 * - v1.0.0 (2023-10-08): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name    : "BroadcastChannel",
  version : "1.0.0",
  date    : "2023-10-07",
  author  : "Ernst Reidinga"
};

/**
 * @class Clipboard
 * @description Provides clipboard functionality from the Clipboard API
 * @extends KernelModule
 * @fires Clipboard#ready
 * @fires Clipboard#clipboardchange
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 */
class Clipboard extends KernelModule {
  #clipboard : any = navigator.clipboard;

  /**
   * Creates a new Clipboard instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for the clipboard
    const events = ["clipboardchange"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the clipboard
      this.#clipboard.addEventListener(event, () => {
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
      if (navigator && navigator.clipboard) {
        resolve();
      }
      reject(new KernelModuleError("Clipboard API not supported"));
    });
  }

  /**
   * Copies text to the clipboard
   * @param text The text to copy to the clipboard
   * @throws {KernelModuleError} If the text is not a valid string
   */
  copyTextToClipboard(text: string): Promise<void> {
    if (typeof text !== "string") {
      throw new KernelModuleError("Invalid text");
    }
    return this.#clipboard.writeText(text);
  }

  /**
   * Returns the text from the clipboard
   */
  getTextFromClipboard(): Promise<string> {
    return this.#clipboard.readText();
  }

  /**
   * Copies a blob to the clipboard
   * @param blob The blob to copy to the clipboard
   * @throws {KernelModuleError} If the blob is not a valid blob
   */
  copyBlobToClipboard(blob: Blob): Promise<void> {
    if (!(blob instanceof Blob)) {
      throw new KernelModuleError("Invalid blob");
    }
    return this.#clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  }

  /**
   * Returns the blob from the clipboard
   */
  getBlobFromClipboard(): Promise<Blob> {
    // @ts-expect-error
    return this.#clipboard.read().then(items => {
      return items[0].getType(items[0].types[0]);
    });
  }

}

export { Clipboard };