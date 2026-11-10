// The integrity gate. No network, no secrets, no model.
//
// The pipeline's own gates run when a stage runs. This runs on the result:
// the register, the number register, the ledger and the run logs as they
// are committed. It is what GitHub Actions executes on every radar pull
// request, so an unattended run's output is checked by something that is not
// the thing that produced it, before anybody merges it.
//
// Every check is a rule the system already states somewhere. Nothing here is
// new policy. A failure prints the rule and the record, and exits 1.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import * as reg from './register.mjs'
import { parsePostRegister, internalNumberConflicts, REPO } from './contract.mjs'
import { CANDIDATE_SCHEMA, loadLedger } from './candidates.mjs'
import { VERDICTS } from './daily.mjs'

const DASH = /[‐-―−]/
const AFTER_REVIEW = ['EDITORIAL READY', 'ASSETS READY', 'APPROVED', 'PUBLISHED']

export function gate() {
  const checks = []
  const add = (name, problems) => checks.push({ name, pass: problems.length === 0, problems })
  const all = reg.all()
  const pad = (n) => String(n).padStart(3, '0')

  // 1. Post numbers. GitHub is the only place one is claimed.
  let rows = []
  try { rows = parsePostRegister(); add('the post register parses', []) } catch (e) { add('the post register parses', [e.message]) }
  add('no GDC number is claimed twice in the register', internalNumberConflicts().map((c) => `GDC-${c.number}: ${c.rows.join(' AND ')}`))
  const numbered = all.filter((r) => r.gdcPostNumber)
  add('every number on a research record has a row in the register', numbered.filter((r) => !rows.some((x) => x.number === pad(r.gdcPostNumber))).map((r) => `${r.studyId} carries GDC-${pad(r.gdcPostNumber)}, which has no row`))
  const byNumber = new Map()
  for (const r of numbered) byNumber.set(pad(r.gdcPostNumber), [...(byNumber.get(pad(r.gdcPostNumber)) || []), r.studyId])
  add('no two research records share a number', [...byNumber].filter(([, ids]) => ids.length > 1).map(([n, ids]) => `GDC-${n}: ${ids.join(' and ')}`))

  // 2. Nothing is past the review without a review.
  add('every story past the evidence check carries a stored, claim by claim review',
    all.filter((r) => AFTER_REVIEW.includes(r.status) && !(r.claudeStatus === 'CLAUDE REVIEWED' && r.claudeReview?.claims?.length && r.claudeReview?.verdict)).map((r) => `${r.studyId} is ${r.status} with no stored review`))
  add('every story in the queue has a handoff and a number',
    all.filter((r) => r.status === 'EDITORIAL READY' && r.claudeReview && !(r.handoff?.version && r.gdcPostNumber)).map((r) => `${r.studyId} is EDITORIAL READY with ${r.handoff?.version ? 'no number' : 'no handoff'}`))

  // 3. Approval and publication are Justin's and need evidence.
  add('nothing is APPROVED or PUBLISHED without Justin\'s own approval on the record',
    all.filter((r) => ['APPROVED', 'PUBLISHED'].includes(r.status) && !(r.approval?.approvedBy === 'Justin' && String(r.approval?.instruction || '').trim())).map((r) => `${r.studyId} is ${r.status} with no approval by Justin`))
  add('nothing is PUBLISHED without a URL that was checked and answered',
    all.filter((r) => r.status === 'PUBLISHED' && !(r.publishedUrl && r.publishedCheck?.provesItIsLive)).map((r) => `${r.studyId} is PUBLISHED with no verified URL`))
  add('a pack in front of Justin passed QA, was reviewed and is verifiably in Drive',
    all.filter((r) => r.status === 'ASSETS READY' && !r.founderDecision?.state && !(r.packQa?.verdict === 'PASS' && r.packReview?.verdict === 'PASS' && r.packDrive?.verified)).map((r) => `${r.studyId} is ASSETS READY without all three`))

  // 4. The register is append only and its index agrees with its history.
  const jsonl = join(reg.DIR, 'studies.jsonl')
  const latest = new Map()
  if (existsSync(jsonl)) for (const l of readFileSync(jsonl, 'utf8').split('\n').filter(Boolean)) { try { const r = JSON.parse(l); if ((r.version || 0) >= (latest.get(r.studyId) || 0)) latest.set(r.studyId, r.version || 0) } catch { /* counted below */ } }
  add('the register index agrees with the register history', all.filter((r) => latest.get(r.studyId) !== r.version).map((r) => `${r.studyId}: index says version ${r.version}, history says ${latest.get(r.studyId)}`))

  // 5. The inbox.
  const ledger = loadLedger()
  add('every candidate the ledger says was taken in exists in the register',
    Object.values(ledger.candidates || {}).filter((c) => c.outcome === 'INGESTED' && !reg.get(c.researchId)).map((c) => `${c.candidateId} points at ${c.researchId}, which is not in the register`))
  add('nothing that came through the inbox skipped the review',
    all.filter((r) => (r.foundBy || []).includes('chatgpt-inbox') && r.foundBy.length === 1 && AFTER_REVIEW.includes(r.status) && !r.claudeReview?.reviewBasis).map((r) => `${r.studyId} came from the inbox and is ${r.status} with no review basis`))
  const schemaFile = join(REPO, 'scripts/radar/candidate.schema.json')
  add('candidate.schema.json is the schema the code enforces',
    existsSync(schemaFile) && JSON.stringify(JSON.parse(readFileSync(schemaFile, 'utf8'))) === JSON.stringify(CANDIDATE_SCHEMA) ? [] : ['regenerate it: node scripts/radar/candidates.mjs schema > scripts/radar/candidate.schema.json'])

  // 6. What goes to Drive carries no dash.
  const hdir = join(reg.DIR, 'handoffs')
  const dashed = existsSync(hdir) ? readdirSync(hdir).filter((f) => f.endsWith('.txt')).filter((f) => all.some((r) => r.status === 'EDITORIAL READY' && f.includes(r.studyId)) && DASH.test(readFileSync(join(hdir, f), 'utf8'))) : []
  add('no handoff in the queue carries a dash', dashed.map((f) => `${f} has a dash in it`))

  // 7. The run logs are readable and use the five words.
  const rdir = join(reg.DIR, 'runs')
  const badLogs = []
  if (existsSync(rdir)) for (const f of readdirSync(rdir).filter((x) => x.endsWith('.json'))) {
    try { for (const s of JSON.parse(readFileSync(join(rdir, f), 'utf8')).stages || []) if (!VERDICTS.includes(s.verdict)) badLogs.push(`${f}: stage ${s.stage} has verdict ${s.verdict}`) } catch (e) { badLogs.push(`${f}: ${e.message}`) }
  }
  add('every run log parses and uses a known verdict', badLogs)

  const failed = checks.filter((c) => !c.pass)
  return { verdict: failed.length ? 'HOLD' : 'PASS', checked: checks.length, failed: failed.length, checks }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const g = gate()
  for (const c of g.checks) { console.log(`${c.pass ? 'pass' : 'FAIL'}  ${c.name}`); for (const p of c.problems) console.log(`        ${p}`) }
  console.log(`\n${g.verdict}  ${g.checked - g.failed} of ${g.checked} integrity checks passed`)
  process.exit(g.verdict === 'PASS' ? 0 : 1)
}
