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
  // The day wheel as numbered steps (14 October 2026, after a nine year old
  // tried it: one instruction per line, a box where the answer goes).
  lead: { headline: string; paras: string[]; steps: { text: string; box?: 'count' | 'line'; after?: string }[] }
  inside: { label: string; page: number }[]
  jars: {
    headline: string
    intro: string
    together: string
    mine: { label: string; ask: string; unit: string; hint: string }
    earned: { label: string; ask: string; unit: string }
    nobodys: { label: string; items: string[]; line: string }
    starSteps: string[]
    starPuzzle: { headline: string; ask: string; order: number[]; answer: string }
  }
  // A thing to make: the phone's own bed, cut out and folded (replaced
  // Bloop's column, which was all reading and no doing).
  phoneBed: { by: string; img: string; headline: string; line: string; steps: string[]; sign: { front: string; back: string }; blanket: string; pillow: string }
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
      'A good day is like a rainbow: some moving, making, reading, helping, resting, and a bit of screen too. Screens are not bad. They are one colour. When one colour takes over, the day goes grey.',
    ],
    steps: [
      { text: 'Think about yesterday.' },
      { text: 'Colour every slice you did. One crayon for each slice.' },
      { text: 'Count them. I coloured', box: 'count', after: 'out of 8 slices.' },
      { text: 'Tomorrow I want more of', box: 'line' },
    ],
  },
  inside: [
    { label: 'Three jars of screen time', page: 2 },
    { label: 'Real or pretend?', page: 3 },
    { label: 'My screen promise', page: 4 },
  ],
  jars: {
    headline: 'Three jars of screen time',
    intro: 'In lots of houses, screen time is one big argument. It works better as three jars.',
    together: 'Do this part with your grown up',
    mine: { label: 'Mine every day', ask: 'How many minutes are just yours?', unit: 'minutes', hint: 'like 30' },
    earned: { label: 'Earned with stars', ask: 'One star is worth', unit: 'minutes' },
    nobodys: { label: 'Nobody’s', items: ['Bedtime', 'Mealtimes', 'School'], line: 'No stars can buy these' },
    starSteps: ['Do a job', 'Your grown up says yes', 'You get a star', 'Stars turn into minutes'],
    starPuzzle: {
      headline: 'How is a star made?',
      ask: 'These are mixed up. Write 1, 2, 3 and 4 in the boxes to put them in order.',
      order: [2, 3, 0, 1],
      answer: 'Answer: do a job, your grown up says yes, you get a star, stars turn into minutes.',
    },
  },
  phoneBed: {
    by: 'Bloop',
    img: '/digi-squad/friends/bloop.png',
    headline: 'Make the phone a bed',
    line: 'Phones go to bed too. Your brain tidies up while you sleep, so the phone sleeps in the kitchen, not your room.',
    steps: [
      'Colour the blanket and the pillow.',
      'Cut along the solid lines.',
      'Fold the sign on the dotted line so it stands up.',
      'At bedtime, tuck the phone in, in the kitchen.',
    ],
    sign: { front: 'Shh! Phone sleeping', back: 'Back at' },
    blanket: 'Blanket',
    pillow: 'Pillow',
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
    intro: 'Ask your grown up how many stars each job is worth. Write the number in the star, then colour the circle when the job is done.',
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
