#!/usr/bin/env node
// Draft a story spec from a Claude reviewed research record.
//
//   node scripts/build-spec.mjs GDC-RR-xxxxxxxxxx
//
// Writes content/motion/GDC-NNN/spec.json as a DRAFT. The draft takes every
// word from the record (the proposed title, the first cleared figure, the
// first limitation, the journal and date). A person then shortens it to fit
// the card, and the gate checks the result before anything renders. This
// script never claims a GDC number, never changes the record and never
// touches the Drive handoff or Metricool.

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkSpec, numbersIn } from './gate.mjs'

const ENGINE = dirname(dirname(fileURLToPath(import.meta.url)))
const ROOT = join(ENGINE, '..', '..')
process.chdir(ROOT) // the register reads content/research-register from the working directory
// The register finds its folder from the working directory. Point it at the
// repository's own, whichever folder this script was started from.
process.env.RADAR_REGISTER ||= join(ROOT, 'content/research-register')
const reg = await import(join(ROOT, 'scripts/radar/register.mjs'))

const id = process.argv[2]
if (!id) { console.error('usage: node scripts/build-spec.mjs <researchId>'); process.exit(2) }
const rec = reg.get(id)
if (!rec) { console.error(`HOLD: no research record ${id}`); process.exit(1) }

const refuse = []
if (rec.claudeStatus !== 'CLAUDE REVIEWED') refuse.push(`Claude status is ${rec.claudeStatus || 'missing'}`)
if (!['SHIP', 'EDIT'].includes(rec.claudeReview?.verdict)) refuse.push(`review verdict is ${rec.claudeReview?.verdict || 'missing'}`)
if (!rec.gdcPostNumber) refuse.push('no GDC number yet. Numbers are claimed only through the pipeline, never here')
if (refuse.length) { console.error(`HOLD: ${id} cannot be made into a card: ${refuse.join('; ')}`); process.exit(1) }

const cr = rec.claudeReview
const firstFigure = (cr.verifiedStatistics || [])[0] || ''
const figure = numbersIn(firstFigure)[0]
const date = rec.dossier?.crossrefOnlineDate || rec.published || ''
const when = date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

const spec = {
  draft: true,
  gdcPostNumber: String(rec.gdcPostNumber),
  researchId: rec.studyId,
  notForPublication: false,
  eyebrow: 'NEW RESEARCH',
  headline: cr.proposedTitle || rec.title,
  finding: { figure: figure ? (/percent/i.test(firstFigure) ? `${figure}%` : figure) : undefined, text: firstFigure },
  context: cr.oneTakeaway || '',
  source: `SOURCE  ${rec.journal || 'see the paper'}${when ? `, ${when}` : ''}`,
  limitation: (cr.limitations || [])[0] || '',
  backgroundVideo: null,
  objectImage: null,
  durationSeconds: 14,
  builtFrom: { at: new Date().toISOString(), clearedFigures: cr.verifiedStatistics || [], limitations: cr.limitations || [] },
}

const dir = join(ROOT, 'content/motion', `GDC-${rec.gdcPostNumber}`)
const file = join(dir, 'spec.json')
if (existsSync(file)) { console.error(`HOLD: ${file} already exists. Edit it, or move it aside first. Nothing was overwritten.`); process.exit(1) }
mkdirSync(dir, { recursive: true })
writeFileSync(file, JSON.stringify(spec, null, 2) + '\n')

const g = checkSpec(spec, rec)
console.log(`DRAFT written: ${file.replace(ROOT + '/', '')}`)
console.log(g.verdict === 'PASS' ? 'The draft already passes the gate. Read it before rendering.' : 'The draft needs a person to shorten or fix it before it renders:')
for (const r of g.reasons) console.log(`  HOLD  ${r}`)
for (const w of g.warnings) console.log(`  NOTE  ${w}`)
