'use client'
import { useEffect } from 'react'

// Registers the service worker, and makes sure an already open session
// actually picks up a newer one. The browser only re-checks sw.js on its
// own schedule, which a phone left on the home screen app for days can
// easily outlast, so this also asks every few minutes while the app is
// visible, and reloads once when a new worker actually takes control.
export default function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let refreshing = false
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    })

    // A notification tap on an already open window: the worker asks the page
    // to navigate, and location.assign is a full document load, so the tap
    // always lands on the current deploy even if this window has been sitting
    // in the background on an old bundle. iOS never supports the worker
    // navigating the window itself, so this message is the path that works
    // everywhere.
    navigator.serviceWorker.addEventListener('message', event => {
      const data = event.data as { type?: string; url?: string } | null
      if (data?.type === 'navigate' && typeof data.url === 'string' && data.url.startsWith('/')) {
        window.location.assign(data.url)
      }
    })

    navigator.serviceWorker.register('/sw.js').then(reg => {
      const check = () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}) }
      const id = setInterval(check, 5 * 60 * 1000)
      document.addEventListener('visibilitychange', check)
    }).catch(() => {})
  }, [])
  return null
}
