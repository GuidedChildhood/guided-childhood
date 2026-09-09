// Can a parent still GET to every page we built?
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026: "the shop we had for passport has disappeared from
// the parents app." It had, and the way it went is the interesting part.
//
// Home used to carry five tiles. They were removed on 12 August 2026 in a
// deliberate cleanup, on a good argument written into HomeMain itself: quests,
// passport and DiGi are three of the six buttons on the tab bar, permanently
// visible and one tap away, so a tile repeating them is noise.
//
// That argument was true of four of the five. Quests, passport and DiGi went to
// the tab bar and school reminders was already in the Explore grid. The SHOP
// has no tab bar button and was never added to Explore, so it went from one tap
// on Home to no route at all except a shortcut buried on the Quests page and a
// deep link to one product inside the passport.
//
// Nothing broke. The page still built, still rendered, still took payments. It
// simply stopped being somewhere a parent could find, which no typecheck, no
// build and no wiring check can see, because every one of them is happy with a
// page that has an import and no door.
//
// So: every tile the cleanup removed has to still be reachable by intent, from
// the tab bar or from the one grid whose whole job is "everything else".
//
// Usage: node scripts/check-reachable.mjs

import { readFileSync } from 'node:fs'

const read = p => { try { return readFileSync(new URL(p, import.meta.url), 'utf8') } catch { return '' } }

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const home = read('../components/home/HomeMain.tsx')
const explore = read('../components/home/ExploreGrid.tsx')
// The real navigation, all three of them: the phone tab bar, the desktop tabs
// and the secondary sheet. Reading the layout alone was my first attempt and it
// reported the passport unreachable, which it plainly is not: the nav lives in
// its own components, not in the shell.
const shell = [
  '../components/dashboard/MobileTabBar.tsx',
  '../components/dashboard/NavTabs.tsx',
  '../components/dashboard/MobileSecondaryNav.tsx',
].map(read).join('\n')

check('HomeMain was found', home.length > 0)
check('the navigation was found', /\/dashboard\/quests/.test(shell), 'all three nav components')
check('ExploreGrid was found', explore.length > 0)

// The tiles Home used to show, still written down there as the record of what
// was removed. That list is the checklist.
const block = home.match(/const TILES:[\s\S]*?\n\]/)
const removed = [...(block?.[0] ?? '').matchAll(/href: '([^']+)'/g)].map(m => m[1])
check('the removed tile list was found', removed.length >= 4, removed.join(' '))

// Everywhere a parent can reach by intent rather than by luck: the tab bar in
// the dashboard shell, and the Explore grid.
const doors = shell + explore

for (const href of removed) {
  // /dashboard/pathway is the passport, which the tab bar links as /dashboard
  // /pathway#passport, so match the path as a prefix rather than exactly.
  const reachable = doors.includes(`'${href}'`) || doors.includes(`"${href}"`) || doors.includes(`${href}#`)
  check(
    `${href} is still reachable from the tab bar or Explore`,
    reachable,
    reachable ? '' : 'built, rendering, taking money, and unreachable',
  )
}

// The shop by name, because it is the one that went missing and the one a
// future cleanup is most likely to drop again: it earns money and it is not on
// the tab bar, which is exactly the combination nobody notices.
check(
  'the shop has a door of its own',
  /\/dashboard\/keepsakes'/.test(explore),
  'a page that sells the printed passport cannot be reachable only from a link that already names it',
)

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
