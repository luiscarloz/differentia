// Service Worker basico - cache offline do prototipo
const CACHE_NAME = 'differentia-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './game.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './images/leao.png',
    './images/lobo.png',
    './images/cobra.png',
    './images/mosquito.png',
    './images/bajo.png',
    './images/tina.png',
    './images/panda.png',
    './images/coruja.png',
    './images/leco.png',
    './images/arara.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    }).catch(() => {});
                }
                return response;
            }).catch(() => cached);
        })
    );
});
