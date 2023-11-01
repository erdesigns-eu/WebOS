/**
 * Changelog:
 * - v1.0.0 (2023-10-28): Initial release
 */

import { createWorker } from "../../System/Utils/Other";

/**
 * @function clockWorkerFunction
 * @description The clock worker function that runs the clock worker and posts the time to the main thread
 * @returns The clock worker function
 */
const clockWorkerFunction = () => {
  
  // The function that is executed by the interval to update the clock
  const clockWorker = () => {
    const date = new Date();
    let h = date.getHours();   // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let s = date.getSeconds(); // 0 - 59

    const time12 = () => {
      let h12: any = h; // 0 - 12
      let m12: any = m; // 0 - 59
      let s12: any = s; // 0 - 59
      
      let meridiem = 'AM'; // AM or PM

      if (h12 > 12) {
        h12 -= 12;
        meridiem = 'PM';
      }

      h12 = h12 < 10 ? `0${h12}` : h12;
      m12 = m12 < 10 ? `0${m12}` : m12;
      s12 = s12 < 10 ? `0${s12}` : s12;

      return `${h12}:${m12}:${s12} ${meridiem}`;
    }

    const time24 = () => {
      let h24: any = h; // 0 - 23
      let m24: any = m; // 0 - 59
      let s24: any = s; // 0 - 59

      h24 = h24 < 10 ? `0${h24}` : h24;
      m24 = m24 < 10 ? `0${m24}` : m24;
      s24 = s24 < 10 ? `0${s24}` : s24;

      return `${h24}:${m24}:${s24}`;
    }

    postMessage({
      h12: time12(),
      h24: time24()
    });
  }

  // Run the clock worker
  setInterval(clockWorker, 1000);
};

/**
 * The Clock class
 * @class Clock
 * @description The custom element that represents the WebOS Taskbar clock
 * @extends HTMLElement
 */
class Clock extends HTMLElement {

  #textElement  : HTMLElement|null = null; // The clock text element
  #clockWorker  : Worker|null      = null; // The clock worker

  static elementName = "web-os-taskbar-clock";

  _format     : string = "24h";       // The time format
  _fontSize   : string = "inherit";   // The font size
  _fontName   : string = "inherit";   // The font name
  _fontWeight : string = "inherit";   // The font weight
  _fontColor  : string = "white";     // The font color
  
  /**
   * Creates a new Clock HTML element
   * @constructor
   * @description Creates a new Clock HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // Create the shadow DOM
    const shadowRoot = this.attachShadow({ mode: "closed" });
    // Create the clock element
    const clockElement = document.createElement("div");
    clockElement.style.position         = "fixed";
    clockElement.style.top              = "0";
    clockElement.style.left             = "0";
    clockElement.style.width            = "100%";
    clockElement.style.height           = "100%";
    clockElement.style.pointerEvents    = "none";
    clockElement.style.display          = "flex";
    clockElement.style.alignItems       = "center";
    clockElement.style.justifyContent   = "center";
    // Create the clock text element
    const clockTextElement = document.createElement("span");
    clockTextElement.style.fontFamily   = this._fontName;
    clockTextElement.style.fontWeight   = this._fontWeight;
    clockTextElement.style.fontSize     = this._fontSize;
    clockTextElement.style.color        = this._fontColor;
    clockTextElement.style.textShadow   = "0px 0px 5px black";
    // Set the clock text element
    clockElement.appendChild(clockTextElement);
    // Set the clock text element
    this.#textElement = clockTextElement;
    // Add the clock element to the shadow DOM
    shadowRoot.appendChild(clockElement);
    // Create the clock worker
    const clockWorker = createWorker(clockWorkerFunction);
    // Add the message event listener
    clockWorker.addEventListener("message", (e: MessageEvent) => {
      if (this._format === "12h") {
        this.#textElement!.innerHTML = e.data.h12;
      } else {
        this.#textElement!.innerHTML = e.data.h24;
      }
    });
    // Set the clock worker
    this.#clockWorker = clockWorker;
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["format", "font-size", "font-name", "font-weight", "font-color"];
  }

  /**
   * Sets the format of the clock
   * @method setFormat
   * @description Sets the format of the clock
   * @param format The format to set
   */
  #setFormat(format: string) {
    this._format = format;
  }

  /**
   * Sets the font size of the clock
   * @method setFontSize
   * @description Sets the font size of the clock
   * @param fontSize The font size to set
   */
  #setFontSize(fontSize: string) {
    this._fontSize = fontSize;
    this.#textElement!.style.fontSize = fontSize;
  }

  /**
   * Sets the font name of the clock
   * @method setFontName
   * @description Sets the font name of the clock
   * @param fontName The font name to set
   */
  #setFontName(fontName: string) {
    this._fontName = fontName;
    this.#textElement!.style.fontFamily = fontName;
  }

  /**
   * Sets the font weight of the clock
   * @method setFontWeight
   * @description Sets the font weight of the clock
   * @param fontWeight The font weight to set
   */
  #setFontWeight(fontWeight: string) {
    this._fontWeight = fontWeight;
    this.#textElement!.style.fontWeight = fontWeight;
  }

  /**
   * Sets the font color of the clock
   * @method setFontColor
   * @description Sets the font color of the clock
   * @param fontColor The font color to set
   */
  #setFontColor(fontColor: string) {
    this._fontColor = fontColor;
    this.#textElement!.style.color = fontColor;
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
    // Stop the clock worker
    this.#clockWorker!.terminate();
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
      case "format":
        this.#setFormat(newValue);
        break;
      case "font-size":
        this.#setFontSize(newValue);
        break;
      case "font-name":
        this.#setFontName(newValue);
        break;
      case "font-weight":
        this.#setFontWeight(newValue);
        break;
      case "font-color":
        this.#setFontColor(newValue);
        break;
    }
  }

  /**
   * Clock format getter
   * @getter
   */
  get format(): string {
    return this._format;
  }

  /**
   * Clock format setter
   * @setter
   */
  set format(value: string) {
    this._format = value;
    this.setAttribute("format", value);
  }

  /**
   * Clock font size getter
   * @getter
   */
  get fontSize(): string {
    return this._fontSize;
  }

  /**
   * Clock font size setter
   * @setter
   */
  set fontSize(value: string) {
    this._fontSize = value;
    this.setAttribute("font-size", value);
  }

  /**
   * Clock font name getter
   * @getter
   */
  get fontName(): string {
    return this._fontName;
  }

  /**
   * Clock font name setter
   * @setter
   */
  set fontName(value: string) {
    this._fontName = value;
    this.setAttribute("font-name", value);
  }

  /**
   * Clock font weight getter
   * @getter
   */
  get fontWeight(): string {
    return this._fontWeight;
  }

  /**
   * Clock font weight setter
   * @setter
   */
  set fontWeight(value: string) {
    this._fontWeight = value;
    this.setAttribute("font-weight", value);
  }

  /**
   * Clock font color getter
   * @getter
   */
  get fontColor(): string {
    return this._fontColor;
  }

  /**
   * Clock font color setter
   * @setter
   */
  set fontColor(value: string) {
    this._fontColor = value;
    this.setAttribute("font-color", value);
  }

}

// Export the Clock class as a custom element
export { Clock };