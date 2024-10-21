/**
 * Changelog:
 * - v1.0.0 (2023-11-03): Initial release
 */

/**
 * Import the Material Design Icons
 * @description Import all the Material Design Icons as raw strings
 */
const mdiIcons = import.meta.glob("/node_modules/@material-design-icons/svg/**/*.svg", { as: "raw", import: "default" });

/**
 * The materialDesignIconError class
 * @class materialDesignIconError
 * @description The materialDesignIconError class represents an error that occurs when the Material Design Icon is invalid.
 */
class MaterialDesignIconError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MaterialDesignIconError";
  }
}

/**
 * The materialDesignIconStyle type
 * @type materialDesignIconStyle
 * @description The materialDesignIconStyle type represents the style of the Material Design Icon.
 */
type materialDesignIconStyle = "filled" | "outlined" | "round" | "sharp" | "two-tone";

/**
 * The MaterialDesignIcon class
 * @class MaterialDesignIcon
 * @description The custom element that represents the (SVG) Material Design Icon
 * @extends HTMLElement
 */
class MaterialDesignIcon extends HTMLElement {

  #oldStyle : materialDesignIconStyle = "filled"; // The old style of the Material Design Icon
  #oldIcon  : string                  = "";       // The old icon of the Material Design Icon

  static elementName = "web-os-mdi"; // The name of the custom element (used for registering the custom element)
  
  /**
   * Creates a new Taskbar HTML element
   * @constructor
   * @description Creates a new Taskbar HTML element
   * @extends HTMLElement
   */
  constructor() {
    // Call the super constructor
    super();
  }

  /**
   * Updates the MDI Icon
   * @method updateIcon
   * @description Updates the MDI Icon (called when the style or icon attribute changes)
   */
  #updateIcon() {
    // Get the style and icon attributes
    let style = this.getAttribute("mdi-style") || "filled" as materialDesignIconStyle;
    let icon  = this.getAttribute("mdi-icon");
    const iconPath = `/node_modules/@material-design-icons/svg/${style}/${icon}.svg`;

    // Convert the style and icon attributes to lowercase
    style = style.toLowerCase() as materialDesignIconStyle;
    icon  = icon!.toLowerCase();

    // Check if we need to update the icon, if not, return early
    if (this.#oldStyle === style && this.#oldIcon === icon) {
      return;
    } 
    // Otherwise, update the old style and icon properties to the new style and icon properties.
    else {
      this.#oldStyle = style as materialDesignIconStyle;
      this.#oldIcon  = icon as string;
    }

    /**
     * The handleError method
     * @method handleError
     * @description The handleError method handles errors that occur when loading the icon SVG.
     */
    const handleError = (error?: Error) => {
      this.innerHTML = "X";
      if (error) {
        console.error(error);
      } else {
        console.error(new MaterialDesignIconError(`The Material Design Icon "${icon}" with style "${style}" does not exist.`));
      }
    };

    // Use the object to find the imported SVG module
    const iconModule = mdiIcons[iconPath];
    // Check if the icon exists
    if (iconModule) {
      // Load the icon module
      iconModule().then((svg) => (this.innerHTML = svg)).catch(handleError);
    } else {
      handleError();
    }
  }

  /**
   * The observedAttributes method
   * @method observedAttributes
   * @description The observedAttributes method returns an array of attribute names to observe
   */
  static get observedAttributes() {
    return ["mdi-style", "mdi-icon"];
  }

  /**
   * The connectedCallback method
   * @method
   * @description The connectedCallback method is called when the element is connected to the DOM
   */
  connectedCallback() {
    this.#updateIcon();
  }

  /**
   * The disconnectedCallback method
   * @method
   * @description The disconnectedCallback method is called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    // Uninitialization code
  }

  /**
   * The attributeChangedCallback method
   * @method
   * @description The attributeChangedCallback method is called when an attribute is added, removed, updated, or replaced on the element
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Make sure the value is different
    if (oldValue === newValue) {
      return;
    }
    // Reload the icon
    this.#updateIcon();
  }

  /**
   * Returns the style of the Material Design Icon
   * @getter style
   */
  get mdiStyle(): materialDesignIconStyle {
    return this.getAttribute("mdi-style") as materialDesignIconStyle;
  }

  /**
   * Sets the style of the Material Design Icon
   * @setter style
   */
  set mdiStyle(value: materialDesignIconStyle) {
    this.setAttribute("mdi-style", value);
  }

  /**
   * Returns the icon of the Material Design Icon
   * @getter icon
   */
  get mdiIcon(): string {
    return this.getAttribute("mdi-icon") as string;
  }

  /**
   * Sets the icon of the Material Design Icon
   * @setter icon
   */
  set mdiIcon(value: string) {
    this.setAttribute("mdi-icon", value);
  }

}

// Export the MaterialDesignIcon class as a custom element
export { MaterialDesignIcon };