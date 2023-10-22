/**
 * Changelog:
 * - v1.0.0 (2023-10-22): Initial release
 */

import { WebOS } from "../../Shell/WebOS";

/**
 * The ShellError class
 * @class ShellError
 * @description The class that represents the ShellError class
 */
class ShellError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShellError";
  }
}

/**
 * The Shell class
 * @class Shell
 * @description The class that represents the Shell class (the WebOS shell)
 * @static
 */
class Shell {

  /**
   * Creates a new Shell instance
   * @constructor
   */
  constructor() {
    throw new ShellError(`The ${this.constructor.name} class may not be instantiated! Use static methods instead!`);
  }

  /**
   * The shellElement method
   * @method shellElement
   * @description The shellElement method returns the WebOS shell element (the <web-os> element)
   */
  static #shellElement(): WebOS {
    return document.querySelector("web-os")!;
  }

  /**
   * Sets the shell background image
   * @method setBackgroundImage
   * @param image The image to set as the background image
   */
  static setBackgroundImage(image: string): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundImage = image;
    }
  }

  /**
   * Sets the shell background color
   * @method setBackgroundColor
   * @param color The color to set as the background color
   */
  static setBackgroundColor(color: string): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundColor = color;
    }
  }

  /**
   * Sets the shell background animation
   * @method setBackgroundAnimation
   * @param animation The animation to set as the background animation
   */
  static setBackgroundAnimation(animation: string): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundAnimation = animation;
    }
  }

  /**
   * Sets the shell background animation options
   * @method setBackgroundAnimationOptions
   * @param options The options to set as the background animation options
   */
  static setBackgroundAnimationOptions(options: {[key: string]: any}): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundAnimationOptions = options;
    }
  }

  /**
   * Sets the shell background type
   * @method setBackgroundType
   * @param type The type to set as the background type
   */
  static setBackgroundType(type: string): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundType = type;
    }
  }

  /**
   * Sets the shell background size
   * @method setBackgroundSize
   * @param size The size to set as the background size
   */
  static setBackgroundSize(size: string): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundSize = size;
    }
  }

  /**
   * Sets the shell background position
   * @method setBackgroundPosition
   * @param position The position to set as the background position
   */
  static setBackgroundPosition(position: string): void {
    const shell = this.#shellElement();
    if (shell) {
      shell.backgroundPosition = position;
    }
  }

}

// Export the Shell class
export { Shell };