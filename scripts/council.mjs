#!/usr/bin/env node
//
// THE LESSON COUNCIL: the counted checks.
//
// Justin, 9 September 2026: ten agents, each testing its findings, each scoring
// at least 8.5 out of 10, reiterating until they pass.
//
// WHY THIS IS A SCRIPT AND NOT AN AGENT. An agent that scores its own work and
// re-runs until it hits 8.5 will hit 8.5. Same model, same judgement, and the
// loop condition tells it which answer ends the loop. The score would be a
// ritual. So every check in this file is ARITHMETIC on the live scheme: a
// re-run only improves the score if the lessons actually changed. The judged
// checks live elsewhere, are never gated, and are never re-run for a better
// number (plans/2026-09-09-the-lesson-council.md).
//
// Usage: node scripts/council.mjs
// Needs SUPABASE_SERVICE_ROLE_KEY, same as lib/ops/health.ts.

import { createClient } from '@supabase/supabase-js'

const GATE = 8.5

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
if (!url || !key) {
  console.error('council: needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
  console.error('Without them this would print a passing score against no data, which is')
  console.error('the exact failure the council exists to prevent. Stopping instead.')
  process.exit(2)
}
const db = createClient(url, key, { auth: { persistSession: false }, db: { schema: 'schools' } })

// The words a child can hold on one slide, by age. From the ISO 9241 legibility
// work and the age banded rules in research/2026-09-09-lesson-quality-council.md.
// These are OUR thresholds and they should be argued about, which is why they
// are one visible constant rather than scattered through the checks.
const WORD_CEILING = { EYFS: 12, KS1: 12, KS2: 25, KS3: 40, KS4: 60, KS5: 60 }

// A slide the child DOES something on. Everything else, they watch.
const ACTION = new Set(['choice', 'discussion', 'tryit', 'interactive', 'scenario'])

// The longest a child should sit without acting. Our judgement, not a standard.
const MAX_PASSIVE_MINUTES = 4

const words = s => {
  const t = ['heading', 'body', 'prompt', 'caption', 'text', 'question']
    .map(k => s[k] ?? '').join(' ').trim()
  return t ? t.split(/\s+/).length : 0
}

// ── Check 2: appearance ──────────────────────────────────────────────
function checkAppearance(lessons) {
  const fails = []
  let total = 0, pass = 0
  for (const l of lessons) {
    const ceiling = WORD_CEILING[l.key_stage] ?? 60
    for (const [i, s] of (l.slides ?? []).entries()) {
      total += 1
      const w = words(s)
      if (w <= ceiling) pass += 1
      else fails.push({ module: l.module_id, ks: l.key_stage, slide: i + 1, type: s.type, words: w, ceiling })
    }
  }
  return {
    name: 'Appearance: words a child reads at once',
    score: total ? (10 * pass) / total : 0,
    detail: `${pass} of ${total} slides within the age ceiling`,
    fails: fails.sort((a, b) => b.words - a.words),
  }
}

// ── Check 3: engagement cadence ──────────────────────────────────────
function checkEngagement(lessons) {
  const fails = []
  let stretches = 0, ok = 0
  for (const l of lessons) {
    let run = 0, startedAt = 1
    for (const [i, s] of (l.slides ?? []).entries()) {
      if (ACTION.has(s.type)) {
        if (run > 0) {
          stretches += 1
          if (run <= MAX_PASSIVE_MINUTES) ok += 1
          else fails.push({ module: l.module_id, ks: l.key_stage, fromSlide: startedAt, toSlide: i, minutes: run })
        }
        run = 0
        startedAt = i + 2
      } else {
        run += Number(s.minutes ?? 0)
      }
    }
    if (run > 0) {
      stretches += 1
      if (run <= MAX_PASSIVE_MINUTES) ok += 1
      else fails.push({ module: l.module_id, ks: l.key_stage, fromSlide: startedAt, toSlide: (l.slides ?? []).length, minutes: run })
    }
  }
  return {
    name: 'Engagement: minutes a child sits without acting',
    score: stretches ? (10 * ok) / stretches : 0,
    detail: `${ok} of ${stretches} stretches within ${MAX_PASSIVE_MINUTES} minutes`,
    fails: fails.sort((a, b) => b.minutes - a.minutes),
  }
}

// ── Check 10: the passport reaches the lesson ────────────────────────
function checkPassport(lessons) {
  const fails = []
  let pass = 0
  for (const l of lessons) {
    // A lesson knows its stamp when the notes name one. Nothing can be stamped
    // until this exists, so it is the first thing the passport work must fix.
    const has = Boolean(l.teacher_notes?.passport_stage)
    if (has) pass += 1
    else fails.push({ module: l.module_id, ks: l.key_stage, missing: 'passport_stage' })
  }
  return {
    name: 'Passport: the lesson knows which stamp it earns',
    score: lessons.length ? (10 * pass) / lessons.length : 0,
    detail: `${pass} of ${lessons.length} modules name a passport stage`,
    fails,
  }
}

const { data, error } = await db
  .from('school_lessons')
  .select('module_id, key_stage, slides, teacher_notes')
  .order('sort_order', { ascending: true })

if (error) { console.error('council: could not read the scheme:', error.message); process.exit(2) }
const lessons = data ?? []
if (lessons.length === 0) { console.error('council: read zero modules. Refusing to score nothing.'); process.exit(2) }

const results = [checkAppearance(lessons), checkEngagement(lessons), checkPassport(lessons)]

console.log(`\nTHE LESSON COUNCIL, counted checks, ${lessons.length} modules\n`)
let failed = 0
for (const r of results) {
  const s = r.score.toFixed(2)
  const verdict = r.score >= GATE ? 'PASS' : 'BELOW GATE'
  if (r.score < GATE) failed += 1
  console.log(`  ${verdict.padEnd(11)} ${s.padStart(5)} / 10   ${r.name}`)
  console.log(`  ${''.padEnd(11)} ${''.padStart(5)}        ${r.detail}`)
  for (const f of r.fails.slice(0, 5)) {
    console.log(`  ${''.padEnd(19)}${JSON.stringify(f)}`)
  }
  if (r.fails.length > 5) console.log(`  ${''.padEnd(19)}and ${r.fails.length - 5} more`)
  console.log('')
}
console.log(`${results.length - failed} of ${results.length} at or above the ${GATE} gate.\n`)
// Deliberately exit 0. This reports a standard we are working towards, and a
// red build every commit until we reach it would train everyone to ignore it.
