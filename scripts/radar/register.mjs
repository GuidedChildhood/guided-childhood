// The permanent research register.
//
// Append only. Nothing is ever edited in place and nothing is ever deleted, so
// a correction is a new version with the old one still readable above it. That
// is the protocol's instruction: "Do not overwrite original research records;
// retain provenance and timestamps."
//
// Two files, both under content/research-register/:
//   studies.jsonl   every version of every record, one JSON object per line
//   index.json      the current head of each record, plus the dedup keys
//
// This is NOT a post register. content/gdc-post-register.md remains the only
// place a GDC number is claimed, and nothing here ever assigns one. A record
// may CARRY a GDC number that already exists, and that is the only link.

import { appendFileSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

export const DIR = process.env.RADAR_REGISTER || join(process.cwd(), 'content/research-register')
const JSONL = join(DIR, 'studies.jsonl')
const INDEX = join(DIR, 'index.json')

// The protocol's statuses, plus the two states the downstream pipeline needs.
export const STATUSES = [
  'DISCOVERED',       // found by a stream, nothing checked
  'VERIFIED',         // the automatic dossier passed its checks
  'CLAUDE REVIEWED',  // a human directed Claude run audited it, claim by claim
  'EDITORIAL READY',  // handed off for Stage 2
  'ASSETS READY',     // Stage 2 produced the pack
  'APPROVED',         // Justin approved it
  'PUBLISHED',        // a live URL was checked and answered
  'HOLD',
  'REJECTED',
]

// Per claim verification verdicts, from the protocol.
export const CLAIM_STATUSES = ['VERIFIED', 'QUALIFIED', 'UNSUPPORTED', 'REQUIRES SOURCE']

function ensure() {
  mkdirSync(DIR, { recursive: true })
  if (!existsSync(JSONL)) writeFileSync(JSONL, '')
  if (!existsSync(INDEX)) writeFileSync(INDEX, JSON.stringify({ heads: {}, keys: {} }, null, 1))
}

/** Normalising a title is how we catch the same study arriving from two
 *  indexes with no DOI in common. Punctuation and case are noise. */
export function titleKey(title) {
  return String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').slice(0, 14).join(' ')
}

/** Every identity a record can be recognised by, strongest first. */
export function dedupKeys(rec) {
  const k = []
  if (rec.doi) k.push('doi:' + String(rec.doi).toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, ''))
  if (rec.pmid) k.push('pmid:' + rec.pmid)
  if (rec.pmcid) k.push('pmcid:' + rec.pmcid)
  if (rec.url) {
    try {
      const u = new URL(rec.url)
      k.push('url:' + (u.hostname + u.pathname).replace(/\/$/, '').toLowerCase())
    } catch { /* not a URL we can normalise */ }
  }
  const t = titleKey(rec.title)
  if (t.length > 20) k.push('title:' + t)
  return k
}

export function load() {
  ensure()
  return JSON.parse(readFileSync(INDEX, 'utf8'))
}

/** The study id is derived from the strongest identity available, so the same
 *  study found again next week gets the same id rather than a new row. */
export function studyId(rec) {
  const keys = dedupKeys(rec)
  const basis = keys[0] || 'rand:' + Math.random()
  return 'GDC-RR-' + createHash('sha1').update(basis).digest('hex').slice(0, 10)
}

/**
 * Add a record, or add a new version of one we already hold.
 * Returns { id, action: 'created' | 'updated' | 'unchanged', version }.
 */
export function upsert(rec, { reason = '', actor = 'radar' } = {}) {
  const idx = load()
  const keys = dedupKeys(rec)

  let id = null
  for (const k of keys) { if (idx.keys[k]) { id = idx.keys[k]; break } }
  const isNew = !id
  if (!id) id = rec.studyId || studyId(rec)

  const prev = idx.heads[id] || null
  const version = (prev?.version || 0) + 1

  const next = {
    ...prev,
    ...rec,
    studyId: id,
    version,
    status: rec.status || prev?.status || 'DISCOVERED',
    firstFound: prev?.firstFound || new Date().toISOString(),
    lastChecked: new Date().toISOString(),
    changeReason: reason,
    changedBy: actor,
  }

  // Nothing to record if the substance is identical. lastChecked alone is not
  // a change worth a new version, or a daily run would double the file.
  if (prev) {
    const strip = (o) => { const { version: _v, lastChecked: _l, changeReason: _r, changedBy: _b, ...rest } = o; return JSON.stringify(rest) }
    if (strip(prev) === strip(next)) {
      idx.heads[id] = { ...prev, lastChecked: next.lastChecked }
      writeFileSync(INDEX, JSON.stringify(idx, null, 1))
      return { id, action: 'unchanged', version: prev.version }
    }
  }

  appendFileSync(JSONL, JSON.stringify(next) + '\n')
  idx.heads[id] = next
  for (const k of keys) idx.keys[k] = id
  writeFileSync(INDEX, JSON.stringify(idx, null, 1))
  return { id, action: isNew ? 'created' : 'updated', version }
}

export function get(id) { return load().heads[id] || null }

export function all() { return Object.values(load().heads) }

export function byStatus(status) { return all().filter((r) => r.status === status) }

/** The full version history of one record, oldest first. */
export function history(id) {
  ensure()
  return readFileSync(JSONL, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l) } catch { return null } })
    .filter((r) => r && r.studyId === id)
}

export function setStatus(id, status, { reason = '', actor = 'radar', extra = {} } = {}) {
  if (!STATUSES.includes(status)) throw new Error(`unknown status: ${status}`)
  const cur = get(id)
  if (!cur) throw new Error(`no such study: ${id}`)
  return upsert({ ...cur, ...extra, status }, { reason, actor })
}

/**
 * The question Stage 2 asks: what should I work on next?
 * Highest editorial priority first, then the oldest discovery, so nothing
 * sits forever behind a stream of newer findings.
 */
export function nextForEditorial() {
  const ready = byStatus('EDITORIAL READY')
  const rank = { BREAKING: 0, HIGH: 1, BANK: 2, LOW: 3 }
  return ready.sort((a, b) =>
    (rank[a.editorialPriority] ?? 9) - (rank[b.editorialPriority] ?? 9)
    || String(a.firstFound).localeCompare(String(b.firstFound)))[0] || null
}

export function stats() {
  const a = all()
  const by = {}
  for (const r of a) by[r.status] = (by[r.status] || 0) + 1
  return { total: a.length, byStatus: by }
}
