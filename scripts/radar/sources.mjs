// The Research Radar's source layer.
//
// Every source in here was probed from this container on 9 November 2026 and
// returned real data. Nothing is listed on the strength of its documentation.
// The probe results, including the failures, are in PROBE.md next to this file,
// because the useful half of that exercise was learning what does NOT work.
//
// Rules this layer enforces so the streams above it do not have to:
//   - one in flight request per host, with a minimum gap between them
//   - retry on 429 and 5xx with exponential backoff, never on a 4xx that means
//     the request itself was wrong
//   - an on disk cache, so a rerun of a stream costs nothing and a crash half
//     way through does not re fetch everything
//   - a hard cap on total requests per run, so a bad query cannot spend an hour

import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Crossref, PubMed and OpenAlex all ask automated clients for a contact
// address, and reward one with a higher rate limit. It must NOT be a personal
// address: this header goes to every index on every request, and an individual's
// email is not ours to hand to five external services.
//
// Found on 10 November: the first version of this file put a personal address
// in here and in the Crossref mailto. That was wrong and is now a config value,
// empty by default. Set RADAR_CONTACT to a shared inbox (research@ or similar)
// and the polite pools switch on; leave it unset and the radar still works, in
// the public pool, with nobody's address leaving the container.
export const CONTACT = process.env.RADAR_CONTACT || ''

const UA = `GuidedChildhoodResearchRadar/1.0 (+https://guidedchildhood.com${CONTACT ? `; mailto:${CONTACT}` : ''})`

/** `&mailto=` for the indexes that take one, or nothing at all. */
export function mailtoParam(sep = '&') {
  return CONTACT ? `${sep}mailto=${encodeURIComponent(CONTACT)}` : ''
}

export const CACHE_DIR = process.env.RADAR_CACHE || '/tmp/radar-cache'

// Minimum milliseconds between requests to the same host. PubMed asks for no
// more than three a second without a key, so 350 is inside its rule.
const HOST_GAP = {
  'eutils.ncbi.nlm.nih.gov': 350,
  'api.crossref.org': 250,
  'www.ebi.ac.uk': 250,
  'doaj.org': 500,
  'api.biorxiv.org': 500,
  'api.osf.io': 500,
  'api.reporter.nih.gov': 500,
  'www.gov.uk': 300,
  'data.gov.uk': 300,
  'members-api.parliament.uk': 300,
  'ghoapi.azureedge.net': 300,
  'data.cdc.gov': 300,
  'data.europa.eu': 400,
  'sdmx.data.unicef.org': 400,
  'export.arxiv.org': 1000,
  default: 300,
}

const lastHit = new Map()
const inflight = new Map()
let budgetUsed = 0

export function budget() {
  return budgetUsed
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function cachePath(url) {
  mkdirSync(CACHE_DIR, { recursive: true })
  return join(CACHE_DIR, createHash('sha1').update(url).digest('hex') + '.json')
}

/**
 * Fetch with the manners above. Returns { ok, status, body, fromCache, url }.
 * Never throws for a network or status problem: a stream that loses one source
 * should carry on with the rest and the run should say what it lost.
 */
export async function get(url, { maxRequests = 400, ttlHours = 12, timeoutMs = 25000, retries = 3 } = {}) {
  const p = cachePath(url)
  if (existsSync(p)) {
    try {
      const c = JSON.parse(readFileSync(p, 'utf8'))
      if (Date.now() - c.at < ttlHours * 3600_000) return { ...c, fromCache: true, url }
    } catch { /* a corrupt cache entry is just a miss */ }
  }

  if (budgetUsed >= maxRequests) {
    return { ok: false, status: 0, body: '', error: 'request budget spent', url }
  }

  const host = new URL(url).hostname
  // Serialise per host so the gap below is a real gap, not a race.
  while (inflight.get(host)) await sleep(50)
  inflight.set(host, true)
  try {
    const gap = HOST_GAP[host] ?? HOST_GAP.default
    const since = Date.now() - (lastHit.get(host) || 0)
    if (since < gap) await sleep(gap - since)

    let attempt = 0
    for (;;) {
      attempt += 1
      budgetUsed += 1
      lastHit.set(host, Date.now())
      let status = 0
      let body = ''
      try {
        const ctl = new AbortController()
        const t = setTimeout(() => ctl.abort(), timeoutMs)
        const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json, text/xml, */*' }, signal: ctl.signal })
        clearTimeout(t)
        status = res.status
        body = await res.text()
      } catch (e) {
        status = 0
        body = ''
        if (attempt > retries) return { ok: false, status, body: '', error: String(e.message || e), url }
        await sleep(600 * 2 ** (attempt - 1))
        continue
      }

      const retryable = status === 429 || (status >= 500 && status < 600)
      if (retryable && attempt <= retries) {
        await sleep(800 * 2 ** (attempt - 1))
        continue
      }

      const out = { ok: status >= 200 && status < 300, status, body, at: Date.now() }
      if (out.ok) { try { writeFileSync(p, JSON.stringify(out)) } catch { /* cache is a nicety */ } }
      return { ...out, fromCache: false, url }
    }
  } finally {
    inflight.delete(host)
  }
}

export async function getJson(url, opts) {
  const r = await get(url, opts)
  if (!r.ok) return { ...r, json: null }
  try { return { ...r, json: JSON.parse(r.body) } } catch (e) { return { ...r, ok: false, json: null, error: 'bad JSON: ' + e.message } }
}

/**
 * Download a file to disk. Separate from get() on purpose: get() keeps bodies
 * as text in a JSON cache, which would quietly mangle a PDF. This writes the
 * bytes straight out and caches nothing, because the caller already has the
 * file afterwards.
 *
 * Added 10 November, when assets.publishing.service.gov.uk turned out to be
 * reachable. That is the host GOV.UK serves publication attachments from, so it
 * is how an Ofcom or ICO report that was commissioned through a department can
 * be read in full even though ofcom.org.uk and ico.org.uk are both blocked.
 */
export async function getFile(url, destPath, { maxRequests = 400, timeoutMs = 120000, maxBytes = 80 * 1024 * 1024 } = {}) {
  if (budgetUsed >= maxRequests) return { ok: false, status: 0, error: 'request budget spent', url }
  const host = new URL(url).hostname
  while (inflight.get(host)) await sleep(50)
  inflight.set(host, true)
  try {
    const gap = HOST_GAP[host] ?? HOST_GAP.default
    const since = Date.now() - (lastHit.get(host) || 0)
    if (since < gap) await sleep(gap - since)
    budgetUsed += 1
    lastHit.set(host, Date.now())
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), timeoutMs)
    let res
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' }, redirect: 'follow', signal: ctl.signal })
    } catch (e) {
      clearTimeout(t)
      return { ok: false, status: 0, error: String(e.message || e), url }
    }
    clearTimeout(t)
    if (!res.ok) return { ok: false, status: res.status, error: `HTTP ${res.status}`, url }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > maxBytes) return { ok: false, status: res.status, error: `file is ${buf.length} bytes, over the ${maxBytes} cap`, url }
    writeFileSync(destPath, buf)
    return { ok: true, status: res.status, path: destPath, bytes: buf.length, contentType: res.headers.get('content-type') || '', url }
  } finally {
    inflight.delete(host)
  }
}

/**
 * One GOV.UK publication, with its attachments. Takes the path the search API
 * returns, e.g. /government/publications/<slug>.
 */
export async function govukPublication(path) {
  const clean = String(path || '').replace(/^https?:\/\/www\.gov\.uk/, '').replace(/^\//, '')
  const { ok, json, status, error } = await getJson(`https://www.gov.uk/api/content/${clean}`)
  if (!ok) return { ok: false, status, error, publication: null }
  return {
    ok: true,
    publication: {
      title: (json.title || '').trim(),
      summary: (json.description || '').trim(),
      published: (json.first_published_at || json.public_updated_at || '').slice(0, 10),
      organisations: (json.links?.organisations || []).map((o) => o.title).filter(Boolean),
      url: `https://www.gov.uk/${clean}`,
      pdfs: (json.details?.attachments || [])
        .filter((a) => a.content_type === 'application/pdf' && a.url)
        .map((a) => ({ title: (a.title || '').trim(), url: a.url })),
    },
  }
}

// ---------------------------------------------------------------------------
// The sources. Each returns an array of raw records in a common shape.
// `since` and `until` are ISO dates. Every one of these was probed working.
// ---------------------------------------------------------------------------

const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim()

/** Europe PMC. The most useful single source: MEDLINE plus preprints plus
 *  grant and full text flags, with a real query language and no key. */
export async function europepmc(query, since, until, { pageSize = 25 } = {}) {
  const q = `(${query}) AND (FIRST_PDATE:[${since} TO ${until}])`
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}&format=json&pageSize=${pageSize}&resultType=core`
  const { ok, json, status, error } = await getJson(url)
  if (!ok || !json?.resultList) return { ok: false, source: 'europepmc', status, error, records: [] }
  const records = (json.resultList.result || []).map((r) => ({
    source: 'europepmc',
    title: clean(r.title),
    doi: (r.doi || '').toLowerCase() || null,
    pmid: r.pmid || null,
    pmcid: r.pmcid || null,
    url: r.doi ? `https://doi.org/${r.doi}` : (r.fullTextUrlList?.fullTextUrl?.[0]?.url || null),
    journal: clean(r.journalInfo?.journal?.title || r.bookOrReportDetails?.publisher || ''),
    published: r.firstPublicationDate || null,
    authors: clean(r.authorString),
    abstract: clean(r.abstractText || ''),
    isPreprint: String(r.pubType || '').toLowerCase().includes('preprint') || r.source === 'PPR',
    peerReviewed: r.source !== 'PPR',
    pubTypes: clean(r.pubTypeList?.pubType?.join('; ') || r.pubType || ''),
    grants: (r.grantsList?.grant || []).map((g) => clean(`${g.agency || ''} ${g.grantId || ''}`)).filter(Boolean),
    citedBy: r.citedByCount ?? null,
    openAccess: r.isOpenAccess === 'Y',
    raw: { id: r.id, source: r.source },
  }))
  return { ok: true, source: 'europepmc', records }
}

/** PubMed, for MeSH terms and publication types Europe PMC sometimes lacks. */
export async function pubmed(query, since, until, { retmax = 25 } = {}) {
  const term = `${query} AND ("${since}"[PDAT] : "${until}"[PDAT])`
  const s = await getJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(term)}&retmax=${retmax}&retmode=json&sort=date`)
  if (!s.ok) return { ok: false, source: 'pubmed', status: s.status, error: s.error, records: [] }
  const ids = s.json?.esearchresult?.idlist || []
  if (!ids.length) return { ok: true, source: 'pubmed', records: [] }
  const sum = await getJson(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`)
  if (!sum.ok) return { ok: false, source: 'pubmed', status: sum.status, error: sum.error, records: [] }
  const r = sum.json?.result || {}
  const records = ids.map((id) => r[id]).filter(Boolean).map((x) => ({
    source: 'pubmed',
    title: clean(x.title),
    doi: (x.articleids || []).find((a) => a.idtype === 'doi')?.value?.toLowerCase() || null,
    pmid: x.uid,
    url: `https://pubmed.ncbi.nlm.nih.gov/${x.uid}/`,
    journal: clean(x.fulljournalname || x.source),
    published: x.sortpubdate ? x.sortpubdate.slice(0, 10).replace(/\//g, '-') : (x.pubdate || null),
    authors: (x.authors || []).map((a) => a.name).join(', '),
    abstract: '',
    isPreprint: (x.pubtype || []).some((t) => /preprint/i.test(t)),
    peerReviewed: !(x.pubtype || []).some((t) => /preprint/i.test(t)),
    pubTypes: (x.pubtype || []).join('; '),
    grants: [],
    raw: { uid: x.uid },
  }))
  return { ok: true, source: 'pubmed', records }
}

/** Crossref, for the authoritative DOI record and the real online date. */
export async function crossref(query, since, until, { rows = 25 } = {}) {
  const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&filter=from-online-pub-date:${since},until-online-pub-date:${until}&rows=${rows}&sort=published&order=desc${mailtoParam()}`
  const { ok, json, status, error } = await getJson(url)
  if (!ok) return { ok: false, source: 'crossref', status, error, records: [] }
  const records = (json?.message?.items || []).map((w) => ({
    source: 'crossref',
    title: clean((w.title || [])[0] || ''),
    doi: (w.DOI || '').toLowerCase() || null,
    pmid: null,
    url: w.DOI ? `https://doi.org/${w.DOI}` : (w.URL || null),
    journal: clean((w['container-title'] || [])[0] || w.publisher || ''),
    published: (w.published?.['date-parts']?.[0] || []).map((n, i) => (i ? String(n).padStart(2, '0') : n)).join('-') || null,
    authors: (w.author || []).map((a) => clean(`${a.given || ''} ${a.family || ''}`)).filter(Boolean).join(', '),
    abstract: clean((w.abstract || '').replace(/<[^>]+>/g, '')),
    isPreprint: w.subtype === 'preprint' || w.type === 'posted-content',
    peerReviewed: !(w.subtype === 'preprint' || w.type === 'posted-content'),
    pubTypes: clean(w.type || ''),
    grants: (w.funder || []).map((f) => clean(f.name)).filter(Boolean),
    citedBy: w['is-referenced-by-count'] ?? null,
    raw: { type: w.type },
  }))
  return { ok: true, source: 'crossref', records }
}

/** medRxiv, so a preprint is seen as a preprint rather than missed. */
export async function medrxiv(since, until) {
  const out = []
  let cursor = 0
  for (let page = 0; page < 3; page += 1) {
    const { ok, json } = await getJson(`https://api.biorxiv.org/details/medrxiv/${since}/${until}/${cursor}`)
    if (!ok || !json?.collection?.length) break
    out.push(...json.collection)
    if (json.collection.length < 100) break
    cursor += 100
  }
  const records = out.map((r) => ({
    source: 'medrxiv',
    title: clean(r.title),
    doi: (r.doi || '').toLowerCase() || null,
    pmid: null,
    url: r.doi ? `https://doi.org/${r.doi}` : null,
    journal: 'medRxiv (preprint)',
    published: r.date || null,
    authors: clean(r.authors),
    abstract: clean(r.abstract || ''),
    isPreprint: true,
    peerReviewed: false,
    pubTypes: 'preprint',
    grants: [],
    raw: { category: r.category, version: r.version },
  }))
  return { ok: true, source: 'medrxiv', records }
}

/** gov.uk search, which reaches DfE, DHSC and anything Ofcom publishes there. */
export async function govuk(query, { count = 20 } = {}) {
  const url = `https://www.gov.uk/api/search.json?q=${encodeURIComponent(query)}&count=${count}&order=-public_timestamp&fields=title,link,public_timestamp,description,organisations,content_store_document_type`
  const { ok, json, status, error } = await getJson(url)
  if (!ok) return { ok: false, source: 'govuk', status, error, records: [] }
  const records = (json?.results || []).map((r) => ({
    source: 'govuk',
    title: clean(r.title),
    doi: null,
    pmid: null,
    url: r.link?.startsWith('http') ? r.link : `https://www.gov.uk${r.link}`,
    journal: clean((r.organisations || []).map((o) => o.title).join(', ') || 'GOV.UK'),
    published: (r.public_timestamp || '').slice(0, 10) || null,
    authors: clean((r.organisations || []).map((o) => o.title).join(', ')),
    abstract: clean(r.description || ''),
    isPreprint: false,
    peerReviewed: false,
    pubTypes: clean(r.content_store_document_type || 'government publication'),
    grants: [],
    isOfficial: true,
    raw: {},
  }))
  return { ok: true, source: 'govuk', records }
}

/** DOAJ, for open access journals the big indexes are slow to pick up. */
export async function doaj(query, { pageSize = 20 } = {}) {
  const url = `https://doaj.org/api/search/articles/${encodeURIComponent(query)}?pageSize=${pageSize}&sort=created_date:desc`
  const { ok, json, status, error } = await getJson(url)
  if (!ok) return { ok: false, source: 'doaj', status, error, records: [] }
  const records = (json?.results || []).map((r) => {
    const b = r.bibjson || {}
    return {
      source: 'doaj',
      title: clean(b.title),
      doi: (b.identifier || []).find((i) => i.type === 'doi')?.id?.toLowerCase() || null,
      pmid: (b.identifier || []).find((i) => i.type === 'pmid')?.id || null,
      url: (b.link || [])[0]?.url || null,
      journal: clean(b.journal?.title || ''),
      published: b.year ? `${b.year}-${String(b.month || 1).padStart(2, '0')}-01` : null,
      authors: (b.author || []).map((a) => clean(a.name)).filter(Boolean).join(', '),
      abstract: clean(b.abstract || ''),
      isPreprint: false,
      peerReviewed: true,
      pubTypes: 'journal article',
      grants: [],
      raw: {},
    }
  })
  return { ok: true, source: 'doaj', records }
}

export const WORKING_SOURCES = ['europepmc', 'pubmed', 'crossref', 'medrxiv', 'govuk', 'govuk-attachment', 'doaj']

// Probed on 9 November 2026 and NOT usable from this container. Kept here so a
// later run does not waste a budget rediscovering it, and so the brief can say
// what it could not see rather than implying it searched everything.
export const BLOCKED_SOURCES = [
  { host: 'api.openalex.org', status: 429, note: 'Insufficient budget on the shared proxy address. Retried at 20 second spacing, same answer. Crossref and Europe PMC cover the same records.' },
  { host: 'api.semanticscholar.org', status: 429, note: 'Rate limited without an API key. Would work with a key.' },
  { host: 'www.ofcom.org.uk', status: 403, note: 'Cloudflare bot challenge, across many sessions. Research Ofcom commissioned through a department is still read IN FULL through the govuk-attachment lane. Ofcom-only material needs the PDF in Drive.' },
  { host: 'ico.org.uk', status: 403, note: 'Cloudflare bot challenge. Same route out as Ofcom: ICO commissioned research on GOV.UK is read in full through the govuk-attachment lane.' },
  { host: 'www.cochranelibrary.com', status: 403, note: 'Cloudflare bot challenge. Cochrane reviews with a DOI are still found through Crossref and Europe PMC.' },
  { host: 'www.esafety.gov.au', status: 503, note: 'Cloudflare. Refused across five attempts in four sessions, and it is not on GOV.UK, so there is no route round it. Needs the PDF in Drive.' },
  // Tested on 10 November specifically to get round the four above. It does not
  // work, by any path: curl is reset at the egress every time and the fetch
  // tool refuses the host outright. So the archive is not a fallback and the
  // brief must not imply the radar can see these regulators.
  { host: 'web.archive.org', status: 0, note: 'Unreachable from this container by every path tried. Snapshots of the blocked regulators were confirmed to EXIST through archive.org/wayback/available, but cannot be fetched. Not a fallback.' },
  { host: 'sdmx.oecd.org', status: 406, note: 'Rejects every format value we tried for the dataflow endpoint. Not pursued: OECD indicators are rarely the primary source for a daily finding.' },
  { host: 'scholar.google.com', status: null, note: 'No API and scraping it is against its terms. Not attempted.' },
]
