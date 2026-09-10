// The lessons a child cannot do must not be sold to their parent as work.
//
// Justin, 10 September 2026, with three screenshots of a six year old's
// passport: "it seems to show all lessons from passport but should only have
// the ones needed for their age to do, I did one but did not update passport."
//
// Both halves were one bug. The library defaults to the child's own stage, but
// the Social Media Ready card sat pinned above it with no age gate at all, and
// opening it ran setStage('all'). Every lesson in that module is Stage 3, 4 or
// 5. So the parent of a four to seven year old was shown a ramp of nine
// lessons their child cannot do, did one, and the passport correctly did not
// move. Nothing anywhere said why.
//
// This holds the three things that made that possible, none of which fails a
// typecheck and none of which is visible without a child of exactly the wrong
// age in a signed in session.
import { readFileSync } from 'node:fs'

const fails = []
const read = f => readFileSync(f, 'utf8')

// ── 1. The module card is gated on the child's stage ────────────────────────
const browser = read('app/(dashboard)/dashboard/lessons/LessonsBrowser.tsx')

if (!/const moduleInReach\s*=/.test(browser)) {
  fails.push('LessonsBrowser has no moduleInReach gate. The Social Media module card must be gated on the child\'s stage, not on whether the module has any lessons at all.')
}
if (!/\{moduleInReach && \(\s*<ModuleCard/.test(browser)) {
  fails.push('The ModuleCard is not rendered behind moduleInReach. Rendering it on moduleItems.length alone is the 10 September bug: a Foundation parent shown a Stage 3 to 5 ramp above their own child\'s lessons.')
}
if (/\{moduleItems\.length > 0 && \(\s*<ModuleCard/.test(browser)) {
  fails.push('The ModuleCard is back to rendering on moduleItems.length > 0, with no age gate.')
}
if (!/moduleOn && moduleInReach/.test(browser)) {
  fails.push('The open module view is not guarded by moduleInReach, so switching to a younger child leaves it open on lessons that child cannot do.')
}

// ── 2. The module's Send all respects the child's stage ─────────────────────
// The single lesson page has gated its send button since it was written. The
// module never did, so Send all would ping nine lessons at a child whose own
// list has an age gate and will not show them.
if (!/const sendable = items\.filter\(l => l\.stageNum <= childStageNum\)/.test(browser)) {
  fails.push('SocialMediaModule does not compute a sendable set from the child\'s stage. Send all must never ping a lesson the child\'s own list will not show.')
}
if (/idleLabel=\{`📲 Send all \$\{items\.length\}/.test(browser)) {
  fails.push('Send all is back to offering every module lesson regardless of the child\'s age.')
}

// ── 3. A lesson above the child's stage says so, INSIDE the player ─────────
const lessonPage = read('app/(dashboard)/dashboard/lessons/[id]/page.tsx')
if (!/const aheadOfChild = /.test(lessonPage)) {
  fails.push('The lesson page no longer works out whether the lesson is above the child\'s stage.')
}
if (!/notice=\{aheadOfChild \?/.test(lessonPage)) {
  fails.push('The reading ahead notice is not passed to LessonPlayer as its notice prop. This is the half that closes "I did one but did not update passport".')
}
// The one that shipped invisible on the first write, and the reason this
// check names the mechanism rather than just the string: the player is
// position fixed inset 0 at zIndex 110 and covers the page, so a notice
// rendered AROUND it is in the HTML and on nobody's screen.
if (/<ReadingAhead[\s\S]{0,400}?<LessonPlayer/.test(lessonPage)) {
  fails.push('ReadingAhead is rendered above <LessonPlayer> rather than passed into it. The player is fixed inset 0 at zIndex 110, so a notice outside it is present in the markup and invisible to every parent.')
}

const player = read('shared/components/LessonPlayer.tsx')
if (!/notice\?: React\.ReactNode/.test(player)) {
  fails.push('LessonPlayer has lost its notice prop, so the lesson page has no way to put anything in front of a parent before they play.')
}
if (!/\{notice && index === 0 && !finished && \(/.test(player)) {
  fails.push('LessonPlayer no longer renders its notice on the first slide.')
}

if (fails.length) {
  console.error('\nLesson age gate: ' + fails.length + ' problem' + (fails.length === 1 ? '' : 's') + '\n')
  for (const f of fails) console.error('  ✗ ' + f + '\n')
  process.exit(1)
}
console.log('Lesson age gate: the module is gated by stage, Send all respects it, and a lesson above the child\'s stage says so inside the player.')
