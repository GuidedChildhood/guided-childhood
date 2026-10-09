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
if (!/schoolModulesForStage\(allModules, stageId\)/.test(kidList) || !/hrefFor=\{id => `\/k\/\$\{token\}\/school\/\$\{id\}`\}/.test(kidList)) fail.push('the child lesson list no longer shows and opens the school modules')
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
if (!/correct \/ total >= 0\.7/.test(complete)) fail.push('the pass mark is no longer 70 percent')
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
  if (!/audience=\{audience\}/.test(read('app/k/[token]/lesson/[mission]/page.tsx'))) fail.push('the mission page must tell the player which audience its deck is for')
  if (/checks\.slice\(-2\)/.test(read('schools/app/print/[module]/page.tsx'))) fail.push('schools print page: the exit ticket takes the prove items by phase, not the last two choice slides')

  // Run the filter on every real deck.
  const dir = mkdtempSync(join(tmpdir(), 'visible-slides-'))
  writeFileSync(join(dir, 'lesson-slides.ts'), read('shared/lesson-slides.ts'))
  const { visibleSlides, kidMinutesLeft } = await import(join(dir, 'lesson-slides.ts'))
  const decks = readdirSync('content/modules').filter(f => f.endsWith('.json')).sort()
  if (decks.length !== 34) fail.push(`expected 34 module decks, found ${decks.length}`)
  let sorts = 0
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

    // The print page's prove items by phase are the two it printed before.
    const choices = slides.filter(s => s.type === 'choice')
    const byPhase = choices.filter(s => s.phase === 'prove')
    if (JSON.stringify(byPhase) !== JSON.stringify(choices.slice(-2))) fail.push(`${id}: the prove items by phase are not the last two choice slides, so the print page would change`)

    for (const audience of ['kid', 'together']) {
      const { slides: v, storedIndex, visibleIndex } = visibleSlides(slides, audience, { worksheet })
      // The map back to the stored deck holds both ways.
      storedIndex.forEach((si, k) => { if (visibleIndex[si] !== k) fail.push(`${id} ${audience}: index map disagrees at ${k}`) })
      const swap = slides.filter(s => s.type === 'discussion' && /^\s*Swap sheets\b/i.test(s.prompt)).length
      if (slides.length - v.length !== swap) fail.push(`${id} ${audience}: dropped ${slides.length - v.length} slides, expected only the ${swap} swap sheets discussions`)
      v.forEach((s, k) => {
        const from = slides[storedIndex[k]]
        if (s.type !== from.type && !(from.type === 'tryit' && s.type === 'interactive')) fail.push(`${id} ${audience}: slide ${k} changed type`)
      })
      if (v.some(s => 'script' in s)) fail.push(`${id} ${audience}: the teacher script reaches the child`)
      if (v.some(s => s.type === 'discussion' && 'lookFor' in s)) fail.push(`${id} ${audience}: a teacher look for line reaches the child`)
      if (v.some(s => s.type === 'discussion' && /\bpartner\b|\byour table\b|\bthe board\b/i.test(s.prompt))) fail.push(`${id} ${audience}: a Think it prompt still asks for a partner, a table or a board`)
      if (v.some(s => s.type === 'choice' && /Exit check/i.test(s.question))) fail.push(`${id} ${audience}: "Exit check" reaches the child`)
      if (v.filter(s => s.type === 'choice' && s.phase === 'prove').length !== 2) fail.push(`${id} ${audience}: the two prove items must both reach the child`)
      if (!v.some(s => s.phase === 'practise')) fail.push(`${id} ${audience}: the child's deck has no practice left`)
      if (!v.some(s => s.type === 'discussion' && s.phase === 'starter')) fail.push(`${id} ${audience}: the starter went; the opening retrieval is the child's too`)
      if (audience === 'kid') {
        const sort = v.find((s, k) => s.type === 'interactive' && slides[storedIndex[k]].type === 'tryit')
        if (sort) {
          sorts += 1
          const posts = sort.config.posts
          if (!posts.length || posts.some(p => !(p.answer >= 0 && p.answer < sort.config.verdicts.length))) fail.push(`${id}: the worksheet sort has a card with no verdict`)
          if (posts.some(p => /Listen for|\bpupils\b/i.test(p.why))) fail.push(`${id}: a worksheet reason still speaks to the teacher`)
        }
        maxKid = Math.max(maxKid, kidMinutesLeft(v, 0))
      }
    }
  }
  // 25 decks carry verdict worksheets; 23 of them have a practise tryit to
  // stand in for. Fewer means the conversion broke on a shape it used to read.
  if (sorts < 23) fail.push(`only ${sorts} decks turned their worksheet into the child's sort (expected 23)`)
  globalThis.__visibleSlidesSummary = `${callers.length} callers, ${decks.length} decks, ${sorts} worksheet sorts, longest kid deck ${maxKid} min`
}

if (fail.length) {
  console.error('check-lesson-path FAILED\n' + fail.map(f => '  ' + f).join('\n'))
  process.exit(1)
}
console.log(`check-lesson-path: ok (${globalThis.__visibleSlidesSummary}; school lessons counted, every surface reads the one count, ten fixtures agree, the child\'s list and the parent\'s agree, a pass ticks and asks at tea, DiGi matches 8 of 8)`)
