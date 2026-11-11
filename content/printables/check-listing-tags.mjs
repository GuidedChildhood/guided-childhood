// Checks the Etsy tags in a pack's listing/listing.md: exactly 13, each 20
// characters or fewer (Etsy's limit), no repeats, and the Characters column
// telling the truth. Also checks the title is within Etsy's 140.
//
//   node content/printables/check-listing-tags.mjs [listing.md ...]
//
// With no arguments it checks the packs the Passport names. The tags sit
// in a table under a heading that starts "## 13 tags", one row per tag:
// | tag | characters |
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const DEFAULT = ['calm-down-kit', 'starter-pack', 'star-chart', 'earn-your-screen-time', 'family-phone-agreement', 'script-cards', 'star-swap-shop',
  'phone-treasure-hunt', 'planet-day-flip-chart', 'jobs-board', 'table-talk-cards', 'road-to-16-board-game', 'christmas-phone-bundle', 'where-phones-sleep',
  // listed 11 November 2026: four older games and eight spin offs
  'a-to-z-showdown', 'ice-cream-shop', 'school-year-planner', 'word-fishing', 'star-breathing-poster', 'feelings-cards', 'weekly-routine-chart',
  'routine-picture-cards', 'car-bingo', 'devices-sleep-here-sign', 'family-tech-rules', 'screen-time-tokens']
  .map(p => join(ROOT, p, 'listing/listing.md'))
const files = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT

let failed = 0
for (const file of files) {
  const md = readFileSync(file, 'utf8')
  const problems = []
  const title = md.match(/^## Title[^\n]*\n+([^\n]+)/m)?.[1]?.trim()
  if (!title) problems.push('no title under "## Title"')
  else if (title.length > 140) problems.push(`title is ${title.length} characters, Etsy allows 140`)
  const declared = md.match(/^## Title \((\d+) characters\)/m)?.[1]
  if (title && declared && +declared !== title.length) problems.push(`title heading says ${declared} characters, it is ${title.length}`)

  const section = md.split(/^## 13 tags[^\n]*$/m)[1]?.split(/^## /m)[0] ?? ''
  const rows = section.split('\n').filter(l => /^\|/.test(l) && !/^\|\s*-/.test(l) && !/^\|\s*Tag\s*\|/i.test(l))
  const tags = rows.map(r => r.split('|').map(c => c.trim())).map(c => ({ tag: c[1], said: +c[2] }))
  if (tags.length !== 13) problems.push(`${tags.length} tags, Etsy takes 13`)
  const seen = new Set()
  for (const { tag, said } of tags) {
    if (tag.length > 20) problems.push(`"${tag}" is ${tag.length} characters, the limit is 20`)
    if (said !== tag.length) problems.push(`"${tag}" says ${said} characters, it is ${tag.length}`)
    if (seen.has(tag.toLowerCase())) problems.push(`"${tag}" is repeated`)
    seen.add(tag.toLowerCase())
  }
  const name = file.replace(ROOT + '/', '')
  if (problems.length) { failed++; console.log(`FAIL  ${name}\n      ${problems.join('\n      ')}`) }
  else console.log(`PASS  ${name}  (title ${title.length}, 13 tags)`)
}
process.exit(failed ? 1 : 0)
