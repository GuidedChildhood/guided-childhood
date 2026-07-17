// A tiny shared lock so the Home popups never stack on top of each other. The
// DiGi welcome sheet, the setup unlock toast and the Now coach mark all used to
// fire the moment Home loaded, landing three at once. Now each waits about a
// minute after login and takes this lock before it shows, so only one is ever up
// at a time and the others quietly wait their turn. Session scoped, so it resets
// on a fresh login and never wedges shut across days.

const LOCK_KEY = 'gc_popup_open'

// A shared, staggered delay so nothing pops on load. Ordered so the welcome
// greeting goes first, then the toast, then the coach mark, each a beat apart.
export const POPUP_DELAY = {
  welcome: 60_000,
  toast: 63_000,
  coach: 66_000,
} as const

export function isPopupOpen(): boolean {
  try { return sessionStorage.getItem(LOCK_KEY) != null } catch { return false }
}

export function openPopup(name: string): void {
  try { sessionStorage.setItem(LOCK_KEY, name) } catch { /* private mode */ }
}

export function closePopup(name: string): void {
  try { if (sessionStorage.getItem(LOCK_KEY) === name) sessionStorage.removeItem(LOCK_KEY) } catch { /* private mode */ }
}

// Wait out the base delay, then hold until no other popup is up, then run. Give
// back a cleanup that cancels whichever timer is pending. Used by the toast and
// the coach mark so they queue behind the welcome sheet instead of stacking.
export function whenClear(baseDelayMs: number, run: () => void): () => void {
  let cancelled = false
  let timer: ReturnType<typeof setTimeout>
  const tick = () => {
    if (cancelled) return
    if (isPopupOpen()) { timer = setTimeout(tick, 2_000); return }
    run()
  }
  timer = setTimeout(tick, baseDelayMs)
  return () => { cancelled = true; clearTimeout(timer) }
}
