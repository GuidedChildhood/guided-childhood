// The child learns it, the parent closes it, and DiGi can point at it.
//
// Justin, 29 September 2026, chose the lesson model: the child plays the school
// version of each lesson in their own app, a pass ticks the passport, and the
// parent gets one question to ask at tea. Then: "make sure DiGi is aware of
// lesson themes, so if a relevant question gets asked we have a way of
// advising the correct lesson." Plan: plans/2026-09-29-lessons-plan.md.
//
// This holds the wiring, and runs the lesson matcher against the questions it
// was tuned on, so a later tweak to the matcher cannot quietly send a parent
// asking about Roblox spending to a lesson about privacy.
//
// Node builtins plus --experimental-strip-types. No database.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const fail = []
const read = p => { try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' } }

// ── 1. THE PASSPORT COUNTS THE SCHOOL LESSONS ───────────────────────────────
const progress = read('lib/pathway/progress.ts')
if ((progress.match(/listStarLessons\(createAdminClient\(\)\)/g) ?? []).length < 2) fail.push('lib/pathway/progress.ts: both passport counts must read the school modules through the admin client (schools.school_lessons is service role only)')
if (/from\('lessons'\)\.select\('id(, stage_id)?'\)/.test(progress)) fail.push('lib/pathway/progress.ts: the passport counts the parent library again')
// Since 9 October 2026 the count lives in ONE function (lib/pathway/lesson-path.ts),
// and both passport readings call it. Four readers that each counted lessons
// their own way is how a hub read "0 of 18" over a list the passport called ten.
if ((progress.match(/childLessonPath\(\{/g) ?? []).length < 2) fail.push('lib/pathway/progress.ts: both passport counts must come from childLessonPath, the one lesson count')
const lessonPath = read('lib/pathway/lesson-path.ts')
if (!/schoolCreditKey\(id\)/.test(lessonPath)) fail.push('lib/pathway/lesson-path.ts: a lesson is credited by its school_lesson pass')
if (!/import \{ AI_AUDIENCE_TO_STAGE \} from '@\/lib\/pathway\/readiness-areas'/.test(lessonPath)) fail.push('lib/pathway/lesson-path.ts must import the AI audience map, never redeclare it')

// ── 2. THE CHILD'S LIST IS THE SCHOOL PATH ──────────────────────────────────
const kidList = read('app/k/[token]/lessons/page.tsx')
if (!/loadChildLessonPath\(supabase, \{ userId: link\.user_id, childId: link\.child_id, stageId, paid \}\)/.test(kidList) || !/hrefFor=\{id => `\/k\/\$\{token\}\/school\/\$\{id\}`\}/.test(kidList)) fail.push('the child lesson list no longer shows and opens the school modules')
if (!/redirect\(`\/k\/\$\{token\}\/school\/\$\{nextOpenId\}`\)/.test(kidList)) fail.push('the five a day lesson row no longer goes straight into the next school lesson')
// The child's list is the manifest's teaching order, not build order, and the
// standalone lessons stay out (30 September 2026: four under 7 lessons arrived
// as 30 to 33, and sort order alone put Year 1 before them for a Reception child).
const schoolPath = read('lib/lessons/school-path.ts')
if (!/positionOf\(r\.module_id/.test(schoolPath) || !/\.sort\(/.test(schoolPath)) fail.push('lib/lessons/school-path.ts no longer orders a stage by the manifest, so a Reception child could get Year 1 lessons first')
if (!/&& positionOf\(r\.module_id \?\? ''\) !== null/.test(schoolPath)) fail.push('lib/lessons/school-path.ts lets a standalone lesson into the stage, where the passport would count it')
const opener = read('app/k/[token]/school/[lessonId]/route.ts')
if (!/from\('kid_lesson_missions'\)[\s\S]{0,200}\.eq\('lesson_id', lessonId\)/.test(opener)) fail.push('the school lesson opener no longer reuses one mission per child per lesson, so stars could mint twice')

// ── 3. A PASS TICKS, AND THE PARENT CLOSES IT ───────────────────────────────
const complete = read('app/api/quests/lesson-complete/route.ts')
if (!/lesson_source: 'school_lesson'/.test(complete)) fail.push('a star lesson pass no longer writes a school_lesson completion, so the passport never ticks')
// The pass is marked on the server against the deck the child saw (plan v10,
// 1.5): never the client's correct and total, and never 70 percent of every
// question including the warm up. Stars pay once on paid_at, and a fail counts
// one attempt under the attempt it read.
if (!/const marked = markAnswers\(deck, posted\)/.test(complete) || !/lessonPassed\(deck, marked, \{ together \}\)/.test(complete)) fail.push('the star lesson route no longer marks the taps itself against the deck the child saw')
if (/Number\(body\.correct\)/.test(complete.slice(complete.indexOf('if (body.mission_id)'), complete.indexOf('if (body.school_week)')))) fail.push('the star lesson route reads the client\'s own score again')
if (!/\.is\('paid_at', null\)/.test(complete)) fail.push('stars must pay once, locked on paid_at')
if (!/\.eq\('attempts', attempts\)/.test(complete)) fail.push('a fail must count one attempt, locked on the attempt it read')
if (!/correctCount \/ choiceCount >= 0\.7/.test(read('shared/components/LessonPlayer.tsx'))) fail.push('the family library, AI modules and tutor decks must still pass at 70 percent')
if (!/Ask them at tea: \$\{askLine\}/.test(complete) || !/family_question/.test(complete)) fail.push('the push no longer carries the question to ask at tea')
if (!/markStepQuietly\(supabase, link\.user_id, link\.child_id, 'lesson'\)/.test(complete)) fail.push('a pass no longer ticks the five a day lesson row')

// ── 4. THE PASSPORT ROW OPENS THE SAME LIST ────────────────────────────────
const sections = read('lib/pathway/passport-sections.ts')
if (!/\/dashboard\/lessons\/path\?stage=\$\{id\}/.test(sections)) fail.push('the passport Lessons and tests row does not open the child\'s lesson list, so its count and its destination disagree')
const path = read('app/(dashboard)/dashboard/lessons/path/page.tsx')
if (!/loadChildLessonPath\(supabase, \{ userId: user\.id, childId: child\.id, stageId \}\)/.test(path) || !/data-do-together/.test(path)) fail.push('the parent lesson page no longer lists the school modules through the one lesson count or offers Do it together')

// ── 5. DIGI POINTS AT THE RIGHT LESSON ─────────────────────────────────────
const route = read('app/api/digi/route.ts')
if (!/lessonLinkKnowledge = lessonLinkBlock\(candidates/.test(route) || !/momentLinkKnowledge \+ lessonLinkKnowledge/.test(route)) fail.push('DiGi no longer reads the matched lessons')

// Run the matcher itself on the questions it was tuned on (Builder stage).
{
  const dir = mkdtempSync(join(tmpdir(), 'lesson-match-'))
  writeFileSync(join(dir, 'script-match.ts'), read('lib/digi/script-match.ts'))
  writeFileSync(join(dir, 'lesson-match.ts'), read('lib/digi/lesson-match.ts').replace('@/lib/digi/script-match', './script-match.ts'))
  const { matchLessons } = await import(join(dir, 'lesson-match.ts'))
  const ks2 = [
    ['Screen routines that work', 'I can build one screen routine that works and stick to it.', 'ks2-04-screen-routines'],
    ['Gaming: time, intensity and spend', 'I can spot when a game is trying to get me to spend.', 'ks2-05-gaming-time-spend'],
    ['How algorithms work', 'I can explain why my feed keeps me watching.', 'ks2-06-how-algorithms-work'],
    ['Privacy and digital reputation', 'I can decide what not to share.', 'ks2-07-privacy-reputation'],
    ['Being kind and safe with others online', 'I know three things to do if someone is unkind online.', 'ks2-08-kind-safe-online'],
    ['When a machine talks like a friend', 'I can name two things a real friend can do that a machine cannot.', 'ks2-23-when-a-machine-talks-like-a-friend'],
    ['Why thirteen?', 'I can say what the number on an app is protecting.', 'ks2-26-why-thirteen'],
  ].map(([title, single_action_outcome, module_id], i) => ({ id: `s${i}`, title, single_action_outcome, module_id }))
  const parent = [
    ['What we keep private online', 'Private information never goes into a screen. Not to anyone, not for anything.', 'safety'],
    ['Mean messages', 'What to do, what not to do, and who to tell when messages turn unkind.', 'bullying'],
    ['Screens and sleep', 'Screens sleep in the kitchen. The last hour belongs to winding down.', 'wellbeing'],
    ['The cool down lap', 'Ending screen time without a meltdown, every time.', 'wellbeing'],
  ].map(([title, key_message, category], i) => ({ id: `p${i}`, title, key_message, category }))
  const cases = [
    ['how do I explain the tiktok algorithm to my 9 year old', 'How algorithms work'],
    ['she keeps spending money on roblox', 'Gaming: time, intensity and spend'],
    ['meltdown every time I switch off the ipad', 'The cool down lap'],
    ['someone was unkind to him in a group chat', 'Being kind and safe with others online'],
    ['he wants instagram but is only 10, why is the age 13', 'Why thirteen?'],
    ['he keeps chatting to an AI chatbot like it is his friend', 'When a machine talks like a friend'],
    ['what time should she go to bed', 'Screens and sleep'],
    ['hello', null],
  ]
  for (const [q, want] of cases) {
    const got = matchLessons(q, ks2, parent, 'kid')
    const top = got[0]?.title ?? null
    if (top !== want) fail.push(`lesson match: "${q}" should lead with ${want ?? 'nothing'}, got ${top ?? 'nothing'}`)
  }
}

// ── 6. EVERY SURFACE READS THE ONE COUNT (plan v10, item 1.3) ──────────────
//
// Each of these used to count lessons its own way, and each was defensible on
// its own. The hub said "0 of 18" over a list the passport called ten, Home
// asked for lessons the stamp ignored, and the child's road promised the buddy
// for lessons the child could not open. So every reader is named here.
const readers = [
  ['lib/pathway/journey.ts', /childLessonPath\(\{/],
  ['lib/pathway/daily-tasks.ts', /childLessonPath\(\{/],
  ['lib/planet/server.ts', /childLessonPath\(\{[\s\S]{0,200}\}\)\.anyLesson/],
  ['app/(dashboard)/dashboard/page.tsx', /loadChildLessonPath\(supabase/],
  ['app/(dashboard)/dashboard/page.tsx', /passportLessons\(stageLessonPath\.path\)/],
  ['app/k/[token]/page.tsx', /loadChildLessonPath\(supabase/],
  ['app/k/[token]/page.tsx', /stageLessonPath\.path\.school\.done/],
  ['lib/stickers/book.ts', /lessonsPassedBetween\(supabase, \{ userId, childId \}\)/],
  ['lib/email/month-progress.ts', /lessonsPassedBetween\(supabase, \{ userId, childId, from, to, household: false \}\)/],
  ['lib/pathway/catchup.ts', /lessonsPassedBetween\(supabase, \{ userId, childId, from: sinceIso \}\)/],
  ['lib/pathway/progress.ts', /passportLessons\(path\)/],
  // The child's own list, missed in item 1.3 and found by the sync panel.
  ['app/k/[token]/lessons/page.tsx', /loadChildLessonPath\(supabase/],
  ['app/k/[token]/lessons/page.tsx', /path\.statusById\[m\.id\]/],
]
for (const [file, re] of readers) {
  if (!re.test(read(file))) fail.push(`${file}: no longer reads the one lesson count (lib/pathway/lesson-path.ts)`)
}
if ((read('lib/pathway/progress.ts').match(/passportLessons\(path\)/g) ?? []).length < 2) fail.push('lib/pathway/progress.ts: both passport readings must compose the lessons pair through passportLessons, which is decision 1')
// Home's and the child app's private counts over the PARENT library, gone.
for (const file of ['app/(dashboard)/dashboard/page.tsx', 'app/k/[token]/page.tsx']) {
  if (/from\('lessons'\)\.select\('id[^']*'\)[\s\S]{0,80}\.eq\('audience', 'parent'\)/.test(read(file))) fail.push(`${file}: counts the parent library as the child's lessons again`)
}
// The child's second lesson door was computed and rendered nowhere. Deleted,
// not rewired, because a Learn row beside the week card is two rows for one
// lesson on the child's busiest screen.
for (const file of ['app/k/[token]/page.tsx', 'app/k/[token]/KidQuestScreen.tsx']) {
  for (const name of ['focusLesson', 'learnTile', 'learnTarget', 'dailyLearnDone']) {
    if (new RegExp(`\\b${name}\\b`).test(read(file))) fail.push(`${file}: ${name} is back; a Learn row reads the week's mission, never the next module`)
  }
}
if (/export (async )?function getDailyTasks\b/.test(read('lib/pathway/daily-tasks.ts'))) fail.push('lib/pathway/daily-tasks.ts: getDailyTasks is back, a fifth lesson count nothing called')
// A failed run writes a completion row, so "any row" switched the lessons
// email off on a child's first fail.
if (!/svc-lessons[\s\S]{0,600}\.not\('passed', 'is', false\)/.test(read('app/api/email/cron/route.ts'))) fail.push('app/api/email/cron/route.ts: the lessons drip email must gate on a passing completion, not any row')
// The parent library drip is the parent's reading, never the child's lesson.
{
  const drip = read('app/api/cron/lesson-drip/route.ts')
  if (/ready on \$\{name\}'s app/.test(drip) || /lands on your progress report/.test(drip)) fail.push('app/api/cron/lesson-drip/route.ts: the parent library push tells the parent it is the child\'s lesson again')
}

// ── 7. RUN THE ONE COUNT ON FIXTURES ───────────────────────────────────────
//
// Pure over rows, so it runs here with nothing mocked. The bug it exists to
// stop is two loops that agree until one is edited, so the cases below are the
// ones that made them disagree.
{
  const dir = mkdtempSync(join(tmpdir(), 'lesson-path-'))
  const areas = read('lib/pathway/readiness-areas.ts').match(/export const AI_AUDIENCE_TO_STAGE[^=]*=\s*(\{[^}]*\})/)
  const creditKey = read('lib/lessons/school-path.ts').match(/export const schoolCreditKey = [^\n]+/)
  if (!areas || !creditKey) {
    fail.push('the fixture could not lift AI_AUDIENCE_TO_STAGE or schoolCreditKey from their files')
  } else {
    writeFileSync(join(dir, 'readiness-areas.ts'), `export const AI_AUDIENCE_TO_STAGE: Record<string, number> = ${areas[1]}\n`)
    writeFileSync(join(dir, 'school-path.ts'), `export type SchoolModule = { id: string; title: string }\n${creditKey[0]}\n`)
    writeFileSync(join(dir, 'lesson-credit.ts'), read('lib/pathway/lesson-credit.ts'))
    writeFileSync(join(dir, 'lesson-path.ts'), read('lib/pathway/lesson-path.ts')
      .replace("'@/lib/pathway/readiness-areas'", "'./readiness-areas.ts'")
      .replace("'@/lib/pathway/lesson-credit'", "'./lesson-credit.ts'")
      .replace("'@/lib/lessons/school-path'", "'./school-path.ts'"))
    const { childLessonPath, passportLessons } = await import(join(dir, 'lesson-path.ts'))

    const modules = ['m1', 'm2', 'm3', 'm4'].map(id => ({ id, title: id }))
    const ai = [{ id: 'a1', audience: 'age_9' }, { id: 'a2', audience: 'age_9' }, { id: 'a3', audience: 'age_11' }]
    const pass = (id, source = 'school_lesson', passed = true) => ({ lesson_id: id, lesson_source: source, passed })
    const eq = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) fail.push(`lesson path fixture, ${label}: wanted ${JSON.stringify(want)}, got ${JSON.stringify(got)}`) }
    const run = o => childLessonPath({ modules, aiModules: ai, passBy: null, childId: 'A', stageNum: 2, paid: true, ...o })

    // A sibling's own pass does not fill this child's page.
    const sibling = run({ completions: [pass('m1')], passBy: [{ lesson_id: 'm1', who: 'child', child_id: 'B' }] })
    eq('sibling pass', [sibling.school.done, sibling.school.next], [0, { id: 'm1', position: 1 }])
    // This child's own pass does, and moves next.
    const own = run({ completions: [pass('m1')], passBy: [{ lesson_id: 'm1', who: 'child', child_id: 'A' }] })
    eq('own pass', [own.school.done, own.school.next], [1, { id: 'm2', position: 2 }])
    // A failed run is a lesson still owed.
    const failed = run({ completions: [pass('m1'), pass('m2', 'school_lesson', false)] })
    eq('failed run', [failed.school.done, failed.school.next?.id, failed.statusById.m2.state], [1, 'm2', 'thisWeek'])
    // A retake that passes, with a household row beside the child's own: once.
    const retake = run({ completions: [pass('m1'), pass('m1'), pass('p1', 'lesson'), pass('p1', 'lesson')], missions: [{ lesson_id: 'm1', status: 'done' }] })
    eq('retake counts once', [retake.school.done, retake.anyLesson], [1, 2])
    // A legacy row from before scoring (passed null) still counts.
    const legacy = run({ completions: [pass('m3', 'school_lesson', null)] })
    eq('legacy null row', [legacy.school.done, legacy.statusById.m3.state], [1, 'passed'])
    // The AI modules are their own number, filtered to this stage, and the
    // passport's pair is the sum: decision 1 lives in passportLessons alone.
    const withAi = run({ completions: [pass('m1'), pass('a1', 'ai_lesson'), pass('a3', 'ai_lesson')] })
    eq('AI modules apart', [withAi.school, withAi.ai], [{ done: 1, total: 4, next: { id: 'm2', position: 2 } }, { done: 1, total: 2 }])
    eq('passport pair', passportLessons(withAi), { done: 2, total: 6 })
    // A child whose passes are all on the Learn tab: no school module passed,
    // and the planets stay exactly as open as they were yesterday.
    const learnTab = run({ completions: [pass('p1', 'lesson'), pass('p2', 'lesson'), pass('p3', 'lesson')] })
    eq('Learn tab only child', [learnTab.school.done, learnTab.anyLesson], [0, 3])
    // anyLesson is the planets' old head counts: passed non school completions
    // plus finished missions, a school pass counted once by its mission.
    const planets = run({
      completions: [pass('m1'), pass('p1', 'lesson'), pass('p2', 'lesson', false), pass('a1', 'ai_lesson')],
      missions: [{ lesson_id: 'm1', status: 'done' }, { lesson_id: 'm2', status: 'sent' }],
    })
    eq('anyLesson reproduces the planets', planets.anyLesson, 2 + 1)
    // A skipped module does not block the road.
    const skipped = run({ completions: [], missions: [{ lesson_id: 'm1', status: 'skipped' }] })
    eq('skipped moves next', skipped.school.next, { id: 'm2', position: 2 })
    // locked is the paywall and nothing else: the first module and this
    // week's are always open.
    const free = run({ completions: [], paid: false })
    eq('free family', ['m1', 'm2'].map(id => free.statusById[id].state), ['thisWeek', 'locked'])
  }
}

// ── 8. ONE DECK FILTER, FOUND BY SEARCH (plan v10, item 1.4) ────────────────
//
// Every parseSlides caller passes its deck through visibleSlides. Found by
// walking the source rather than from a list, because naming a list of five
// callers was wrong twice and there are seventeen.
{
  const { readdirSync, statSync } = await import('node:fs')
  const walk = dir => {
    const out = []
    let names = []
    try { names = readdirSync(dir) } catch { return out }
    for (const n of names) {
      if (n === 'node_modules' || n === '.next' || n.startsWith('.')) continue
      const f = join(dir, n)
      if (statSync(f).isDirectory()) out.push(...walk(f))
      else if (/\.(ts|tsx)$/.test(n)) out.push(f)
    }
    return out
  }
  const callers = []
  for (const f of [...walk('app'), ...walk('components'), ...walk('lib'), ...walk('schools/app'), ...walk('schools/components'), ...walk('schools/lib'), ...walk('shared')]) {
    if (f === 'shared/lesson-slides.ts') continue
    const code = read(f).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
    if (!/\bparseSlides\(/.test(code)) continue
    callers.push(f)
    if (!/\bvisibleSlides\(/.test(code)) fail.push(`${f}: reads a deck with parseSlides and never passes it through visibleSlides`)
  }
  if (callers.length < 17) fail.push(`only ${callers.length} parseSlides callers found; the search has gone blind (expected 17 or more)`)
  // The child's three pages take the child's deck, never the classroom's.
  for (const [f, re] of [
    ['app/k/[token]/lesson/[mission]/page.tsx', /visibleSlides\(rawSlides, audience, \{/],
    ['app/k/[token]/lessons/[lessonId]/page.tsx', /visibleSlides\(rawSlides, 'kid'\)/],
    ['app/k/[token]/tutor/[id]/page.tsx', /visibleSlides\(rawSlides, 'kid'\)/],
  ]) if (!re.test(read(f))) fail.push(`${f}: must play the child's deck (visibleSlides kid or together)`)
  {
    const mission = read('app/k/[token]/lesson/[mission]/page.tsx')
    if (!/audience=\{audience\}/.test(mission)) fail.push('the mission page must tell the player which audience its deck is for')
    // The same lesson the class meets, and a way to tell on the flagged ones,
    // all inside the player (the page around it is never seen).
    for (const prop of ['character={characterKeyFor(', 'register={registerFor(', 'tool={notes.tool}', 'introEyebrow={introEyebrow}', 'kidBadge={kidBadge}', 'tellHref={flagged ?']) {
      if (!mission.includes(prop)) fail.push(`the mission page no longer passes ${prop.replace(/[={(]+$/, '')} into the player`)
    }
  }
  if (/checks\.slice\(-2\)/.test(read('schools/app/print/[module]/page.tsx'))) fail.push('schools print page: the exit ticket takes the prove items by phase, not the last two choice slides')

  // Run the filter on every real deck.
  const dir = mkdtempSync(join(tmpdir(), 'visible-slides-'))
  writeFileSync(join(dir, 'lesson-slides.ts'), read('shared/lesson-slides.ts'))
  const { visibleSlides, kidMinutesLeft } = await import(join(dir, 'lesson-slides.ts'))
  const decks = readdirSync('content/modules').filter(f => f.endsWith('.json')).sort()
  if (decks.length !== 34) fail.push(`expected 34 module decks, found ${decks.length}`)
  let sorts = 0
  let reasoning = 0
  let maxKid = 0
  for (const f of decks) {
    const m = JSON.parse(read(`content/modules/${f}`))
    const slides = m.slides
    const worksheet = { verdict_options: m.teacher_notes?.worksheet?.verdict_options, items: m.teacher_notes?.worksheet_items }
    const id = f.replace(/\.json$/, '')

    // The classroom deck is exactly what was authored: the run page's minutes
    // and the phase table's rows cannot move.
    const cls = visibleSlides(slides, 'classroom')
    if (cls.slides !== slides || cls.storedIndex.some((v, i) => v !== i)) fail.push(`${id}: the classroom deck is not the authored deck`)

    // The classroom never shows a child only slide (sync plan A10).
    if (f === decks[0]) {
      const withKid = [...slides, { type: 'choice', phase: 'prove', kid_only: true, question: 'fixture', options: [] }]
      const shown = visibleSlides(withKid, 'classroom').slides
      if (shown.length !== slides.length || shown.some(x => x.kid_only)) fail.push('the classroom audience shows a kid_only slide')
      if (!visibleSlides(withKid, 'kid').slides.some(x => x.kid_only)) fail.push('the kid audience drops a kid_only slide it should show')
    }

    // The print page's prove items by phase are the two it printed before.
    const choices = slides.filter(s => s.type === 'choice')
    const byPhase = choices.filter(s => s.phase === 'prove')
    if (JSON.stringify(byPhase) !== JSON.stringify(choices.slice(-2))) fail.push(`${id}: the prove items by phase are not the last two choice slides, so the print page would change`)

    for (const audience of ['kid', 'together']) {
      const { slides: v, storedIndex, visibleIndex } = visibleSlides(slides, audience, { worksheet })
      // The map back to the stored deck holds for every question, which is
      // what the server marks against.
      v.forEach((s, k) => { if (s.type === 'choice' && visibleIndex[storedIndex[k]] !== k) fail.push(`${id} ${audience}: index map disagrees at question ${k}`) })
      v.forEach((s, k) => {
        const from = slides[storedIndex[k]]
        const allowed = s.type === from.type || (from.type === 'tryit' && ['interactive', 'discussion'].includes(s.type)) || (from.type === 'interactive' && s.type === 'discussion')
        if (!allowed) fail.push(`${id} ${audience}: slide ${k} changed type from ${from.type} to ${s.type}`)
      })
      if (v.some(s => 'script' in s)) fail.push(`${id} ${audience}: the teacher script reaches the child`)
      if (v.some(s => s.type === 'discussion' && 'lookFor' in s)) fail.push(`${id} ${audience}: a teacher look for line reaches the child`)
      if (v.some(s => s.type === 'interactive' && 'caption' in s)) fail.push(`${id} ${audience}: a teacher caption reaches the child`)
      if (v.some(s => s.type === 'interactive' && s.component === 'passport-page')) fail.push(`${id} ${audience}: the passport beat fills a page before the check is marked`)
      // Classroom furniture a child alone cannot follow (sync plan A2). Film
      // narration is exempt: it is spoken in the film and cannot be rewritten.
      const FURNITURE = /tell your neighbour|the person next to you|your partner|hands up|\bvote\b|on your sheet|write it on|"one hour|before the bell|to the board|class verdict|class answer|Do you agree\? Explain/i
      v.forEach((s, k) => { if (s.type !== 'video' && FURNITURE.test(JSON.stringify(s))) fail.push(`${id} ${audience}: slide ${k} still speaks to a classroom: ${JSON.stringify(s).match(FURNITURE)[0]}`) })
      if (v.some(s => s.type === 'choice' && /Exit check/i.test(s.question))) fail.push(`${id} ${audience}: "Exit check" reaches the child`)
      if (v.filter(s => s.type === 'choice' && s.phase === 'prove').length !== 2) fail.push(`${id} ${audience}: the two prove items must both reach the child`)
      if (!v.some(s => s.phase === 'practise')) fail.push(`${id} ${audience}: the child's deck has no practice left`)
      if (!v.some(s => s.type === 'discussion' && s.phase === 'starter')) fail.push(`${id} ${audience}: the starter went; the opening retrieval is the child's too`)
      const practiseSorts = v.filter(s => s.type === 'interactive' && s.component === 'verdict-sort' && s.phase === 'practise')
      // One practice sort, never the same cards twice (sync plan A1).
      if (practiseSorts.length > 1) fail.push(`${id} ${audience}: ${practiseSorts.length} practice sorts back to back`)
      if (practiseSorts.some(s => (s.config.posts ?? s.config.items).length < 4)) fail.push(`${id} ${audience}: a practice sort with fewer than four cards`)
      if (audience === 'kid') {
        if (practiseSorts.length === 1) sorts += 1
        reasoning += v.filter(s => s.type === 'discussion' && typeof s.prompt === 'string' && /Do you agree\?$/.test(s.prompt)).length
        if (practiseSorts.some(s => (s.config.posts ?? s.config.items).some(p => /Listen for|\bpupils\b|^Recognise:|^Apply:|Strong answers/i.test(p.why ?? '')))) fail.push(`${id}: a sort reason still speaks to the teacher`)
        maxKid = Math.max(maxKid, kidMinutesLeft(v, 0))
      }
    }
  }
  // Every deck gives a child exactly one practice sort, and the twenty
  // reasoning cards come back as Think it rather than vanishing.
  if (sorts !== decks.length) fail.push(`${sorts} of ${decks.length} decks give the child exactly one practice sort`)
  if (reasoning < 20) fail.push(`only ${reasoning} reasoning cards reach the child as Think it (expected 20)`)
  globalThis.__visibleSlidesSummary = `${callers.length} callers, ${decks.length} decks, one sort each, ${reasoning} reasoning cards, longest kid deck ${maxKid} min`
}

// ── 9. A CHILD'S LESSONS FOLLOW THEIR SCHOOL YEAR (sync plan C) ────────────
//
// Justin, 9 October 2026: the lessons follow the school year, not the
// birthday, so a Year 8 child of 13 does KS3 alongside their class and never
// meets the KS4 safeguarding decks alone two years early. Every place a lesson
// is chosen for a child reads lessonStageFor, and the opener refuses a later
// key stage by URL.
{
  for (const [file, re] of [
    ['app/k/[token]/lessons/page.tsx', /lessonStageFor\(/],
    ['app/k/[token]/page.tsx', /stageId: lessonStageFor\(/],
    ['app/(dashboard)/dashboard/lessons/path/page.tsx', /lessonStageFor\(/],
    ['lib/pathway/daily-tasks.ts', /lessonStageFor\(child\)/],
    ['lib/pathway/journey.ts', /lessonStageFor\(/],
    ['app/(dashboard)/dashboard/page.tsx', /stageId: child \? lessonStageFor\(/],
    ['app/k/[token]/school/[lessonId]/route.ts', /moduleOpenFor\(/],
  ]) if (!re.test(read(file))) fail.push(`${file}: chooses a child's lessons without their school year (lessonStageFor)`)

  const dir = mkdtempSync(join(tmpdir(), 'school-year-'))
  writeFileSync(join(dir, 'school-path.ts'), read('lib/lessons/school-path.ts')
    .replace("import type { StageId } from '@/lib/pathway/progress'", "type StageId = 'foundation' | 'builder' | 'explorer' | 'shaper' | 'independent'")
    .replace("import { positionOf } from '@gc/shared/schools-curriculum'", 'const positionOf = (_id: string) => ({ index: 0 })'))
  const { schoolYearFromDob, lessonStageFor, moduleOpenFor, newMissionAllowed, WEEKLY_LESSON_STARS } = await import(join(dir, 'school-path.ts'))
  // ONE A WEEK, WITH A MECHANISM (plan v10, 1.5): only a NEW mission meets the
  // pace, and the opener reads the paywall where it creates one.
  const opener = read('app/k/[token]/school/[lessonId]/route.ts')
  if (!/newMissionAllowed\(/.test(opener) || !/hasFullAccess\(/.test(opener) || !/stars: WEEKLY_LESSON_STARS/.test(opener)) fail.push('the opener must read the paywall and the pace where it creates a mission, at the weekly award')
  if (WEEKLY_LESSON_STARS !== 10) fail.push('the weekly lesson pays 10 stars')
  const now = Date.parse('2026-10-09T12:00:00Z')
  const pace = (lastPassAt, extra = {}) => newMissionAllowed({ lastPassAt, isFirstOfStage: false, isSkippedRestart: false, now, ...extra })
  if (pace('2026-10-06T12:00:00Z')) fail.push('pace: a pass three days ago must hold a new mission')
  if (!pace('2026-10-01T12:00:00Z')) fail.push('pace: a pass eight days ago must let a new mission start')
  if (!pace(null)) fail.push('pace: a child who has never passed must start')
  if (!pace('2026-10-08T12:00:00Z', { isFirstOfStage: true })) fail.push('pace: the first lesson of a stage always starts')
  if (!pace('2026-10-08T12:00:00Z', { isSkippedRestart: true })) fail.push('pace: a skipped restart always starts')
  const on = new Date('2026-10-09T12:00:00Z')
  const cases = [
    // date of birth, school year on 9 October 2026, the lessons' stage
    ['2021-12-01', 0, 'foundation'], // Reception
    ['2019-08-31', 3, 'builder'], // Year 3, the youngest in the year
    ['2019-09-01', 2, 'foundation'], // Year 2, the oldest in the year below
    ['2016-01-15', 6, 'builder'], // Year 6 aged 10
    ['2015-09-20', 6, 'builder'], // Year 6 aged 11: was Explorer by birthday
    ['2013-10-01', 8, 'explorer'], // Year 8 turning 13: was Shaper by birthday
    ['2012-09-02', 9, 'explorer'], // Year 9 aged 14: was Shaper by birthday
    ['2011-10-10', 10, 'shaper'], // Year 10
    ['2010-09-15', 11, 'shaper'], // Year 11 aged 16: was Independent by birthday
    ['2010-01-05', 12, 'independent'], // Year 12
    ['2009-06-30', 13, 'independent'], // Year 13
  ]
  for (const [dob, year, stage] of cases) {
    const gotYear = schoolYearFromDob(dob, on)
    const gotStage = lessonStageFor({ date_of_birth: dob, age_band: '13-15' }, on)
    if (gotYear !== year || gotStage !== stage) fail.push(`school year: born ${dob} should be Year ${year} on ${stage} lessons, got Year ${gotYear} on ${gotStage}`)
  }
  if (lessonStageFor({ date_of_birth: null, age_band: '11-13' }, on) !== 'explorer') fail.push('school year: with no date of birth the age band must decide')
  if (moduleOpenFor('KS4', 'explorer') || !moduleOpenFor('KS2', 'explorer') || !moduleOpenFor('KS3', 'explorer')) fail.push('school year: a later key stage must wait and an earlier one stay open')
}

// ── 10. THE PASS RULE ON A REAL DECK (plan v10, 1.5) ────────────────────────
{
  const dir = mkdtempSync(join(tmpdir(), 'pass-rule-'))
  writeFileSync(join(dir, 'lesson-slides.ts'), read('shared/lesson-slides.ts'))
  const { visibleSlides, markAnswers, lessonPassed, proveQuestions } = await import(join(dir, 'lesson-slides.ts'))
  const m = JSON.parse(read('content/modules/ks2-04-screen-routines.json'))
  const deck = visibleSlides(m.slides, 'kid', { worksheet: { verdict_options: m.teacher_notes.worksheet.verdict_options, items: m.teacher_notes.worksheet_items } }).slides
  const proves = proveQuestions(deck)
  const right = q => q.options.find(o => o.correct).text
  const wrong = q => q.options.find(o => !o.correct).text
  const at = q => deck.indexOf(q)
  const tap = (q, first, settled) => ({ slide: at(q), question: q.question, chosenFirst: first, chosen: settled, phase: 'prove' })
  const eq = (label, got, want) => { if (got !== want) fail.push(`pass rule, ${label}: wanted ${want}, got ${got}`) }
  eq('two prove questions on the deck', proves.length, 2)
  eq('both right passes', lessonPassed(deck, markAnswers(deck, proves.map(q => tap(q, right(q), right(q))))), true)
  eq('one wrong fails', lessonPassed(deck, markAnswers(deck, [tap(proves[0], right(proves[0]), right(proves[0])), tap(proves[1], wrong(proves[1]), wrong(proves[1]))])), false)
  eq('wrong first then right counts the settled tap', lessonPassed(deck, markAnswers(deck, proves.map(q => tap(q, wrong(q), right(q))))), true)
  // A forged payload: an option the slide does not have, or a "correct" flag
  // the route never reads, marks nothing.
  const forged = proves.map(q => ({ ...tap(q, 'all of them', 'all of them'), correct: true }))
  eq('a forged payload fails', lessonPassed(deck, markAnswers(deck, forged)), false)
  eq('a missing answer fails', lessonPassed(deck, markAnswers(deck, [tap(proves[0], right(proves[0]), right(proves[0]))])), false)
  eq('together: every question answered passes', lessonPassed(deck, markAnswers(deck, proves.map(q => tap(q, wrong(q), wrong(q)))), { together: true }), true)
  // The warm up no longer decides the lesson: a wrong starter with a right check passes.
  const starter = deck.find(s => s.type === 'choice' && s.phase === 'starter')
  if (starter) eq('a wrong warm up does not fail the check', lessonPassed(deck, markAnswers(deck, [{ slide: at(starter), question: starter.question, chosen: wrong(starter), phase: 'starter' }, ...proves.map(q => tap(q, right(q), right(q)))])), true)
  // A spare stands in for the question it names.
  const spare = { type: 'choice', phase: 'prove', question: 'A spare', reserve_for: proves[1].question, options: [{ text: 'yes', correct: true, feedback: '' }, { text: 'no', correct: false, feedback: '' }] }
  const withSpare = [...deck, spare]
  eq('a right spare stands in', lessonPassed(withSpare, markAnswers(withSpare, [tap(proves[0], right(proves[0]), right(proves[0])), tap(proves[1], wrong(proves[1]), wrong(proves[1])), { slide: withSpare.length - 1, question: 'A spare', chosen: 'yes', phase: 'prove' }])), true)
}

if (fail.length) {
  console.error('check-lesson-path FAILED\n' + fail.map(f => '  ' + f).join('\n'))
  process.exit(1)
}
console.log(`check-lesson-path: ok (${globalThis.__visibleSlidesSummary}; school lessons counted, every surface reads the one count, ten fixtures agree, lessons follow the school year, the child\'s list and the parent\'s agree, a pass ticks and asks at tea, DiGi matches 8 of 8)`)
