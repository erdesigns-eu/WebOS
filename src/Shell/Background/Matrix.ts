/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

import { Background } from "./Index";

/**
 * Default options for the Matrix animation
 * @constant {Object} defaultOptions
 * @property {string} characters The characters to use  
 * @property {number} fontSize The font size to use
 * @property {string} fontName The font name to use
 * @property {number} fps The FPS to use
 * @property {string} color The color to use
 * @property {string} backgroundColor The background color to use
 */
const defaultOptions = {
  characters: "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅛㅠ",  // Random Korean characters (I don't know what they mean) because they look like the Matrix characters
  fontSize: 16,                                 // The font size to use           
  fontName: "monospace",                        // The font name to use
  fps: 20,                                      // The FPS to use (the higher the FPS, the faster the animation - and the more CPU it uses)
  color: "#0F0",                                // The color to use
  backgroundColor: "rgba(0, 0, 0, 0.05)"        // The background color to use
};

type MatrixOptions = typeof defaultOptions;

/**
 * The Matrix Background class
 * @class Matrix
 * @description The class that represents the Matrix background animation
 * @extends Background
 */
class Matrix extends Background {

  #options    : MatrixOptions       = defaultOptions; // The options for the animation
  #interval   : NodeJS.Timeout|null = null;           // The interval ID/Handle
  #characters : string[]            = [];             // The characters to use
  #columns    : number              = 0;              // The number of columns
  #drops      : number[]            = [];             // The drops array

  /**
   * Creates a new Background instance
   * @param canvas The canvas element
   * @param context The canvas context
   * @constructor 
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options?: { characters?: string, fontSize?: number, fontName?: string, fps?: number, color?: string, backgroundColor?: string }) {
    // Call the super constructor
    super(canvas, context);
    // Set the options
    this.#options = { ...defaultOptions, ...options };
  }

  /**
   * Starts the animation
   * @override
   */
  start(): void {
    // Call the super method
    super.start();
    // Split the characters
    this.#characters = this.#options.characters.split("");
    // Calculate the number of columns
    this.#columns = this.canvas!.width / this.#options.fontSize;
    // Clear the drops array
    this.#drops = [];
    // Initialize the drops
    for(var x = 0; x < this.#columns; x++) {
      this.#drops[x] = 1;
    }
    // Draw the background
    // @ts-expect-error
    this.context!.fillStyle = window.system.utility.colorToRGBA(this.#options.backgroundColor, 1);
    this.context!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Update the background color to be transparent (to make the animation look better)
    // @ts-expect-error
    this.#options.backgroundColor = window.system.utility.colorToRGBA(this.#options.backgroundColor, 0.05);
    // Set the interval
    this.#interval = setInterval(() => this.draw(), 1000 / this.#options.fps);
  }

  /**
   * Stops the animation
   * @override
   */
  stop(): void {
    // Call the super method
    super.stop();
    // Clear the interval
    if (this.#interval) {
      clearInterval(this.#interval);
    }
  }

  /**
   * Draws the animation
   * @override
   */
  draw(): void {
    // Set the background color
    this.context!.fillStyle = this.#options.backgroundColor;
    // Draw the background
    this.context!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Set the font color
    this.context!.fillStyle = this.#options.color;
    // Set the font size and font name
    this.context!.font = `${this.#options.fontSize}px ${this.#options.fontName}`;
    // Loop over the drops
    for (var i = 0; i < this.#drops.length; i++) {
      // Random character to print
      const char = this.#characters[Math.floor(Math.random() * this.#characters.length)];
      // Draw the character
      this.context!.fillText(char, i * this.#options.fontSize, this.#drops[i] * this.#options.fontSize);
      // Sending the drop back to the top randomly after it has crossed the screen
      if (this.#drops[i] * this.#options.fontSize > this.canvas!.height && Math.random() > 0.975) {
        this.#drops[i] = 0;
      }
      // Incrementing Y coordinate
      this.#drops[i]++;
    }
  }

  /**
   * Sets the options for the animation
   * @override
   */
  setOptions(options: any): void {
    // Set the options
    this.#options = { ...defaultOptions, ...options };
    // Restart the animation if it's active 
    if (this.active) {
      this.stop();
      this.start();
    }
  }

  /**
   * Gets the options for the animation
   * @override
   */
  getOptions(): any {
    // Return the options
    return this.#options;
  }

}

// Export the Matrix class
export { Matrix };