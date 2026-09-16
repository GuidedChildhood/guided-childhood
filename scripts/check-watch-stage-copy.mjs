// THE FILMS TAB TELLS THE TRUTH ABOUT WHO THE FILMS ARE FOR.
//
// Justin, 16 September 2026, with a screenshot of Watch together on his 13 to
// 15 year old reading "Nothing written for this stage yet, so here is
// everything else":
//
//   "getting this message, is it true? I'm sure we have lessons, if not let's
//    build them."
//
// Checked against the live database rather than the code. Ten films exist and
// every one is Stage 1, so there genuinely is no film at her stage. But her
// Lessons tab holds 39 real lessons. So the sentence was half right and the
// half that was wrong was one word: nothing has been FILMED for her stage,
// while a great deal has been WRITTEN. A parent reading that line reasonably
// concludes the product has nothing for their teenager, which is the opposite
// of true and cheap to lose.
//
// Offered forty more films or an honest reframe, Justin chose: make the Stage
// 2 films, where a parent and child still watch together, and for Stage 3 and
// up say plainly what the format is for. A fourteen year old does not sit
// down to an illustrated film with their mum, and owing them one we will never
// make is a debt the product keeps apologising for.
//
// Three properties, and they are the ones the bug turned on:
//
//   1. The word "written" never describes a missing film again.
//   2. The past the co watch years branch exists and names the real lesson
//      count, so the parent is sent somewhere rather than told about a gap.
//   3. It is keyed off a fixed AGE, not off which films happen to exist.
//      Keyed off the data, a Stage 2 child would be told they are past a
//      format that suits them perfectly, purely because their films are not
//      made yet.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const SRC = 'app/(dashboard)/dashboard/lessons/LessonsBrowser.tsx'
const FIXTURE = 'app/ref-watch-stages/page.tsx'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}

const src = read(SRC)

// Comments in this file quote the old sentence at length to explain why it
// went, so they come out before the copy is read. A rule that could not tell
// the explanation from the thing would push us to stop explaining.
const copy = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

if (src) {
  if (/Nothing written for this stage/.test(copy)) {
    fail.push(`${SRC}: the words "Nothing written for this stage" are back. Nothing has been FILMED for the older stages; 39 lessons are written for Justin's own Stage 4 child alone. That sentence tells a paying parent the product has nothing for their teenager.`)
  }

  // The honest branch, and the age it turns on.
  if (!/pastTheFilmYears/.test(copy)) {
    fail.push(`${SRC}: pastTheFilmYears is gone, so every stage with no film of its own falls back to one apology. A Stage 2 child and a Stage 4 child need opposite answers: one is well served by an earlier film, the other is not.`)
  }
  const maxStage = copy.match(/const\s+CO_WATCH_MAX_STAGE\s*=\s*(\d+)/)
  if (!maxStage) {
    fail.push(`${SRC}: CO_WATCH_MAX_STAGE is gone. Where the co watch years end is a fact about children and sofas, and it has to be written down as one.`)
  } else if (Number(maxStage[1]) < 2) {
    fail.push(`${SRC}: CO_WATCH_MAX_STAGE is ${maxStage[1]}. Stage 2 is ages 8 to 10, and watching something together still works at that age. Below 2 a Stage 2 parent is told they are past a format that suits them, which is the thing this guard exists to stop.`)
  }

  // It must not be keyed off the films that happen to exist, which is the
  // mistake that reads identically until the day Stage 2 films land.
  const branch = copy.match(/const\s+pastTheFilmYears\s*=\s*([^\n]+)/)
  if (branch && /filmStageNums/.test(branch[1])) {
    fail.push(`${SRC}: pastTheFilmYears is computed from filmStageNums, so it says "past the film years" about any stage we have not filmed yet. That tells a Stage 2 parent their 8 year old is too old for a sofa. It has to key off CO_WATCH_MAX_STAGE.`)
  }

  // The parent is sent somewhere, by a real number, rather than told about a
  // gap. The count is read from the library so it can never drift from it.
  // The DECLARATION, not merely the word. Searching for the bare name passed
  // against a version whose count had been deleted and whose remaining uses
  // were a dead template and a button label: the name was still there, the
  // number was not.
  const countDecl = copy.match(/const\s+lessonsAtChildStage\s*=\s*([^\n]+)/)
  if (!countDecl) {
    fail.push(`${SRC}: lessonsAtChildStage is no longer computed. Naming the real number is the whole repair: "there are 39 of them waiting" is what answers the parent who thinks the cupboard is bare.`)
  } else if (!/libraryItems/.test(countDecl[1]) || !/childStageNum/.test(countDecl[1])) {
    fail.push(`${SRC}: lessonsAtChildStage is "${countDecl[1].trim()}". It has to be counted off libraryItems at childStageNum, or the card quotes a number that can drift away from the lessons actually behind the button.`)
  }
  if (!/See \{childName\}&apos;s \{lessonsAtChildStage\} lessons/.test(copy)) {
    fail.push(`${SRC}: the way through to this child's own lessons is gone. A card that explains the gap and then leaves the parent on the same tab is still a dead end, just a politer one.`)
  }
}

// ── THE TAB NUMBERS FOLLOW THE CHIP ──────────────────────────────────────
//
// Justin, the same afternoon, on "Lessons 39": "is that just for his age? I'm
// sure more total lessons. Also when we click the tab for other age ranges
// the lesson count should change."
//
// It was, and it did not. Both counts were pinned to childStageNum and
// computed once, so All ages read 39, Stage 1 read 39, every chip read 39,
// while the list underneath changed every time. And 39 really was one stage:
// counted live that day, 24 + 27 + 26 + 39 + 25 = 141 across the library, so
// a parent reading 39 as the whole thing saw roughly a quarter of what they
// pay for.
//
// Each tab counts the array it is about to draw, through the same filter the
// list uses, so the number and the list can never disagree.
if (src) {
  const tabs = copy.match(/const\s+TABS[\s\S]{0,600}?\n\s*\]/)
  if (!tabs) {
    fail.push(`${SRC}: the TABS list is gone, so there is no way to check what the numbers beside "Watch together" and "Lessons" are counting.`)
  } else {
    const block = tabs[0]
    if (/childStageNum/.test(block)) {
      fail.push(`${SRC}: a tab count is computed from childStageNum. Pinned to the child's own stage it cannot move when a parent taps another age chip, which is exactly what Justin hit: every chip read 39 while the list below changed each time.`)
    }
    if (!/count:\s*libForStage\.length/.test(block)) {
      fail.push(`${SRC}: the Lessons count is not libForStage.length. It has to count the very array the list renders, or the number above the list and the list itself can drift apart, and the number is the one a parent believes.`)
    }
    if (!/count:\s*watchShown\.length/.test(block)) {
      fail.push(`${SRC}: the Watch together count is not watchShown.length. Past the co watch years the raw stage match is zero while ten films are on screen, so anything else puts a 0 above ten tiles.`)
    }
  }
}

// No dashes, house rule 4, in the copy this guard is about.
const DASHES = /[‐-―−]/
for (const line of copy.split('\n')) {
  if (DASHES.test(line) && /films are made for|Nothing filmed|lessons you lead|younger one in the house/.test(line)) {
    fail.push(`${SRC}: a dash in "${line.trim().slice(0, 70)}". No dashes in any copy, ever.`)
  }
}

// The fixture, so all three cases can be looked at rather than reasoned about.
const fx = read(FIXTURE)
if (fx) {
  if (!/LessonsBrowser/.test(fx)) {
    fail.push(`${FIXTURE}: it no longer mounts the real LessonsBrowser. A fixture that reimplements the card proves nothing about the card a parent sees.`)
  }
  if (!/stageNum:\s*1\b/.test(fx) && !/stageNum: 1,/.test(fx)) {
    fail.push(`${FIXTURE}: the films it hands in are no longer Stage 1 only, which is what production actually holds. A fixture seeded with films at every stage can never render the case Justin photographed.`)
  }
}

if (fail.length) {
  console.error('check-watch-stage-copy: the films tab is telling a parent the wrong thing\n')
  for (const f of fail) console.error('  ' + f + '\n')
  process.exit(1)
}
console.log('check-watch-stage-copy: the films tab says who the films are for, and sends an older child\'s parent to their own lessons.')
