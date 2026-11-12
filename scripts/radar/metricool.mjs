#!/usr/bin/env node
// The handoff ChatGPT reads before it touches Metricool, and the record of
// what is already scheduled in LinkedIn itself.
//
// Justin, 12 November 2026: ChatGPT has a Metricool account linked to his
// personal LinkedIn. Claude has no Metricool connection and none is assumed.
// So Claude's part is a file: for one post, the exact reviewed text, the first
// comment, the sources, the asset decision, what is already scheduled, and two
// plain permissions, whether a draft may be made and whether it may be
// scheduled. Both default to no.
//
// The rule that matters: a post that is scheduled in LinkedIn itself must not
// also go out through Metricool. On 12 November GDC-054 and GDC-058 were each
// scheduled natively AND had a Metricool draft. Scheduling is refused here for
// any post with a native slot, and for any post Justin has not approved.
//
// content/publication/linkedin-schedule.json holds what Justin reported from
// his screenshots. It is an observation with a date, never a live feed.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as reg from './register.mjs'
import { repoState } from './contract.mjs'
import { founderStatus } from './pipeline.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const SCHEDULE = `${ROOT}content/publication/linkedin-schedule.json`
export const SCHEMA = 'gdc.metricool-handoff/1.0'
export const DUPLICATE_CLASSES = ['NEW', 'FOLLOW-UP', 'OVERLAP', 'DUPLICATE', 'UNKNOWN']

export function loadSchedule(path = SCHEDULE) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { observedAt: null, source: null, posts: [] }
}

/** The native LinkedIn slot recorded for a GDC number, if any. */
export function nativeSlot(gdcNumber, path = SCHEDULE) {
  const n = String(gdcNumber).padStart(3, '0')
  return loadSchedule(path).posts.find((p) => p.gdcNumber === n) || null
}

export function buildHandoff(studyId, { schedulePath = SCHEDULE } = {}) {
  const rec = reg.get(studyId)
  if (!rec) throw new Error(`no such research record: ${studyId}`)
  const pack = rec.pack?.file && existsSync(`${ROOT}${rec.pack.file}`) ? JSON.parse(readFileSync(`${ROOT}${rec.pack.file}`, 'utf8')) : null
  const number = rec.gdcPostNumber ? String(rec.gdcPostNumber).padStart(3, '0') : null
  const status = founderStatus(rec)
  const slot = number ? nativeSlot(number, schedulePath) : null
  const approved = status === 'APPROVED' || status === 'PUBLISHED'
  const ready = ['READY FOR JUSTIN', 'APPROVED'].includes(status)
  const reasons = []
  if (!pack) reasons.push('no reviewed pack is stored for this record')
  if (!ready) reasons.push(`the pack is ${status || rec.status}, not READY FOR JUSTIN or APPROVED`)
  if (slot) reasons.push(`already scheduled in LinkedIn itself for ${slot.scheduledFor} (observed ${loadSchedule(schedulePath).observedAt}). A second copy through Metricool would be a duplicate.`)
  if (!approved) reasons.push('Justin has not approved it. A draft is not approval and a date on a draft is not an approved date.')
  const assets = (rec.assets || []).filter((a) => !a.failed).map((a) => ({
    kind: a.kind, role: a.role, file: a.file, sha256: a.sha256, seconds: a.facts?.seconds ?? null, width: a.facts?.width ?? null, height: a.facts?.height ?? null,
    checked: Boolean(a.verified), review: a.review?.verdict || 'none',
    driveLink: a.drive?.verified ? `https://drive.google.com/file/d/${a.drive.fileId}/view` : null,
    attach: a.role === 'required' ? 'yes' : 'only if Justin asks for it',
  }))
  return {
    schema: SCHEMA,
    generatedAt: new Date().toISOString(),
    sourceCommit: repoState().commit,
    gdcPostNumber: number,
    researchId: rec.studyId,
    title: rec.claudeReview?.proposedTitle || rec.title,
    account: 'Justin Phillips, personal LinkedIn profile',
    finalText: pack?.linkedin?.body || null,
    firstComment: pack?.linkedin?.firstComment || null,
    sources: pack?.sources || [rec.doi ? `https://doi.org/${rec.doi}` : rec.url].filter(Boolean),
    reviewedCopy: rec.packDrive?.verified ? `https://docs.google.com/document/d/${rec.packDrive.fileId}/edit` : null,
    visualDecision: rec.visualDecision ? { choice: rec.visualDecision.choice, reason: rec.visualDecision.reason } : { choice: 'not recorded', reason: null },
    assets,
    approvalStatus: status || rec.status,
    duplicateCheck: slot
      ? { result: 'DUPLICATE', why: `This post is already scheduled in LinkedIn itself for ${slot.scheduledFor}.` }
      : { result: 'UNKNOWN', why: 'Published LinkedIn activity and Metricool drafts cannot be read from GitHub. Checked: the post register, the research register and the recorded LinkedIn schedule.' },
    linkedinNativeSchedule: slot ? { scheduledFor: slot.scheduledFor, withImage: slot.withImage ?? null, observedAt: loadSchedule(schedulePath).observedAt, standing: 'reported by Justin from screenshots, not checked again since' } : null,
    metricool: {
      draftCreationPermitted: Boolean(pack) && ready && !slot,
      schedulingPermitted: Boolean(pack) && approved && !slot,
      autoPublishPermitted: false,
      why: reasons,
      rules: [
        'Use finalText and firstComment exactly. A change goes back through Claude, never into the draft.',
        'Do not create a second draft if one exists for this GDC number.',
        'Check the draft and autoPublish settings yourself and report both. autoPublish false is not a guarantee.',
        'Never schedule, publish, delete or reschedule unless schedulingPermitted is true and Justin has given the time.',
      ],
    },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, id] = process.argv.slice(2)
  if (cmd === 'handoff' && id) {
    const h = buildHandoff(id)
    mkdirSync(`${ROOT}content/publication`, { recursive: true })
    const out = `${ROOT}content/publication/metricool-handoff-GDC-${h.gdcPostNumber}.json`
    writeFileSync(out, JSON.stringify(h, null, 2) + '\n')
    console.log(`GDC-${h.gdcPostNumber} draft ${h.metricool.draftCreationPermitted ? 'PERMITTED' : 'NOT PERMITTED'}, scheduling ${h.metricool.schedulingPermitted ? 'PERMITTED' : 'NOT PERMITTED'}, duplicate check ${h.duplicateCheck.result}`)
    for (const r of h.metricool.why) console.log('  ' + r)
  } else console.log('usage: metricool.mjs handoff <researchId>')
}
