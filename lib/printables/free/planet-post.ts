// THE PLANET POST: a Happy News newspaper for children, about screens.
//
// Justin, 13 October 2026: "maybe a newspaper also in happy news style which
// teaches using screens for kids." Approved the same day as the first of five
// free printables (plans/2026-10-13-free-printables-lead-magnets-plan.md),
// named The Planet Post, four A4 pages plus an A5 booklet.
//
// AN ISSUE IS DATA. The layout lives in components/printables/news; this file
// is the words. Issue 2 (bedtime) and Issue 3 (real or fake online) are a
// writing job, not a build, which is what made Big Life Journal's freebies a
// series people wait for rather than a one off they forget.
//
// Every claim has a proof path in the product: the three jars are the child
// app's star economy (app/k/[token]: core minutes, minutes per star, the
// protected windows no star can buy); the jobs and family jobs are the quest
// board (app/(dashboard)/dashboard/quests, is_family_job); Orbit's corner is a
// real lesson strand. No dashes anywhere, the house rule for every word.

export type PlanetPostIssue = {
  slug: string
  number: number
  theme: string
  weather: string
  editor: { name: string; img: string; note: string }
  lead: { headline: string; paras: string[]; task: string }
  inside: { label: string; page: number }[]
  jars: {
    headline: string
    intro: string
    mine: { label: string; line: string }
    earned: { label: string; line: string }
    nobodys: { label: string; items: string[]; line: string }
    starSteps: string[]
  }
  bedColumn: { by: string; img: string; headline: string; paras: string[]; swapsHead: string; swaps: string[]; fills: string[] }
  realOrPretend: {
    by: string
    img: string
    headline: string
    intro: string
    messages: { from: string; text: string }[]
    answers: string[]
  }
  wordSearch: { headline: string; words: string[]; grid: string[] }
  myHeadline: { headline: string; prompt: string }
  jobs: { headline: string; intro: string; earn: string[]; family: { headline: string; items: string[]; line: string } }
  promise: { by: string; img: string; headline: string; lines: string[] }
  grownUp: { kicker: string; headline: string; line: string; url: string; shown: string }
}

// The word search is placed by hand rather than generated, so every word is
// across or down (the reading direction a six year old searches in) and the
// grid is the same on every print. Rows are ten letters.
//   FOOTBALL row 0 across · PUZZLE row 2 across · GARDEN row 4 across
//   DANCE row 6 across · BAKE and READ row 8 across
//   DRAW column 9 down from row 1 · BIKE column 9 down from row 5
const GRID = [
  'FOOTBALLMS',
  'TWHKSNQUJD',
  'MPUZZLEVHR',
  'SCJRYTUPXA',
  'GARDENMQYW',
  'HUTCVJQSOB',
  'NQMDANCEUI',
  'JTYVHWOMQK',
  'BAKEXREADE',
  'QJTSUCVYHM',
]

export const PLANET_POST_1: PlanetPostIssue = {
  slug: 'planet-post-1',
  number: 1,
  theme: 'How screens work in our house',
  weather: 'Sunny, with a good chance of outside',
  editor: {
    name: 'DiGi',
    img: '/digi-squad/DiGi-star-3d.png',
    note: 'Hello! I am DiGi, and I made this paper for you. It is all about screens: how they work in your house, and how to keep them fair. Grab a pencil. Every page has something to do.',
  },
  lead: {
    headline: 'Your brain loves lots of colours',
    paras: [
      'A good day is like a rainbow. Some moving, some making, some reading, some helping, some resting, and a bit of screen too.',
      'Screens are not bad. They are one colour. When one colour takes over the whole day, the rainbow goes grey, and you feel it: grumpy, tired, a bit stuck.',
    ],
    task: 'Colour a slice for everything you did yesterday. How many colours did you get?',
  },
  inside: [
    { label: 'Three jars of screen time', page: 2 },
    { label: 'Real or pretend?', page: 3 },
    { label: 'My screen promise', page: 4 },
  ],
  jars: {
    headline: 'Three jars of screen time',
    intro: 'In lots of houses, screen time is one big argument. It works better as three jars. Ask your grown up to help you fill in the numbers.',
    mine: { label: 'Mine every day', line: 'minutes, just for being me' },
    earned: { label: 'Earned with stars', line: 'minutes for every star I earn' },
    nobodys: { label: 'Nobody’s', items: ['Bedtime', 'Mealtimes', 'School'], line: 'No stars can buy these' },
    starSteps: ['Do a job', 'Your grown up says yes', 'You get a star', 'Stars turn into minutes'],
  },
  bedColumn: {
    by: 'Bloop',
    img: '/digi-squad/friends/bloop.png',
    headline: 'Phones go to bed too',
    paras: [
      'Your brain does its tidying up while you sleep. A phone in the bedroom keeps tapping it on the shoulder all night.',
      'So in my house, the phone has its own bed, in the kitchen. It charges up, and so do I.',
    ],
    swapsHead: 'Instead of a phone at bedtime, try',
    swaps: ['A book', 'A chat about your day', 'A sleepy song', 'A cuddle'],
    fills: ['Our phones go to bed at', 'They sleep in the'],
  },
  realOrPretend: {
    by: 'Orbit',
    img: '/digi-squad/friends/orbit.png',
    headline: 'Real or pretend?',
    intro: 'Orbit is a detective. Read each message and circle REAL or PRETEND.',
    messages: [
      { from: 'Prize Team', text: 'You have won a FREE tablet! Click here and type your password to claim it.' },
      { from: 'Grandma', text: 'What a lovely drawing you sent me. See you on Sunday. Love you x' },
      { from: 'Unknown', text: 'Hi, I am 10 too. Let’s be friends. Don’t tell your mum about me.' },
    ],
    answers: [
      '1 PRETEND. Nobody gives away tablets for a password. Never type your password for a prize.',
      '2 REAL. You know Grandma, and she is not asking for anything.',
      '3 PRETEND. A real friend never asks you to keep secrets from your grown up. Tell them straight away.',
    ],
  },
  wordSearch: {
    headline: 'Screen free word search',
    words: ['FOOTBALL', 'PUZZLE', 'GARDEN', 'DANCE', 'BAKE', 'READ', 'DRAW', 'BIKE'],
    grid: GRID,
  },
  myHeadline: {
    headline: 'Tomorrow’s happy headline',
    prompt: 'Write tomorrow’s news about you. What brilliant thing will you do?',
  },
  jobs: {
    headline: 'Jobs that earn stars',
    intro: 'Ask your grown up how many stars each job is worth. Write it in the star, then tick it when it is done.',
    earn: ['Make my bed', 'Tidy my room', 'Help make dinner', 'Feed a pet or water a plant', 'Read for 20 minutes'],
    family: {
      headline: 'Family jobs, just for helping',
      items: ['Set the table', 'Carry the shopping', 'Say thank you for dinner'],
      line: 'No stars for these. We do them because we are a team.',
    },
  },
  promise: {
    by: 'Pebble',
    img: '/digi-squad/friends/pebble.png',
    headline: 'My screen promise',
    lines: ['I promise to', 'When the timer ends, I will', 'My grown up promises to'],
  },
  grownUp: {
    kicker: 'For the grown up',
    headline: 'Want the plan behind this paper?',
    line: 'What stage is your child? Three questions, no sign up.',
    url: 'https://www.guidedchildhood.com/starter-pack?src=planet-post-1',
    shown: 'guidedchildhood.com/starter-pack',
  },
}
