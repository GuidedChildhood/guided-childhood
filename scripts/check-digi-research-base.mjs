// The researchers file leaves the prompt only by a switch, and the switch
// keeps DiGi's stance and every hard rule whichever way it is set.
//
// Justin, 13 September 2026, on the review recommendation to drop the 11,500
// character researchers file from every prompt in favour of retrieval: go
// with it, as a switch, evals run against both before it flips. Six rules
// hold that, importing the real config and the real prompt builder rather
// than reading their text, because a guard its own documentation satisfies
// is not a guard:
//
//   A. The switch is config, its default is the file, and anything that is
//      not the word retrieval is the file.
//   B. The file base carries the researcher profiles and the ban evidence.
//      The retrieval base carries neither.
//   C. The retrieval base still carries DiGi's stance: the core argument,
//      whose work it does not build on, the honest caveat.
//   D. Every hard rule is in both prompts, word for word: the crisis rule,
//      never allow/deny, the shape versus specifics rule on researchers, the
//      three levels of knowing.
//   E. The retrieval prompt is materially shorter, or the switch is not
//      worth having.
//   F. The live route sends the configured prompt, the evals build per base,
//      and the retrieval path the switch relies on is actually called on
//      every chat request.
//
//   node --experimental-strip-types scripts/check-digi-research-base.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const problems = []
const ok = []

const probe = `
import { parseResearchBase, DIGI_RESEARCH_BASE } from './lib/config/digi.ts'
import { staticSystemFor, STATIC_SYSTEM } from './lib/digi/system.ts'
const file = staticSystemFor('file')
const retrieval = staticSystemFor('retrieval')
console.log(JSON.stringify({
  configured: DIGI_RESEARCH_BASE,
  parsed: { blank: parseResearchBase(''), undef: parseResearchBase(undefined), retrieval: parseResearchBase(' Retrieval '), junk: parseResearchBase('bank') },
  liveIsConfigured: STATIC_SYSTEM === staticSystemFor(DIGI_RESEARCH_BASE),
  fileLen: file.length,
  retrievalLen: retrieval.length,
  file, retrieval,
}))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], {
  encoding: 'utf8', cwd: process.cwd(), env: { ...process.env, DIGI_RESEARCH_BASE: '' }, maxBuffer: 16 * 1024 * 1024,
})
if (r.status !== 0) {
  problems.push(`the probe could not run the real config and prompt: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
} else {
  const o = JSON.parse(r.stdout.trim().split('\n').pop())

  // ── A: the switch ───────────────────────────────────────────────────────────
  const a = [
    [o.configured === 'file', 'A: with the variable blank the base is the file'],
    [o.parsed.blank === 'file' && o.parsed.undef === 'file' && o.parsed.junk === 'file', 'A: blank, unset or unknown means the file'],
    [o.parsed.retrieval === 'retrieval', 'A: the word retrieval, any case, means retrieval'],
  ]
  for (const [pass, label] of a) (pass ? ok : problems).push(pass ? label : `${label}: NOT so`)

  // ── B: the profiles and the ban evidence go, and only with the switch ───────
  const PROFILES = ['### Prof. Candice Odgers', '### Dr Amy Orben', '### Prof. Sonia Livingstone', '## The Ban Debate and the Real Drivers']
  const missingFromFile = PROFILES.filter(p => !o.file.includes(p))
  const leftInRetrieval = PROFILES.filter(p => o.retrieval.includes(p))
  if (missingFromFile.length) problems.push(`B: the file base is missing ${missingFromFile.join(', ')}`)
  else ok.push('B: the file base carries the researcher profiles and the ban evidence')
  if (leftInRetrieval.length) problems.push(`B: the retrieval base still carries ${leftInRetrieval.join(', ')}`)
  else ok.push('B: the retrieval base carries none of them')

  // ── C: the stance stays ─────────────────────────────────────────────────────
  const STANCE = ['## The Core Argument DiGi Embodies', '## What DiGi Does NOT Reference', '## The Honest Caveat DiGi Carries', 'RESEARCH BASE:']
  const stanceGone = STANCE.filter(s => !o.retrieval.includes(s))
  if (stanceGone.length) problems.push(`C: the retrieval base lost DiGi's stance: ${stanceGone.join(', ')}`)
  else ok.push("C: the retrieval base keeps DiGi's stance")

  // ── D: every hard rule, in both, word for word ──────────────────────────────
  const RULES = [
    'CRISIS RULE, ABOVE EVERYTHING ELSE:',
    'Samaritans on 116 123',
    'Never recommend allow/deny',
    'THE RESEARCHERS: THEIR WHOLE WORK, NOT ONE LINE EACH.',
    'THE SPECIFICS, you may not state from memory.',
    'Never invent a study, a statistic, a source, a name or a number.',
    'WHEN IT IS GENUINELY UNCERTAIN OR CONTESTED, say so',
    'VOICE AND LANGUAGE RULES:',
    'TRUST FRAMEWORK:',
  ]
  const ruleGone = RULES.filter(rule => !(o.file.includes(rule) && o.retrieval.includes(rule)))
  if (ruleGone.length) problems.push(`D: a hard rule is missing from one of the prompts: ${ruleGone.join(' | ')}`)
  else ok.push('D: every hard rule is in both prompts')

  // ── E: materially shorter ───────────────────────────────────────────────────
  const saved = o.fileLen - o.retrievalLen
  if (saved < 8000) problems.push(`E: the retrieval base saves only ${saved} characters; the switch is not earning its place`)
  else ok.push(`E: the retrieval base is ${saved} characters shorter`)

  // ── F: the live route and the evals ─────────────────────────────────────────
  if (!o.liveIsConfigured) problems.push('F: STATIC_SYSTEM is not the configured base')
  else ok.push('F: STATIC_SYSTEM is the configured base')
}

const blank = (src) => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
const route = blank(readFileSync('app/api/digi/route.ts', 'utf8'))
const evals = blank(readFileSync('lib/digi/evals.ts', 'utf8'))
if (!/import \{[^}]*\bSTATIC_SYSTEM\b[^}]*\} from '@\/lib\/digi\/system'/.test(route) || !/STATIC_SYSTEM \+/.test(route)) problems.push('F: the live route does not send STATIC_SYSTEM')
else ok.push('F: the live route sends the configured prompt')
if (!/getExpertKnowledge\(/.test(route)) problems.push('F: the live route no longer retrieves from expert_knowledge, so the retrieval base would answer on nothing')
else ok.push('F: the live route retrieves from expert_knowledge on every chat request')
if (!/staticSystemFor\(researchBase\)/.test(evals) || !/runEvals\(researchBase/.test(evals)) problems.push('F: the evals do not build the prompt per research base')
else ok.push('F: the evals build the prompt per research base')

if (problems.length > 0) {
  console.error('check-digi-research-base FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}
console.log(`check-digi-research-base ok: ${ok.length} rules hold`)
for (const line of ok) console.log('  ' + line)
