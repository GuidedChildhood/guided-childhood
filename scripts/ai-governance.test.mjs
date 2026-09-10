#!/usr/bin/env node
// THE ASSESSMENT FRAMEWORK'S OWN TESTS.
//
// No database, no browser, no secrets, so this runs in CI beside the council
// tests. The framework is pure by design precisely so it can be tested this
// cheaply, and so the same logic can later run against a real table without
// anything here changing.
//
// The test that matters most is the last one: every lesson this feature offers
// a school has to be a lesson that actually exists. A governance tool that
// links a teacher to a 404 is worse than one that links nothing.

import { QUESTIONS, APPLICABLE, BY_SECTION, SECTIONS } from '../shared/ai-governance/questions.ts'
import { assess, rateCategory, overallStatus, classify, isPupilFacing, CATEGORIES, priorityOrder } from '../shared/ai-governance/rating.ts'
import { PASSPORT_LINKS, raisedLinks } from '../shared/ai-governance/passport-links.ts'
import { PASSPORT_STAGES } from '../shared/passport-stages.ts'
import { CURRICULUM } from '../shared/schools-curriculum.ts'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

const blank = (over = {}) => ({
  id: 't', product: 'T', provider: 'P', url: '', purpose: '', problem: '', alternative: '',
  yearGroups: [], owner: '', facing: 'pupil', required: false, productType: 'unclassified',
  answers: {}, signOff: { dpo: {}, dsl: {}, slt: {}, governors: {} },
  reviewedOn: null, nextReviewOn: null, decision: null, conditions: '', history: [],
  createdAt: '', updatedAt: '', ...over,
})

// ── The question set ────────────────────────────────────────────────
{
  const ids = QUESTIONS.map(q => q.id)
  ok('question ids are unique', new Set(ids).size === ids.length,
    `duplicates: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(', ')}`)

  const sectionKeys = new Set(SECTIONS.map(s => s.key))
  const orphan = QUESTIONS.filter(q => !sectionKeys.has(q.section))
  ok('every question sits in a declared section', orphan.length === 0,
    orphan.map(q => q.id).join(', '))

  const weightless = QUESTIONS.filter(q => q.concernWhen && !q.weight)
  ok('every question with a concern has a weight', weightless.length === 0,
    weightless.map(q => q.id).join(', '))

  const uncategorised = QUESTIONS.filter(q => q.concernWhen && !q.category)
  ok('every question with a concern feeds a category', uncategorised.length === 0,
    uncategorised.map(q => q.id).join(', '))

  const catKeys = new Set(CATEGORIES.map(c => c.key))
  const badCat = QUESTIONS.filter(q => q.category && !catKeys.has(q.category))
  ok('every category referenced is a real one', badCat.length === 0,
    badCat.map(q => q.id).join(', '))

  // Every category must have at least one question or it can never be rated.
  const empty = CATEGORIES.filter(c => !QUESTIONS.some(q => q.category === c.key))
  ok('every category has questions', empty.length === 0, empty.map(c => c.key).join(', '))
}

// ── No dashes, the standing copy rule ───────────────────────────────
{
  const dashed = []
  for (const q of QUESTIONS) {
    for (const field of ['prompt', 'guidance']) {
      if (q[field] && /[-–—]/.test(q[field])) dashed.push(`${q.id}.${field}`)
    }
  }
  for (const s of SECTIONS) {
    if (/[-–—]/.test(s.title) || /[-–—]/.test(s.blurb)) dashed.push(`section:${s.key}`)
  }
  for (const l of PASSPORT_LINKS) {
    for (const field of ['risk', 'competency', 'gap']) {
      if (l[field] && /[-–—]/.test(l[field])) dashed.push(`link:${l.id}.${field}`)
    }
  }
  ok('no dashes in any copy', dashed.length === 0, dashed.join(', '))
}

// ── Who gets asked what ─────────────────────────────────────────────
{
  const pupil = APPLICABLE(true)
  const staff = APPLICABLE(false)
  ok('a teacher only tool is asked fewer questions', staff.length < pupil.length)
  ok('no pupil only question reaches a staff tool',
    staff.every(q => !q.pupilOnly))
  ok('the companion questions are pupil only',
    BY_SECTION('relationship', false).length === 0,
    'relationship questions should not be asked of a staff tool')

  // A review nobody has classified yet must still be asked about children.
  // The other way round, an untouched review hides every child specific
  // question and can be worked to a comfortable result without one appearing.
  ok('a review with nobody named yet is still asked the child questions',
    isPupilFacing(blank({ facing: null })))
  ok('only a positive staff answer takes the child questions away',
    !isPupilFacing(blank({ facing: 'teacher' })) && !isPupilFacing(blank({ facing: 'admin' })))

  const unset = assess(blank({ facing: null }), QUESTIONS)
  const pupilTotal = assess(blank({ facing: 'pupil' }), QUESTIONS).progress.total
  ok('an unclassified review is scored against the full question set',
    unset.progress.total === pupilTotal,
    `unset asked ${unset.progress.total}, pupil facing asks ${pupilTotal}`)
}

// ── Rating ──────────────────────────────────────────────────────────
{
  const r = rateCategory(blank(), 'data', QUESTIONS)
  ok('an empty review is unknown, never green', r.rating === 'unknown', `got ${r.rating}`)
  ok('unknown says how many are open', r.reasons.length > 0)

  const material = blank({ answers: { 'd-training': { value: 'yes' } } })
  ok('a material concern turns the category red',
    rateCategory(material, 'data', QUESTIONS).rating === 'red')

  const clarifyOnly = blank({ answers: { 'd-prompts': { value: 'yes' } } })
  ok('a clarify concern is amber, not red',
    rateCategory(clarifyOnly, 'data', QUESTIONS).rating === 'amber',
    `got ${rateCategory(clarifyOnly, 'data', QUESTIONS).rating}`)

  // Answer every data question the safe way and the category goes green.
  const green = blank()
  for (const q of APPLICABLE(true).filter(q => q.category === 'data')) {
    green.answers[q.id] = q.concernWhen === 'yes'
      ? { value: 'no' }
      : q.concernWhen === 'no' ? { value: 'yes' }
      : q.kind === 'text' ? { text: 'recorded' } : { value: 'no' }
  }
  ok('a fully and safely answered category is green',
    rateCategory(green, 'data', QUESTIONS).rating === 'green',
    `got ${rateCategory(green, 'data', QUESTIONS).rating}: ${JSON.stringify(rateCategory(green, 'data', QUESTIONS).reasons)}`)

  ok('na counts as answered',
    rateCategory(blank({ answers: Object.fromEntries(
      APPLICABLE(true).filter(q => q.category === 'security').map(q => [q.id, { value: 'na' }]),
    ) }), 'security', QUESTIONS).rating === 'green')
}

// ── Overall status ──────────────────────────────────────────────────
{
  const cat = (rating) => ({ category: 'data', rating, reasons: [], answered: 1, total: 1 })
  ok('red anywhere means do not deploy yet',
    overallStatus([cat('green'), cat('red'), cat('amber')]) === 'do-not-deploy-yet')
  ok('unknown outranks amber',
    overallStatus([cat('amber'), cat('unknown')]) === 'review-required')
  ok('amber alone is approve with conditions',
    overallStatus([cat('green'), cat('amber')]) === 'approve-with-conditions')
  ok('all green is approve', overallStatus([cat('green'), cat('green')]) === 'approve')
  ok('an untouched review never reads as approved',
    assess(blank(), QUESTIONS).suggested !== 'approve')

  const order = priorityOrder([cat('green'), cat('red'), cat('unknown'), cat('amber')])
  ok('the worst thing is shown first', order[0].rating === 'red')
}

// ── Product type ────────────────────────────────────────────────────
{
  ok('friendship reads as a companion',
    classify(blank({ answers: { 'r-friendship': { value: 'yes' } } })).suggested === 'companion')
  ok('a persistent character is not automatically a companion',
    classify(blank({ answers: { 'r-persistent-identity': { value: 'yes' } } })).suggested === 'character')
  ok('a plain assistant is not called a companion',
    classify(blank({ productType: 'assistant' })).suggested === 'assistant')
  ok('nothing answered means unclassified, not a guess',
    classify(blank()).suggested === 'unclassified')
}

// ── The passport and lesson join ────────────────────────────────────
{
  const ids = PASSPORT_LINKS.map(l => l.id)
  ok('link ids are unique', new Set(ids).size === ids.length)

  const questionIds = new Set(QUESTIONS.map(q => q.id))
  const badTrigger = PASSPORT_LINKS.flatMap(l =>
    l.when.filter(w => !questionIds.has(w.questionId)).map(w => `${l.id} -> ${w.questionId}`))
  ok('every link is triggered by a real question', badTrigger.length === 0, badTrigger.join(', '))

  const stageKeys = new Set(Object.keys(PASSPORT_STAGES))
  const badStage = PASSPORT_LINKS.flatMap(l =>
    l.stages.filter(s => !stageKeys.has(s)).map(s => `${l.id} -> ${s}`))
  ok('every link names a real passport stage', badStage.length === 0, badStage.join(', '))

  // THE ONE THAT MATTERS: never send a teacher to a lesson that does not exist.
  const moduleIds = new Set(CURRICULUM.map(m => m.moduleId))
  const badModule = PASSPORT_LINKS.flatMap(l =>
    l.modules.filter(m => !moduleIds.has(m)).map(m => `${l.id} -> ${m}`))
  ok('every linked lesson exists in the curriculum', badModule.length === 0, badModule.join(', '))

  const silent = PASSPORT_LINKS.filter(l => l.modules.length === 0 && !l.gap)
  ok('a link with no lesson explains why', silent.length === 0, silent.map(l => l.id).join(', '))

  ok('nothing is raised by an empty review', raisedLinks({}).length === 0)
  ok('a companion answer raises the companion link',
    raisedLinks({ 'r-friendship': { value: 'yes' } }).some(l => l.id === 'companion'))
  // This assertion used to say the opposite: that the companion link had no
  // module and said so. That was right while the scheme had no lesson about a
  // machine that acts like a person who cares, and the gap was shown to schools
  // in amber rather than papered over with the persuasion or mood lessons. The
  // lesson exists now (ks3-22, migration 282), so the honest state is a real
  // link and the test moves with it. What has not changed is the rule the two
  // checks above enforce: every link either names a lesson that exists, or
  // explains why it cannot.
  const companion = PASSPORT_LINKS.find(l => l.id === 'companion')
  ok('the companion link now names a lesson',
    companion?.modules.length >= 1 && !companion?.gap,
    `modules: ${companion?.modules.join(', ') || 'none'}, gap: ${companion?.gap ? 'still set' : 'cleared'}`)
}

console.log(failed
  ? `\nai-governance: ${failed} failing check${failed === 1 ? '' : 's'}\n`
  : `ai-governance: ${QUESTIONS.length} questions, ${PASSPORT_LINKS.length} passport links, all checks pass.`)
process.exit(failed ? 1 : 0)
