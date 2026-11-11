// The research candidate inbox.
//
// Before this file, a finding travelled from ChatGPT to Claude by Justin
// copying it. ChatGPT's 08:00 brief named a study in prose, Justin pasted it
// into a Claude session, and the session went and found it. Nothing recorded
// that it had been sent, received, or already dealt with.
//
// Now ChatGPT drops ONE document a day into a Drive folder, in the shape
// below, and the ingest step reads it. What ChatGPT sends is a CANDIDATE: a
// pointer to a source and what ChatGPT thinks it says. Nothing in it is
// treated as true. Its claims are stored as claims to check, under
// `candidate`, and the record enters the register as DISCOVERED, exactly as
// if the radar's own streams had found it. The dossier and the directed
// review then run on it like any other record.
//
// Four properties, because this runs unattended:
//   idempotent   the same document ingested twice changes nothing the second
//                time. A ledger keyed by the content digest says so.
//   tolerant     ChatGPT may save a .json file, a .md file or a Google Doc
//                with the JSON inside a code fence. All three are read.
//   strict       a candidate with no original URL or no publication date is
//                held with the reason, never guessed at.
//   deduplicated against the research register, the post register, the
//                archived and published posts, and ChatGPT's own posting pack.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import * as reg from './register.mjs'
import { score } from './score.mjs'
import { sha256, unmangle, parsePostRegister, POST_REGISTER } from './contract.mjs'
import { existingCorpus, similarity } from './qa.mjs'

export const SCHEMA_ID = 'gdc.research-candidates/1.0'
export const SOURCE_TYPES = ['journal-article', 'preprint', 'official-document', 'regulator-statement', 'dataset', 'news-report', 'other']
export const FORMATS = ['linkedin', 'image', 'instagram', 'facebook', 'reel', 'newsletter']

const LEDGER = () => join(reg.DIR, 'inbox-ledger.json')

/**
 * The contract, as JSON Schema. `node scripts/radar/candidates.mjs schema`
 * prints it, and that output is the file in Drive, so there is one source.
 */
export const CANDIDATE_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: SCHEMA_ID,
  title: 'Guided Childhood research candidates, one batch',
  description: 'What ChatGPT drops in the research candidate inbox. A candidate is a pointer to a source and what the sender believes it says. Nothing here is treated as verified.',
  type: 'object',
  required: ['schema', 'batchId', 'createdAt', 'createdBy', 'candidates'],
  additionalProperties: true,
  properties: {
    schema: { const: SCHEMA_ID },
    batchId: { type: 'string', minLength: 6, description: 'Unique per document. Suggested: the date and the run, for example 2026-11-11-chatgpt-0800.' },
    createdAt: { type: 'string', format: 'date-time' },
    createdBy: { type: 'string', description: 'Who wrote this document, for example chatgpt-scheduled-0800. Never Claude and never Justin unless that is true.' },
    candidates: {
      type: 'array',
      maxItems: 12,
      description: 'May be empty. A day with nothing worth sending is a normal day.',
      items: {
        type: 'object',
        required: ['candidateId', 'title', 'sourceType', 'originalUrl', 'publicationDate', 'candidateClaims', 'limitations'],
        additionalProperties: true,
        properties: {
          candidateId: { type: 'string', minLength: 4, description: 'The sender\'s own id, unique inside the batch. Not a GDC-RR id.' },
          researchId: { type: ['string', 'null'], pattern: '^GDC-RR-[0-9a-f]{10}$', description: 'Only when this is a record already in the queue or manifest. Null for anything new: GitHub assigns the id, the sender never invents one.' },
          title: { type: 'string', minLength: 8 },
          sourceType: { enum: SOURCE_TYPES },
          originalUrl: { type: 'string', format: 'uri', description: 'The primary source itself: the journal page, the DOI link, the regulator\'s own page. Not a news article about it, unless sourceType is news-report.' },
          otherUrls: { type: 'array', items: { type: 'string', format: 'uri' } },
          doi: { type: ['string', 'null'] },
          pmid: { type: ['string', 'null'] },
          publisher: { type: ['string', 'null'], description: 'The journal or the publishing body.' },
          authors: { type: ['string', 'null'] },
          publicationDate: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'The date the source itself was published, YYYY-MM-DD. Not the date it was found.' },
          summary: { type: ['string', 'null'] },
          candidateClaims: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['claim'],
              properties: {
                claim: { type: 'string', minLength: 10 },
                figure: { type: ['string', 'null'], description: 'Any number the claim rests on, exactly as the source gives it.' },
                whereInSource: { type: ['string', 'null'], description: 'Abstract, page number, section heading, or the URL of the passage.' },
              },
            },
          },
          limitations: { type: 'array', minItems: 1, items: { type: 'string', minLength: 5 }, description: 'What the source cannot show. If the sender can think of none, it has not looked.' },
          whyItMatters: { type: ['string', 'null'] },
          ukRelevance: { type: ['string', 'null'] },
          suggestedFormats: { type: 'array', items: { enum: FORMATS } },
        },
      },
    },
  },
}

// ---------------------------------------------------------------------------
// Reading what Drive returns
// ---------------------------------------------------------------------------

/**
 * Find the JSON in whatever arrived. A raw .json file parses as it is. A
 * markdown file or a Google Doc carries it in a code fence, or bare, with
 * Drive's markdown escapes on top. Returns { ok, value, how, error }.
 */
export function extractJson(text) {
  const raw = String(text || '').replace(/^﻿/, '')
  const attempts = []
  attempts.push(['as sent', raw.trim()])
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) attempts.push(['from a code fence', fence[1].trim()])
  const clean = unmangle(raw)
  const cfence = clean.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (cfence) attempts.push(['from a code fence, after undoing Drive escapes', cfence[1].trim()])
  const first = clean.indexOf('{'); const last = clean.lastIndexOf('}')
  if (first >= 0 && last > first) attempts.push(['from the first brace to the last, after undoing Drive escapes', clean.slice(first, last + 1)])
  let lastError = 'no JSON object found'
  for (const [how, body] of attempts) {
    if (!body.startsWith('{')) continue
    // Smart quotes are what a word processor does to a pasted JSON document.
    for (const candidate of [body, body.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")]) {
      try { return { ok: true, value: JSON.parse(candidate), how } } catch (e) { lastError = e.message }
    }
  }
  return { ok: false, value: null, how: null, error: lastError }
}

const isUrl = (s) => { try { const u = new URL(String(s)); return u.protocol === 'https:' || u.protocol === 'http:' } catch { return false } }
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')) && !Number.isNaN(Date.parse(s))

/**
 * Validate a batch against the contract. Hand written rather than a schema
 * library, because the repository carries no validator dependency and the
 * reasons have to be sentences Justin and ChatGPT can act on.
 * Returns { ok, errors, candidates: [{ index, candidateId, errors, warnings }] }.
 */
export function validateBatch(batch) {
  const errors = []
  const out = { ok: false, errors, candidates: [] }
  if (!batch || typeof batch !== 'object' || Array.isArray(batch)) { errors.push('the document is not a JSON object'); return out }
  if (batch.schema !== SCHEMA_ID) errors.push(`schema is ${JSON.stringify(batch.schema)}, expected "${SCHEMA_ID}". A document in another shape is not read as candidates.`)
  if (typeof batch.batchId !== 'string' || batch.batchId.length < 6) errors.push('batchId is missing or too short')
  if (!batch.createdAt || Number.isNaN(Date.parse(batch.createdAt))) errors.push('createdAt is missing or is not a date')
  if (typeof batch.createdBy !== 'string' || !batch.createdBy.trim()) errors.push('createdBy is missing: the document must say who wrote it')
  if (!Array.isArray(batch.candidates)) { errors.push('candidates is not a list'); return out }
  if (batch.candidates.length > 12) errors.push(`${batch.candidates.length} candidates in one batch. The limit is 12: a longer list has not been chosen, it has been dumped.`)

  const seen = new Set()
  batch.candidates.forEach((c, index) => {
    const e = []; const w = []
    if (!c || typeof c !== 'object') { out.candidates.push({ index, candidateId: null, errors: ['not an object'], warnings: [] }); return }
    if (typeof c.candidateId !== 'string' || c.candidateId.length < 4) e.push('candidateId is missing')
    else if (seen.has(c.candidateId)) e.push(`candidateId ${c.candidateId} appears twice in this batch`)
    else seen.add(c.candidateId)
    if (c.researchId != null && !/^GDC-RR-[0-9a-f]{10}$/.test(String(c.researchId))) e.push(`researchId ${c.researchId} is not a register id. Leave it null for anything new: GitHub assigns it.`)
    if (c.researchId && !reg.get(c.researchId)) e.push(`researchId ${c.researchId} is not in the research register. An id cannot be invented by the sender.`)
    if (typeof c.title !== 'string' || c.title.trim().length < 8) e.push('title is missing')
    if (!SOURCE_TYPES.includes(c.sourceType)) e.push(`sourceType must be one of ${SOURCE_TYPES.join(', ')}`)
    if (!isUrl(c.originalUrl)) e.push('originalUrl is missing or is not a link. A candidate with no primary source cannot be checked.')
    if (!isDate(c.publicationDate)) e.push('publicationDate is missing or is not YYYY-MM-DD. It is the date the source was published, not the date it was found.')
    else if (Date.parse(c.publicationDate) > Date.now() + 2 * 86400000) e.push(`publicationDate ${c.publicationDate} is in the future`)
    for (const u of c.otherUrls || []) if (!isUrl(u)) w.push(`otherUrls carries something that is not a link: ${String(u).slice(0, 60)}`)
    if (!Array.isArray(c.candidateClaims) || !c.candidateClaims.length) e.push('candidateClaims is empty. Say what the source is believed to show, so it can be checked.')
    else c.candidateClaims.forEach((k, i) => { if (!k || typeof k.claim !== 'string' || k.claim.trim().length < 10) e.push(`claim ${i + 1} has no wording`) })
    if (!Array.isArray(c.limitations) || !c.limitations.length) e.push('limitations is empty. A candidate with no stated limits has not been read critically.')
    for (const f of c.suggestedFormats || []) if (!FORMATS.includes(f)) w.push(`suggestedFormats carries "${f}", which is not one of ${FORMATS.join(', ')}`)
    if (c.sourceType === 'news-report') w.push('a news report is a pointer, not a source. The review will look for the primary document behind it.')
    out.candidates.push({ index, candidateId: c.candidateId || null, errors: e, warnings: w })
  })
  out.ok = errors.length === 0
  return out
}

// ---------------------------------------------------------------------------
// Deduplication
// ---------------------------------------------------------------------------

const doiOf = (c) => {
  const fromField = c.doi ? String(c.doi) : (String(c.originalUrl || '').match(/doi\.org\/(10\.\d{4,9}\/\S+)/i) || [])[1]
  return fromField ? fromField.toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '').replace(/[.,;)]+$/, '') : null
}

/** The register record a candidate would become, before any check runs. */
export function candidateToRecord(c, batch = {}) {
  const official = ['official-document', 'regulator-statement'].includes(c.sourceType)
  const rec = {
    title: String(c.title).trim(),
    doi: doiOf(c),
    pmid: c.pmid ? String(c.pmid) : null,
    url: c.originalUrl,
    journal: c.publisher || null,
    published: c.publicationDate,
    authors: c.authors || null,
    // The sender's summary stands in for an abstract so the scorer has text
    // to read. It is the sender's wording, and the dossier says so.
    abstract: [c.summary, ...(c.candidateClaims || []).map((k) => k.claim)].filter(Boolean).join(' '),
    isPreprint: c.sourceType === 'preprint',
    peerReviewed: c.sourceType === 'journal-article' ? null : false,
    isOfficial: official,
    streams: ['inbox'],
    foundBy: ['chatgpt-inbox'],
    status: 'DISCOVERED',
    candidate: {
      candidateId: c.candidateId,
      batchId: batch.batchId || null,
      sentBy: batch.createdBy || null,
      sentAt: batch.createdAt || null,
      sourceType: c.sourceType,
      otherUrls: c.otherUrls || [],
      claims: c.candidateClaims || [],
      limitations: c.limitations || [],
      whyItMatters: c.whyItMatters || null,
      ukRelevance: c.ukRelevance || null,
      suggestedFormats: c.suggestedFormats || [],
      standing: 'UNVERIFIED. These are the sender\'s claims about the source. None may be quoted until the directed review has checked it against the source itself.',
    },
  }
  for (const k of ['doi', 'pmid']) if (!rec[k]) delete rec[k]
  return rec
}

/**
 * Has this already been found, written or published?
 * Returns { duplicate, where, of, reason }. `where` is one of
 * RESEARCH REGISTER, POST REGISTER, PUBLISHED OR ARCHIVED POST, POSTING PACK.
 */
export function dedupe(c, { postingPackText = '', postRegisterPath = POST_REGISTER, corpus = null } = {}) {
  const rec = candidateToRecord(c)
  const idx = reg.load()
  // 1. The research register, by its own identity keys.
  for (const k of reg.dedupKeys(rec)) {
    if (idx.keys[k]) {
      const held = idx.heads[idx.keys[k]]
      return { duplicate: true, where: 'RESEARCH REGISTER', of: held.studyId, reason: `already held as ${held.studyId}, status ${held.status}, matched on ${k.split(':')[0]}` }
    }
  }
  const doi = rec.doi
  const urlKey = (() => { try { const u = new URL(rec.url); return (u.hostname + u.pathname).replace(/\/$/, '').toLowerCase() } catch { return null } })()
  const mentions = (text) => {
    const t = String(text || '').toLowerCase()
    if (doi && t.includes(doi)) return `the DOI ${doi}`
    if (urlKey && urlKey.length > 18 && t.includes(urlKey)) return 'the source link'
    return null
  }
  // 2. The post register: a number already claimed for this source or title.
  let rows = []
  try { rows = parsePostRegister(postRegisterPath) } catch { /* reported by preflight, not here */ }
  for (const r of rows) {
    const hit = mentions(`${r.title} ${r.state} ${r.where}`)
    const sim = similarity(rec.title, r.title)
    if (hit || sim >= 0.6) return { duplicate: true, where: 'POST REGISTER', of: `GDC-${r.number}`, reason: hit ? `GDC-${r.number} already cites ${hit}` : `the title is ${Math.round(sim * 100)} percent the same as GDC-${r.number}, "${r.title}"` }
  }
  // 3. What has been written or published before.
  for (const p of corpus || existingCorpus()) {
    const hit = mentions(`${p.title} ${p.body}`)
    if (hit) return { duplicate: true, where: 'PUBLISHED OR ARCHIVED POST', of: p.id, reason: `${p.id} already cites ${hit}` }
  }
  // 4. ChatGPT's own posting pack, when the run has its text.
  const packHit = mentions(postingPackText)
  if (packHit) return { duplicate: true, where: 'POSTING PACK', of: 'the LinkedIn posting pack in Drive', reason: `the posting pack already cites ${packHit}` }
  return { duplicate: false, where: null, of: null, reason: 'not found in the research register, the post register, earlier posts or the posting pack' }
}

// ---------------------------------------------------------------------------
// The ledger, and ingest
// ---------------------------------------------------------------------------

export function loadLedger() {
  if (!existsSync(LEDGER())) return { schemaVersion: '1.0.0', batches: {}, candidates: {} }
  return JSON.parse(readFileSync(LEDGER(), 'utf8'))
}
const saveLedger = (l) => writeFileSync(LEDGER(), JSON.stringify(l, null, 1))

/**
 * Ingest one inbox document. `text` is exactly what Drive returned.
 *
 * Returns { verdict, stage: 'INBOX', reasons, batchId, digest, results }.
 * PASS means the document was read and every candidate has an outcome, even
 * if that outcome is DUPLICATE or HELD. HOLD means the document itself could
 * not be read as a batch, and nothing in the register changed.
 *
 * Per candidate outcomes:
 *   INGESTED          a new register record, DISCOVERED
 *   DUPLICATE         already held, written or published. The existing
 *                     record is noted, nothing new is created.
 *   HELD              failed validation. The reasons go back to the sender.
 *   ALREADY INGESTED  this exact document was read on an earlier run.
 */
export function ingestBatch(text, { source = {}, postingPackText = '', actor = 'radar:inbox', corpus = null, postRegisterPath = POST_REGISTER } = {}) {
  const digest = sha256(String(text || ''))
  const ledger = loadLedger()
  const prior = ledger.batches[digest]
  if (prior) {
    return { verdict: 'PASS', stage: 'INBOX', reasons: [], batchId: prior.batchId, digest, alreadyIngested: true,
      results: prior.results.map((r) => ({ ...r, outcome: 'ALREADY INGESTED', firstOutcome: r.outcome })) }
  }
  const parsed = extractJson(text)
  if (!parsed.ok) return { verdict: 'HOLD', stage: 'INBOX', reasons: [`the document could not be read as JSON: ${parsed.error}`], batchId: null, digest, results: [] }
  const batch = parsed.value
  const v = validateBatch(batch)
  if (!v.ok) return { verdict: 'HOLD', stage: 'INBOX', reasons: v.errors, batchId: batch.batchId || null, digest, results: [] }

  // The same batchId with different bytes is a revised document. It is read,
  // and candidates already dealt with are recognised by their own id below.
  const results = []
  batch.candidates.forEach((c, i) => {
    const check = v.candidates[i]
    const key = `${batch.batchId}/${c?.candidateId || i}`
    const known = ledger.candidates[key]
    if (known) { results.push({ ...known, outcome: 'ALREADY INGESTED', firstOutcome: known.outcome }); return }
    let r
    if (check.errors.length) {
      r = { candidateId: check.candidateId, title: c?.title || null, outcome: 'HELD', researchId: null, reasons: check.errors, warnings: check.warnings }
    } else {
      const d = dedupe(c, { postingPackText, corpus, postRegisterPath })
      if (d.duplicate) {
        r = { candidateId: c.candidateId, title: c.title, outcome: 'DUPLICATE', researchId: d.where === 'RESEARCH REGISTER' ? d.of : null, duplicateOf: d.of, where: d.where, reasons: [d.reason], warnings: check.warnings }
        // Note on the existing record that it was sent again, so a story the
        // sender keeps raising is visible. No status changes.
        if (d.where === 'RESEARCH REGISTER') {
          const held = reg.get(d.of)
          const refs = [...(held.candidateRefs || []), { candidateId: c.candidateId, batchId: batch.batchId, sentBy: batch.createdBy, at: batch.createdAt }]
          reg.upsert({ ...held, candidateRefs: refs }, { reason: `sent again through the inbox as ${c.candidateId}, already held`, actor })
        }
      } else {
        const rec = candidateToRecord(c, batch)
        const sc = score(rec)
        const res = reg.upsert({ ...rec, relevanceScore: sc.score, relevanceBand: sc.band, relevanceParts: sc.parts, childIsTheSubject: sc.childIsTheSubject },
          { reason: `candidate ${c.candidateId} from ${batch.createdBy}, batch ${batch.batchId}`, actor })
        r = { candidateId: c.candidateId, title: c.title, outcome: 'INGESTED', researchId: res.id, band: sc.band, score: sc.score, reasons: [], warnings: check.warnings }
      }
    }
    ledger.candidates[key] = { ...r, batchId: batch.batchId, at: new Date().toISOString() }
    results.push(r)
  })

  ledger.batches[digest] = { batchId: batch.batchId, createdBy: batch.createdBy, createdAt: batch.createdAt, readAs: parsed.how,
    driveFileId: source.fileId || null, driveTitle: source.title || null, ingestedAt: new Date().toISOString(), results }
  saveLedger(ledger)
  return { verdict: 'PASS', stage: 'INBOX', reasons: [], batchId: batch.batchId, digest, readAs: parsed.how, results }
}

/** What happened to a batch, in words, for the start here document and the log. */
export function receipt(result) {
  const L = []
  if (result.verdict !== 'PASS') { L.push(`NOT READ. ${result.reasons.join(' ')}`); return L.join('\n') }
  L.push(`Batch ${result.batchId}${result.alreadyIngested ? ', read on an earlier run, nothing changed' : ''}:`)
  if (!result.results.length) L.push('  no candidates in it')
  for (const r of result.results) {
    const o = r.outcome === 'ALREADY INGESTED' ? `${r.firstOutcome}, earlier` : r.outcome
    const tail = r.outcome === 'INGESTED' || r.firstOutcome === 'INGESTED' ? `now ${r.researchId}, waiting for the evidence check`
      : (r.reasons || []).join(' ')
    L.push(`  ${r.candidateId}: ${o}. ${tail}`)
  }
  return L.join('\n')
}

/** The last few batches, for the start here document. */
export function recentReceipts(n = 3) {
  const l = loadLedger()
  return Object.values(l.batches).sort((a, b) => String(b.ingestedAt).localeCompare(String(a.ingestedAt))).slice(0, n)
}

/** An example batch, for the inbox read me. Not a real finding. */
export function exampleBatch() {
  return {
    schema: SCHEMA_ID,
    batchId: 'YYYY-MM-DD-chatgpt-0800',
    createdAt: 'YYYY-MM-DDT08:00:00Z',
    createdBy: 'chatgpt-scheduled-0800',
    candidates: [{
      candidateId: 'C-YYYY-MM-DD-01',
      researchId: null,
      title: 'The exact title of the paper or document',
      sourceType: 'journal-article',
      originalUrl: 'https://doi.org/10.xxxx/xxxxx',
      otherUrls: [],
      doi: '10.xxxx/xxxxx',
      pmid: null,
      publisher: 'The journal or the publishing body',
      authors: 'Surname A, Surname B',
      publicationDate: 'YYYY-MM-DD',
      summary: 'Two or three plain sentences on what was done and found.',
      candidateClaims: [{ claim: 'One thing the source is believed to show, in a full sentence.', figure: 'the number exactly as the source gives it, or null', whereInSource: 'abstract' }],
      limitations: ['One thing this source cannot show.'],
      whyItMatters: 'Why a parent or a head would care.',
      ukRelevance: 'Where the data is from, and whether it carries to the UK.',
      suggestedFormats: ['linkedin'],
    }],
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , cmd, a, ...rest] = process.argv
  const flag = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : null }
  if (cmd === 'schema') console.log(JSON.stringify(CANDIDATE_SCHEMA, null, 1))
  else if (cmd === 'example') console.log(JSON.stringify(exampleBatch(), null, 1))
  else if (cmd === 'validate' && a) {
    const p = extractJson(readFileSync(a, 'utf8'))
    if (!p.ok) { console.log(`HOLD  cannot be read as JSON: ${p.error}`); process.exitCode = 1 } else {
      const v = validateBatch(p.value)
      console.log(`${v.ok && v.candidates.every((c) => !c.errors.length) ? 'PASS' : 'HOLD'}  read ${p.how}`)
      for (const e of v.errors) console.log(`  ${e}`)
      for (const c of v.candidates) for (const e of c.errors) console.log(`  ${c.candidateId || `candidate ${c.index + 1}`}: ${e}`)
      if (!v.ok || v.candidates.some((c) => c.errors.length)) process.exitCode = 1
    }
  } else if (cmd === 'ingest' && a) {
    const pp = flag('--posting-pack')
    const r = ingestBatch(readFileSync(a, 'utf8'), { source: { fileId: flag('--file-id'), title: flag('--title') }, postingPackText: pp && existsSync(pp) ? readFileSync(pp, 'utf8') : '' })
    console.log(`${r.verdict}  INBOX`)
    console.log(receipt(r))
    process.exitCode = r.verdict === 'PASS' ? 0 : 1
  } else {
    console.log('usage:')
    console.log('  node scripts/radar/candidates.mjs schema                     the JSON schema')
    console.log('  node scripts/radar/candidates.mjs example                    an empty batch to fill in')
    console.log('  node scripts/radar/candidates.mjs validate <file>')
    console.log('  node scripts/radar/candidates.mjs ingest <file> [--file-id <driveId>] [--title "<drive title>"] [--posting-pack <file>]')
  }
}
