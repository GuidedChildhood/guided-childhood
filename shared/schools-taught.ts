// WHICH PAGES THIS SCREEN HAS FILLED.
//
// The schools app holds no pupil data and no teacher accounts, and the 29
// August passport plan rules out lesson delivery state on the server (bridge
// b). But a passport page that never moves is a picture, not a passport, and
// Justin's ask on 13 September 2026 was that the theme "updates for
// progression" and "fills up". So the fill lives where the parents app's
// SchoolChest keeps its opened flag: in this browser, and nowhere else.
//
// WHAT IT IS. A list of module ids this screen has filled the page for: the
// class tapped Fill the page in the passport beat, or the teacher did. It is a
// fact about a screen in a classroom, the way a wall display is. It names no
// child, it is never sent anywhere, and clearing the browser clears it.
//
// WHAT IT IS NOT. It is not the passport. The passport is the child's own
// record in the parents app, filled through the home code on the parent note,
// and it never says which door a page was filled through. Every surface that
// reads this memory says so in words next to the numbers.
//
// The same module tapped twice unfills, so a teacher previewing a lesson the
// night before can put it back without a settings page.

const KEY = 'gc.schools.taught'
export const TAUGHT_EVENT = 'gc:schools-taught'

function store(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null // private mode, or storage blocked
  }
}

export function readTaught(): string[] {
  const s = store()
  if (!s) return []
  try {
    const raw = s.getItem(KEY)
    const v: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

function write(ids: string[]): string[] {
  const s = store()
  try { s?.setItem(KEY, JSON.stringify(ids)) } catch { /* full or blocked: the page still draws */ }
  try { window.dispatchEvent(new CustomEvent(TAUGHT_EVENT)) } catch { /* SSR */ }
  return ids
}

export function isTaught(moduleId: string): boolean {
  return readTaught().includes(moduleId)
}

export function markTaught(moduleId: string): string[] {
  const ids = readTaught()
  return ids.includes(moduleId) ? ids : write([...ids, moduleId])
}

export function unmarkTaught(moduleId: string): string[] {
  return write(readTaught().filter(id => id !== moduleId))
}

export function clearTaught(): void {
  write([])
}
