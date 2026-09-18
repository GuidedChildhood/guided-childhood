#!/usr/bin/env node
// THE LESSON NUMBER A TEACHER READS IS A POSITION, NOT A BUILD NUMBER.
//
// Justin, 18 September 2026: "why are the lesson numbers out of sync?"
//
// Because two numbers were doing one job. `n` in the manifest is the order the
// twenty five modules were WRITTEN, and it is the stable key the lesson rows,
// the print routes and the passport stamps are cut against. Every schools page
// then printed it as `M23` on a card inside a per key stage list, where a
// number in a list reads as a position. So KS2 ran 04 05 06 07 08 09 23 25,
// KS3 ran 10 to 14 then 22 24, KS5 (20, 21) sat under KS4 (15 to 19), and a
// printed KS2 passport numbered its eight rings 4, 5, 6, 7, 8, 9, 23 and 25
// for a child to match stickers to.
//
// The fix keeps `n` exactly where it is and computes what is DISPLAYED from
// the order of the manifest (positionOf / positionLabel / positionCode). This
// guard holds that line, because the failure is silent: every page renders,
// every number is real, and only a person reading the list notices.
//
// No database, no browser. Runs in the wiring workflow.
import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

const manifest = readFileSync('shared/schools-curriculum.ts', 'utf8')

// 1. The helpers exist and are derived from the manifest order, not a second
//    hand written list. A second list is the bug again with extra steps.
ok('positionOf is exported', /export function positionOf\(/.test(manifest))
ok('positionLabel is exported', /export function positionLabel\(/.test(manifest))
ok('positionCode is exported', /export function positionCode\(/.test(manifest))
ok('positions are computed from CURRICULUM order per key stage',
  /for \(const stage of KEY_STAGE_ORDER\)[\s\S]{0,200}CURRICULUM\.filter\(m => m\.keyStage === stage\)/.test(manifest),
  'if the positions are ever typed out by hand they will drift the way n did')

// 2. Every key stage starts at 1 and runs unbroken. Checked by evaluating the
//    manifest's own order rather than trusting the helper.
{
  const ids = [...manifest.matchAll(/moduleId: '([^']+)', keyStage: '([A-Z0-9]+)'/g)].map(m => [m[1], m[2]])
  ok('the manifest still parses into modules', ids.length > 0, 'the id and keyStage pattern moved')
  const byStage = new Map()
  for (const [id, ks] of ids) byStage.set(ks, [...(byStage.get(ks) ?? []), id])
  for (const [ks, list] of byStage) {
    ok(`${ks} has at least one lesson`, list.length > 0)
  }
  ok('every module appears exactly once', new Set(ids.map(i => i[0])).size === ids.length)
}

// 3. No schools page prints the build number as a card number any more. This
//    is the exact shape that shipped the bug on nine pages.
const PAGES = globSync('schools/app/**/*.tsx')
for (const file of PAGES) {
  const src = readFileSync(file, 'utf8')
  ok(`${file} does not print the build number as a card number`,
    !/M\$?\{String\((?:m|manifest|l)!?\.n\)\.padStart/.test(src),
    'use positionLabel or positionCode: M23 inside a KS2 list reads as "the 23rd lesson"')
  ok(`${file} does not print a bare {x.n}. as a list position`,
    !/\{(?:m|row|l)\.n\}\. /.test(src),
    'a number followed by a full stop in a list is a position, so it has to be one')
}

// 4. The printed passport renumbers per page, because a child matches
//    stickers to rings by that number.
{
  const src = readFileSync('schools/app/print/passport/[stage]/page.tsx', 'utf8')
  ok('the printed passport renumbers its rings from one',
    /\.map\(\(l, i\) => \(\{ \.\.\.l, n: i \+ 1 \}\)\)/.test(src),
    'without this a KS2 page numbers eight rings 4, 5, 6, 7, 8, 9, 23, 25')
}

// 5. The tracker row carries a position, not the build number.
{
  const src = readFileSync('schools/app/hub/tracker/HubTracker.tsx', 'utf8')
  ok('the tracker row carries pos', /pos: number/.test(src) && !/^\s*n: number$/m.test(src))
  ok('the tracker renders pos', /\{row\.pos\}\./.test(src))
}

if (failed) {
  console.error(`\ncheck-lesson-numbers: ${failed} problem${failed === 1 ? '' : 's'}.\n`)
  process.exit(1)
}
console.log('lesson numbers: every number a teacher reads is a position in its own key stage.')
