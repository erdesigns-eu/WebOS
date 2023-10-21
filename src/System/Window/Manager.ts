/**
 * Changelog:
 * - v1.0.0 (2023-10-15): Initial release
 */

import { createWindowHandle } from "../Utils/Window";
import { Window, DialogWindow, SingleWindow, SizeableWindow, ToolWindow, SizeableToolWindow, CustomWindow } from "./Modules/Windows";

/**
 * @class WindowManagerError
 * @description The error thrown when there is a problem with the WindowManager
 * @extends Error
 * @property message The error message
 */
class WindowManagerError extends Error { 
  constructor(message: string) {
    super(message);
    this.name = "WindowManagerError";
  }
}

/**
 * @class WindowManagerTypeError
 * @description The error thrown when there is a type error with the WindowManager
 * @extends TypeError
 * @property message The error message
 */
class WindowManagerTypeError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = "WindowManagerTypeError";
  }
}

/**
 * @class WindowManager
 * @description The class that manages all windows in the system
 * @singleton
 * @extends EventTarget
 */
class WindowManager extends EventTarget {
  static #instance : WindowManager;
  
  #windows : Array<Window> = [];     // The windows that are managed by the WindowManager
  #ready   : boolean       = false;  // The ready state of the WindowManager
  
  constructor() {
    // Call the super constructor
    super();

    // Set the ready state
    this.#ready = false;

    // Make sure the window manager is not already instantiated
    if (WindowManager.#instance) {
      throw new WindowManagerError("PermissionManager is already instantiated!");
    }
    // Make sure this class is instantiated and not extended
    if (new.target !== WindowManager) {
      throw new WindowManagerError("Cannot extend WindowManager class, must instantiate it instead of extending it!");
    }

    // Set the windows array to an empty array
    this.#windows = [];

    // Set the instance of the PermissionManager
    WindowManager.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));    
  }

  /**
   * Returns the WindowManager instance
   * @readonly
   * @static
   */
  static getInstance(): WindowManager {
    // Check if the instance is already instantiated
    if (!WindowManager.#instance) {
      // Instantiate the WindowManager
      WindowManager.#instance = new WindowManager();
    }
    // Return the instance of the WindowManager
    return WindowManager.#instance;
  }

  /**
   * windows
   * @description Returns the windows that are managed by the WindowManager
   */
  get windows(): Array<Window> {
    return this.#windows;
  }

  /**
   * activeWindow
   * @description Returns the active window
   */
  get activeWindow(): Window|null {
    // Make sure there are windows in the windows array
    if (this.#windows.length === 0) {
      // Return null if there are no windows
      return null;
    }
    // Return the first window in the windows array
    return this.#windows[0];
  }

  /**
   * ready
   * @description Returns the ready state of the WindowManager
   */
  get ready(): boolean {
    return this.#ready;
  }

  /**
   * setWindowOnTop
   * @description Sets a window on the top of the windows array
   * @param window The window to set on top 
   */
  #setWindowOnTop(window: Window): void {
    // Set the window on the top of the windows array
    this.#windows.splice(this.#windows.indexOf(window), 1);
  }

  /**
   * setWindowOnBottom
   * @description Sets a window on the bottom of the windows array
   * @param window The window to set on bottom
   */
  #setWindowOnBottom(window: Window): void {
    // Set the window on the bottom of the windows array
    this.#windows.splice(this.#windows.indexOf(window), 0);
  }

  /**
   * addWindow
   * @description Adds a window to the windows array
   * @param window The window to add
   */
  #addWindow(window: Window): void {
    // Make sure the window is not already in the windows array
    if (this.#windows.includes(window)) {
      throw new WindowManagerError("The window is already in the windows array!");
    }
    
    // Add window change event listener
    window.addEventListener("change", (e) => {
      // Get the event as a CustomEvent
      const event = e as CustomEvent;
      // Dispatch the change event with the window and the event detail
      this.dispatchEvent(new CustomEvent("change", { detail: { window, ...event.detail } }));
    });

    // Add window center event listener
    window.addEventListener("center", () => {
      // Dispatch the center event with the window
      this.dispatchEvent(new CustomEvent("center", { detail: { window } }));
    });
    
    // Add window close event listener
    window.addEventListener("close", () => {
      // Dispatch the close event with the window
      this.dispatchEvent(new CustomEvent("close", { detail: { window } }));
      // Remove the window from the windows array
      this.#removeWindow(window);
    });

    // Add window maximize event listener
    window.addEventListener("maximize", () => {
      // Dispatch the maximize event with the window
      this.dispatchEvent(new CustomEvent("maximize", { detail: { window } }));
    });

    // Add window minimize event listener
    window.addEventListener("minimize", () => {
      // Dispatch the minimize event with the window
      this.dispatchEvent(new CustomEvent("minimize", { detail: { window } }));
    });

    // Add window restore event listener
    window.addEventListener("restore", () => {
      // Dispatch the restore event with the window
      this.dispatchEvent(new CustomEvent("restore", { detail: { window } }));
    });

    // Add window show event listener
    window.addEventListener("show", () => {
      // Set the window on the top of the windows array
      this.#setWindowOnTop(window);
      // Dispatch the show event with the window
      this.dispatchEvent(new CustomEvent("show", { detail: { window } }));
    });

    // Add window hide event listener
    window.addEventListener("hide", () => {
      // Dispatch the hide event with the window
      this.dispatchEvent(new CustomEvent("hide", { detail: { window } }));
    });

    // Add window activate event listener
    window.addEventListener("activate", () => {
      // Old top window
      const oldTopWindow = this.#windows[0];
      // Make sure the old top window is not the same as the new top window
      if (oldTopWindow === window) {
        // Dispatch the deactivate event on the old top window
        oldTopWindow.dispatchEvent(new CustomEvent("deactivate"));
        // Set the window on the top of the windows array
        this.#setWindowOnTop(window);
        // If the window has an active element
        if (window.activeElement) {
          // Focus the active element
          window.activeElement.focus();
        }
        // Dispatch the activate event with the window
        this.dispatchEvent(new CustomEvent("activate", { detail: { window } }));
      }
    });

    // Add window deactivate event listener
    window.addEventListener("deactivate", () => {
      // Dispatch the deactivate event with the window
      this.dispatchEvent(new CustomEvent("deactivate", { detail: { window } }));
    });

    // Add window focus event listener
    window.addEventListener("focus", () => {
      // Set the window on the top of the windows array
      this.#setWindowOnTop(window);
      // Dispatch the focus event with the window
      this.dispatchEvent(new CustomEvent("focus", { detail: { window } }));
    });

    // Add window resize event listener
    window.addEventListener("resize", () => {
      // Dispatch the resize event with the window
      this.dispatchEvent(new CustomEvent("resize", { detail: { window, width: window.width, height: window.height } }));
    });

    // Add window move event listener
    window.addEventListener("move", () => {
      // Dispatch the move event with the window
      this.dispatchEvent(new CustomEvent("move", { detail: { window, left: window.left, top: window.top } }));
    });

    // Add window bounds event listener
    window.addEventListener("bounds", () => {
      // Dispatch the bounds event with the window
      this.dispatchEvent(new CustomEvent("bounds", { detail: { window, left: window.left, top: window.top, width: window.width, height: window.height } }));
    });

    // Add window bringToFront event listener
    window.addEventListener("bringToFront", () => {
      // Set the window on the top of the windows array
      this.#setWindowOnTop(window);
    });

    // Add window sendToBack event listener
    window.addEventListener("sendToBack", () => {
      // Set the window on the bottom of the windows array
      this.sendToBack(window);
    });

    // Add the window to the windows array
    this.#windows.push(window);
    // Dispatch the change event with the window
    this.dispatchEvent(new CustomEvent("change", { detail: { window } }));
    // Dispatch the add event with the window
    this.dispatchEvent(new CustomEvent("add", { detail: { window } }));
  }

  /**
   * removeWindow
   * @description Removes a window from the windows array
   * @param window The window to remove
   */
  #removeWindow(window: Window): void {
    // Make sure the window is provided
    if (!window) {
      throw new WindowManagerError("No window was provided!");
    }
    // Make sure the window is an instance of Window or a handle
    if (!(window instanceof Window)) {
      throw new WindowManagerTypeError("The window must be an instance of Window!");
    }
    // Make sure the window is in the windows array
    if (!this.#windows.includes(window)) {
      throw new WindowManagerError("The window is not in the windows array!");
    }
    // Remove the closeQuery callback from the window before removing it
    window.closeQuery = null;
    // Remove the window from the windows array
    this.#windows.splice(this.#windows.indexOf(window), 1);
    // Dispatch the change event with the window
    this.dispatchEvent(new CustomEvent("change", { detail: { window } }));
    // Dispatch the remove event with the window
    this.dispatchEvent(new CustomEvent("remove", { detail: { window } }));
  }

  /**
   * removeWindowByHandle
   * @description Removes a window from the windows array by the handle
   * @param handle The handle of the window to remove
 
   */
  #removeWindowByHandle(handle: string): void {
    // Make sure the handle is provided
    if (!handle) {
      throw new WindowManagerError("No handle was provided!");
    }
    // Make sure the handle is a string
    if (typeof handle !== "string") {
      throw new WindowManagerTypeError("The handle must be a string!");
    }
    // Get the window by the handle
    const window = this.#windows.find(window => window.handle === handle);
    // Make sure the window was found
    if (!window) {
      throw new WindowManagerError("The window was not found!");
    }
    // Remove the window from the windows array
    this.#removeWindow(window);
  }

  /**
   * createWindow
   * @description Creates a window based on the options provided
   * @param {object} options The options to create the window with
   * @returns The window instance
   * @throws {WindowManagerTypeError} If the options are not provided
   * @throws {WindowManagerTypeError} If the options are not an object
   * @throws {WindowManagerTypeError} If the options are null
   * @throws {WindowManagerTypeError} If the window type is not provided
   * @throws {WindowManagerTypeError} If the window type is invalid 
   */
  createWindow(options: object): Window {
    // Make sure the options are provided
    if (!options) {
      throw new WindowManagerTypeError("No options were provided!");
    }
    // Make sure the options are an object
    if (typeof options !== "object") {
      throw new WindowManagerTypeError("The options must be an object!");
    }
    // Make sure the options are not null
    if (options === null) {
      throw new WindowManagerTypeError("The options cannot be null!");
    }
    
    // Get the window type from the options
    // @ts-expect-error
    const windowType = options["type"];
    // Make sure the window type is provided
    if (windowType === undefined) {
      throw new WindowManagerTypeError("No window type was provided!");
    }
    
    // Placeholder for the window
    let window: Window;
    // Create the window handle (unique id to identify the window with)
    const handle = createWindowHandle();

    // Create the window based on the type
    switch (windowType) {
      case "dialog"        : window = new DialogWindow(handle, options);        break;
      case "single"        : window = new SingleWindow(handle, options);        break;
      case "sizeable"      : window = new SizeableWindow(handle, options);      break;
      case "tool"          : window = new ToolWindow(handle, options);          break;
      case "sizeableTool"  : window = new SizeableToolWindow(handle, options);  break;
      case "custom"        : window = new CustomWindow(handle, options);        break;
      default: 
        throw new WindowManagerTypeError("Invalid window type!");
    }

    // Add the window to the windows array
    this.#addWindow(window);

    // Return the window instance
    return window;
  }

  /**
   * destroyWindow
   * @description Destroys a window
   * @param window The window to destroy

   */
  destroyWindow(window: Window): void {
    // Remove the window from the windows array
    this.#removeWindow(window);
  }

  /**
   * destroyWindowByHandle
   * @description Destroys a window by the handle
   * @param handle The handle of the window to destroy
 
   */
  destroyWindowByHandle(handle: string): void {
    // Remove the window from the windows array
    this.#removeWindowByHandle(handle);
  }

  /**
   * attachWindow
   * @description Attaches a window to the WindowManager
   * @param window The window to attach
 
   */
  attachWindow(window: Window): void {
    // Make sure the window is provided
    if (!window) {
      throw new WindowManagerError("No window was provided!");
    }
    // Make sure the window is an instance of Window
    if (!(window instanceof Window)) {
      throw new WindowManagerTypeError("The window must be an instance of Window!");
    }
    // Make sure the window is not already in the windows array
    if (this.#windows.includes(window)) {
      throw new WindowManagerError("The window is already in the windows array!");
    }
    // Add the window to the windows array
    this.#addWindow(window);
  }

  /**
   * findWindow
   * @description Finds a window by the handle
   * @param handle The handle of the window to get
   * @returns The window instance
   */
  findWindow(handle: string): Window|null {
    // Make sure the handle is provided
    if (!handle) {
      throw new WindowManagerError("No handle was provided!");
    }
    // Make sure the handle is a string
    if (typeof handle !== "string") {
      throw new WindowManagerTypeError("The handle must be a string!");
    }
    // Return the window by the handle if found
    return this.#windows.find(window => window.handle === handle) || null;
  }

  /**
   * findWindowByName
   * @description Finds windows by the name
   * @param name The name of the window to get
   * @returns {Array} The windows array
   */
  findWindowByName(name: string): Array<Window> {
    // Make sure the name is provided
    if (!name) {
      throw new WindowManagerError("No name was provided!");
    }
    // Make sure the name is a string
    if (typeof name !== "string") {
      throw new WindowManagerTypeError("The name must be a string!");
    }
    // Return the windows that match the name
    return this.#windows.filter(window => window.name === name);
  }

  /**
   * findWindowByClassname
   * @description Finds windows by the classname
   * @param className The classname of the window to get
   * @returns {Array} The windows array
   */
  findWindowByClassname(className: string): Array<Window> {
    // Make sure the classname is provided
    if (!className) {
      throw new WindowManagerError("No classname was provided!");
    }
    // Make sure the classname is a string
    if (typeof className !== "string") {
      throw new WindowManagerTypeError("The classname must be a string!");
    }
    // Return the windows that match the classname
    return this.#windows.filter(window => window.className === className);
  }

  /**
   * bringToFront
   * @description Brings a window to the front of the windows array
   * @param window The window to bring to the front
 
   */
  bringToFront(window: Window): void {
    // Make sure the window is provided
    if (!window) {
      throw new WindowManagerError("No window was provided!");
    }
    // Make sure the window is an instance of Window
    if (!(window instanceof Window)) {
      throw new WindowManagerTypeError("The window must be an instance of Window!");
    }
    // Make sure the window is in the windows array
    if (!this.#windows.includes(window)) {
      throw new WindowManagerError("The window is not in the windows array!");
    }
    // Set the window on the top of the windows array
    this.#setWindowOnTop(window);
  }

  /**
   * sendToBack
   * @description Sends a window to the back of the windows array
   * @param window The window to send to the back
 
   */
  sendToBack(window: Window): void {
    // Make sure the window is provided
    if (!window) {
      throw new WindowManagerError("No window was provided!");
    }
    // Make sure the window is an instance of Window
    if (!(window instanceof Window)) {
      throw new WindowManagerTypeError("The window must be an instance of Window!");
    }
    // Make sure the window is in the windows array
    if (!this.#windows.includes(window)) {
      throw new WindowManagerError("The window is not in the windows array!");
    }
    // Set the window on the bottom of the windows array
    this.#setWindowOnBottom(window);
  }

}

// Export the WindowManager
export { WindowManager };