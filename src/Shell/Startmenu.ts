/**
 * Changelog:
 * - v1.0.0 (2023-11-04): Initial release
 */

import { StartButton } from "./Taskbar";
import { StartmenuCompactMain, StartmenuCompactSide, StartmenuCompactSideButton, StartmenuCompactSideDivider } from "./Startmenu/Compact";

/**
 * The StartmenuStyle type
 * @type {string}
 * @description The type of the startmenu style (compact or full)
 */
type startMenuStyle = "compact" | "full";

/**
 * The StartmenuSize type
 * @type {string}
 * @description The startmenu type represents the size of the startmenu
 */
type startMenuSize = "small" | "medium" | "large" | "xlarge";

/**
 * The Startmenu class
 * @class Startmenu
 * @description The custom element that represents the WebOS startmenu
 * @extends HTMLElement
 */
class Startmenu extends HTMLElement {

  static elementName = "web-os-start-menu"; // The name of the custom element (used for registering the custom element)

  /**
   * Creates a new Startmenu HTML element
   * @constructor
   * @description Creates a new Startmenu HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    //
    this.innerHTML = `
    <web-os-start-menu-compact-main></web-os-start-menu-compact-main>
    <web-os-start-menu-compact-side>
      <div class="top">
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="person" tooltip="User" tooltip-position="right"></web-os-start-menu-compact-side-button>
        <web-os-start-menu-compact-side-divider></web-os-start-menu-compact-side-divider>
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="folder_shared" tooltip="Documents" tooltip-position="right"></web-os-start-menu-compact-side-button>
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="folder_special" tooltip="Favorites" tooltip-position="right"></web-os-start-menu-compact-side-button>
        <web-os-start-menu-compact-side-divider></web-os-start-menu-compact-side-divider>
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="desktop_windows" tooltip="My PC" tooltip-position="right"></web-os-start-menu-compact-side-button>
        <web-os-start-menu-compact-side-divider></web-os-start-menu-compact-side-divider>
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="terminal" tooltip="Terminal" tooltip-position="right"></web-os-start-menu-compact-side-button>
      </div>
      <div class="bottom">
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="settings" tooltip="Settings" tooltip-position="right"></web-os-start-menu-compact-side-button>
        <web-os-start-menu-compact-side-divider></web-os-start-menu-compact-side-divider>
        <web-os-start-menu-compact-side-button mdi-style="round" mdi-icon="power_settings_new" tooltip="Power" tooltip-position="right"></web-os-start-menu-compact-side-button>
      </div>
    </web-os-start-menu-compact-side>
    `;
  }

  /**
   * Adds event listeners
   * @method addEventListeners
   * @description Adds event listeners to the startmenu
   */
  #addEventListeners() {
    // Add event listener for click events
    document.addEventListener("click", this.#handleClickEvent);
    // Add event listener for keydown events
    document.addEventListener("keydown", this.#handleKeydownEvent);
  }

  /**
   * Removes event listeners
   * @method removeEventListeners
   * @description Removes event listeners from the startmenu
   */
  #removeEventListeners() {
    // Remove event listener for click events
    document.removeEventListener("click", this.#handleClickEvent);
    // Remove event listener for keydown events
    document.removeEventListener("keydown", this.#handleKeydownEvent);
  }

  /**
   * The handleClickEvent method
   * @method handleClickEvent
   * @description The handleClickEvent method handles the click event on the startmenu
   */
  #handleClickEvent(event: MouseEvent) {
    // If the target is the start button, do nothing
    if (event.target === document.querySelector("web-os-start-button")) {
      return;
    }
    // If the target is the startmenu, do nothing
    const startmenu: Startmenu = document.querySelector("web-os-start-menu")!;
    if (event.target === startmenu) {
      return;
    }
    // If the target is a child of the startmenu, do nothing
    if (startmenu!.contains(event.target as Node)) {
      return;
    }
    // Close the startmenu
    startmenu.close();
  }

  /**
   * The handleKeydownEvent method
   * @method handleKeydownEvent
   * @description The handleKeydownEvent method handles the keydown event on the startmenu
   */
  #handleKeydownEvent(event: KeyboardEvent) {
    // If the key is the escape key, close the startmenu
    if (event.key === "Escape") {
      const startmenu: Startmenu = document.querySelector("web-os-start-menu")!;
      startmenu.close();
    }
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["size", "menu-style", "opened"];
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
    // Make sure the value actually changed
    if (oldValue === newValue) {
      return;
    }
    // Update accordingly based on the attribute name
    switch (name) {
      case "size":
        // Nothing to do here (the size is handled by CSS)
        break;
      case "menu-style":
        // Nothing to do here yet - TODO: Implement the menu style attribute
        break;
      case "opened":
        if (newValue.localeCompare("true") === 0) {
          // Update the start button attribute
          this.startButton.setAttribute("opened", "true");
          // Wait for the next frame
          requestAnimationFrame(() => {
            this.#addEventListeners();
          });
          // Emit the open event
          this.dispatchEvent(new CustomEvent("open"));
        } else {
          // Update the start button attribute
          this.startButton.setAttribute("opened", "false");
          // Remove the event listeners
          this.#removeEventListeners();
          // Emit the close event
          this.dispatchEvent(new CustomEvent("close"));
        }
        break;
    }
  }

  /**
   * Opens the startmenu
   * @method open
   * @description Opens the startmenu
   */
  open() {
    this.setAttribute("opened", "true");
  }

  /**
   * Closes the startmenu
   * @method close
   * @description Closes the startmenu
   */
  close() {
    this.setAttribute("opened", "false");
  }

  /**
   * Toggles the startmenu
   * @method toggle
   * @description Toggles the startmenu
   */
  toggle() {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Returns the startmenu size
   * @getter size
   */
  get size(): startMenuSize {
    return this.getAttribute("size") as startMenuSize;
  }

  /**
   * Sets the startmenu size
   * @setter size
   */
  set size(value: startMenuSize) {
    this.setAttribute("size", value);
  }

  /**
   * Returns the menu style
   * @getter menuStyle
   */
  get menuStyle(): startMenuStyle {
    return this.getAttribute("menu-style") as startMenuStyle;
  }

  /**
   * Sets the menu style
   * @setter menuStyle
   */
  set menuStyle(value: startMenuStyle) {
    this.setAttribute("menu-style", value);
  }

  /**
   * Returns whether the startmenu is opened
   * @getter opened
   */
  get opened(): boolean {
    return this.hasAttribute("opened") && this.getAttribute("opened")!.localeCompare("true") === 0;
  }

  /**
   * Sets whether the startmenu is opened
   * @setter opened
   */
  set opened(value: boolean) {
    this.setAttribute("opened", value.toString());
  }

  /**
   * Returns the start button element
   * @getter startButton
   */
  get startButton(): StartButton {
    return document.querySelector("web-os-start-button") as StartButton;
  }

}

// Export the Startmenu class as a custom element
export { Startmenu, StartmenuCompactMain, StartmenuCompactSide, StartmenuCompactSideButton, StartmenuCompactSideDivider };