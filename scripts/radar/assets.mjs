#!/usr/bin/env node
// Visuals and motion for a pack: the decision, the file, and the proof that
// the file is what it claims to be.
//
// Justin, 11 November 2026: "For each story, decide whether text, a still
// image, carousel or motion graphic is most appropriate. Use performance
// evidence and editorial judgement, not a rule that every post needs an
// image." And: "Verify the MP4 exists and plays before marking the asset
// ready. If production fails, report the failure. Do not replace it with an
// unapproved generic AI image."
//
// So three things are stored on the research record and nothing is assumed:
//
//   visualDecision   what was chosen and why, in words. Text only is a real
//                    answer and is the default when the evidence is silent.
//   assets[]         each file, with its hash, what ffprobe found, whether it
//                    decoded from first frame to last, and a review of what is
//                    actually on screen.
//   drive            where the copy Justin opens is, once it has been read
//                    back.
//
// An asset that is recorded and not verified, or verified and not reviewed,
// holds the pack: see `assetProblems`, which the ready gate calls. A film
// that failed to render is recorded as a failure and the pack goes forward
// as text only, with the failure on the approval sheet.

import { existsSync, readFileSync, statSync } from 'node:fs'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as reg from './register.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const VISUAL_CHOICES = ['text only', 'still image', 'carousel', 'motion']
const DASH = new RegExp('[\\u2010-\\u2015\\u2212]')

export function haveFfmpeg() {
  return spawnSync('ffprobe', ['-version']).status === 0 && spawnSync('ffmpeg', ['-version']).status === 0
}

/**
 * Does this file exist, is it a video, and does every frame decode. A file
 * that only has a valid header passes ffprobe and fails here, which is the
 * case that matters: a render that was cut off half way.
 */
export function probeVideo(path) {
  const problems = []
  if (!existsSync(path)) return { ok: false, facts: null, problems: [`no file at ${path}`] }
  const bytes = statSync(path).size
  if (bytes < 1024) problems.push(`the file is ${bytes} bytes, which is not a film`)
  if (!haveFfmpeg()) return { ok: false, facts: { bytes }, problems: ['ffprobe and ffmpeg are not installed here, so the film could not be checked. Not verified is not the same as fine.'] }
  let info = null
  try {
    info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt,nb_frames:format=duration,size,format_name', '-of', 'json', path], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }))
  } catch (e) {
    return { ok: false, facts: { bytes }, problems: [`ffprobe could not read it: ${String(e.stderr || e.message).trim().slice(0, 200)}`] }
  }
  const v = (info.streams || []).find((s) => s.codec_type === 'video')
  const a = (info.streams || []).find((s) => s.codec_type === 'audio')
  const duration = Number(info.format?.duration || 0)
  if (!v) problems.push('there is no video stream in the file')
  if (v && v.codec_name !== 'h264') problems.push(`the video is ${v.codec_name}, and LinkedIn wants H.264`)
  if (v && v.pix_fmt !== 'yuv420p') problems.push(`the pixel format is ${v.pix_fmt}. Phones need yuv420p`)
  if (!(duration >= 3 && duration <= 120)) problems.push(`it runs ${duration.toFixed(1)} seconds, outside 3 to 120`)
  const dec = spawnSync('ffmpeg', ['-v', 'error', '-i', path, '-f', 'null', '-'], { encoding: 'utf8' })
  const decodeErrors = String(dec.stderr || '').trim()
  if (dec.status !== 0 || decodeErrors) problems.push(`it does not play through: ${decodeErrors.slice(0, 200) || `ffmpeg exited ${dec.status}`}`)
  const facts = { bytes, seconds: Math.round(duration * 100) / 100, width: v?.width ?? null, height: v?.height ?? null, fps: v?.r_frame_rate ?? null, codec: v?.codec_name ?? null, pixelFormat: v?.pix_fmt ?? null, audio: a ? a.codec_name : 'none, silent', playsThrough: dec.status === 0 && !decodeErrors }
  return { ok: problems.length === 0, facts, problems }
}

const hold = (reasons) => ({ verdict: 'HOLD', stage: 'ASSETS', reasons: [].concat(reasons) })
const pass = (extra = {}) => ({ verdict: 'PASS', stage: 'ASSETS', reasons: [], ...extra })

/** Record what the pack goes out with, and why. A choice with no reason is refused. */
export function decideVisual(studyId, { choice, reason, decidedBy = 'Claude Code, directed run' } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold(`no such research record: ${studyId}`)
  if (!VISUAL_CHOICES.includes(choice)) return hold(`the choice must be one of: ${VISUAL_CHOICES.join(', ')}`)
  if (String(reason || '').trim().length < 40) return hold('a visual decision needs its reason in a sentence: what the evidence says, and what the judgement is')
  if (DASH.test(reason)) return hold('the reason contains a dash')
  reg.upsert({ ...rec, visualDecision: { choice, reason: String(reason).trim(), decidedBy, at: new Date().toISOString() } }, { reason: `visual decision: ${choice}`, actor: 'radar:assets' })
  return pass({ choice })
}

/**
 * Record one asset. `role` is "required" when the pack names it, and
 * "optional" when the post is cleared without it and it is offered as extra.
 * `review` is what a reader saw on screen, not a restatement of the brief.
 */
export function recordAsset(studyId, { kind, file, role = 'required', source = null, review = null, failure = null } = {}) {
  const rec = reg.get(studyId)
  if (!rec) return hold(`no such research record: ${studyId}`)
  if (!['motion', 'still image', 'carousel'].includes(kind)) return hold('kind must be motion, still image or carousel')
  if (!['required', 'optional'].includes(role)) return hold('role must be required or optional')
  const others = (rec.assets || []).filter((a) => !(a.kind === kind && a.file === (file ? relative(ROOT, resolve(file)) : null)))
  if (failure) {
    // Production failed. Say so and keep it, so nobody quietly swaps in something else.
    const entry = { kind, role, file: null, verified: false, failed: true, failure: String(failure).slice(0, 600), at: new Date().toISOString() }
    reg.upsert({ ...rec, assets: [...others, entry] }, { reason: `${kind} production failed`, actor: 'radar:assets' })
    return hold(`${kind} production failed: ${entry.failure}`)
  }
  const abs = resolve(file)
  if (!existsSync(abs)) return hold(`no file at ${file}`)
  const rel = relative(ROOT, abs)
  if (rel.startsWith('..')) return hold('the asset has to live inside the repository, so the copy in GitHub is the one that was checked')
  const probe = kind === 'motion' ? probeVideo(abs) : { ok: statSync(abs).size > 1024, facts: { bytes: statSync(abs).size }, problems: statSync(abs).size > 1024 ? [] : ['the file is too small to be an image'] }
  const rv = review && ['PASS', 'HOLD'].includes(review.verdict) && String(review.notes || '').trim().length >= 40 ? { verdict: review.verdict, notes: String(review.notes).trim(), reviewedBy: review.reviewedBy || 'Claude Code, directed run', at: new Date().toISOString() } : null
  const entry = { kind, role, file: rel, sha256: createHash('sha256').update(readFileSync(abs)).digest('hex'), source, facts: probe.facts, verified: probe.ok, problems: probe.problems, review: rv, drive: null, at: new Date().toISOString() }
  reg.upsert({ ...rec, assets: [...others, entry] }, { reason: `${kind} recorded, ${probe.ok ? 'verified' : 'NOT verified'}`, actor: 'radar:assets' })
  const reasons = [...probe.problems]
  if (!rv) reasons.push('the asset has no review. Say what is on screen, in 40 characters or more, with a verdict of PASS or HOLD')
  else if (rv.verdict !== 'PASS') reasons.push(`the review of the asset is ${rv.verdict}: ${rv.notes}`)
  return reasons.length ? hold(reasons) : pass({ sha256: entry.sha256, facts: entry.facts })
}

/** The copy Justin opens. Only a size that matches what was hashed counts. */
export function recordAssetDrive(studyId, sha256, { fileId, bytes, level = 'SIZE MATCHES' } = {}) {
  const rec = reg.get(studyId)
  const a = (rec?.assets || []).find((x) => x.sha256 === sha256)
  if (!a) return hold('no such asset on this record')
  const ok = Boolean(fileId) && Number(bytes) === a.facts?.bytes
  a.drive = { fileId: fileId || null, verified: ok, level: ok ? level : 'NOT VERIFIED', bytesInDrive: Number(bytes) || null, at: new Date().toISOString() }
  reg.upsert({ ...rec }, { reason: `asset copy in Drive ${ok ? 'verified' : 'NOT verified'}`, actor: 'radar:assets' })
  return ok ? pass({ level }) : hold(`the Drive copy is ${bytes} bytes and the checked file is ${a.facts?.bytes}`)
}

/** What stops a pack being put in front of Justin, on the asset side. */
export function assetProblems(rec) {
  const out = []
  for (const a of rec?.assets || []) {
    const name = `${a.kind}${a.file ? ` ${a.file.split('/').pop()}` : ''}`
    if (a.failed) { if (a.role === 'required') out.push(`the ${a.kind} this pack needs failed to produce: ${a.failure}`); continue }
    if (!a.verified) out.push(`${name} did not verify: ${(a.problems || []).join('; ')}`)
    if (a.review?.verdict !== 'PASS') out.push(`${name} has ${a.review ? `a review of ${a.review.verdict}` : 'not been reviewed'}`)
    if (a.role === 'required' && !a.drive?.verified) out.push(`${name} is required and is not verifiably in Drive`)
  }
  return out
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, a, b] = process.argv.slice(2)
  if (cmd === 'probe') { const r = probeVideo(a); console.log(r.ok ? 'PLAYS' : 'DOES NOT VERIFY', JSON.stringify(r.facts), r.problems.join(' | ')) ; process.exit(r.ok ? 0 : 1) }
  else if (cmd === 'problems') console.log(assetProblems(reg.get(a)).join('\n') || 'none')
  else console.log('usage: assets.mjs probe <file.mp4> | problems <researchId>', b || '')
}
