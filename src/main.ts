// Import the main scss file to be compiled into the main.css file
import "../styles/main.scss";

// Import the Kernel Modules
import { Clipboard } from "./System/Kernel/Modules/Clipboard";
import { DeviceOrientation } from "./System/Kernel/Modules/DeviceOrientation";
import { Document } from "./System/Kernel/Modules/Document";
import { Fullscreen } from "./System/Kernel/Modules/Fullscreen";
import { Gamepads } from "./System/Kernel/Modules/Gamepad";
import { Geolocation } from "./System/Kernel/Modules/Geolocation";
import { Notifications } from "./System/Kernel/Modules/Notifications";
import { OnlineOffline } from "./System/Kernel/Modules/OnlineOffline";
import { PageVisibility } from "./System/Kernel/Modules/PageVisibility";
import { ScreenOrientation } from "./System/Kernel/Modules/ScreenOrientation";
import { ScreenWakeLock } from "./System/Kernel/Modules/ScreenWakeLock";
import { Share } from "./System/Kernel/Modules/Share";
import { Vibration } from "./System/Kernel/Modules/Vibration";

// Import the SystemManager class
import { SystemManager } from "./System/System";
// Instantiate the SystemManager instance and load the kernel modules, register root, and permission callback.
SystemManager.instantiate([
  new Clipboard, 
  new DeviceOrientation, 
  new Document,
  new Fullscreen,
  new Gamepads,
  new Geolocation,
  new Notifications,
  new OnlineOffline,
  new PageVisibility,
  new ScreenOrientation,
  new ScreenWakeLock,
  new Share,
  new Vibration,
]);

// Import the WebOS custom element registration function
import { registerWebOSElements } from "./register-elements";
// Register the WebOS custom elements with the browser
registerWebOSElements();