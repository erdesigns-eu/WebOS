/**
 * Changelog:
 * - v1.0.0 (2023-10-14): Initial release
 */

import { Screen } from "../../Utilities/Screen";

import { isValidColor } from "../../Utils/Color";
import { isValidCursor } from "../../Utils/Cursor";
import { isValidFont } from "../../Utils/Font";
import { stringContainsHTML, isImageURLOrDataURL } from "../../Utils/HTML";

import { WindowConstraint } from "./Constraint";
import { WindowAlignType } from "./Align";
import { WindowPadding } from "./Padding";
import { WindowPositionType } from "./Position";
import { WindowStateType } from "./State";

import { DialogBorderIcons, SingleBorderIcons, SizeableBorderIcons } from "./BorderIcons";

/**
 * @class WindowError
 * @description The error thrown when there is a problem with a Window
 * @extends Error
 */
class WindowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WindowError";
  }
}

/**
 * @class WindowTypeError
 * @description The error thrown when there is a type error with a Window
 * @extends TypeError
 */
class WindowTypeError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = "WindowTypeError";
  }
}

/**
 * @class BaseWindow
 * @description The base class for all windows in the system
 * @extends EventTarget
 */
class BaseWindow extends EventTarget {
  #activeElement    : HTMLElement|null    = null;                     // The active element of the window (the element that has focus)
  #align            : WindowAlignType     = "alNone";                 // The alignment of the window on the screen 
  #alphaBlend       : boolean             = false;                    // Whether or not the window is alpha blended
  #alphaBlendValue  : number              = 255;                      // The alpha blend value of the window (0-255)         
  #autoScroll       : boolean             = false;                    // Whether or not the window should scroll add scrollbars when the content is too large
  #autoSize         : boolean             = false;                    // Whether or not the window should automatically resize to fit the content
  #className        : string              = "";                       // The classname of the window (Not a CSS class, but a classname for the window itself to be referenced by)
  #closeQuery       : Function|null       = null;                     // The close query of the window (Callback function that is called when the window is about to close, return a promise to cancel or continue the close)
  #color            : string              = "inherit";                // The color of the window (background) 
  #constraints      : WindowConstraint    = new WindowConstraint();   // The constraints of the window (min/max size)
  #cursor           : string              = "inherit";                // The cursor of the window
  #enabled          : boolean             = true;                     // Whether or not the window is enabled
  #font             : string              = "inherit";                // The font of the window
  #handle           : string|null         = null;                     // The handle of the window (A unique identifier for the window used by the system)
  #height           : number              = 0;                        // The height of the window
  #hint             : string              = "";                       // The hint of the window
  #left             : number              = 0;                        // The left position of the window
  #menu             : object|null         = null;                     // The menu of the window
  #modal            : boolean             = false;                    // Whether or not the window is modal (blocks input to other windows)
  #name             : string              = "";                       // The name of the window
  #padding          : WindowPadding       = new WindowPadding();      // The padding of the window
  #parent           : HTMLElement|null    = null;                     // The parent HTML element of the window (the element that contains the window - usually the document body, but can be another element)
  #popupMenu        : object|null         = null;                     // The popup menu of the window (right click menu / context menu)
  #position         : WindowPositionType  = "poDefault";              // The position of the window on the screen (initial)
  #screenSnap       : boolean             = false;                    // Whether or not the window should snap to the screen
  #stayOnTop        : boolean             = false;                    // Whether or not the window should stay on top of other windows
  #showHint         : boolean             = false;                    // Whether or not the window should show the hint when the mouse is over the window
  #showInTaskbar    : boolean             = true;                     // Whether or not the window should show in the taskbar
  #snapBuffer       : number              = 10;                       // The buffer for snapping to the screen
  #taskBarPreview   : boolean             = false;                    // Whether or not the window should show a preview in the taskbar
  #top              : number              = 0;                        // The top position of the window
  #visible          : boolean             = true;                     // Whether or not the window is visible
  #width            : number              = 0;                        // The width of the window
  #windowState      : WindowStateType     = "wsNormal";               // The state of the window

  /**
   * @constructor
   * @description Creates a new BaseWindow instance
   * @param handle The handle of the window
   * @param options The options for the window
   * @throws {TypeError} Thrown when the class is instantiated directly instead of being extended
   */
  constructor(handle: string, options: object) {
    // Call the super constructor
    super();

    // Make sure this class is extended, not instantiated
    if (this.constructor === BaseWindow) {
      throw new TypeError("Cannot construct BaseWindow instances directly");
    }

    // Set the handle of the window
    this.#handle = handle;

    // Set the options for the window
    this.setOptions(options);
  }

  /**
   * setOptions
   * @description Sets the options for the window instance
   * @param options The options for the window
   * @returns {void} 
   */
  setOptions(options: {[key: string]: any}): void {
    // Make sure the options is an object
    if (typeof options !== "object") {
      throw new WindowTypeError("Options must be an object.");
    }

    // Loop through each option
    for (const option in options) {
      // If the option is a valid property of the window
      if (Object.prototype.hasOwnProperty.call(this, option)) {
        // Set the value
        (this as any)[option] = options[option];
      }
    }
  }

  /**
   * activeElement
   * @description Returns the active element of the window (the element that has focus)
   * @returns {HTMLElement|null}
   */
  get activeElement(): HTMLElement|null {
    return this.#activeElement;
  }

  /**
   * activeElement
   * @description Sets the active element of the window (the element that has focus)
   * @param value The active element of the window (the element that has focus)
   */
  set activeElement(value: HTMLElement|null) {
    // Make sure the value is an HTMLElement or null
    if (!(value instanceof HTMLElement) && value !== null) {
      throw new WindowTypeError("ActiveElement must be an HTMLElement or null.");
    }
    // Set the value
    this.#activeElement = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { activeElement: value } }));
  }

  /**
   * align
   * @description Returns the alignment of the window on the screen
   * @returns {WindowAlignType}
   */
  get align(): WindowAlignType {
    return this.#align;
  }

  /**
   * align
   * @description Sets the alignment of the window on the screen
   * @param value The alignment of the window on the screen
   */
  set align(value: WindowAlignType) {
    // Set the value
    this.#align = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { align: value } }));
  }

  /**
   * alphaBlend
   * @description Returns whether or not the window is alpha blended
   * @returns {boolean}
   */
  get alphaBlend(): boolean {
    return this.#alphaBlend;
  }

  /**
   * alphaBlend
   * @description Sets whether or not the window is alpha blended
   * @param value Whether or not the window is alpha blended
   */
  set alphaBlend(value: boolean) {
    // Set the value
    this.#alphaBlend = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { alphaBlend: value } }));
  }

  /**
   * alphaBlendValue
   * @description Returns the alpha blend value of the window
   * @returns {number}
   */
  get alphaBlendValue(): number {
    return this.#alphaBlendValue;
  }

  /**
   * alphaBlendValue
   * @description Sets the alpha blend value of the window
   * @param value The alpha blend value of the window
   */
  set alphaBlendValue(value: number) {
    // Make sure the value is not less than 0
    if (value < 0) {
      throw new WindowError("AlphaBlendValue cannot be less than 0.");
    }
    // Make sure the value is not greater than 255
    if (value > 255) {
      throw new WindowError("AlphaBlendValue cannot be greater than 255.");
    }
    // Set the value
    this.#alphaBlendValue = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { alphaBlendValue: value } }));
  }

  /**
   * autoScroll
   * @description Returns whether or not the window should scroll add scrollbars when the content is too large
   * @returns {boolean}
   */
  get autoScroll(): boolean {
    return this.#autoScroll;
  }

  /**
   * autoScroll
   * @description Sets whether or not the window should scroll add scrollbars when the content is too large
   * @param value Whether or not the window should scroll add scrollbars when the content is too large
   */
  set autoScroll(value: boolean) {
    // Set the value
    this.#autoScroll = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { autoScroll: value } }));
  }

  /**
   * autoSize
   * @description Returns whether or not the window should automatically resize to fit the content
   * @returns {boolean}
   */
  get autoSize(): boolean {
    return this.#autoSize;
  }

  /**
   * autoSize
   * @description Sets whether or not the window should automatically resize to fit the content
   * @param value Whether or not the window should automatically resize to fit the content
   */
  set autoSize(value: boolean) {
    // Set the value
    this.#autoSize = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { autoSize: value } }));
  }

  /**
   * className
   * @description Returns the class name of the window
   * @returns {string}
   */
  get className(): string {
    return this.#className;
  }

  /**
   * className
   * @description Sets the classname of the window (Not a CSS class, but a classname for the window itself to be referenced by)
   * @param value The classname of the window
   */
  set className(value: string) {
    // Make sure the value is not empty
    if (value === "") {
      throw new WindowError("ClassName cannot be empty.");
    }
    // Make sure there are no spaces in the value
    if (value.indexOf(" ") !== -1) {
      throw new WindowError("ClassName cannot contain spaces.");
    }
    // The valid characters for a class name
    const validCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    // Loop through each character in the value
    for (let i = 0; i < value.length; i++) {
      // Get the character
      const character = value.charAt(i);
      // Make sure the character is valid
      if (validCharacters.indexOf(character) === -1) {
        throw new WindowError("ClassName contains invalid characters.");
      }
    }
    // Set the value
    this.#className = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { className: value } }));
  }

  /**
   * closeQuery
   * @description Returns the close query of the window (Callback function that is called when the window is about to close, return a promise to cancel or continue the close)
   * @returns {function|null}
   */
  get closeQuery(): Function|null {
    return this.#closeQuery;
  }

  /**
   * closeQuery
   * @description Sets the close query of the window (Callback function that is called when the window is about to close, return a promise to cancel or continue the close)
   * @param value The close query of the window
   */
  set closeQuery(value: Function|null) {
    // Set the value
    this.#closeQuery = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { closeQuery: value } }));
  }

  /**
   * color
   * @description Returns the color of the window (background)
   * @returns {string}
   */
  get color(): string {
    return this.#color;
  }

  /**
   * color
   * @description Sets the color of the window (background)
   * @param value The color of the window (background)
   */
  set color(value: string) {
    // Make sure the value is a valid color
    if (!isValidColor(value)) {
      throw new WindowError("Color must be a valid color value.");
    }
    // Set the value
    this.#color = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { color: value } }));
  }

  /**
   * constraints
   * @description Returns the constraints of the window (min/max size)
   * @returns {WindowConstraint}
   */
  get constraints(): WindowConstraint {
    return this.#constraints;
  }

  /**
   * cursor
   * @description Returns the cursor of the window
   * @returns {string}
   */
  get cursor(): string {
    return this.#cursor;
  }

  /**
   * cursor
   * @description Sets the cursor of the window
   * @param value The cursor of the window
   */
  set cursor(value: string) {
    // Make sure the value is a valid cursor
    if (!isValidCursor(value)) {
      throw new WindowError("Cursor must be a valid cursor value.");
    }
    // Set the value
    this.#cursor = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { cursor: value } }));
  }

  /**
   * enabled
   * @description Returns whether or not the window is enabled
   * @returns {boolean}
   */
  get enabled(): boolean {
    return this.#enabled;
  }

  /**
   * enabled
   * @description Sets whether or not the window is enabled
   * @param value Whether or not the window is enabled
   */
  set enabled(value: boolean) {
    // Set the value
    this.#enabled = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { enabled: value } }));
  }

  /**
   * font
   * @description Returns the font of the window
   * @returns {string}
   */
  get font(): string {
    return this.#font;
  }

  /**
   * font
   * @description Sets the font of the window
   * @param value The font of the window
   */
  set font(value: string) {
    // Make sure the value is a valid font
    if (!isValidFont(value)) {
      throw new WindowError("Font must be a valid font value.");
    }
    // Set the value
    this.#font = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { font: value } }));
  }

  /**
   * handle
   * @description Returns the handle of the window (A unique identifier for the window used by the system)
   * @returns {string}
   */
  get handle(): string|null {
    return this.#handle;
  }

  /**
   * handle
   * @description Sets the handle of the window (A unique identifier for the window used by the system)
   * @param value The handle of the window (A unique identifier for the window used by the system)
   */
  set handle(value: string|null) {
    // Set the value
    this.#handle = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { handle: value } }));
  }

  /**
   * height
   * @description Returns the height of the window
   * @returns {number}
   */
  get height(): number {
    return this.#height;
  }

  /**
   * height
   * @description Sets the height of the window
   * @param value The height of the window
   */
  set height(value: number) {
    // Make sure the value is not less than 0
    if (value < 0) {
      throw new WindowError("Height cannot be less than 0.");
    }
    // Set the value
    this.#height = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { height: value } }));
    // Dispatch the resize event
    this.dispatchEvent(new CustomEvent("resize", { detail: { height: value } }));
  }

  /**
   * hint
   * @description Returns the hint of the window
   * @returns {string}
   */
  get hint(): string {
    return this.#hint;
  }

  /**
   * hint
   * @description Sets the hint of the window
   * @param value The hint of the window
   */
  set hint(value: string) {
    // Set the value
    this.#hint = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { hint: value } }));
  }

  /**
   * left
   * @description Returns the left position of the window
   * @returns {number}
   */
  get left(): number {
    return this.#left;
  }

  /**
   * left
   * @description Sets the left position of the window
   * @param value The left position of the window
   */
  set left(value: number) {
    // Set the value
    this.#left = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { left: value } }));
    // Dispatch the move event
    this.dispatchEvent(new CustomEvent("move", { detail: { left: value } }));
  }

  /**
   * menu
   * @description Returns the menu of the window
   * @returns {object|null}
   */
  get menu(): object|null {
    return this.#menu;
  }

  /**
   * menu
   * @description Sets the menu of the window
   * @param value The menu of the window
   */
  set menu(value: object|null) {
    // Set the value
    this.#menu = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { menu: value } }));
  }

  /**
   * modal
   * @description Returns whether or not the window is modal (blocks input to other windows)
   * @returns {boolean}
   */
  get modal(): boolean {
    return this.#modal;
  }

  /**
   * modal
   * @description Sets whether or not the window is modal (blocks input to other windows)
   * @param value Whether or not the window is modal (blocks input to other windows)
   */
  set modal(value: boolean) {
    // Set the value
    this.#modal = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { modal: value } }));
  }

  /**
   * name
   * @description Returns the name of the window
   * @returns {string}
   */
  get name(): string {
    return this.#name;
  }

  /**
   * name
   * @description Sets the name of the window
   * @param value The name of the window
   */
  set name(value: string) {
    // Set the value
    this.#name = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { name: value } }));
  }

  /**
   * padding
   * @description Returns the padding of the window
   * @returns {WindowPadding}
   */
  get padding(): WindowPadding {
    return this.#padding;
  }

  /**
   * parent
   * @description Returns the parent HTML element of the window (the element that contains the window - usually the document body, but can be another element)
   * @returns {HTMLElement|null}
   */
  get parent(): HTMLElement|null {
    return this.#parent;
  }

  /**
   * parent
   * @description Sets the parent HTML element of the window (the element that contains the window - usually the document body, but can be another element)
   * @param value The parent HTML element of the window
   */
  set parent(value: HTMLElement|null) {
    // Set the value
    this.#parent = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { parent: value } }));
  }

  /**
   * popupMenu
   * @description Returns the popup menu of the window (right click menu / context menu)
   * @returns {object|null}
   */
  get popupMenu(): object|null {
    return this.#popupMenu;
  }

  /**
   * popupMenu
   * @description Sets the popup menu of the window (right click menu / context menu)
   * @param value The popup menu of the window (right click menu / context menu)
   */
  set popupMenu(value: object|null) {
    // Set the value
    this.#popupMenu = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { popupMenu: value } }));
  }

  /**
   * position
   * @description Returns the position of the window on the screen (initial)
   * @returns {WindowPositionType}
   */
  get position(): WindowPositionType {
    return this.#position;
  }

  /**
   * position
   * @description Sets the position of the window on the screen (initial)
   * @param value The position of the window on the screen (initial)
   */
  set position(value: WindowPositionType) {
    // Set the value
    this.#position = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { position: value } }));
  }

  /**
   * screenSnap
   * @description Returns whether or not the window should snap to the screen
   * @returns {boolean}
   */
  get screenSnap(): boolean {
    return this.#screenSnap;
  }

  /**
   * screenSnap
   * @description Sets whether or not the window should snap to the screen
   * @param value Whether or not the window should snap to the screen
   */
  set screenSnap(value: boolean) {
    // Set the value
    this.#screenSnap = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { screenSnap: value } }));
  }

  /**
   * stayOnTop
   * @description Returns whether or not the window should stay on top of other windows
   * @returns {boolean}
   */
  get stayOnTop(): boolean {
    return this.#stayOnTop;
  }

  /**
   * stayOnTop
   * @description Sets whether or not the window should stay on top of other windows
   * @param value Whether or not the window should stay on top of other windows
   */
  set stayOnTop(value: boolean) {
    // Show the window if it is not already visible
    if (!this.#visible) {
      this.#visible = true;
    }
    // Set the value
    this.#stayOnTop = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { stayOnTop: value } }));
  }

  /**
   * showHint
   * @description Returns whether or not the window should show the hint when the mouse is over the window
   * @returns {boolean}
   */
  get showHint(): boolean {
    return this.#showHint;
  }

  /**
   * showHint
   * @description Sets whether or not the window should show the hint when the mouse is over the window
   * @param value Whether or not the window should show the hint when the mouse is over the window
   */
  set showHint(value: boolean) {
    // Set the value
    this.#showHint = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { showHint: value } }));
  }

  /**
   * showInTaskbar
   * @description Returns whether or not the window should show in the taskbar
   * @returns {boolean}
   */
  get showInTaskbar(): boolean {
    return this.#showInTaskbar;
  }

  /**
   * showInTaskbar
   * @description Sets whether or not the window should show in the taskbar
   * @param value Whether or not the window should show in the taskbar
   */
  set showInTaskbar(value: boolean) {
    // Set the value
    this.#showInTaskbar = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { showInTaskbar: value } }));
  }

  /**
   * snapBuffer
   * @description Returns the buffer for snapping to the screen
   * @returns {number}
   */
  get snapBuffer(): number {
    return this.#snapBuffer;
  }

  /**
   * snapBuffer
   * @description Sets the buffer for snapping to the screen
   * @param value The buffer for snapping to the screen
   */
  set snapBuffer(value: number) {
    // Make sure the value is not less than 0
    if (value < 0) {
      throw new WindowError("SnapBuffer cannot be less than 0.");
    }
    // Set the value
    this.#snapBuffer = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { snapBuffer: value } }));
  }

  /**
   * taskBarPreview
   * @description Returns whether or not the window preview should be shown on the taskbar
   * @returns {boolean}
   */
  get taskBarPreview(): boolean {
    return this.#taskBarPreview;
  }

  /**
   * taskBarPreview
   * @description Sets whether or not the window preview should be shown on the taskbar
   * @param value Whether or not the window preview should be shown on the taskbar
   */
  set taskBarPreview(value: boolean) {
    // Set the value
    this.#taskBarPreview = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { taskBarPreview: value } }));
  }

  /**
   * top
   * @description Returns the top position of the window
   * @returns {number}
   */
  get top(): number {
    return this.#top;
  }

  /**
   * top
   * @description Sets the top position of the window
   * @param value The top position of the window
   */
  set top(value: number) {
    // Set the value
    this.#top = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { top: value } }));
    // Dispatch the move event
    this.dispatchEvent(new CustomEvent("move", { detail: { top: value } }));
  }

  /**
   * visible
   * @description Returns whether or not the window is visible
   * @returns {boolean}
   */
  get visible(): boolean {
    return this.#visible;
  }

  /**
   * visible
   * @description Sets whether or not the window is visible
   * @param value Whether or not the window is visible
   */
  set visible(value: boolean) {
    // Set the value
    this.#visible = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { visible: value } }));
  }

  /**
   * width
   * @description Returns the width of the window
   * @returns {number}
   */
  get width(): number {
    return this.#width;
  }

  /**
   * width
   * @description Sets the width of the window
   * @param value The width of the window
   */
  set width(value: number) {
    // Make sure the value is not less than 0
    if (value < 0) {
      throw new WindowError("Width cannot be less than 0.");
    }
    // Set the value
    this.#width = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { width: value } }));
    // Dispatch the resize event
    this.dispatchEvent(new CustomEvent("resize", { detail: { width: value } }));
  }

  /**
   * windowState
   * @description Returns the state of the window (minimized, maximized, etc.)
   * @returns {WindowStateType}
   */
  get windowState(): WindowStateType {
    return this.#windowState;
  }

  /**
   * windowState
   * @description Sets the state of the window (minimized, maximized, etc.)
   * @param value The state of the window (minimized, maximized, etc.)
   */
  set windowState(value: WindowStateType) {
    // Set the value
    this.#windowState = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { windowState: value } }));
  }

  /**
   * @method center
   * @description Centers the window on the screen
   * @returns {void}
   */
  center(): void {
    // Get the screen instance
    const screenInstance = Screen.getInstance();
    // Set the left position
    this.#left = (screenInstance.width / 2) - (this.width / 2);
    // Set the top position
    this.#top = (screenInstance.height / 2) - (this.height / 2);
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("center"));
    // Dispatch the resize event
    this.dispatchEvent(new CustomEvent("resize", { detail: { width: this.width, height: this.height } }));
    // Dispatch the move event
    this.dispatchEvent(new CustomEvent("move", { detail: { left: this.left, top: this.top } }));
  }

  /**
   * @method close
   * @description Closes the window
   * @returns {void}
   */
  close(): void {
    // Check if there is a close query
    if (this.#closeQuery !== null) {
      // Call the close query
      this.#closeQuery()
      .then((result: boolean) => {
        // Check if the result is true
        if (result === true) {
          // Hide the window
          this.#visible = false;
          // Dispatch the event
          this.dispatchEvent(new CustomEvent("close"));
        }
      })
      .catch((error: Error) => {
        // If there is an error, prevent the window from closing
        if (error !== undefined) {
          // Dispatch the event
          this.dispatchEvent(new CustomEvent("close"));
        }
      });
    } else {
      // Hide the window
      this.#visible = false;
      // Dispatch the event
      this.dispatchEvent(new CustomEvent("close"));
    }
  }

  /**
   * @method maximize
   * @description Maximizes the window
   * @returns {void}
   */
  maximize(): void {
    // Set the window state
    this.#windowState = "wsMaximized";
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("maximize"));
  }

  /**
   * @method minimize
   * @description Minimizes the window
   * @returns {void}
   */
  minimize(): void {
    // Set the window state
    this.#windowState = "wsMinimized";
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("minimize"));
  }

  /**
   * @method restore
   * @description Restores the window
   * @returns {void}
   */
  restore(): void {
    // Set the window state
    this.#windowState = "wsNormal";
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("restore"));
  }

  /**
   * @method show
   * @description Shows the window
   * @returns {void}
   */
  show(): void {
    // Set the visible property
    this.#visible = true;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("show"));
  }

  /**
   * @method hide
   * @description Hides the window
   * @returns {void}
   */
  hide(): void {
    // Set the visible property
    this.#visible = false;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("hide"));
  }

  /**
   * @method activate
   * @description Activates the window (brings it to the front and gives it focus)
   * @returns {void}
   */
  activate(): void {
    // NOTE: This event is handled by the WindowManager
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("activate"));
  }

  /**
   * @method deactivate
   * @description Deactivates the window (removes focus from the window)
   * @returns {void}
   */
  deactivate(): void {
    // NOTE: This event is handled by the WindowManager
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("deactivate"));
  }

  /**
   * @method focus
   * @description Gives the window focus
   * @returns {void}
   */
  focus(): void {
    // NOTE: This event is handled by the WindowManager
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("focus"));
  }

  /**
   * @method bringToFront
   * @description Brings the window to the front
   * @returns {void}
   */
  bringToFront(): void {
    // NOTE: This event is handled by the WindowManager
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("bringToFront"));
  }

  /**
   * @method sendToBack
   * @description Sends the window to the back
   * @returns {void}
   */
  sendToBack(): void {
    // NOTE: This event is handled by the WindowManager
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("sendToBack"));
  }

  /**
   * @method adjustSize
   * @description Adjusts the size of the window
   * @param width The width of the window
   * @param height The height of the window
   * @returns {void}
   * @throws {WindowError} Thrown when the width or height is less than 0
   */ 
  adjustSize(width: number, height: number): void {
    // Check if the width is less than 0
    if (width < 0) {
      throw new WindowError("Width cannot be less than 0.");
    }
    // Check if the height is less than 0
    if (height < 0) {
      throw new WindowError("Height cannot be less than 0.");
    }
    // Set the width
    this.#width = width;
    // Set the height
    this.#height = height;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { width, height } }));
    // Dispatch the resize event
    this.dispatchEvent(new CustomEvent("resize", { detail: { width, height } }));
  }

  /**
   * @method adjustPosition
   * @description Adjusts the position of the window
   * @param left The left position of the window
   * @param top The top position of the window
   * @returns {void} 
   * @throws {WindowError} Thrown when the width or height is less than 0
   */
  adjustPosition(left: number, top: number): void {
    // Set the left
    this.#left = left;
    // Set the top
    this.#top = top;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { left, top } }));
    // Dispatch the move event
    this.dispatchEvent(new CustomEvent("move", { detail: { left, top } }));
  }

  /**
   * @method adjustBounds
   * @description Adjusts the bounds of the window
   * @param left The left position of the window
   * @param top The top position of the window
   * @param width The width of the window
   * @param height The height of the window
   * @returns {void}
   * @throws {WindowError} Thrown when the width or height is less than 0
   */
  adjustBounds(left: number, top: number, width: number, height: number): void {
    // Check if the width is less than 0
    if (width < 0) {
      throw new WindowError("Width cannot be less than 0.");
    }
    // Check if the height is less than 0
    if (height < 0) {
      throw new WindowError("Height cannot be less than 0.");
    }
    // Set the left
    this.#left = left;
    // Set the top
    this.#top = top;
    // Set the width
    this.#width = width;
    // Set the height
    this.#height = height;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { left, top, width, height } })); 
    // Dispatch the bounds event
    this.dispatchEvent(new CustomEvent("bounds", { detail: { left, top, width, height } }));
  }

}

/**
 * @class DialogWindow
 * @description Represents a dialog window (Fixed size with close, help, and system menu)
 * @param handle The handle of the window
 * @param options The options for the window
 * @extends BaseWindow
 */
class DialogWindow extends BaseWindow {
  #caption     : string            = "";                       // The caption of the window (title)
  #borderIcons : DialogBorderIcons = new DialogBorderIcons();  // The border icons of the window

  /**
   * @constructor
   * @description Creates a new DialogWindow instance
   * @param handle The handle of the window
   * @param options The options for the window
   */
  constructor(handle: string, options: object) {
    // Call the parent constructor
    super(handle, options);

    // Add a change listener for the border icons
    this.#borderIcons.addEventListener("change", (e) => {
      // Get the event as a CustomEvent
      const event = e as CustomEvent;
      // Dispatch the event
      this.dispatchEvent(new CustomEvent("change", { detail: { borderIcons: event.detail } }));
    });
  }

  /**
   * caption
   * @description Returns the caption of the window (title)
   */
  get caption(): string {
    return this.#caption;
  }

  /**
   * caption
   * @description Sets the caption of the window (title)
   * @param value The caption of the window (title)
   */
  set caption(value: string) {
    // Make sure the value does not contain HTML tags or script
    if (stringContainsHTML(value)) {
      throw new WindowError("Caption cannot contain HTML or script tags.");
    }
    // Set the value
    this.#caption = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { caption: value } }));
  }

  /**
   * borderIcons
   * @description Returns the border icons of the window
   */
  get borderIcons(): DialogBorderIcons {
    return this.#borderIcons;
  }

}

/**
 * @class SingleWindow
 * @description Represents a single window (Fixed size with close, help, minimize, maximize, and system menu)
 * @param handle The handle of the window
 * @param options The options for the window
 * @extends BaseWindow
 */
class SingleWindow extends BaseWindow {
  #icon        : string            = "";                       // The icon of the window
  #caption     : string            = "";                       // The caption of the window (title)
  #borderIcons : SingleBorderIcons = new SingleBorderIcons();  // The border icons of the window

  /**
   * @constructor
   * @description Creates a new SingleWindow instance
   * @param handle The handle of the window
   * @param options The options for the window
   */
  constructor(handle: string, options: object) {
    // Call the parent constructor
    super(handle, options);

    // Add a change listener for the border icons
    this.#borderIcons.addEventListener("change", (e) => {
      // Get the event as a CustomEvent
      const event = e as CustomEvent;
      // Dispatch the event
      this.dispatchEvent(new CustomEvent("change", { detail: { borderIcons: event.detail } }));
    });
  }

  /**
   * icon
   * @description Returns the icon of the window
   */
  get icon(): string {
    return this.#icon;
  }

  /**
   * icon
   * @description Sets the icon of the window
   * @param value The icon of the window
   */
  set icon(value: string) {
    // Make sure the value is a URL or Data URI (Base64) that points to an image
    if (!isImageURLOrDataURL(value)) {
      throw new WindowError("Icon must be a URL or Data URI (Base64) that points to an image.");
    }
    // Set the value
    this.#icon = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { icon: value } }));
  }

  /**
   * caption
   * @description Returns the caption of the window (title)
   */
  get caption(): string {
    return this.#caption;
  }

  /**
   * caption
   * @description Sets the caption of the window (title)
   * @param value The caption of the window (title)
   */
  set caption(value: string) {
    // Make sure the value does not contain HTML tags or script
    if (stringContainsHTML(value)) {
      throw new WindowError("Caption cannot contain HTML or script tags.");
    }
    // Set the value
    this.#caption = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { caption: value } }));
  }

  /**
   * borderIcons
   * @description Returns the border icons of the window
   */
  get borderIcons(): SingleBorderIcons {
    return this.#borderIcons;
  }

}

/**
 * @class SizeableWindow
 * @description Represents a sizable window (Variable size with close, help, minimize, maximize, and system menu)
 * @param handle The handle of the window
 * @param options The options for the window
 * @extends BaseWindow
 */
class SizeableWindow extends BaseWindow {
  #icon        : string              = "";                       // The icon of the window
  #caption     : string              = "";                       // The caption of the window (title)
  #borderIcons : SizeableBorderIcons = new SizeableBorderIcons();  // The border icons of the window

  /**
   * @constructor
   * @description Creates a new SizeableWindow instance
   * @param handle The handle of the window
   * @param options The options for the window
   */
  constructor(handle: string, options: object) {
    // Call the parent constructor
    super(handle, options);

    // Add a change listener for the border icons
    this.#borderIcons.addEventListener("change", (e) => {
      // Get the event as a CustomEvent
      const event = e as CustomEvent;
      // Dispatch the event
      this.dispatchEvent(new CustomEvent("change", { detail: { borderIcons: event.detail } }));
    });
  }

  /**
   * icon
   * @description Returns the icon of the window
   */
  get icon(): string {
    return this.#icon;
  }

  /**
   * icon
   * @description Sets the icon of the window
   * @param value The icon of the window
   */
  set icon(value: string) {
    // Make sure the value is a URL or Data URI (Base64) that points to an image
    if (!isImageURLOrDataURL(value)) {
      throw new WindowError("Icon must be a URL or Data URI (Base64) that points to an image.");
    }
    // Set the value
    this.#icon = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { icon: value } }));
  }

  /**
   * caption
   * @description Returns the caption of the window (title)
   */
  get caption(): string {
    return this.#caption;
  }

  /**
   * caption
   * @description Sets the caption of the window (title)
   * @param value The caption of the window (title)
   */
  set caption(value: string) {
    // Make sure the value does not contain HTML tags or script
    if (stringContainsHTML(value)) {
      throw new WindowError("Caption cannot contain HTML or script tags.");
    }
    // Set the value
    this.#caption = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { caption: value } }));
  }

  /**
   * borderIcons
   * @description Returns the border icons of the window
   */
  get borderIcons(): SizeableBorderIcons {
    return this.#borderIcons;
  }

}

/**
 * @class ToolWindow
 * @description Represents a tool window (Fixed size with close)
 * @param handle The handle of the window
 * @param options The options for the window
 * @extends BaseWindow
 */
class ToolWindow extends BaseWindow {
  #caption      : string              = "";                       // The caption of the window (title)
  #borderIcons  : DialogBorderIcons   = new DialogBorderIcons();  // The border icons of the window

  /**
   * @constructor
   * @description Creates a new ToolWindow instance
   * @param handle The handle of the window
   * @param options The options for the window 
   */
  constructor(handle: string, options: object) {
    // Call the parent constructor
    super(handle, options);

    // Add a change listener for the border icons
    this.#borderIcons.addEventListener("change", (e) => {
      // Get the event as a CustomEvent
      const event = e as CustomEvent;
      // Dispatch the event
      this.dispatchEvent(new CustomEvent("change", { detail: { borderIcons: event.detail } }));
    });
  }

  /**
   * caption
   * @description Returns the caption of the window (title)
   */
  get caption(): string {
    return this.#caption;
  }

  /**
   * caption
   * @description Sets the caption of the window (title)
   * @param value The caption of the window (title)
   */
  set caption(value: string) {
    // Make sure the value does not contain HTML tags or script
    if (stringContainsHTML(value)) {
      throw new WindowError("Caption cannot contain HTML or script tags.");
    }
    // Set the value
    this.#caption = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { caption: value } }));
  }

  /**
   * borderIcons
   * @description Returns the border icons of the window
   */
  get borderIcons(): DialogBorderIcons {
    return this.#borderIcons;
  }

}

/**
 * @class SizeableToolWindow
 * @description Represents a sizable tool window (Variable size with close)
 * @param handle The handle of the window
 * @param options The options for the window
 * @extends BaseWindow
 */
class SizeableToolWindow extends BaseWindow {
  #caption     : string              = "";                        // The caption of the window (title)
  #borderIcons : SizeableBorderIcons = new SizeableBorderIcons(); // The border icons of the window

  /**
   * @constructor
   * @description Creates a new SizeableToolWindow instance
   * @param handle The handle of the window
   * @param options The options for the window
   */
  constructor(handle: string, options: object) {
    // Call the parent constructor
    super(handle, options);

    // Add a change listener for the border icons
    this.#borderIcons.addEventListener("change", (e) => {
      // Get the event as a CustomEvent
      const event = e as CustomEvent;
      // Dispatch the event
      this.dispatchEvent(new CustomEvent("change", { detail: { borderIcons: event.detail } }));
    });
  }

  /**
   * caption
   * @description Returns the caption of the window (title)
   */
  get caption(): string {
    return this.#caption;
  }

  /**
   * caption
   * @description Sets the caption of the window (title)
   * @param value The caption of the window (title)
   */
  set caption(value: string) {
    // Make sure the value does not contain HTML tags or script
    if (stringContainsHTML(value)) {
      throw new WindowError("Caption cannot contain HTML or script tags.");
    }
    // Set the value
    this.#caption = value;
    // Dispatch the event
    this.dispatchEvent(new CustomEvent("change", { detail: { caption: value } }));
  }
  
  /**
   * borderIcons
   * @description Returns the border icons of the window
   */
  get borderIcons(): SizeableBorderIcons {
    return this.#borderIcons;
  }

}

/**
 * @class CustomWindow
 * @description Represents a custom window without borders, caption, icon or system menu
 * @param handle The handle of the window
 * @param options The options for the window
 * @extends BaseWindow
 */
class CustomWindow extends BaseWindow {

  /**
   * @constructor
   * @description Creates a new CustomWindow instance
   * @param handle The handle of the window
   * @param options The options for the window
   */
  constructor(handle: string, options: object) {
    // Call the parent constructor
    super(handle, options);
  }

}

// Export the classes
export { BaseWindow as Window, DialogWindow, SingleWindow, SizeableWindow, ToolWindow, SizeableToolWindow, CustomWindow };