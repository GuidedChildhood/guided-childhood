// The daily founder research briefing, section by section as the protocol
// numbers them.
//
// Two rules shape this file.
//
// First, it is allowed to say nothing. NO MATERIAL UPDATE is a result. The
// research-radar skill already says the Monday sweep "is allowed to find
// nothing", and a daily brief that manufactures three discoveries to fill its
// own template is worse than no brief.
//
// Second, it never claims a Claude review that has not happened. A study with
// claudeStatus PENDING appears as a candidate awaiting review, never as a
// verified discovery. That is gate J of the protocol.

import * as reg from './register.mjs'
import { BLOCKED_SOURCES, WORKING_SOURCES } from './sources.mjs'

const d2 = (n) => String(n).padStart(2, '0')

export function buildBrief({ runStats = null, date = new Date() } = {}) {
  const today = date.toISOString().slice(0, 10)
  const all = reg.all()

  const reviewed = all.filter((r) => r.claudeStatus === 'CLAUDE REVIEWED')
  const awaiting = all.filter((r) => r.status === 'VERIFIED' && r.claudeStatus !== 'CLAUDE REVIEWED')
  const core = all.filter((r) => r.relevanceBand === 'CORE')
  const newToday = all.filter((r) => String(r.firstFound).slice(0, 10) === today)
  // Records whose whole text we hold, rather than an abstract. These came in
  // through the drop lane or the GOV.UK attachment lane, and they are the only
  // records where a figure may be quoted from the body of a document.
  const fullText = all.filter((r) => r.fullTextAvailable && r.fullTextPath)

  // The top three are drawn only from studies that have actually been through
  // a stored Claude review. If fewer than three exist, fewer than three are
  // shown, and the brief says why rather than padding.
  const top = reviewed
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, 3)

  // The strongest contradictory finding, taken from the reviews themselves,
  // because that is where a real one gets recorded.
  const contradictions = reviewed.flatMap((r) =>
    (r.claudeReview?.contradictoryEvidence || []).map((c) => ({ studyId: r.studyId, text: c })))

  // Editorial decision. BREAKING needs something that genuinely displaces the
  // queue, which is a high bar on purpose.
  let decision = 'NO MATERIAL UPDATE'
  let because = 'Nothing has been through a Claude review and come out strong enough to change what is scheduled.'
  const breaking = reviewed.find((r) => r.editorialPriority === 'BREAKING')
  if (breaking) {
    decision = 'BREAKING, consider replacing the scheduled post'
    because = `${breaking.studyId} was reviewed and marked BREAKING.`
  } else if (reviewed.some((r) => r.status === 'EDITORIAL READY')) {
    decision = 'BANK'
    because = `${reviewed.filter((r) => r.status === 'EDITORIAL READY').length} story candidate(s) are ready for Stage 2, none urgent enough to displace the queue.`
  }

  const L = []
  const line = (s = '') => L.push(s)

  line(`GDC RESEARCH RADAR, DAILY BRIEF`)
  line(`${today}, generated ${date.toISOString()}`)
  line()

  line('1. WHAT WAS SEARCHED, AND WHAT WAS NOT')
  if (runStats) {
    line(`   window ${runStats.window.since} to ${runStats.window.until}, ${runStats.window.days} days`)
    line(`   ${runStats.streamsRun} of 24 streams, ${runStats.jobs} stream and source jobs, ${runStats.requests} HTTP requests, ${runStats.seconds} seconds`)
    line(`   ${runStats.raw} raw hits, ${runStats.unique} unique studies after dedup and relevance gates`)
    if (runStats.failures?.length) line(`   ${runStats.failures.length} source failures, the run continued without them`)
  } else {
    line('   no discovery run attached to this brief')
  }
  line(`   sources working: ${WORKING_SOURCES.join(', ')}`)
  line('   LIMITATIONS, stated because the brief is worthless without them:')
  for (const b of BLOCKED_SOURCES) line(`     ${b.host}: ${b.status ?? 'not attempted'}. ${b.note}`)
  line('     Google Scholar has no API and is not scraped.')
  // This used to say flatly that full texts are not read. That stopped being
  // true on 10 November, when the drop and GOV.UK attachment lanes started
  // storing whole documents, so the brief now counts them rather than
  // understating what it has.
  if (fullText.length) {
    line(`     Full text IS held for ${fullText.length} record(s), listed in section 4. For every other record,`)
    line('     figures come from the abstract unless a dossier says otherwise.')
  } else {
    line('     Full texts are not read. Figures come from abstracts unless a dossier says otherwise.')
  }
  line()

  line('2. TOP DISCOVERIES, VERIFIED AND CLAUDE REVIEWED')
  if (!top.length) {
    line('   NONE. Nothing in the register has a stored Claude review today.')
    line(`   ${awaiting.length} study(ies) passed the automatic dossier and are waiting for a directed review.`)
    line(`   ${core.length} sit in the CORE relevance band.`)
    line('   This is a normal result. The protocol forbids presenting an unreviewed study as a verified discovery.')
  } else {
    top.forEach((r, i) => {
      const cr = r.claudeReview || {}
      const dd = r.dossier || {}
      line(`   ${d2(i + 1)}. ${r.title}`)
      line(`       what: ${cr.oneStory || 'not summarised'}`)
      line(`       why it matters: ${cr.oneTension || 'not summarised'}`)
      line(`       figures cleared: ${(cr.verifiedStatistics || []).join(' | ') || 'NONE, do not put a number in copy'}`)
      line(`       original: ${r.url || 'no URL'}  (${dd.design || 'design not determined'}, ${dd.peerReviewed ? 'peer reviewed' : 'PREPRINT'}, published ${dd.crossrefOnlineDate || r.published})`)
      line(`       confidence: ${cr.evidenceConfidence || 'not stated'}`)
      line(`       the caveat that matters: ${(cr.limitations || [])[0] || (dd.notes || [])[0] || 'none recorded'}`)
      line(`       for Guided Childhood: ${(cr.gdcBeliefs || [])[0] || 'no implication recorded'}`)
      line(`       Claude verdict: ${cr.verdict}  priority: ${r.editorialPriority || 'unset'}`)
      line()
    })
  }

  line('3. STRONGEST CONTRADICTORY OR NULL EVIDENCE')
  if (!contradictions.length) line('   none recorded, because nothing has been reviewed yet')
  else for (const c of contradictions.slice(0, 3)) line(`   (${c.studyId}) ${c.text}`)
  line()

  line('4. WHAT IS GENUINELY NEW')
  line(`   ${newToday.length} record(s) first seen today out of ${all.length} in the register.`)
  line('   Dedup is by DOI, PMID, PMCID, canonical URL and normalised title, so a study')
  line('   found again is an updated row rather than a new discovery.')
  if (fullText.length) {
    line(`   ${fullText.length} record(s) held in FULL TEXT, not as an abstract:`)
    for (const r of fullText) {
      line(`     (${r.studyId}) ${(r.words || 0).toLocaleString()} words, ${r.provenance?.lane || 'unknown lane'}`)
      line(`       ${String(r.title).slice(0, 96)}`)
    }
  }
  line()

  line('5. EDITORIAL DECISION')
  line(`   ${decision}`)
  line(`   ${because}`)
  line()

  line('6. ONE POTENTIAL GDC STORY')
  const story = top[0]
  if (!story) line('   none proposed. Nothing is reviewed.')
  else {
    const cr = story.claudeReview || {}
    line(`   ONE STORY: ${cr.oneStory || ''}`)
    line(`   ONE TENSION: ${cr.oneTension || ''}`)
    line(`   ONE GDC BELIEF: ${cr.oneBelief || ''}`)
    line(`   ONE TAKEAWAY: ${cr.oneTakeaway || ''}`)
    line(`   No GDC number assigned. ${story.gdcPostNumber || 'Stage 2 claims the next free number in content/gdc-post-register.md.'}`)
  }
  line()

  line('7. PRODUCT IMPLICATIONS')
  const pi = top[0]?.claudeReview?.productImplications
  if (!pi) line('   none recorded')
  else for (const [k, v] of Object.entries(pi)) if (v) line(`   ${k}: ${v}`)
  line()

  line('8. CLAUDE REVIEW STATUS AND OPEN QUESTIONS')
  line(`   reviewed: ${reviewed.length}   awaiting review: ${awaiting.length}   discovered only: ${all.filter((r) => r.status === 'DISCOVERED').length}`)
  for (const r of reviewed) {
    for (const q of (r.claudeReview?.unresolvedQuestions || []).slice(0, 3)) line(`   (${r.studyId}) ${q}`)
  }
  line()

  line('9. SOURCE LOG AND NEXT ACTIONS')
  line('   register: content/research-register/studies.jsonl, append only, every version kept')
  line('   queue for Stage 2: content/research-register/manifest.json')
  line('   handoffs: content/research-register/handoffs/')
  line('   Nothing here has been posted, emailed or sent. Justin posts.')

  return { text: L.join('\n'), decision, topCount: top.length, awaiting: awaiting.length }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const b = buildBrief()
  console.log(b.text)
}
