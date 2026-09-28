/*
 * PilihLah service worker
 *
 * - Precaches the whole app shell on install, so the app works fully offline.
 * - Serves from cache first, and refreshes the cache in the background
 *   (stale-while-revalidate), so a new deploy shows up on the next open.
 * - All paths are relative to this file, so it works at the domain root
 *   (https://pilihlah.com/) or in a sub-folder (https://x.com/pilihlah/).
 *
 * TO FORCE EVERY USER TO GET A NEW VERSION: bump VERSION below.
 */
const VERSION = "v1";
const CACHE = `pilihlah-${VERSION}`;

const PRECACHE = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "site.webmanifest",
  "favicon.ico",
  "icons/favicon.svg",
  "icons/favicon-16x16.png",
  "icons/favicon-32x32.png",
  "icons/apple-touch-icon.png",
  "icons/android-chrome-192x192.png",
  "icons/android-chrome-512x512.png",
  "icons/maskable-512x512.png",
];

const INDEX_URL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("pilihlah-") && k !== CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

async function staleWhileRevalidate(cacheKey, request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(cacheKey, { ignoreSearch: true });

  const refresh = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(cacheKey, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    // Serve instantly; keep the network refresh alive until it finishes.
    return { response: cached, refresh };
  }
  return { response: (await refresh) || Response.error(), refresh };
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch other origins

  // Page navigations always get the cached app shell (single-page app).
  const cacheKey = request.mode === "navigate" ? INDEX_URL : request;
  const fetchReq = request.mode === "navigate" ? new Request(INDEX_URL) : request;

  event.respondWith(
    staleWhileRevalidate(cacheKey, fetchReq).then(({ response, refresh }) => {
      event.waitUntil(refresh);
      return response;
    })
  );
});
