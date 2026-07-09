const CACHE_NAME = 'gc-v4'
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
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // API and auth always go straight to the network, never the cache.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return

  // Images and fonts rarely change, so serve them fast from cache and only
  // ever store a clean, complete response.
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(cached =>
        cached ?? fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          }
          return res
        })
      )
    )
    return
  }

  // Everything else — pages, scripts and styles — is network first. Fresh
  // HTML must always pair with fresh JS: a stale or truncated script served
  // from cache is what left buttons dead and screens blank after a deploy.
  // The cache is only a genuine offline fallback, and we only ever store a
  // complete same origin 200, never a half loaded or error response.
  event.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok && res.type === 'basic') {
          const clone = res.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
        }
        return res
      })
      .catch(() => caches.match(request).then(cached => cached ?? Response.error()))
  )
})

// ── PUSH NOTIFICATIONS ──────────────────────────────────────────────────────

self.addEventListener('push', event => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Guided Childhood', body: event.data.text(), url: '/dashboard' }
  }

  const options = {
    body: payload.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: payload.url ?? '/dashboard' },
    vibrate: [100, 50, 100],
    requireInteraction: false,
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'Guided Childhood', options)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      return clients.openWindow(url)
    })
  )
})
