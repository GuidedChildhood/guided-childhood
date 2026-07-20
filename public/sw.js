const CACHE_NAME = 'gc-v7'
// Only static media is ever cached. Pages, scripts and styles are never stored,
// so a deploy is picked up the instant the device is online, and the app can
// never boot an old shell from a stale cache. The v7 bump purges anything the
// earlier versions cached, including any old HTML or JS.
const STATIC_ASSETS = [
  '/icons/icon-192.png',
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

  // Everything else — pages, scripts and styles — is network only, never
  // cached. Fresh HTML must always pair with fresh JS, and the surest way to
  // guarantee that is to never keep an old copy: a deploy is live the moment
  // the device is online, and there is no stale shell to boot. This is what
  // stops the app opening on an old version. We let the request go straight to
  // the network without intercepting, so the browser handles it normally.
  return
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
  const raw = event.notification.data?.url ?? '/dashboard'
  // Only ever open our own pages from a tap.
  const url = typeof raw === 'string' && raw.startsWith('/') ? raw : '/dashboard'

  // A tap must always land on the CURRENT app, never a window that has sat in
  // the background for days running the bundle it loaded at its last cold
  // start. So when a window already exists we focus it, then force a real full
  // page navigation two ways at once: client.navigate for browsers that
  // support it, and a message the page turns into location.assign for the
  // ones (iOS in particular) where client.navigate silently rejects. Either
  // path is a full document load, so the fresh deploy comes down with it.
  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of clientList) {
      if (!client.url.startsWith(self.location.origin)) continue
      try { if ('focus' in client) await client.focus() } catch { /* still navigate */ }
      try { client.postMessage({ type: 'navigate', url }) } catch { /* navigate below */ }
      if ('navigate' in client) {
        try { await client.navigate(url) } catch { /* the message path covers iOS */ }
      }
      return
    }
    await clients.openWindow(url)
  })())
})
