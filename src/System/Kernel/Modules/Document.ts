/**
 * Changelog:
 * - v1.0.0 (2023-10-13): Initial release
 */

import { KernelModule, KernelModuleError, KernelModuleInformation } from "../KernelModule";

const module: KernelModuleInformation = {
  name: "Document",
  version: "1.0.0",
  date: "2023-10-07",
  author: "Ernst Reidinga"
}

/**
 * The Document module
 * @extends KernelModule
 * @fires Document#pointerlockchange
 * @fires Document#readystatechange
 * @fires Document#securitypolicyviolation
 * @fires Document#scroll
 * @fires Document#wheel
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document
 */
class Document extends KernelModule {
  
  /**
   * Creates a new Document instance
   */
  constructor() {
    // Call the super constructor
    super(module.name, module.version, module.date, module.author);
    // Set the events that need to be registered for this module
    const events = ["pointerlockchange", "readystatechange", "securitypolicyviolation", "scroll", "wheel"];
    // Loop through the events
    for (const event of events) {
      // Add the event listener to the document
      document.addEventListener(event, (e) => {

        // Check if the event is the pointerlockchange event
        if (event === "pointerlockchange") {
          // Check if the pointer is locked
          if (document.pointerLockElement) {
            // Dispatch the event
            this.dispatchEvent(new CustomEvent(event, { detail: { locked: true, element: document.pointerLockElement } }));
          } else {
            // Dispatch the event
            this.dispatchEvent(new CustomEvent(event, { detail: { locked: false } }));
          }
          // Stop executing the code
          return;
        }

        // Check if the event is the readystatechange event
        if (event === "readystatechange") {
          // Create the detail object
          const detail = (ready: boolean, complete: boolean, interactive: boolean, loading: boolean) => {
            return {
              ready: ready,
              complete: complete,
              interactive: interactive,
              loading: loading
            };
          }
          // Check if the document is ready
          if (document.readyState === "complete") {
            // Dispatch the event
            this.dispatchEvent(new CustomEvent(event, { detail: detail(true, true, true, false) }));
          }
          else if (document.readyState === "interactive") {
            // Dispatch the event
            this.dispatchEvent(new CustomEvent(event, { detail: detail(true, false, true, true) }));
          }
          else if (document.readyState === "loading") {
            // Dispatch the event
            this.dispatchEvent(new CustomEvent(event, { detail: detail(false, false, false, true) }));
          }
          // Stop executing the code
          return;
        }

        // Check if the event is the securitypolicyviolation event
        if (event === "securitypolicyviolation") {
          // Dispatch the event
          if (event === "securitypolicyviolation") {
            // Cast the event to SecurityPolicyViolationEvent
            const securityEvent = e as SecurityPolicyViolationEvent;
            // Dispatch the event
            this.dispatchEvent(new CustomEvent(event, {
              detail: {
                blockedURI: securityEvent.blockedURI,
                columnNumber: securityEvent.columnNumber,
                documentURI: securityEvent.documentURI,
                effectiveDirective: securityEvent.effectiveDirective,
                lineNumber: securityEvent.lineNumber,
                originalPolicy: securityEvent.originalPolicy,
                referrer: securityEvent.referrer,
                sourceFile: securityEvent.sourceFile,
                statusCode: securityEvent.statusCode,
                violatedDirective: securityEvent.violatedDirective
              }
            }));
          }
          // Stop executing the code
          return;
        }

        // Cast the event to CustomEvent to access the detail property
        const customEvent = e as CustomEvent;
        // Dispatch the event
        this.dispatchEvent(new CustomEvent(event, { detail: customEvent.detail }));
      });

      // Register the event
      this.registerEvent(event);
    }
    // Set the module as ready
    this.setReady();
  }

  /**
   * Ensures that the dependencies are available
   */
  ensureDependencies(): Promise<void> {
    return new Promise((resolve) => {
      // Resolve the promise
      resolve();
    });
  }

  /**
   * Returns the active element
   * @readonly
   */
  get activeElement(): Element|null {
    return document.activeElement;
  }

  /**
   * Returns the body element
   * @readonly
   */
  get body(): HTMLElement {
    return document.body;
  }

  /**
   * Returns the character set
   * @readonly
   */
  get characterSet(): string {
    return document.characterSet;
  }

  /**
   * Returns the child element count
   * @readonly
   */
  get childElementCount(): number {
    return document.childElementCount;
  }

  /**
   * Returns the children
   * @readonly
   */
  get children(): HTMLCollection {
    return document.children;
  }

  /**
   * Returns the content type
   * @readonly
   */
  get contentType(): string {
    return document.contentType;
  }

  /**
   * Returns the doctype of the document
   * @readonly
   */
  get doctype(): Object|null {
    if (document.doctype) {
      return {
        name: document.doctype.name,
        publicId: document.doctype.publicId,
        systemId: document.doctype.systemId
      };
    }
    return null;
  }

  /**
   * Returns the document element
   * @readonly
   */
  get documentElement(): HTMLElement {
    return document.documentElement;
  }

  /**
   * Returns the document URI
   * @readonly
   */
  get documentURI(): string {
    return document.documentURI;
  }

  /**
   * Returns the fullscreen element
   * @readonly
   */
  get fullscreenElement(): Element|null {
    return document.fullscreenElement;
  }

  /**
   * Returns the document head
   * @readonly
   */
  get head(): HTMLHeadElement {
    return document.head;
  }

  /**
   * Returns the hidden state
   * @readonly
   */
  get hidden(): boolean {
    return document.hidden;
  }

  /**
   * Returns the images
   * @readonly
   */
  get images(): HTMLCollection {
    return document.images;
  }

  /**
   * Returns the links
   * @readonly
   */
  get links(): HTMLCollection {
    return document.links;
  }

  /**
   * Returns the scripts
   * @readonly
   */
  get scripts(): HTMLCollection {
    return document.scripts;
  }

  /**
   * Returns the styleSheets
   * @readonly
   */
  get styleSheets(): StyleSheetList {
    return document.styleSheets;
  }

  /**
   * Returns the visibility state
   * @readonly
   */
  get visibilityState(): DocumentVisibilityState {
    return document.visibilityState;
  }

  /**
   * Returns the design mode
   */
  get designMode(): boolean {
    return document.designMode === "on";
  }

  /**
   * Sets the design mode
   * @param value The value to set the design mode to (true = on, false = off)
   * @throws {KernelModuleError} Thrown when the value is not a boolean
   */
  set designMode(value: boolean) {
    // Check if the value is not a boolean
    if (typeof value !== "boolean") {
      throw new KernelModuleError("The designMode value must be a boolean");
    }
    // Set the design mode
    document.designMode = value ? "on" : "off";
  }

  /**
   * Returns the right to left state
   */
  get rightToLeft(): boolean {
    return document.dir === "rtl";
  }

  /**
   * Sets the right to left state
   * @param value The value to set the right to left state to (true = rtl, false = ltr)
   * @throws {KernelModuleError} Thrown when the value is not a boolean
   */
  set rightToLeft(value: boolean) {
    // Check if the value is not a boolean
    if (typeof value !== "boolean") {
      throw new KernelModuleError("The rightToLeft value must be a boolean");
    }
    // Set the right to left
    document.dir = value ? "rtl" : "ltr";
  }

  /**
   * Returns the last modified date
   * @readonly
   */
  get lastModified(): Date {
    return new Date(document.lastModified)
  }

  /**
   * Returns the location
   * @readonly
   */
  get location(): Object {
    return {
      hash: document.location.hash,
      host: document.location.host,
      hostname: document.location.hostname,
      href: document.location.href,
      origin: document.location.origin,
      pathname: document.location.pathname,
      port: document.location.port,
      protocol: document.location.protocol,
      search: document.location.search
    };
  }

  /**
   * Returns if the document is ready
   * @readonly
   */
  get ready(): boolean {
    return document.readyState === "complete" || document.readyState === "interactive";
  }

  /**
   * Returns if the document is complete
   * @readonly
   */
  get complete(): boolean {
    return document.readyState === "complete";
  }

  /**
   * Returns if the document is interactive
   * @readonly
   */
  get interactive(): boolean {
    return document.readyState === "interactive";
  }

  /**
   * Returns if the document is loading
   * @readonly
   */
  get loading(): boolean {
    return document.readyState === "loading";
  }

  /**
   * Returns the referrer
   * @readonly
   */
  get referrer(): string {
    return document.referrer;
  }

  /**
   * Returns the title of the document
   */
  get title(): string {
    return document.title;
  }

  /**
   * Sets the title of the document
   * @param value The value to set the title to
   * @throws {KernelModuleError} Thrown when the value is not a string
   */
  set title(value: string) {
    // Check if the value is not a string
    if (typeof value !== "string") {
      throw new KernelModuleError("The title value must be a string");
    }
    // Set the title
    document.title = value;
  }

  /**
   * Returns the icon of the document
   */
  get icon(): string {
    return document.querySelector("link[rel='icon']")?.getAttribute("href") || "";
  }

  /**
   * Sets the icon of the document
   * @param value The value to set the icon to
   * @throws {KernelModuleError} Thrown when the value is not a string
   */
  set icon(value: string) {
    // Check if the value is not a string
    if (typeof value !== "string") {
      throw new KernelModuleError("The icon value must be a string");
    }
    // Create the link element
    const link = document.createElement('link');
    // Remove the old link elements
    const oldLinks = document.querySelectorAll('link[rel="shortcut icon"]');
    oldLinks.forEach((e) => e.parentNode!.removeChild(e));
    // Set the attributes
    link.id   = 'dynamic-favicon';  // Identifier
    link.rel  = 'shortcut icon';    // Rel
    link.href = value;              // URL
    // Append the link element to the document head
    document.head.appendChild(link);
  }

  /**
   * Returns the URL
   * @readonly
   */
  get url(): string {
    return document.URL.toString();
  }

}

// Export the module
export { Document };