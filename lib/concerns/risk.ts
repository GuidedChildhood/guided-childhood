// Does what a parent just typed need a helpline rather than a pathway?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// A clinical review of the starter quiz reveal on 9 September 2026 found a live
// harm path that nobody had looked at, and it is worth stating plainly because
// it is a consequence of a change we made for good reasons.
//
// The reveal echoes the parent's own typed worry back as a card HEADING, in
// bold display type, with a drawn icon beside it. That is right for "speaking
// on phone a lot as friend has a new one". The field does not know that is what
// it will get. A parent who types "she said she doesn't want to be here" would
// have had those words set as a decorative heading, wrapped in chips reading
// Daily check in and Moments, told their worry was "in the queue for the ones
// we write next", with the safety block underneath rather than above.
//
// Every one of those was a deliberate improvement. Together, on that sentence,
// they are a product treating a disclosure of suicidal ideation as a content
// gap in a backlog.
//
// So the free text field gets a gate. It is deliberately crude: this is not a
// classifier and it does not need to be, because the cost of the two errors is
// wildly asymmetric. A false positive shows a frightened parent a helpline they
// did not need, which is a small harm. A false negative shows a parent who has
// just typed the worst sentence of their life a marketing card, which is not.
//
// ── WHAT IT DELIBERATELY DOES NOT DO ────────────────────────────────────────
//
// It does not block, hide or refuse anything, and it does not throw the words
// away. The parent keeps their place and their typing: the reveal reorders
// itself and leads with help. A parent must never have to choose between
// getting help and losing what they wrote.

/** Phrases that mean stop selling and start helping. Lower case, substring
 *  matched against a normalised string, so plurals and tenses ride along. */
const RISK = [
  // Self harm and suicidality, including the indirect phrasings parents
  // actually use, which are usually the ones a keyword list misses.
  'hurt herself', 'hurt himself', 'hurt themselves', 'hurt themself', 'hurting herself',
  'hurting himself', 'hurting themselves', 'harm herself', 'harm himself', 'harm themselves',
  'self harm', 'selfharm', 'self-harm',
  'kill herself', 'kill himself', 'kill themselves', 'kill themself',
  'suicide', 'suicidal', 'end it all', 'end her life', 'end his life', 'end their life',
  'not want to be here', 'not wanting to be here', 'dont want to be here',
  'doesnt want to be here', 'does not want to be here', 'wants to die', 'want to die',
  'wish i was dead', 'wishes she was dead', 'wishes he was dead', 'better off without',
  'cutting herself', 'cutting himself', 'cutting themselves', 'cuts on her', 'cuts on his',
  // Eating, where the risk is medical and urgent rather than behavioural.
  'not eating', 'stopped eating', 'anorexi', 'bulimi', 'making herself sick',
  'making himself sick', 'starving herself', 'starving himself',
  // Contact and content that is a reporting matter, not a scripts matter.
  'groom', 'predator', 'sending nudes', 'sent nudes', 'naked pictures', 'naked photos',
  'indecent image', 'sexual messages', 'older man', 'blackmail', 'sextortion',
]

/**
 * True when the words need a helpline in front of them.
 *
 * Normalises curly apostrophes and collapses punctuation first, because
 * "doesn’t" and "doesn't" and "doesnt" are the same sentence to a frightened
 * parent typing fast on a phone.
 */
export function needsHelpFirst(text: string | null | undefined): boolean {
  if (!text) return false
  const t = String(text)
    .toLowerCase()
    // Apostrophes are DELETED rather than turned into spaces, so "doesn't",
    // "doesn’t" and "doesnt" all normalise to one token. The first version
    // kept them and the patterns assumed they were gone, so the single most
    // likely sentence a parent would type, "she said she doesn't want to be
    // here", did not match. It failed silently, which is the only way this
    // function can fail: nothing errors, the page simply sells.
    .replace(/['\u2018\u2019\u02bc\u00b4\`]/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return false
  return RISK.some(p => t.includes(p))
}
