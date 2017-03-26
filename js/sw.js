const STATIC_CACHE = 'static-v1'
const STATIC_ASSETS = [
  '/css/app.css',
  '/js/app.js',
  '/polyfills/custom-elements.js',
  '/templates/404.html',
  '/templates/home.html'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', (event) => {
  const cached = caches.open(STATIC_CACHE)
    .then((cache) => cache.match(event.request))

  const network = fetch(event.request)

  const race = Promise.race([ cached, network.then((resp) => resp.clone()) ])

  event.respondWith(
    race.then((response) => {
      if (response) {
        return response
      }

      return network
    })
  )

  event.waitUntil(
    network.then((response) => caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, response)))
  )
})
