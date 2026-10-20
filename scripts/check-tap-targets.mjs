// Is every button big enough for a thumb?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// The review board on 13 October 2026 counted 42 buttons drawn smaller than a
// thumb: close circles at 34px, the star steppers a parent uses to set a job's
// reward at 30px, the put away dots on Today at 26px. Nothing about a 30px
// button fails a build. It renders, it works with a mouse, and on a phone in
// one hand it is the button you hit twice, or the one next to it once, which
// on a stepper is the wrong number of stars.
//
// 44px is where Apple's and Google's guidance both land, and it is the
// --tap-min token in shared/tokens.css.
//
// ── THE RULE ────────────────────────────────────────────────────────────────
//
// A <button> whose inline style sets a width or a height under 44px fails,
// unless it says why it is fine. Three ways to say so:
//
//   1. className includes tap-target. The button keeps its size on the glass
//      and the .tap-target ::before in shared/tokens.css gives it an invisible
//      44px pad. For buttons that stand alone (close, dismiss, mute).
//   2. minWidth / minHeight of 44 or more on the small side.
//   3. a `tap-ok:` comment inside the tag with the reason, for a row where the
//      buttons touch edge to edge (the planet dots) or fill the row between
//      them (the day chips). A pad that overlaps a neighbour sends the tap to
//      whichever button was drawn last, so tight rows are sized for real or
//      explained, never padded.
//
// A tap-target button may not also carry overflow hidden: the pad lives
// outside the button's box and hidden would clip it back to the small size.
//
// It also holds the two rules in shared/tokens.css this depends on, the pad
// and the gold focus ring, so neither can be deleted in a tidy up without the
// guard saying so.
//
// Only inline styles are read, because that is where every one of the 42
// lived. A size set in a stylesheet class is the stylesheet's business; the
// one there (the marketing nav burger) was fixed by hand.
//
// Usage: node scripts/check-tap-targets.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const MIN = 44
const DIRS = ['app', 'components', 'shared', 'schools/app', 'schools/components']

function* walk(dir) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (name.endsWith('.tsx')) yield p
  }
}

// The opening tag runs to the first `>` that is not inside braces, so arrow
// functions in an onClick and comments in a style object stay inside it.
function openingTag(src, start) {
  let depth = 0
  for (let i = start; i < src.length; i++) {
    const c = src[i]
    if (c === '{') depth++
    else if (c === '}') depth--
    else if (c === '>' && depth === 0) return src.slice(start, i + 1)
  }
  return src.slice(start)
}

// A literal size in px: 30, '30px', "30px", '1.5rem'. Anything computed
// (a variable, a ternary, a percentage) is not a literal and is not judged.
function px(tag, prop) {
  const re = new RegExp(`(?<![A-Za-z])${prop}:\\s*(?:(\\d+(?:\\.\\d+)?)\\s*[,}\\n]|(['"])(\\d+(?:\\.\\d+)?)(px|rem)\\2)`)
  const m = tag.match(re)
  if (!m) return null
  if (m[1] !== undefined) return Number(m[1])
  return m[4] === 'rem' ? Number(m[3]) * 16 : Number(m[3])
}

const failures = []
let checked = 0
let padded = 0

for (const dir of DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const src = readFileSync(file, 'utf8')
    const re = /<button\b/g
    let m
    while ((m = re.exec(src))) {
      const tag = openingTag(src, m.index)
      if (!/style=\{\{/.test(tag)) continue
      checked++
      const w = px(tag, 'width')
      const h = px(tag, 'height')
      const minW = px(tag, 'minWidth')
      const minH = px(tag, 'minHeight')
      const smallW = w !== null && w < MIN && !(minW !== null && minW >= MIN)
      const smallH = h !== null && h < MIN && !(minH !== null && minH >= MIN)
      const line = src.slice(0, m.index).split('\n').length
      const where = `${relative(ROOT, file)}:${line}`
      const isPadded = /className=["'{`][^>]*\btap-target\b/.test(tag)
      if (isPadded) {
        padded++
        if (/overflow:\s*['"]hidden['"]/.test(tag)) {
          failures.push(`${where}  tap-target with overflow hidden clips its own pad`)
        }
        continue
      }
      if (!smallW && !smallH) continue
      if (/tap-ok:/.test(tag)) continue
      failures.push(`${where}  ${w ?? 'auto'} by ${h ?? 'auto'}, under ${MIN}px`)
    }
  }
}

// The two rules the pad and the ring live in.
const tokens = readFileSync(join(ROOT, 'shared/tokens.css'), 'utf8')
if (!/--tap-min:\s*44px/.test(tokens)) failures.push('shared/tokens.css  --tap-min: 44px is missing')
if (!/\.tap-target::before\s*\{[^}]*var\(--tap-min\)/.test(tokens)) failures.push('shared/tokens.css  the .tap-target::before pad is missing')
if (!/:focus-visible\s*\{[^}]*outline:\s*var\(--focus-ring\)/.test(tokens)) failures.push('shared/tokens.css  the :focus-visible gold ring is missing')

if (failures.length) {
  console.error(`Tap targets: ${failures.length} problem${failures.length === 1 ? '' : 's'}\n`)
  for (const f of failures) console.error('  ' + f)
  console.error(`\nA button a thumb can miss. Size it to 44 (the --tap-min token), give a`)
  console.error(`button that stands alone className="tap-target", or for a tight row put`)
  console.error(`a "tap-ok: <reason>" comment in its style. See the header of this file.`)
  process.exit(1)
}
console.log(`Tap targets: ${checked} styled buttons read, ${padded} padded to 44, none under ${MIN}px. Focus ring and pad present.`)
