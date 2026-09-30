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
if ((progress.match(/schoolCreditKey\(l\.id\)/g) ?? []).length < 2) fail.push('lib/pathway/progress.ts: a lesson is credited by its school_lesson pass')

// ── 2. THE CHILD'S LIST IS THE SCHOOL PATH ──────────────────────────────────
const kidList = read('app/k/[token]/lessons/page.tsx')
if (!/schoolModulesForStage\(allModules, stageId\)/.test(kidList) || !/hrefFor=\{id => `\/k\/\$\{token\}\/school\/\$\{id\}`\}/.test(kidList)) fail.push('the child lesson list no longer shows and opens the school modules')
if (!/redirect\(`\/k\/\$\{token\}\/school\/\$\{nextOpenId\}`\)/.test(kidList)) fail.push('the five a day lesson row no longer goes straight into the next school lesson')
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
if (!/schoolModulesForStage\(all, stageId\)/.test(path) || !/data-do-together/.test(path)) fail.push('the parent lesson page no longer lists the school modules or offers Do it together')

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

if (fail.length) {
  console.error('check-lesson-path FAILED\n' + fail.map(f => '  ' + f).join('\n'))
  process.exit(1)
}
console.log('check-lesson-path: ok (school lessons counted, the child\'s list and the parent\'s agree, a pass ticks and asks at tea, DiGi matches 8 of 8)')
