/**
 * Changelog:
 * - v1.0.0 (2023-11-03): Initial release
 */

// Check if the service worker API is available
if ('serviceWorker' in navigator) {
  // Listen for the load event
  window.addEventListener('load', (): void => {
    // Register the service worker
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((err: Error): void => {
        console.error(err);
      });
  });
}