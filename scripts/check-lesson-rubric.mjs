#!/usr/bin/env node
// THE RUBRIC'S MEASURABLE CHECKS, RUN ON A MODULE FILE.
//
// scripts/lesson-rubric.md names what a lesson is held to and marks each check
// MEASURABLE, JUDGEMENT or SCHEME. The instruments in its section A already
// run elsewhere (the council, the contract, the coverage guards). This script
// runs the measurable checks the rubric ADDED on 20 September 2026, so a
// reviewer can see in one line which of them a lesson fails before it spends
// a single edit, and a verifier can see whether an edit mended one.
//
// It reports by default and never fails the build: most of these checks are
// new and the scheme was not written to them, so a hard gate on day one would
// only be switched off. --gate exits 1 on any failure, for the day the ratchet
// takes them over. --json prints the findings as data.
//
// TWO SHAPES OF QUIZ BANK. The 21 older lessons keep their printed quizzes in
// teacher_notes.starter_quiz and teacher_notes.exit_quiz as arrays of
// { question, format, options?, answer, teaching_point }, and assessment.*
// stores only a count; the lessons written from 19 September keep them in
// teacher_notes.*_quiz and assessment.*_quiz as { title, instructions,
// questions: [{ q, options, answer }] }. The print routes read both. So does
// this.
//
// Usage: node scripts/check-lesson-rubric.mjs <module.json> [more.json ...] [--json] [--gate]
//        node scripts/check-lesson-rubric.mjs --all   (every file in content/modules)

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
const JSON_OUT = args.includes('--json')
const GATE = args.includes('--gate')
let files = args.filter(a => !a.startsWith('--'))
if (args.includes('--all')) files = fs.readdirSync(path.join(ROOT, 'content/modules')).filter(f => f.endsWith('.json')).sort().map(f => path.join(ROOT, 'content/modules', f))
if (!files.length) { console.error('usage: node scripts/check-lesson-rubric.mjs <module.json> [...] [--json] [--gate] | --all'); process.exit(2) }

const words = s => String(s ?? '').trim().split(/\s+/).filter(Boolean).length
const lower = v => JSON.stringify(v).toLowerCase()
const CONTENT_WORD = /[a-z]{5,}/g

// A quiz bank in either shape, as a list of { q, options, answer, why }.
function bank(tn, a, name) {
  const raw = (tn && tn[name]) ?? (a && a[name])
  if (Array.isArray(raw)) return raw.map(x => ({ q: x.question, format: x.format || 'tick_one', options: x.options || (x.format === 'true_false' ? ['True', 'False'] : []), answer: x.answer, why: x.teaching_point }))
  if (raw && Array.isArray(raw.questions)) return raw.questions.map(x => ({ q: x.q, format: x.format || 'tick_one', options: x.options || [], answer: x.answer, why: x.why ?? x.feedback }))
  return null
}
// A short answer item has no options by design; everything else needs two.
const needsOptions = qq => !/^(short_answer|open|free_text|match)/.test(String(qq.format))

function check(m) {
  const out = [] // { check, slide?, detail }
  const f = (check, detail, slide) => out.push({ check, slide, detail })
  const slides = m.slides || []
  const tn = m.teacher_notes || {}
  const a = m.assessment || {}
  const young = ['EYFS', 'KS1', 'KS2'].includes(m.key_stage)

  // C1 · feedback that says why, on every option. A bare "No." is held against
  // the primary lessons only: a fifteen year old is told no plainly on purpose.
  slides.forEach((s, i) => {
    if (s.type !== 'choice') return
    ;(s.options || []).forEach((o, k) => {
      const w = words(o.feedback)
      if (w < 12) f('C1', `option ${k + 1} feedback is ${w} word(s), under twelve: ${JSON.stringify(String(o.feedback ?? '').slice(0, 60))}`, i + 1)
      if (young && !o.correct && /^(no|wrong)\b/i.test(String(o.feedback ?? '').trim())) f('C1', `option ${k + 1} feedback opens with a bare no, in a primary lesson: ${JSON.stringify(String(o.feedback).slice(0, 60))}`, i + 1)
    })
    const right = (s.options || []).filter(o => o.correct).length
    if (right !== 1) f('C1', `${right} option(s) marked correct; a choice needs exactly one`, i + 1)
  })

  // C2 · a misconception, named and caught
  const misc = Array.isArray(tn.misconceptions) ? tn.misconceptions.map(x => typeof x === 'string' ? x : JSON.stringify(x)) : []
  if (!misc.length) f('C2', 'teacher_notes.misconceptions is empty')
  else {
    const choiceTexts = slides.filter(s => s.type === 'choice').map(s => lower([s.question, s.options, s.script]))
    const caught = misc.some(mis => {
      const ws = [...new Set(mis.toLowerCase().match(CONTENT_WORD) || [])]
      return choiceTexts.some(t => ws.filter(w => t.includes(w)).length >= 3)
    })
    if (!caught) f('C2', `${misc.length} misconception(s) named in the notes but no choice slide shares three content words with any of them; the check that catches it is not findable`)
  }

  // C3 · the tool has a name a child can say, and it recurs. The name is the
  // heading of an object tool, or the part of a string tool before its first
  // colon or full stop; its labels are the tool's lines, or the comma parts of
  // that name. A slide counts when it carries the name or two of the labels.
  let toolName = '', labels = []
  if (typeof tn.tool === 'string') { toolName = tn.tool.split(/[:.]/)[0].trim(); labels = toolName.split(',').map(x => x.trim()).filter(Boolean) }
  else if (tn.tool && typeof tn.tool === 'object') { toolName = String(tn.tool.heading || '').trim(); labels = (tn.tool.lines || []).map(String) }
  if (!toolName) f('C3', 'teacher_notes.tool has no name')
  else {
    const key = toolName.toLowerCase()
    const on = slides.map((s, i) => [i + 1, lower(s)]).filter(([, t]) => t.includes(key) || labels.filter(l => t.includes(l.toLowerCase())).length >= Math.min(2, labels.length)).map(([n]) => n)
    const recap = slides.findIndex(s => s.type === 'recap') + 1
    if (on.length < 3) f('C3', `the tool "${toolName}" is on ${on.length} slide(s) (${on.join(', ') || 'none'}), fewer than three`)
    if (recap && !on.includes(recap)) f('C3', `the recap (slide ${recap}) does not name the tool "${toolName}"`, recap)
  }

  // C4 · a scenario is a named, distanced post with a question
  slides.forEach((s, i) => {
    if (s.type !== 'scenario') return
    if (!String(s.handle ?? '').trim()) f('C4', 'scenario has no handle: nobody is named as the poster', i + 1)
    if (!String(s.prompt ?? '').trim()) f('C4', 'scenario has no prompt: the class is not asked anything about it on the wall', i + 1)
  })

  // C7 · teacher background at the point of need
  slides.forEach((s, i) => {
    if (s.type === 'concept' && s.phase === 'teach' && words(s.script) < 30) f('C7', `concept script is ${words(s.script)} words, under thirty: the teacher gets the what and not the why`, i + 1)
  })
  if (!String(tn.teacher_tip ?? '').trim()) f('C7', 'teacher_notes.teacher_tip is empty')

  // C8 · the lesson fits the hour
  const total = slides.reduce((n, s) => n + (Number(s.minutes) || 0), 0)
  if (total < 45 || total > 60) f('C8', `the slides run ${total} minutes; the window is 45 to 60`)

  // C9 · question variety
  const kinds = new Set(slides.map(s => s.type === 'interactive' ? `interactive/${s.component}` : s.type).filter(t => ['choice', 'discussion', 'tryit', 'scenario', 'interactive/verdict-sort', 'interactive/passport-page'].includes(t)))
  if (slides.some(s => s.type === 'diagram' && (s.verdicts || []).length)) kinds.add('diagram+verdicts')
  if (kinds.size < 3) f('C9', `${kinds.size} kind(s) of pupil response (${[...kinds].join(', ') || 'none'}); the floor is three`)

  // C10 · keywords with a meaning a pupil can read, and one asked for at the exit
  const exit = bank(tn, a, 'exit_quiz')
  const kw = slides.findIndex(s => s.type === 'keywords')
  if (kw === -1) f('C10', 'no keywords slide')
  else {
    const ws = slides[kw].words || []
    if (ws.length < 3 || ws.length > 4) f('C10', `${ws.length} keyword(s); three or four is the shape`, kw + 1)
    ws.forEach((w, k) => {
      if (!String(w.meaning ?? '').trim()) {
        if (String(w.definition ?? '').trim()) f('C10', `keyword ${k + 1} "${w.word}" stores its meaning under "definition", a field the wall does not read (shared/components/LessonPlayer.tsx draws w.meaning): the class sees the word and no meaning`, kw + 1)
        else f('C10', `keyword ${k + 1} "${w.word}" has no meaning on the wall`, kw + 1)
      }
    })
    if (exit && !ws.some(w => lower(exit).includes(String(w.word || '').toLowerCase()))) f('C10', 'no exit quiz question uses any of the keywords')
  }

  // C11 · the retrieval starter and the exit quiz, four to six each, with a why
  for (const name of ['starter_quiz', 'exit_quiz']) {
    const b = bank(tn, a, name === 'starter_quiz' ? 'starter_quiz' : 'exit_quiz') ?? bank(tn, a, name === 'starter_quiz' ? 'retrieval_starter' : 'exit_quiz')
    if (!b) { f('C11', `no ${name} bank in teacher_notes or assessment`); continue }
    if (b.length < 4 || b.length > 6) f('C11', `${name} has ${b.length} question(s); four to six is the shape`)
    b.forEach((qq, k) => {
      if (needsOptions(qq) && (!qq.options || qq.options.length < 2)) f('C11', `${name} question ${k + 1} (${qq.format}) has ${(qq.options || []).length} option(s)`)
      if (!String(qq.why ?? '').trim()) f('C11', `${name} question ${k + 1} carries no teaching point or why, so the printed answer sheet cannot say why`)
    })
  }
  return out
}

const results = []
let fails = 0
for (const file of files) {
  const m = JSON.parse(fs.readFileSync(file, 'utf8'))
  const found = check(m)
  fails += found.length
  results.push({ module_id: m.module_id, key_stage: m.key_stage, findings: found })
  if (!JSON_OUT) {
    const by = {}
    for (const x of found) (by[x.check] ||= []).push(x)
    console.log(`${m.module_id} (${m.key_stage}): ${found.length ? `${found.length} finding(s) on ${Object.keys(by).sort().join(', ')}` : 'every measurable check passes'}`)
    for (const c of Object.keys(by).sort()) for (const x of by[c]) console.log(`  ${c}${x.slide ? ` s${x.slide}` : ''}: ${x.detail}`)
  }
}
if (JSON_OUT) console.log(JSON.stringify(results, null, 1))
else console.log(`\n${files.length} module(s), ${fails} finding(s) across the measurable checks.${GATE && fails ? ' --gate: failing.' : ''}`)
if (GATE && fails) process.exit(1)
