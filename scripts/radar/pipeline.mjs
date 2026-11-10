// The pipeline, end to end, as one set of gated steps.
//
//   Stage 1  Claude      discover, dossier, directed review      -> EDITORIAL READY
//            handoff()   build the handoff from the stored review
//   Stage 2  ChatGPT     writes the pack from the handoff in Drive
//   Stage 3  submitPack  the automated QA pass
//            reviewPack  a stored Claude review of the finished pack -> ASSETS READY
//   Stage 4  approve     Justin, explicitly                          -> APPROVED
//            publish     a live URL that answers                     -> PUBLISHED
//
// Every step returns { verdict: 'PASS' | 'HOLD', reasons }. Nothing here
// throws its way past a gate and nothing returns a bare boolean, because the
// brief's instruction is that a failure must result in a clear HOLD rather
// than silent continuation. A HOLD is written onto the record as `gate`, so
// the dashboard can show what is blocked and why without rerunning anything.
//
// What a HOLD does NOT do is change the record's status. Status HOLD in the
// register means "deliberately parked" and takes a story out of the Stage 2
// queue. A pack that failed QA is not parked: it is waiting for a fix, and it
// has to stay visible to the stage that can fix it.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import * as reg from './register.mjs'
import { buildHandoff, handoffDoc } from './handoff.mjs'
import { checkPack, eligibility } from './qa.mjs'
import { parsePostRegister, internalNumberConflicts, repoState, POST_REGISTER } from './contract.mjs'
import { driveReadable } from './sync.mjs'
import { checkUrl } from './posted.mjs'

const PACKS = () => join(reg.DIR, 'packs')
const HANDOFFS = () => join(reg.DIR, 'handoffs')

const hold = (stage, reasons, extra = {}) => ({ verdict: 'HOLD', stage, reasons: [].concat(reasons), ...extra })
const pass = (stage, extra = {}) => ({ verdict: 'PASS', stage, reasons: [], ...extra })

/** Write the outcome of a gate onto the record, so a HOLD is visible later. */
function recordGate(studyId, result) {
  const rec = reg.get(studyId)
  if (!rec) return
  reg.upsert({ ...rec, gate: { verdict: result.verdict, stage: result.stage, reasons: result.reasons, at: new Date().toISOString() } },
    { reason: `${result.stage}: ${result.verdict}${result.reasons.length ? `, ${result.reasons[0].slice(0, 120)}` : ''}`, actor: 'radar:pipeline' })
}

// ---------------------------------------------------------------------------
// Preflight. Is the ground solid before anything runs?
// ---------------------------------------------------------------------------

/**
 * The checks that have to pass before any stage does anything. Each one is a
 * way this system has actually failed or could: no repository, a register
 * that no longer parses, a number claimed twice, a Drive snapshot nobody
 * verified.
 */
export function preflight({ postRegisterPath = POST_REGISTER, requireDrive = true } = {}) {
  const reasons = []
  const r = repoState()
  if (r.commit === 'unknown') reasons.push('the repository cannot be read: git gave no commit. Without it nothing can be stamped, so nothing may be handed off.')

  let rows = []
  try {
    rows = parsePostRegister(postRegisterPath)
  } catch (e) {
    reasons.push(`the post register cannot be read: ${e.message}. Post numbers cannot be checked, so no number may be used.`)
  }
  if (rows.length) {
    const dupes = internalNumberConflicts(postRegisterPath)
    for (const d of dupes) reasons.push(`GDC-${d.number} is claimed twice in the register: "${d.rows[0]}" and "${d.rows[1]}"`)
  }

  if (requireDrive) {
    for (const role of ['manifest', 'postRegister', 'stage2Brief']) {
      const g = driveReadable(role)
      if (g.verdict !== 'PASS') reasons.push(...g.reasons)
    }
  }
  return reasons.length ? hold('PREFLIGHT', reasons) : pass('PREFLIGHT', { commit: r.commit })
}

// ---------------------------------------------------------------------------
// Stage 1 to Stage 2. The handoff.
// ---------------------------------------------------------------------------

/**
 * Build the handoff for a reviewed record and write it beside the register.
 * Refuses, with reasons, for anything not reviewed or whose number conflicts.
 */
export function handoff(studyId, { postRegisterPath = POST_REGISTER } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold('HANDOFF', `no such research record: ${studyId}`)

  const el = eligibility(rec)
  if (el.verdict !== 'PASS') { const h = hold('HANDOFF', el.reasons); recordGate(studyId, h); return h }

  // A number on the record must exist in GitHub and must not be spent.
  const reasons = []
  let number = rec.gdcPostNumber ? String(rec.gdcPostNumber).padStart(3, '0') : null
  if (number) {
    let rows = []
    try { rows = parsePostRegister(postRegisterPath) } catch (e) { reasons.push(`the post register cannot be read: ${e.message}`) }
    const row = rows.find((x) => x.number === number)
    if (rows.length && !row) reasons.push(`the record carries GDC-${number}, which has no row in the GitHub register`)
    if (row?.posted) reasons.push(`the record carries GDC-${number}, which is already POSTED. A published number is spent for good.`)
    // The same number on two different research records is the collision
    // the register was created to stop.
    const other = reg.all().find((x) => x.studyId !== studyId && x.gdcPostNumber && String(x.gdcPostNumber).padStart(3, '0') === number)
    if (other) reasons.push(`GDC-${number} is also carried by ${other.studyId}. Two stories cannot hold one number.`)
  }
  if (reasons.length) { const h = hold('HANDOFF', reasons); recordGate(studyId, h); return h }

  const version = (rec.handoff?.version || 0) + 1
  let h
  try {
    h = buildHandoff(rec, {
      claudeReview: rec.claudeReview,
      gdcPostNumber: number,
      priority: rec.editorialPriority || 'BANK',
      sourceCommit: repoState().commit,
      handoffVersion: version,
    })
  } catch (e) {
    const out = hold('HANDOFF', e.message); recordGate(studyId, out); return out
  }

  mkdirSync(HANDOFFS(), { recursive: true })
  const jsonRel = `content/research-register/handoffs/handoff-${studyId}.json`
  const docRel = `content/research-register/handoffs/handoff-${studyId}.txt`
  h.supportingFiles = [jsonRel]
  writeFileSync(join(HANDOFFS(), `handoff-${studyId}.json`), JSON.stringify(h, null, 1))
  writeFileSync(join(HANDOFFS(), `handoff-${studyId}.txt`), handoffDoc(h))

  // Paths on the record are repo relative. The audit found absolute container
  // paths here, which point nowhere outside the container that wrote them.
  reg.upsert({ ...reg.get(studyId), handoff: { json: jsonRel, doc: docRel, version, schemaVersion: h.schemaVersion, sourceCommit: h.sourceCommit, builtAt: h.createdAt } },
    { reason: `handoff version ${version} built at ${String(h.sourceCommit).slice(0, 8)}`, actor: 'radar:pipeline' })
  const out = pass('HANDOFF', { handoffVersion: version, json: jsonRel, doc: docRel, gdcPostNumber: number })
  recordGate(studyId, out)
  return out
}

// ---------------------------------------------------------------------------
// Stage 3. The pack comes back.
// ---------------------------------------------------------------------------

/**
 * Take a production pack from Stage 2 and run the QA pass over it. The pack
 * and the full QA result are stored whatever the outcome, so a HOLD can be
 * read later by the person fixing it.
 */
export function submitPack(pack, { corpus = null } = {}) {
  const studyId = pack?.researchId
  if (!studyId || !reg.get(studyId)) return hold('QA', `the pack names research record ${studyId || 'nothing'}, which is not in the register`)

  const qa = checkPack(pack, { corpus })
  mkdirSync(PACKS(), { recursive: true })
  writeFileSync(join(PACKS(), `pack-${studyId}.json`), JSON.stringify(pack, null, 1))
  writeFileSync(join(PACKS(), `qa-${studyId}.json`), JSON.stringify(qa, null, 1))

  const rec = reg.get(studyId)
  reg.upsert({ ...rec,
    pack: { file: `content/research-register/packs/pack-${studyId}.json`, submittedAt: new Date().toISOString(), sourceCommit: pack.sourceCommit || null, gdcPostNumber: qa.gdcPostNumber },
    packQa: { verdict: qa.verdict, checked: qa.checked, failedCount: qa.failedCount, failures: qa.failures, checkedAt: qa.checkedAt },
    // A new pack invalidates any review of the previous one.
    packReview: null,
  }, { reason: `pack submitted, QA ${qa.verdict}, ${qa.failedCount} of ${qa.checked} failed`, actor: 'radar:pipeline' })

  const out = qa.verdict === 'PASS'
    ? pass('QA', { checked: qa.checked })
    : hold('QA', qa.failures.map((f) => `${f.check}: ${f.why}`), { failedCount: qa.failedCount, checked: qa.checked })
  recordGate(studyId, out)
  return out
}

/**
 * Claude's own review of the finished pack. Requirement 5: "Claude should
 * review the completed production pack before it becomes available for
 * founder approval." This stores that review. It cannot be recorded against a
 * pack that failed QA, and gate J applies here as it does to research: the
 * review has to exist and be stored before anything claims it happened.
 */
export function reviewPack(studyId, { verdict, notes = '', reviewedBy = 'Claude Code, directed run' } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold('PACK REVIEW', `no such research record: ${studyId}`)
  if (!rec.pack) return hold('PACK REVIEW', 'no pack has been submitted for this story')
  if (rec.packQa?.verdict !== 'PASS') {
    const h = hold('PACK REVIEW', `the pack is on HOLD at QA with ${rec.packQa?.failedCount ?? 'unknown'} failure(s). A pack that failed the automated checks is not reviewed, it is fixed.`)
    recordGate(studyId, h); return h
  }
  if (!['PASS', 'EDIT', 'REJECT'].includes(verdict)) return hold('PACK REVIEW', `verdict must be PASS, EDIT or REJECT, got ${verdict}`)
  if (!String(notes).trim()) return hold('PACK REVIEW', 'a pack review needs notes. A verdict with no reasoning is not a review.')

  reg.upsert({ ...rec, packReview: { verdict, notes, reviewedBy, reviewedAt: new Date().toISOString() } },
    { reason: `pack reviewed, ${verdict}`, actor: 'radar:pipeline' })

  if (verdict !== 'PASS') {
    const h = hold('PACK REVIEW', `Claude reviewed the pack and returned ${verdict}: ${notes}`)
    recordGate(studyId, h); return h
  }
  const out = pass('PACK REVIEW')
  recordGate(studyId, out)
  return out
}

/**
 * Record that the pack was saved to Drive and the save was verified. Takes
 * the result of sync.acceptSnapshot or contract.verifyDownload.
 */
export function recordPackSave(studyId, { fileId = null, verification } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold('DRIVE SAVE', `no such research record: ${studyId}`)
  if (!verification?.ok) {
    reg.upsert({ ...rec, packDrive: { verified: false, fileId, level: verification?.level || 'NOT VERIFIED', problems: verification?.problems || ['no verification was supplied'], at: new Date().toISOString() } },
      { reason: 'Drive save of the pack did not verify', actor: 'radar:pipeline' })
    const h = hold('DRIVE SAVE', `the pack was not verifiably saved to Drive (${verification?.level || 'no verification'}): ${(verification?.problems || ['nothing was read back']).join('; ')}`)
    recordGate(studyId, h); return h
  }
  reg.upsert({ ...rec, packDrive: { verified: true, fileId, level: verification.level, at: new Date().toISOString() } },
    { reason: `pack saved to Drive and verified, ${verification.level}`, actor: 'radar:pipeline' })
  const out = pass('DRIVE SAVE', { level: verification.level })
  recordGate(studyId, out)
  return out
}

/** Everything that must be true before a pack is put in front of Justin. */
export function readyForApproval(studyId) {
  const rec = reg.get(studyId)
  if (!rec) return hold('ASSETS READY', `no such research record: ${studyId}`)
  const reasons = []
  const el = eligibility(rec)
  if (el.verdict !== 'PASS') reasons.push(...el.reasons)
  if (!rec.pack) reasons.push('no pack has been submitted')
  if (rec.packQa?.verdict !== 'PASS') reasons.push(`automated QA is ${rec.packQa?.verdict || 'not run'}`)
  if (rec.packReview?.verdict !== 'PASS') reasons.push(`Claude's review of the pack is ${rec.packReview?.verdict || 'not done'}`)
  if (!rec.packDrive?.verified) reasons.push('the pack has not been verifiably saved to Drive, so Justin would have nothing to open')
  if (reasons.length) { const h = hold('ASSETS READY', reasons); recordGate(studyId, h); return h }

  if (rec.status === 'EDITORIAL READY') reg.setStatus(studyId, 'ASSETS READY', { reason: 'QA passed, Claude reviewed the pack, Drive save verified', actor: 'radar:pipeline' })
  const out = pass('ASSETS READY')
  recordGate(studyId, out)
  return out
}

// ---------------------------------------------------------------------------
// Stage 4. Justin.
// ---------------------------------------------------------------------------

/**
 * Founder approval. Only ever called on Justin's explicit instruction, and
 * the words he used are stored. This function cannot know who is typing, so
 * what it enforces is the order: nothing reaches APPROVED that has not
 * cleared every gate before it.
 */
export function approve(studyId, { approvedBy, instruction } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold('APPROVAL', `no such research record: ${studyId}`)
  if (approvedBy !== 'Justin') return hold('APPROVAL', `only Justin approves. Got approvedBy "${approvedBy || 'nobody'}".`)
  if (!String(instruction || '').trim()) return hold('APPROVAL', 'approval needs the instruction Justin actually gave, word for word, so the record shows what he approved')
  if (rec.status !== 'ASSETS READY') {
    const h = hold('APPROVAL', `status is ${rec.status}. Only a pack at ASSETS READY can be approved, which means QA passed, Claude reviewed it and it is verifiably in Drive.`)
    recordGate(studyId, h); return h
  }
  reg.setStatus(studyId, 'APPROVED', { reason: `approved by Justin: "${String(instruction).slice(0, 160)}"`, actor: 'justin',
    extra: { approval: { approvedBy: 'Justin', instruction, approvedAt: new Date().toISOString() } } })
  const out = pass('APPROVAL')
  recordGate(studyId, out)
  return out
}

/**
 * Mark PUBLISHED. Needs an APPROVED record and a URL that answers. `check` is
 * injectable so the test does not depend on LinkedIn being reachable.
 */
export async function publish(studyId, url, { check = checkUrl } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold('PUBLICATION', `no such research record: ${studyId}`)
  if (rec.status !== 'APPROVED') {
    const h = hold('PUBLICATION', `status is ${rec.status}. Nothing becomes PUBLISHED without founder approval first.`)
    recordGate(studyId, h); return h
  }
  if (!url) { const h = hold('PUBLICATION', 'no URL supplied. PUBLISHED needs a live URL that has been checked, not a memory of posting.'); recordGate(studyId, h); return h }
  const c = await check(url)
  if (!c.provesItIsLive) {
    const h = hold('PUBLICATION', `the URL check came back ${c.verdict} (HTTP ${c.httpStatus}). Either the post is not there or it cannot be seen from here. Not marked PUBLISHED.`, { check: c })
    recordGate(studyId, h); return h
  }
  reg.setStatus(studyId, 'PUBLISHED', { reason: `live URL verified, ${c.verdict}`, actor: 'radar:pipeline',
    extra: { publishedUrl: url, publishedCheck: c, publishedAt: new Date().toISOString() } })
  const out = pass('PUBLICATION', { check: c, note: 'The register row in content/gdc-post-register.md is still Justin\'s to move to POSTED.' })
  recordGate(studyId, out)
  return out
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, a, b] = process.argv
  const show = (r) => { console.log(`${r.verdict}  ${r.stage}`); for (const x of r.reasons) console.log(`  ${x}`); process.exitCode = r.verdict === 'PASS' ? 0 : 1 }
  if (cmd === 'preflight') show(preflight())
  else if (cmd === 'handoff' && a) show(handoff(a))
  else if (cmd === 'submit' && a) show(submitPack(JSON.parse(readFileSync(a, 'utf8'))))
  else if (cmd === 'ready' && a) show(readyForApproval(a))
  else if (cmd === 'publish' && a) publish(a, b).then(show)
  else {
    console.log('usage:')
    console.log('  node scripts/radar/pipeline.mjs preflight')
    console.log('  node scripts/radar/pipeline.mjs handoff <researchId>')
    console.log('  node scripts/radar/pipeline.mjs submit <pack.json>')
    console.log('  node scripts/radar/pipeline.mjs ready <researchId>')
    console.log('  node scripts/radar/pipeline.mjs publish <researchId> <url>')
    console.log('Approval and the pack review are deliberate steps with no one line command.')
  }
}
