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
import { respondsTo } from './council-checks.mjs'

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
  // teaching_point is read in this shape too, because it is the field the
  // print route (schools/lib/quiz.ts) puts on the answer sheet in both.
  if (raw && Array.isArray(raw.questions)) return raw.questions.map(x => ({ q: x.q, format: x.format || 'tick_one', options: x.options || [], answer: x.answer, why: x.why ?? x.teaching_point ?? x.feedback }))
  return null
}
// A short answer item has no options by design; everything else needs two.
const needsOptions = qq => !/^(short_answer|open|free_text|match|fill_blank)/.test(String(qq.format))

function check(m, standalone = false) {
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

  // C8 · the published length is the real one (21 September 2026)
  //
  // This used to fail any lesson outside a 45 to 60 minute window. The window
  // was a number written into the rubric rather than a finding with a source,
  // and 26 of the 29 lessons run past it, so the check was reporting the rule
  // as wrong 26 times over. The decision was to publish what the lessons run
  // and guide a short period in the teacher notes. The length claim is now
  // held by scripts/check-lesson-minutes.mjs, which compares the figure on the
  // public card to the sum of the slides. What is left here is the part that
  // was always a real defect: a teacher notes timing string that disagrees
  // with the slides, because the teacher reads that one on the prep sheet.
  const total = slides.reduce((n, s) => n + (Number(s.minutes) || 0), 0)
  const stated = Number((String(tn.timing ?? '').match(/^(\d+)/) || [])[1])
  if (Number.isFinite(stated) && stated !== total) f('C8', `teacher_notes.timing says ${stated} minutes and the slides run ${total}`)
  if (!Number.isFinite(stated)) f('C8', 'teacher_notes.timing does not open with the total minutes')

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
  const starter = bank(tn, a, 'starter_quiz') ?? bank(tn, a, 'retrieval_starter')
  for (const [name, b] of [['starter_quiz', starter], ['exit_quiz', exit]]) {
    if (!b) { f('C11', `no ${name} bank in teacher_notes or assessment`); continue }
    if (b.length < 4 || b.length > 6) f('C11', `${name} has ${b.length} question(s); four to six is the shape`)
    b.forEach((qq, k) => {
      if (needsOptions(qq) && (!qq.options || qq.options.length < 2)) f('C11', `${name} question ${k + 1} (${qq.format}) has ${(qq.options || []).length} option(s)`)
      if (!String(qq.why ?? '').trim()) f('C11', `${name} question ${k + 1} carries no teaching point or why, so the printed answer sheet cannot say why`)
    })
  }

  // ── the evidence checks the report made measurable (scripts/lesson-rubric.md, section B) ──
  const text = s => [s.title, s.heading, s.body, s.caption, s.prompt, s.question, s.lookFor, s.outcome, s.why, ...(s.lines || []), ...(s.points || []), ...(s.gains || []), ...(s.options || []).map(o => o.text), ...(s.steps || []).map(x => `${x.title || ''} ${x.text || ''}`), ...(s.words || []).map(w => `${w.word || ''} ${w.meaning || ''}`)].filter(Boolean).join(' ')
  // The same ruler the council and the contract use, imported rather than
  // written out a third time (21 September 2026).
  const responds = respondsTo
  const graphemes = s => [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(String(s ?? ''))].filter(g => g.segment.trim()).length
  const keywordsSlide = slides.find(s => s.type === 'keywords')
  const kwords = (keywordsSlide?.words || []).map(w => String(w.word || '').toLowerCase()).filter(Boolean)

  slides.forEach((s, i) => {
    const n = i + 1
    const isTeach = s.type === 'concept' || s.type === 'diagram'
    // E1 · one idea, named in the heading
    if (isTeach) { const w = words(s.heading); if (w < 3 || w > 10) f('E1', `heading is ${w} words; 3 to 10 names one idea`, n) }
    // E2 · nothing the lesson does not use
    if (s.type === 'concept' && s.emoji && graphemes(s.emoji) > 1) f('E2', `concept carries ${graphemes(s.emoji)} emoji; at most one`, n)
    // E3 · do not read the labels over the picture
    if (s.type === 'diagram') {
      const labels = [...(s.steps || []).map(x => x.text || ''), s.caption || ''].map(t => t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean))
      const sw = String(s.script || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean)
      for (const lab of labels) {
        if (lab.length < 8) continue
        for (let k = 0; k + 8 <= lab.length; k++) {
          const run = lab.slice(k, k + 8).join(' ')
          if (sw.join(' ').includes(run)) { f('E3', `the script reads a label aloud over the picture: "${run}"`, n); break }
        }
      }
      // E4 · labels live inside the thing they label
      ;(s.steps || []).forEach((x, k) => { if (!String(x.title ?? '').trim() || !String(x.text ?? '').trim()) f('E4', `step ${k + 1} lacks a title or text`, n) })
      // E5 · words and picture arrive together
      if (!/\b(point|points|pointing|walk|walks|tap|taps|touch|touches|trace|follow|one at a time|each step|step by step)\b/i.test(String(s.script || ''))) f('E5', 'the diagram script never tells the teacher to point at or walk the steps', n)
      // E15 · a structure, not a decoration
      if ((s.steps || []).filter(x => String(x.text ?? '').trim()).length < 2) f('E15', 'a diagram with fewer than two steps with text is a decoration', n)
    }
    // E6 · short segments. The report's calibration is one or two minutes; the
    // scheme's teach slides are written at two to four, so the house line is
    // three for a concept and four for a diagram, and anything past that is
    // a segment to split.
    if (s.type === 'concept' && Number(s.minutes) > 3) f('E6', `a concept slide runs ${s.minutes} minutes; past three, split the segment`, n)
    if (s.type === 'diagram' && Number(s.minutes) > 4) f('E6', `a diagram slide runs ${s.minutes} minutes; past four, split the segment`, n)
    // E40 · the friend voices the struggle first: the arrival beat carries a
    // question or a first person line before its last line
    if (s.type === 'digi' && s.phase === 'starter' && (s.lines || []).length > 1) {
      const opening = (s.lines || []).slice(0, -1)
      if (!opening.some(l => /\?/.test(String(l)) || /\b(I|I'm|I’m|I've|I’ve|me|my|we|us|our)\b/.test(String(l)))) f('E40', 'the arrival beat neither asks a question nor speaks in the first person before its last line', n)
    }
    // E14 · never read this while I explain that
    if (/\b(while I (explain|talk|read)|as I explain|read this while)\b/i.test(String(s.script || ''))) f('E14', 'the script asks the class to read while the teacher says something else', n)
    // E20, E21 · everyone answers, and three seconds first
    if (s.type === 'choice') {
      if (!/\b(fingers?|cards?|whiteboards?|hands?( up| or devices| down| in the air)?|devices|show me|thumbs|vote|cold call|stand (up|on)|everyone|all of you|whole class|number keys?|keycaps?|1, 2 or 3|a, b,? (or )?c|one, two or three|hold up|letter)\b/i.test(String(s.script || ''))) f('E20', 'the choice script never says how everyone answers at once', n)
    }
    if (s.type === 'choice' || s.type === 'discussion') {
      if (!/\b((\d+|five|ten|fifteen|twenty|thirty|forty|sixty) seconds|count (to|of) (three|3|five|5|ten|10)|thinking time|think(ing)? (first|time|on your own|silently|before|quietly)|silent(ly)? (think|thought)|let them think|give (them|it) (a moment|a second|time|three)|wait|pause|hands down|no hands|silence|quiet|a minute|one minute|two minutes)\b/i.test(String(s.script || ''))) f('E21', 'no think pause before answers are taken', n)
    }
    // E26, E27 · the item
    if (s.type === 'choice') {
      const opts = s.options || []
      if (opts.length < 2 || opts.length > 4) f('E26', `${opts.length} options; two to four, three by default`, n)
      const all = opts.map(o => String(o.text || '').toLowerCase())
      if (all.some(t => /\b(all|none) of the above\b/.test(t))) f('E27', 'an option is "all of the above" or "none of the above"', n)
      if (/\b(which|what)\b[^.?!]*\b(is not|isn't|isn’t|does not|doesn't|doesn’t|never|except|NOT)\b/.test(String(s.question || ''))) f('E27', `a negative stem: ${JSON.stringify(String(s.question).slice(0, 70))}`, n)
      // E29 · feedback about the answer, never the child
      opts.forEach((o, k) => { if (/\b(well done|good job|clever|brilliant|excellent|silly|naughty|lazy|stupid|shame on|you should know)\b/i.test(String(o.feedback || ''))) f('E29', `option ${k + 1} feedback praises or blames the child: ${JSON.stringify(String(o.feedback).slice(0, 60))}`, n) })
    }
    // E38 · no attention span claim
    if (/attention span/i.test(lower(s))) f('E38', 'the slide or its script asserts an attention span', n)
    // E39 · the pause changes the activity and claims nothing
    if (s.type === 'interactive' && s.component === 'star-breath' && s.config?.character) {
      // "next to you" is the same instruction as "your neighbour", and the list
      // did not know it. Migration 323 wrote "say which one to the person next
      // to you" into ks5-20 and this fired on a prompt that does exactly what
      // the rule asks. Widened rather than rewording a good prompt to satisfy a
      // word list, which is how a check starts driving the content.
      if (!/\b(partner|neighbour|pair|stand|stretch|tell|write|arms|shoulders|move|turn to|next to you)\b/i.test(String(s.config.prompt || ''))) f('E39', 'the half time breath prompt has no movement or pair talk in it', n)
      if (/\b(calm(s|er)? (you|them|the class) down|improves? (attention|focus|concentration|wellbeing)|makes? (you|them) (calm|focus))\b/i.test(lower(s))) f('E39', 'the breath claims a benefit no study found', n)
    }
    // E47 · safe distance, on the wall
    if (/\b(have you ever|has anyone (here )?(ever )?|hands up if you have|who here has)\b/i.test([s.prompt, s.question].filter(Boolean).join(' '))) f('E47', 'the wall asks a child to disclose', n)
  })

  // E27 · the correct option is the longest in at most half the items. (The
  // authored position is not checked: the player shuffles options per run.)
  const choices = slides.filter(s => s.type === 'choice' && (s.options || []).length >= 2)
  if (choices.length >= 4) {
    const longest = choices.filter(s => { const o = s.options; const c = o.find(x => x.correct); return c && o.every(x => String(x.text).length <= String(c.text).length) }).length
    if (longest > choices.length / 2) f('E27', `the correct option is the longest in ${longest} of ${choices.length} choices; a class learns to pick the long one`)
  }

  // E7, E12 · names before mechanism, one new term per slide
  const firstTeach = slides.findIndex(s => s.phase === 'teach')
  const kwIndex = slides.findIndex(s => s.type === 'keywords')
  if (kwIndex >= 0 && firstTeach >= 0 && kwIndex > firstTeach) f('E7', `the keywords slide (${kwIndex + 1}) comes after the first teach slide (${firstTeach + 1})`, kwIndex + 1)
  if (kwords.length) {
    const teachProse = slides.filter(s => s.phase === 'teach').map(text).join(' ').toLowerCase()
    for (const w of kwords) if (!teachProse.includes(w)) f('E7', `the keyword "${w}" never appears in teach phase prose`)
    const seen = new Set()
    slides.forEach((s, i) => {
      if (s.type !== 'concept') return
      const fresh = kwords.filter(w => !seen.has(w) && text(s).toLowerCase().includes(w))
      fresh.forEach(w => seen.add(w))
      if (fresh.length > 1) f('E12', `this concept slide is the first appearance of ${fresh.length} keywords (${fresh.join(', ')}); one new term per slide`, i + 1)
    })
  }

  // E11 · small steps with a response after each
  let run = 0, from = 0
  slides.forEach((s, i) => {
    if (responds(s) || s.phase !== 'teach') { run = 0; from = i + 1; return }
    run++
    if (run === 3) f('E11', `three teach slides in a row without a response (from slide ${from + 1})`, i + 1)
  })

  // E17, E43, E45 · the arc's minutes and shapes
  const phaseMins = p => slides.filter(s => s.phase === p).reduce((n, s) => n + (Number(s.minutes) || 0), 0)
  // (The starter phase here holds the title, the arrival, the objective and
  // the keywords as well as the review, so Rosenshine's five to eight minutes
  // is not tested against the whole phase; the retrieval beat's presence is.)
  if (!slides.some(s => s.phase === 'starter' && (s.type === 'choice' || s.type === 'discussion'))) f('E17', 'the starter has no choice or discussion to retrieve with')
  const firstConcept = slides.findIndex(s => s.type === 'concept')
  if (!slides.some((s, i) => s.type === 'discussion' && s.phase === 'starter' && String(s.lookFor || '').trim() && (firstConcept < 0 || i < firstConcept))) f('E43', 'no starter discussion with a lookFor before the first concept: the lesson does not start where they are')
  const pr = phaseMins('practise')
  if (pr < 5) f('E45', `the practise phase runs ${pr} minutes; the behaviour needs five`)
  if (!slides.some(s => s.phase === 'practise' && (s.type === 'interactive' || s.type === 'tryit'))) f('E45', 'no interactive or try it in the practise phase')

  // E18 · mixed retrieval formats
  if (starter) {
    const mc = starter.some(qq => (qq.options || []).length >= 3)
    const open = starter.some(qq => /^(short_answer|open|free_text|fill_blank)/.test(String(qq.format)))
    if (starter.length < 3 || !mc || !open) f('E18', `the starter quiz has ${starter.length} item(s)${mc ? '' : ', no multiple choice item'}${open ? '' : ', no open or fill the blank item'}`)
  }

  // E19 · a hinge in every cycle
  const cycles = Array.isArray(tn.cycles) ? tn.cycles.length : 0
  const teachChoices = slides.filter(s => s.type === 'choice' && s.phase === 'teach').length
  if (cycles && teachChoices < cycles) f('E19', `${teachChoices} choice(s) in the teach phase for ${cycles} cycles; every cycle wants a hinge`)

  // E24 · a short recap
  const recapSlide = slides.find(s => s.type === 'recap')
  if (recapSlide) { const p = (recapSlide.points || []).length; if (p < 3 || p > 5) f('E24', `the recap has ${p} points; three to five`) }
  else f('E24', 'no recap slide')

  // E25 · the teacher thinks aloud once
  if (!slides.some(s => s.phase === 'teach' && /\b(I would|I'd|I’d|I notice|I would notice|what I (see|notice|ask|do) first|my first thought|here is what I|watch me|let me show you how I)\b/i.test(String(s.script || '')))) f('E25', 'no teach script models a thought aloud')

  // E30 · every hard question has a written answer
  const hq = Array.isArray(tn.hard_questions) ? tn.hard_questions : []
  if (!hq.length) f('E30', 'teacher_notes.hard_questions is empty')
  hq.forEach((h, k) => { const has = typeof h === 'string' ? h.trim().length > 20 : (String(h.question ?? h.q ?? '').trim() && String(h.answer ?? h.a ?? '').trim()); if (!has) f('E30', `hard question ${k + 1} has no written answer`) })

  // E41 · what would the friend do, in the primary lessons
  if (young) {
    const friend = (slides.find(s => s.type === 'title') || {}).character
    if (friend && !slides.some(s => (s.phase === 'practise' || s.type === 'discussion') && new RegExp(`\\b${friend}\\b`, 'i').test([s.prompt, s.question, s.body, s.heading].filter(Boolean).join(' ')))) f('E41', `no practise or discussion prompt asks what ${friend} would do or has the child tell ${friend}`)
  }

  // E46, E48 · sequenced, hooked to the statute and to home
  if (words(tn.prior_knowledge) < 8) f('E46', 'teacher_notes.prior_knowledge does not name what came before')
  const row = m.row || {}
  // A standalone lesson (content/standalone, schools/lib/taster.ts) is outside
  // the scheme by design: it claims no statutory cover and fills no passport
  // page, so an empty hook, strand or passport line is the point, not a gap.
  if (!standalone && !(row.statutory_hooks || []).length) f('E48', 'row.statutory_hooks is empty')
  if (!standalone && !(row.efcw_strands || []).length) f('E48', 'row.efcw_strands is empty')
  for (const k of ['headline', 'taught', 'try_this', 'family_question', ...(standalone ? [] : ['passport'])]) if (!String((m.parent_note || {})[k] ?? '').trim()) f('E48', `parent_note.${k} is empty`)

  // E50 · the adjustments owed in advance, specific. send and differentiation
  // are objects keyed by need (eal, send, stretch, support); each value is
  // held to the floor on its own.
  const flat = (label, v) => typeof v === 'string' ? [[label, v]] : (v && typeof v === 'object') ? Object.entries(v).map(([k, x]) => [`${label}.${k}`, typeof x === 'string' ? x : JSON.stringify(x)]) : [[label, '']]
  for (const [label, v] of [...flat('send', tn.send), ...flat('paper_fallback', tn.paper_fallback), ...flat('differentiation', tn.differentiation)]) {
    if (words(v) < 20) f('E50', `teacher_notes.${label} is ${words(v)} words; the adjustment owed in advance needs to be specific`)
    if (/\bas needed\b/i.test(String(v || ''))) f('E50', `teacher_notes.${label} says "as needed", which is not an adjustment`)
  }
  return out
}

const results = []
let fails = 0
for (const file of files) {
  const m = JSON.parse(fs.readFileSync(file, 'utf8'))
  const found = check(m, /[\\/]content[\\/]standalone[\\/]/.test(fs.realpathSync(file)))
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
