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
  'VISUAL BRIEF': ['visual', 'brief'],
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
    '',
    '=== FACEBOOK CAPTION ===',
    '',
    '=== NEWSLETTER ===',
    '',
    '=== VISUAL BRIEF ===',
    '(What the card shows. Approved brand assets only.)',
    '',
    '=== ASSETS USED ===',
    '(One approved asset per line, or NONE if the post goes out as text only.)',
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
    const body = buf.join('\n').replace(/^\s*\((?:[^()]|\([^()]*\))*\)\s*$/gm, '').trim()
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
  line('GitHub is the authority. This document is a copy. If it is more than a day old, ask Justin for a fresh one before writing.')
  line()
  line('WHAT TO WRITE NEXT')
  if (!next) {
    line('  Nothing. The queue is empty. Do not start a story that is not listed here.')
  } else {
    line(`  Research ID: ${next.researchId}`)
    line(`  GDC post number: ${next.gdcPostNumber || 'none yet, see THE NUMBER RULE'}`)
    line(`  Working title: ${next.proposedTitle || next.title}`)
    line(`  Priority: ${next.editorialPriority}. ${next.urgency || ''}`)
    line(`  Formats: ${(next.recommendedPlatforms || []).join(', ') || 'LinkedIn post'}`)
    line(`  Claude review: ${next.claudeStatus}, verdict ${next.claudeVerdict}`)
    line(`  Handoff, version ${next.handoffVersion ?? 'unknown'}, to read in full before writing:`)
    line(`    for people: ${next.handoffDoc || 'not yet in Drive'}`)
    line(`    machine readable: ${url(links.handoffJson || next.handoffJsonDriveFileId)}`)
    if (m.queue.length > 1) line(`  ${m.queue.length - 1} more behind it. Take them in the order the manifest gives.`)
  }
  line()
  line('THE FIGURES YOU MAY USE')
  const cleared = rec?.claudeReview?.verifiedStatistics || []
  if (!cleared.length) line('  None. Do not put a number in the copy.')
  for (const c of cleared) line(`  ${c}`)
  line('  No other number may appear anywhere in the pack. The check compares every figure against this list.')
  line()
  line('WHAT YOU MAY NOT SAY')
  for (const p of rec?.claudeReview?.notQuotable || []) line(`  ${p}`)
  for (const p of rec?.claudeReview?.whatThisDoesNotProve || []) line(`  This research does not prove: ${p}`)
  line('  Never claim an outcome for a child. Never "safe online" or "ready for social media".')
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
  line('WHAT ELSE TO READ')
  line(`  GDC Daily Content Operating System: https://docs.google.com/document/d/${DRIVE.OPERATING_SYSTEM}/edit`)
  line(`  Current LinkedIn Posting Pack: https://docs.google.com/document/d/${DRIVE.POSTING_PACK}/edit`)
  line(`  The queue, machine readable: ${url(links.manifest)}`)
  line('  There is no Story Bible in Drive. If an older instruction names one, ignore that line.')
  line()
  line('HOW TO HAND THE PACK BACK')
  line(`  Save ONE Google Doc in this folder: https://drive.google.com/drive/folders/${DRIVE.STAGE2_FOLDER}`)
  line(`  Title it exactly: PACK ${next ? next.researchId : 'GDC-RR-xxxxxxxxxx'} GDC-${next?.gdcPostNumber || 'NNN'} DRAFT v1`)
  line('  Use exactly this layout, with the labels unchanged:')
  line()
  for (const t of packTemplate({ researchId: next?.researchId || 'GDC-RR-xxxxxxxxxx', gdcPostNumber: next?.gdcPostNumber, handoffVersion: next?.handoffVersion,
    // The handoff's commit, not the repository's. The first version put the
    // current head here, so the document changed on every commit to anything
    // and was reported stale the moment it was pushed. A pack is written from
    // a handoff, and the handoff's commit only moves when the handoff does.
    sourceCommit: next?.handoffSourceCommit || r.commit }).split('\n')) line(`    ${t}`)
  line()
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
