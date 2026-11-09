// Stage 1a, discovery. Runs the 24 streams across the working sources, dedupes
// what comes back, and writes every survivor into the register as DISCOVERED.
//
// Concurrency here is a worker pool over a queue of (stream, source) jobs. It
// is not 24 agents and the output says so.
//
// Usage:
//   node scripts/radar/discover.mjs                  last 72 hours
//   node scripts/radar/discover.mjs --days 7         widen the window
//   node scripts/radar/discover.mjs --streams 04,11  just those streams
//   node scripts/radar/discover.mjs --budget 150     cap the requests

import * as S from './sources.mjs'
import { STREAMS, EXCLUDE } from './streams.mjs'
import * as reg from './register.mjs'
import { score } from './score.mjs'

const arg = (name, fallback) => {
  const i = process.argv.indexOf('--' + name)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const iso = (d) => d.toISOString().slice(0, 10)

// Relevance gate. A source query can only be so precise, so this is the second
// filter: the record has to be about children AND about something digital.
// Without it, stream 07 returns every paper on childhood obesity.
const CHILD_RE = /\b(child|children|childhood|adolescen|teen|youth|pupil|infant|toddler|preschool|young people|minors?)\b/i
const DIGITAL_RE = /\b(screen|smartphone|phone|social media|digital|online|internet|tablet|gaming|video game|algorithm|chatbot|artificial intelligence|\bAI\b|tiktok|instagram|youtube|snapchat|device|cyber|media use)\b/i

/**
 * Four gates, and the reason each one exists is in the comment above it.
 * Returns null if the record passes, or a short string naming the gate that
 * rejected it, so a run can report WHY it dropped 171 of 194 hits rather than
 * just that it did.
 */
function reject(r, stream) {
  const t = `${r.title} ${r.abstract || ''}`

  // 1. About children, and about something digital. Without this, stream 07
  //    returns every paper on childhood obesity.
  if (!CHILD_RE.test(t)) return 'not about children'
  if (!DIGITAL_RE.test(t)) return 'nothing digital'

  // 2. On topic for AT LEAST ONE stream, not necessarily the one that found it.
  //    Judging a study by its finder was wrong and the first live run showed
  //    why: a meta-analysis of social media and adolescent mental health was
  //    found by stream 24 and rejected, when it plainly belongs to 02 and 03.
  //    A study serves every stream whose subject it matches, so the gate is
  //    "does any stream want this", and the record is then tagged with all of
  //    them rather than with whichever query happened to surface it.
  const wanted = STREAMS.filter((s) => s.must.test(t)).map((s) => s.id)
  if (!wanted.length) return 'no stream subject matches'
  r.streamsMatched = wanted

  // 3. Technology used ON a child in a clinic is not a child using technology.
  //    An official government publication is exempt: a DfE paper about school
  //    policy can legitimately mention any of these words.
  if (!r.isOfficial && EXCLUDE.test(t)) return 'clinical or laboratory use'

  // 4. A full date, or the finding cannot be placed in the window. A record
  //    dated only "2026" would be reported as new every single day.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(r.published || ''))) return 'no full publication date'

  return null
}

async function runJob(job, since, until, budget) {
  const { stream, source } = job
  try {
    switch (source) {
      case 'europepmc': return await S.europepmc(stream.q, since, until)
      case 'pubmed': return await S.pubmed(stream.q.replace(/FIRST_PDATE[^)]*\)/g, '').trim(), since, until)
      // Crossref has no boolean syntax, so flattening the stream query turned
      // it into a bag of words and stream 04 came back with papers about
      // political participation. Instead we send the stream's own quoted
      // phrases, which is what Crossref's bibliographic search handles well.
      case 'crossref': {
        const phrases = (stream.q.match(/"[^"]+"/g) || []).map((s) => s.replace(/"/g, ''))
        const q = ['children', ...phrases.slice(0, 4)].join(' ')
        return await S.crossref(q, since, until)
      }
      case 'doaj': {
        const phrases = (stream.q.match(/"[^"]+"/g) || []).map((s) => s.replace(/"/g, ''))
        return await S.doaj(['children', ...phrases.slice(0, 3)].join(' '))
      }
      case 'govuk': return stream.gov ? await S.govuk(stream.gov) : { ok: true, source: 'govuk', records: [] }
      default: return { ok: false, source, records: [], error: 'unknown source' }
    }
  } catch (e) {
    return { ok: false, source, records: [], error: String(e.message || e) }
  }
}

async function pool(jobs, worker, size = 4) {
  const out = []
  let i = 0
  await Promise.all(Array.from({ length: size }, async () => {
    for (;;) {
      const n = i++
      if (n >= jobs.length) return
      out[n] = await worker(jobs[n])
    }
  }))
  return out
}

export async function discover({ days = 3, streamIds = null, budget = 400, concurrency = 4 } = {}) {
  const until = iso(new Date())
  const since = iso(new Date(Date.now() - days * 86400000))

  const picked = streamIds ? STREAMS.filter((s) => streamIds.includes(s.id)) : STREAMS
  const litSources = ['europepmc', 'pubmed', 'crossref']
  const jobs = []
  for (const stream of picked) {
    for (const source of litSources) jobs.push({ stream, source })
    if (stream.gov) jobs.push({ stream, source: 'govuk' })
  }

  const started = Date.now()
  const results = await pool(jobs, (j) => runJob(j, since, until, budget), concurrency)

  // medRxiv is one call for the whole window, not one per stream.
  const pre = await S.medrxiv(since, until)

  const failures = []
  const seen = new Map()   // dedup key -> record we are keeping
  let rawCount = 0
  const dropped = {}

  const take = (recs, streamId, stream) => {
    for (const r of recs) {
      rawCount += 1
      const why = reject(r, stream)
      if (why) { dropped[why] = (dropped[why] || 0) + 1; continue }
      const keys = reg.dedupKeys(r)
      let hit = null
      for (const k of keys) if (seen.has(k)) { hit = seen.get(k); break }
      if (hit) {
        // Same study from a second source. Keep the richer record and record
        // both the streams that found it and both sources.
        hit.streams = [...new Set([...(hit.streams || []), ...(r.streamsMatched || [streamId])])]
        hit.foundBy = [...new Set([...(hit.foundBy || []), r.source])]
        if ((r.abstract || '').length > (hit.abstract || '').length) hit.abstract = r.abstract
        if (!hit.doi && r.doi) hit.doi = r.doi
        if (!hit.pmid && r.pmid) hit.pmid = r.pmid
        if (r.grants?.length && !hit.grants?.length) hit.grants = r.grants
        for (const k of reg.dedupKeys(hit)) seen.set(k, hit)
        continue
      }
      const rec = { ...r, streams: r.streamsMatched || [streamId], foundBy: [r.source], foundByStream: streamId }
      for (const k of keys) seen.set(k, rec)
    }
  }

  results.forEach((res, n) => {
    const { stream, source } = jobs[n]
    if (!res || !res.ok) { failures.push({ stream: stream.id, source, status: res?.status, error: res?.error }); return }
    take(res.records, stream.id, stream)
  })
  if (pre.ok) {
    // Preprints are matched to streams by keyword, since one call covers all.
    for (const r of pre.records) {
      const hay = `${r.title} ${r.abstract}`.toLowerCase()
      const matched = STREAMS.filter((s) => {
        const terms = s.q.toLowerCase().match(/"[^"]+"|[a-z]{5,}\*?/g) || []
        return terms.filter((t) => hay.includes(t.replace(/[*"]/g, ''))).length >= 2
      }).map((s) => s.id)
      const st = STREAMS.find((s) => s.id === matched[0])
      take([r], matched[0] || '24', st)
    }
  } else failures.push({ stream: 'all', source: 'medrxiv', error: pre.error })

  const unique = [...new Set(seen.values())]

  // Write them in. upsert is what makes a rerun cheap and safe.
  let created = 0; let updated = 0; let unchanged = 0
  for (const r of unique) {
    const { title, doi, pmid, pmcid, url, journal, published, authors, abstract,
            isPreprint, peerReviewed, pubTypes, grants, citedBy, openAccess, streams, foundBy } = r
    const sc = score(r)
    const res = reg.upsert({
      title, doi, pmid, pmcid, url, journal, published, authors, abstract,
      isPreprint, peerReviewed, pubTypes, grants, citedBy, openAccess,
      streams, foundBy, status: 'DISCOVERED',
      relevanceScore: sc.score, relevanceBand: sc.band, relevanceParts: sc.parts,
      windowSearched: { since, until },
    }, { reason: `discovery run, streams ${streams.join(',')}`, actor: 'radar:discover' })
    if (res.action === 'created') created += 1
    else if (res.action === 'updated') updated += 1
    else unchanged += 1
  }

  return {
    window: { since, until, days },
    streamsRun: picked.length,
    jobs: jobs.length,
    requests: S.budget(),
    seconds: Math.round((Date.now() - started) / 1000),
    raw: rawCount,
    dropped,
    unique: unique.length,
    created, updated, unchanged,
    bands: unique.reduce((a, r) => { const b = score(r).band; a[b] = (a[b] || 0) + 1; return a }, {}),
    failures,
    blockedSources: S.BLOCKED_SOURCES.map((b) => b.host),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const days = Number(arg('days', 3))
  const streamIds = arg('streams', null)?.split(',').map((s) => s.trim())
  const budget = Number(arg('budget', 400))
  discover({ days, streamIds, budget }).then((r) => {
    console.log(`\nRADAR DISCOVERY  ${r.window.since} to ${r.window.until}  (${r.window.days} days)`)
    console.log(`${r.streamsRun} streams, ${r.jobs} stream/source jobs, ${r.requests} HTTP requests, ${r.seconds}s`)
    const totalDropped = Object.values(r.dropped).reduce((a, b) => a + b, 0)
    console.log(`${r.raw} raw hits, ${totalDropped} rejected, ${r.unique} unique studies kept`)
    for (const [why, n] of Object.entries(r.dropped).sort((a, b) => b[1] - a[1])) console.log(`    ${String(n).padStart(4)}  ${why}`)
    console.log(`register: ${r.created} new, ${r.updated} updated, ${r.unchanged} unchanged`)
    console.log(`relevance: ${Object.entries(r.bands).map(([b, n]) => `${n} ${b}`).join(', ')}`)
    if (r.failures.length) {
      console.log(`\n${r.failures.length} source failures (the run carried on without them):`)
      const byS = {}
      for (const f of r.failures) byS[f.source] = (byS[f.source] || 0) + 1
      for (const [s, n] of Object.entries(byS)) console.log(`  ${s}: ${n}`)
    }
    console.log(`\nnot searched, blocked from this container: ${r.blockedSources.join(', ')}`)
  })
}
