/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

/**
 * Shell custom elements
 */
import { WebOS } from "./Shell/WebOS";
import { Desktop } from "./Shell/Desktop";
import { Taskbar, StartButton, Clock, ShowDesktop } from "./Shell/Taskbar";
import { Startmenu, StartmenuCompactMain, StartmenuCompactSide } from "./Shell/Startmenu";
import { Brightness } from "./Shell/Overlay/Brightness";
import { Nightlight } from "./Shell/Overlay/Nightlight";
import { ScreenSaver } from "./Shell/Screensaver";

/**
 * Helper custom elements
 */
import { MaterialDesignIcon } from "./Helpers/MaterialDesignIcon";

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
  
  /**
   * Register the Taskbar custom elements
   */
  customElements.define(Taskbar.elementName, Taskbar);
  customElements.define(StartButton.elementName, StartButton);
  customElements.define(Clock.elementName, Clock);
  customElements.define(ShowDesktop.elementName, ShowDesktop);

  /**
   * Register the Startmenu custom element
   */
  customElements.define(Startmenu.elementName, Startmenu);
  customElements.define(StartmenuCompactMain.elementName, StartmenuCompactMain);
  customElements.define(StartmenuCompactSide.elementName, StartmenuCompactSide);
  
  // Register the Brightness custom element
  customElements.define(Brightness.elementName, Brightness);
  // Register the Nightlight custom element
  customElements.define(Nightlight.elementName, Nightlight);
  // Register the ScreenSaver custom element
  customElements.define(ScreenSaver.elementName, ScreenSaver);

  // Register the MaterialDesignIcon custom element
  customElements.define(MaterialDesignIcon.elementName, MaterialDesignIcon);
};

// Export the register function
export { registerWebOSElements };