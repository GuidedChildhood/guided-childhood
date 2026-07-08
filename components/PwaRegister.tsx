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

    navigator.serviceWorker.register('/sw.js').then(reg => {
      const check = () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}) }
      const id = setInterval(check, 5 * 60 * 1000)
      document.addEventListener('visibilitychange', check)
    }).catch(() => {})
  }, [])
  return null
}
