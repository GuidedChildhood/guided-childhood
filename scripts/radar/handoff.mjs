// The Stage 1 to Stage 2 handoff.
//
// Stage 1 is this repository: discovery, the dossier, and a directed Claude
// review. Stage 2 is ChatGPT doing editorial and production from Drive. The
// two do not share a runtime, so the contract between them is a file.
//
// Two artefacts per story, written side by side:
//   handoff-<id>.json   the machine readable record, this schema, versioned
//   a Google Doc        the same thing for a person to read
//
// The JSON is the one Stage 2 parses. The Doc is so Justin can see what was
// handed over without opening a JSON file on his phone.
//
// This does NOT assign a GDC post number. content/gdc-post-register.md is the
// only place a number is claimed, and a handoff either carries a number that
// already exists there or carries null.

// 1.1.0, 10 November: adds handoffVersion, sourceCommit, sourceUrls with their
// verification dates, and the names the repair brief uses (clearedFigures,
// prohibitedClaims, recommendedFormats) alongside the original ones, so a
// reader written against either finds what it expects.
export const SCHEMA_VERSION = '1.1.0'

export const PRIORITIES = ['BREAKING', 'HIGH', 'BANK', 'LOW']

/**
 * Build the handoff for a register record that has a dossier and a stored
 * Claude review. Throws rather than emit a handoff that claims a review that
 * has not happened, which is gate J of the protocol.
 */
export function buildHandoff(rec, { claudeReview, gdcPostNumber = null, priority = 'BANK', audience, platforms, supportingFiles = [], sourceCommit = null, handoffVersion = 1 } = {}) {
  if (!rec?.dossier) throw new Error(`${rec?.studyId}: no dossier, run the verification pass first`)
  if (!claudeReview) throw new Error(`${rec.studyId}: no stored Claude review. The protocol forbids handing off a story as reviewed when it has not been.`)
  if (!claudeReview.claims?.length) throw new Error(`${rec.studyId}: the Claude review has no claim by claim verdicts`)
  if (!PRIORITIES.includes(priority)) throw new Error(`unknown priority ${priority}`)

  const d = rec.dossier

  return {
    schemaVersion: SCHEMA_VERSION,
    // identity and provenance
    researchId: rec.studyId,
    registerVersion: rec.version,
    // Which handoff this is for this story, counting from 1, and the commit
    // the facts were read at. Without these two a Drive copy cannot be told
    // from the one before it, which is how Stage 2 came to be pointed at a
    // superseded document on 10 November.
    handoffVersion,
    sourceCommit,
    createdAt: new Date().toISOString(),
    stage: 'EDITORIAL READY',
    productionStatus: 'EDITORIAL READY',

    // what the story is
    proposedTitle: claudeReview.proposedTitle || null,
    proposedAngle: claudeReview.proposedAngle || null,
    oneStory: claudeReview.oneStory || null,
    oneTension: claudeReview.oneTension || null,
    oneBelief: claudeReview.oneBelief || null,
    oneTakeaway: claudeReview.oneTakeaway || null,

    // the evidence, with the exact figures that may be used and no others
    research: {
      // A paper's own title can carry a dash. Nothing ChatGPT reads does, so it
      // is written with a space here; the DOI beside it identifies the paper.
      title: String(rec.title || '').replace(new RegExp('\\s*[\\u2010-\\u2015\\u2212]\\s*', 'g'), ' '),
      authors: rec.authors || null,
      journal: rec.journal || null,
      doi: rec.doi || null,
      pmid: rec.pmid || null,
      primaryUrl: rec.url || null,
      publishedDate: d.crossrefOnlineDate || rec.published || null,
      indexedDate: rec.published || null,
      peerReviewed: d.peerReviewed,
      isPreprint: d.isPreprint,
      design: d.design,
      sampleSize: d.sampleSize,
      ageRange: d.ageRange,
      country: d.country,
      followUp: d.followUp,
      funding: d.funding,
      preregistered: d.preregistered,
      streams: rec.streams || [],
      foundBy: rec.foundBy || [],
    },

    // every source, with the date each was last verified and how
    sourceUrls: [
      ...(rec.url ? [{ url: rec.url, kind: 'primary', verifiedAt: d.checkedAt || null, how: d.doiResolves ? 'DOI resolved through Crossref' : 'recorded, DOI not confirmed to resolve' }] : []),
      ...(rec.doi ? [{ url: `https://doi.org/${String(rec.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//, '')}`, kind: 'doi', verifiedAt: d.checkedAt || null, how: d.doiResolves ? 'resolves' : 'not confirmed' }] : []),
    ].filter((x, i, a) => a.findIndex((y) => y.url === x.url) === i),
    verification: {
      dossierCheckedAt: d.checkedAt || null,
      claudeReviewedAt: claudeReview.reviewedAt || null,
      fullTextChecked: !!d.fullTextChecked,
      reviewBasis: claudeReview.reviewBasis || null,
    },

    // the figures Stage 2 is allowed to put in copy. Anything not in here is
    // not cleared, and the reason is in notQuotable.
    verifiedStatistics: claudeReview.verifiedStatistics || [],
    notQuotable: [
      ...(d.sampleSize ? [] : ['the sample size, which could not be extracted from the available text']),
      ...(d.statistics?.hasEffectSize ? [] : ['the size of the effect, since no effect size was found']),
      ...(d.statistics?.hasConfidenceInterval ? [] : ['any claim of precision, since no confidence interval was found']),
      ...(claudeReview.notQuotable || []),
    ],

    // the same two lists under the names the repair brief uses
    clearedFigures: claudeReview.verifiedStatistics || [],
    prohibitedClaims: claudeReview.notQuotable || [],

    // confidence and the honest limits
    evidenceConfidence: claudeReview.evidenceConfidence || null,
    limitations: claudeReview.limitations || [],
    contradictoryEvidence: claudeReview.contradictoryEvidence || [],
    whatThisDoesNotProve: claudeReview.whatThisDoesNotProve || [],
    mediaMisrepresentation: claudeReview.mediaMisrepresentation || null,

    // claim by claim, the protocol's four verdicts
    claimVerification: claudeReview.claims,
    claudeReview: {
      status: 'CLAUDE REVIEWED',
      reviewedAt: claudeReview.reviewedAt,
      reviewedBy: claudeReview.reviewedBy || 'Claude Code, directed run',
      verdict: claudeReview.verdict,
      unresolvedQuestions: claudeReview.unresolvedQuestions || [],
      storedAt: claudeReview.storedAt || null,
    },

    // Guided Childhood
    gdcBeliefs: claudeReview.gdcBeliefs || [],
    productImplications: claudeReview.productImplications || {
      digitalPathwayOS: null, schoolLesson: null, parentTool: null, digi: null, historyChecker: null,
    },
    gdcPostNumber: gdcPostNumber,
    gdcPostNumberNote: gdcPostNumber
      ? 'This number already exists in content/gdc-post-register.md. Stage 1 never assigns one.'
      : 'No number assigned. Stage 2 must claim the next free number in content/gdc-post-register.md before writing, and must not invent one here.',

    // production direction
    recommendedAudience: audience || claudeReview.recommendedAudience || null,
    recommendedPlatforms: platforms || claudeReview.recommendedPlatforms || [],
    recommendedFormats: platforms || claudeReview.recommendedPlatforms || [],
    editorialAngle: claudeReview.proposedAngle || null,
    editorialPriority: priority,
    urgency: claudeReview.urgency || null,

    supportingFiles,
    history: { registerJsonl: 'content/research-register/studies.jsonl', studyVersions: rec.version },
  }
}

/** The same thing as a document a person can read. */
export function handoffDoc(h) {
  const L = []
  const line = (s = '') => L.push(s)
  const list = (items, empty = 'none recorded') => {
    if (!items || !items.length) return line('  ' + empty)
    for (const i of items) line('  ' + (typeof i === 'string' ? i : JSON.stringify(i)))
  }

  line(`GDC RESEARCH HANDOFF  ${h.researchId}`)
  line(`Stage 1 complete, ready for Stage 2 editorial production`)
  line(`Schema ${h.schemaVersion}  handoff version ${h.handoffVersion}  created ${h.createdAt}`)
  line(`Register version ${h.registerVersion}  source commit ${h.sourceCommit ? String(h.sourceCommit).slice(0, 8) : 'not recorded'}`)
  line()
  line('STATUS')
  line(`  production status: ${h.productionStatus}`)
  line(`  editorial priority: ${h.editorialPriority}`)
  line(`  Claude review: ${h.claudeReview.status}, ${h.claudeReview.verdict}, ${h.claudeReview.reviewedAt}`)
  line(`  GDC post number: ${h.gdcPostNumber || 'NONE ASSIGNED'}`)
  line(`  ${h.gdcPostNumberNote}`)
  line()
  line('THE STORY')
  line(`  proposed title: ${h.proposedTitle || 'not proposed'}`)
  line(`  angle: ${h.proposedAngle || 'not proposed'}`)
  line(`  ONE STORY: ${h.oneStory || ''}`)
  line(`  ONE TENSION: ${h.oneTension || ''}`)
  line(`  ONE GDC BELIEF: ${h.oneBelief || ''}`)
  line(`  ONE TAKEAWAY: ${h.oneTakeaway || ''}`)
  line()
  line('THE RESEARCH')
  const r = h.research
  line(`  ${r.title}`)
  line(`  ${r.authors || 'authors not recorded'}`)
  line(`  ${r.journal || ''}, published ${r.publishedDate || 'date unknown'}`)
  line(`  ${r.primaryUrl || 'no URL'}`)
  line(`  DOI ${r.doi || 'none'}   PMID ${r.pmid || 'none'}`)
  line(`  design: ${r.design || 'not determined'}`)
  line(`  sample: ${r.sampleSize ? r.sampleSize.toLocaleString() : 'not extractable'}   ages: ${r.ageRange || 'not stated'}   country: ${r.country || 'not stated'}`)
  line(`  peer reviewed: ${r.peerReviewed ? 'yes' : 'NO, PREPRINT'}   preregistered: ${r.preregistered ? 'yes' : 'not stated'}`)
  line(`  funding: ${r.funding?.length ? r.funding.join('; ') : 'none declared in the record'}`)
  line(`  found by streams ${r.streams.join(', ')} via ${r.foundBy.join(', ')}`)
  line()
  line('FIGURES CLEARED FOR USE')
  list(h.verifiedStatistics, 'none cleared. Do not put a number in the copy.')
  line()
  line('DO NOT QUOTE')
  list(h.notQuotable, 'no specific restrictions beyond the above')
  line()
  line('WHAT THIS DOES NOT PROVE')
  list(h.whatThisDoesNotProve)
  line()
  line('LIMITATIONS')
  list(h.limitations)
  line()
  line('CONTRADICTORY OR NULL EVIDENCE')
  list(h.contradictoryEvidence)
  line()
  line('MEDIA COVERAGE')
  line(`  ${h.mediaMisrepresentation || 'not assessed'}`)
  line()
  line('CLAIM BY CLAIM')
  for (const c of h.claimVerification) {
    line(`  [${c.status}] ${c.claim}`)
    if (c.basis) line(`      basis: ${c.basis}`)
  }
  line()
  line('EVIDENCE CONFIDENCE')
  line(`  ${h.evidenceConfidence || 'not stated'}`)
  line()
  line('UNRESOLVED VERIFICATION QUESTIONS')
  list(h.claudeReview.unresolvedQuestions, 'none')
  line()
  line('GUIDED CHILDHOOD')
  line('  beliefs this touches:')
  list(h.gdcBeliefs)
  line('  product implications:')
  for (const [k, v] of Object.entries(h.productImplications)) if (v) line(`    ${k}: ${v}`)
  line()
  line('PRODUCTION DIRECTION')
  line(`  audience: ${h.recommendedAudience || 'not specified'}`)
  line(`  platforms: ${h.recommendedPlatforms?.join(', ') || 'not specified'}`)
  line(`  urgency: ${h.urgency || 'not specified'}`)
  line()
  line('FOR STAGE 2')
  line('  Read this against the GDC Daily Content Operating System, the Current')
  line('  Posting Pack and the GDC POST REGISTER mirror in this folder.')
  line('  (An earlier version of this template also named a Story Bible. The audit')
  line('  on 10 November found no such document in Drive, so it is not listed.)')
  line('  Normal LinkedIn length is 250 to 450 words. The question goes last with')
  line('  nothing after it. No link in the post body: it belongs in the first')
  line('  comment. No dashes anywhere. Nothing publishes without Justin.')
  line()
  line('  Machine readable version of this handoff: ' + (h.supportingFiles.find((f) => String(f).endsWith('.json')) || `handoff-${h.researchId}.json`))
  return L.join('\n')
}
