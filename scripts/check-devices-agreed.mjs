// AGREED HAS TO COUNT, AND IT HAS TO SAY SO.
//
// Justin, 17 September 2026, looking at the passport: "on the passport it says
// devices first but we should have over use if parents decide not to do it?
// Maybe override which just means a note added device settings agreed but set
// trust child ... don't want to force then never able to complete stage of
// passport."
//
// devicesPct is a real gate. Before migration 306 a device had two honest
// answers, done and not_owned, so a family who owns a Switch and has decided
// together that it runs on trust could only lie in one direction, lie in the
// other, or leave the stage short for good. 'agreed' is the third answer.
//
// It is held together by two rules that pull in opposite directions, which is
// exactly why it needs a guard rather than a comment:
//
//   COUNTS LIKE DONE.   Every reader counts status <> 'not_owned'. Narrow any
//                       one of them to === 'done' and an agreed screen silently
//                       stops counting, the stage locks again, and the bug is
//                       Justin's original complaint wearing a new coat.
//
//   READS UNLIKE DONE.  The row and the passport must never say the settings
//                       are on. Collapse the wording back into "All set" and
//                       the product is telling a parent something untrue about
//                       their own house, which is worse than the lock was.
//
// A future session tidying "status !== 'not_owned'" into "status === 'done'"
// would look like a simplification and would break the first rule in silence.
//
// Node builtins only: the concern-guards job runs no npm ci.

import { readFileSync } from 'node:fs'

const ROUTE = 'app/api/devices/complete/route.ts'
const PROGRESS = 'lib/pathway/progress.ts'
const JOURNEY = 'lib/pathway/journey.ts'
const SECTIONS = 'lib/pathway/passport-sections.ts'
const PAGE = 'app/(dashboard)/dashboard/devices/page.tsx'
const HUB = 'app/(dashboard)/dashboard/devices/DeviceHub.tsx'
const SCREENS = 'components/devices/YourScreens.tsx'
const GUIDE_BODY = 'components/devices/GuideBody.tsx'
const MIGRATION = 'supabase/migrations/306_device_settings_agreed.sql'

const fail = []
const read = p => {
  try { return readFileSync(p, 'utf8') } catch { fail.push(`${p} is missing`); return '' }
}
// Comments carry the word agreed all over these files, so every check below
// reads the code with them stripped. A guard that passes on a comment is not a
// guard, which is how an earlier one in this repo went green on a commented out
// backfill.
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const sql = src => src.replace(/--.*$/gm, '')

// ── 1. THE API ACCEPTS IT ───────────────────────────────────────────────────
const route = code(read(ROUTE))
if (route) {
  if (!/STATUSES\s*=\s*new Set\(\[[^\]]*'agreed'/.test(route)) {
    fail.push(`${ROUTE}: STATUSES no longer contains 'agreed', so every request to record an agreement falls through to the default and writes 'done'. The passport would still unlock and the row would claim the settings are on, which is the one outcome this whole feature exists to avoid.`)
  }
  if (!/'not_owned'/.test(route)) {
    fail.push(`${ROUTE}: STATUSES no longer contains 'not_owned'.`)
  }
  // The note is what makes an agreement a decision rather than a skip.
  if (!/agreed_note/.test(route)) {
    fail.push(`${ROUTE}: nothing writes agreed_note, so an agreement is recorded with no record of what was agreed. That is an override button, which is not what was asked for.`)
  }
  if (!/value\s*===\s*'agreed'/.test(route)) {
    fail.push(`${ROUTE}: the note is no longer gated on the status being 'agreed', so a screen that was agreed in July and genuinely set up in September keeps a line underneath it saying the controls were never turned on.`)
  }
  // The un tick sweep. Asking for status = 'done' here treats an agreed screen
  // as nothing, so unticking one iPad pulls the guide off the board out from
  // under an agreed iPhone and drops the stage percentage with it.
  if (/\.eq\('status',\s*'done'\)/.test(route)) {
    fail.push(`${ROUTE}: the DELETE sweep still filters on status = 'done'. An agreed screen would not count as holding its guide up, so unticking one screen would pull the guide row off the board under a family who had made a real decision about another one.`)
  }
  if (!/\.in\('status',\s*\['done',\s*'agreed'\]\)/.test(route)) {
    fail.push(`${ROUTE}: the DELETE sweep no longer asks for done OR agreed.`)
  }
}

// ── 2. EVERY READER STILL COUNTS IT ─────────────────────────────────────────
//
// The rule is the same sentence in four files, and it has to stay that way.
for (const path of [PROGRESS, JOURNEY, SECTIONS, PAGE]) {
  const src = code(read(path))
  if (!src) continue
  // Catches `status === 'done'` AND `(d.status ?? 'done') === 'done'`, which is
  // the form journey.ts was actually written in and the form a tidy up would
  // most plausibly reintroduce.
  if (/===\s*'done'/.test(src)) {
    fail.push(`${path}: something now counts a device only when it equals 'done'. An agreed screen stops counting the moment that lands, the stage locks shut again, and a family who parented by talking is back to having no way through.`)
  }
  if (!/!==\s*'not_owned'/.test(src)) {
    fail.push(`${path}: no longer counts a device by status !== 'not_owned', which is the one rule that makes done and agreed count the same.`)
  }
}

// ── 3. IT READS DIFFERENTLY, EVERYWHERE ─────────────────────────────────────
const sections = code(read(SECTIONS))
if (sections) {
  if (!/anyAgreed/.test(sections)) {
    fail.push(`${SECTIONS}: the devices row no longer knows whether anything is agreed, so it says All set over screens that deliberately have no controls on them.`)
  }
  if (!/anyAgreed\s*\?\s*'Agreed'\s*:\s*'All set'/.test(sections)) {
    fail.push(`${SECTIONS}: the devices row no longer says Agreed rather than All set. Counting it the same and describing it the same are two different things, and only the first one is true.`)
  }
}

const screens = code(read(SCREENS))
if (screens) {
  if (!/isAgreed/.test(screens)) {
    fail.push(`${SCREENS}: the row no longer distinguishes an agreed screen, so a parent glancing down the list reads Settings in place over a screen they decided not to put settings on.`)
  }
  if (!/isAgreed[\s\S]{0,120}'🤝 Agreed'/.test(screens)) {
    fail.push(`${SCREENS}: the agreed row no longer says Agreed.`)
  }
  // Same colour as done is the same lie told quietly.
  if (!/isAgreed\s*\?\s*'var\(--stage-2-text\)'\s*:\s*done\s*\?\s*'var\(--retro-green\)'/.test(screens)) {
    fail.push(`${SCREENS}: the agreed row no longer has its own colour ahead of the done green, so the three states stop being tellable apart at a glance.`)
  }
  if (!/agreedNote/.test(screens)) {
    fail.push(`${SCREENS}: the row no longer shows what was agreed, which is the whole record.`)
  }
  // The line above the list is read before any row, so it has to tell the same
  // truth. "4 of 4 set up" over two screens a family deliberately left without
  // controls is the row lie moved to the top of the card.
  if (!/agreedCount\s*>\s*0[\s\S]{0,160}agreed`/.test(screens)) {
    fail.push(`${SCREENS}: the summary line above the list no longer names the agreed screens, so it says N of N set up over screens that deliberately have no settings on them.`)
  }
  // A blank note turns this into a skip button.
  if (!/disabled=\{!agreeDraft\.trim\(\)/.test(screens)) {
    fail.push(`${SCREENS}: the save is no longer disabled on an empty note. An agreement with nothing written down is an override, and an override that counts towards a stage is the thing we refused to build.`)
  }
}

// ── 3b. THE GUIDE ITSELF ────────────────────────────────────────────────────
//
// An agreed screen counts as done, so the open walkthrough read "Marked as set
// up" over a screen whose whole point is that nobody set anything up on it.
// That is the row lie moved one tap deeper, where it is harder to notice.
const guideBody = code(read(GUIDE_BODY))
if (guideBody) {
  if (!/isAgreed/.test(guideBody)) {
    fail.push(`${GUIDE_BODY}: the walkthrough no longer knows an agreed screen from a set up one, so it tells a parent their settings are on inside the guide for turning them on.`)
  }
  if (/\{isDone \? 'Marked as set up ✓' : 'Mark as set up'\}/.test(guideBody)) {
    fail.push(`${GUIDE_BODY}: the button is back to reading done or not done, which says Marked as set up over an agreed screen.`)
  }
}

// ── 4. AGREED IS A NARROWING OF DONE, NOT A REPLACEMENT ─────────────────────
const hub = code(read(HUB))
if (hub) {
  // Both writes have to put the screen into completed as well, or it reads
  // Agreed on the row and counts as nothing on the passport.
  const agreeGuide = hub.match(/async function agreeGuide[\s\S]{0,900}/)?.[0] ?? ''
  const agreeDevice = hub.match(/async function agreeDevice[\s\S]{0,1100}/)?.[0] ?? ''
  if (!/setCompleted\(prev => new Set\(prev\)\.add/.test(agreeGuide)) {
    fail.push(`${HUB}: agreeGuide no longer adds the guide to completed, so an agreement shows on the row and counts for nothing.`)
  }
  if (!/setDoneDevices\(prev => new Set\(prev\)\.add\(d\.id\)\)/.test(agreeDevice)) {
    fail.push(`${HUB}: agreeDevice no longer adds the screen to doneDevices, so an agreed screen does not move the stage at all.`)
  }
  if (!/status:\s*'agreed'/.test(hub)) {
    fail.push(`${HUB}: nothing posts status 'agreed'.`)
  }
  // The one gold button on an agreed screen offers the settings. If toggle()
  // still reads it as done, that button sends a DELETE and takes the family's
  // decision off the board instead.
  if (!/completed\.has\(key\) && !agreed\.has\(key\)/.test(hub)) {
    fail.push(`${HUB}: toggle() counts an agreed guide as already ticked, so the one button on it would untick the agreement rather than offer the settings.`)
  }
  if (!/doneDevices\.has\(d\.id\) && !agreedDevices\.has\(d\.id\)/.test(hub)) {
    fail.push(`${HUB}: toggleDevice() counts an agreed screen as already ticked, so its button would delete the agreement rather than offer the settings.`)
  }
  if (!/clearAgreedGuide|clearAgreedDevice/.test(hub)) {
    fail.push(`${HUB}: marking a screen actually set up no longer clears its agreement, so a screen with real controls on it keeps a line saying they were never turned on.`)
  }
}

// ── 5. THE MIGRATION ────────────────────────────────────────────────────────
const migration = sql(read(MIGRATION))
if (migration) {
  if (!/alter table\s+public\.device_setup_progress\s+add column if not exists agreed_note/.test(migration)) {
    fail.push(`${MIGRATION}: no longer adds agreed_note to device_setup_progress.`)
  }
}

// ── 6. NO DASHES, ANYWHERE A PARENT READS ───────────────────────────────────
for (const [path, src] of [[SCREENS, screens], [SECTIONS, sections], [MIGRATION, migration]]) {
  if (src && /[–—]/.test(src.replace(/[─│┌┐└┘├┤┬┴┼]/g, ''))) {
    fail.push(`${path}: an en dash or em dash reached copy. House rule, no dashes ever.`)
  }
}

if (fail.length) {
  console.error('check-devices-agreed FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
console.log('check-devices-agreed: agreed counts like done everywhere, and never reads like it.')
