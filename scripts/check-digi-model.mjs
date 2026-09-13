// The model ladder holds, and the parameters that only some models accept
// never reach the ones that reject them.
//
// Sunday 13 September 2026, the DiGi review. The ladder moved a generation
// (Fable 5.1 deep, Opus 5 on chat, Haiku 4.5 fast) and two request parameters
// arrived with it: effort, which Haiku rejects with a 400, and fast mode,
// which only Opus takes. Both are decided per model inside lib/config/digi.ts
// so that a fallback down the ladder can never carry a flag to a model that
// errors on it. This guard is what makes that a rule rather than a habit.
//
// Five rules:
//
//   1. No date suffixed model id anywhere in the code. The ids are complete as
//      published; a suffix from memory is how the fast tier drifted to a name
//      the API no longer recognised.
//   2. No forced tool_choice. Fable 5.1 returns a 400 for type any or tool.
//   3. Effort reaches the chat tier and never reaches Haiku. Deep jobs keep
//      the API default.
//   4. Fast mode is only ever true for a model that supports it, flag or no
//      flag, and never when the flag is off.
//   5. The router sends mechanical jobs to the fast tier, chat to the chat
//      tier, deep jobs to the deep model, with no duplicates in any ladder.
//      And the DiGi route lets the helpers choose the model: no call site
//      passes one, and every callDigi names its task.
//
// Rules 3 to 5 import the real config rather than reading its text, so they
// test what the code does and not how it is spelled.
//
//   node --experimental-strip-types scripts/check-digi-model.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOTS = ['lib', 'app', 'schools', 'shared', 'scripts']
const EXT = /\.(ts|tsx|mjs)$/
const SKIP = /node_modules|\.next|\/\.|check-digi-model\.mjs$/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (SKIP.test(p)) continue
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (EXT.test(name)) out.push(p)
  }
  return out
}

const problems = []
const files = ROOTS.flatMap(r => { try { return walk(r) } catch { return [] } })

// 1 and 2: text rules across the codebase.
const DATED = /claude-[a-z]+(?:-\d)+-\d{8}/g
const FORCED = /tool_choice\s*:\s*\{[^}]*type\s*:\s*['"](any|tool)['"]/g
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(DATED)) {
    const line = src.slice(0, m.index).split('\n').length
    problems.push(`${f}:${line}: date suffixed model id ${m[0]}. The published ids are complete as they are.`)
  }
  for (const m of src.matchAll(FORCED)) {
    const line = src.slice(0, m.index).split('\n').length
    problems.push(`${f}:${line}: forced tool_choice (${m[1]}). Fable 5.1 returns a 400 for it. Use auto plus an instruction.`)
  }
}

// 3 to 5: the real config, with the fast mode flag ON so rule 4 is tested
// under the condition that could break it.
const probe = `
  import * as c from './lib/config/digi.ts'
  const out = {
    fast: c.DIGI_MODEL_FAST, chat: c.DIGI_MODEL_CHAT, deep: c.DIGI_MODEL,
    effortFastTier: c.digiEffortFor('chat', c.DIGI_MODEL_FAST),
    effortHaikuAnywhere: c.digiEffortFor('chat', 'claude-haiku-4-5'),
    effortChat: c.digiEffortFor('chat', c.DIGI_MODEL_CHAT),
    effortDeepJob: c.digiEffortFor('wisdom', c.DIGI_MODEL),
    fastOpus: c.fastModeFor('claude-opus-5'),
    fastSonnet: c.fastModeFor('claude-sonnet-5'),
    fastHaiku: c.fastModeFor('claude-haiku-4-5'),
    fastFable: c.fastModeFor('claude-fable-5-1'),
    ladders: { extract: c.digiModelsFor('extract'), chat: c.digiModelsFor('chat'), wisdom: c.digiModelsFor('wisdom') },
  }
  console.log(JSON.stringify(out))
`
function runProbe(env) {
  const r = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', probe], {
    env: { ...process.env, ...env }, encoding: 'utf8', cwd: process.cwd(),
  })
  if (r.status !== 0) throw new Error(`probe failed: ${r.stderr}`)
  return JSON.parse(r.stdout.trim().split('\n').pop())
}

let on, off
try {
  on = runProbe({ DIGI_FAST_MODE: '1', DIGI_MODEL_CHAT: '', DIGI_MODEL_FAST: '', DIGI_MODEL: '', DIGI_CHAT_EFFORT: '' })
  off = runProbe({ DIGI_FAST_MODE: '', DIGI_MODEL_CHAT: '', DIGI_MODEL_FAST: '', DIGI_MODEL: '', DIGI_CHAT_EFFORT: '' })
} catch (e) {
  problems.push(String(e.message))
}

if (on && off) {
  if (on.effortFastTier !== null) problems.push(`effort ${on.effortFastTier} would be sent to the fast tier (${on.fast}). Haiku rejects it with a 400.`)
  if (on.effortHaikuAnywhere !== null) problems.push('effort would be sent to a Haiku model reached by fallback.')
  if (on.effortChat === null) problems.push(`no effort on the chat tier (${on.chat}). The whole point of the tier is answering faster than the API default.`)
  if (on.effortDeepJob !== null) problems.push(`a deep job carries effort ${on.effortDeepJob}. Deep jobs keep the API default on purpose.`)

  if (!on.fastOpus) problems.push('fast mode flag on, Opus 5 not in fast mode. The flag does nothing.')
  if (on.fastSonnet || on.fastHaiku || on.fastFable) problems.push('fast mode would be sent to a model that does not take it (Sonnet, Haiku or Fable). That is a 400 on a fallback.')
  if (off.fastOpus) problems.push('fast mode flag off, Opus 5 still in fast mode. Fast mode is a pricing decision and must be opt in.')

  const L = on.ladders
  if (L.extract[0] !== on.fast) problems.push(`mechanical jobs start on ${L.extract[0]}, not the fast tier ${on.fast}.`)
  if (L.chat[0] !== on.chat) problems.push(`chat starts on ${L.chat[0]}, not the chat tier ${on.chat}.`)
  if (L.wisdom[0] !== on.deep) problems.push(`deep jobs start on ${L.wisdom[0]}, not the deep model ${on.deep}.`)
  for (const [name, ladder] of Object.entries(L)) {
    if (new Set(ladder).size !== ladder.length) problems.push(`the ${name} ladder repeats a model: ${ladder.join(' > ')}.`)
    if (ladder.length < 2) problems.push(`the ${name} ladder has nothing to fall back to.`)
  }
}

// 5b: the route lets the helpers choose.
const ROUTE = 'app/api/digi/route.ts'
const route = readFileSync(ROUTE, 'utf8')
for (const m of route.matchAll(/callDigiStream\(\{([\s\S]*?)\n\s*\}\)/g)) {
  if (/^\s*model\s*:/m.test(m[1])) {
    const line = route.slice(0, m.index).split('\n').length
    problems.push(`${ROUTE}:${line}: a stream call passes its own model. The helper chooses from the ladder so effort and fast mode match the model that answers.`)
  }
}
for (const m of route.matchAll(/(?<![\w.])(?<!function )callDigi\(\s*([^\s,)]*)/g)) {
  const first = m[1]
  if (!/^['"`]/.test(first)) {
    const line = route.slice(0, m.index).split('\n').length
    problems.push(`${ROUTE}:${line}: callDigi called without naming its task. The task picks the tier.`)
  }
}

if (problems.length > 0) {
  console.error('check-digi-model FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why each rule exists.')
  process.exit(1)
}
console.log(`check-digi-model ok: ${files.length} files clean, ladders ${on.ladders.chat[0]} / ${on.ladders.wisdom[0]} / ${on.ladders.extract[0]}, effort and fast mode gated per model.`)
