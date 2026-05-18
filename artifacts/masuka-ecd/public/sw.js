const CACHE_NAME = "masuka-ecd-cache-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["/manifest.webmanifest", "/icon.png"]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((names) =>
          Promise.all(
            names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
          )
        ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Navigation requests (HTML pages): always network-first so index.html is
  // never served stale after a Vite rebuild changes bundle hashes.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Vite hashed assets (/assets/*.js, /assets/*.css): cache-first because
  // their filenames change whenever content changes, so cached copies are safe.
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Everything else (API calls, fonts, icons): network-first with cache fallback.
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
