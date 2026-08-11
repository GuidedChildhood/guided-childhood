// What a generated tutor lesson is allowed to be.
//
// Justin, 11 August 2026: "let's build this plan to make it the best private
// tutor to work at every stage."
//
// The tutor is the first thing in this product where a model writes something a
// CHILD reads. Everywhere else DiGi writes to a parent, who is a grown up and
// can tell when an answer is off. A nine year old cannot, and will not tell
// anybody, and will remember it.
//
// So the guarantees are not in the prompt, they are in lib/learning/tutor-deck,
// and this file throws the bad cases at them. Every one below has happened to
// somebody's model at some point.
//
// Usage: node --experimental-strip-types scripts/check-tutor-deck.mjs

import { validateDeck, gradeable, scrub, DEFICIT, ALLOWED_TYPES } from '../lib/learning/tutor-deck.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const q = (question, extra = {}) => ({
  type: 'choice', phase: 'prove', question,
  options: [
    { text: 'the right one', correct: true, feedback: 'Yes, that is it.' },
    { text: 'a wrong one', correct: false, feedback: 'Have another look at the second step.' },
  ],
  ...extra,
})

const GOOD = [
  { type: 'title', title: 'Fractions that are twins' },
  { type: 'concept', phase: 'teach', heading: 'Two fractions, one amount', body: 'Half a pizza and two quarters are the same amount.' },
  { type: 'tryit', phase: 'practise', heading: 'Have a go', body: 'Say three twins of 1/3 out loud.' },
  q('Which one is a twin of 1/2?'),
  q('6/9 simplifies to which one?'),
  { type: 'recap', phase: 'close', heading: 'What you learned', points: ['one', 'two', 'three'] },
  { type: 'digi', phase: 'close', heading: 'Nice one', lines: ['Fractions stop being scary once you spot the twins.'] },
]

// ── THE ORDINARY CASE ───────────────────────────────────────────────────────
const good = validateDeck(GOOD)
check('a well formed deck passes', good.ok, good.ok ? '' : good.reason)
check('and keeps all seven slides', good.ok && good.slides.length === 7, good.ok ? String(good.slides.length) : '')

// ── THE PASS MARK HAS TO BE REAL ────────────────────────────────────────────
//
// LessonPlayer computes 70 percent from choice slides. A deck with one or none
// is passed by tapping through, and a lesson that cannot be got wrong has
// checked nothing. Two is the floor.
check('one question is not enough',
  validateDeck(GOOD.filter(s => s.type !== 'choice').concat([q('only one')])).ok === false)
check('and no questions at all certainly is not',
  validateDeck(GOOD.filter(s => s.type !== 'choice')).ok === false)

// A question with two right answers cannot be graded, so it does not count
// towards the floor even though it is shaped like one.
const twoCorrect = { ...q('which'), options: [
  { text: 'a', correct: true, feedback: 'x' },
  { text: 'b', correct: true, feedback: 'y' },
] }
check('a question with two right answers does not count',
  !gradeable(twoCorrect))
check('so a deck carried by one is rejected',
  validateDeck([...GOOD.filter(s => s.type !== 'choice'), q('real one'), twoCorrect]).ok === false)
check('and so is one with no right answer at all',
  !gradeable({ ...q('which'), options: [
    { text: 'a', correct: false, feedback: 'x' },
    { text: 'b', correct: false, feedback: 'y' },
  ] }))
check('a single option is not a question',
  !gradeable({ ...q('which'), options: [{ text: 'a', correct: true, feedback: 'x' }] }))

// ── NOTHING THAT TELLS A CHILD THEY ARE BEHIND ──────────────────────────────
//
// This is the rule the whole feature rests on. A child flagged something as
// hard, or a parent noticed, and the ONLY acceptable answer to that is help. If
// the lesson reads as a punishment for being honest, the child stops being
// honest, and the flag is the mechanism everything else runs on.
for (const word of [
  'Do not worry if you found this tricky',
  'This will help you catch up',
  'You have been struggling with fractions',
  'This is a weak spot for you',
  'You are a bit behind on this',
  'It is fine to be bad at maths',
]) {
  const deck = [...GOOD.slice(0, 3), { type: 'concept', heading: 'Hello', body: word }, q('a'), q('b')]
  check(`rejected: "${word}"`, validateDeck(deck).ok === false)
}

// The sweep reaches into the feedback on a wrong answer, which is exactly where
// a well meaning model puts it.
check('and it reaches inside an option feedback line',
  validateDeck([...GOOD.slice(0, 3), q('a'), {
    ...q('b'),
    options: [
      { text: 'right', correct: true, feedback: 'Yes.' },
      { text: 'wrong', correct: false, feedback: 'No bother if you find this tricky.' },
    ],
  }]).ok === false)

// And it does not fire on ordinary teaching words that merely contain them.
// The list is bounded on word edges on purpose: a word problem is full of
// perfectly innocent sentences, and a sweep that rejects them sends the parent
// back to press the button again for no reason.
check('but a lesson about what is left behind a decimal point is fine',
  DEFICIT.test('Look at the digit left of the point') === false)
check('and poorly, which in English means ill, is fine in a word problem',
  DEFICIT.test('Sam was poorly on Tuesday so he read 3/4 of the book') === false)
check('while telling a child their answer was poor is not',
  DEFICIT.test('Your last answer was poor'))

// ── NO DASHES, ANYWHERE, EVER ───────────────────────────────────────────────
const dashed = validateDeck([
  ...GOOD.slice(0, 2),
  { type: 'concept', heading: 'Twins - and how to spot them', body: 'Times both by the same number — that is all.' },
  q('a'), q('b'),
])
check('a deck with dashes still passes', dashed.ok)
check('but the dashes are gone from it',
  dashed.ok && !JSON.stringify(dashed.slides).match(/[-–—]/),
  dashed.ok ? '' : 'deck rejected')
check('scrub reaches every depth',
  !JSON.stringify(scrub({ a: [{ b: 'one - two' }] })).match(/-/))
check('and leaves non strings alone',
  scrub({ n: 3, t: true, z: null }).n === 3)

// ── ONLY THE SIX SHAPES ─────────────────────────────────────────────────────
//
// The contract has fifteen slide types and several are traps for a model:
// `stat` wants a real figure with a real source, `video` wants a URL that
// exists, `scenario` is a fabricated social post. A model asked for a maths
// lesson will happily produce all three, and every one would be invented.
for (const t of ['stat', 'video', 'scenario', 'interactive', 'quote', 'discussion', 'keywords', 'objective', 'diagram']) {
  check(`a ${t} slide is dropped`, !ALLOWED_TYPES.has(t))
}
const withStat = validateDeck([
  ...GOOD.slice(0, 3),
  { type: 'stat', figure: '9 in 10', claim: 'children find fractions hard', source: 'made up' },
  q('a'), q('b'),
])
check('a deck carrying an invented statistic loses it', withStat.ok)
check('and the statistic is genuinely not in what is stored',
  withStat.ok && !JSON.stringify(withStat.slides).includes('9 in 10'))
check('a video with a URL that does not exist goes the same way',
  validateDeck([...GOOD.slice(0, 3), { type: 'video', src: 'https://example.com/nope.mp4' }, q('a'), q('b')])
    .ok === true)

// ── AND THE OBVIOUS RUBBISH ─────────────────────────────────────────────────
check('nothing at all is rejected', validateDeck(null).ok === false)
check('an empty array is rejected', validateDeck([]).ok === false)
check('a string pretending to be a deck is rejected', validateDeck('slides!').ok === false)
check('an array of nothing recognisable is rejected',
  validateDeck([{ type: 'wat' }, { hello: true }, 7]).ok === false)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
