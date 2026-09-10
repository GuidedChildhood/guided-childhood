#!/usr/bin/env node
// EVERY CYCLE HAS TO OPEN ON A SLIDE THE DECK ACTUALLY HAS.
//
// The player derives the cycle map by matching each cycle title against the
// headings in its own teach phase, and needs half a title's significant words
// to land. A title that matches nothing does not degrade: the whole map is
// dropped, on purpose, because naming the wrong cycle on screen is worse than
// naming none. That is a silent failure. The deck renders, the lesson runs, the
// chrome above the slide is simply empty, and nothing anywhere goes red.
//
// It had already happened. ks4-16's cycle three was titled "Pressure" and no
// heading in that deck contains the word, so the module shipped with no cycle
// map from migration 270 until 281 found it. Its minute totals were correct
// throughout, so 270's guard, which compares cycle minutes to the teach phase,
// was green the entire time.
//
// This replicates the player's rule exactly (LessonPlayer.tsx, cycleOfSlide)
// and fails on any deck it cannot map. It also re-checks the minute rule, so
// one script covers both halves of what a cycle promises a teacher.
//
// Live: needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// Offline: --fixture <file>, an array of { module_id, slides, teacher_notes }.

import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

// Same list as the player. Kept here rather than imported because the player is
// a .tsx module and this has to run under plain node in CI.
const STOPWORDS = new Set(['the', 'a', 'an', 'and', 'of', 'is', 'it', 'to', 'in', 'you', 'your', 'not', 'that', 'on', 'for'])
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w && !STOPWORDS.has(w))

function starts(cycles, teach) {
  const anchorFor = (title, from) => {
    const tw = norm(title)
    if (!tw.length) return -1
    let best = -1, bestScore = 0
    for (let t = from; t < teach.length; t++) {
      const h = teach[t].heading
      if (!h) continue
      const hw = new Set(norm(h))
      const score = tw.filter(w => hw.has(w)).length / tw.length
      if (score > bestScore) { bestScore = score; best = t }
    }
    return bestScore >= 0.5 ? best : -1
  }
  const out = [0]
  for (let c = 1; c < cycles.length; c++) {
    const at = anchorFor(cycles[c].title, out[c - 1] + 1)
    if (at < 0) return { starts: null, failed: cycles[c].title }
    out.push(at)
  }
  return { starts: out, failed: null }
}

const fixtureAt = process.argv.indexOf('--fixture')
const fixture = fixtureAt === -1 ? null : process.argv[fixtureAt + 1]

let lessons
if (fixture) {
  lessons = JSON.parse(await readFile(fixture, 'utf8'))
} else {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    console.error('check-cycle-anchors: needs NEXT_PUBLIC_SUPABASE_URL and')
    console.error('SUPABASE_SERVICE_ROLE_KEY, or a saved scheme via --fixture. Passing')
    console.error('against no data is the failure this exists to catch. Stopping instead.')
    process.exit(2)
  }
  const db = createClient(url, key, { auth: { persistSession: false }, db: { schema: 'schools' } })
  const { data, error } = await db.from('school_lessons').select('module_id, slides, teacher_notes')
  if (error) { console.error('check-cycle-anchors: could not read the scheme:', error.message); process.exit(2) }
  lessons = data ?? []
}

if (!Array.isArray(lessons) || lessons.length === 0) {
  console.error('check-cycle-anchors: read zero modules. Refusing to pass on nothing.')
  process.exit(2)
}

let failed = 0
let mapped = 0
for (const l of lessons) {
  const cycles = l.teacher_notes?.cycles ?? []
  const teach = (l.slides ?? []).filter(s => s.phase === 'teach')
  if (!cycles.length) continue
  if (!teach.length) {
    console.error(`  FAIL  ${l.module_id}: has cycles but no teach phase`)
    failed += 1
    continue
  }

  const { starts: at, failed: badTitle } = starts(cycles, teach)
  if (!at) {
    console.error(`  FAIL  ${l.module_id}: cycle "${badTitle}" matches no heading in its own deck,`)
    console.error(`        so the player renders no cycle map for this module at all.`)
    failed += 1
    continue
  }
  mapped += 1

  // And the minute rule, which is the half a teacher plans against.
  const mins = cycles.map(() => 0)
  let ci = 0
  for (let t = 0; t < teach.length; t++) {
    while (ci + 1 < at.length && t >= at[ci + 1]) ci++
    mins[ci] += teach[t].minutes ?? 0
  }
  cycles.forEach((c, i) => {
    if (c.minutes !== mins[i]) {
      console.error(`  FAIL  ${l.module_id}: cycle ${i + 1} "${c.title}" states ${c.minutes} minutes, runs ${mins[i]}`)
      failed += 1
    }
  })
}

if (failed) {
  console.error(`\ncheck-cycle-anchors: ${failed} problem(s) across ${lessons.length} modules.`)
  process.exit(1)
}
console.log(`check-cycle-anchors: ${mapped} modules map, every cycle opens on a slide it names and states the minutes it runs.`)
