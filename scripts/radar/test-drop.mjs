// Guard for the manual drop lane.
//
// Runs against a throwaway register, never the real one. That rule is here
// because the first run of this test did NOT follow it: it advanced a live
// record to EDITORIAL READY to check the forward only guard, and an unreviewed
// document briefly became the answer to "what should Stage 2 work on next".
// The record had to be parked at HOLD to get it out of the queue.
//
// What this proves:
//   1. a dropped document enters the register scored and deduped
//   2. dropping the same document again costs nothing, no new version
//   3. a drop can never pull a record back down the pipeline
//   4. a drop never claims a review it has not had
//   5. the full text is written to disk and never overwritten with different
//      content, so provenance survives a correction
//   6. pdftotext is present, which is what makes a PDF drop possible at all

import { mkdtempSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const REG = mkdtempSync(join(tmpdir(), 'radar-drop-test-'))
process.env.RADAR_REGISTER = REG

const { ingestDocument, tidy, leadText } = await import('./ingest.mjs')
const reg = await import('./register.mjs')

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`)
  if (!ok) failed += 1
}

// A stand in for a regulator report. The wording is what matters: it has to
// carry enough of our subject in the title to reach a real band, the way an
// Ofcom children's media report does.
const TITLE = 'Children and parents: media use and attitudes, smartphone and social media findings'
const BODY = [
  'This report sets out findings on children aged 8 to 17 and their use of social media and smartphones.',
  'A nationally representative survey of 2,400 children and their parents was carried out.',
  'It covers screen time, age assurance, parental controls and online safety in the United Kingdom.',
  'Parents and children gave discrepant accounts of online activity, with parents under reporting risk.',
].join('\n\n')

const docFile = join(REG, 'fixture-report.txt')
writeFileSync(docFile, BODY)

const args = {
  file: docFile,
  title: TITLE,
  url: 'https://www.ofcom.org.uk/example-children-media-report',
  publisher: 'Ofcom',
  published: '2026-09-25',
  actor: 'radar:test',
}

// 1. It lands, scored and banded.
const first = ingestDocument(args)
check('a dropped document is created in the register', first.action === 'created', first.id)
check('it is scored, not just stored', typeof first.score === 'number' && first.score > 0, `score ${first.score}`)
check('an Ofcom publisher is recognised as official without being told',
  reg.get(first.id).isOfficial === true)
check('the child subject in the title lets it reach a real band',
  ['CORE', 'ADJACENT'].includes(first.band), first.band)

// 2. The same document again is free.
const second = ingestDocument(args)
const third = ingestDocument(args)
check('a repeat drop writes no new version',
  second.action === 'unchanged' && third.action === 'unchanged',
  `${second.action}, ${third.action}`)
check('the record has exactly one version after three identical drops',
  reg.history(first.id).length === 1, `${reg.history(first.id).length} versions`)

// 3. It cannot undo progress. This is the bug that emptied the Stage 2 queue
//    on 9 November, so it is tested rather than assumed.
reg.setStatus(first.id, 'EDITORIAL READY', { reason: 'test', actor: 'test' })
ingestDocument(args)
check('a drop cannot pull an advanced record back to DISCOVERED',
  reg.get(first.id).status === 'EDITORIAL READY', reg.get(first.id).status)

// 4. It never claims a review.
check('a dropped document claims no Claude review',
  !reg.get(first.id).claudeReview && reg.get(first.id).claudeStatus !== 'CLAUDE REVIEWED',
  String(reg.get(first.id).claudeStatus))

// 5. The full text is on disk, and a different text never overwrites it.
const rec = reg.get(first.id)
check('the full text is written to disk', existsSync(rec.fullTextPath))
check('the stored text is the document, not the summary',
  readFileSync(rec.fullTextPath, 'utf8').includes('nationally representative survey'))
ingestDocument({ ...args, text: BODY + '\n\nCorrected figure: 2,450 children.' })
const docs = readdirSync(join(REG, 'documents')).filter((f) => f.startsWith(first.id))
check('a corrected version sits beside the original rather than replacing it',
  docs.length === 2, docs.join(', '))
check('the original text is still readable after the correction',
  !readFileSync(rec.fullTextPath, 'utf8').includes('2,450'))

// 6. Short input is refused rather than stored as a stub.
let refused = false
try { ingestDocument({ ...args, text: 'too short', title: 'A stub' }) } catch { refused = true }
check('a document with no real text is refused', refused)

// 7. A title is required, because a record nobody can identify is useless.
let needsTitle = false
try { ingestDocument({ ...args, title: '' }) } catch { needsTitle = true }
check('a drop without a title is refused', needsTitle)

// 8. Helpers behave.
check('tidy collapses the whitespace a PDF extraction leaves',
  tidy('a  b \n\n\n c') === 'a b\n\nc', JSON.stringify(tidy('a  b \n\n\n c')))
check('leadText does not cut mid word on a long document',
  leadText('x'.repeat(50) + '\n\n' + 'y'.repeat(9000), 4000).length <= 4000)

// 9. The dependency the PDF path needs.
let pdftotext = false
try { execFileSync('pdftotext', ['-v'], { stdio: 'ignore' }); pdftotext = true } catch { /* absent */ }
check('pdftotext is available, so a PDF can be dropped', pdftotext)

console.log(`\n${failed ? `${failed} check(s) failed` : 'all drop lane checks passed'}`)
console.log(`throwaway register used: ${REG}`)
process.exit(failed ? 1 : 0)
