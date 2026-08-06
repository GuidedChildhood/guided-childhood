'use client'

// This browser, named once.
//
// A push endpoint is not a device. The push service hands out a new one every
// time the subscription is recreated, which happens on a PWA reinstall, on
// clearing site data, on an iOS update, and on the service's own schedule. Each
// one used to insert a new row, so Teo's single phone ended up with five
// subscriptions and every reminder arrived four times. See migration 166.
//
// This is the thing that survives all of it: made once, kept in localStorage,
// sent with every subscribe so the row for this phone is replaced rather than
// added to.
//
// Deliberately not a fingerprint. It identifies nothing about the person or the
// device, it is a random string whose only job is to equal itself tomorrow, and
// it never leaves the family's own rows. Clearing site data loses it, which
// simply means the next subscribe looks like a new device and the old row is
// tidied by the host fallback in lib/push/devices.ts.

const KEY = 'gc_device_id'

export function getDeviceId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const id = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      // Older Safari has crypto but not randomUUID. Any random string does:
      // this is an identity, not a secret.
      : `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`
    localStorage.setItem(KEY, id)
    return id
  } catch {
    // Private mode with storage blocked. Returning null is correct: the send
    // path falls back to grouping by push service host, which is what every
    // pre migration row uses anyway.
    return null
  }
}
