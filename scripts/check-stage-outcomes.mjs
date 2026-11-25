// The stage check result quotes the curriculum, word for word.
//
// lib/content/stage-outcomes.ts copies three lesson outcomes per stage onto
// the result page (Justin, 25 November 2026: lead with the curriculum). A copy
// drifts silently: a lesson is rewritten, the page keeps quoting the old
// sentence, and a parent is promised something the product no longer teaches.
// So for every line this holds that:
//
//   1. the module exists in content/modules,
//   2. the outcome is its single_action_outcome exactly, and the title its title,
//   3. its key stage belongs to that stage in shared/stage-map.ts,
//   4. every stage has at least one line, and nothing carries a dash.
//
// Usage: node scripts/check-stage-outcomes.mjs

import { readFileSync, existsSync } from 'node:fs'

const fails = []
const ok = []

const src = readFileSync('lib/content/stage-outcomes.ts', 'utf8')
const map = readFileSync('shared/stage-map.ts', 'utf8')
const ksLine = map.match(/STAGE_OF_KEY_STAGE[^=]*=\s*(\{[^\n]*\})/)
if (!ksLine) {
  console.log('FAIL  could not read STAGE_OF_KEY_STAGE from shared/stage-map.ts')
  process.exit(1)
}
const stageOfKs = Object.fromEntries([...ksLine[1].matchAll(/(\w+):\s*'(\w+)'/g)].map(m => [m[1], m[2]]))
const STAGE_IDS = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

const blocks = [...src.matchAll(/^  ([1-5]): \[\n([\s\S]*?)\n  \],/gm)]
const seen = new Set()
for (const [, n, body] of blocks) {
  const stage = STAGE_IDS[Number(n) - 1]
  const rows = [...body.matchAll(/\{ moduleId: '([^']+)', title: '([^']+)', outcome: '([^']+)' \}/g)]
  if (!rows.length) fails.push(`Stage ${n} has no curriculum lines.`)
  for (const [, id, title, outcome] of rows) {
    const file = `content/modules/${id}.json`
    if (!existsSync(file)) { fails.push(`Stage ${n}: ${id} is not a module in content/modules.`); continue }
    const mod = JSON.parse(readFileSync(file, 'utf8'))
    if (mod.row?.single_action_outcome !== outcome) fails.push(`Stage ${n}: ${id} outcome no longer matches the lesson. Lesson says "${mod.row?.single_action_outcome}", page says "${outcome}".`)
    if (mod.row?.title !== title) fails.push(`Stage ${n}: ${id} title no longer matches. Lesson says "${mod.row?.title}", page says "${title}".`)
    if (stageOfKs[mod.key_stage] !== stage) fails.push(`Stage ${n}: ${id} is ${mod.key_stage}, which shared/stage-map.ts puts on ${stageOfKs[mod.key_stage]}, not ${stage}.`)
    if (/[‐-―-]/.test(title + outcome)) fails.push(`Stage ${n}: a dash in ${id}.`)
  }
  seen.add(n)
}
for (const n of ['1', '2', '3', '4', '5']) if (!seen.has(n)) fails.push(`Stage ${n} is missing from STAGE_OUTCOMES.`)
if (!fails.length) ok.push(`every line on the result page is a real lesson outcome, word for word, on its own stage (${blocks.length} stages)`)

for (const line of ok) console.log(`PASS  ${line}`)
for (const line of fails) console.log(`FAIL  ${line}`)
console.log(fails.length ? `\n${fails.length} failed` : '\nall passed')
process.exit(fails.length ? 1 : 0)
