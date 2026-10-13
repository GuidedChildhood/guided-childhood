// ── WHAT A NOTE ON A CHILD'S SCREEN MAY CONTAIN ─────────────────────────────
//
// Justin, 13 October 2026, with screenshots of Teo's app: a whole DiGi answer
// written for the PARENT ("Teaching Teo social media is not teaching him the
// apps...") sat on the child's home under a heart and an OK button, with the
// raw markdown stars and a parent dashboard link spelled out in full.
//
// How it got there: DiGi chat offered "Send to their phone" beside "Put this
// in words for my child" on every long answer, so the parent's own advice
// could be sent before DiGi had written the child's version. That button now
// only appears under the child's version (DigiChat.tsx). These rules are the
// belt to that brace, applied where a note is written AND where it is read,
// so nothing already sitting in kid_nudges reaches a child either.

/** A note meant for the grown up, never the child. A link into the parent
 *  dashboard is the tell: nothing written for a child points there, and a
 *  child's link cannot open it anyway. */
export function isParentOnlyNote(message: string): boolean {
  return /\/dashboard(\/|\?|\b)/i.test(message)
}

/** Plain words for a child to read. Markdown stars and underscores come off,
 *  a [label](url) link keeps its label, a bare URL goes, and the spacing is
 *  tidied. Line breaks between points survive as single breaks. */
export function kidNoteText(message: string): string {
  return message
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/(^|\s)[*_](\S[^*_]*\S|\S)[*_](?=\s|[.,!?]|$)/g, '$1$2')
    .replace(/^#+\s*/gm, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

/** The notes a child's screen may show, cleaned, with any parent only note
 *  dropped. Used by the page's first render and the live poll alike. */
export function kidNotes<T extends { id: string; message: string }>(rows: T[]): T[] {
  return rows
    .filter(n => !isParentOnlyNote(n.message))
    .map(n => ({ ...n, message: kidNoteText(n.message) }))
    .filter(n => n.message.length > 0)
}
