#!/usr/bin/env node
/**
 * Word budget for Social Billboard slides. A phone shows a slide for about two
 * seconds, so the first slide carries 12 words at most and every other slide 25.
 *   node tools/tsb-playlist-card/check-words.mjs [decks/x.json ...]
 * Exits 1 if any slide is over budget. Single image decks (one slide) get 25.
 * Chips are not counted: they are labels read at a glance (age, minutes).
 */
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const files = args.length ? args : readdirSync(join(HERE, 'decks')).filter((f) => /^series-/.test(f)).map((f) => join(HERE, 'decks', f))
let bad = 0
for (const f of files) {
  const d = JSON.parse(readFileSync(f, 'utf8'))
  ;(d.slides || []).forEach((s, i) => {
    const text = [s.kicker, s.big, s.body, s.note, ...(s.list || []), s.ends].filter(Boolean).join(' ').replace(/\*\*/g, '')
    const n = text.split(/\s+/).filter(Boolean).length
    const cap = i === 0 && d.slides.length > 1 ? 12 : 25
    if (n > cap) { bad++; console.log(`OVER  ${f.split('/').pop()} slide ${i + 1}: ${n} words (max ${cap})`) }
  })
}
console.log(bad ? `${bad} slide(s) over budget` : 'PASS  every slide within its word budget')
process.exit(bad ? 1 : 0)
