#!/usr/bin/env node
// EVERY PARENT PIECE ENDS AT THE STAGE CHECK.
//
// The funnel is one door: a parent sees a post, answers three questions, and
// meets their child's stage (THE-STORY.md section 9). The marketing lens of
// the review board (12 November 2026) asked for a guard, so a piece that ends
// somewhere else is caught before Justin posts it rather than after.
//
// What it checks: each campaign piece (content/campaigns/<run>/NN-*.md) and
// each family week post (content/brand-story/weeks/<date>/<weekday>-*.md)
// carries the hook line "What stage is your child" AND a way in: a
// guidedchildhood.com/v/ code, a guidedchildhood.com/starter-pack link, or
// "link in bio".
//
// What it skips, on purpose: a piece whose table names a different audience
// with an "| Audience |" row. The schools run speaks to heads and safeguarding
// leads, and the playlists run is The Social Billboard, which never carries
// the Guided Childhood name. Those are decided audiences, not leaks.
//
// Node builtins only.   node scripts/check-stage-check-ending.mjs

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const HOOK = /what stage is your child/i
const DOOR = /guidedchildhood\.com\/(v\/|starter-pack)|link in (the |our )?bio|link is in (the |our )?bio/i
const OTHER_AUDIENCE = /^\|\s*Audience\s*\|/m
const DAYS = /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)-.*\.md$/

const targets = []
const dirs = (p) => (existsSync(p) ? readdirSync(p).filter((n) => statSync(join(p, n)).isDirectory()) : [])

for (const run of dirs('content/campaigns')) {
  const dir = join('content/campaigns', run)
  for (const n of readdirSync(dir)) if (/^\d+.*\.md$/.test(n)) targets.push(join(dir, n))
}
for (const week of dirs('content/brand-story/weeks')) {
  const dir = join('content/brand-story/weeks', week)
  for (const n of readdirSync(dir)) if (DAYS.test(n)) targets.push(join(dir, n))
}

const misses = []
let skipped = 0
for (const path of targets) {
  const text = readFileSync(path, 'utf8')
  if (OTHER_AUDIENCE.test(text)) { skipped++; continue }
  const lacks = []
  if (!HOOK.test(text)) lacks.push('the hook line "What stage is your child?"')
  if (!DOOR.test(text)) lacks.push('a /v/ code, a starter-pack link or "link in bio"')
  if (lacks.length) misses.push(`${path}: no ${lacks.join(' and no ')}`)
}

if (misses.length) {
  console.error('check-stage-check-ending FAILED\n')
  for (const m of misses) console.error(`  ${m}`)
  console.error('\nEvery parent piece ends at the stage check: "What stage is your child? Three')
  console.error('questions, no sign up." plus its /v/ link. A piece for another audience says so')
  console.error('with an "| Audience |" row in its table.')
  process.exit(1)
}
console.log(`check-stage-check-ending ok: ${targets.length - skipped} parent pieces end at the stage check, ${skipped} marked for another audience.`)
