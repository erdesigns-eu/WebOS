/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

import { Background } from "./Index";

const defaultOptions = {
  orbs            : 150,                  // The number of orbs
  color           : "rgb(255, 255, 255)", // The color to use 
  backgroundColor : "rgb(0, 0, 0)",       // The background color to use
  speed           : 10,                   // The speed of the orbs
  radius          : 40,                   // The radius of the orbs
};

type OrbsOptions = typeof defaultOptions;

/**
 * The Orb class
 * @class Orb
 * @description The class that represents an orb
 * @private
 */
class Orb {
  #radius   : number = 0;   // The radius of the orb
  #speed    : number = 0;   // The speed of the orb
  #width    : number = 0;   // The width of the orb
  #xPos     : number = 0;   // The X position of the orb
  #yPos     : number = 0;   // The Y position of the orb
  #opacity  : number = 0;   // The opacity of the orb
  #counter  : number = 0;   // The counter of the orb
  #sign     : number = 0;   // The sign of the orb
  #color    : string = "";  // The color of the orb

  /**
   * Creates a new Orb instance
   * @param radius The radius of the orb
   * @param speed The speed of the orb
   * @param width The width of the orb
   * @param xPos The X position of the orb
   * @param yPos The Y position of the orb
   * @constructor
   */
  constructor(radius: number, speed: number, width: number, xPos: number, yPos: number, color: string) {
    this.#radius  = radius;
    this.#speed   = speed;
    this.#width   = width;
    this.#xPos    = xPos;
    this.#yPos    = yPos;
    this.#opacity = .01 + Math.random() * .5;
    this.#counter = 0;
    this.#sign    = Math.floor(Math.random() * 3) === 1 ? -1 : 1;
    this.#color   = color;
  }

  /**
   * Updates the orb
   * @param context The canvas context
   */
  update(context: CanvasRenderingContext2D) {
    // Update the counter
    this.#counter += this.#sign * this.#speed;
    // Start a new path
    context.beginPath();
    // Add the arc to the path
    context.arc(
      this.#xPos + Math.cos(this.#counter / 50) * this.#radius, 
      this.#yPos + Math.sin(this.#counter / 50) * this.#radius, 
      this.#width, 0, Math.PI * 2, false
    );
    // Close the path
    context.closePath();
    // Set the fill style
    // @ts-expect-error
    context.fillStyle = window.system.utility.colorToRGBA(this.#color, this.#opacity);
    // Fill the path
    context.fill();
  }
}

/**
 * The Orbs Background class
 * @class Orbs
 * @description The class that represents the Orbs background animation
 * @extends Background
 */
class Orbs extends Background {

  #options : OrbsOptions = defaultOptions; // The options for the animation
  #orbs    : Orb[]        = [];            // The orbs array

  /**
   * Creates a new Background instance
   * @param canvas The canvas element
   * @param context The canvas context
   * @constructor 
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, options?: { orbs?: number, backgroundColor?: string, color?: string, speed?: number, radius?: number }) {
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
    // Update the orbs
    for (var i = 0; i < this.#options.orbs; i++) {
      var randomX = Math.round(-100 + Math.random() * (this.canvas!.width + 100));
      var randomY = Math.round(-100 + Math.random() * (this.canvas!.height + 100));
      var speed   = .2 + Math.random() * (this.#options.speed / 10);
      var size    = 1 + Math.random() * this.#options.radius;
      this.#orbs.push(new Orb(this.#options.radius, speed, size, randomX, randomY, this.#options.color));
    }
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
  }

  /**
   * Draws the animation
   * @override
   */
  draw(): void {
    if (this.active) {
      window.requestAnimationFrame(this.draw.bind(this));
    } else {
      // Clear the canvas
      this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      return;
    }
    // Clear the canvas
    this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Set the background color
    this.context!.fillStyle = this.#options.backgroundColor;
    // Draw the background
    this.context!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    // Update the orbs
    for (var i = 0; i < this.#orbs.length; i++) {
      this.#orbs[i].update(this.context!);
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

// Export the Orbs class
export { Orbs };