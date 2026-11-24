// The ten verification checks a stored research review must answer.
// Shared by the review gate (pipeline.mjs storeReview) and the integrity gate
// (gate.mjs), so the rule is written once.

import { SETTINGS } from './settings.mjs'

/** Reviews stored on or after this date must carry the ten checks. Older ones predate the rule. */
export const VERIFICATION_REQUIRED_FROM = '2026-11-25'

// The ten verification checks (Justin's brief of 24 November 2026, section 5,
// held in config/content-engine.json research.verificationChecks). Each is a
// required field of review.verification: one plain answer, written from what
// was read in this run. The labels are the settings file's; the keys are what
// the review JSON carries. test-relay checks the two lists still agree, so a
// check added to the settings file cannot be silently skipped here.
export const VERIFICATION_FIELDS = [
  ['original source verified', 'originalSource', 'the primary source itself, where it was read (DOI or URL), and that it says what the candidate says'],
  ['publication date verified', 'publicationDate', 'the date of publication as the source gives it, and where that date was read'],
  ['statistics and denominators checked', 'statisticsAndDenominators', 'each figure with its denominator and what it is a share of, or "no figure is quoted"'],
  ['sample and population checked', 'sampleAndPopulation', 'who was studied, how many, where, when, how recruited, and whether that is UK families'],
  ['research design assessed', 'researchDesign', 'the design (trial, longitudinal, cross sectional, meta analysis, survey, qualitative, regulatory finding) and what that design can bear'],
  ['correlation versus causation checked', 'correlationOrCausation', 'whether the design allows a causal claim, and the wording copy must therefore use'],
  ['counter evidence reviewed', 'counterEvidence', 'the strongest work that points the other way or finds nothing, named'],
  ['strongest credible objection', 'strongestObjection', 'the objection a careful sceptic would raise first, in a sentence copy can concede'],
  ['practical implications', 'practicalImplications', 'what a parent or teacher could reasonably do with this, without claiming an outcome for a child'],
  ['claims that must not be made', 'claimsNotToMake', 'the claims this study must never be used for'],
]
const VERIFICATION_MIN = 20

/** Reasons a review's verification block is incomplete, empty when it is whole. */
export function verificationProblems(v) {
  if (!v || typeof v !== 'object') return ['no verification block. A review answers the ten verification checks in review.verification, one field each: ' + VERIFICATION_FIELDS.map(([, k]) => k).join(', ')]
  return VERIFICATION_FIELDS
    .filter(([, k]) => String(Array.isArray(v[k]) ? v[k].join(' ') : v[k] || '').trim().length < VERIFICATION_MIN)
    .map(([label, k, what]) => `verification.${k} (${label}) is missing or too thin: ${what}`)
}

/** The settings labels with no field here. Empty means the code covers every check. */
export function uncoveredChecks(s = SETTINGS) {
  const have = new Set(VERIFICATION_FIELDS.map(([label]) => label))
  return (s.research?.verificationChecks || []).filter((c) => !have.has(c))
}
