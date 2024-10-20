import { SystemManager } from "./System/System";

/**
 * This is a global declaration file.
 * It is used to declare global variables and types.
 */

/**
 * Global variable declaration.
 */
declare global {

  /**
   * Window interface declaration.
   * This is used to declare the custom properties and methods that are added to the window object.
   * @interface Window
   * @description The interface that represents the window object
   */
  interface Window {
    system: SystemManager;
  }
  
}