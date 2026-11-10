// The daily run, its log, and the summary Justin reads.
//
// The pipeline's gates each return PASS or HOLD. What was missing was a
// record of the RUN: which stages happened this morning, in what order, what
// each one said, and what was left for a person. Without it an unattended run
// that stopped half way looked exactly like one that found nothing.
//
// Three things live here.
//
//   The run log. One JSON file per day and kind, in
//   content/research-register/runs/. A stage that runs twice replaces its own
//   entry and counts the attempt, so a rerun does not double the log.
//
//   The deterministic stages, in order, each wrapped so that a thrown error
//   becomes an ERROR entry with the message instead of ending the run:
//     morning   preflight, inbox, discover, dossier, then who is waiting
//     handoffs  number, handoff and queue for every story the review cleared
//     packs     the QA pass over every pack text file handed to it
//
//   The stages only a Claude session can do (the directed review, the voice
//   edit, every copy to Drive) are logged by that session with `log`, so the
//   summary shows them beside the rest and shows when one did not happen.
//
// Nothing here approves, posts or marks anything published.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'
import * as reg from './register.mjs'
import { repoState, sha256, parsePostRegister, internalNumberConflicts } from './contract.mjs'
import { preflight, handoff, claimNumber, submitPack, founderStatus } from './pipeline.mjs'
import { ingestBatch, receipt } from './candidates.mjs'
import { buildManifest } from './manifest.mjs'
import { parsePackText } from './packformat.mjs'

const RUNS = () => join(reg.DIR, 'runs')
export const VERDICTS = ['PASS', 'HOLD', 'WAITING', 'SKIPPED', 'ERROR']
/** The stages a complete day has, in order, and who does each. */
export const STAGES = [
  ['PREFLIGHT', 'script'], ['INBOX', 'script'], ['DISCOVER', 'script'], ['DOSSIER', 'script'],
  ['REVIEW', 'claude'], ['HANDOFFS', 'script'], ['DRIVE SYNC', 'claude'],
  ['PACK QA', 'script'], ['PACK REVIEW', 'claude'], ['APPROVAL DESK', 'claude'],
]

const today = () => new Date().toISOString().slice(0, 10)
const runPath = (date) => join(RUNS(), `${date}.json`)

export function loadRun(date = today()) {
  if (existsSync(runPath(date))) return JSON.parse(readFileSync(runPath(date), 'utf8'))
  return { schemaVersion: '1.0.0', date, startedAt: new Date().toISOString(), stages: [] }
}

function saveRun(run) {
  mkdirSync(RUNS(), { recursive: true })
  run.updatedAt = new Date().toISOString()
  writeFileSync(runPath(run.date), JSON.stringify(run, null, 1))
}

/** Write one stage's outcome. The latest entry for a stage wins. */
export function record(stage, verdict, { reasons = [], detail = null, by = 'script', date = today() } = {}) {
  if (!VERDICTS.includes(verdict)) throw new Error(`unknown verdict ${verdict}. One of ${VERDICTS.join(', ')}`)
  const run = loadRun(date)
  const prev = run.stages.find((s) => s.stage === stage)
  const entry = { stage, verdict, by, reasons: [].concat(reasons).filter(Boolean), detail, at: new Date().toISOString(),
    commit: repoState().shortCommit, attempts: (prev?.attempts || 0) + 1 }
  run.stages = [...run.stages.filter((s) => s.stage !== stage), entry]
  saveRun(run)
  return entry
}

/** Run one stage. Retries only what can fail for reasons outside the code. */
async function stage(name, fn, { tries = 1 } = {}) {
  let lastError = null
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    try {
      const out = await fn()
      return record(name, out.verdict, { reasons: out.reasons || [], detail: out.detail ?? null })
    } catch (e) {
      lastError = e
      if (attempt < tries) await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
  return record(name, 'ERROR', { reasons: [`${lastError?.message || lastError}${tries > 1 ? `, after ${tries} attempts` : ''}`] })
}

// ---------------------------------------------------------------------------
// The stages
// ---------------------------------------------------------------------------

/**
 * Morning. `inboxDir` holds the inbox documents the session downloaded from
 * Drive, one file each, named `<driveFileId>__<anything>`. Passing no folder
 * is recorded as SKIPPED with the reason, never as an empty inbox.
 */
export async function morning({ inboxDir = null, postingPack = null, network = true, postRegisterPath = undefined } = {}) {
  await stage('PREFLIGHT', () => {
    // Drive is brought back in step later in the same run, so a stale Drive
    // copy is not a reason to stop here. Everything else is.
    const p = preflight({ requireDrive: false, ...(postRegisterPath ? { postRegisterPath } : {}) })
    return { verdict: p.verdict, reasons: p.reasons }
  })

  await stage('INBOX', () => {
    if (!inboxDir) return { verdict: 'SKIPPED', reasons: ['no inbox folder was handed to this run, so the Drive inbox was not read. That is a missing step, not an empty inbox.'] }
    if (!existsSync(inboxDir)) return { verdict: 'ERROR', reasons: [`the inbox folder ${inboxDir} does not exist`] }
    const files = readdirSync(inboxDir).filter((f) => !f.startsWith('.')).sort()
    if (!files.length) return { verdict: 'PASS', reasons: [], detail: { documents: 0, note: 'the inbox held no new document' } }
    const pp = postingPack && existsSync(postingPack) ? readFileSync(postingPack, 'utf8') : ''
    const out = []; const reasons = []
    for (const f of files) {
      const [fileId] = f.split('__')
      const r = ingestBatch(readFileSync(join(inboxDir, f), 'utf8'), { source: { fileId, title: f }, postingPackText: pp, ...(postRegisterPath ? { postRegisterPath } : {}) })
      out.push({ file: f, verdict: r.verdict, batchId: r.batchId, alreadyIngested: !!r.alreadyIngested, results: r.results.map((x) => ({ candidateId: x.candidateId, outcome: x.outcome, researchId: x.researchId || null, reasons: x.reasons || [] })) })
      if (r.verdict !== 'PASS') reasons.push(`${f}: ${r.reasons.join(' ')}`)
      for (const x of r.results) if (x.outcome === 'HELD') reasons.push(`${x.candidateId}: ${(x.reasons || []).join(' ')}`)
    }
    return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, detail: { documents: files.length, batches: out, postingPackRead: !!pp } }
  })

  if (network) {
    await stage('DISCOVER', async () => {
      const { discover } = await import('./discover.mjs')
      const before = reg.all().length
      await discover({ days: 3 })
      return { verdict: 'PASS', detail: { newRecords: reg.all().length - before, total: reg.all().length } }
    }, { tries: 2 })
    await stage('DOSSIER', async () => {
      const { verifyBand } = await import('./dossier.mjs')
      const rows = await verifyBand()
      const unconfirmed = rows.filter((r) => r.verdict !== 'RECORD CONFIRMED')
      return { verdict: 'PASS', detail: { built: rows.length, confirmed: rows.length - unconfirmed.length, unconfirmed: unconfirmed.map((r) => r.studyId) } }
    }, { tries: 2 })
  } else {
    record('DISCOVER', 'SKIPPED', { reasons: ['run with the network switched off'] })
    record('DOSSIER', 'SKIPPED', { reasons: ['run with the network switched off'] })
  }

  // Who is waiting for the part a script cannot do.
  const waiting = reg.all().filter((r) => r.status === 'VERIFIED' && r.claudeStatus !== 'CLAUDE REVIEWED')
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  record('REVIEW', waiting.length ? 'WAITING' : 'PASS', {
    by: 'claude',
    reasons: waiting.length ? [`${waiting.length} verified ${waiting.length === 1 ? 'record needs' : 'records need'} a directed review before anything can be written from ${waiting.length === 1 ? 'it' : 'them'}`] : [],
    detail: { waiting: waiting.map((r) => ({ researchId: r.studyId, band: r.relevanceBand, score: r.relevanceScore, title: r.title, fromInbox: (r.foundBy || []).includes('chatgpt-inbox') })) },
  })
  return loadRun()
}

/**
 * After the reviews: a number, a handoff and a place in the queue for every
 * story the review cleared. A story whose handoff already matches its review
 * and its number is left alone, so running this twice builds nothing twice.
 */
export async function handoffs({ postRegisterPath = undefined } = {}) {
  const opt = postRegisterPath ? { postRegisterPath } : {}
  return stage('HANDOFFS', () => {
    const ready = reg.byStatus('EDITORIAL READY')
    const built = []; const kept = []; const reasons = []
    for (const r of ready) {
      const n = claimNumber(r.studyId, opt)
      if (n.verdict !== 'PASS') { reasons.push(`${r.studyId}: no number, ${n.reasons.join(' ')}`); continue }
      const rec = reg.get(r.studyId)
      const digest = sha256(JSON.stringify(rec.claudeReview || {})).slice(0, 16)
      const current = rec.handoff && rec.handoff.reviewDigest === digest && rec.handoff.gdcPostNumber === n.gdcPostNumber
      if (current) { kept.push(r.studyId); continue }
      const h = handoff(r.studyId, opt)
      if (h.verdict !== 'PASS') { reasons.push(`${r.studyId}: ${h.reasons.join(' ')}`); continue }
      const after = reg.get(r.studyId)
      reg.upsert({ ...after, handoff: { ...after.handoff, reviewDigest: digest, gdcPostNumber: n.gdcPostNumber } }, { reason: 'handoff tied to the review it was built from', actor: 'radar:daily' })
      built.push({ researchId: r.studyId, gdcPostNumber: n.gdcPostNumber, handoffVersion: h.handoffVersion })
    }
    const m = buildManifest()
    writeFileSync(join(reg.DIR, 'manifest.json'), JSON.stringify(m, null, 1))
    const conflicts = internalNumberConflicts(postRegisterPath)
    for (const c of conflicts) reasons.push(`GDC-${c.number} is claimed twice in the post register`)
    return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, detail: { built, alreadyCurrent: kept, queue: m.queue.map((q) => q.researchId) } }
  })
}

/**
 * The QA pass over every pack document in a folder. Each file is the text of
 * one pack exactly as Drive returned it.
 */
export async function packs(dir, { postRegisterPath = undefined } = {}) {
  return stage('PACK QA', () => {
    if (!dir) return { verdict: 'SKIPPED', reasons: ['no pack folder was handed to this run, so Drive was not checked for returned packs'] }
    if (!existsSync(dir)) return { verdict: 'ERROR', reasons: [`the pack folder ${dir} does not exist`] }
    const files = readdirSync(dir).filter((f) => !f.startsWith('.')).sort()
    if (!files.length) return { verdict: 'PASS', detail: { packs: 0, note: 'no pack was waiting' } }
    const out = []; const reasons = []
    for (const f of files) {
      const pack = parsePackText(readFileSync(join(dir, f), 'utf8'))
      const prior = pack.researchId ? reg.get(pack.researchId) : null
      // The same text submitted twice is one submission.
      const digest = sha256(JSON.stringify(pack)).slice(0, 16)
      if (prior?.pack?.digest === digest) { out.push({ file: f, researchId: pack.researchId, verdict: prior.packQa?.verdict, note: 'already checked, unchanged' }); continue }
      const r = submitPack(pack, postRegisterPath ? { postRegisterPath } : {})
      if (pack.researchId && reg.get(pack.researchId)) {
        const rec = reg.get(pack.researchId)
        reg.upsert({ ...rec, pack: { ...rec.pack, digest, driveFile: basename(f) } }, { reason: 'pack digest recorded so a rerun does not submit it twice', actor: 'radar:daily' })
      }
      out.push({ file: f, researchId: pack.researchId || null, verdict: r.verdict, failed: r.failedCount || 0, checked: r.checked || null })
      if (r.verdict !== 'PASS') reasons.push(`${pack.researchId || f}: ${r.reasons.slice(0, 4).join(' | ')}`)
    }
    return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, detail: { packs: files.length, results: out } }
  })
}

// ---------------------------------------------------------------------------
// The summary
// ---------------------------------------------------------------------------

/** What Justin needs to know, in the order he needs it. Plain text, no dashes. */
export function summary(date = today()) {
  const run = loadRun(date)
  const all = reg.all()
  const L = []; const line = (s = '') => L.push(s)
  const num = (r) => (r.gdcPostNumber ? `GDC-${String(r.gdcPostNumber).padStart(3, '0')}` : 'no number')
  const name = (r) => r.claudeReview?.proposedTitle || r.title

  const readyForHim = all.filter((r) => founderStatus(r) === 'READY FOR JUSTIN')
  const changes = all.filter((r) => founderStatus(r) === 'CHANGES REQUESTED')
  const approved = all.filter((r) => founderStatus(r) === 'APPROVED')
  const queue = buildManifest().queue
  const waitingReview = all.filter((r) => r.status === 'VERIFIED' && r.claudeStatus !== 'CLAUDE REVIEWED')
  const ran = new Map(run.stages.map((s) => [s.stage, s]))
  const bad = run.stages.filter((s) => ['HOLD', 'ERROR'].includes(s.verdict))
  const missing = STAGES.filter(([s]) => !ran.has(s))

  line(`RESEARCH RADAR, ${date}`)
  line()
  line('NEEDS YOU')
  let asks = 0
  for (const r of readyForHim) { asks += 1; line(`  Read and post, or send back: ${num(r)}, ${name(r)}`) }
  for (const r of approved) { asks += 1; line(`  You approved ${num(r)}. Post it and send the link, so it can be marked published.`) }
  for (const s of bad) { asks += 1; line(`  ${s.stage} was held: ${s.reasons[0] || 'no reason recorded'}`) }
  for (const d of run.disagreements || []) { asks += 1; line(`  Disagreement to settle: ${d}`) }
  if (!asks) line('  Nothing today.')
  line()
  line('WHERE THINGS ARE')
  line(`  Ready for you: ${readyForHim.length}. Changes you asked for, being made: ${changes.length}. Approved, not yet posted: ${approved.length}.`)
  line(`  With ChatGPT to write: ${queue.length}${queue.length ? ` (${queue.map((q) => (q.gdcPostNumber ? `GDC-${String(q.gdcPostNumber).padStart(3, '0')}` : q.researchId)).join(', ')})` : ''}.`)
  line(`  Waiting for the evidence check: ${waitingReview.length}.`)
  line(`  Research records held: ${all.length}.`)
  line()
  line('WHAT RAN')
  if (!run.stages.length) line('  Nothing has run today.')
  for (const [s, who] of STAGES) {
    const e = ran.get(s)
    if (!e) { line(`  ${s.padEnd(14)} NOT RUN   (${who === 'claude' ? 'a Claude step' : 'a script step'})`); continue }
    const note = e.reasons[0] ? `  ${e.reasons[0].slice(0, 150)}` : ''
    line(`  ${s.padEnd(14)} ${e.verdict.padEnd(9)} ${e.at.slice(11, 16)} UTC${e.attempts > 1 ? `, attempt ${e.attempts}` : ''}${note}`)
  }
  for (const e of run.stages.filter((x) => !STAGES.some(([s]) => s === x.stage))) {
    line(`  ${e.stage.padEnd(14)} ${e.verdict.padEnd(9)} ${e.at.slice(11, 16)} UTC${e.reasons[0] ? `  ${e.reasons[0].slice(0, 150)}` : ''}`)
  }
  if (missing.length && run.stages.length) line(`  ${missing.length} of ${STAGES.length} stages have not run today.`)
  const inbox = ran.get('INBOX')?.detail
  if (inbox?.batches?.length) {
    line()
    line('FROM CHATGPT\'S INBOX')
    for (const b of inbox.batches) for (const x of b.results) line(`  ${x.candidateId}: ${x.outcome}${x.researchId ? `, ${x.researchId}` : ''}${x.reasons?.[0] ? `. ${x.reasons[0]}` : ''}`)
  }
  line()
  line('Nothing was posted, scheduled or sent. Approval is yours.')
  return L.join('\n')
}

/** A disagreement between systems that only Justin can settle. */
export function disagreement(text, date = today()) {
  const run = loadRun(date)
  run.disagreements = [...new Set([...(run.disagreements || []), String(text)])]
  saveRun(run)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, ...rest] = process.argv
  const flag = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : null }
  const show = (e) => { console.log(`${e.verdict.padEnd(8)} ${e.stage}`); for (const r of e.reasons) console.log(`  ${r}`) }
  if (cmd === 'morning') { const run = await morning({ inboxDir: flag('--inbox'), postingPack: flag('--posting-pack'), network: !rest.includes('--no-network') }); for (const s of run.stages) show(s) }
  else if (cmd === 'handoffs') show(await handoffs())
  else if (cmd === 'packs') show(await packs(rest[0]))
  else if (cmd === 'log' && rest[0] && rest[1]) show(record(rest[0].toUpperCase(), rest[1].toUpperCase(), { reasons: rest[2] ? [rest[2]] : [], by: 'claude' }))
  else if (cmd === 'disagreement' && rest[0]) { disagreement(rest[0]); console.log('recorded') }
  else if (cmd === 'summary') console.log(summary(rest[0] || today()))
  else {
    console.log('usage:')
    console.log('  node scripts/radar/daily.mjs morning [--inbox <dir>] [--posting-pack <file>] [--no-network]')
    console.log('  node scripts/radar/daily.mjs handoffs')
    console.log('  node scripts/radar/daily.mjs packs <dir>')
    console.log('  node scripts/radar/daily.mjs log "<STAGE>" <PASS|HOLD|WAITING|SKIPPED|ERROR> ["<one line>"]')
    console.log('  node scripts/radar/daily.mjs disagreement "<what the two systems disagree about>"')
    console.log('  node scripts/radar/daily.mjs summary [YYYY-MM-DD]')
  }
}
