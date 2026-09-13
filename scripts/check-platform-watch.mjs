// Platform changes reach a family only through Justin's click.
//
// Justin, 13 September 2026, approving the recommendation: DiGi stays aware of
// the changes on the platforms from a SOURCE, and the human gate on anything
// self learned stays. Four rules, importing the real config where there is
// one, and reading the code with comments blanked where there is not:
//
//   A. The source list names the four families: Ofcom, the ICO, Common Sense
//      Media, and at least one platform newsroom.
//   B. The watch and the hand fed route write only status draft.
//   C. Only the founder gated admin route writes status published, and it
//      fans out to families only after that write.
//   D. The fan out uses a kind the prompts table accepts.
//
//   node --experimental-strip-types scripts/check-platform-watch.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []
const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')

// ── A ────────────────────────────────────────────────────────────────────────
const probe = `
import { PLATFORM_SOURCES } from './lib/config/platform-sources.ts'
console.log(JSON.stringify(PLATFORM_SOURCES))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  problems.push(`A: the probe could not read the source list: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
} else {
  const sources = JSON.parse(r.stdout.trim().split('\n').pop())
  const domains = sources.map(s => s.domain)
  const need = [['ofcom.org.uk', 'Ofcom'], ['ico.org.uk', 'the ICO'], ['commonsensemedia.org', 'Common Sense Media']]
  for (const [d, name] of need) {
    if (!domains.includes(d)) problems.push(`A: ${name} (${d}) is missing from the source list`)
  }
  if (!sources.some(s => s.kind === 'platform')) problems.push('A: no platform newsroom in the source list')
  if (!problems.some(p => p.startsWith('A:'))) ok.push('A: the four source families are listed')
}

// ── B ────────────────────────────────────────────────────────────────────────
const draft = blank(readFileSync('lib/ai-updates/draft.ts', 'utf8'))
const cron = blank(readFileSync('app/api/cron/platform-watch/route.ts', 'utf8'))
const refresh = blank(readFileSync('app/api/ai-updates/refresh/route.ts', 'utf8'))
if (!/status: 'draft' as const/.test(draft)) problems.push('B: insertDrafts no longer writes status draft')
for (const [name, src] of [['the watch cron', cron], ['the refresh route', refresh], ['the drafting module', draft]]) {
  if (/'published'/.test(src)) problems.push(`B: ${name} mentions status published; only the admin route may`)
}
if (!problems.some(p => p.startsWith('B:'))) ok.push('B: the watch and the refresh route write drafts only')

// ── C ────────────────────────────────────────────────────────────────────────
const adminRoute = blank(readFileSync('app/api/admin/ai-updates/route.ts', 'utf8'))
if (!/FOUNDER_EMAIL/.test(adminRoute)) problems.push('C: the admin route does not know the founder')
// The gate has to sit inside POST, before the publish write. A gate on GET
// alone lists drafts safely and publishes them to anyone.
const postAt = adminRoute.indexOf('export async function POST')
const post = postAt === -1 ? '' : adminRoute.slice(postAt)
const gateAt = post.indexOf('requireFounder()')
const publishAt = post.indexOf("status: 'published'")
const fanAt = post.indexOf("from('digi_prompts').insert(")
if (postAt === -1 || gateAt === -1 || publishAt === -1 || gateAt > publishAt) problems.push('C: POST publishes without the founder gate before it')
if (publishAt === -1 || fanAt === -1 || fanAt < publishAt) problems.push('C: the fan out to families does not follow the publish write')
if (!problems.some(p => p.startsWith('C:'))) ok.push('C: only the founder gated route publishes, and the fan out follows it')

// ── D ────────────────────────────────────────────────────────────────────────
const TABLE_KINDS = ['watch_for', 'tip', 'parent_care', 'new_research', 'celebration', 'school', 'follow_up', 'stage_arrival', 'insight']
const kindMatch = adminRoute.match(/kind: '([a-z_]+)'/)
if (!kindMatch) problems.push('D: the fan out names no kind')
else if (!TABLE_KINDS.includes(kindMatch[1])) problems.push(`D: the fan out kind ${kindMatch[1]} is one the table rejects`)
else ok.push('D: the fan out uses a kind the table accepts')

if (problems.length > 0) {
  console.error('check-platform-watch FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-platform-watch ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
