import { readFile } from 'node:fs/promises'
import { notFound } from 'next/navigation'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { parseSlides, type LessonSlide, type LessonCycle } from '@gc/shared/lesson-slides'

// Dev only fixture: the cinematic player with a sample Rosenshine deck so
// the design can be checked without a database or a signed in parent.
// ?slide=N opens at that slide, ?class=1 renders the whole class projector
// mode, ?projector=1 the classroom type scale on its own. Never reachable in
// production.
//
// PROJECTOR WAS MISSING HERE, which is its own small joke: the fixture that
// exists so the design can be checked could not render the surface most
// likely to be wrong. Class mode implies it, because class mode IS the
// projector showcase, and the flag stands alone so the teach route's exact
// combination (projector without the family finish) can be looked at too.
//
// GC_DEV_SLIDES points at a JSON file of real slides, which is how we measure
// what actually FITS on a classroom wall rather than asserting a word ceiling
// and rewriting good lessons to meet it. The point is to put the real rows
// through the real player: a reimplementation of the concept slide's CSS in a
// measuring script would drift from the component within a week and we would
// be measuring the copy, not the product. Dev only, behind the same
// production notFound as everything else here.
//
// GC_DEV_CYCLES does the same for the named learning cycles, because the cycle
// map is chrome that only exists on a projector and it was the one classroom
// surface no fixture could render. Without it the contrast check measured
// every label on the wall except two of them.

export const dynamic = 'force-dynamic'

const SLIDES: LessonSlide[] = [
  {
    type: 'title', phase: 'connect', minutes: 1,
    eyebrow: 'Explorer stage', title: 'How the feed decides what you see',
    character: 'football',
    body: 'A five minute look inside the machine.',
  },
  {
    type: 'objective', phase: 'connect', minutes: 1,
    outcome: 'I can explain what the feed is trying to get from me.',
    why: 'Every app you open is guessing what will hold you. Once you can see the guess, you get to decide whether to go along with it.',
    gains: [
      'Name the one number the feed is built to grow.',
      'Spot two signals the machine reads off you.',
      'Say one thing you will do differently tonight.',
    ],
  },
  {
    type: 'interactive', phase: 'connect', minutes: 2, component: 'star-breath',
    caption: 'Follow the star. In as it grows, out as it shrinks.',
  },
  {
    type: 'keywords', phase: 'starter', minutes: 1, heading: 'Words on the board',
    words: [
      { word: 'watch time', meaning: 'The one number the feed is built to grow.' },
      { word: 'signals', meaning: 'Pauses, replays, likes: everything the machine reads.' },
    ],
  },
  {
    type: 'concept', phase: 'teach', minutes: 2, emoji: '🧲',
    heading: 'The feed is built to hold you',
    body: 'Every scroll is a guess about what keeps you watching one more minute. The app is not being kind when it shows you exactly what you love. It is doing its job, and its job is your attention.',
  },
  {
    type: 'diagram', phase: 'teach', minutes: 2,
    heading: 'The loop, one turn at a time',
    caption: 'Four steps, and then it starts again.',
    steps: [
      { emoji: '👀', title: 'You watch', text: 'You stop on something for two seconds longer than usual.' },
      { emoji: '📡', title: 'The feed learns', text: 'That pause is a signal, and it gets written down.' },
      { emoji: '📦', title: 'More of the same', text: 'The next batch is built from what you just told it.' },
    ],
    verdicts: ['Believe it', 'Pause on it', 'Do not share it'],
  },
  {
    type: 'stat', phase: 'teach', minutes: 1,
    figure: '9 in 10',
    claim: 'children aged 8 to 17 use a video sharing app every week',
    source: 'Ofcom, Children and Parents: Media Use and Attitudes, 2025',
  },
  {
    type: 'video', phase: 'teach', minutes: 2,
    src: 'https://example.invalid/dev-fixture.mp4',
    caption: 'Teo explains the loop to his class.',
    alternative: {
      spoken: ['The feed is not reading your mind. It is reading your thumbs.'],
      described: 'Teo stands at a whiteboard and draws a circle with four arrows, tapping each one as he names it.',
      onScreen: 'WATCH TIME',
    },
  },
  {
    type: 'interactive', phase: 'teach', minutes: 2, component: 'feed-loop',
    caption: 'Tap round the loop. Watch how fast it closes.',
  },
  {
    type: 'concept', phase: 'teach', minutes: 2, emoji: '⏱️',
    heading: 'Watch time is the only score',
    body: 'Likes and follows are nice for you. Watch time is what the company counts. When you know which number is being played for, the whole feed starts to make sense.',
  },
  {
    type: 'scenario', phase: 'practise', minutes: 2,
    label: 'The evidence', platform: 'feed',
    handle: 'gamer_chat_uk', avatar: '🎮',
    meta: 'Game chat · just now',
    text: 'You will NEVER believe what they are hiding from you. Watch to the end.',
    image: '😱',
    stats: '❤ 89.2K   ↻ 41K   💬 12K',
    prompt: 'What is this post actually asking you to do?',
  },
  {
    type: 'choice', phase: 'practise', minutes: 2,
    question: 'The feed keeps showing you videos you love. Why?',
    options: [
      { text: 'It is learning what holds my attention, so I stay longer', correct: true, feedback: 'Exactly. The feed works for the app, not for you. Knowing that is the superpower.' },
      { text: 'It likes me and wants to be kind', correct: false, feedback: 'It feels that way, and that is the clever part. The feed is a machine guessing what keeps you watching.' },
      { text: 'It is random, nobody chooses', correct: false, feedback: 'It is the opposite of random. Every video is a guess about what holds you one more minute.' },
    ],
  },
  {
    type: 'interactive', phase: 'practise', minutes: 2, component: 'signal-meter',
    caption: 'Tap what you would do. Watch which taps shout loudest.',
  },
  {
    type: 'discussion', phase: 'practise', minutes: 2,
    prompt: 'Whose job is it to decide what you watch: yours, or the feed\'s?',
    mode: 'pairs', seconds: 60,
    lookFor: 'A good answer says both, and then says who gets the final say.',
  },
  {
    type: 'interactive', phase: 'prove', minutes: 2, component: 'verdict-sort',
    caption: 'Sort each post. Believe it, pause on it, or leave it alone.',
  },
  {
    type: 'interactive', phase: 'prove', minutes: 2, component: 'class-tally',
    caption: 'Hands up, then tap the class answer.',
  },
  {
    type: 'interactive', phase: 'prove', minutes: 2, component: 'spread-race',
    caption: 'Same day, two posts. Watch which one travels.',
  },
  {
    type: 'quote', phase: 'prove', minutes: 1,
    label: 'Say it like Pebble',
    text: 'I can enjoy the feed and still be the one holding the controls.',
  },
  {
    type: 'tryit', phase: 'close', minutes: 1, label: 'Your turn', heading: 'Retrain one feed this week',
    body: 'Pick a topic you actually want more of and spend ten minutes deliberately pausing on, liking and finishing only that. Watch the feed obey you over the week.',
  },
  {
    type: 'recap', phase: 'close', minutes: 1, heading: 'The lesson in three lines',
    points: [
      'The feed has one job: your watch time.',
      'It reads signals, not feelings.',
      'See the machine, and you hold the controls.',
    ],
  },
  {
    type: 'digi', phase: 'close', minutes: 1, heading: 'DiGi says',
    lines: [
      'The feed is a machine, and now you know its trick.',
      'You can enjoy it and still be the one in charge.',
      'Watching with your eyes open is the whole skill.',
    ],
  },
]

// Named after two teach slides in the deck above, which is how the player
// anchors a cycle: the map is chrome that exists only on a projector, so
// without these the classroom contrast guard measured every label on the wall
// except the two the cycle map puts there.
const CYCLES: LessonCycle[] = [
  { verb: 'Look', title: 'The feed is built to hold you', minutes: 6, outcome: 'Every child can say what the feed is trying to get from them.' },
  { verb: 'Ask', title: 'Watch time is the only score', minutes: 7, outcome: 'Every child can name the number the company actually counts.' },
]

async function slidesToRender(): Promise<LessonSlide[]> {
  const from = process.env.GC_DEV_SLIDES
  if (!from) return SLIDES
  // parseSlides is the same validator the teach route uses, so a row that
  // would not render in a classroom does not quietly render here either.
  const parsed = parseSlides(JSON.parse(await readFile(from, 'utf8')))
  if (!parsed) throw new Error(`GC_DEV_SLIDES at ${from} did not parse as slides`)
  return parsed
}

async function cyclesToRender(): Promise<LessonCycle[]> {
  const from = process.env.GC_DEV_CYCLES
  if (!from) return CYCLES
  return JSON.parse(await readFile(from, 'utf8')) as LessonCycle[]
}

export default async function LessonPlayerFixturePage({ searchParams }: { searchParams: Promise<{ slide?: string; class?: string; projector?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const sp = await searchParams
  const slides = await slidesToRender()
  const cycles = await cyclesToRender()
  const slideIndex = Math.max(0, Number(sp.slide) || 0)
  const classMode = sp.class === '1'
  const projector = classMode || sp.projector === '1'
  return (
    <LessonPlayer
      lessonId="00000000-0000-0000-0000-000000000000"
      lessonSource="lesson"
      slides={slides}
      backHref="/dev/lesson-player"
      completeEndpoint={null}
      classMode={classMode}
      cycles={cycles}
      projector={projector}
      initialIndex={slideIndex}
      badges={{ keyStage: 'KS2/3', strand: 'Managing online information' }}
    />
  )
}
