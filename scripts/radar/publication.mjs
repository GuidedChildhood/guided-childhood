#!/usr/bin/env node
// The publication register and the reconciliation that has to be clean before
// the next batch of posts is written.
//
// Justin, 12 November 2026, the LinkedIn and Metricool contract: one canonical
// record per post saying who owns its slot (LinkedIn itself, Metricool, or
// nobody yet), whether he approved it, when it goes, and where it is live.
// And: "Never create duplicate posts." On that day two posts were scheduled in
// LinkedIn AND sat as Metricool drafts, two retired posts were scheduled, and
// three scheduled posts had no record at all. None of that was visible from
// any one file.
//
// So this builds one row per post from the three things the repository holds:
//
//   content/gdc-post-register.md              the number and whether it is spent
//   content/research-register                 the review, the pack, the approval
//   content/publication/linkedin-schedule.json  what Justin reported is scheduled
//
// Nothing here can read LinkedIn or Metricool. A row that rests on a report is
// labelled as a report, and a thing nobody has checked is UNKNOWN, never fine.
//
// Statuses, in order. A row only moves forward on evidence:
//   READY FOR JUSTIN   reviewed pack, no approval on record
//   APPROVED           Justin's approval is stored on the research record
//   SCHEDULED          approved AND a slot is recorded with one owner
//   PUBLISHED          a live URL is stored. Never inferred from a date passing.
//
// A slot with no approval on record is not SCHEDULED. It is an issue.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as reg from './register.mjs'
import { parsePostRegister, repoState } from './contract.mjs'
import { founderStatus } from './pipeline.mjs'
import { loadSchedule, SCHEDULE } from './metricool.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const REGISTER = `${ROOT}content/publication/publication-register.json`
export const SCHEMA = 'gdc.publication-register/1.0'
export const CLASSES = ['NEW', 'FOLLOW-UP', 'OVERLAP', 'DUPLICATE', 'UNKNOWN']
const pad = (n) => String(n).padStart(3, '0')

/** Words that carry a subject. Used only to notice overlap, never to clear it. */
const STOP = new Set('a an and the of to in on for is are was were be it its that this with what why how you your we our not new says say study research children child social media'.split(' '))
export function subjectWords(text) {
  return [...new Set(String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((w) => w.length > 2 && !STOP.has(w)))]
}
function shared(a, b) { const B = new Set(b); return a.filter((w) => B.has(w)) }

export function buildRegister({ schedulePath = SCHEDULE, postRegisterPath = undefined } = {}) {
  const sched = loadSchedule(schedulePath)
  const postRows = postRegisterPath ? parsePostRegister(postRegisterPath) : parsePostRegister()
  const byNumber = Object.fromEntries(postRows.map((r) => [r.number, r]))
  const recs = reg.all().filter((r) => r.gdcPostNumber)
  const drafts = sched.metricoolDrafts || []
  const rows = []
  const seen = new Set()

  for (const rec of recs) {
    const number = pad(rec.gdcPostNumber)
    seen.add(number)
    const slots = (sched.posts || []).filter((p) => p.gdcNumber === number)
    const draft = drafts.filter((d) => d.gdcNumber === number)
    rows.push(row({ number, rec, postRow: byNumber[number], slots, draft, sched }))
  }
  // A slot Justin reported that carries no number, or a number with no research record.
  for (const p of sched.posts || []) {
    if (p.gdcNumber && seen.has(p.gdcNumber)) continue
    rows.push(row({ number: p.gdcNumber || null, rec: null, postRow: p.gdcNumber ? byNumber[p.gdcNumber] : null, slots: [p], draft: drafts.filter((d) => p.gdcNumber && d.gdcNumber === p.gdcNumber), sched }))
  }
  rows.sort((a, b) => String(a.scheduledFor || '9999').localeCompare(String(b.scheduledFor || '9999')) || String(a.gdcPostNumber).localeCompare(String(b.gdcPostNumber)))
  return { schema: SCHEMA, generatedAt: new Date().toISOString(), sourceCommit: repoState().commit, scheduleObservedAt: sched.observedAt, scheduleStanding: 'Reported by Justin. Claude cannot read LinkedIn or Metricool.', rows }
}

function row({ number, rec, postRow, slots, draft, sched }) {
  const slot = slots[0] || null
  const founder = rec ? founderStatus(rec) : null
  const approvedOnRecord = founder === 'APPROVED' || founder === 'PUBLISHED'
  const liveUrl = rec?.publishedUrl || slot?.liveUrl || null
  const owners = [slot ? 'LINKEDIN NATIVE' : null, draft.length ? 'METRICOOL DRAFT' : null].filter(Boolean)
  const issues = []
  // Justin can take a slot as it stands. It is then his, unchecked, and said so:
  // it stops blocking, and it is never described as reviewed.
  const accepted = Boolean(slot?.acceptedByJustin)
  if (slots.length > 1) issues.push({ blocking: true, what: `scheduled ${slots.length} times in LinkedIn itself` })
  if (slot && draft.length) issues.push({ blocking: true, what: `scheduled in LinkedIn for ${slot.scheduledFor} and also held as a Metricool draft. One of the two has to go, and that is Justin's choice.` })
  if (slot && !rec) issues.push({ blocking: !accepted, what: 'scheduled with no reviewed record. Nobody has checked this copy against a source.' })
  if (slot && postRow?.retired) issues.push({ blocking: !accepted, what: `GDC-${number} is RETIRED in the post register and is scheduled` })
  if (slot && rec && !approvedOnRecord) issues.push({ blocking: true, what: 'scheduled, and no approval from Justin is on record. Scheduling it himself may well be his approval. It needs saying once so the record can hold it.' })
  if (slot && rec && slot.withImage && !(rec.assets || []).some((a) => a.kind !== 'motion' && a.verified)) issues.push({ blocking: !accepted, what: 'scheduled with an image that was never checked. Our record for this post has no image.' })
  if (slot && rec && slot.withImage == null) issues.push({ blocking: false, what: 'whether the scheduled post carries an image or film is not recorded' })
  if (slot && rec && !slot.copyVerified) issues.push({ blocking: false, what: 'the scheduled copy has not been compared with the reviewed text' })
  if (draft.some((d) => !d.draftId)) issues.push({ blocking: false, what: 'the Metricool draft has no draft ID on record, so it cannot be told apart from a second one' })

  let status = founder || (rec ? rec.status : 'NO RECORD')
  if (liveUrl) status = 'PUBLISHED'
  else if (approvedOnRecord && slot && owners.length === 1) status = 'SCHEDULED'
  else if (slot && !approvedOnRecord) status = rec ? `${status}, SLOT REPORTED` : 'NO RECORD, SLOT REPORTED'

  return {
    gdcPostNumber: number,
    title: rec?.claudeReview?.proposedTitle || rec?.title || slot?.subject || postRow?.title || null,
    researchId: rec?.studyId || null,
    account: 'Justin Phillips, personal LinkedIn profile',
    status,
    slotOwner: owners.length === 0 ? 'NONE' : owners.length === 1 ? owners[0] : 'CONFLICT',
    scheduledFor: slot?.scheduledFor || null,
    metricoolDraftId: draft[0]?.draftId || null,
    metricoolDraft: draft.length ? 'reported' : 'none recorded',
    approval: approvedOnRecord ? { by: rec.founderDecision?.approvedBy || 'Justin', at: rec.founderDecision?.at || null } : null,
    reviewedPack: rec?.packDrive?.verified ? `https://docs.google.com/document/d/${rec.packDrive.fileId}/edit` : null,
    visual: rec?.visualDecision?.choice || (slot?.withImage ? 'image, reported, not on our record' : 'not recorded'),
    liveUrl,
    postRegisterState: postRow ? (postRow.posted ? 'POSTED' : postRow.retired ? 'RETIRED' : postRow.claimed ? 'CLAIMED' : 'OTHER') : 'NO ROW',
    registerMatchNote: slot?.registerMatch || null,
    scheduleObservedAt: slot ? sched.observedAt : null,
    acceptedByJustin: slot?.acceptedByJustin || null,
    issues,
  }
}

/**
 * Is a story we are about to hand to ChatGPT already out, or already on its way.
 *   DUPLICATE   same source, or same number, as something published or scheduled
 *   FOLLOW-UP   same source as a post already out, written as a later piece
 *   OVERLAP     a different source on the same subject as something scheduled
 *   UNKNOWN     a scheduled post has no record, so nothing can be ruled out
 *   NEW         none of the above, and every scheduled post is identified
 */
export function classify(studyId, { register = null } = {}) {
  const rec = reg.get(studyId)
  if (!rec) throw new Error(`no such research record: ${studyId}`)
  const pub = register || buildRegister()
  const mine = rec.gdcPostNumber ? pad(rec.gdcPostNumber) : null
  const keys = new Set(reg.dedupKeys(rec))
  const words = subjectWords(`${rec.claudeReview?.proposedTitle || ''} ${rec.title || ''}`)
  const against = []
  for (const r of pub.rows) {
    if (r.researchId === rec.studyId) {
      if (r.scheduledFor || r.liveUrl) return { result: 'DUPLICATE', why: `GDC-${r.gdcPostNumber} is this story and is ${r.liveUrl ? 'published' : `scheduled for ${r.scheduledFor}`}.`, against: [r.gdcPostNumber] }
      continue
    }
    const other = r.researchId ? reg.get(r.researchId) : null
    const sameSource = other && reg.dedupKeys(other).some((k) => keys.has(k) && !k.startsWith('title:'))
    if (sameSource && (r.scheduledFor || r.liveUrl)) return { result: mine && mine !== r.gdcPostNumber ? 'FOLLOW-UP' : 'DUPLICATE', why: `Same source as GDC-${r.gdcPostNumber}, which is ${r.liveUrl ? 'published' : `scheduled for ${r.scheduledFor}`}. A second post on it has to say something the first did not.`, against: [r.gdcPostNumber] }
    if (!(r.scheduledFor || r.liveUrl)) continue
    const hit = shared(words, subjectWords(r.title))
    if (hit.length >= 2) against.push({ gdcPostNumber: r.gdcPostNumber, scheduledFor: r.scheduledFor, title: r.title, sharedWords: hit })
  }
  if (against.length) return { result: 'OVERLAP', why: `Shares its subject with ${against.map((a) => `"${a.title}" on ${String(a.scheduledFor).slice(0, 10)}`).join(' and ')}. Space them apart or make the angle plainly different.`, against }
  const blind = pub.rows.filter((r) => r.scheduledFor && !r.researchId && !r.acceptedByJustin)
  if (blind.length) return { result: 'UNKNOWN', why: `${blind.length} scheduled post${blind.length === 1 ? ' has' : 's have'} no record here (${blind.map((b) => `${String(b.scheduledFor).slice(0, 10)} ${b.title}`).join('; ')}), so a duplicate cannot be ruled out by subject words alone.`, against: blind.map((b) => b.scheduledFor) }
  return { result: 'NEW', why: 'No published or scheduled post shares its source or its subject, and every scheduled post is identified.', against: [] }
}

/** Everything that is not straight, most serious first. */
export function reconcile(opts = {}) {
  const pub = buildRegister(opts)
  const issues = []
  for (const r of pub.rows) for (const i of r.issues) issues.push({ ...i, gdcPostNumber: r.gdcPostNumber, scheduledFor: r.scheduledFor, title: r.title })
  issues.sort((a, b) => Number(b.blocking) - Number(a.blocking) || String(a.scheduledFor || '9').localeCompare(String(b.scheduledFor || '9')))
  const blocking = issues.filter((i) => i.blocking)
  return { verdict: blocking.length ? 'HOLD' : 'PASS', blocking: blocking.length, issues, register: pub }
}

export function reportText(rc) {
  const L = [`PUBLICATION RECONCILIATION, schedule as reported ${rc.register.scheduleObservedAt}`, `${rc.verdict}: ${rc.blocking} to settle, ${rc.issues.length - rc.blocking} to note`, '']
  for (const r of rc.register.rows) {
    L.push(`${r.scheduledFor ? String(r.scheduledFor).replace('T', ' ') : 'no slot        '}  ${r.gdcPostNumber ? `GDC-${r.gdcPostNumber}` : 'no number'}  ${r.status}  [${r.slotOwner}]`)
    L.push(`    ${r.title}`)
    for (const i of r.issues) L.push(`    ${i.blocking ? 'SETTLE' : 'note  '}  ${i.what}`)
  }
  return L.join('\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, id] = process.argv.slice(2)
  if (cmd === 'reconcile') {
    const rc = reconcile()
    mkdirSync(`${ROOT}content/publication`, { recursive: true })
    writeFileSync(REGISTER, JSON.stringify(rc.register, null, 2) + '\n')
    console.log(reportText(rc))
    process.exit(rc.verdict === 'PASS' ? 0 : 1)
  } else if (cmd === 'classify' && id) {
    const c = classify(id); console.log(c.result, c.why)
  } else if (cmd === 'queue') {
    for (const r of reg.all().filter((x) => x.gdcPostNumber && ['EDITORIAL READY'].includes(x.status))) { const c = classify(r.studyId); console.log(`GDC-${pad(r.gdcPostNumber)} ${c.result}: ${c.why}`) }
  } else console.log('usage: publication.mjs reconcile | classify <researchId> | queue')
}
