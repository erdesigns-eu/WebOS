/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { SystemManager } from "../System/System";
import { StartButton } from "./Taskbar/StartButton";
import { Clock } from "./Taskbar/Clock";
import { ShowDesktop } from "./Taskbar/ShowDesktop";
import { Startmenu } from "./Startmenu";

/**
 * The taskBarSize type
 * @type taskBarSize
 * @description The taskBarSize type represents the size of the taskbar
 */
type taskBarSize = "small" | "medium" | "large" | "xlarge";

/**
 * The shadowRootStyle string
 * @description The shadowRootStyle string represents the style for the shadow root.
 */
const shadowRootStyle: string = `
  nav {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  nav > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  nav > div > slot {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
`;

/**
 * The Taskbar class
 * @class Taskbar
 * @description The custom element that represents the WebOS Taskbar
 * @extends HTMLElement
 */
class Taskbar extends HTMLElement {

  static elementName = "web-os-taskbar"; // The name of the custom element (used for registering the custom element)
  _size: taskBarSize = "medium";         // The height of the taskbar
  
  /**
   * Creates a new Taskbar HTML element
   * @constructor
   * @description Creates a new Taskbar HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Create the shadow DOM
    const shadowRoot = this.attachShadow({ mode: "closed" });
    // Create the style element
    const style = document.createElement("style");
    // Set the style element text
    style.textContent = shadowRootStyle;
    // Append the style element to the shadow DOM
    shadowRoot.appendChild(style);
    // Create taskbar root element
    const taskbar = document.createElement("nav");
    // Create 2 sections
    const leftSection   = document.createElement("div");
    const rightSection  = document.createElement("div");
    // Append the sections to the taskbar root element
    taskbar.appendChild(leftSection);
    taskbar.appendChild(rightSection);
    // Create 3 slots
    const left   = document.createElement("slot");
    const right  = document.createElement("slot");
    // Set the slot names
    left.setAttribute("name", "left");
    right.setAttribute("name", "right");
    // Append the slots to the sections
    leftSection.appendChild(left);
    rightSection.appendChild(right);
    // Append the taskbar root element to the shadow DOM
    shadowRoot.appendChild(taskbar);
    // Add aria-label attribute
    this.setAttribute("aria-label", "Taskbar");
    // Add aria-role attribute
    this.setAttribute("role", "navigation");
  }

  /**
   * Updates the start button size
   * @method updateStartButtonSize
   * @description Updates the start button size
   */
  #updateStartButtonSize() {
    // Get the start button element
    const startButton = this.startButton;
    // Make sure the start button exists
    if (startButton) {
      // Make sure the start button size attribute is not the same as the taskbar size attribute
      if (startButton.getAttribute("size")?.localeCompare(this.size) === 0) {
        return;
      }
      // Set the start button size
      startButton.setAttribute("size", this.size);
    }
  }

  /**
   * Updates the clock size
   * @method updateClockSize
   * @description Updates the clock size
   */
  #updateClockSize() {
    // Get the clock element
    const clock = this.clock;
    // Make sure the clock exists
    if (clock) {
      // Make sure the clock size attribute is not the same as the taskbar size attribute
      if (clock.getAttribute("size")?.localeCompare(this.size) === 0) {
        return;
      }
      // Set the clock size
      clock.setAttribute("size", this.size);
    }
  }

  /**
   * Updates the show desktop size
   * @method updateShowDesktopSize
   * @description Updates the show desktop size
   */
  #updateShowDesktopSize() {
    // Get the show desktop element
    const showDesktop = this.showDesktop;
    // Make sure the show desktop element exists
    if (showDesktop) {
      // Make sure the show desktop size attribute is not the same as the taskbar size attribute
      if (showDesktop.getAttribute("size")?.localeCompare(this.size) === 0) {
        return;
      }
      // Set the show desktop size
      showDesktop.setAttribute("size", this.size);
    }
  }

  /**
   * Updates the startmenu size
   * @method updateStartmenuSize
   * @description Updates the startmenu size
   */
  #updateStartmenuSize() {
    // Get the startmenu element
    const startmenu = this.startmenu;
    console.log(startmenu)
    // Make sure the startmenu element exists
    if (startmenu) {
      // Make sure the startmenu size attribute is not the same as the taskbar size attribute
      if (startmenu.getAttribute("size")?.localeCompare(this.size) === 0) {
        return;
      }
      // Set the startmenu size
      startmenu.setAttribute("size", this.size);
    }
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["size"];
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
    // Make sure the value is different
    if (oldValue === newValue) {
      return;
    }
    // Handle the attribute change
    switch (name) {
      case "size":
        this._size = newValue as taskBarSize;
        this.#updateStartButtonSize();
        this.#updateClockSize();
        this.#updateShowDesktopSize();
        this.#updateStartmenuSize();
        break;
    }
  }

  /**
   * Returns the size of the taskbar
   * @getter size
   */
  get size(): taskBarSize {
    return this._size;
  }

  /**
   * Sets the size of the taskbar
   * @getter size
   */
  set size(value: taskBarSize) {
    this.setAttribute("height", value);
  }

  /**
   * Returns the SystemManager instance
   * @getter system
   */
  get system(): SystemManager {
    return SystemManager.getInstance();
  }

  /**
   * Returns the startButton element
   * @getter startButton
   */
  get startButton(): StartButton {
    return this.querySelector("web-os-start-button") as StartButton;
  }

  /**
   * Returns the clock element
   * @getter clock
   */
  get clock(): Clock {
    return this.querySelector("web-os-taskbar-clock") as Clock;
  }

  /**
   * Returns the showDesktop element
   * @getter showDesktop
   */
  get showDesktop(): ShowDesktop {
    return this.querySelector("web-os-taskbar-show-desktop") as ShowDesktop;
  }

  /**
   * Returns the startmenu element
   * @getter startmenu
   */
  get startmenu(): Startmenu {
    return document.querySelector("web-os-start-menu") as Startmenu;
  }

}

// Export the Taskbar class as a custom element
export { Taskbar, StartButton, Clock, ShowDesktop };