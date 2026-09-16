import { VAPID_PUBLIC_KEY } from '@/lib/config/vapid'

// Turning notifications on, once, for both apps.
//
// ── WHY THIS IS A SHARED MODULE AND NOT TWO COPIES ──────────────────────────
//
// Justin, 15 September 2026: "it says when instructions to add to home screen
// to then click quest and it will ask for notifications but it is not working
// we need to make it easy to add pwa notifications so check working on both
// parents and child apps."
//
// It was not working on the child app, and the reason is one line of ordering.
// The child's enableReminders did this:
//
//     await navigator.serviceWorker.register('/sw.js')   // <- await
//     await navigator.serviceWorker.ready                // <- await
//     const perm = await Notification.requestPermission() // <- too late
//
// requestPermission is only allowed while the document still holds TRANSIENT
// USER ACTIVATION, the browser's record that a human just tapped something.
// That activation does not survive an await on a promise that resolves in a
// later task, and serviceWorker.ready routinely takes hundreds of milliseconds
// on a first install. So by the time we asked, the tap had expired: Safari
// refuses, the call rejects or answers 'default', and no permission sheet ever
// appears. A child taps Yes please and nothing happens.
//
// Then it got worse, because the whole function was wrapped in
// `catch { setRemindState('hidden') }`. So the failure did not just do
// nothing, it took the offer off the screen. The child was left with no
// reminders, no message, and no way back to the button.
//
// The PARENT app already had this right (components/push/PushPrompt.tsx asked
// first, checked the save, healed a rotated key and showed a real error). Two
// implementations of one sequence, one correct and one not, is how a fix on
// one side never reaches the other. So the sequence lives here now and both
// call it. A third caller gets it right by construction.
//
// scripts/check-push-gesture.mjs fails the build if a caller goes back to
// awaiting anything before it asks.

export type PushFailure = 'unsupported' | 'ios-needs-install' | 'denied' | 'save-failed' | 'failed'

export type EnableResult =
  | { ok: true; subscription: PushSubscriptionJSON; endpoint: string }
  | { ok: false; reason: PushFailure; message: string }

/** iPhone or iPad, including an iPad reporting itself as a Mac since iPadOS 13. */
export function isApplePhoneOrTablet(): boolean {
  if (typeof navigator === 'undefined') return false
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true
  // iPadOS 13 and later say "Macintosh". A Mac has no touch screen, an iPad
  // does, which is the only reliable way to tell them apart from script.
  return navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1
}

/** Is this page running as an installed app rather than a browser tab? */
export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(display-mode: standalone)')?.matches === true
    || (window.navigator as { standalone?: boolean }).standalone === true
}

/**
 * Can this browser subscribe at all, and if not, is it the fixable kind?
 *
 * Apple only exposes the Push API to a web app that has been added to the Home
 * Screen, so on an iPhone in a plain Safari tab the answer is not "your phone
 * cannot do this" but "add it to your Home Screen first". Those two need
 * different words on screen, which is why they are different reasons.
 */
export function pushSupport(): { ok: true } | { ok: false; reason: 'unsupported' | 'ios-needs-install' } {
  if (typeof window === 'undefined') return { ok: false, reason: 'unsupported' }
  const has = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
  if (has) return { ok: true }
  if (isApplePhoneOrTablet() && !isInstalled()) return { ok: false, reason: 'ios-needs-install' }
  return { ok: false, reason: 'unsupported' }
}

// Typed as Uint8Array<ArrayBuffer> rather than the default Uint8Array, whose
// buffer could in principle be a SharedArrayBuffer: pushManager.subscribe only
// accepts a plain ArrayBuffer view, and TypeScript is right to insist.
function keyBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const normal = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(normal)
  const out = new Uint8Array(new ArrayBuffer(raw.length))
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i)
  return out
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

/**
 * Turn notifications on for this device.
 *
 * MUST be called straight from a click or tap handler, with nothing awaited
 * before it, or the permission sheet will not open on iOS.
 *
 * @param save   posts the subscription to our server. Its Response is checked,
 *               so a failed save is reported rather than celebrated.
 * @param drop   optional: tell our server to forget an endpoint we are about
 *               to unsubscribe, after a VAPID key rotation.
 */
export async function enablePush(
  save: (subscription: PushSubscriptionJSON) => Promise<Response>,
  drop?: (endpoint: string) => Promise<unknown>,
): Promise<EnableResult> {
  const support = pushSupport()
  if (!support.ok) {
    return {
      ok: false,
      reason: support.reason,
      message: support.reason === 'ios-needs-install'
        ? 'Add this to your Home Screen first, then reminders can be turned on.'
        : 'This browser cannot show reminders. Try it on a phone.',
    }
  }

  // THE FIRST AWAIT, ALWAYS. Everything else can wait; the tap cannot.
  let perm: NotificationPermission
  try {
    perm = await Notification.requestPermission()
  } catch {
    return { ok: false, reason: 'failed', message: 'This device would not open the notifications question. Try again from the app on your Home Screen.' }
  }
  if (perm !== 'granted') {
    return {
      ok: false,
      reason: 'denied',
      message: 'Notifications are switched off for this app. Turn them on in your phone settings, then try again.',
    }
  }

  try {
    // ready can hang forever if nothing ever registered, so nudge a
    // registration first when there is none.
    if (!(await navigator.serviceWorker.getRegistration())) {
      try { await navigator.serviceWorker.register('/sw.js') } catch { /* ready below surfaces it */ }
    }
    const reg = await navigator.serviceWorker.ready

    // Self heal a VAPID key rotation. A subscription made with an older public
    // key is not an error here, it is an error much later: the push service
    // rejects our sends with a 403 and the browser refuses to re-subscribe
    // over the top. So spot the mismatch, drop it, and subscribe fresh.
    const current = keyBytes(VAPID_PUBLIC_KEY)
    let sub = await reg.pushManager.getSubscription()
    if (sub) {
      const existing = sub.options?.applicationServerKey
      if (!existing || !sameBytes(new Uint8Array(existing), current)) {
        if (drop) { try { await drop(sub.endpoint) } catch { /* best effort */ } }
        await sub.unsubscribe()
        sub = null
      }
    }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: current })

    const json = sub.toJSON()
    const res = await save(json)
    if (!res.ok) {
      return { ok: false, reason: 'save-failed', message: 'Switched on here, but saving it failed. Try once more.' }
    }
    return { ok: true, subscription: json, endpoint: sub.endpoint }
  } catch {
    return { ok: false, reason: 'failed', message: 'Something went wrong turning reminders on. Try once more.' }
  }
}
