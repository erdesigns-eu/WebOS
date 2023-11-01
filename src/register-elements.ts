/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { WebOS } from "./Shell/WebOS";
import { Desktop } from "./Shell/Desktop";
import { Taskbar } from "./Shell/Taskbar";
import { Brightness } from "./Shell/Overlay/Brightness";
import { Nightlight } from "./Shell/Overlay/Nightlight";
import { ScreenSaver } from "./Shell/Screensaver";

/**
 * The register function
 * @function registerWebOSElements
 * @description Registers the WebOS custom elements with the browser
 * @returns {void}
 */
const registerWebOSElements = (): void => {
  // Register the WebOS custom element
  customElements.define(WebOS.elementName, WebOS);
  // Register the Desktop custom element
  customElements.define(Desktop.elementName, Desktop);
  // Register the Taskbar custom element
  customElements.define(Taskbar.elementName, Taskbar);
  // Register the Brightness custom element
  customElements.define(Brightness.elementName, Brightness);
  // Register the Nightlight custom element
  customElements.define(Nightlight.elementName, Nightlight);
  // Register the ScreenSaver custom element
  customElements.define(ScreenSaver.elementName, ScreenSaver);
};

// Export the register function
export { registerWebOSElements };