// The format a production pack comes back in, and the one document Stage 2
// starts from.
//
// ChatGPT writes into Google Docs, and a Google Doc read back through the
// Drive connector arrives as markdown with its own escaping. JSON does not
// survive that trip reliably, so the pack is plain labelled sections instead:
// a format a person can read on a phone and a parser can read without
// guessing. The parser is deliberately forgiving about decoration (bold,
// heading marks, escaped punctuation) and strict about content: a section it
// cannot find is simply absent, and the QA gate then holds the pack for it.
//
// Requirement 4 of the repair brief: "Every output must retain its research
// ID, post number, source references and version." Those are the header
// fields, and a pack without them fails QA by name.

import { repoState, sha256, parsePostRegister, nextFreeNumber, unmangle, DRIVE } from './contract.mjs'
import { buildManifest } from './manifest.mjs'
import { LIMITS } from './qa.mjs'
import * as reg from './register.mjs'
import { recentReceipts, SCHEMA_ID } from './candidates.mjs'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Justin's own numbers, boiled down to a few lines Stage 2 can act on. The
// evidence file is the authority and this is its summary: when he pastes new
// analytics, the dated file in content/analytics/ is written first and this
// is rewritten from it. Without it ChatGPT keeps writing the opening that
// lost last week, because nothing ever told it which one won.
const WORKING = fileURLToPath(new URL('../../content/analytics/what-is-working.json', import.meta.url))
export function whatIsWorking(path = WORKING) {
  if (!existsSync(path)) return null
  try {
    const w = JSON.parse(readFileSync(path, 'utf8'))
    return Array.isArray(w.lines) && w.lines.length ? w : null
  } catch { return null }
}

// What every evidence pack carries (Justin, 24 November 2026): "Each pack must
// include a LinkedIn post, Instagram caption, Facebook adaptation, first
// comments and verified sources, platform specific visual briefs, and motion
// graphics requirements where appropriate." Newsletter and Reel stay optional:
// the handoff asks for those per story. The handoff's recommended platform is
// still the lead, and the cleared figures are still the only figures.
export const CORE_FORMATS = ['LinkedIn post', 'first comment with the verified source', 'Instagram caption', 'Facebook adaptation', 'a visual brief for each platform', 'motion requirements where the story has one clean finding']

// Three personal LinkedIn posts per calendar week, Monday to Sunday, counting
// bookings Justin made in LinkedIn himself (decision of 17 November). A pack
// completed beyond that is held in reserve, never squeezed in.
export const WEEKLY_LINKEDIN_CAP = 3

// Approved or verified posts that did not come through the radar queue but
// still need their full pack (Justin, 24 November 2026). GitHub keeps the list
// and START HERE prints it, so Stage 2 completes them on its normal run
// instead of Justin carrying them across one by one.
const COMPLETION = fileURLToPath(new URL('../../content/research-register/completion-queue.json', import.meta.url))
export function completionQueue(path = COMPLETION) {
  if (!existsSync(path)) return []
  try {
    const q = JSON.parse(readFileSync(path, 'utf8'))
    return (Array.isArray(q.items) ? q.items : []).filter((i) => i && i.gdc && !['COMPLETED', 'POSTED', 'WITHDRAWN', 'SUPERSEDED', 'HOLD'].includes(String(i.state || '').toUpperCase()))
  } catch { return [] }
}

const HEADER_FIELDS = {
  'RESEARCH ID': 'researchId',
  'GDC POST NUMBER': 'gdcPostNumber',
  'HANDOFF VERSION': 'handoffVersion',
  'SOURCE COMMIT': 'sourceCommit',
  'STATUS': 'status',
}

/** How a section says it has been left out on purpose. */
const DECLINED = /^(none\b|n\/a\b|not (recommended|warranted|applicable|required|needed|used)\b|no (asset|visual|card|image)s?\b|text only\b)/i

const SECTIONS = {
  'LINKEDIN POST': ['linkedin', 'body'],
  'FIRST COMMENT': ['linkedin', 'firstComment'],
  'INSTAGRAM CAPTION': ['instagram', 'caption'],
  'FACEBOOK CAPTION': ['facebook', 'caption'],
  'NEWSLETTER': ['newsletter', 'body'],
  'REEL SCRIPT': ['reel', 'script'],
  'EVIDENCE NOTES': ['evidence', 'notes'],
  'VISUAL BRIEF': ['visual', 'brief'],
  // The Evidence Reveal (Justin, 18 November 2026): three hooks with the one
  // chosen, and the Disrupt, Reveal, Reframe, Invite storyboard.
  'HOOKS': ['reveal', 'hooks'],
  'STORYBOARD': ['reveal', 'storyboard'],
  // The five lines a research card is built from (tools/motion-engine).
  // Optional: only an evidence post whose visual is a still or motion has one.
  'CARD TEXT': ['card', 'text'],
  'ASSETS USED': ['visual', 'assetsUsed'],
  'SOURCES': ['sources', null],
}

/** The empty pack, as text, for Stage 2 to fill in. */
export function packTemplate({ researchId, gdcPostNumber, handoffVersion, sourceCommit }) {
  return [
    `RESEARCH ID: ${researchId}`,
    `GDC POST NUMBER: ${gdcPostNumber || 'CLAIM THE NEXT FREE NUMBER IN GITHUB FIRST'}`,
    `HANDOFF VERSION: ${handoffVersion ?? ''}`,
    `SOURCE COMMIT: ${sourceCommit || ''}`,
    'STATUS: DRAFT',
    '',
    '=== LINKEDIN POST ===',
    '(250 to 450 words. The closing question is the last sentence. No link. No dashes.)',
    '',
    '=== FIRST COMMENT ===',
    '(The link to the source, and the strongest objection answered.)',
    '',
    '=== INSTAGRAM CAPTION ===',
    '(Required. Written for Instagram, not the LinkedIn post pasted in. Shorter, the finding said plainly, the limit kept, no link in the caption. Only cleared figures.)',
    '',
    '=== FACEBOOK CAPTION ===',
    '(Required. Written to parents in family language, a practical question at the end. Only cleared figures. No dashes.)',
    '',
    '=== NEWSLETTER ===',
    '',
    '=== REEL SCRIPT ===',
    '(Only if the handoff asks for a Reel or Short. Spoken lines as Justin would say them, and the on screen words. Otherwise NOT RECOMMENDED and why.)',
    '',
    '=== HOOKS ===',
    '(Three openings, each a different kind: reversal, missing variable, comparison, uncomfortable question, overlooked finding or practical consequence. One per line, as TYPE: the hook. Mark the one used CHOSEN, and say in one line why the other two lost. No hook may imply a cause the study did not show, inflate the risk, misdescribe who was studied or drop a qualification the finding needs.)',
    '',
    '=== STORYBOARD ===',
    '(Four beats, with seconds that suit the story: DISRUPT, the chosen hook on screen; REVEAL, the finding with its figure; REFRAME, what it does and does not mean, with the limit; INVITE, the question or the practical step. Then COVER: the static frame that works alone. Then CAROUSEL: slide by slide if a carousel helps, otherwise NOT RECOMMENDED. Every essential claim readable with the sound off.)',
    '',
    '=== VISUAL BRIEF ===',
    '(Required. One line per platform, each starting with its label. LINKEDIN: the still or carousel, 1080 by 1350. INSTAGRAM: the carousel or single card, 1080 by 1350, and the Reel cover if there is one. FACEBOOK: the image, 1080 by 1350 or 1200 by 630. MOTION: what moves and for how long, 30 frames a second, a still hold of at least five seconds at the end; or NOT NEEDED and the reason. Approved brand assets only, no GDC number on any public graphic.)',
    '',
    '=== CARD TEXT ===',
    '(Every evidence post has a card by default. Five lines. HEADLINE is contrarian: it turns the obvious reading round and stays inside what the study shows. Lines: HEADLINE: under 110 characters. FINDING: under 110, the figure exactly as cleared. CONTEXT: under 140. SOURCE: journal and date. LIMITATION: one line, in the record\'s own words. Under 45 words in all. Then two production lines that are not counted: TIMING: seconds for each beat. VISUAL: black and white editorial paper, one restrained yellow highlight, what moves and when. Write NOT RECOMMENDED only when the story has no single clean finding, and say why.)',
    '',
    '=== ASSETS USED ===',
    '(One approved asset per line, or NONE if the post goes out as text only.)',
    '',
    '=== EVIDENCE NOTES ===',
    '(What this research does not show, and any claim you chose not to make. Taken from the handoff, in your own plain words.)',
    '',
    '=== SOURCES ===',
    '(One URL per line, taken from the handoff.)',
  ].join('\n')
}

/**
 * Turn the text of a pack document into the object the QA gate checks.
 * Accepts the text exactly as the Drive connector returns it.
 */
export function parsePackText(text) {
  const clean = unmangle(text).replace(/\r/g, '')
  const lines = clean.split('\n')
  const pack = {}
  let current = null
  let buf = []

  const flush = () => {
    if (!current) return
    const [group, field] = SECTIONS[current]
    // Bracketed guidance left in from the template is not content.
    // Drive doubles the blank line between paragraphs, on a read and on an
    // export alike. Left alone, a post copied from the desk pastes into
    // LinkedIn with two blank lines between every paragraph. One blank line.
    const body = buf.join('\n').replace(/^\s*\((?:[^()]|\([^()]*\))*\)\s*$/gm, '').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim()
    // A section that says there is nothing here is a decision, not copy. The
    // first real pack from Stage 2, on 10 November, filled three sections with
    // "NOT RECOMMENDED FOR THIS HANDOFF..." and listed its assets as "NONE. No
    // approved visual asset was provided", and the parser read the first as
    // captions and the second as one approved asset. Both are kept, with the
    // reason given, under `declined`, and neither is treated as content.
    if (body && DECLINED.test(body)) {
      pack.declined = pack.declined || {}
      pack.declined[current] = body.replace(/\s+/g, ' ')
      if (group === 'visual' && field === 'assetsUsed') { pack.visual = pack.visual || {}; pack.visual.assetsUsed = [] }
      buf = []
      return
    }
    if (body) {
      if (group === 'sources') pack.sources = body.split('\n').map((x) => x.trim()).filter(Boolean)
      else {
        pack[group] = pack[group] || {}
        pack[group][field] = field === 'assetsUsed' ? body.split('\n').map((x) => x.replace(/^[-*•]\s*/, '').trim()).filter(Boolean) : body
      }
    }
    buf = []
  }

  for (const raw of lines) {
    // Strip the decoration a Doc adds around a label: bold, heading marks.
    const bare = raw.replace(/^[#>\s]+/, '').replace(/\*\*/g, '').trim()
    const sec = bare.match(/^=+\s*([A-Z ]+?)\s*=+$/)
    if (sec && SECTIONS[sec[1].trim()]) { flush(); current = sec[1].trim(); continue }
    if (!current) {
      const m = bare.match(/^([A-Z ]+?)\s*:\s*(.*)$/)
      if (m && HEADER_FIELDS[m[1].trim()]) {
        const v = m[2].trim()
        if (v) pack[HEADER_FIELDS[m[1].trim()]] = v
      }
      continue
    }
    buf.push(raw.replace(/\s+$/, ''))
  }
  flush()

  // CARD TEXT arrives as five labelled lines. Read them into fields so the
  // pack checks can put them through the same gate the engine uses.
  if (pack.card?.text) {
    const want = { HEADLINE: 'headline', FINDING: 'finding', CONTEXT: 'context', SOURCE: 'source', LIMITATION: 'limitation', TIMING: 'timing', VISUAL: 'visual' }
    for (const l of pack.card.text.split('\n')) {
      const m = l.replace(/^[-*•\s]+/, '').match(/^([A-Z]+)\s*:\s*(.+)$/)
      if (m && want[m[1]]) pack.card[want[m[1]]] = m[2].trim()
    }
  }

  if (pack.gdcPostNumber) {
    const n = String(pack.gdcPostNumber).match(/\d{2,3}/)
    pack.gdcPostNumber = n ? n[0].padStart(3, '0') : null
  }
  if (pack.handoffVersion) pack.handoffVersion = Number(String(pack.handoffVersion).match(/\d+/)?.[0]) || null
  return pack
}

/**
 * The one document Stage 2 opens first. Generated from the repository, so it
 * cannot disagree with the queue, the numbers or the rules, and stamped so a
 * reader can tell which state of the repository it describes.
 *
 * `links` carries the Drive file ids of the other artefacts, once they exist.
 */
export function stage2Brief({ links = {} } = {}) {
  const r = repoState()
  const m = buildManifest()
  const rows = parsePostRegister()
  const next = m.queue[0] || null
  const rec = next ? reg.get(next.researchId) : null
  const L = []
  const line = (s = '') => L.push(s)
  const url = (id) => (id ? `https://drive.google.com/file/d/${id}/view` : 'not yet in Drive')

  line('GDC STAGE 2, START HERE')
  line(`Generated ${new Date().toISOString()} from commit ${r.commit}${r.dirty ? ' (with uncommitted changes)' : ''}`)
  line('GitHub is the authority. This document is a copy, refreshed on every radar run.')
  // Justin, 24 November 2026: an older date alone must not stop production.
  // The old line told Stage 2 to stop and ask for a fresh copy when this was
  // more than a day old, so one failed refresh stopped every story, including
  // ones already verified. Eligibility is a status, not a date.
  line('  An older date on this document does not stop production. A story listed under WHAT TO WRITE or COMPLETE THESE stays eligible until it is completed, withdrawn, superseded or put on HOLD.')
  line('  Before writing, check the post register in the Stage 2 folder: if a story there is marked POSTED, WITHDRAWN, SUPERSEDED or HOLD, skip it. GitHub wins any disagreement.')
  line()
  line('WHAT TO WRITE')
  if (!next) {
    line('  Nothing. The queue is empty. Do not start a story that is not listed here.')
    line()
  } else {
    line(`  ${m.queue.length} ${m.queue.length === 1 ? 'story is' : 'stories are'} cleared. Write each one as its own pack, in this order.`)
    line('  A story that is not in this list is not cleared, whatever the daily brief says about it.')
    line()
    // Every story, each with its own figures and limits. The first version of
    // this document described only the first story, so a run that could have
    // written three packs wrote one and Justin had to ask for the others.
    m.queue.forEach((q, i) => {
      const r2 = reg.get(q.researchId)
      const number = q.gdcPostNumber ? `GDC-${String(q.gdcPostNumber).padStart(3, '0')}` : 'no number yet, see THE NUMBER RULE'
      line(`STORY ${i + 1} OF ${m.queue.length}: ${q.researchId}, ${number}`)
      line(`  Working title: ${q.proposedTitle || q.title}`)
      line(`  Priority: ${q.editorialPriority}. ${q.urgency || ''}`)
      line(`  Formats to produce: ${CORE_FORMATS.join(', ')}. Lead platform: ${(q.recommendedPlatforms || []).join(', ') || 'LinkedIn post'}. Newsletter and Reel only if the handoff asks; otherwise write NOT RECOMMENDED under those two.`)
      line(`  Claude review: ${q.claudeStatus}, verdict ${q.claudeVerdict}`)
      line(`  Handoff version ${q.handoffVersion ?? 'unknown'}, source commit ${q.handoffSourceCommit || 'see the handoff'}. Read it in full before writing:`)
      line(`    for people: ${(links.handoffDocs || {})[q.researchId] || q.handoffDoc || 'not yet in Drive'}`)
      line(`    machine readable: ${url((links.handoffJsons || {})[q.researchId] || (i === 0 ? links.handoffJson : null) || q.handoffJsonDriveFileId)}`)
      line(`  Title the pack exactly: PACK ${q.researchId} ${q.gdcPostNumber ? `GDC-${String(q.gdcPostNumber).padStart(3, '0')}` : 'GDC-NNN'} DRAFT v1`)
      line('  The figures you may use, and no others:')
      const cl = r2?.claudeReview?.verifiedStatistics || []
      if (!cl.length) line('    None. Do not put a number in the copy.')
      for (const c of cl) line(`    ${c}`)
      line('  What you may not say:')
      for (const p of r2?.claudeReview?.notQuotable || []) line(`    ${p}`)
      for (const p of r2?.claudeReview?.whatThisDoesNotProve || []) line(`    This research does not prove: ${p}`)
      line()
    })
  }
  const completing = completionQueue()
  if (completing.length) {
    line('COMPLETE THESE')
    line('  Posts already written and verified that still need the rest of their pack. Keep the LinkedIn post and first comment exactly as they are; write what is missing.')
    line('  No figure may appear that is not already in that post or its first comment. Nothing new is claimed.')
    line()
    completing.forEach((c, i) => {
      line(`ITEM ${i + 1} OF ${completing.length}: GDC-${String(c.gdc).padStart(3, '0')}, ${c.state}${c.slot ? `, LinkedIn slot ${c.slot}` : ', held in reserve'}`)
      line(`  Working title: ${c.title}`)
      if (c.sourceDoc) line(`  The approved copy and its checks: ${c.sourceDoc}`)
      if (c.repoPack) line(`  In GitHub: ${c.repoPack}`)
      line(`  Still needed: ${(c.needs || CORE_FORMATS).join(', ')}`)
      if (c.note) line(`  Note: ${c.note}`)
      line(`  Title the pack exactly: PACK GDC-${String(c.gdc).padStart(3, '0')} COMPLETE v1`)
      line()
    })
  }
  line('FOR EVERY STORY')
  line(`  Every pack carries: ${CORE_FORMATS.join(', ')}.`)
  line('  No number may appear anywhere in a pack unless it is in that story\'s own list above. The check compares every figure against it.')
  line('  Never claim an outcome for a child. Never "safe online" or "ready for social media".')
  line('  Every evidence pack ends with the CARD TEXT section: HEADLINE, FINDING, CONTEXT, SOURCE, LIMITATION, under 45 words in all.')
  line('  The HEADLINE reverses the obvious expectation and stays defensible: it must be true of the study as reviewed, with no causal wording and no figure outside the list.')
  line('  Write NOT RECOMMENDED under CARD TEXT only when the story has no single clean finding, and say why.')
  line('  THE EVIDENCE REVEAL: challenge an assumption without stretching the evidence. Write three hooks of different kinds under HOOKS and mark the one used CHOSEN.')
  line('  Reject any hook that implies a cause the study did not show, inflates the risk, misdescribes who was studied or drops a needed qualification. The check reads every hook for figures and causal words.')
  line('  Then the STORYBOARD: DISRUPT, REVEAL, REFRAME, INVITE, with seconds that suit the story, a COVER that works as a still, and a CAROUSEL only where it helps.')
  line('  CARD TEXT adds TIMING and VISUAL lines. The look is black and white editorial paper with one restrained yellow highlight and slow, deliberate motion. Nothing essential depends on sound.')
  line()
  line('THE WEEKLY LIMIT')
  line(`  At most ${WEEKLY_LINKEDIN_CAP} personal LinkedIn posts per calendar week, Monday to Sunday, counting anything Justin booked in LinkedIn himself.`)
  line('  A pack finished beyond that is held in reserve: complete it, do not schedule it. It takes the next free Monday, Wednesday or Friday at 08:00 once Justin approves it.')
  line('  Metricool: an approved pack may be saved as a Metricool DRAFT for its slot. Never switch on automatic publishing and never schedule a pack Justin has not approved.')
  line()
  line('THE NUMBER RULE')
  line('  Post numbers are claimed in GitHub and nowhere else. You cannot write to GitHub.')
  line(`  The next free number is GDC-${nextFreeNumber()}. Do not use it. If a story has no number, write NONE and stop: Justin or Claude claims it.`)
  line(`  ${rows.length} numbers are taken. The full list: ${url(links.postRegister)}`)
  line(`  Already posted, never reuse: ${rows.filter((x) => x.posted).map((x) => x.number).join(', ')}`)
  line()
  line('THE HOUSE RULES THE CHECK ENFORCES')
  line(`  LinkedIn post: ${LIMITS.linkedinWordsMin} to ${LIMITS.linkedinWordsMax} words.`)
  line('  The single closing question is the last sentence, with nothing after it.')
  line('  No link in the post. The source link goes in the first comment.')
  line('  The post says, in one plain line, that the source is in the comments.')
  line('  In the paragraph before the closing question, one repost ask written for this post\'s own argument. No follow ask.')
  line('  The closing question is one a parent or a teacher answers from experience, not "do you agree".')
  line('  Vary the sentences. One that runs long, one of five words or fewer. A post where every sentence is the same length reads as machine written.')
  line('  If a section does not apply, write NOT RECOMMENDED and the reason. If there is no card, write NONE under ASSETS USED.')
  line('  No dashes anywhere, of any length.')
  line('  The opening and the close must not repeat an earlier post.')
  line('  Visuals use approved brand assets only. No invented screen, no regenerated character, no synthetic person shown as a real parent.')
  line('  Do not mark anything APPROVED or PUBLISHED. Only Justin does that.')
  line()
  const working = whatIsWorking()
  if (working) {
    line(`WHAT IS WORKING ON LINKEDIN, from Justin's own numbers of ${working.asOf}`)
    line(`  ${working.standing}`)
    for (const l of working.lines) line(`  ${l}`)
    line('  None of this loosens a rule above. A cleared figure is still the only figure, and the limit still travels with the claim.')
    line()
  }
  line('WHAT ELSE TO READ')
  line(`  GDC Daily Content Operating System: https://docs.google.com/document/d/${DRIVE.OPERATING_SYSTEM}/edit`)
  line(`  Current LinkedIn Posting Pack: https://docs.google.com/document/d/${DRIVE.POSTING_PACK}/edit`)
  line(`  The queue, machine readable: ${url(links.manifest)}`)
  line('  There is no Story Bible in Drive. If an older instruction names one, ignore that line.')
  line()
  line('HOW TO HAND THE PACK BACK')
  line(`  Save each pack as a Google Doc in this folder: https://drive.google.com/drive/folders/${DRIVE.STAGE2_FOLDER}`)
  line('  One Doc per story, titled as shown under that story above. Never two stories in one Doc.')
  line('  Use exactly this layout, with the labels unchanged:')
  line()
  for (const t of packTemplate({ researchId: next?.researchId || 'GDC-RR-xxxxxxxxxx', gdcPostNumber: next?.gdcPostNumber, handoffVersion: next?.handoffVersion,
    // The handoff's commit, not the repository's. The first version put the
    // current head here, so the document changed on every commit to anything
    // and was reported stale the moment it was pushed. A pack is written from
    // a handoff, and the handoff's commit only moves when the handoff does.
    // And never the repository head as a fallback. With an empty queue that is
    // what this printed, so the document went stale on the next commit to
    // anything, the same fault as before by a different door.
    sourceCommit: next?.handoffSourceCommit || 'COPY IT FROM THE HANDOFF' }).split('\n')) line(`    ${t}`)
  line()
  // The only channel back to Stage 2. Claude cannot message ChatGPT, so what
  // was found in its last pack is written here, where it reads first.
  const returned = reg.all().filter((x) => x.pack && x.packQa).sort((a, b) => String(b.pack.submittedAt).localeCompare(String(a.pack.submittedAt))).slice(0, 3)
  if (returned.length) {
    line('WHAT HAPPENED TO THE PACKS ALREADY HANDED BACK')
    for (const x of returned) {
      const n = x.gdcPostNumber ? `GDC-${String(x.gdcPostNumber).padStart(3, '0')}` : 'no number'
      line(`  ${x.studyId} ${n}: automatic checks ${x.packQa.verdict}, Claude review ${x.packReview?.verdict || 'not yet done'}, now ${x.status}.`)
      if (x.status !== 'EDITORIAL READY') line('    Do not write this story again. It is no longer in the queue.')
      for (const f of (x.packQa.failures || []).slice(0, 6)) line(`    Held on: ${f.check}. ${f.why}`)
      for (const l of String(x.packReview?.notes || '').split('\n').filter(Boolean)) line(`    ${l}`)
      if (x.founderDecision?.state === 'CHANGES REQUESTED' && !x.founderDecision.resolvedAt) line(`    Justin asked for changes: ${x.founderDecision.note}`)
    }
    line()
  }
  // The other half of the relay: how research reaches Claude without Justin
  // carrying it, and what became of what was sent.
  line('HOW TO SEND RESEARCH TO CLAUDE')
  line(`  Save ONE document a day in the inbox: https://drive.google.com/drive/folders/${DRIVE.CANDIDATE_INBOX}`)
  line('  Title it: CANDIDATES YYYY-MM-DD. A .json file is best. A Google Doc or a .md file with the JSON in it is also read.')
  line(`  It must be JSON in the shape "${SCHEMA_ID}". The schema and an example to copy are in that folder, in the file that starts READ ME.`)
  line('  Every candidate needs the original link, the date the source was published, what you believe it shows, and what it cannot show.')
  line('  Leave researchId null for anything new. GitHub gives it an id. An empty list is a normal day.')
  line('  A candidate is not cleared. Do not write copy from one. It is cleared only when it appears under WHAT TO WRITE above.')
  line()
  const receipts = recentReceipts(3)
  if (receipts.length) {
    line('WHAT HAPPENED TO THE CANDIDATES YOU SENT')
    for (const b of receipts) {
      line(`  Batch ${b.batchId}, read ${String(b.ingestedAt).slice(0, 10)}:`)
      if (!b.results.length) line('    no candidates in it')
      for (const x of b.results) {
        const live = x.researchId ? reg.get(x.researchId) : null
        const where = x.outcome === 'INGESTED' ? `taken in as ${x.researchId}, now ${live?.status || 'DISCOVERED'}${live?.claudeReview ? `, review verdict ${live.claudeReview.verdict}` : ', not yet reviewed'}`
          : x.outcome === 'DUPLICATE' ? `already held. ${(x.reasons || []).join(' ')}`
            : `held. ${(x.reasons || []).join(' ')}`
        line(`    ${x.candidateId}: ${where}`)
      }
    }
    line()
  }
  line('WHAT HAPPENS NEXT')
  line('  Claude reads the pack, runs the automatic checks, and reviews it.')
  line('  If a check fails the pack is held and the reasons are written back. Fix those and save v2 as a new Doc.')
  line('  Only a pack that passes everything is put in front of Justin. Nothing is posted by anyone but him.')

  const text = L.join('\n')
  return { text, sha256: sha256(text), commit: r.commit, title: `GDC STAGE 2 START HERE [${r.shortCommit}${r.dirty ? ' DIRTY' : ''}] ${new Date().toISOString().slice(0, 16).replace('T', ' ')}` }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const b = stage2Brief()
  console.log(b.text)
}
