// The gate every spec passes before a frame is rendered.
//
// It exists to make three of Justin's rules impossible to break by accident:
// never invent a statistic, never imply causation from correlation, and only
// use Claude reviewed research. It answers PASS or HOLD with every reason, in
// the same shape as the radar pipeline's gates.

const DASH = new RegExp('[\\u2010-\\u2015\\u2212]')
const TEXT_FIELDS = ['eyebrow', 'headline', 'finding.figure', 'finding.text', 'context', 'source', 'limitation']
// Fields whose numbers must all be cleared figures. The source line carries
// dates and is checked against the record instead. The eyebrow may carry the
// GDC number.
const NUMBER_FIELDS = ['headline', 'finding.figure', 'finding.text', 'context', 'limitation']
const LIMITS = { eyebrow: 40, headline: 110, 'finding.figure': 8, 'finding.text': 110, context: 140, source: 64, limitation: 110 }
// Wording that claims a cause. A card can only say this when the record's
// design supports it, and the engine does not decide that: a person does.
export const CAUSAL = /\b(causes?|caused|causing|leads? to|led to|results? in|makes? (children|kids|teens|parents)|because of|drives?|triggers?|damages?|harms?|rewires?)\b/i
const WORD_HARD = 55
const WORD_SOFT = 45

const get = (o, path) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), o)
const words = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length
const norm = (s) => String(s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim()

/** Every number in a string, as written: 47.2, 572, 1,000 becomes 1000. */
export function numbersIn(s) {
  return (String(s || '').match(/\d[\d,]*(?:\.\d+)?/g) || []).map((n) => n.replace(/,/g, ''))
}

/**
 * The house reading rule from the product-shorts skill: a screen needs
 * 0.6 seconds plus words divided by 3.3, plus half a second because it is new.
 */
export function readingSeconds(n) {
  return Math.round((0.6 + n / 3.3 + 0.5) * 10) / 10
}

/**
 * spec   the story spec
 * record the research record, or null for a demonstration
 */
export function checkSpec(spec, record = null) {
  const reasons = []
  const warnings = []
  if (!spec || typeof spec !== 'object') return { verdict: 'HOLD', reasons: ['no spec'], warnings, words: 0 }

  for (const f of TEXT_FIELDS) {
    const v = get(spec, f)
    if (f !== 'finding.figure' && f !== 'source' && !String(v || '').trim()) reasons.push(`${f} is empty`)
    if (v && DASH.test(v)) reasons.push(`${f} contains a dash`)
    if (v && String(v).length > LIMITS[f]) reasons.push(`${f} is ${String(v).length} characters, the most the card holds is ${LIMITS[f]}`)
  }
  if (!String(spec.source || '').trim()) reasons.push('source is empty: every card names where the finding comes from')

  for (const f of ['headline', 'finding.text', 'context']) {
    const v = get(spec, f)
    const m = v && String(v).match(CAUSAL)
    if (m) reasons.push(`${f} uses causal wording ("${m[0]}"). Say what was found, not what it causes, unless the study design shows a cause and a person has checked that`)
  }

  const reading = ['eyebrow', 'headline', 'finding.figure', 'finding.text', 'context', 'source', 'limitation'].reduce((n, f) => n + words(get(spec, f)), 0)
  if (reading > WORD_HARD) reasons.push(`${reading} words on the card. The most that can be read in the time is ${WORD_HARD}`)
  else if (reading > WORD_SOFT) warnings.push(`${reading} words on the card. Under ${WORD_SOFT} reads more comfortably`)

  if (spec.notForPublication) {
    if (spec.gdcPostNumber) reasons.push('a demonstration must not carry a GDC number')
    return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, warnings, words: reading }
  }

  // A real story from here on.
  if (!record) reasons.push('a story for publication needs its research record')
  if (!/^\d{3}$/.test(String(spec.gdcPostNumber || ''))) reasons.push('gdcPostNumber must be the three digit number from the post register')
  if (record) {
    if (record.studyId !== spec.researchId) reasons.push(`the spec names ${spec.researchId} and the record is ${record.studyId}`)
    if (record.claudeStatus !== 'CLAUDE REVIEWED') reasons.push(`the record's Claude status is ${record.claudeStatus || 'missing'}, not CLAUDE REVIEWED`)
    const verdict = record.claudeReview?.verdict
    if (!['SHIP', 'EDIT'].includes(verdict)) reasons.push(`the Claude review verdict is ${verdict || 'missing'}, and only SHIP or EDIT may be made into a card`)
    if (String(record.gdcPostNumber || '') !== String(spec.gdcPostNumber || '')) reasons.push(`the record's GDC number is ${record.gdcPostNumber || 'none'} and the spec says ${spec.gdcPostNumber}`)

    const cleared = record.claudeReview?.verifiedStatistics || []
    if (!cleared.length) reasons.push('the record has no cleared figures')
    const clearedNumbers = new Set(cleared.flatMap(numbersIn))
    for (const f of NUMBER_FIELDS) {
      for (const n of numbersIn(get(spec, f))) {
        if (!clearedNumbers.has(n)) reasons.push(`${f} shows ${n}, which is not in the cleared figures`)
      }
    }
    const notQuotable = record.claudeReview?.notQuotable || []
    for (const nq of notQuotable) {
      for (const f of TEXT_FIELDS) {
        const v = norm(get(spec, f))
        if (v && nq && v.includes(norm(typeof nq === 'string' ? nq : nq.text || ''))) reasons.push(`${f} uses wording marked not quotable`)
      }
    }
    const limits = (record.claudeReview?.limitations || []).map(norm)
    const lim = norm(spec.limitation).replace(/^limits?:\s*/, '')
    if (lim && !limits.some((l) => l.includes(lim) || lim.includes(l))) warnings.push('the limitation is not word for word one of the record\'s limitations. Check it says the same thing')
  }

  return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, warnings, words: reading }
}
