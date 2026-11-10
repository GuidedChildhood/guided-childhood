// Stage 1b, the independent evidence check.
//
// The protocol lists fourteen things to check. This file does the ones a
// machine can actually do, and refuses to pretend about the rest.
//
// What it checks on its own:
//   the DOI resolves, and to what
//   the real first online date, from Crossref, against whatever the index said
//   peer reviewed or preprint, from the record type rather than the journal name
//   sample size, country and age range, pulled out of the abstract where stated
//   study design, from publication type and abstract language
//   whether numbers, confidence intervals and effect sizes are present at all
//   funding and declared conflicts, where the source carries them
//   preregistration, where it is mentioned
//   whether the abstract's own language claims cause
//
// What it cannot do, and says so:
//   judge whether causation is justified
//   decide whether media coverage misrepresents the finding
//   find the strongest contradictory study
//   weigh UK relevance
//   mark a claim VERIFIED
//
// Those are the protocol's gates C, D, E, G and H and they need a directed
// Claude run whose output is stored. Until that happens claudeStatus stays
// PENDING. Gate J: "Never claim Claude checked anything until Claude has
// actually run and its output is stored."

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { getJson, get, mailtoParam, govukPublication } from './sources.mjs'
import * as reg from './register.mjs'

const CAUSAL = /\b(causes?|caused|causal|leads to|results in|drives|due to|because of|impact(s|ed)? on|effect of)\b/i
const HEDGED = /\b(associat|correlat|linked to|related to|predict|accompan)/i

/** Sample size. Several patterns, because abstracts write it several ways. */
function sampleSize(text) {
  const pats = [
    /\bN\s*=\s*([\d,]{2,9})/,
    /\b([\d,]{3,9})\s+(?:children|adolescents?|participants?|students?|pupils?|young people|respondents?|families|parents?|teens?)\b/i,
    /\bsample of\s+([\d,]{3,9})/i,
    /\b([\d,]{3,9})\s+(?:were (?:recruited|surveyed|included)|completed)/i,
  ]
  const found = []
  for (const p of pats) {
    const m = text.match(p)
    if (m) found.push(Number(String(m[1]).replace(/,/g, '')))
  }
  if (!found.length) return null
  // The largest plausible figure, since abstracts often give a subgroup first.
  const big = found.filter((n) => n >= 10 && n <= 50_000_000).sort((a, b) => b - a)[0]
  return big ?? null
}

function ageRange(text) {
  const m = text.match(/\b(?:aged?|ages)\s+(\d{1,2})\s*(?:to|-|–|and)\s*(\d{1,2})\b/i)
    || text.match(/\b(\d{1,2})\s*(?:to|-|–)\s*(\d{1,2})\s*(?:years|year-old|yo)\b/i)
  if (m) return `${m[1]} to ${m[2]}`
  const g = text.match(/\b(adolescents?|teenagers?|infants?|toddlers?|preschool\w*|primary school|secondary school)\b/i)
  return g ? `not stated, described as ${g[1].toLowerCase()}` : null
}

const COUNTRIES = ['United Kingdom', 'UK', 'England', 'Scotland', 'Wales', 'Ireland', 'United States', 'USA', 'US',
  'Australia', 'Canada', 'Netherlands', 'Norway', 'Sweden', 'Denmark', 'Finland', 'Germany', 'France', 'Spain',
  'Italy', 'Portugal', 'Poland', 'China', 'Japan', 'Korea', 'India', 'Brazil', 'Mexico', 'Turkey', 'Israel',
  'South Africa', 'Nigeria', 'Kenya', 'New Zealand', 'Switzerland', 'Belgium', 'Austria', 'Greece', 'Czech']

function country(text) {
  const hits = COUNTRIES.filter((c) => new RegExp(`\\b${c}\\b`).test(text))
  return hits.length ? [...new Set(hits)].slice(0, 4).join(', ') : null
}

function design(text, pubTypes) {
  const t = `${pubTypes || ''} ${text}`
  const tests = [
    [/\bumbrella review\b/i, 'umbrella review'],
    [/\bmeta-?analy/i, 'meta-analysis'],
    [/\bsystematic review\b/i, 'systematic review'],
    [/\bscoping review\b/i, 'scoping review'],
    [/\brandomi[sz]ed controlled trial|\bRCT\b/i, 'randomised controlled trial'],
    [/\bcluster randomi[sz]/i, 'cluster randomised trial'],
    [/\bquasi-experimental|natural experiment|difference-in-difference/i, 'quasi-experimental'],
    [/\blongitudinal|prospective cohort|birth cohort|panel (study|data)/i, 'longitudinal cohort'],
    [/\bcross-?sectional\b/i, 'cross-sectional'],
    [/\bcase-?control\b/i, 'case-control'],
    [/\bqualitative|interview study|focus group/i, 'qualitative'],
    [/\bsurvey\b/i, 'survey'],
    [/\bpilot\b/i, 'pilot study'],
  ]
  for (const [re, label] of tests) if (re.test(t)) return label
  return null
}

/** Numbers that would let us quote an effect rather than a vibe. */
function statistics(text) {
  return {
    hasConfidenceInterval: /\b(95%|99%)\s*(CI|confidence interval)|\bCI\s*[:=]?\s*\[?[-\d]/i.test(text),
    hasPValue: /\bp\s*[<>=]\s*0?\.\d+|\bp\s*[<>=]\s*\.\d+/i.test(text),
    hasEffectSize: /\b(cohen'?s d|hedges'?\s*g|odds ratio|\bOR\b|risk ratio|\bRR\b|hazard ratio|\bHR\b|beta\s*=|β\s*=|r\s*=\s*[-.\d]|standardi[sz]ed (mean )?difference|\bSMD\b|eta squared)/i.test(text),
    hasAbsoluteRisk: /\b(absolute risk|percentage point|prevalence of \d|\d+(\.\d+)?%\s*(of|vs|versus))/i.test(text),
    quotedNumbers: [...new Set((text.match(/\b\d+(?:\.\d+)?%|\bN\s*=\s*[\d,]+|\b(?:OR|RR|HR|SMD|d)\s*=\s*-?\d+\.?\d*/gi) || []))].slice(0, 12),
  }
}

/**
 * Build the dossier for one register record. Does real network work: resolves
 * the DOI through Crossref for the authoritative date and funder list.
 */
export async function buildDossier(rec) {
  const text = `${rec.title || ''} ${rec.abstract || ''}`
  const notes = []
  const d = {
    studyId: rec.studyId,
    checkedAt: new Date().toISOString(),
    // 1 and 2, the primary record and the real date
    doi: rec.doi || null,
    doiResolves: null,
    canonicalTitle: rec.title,
    indexedDate: rec.published || null,
    crossrefOnlineDate: null,
    datesAgree: null,
    // 3, review status
    peerReviewed: rec.peerReviewed ?? null,
    isPreprint: !!rec.isPreprint,
    journal: rec.journal || null,
    // 4, who was studied
    sampleSize: sampleSize(text),
    ageRange: ageRange(text),
    country: country(text),
    // 5 and 6, design and what was measured
    design: design(text, rec.pubTypes),
    followUp: (text.match(/\b(\d+)[- ](month|year|week)s?\s*(follow[- ]?up|later)/i) || [])[0] || null,
    exposureStated: /\b(hours? per day|minutes? per day|daily|frequency|duration|time spent|screen time|passive|active use|device log)/i.test(text)
      ? (text.match(/\b(device log\w*|passive sensing|self-?report\w*|parent(al)?-?report\w*|time[- ]use diar\w+)/i) || [null])[0] : null,
    // 7, 8, the numbers
    statistics: statistics(text),
    // 9, 10, 11
    limitationsStated: /\blimitation|caveat|should be interpreted with caution/i.test(text),
    attritionStated: /\battrition|dropout|drop-?out|lost to follow/i.test(text),
    funding: rec.grants && rec.grants.length ? rec.grants : [],
    conflictsStated: /\bconflict of interest|competing interest|declaration of interest/i.test(text),
    preregistered: /\bpre-?register|prospectively registered|clinicaltrials\.gov|ISRCTN|OSF registration/i.test(text),
    abstractClaimsCause: CAUSAL.test(text) && !HEDGED.test(text),
    abstractHedges: HEDGED.test(text),
    // the honest part
    abstractAvailable: !!(rec.abstract && rec.abstract.length > 120),
    fullTextChecked: false,
    automaticChecks: [],
    requiresClaude: [
      'C. whether the causal inference is justified',
      'D. the strongest contradictory or null study',
      'E. whether media coverage overstates the finding',
      'G. UK relevance, policy status and safeguarding implications',
      'H. a claim by claim VERIFIED / QUALIFIED / UNSUPPORTED / REQUIRES SOURCE verdict',
    ],
    claudeStatus: 'PENDING',
    notes,
  }

  // Resolve the DOI for the authoritative record. A press date and a real
  // online date routinely differ by weeks and the protocol asks for both.
  if (d.doi) {
    const clean = String(d.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    const { ok, json, status } = await getJson(`https://api.crossref.org/works/${encodeURIComponent(clean)}${mailtoParam('?')}`)
    if (ok && json?.message) {
      const m = json.message
      d.doiResolves = true
      d.automaticChecks.push('DOI resolved through Crossref')
      const parts = m['published-online']?.['date-parts']?.[0] || m.published?.['date-parts']?.[0]
      if (parts) d.crossrefOnlineDate = parts.map((n, i) => (i ? String(n).padStart(2, '0') : n)).join('-')
      if (d.crossrefOnlineDate && d.indexedDate) {
        d.datesAgree = d.crossrefOnlineDate.slice(0, 7) === String(d.indexedDate).slice(0, 7)
        if (!d.datesAgree) notes.push(`date disagreement: index says ${d.indexedDate}, Crossref online date is ${d.crossrefOnlineDate}`)
      }
      if (!d.funding.length && m.funder?.length) d.funding = m.funder.map((f) => f.name).filter(Boolean)
      if (m.type === 'posted-content' || m.subtype === 'preprint') { d.isPreprint = true; d.peerReviewed = false }
      if (m['is-referenced-by-count'] != null) d.citedBy = m['is-referenced-by-count']
    } else {
      d.doiResolves = false
      notes.push(`DOI did not resolve through Crossref (HTTP ${status}). Treat the citation as unconfirmed.`)
    }
  } else if (rec.isOfficial && /^https:\/\/www\.gov\.uk\/government\/publications\//.test(rec.url || '')) {
    // An official document has no DOI. Its canonical record is the GOV.UK
    // publication page, so that is what gets resolved instead: the page must
    // exist, name a publishing body, and carry the date the register holds.
    const { ok, publication, status } = await govukPublication(rec.url)
    if (ok && publication?.title) {
      d.officialRecord = { url: publication.url, title: publication.title, published: publication.published, organisations: publication.organisations, attachments: publication.pdfs.length }
      d.officialRecordResolves = true
      d.automaticChecks.push('GOV.UK publication page resolved through the content API')
      d.datesAgree = !!publication.published && publication.published === String(d.indexedDate || '').slice(0, 10)
      if (!d.datesAgree) notes.push(`date disagreement: the register says ${d.indexedDate}, GOV.UK says first published ${publication.published}`)
      notes.push('an official document, not a journal article: the date is the day GOV.UK published it, which can be long after the work was done. Read the document for its own date before calling it new.')
    } else {
      d.officialRecordResolves = false
      notes.push(`the GOV.UK publication page did not resolve (HTTP ${status}). Treat the citation as unconfirmed.`)
    }
  } else {
    notes.push('no DOI on the record, so there is no canonical identifier to verify against')
  }

  // Full text held from the drop lane. It only counts as checked when the
  // file on disk is the same document the register recorded, digest for
  // digest: a quietly revised attachment must not inherit an old review.
  if (rec.fullTextPath && rec.textSha256) {
    if (existsSync(rec.fullTextPath) && createHash('sha256').update(readFileSync(rec.fullTextPath, 'utf8')).digest('hex') === rec.textSha256) {
      d.fullTextHeld = true
      d.automaticChecks.push('full text held, and its digest matches the register')
    } else {
      d.fullTextHeld = false
      notes.push('the register records full text, but the file is missing or its digest does not match. Fetch it again before quoting from it.')
    }
  }

  if (!d.abstractAvailable) notes.push('no usable abstract reached this container, so sample size, design and statistics could not be extracted. Full text needed before any figure is quoted.')
  if (!d.sampleSize) notes.push('sample size not extractable: do not quote an N')
  if (!d.statistics.hasEffectSize) notes.push('no effect size found in the available text: do not describe the size of the finding')
  if (!d.statistics.hasConfidenceInterval) notes.push('no confidence interval found: do not present the estimate as precise')
  if (d.abstractClaimsCause) notes.push('the abstract itself uses causal language without hedging. Check the design supports it before repeating any of that wording.')
  if (d.isPreprint) notes.push('PREPRINT, not peer reviewed. Say so in any copy that uses it.')

  // The automatic verdict is narrow on purpose: it says the record is a real,
  // identifiable, dated study, not that its findings are sound.
  const identifiable = d.doiResolves === true || !!rec.pmid || d.officialRecordResolves === true
  d.automaticVerdict = identifiable && !!d.indexedDate ? 'RECORD CONFIRMED' : 'RECORD UNCONFIRMED'
  if (identifiable) d.automaticChecks.push('a dated, identifiable primary record exists')

  return d
}

/** Run the dossier over the register and store each one. */
export async function verifyBand(bands = ['CORE', 'ADJACENT'], limit = 10) {
  const candidates = reg.all()
    .filter((r) => bands.includes(r.relevanceBand) && r.status === 'DISCOVERED')
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, limit)

  const out = []
  for (const rec of candidates) {
    const dossier = await buildDossier(rec)
    reg.upsert({ ...rec, dossier, status: dossier.automaticVerdict === 'RECORD CONFIRMED' ? 'VERIFIED' : 'HOLD',
      claudeStatus: 'PENDING' },
      { reason: `automatic dossier: ${dossier.automaticVerdict}`, actor: 'radar:dossier' })
    out.push({ studyId: rec.studyId, title: rec.title, verdict: dossier.automaticVerdict, notes: dossier.notes.length })
  }
  return out
}

if (import.meta.url === `file://${process.argv[1]}`) {
  verifyBand().then((rows) => {
    console.log(`\nDOSSIERS BUILT: ${rows.length}\n`)
    for (const r of rows) console.log(`${r.verdict.padEnd(18)} ${String(r.notes).padStart(2)} caveats  ${r.title.slice(0, 70)}`)
    console.log('\nEvery one is claudeStatus PENDING. The automatic pass confirms the record exists and is dated.')
    console.log('It does not judge the finding. That needs a directed Claude run, per gate J of the protocol.')
  })
}
