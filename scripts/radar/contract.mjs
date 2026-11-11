// The contract between GitHub and Google Drive.
//
// GitHub owns the facts: post numbers, research version history, publication
// records. Drive holds snapshots of those facts plus the editorial production
// files, because Drive is the only surface ChatGPT and Claude can both reach.
//
// Everything in here exists because of what the audit on 10 November found.
// Three systems were each giving a different answer to the same question:
//
//   the repo's manifest.json said   14 records, register version 12
//   the Drive manifest.json said    25 records, register version 13
//   the live register actually had  16 records
//
// and the repo manifest pointed Stage 2 at a Google Doc that Justin had
// already retitled "ZZ SUPERSEDED". If ChatGPT had followed the queue that
// morning it would have produced a post from a superseded handoff.
//
// Nothing detected that, because a snapshot carried no statement of what it
// was a snapshot OF. So every artefact this file publishes carries three
// things, and anything reading one can check all three:
//
//   sourceCommit     the exact commit the facts came from
//   contentSha256    a digest of the payload
//   generatedAt      when
//
// And every write is read back and compared before it is called done.
//
// One thing measured rather than assumed, and corrected the same day. Drive has
// two ways to give a file back and they behave differently:
//
//   read_file_content      renders the file as markdown, so `[0]` comes back as
//                          `\[0\]` and `_contract` as `\_contract`. NOT the bytes.
//   download_file_content  returns the true bytes, base64 encoded.
//
// The first version of this comment said byte equality was not achievable. That
// was wrong: it is, through the download call, and the manifest was verified
// byte identical that way (same sha256, cmp clean). So there are three levels
// of proof and every verification says which one it reached:
//
//   BYTE IDENTICAL            downloaded bytes equal sent bytes
//   SIZE, HEAD AND TAIL       stored size exact, both ends match, for a file
//                             too large to round trip through a tool result
//   SEMANTICALLY EQUAL        markdown readback parsed, every field matches
//
// Anything that cannot be parsed or does not match is a failure, not a warning.

import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import * as reg from './register.mjs'

export const REPO = process.env.RADAR_REPO || process.cwd()
export const POST_REGISTER = join(REPO, 'content/gdc-post-register.md')

/**
 * The Drive files this pipeline owns, by role. Identified on 10 November.
 * A role with no id has never been published and will be created on first use.
 *
 * STAGE2_FOLDER is the only folder Stage 2 artefacts are written to, so a
 * reader never has to guess which copy is current.
 */
export const DRIVE = {
  STAGE2_FOLDER: '10TsNEU7FDxBp52te-xtytQ9yY-_ON-fN',
  // Where ChatGPT drops research candidates, one document a day. Created on
  // 10 November inside the Stage 2 folder. scripts/radar/candidates.mjs reads it.
  CANDIDATE_INBOX: '1YznBz3TzuBMMDGbTGKUWOSYmJUaiCeIs',
  // One folder whose link never changes. The approval sheet inside it is a
  // new file each time the queue moves, because a Doc cannot be rewritten
  // through the connector, so Justin bookmarks the folder and not the sheet.
  APPROVAL_DESK_FOLDER: '1VAk2598afXaJWz2OvCVgd7mAHSaNfmPU',
  // Where a pasted LinkedIn "Top performing posts" screen is left for the
  // morning run. See scripts/analytics/linkedin.mjs.
  ANALYTICS_INBOX: '1SxdsTtPSZqkkG1Rsvuxpy0tdHRS7sq1u',
  // Reference material Stage 2 reads. Read only to this session, which is
  // correct: Claude should not be editing the operating instructions.
  OPERATING_SYSTEM: '1DIHc8sD_EfxfjK6RGIqwxlmCFCG-t2JguWa9HKDaZzU',
  POSTING_PACK: '1YuELZ6adbAD90AaQUx4rG7GeyUcUd7zakJ6bF8RdZm8',
  // Audited on 10 November: there is NO Story Bible in Drive. The handoff
  // template told Stage 2 to read against one, which is a reference to a
  // document that does not exist. Recorded rather than invented.
  STORY_BIBLE: null,
}

export const sha256 = (s) => createHash('sha256').update(String(s)).digest('hex')

/** The commit the facts came from, and whether the tree is dirty. */
export function repoState() {
  const git = (args, dflt = '') => {
    try { return execFileSync('git', args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return dflt }
  }
  const commit = git(['rev-parse', 'HEAD'], 'unknown')
  // sync-state.json is a log of what was verified in Drive. It is written by
  // the act of syncing, goes into no payload, and so does not make a snapshot
  // unreproducible. Counting it would mark every second snapshot DIRTY.
  const dirty = git(['status', '--porcelain'], '').split('\n').filter((l) => l && !l.endsWith('content/research-register/sync-state.json')).join('\n')
  return {
    commit,
    shortCommit: commit.slice(0, 8),
    branch: git(['rev-parse', '--abbrev-ref', 'HEAD'], 'unknown'),
    dirty: dirty.length > 0,
    // A snapshot taken from a dirty tree cannot be reproduced from its commit,
    // so it is published with a warning rather than silently.
    dirtyFiles: dirty ? dirty.split('\n').length : 0,
  }
}

// ---------------------------------------------------------------------------
// The post register. The one place a GDC number is claimed.
// ---------------------------------------------------------------------------

const ROW = /^\|\s*(\d{2,3})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/

/**
 * Parse content/gdc-post-register.md into rows. The file is the authority, so
 * this never writes and never infers a number that is not written down.
 */
export function parsePostRegister(path = POST_REGISTER) {
  if (!existsSync(path)) throw new Error(`the post register is missing at ${path}`)
  const rows = []
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(ROW)
    if (!m) continue
    const [, number, title, state, where] = m
    const s = state.toUpperCase()
    // The state is read from the BOLD marker at the start of the cell, not
    // from the prose after it. A naive /\bPOSTED\b/ counted 31 posted rows
    // out of 41, because every retired row contains the words "Not posted,
    // not deleted". The marker is the claim; the prose is commentary.
    const marker = (word) => new RegExp(`\\*\\*${word}\\b`).test(state.toUpperCase())
    rows.push({
      number,
      n: Number(number),
      title,
      state,
      where,
      posted: marker('POSTED'),
      claimed: marker('CLAIMED'),
      retired: marker('RETIRED'),
      superseded: /SUPERSEDED BY/.test(s),
    })
  }
  if (!rows.length) throw new Error('the post register parsed to zero rows, which means the table format has changed')
  return rows
}

/**
 * The next free number. Always one above the highest EVER used, never a gap.
 * Register rule 4: a published number is spent for good, and a retired one is
 * never reused either, so a gap is not an opportunity.
 */
export function nextFreeNumber(path = POST_REGISTER) {
  const rows = parsePostRegister(path)
  const max = Math.max(...rows.map((r) => r.n))
  return String(max + 1).padStart(3, '0')
}

/** Numbers claimed twice inside the register itself. */
export function internalNumberConflicts(path = POST_REGISTER) {
  const seen = new Map()
  const conflicts = []
  for (const r of parsePostRegister(path)) {
    if (seen.has(r.number)) conflicts.push({ number: r.number, rows: [seen.get(r.number).title, r.title] })
    else seen.set(r.number, r)
  }
  return conflicts
}

/**
 * The failure this whole system exists to prevent: a number claimed in Drive
 * that GitHub does not know about, or claimed in GitHub for a different story.
 *
 * Give it text from any Drive document. It finds GDC numbers in it and checks
 * each against the repo register. Anything it cannot reconcile is a conflict,
 * and a conflict is a HOLD, never a warning.
 */
export function reconcileNumbers(driveText, { path = POST_REGISTER } = {}) {
  const rows = parsePostRegister(path)
  const byNumber = new Map(rows.map((r) => [r.number, r]))
  const found = new Set()
  for (const m of String(driveText || '').matchAll(/\bGDC[\s-]?0?(\d{2,3})\b/gi)) {
    found.add(String(m[1]).padStart(3, '0'))
  }
  const conflicts = []
  const confirmed = []
  for (const n of [...found].sort()) {
    const row = byNumber.get(n)
    if (!row) conflicts.push({ number: n, kind: 'claimed in Drive, absent from the GitHub register', detail: `GDC-${n} appears in the Drive document but has no row in content/gdc-post-register.md. Either the row is missing or Drive invented the number.` })
    else confirmed.push({ number: n, state: row.state.slice(0, 60), title: row.title })
  }
  return { confirmed, conflicts, nextFree: nextFreeNumber(path) }
}

// ---------------------------------------------------------------------------
// Snapshots. Every artefact that crosses into Drive is wrapped in a stamp.
// ---------------------------------------------------------------------------

/**
 * Wrap a payload with the provenance a reader needs to tell whether it is
 * current. `payload` is any JSON serialisable object.
 */
/**
 * A digest of the FACTS in a payload, ignoring when it was generated.
 *
 * Staleness has to mean "the facts changed", not "somebody committed". The
 * first version judged a snapshot stale whenever the repo head moved, which
 * would have put Stage 2 on HOLD every time any session touched any file. And
 * a digest of the whole payload is no use either, because the manifest carries
 * its own generatedAt and so never hashes the same twice.
 */
export function factsDigest(payload, { volatile = [] } = {}) {
  // `volatile` names fields that move without the facts a reader acts on
  // moving. The manifest carries the register's total counts and each record's
  // version number: a discovery run that finds three new unchecked studies
  // changes both, and changes nothing about what ChatGPT should write next.
  const skip = new Set(['generatedAt', 'createdAt', '_contract', ...volatile])
  const strip = (o) => {
    if (Array.isArray(o)) return o.map(strip)
    if (o && typeof o === 'object') {
      const out = {}
      for (const k of Object.keys(o).sort()) {
        if (skip.has(k)) continue
        out[k] = strip(o[k])
      }
      return out
    }
    return o
  }
  return sha256(JSON.stringify(strip(payload)))
}

export function stamp(payload, { role, note = '', volatile = [] } = {}) {
  const r = repoState()
  const body = JSON.stringify(payload)
  return {
    _contract: {
      schemaVersion: '2.0.0',
      role,
      sourceCommit: r.commit,
      sourceBranch: r.branch,
      sourceTreeDirty: r.dirty,
      sourceTreeDirtyFiles: r.dirtyFiles,
      contentSha256: sha256(body),
      factsSha256: factsDigest(payload, { volatile }),
      generatedAt: new Date().toISOString(),
      authority: 'GitHub owns this fact. This Drive copy is a snapshot. If the two disagree, GitHub wins and this file is stale.',
      howToCheck: 'contentSha256 is a digest of everything outside _contract, so an edited or mangled copy shows. factsSha256 ignores timestamps: if a fresh snapshot has a different factsSha256, the facts have moved and this copy is stale.',
      ...(r.dirty ? { warning: `Taken from a working tree with ${r.dirtyFiles} uncommitted file(s), so it cannot be reproduced from sourceCommit alone.` } : {}),
      ...(note ? { note } : {}),
    },
    ...payload,
  }
}

/**
 * Check a stamped snapshot against this repo. Returns a verdict rather than a
 * boolean, because "I could not tell" is a different answer from "it is stale"
 * and the dashboard has to show which.
 */
export function validateSnapshot(obj, { expectRole = null, freshPayload = null, volatile = [] } = {}) {
  const problems = []
  const c = obj?._contract
  if (!c) {
    return { verdict: 'UNSTAMPED', current: false, problems: ['no _contract block, so there is no way to tell what this is a snapshot of. Treat it as unusable rather than current.'] }
  }
  if (expectRole && c.role !== expectRole) problems.push(`role is ${c.role}, expected ${expectRole}`)

  // The digest covers everything except the stamp itself.
  const { _contract: _drop, ...payload } = obj
  const actual = sha256(JSON.stringify(payload))
  const digestOk = actual === c.contentSha256
  if (!digestOk) problems.push(`contentSha256 does not match the payload. Stated ${String(c.contentSha256).slice(0, 12)}, actual ${actual.slice(0, 12)}. The file has been edited since it was generated, or it was mangled in transit.`)

  if (c.sourceTreeDirty) problems.push('generated from a dirty working tree, so sourceCommit does not fully describe it')

  // Stale means the FACTS have moved, not that the repo head has. Give it the
  // payload as it would be generated right now and it compares the two.
  const here = repoState()
  const snapshotFacts = factsDigest(payload, { volatile })
  const freshFacts = freshPayload ? factsDigest(freshPayload, { volatile }) : null
  const factsMatch = freshFacts ? freshFacts === snapshotFacts : null
  if (factsMatch === false) problems.push('the facts in the repository have changed since this snapshot was taken')

  let verdict
  if (!digestOk) verdict = 'CORRUPT'
  else if (expectRole && c.role !== expectRole) verdict = 'WRONG ROLE'
  else if (factsMatch === false) verdict = 'STALE'
  else if (factsMatch === null) verdict = 'INTACT, FRESHNESS NOT CHECKED'
  else if (problems.length) verdict = 'CURRENT WITH WARNINGS'
  else verdict = 'CURRENT'

  return {
    verdict,
    current: verdict === 'CURRENT' || verdict === 'CURRENT WITH WARNINGS',
    digestOk,
    factsMatch,
    snapshotCommit: c.sourceCommit,
    repoCommit: here.commit,
    generatedAt: c.generatedAt,
    role: c.role,
    problems,
  }
}

/**
 * Drive mangles an uploaded JSON file on readback: markdown escapes appear, so
 * `[0]` returns as `\[0\]` and `BLOCKED_SOURCES` as `BLOCKED\_SOURCES`. This
 * undoes that well enough to parse. It is a repair, not a guarantee, which is
 * why verifyReadback reports what it could and could not establish.
 */
export function unmangle(text) {
  return String(text || '')
    // Punctuation markdown escapes. Deliberately NOT the double quote, the
    // slash or the backslash itself: those are real escapes inside a JSON
    // string, and stripping them would corrupt the thing being verified.
    .replace(/\\([[\]_*`#.\-+!(){}>~|=<&$])/g, '$1')
    .replace(/ /g, ' ')
    .trim()
}

/**
 * Compare what came back out of Drive with what was sent in.
 *
 * Byte equality is not achievable through this API for a converted file, so
 * this is deliberately explicit about which level of proof it reached:
 *   BYTE IDENTICAL   the strongest, and what a plain text file should give
 *   SEMANTICALLY EQUAL  parsed, and every field matches
 *   UNREADABLE       could not be parsed, which fails the write
 */
export function verifyReadback(sent, readBack) {
  if (sent === readBack) {
    return { ok: true, level: 'BYTE IDENTICAL', problems: [] }
  }
  const cleaned = unmangle(readBack)
  let sentObj = null
  let backObj = null
  try { sentObj = JSON.parse(sent) } catch { /* sent was not JSON */ }
  try { backObj = JSON.parse(cleaned) } catch { /* readback not parseable */ }

  if (sentObj && !backObj) {
    return { ok: false, level: 'UNREADABLE', problems: ['what came back out of Drive could not be parsed as JSON even after undoing the markdown escaping. Do not treat this file as a usable snapshot.'] }
  }
  if (sentObj && backObj) {
    const a = JSON.stringify(sentObj)
    const b = JSON.stringify(backObj)
    if (a === b) return { ok: true, level: 'SEMANTICALLY EQUAL', problems: [], note: 'Not byte identical, because Drive adds markdown escaping to an uploaded JSON file. Parsed, every field matches.' }
    return { ok: false, level: 'DIFFERENT', problems: ['the readback parsed but does not match what was sent, field for field'] }
  }
  // Plain text: compare with whitespace normalised, since Drive reflows.
  const norm = (s) => unmangle(s).replace(/\s+/g, ' ').trim()
  if (norm(sent) === norm(readBack)) {
    return { ok: true, level: 'SEMANTICALLY EQUAL', problems: [], note: 'Not byte identical; whitespace was reflowed by Drive. The text matches otherwise.' }
  }
  return { ok: false, level: 'DIFFERENT', problems: ['the text that came back differs from the text that was sent by more than whitespace'] }
}

/**
 * Verify against the true bytes from download_file_content.
 *
 * Give it the whole base64 for the strongest proof. For a file too large to
 * pass back through a tool result intact, give the stored size plus the first
 * and last stretch of the base64; that is weaker and it says so.
 */
export function verifyDownload(sentText, { base64 = null, storedSize = null, headB64 = null, tailB64 = null } = {}) {
  const sent = Buffer.from(String(sentText), 'utf8')
  const sentB64 = sent.toString('base64')
  if (base64) {
    const got = Buffer.from(String(base64).replace(/\s+/g, ''), 'base64')
    if (got.equals(sent)) return { ok: true, level: 'BYTE IDENTICAL', problems: [], sha256: sha256(sentText) }
    return { ok: false, level: 'DIFFERENT', problems: [`downloaded ${got.length} bytes, sent ${sent.length}, and they are not equal`] }
  }
  const problems = []
  if (storedSize == null) problems.push('no stored size given')
  else if (Number(storedSize) !== sent.length) problems.push(`Drive stored ${storedSize} bytes, ${sent.length} were sent`)
  if (!headB64 || !sentB64.startsWith(String(headB64).replace(/\s+/g, ''))) problems.push('the start of the downloaded file does not match what was sent')
  if (!tailB64 || !sentB64.endsWith(String(tailB64).replace(/\s+/g, ''))) problems.push('the end of the downloaded file does not match what was sent')
  if (problems.length) return { ok: false, level: 'DIFFERENT', problems }
  return { ok: true, level: 'SIZE, HEAD AND TAIL', problems: [],
    note: `Stored size is exactly ${sent.length} bytes and ${String(headB64).length} leading plus ${String(tailB64).length} trailing base64 characters match. Not a full byte comparison.` }
}

/**
 * Verify a Google Doc against the text it was made from.
 *
 * A converted Doc cannot be compared byte for byte: Drive reflows it and the
 * read call escapes punctuation. So this takes the start, the end and a set of
 * lines copied from the readback, and checks the sent text begins with the
 * first, ends with the second and contains every one of the rest. It proves
 * the document is whole and is the right one. It does not prove every
 * character in between, and the level it reports says so.
 */
export function verifyDocProbe(sentText, { head, tail, contains = [] } = {}) {
  const norm = (x) => unmangle(x).replace(/\s+/g, ' ').trim()
  const sent = norm(sentText)
  const problems = []
  if (!head || !sent.startsWith(norm(head))) problems.push('the document does not start the way the sent text starts')
  if (!tail || !sent.endsWith(norm(tail))) problems.push('the document does not end the way the sent text ends, so it may be cut short')
  const missing = contains.filter((c) => !sent.includes(norm(c)))
  if (missing.length) problems.push(`${missing.length} line(s) read back from the document are not in the sent text: ${missing.map((m) => String(m).slice(0, 50)).join(' | ')}`)
  if (contains.length < 3) problems.push('fewer than three probe lines were supplied, which is too few to call it checked')
  if (problems.length) return { ok: false, level: 'DIFFERENT', problems }
  return { ok: true, level: 'HEAD, TAIL AND PROBES', problems: [],
    note: `A converted Google Doc cannot be compared byte for byte. Start, end and ${contains.length} lines read back from it all match the sent text.` }
}

/**
 * Verify a Google Doc against the text it was made from, using its plain text
 * export. Stronger than verifyDocProbe: the whole document is compared, not a
 * sample. Drive adds a byte order mark, turns line endings into CRLF and
 * changes how blank lines are spaced, so those three things are normalised and
 * nothing else is. Every word and every character within a line must match.
 */
export function verifyDocExport(sentText, exportBase64) {
  const got = Buffer.from(String(exportBase64 || '').replace(/\s+/g, ''), 'base64').toString('utf8')
  if (!got.trim()) return { ok: false, level: 'UNREADABLE', problems: ['the export of the document came back empty'] }
  const norm = (x) => String(x).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l !== '').join('\n')
  const a = norm(sentText); const b = norm(got)
  if (a === b) return { ok: true, level: 'TEXT IDENTICAL', problems: [], note: 'Every line of the document matches the text it was made from. Only the byte order mark, line endings and blank line spacing differ, which Drive changes on every Doc.' }
  const al = a.split('\n'); const bl = b.split('\n')
  const at = al.findIndex((l, i) => l !== bl[i])
  return { ok: false, level: 'DIFFERENT', problems: [`the document differs from the sent text at line ${at + 1}: sent "${String(al[at] ?? '(nothing)').slice(0, 60)}", Drive has "${String(bl[at] ?? '(nothing)').slice(0, 60)}"`] }
}

/**
 * Everything the dashboard and the gates need to know about the repo side,
 * in one call, so no caller has to assemble it and get it subtly wrong.
 */
export function githubFacts() {
  const r = repoState()
  const rows = parsePostRegister()
  const all = reg.all()
  return {
    repo: r,
    postRegister: {
      path: 'content/gdc-post-register.md',
      rows: rows.length,
      posted: rows.filter((x) => x.posted).length,
      claimed: rows.filter((x) => x.claimed).length,
      retired: rows.filter((x) => x.retired).length,
      highest: Math.max(...rows.map((x) => x.n)),
      nextFree: nextFreeNumber(),
      internalConflicts: internalNumberConflicts(),
    },
    researchRegister: {
      path: 'content/research-register/studies.jsonl',
      ...reg.stats(),
      reviewed: all.filter((x) => x.claudeStatus === 'CLAUDE REVIEWED').length,
      awaitingReview: all.filter((x) => x.status === 'VERIFIED' && x.claudeStatus !== 'CLAUDE REVIEWED').length,
      withFullText: all.filter((x) => x.fullTextAvailable).length,
    },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(githubFacts(), null, 2))
}
