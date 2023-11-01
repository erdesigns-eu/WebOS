/**
 * Changelog:
 * - v1.0.0 (2023-11-01): Initial release
 */

import { Screensaver } from "./Index";

/**
 * Import the screensaver logo image
 * @constant screensaverLogo
 */
import screensaverLogo from "../../../assets/screensaver-logo.png";

/**
 * The interval for the screensaver (in milliseconds)
 * @constant screensaverInterval
 */
const screensaverInterval = 3000;

/**
 * The Logo Screensaver class
 * @class Logo
 * @description The class that represents the Logo screensaver (shows the WebOS logo at various positions on the screen)
 * @extends Screensaver
 */
class Logo extends Screensaver {
  #interval : NodeJS.Timeout|null     = null; // The interval ID/Handle
  #x        : number                  = 0;    // The X position
  #y        : number                  = 0;    // The Y position
  #logo     : HTMLImageElement|null   = null; // The logo image

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    // Call the super constructor
    super(canvas, context);
    // Create the logo image
    this.#logo = new Image();
    // Set the logo image source
    this.#logo.src = screensaverLogo;
    // Set the X and Y position to the center of the canvas as the default position
    this.#x = (this.canvas!.width / 2) - (this.#logo.width / 2);
    this.#y = (this.canvas!.height / 2) - (this.#logo.height / 2);
  }

  /**
   * Starts the animation
   * @override
   */
  start(): void {
    // Call the super method
    super.start();
    // Set the interval
    this.#interval = setInterval(() => this.draw(), screensaverInterval);
    // Draw the animation
    this.draw();
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
    // Clear the canvas
    this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Fill the canvas with the background color
    this.context!.fillStyle = "#000000";
    this.context!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Draw the logo
    this.context!.drawImage(this.#logo as HTMLImageElement, this.#x, this.#y);
    // Create a random x position, but make sure the logo doesn't go off the screen
    this.#x = Math.floor(Math.random() * (this.canvas!.width - this.#logo!.width));
    // Create a random y position, but make sure the logo doesn't go off the screen
    this.#y = Math.floor(Math.random() * (this.canvas!.height - this.#logo!.height));
  }

  /**
   * Gets the options for the animation
   * @override
   */
  getOptions(): any {
    return null;
  }

  /**
   * Sets the options for the animation
   * @override
   * @param options The options to set
   */
  setOptions(options: any): void {
    if (options) {
      // Nothing to do here
    }
  }

}

// Export the class
export { Logo };