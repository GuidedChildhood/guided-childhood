// NO NEW DESIGN THAT READS AS MACHINE MADE.
//
// Justin, 19 November 2026: "make sure we apply a non AI tool to everything we
// build relating to design as don't want it to look AI, I want it to be
// visually like a top Apple UX designer has made this". The checklist, the
// sources and the judgement half are in .claude/skills/uiux-pro-max/design-tells.md.
// This file is the half a machine can judge: no model, just patterns.
//
// ── WHAT IT LOOKS FOR ───────────────────────────────────────────────────────
//
// The visual tells of AI generated sites that designers named in 2024 to 2026
// (the defaults v0, Lovable and template Tailwind leave behind), plus the
// checkable parts of Apple's Human Interface Guidelines. Each rule below says
// where it came from. None of them is proof a page was machine made; each is a
// sign that a default was left untouched, which is the thing worth removing.
//
// ── A RATCHET, NOT A SWEEP ──────────────────────────────────────────────────
//
// The site already holds some of these (the house mono eyebrow, a few glass
// headers, the odd 0.6rem label). Rewriting them all at once would touch
// hundreds of files for no visible gain. So scripts/design-tells-baseline.json
// records today's count per file and per rule, and the guard fails only when a
// file holds MORE than that. Old pages are left alone; a new page starts at
// zero, so it is built clean. Same pattern as check-hex-ratchet.mjs.
//
// A line carrying `design-ok:` with a reason is skipped, for the rare place a
// pattern is the right call (a sticky header that genuinely needs the blur).
// A bare design-ok with no reason does not count.
//
// Usage: node scripts/check-design-tells.mjs [--update] [--list]
//   --update  writes lower counts back (never raises one, never adds a file)
//   --list    prints every current finding, for a cleanup pass

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const BASELINE = join(ROOT, 'scripts/design-tells-baseline.json')
const DIRS = ['app', 'components', 'shared', 'schools/app', 'schools/components']
const EXT = /\.(tsx|css)$/
const UPDATE = process.argv.includes('--update')
const LIST = process.argv.includes('--list')

// A purple, indigo or violet hex: hue 240 to 290 degrees with real saturation.
// Tailwind UI's indigo defaults went into the training data, which is why
// generated sites reach for them (Adam Wathan, August 2025).
function isPurple(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map(c => c + c).join('')
  h = h.slice(0, 6)
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  if (d < 0.15) return false
  const l = (max + min) / 2
  const s = d / (1 - Math.abs(2 * l - 1))
  if (s < 0.3) return false
  let hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  hue = (hue * 60 + 360) % 360
  return hue >= 240 && hue <= 290
}

function remToPx(v, unit) { return unit === 'rem' || unit === 'em' ? v * 16 : v }

// Each rule: an id, what it is in a sentence, and a test on one line of code
// (comments already removed). Returns how many times the line breaks the rule.
export const RULES = [
  {
    id: 'gradient-text',
    what: 'gradient text (background clipped to the letters), the most common generated heading',
    test: l => (l.match(/background-?clip['"]?\s*[:=]\s*['"]?text|backgroundClip:\s*['"]text|WebkitBackgroundClip:\s*['"]text|\bbg-clip-text\b/gi) || []).length,
  },
  {
    id: 'purple-gradient',
    what: 'a gradient through purple, indigo or violet',
    test: l => {
      let n = 0
      for (const m of l.matchAll(/(?:linear|radial|conic)-gradient\(([^)]*(?:\([^)]*\)[^)]*)*)\)/gi)) {
        if ((m[1].match(/#[0-9a-f]{3,8}\b/gi) || []).some(isPurple) || /\b(?:indigo|violet|purple|blueviolet|rebeccapurple)\b/i.test(m[1])) n++
      }
      n += (l.match(/\b(?:from|via|to)-(?:indigo|violet|purple)-\d{2,3}\b/g) || []).length
      return n
    },
  },
  {
    id: 'glass',
    what: 'a frosted glass panel (backdrop blur)',
    test: l => (l.match(/backdrop-?filter['"]?\s*[:=]\s*['"]?blur|backdropFilter:\s*['"`]blur|\bbackdrop-blur(?:-\w+)?\b/gi) || []).length,
  },
  {
    id: 'edge-stripe',
    what: 'a thick coloured stripe down one edge of a card',
    test: l => (l.match(/border-?left['"]?\s*[:=]\s*['"`]?(?:[3-9]|\d{2})px\s+solid|borderLeft:\s*['"`](?:[3-9]|\d{2})px\s+solid|\bborder-l-(?:4|8)\b/gi) || []).length,
  },
  {
    id: 'banned-font',
    what: 'a default AI font (Inter, Roboto, Arial, Space Grotesk, Geist, Syne)',
    test: l => (/font-?family|fontFamily|next\/font|from ['"]geist/i.test(l) ? (l.match(/\b(?:Inter|Roboto|Arial|Space[ _]Grotesk|Geist|Syne)\b/g) || []).length : 0),
  },
  {
    id: 'emoji-icon',
    what: 'an emoji standing in for an icon (sparkles, rockets, lightbulbs)',
    test: l => (l.match(/[✨\u{1F680}\u{1F4A1}\u{1F525}\u{1F31F}\u{2B50}\u{1F3AF}\u{1F48E}\u{26A1}]/gu) || []).length,
  },
  {
    id: 'glow-shadow',
    what: 'a big soft or coloured glow shadow (blur of 40px or more)',
    test: l => {
      let n = 0
      for (const m of l.matchAll(/box-?shadow['"]?\s*[:=]\s*['"`]?([^;'"`]+)|boxShadow:\s*['"`]([^'"`]+)/gi)) {
        const v = m[1] || m[2] || ''
        if (v.split(/,(?![^(]*\))/).some(part => {
          const nums = [...part.matchAll(/(-?\d*\.?\d+)px/g)].map(x => parseFloat(x[1]))
          return nums.length >= 3 && nums[2] >= 40
        })) n++
      }
      return n + (l.match(/\bshadow-(?:xl|2xl)\b/g) || []).length
    },
  },
  {
    id: 'bouncy-ease',
    what: 'bounce or elastic easing (Apple: motion is purposeful and brief)',
    test: l => (l.match(/ease:\s*['"`](?:bounce|elastic|back)[\w.()]*/gi) || []).length,
  },
  {
    id: 'light-weight',
    what: 'a light or thin font weight under 400 (Apple: avoid Ultralight, Thin and Light)',
    test: l => (l.match(/font-?weight['"]?\s*[:=]\s*['"]?[123]00\b|fontWeight:\s*['"]?[123]00\b|\bfont-(?:thin|extralight|light)\b/gi) || []).length,
  },
  {
    id: 'tiny-text',
    what: 'text set under 11px (Apple: 11pt is the smallest legible size)',
    test: l => {
      let n = 0
      for (const m of l.matchAll(/font-?size['"]?\s*[:=]\s*['"`]?(\d*\.?\d+)(px|rem|em)\b|fontSize:\s*['"`](\d*\.?\d+)(px|rem|em)['"`]|fontSize:\s*(\d+)(?=\s*[,}])/gi)) {
        const v = parseFloat(m[1] ?? m[3] ?? m[5]); const unit = (m[2] ?? m[4] ?? 'px').toLowerCase()
        if (remToPx(v, unit) < 11) n++
      }
      return n
    },
  },
  {
    id: 'arrow-glyph',
    what: 'a "→" tacked on to a button or link (named as the next wave of generated defaults)',
    test: l => (l.match(/→/g) || []).length,
  },
  {
    id: 'dot-meta-line',
    what: 'an "A · B · C" meta line (named as the next wave of generated defaults)',
    test: l => (l.match(/\s·\s/g) || []).length,
  },
]

function* walk(dir) {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (EXT.test(name)) yield p
  }
}

// Comments out, keeping the newlines so line numbers still point at the code.
function stripComments(src) {
  return src
    .replace(/(^|[\s{(,;])\/\*[\s\S]*?\*\//gm, (m, pre) => pre + m.slice(pre.length).replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/gm, (m, pre) => pre + ' '.repeat(m.length - pre.length))
}

const OK = /design-ok:\s*\S/

export function findings(src) {
  const raw = src.split('\n')
  const lines = stripComments(src).split('\n')
  const out = []
  lines.forEach((line, i) => {
    if (OK.test(raw[i]) || (i > 0 && OK.test(raw[i - 1]))) return
    for (const r of RULES) {
      const n = r.test(line)
      for (let k = 0; k < n; k++) out.push({ rule: r.id, line: i + 1 })
    }
  })
  return out
}

const current = {}
const where = {}
for (const dir of DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file)
    const f = findings(readFileSync(file, 'utf8'))
    if (!f.length) continue
    current[rel] = {}
    where[rel] = {}
    for (const { rule, line } of f) {
      current[rel][rule] = (current[rel][rule] || 0) + 1
      ;(where[rel][rule] ||= []).push(line)
    }
  }
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null
const WHAT = Object.fromEntries(RULES.map(r => [r.id, r.what]))

if (!baseline) {
  writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n')
  const total = Object.values(current).reduce((a, r) => a + Object.values(r).reduce((x, y) => x + y, 0), 0)
  console.log(`design-tells: no baseline yet, wrote one with ${total} existing findings across ${Object.keys(current).length} files.`)
  process.exit(0)
}

if (LIST) {
  for (const [file, rules] of Object.entries(where)) for (const [rule, lines] of Object.entries(rules)) console.log(`${file}  ${rule}  lines ${lines.join(', ')}`)
}

const problems = []
let fewer = 0
for (const [file, rules] of Object.entries(current)) {
  for (const [rule, n] of Object.entries(rules)) {
    const allowed = baseline[file]?.[rule] ?? 0
    if (n > allowed) problems.push(`${file}: ${n - allowed} new ${rule} (${WHAT[rule]}), lines ${where[file][rule].join(', ')}`)
    else if (n < allowed) fewer += allowed - n
  }
}
for (const [file, rules] of Object.entries(baseline)) {
  for (const [rule, allowed] of Object.entries(rules)) if (!(current[file]?.[rule])) fewer += allowed
}

if (UPDATE) {
  const next = {}
  for (const [file, rules] of Object.entries(baseline)) {
    for (const [rule, allowed] of Object.entries(rules)) {
      const n = Math.min(allowed, current[file]?.[rule] ?? 0)
      if (n > 0) (next[file] ||= {})[rule] = n
    }
  }
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + '\n')
}

if (problems.length) {
  console.error('design-tells FAILED: new design that reads as machine made.\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nThe fix and the reason for each are in .claude/skills/uiux-pro-max/design-tells.md.')
  console.error('If the pattern is genuinely right here, add `design-ok: <reason>` on the line.')
  process.exit(1)
}

console.log(`design-tells: no new machine made design.${fewer ? ` ${fewer} fewer than the baseline${UPDATE ? ', written back' : ': run with --update to lock that in'}.` : ''}`)
