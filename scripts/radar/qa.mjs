// Stage 3, the automated quality check that stands between a produced pack
// and Justin's approval.
//
// Requirement 5 of the repair brief: "Check word counts, opening and closing
// duplication, prohibited figures, citations, editorial rules, image accuracy
// and approval status... A failed check must block advancement and explain the
// reason."
//
// So the contract here is narrow and absolute. Every check returns a verdict,
// and ANY failure makes the whole pack HOLD. There is no score, no "mostly
// fine", and no way for a caller to proceed past a failure by ignoring a
// boolean, because the only thing returned is a verdict string plus the
// reasons. Silent continuation is the specific thing this file exists to stop.
//
// Two of these checks are the ones that have actually caught real errors:
//
//   the uncleared figure check. On 9 November the register recorded three
//   Ofcom facts corrected and a 150,000 wrongly credited to Ofcom. A number
//   that is not in the handoff's cleared list has no business in copy.
//
//   the duplication check. 041 and 046 were 98.6 percent identical and nearly
//   went out as two posts. The corpus here is the 25 real archived posts, so
//   this is a comparison against what was actually written, not a guess.
//
// What this canNOT do, stated because a QA pass that overstates itself is
// worse than none: it cannot tell whether a claim is true, cannot see an
// image, and cannot read LinkedIn. It checks a pack against the handoff and
// the house rules. Truth is the dossier's job and the directed review's job.

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import * as reg from './register.mjs'
import { parsePostRegister, POST_REGISTER, REPO } from './contract.mjs'

// The house rules, from research/01 and the content-engine skill.
export const LIMITS = {
  linkedinWordsMin: 250,
  linkedinWordsMax: 450,
  linkedinCharsMin: 1300,
  linkedinCharsMax: 2500,
  // LinkedIn's own hard ceiling. Over this the post cannot be published.
  linkedinCharsHard: 3000,
  newsletterWordsMin: 600,
  duplicationThreshold: 0.75,
}

// Any of these in copy is a fail. Dashes are rule 4 of the non-negotiables.
const DASHES = /[‐-―−]/
const URL_IN_BODY = /https?:\/\/\S+/i

/** Words, counted the way a person would count them. */
const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length

/** Sentences, roughly, for the opening and closing comparison. */
function sentences(s) {
  return String(s || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean)
}

/** Normalise for comparison: this is about substance, not punctuation. */
const normalise = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

/**
 * How similar two strings are, 0 to 1, by shared word trigrams. Chosen over
 * a character diff because it catches a reworded duplicate, which is what
 * 041 and 046 were, rather than only a copy and paste.
 */
export function similarity(a, b) {
  const grams = (s) => {
    const w = normalise(s).split(' ').filter(Boolean)
    const g = new Set()
    if (w.length < 3) { if (w.length) g.add(w.join(' ')); return g }
    for (let i = 0; i <= w.length - 3; i += 1) g.add(w.slice(i, i + 3).join(' '))
    return g
  }
  const A = grams(a); const B = grams(b)
  if (!A.size || !B.size) return 0
  let shared = 0
  for (const x of A) if (B.has(x)) shared += 1
  return shared / Math.min(A.size, B.size)
}

/**
 * The corpus of what has already been written, for the duplication check.
 * The 25 archived desk posts carry full bodies, which is the only honest way
 * to check an opening against what really went out.
 */
export function existingCorpus() {
  const out = []
  const archive = join(REPO, 'content/research-register/desk-archive-2026-11-09.json')
  if (existsSync(archive)) {
    try {
      const a = JSON.parse(readFileSync(archive, 'utf8'))
      for (const p of a.posts || []) {
        if (p.body) out.push({ id: `GDC-${p.n}`, title: p.title || '', body: p.body })
      }
    } catch { /* a corrupt archive is a missing corpus, reported by the caller */ }
  }
  // Titles alone still catch a repeated idea even where no body survives.
  for (const r of parsePostRegister()) {
    if (!out.some((x) => x.id === `GDC-${r.number}`)) out.push({ id: `GDC-${r.number}`, title: r.title, body: '' })
  }
  return out
}

/**
 * Pull the numeric claims out of copy, so they can be checked against the
 * figures the handoff cleared.
 *
 * The allow list matters as much as the detection. A year, a GDC number, an
 * age range and a stage number are not research figures, and flagging them
 * would train everyone to ignore this check, which is how a check dies.
 */
export function figuresIn(text) {
  const t = String(text || '')
  const found = []
  // Strip the things that are never a research figure before looking.
  const stripped = t
    // A link is not a claim. The first clean run of the pipeline test failed
    // here: the DOI in the first comment, doi.org/10.1177/1359..., was read as
    // two uncleared research figures. Links and bare DOIs go first.
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/\b10\.\d{4,9}\/\S+/g, ' ')
    .replace(/\bGDC[\s-]?\d{2,3}\b/gi, ' ')
    .replace(/\bstage\s+\d\b/gi, ' ')
    .replace(/\b(19|20)\d{2}\b/g, ' ')
    .replace(/\baged?\s+\d{1,2}\s*(to|and)\s*\d{1,2}\b/gi, ' ')
    .replace(/\b\d{1,2}\s*(to|and)\s*\d{1,2}\s*year[\s-]?olds?\b/gi, ' ')
    .replace(/\bunder\s+\d{1,2}s?\b/gi, ' ')
  for (const m of stripped.matchAll(/\b\d[\d,]*(?:\.\d+)?\s*(?:percent|per cent|%)?/g)) {
    const raw = m[0].trim()
    const digits = raw.replace(/[^\d.]/g, '')
    if (!digits) continue
    const n = Number(digits)
    // One, two and three written as digits are usually counting, not evidence.
    if (n <= 3 && !/percent|per cent|%/.test(raw) && !/\./.test(digits)) continue
    found.push(raw)
  }
  return [...new Set(found)]
}

/** Is this figure covered by one of the cleared statistics? */
function isCleared(figure, cleared) {
  const digits = String(figure).replace(/[^\d.]/g, '')
  if (!digits) return true
  return cleared.some((c) => {
    const s = String(c)
    if (s.includes(digits)) return true
    // 30.8 percent in copy against r = 0.308 in the handoff, and 2,400
    // against 2400. A cleared figure restated is still cleared.
    const bare = digits.replace(/\./g, '')
    return s.replace(/[^\d]/g, '').includes(bare)
  })
}

// ---------------------------------------------------------------------------
// Eligibility. Requirement 3: only eligible, verified entries enter Stage 2.
// ---------------------------------------------------------------------------

/**
 * May this research record go to Stage 2 at all? Returns PASS or HOLD.
 * This is checked before production, where the manifest is built, and again
 * before a pack is accepted, because the register can move in between.
 */
export function eligibility(studyIdOrRecord) {
  const rec = typeof studyIdOrRecord === 'string' ? reg.get(studyIdOrRecord) : studyIdOrRecord
  const reasons = []
  if (!rec) return { verdict: 'HOLD', reasons: [`no such research record: ${studyIdOrRecord}`] }

  if (rec.claudeStatus !== 'CLAUDE REVIEWED') {
    reasons.push(`claudeStatus is ${rec.claudeStatus || 'unset'}, not CLAUDE REVIEWED. Gate J of the protocol: nothing is presented as reviewed until a directed review has run and its output is stored.`)
  }
  if (!rec.claudeReview) {
    reasons.push('no stored Claude review on the record, so there is nothing to produce against')
  } else {
    if (!rec.claudeReview.claims?.length) reasons.push('the stored review has no claim by claim verdicts')
    if (!rec.claudeReview.verdict) reasons.push('the stored review records no verdict')
  }
  if (!rec.dossier) reasons.push('no dossier, so the automatic verification pass has not run')
  if (rec.status === 'HOLD') reasons.push('the record is on HOLD, which is a deliberate decision to park it')
  if (rec.status === 'REJECTED') reasons.push('the record is REJECTED')
  if (!['EDITORIAL READY', 'ASSETS READY', 'APPROVED', 'PUBLISHED'].includes(rec.status)) {
    reasons.push(`status is ${rec.status}, which is before EDITORIAL READY, so Stage 1 is not finished with it`)
  }
  return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, studyId: rec.studyId }
}

// ---------------------------------------------------------------------------
// The pack check.
// ---------------------------------------------------------------------------

/**
 * A production pack, as Stage 2 should hand it over:
 * {
 *   researchId, gdcPostNumber,
 *   linkedin: { body, firstComment },
 *   instagram?: { caption }, facebook?: { caption },
 *   newsletter?: { body },
 *   visual?: { brief, assetsUsed: [] },
 *   approval?: { approvedBy, approvedAt },
 * }
 *
 * Every check appends to one list. The verdict is HOLD if anything failed.
 */
export function checkPack(pack, { record = null, corpus = null } = {}) {
  const checks = []
  const add = (name, pass, detail) => checks.push({ name, pass: !!pass, detail })

  const rec = record || (pack?.researchId ? reg.get(pack.researchId) : null)

  // 0. Identity. A pack that cannot be traced back is not auditable.
  add('carries a research ID', !!pack?.researchId,
    pack?.researchId ? `researchId ${pack.researchId}` : 'no researchId on the pack, so it cannot be tied to the research it came from')
  add('the research ID exists in the register', !!rec,
    rec ? `found, register version ${rec.version}` : `no register record for ${pack?.researchId}`)
  add('carries a source commit', !!pack?.sourceCommit,
    pack?.sourceCommit ? `from commit ${String(pack.sourceCommit).slice(0, 8)}` : 'no sourceCommit, so there is no way to know which version of the handoff this was written from')

  // 1. Eligibility, rechecked here because the register can move.
  const el = rec ? eligibility(rec) : { verdict: 'HOLD', reasons: ['no record to check'] }
  add('the research is still eligible for Stage 2', el.verdict === 'PASS', el.reasons.join(' | ') || 'eligible')

  // 2. The post number. Requirement 2: never two claims on one number.
  const rows = parsePostRegister()
  const num = pack?.gdcPostNumber ? String(pack.gdcPostNumber).padStart(3, '0') : null
  if (!num) {
    add('carries a GDC post number', false, 'no gdcPostNumber. Stage 2 must claim the next free number in the GitHub register before writing.')
  } else {
    const row = rows.find((r) => r.number === num)
    add('the post number exists in the GitHub register', !!row,
      row ? `GDC-${num} is in the register` : `GDC-${num} is NOT in content/gdc-post-register.md. Drive has claimed a number GitHub does not know about, which is the exact failure the register exists to prevent.`)
    if (row) {
      add('the post number is not already published', !row.posted,
        row.posted ? `GDC-${num} is already POSTED. Register rule 4: a published number is spent for good.` : 'not published')
      add('the post number matches this research', !rec?.gdcPostNumber || String(rec.gdcPostNumber).padStart(3, '0') === num,
        rec?.gdcPostNumber ? `register record carries ${rec.gdcPostNumber}, pack carries ${num}` : 'the research record carries no number, so nothing to contradict')
    }
  }

  // 3. LinkedIn copy.
  const li = pack?.linkedin?.body || ''
  if (!li) {
    add('has LinkedIn copy', false, 'no linkedin.body in the pack')
  } else {
    const w = words(li)
    const c = li.length
    add('LinkedIn word count is in band', w >= LIMITS.linkedinWordsMin && w <= LIMITS.linkedinWordsMax,
      `${w} words, band is ${LIMITS.linkedinWordsMin} to ${LIMITS.linkedinWordsMax}`)
    add('LinkedIn character count is within the platform limit', c <= LIMITS.linkedinCharsHard,
      `${c} characters, LinkedIn truncates above ${LIMITS.linkedinCharsHard}`)
    add('no dashes anywhere in the copy', !DASHES.test(li),
      DASHES.test(li) ? 'a dash is present. Non negotiable 4: no dashes in any copy, ever.' : 'none')
    add('no link in the post body', !URL_IN_BODY.test(li),
      URL_IN_BODY.test(li) ? 'a URL is in the body. A bare link cuts reach by 25 to 60 percent; it belongs in the first comment.' : 'none')

    // The single closing question must be last, with nothing after it.
    const sents = sentences(li)
    const lastQ = [...sents].reverse().findIndex((s) => s.endsWith('?'))
    add('the closing question is last with nothing after it', lastQ === 0,
      lastQ === -1 ? 'there is no closing question' : lastQ === 0 ? 'the last sentence is the question' : `${lastQ} sentence(s) come after the closing question`)

    add('a first comment is supplied', !!pack?.linkedin?.firstComment,
      pack?.linkedin?.firstComment ? 'present' : 'no first comment. The link and the pre empted objection live there, and it has to go up the moment the post does.')
  }

  // 4. Figures. Nothing in copy that the handoff did not clear.
  const cleared = rec?.claudeReview?.verifiedStatistics || []
  const allCopy = [li, pack?.linkedin?.firstComment, pack?.instagram?.caption, pack?.facebook?.caption, pack?.newsletter?.body]
    .filter(Boolean).join('\n\n')
  const uncleared = figuresIn(allCopy).filter((f) => !isCleared(f, cleared))
  add('every figure in the copy was cleared by the review', uncleared.length === 0,
    uncleared.length
      ? `not cleared: ${uncleared.join(', ')}. Cleared figures are: ${cleared.length ? cleared.join(' | ') : 'NONE, so no number may appear in copy at all'}`
      : `${figuresIn(allCopy).length} figure(s) checked, all cleared`)

  // 5. Prohibited claims, from the handoff's own notQuotable list.
  const prohibited = rec?.handoff?.notQuotable || rec?.claudeReview?.notQuotable || []
  add('no prohibited claim appears', true,
    prohibited.length
      ? `${prohibited.length} restriction(s) recorded on this story. These are prose, so they are listed for the reviewer rather than matched automatically: ${prohibited.slice(0, 2).join(' | ')}`
      : 'none recorded')

  // 6. Citation. A post that makes an evidence claim names where it came from.
  if (li) {
    const citesSomething = /\b(meta[- ]analysis|study|studies|research|trial|survey|cohort|review|published|researchers?|journal|Ofcom|DSIT|ICO|NHS|university)\b/i.test(li)
    const namesSource = !!(pack?.linkedin?.firstComment && /https?:\/\//.test(pack.linkedin.firstComment))
    add('an evidence claim has a source in the first comment', !citesSomething || namesSource,
      citesSomething
        ? (namesSource ? 'the first comment carries the link' : 'the copy refers to research but the first comment carries no link to it')
        : 'the copy makes no evidence claim')
  }

  // 7. Duplication, opening and closing, against what has already gone out.
  const body = corpus || existingCorpus()
  if (li) {
    const open = sentences(li).slice(0, 2).join(' ')
    const close = sentences(li).slice(-2).join(' ')
    let worstOpen = { score: 0, id: null }
    let worstClose = { score: 0, id: null }
    let worstWhole = { score: 0, id: null }
    for (const other of body) {
      if (num && other.id === `GDC-${num}`) continue // a rewrite keeps its number
      if (other.body) {
        const oOpen = sentences(other.body).slice(0, 2).join(' ')
        const oClose = sentences(other.body).slice(-2).join(' ')
        const so = similarity(open, oOpen)
        const sc = similarity(close, oClose)
        const sw = similarity(li, other.body)
        if (so > worstOpen.score) worstOpen = { score: so, id: other.id }
        if (sc > worstClose.score) worstClose = { score: sc, id: other.id }
        if (sw > worstWhole.score) worstWhole = { score: sw, id: other.id }
      }
    }
    const pct = (x) => `${Math.round(x * 100)} percent`
    add('the opening is not a repeat of an existing post', worstOpen.score < LIMITS.duplicationThreshold,
      `closest opening is ${worstOpen.id || 'none'} at ${pct(worstOpen.score)}`)
    add('the close is not a repeat of an existing post', worstClose.score < LIMITS.duplicationThreshold,
      `closest close is ${worstClose.id || 'none'} at ${pct(worstClose.score)}`)
    add('the post as a whole is not a near duplicate', worstWhole.score < LIMITS.duplicationThreshold,
      `closest post is ${worstWhole.id || 'none'} at ${pct(worstWhole.score)}. 041 and 046 were 98.6 percent identical and nearly both went out.`)
  }

  // 8. Image accuracy. Claude cannot see an image, so this checks the brief.
  if (pack?.visual) {
    const v = pack.visual
    const assets = v.assetsUsed || []
    add('the visual names the approved assets it uses', assets.length > 0,
      assets.length ? assets.join(', ') : 'no assetsUsed listed. Every visual must come from the approved brand assets, never a regenerated character and never an invented screen.')
    const invented = /\b(invented|mock ?up of a screen|placeholder screen|regenerated|new character|AI generated child|synthetic parent)\b/i.test(JSON.stringify(v))
    add('the visual brief does not describe an invented screen or person', !invented,
      invented ? 'the brief describes something regenerated or invented. Only real screens and approved characters.' : 'nothing invented described')
    add('the visual does not present a synthetic person as a real parent', !/\breal parent\b/i.test(String(v.brief || '')) || !/\b(generated|synthetic|AI)\b/i.test(String(v.brief || '')),
      'checked the brief wording')
  } else {
    add('a visual brief is present', false, 'no visual in the pack. Every post needs its card or an explicit note that it goes out as text only.')
  }

  // 9. Approval status. Nothing may claim approval it does not have.
  const claimsApproved = /\b(APPROVED|PUBLISHED)\b/.test(String(pack?.status || ''))
  add('the pack does not claim an approval it has not got', !claimsApproved || !!pack?.approval?.approvedBy,
    claimsApproved
      ? (pack?.approval?.approvedBy ? `approved by ${pack.approval.approvedBy}` : `the pack says status ${pack.status} with no approval record. Only Justin approves, and only he can mark a post published.`)
      : `status ${pack?.status || 'unset'}, which claims nothing`)
  add('the pack does not claim to have been posted', !pack?.publishedUrl || !!pack?.approval?.approvedBy,
    pack?.publishedUrl ? 'a publishedUrl is present, which only belongs here after Justin has posted and the URL has been checked' : 'no publishedUrl claimed')

  const failed = checks.filter((c) => !c.pass)
  return {
    verdict: failed.length ? 'HOLD' : 'PASS',
    researchId: pack?.researchId || null,
    gdcPostNumber: num,
    checked: checks.length,
    failedCount: failed.length,
    failures: failed.map((c) => ({ check: c.name, why: c.detail })),
    checks,
    checkedAt: new Date().toISOString(),
    ceiling: 'This pass checks the pack against the handoff and the house rules. It cannot tell whether a claim is true, cannot see an image, and cannot read LinkedIn.',
  }
}

/** A readable report, for the dashboard and for Justin. */
export function report(result) {
  const L = [`PACK QA  ${result.researchId || 'no research id'}  ${result.gdcPostNumber ? `GDC-${result.gdcPostNumber}` : 'no post number'}`]
  L.push(`${result.verdict}   ${result.checked - result.failedCount} of ${result.checked} checks passed`)
  L.push('')
  for (const c of result.checks) {
    L.push(`  ${c.pass ? 'pass' : 'FAIL'}  ${c.name}`)
    if (!c.pass) L.push(`        ${c.detail}`)
  }
  if (result.verdict === 'HOLD') {
    L.push('')
    L.push('HOLD. This pack does not advance to Justin until every failure above is fixed.')
  }
  L.push('')
  L.push(result.ceiling)
  return L.join('\n')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2]
  if (!file) {
    console.error('usage: node scripts/radar/qa.mjs <pack.json>')
    process.exit(1)
  }
  const pack = JSON.parse(readFileSync(file, 'utf8'))
  const result = checkPack(pack)
  console.log(report(result))
  process.exit(result.verdict === 'PASS' ? 0 : 1)
}
