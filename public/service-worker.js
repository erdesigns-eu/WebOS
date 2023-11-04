/**
 * Name of the cache
 * @type {string}
 */
const CACHE_NAME = "v1.0.0.0";

/**
 * Max age of the cache in days
 * @type {number}
 */
const MAX_CACHE_DAYS = 7;

/**
 * Files to cache on install
 * @type {string[]}
 */
const CACHE_FILES = [
  "/",
  "/index.html",
];

/**
 * Check if the cache is still fresh or needs to be updated
 * @param {number} timestamp Timestamp of the cache
 * @returns {boolean}
 */
const checkCacheAge = (timestamp) => {
  const currentTime = Date.now();
  const age = (currentTime - timestamp) / (1000 * 60 * 60 * 24);
  return age <= MAX_CACHE_DAYS;
};

/**
 * Install the service worker and cache the files
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CACHE_FILES);
      })
  );
});

/**
 * Remove old caches on activate
 */
self.addEventListener('activate', (event) => {
  // Cache whitelist
  const cacheWhitelist = [CACHE_NAME];
  // Wait until all caches are available
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Intercept fetch requests and return cached files if available
 */
self.addEventListener('fetch', (event) => {
  // Parse the request URL
  const requestURL = new URL(event.request.url);

  // Check if the request is for a file that should be cached (by file extension) and if it's from the same origin
  if (requestURL.origin === location.origin && (/.(js|ts)$/.test(requestURL.pathname) || /.(png|jpg|jpeg|svg|gif)$/.test(requestURL.pathname))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            const timestamp = response.headers.get('sw-cache-timestamp');
            if (timestamp && checkCacheAge(timestamp)) {
              return response;
            }
          }
          return fetch(event.request).then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            const responseToCache = fetchResponse.clone();
            const headers = new Headers(fetchResponse.headers);
            headers.append('sw-cache-timestamp', Date.now().toString());
            const responseForCache = new Response(responseToCache.body, {
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              headers: headers
            });
            cache.put(event.request, responseForCache);
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // For all other requests, try the cache first, fall back to network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
