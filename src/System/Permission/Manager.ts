/**
 * Changelog:
 * - v1.0.0 (2023-10-13): Initial release
 */

/**
 * @class PermissionManagerError
 * @description The error thrown when there is a problem with the PermissionManager
 * @extends Error
 * @property message The error message
 */
class PermissionManagerError extends Error { 
  constructor(message: string) {
    super(message);
    this.name = "PermissionManagerError";
  }
}

/**
 * @class PermissionManagerTypeError
 * @description The error thrown when there is a type error with the PermissionManager
 * @extends TypeError
 * @property message The error message
 */
class PermissionManagerTypeError extends TypeError {
  constructor(message: string) {
    super(message);
    this.name = "PermissionManagerTypeError";
  }
}

/**
 * @typedef permissionRequestCallbackFunction
 * @property {string} uuid The UUID of the application or service
 * @property {string} module The module name
 * @property {string} func The function name
 * @property {any} data The data to pass to the onPermissionRequest callback
 * @returns {Promise<boolean>} True if the permission is granted, false if not
 */
type permissionRequestCallbackFunction = (uuid: string, module: string, func: string, data: any) => Promise<boolean>;

/**
 * The default permission request callback
 * @param uuid The UUID of the application or service
 * @param module The module name
 * @param func The function name
 * @param data The data to pass to the onPermissionRequest callback
 * @returns Always returns true to grant the permission
 */
// @ts-expect-error
const defaultPermissionRequestCallback: permissionRequestCallbackFunction = (uuid: string, module: string, func: string, data: any) => {
  return new Promise((resolve) => {
    resolve(true);
  });
}

/**
 * @class PermissionManager
 * @description The class that manages permissions for the system and applications
 * @singleton
 * @extends EventTarget
 */
class PermissionManager extends EventTarget {
  static #instance      : PermissionManager;

  #permissions          : WeakMap<any, object>                    = new WeakMap();  // Permissions are stored in a WeakMap so that they are garbage collected when the application or service is closed
  #permissionUUIDS      : Record<string, boolean>                 = {};             // The UUIDs of the applications and services
  #onPermissionRequest  : permissionRequestCallbackFunction|null  = null;           // The callback to call when a permission is requested
  #ready                : boolean                                 = false;          // The ready state of the PermissionManager instance

  /**
   * Creates a new PermissionManager instance
   * @param permissionRequestCallback The callback to call when a permission is requested
   * @throws {PermissionManagerError} Thrown if the PermissionManager is already instantiated
   * @throws {PermissionManagerError} Thrown if the PermissionManager class is extended instead of instantiated
   * @fires PermissionManager#ready
   */
  constructor(permissionRequestCallback: permissionRequestCallbackFunction|null = null) {
    // Call the super constructor
    super();
    
    // Set the ready state
    this.#ready = false;

    // Make sure the permission manager is not already instantiated
    if (PermissionManager.#instance) {
      throw new PermissionManagerError("PermissionManager is already instantiated!");
    }

    // Make sure this class is instantiated and not extended
    if (new.target !== PermissionManager) {
      throw new PermissionManagerError("Cannot extend PermissionManager class, must instantiate it instead of extending it!");
    }

    // Make sure the permissionRequestCallback is set
    if (!permissionRequestCallback) {
      throw new PermissionManagerError("permissionRequestCallback must be set!");
    }

    // Set the onPermissionRequest callback
    this.#onPermissionRequest = permissionRequestCallback;

    // Set the instance of the PermissionManager
    PermissionManager.#instance = this;
    // Set the ready state
    this.#ready = true;
    // Dispatch the ready event
    this.dispatchEvent(new CustomEvent("ready", { detail: { ready: true } }));
  }

  /**
   * Returns the PermissionManager instance
   * @readonly
   * @static
   */
  static getInstance(): PermissionManager {
    // Check if the instance is already instantiated
    if (!PermissionManager.#instance) {
      // Instantiate the PermissionManager
      PermissionManager.#instance = new PermissionManager();
    }
    // Return the instance of the PermissionManager
    return PermissionManager.#instance;
  }

  /**
   * Returns the onPermissionRequest callback
   * @returns The onPermissionRequest callback
   */
  get onPermissionRequest(): permissionRequestCallbackFunction|null {
    // Check if the onPermissionRequest callback is set
    if (!this.#onPermissionRequest) {
      // Return null if the callback is not set
      return null;
    }
    // Return the onPermissionRequest callback
    return this.#onPermissionRequest;
  }

  /**
   * Sets the onPermissionRequest callback
   * @param callback The onPermissionRequest callback
   * @throws {PermissionManagerTypeError} Thrown if the callback is not a function
   * @throws {PermissionManagerError} Thrown if the callback does not have 4 arguments
   */
  set onPermissionRequest(callback: permissionRequestCallbackFunction|null) {
    // Make sure the callback has 4 arguments
    if (callback && callback.length !== 4) {
      throw new PermissionManagerError("onPermissionRequest callback must have 4 arguments!");
    }
    // Set the onPermissionRequest callback
    this.#onPermissionRequest = callback;
    // Emit the onPermissionRequest callback set event
    this.dispatchEvent(new CustomEvent("onPermissionRequestSet", { detail: { callback } }));
  }

  /**
   * Checks if the UUID is registered
   * @param uuid The UUID of the application or service  
   */
  checkUUIDIsRegistered(uuid: string): boolean {
    // Make sure the UUID is a string
    if (typeof uuid !== "string") {
      throw new PermissionManagerTypeError("UUID must be a string!");
    }
    // Return if the UUID is registered
    return this.#permissionUUIDS[uuid] !== undefined;
  }

  /**
   * Returns if a permission is granted
   * @param uuid The UUID of the application or service
   * @param module The module name
   * @param func The function name
   * @returns True if the permission is granted, false if not
   * @throws {PermissionManagerTypeError} Thrown if the UUID is not a string
   * @throws {PermissionManagerTypeError} Thrown if the module is not a string
   * @throws {PermissionManagerTypeError} Thrown if the func is not a string 
   */
  hasPermission(uuid: string, module: string, func: string): boolean {
    // Make sure the module is a string
    if (typeof module !== "string") {
      throw new PermissionManagerTypeError("Module must be a string!");
    }
    // Make sure the func is a string
    if (typeof func !== "string") {
      throw new PermissionManagerTypeError("Function must be a string!");
    }
    // Check if the UUID is registered
    if (!this.checkUUIDIsRegistered(uuid)) {
      return false;
    }
    // Get the key
    const key = this.#permissionUUIDS[uuid];
    // Get the permissions
    const permissions = this.#permissions.get(key);
    // Check if the permissions are set
    if (!permissions) {
      return false;
    }
    // Check if the module is set
    if (!(module in permissions)) {
      return false;
    }
    // If there is a wildcard permission, return true
    // @ts-expect-error
    if (permissions[module]["*"] && permissions[module]["*"].granted) {
      return true;
    }
    // Check if the function is set
    // @ts-expect-error
    if (!permissions[module][func]) {
      return false;
    }
    // Return if the permission is granted
    // @ts-expect-error
    return permissions[module][func].granted;
  }

  /**
   * Requests a permission from the user for the application or service
   * @param uuid The UUID of the application or service
   * @param module The module name
   * @param func The function name
   * @param {any} data The data to pass to the onPermissionRequest callback
   * @throws {PermissionManagerError} Thrown if the onPermissionRequest callback is not set
   * @throws {PermissionManagerError} Thrown if the onPermissionRequest callback does not return a boolean
   */
  requestPermission(uuid: string, module: string, func: string, data: any): Promise<boolean> {
    // Check if the permission is already granted
    if (this.hasPermission(uuid, module, func)) {
      return Promise.resolve(true);
    }
    // Check if the onPermissionRequest callback is set
    if (!this.#onPermissionRequest) {
      throw new PermissionManagerError("onPermissionRequest callback is not set!");
    }
    // Request the permission
    return new Promise((resolve, reject) => {
      // Emit the permission request event
      this.dispatchEvent(new CustomEvent("request", { detail: { uuid, module, func, data } }));
      // Check if the onPermissionRequest callback is set
      if (!this.#onPermissionRequest) {
        throw new PermissionManagerError("onPermissionRequest callback is not set!");
      }
      // Call the onPermissionRequest callback
      this.#onPermissionRequest(uuid, module, func, data)
        .then((result) => {
          // Check if the result is a boolean
          if (typeof result !== "boolean") {
            throw new PermissionManagerError("onPermissionRequest callback must return a boolean value!");
          }
          // Emit the permission request result event
          this.dispatchEvent(new CustomEvent("requestResult", { detail: { uuid, module, func, data, result } }));
          // Check if the permission was granted
          if (result) {
            // Grant the permission
            this.grantPermission(uuid, module, func);
            // Resolve the promise
            resolve(true);
          } else {
            // Reject the promise
            reject(false);
          }
        })
        .catch((error) => {
          // Emit the permission request error event
          this.dispatchEvent(new CustomEvent("requestError", { detail: { uuid, module, func, data, error } }));
          // Reject the promise
          reject(error);
        });
    });
  }

  /**
   * Grants a permission
   * @param uuid The UUID of the application or service
   * @param module The module name
   * @param func The function name
   * @throws {PermissionManagerTypeError} Thrown if the module is not a string
   * @throws {PermissionManagerTypeError} Thrown if the func is not a string
   */
  grantPermission(uuid: string, module: string, func: string): void {
    // Make sure the module is a string
    if (typeof module !== "string") {
      throw new PermissionManagerTypeError("Module must be a string!");
    }
    // Make sure the func is a string
    if (typeof func !== "string") {
      throw new PermissionManagerTypeError("Function must be a string!");
    }
    // Check if the UUID is registered and register it if not
    if (!this.checkUUIDIsRegistered(uuid)) {
      // Create the key
      const key = Symbol(uuid);
      // Set the key
      // @ts-expect-error
      this.#permissionUUIDS[uuid] = key;
      // Set the permissions
      this.#permissions.set(key, {});
    }
    // Get the key
    const key = this.#permissionUUIDS[uuid];
    // Get the permissions
    const permissions = this.#permissions.get(key);
    // Check if the permissions are set
    if (!permissions) {
      throw new PermissionManagerError("Permissions are not set!");
    }
    // Check if the module is set
    // @ts-expect-error
    if (! permissions[module]) {
      // Set the module
      // @ts-expect-error
      permissions[module] = {};
    }
    // Check if the function is set
    // @ts-expect-error
    if (!permissions[module][func]) {
      // Set the function permission object
      // @ts-expect-error
      permissions[module][func] = {
        granted: true,
        revoked: false,
        revokedAt: null,
        grantedAt: Date.now(),
      };
    }
    // Grant the permission for the function
    // @ts-expect-error
    permissions[module][func].granted = true;
    // Emit the permission granted event
    this.dispatchEvent(new CustomEvent("grant", { detail: { uuid, module, func } }));
  }

  /**
   * Grants all permissions for a module
   * @param uuid The UUID of the application or service
   * @param module The module name
   * @throws {PermissionManagerTypeError} Thrown if the module is not a string
   */
  grantAllPermissions(uuid: string, module: string): void {
    // Make sure the module is a string
    if (typeof module !== "string") {
      throw new PermissionManagerTypeError("Module must be a string!");
    }
    // Check if the UUID is registered and register it if not
    if (!this.checkUUIDIsRegistered(uuid)) {
      // Create the key
      const key = Symbol(uuid);
      // Set the key
      // @ts-expect-error
      this.#permissionUUIDS[uuid] = key;
      // Set the permissions
      this.#permissions.set(key, {});
    }
    // Get the key
    const key = this.#permissionUUIDS[uuid];
    // Get the permissions
    const permissions = this.#permissions.get(key);
    // Check if the permissions are set
    if (!permissions) {
      throw new PermissionManagerError("Permissions are not set!");
    }
    // Check if the module is set
    // @ts-expect-error
    if (!permissions[module]) {
      // Set the module
      // @ts-expect-error
      permissions[module] = {};
    }
    // Grant the permission for all functions
    // @ts-expect-error
    permissions[module]["*"] = {
      granted: true,
      revoked: false,
      revokedAt: null,
      grantedAt: Date.now(),
    };
    // Loop through all the functions
    // @ts-expect-error
    for (const func in permissions[module]) {
      // Check if the function is the wildcard function
      if (func === "*") {
        continue;
      }
      // Grant the permission for the function
      // @ts-expect-error
      permissions[module][func].granted = true;
      // @ts-expect-error
      permissions[module][func].grantedAt = Date.now();
      // @ts-expect-error
      permissions[module][func].revoked = false;
      // @ts-expect-error
      permissions[module][func].revokedAt = null;
    }
    // Emit the permission granted event
    this.dispatchEvent(new CustomEvent("grant", { detail: { uuid, module, func: "*" } }));
  }

  /**
   * Revokes a permission
   * @param uuid The UUID of the application or service
   * @param module The module name
   * @param func The function name
   * @throws {PermissionManagerTypeError} Thrown if the module is not a string
   * @throws {PermissionManagerTypeError} Thrown if the func is not a string
   */
  revokePermission(uuid: string, module: string, func: string): void {
    // Make sure the module is a string
    if (typeof module !== "string") {
      throw new PermissionManagerTypeError("Module must be a string!");
    }
    // Make sure the func is a string
    if (typeof func !== "string") {
      throw new PermissionManagerTypeError("Function must be a string!");
    }
    // Check if the UUID is registered
    if (!this.checkUUIDIsRegistered(uuid)) {
      return;
    }
    // Get the key
    const key = this.#permissionUUIDS[uuid];
    // Get the permissions
    const permissions = this.#permissions.get(key);
    // Check if the permissions are set
    if (!permissions) {
      return;
    }
    // Check if the module is set
    // @ts-expect-error
    if (!permissions[module]) {
      return;
    }
    // Check if the function is set
    // @ts-expect-error
    if (!permissions[module][func]) {
      return;
    }
    // Revoke the permission for the function
    // @ts-expect-error
    permissions[module][func].granted = false;
    // @ts-expect-error
    permissions[module][func].revoked = true;
    // @ts-expect-error
    permissions[module][func].revokedAt = Date.now();
    // Check if the wildcard permission is set
    // @ts-expect-error
    if (permissions[module]["*"]) {
      // Revoke the wildcard permission
      // @ts-expect-error
      permissions[module]["*"].granted = false;
      // @ts-expect-error
      permissions[module]["*"].grantAt = null;
      // @ts-expect-error
      permissions[module]["*"].revoked = true;
      // @ts-expect-error
      permissions[module]["*"].revokedAt = Date.now();
    }
    // Emit the permission revoked event
    this.dispatchEvent(new CustomEvent("revoke", { detail: { uuid, module, func } }));
  }

  /**
   * Revokes all permissions for a module
   * @param uuid The UUID of the application or service
   * @param module The module name
   */
  revokeAllPermissions(uuid: string, module: string): void {
    // Check if the UUID is registered
    if (!this.checkUUIDIsRegistered(uuid)) {
      return;
    }
    // Get the key
    const key = this.#permissionUUIDS[uuid];
    // Get the permissions
    const permissions = this.#permissions.get(key);
    // Check if the permissions are set
    if (!permissions) {
      return;
    }
    // Loop through all the modules
    for (const module in permissions) {
      // Loop through all the functions
      // @ts-expect-error
      for (const func in permissions[module]) {
        // Revoke the permission for the function
        // @ts-expect-error
        permissions[module][func].granted = false;
        // @ts-expect-error
        permissions[module][func].grantedAt = null;
        // @ts-expect-error
        permissions[module][func].revoked = true;
        // @ts-expect-error
        permissions[module][func].revokedAt = Date.now();
      }
      // Check if the wildcard permission is set
      // @ts-expect-error
      if (permissions[module]["*"]) {
        // Revoke the wildcard permission
        // @ts-expect-error
        permissions[module]["*"].granted = false;
        // @ts-expect-error
        permissions[module]["*"].grantAt = null;
        // @ts-expect-error
        permissions[module]["*"].revoked = true;
        // @ts-expect-error
        permissions[module]["*"].revokedAt = Date.now();
      }
    }
    // Emit the permission revoked event
    this.dispatchEvent(new CustomEvent("revoke", { detail: { uuid, module, func: "*" } }));
  }

  /**
   * Revokes all permissions for all modules
   * @param uuid The UUID of the application or service
   */
  revokeAllPermissionsForAllModules(uuid: string): void {
    // Check if the UUID is registered
    if (!this.checkUUIDIsRegistered(uuid)) {
      return;
    }
    // Get the key
    const key = this.#permissionUUIDS[uuid];
    // Get the permissions
    const permissions = this.#permissions.get(key);
    // Check if the permissions are set
    if (!permissions) {
      return;
    }
    // Loop through all the modules
    for (const module in permissions) {
      // Loop through all the functions
      // @ts-expect-error
      for (const func in permissions[module]) {
        // Revoke the permission for the function
        // @ts-expect-error
        permissions[module][func].granted = false;
        // @ts-expect-error
        permissions[module][func].grantedAt = null;
        // @ts-expect-error
        permissions[module][func].revoked = true;
        // @ts-expect-error
        permissions[module][func].revokedAt = Date.now();
      }
    }
    // Emit the permission revoked event
    this.dispatchEvent(new CustomEvent("revoke", { detail: { uuid, module: "*", func: "*" } }));
  }

  /**
   * Returns the PermissionManager ready state
   * @returns True if the PermissionManager is ready, false if not
   * @readonly
   */
  get ready(): boolean {
    return this.#ready;
  }

}

// Export the PermissionManager class
export type { permissionRequestCallbackFunction };
export { PermissionManager, defaultPermissionRequestCallback };