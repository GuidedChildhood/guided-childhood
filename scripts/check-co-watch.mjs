// A lesson done together counts for the child it was done with.
//
// Justin, 15 September 2026: "the lessons for younger ages cannot be on the app
// as they probably will not have an app, and younger cannot read, so it needs
// to be co watched on the parent's app."
//
// Under about eight the parent's device IS where a lesson happens. So the two
// halves of that have to hold, and neither is visible to a typecheck, because
// a completion with no child on it is perfectly valid and merely counts for
// nobody.
//
// ── 1. THE PLAYER SAYS WHO THE LESSON WAS FOR ───────────────────────────────
//
// The parent's lesson page already resolves the open child from ?child= and
// uses it for the send button and the reading ahead notice. It was not reaching
// the completion, so playing a lesson to the end wrote a household row while
// the Mark done tick on the SAME screen recorded it against the child. Two
// paths on one screen disagreeing, and the fuller one losing the answer.
//
// This is also why no "who did this with you" question is asked at the end: the
// parent already said who, by opening them. A question whose answer we are
// holding is friction, not care.
//
// ── 2. AND THAT CHILD'S DAY IS TICKED ───────────────────────────────────────
//
// The child's own route has ticked the day since the lesson step was wired.
// This one never did, so a co watched lesson landed in the passport and left
// the five a day untouched: the same shape as the silent refusal fixed in
// #1087, where two screens each told the truth about a different thing.
//
// Through markStepQuietly, the same path the child's own lesson takes, so the
// stars, the streak and the sticker are earned identically and cannot drift.
//
//   node scripts/check-co-watch.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

const PAGE = 'app/(dashboard)/dashboard/lessons/[id]/page.tsx'
const ROUTE = 'app/api/lessons/complete/route.ts'
const KID_ROUTE = 'app/api/kid/lesson-complete/route.ts'

// ── 1. The parent's player names the child ──────────────────────────────────
const page = read(PAGE)
if (page === null) {
  problems.push(`${PAGE} is gone, so the screen a grown up co watches a lesson on is somewhere this guard cannot see`)
} else if (!/<LessonPlayer/.test(page)) {
  problems.push(`${PAGE} no longer renders LessonPlayer, so this guard is checking the wrong screen`)
} else if (!/completeBody=/.test(page)) {
  problems.push(
    `${PAGE} renders LessonPlayer with no completeBody, so a lesson played to the end posts no child_id and writes a household row counting for nobody. The page has already resolved the open child for the send button; it just is not reaching the completion. A four year old cannot do these on their own app, so this IS their lesson path.`,
  )
} else if (!/completeBody=\{[^}]*child_id/.test(page)) {
  problems.push(`${PAGE} sends a completeBody without child_id in it, so the completion still cannot say who the lesson was for`)
} else {
  ok.push('the parent\'s lesson player posts the open child, so a co watched lesson lands on that child')
}

// ── 2. The parent's route ticks that child's day ────────────────────────────
const route = read(ROUTE)
if (route === null) {
  problems.push(`${ROUTE} is missing`)
} else if (!/markStepQuietly\(/.test(route)) {
  problems.push(
    `${ROUTE} never calls markStepQuietly, so a lesson a grown up did sitting beside their child counts in the passport and leaves the five a day untouched. That is the bug Justin reported on 15 September, on the other route.`,
  )
} else if (!/if\s*\(\s*passed\s*&&\s*forChild\s*\)/.test(route)) {
  problems.push(
    `${ROUTE} calls markStepQuietly without guarding on both passed AND forChild. Without forChild it would tick a day for nobody (or throw); without passed it would tick for a lesson that was failed, and the hint under the row promises "learn one thing, pass it".`,
  )
} else {
  ok.push('a passed lesson with a child named ticks that child\'s day, and one with no child named ticks nobody')
}

// ── 3. Both routes tick through the SAME function ───────────────────────────
//
// The point of markStepQuietly here is not brevity. It is that the stars, the
// streak, the sticker and the lesson/quiz pairing are the child's own, computed
// once. A second scoring path for co watched lessons would be free to drift,
// and drift is invisible until a family notices their day does not add up.
const kid = read(KID_ROUTE)
if (kid === null) {
  problems.push(`${KID_ROUTE} is gone, so the child's own lesson path cannot be compared with the parent's`)
} else if (!/markStepQuietly\(/.test(kid)) {
  problems.push(`${KID_ROUTE} no longer ticks the day through markStepQuietly, so the two paths have diverged and a co watched lesson and a child's own lesson no longer earn the same things`)
} else {
  ok.push('the child\'s route and the parent\'s route tick through the one function, so a co watched lesson earns exactly what the child\'s own does')
}

if (problems.length > 0) {
  console.error('check-co-watch FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why the youngest children\'s lessons live on the parent\'s device.')
  process.exit(1)
}
console.log('check-co-watch ok: a lesson done together counts for the child it was done with')
for (const line of ok) console.log('  ' + line)
