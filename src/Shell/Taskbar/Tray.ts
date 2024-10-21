/**
 * Changelog:
 * - v1.0.0 (2024-10-20): Initial release
 */

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
    width: 100%;
  }
  nav > div > slot {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
`;

/**
 * The Tray class
 * @class Tray
 * @description The custom element that represents the WebOS tray (in the taskbar)
 * @extends HTMLElement
 */
class Tray extends HTMLElement {

  static elementName = "web-os-taskbar-tray"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new Tray HTML element
   * @constructor
   * @description Creates a new Tray HTML element
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
    // Create 2 slots
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
    
    // Update the mdi-icon size attribute
    const mdiIcon = this.getElementsByTagName("web-os-mdi")[0];
    if (mdiIcon) {
      mdiIcon.setAttribute("size", newValue);
    }
  }
  
}

/**
 * The TrayButton class
 * @class TrayButton
 * @description The custom element that represents a button in the WebOS tray (in the taskbar)
 * @extends HTMLElement
 */
class TrayButton extends HTMLElement {
  static elementName = "web-os-taskbar-tray-button"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new TrayButton HTML element
   * @constructor
   * @description Creates a new TrayButton HTML element
   * @extends HTMLElement
   */
  constructor() {
    super();
  }
}

// Export the Tray and TrayButton classes as a custom element
export { Tray, TrayButton };