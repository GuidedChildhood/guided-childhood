'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// COMING BACK IN STARTS WHERE THE APP STARTS.
//
// Justin, 8 August 2026: "when we go into apps from closed it takes to right
// place as per normal app practice, not lands mid screen."
//
// He is describing the browser doing its job in the wrong context. Restoring
// your exact scroll position is correct for an article you were reading and
// wrong for an app you have come back to: a dashboard whose whole purpose is to
// say what to do next cannot open halfway down itself, with the answer already
// scrolled off the top.
//
// The child app got this on its own screen already. This is the same rule for
// the grown up's side, in one place so every dashboard page inherits it rather
// than six pages each remembering to.
//
// WHAT IT DELIBERATELY DOES NOT DO.
//
// It does not touch the back button. Going back to a list you were halfway down
// and finding your place kept IS normal app practice, and it is the one case
// where restoring scroll is exactly right. So history.scrollRestoration is left
// alone and nothing here runs on a back navigation: this only fires on a fresh
// load of a page and on a real return from the background.
//
// THE FIVE MINUTE FLOOR is the same number the child app uses, for the same
// reason. Glancing at a notification and coming straight back is not returning
// to the app, and yanking a parent to the top for a four second detour would be
// its own annoyance. Only a genuine absence resets the screen to its start.

/** How long away counts as having left, rather than glanced away. */
const AWAY_MS = 5 * 60_000

/**
 * Be at the top, do not travel to it.
 *
 * globals.css sets `html { scroll-behavior: smooth }`, which is right for a tap
 * that moves you somewhere and wrong here: a plain scrollTo would make a
 * resumed app visibly slide up through its own content, which looks like the
 * page doing something rather than the app simply being open. Instant is the
 * whole point, so it is asked for explicitly rather than inherited.
 */
function toTop() {
  try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior }) }
  catch { window.scrollTo(0, 0) }
}

export default function OpenAtTheTop() {
  const pathname = usePathname()

  useEffect(() => {
    // A fresh mount of a route. On a cold open this is the app starting, and on
    // an in app navigation it is a new page, which should also begin at its own
    // top rather than inheriting the last page's scroll.
    toTop()

    // The PWA resuming does NOT remount, so a mount effect alone would miss the
    // exact case Justin is describing: the app was closed, or backgrounded for
    // long enough to be evicted, and comes back with the old scroll restored.
    let hiddenAt: number | null = null
    const onVis = () => {
      if (document.hidden) { hiddenAt = Date.now(); return }
      if (hiddenAt !== null && Date.now() - hiddenAt > AWAY_MS) toTop()
      hiddenAt = null
    }
    // pageshow with persisted covers the back forward cache, which iOS uses
    // heavily and which restores a page wholesale without a mount or a
    // visibility change. Without it, an app resumed from the cache is the one
    // route back to the mid screen landing.
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) toTop() }

    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pageshow', onShow)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pageshow', onShow)
    }
  }, [pathname])

  return null
}
