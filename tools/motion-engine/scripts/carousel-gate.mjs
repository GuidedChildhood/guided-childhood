// The gate every evidence carousel passes before a page is rendered.
//
// The same three rules as the research card gate (gate.mjs): never invent a
// figure, never imply a cause, only reviewed research. Plus the carousel's own:
// one idea per page, few words, no GDC number or production label on a page,
// a highlight on the opening page, and a practical last page for parents.

import { CAUSAL, numbersIn } from './gate.mjs'

const DASH = /[‐-―−]/
const HYPHEN_PUNCT = /\S +- +\S/
export const LIMITS = { pagesMin: 4, pagesMax: 7, kicker: 36, lineChars: 60, linesMax: 4, pageWords: 26, source: 96 }
const words = (s) => String(s || '').replace(/==/g, '').trim().split(/\s+/).filter(Boolean).length
const plain = (s) => String(s || '').replace(/==/g, '')

/**
 * spec: { gdc, title, source, pages: [{ kicker, lines: [], role? }], notForPublication? }
 * cleared: the text whose numbers may appear (the record's cleared figures, or
 * the approved post and first comment for a post outside the radar).
 */
export function checkCarousel(spec, cleared = '') {
  const reasons = []
  const warnings = []
  const pages = Array.isArray(spec?.pages) ? spec.pages : []
  if (pages.length < LIMITS.pagesMin || pages.length > LIMITS.pagesMax) reasons.push(`${pages.length} pages; a carousel has ${LIMITS.pagesMin} to ${LIMITS.pagesMax}, one idea each`)
  if (!spec?.notForPublication && !/^\d{3}$/.test(String(spec?.gdc || ''))) reasons.push('no GDC number on the spec (it is never printed on a page, but the files are filed by it)')
  if (!String(spec?.source || '').trim()) reasons.push('no source line for the last page')
  else if (spec.source.length > LIMITS.source) reasons.push(`the source line is ${spec.source.length} characters, the most that fits is ${LIMITS.source}`)
  const allowed = new Set(numbersIn(cleared))
  pages.forEach((p, i) => {
    const n = i + 1
    const lines = Array.isArray(p.lines) ? p.lines : []
    const all = [p.kicker, ...lines].join(' ')
    if (!String(p.kicker || '').trim()) reasons.push(`page ${n} has no kicker`)
    else if (p.kicker.length > LIMITS.kicker) reasons.push(`page ${n} kicker is ${p.kicker.length} characters, the most is ${LIMITS.kicker}`)
    if (!lines.length || lines.length > LIMITS.linesMax) reasons.push(`page ${n} has ${lines.length} lines; 1 to ${LIMITS.linesMax}`)
    lines.forEach((l, j) => { if (plain(l).length > LIMITS.lineChars) reasons.push(`page ${n} line ${j + 1} is ${plain(l).length} characters, the most is ${LIMITS.lineChars}`) })
    if (words(all) > LIMITS.pageWords) reasons.push(`page ${n} has ${words(all)} words; one idea per page, at most ${LIMITS.pageWords}`)
    if (DASH.test(all) || HYPHEN_PUNCT.test(all)) reasons.push(`page ${n} carries a dash`)
    if (/\bGDC\b|draft|not for publication|v\d\b/i.test(all) && !spec.notForPublication) reasons.push(`page ${n} carries a GDC number or a production label, which never go on a public graphic`)
    if (CAUSAL.test(plain(all)) && !p.causalReviewed) reasons.push(`page ${n} uses causal wording ("${plain(all).match(CAUSAL)[0]}"). Say what was found, not what it does`)
    for (const num of numbersIn(plain(all))) if (!allowed.has(num)) reasons.push(`page ${n} has the figure ${num}, which is not in the cleared text`)
    if ((plain(all).match(/==/g) || []).length) warnings.push(`page ${n} has an unclosed highlight`)
    const marks = (String(all).match(/==[^=]+==/g) || []).length
    if (marks > 1) reasons.push(`page ${n} has ${marks} highlights; one restrained highlight a page at most`)
  })
  if (pages.length && !/==[^=]+==/.test([pages[0].kicker, ...(pages[0].lines || [])].join(' '))) reasons.push('the first page has no highlight; the opening claim carries the one yellow mark')
  if (pages.length && pages.at(-1).role !== 'practical') reasons.push('the last page must be the practical one for parents (set "role": "practical" once it is)')
  if (DASH.test(spec?.source || '')) reasons.push('the source line carries a dash')
  return { verdict: reasons.length ? 'HOLD' : 'PASS', reasons, warnings }
}
