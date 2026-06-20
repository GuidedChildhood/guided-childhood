const CACHE_NAME = 'gc-v1'
const STATIC_ASSETS = [
  '/',
  '/starter-pack',
  '/login',
  '/signup',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Network-first for API and auth routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
    return
  }

  // Cache-first for static assets
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then(cached => cached ?? fetch(request).then(res => {
        const clone = res.clone()
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        return res
      }))
    )
    return
  }

  // Network-first for pages
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
