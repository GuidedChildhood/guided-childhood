#!/usr/bin/env node
// The handoff manifest ChatGPT reads before it touches Metricool: one entry
// per GDC post, every platform, with the seventeen fields of Justin's brief of
// 24 November 2026 (section 10, the ChatGPT integration contract).
//
// manifest.mjs is the Stage 1 to Stage 2 queue: which story to write next.
// This is the other end: which finished post may become a draft, which may be
// scheduled, and why not. It covers radar posts (the research register) and
// posts that never came through the radar (completion-queue.json), so ChatGPT
// has one file instead of a handoff per post.
//
// Rules this file keeps:
//   - Generated, never hand edited. GitHub's post register is the only place a
//     number is claimed; the register and the completion queue are the truth.
//   - An entry whose referenced files are not verified in Drive is INCOMPLETE:
//     every permission false and the reason said. A partial entry never
//     triggers production.
//   - Editorially cleared means QA passed, Claude's pack review passed and the
//     founder voice review is stored (config approval.editorialClearance).
//     Scheduling of a cleared post is ChatGPT's standing permission (D);
//     automatic publishing only with the exact word "on" (E).
//   - Versioned by a hash of its content, so ChatGPT can tell two apart and
//     an unchanged manifest keeps its version.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import * as reg from './register.mjs'
import { repoState, parsePostRegister } from './contract.mjs'
import { founderStatus } from './pipeline.mjs'
import { completionQueue } from './packformat.mjs'
import { verificationProblems, VERIFICATION_REQUIRED_FROM } from './verification.mjs'
import { nativeSlot } from './metricool.mjs'
import { SETTINGS, schedulingAllowed, autoPublishAllowed } from './settings.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const SCHEMA = 'gdc.handoff-manifest/1.0'
export const OUT = 'content/research-register/handoff-manifest.json'
export const DRIVE_TITLE = 'GDC HANDOFF MANIFEST, CURRENT'
const PLATFORMS = ['linkedin', 'instagram', 'facebook']
const doc = (id) => (id ? `https://docs.google.com/document/d/${id}/edit` : null)

function readPack(rec) {
  const f = rec.pack?.file && `${ROOT}${rec.pack.file}`
  return f && existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null
}

/** The research verification line for a record. */
function researchStatus(rec) {
  const r = rec.claudeReview
  if (!r || rec.claudeStatus !== 'CLAUDE REVIEWED') return { status: 'NOT REVIEWED', ok: false }
  if (String(r.reviewedAt) >= VERIFICATION_REQUIRED_FROM) {
    const p = verificationProblems(r.verification)
    if (p.length) return { status: `INCOMPLETE: ${p[0]}`, ok: false }
    return { status: `VERIFIED, ten checks answered, verdict ${r.verdict}`, ok: true }
  }
  return { status: `VERIFIED, verdict ${r.verdict} (reviewed before the ten checks were required)`, ok: true }
}

function voiceStatus(v) {
  if (!v?.verdict) return { status: 'NOT DONE', ok: false }
  return { status: `${v.verdict}, ${v.at || 'undated'}${v.by ? `, ${v.by}` : ''}`, ok: ['PASS', 'CHANGES MADE'].includes(v.verdict) }
}

function variantsFrom(pack) {
  const out = {}
  for (const p of PLATFORMS) {
    const body = p === 'linkedin' ? pack?.linkedin?.body : pack?.[p]?.caption
    const declined = pack?.declined?.[`${p.toUpperCase()} CAPTION`]
    out[p] = body ? { state: 'WRITTEN', text: body } : declined ? { state: 'NOT RECOMMENDED', reason: declined } : { state: 'MISSING' }
  }
  return out
}

/** Permissions for one entry, from its own state and the settings. */
function permissions({ complete, cleared, slot, approved }) {
  const paused = SETTINGS.pause.all
  const draft = complete && cleared && !paused && !slot
  return {
    draftCreation: draft,
    scheduling: draft && schedulingAllowed(),
    automaticPublishing: draft && autoPublishAllowed(),
    justinApproved: approved,
  }
}

function radarEntry(rec) {
  const pack = readPack(rec)
  const number = String(rec.gdcPostNumber).padStart(3, '0')
  const research = researchStatus(rec)
  const voice = voiceStatus(rec.voiceReview)
  const status = founderStatus(rec) || rec.status
  const slot = nativeSlot(number)
  const assets = (rec.assets || []).filter((a) => !a.failed)
  const required = assets.filter((a) => a.role === 'required')
  const holds = []
  if (!pack) holds.push('no reviewed pack is stored')
  if (pack && !rec.packDrive?.verified) holds.push('the pack is not verified in Drive')
  if (required.some((a) => !a.drive?.verified)) holds.push('a required asset is not verified in Drive')
  const complete = holds.length === 0
  const qaOk = rec.packQa?.verdict === 'PASS'
  const reviewOk = rec.packReview?.verdict === 'PASS'
  if (!qaOk) holds.push(`pack QA is ${rec.packQa?.verdict || 'not run'}`)
  if (!reviewOk) holds.push(`Claude's pack review is ${rec.packReview?.verdict || 'not done'}`)
  if (!voice.ok) holds.push(`the founder voice review is ${voice.status}`)
  if (!research.ok) holds.push(`research verification is ${research.status}`)
  if (rec.status === 'HOLD') holds.push('the story is on HOLD')
  if (slot) holds.push(`already scheduled in LinkedIn itself for ${slot.scheduledFor}`)
  const cleared = qaOk && reviewOk && voice.ok && research.ok && rec.status !== 'HOLD'
  const approved = status === 'APPROVED' || status === 'PUBLISHED'
  return {
    gdcNumber: number,
    title: rec.claudeReview?.proposedTitle || rec.title,
    researchVerificationStatus: research.status,
    founderVoiceReviewStatus: voice.status,
    platformVariants: variantsFrom(pack),
    finalText: pack?.linkedin?.body || null,
    firstComment: pack?.linkedin?.firstComment || null,
    sourceReferences: pack?.sources || [rec.doi ? `https://doi.org/${rec.doi}` : rec.url].filter(Boolean),
    approvedAssetLocations: assets.filter((a) => a.drive?.verified && a.review?.verdict === 'PASS').map((a) => ({ kind: a.kind, role: a.role, link: `https://drive.google.com/file/d/${a.drive.fileId}/view`, sha256: a.sha256 })),
    mediaReviewStatus: !assets.length ? `no media (${rec.visualDecision?.choice || 'visual not decided'})` : assets.every((a) => a.review?.verdict === 'PASS') ? 'PASS' : 'NOT ALL REVIEWED',
    editorialApprovalStatus: cleared ? `EDITORIALLY CLEARED; ${approved ? 'approved by Justin' : 'not yet approved by Justin'}` : 'NOT CLEARED',
    draftCreationPermission: null,
    schedulingPermission: null,
    automaticPublishingPermission: null,
    currentMetricoolStatus: rec.metricool?.status || 'UNKNOWN until ChatGPT writes its result file',
    lastUpdated: rec.lastChecked || rec.packReview?.reviewedAt || null,
    holdReason: holds.length ? holds.join('; ') : null,
    // Where it came from, for anyone checking.
    origin: { kind: 'radar', researchId: rec.studyId, reviewedCopy: doc(rec.packDrive?.verified && rec.packDrive.fileId), handoffDoc: rec.driveHandoffDoc || null },
    complete,
    ...((p) => ({ draftCreationPermission: p.draftCreation, schedulingPermission: p.scheduling, automaticPublishingPermission: p.automaticPublishing }))(permissions({ complete, cleared, slot, approved })),
  }
}

/** A post from completion-queue.json, which did not come through the radar. */
function queueEntry(item) {
  const voice = voiceStatus(item.voiceReview)
  const approved = item.state === 'APPROVED'
  const done = item.state === 'COMPLETED'
  const holds = []
  if (!item.sourceDoc) holds.push('no source document is recorded')
  if (item.needs?.length && !done) holds.push(`the pack still needs: ${item.needs.join(', ')}`)
  if (!voice.ok) holds.push(`the founder voice review is ${voice.status}`)
  if (item.state === 'RESERVE') holds.push('held in reserve until Justin approves it')
  const complete = Boolean(item.sourceDoc) && !(item.needs?.length && !done)
  const cleared = complete && voice.ok && item.state !== 'HOLD'
  const p = permissions({ complete, cleared, slot: null, approved })
  return {
    gdcNumber: item.gdc,
    title: item.title,
    researchVerificationStatus: item.research || 'VERIFIED outside the radar; see the source document',
    founderVoiceReviewStatus: voice.status,
    platformVariants: item.variants || { linkedin: { state: 'WRITTEN', where: item.sourceDoc } },
    finalText: null,
    firstComment: null,
    sourceReferences: [item.sourceDoc].filter(Boolean),
    approvedAssetLocations: item.assets || [],
    mediaReviewStatus: item.mediaReview || 'not recorded',
    editorialApprovalStatus: cleared ? `EDITORIALLY CLEARED; ${approved ? 'approved by Justin' : 'not yet approved by Justin'}` : 'NOT CLEARED',
    draftCreationPermission: p.draftCreation,
    schedulingPermission: p.scheduling,
    automaticPublishingPermission: p.automaticPublishing,
    currentMetricoolStatus: item.metricool || 'UNKNOWN until ChatGPT writes its result file',
    lastUpdated: item.updated || null,
    holdReason: holds.length ? holds.join('; ') : null,
    origin: { kind: 'completion queue', sourceDoc: item.sourceDoc, slot: item.slot || null, note: item.note || null, textIsIn: 'the source document; use it exactly as approved' },
    complete,
  }
}

export function buildPostManifest() {
  // A post already out (POSTED in the register) needs nothing from Metricool.
  const posted = new Set(parsePostRegister().filter((r) => r.posted).map((r) => r.number))
  const radar = reg.all().filter((r) => r.gdcPostNumber && !posted.has(String(r.gdcPostNumber).padStart(3, '0')) && !['PUBLISHED', 'REJECTED', 'WITHDRAWN', 'SUPERSEDED'].includes(r.status)).map(radarEntry)
  const queue = completionQueue().filter((i) => !posted.has(i.gdc)).map(queueEntry)
  const posts = [...radar, ...queue].sort((a, b) => a.gdcNumber.localeCompare(b.gdcNumber))
  const body = {
    schema: SCHEMA,
    title: DRIVE_TITLE,
    purpose: 'One entry per GDC post, every platform. ChatGPT reads this before any Metricool action. An entry with complete false, or a permission false, is not acted on, and its holdReason says why.',
    settings: {
      paused: SETTINGS.pause.all,
      schedulingPaused: SETTINGS.pause.scheduling,
      schedulingRule: SETTINGS.scheduling.rule,
      time: `${SETTINGS.linkedin.time} ${SETTINGS.linkedin.timezone}`,
      automaticPublishing: SETTINGS.permissions.E_automatic_publishing,
      weeklyLimit: SETTINGS.linkedin.personalPostsPerWeek,
    },
    rules: [
      'Deduplicate by GDC number and platform. A LinkedIn booking does not mean the Instagram and Facebook versions exist.',
      'Use finalText and firstComment exactly. A change goes back through Claude, never into the draft.',
      'Never upload a variant whose state is not WRITTEN. Never attach media that is not in approvedAssetLocations, and say when media is missing rather than leaving it out silently.',
      'Schedule only where schedulingPermission is true: the next free date, then every other day, skipping occupied dates, keeping every existing approved booking and native newsletter slot.',
      'Never publish automatically while automaticPublishingPermission is false.',
      'Write what you did to the METRICOOL HANDOFF folder as a result file: created, link, or failed and why. Only that file counts as done.',
    ],
    posts,
  }
  const version = createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 12)
  return { ...body, version, generatedAt: new Date().toISOString(), sourceCommit: repoState().commit, counts: { posts: posts.length, complete: posts.filter((p) => p.complete).length, draftable: posts.filter((p) => p.draftCreationPermission).length, schedulable: posts.filter((p) => p.schedulingPermission).length } }
}

/** Every entry carries all seventeen fields; returns the gaps. */
export const FIELDS = ['gdcNumber', 'title', 'researchVerificationStatus', 'founderVoiceReviewStatus', 'platformVariants', 'finalText', 'firstComment', 'sourceReferences', 'approvedAssetLocations', 'mediaReviewStatus', 'editorialApprovalStatus', 'draftCreationPermission', 'schedulingPermission', 'automaticPublishingPermission', 'currentMetricoolStatus', 'lastUpdated', 'holdReason']
export function manifestProblems(m) {
  const out = []
  for (const p of m.posts || []) {
    for (const f of FIELDS) if (!(f in p)) out.push(`GDC-${p.gdcNumber} has no ${f}`)
    if (!p.complete && (p.draftCreationPermission || p.schedulingPermission || p.automaticPublishingPermission)) out.push(`GDC-${p.gdcNumber} is incomplete but carries a permission`)
    if (p.automaticPublishingPermission && SETTINGS.permissions.E_automatic_publishing !== 'on') out.push(`GDC-${p.gdcNumber} allows automatic publishing while it is off`)
  }
  const seen = new Set()
  for (const p of m.posts || []) { if (seen.has(p.gdcNumber)) out.push(`GDC-${p.gdcNumber} appears twice`); seen.add(p.gdcNumber) }
  return out
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = buildPostManifest()
  const problems = manifestProblems(m)
  if (problems.length) { console.log('NOT WRITTEN, the manifest has problems:'); for (const p of problems) console.log('  ' + p); process.exit(1) }
  const out = process.argv[2] || `${ROOT}${OUT}`
  writeFileSync(out, JSON.stringify(m, null, 1) + '\n')
  console.log(`handoff manifest ${m.version}: ${m.counts.posts} posts, ${m.counts.complete} complete, ${m.counts.draftable} may become drafts, ${m.counts.schedulable} may be scheduled`)
  for (const p of m.posts) console.log(`  GDC-${p.gdcNumber}  ${p.draftCreationPermission ? 'DRAFT OK' : 'no draft'}  ${p.holdReason ? p.holdReason.slice(0, 110) : ''}`)
}
