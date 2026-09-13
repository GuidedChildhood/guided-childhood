// The starter reveal, folded, and what folding must never hide.
//
// Justin, 13 September 2026, with the reveal on his phone: keep the first
// part, "fold the other parts like attached to make super efficient and
// simple, happy news style, Apple UX quality." The parts attached were the
// other parents card and the safeguarding card.
//
// Folding a safeguarding block is the kind of edit that is fine on the day
// and dangerous a month later, when someone tidies the row's visible line or
// moves the urgent version behind the same chevron for symmetry. So the four
// things that make this fold safe are held here:
//
//   1. The URGENT safeguarding block (a typed worry that trips
//      lib/concerns/risk) is never inside a Fold. It leads the page, open.
//   2. The folded safeguarding row's VISIBLE line names Childline's number
//      and 999, so a frightened parent scanning past needs no tap.
//   3. Neither card was deleted. Folded, never cut (see Fold.tsx).
//   4. There is ONE floating door, and it is hidden on the crisis path. Two
//      doors stacked was the bug this pass found; a door over Childline is
//      the one it must never reintroduce.
//
// Plus the house rule: no dash in any row label or line.
//
// Usage: node scripts/check-starter-fold.mjs

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

const code = src => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => (l.trim().startsWith('//') ? '' : l)).join('\n')

const reveal = code(readFileSync('app/(marketing)/starter-pack/ResultScreen.tsx', 'utf8'))
const fold = code(readFileSync('components/starter/Fold.tsx', 'utf8'))

// ── 1. The urgent block is open, above everything ──────────────────────────
const urgent = reveal.match(/\{helpFirst && <BiggerThanThis[^>]*urgent[^>]*\/>\}/)
if (!urgent) {
  fails.push('The urgent safeguarding block (helpFirst && <BiggerThanThis urgent />) is gone from the reveal.')
} else {
  // Walk backwards from it: the nearest <Fold or </Fold> before it must be a
  // close (or none at all), otherwise it is inside a fold.
  const before = reveal.slice(0, reveal.indexOf(urgent[0]))
  const lastOpen = before.lastIndexOf('<Fold')
  const lastClose = before.lastIndexOf('</Fold>')
  if (lastOpen > lastClose) {
    fails.push('The urgent safeguarding block sits inside a Fold. It must lead the page open, never behind a chevron.')
  } else {
    ok.push('the urgent safeguarding block is open and never folded')
  }
  const heading = reveal.indexOf('What we do about it')
  if (heading > -1 && reveal.indexOf(urgent[0]) > heading) {
    fails.push('The urgent safeguarding block has moved below the section heading. A parent who typed something frightening reads it first.')
  } else {
    ok.push('and it comes before the heading')
  }
}

// ── 2. The folded row shows the numbers without a tap ──────────────────────
const rowRe = /<Fold\b([^>]*label="When it is bigger than this"[^>]*)>/
const row = reveal.match(rowRe)
if (!row) {
  fails.push('The When it is bigger than this row is gone. The safeguarding block must stay on the page for every parent, folded or not.')
} else {
  const line = row[1].match(/line="([^"]*)"/)?.[1] ?? ''
  if (!/0800 1111/.test(line)) fails.push(`The safeguarding row's visible line no longer names Childline's number (0800 1111). It reads: "${line}"`)
  else ok.push("Childline's number is on the safeguarding row without a tap")
  if (!/\b999\b/.test(line)) fails.push(`The safeguarding row's visible line no longer names 999. It reads: "${line}"`)
  else ok.push('and so is 999')
  if (!/<BiggerThanThis[^>]*inRow/.test(reveal.slice(reveal.indexOf(row[0]), reveal.indexOf('</Fold>', reveal.indexOf(row[0]))))) {
    fails.push('The safeguarding row no longer opens onto BiggerThanThis. The numbers on the line are a summary, not the block.')
  } else {
    ok.push('and the full block is behind it')
  }
}

// ── 3. Folded, never cut ───────────────────────────────────────────────────
for (const name of ['KnownProblems', 'BiggerThanThis']) {
  if (!new RegExp(`<${name}\\b`).test(reveal)) fails.push(`${name} is no longer drawn on the reveal. Fold it, never cut it.`)
  else ok.push(`${name} is still on the page`)
}

// ── 4. One floating door, none on the crisis path ──────────────────────────
const sticky = reveal.match(/\{!helpFirst && \(\s*<StickyJoin/)
if (!sticky) {
  fails.push('StickyJoin is no longer gated on !helpFirst. A floating Finish setting up over the Childline block is the product selling over a crisis.')
} else {
  ok.push('the floating door stays away from the crisis path')
}
if (/showFloat|IntersectionObserver/.test(reveal)) {
  fails.push('A second floating door is back in the reveal (showFloat). StickyJoin is the one door; two stacked was the 13 September bug.')
} else {
  ok.push('and there is only one of it')
}

// ── The house rule ─────────────────────────────────────────────────────────
const dashes = []
for (const m of reveal.matchAll(/<Fold\b[^>]*>/g)) {
  for (const attr of ['label', 'line']) {
    const v = m[0].match(new RegExp(`${attr}="([^"]*)"`))?.[1]
    if (v && /[-–—]/.test(v)) dashes.push(`${attr}="${v}"`)
  }
}
if (!/happy\?: HappyIconName/.test(fold)) {
  fails.push('Fold no longer takes a HappyIcon, so the Good to know rows would fall back to a product icon on a row that is not about the product.')
} else {
  ok.push('Fold draws the happy news row')
}
if (dashes.length) fails.push(`A dash in a fold row: ${dashes.join(', ')}`)
else ok.push('no dash in any fold row')

for (const line of ok) console.log(`PASS  ${line}`)
for (const line of fails) console.log(`FAIL  ${line}`)
console.log(fails.length ? `\n${fails.length} failed` : '\nall passed')
process.exit(fails.length ? 1 : 0)
