/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { SystemManager } from "../System/System";

/**
 * The WebOS class
 * @class WebOS
 * @description The custom element that represents the WebOS shell
 * @extends HTMLElement
 */
class WebOS extends HTMLElement {

  static elementName = "web-os"; // The name of the custom element (used for registering the custom element)
  
  /**
   * Creates a new WebOS HTML element
   * @constructor
   * @description Creates a new WebOS HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Attach the shadow root
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    // Create the main element
    const main = document.createElement("main");
    // Set the class name of the main element
    main.className = "web-os-main";
    // Append the main element to the shadow root
    shadowRoot.appendChild(main);
    // Create the style element
    const style = document.createElement('style');
    // Set the style element's text content
    style.textContent = `
      .web-os-main {
        display: flex;
        flex-direction: column;
        background-color: transparent;
        contain: strict;
        inset: 0px;
        overscroll-behavior: none;
        position: fixed;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
      }
      .web-os-desktop {
        flex: 1;
      }
      .web-os-taskbar {
        height: 48px;
      }
    `;
    // Create the desktop element
    const desktop = document.createElement("div");
    // Set the class name of the desktop element
    desktop.className = "web-os-desktop";
    // Create the taskbar element
    const taskbar = document.createElement("div");
    // Set the class name of the taskbar element
    taskbar.className = "web-os-taskbar";
    // Append the desktop and taskbar elements to the main element
    main.appendChild(desktop);
    main.appendChild(taskbar);
    // Create the desktop slot element
    const desktopSlot = document.createElement("slot");
    // Set the name attribute of the desktop slot element
    desktopSlot.name = "desktop";
    // Append the desktop slot element to the desktop element
    desktop.appendChild(desktopSlot);
    // Create the taskbar slot element
    const taskbarSlot = document.createElement("slot");
    // Set the name attribute of the taskbar slot element
    taskbarSlot.name = "taskbar";
    // Append the taskbar slot element to the taskbar element
    taskbar.appendChild(taskbarSlot);
    // Append the style element to the shadow root
    shadowRoot.appendChild(style);
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    // Initialization code
  }

  /**
   * The disconnectedCallback method
   * @method
   * @description The disconnectedCallback method is called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Uninitialization code
  }

  /**
   * The attributeChangedCallback method
   * @method
   * @description The attributeChangedCallback method is called when an attribute is added, removed, updated, or replaced on the element
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Attribute change code
    console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
  }

  /**
   * Returns the SystemManager instance
   */
  get system(): SystemManager {
    return SystemManager.getInstance();
  }

}

// Export the WebOS class as a custom element
export { WebOS };