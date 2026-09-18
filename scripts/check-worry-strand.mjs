// EVERY WORRY IS WORKED UNTIL IT RESTS, AND WE KNOW WHAT WE ALREADY SPENT.
//
// Justin, 18 September 2026: every moment added is caught "until they get 5
// stars and marked as done", and DiGi "knows it's a goal over days to try
// every possible scientific expert way" to get there. He approved the shape:
// a record per worry of what has been tried and what the reading did
// afterwards, an ordered bank of approaches drawn from expert_knowledge, and
// the existing twice a week cap kept so it never turns into nagging.
//
// ── WHY A GUARD AND NOT A COMMENT ───────────────────────────────────────────
//
// Because this exact feature has already failed once in exactly the way a
// guard catches and nothing else does. digi_outcomes.concern_id was added in
// migration 154, indexed, documented, and never written by the one insert
// that could write it. Read live on 18 September 2026: 6 rows, 0 with a worry
// attached. Nothing failed. No typecheck, no test, no screen. The column just
// stayed empty for a month while the code around it read as though the loop
// were closed.
//
// So every rule below is about a JOIN that nothing else can see:
//
//   A  the worry vocabularies meet, so a worry can find its research at all
//   B  the bank is walked in order and never re-offers what was tried
//   C  bands, never raw scores, the rule review.md section 4a holds
//   D  the record is actually written: concern_id, approach, band, on delivery
//   E  the approach is resolved SERVER SIDE, never taken from the model
//   F  the verdict writes the band afterwards, from a band
//   G  the strand starts no conversation, so the twice a week cap still owns
//      the only door DiGi can knock on
//   H  the block reaches the prompt
//
// Node builtins only: the concern-guards job runs no npm ci.
//
//   node --experimental-strip-types scripts/check-worry-strand.mjs

import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const fail = []
const ok = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
/** Source with comments blanked, so a rule is never satisfied by its own docs. */
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')

const APPROACHES = 'lib/digi/approaches.ts'
const TOOLS = 'lib/digi/tools.ts'
const CRON = 'app/api/cron/followups/route.ts'
const OUTCOME = 'app/api/digi/outcome/route.ts'
const CHAT = 'app/api/digi/route.ts'
const SITUATION = 'lib/digi/situation.ts'

const approaches = code(read(APPROACHES))
const tools = code(read(TOOLS))
const cron = code(read(CRON))
const outcome = code(read(OUTCOME))
const chat = code(read(CHAT))

// ── A, B, C: the real functions, run ─────────────────────────────────────────
//
// Imported rather than regexed, because the thing worth holding is the
// BEHAVIOUR: a worry landing on a topic, a bank dropping what was tried, a
// band being a band. A regex over these would pass on a file that returns the
// wrong answer every time.
const probe = `
import { knowledgeTopicFor, orderBank, approachKey, bandOf, bandWord } from './lib/digi/approaches.ts'
const rows = [
  { id: 'a', finding: 'first', source_name: 'S', topics: ['sleep'], age_bands: ['11-13'] },
  { id: 'b', finding: 'second', source_name: 'S', topics: ['sleep'], age_bands: ['7-10'] },
  { id: 'c', finding: 'third', source_name: 'S', topics: ['sleep'], age_bands: ['7-10'] },
  { id: 'd', finding: 'other', source_name: 'S', topics: ['gaming'], age_bands: ['7-10'] },
]
const keys = b => b.map(x => x.key)
console.log(JSON.stringify({
  // A worry finds its topic from the label, from the slug, or from neither.
  fromLabel: knowledgeTopicFor('Controller fights over Fortnite', null),
  // The worry that used to find nothing: 'devices' has no rows in the bank.
  fromPhone: knowledgeTopicFor('Phones and messaging', 'phones-and-messaging'),
  fromSlug: knowledgeTopicFor('', 'bedtime-screens'),
  aliasAi: knowledgeTopicFor('worried about ai chatbots', 'ai-chatbots'),
  aliasFriend: knowledgeTopicFor('left out by her friend', 'friendship'),
  aliasSibling: knowledgeTopicFor('', 'sibling-fights'),
  nothing: knowledgeTopicFor('', ''),
  // The bank: topic filtered, tried removed, age band first, order kept.
  all: keys(orderBank(rows, 'sleep', '7-10', new Set())),
  tried: keys(orderBank(rows, 'sleep', '7-10', new Set([approachKey('b')]))),
  noBand: keys(orderBank(rows, 'sleep', null, new Set())),
  emptied: keys(orderBank(rows, 'sleep', '7-10', new Set([approachKey('a'), approachKey('b'), approachKey('c')]))),
  // Bands are 1 to 5 and a band has a word.
  bands: [1, 2, 3, 4, 5, 6, 8, 9, 10].map(bandOf),
  words: [1, 5].map(bandWord),
}))
`
const r = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', probe], { encoding: 'utf8', cwd: process.cwd() })
if (r.status !== 0) {
  fail.push(`A: the probe could not run ${APPROACHES}: ${(r.stderr || '').trim().split('\n').slice(-3).join(' ')}`)
} else {
  const o = JSON.parse(r.stdout.trim().split('\n').pop())
  const checks = [
    // A. THE JOIN THAT MAKES THE WHOLE THING POSSIBLE. A worry whose label
    // resolves to no topic gets a bank of nothing and DiGi has no next move,
    // silently, for ever. The three aliases are the three places the situation
    // vocabulary and the live expert_knowledge topics spell it differently.
    [o.fromLabel === 'gaming', 'A: a worry finds its topic from the label the parent wrote'],
    [o.fromPhone === 'phone', 'A: the second most common worry on the product reaches a topic the bank actually carries'],
    [o.fromSlug === 'sleep', 'A: a worry finds its topic from the slug when the label is a tile name'],
    [o.aliasAi === 'ai_use', 'A: the ai alias reaches the topic the research is actually tagged with'],
    [o.aliasFriend === 'friendships', 'A: the friendship alias reaches the research topic'],
    [o.aliasSibling === 'sibling', 'A: the siblings alias reaches the research topic'],
    [o.nothing === null, 'A: a worry with no words matches nothing rather than guessing'],
    // B. THE BANK IS WALKED, NOT RE-SHUFFLED.
    [JSON.stringify(o.all) === JSON.stringify(['ek:b', 'ek:c', 'ek:a']), 'B: the bank is this topic only, age band matches first, order kept inside'],
    [JSON.stringify(o.tried) === JSON.stringify(['ek:c', 'ek:a']), 'B: an approach already tried for this worry is never offered again'],
    [JSON.stringify(o.noBand) === JSON.stringify(['ek:a', 'ek:b', 'ek:c']), 'B: with no age band the bank keeps the order it was read in'],
    [JSON.stringify(o.emptied) === JSON.stringify([]), 'B: a bank with everything tried is empty rather than starting over'],
    // C. BANDS, NEVER RAW SCORES.
    [JSON.stringify(o.bands) === JSON.stringify([1, 1, 2, 2, 3, 3, 4, 5, 5]), 'C: a band is one of five, ceil of the score over two'],
    [o.words[0] === 'really tough' && o.words[1] === 'going great', 'C: a band has the same five words the check in uses'],
  ]
  for (const [pass, label] of checks) (pass ? ok : fail).push(pass ? label : `${label}: NOT so`)
}

// A topic added to inferSituation that the bank has no rows for is the same
// silent failure as a missing alias: a bank of nothing and no next move, with
// nothing anywhere saying so. Held here rather than in a comment asking
// someone to remember, and checked against the topic table itself so a new
// keyword row cannot slip past.
const situation = read(SITUATION)
const topicBlock = situation.slice(situation.indexOf('const TOPIC_KEYWORDS'), situation.indexOf('const TIME_KEYWORDS'))
const situationTopics = [...topicBlock.matchAll(/^\s*\['([a-z_]+)', \[/gm)].map(m => m[1])
if (situationTopics.length < 15) fail.push(`A: could not read the topic list out of ${SITUATION}, so the two vocabularies are no longer being compared`)
else {
  const probe2 = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e',
    `import { bankTopicFor, BANK_TOPICS } from './lib/digi/approaches.ts'\n` +
    `const topics = ${JSON.stringify(situationTopics)}\n` +
    `console.log(JSON.stringify({ bank: BANK_TOPICS, mapped: topics.map(bankTopicFor) }))`,
  ], { encoding: 'utf8', cwd: process.cwd() })
  if (probe2.status !== 0) fail.push(`A: the vocabulary comparison could not run: ${(probe2.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
  else {
    const { bank, mapped } = JSON.parse(probe2.stdout.trim().split('\n').pop())
    const bankSet = new Set(bank)
    // The JOIN only, not the inference. Whether a parent's sentence lands on
    // the right topic is a keyword question with no single right answer; where
    // that topic's research lives is a fact, and this is the half that fails
    // silently, so this is the half held exactly.
    const orphans = situationTopics.filter((t, i) => !mapped[i] || !bankSet.has(mapped[i]))
    if (orphans.length > 0) fail.push(`A: ${orphans.join(', ')} can be inferred from a worry but reaches no topic the research bank carries, so that worry gets a bank of nothing and DiGi silently has no next approach. Add an alias in ${APPROACHES}, or tag findings with that topic.`)
    else ok.push(`A: all ${situationTopics.length} worry topics reach a topic the research bank carries`)
  }
}

// ── I: WHAT STOPS IT BECOMING NAGGING ────────────────────────────────────────
//
// Working a goal over days is one step from pestering a family about a thing
// they have already sorted, and the line between them is the resting rule:
// two top band days in a row and the worry is finished. Justin's sentence has
// two halves, "caught until they get 5 stars" and "and marked as done", and
// this is the half a system like this gets wrong.
//
// Run through the real function against a stub, because the rule lives in a
// comparison inside a loop and no regex can tell whether it is the right way
// round.
const strandProbe = `
import { getWorryStrand } from './lib/digi/approaches.ts'
const DATA = {
  concern_events: [
    { concern_id: 'live', score: 3, created_at: '2026-09-17T09:00:00Z' },
    { concern_id: 'live', score: 1, created_at: '2026-09-01T09:00:00Z' },
    { concern_id: 'rested', score: 9, created_at: '2026-09-17T09:00:00Z' },
    { concern_id: 'rested', score: 10, created_at: '2026-09-16T09:00:00Z' },
  ],
  digi_outcomes: [
    { user_id: 'u', concern_id: 'live', suggestion: 'the first idea', verdict: 'no', approach: 'ek:k1', band_at_suggestion: 1, band_after: 1, created_at: '2026-09-10T09:00:00Z' },
    { user_id: 'u', concern_id: 'live', suggestion: 'the unanswered idea', verdict: null, approach: 'ek:k2', band_at_suggestion: 1, band_after: null, created_at: '2026-09-12T09:00:00Z' },
  ],
  expert_knowledge: [
    { active: true, id: 'k1', finding: 'first', source_name: 'S', topics: ['sleep'], age_bands: ['7-10'], created_at: '2026-01-01' },
    { active: true, id: 'k2', finding: 'second', source_name: 'S', topics: ['sleep'], age_bands: ['7-10'], created_at: '2026-02-01' },
    { active: true, id: 'k3', finding: 'third', source_name: 'S', topics: ['sleep'], age_bands: ['7-10'], created_at: '2026-03-01' },
  ],
}
const from = (name) => {
  let rows = DATA[name] ?? []
  const api = {
    select: () => api,
    eq: (k, v) => { rows = rows.filter(r => r[k] === v); return api },
    in: (k, vs) => { rows = rows.filter(r => vs.includes(r[k])); return api },
    not: () => { rows = rows.filter(r => !('score' in r) || r.score != null); return api },
    overlaps: (k, vs) => { rows = rows.filter(r => (r[k] ?? []).some(x => vs.includes(x))); return api },
    order: (k, o) => { rows = [...rows].sort((a, b) => (a[k] < b[k] ? -1 : 1) * (o && o.ascending === false ? -1 : 1)); return api },
    limit: () => Promise.resolve({ data: rows }),
    then: (f) => Promise.resolve({ data: rows }).then(f),
  }
  return api
}
const concerns = [
  { id: 'rested', label: 'Bedtime screens', slug: 'bedtime-screens' },
  { id: 'live', label: 'Sleep', slug: 'sleep' },
  { id: 'blank', label: 'Biting', slug: 'biting' },
]
const s = await getWorryStrand({ from }, 'u', concerns, '7-10')
console.log(JSON.stringify({
  block: s.block,
  next: Object.fromEntries([...s.next].map(([k, v]) => [k, v])),
}))
`
const sp = spawnSync(process.execPath, ['--experimental-strip-types', '--import', './scripts/lib/ts-resolve.mjs', '--input-type=module', '-e', strandProbe], { encoding: 'utf8', cwd: process.cwd() })
if (sp.status !== 0) {
  fail.push(`I: the strand probe could not run: ${(sp.stderr || '').trim().split('\n').slice(-3).join(' ')}`)
} else {
  const out = JSON.parse(sp.stdout.trim().split('\n').pop())
  const b = out.block
  const checks = [
    [!/Bedtime screens/.test(b), 'I: a worry that has reached five stars is not offered a next thing to try'],
    [out.next.rested?.approach === null, 'I: and no approach is marked tried for it either, so the one idea we had is not silently spent'],
    [/Sleep/.test(b), 'I: a worry still being worked is in the block'],
    [/the first idea/.test(b) && /they said it did not work/.test(b), 'I: what was tried and what the parent said are both carried'],
    [/and the rating held/.test(b), 'I: and what the rating did afterwards, which is the half the parent cannot tell us'],
    [/NOT TRIED YET, from the research bank: third/.test(b) && !/NOT TRIED YET, from the research bank: (first|second)/.test(b), 'I: the next approach is one this worry has not had'],
    // An unanswered suggestion is SPENT, even though it taught us nothing.
    // getTriedAlready drops those on purpose, and copying that rule here
    // would empty the strand for every family on the product: read live on
    // 18 September 2026, all six follow ups ever delivered are unanswered.
    [/the unanswered idea/.test(b) && /we never heard back/.test(b), 'I: a suggestion nobody came back on is still counted as tried'],
    [!/NOT TRIED YET, from the research bank: second/.test(b), 'I: and its approach is not offered again as if it were fresh'],
    [out.next.live?.approach === 'ek:k3', 'I: and that approach is what a follow up for this worry would be recorded under'],
    [!/Biting/.test(b), 'I: a worry with nothing tried and nothing to try is left out rather than listed empty'],
    [/five stars/.test(b) && /over days/i.test(b), 'I: the block says plainly that this is a goal worked over days until five stars'],
    [!/\b(score|out of 10|\/10)\b/i.test(b), 'I: the block never quotes a raw score, only bands in words'],
  ]
  for (const [pass, label] of checks) (pass ? ok : fail).push(pass ? label : `${label}: NOT so`)
}

// ── D: the record is written where it can be written ─────────────────────────
//
// The failure this replaces was not a wrong value, it was an absent one, so
// the rule is about the insert carrying the fields at all.
const insertAt = cron.indexOf("from('digi_outcomes').insert({")
const insert = insertAt === -1 ? '' : cron.slice(insertAt, insertAt + 900)
if (!insert) fail.push(`D: ${CRON} no longer writes the outcome row, so nothing records what was tried`)
else {
  for (const [field, why] of [
    ['concern_id', 'the verdict could never be counted back to the worry, which is the exact hole this closed'],
    ['approach', 'the same research would be offered for the same worry for ever'],
    ['band_at_suggestion', 'there is nothing for the band afterwards to be compared against'],
  ]) {
    if (!new RegExp(`${field}: f\\.${field}`).test(insert)) fail.push(`D: the delivered outcome does not carry ${field} from the follow up, so ${why}`)
    else ok.push(`D: the outcome row carries ${field}`)
  }
  if (!/select\('id, user_id, child_id, question, context, suggestion, situation, moment_id, concern_id, approach, band_at_suggestion'\)/.test(cron)) {
    fail.push(`D: the due follow ups are not selected with the strand columns, so they arrive undefined and the insert writes nulls while looking correct`)
  } else ok.push('D: the due follow ups are read with the strand columns')
}

// ── E: the approach is the server's, never the model's ───────────────────────
//
// A model asked to echo a key back fails silently and occasionally, which is
// the worst shape of failure: the record fills with rows that look right. The
// model names a worry it can read; the server decides what that counts as.
const scheduleAt = tools.indexOf('async function doScheduleFollowup')
const schedule = scheduleAt === -1 ? '' : tools.slice(scheduleAt, scheduleAt + 3000)
if (!schedule) fail.push(`E: ${TOOLS} no longer has the follow up writer`)
else {
  if (!/\(ctx\.worries \?\? \[\]\)\.find\(/.test(schedule)) fail.push('E: the worry is not resolved against the list the server showed DiGi, so a name the model invented would become a concern_id')
  else ok.push('E: the worry is resolved against the server\'s own list')
  if (!/approach: worry\?\.approach/.test(schedule)) fail.push('E: the approach on the row does not come from the resolved worry')
  else ok.push('E: the approach comes from the server\'s strand')
  if (/approach:\s*(typeof )?arg\.approach/.test(schedule)) fail.push('E: the approach is taken from the model\'s arguments, which fills the record with keys nothing ordered')
  if (!/band_at_suggestion: worry\?\.band/.test(schedule)) fail.push('E: the band at suggestion does not come from the resolved worry')
  else ok.push('E: the band at suggestion comes from the server\'s strand')
}

// ── F: the verdict writes what the rating did ────────────────────────────────
if (!/band_after: bandOf\(/.test(outcome)) fail.push(`F: ${OUTCOME} does not write band_after through bandOf, so either nothing records what the rating did or a raw score is stored where a band belongs`)
else ok.push('F: the verdict records the band afterwards')
if (!/if \(row\.concern_id\)/.test(outcome)) fail.push(`F: ${OUTCOME} writes the band without checking the row is attached to a worry`)
else ok.push('F: the band afterwards is only written for a row attached to a worry')

// ── G: the strand starts no conversation ─────────────────────────────────────
//
// Working a goal over days is one step from nagging and the difference is
// entirely in who starts. The twice a week cap stays the only door, so this
// file must stay a reader.
if (/\.insert\(|\.update\(|\.upsert\(/.test(approaches)) fail.push(`G: ${APPROACHES} writes to the database. It is a reader: anything that can write can become a second way to interrupt a family, outside the twice a week cap.`)
else ok.push('G: the strand only reads')
if (/digi_prompts/.test(approaches)) fail.push(`G: ${APPROACHES} touches the prompt queue, which is the channel the step in cap governs`)
else ok.push('G: the strand never touches the prompt queue')

// ── H: and it reaches the prompt ─────────────────────────────────────────────
if (!/getWorryStrand\(/.test(chat)) fail.push(`H: ${CHAT} no longer builds the strand, so the record exists and DiGi cannot see it`)
else ok.push('H: the chat route builds the strand')
if (!/\+ worryStrand\.block \+/.test(chat)) fail.push(`H: the strand is built and never added to the system prompt`)
else ok.push('H: the strand reaches the system prompt')
if (!/worries: liveConcerns\.map\(/.test(chat)) fail.push(`H: the tool context does not carry the worries, so schedule_followup can never resolve one and every row lands unattached`)
else ok.push('H: the tool context carries the worries')

if (fail.length) {
  console.error('check-worry-strand FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
console.log(`check-worry-strand: ${ok.length} rules hold. Every worry is worked over days, the bank is walked in order, and nothing here can start a conversation.`)
