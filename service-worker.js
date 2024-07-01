// This is the service worker file for the PWA
self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    // Perform install steps
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
    // Perform activation steps
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/data/last-observation.json')) {
        event.respondWith(
            caches.open('aqi-data').then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});

self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: 'AQI: ' + data.aqi,
        icon: 'icons/dynamic-icon.png'
    });
});
