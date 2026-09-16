// The child can always reach the tabs, and the bar does not drift on an iPhone.
//
// Justin, 15 September 2026, with a photo of the child's bar: "maybe as with
// the parents app we should fix these tabs to the bottom of the child's app so
// they can always navigate."
//
// It was `position: sticky, top: 0`, rendered 2,250 lines down KidQuestScreen,
// under the five a day, the mission, the tiles and six more blocks. Sticky to
// the TOP only sticks once you have scrolled the element to the top, so on
// opening the app a child never saw it: reaching Lessons or Printables meant
// scrolling most of a screen looking for a bar you had to already know was
// there. It is the other half of "quests not easy to get to on child app".
//
// ── THE IPHONE TRAP THIS ALSO PINS ─────────────────────────────────────────
//
// shared/tokens.css zooms body by 1.07. Safari positions a FIXED element
// inside a zoomed ancestor against the unzoomed viewport while laying it out
// in zoomed coordinates, so it drifts further up the screen the further you
// scroll. That is exactly what happened to the PARENT's bar, twice in one
// morning (see .bottom-tab-bar in app/globals.css).
//
// So fixing the child's bar to the floor is only safe with the same cure: the
// bar is portalled to body, body is unzoomed while the screen is mounted, and
// the page zooms itself instead. Take any one of those away and the bar is
// back to sliding around a real child's phone, which no typecheck can see.
//
//   node scripts/check-kid-tabbar.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => { try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null } }

const bar = read('components/kid/KidTabBar.tsx')
const screen = read('app/k/[token]/KidQuestScreen.tsx')

if (bar === null) problems.push('components/kid/KidTabBar.tsx is missing')
else if (/position:\s*'sticky'/.test(bar)) {
  problems.push("the child's tab bar is sticky again. It is rendered near the bottom of the longest screen in the product, so sticky means a child never sees it on opening the app.")
} else if (!/position:\s*'fixed'/.test(bar) || !/bottom:\s*0/.test(bar)) {
  problems.push("the child's tab bar is not fixed to the bottom, so it is only reachable by scrolling to wherever it happens to sit")
} else if (!/createPortal\(/.test(bar)) {
  problems.push('the bar is fixed but not portalled out of the page. body carries zoom 1.07, and a fixed element under a zoomed ancestor drifts up an iPhone as it scrolls: the exact fault the parent bar had twice in one morning.')
} else if (!/env\(safe-area-inset-bottom/.test(bar)) {
  problems.push('the bar does not clear the home indicator, so its bottom row is cut off on any iPhone with one')
} else {
  ok.push("the child's bar is fixed to the floor, portalled out of the zoom, and clears the home indicator")
}

if (screen === null) problems.push('app/k/[token]/KidQuestScreen.tsx is missing')
else if (!/body\s*\{\s*zoom:\s*1;?\s*\}/.test(screen)) {
  problems.push('the child screen no longer unzooms body, so the portalled bar has a zoomed ancestor again and will drift on an iPhone')
} else if (!/\.gc-kid-page\s*\{\s*zoom:/.test(screen)) {
  problems.push('body is unzoomed but the page does not zoom itself, so the whole child app is suddenly 7 percent smaller than it was designed to be')
} else if (!/env\(safe-area-inset-bottom/.test(screen)) {
  problems.push('the page does not pad for the fixed bar, so the last card on the screen sits underneath it and cannot be reached')
} else {
  ok.push('the child screen unzooms body, zooms itself, and pads for the bar')
}

// ── NOTHING SCROLLS TO THE BAR, BECAUSE IT NO LONGER MARKS A PLACE ─────────
//
// Justin, minutes after the bar went to the floor: "new tabs at bottom not
// linking to right pages." Six callers in KidQuestScreen said
// `getElementById('kid-tabs').scrollIntoView()` to mean "go to the tab I just
// chose", and that only ever worked because the bar sat in the flow directly
// above the content. A FIXED element is always in view, so scrollIntoView on it
// does nothing at all: the tab changed underneath and the child stayed looking
// at the top of the home screen.
//
// Measured before and after on the real screen: before, tapping Lessons left
// scrollY at 605 and the content 1,896px below the fold; after, it lands the
// content 13px from the top.
//
// The bar is a CONTROL now. #kid-tab-content is the place.
if (screen !== null) {
  if (/getElementById\(\s*['"]kid-tabs['"]\s*\)/.test(screen)) {
    problems.push("something scrolls to #kid-tabs again. That is the fixed bar, which is always in view, so scrollIntoView on it does nothing and the tab appears not to navigate at all. Scroll to #kid-tab-content instead.")
  } else if (!/id="kid-tab-content"/.test(screen)) {
    problems.push('#kid-tab-content is gone, so the callers that move a child to the tab they chose have nothing to aim at')
  } else if (!/getElementById\(\s*['"]kid-tab-content['"]\s*\)/.test(screen) && !/'kid-tab-content'/.test(screen)) {
    problems.push('the content anchor exists but nothing scrolls to it, so choosing a tab leaves the child where they were')
  } else {
    ok.push('every caller scrolls to the tab content, not to the fixed bar')
  }
}

// ── EACH NAME MEANS ONE THING: TODAY IS THE DAY, QUESTS IS THE JOBS ─────────
//
// Justin, 15 September 2026, from the child's home: "on the bottom tabs home
// does not go to home and light up, and Quests should go to the jobs quest
// place. And if first time it should just ask to request jobs."
//
// One fault underneath the first two. The five a day lives in the tab keyed
// 'quests', so a child standing ON the day lit QUESTS, while Today, the thing
// they were actually looking at, had no lit state at all and could never light.
// Two names for one screen, and the wrong one winning.
//
// None of this is visible to a typecheck: a bar that lights nothing, or lights
// the wrong entry, is perfectly valid React.
const barSrc = read('components/kid/KidTabBar.tsx')
if (barSrc !== null) {
  if (!/current === 'today'/.test(barSrc)) {
    problems.push(
      "the Today entry has no lit state again. It is the entry a child is standing on whenever the five a day is showing, so without this the bar lights Quests for the day and Today never lights at all, which is what Justin photographed.",
    )
  } else {
    ok.push('the Today entry lights like a tab, so standing on the day lights Today')
  }
}
if (screen !== null) {
  if (!/current=\{tab === 'quests' \? 'today' : tab\}/.test(screen)) {
    problems.push(
      "the child's home no longer tells the bar that its day tab is Today. Its internal key for the five a day is 'quests', so passing that straight through lights the Quests entry while the child is looking at their day.",
    )
  } else {
    ok.push('the home lights Today while the five a day is showing')
  }
  if (!/key === 'quests'[\s\S]{0,160}\/jobs/.test(screen)) {
    problems.push(
      "tapping Quests on the home no longer goes to the jobs. Quests is a place, the jobs a grown up has sent, not a second name for the day.",
    )
  } else {
    ok.push('Quests goes to the jobs')
  }
}

// A first ever day has no jobs at all, and that screen is the moment to ask for
// one rather than to describe where the asking lives.
const jobsScreen = read('app/k/[token]/jobs/KidJobsScreen.tsx')
if (jobsScreen !== null) {
  if (!/quests\.length === 0/.test(jobsScreen)) {
    problems.push('the jobs screen has no empty state, so a child with no jobs sees nothing at all')
  } else if (!/\/suggest/.test(jobsScreen)) {
    problems.push(
      "the jobs screen's empty state does not offer the ask. It used to end with \"you can pitch your own idea from your home screen any time\", which sends a child somewhere else to find something. On a first day this screen IS the moment to ask.",
    )
  } else {
    ok.push('a child with no jobs is offered the ask on the spot, not directions to it')
  }
}

if (problems.length > 0) {
  console.error('check-kid-tabbar FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for the iPhone drift this prevents.')
  process.exit(1)
}
console.log('check-kid-tabbar ok: the child can always reach the tabs')
for (const line of ok) console.log('  ' + line)
