#!/usr/bin/env node
// Hand a checked render to the existing pipeline.
//
//   node scripts/record.mjs <outDir> --verdict PASS --review "what is on screen, in a sentence"
//
// Uses scripts/radar/assets.mjs, the same recorder every other asset goes
// through, so the ready gate and the approval sheet see the files with no new
// rules. It refuses unless check-report.json says every check passed, and it
// records the files as OPTIONAL: whether a post carries a visual is the visual
// decision on the research record, which this engine never changes. Copying to
// Drive is the afternoon run's job (scripts/radar/routines/midday.md, 5a),
// unchanged.

import { readFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ENGINE = dirname(dirname(fileURLToPath(import.meta.url)))
const ROOT = join(ENGINE, '..', '..')
const args = process.argv.slice(2)
// optional by default: offered as extra. required when Justin has asked for the
// visual, so the Metricool handoff marks it to attach and Drive must hold it.
const ROLE = args.includes('--role') ? args[args.indexOf('--role') + 1] : 'optional'
if (!['optional', 'required'].includes(ROLE)) { console.error('--role must be optional or required'); process.exit(2) }
const dir = resolve(args[0] || '')
const flag = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null }
const verdict = flag('--verdict')
const notes = flag('--review')

const reportPath = join(dir, 'render-report.json')
const checkPath = join(dir, 'check-report.json')
if (!existsSync(reportPath) || !existsSync(checkPath)) { console.error('HOLD: render and check first, so render-report.json and check-report.json exist'); process.exit(1) }
const report = JSON.parse(readFileSync(reportPath, 'utf8'))
const check = JSON.parse(readFileSync(checkPath, 'utf8'))
if (report.notForPublication) { console.error('HOLD: a NOT FOR PUBLICATION render is never recorded against a story'); process.exit(1) }
if (!check.passed) { console.error(`HOLD: the checks did not pass: ${check.fails.join('; ')}`); process.exit(1) }
if (!['PASS', 'HOLD'].includes(verdict) || String(notes || '').trim().length < 40) {
  console.error('HOLD: give a verdict (PASS or HOLD) and a review of 40 characters or more saying what is actually on screen')
  process.exit(1)
}

process.chdir(ROOT)
// The register finds its folder from the working directory. Point it at the
// repository's own, whichever folder this script was started from.
process.env.RADAR_REGISTER ||= join(ROOT, 'content/research-register')
const assets = await import(join(ROOT, 'scripts/radar/assets.mjs'))
const review = { verdict, notes, reviewedBy: 'Claude Code, motion engine' }
const source = `tools/motion-engine, ${report.engine}, from ${report.spec}`
for (const [kind, file] of [['motion', report.mp4.file], ['still image', report.png.file]]) {
  const r = assets.recordAsset(report.researchId, { kind, file: join(ROOT, file), role: ROLE, source, review })
  console.log(`${r.verdict}  ${kind}  ${file}${r.reasons?.length ? `  ${r.reasons.join('; ')}` : ''}`)
}
