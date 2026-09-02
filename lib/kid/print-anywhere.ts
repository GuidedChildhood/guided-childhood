// Printing from wherever the child is standing, including the installed app.
//
// Justin, 2 September 2026: "check the print button as said issue with web."
//
// THE ISSUE. Every print button on the child app calls window.print(), and on
// a desktop browser, in Safari, and inside an installed Android app that opens
// the print dialog. Inside an installed iOS app (Add to Home Screen, display
// mode standalone) it does NOTHING. iOS gives a standalone web app no print
// dialog at all: no error, no sheet, no dialog, a button that just does not
// work. That is the phone the child app is installed on, and it is the one
// surface where the button was silent.
//
// THE WAY OUT. From a standalone app, opening a link in a new tab lands in
// real Safari, and real Safari can print. So every printable has a print
// page of its own (/k/{token}/print?...) that draws only the sheet and asks
// for the dialog the moment it has loaded. Where window.print works the
// button still prints in place, exactly as before; where it cannot, the same
// button opens the print page in Safari instead. The child sees a sheet and a
// print dialog either way.
//
// Detection is deliberately narrow: iOS AND installed. A desktop Chrome
// window, an Android app and Safari itself all keep the in place dialog,
// because handing them a new tab would be a worse experience than the one
// they already have.

import type { StepKey } from '@/lib/kid/five-a-day'

/** True when this is an iPhone or iPad. iPadOS reports itself as a Mac with a touch screen. */
export function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  return navigator.platform === 'MacIntel' && (navigator.maxTouchPoints ?? 0) > 1
}

/** True when the page is running as an installed app rather than in a browser tab. */
export function isInstalledApp(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  try {
    return window.matchMedia?.('(display-mode: standalone)')?.matches || nav.standalone === true
  } catch {
    return nav.standalone === true
  }
}

/** Can window.print() actually open a dialog here? False inside an installed iOS app. */
export function canPrintHere(): boolean {
  if (typeof window === 'undefined' || typeof window.print !== 'function') return false
  return !(isIos() && isInstalledApp())
}

/**
 * Print in place when the browser can, otherwise open the print page in a
 * real browser tab. Returns which happened so the button can say so.
 */
export function printOrOpen(printUrl: string): 'printed' | 'opened' {
  if (canPrintHere()) {
    window.print()
    return 'printed'
  }
  window.open(printUrl, '_blank', 'noopener')
  return 'opened'
}

/**
 * Pack a small object into a URL safe string for the print page. The bucket
 * list and the star chart carry their picks this way, because a print page
 * opened in Safari shares no storage with the installed app that sent it.
 */
export function packForUrl(data: unknown): string {
  const json = JSON.stringify(data)
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** The inverse of packForUrl, on either side. Returns null for anything it cannot read. */
export function unpackFromUrl<T = unknown>(s: string | null | undefined): T | null {
  if (!s) return null
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (s.length % 4)) % 4)
    const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary')
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as T
  } catch {
    return null
  }
}

/** What a printable tick did to today's five, as the route answers it. */
export type PrintableTick = {
  /** True when THIS print landed one of today's five: the step was open and is now done. */
  ticked: boolean
  steps: StepKey[]
  done: StepKey[]
  complete: boolean
  justCompleted: boolean
  holidayMinutes: number
  streak: number
}

/**
 * The window event a tick raises on the page it happened on, carrying the
 * PrintableTick, so the five a day card moves on at once without a round
 * trip of its own.
 */
export const KID_DAY_EVENT = 'gc:kid-day'

/** The home screen address that lands on the five a day with the next step lit. */
export function fiveADayHref(token: string): string {
  return `/k/${token}?tab=five`
}

/**
 * Tell the five a day that a printable happened, and learn what it did.
 *
 * Justin, 2 September 2026, from the star chart's print page: "When I click
 * print here it should update the 1 of 5 jobs on child app and go back to the
 * 5 a day marked as completed and onto next." The tick was landing but this
 * was fire and forget, so no button could act on it. Now it resolves to the
 * day as the route answers it (null when nothing can be said), and raises the
 * KID_DAY_EVENT on this page so the card ticks itself.
 *
 * The request leaves synchronously, before the first await, so a caller can
 * call this and then window.open in the same tap: the tap is still the tap.
 * The print must never wait on it, and a failed tick is a tick the next
 * print retries.
 */
export async function tickPrintableStep(token: string): Promise<PrintableTick | null> {
  if (!token || typeof fetch !== 'function') return null
  try {
    const res = await fetch('/api/kid/printable-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      keepalive: true,
    })
    const d = await res.json().catch(() => null)
    if (!res.ok || !d?.ok || !Array.isArray(d.done)) return null
    const tick: PrintableTick = {
      ticked: d.ticked === true,
      steps: Array.isArray(d.steps) ? d.steps : [],
      done: d.done,
      complete: d.complete === true,
      justCompleted: d.justCompleted === true,
      holidayMinutes: Number(d.holidayMinutes) || 0,
      streak: Number(d.streak) || 0,
    }
    try { window.dispatchEvent(new CustomEvent(KID_DAY_EVENT, { detail: tick })) } catch { /* no page to tell */ }
    return tick
  } catch {
    return null
  }
}
