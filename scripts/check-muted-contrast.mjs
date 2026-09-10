// The quiet grey is still readable.
//
// --ink-muted carries the eyebrows, the recency lines, the "last time hard
// going" under every check in row: most of the second sentence on the product.
// It was #8888A0, which is 3.46 to 1 on white and 2.98 on tint sage, against a
// 4.5 floor for body text. Nobody complains about grey text. They just stop
// reading it, and the sentence that says why the app is asking is the one they
// stop reading first.
//
// Held here rather than in the browser because this is pure arithmetic between
// two tokens: no compositing, no opacity, no gradients. The rendered check
// (check-wall-contrast.mjs) exists for the cases where that is not true.
//
// Usage: node scripts/check-muted-contrast.mjs

import { readFileSync } from 'node:fs'

const css = readFileSync('shared/tokens.css', 'utf8')

const token = name => {
  const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`))
  return m ? m[1] : null
}

const lum = hex => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const ratio = (a, b) => {
  const x = lum(a), y = lum(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

// Every pale surface the house puts muted text on. White is not a token, so it
// is named here; the rest are read from the file so a retinted background is
// checked the day it changes rather than the day somebody notices.
const SURFACES = ['#FFFFFF', ...[
  'cream', 'app-bg', 'tint-sage', 'tint-green', 'tint-blue', 'tint-amber',
  'tint-butter', 'tint-rose', 'terracotta-lt', 'warm-bg',
  'stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5',
].map(token).filter(Boolean)]

const muted = token('ink-muted')
const FLOOR = 4.5

if (!muted) {
  console.error('FAIL  --ink-muted is not a plain hex in shared/tokens.css, so nothing here can check it.')
  process.exit(1)
}

const fails = []
let worst = { ratio: 99, on: null }
for (const bg of SURFACES) {
  const r = ratio(muted, bg)
  if (r < worst.ratio) worst = { ratio: r, on: bg }
  if (r < FLOOR) fails.push(`${muted} on ${bg} is ${r.toFixed(2)} to 1, under the ${FLOOR} AA floor for body text.`)
}

if (fails.length) {
  console.error(`FAIL  --ink-muted is too light for ${fails.length} of the ${SURFACES.length} surfaces it is printed on.`)
  for (const f of fails) console.error(`      ${f}`)
  console.error('      Darken the token rather than the sentence. #65657C was the lightest value that cleared every one of them.')
  process.exit(1)
}

console.log(`PASS  --ink-muted (${muted}) clears ${FLOOR} on all ${SURFACES.length} house surfaces, worst ${worst.ratio.toFixed(2)} on ${worst.on}`)
