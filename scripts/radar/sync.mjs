// Synchronising GitHub to Drive, with the verification step that was missing.
//
// An honest word about what is and is not automated here, because the brief
// asks for exactly that and it is the thing most easily fudged.
//
// A Node script in this repository CANNOT write to Google Drive. Drive is
// reached through an MCP connector that belongs to a Claude session, not to
// the shell. So the transport is a Claude step, and always will be until
// somebody puts a service account in CI.
//
// What this file does, therefore, is everything except the transport:
//   prepareSnapshot()     builds the exact payload and the exact title,
//                         stamped with the commit, the digest and the time
//   verifyReadback()      (in contract.mjs) compares what came back
//   acceptSnapshot()      records the verified Drive copy in the register side
//                         so the dashboard can show when sync last succeeded
//   syncState()           reads that record and says how stale Drive is
//
// The result is that the VERIFICATION is automated and mechanical, while the
// COPY is a Claude action. A sync is only ever recorded as successful after a
// readback has been compared, so "last successful synchronisation" on the
// dashboard means a byte or field level comparison passed, not that a write
// was attempted.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import * as reg from './register.mjs'
import { buildManifest } from './manifest.mjs'
import { stamp, factsDigest, verifyReadback, verifyDownload, repoState, sha256, githubFacts, parsePostRegister, DRIVE, REPO } from './contract.mjs'

const STATE = join(reg.DIR, 'sync-state.json')

/** The artefacts that cross into Drive, and what each is for. */
export const ROLES = {
  manifest: {
    role: 'manifest',
    driveTitle: 'manifest.json',
    mimeType: 'application/json',
    description: 'The Stage 2 queue. ChatGPT takes queue[0] and produces from the handoff it names.',
    // Not facts Stage 2 acts on. See factsDigest in contract.mjs.
    volatile: ['counts', 'registerVersion'],
  },
  postRegister: {
    role: 'postRegister',
    driveTitle: 'GDC POST REGISTER mirror',
    // JSON, not prose. The audit found the previous mirror had been retitled
    // "DO NOT USE" with nothing replacing it, so for a day ChatGPT had no way
    // to see which numbers were taken. A stamped, parseable mirror is how that
    // stops being a judgement call.
    mimeType: 'application/json',
    description: 'A read only mirror of the one place a GDC number is claimed. Drive must never claim a number; it reads this to find out what is taken.',
  },
  handoff: {
    role: 'handoff',
    driveTitle: 'RESEARCH HANDOFF',
    mimeType: 'application/json',
    description: 'One story, everything Stage 2 needs, with the cleared figures and the prohibited claims.',
  },
}

/**
 * Build a snapshot ready to be written to Drive.
 * Returns { role, title, text, sha256, commit, payload }.
 *
 * The title carries the commit and the time, because a Drive file list is the
 * fastest place to spot a stale copy, and because the audit found three
 * superseded files whose only marker was Justin hand editing their titles.
 */
/** The payload for a role as the repository stands right now. */
export function currentPayload(roleName, { studyId = null } = {}) {
  let payload
  if (roleName === 'manifest') {
    payload = buildManifest()
  } else if (roleName === 'postRegister') {
    payload = {
      purpose: 'Read only mirror. GitHub owns these numbers. Never claim a number here; claim it in content/gdc-post-register.md and let this mirror catch up.',
      nextFreeNumber: githubFacts().postRegister.nextFree,
      rule: 'A published number is spent for good, and a retired number is never reused either, so the next free number is always one above the highest, never a gap.',
      // The state cell is trimmed. Every retired row in the register carries
      // the same long sentence of explanation, which made the mirror 12 KB of
      // mostly repetition. The flags carry the decision; the full prose stays
      // in content/gdc-post-register.md, which is the authority anyway.
      rows: parsePostRegister().map((x) => ({
        number: x.number,
        title: x.title,
        taken: true,
        posted: x.posted,
        claimed: x.claimed,
        retired: x.retired,
        superseded: x.superseded,
        state: x.state.replace(/\s+/g, ' ').slice(0, 90),
      })),
    }
  } else if (roleName === 'handoff') {
    if (!studyId) throw new Error('a handoff snapshot needs a studyId')
    const path = join(reg.DIR, 'handoffs', `handoff-${studyId}.json`)
    if (!existsSync(path)) throw new Error(`no handoff at ${path}. Build it before syncing.`)
    payload = JSON.parse(readFileSync(path, 'utf8'))
  } else {
    throw new Error(`unknown sync role: ${roleName}`)
  }
  return payload
}

export function prepareSnapshot(roleName, { studyId = null } = {}) {
  const spec = ROLES[roleName]
  if (!spec) throw new Error(`unknown sync role: ${roleName}`)
  const r = repoState()
  const payload = currentPayload(roleName, { studyId })

  const stamped = stamp(payload, { role: spec.role, note: spec.description, volatile: spec.volatile || [] })
  const text = JSON.stringify(stamped, null, 1)
  const digest = sha256(text)

  return {
    role: spec.role,
    mimeType: spec.mimeType,
    // Everything a human scanning a Drive folder needs to tell current from stale.
    title: `${spec.driveTitle}${studyId ? ` ${studyId}` : ''} [${r.shortCommit}${r.dirty ? ' DIRTY' : ''}] ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
    text,
    sha256: digest,
    commit: r.commit,
    dirty: r.dirty,
    payload: stamped,
    folderId: DRIVE.STAGE2_FOLDER,
  }
}

/**
 * Record that a Drive copy was written AND verified. Refuses to record a sync
 * whose readback did not match, which is what makes the dashboard's "last
 * successful synchronisation" mean something.
 */
export function acceptSnapshot({ role, fileId, title, sentText, readBackText = null, download = null, studyId = null, verification = null }) {
  // Prefer the true bytes. The markdown readback is the fallback, and weaker.
  const v = verification || (download ? verifyDownload(sentText, download) : verifyReadback(sentText, readBackText))
  const state = loadState()
  const entry = {
    role,
    studyId,
    fileId,
    title,
    // The SNAPSHOT's commit and facts, read out of what was sent. The first
    // version recorded the repo head at the moment of acceptance instead, so
    // a snapshot taken at 9a86fd59 was shown as current at a8f71144.
    commit: sentContract(sentText).sourceCommit || 'unknown',
    factsSha256: sentContract(sentText).factsSha256 || null,
    sha256: sha256(sentText),
    verification: v,
    at: new Date().toISOString(),
  }
  if (!v.ok) {
    state.failures.unshift({ ...entry, verdict: 'FAILED VERIFICATION' })
    state.failures = state.failures.slice(0, 20)
    saveState(state)
    return { ok: false, verdict: 'HOLD', verification: v, message:
      `Drive write for ${role} was NOT accepted. Readback verification came back ${v.level}: ${v.problems.join('; ')} ` +
      'The Drive copy must be treated as unusable until this is resolved. Nothing downstream may read it.' }
  }
  state.verified[studyId ? `${role}:${studyId}` : role] = entry
  // A verified copy answers any earlier failed attempt for the same role, so
  // the dashboard shows what is wrong now rather than what was wrong once.
  state.failures = (state.failures || []).filter((f) => !(f.role === role && (f.studyId || null) === (studyId || null)))
  state.lastSuccessAt = entry.at
  saveState(state)
  return { ok: true, verdict: 'SYNCED', verification: v, message:
    `${role} verified in Drive at ${v.level}${v.note ? `. ${v.note}` : ''}` }
}

function sentContract(sentText) {
  try { return JSON.parse(sentText)._contract || {} } catch { return {} }
}

export function loadState() {
  mkdirSync(reg.DIR, { recursive: true })
  if (!existsSync(STATE)) return { verified: {}, failures: [], lastSuccessAt: null }
  try { return JSON.parse(readFileSync(STATE, 'utf8')) } catch { return { verified: {}, failures: [], lastSuccessAt: null } }
}

function saveState(s) { writeFileSync(STATE, JSON.stringify(s, null, 1)) }

/**
 * How stale is Drive? For the dashboard's "last successful synchronisation"
 * and for the gate that refuses to let Stage 2 run off an old snapshot.
 */
export function syncState() {
  const s = loadState()
  const here = repoState()
  const out = { lastSuccessAt: s.lastSuccessAt, repoCommit: here.commit, roles: {}, recentFailures: (s.failures || []).slice(0, 5) }
  for (const [k, e] of Object.entries(s.verified || {})) {
    // Regenerate the payload as the repo stands now and compare the facts.
    // A commit that changes nothing Stage 2 reads does not make Drive stale.
    let current = false
    let staleBy = null
    try {
      const [role, studyId] = k.split(':')
      const fresh = factsDigest(currentPayload(role, { studyId: studyId || null }), { volatile: ROLES[role]?.volatile || [] })
      current = !!e.factsSha256 && fresh === e.factsSha256
      if (!e.factsSha256) staleBy = 'this snapshot predates the facts digest, so its freshness cannot be established. Re sync it.'
      else if (!current) staleBy = 'the facts in the repository have changed since this snapshot was verified'
    } catch (err) {
      staleBy = `could not regenerate the payload to compare: ${err.message}`
    }
    out.roles[k] = {
      fileId: e.fileId,
      title: e.title,
      at: e.at,
      snapshotCommit: e.commit,
      current,
      verifiedAt: e.verification?.level || 'unknown',
      staleBy,
    }
  }
  const anyStale = Object.values(out.roles).some((r) => !r.current)
  out.verdict = !s.lastSuccessAt ? 'NEVER SYNCED' : anyStale ? 'STALE' : 'CURRENT'
  return out
}

/**
 * The gate: may Stage 2 read Drive right now? Requirement 2, "never treat a
 * cached snapshot as current without validating its version."
 */
export function driveReadable(roleKey = 'manifest') {
  const s = syncState()
  const r = s.roles[roleKey]
  if (!r) return { verdict: 'HOLD', reasons: [`${roleKey} has never been synced to Drive and verified, so there is nothing safe for Stage 2 to read`] }
  if (!r.current) return { verdict: 'HOLD', reasons: [`the verified Drive copy of ${roleKey} (taken at ${String(r.snapshotCommit).slice(0, 8)}) is stale: ${r.staleBy}. Re sync before Stage 2 reads it.`] }
  return { verdict: 'PASS', reasons: [], fileId: r.fileId, at: r.at }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cmd = process.argv[2]
  if (cmd === 'prepare') {
    const snap = prepareSnapshot(process.argv[3] || 'manifest', { studyId: process.argv[4] || null })
    console.log(`role     ${snap.role}`)
    console.log(`title    ${snap.title}`)
    console.log(`mime     ${snap.mimeType}`)
    console.log(`folder   ${snap.folderId}`)
    console.log(`commit   ${snap.commit}${snap.dirty ? '  (DIRTY TREE)' : ''}`)
    console.log(`sha256   ${snap.sha256}`)
    console.log(`bytes    ${snap.text.length}`)
    const out = process.argv[5]
    if (out) { writeFileSync(out, snap.text); console.log(`written  ${out}`) }
  } else if (cmd === 'state') {
    console.log(JSON.stringify(syncState(), null, 1))
  } else if (cmd === 'gate') {
    console.log(JSON.stringify(driveReadable(process.argv[3] || 'manifest'), null, 1))
  } else {
    console.log('usage:')
    console.log('  node scripts/radar/sync.mjs prepare <manifest|postRegister|handoff> [studyId] [outFile]')
    console.log('  node scripts/radar/sync.mjs state')
    console.log('  node scripts/radar/sync.mjs gate [role]')
    console.log('')
    console.log('The Drive write itself is a Claude step: a Node script cannot reach the')
    console.log('Drive connector. Prepare the snapshot, write it, read it back, then call')
    console.log('acceptSnapshot with both texts. A sync is only recorded once it verifies.')
  }
}
