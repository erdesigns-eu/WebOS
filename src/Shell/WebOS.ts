/**
 * Changelog:
 * - v1.0.0 (2023-10-21): Initial release
 */

import { SystemManager } from "../System/System";
import { Kernel } from "../System/Kernel/Kernel";

import { Background } from "./Background/Index";
import { Matrix } from "./Background/Matrix";
import { Mesh } from "./Background/Mesh";
import { Orbs } from "./Background/Orbs";

/**
 * The WebOSError class
 * @class WebOSError
 * @description The custom error class for WebOS errors
 * @extends Error
 */
class WebOSError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebOSError";
  }
}

/**
 * The WebOS class
 * @class WebOS
 * @description The custom element that represents the WebOS shell
 * @extends HTMLElement
 */
class WebOS extends HTMLElement {

  #backgroundElement : HTMLCanvasElement|null   = null;   // The background element
  #animation         : Background|null          = null;   // The animation instance
  #resizeObserver    : ResizeObserver|null      = null;   // The resize observer

  static elementName = "web-os";

  _backgroundType               : string = "color";       // The type of background (color, image or animated)
  _backgroundColor              : string = "transparent"; // The background color
  _backgroundImage              : string = "";            // The background image
  _backgroundSize               : string = "cover";       // The background size
  _backgroundPosition           : string = "center";      // The background position
  _backgroundAnimation          : string = "";            // The background animation
  _backgroundAnimationOptions   : any    = {};            // The animation options
  _backgroundAnimationDebounce  : number = 100;           // The animation debounce

  _title                        : string = "";            // The title of the Webpage (used in the title bar)
  _icon                         : string = "";            // The icon  of the Webpage (used in the title bar)
  
  /**
   * Creates a new WebOS HTML element
   * @constructor
   * @description Creates a new WebOS HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Create the shadow DOM
    const shadowRoot = this.attachShadow({ mode: "closed" });
    // Create the background element
    this.#backgroundElement                           = document.createElement("canvas");
    this.#backgroundElement.width                     = innerWidth;
    this.#backgroundElement.height                    = innerHeight;
    // Set the background element"s styles
    this.#backgroundElement.style.position            = "absolute";
    this.#backgroundElement.style.top                 = "0";
    this.#backgroundElement.style.left                = "0";
    this.#backgroundElement.style.width               = "100%";
    this.#backgroundElement.style.height              = "100%";
    this.#backgroundElement.style.zIndex              = "-100";
    this.#backgroundElement.style.backgroundColor     = this._backgroundColor;
    this.#backgroundElement.style.backgroundSize      = this._backgroundSize;
    this.#backgroundElement.style.backgroundImage     = this._backgroundImage.length ? `url(${this._backgroundImage})` : "";
    this.#backgroundElement.style.backgroundPosition  = this._backgroundPosition;
    // Add a resize observer to the background element to resize it accordingly when the window is resized
    // @ts-expect-error
    this.#resizeObserver = new ResizeObserver(this.system.utility.debounce(this.#handleResize.bind(this), this._backgroundAnimationDebounce));
    this.#resizeObserver.observe(this);
    // Add the background element to the shadow DOM
    shadowRoot.appendChild(this.#backgroundElement);
    // Create a default slot element
    const slotElement = document.createElement("slot");
    // Add the slot element to the shadow DOM
    shadowRoot.appendChild(slotElement);
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["background-type", "background-color", "background-image", "background-size", "background-position", "background-animation", "background-animation-options", "background-animation-debounce", "title", "icon"];
  }

  /**
   * Handles the resize event
   * @method handleResize
   * @description Handles the resize event and resizes the animation element accordingly
   */
  #handleResize(entries: ResizeObserverEntry[]) {
    if (entries.length) {
      const { width, height } = entries[0].contentRect;
      this.#backgroundElement!.width = width;
      this.#backgroundElement!.height = height;
      if (this.#animation) {
        this.#animation.stop();
        this.#animation.start();
      }
    }
  }

  /**
   * Sets the background type
   * @method setBackgroundType
   */
  #setBackgroundType(type: string) {
    switch (type) {
      case "color":
        this.setAttribute("background-color", this._backgroundColor);
        this.setAttribute("background-image", "");
        if (this.#animation) {
          this.#animation.stop();
        }
        break;
      case "image":
        this.setAttribute("background-color", "");
        this.setAttribute("background-image", this._backgroundImage);
        if (this.#animation) {
          this.#animation.stop();
        }
        break;
      case "animated":
        this.setAttribute("background-image", "");
        if (this.#animation) {
          this.#animation.start();
        }
        break;
      default:
        throw new WebOSError(`Invalid background type: ${type}`);
    }
  }

  /**
   * Sets the background animation
   * @method setBackgroundAnimation
   */
  #setBackgroundAnimation(name: string) {
    if (this.#animation) {
      this.#animation.stop();
      this.#animation = null;
    }
    if (this._backgroundType !== "animated") {
      this.setAttribute("background-type", "animated");
    }
    switch (name) {
      case "matrix":
        this.#animation = new Matrix(this.#backgroundElement!, this.#backgroundElement!.getContext("2d")!);
        break;
      case "mesh":
        this.#animation = new Mesh(this.#backgroundElement!, this.#backgroundElement!.getContext("2d")!);
        break;
      case "orbs":
        this.#animation = new Orbs(this.#backgroundElement!, this.#backgroundElement!.getContext("2d")!);
        break;
      default:
        throw new WebOSError(`Invalid background animation: ${name}`);
    }
    this.#animation?.start();
  }

  /**
   * Sets the background color
   * @method setBackgroundColor
   */
  #setBackgroundColor(color: string) {
    // @ts-expect-error
    if (!window.system.utility.isValidColor) {
      throw new WebOSError("Invalid color! Please use a valid CSS (HEX, RGB, RGBA) color.");
    }
    if (this._backgroundType !== "color") {
      this.setAttribute("background-type", "color");
    }
    this.#backgroundElement!.style.backgroundColor = color;
  }

  /**
   * Sets the background image
   * @method setBackgroundImage
   */
  #setBackgroundImage(image: string) {
    if (this._backgroundType !== "image") {
      this.setAttribute("background-type", "image");
    }
    this.#backgroundElement!.style.backgroundImage = `url(${image})`;
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    this._title = document.title;
    // @ts-expect-error
    this._icon  = document.querySelector("link[rel='icon']")?.href || "";
  }

  /**
   * The disconnectedCallback method
   * @method
   * @description The disconnectedCallback method is called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Remove the resize observer
    this.#resizeObserver!.disconnect();
    // Stop the animation
    if (this.#animation) {
      this.#animation.stop();
      this.#animation = null;
    }
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
      case "background-type":
        this.#setBackgroundType(newValue);
        break;
      case "background-color":
        this.#setBackgroundColor(newValue);
        break;
      case "background-image":
        this.#setBackgroundImage(newValue);
        break;
      case "background-size":
        this.#backgroundElement!.style.backgroundSize = newValue;
        break;
      case "background-position":
        this.#backgroundElement!.style.backgroundPosition = newValue;
        break;
      case "background-animation":
        this.#setBackgroundAnimation(newValue);
        break;
      case "background-animation-options":
        this.#animation?.setOptions(JSON.parse(newValue));
        break;
      case "background-animation-debounce":
        this._backgroundAnimationDebounce = parseInt(newValue);
        break;
      case "title":
        if (this.kernel.checkModuleIsAvailable("Document")) {
          this.kernel.setModuleValue("Document", "title", newValue);
        }
        break;
      case "icon":
        if (this.kernel.checkModuleIsAvailable("Document")) {
          this.kernel.setModuleValue("Document", "icon", newValue);
        }        
        break;
    }
  }

  /**
   * Background type getter
   * @getter
   */
  get backgroundType(): string {
    return this._backgroundType;
  }

  /**
   * Background type setter
   * @setter
   */
  set backgroundType(value: string) {
    this._backgroundType = value;
    this.setAttribute("background-type", value);
  }

  /**
   * Background color getter
   * @getter
   */
  get backgroundColor(): string {
    return this._backgroundColor;
  }

  /**
   * Background color setter
   * @setter
   */
  set backgroundColor(value: string) {
    this._backgroundColor = value;
    this.setAttribute("background-color", value);
  }

  /**
   * Background image getter
   * @getter
   */
  get backgroundImage(): string {
    return this._backgroundImage;
  }

  /**
   * Background image setter
   * @setter
   */
  set backgroundImage(value: string) {
    this._backgroundImage = value;
    this.setAttribute("background-image", value);
  }

  /**
   * Background size getter
   * @getter
   */
  get backgroundSize(): string {
    return this._backgroundSize;
  }

  /**
   * Background size setter
   * @setter
   */
  set backgroundSize(value: string) {
    this._backgroundSize = value;
    this.setAttribute("background-size", value);
  }

  /**
   * Background position getter
   * @getter
   */
  get backgroundPosition(): string {
    return this._backgroundPosition;
  }

  /**
   * Background position setter
   * @setter
   */
  set backgroundPosition(value: string) {
    this._backgroundPosition = value;
    this.setAttribute("background-position", value);
  }

  /**
   * Background animation getter
   * @getter
   */
  get backgroundAnimation(): string {
    return this._backgroundAnimation;
  }

  /**
   * Background animation setter
   * @setter
   */
  set backgroundAnimation(value: string) {
    this._backgroundAnimation = value;
    this.setAttribute("background-animation", value);
  }

  /**
   * Background animation options getter
   * @getter
   */
  get backgroundAnimationOptions(): any {
    if (this.#animation) {
      return this.#animation.getOptions();
    }
    return this._backgroundAnimationOptions;
  }

  /**
   * Background animation options setter
   * @setter
   */
  set backgroundAnimationOptions(value: any) {
    this._backgroundAnimationOptions = value;
    this.setAttribute("background-animation-options", JSON.stringify(value));
  }

  /**
   * Background animation debounce getter
   * @getter
   */
  get backgroundAnimationDebounce(): number {
    return this._backgroundAnimationDebounce;
  }

  /**
   * Background animation debounce setter
   * @setter
   */
  set backgroundAnimationDebounce(value: number) {
    this._backgroundAnimationDebounce = value;
    this.setAttribute("background-animation-debounce", value.toString());
  }

  /**
   * Animation getter
   * @getter
   */
  get animation(): Background|null {
    return this.#animation;
  }

  /**
   * Animations getter (returns an array of available animations)
   * Note: Update this getter when adding new animations
   * @getter
   */
  get animations(): string[] {
    return ["matrix", "mesh", "orbs"];
  }

  /**
   * Title getter
   * @getter
   */
  get title(): string {
    return this._title;
  }

  /**
   * Title setter
   * @setter
   */
  set title(value: string) {
    this._title = value;
    this.setAttribute("title", value);
  }

  /**
   * Icon getter
   * @getter
   */
  get icon(): string {
    return this._icon;
  }

  /**
   * Icon setter
   * @setter
   */
  set icon(value: string) {
    this._icon = value;
    this.setAttribute("icon", value);
  }

  /**
   * Returns the SystemManager instance
   */
  get system(): SystemManager {
    return SystemManager.getInstance();
  }

  /**
   * Returns the Kernel instance
   * @getter
   */
  get kernel(): Kernel {
    // @ts-expect-error
    return window.system.kernel as Kernel;
  }

}

// Export the WebOS class as a custom element
export { WebOS };