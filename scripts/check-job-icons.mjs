// A JOB WEARS A DRAWN ICON, NOT A PHONE EMOJI.
//
// Justin, 16 September 2026, holding two pages of The Happy Newspaper beside
// the jobs board: "colours are right but the icons could be more happy news
// style like attached."
//
// Every job on every screen used to draw the emoji stored on its row. That is
// another company's artwork sitting inside our circle plate, in another
// company's style, and it renders DIFFERENTLY on every device a family owns:
// Apple's plug is grey and photographic, Google's is flat and blue. A parent
// on an iPhone and a child on an Android were looking at two different
// pictures of the same job and being told it was the same job.
//
// What this guard holds is the part that is easy to lose without noticing:
//
//  1. Every surface that shows a job shows the DRAWN icon. There are six of
//     them and they are in six different files, so the next person to add a
//     seventh has no way of knowing the rule exists. Now they do.
//  2. Every name the map can return is a name the icon set can actually draw.
//     A typo here is not a crash, it is a React component rendering NOTHING,
//     which on a white plate looks like a slightly empty circle and nobody
//     files a bug about a slightly empty circle.
//  3. The fallback stays. A job we have never seen still gets a picture.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const MAP = 'lib/quests/job-icon.ts'
const SET = 'components/kid/HappyIcon.tsx'

// The six places a job is drawn for a family. Each names why it is on the
// list, because "wire it in everywhere" is only a rule if everywhere is
// written down.
const SURFACES = [
  ['components/quests/JobBoardRow.tsx', "the parent's board, the screen Justin photographed"],
  ['components/quests/JobPicker.tsx', 'where a parent picks the job in the first place'],
  ['components/kid/BalanceToday.tsx', "the child's own list of what is left today"],
  ['components/kid/KidAskForJob.tsx', 'the ideas a child pitches, and the ones they sent'],
  ['app/k/[token]/KidQuestScreen.tsx', "the child's coming up list"],
  ['components/printables/StarChartSheet.tsx', 'the chart that ends up on the fridge'],
]

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const map = strip(read(MAP))
const set = strip(read(SET))

// 1. EVERY SURFACE USES THE MAP.
for (const [file, why] of SURFACES) {
  const src = strip(read(file))
  if (!src) continue
  if (!/jobIconFor\s*\(/.test(src)) {
    fail.push(`${file}: does not call jobIconFor. This is ${why}, and a job that wears a drawn icon on five screens and a phone emoji on the sixth reads to a child as two different jobs.`)
  }
}

// 2. EVERY NAME THE MAP RETURNS IS A NAME THE SET CAN DRAW.
if (map && set) {
  // Names the icon set actually has a case for.
  const drawable = new Set([...set.matchAll(/case '([a-z-]+)':/g)].map(m => m[1]))
  if (drawable.size < 20) {
    fail.push(`${SET}: only ${drawable.size} drawings found. The job set alone needs more than that, so something has gone wrong with the file or with this guard's reading of it.`)
  }
  // Names the map can hand back: the emoji table, the word table, the fallback.
  const returned = new Set([
    ...[...map.matchAll(/:\s*'([a-z-]+)'\s*[,}]/g)].map(m => m[1]),
    ...[...map.matchAll(/,\s*'([a-z-]+)'\]/g)].map(m => m[1]),
    ...[...map.matchAll(/return '([a-z-]+)'/g)].map(m => m[1]),
  ])
  if (returned.size < 20) {
    fail.push(`${MAP}: only ${returned.size} icon names found. The map should cover the jobs that are really on boards; something has gone wrong with the file or with this guard's reading of it.`)
  }
  for (const name of returned) {
    if (!drawable.has(name)) {
      fail.push(`${MAP}: maps a job to '${name}', which ${SET} cannot draw. That does not throw, it renders nothing, and an empty white circle is not a thing anyone reports.`)
    }
  }
}

// 3. THE FALLBACK STAYS.
if (map && !/return 'star'/.test(map)) {
  fail.push(`${MAP}: the star fallback is gone. A job we have never seen before still has to get a picture, because a hole in a row that is otherwise all pictures reads as a job that failed to load.`)
}

// 4. THE MAP READS THE TITLE WHEN THERE IS NO EMOJI.
// Families type their own jobs, and a typed job carries no emoji at all.
if (map && !/BY_WORD/.test(map)) {
  fail.push(`${MAP}: the word fallback is gone. A family that types "walk the dog" gets no emoji stored, so without the words every typed job on the board falls to the same star.`)
}

if (fail.length) {
  console.error('check-job-icons: a job has lost its drawing\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-job-icons: all six surfaces draw the job, every mapped name exists, and the fallbacks hold.')
