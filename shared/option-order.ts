// THE ORDER A CHOICE SLIDE'S OPTIONS ARE SHOWN IN, ON THE WALL AND ON PAPER.
//
// The decks are authored with the right answer wherever it reads best, which
// on most of them is the first line: 143 of the 194 choice slides, and 57 of
// the 68 exit card questions (sync plan F2, 9 October 2026). A child learns
// that in two lessons. The player has hidden it since the shuffle landed; the
// printed exit card kept the authored order, so the paper version of the same
// question answered A almost every time.
//
// One shuffle, so the two cannot drift. The player seeds it from a fresh run
// salt plus the slide index (Back then Next shows the same order, Run it again
// deals a fresh one). Paper seeds it from the module and the slide, so a
// reprint next term matches the answer key printed today.
//
// It lives here rather than in the player because the player is a client
// module and the print pages are server components: a function exported from
// a 'use client' file cannot be called on the server. The player imports it
// from here, and scripts/check-schools-must-fixes.mjs fails if a second copy
// ever grows back.

/** A seeded shuffle of 0..count-1 (Park and Miller, then Fisher and Yates). */
export function optionOrder(count: number, seed: number): number[] {
  const idx = Array.from({ length: count }, (_, i) => i)
  let s = (seed % 2147483647) || 1
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return idx
}

/** A fixed seed for a printed card: the module and the slide's place in the
 *  deck, hashed (FNV 1a) into the shuffle's range. The same lesson always
 *  prints the same order; two slides in one lesson do not share one. */
export function printSeed(moduleId: string, slideIndex: number): number {
  let h = 0x811c9dc5
  for (const ch of `${moduleId}#${slideIndex}`) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return (h % 2147483646) + 1
}

/** The options of one choice slide as printed, and the printed letter of the
 *  right answer, both from the same order so the key cannot disagree. */
export function printedOptions<T extends { correct?: boolean }>(
  moduleId: string, slideIndex: number, options: T[],
): { options: T[]; answer: string | null } {
  const order = optionOrder(options.length, printSeed(moduleId, slideIndex))
  const shown = order.map(i => options[i])
  const at = shown.findIndex(o => o.correct)
  return { options: shown, answer: at >= 0 ? String.fromCharCode(65 + at) : null }
}
