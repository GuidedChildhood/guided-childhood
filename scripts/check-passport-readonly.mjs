// A child looking at the family passport sees the shape of the work, and never
// an adult's notes about them.
//
// Justin chose the child's read only view on 10 September 2026. The book was
// built for a signed in parent, so every row on it links out to a grown up's
// page and the foot of it carries a shop link. Handing that same component to a
// child needed two things to be true, and neither of them fails a typecheck:
//
//   1. NOTHING LINKS OUT. A child tapping a slot must not land on the parent's
//      device setup, and must never be sent to a shop.
//   2. NO DETAIL. The five slots draw a mark and one word. `detail` is where
//      "2 to resolve" lives, and a child reading that learns their parent has
//      logged two problems about them. The shape of the work is theirs to see.
//      The contents of an adult's notes are not.
//
// The second is the one that matters and the one most likely to be undone by
// somebody being helpful: adding the count to a slot looks like an improvement
// right up until you remember who else is holding the phone.

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

const slots = readFileSync('components/pathway/StageSlots.tsx', 'utf8')
const book = readFileSync('components/pathway/PassportBook.tsx', 'utf8')
const kid = readFileSync('components/kid/KidPassport.tsx', 'utf8')

// ── 1. The slots never print the detail ────────────────────────────────────
//
// Two ways the detail can reach a child: drawn on the slot, or spoken in the
// label a screen reader reads out. The second is the one that got through the
// first time this was checked.
if (/>\s*\{sec\.detail\}/.test(slots) || /\{sec\.detail\}\s*</.test(slots)) {
  fails.push('StageSlots draws sec.detail on the slot. That is where "2 to resolve" lives, and the child reads this component too.')
} else if (!/interactive\s*\?/.test(slots) || !/sec\.detail/.test(slots)) {
  fails.push('StageSlots no longer varies its spoken label by interactive. The detail is read aloud on the child app unless it does.')
} else {
  ok.push('the slots draw a mark and a word, and speak the detail only on the parent copy')
}

// ── 2. The book takes a read only mode, and it reaches the links ───────────
if (!/readOnly\s*=\s*false/.test(book) && !/readOnly\?:\s*boolean/.test(book)) {
  fails.push('PassportBook no longer takes readOnly. The child renders this component and must not get a parent build of it.')
} else {
  ok.push('PassportBook still takes readOnly')
}
if (!/\{!readOnly && \(/.test(book)) {
  fails.push('Nothing in PassportBook is gated on readOnly any more. The shop link and the stage call to action both were.')
} else {
  const gated = (book.match(/\{!readOnly && \(/g) ?? []).length
  ok.push(`${gated} block${gated === 1 ? '' : 's'} gated on readOnly`)
}
if (/keepsakes/.test(book)) {
  const idx = book.indexOf('keepsakes')
  const before = book.slice(Math.max(0, idx - 900), idx)
  if (!/\{!readOnly && \(/.test(before)) {
    fails.push('The keepsakes shop link is no longer behind readOnly. A shop link on a child’s screen can only ever be a mistake.')
  } else {
    ok.push('the shop link is behind readOnly')
  }
}

// ── 3. The child's takeover passes readOnly ───────────────────────────────
// The PROP, not the word. The first version of this check tested for readOnly
// anywhere in the file, and the comment above the prop explaining why it is
// there kept the check green after the prop itself was deleted. A guard that
// its own documentation satisfies is not a guard.
const kidCode = kid.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
if (!/(^|[\s{])readOnly(\s|$|=|\/|>)/m.test(kidCode)) {
  fails.push('KidPassport renders PassportBook without the readOnly prop, so a child gets the parent build with every link live.')
} else {
  ok.push("the child's passport passes readOnly")
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
