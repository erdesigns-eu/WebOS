/**
 * Changelog:
 * - v1.0.0 (2023-10-28): Initial release
 */

import { createWorker } from "../../System/Utils/Other";

/**
 * The clockSize type
 * @type clockSize
 * @description The clockSize type represents the size of the clock.
 */
type clockSize = "small" | "medium" | "large" | "xlarge";

/**
 * The clockFormat type
 * @type clockFormat
 * @description The clockFormat type represents the format of the clock.
 */
type clockFormat = "12h" | "24h";

/**
 * The dateFormats type
 * @type dateFormats
 * @description The dateFormats type represents the format of the date.
 */
type dateFormat = "short" | "medium" | "long" | "full" | string;

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
      h24: time24(),
      date: date,
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

  #clockWorker : Worker|null = null; // The clock worker
  static elementName = "web-os-taskbar-clock";

  _size   : clockSize   = "medium"; // The size of the clock
  
  /**
   * Creates a new Clock HTML element
   * @constructor
   * @description Creates a new Clock HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
    // 
    this.innerHTML = `<div><span id="time"></span><span id="date"></span></div>`;
    // Create the clock worker
    const clockWorker = createWorker(clockWorkerFunction);
    // Add the message event listener
    clockWorker.addEventListener("message", (e: MessageEvent) => {
      if (this.getAttribute("time-format") === "12h") {
        (this.querySelector("#time") as HTMLElement).innerText = e.data.h12;
      } else {
        (this.querySelector("#time") as HTMLElement).innerText = e.data.h24;
      }
      (this.querySelector("#date") as HTMLElement).innerText = this.#formatDate(e.data.date);
    });
    // Set the clock worker
    this.#clockWorker = clockWorker;
    // Add aria-label attribute
    this.setAttribute("aria-label", "Clock");
    // Add aria-role attribute
    this.setAttribute("role", "timer");
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["time-format", "date-format", "size"];
  }

  /**
   * The formatDate method
   * @method formatDate
   * @description The formatDate method formats a date object to a string based on the format provided.
   */
  #formatDate(date: Date) {
    const format = this.getAttribute("date-format") || "short" as dateFormat;
    // Map with options for the Intl.DateTimeFormat
    const optionsMap: any = {
      'short': { year: 'numeric', month: 'numeric', day: 'numeric' },
      'medium': { year: 'numeric', month: 'short', day: 'numeric' },
      'long': { year: 'numeric', month: 'long', day: 'numeric' },
      'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    };
    // Check if the format is in the optionsMap
    if (optionsMap[format]) {
      return new Intl.DateTimeFormat('default', optionsMap[format]).format(date);
    } else 
    // Check if the format is a custom format
    if (format) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return format
        .replace('dd', day)
        .replace('mm', month)
        .replace('yyyy', year);
    } else {
      // Return the default format
      return date.toLocaleDateString();
    }
  }

  /**
   * Initializes the clock
   * @method initializeClock
   * @description Initializes the clock and sets the time to the current time
   */
  #initializeClock() {
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

    if (this.getAttribute("time-format") === "12h") {
      (this.querySelector("#time") as HTMLElement).innerText = time12();
    } else {
      (this.querySelector("#time") as HTMLElement).innerText = time24();
    }
    (this.querySelector("#date") as HTMLElement).innerText = this.#formatDate(date);
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    this.#initializeClock();
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
      case "time-format":
        this.#initializeClock();
        break;
      case "date-format":
        this.#initializeClock();
        break;
      case "size":
        this._size = newValue as clockSize;
        break;
    }
  }

  /**
   * Clock time format getter
   * @getter
   */
  get timeFormat(): clockFormat {
    return this.getAttribute("time-format") as clockFormat;
  }

  /**
   * Clock time format setter
   * @setter
   */
  set timeFormat(value: clockFormat) {
    this.setAttribute("time-format", value);
  }

  /**
   * Clock date format getter
   * @getter
   */
  get dateFormat(): dateFormat {
    return this.getAttribute("date-format") as dateFormat;
  }

  /**
   * Clock date format setter
   * @setter
   */
  set dateFormat(value: dateFormat) {
    this.setAttribute("date-format", value);
  }

}

// Export the Clock class as a custom element
export { Clock };