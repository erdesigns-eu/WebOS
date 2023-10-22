/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

/**
 * The BackgroundAnimation class
 * @class BackgroundAnimation
 * @description The class that represents a background animation
 */
class BackgroundAnimation {
  #canvas  : HTMLCanvasElement|null         = null; // The canvas element
  #context : CanvasRenderingContext2D|null  = null; // The canvas context
  #active  : boolean                        = false; // Whether the animation is active or not

  /**
   * Creates a new BackgroundAnimation instance
   * @param canvas The canvas element
   * @param context The canvas context
   * @constructor 
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.#canvas = canvas;
    this.#context = context;
  }

  /**
   * Starts the animation
   */
  start(): void {
    // Set the active flag to true
    this.#active = true;
  }

  /**
   * Stops the animation
   */
  stop(): void {
    // Set the active flag to false
    this.#active = false;
    // Clear the canvas
    this.#context?.clearRect(0, 0, this.#canvas?.width || 0, this.#canvas?.height || 0);
  }

  /**
   * Draws the animation
   */
  draw(): void {
    // TODO: Implement
  }

  /**
   * Sets the options for the animation
   * @param options The options to set
   */
  setOptions(options: any): void {
    if (options) {
      // TODO: Implement
    }
  }

  /**
   * Gets the options for the animation
   * @returns The options for the animation
   */
  getOptions(): any {
    // TODO: Implement
    return {};
  }

  /**
   * Gets whether the animation is active or not
   * @returns Whether the animation is active or not
   */
  get active(): boolean {
    return this.#active;
  }

  /**
   * Gets the canvas element
   * @returns The canvas element
   */
  get canvas(): HTMLCanvasElement|null {
    return this.#canvas;
  }

  /**
   * Gets the canvas context
   * @returns The canvas context
   */
  get context(): CanvasRenderingContext2D|null {
    return this.#context;
  }
}

// Export the BackgroundAnimation class
export { BackgroundAnimation };