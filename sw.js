const CACHE_NAME = "bmi-app-v6";
const FILES = [
    "./",
    "./bmir.html",
    "./manifest.json",
    "./sw.js",
    "./favicon.ico",
    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

