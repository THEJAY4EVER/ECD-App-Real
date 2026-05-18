const CACHE_NAME = "masuka-ecd-cache-v3";

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

  // Only intercept same-origin requests — leave cross-origin (fonts, CDN, etc.) alone.
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network only. Express serves index.html for all SPA
  // routes in production, so no cache fallback is needed or safe here.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request));
    return;
  }

  // Vite hashed assets (/assets/*.js, /assets/*.css): cache-first.
  // Filenames include a content hash so cached copies are always valid.
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

  // Everything else (API calls, etc.): don't intercept — browser handles normally.
});
