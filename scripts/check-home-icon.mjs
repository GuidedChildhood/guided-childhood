// Two children, one tablet, two different icons.
//
// Justin, 15 September 2026: "although an override to add the app so it can be
// added on an iPad for example to co use, so we could build that in." Then:
// "let's do the iPad part for children that don't have their own phone."
//
// Installing on a shared tablet already worked. Installing TWICE did not, in a
// way no typecheck and no test could see, because both icons were perfectly
// valid: they were just the same picture. A family with a four year old and a
// nine year old got two identical tiles side by side, and the younger one
// cannot read the label underneath to tell them apart. Tapping the wrong tile
// opens a sibling's jobs and a sibling's star bank.
//
// So three things have to hold, and none of them shows up as an error.
//
//   node scripts/check-home-icon.mjs

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const problems = []
const ok = []

const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
const read = rel => {
  try { return strip(readFileSync(join(ROOT, rel), 'utf8')) } catch { return null }
}

const LIB = 'lib/kid/home-icon.tsx'
const APPLE = 'app/k/[token]/apple-icon.tsx'
const MANIFEST = 'app/k/[token]/manifest/route.ts'

// ── 1. THE ICON IS DRAWN FROM THE CHILD'S OWN BUDDY ─────────────────────────
const lib = read(LIB)
if (lib === null) {
  problems.push(`${LIB} is gone, so the one place that decides what a child's Home Screen icon looks like is somewhere this guard cannot see`)
} else if (!/buddyFor\(/.test(lib)) {
  problems.push(
    `${LIB} no longer resolves the child's buddy, so every child is back to one icon. On a tablet two children share that is two identical tiles and a four year old who cannot read the labels under them.`,
  )
} else if (!/characterByKey\(/.test(lib) || !/character\.colour/.test(lib)) {
  problems.push(
    `${LIB} no longer draws the Friend's own art and colour, so the icons stop differing from each other even though a buddy is still being read`,
  )
} else {
  ok.push('a child\'s Home Screen icon is their own Friend, on that Friend\'s colour')
}

// ── 2. AND IT STILL CARRIES NO NAME ─────────────────────────────────────────
//
// The reason the icon varies rather than the label is the Children's Code data
// minimisation point: a Home Screen is visible to anyone holding the device,
// and a manifest ends up in the app list and in backups. A future change that
// "helpfully" puts the child's name under the icon to tell them apart would
// undo the whole reason this was done with a picture.
const manifest = read(MANIFEST)
if (manifest === null) {
  problems.push(`${MANIFEST} is missing`)
} else if (!/name: 'My Jobs'/.test(manifest) || !/short_name: 'My Jobs'/.test(manifest)) {
  problems.push(
    `${MANIFEST} no longer names the installed app "My Jobs". A child's name on a Home Screen is visible to anyone holding the device and ends up in the phone's app list and its backups. If two children need telling apart, the ICON is the half that varies, which is why lib/kid/home-icon.tsx exists.`,
  )
} else if (!/home-icon\/192/.test(manifest) || !/home-icon\/512/.test(manifest)) {
  problems.push(
    `${MANIFEST} points its icons somewhere other than this child's own, so an Android or desktop install puts the company logo on a child's Home Screen while an iPhone install puts their Friend there`,
  )
} else {
  ok.push('the installed app is still called My Jobs, with no child\'s name anywhere on the device')
}

// ── 3. AND A MISSING DATABASE COSTS THE DISTINCTION, NEVER THE ICON ─────────
//
// These routes run on a Home Screen tap. If the buddy lookup throws, the icon
// must still render: a child whose tile turns into a broken square cannot fix
// it, and cannot even say what went wrong.
const apple = read(APPLE)
if (apple === null) {
  problems.push(`${APPLE} is gone, so iOS has no icon for a child's app`)
} else if (!/renderHomeIcon\(/.test(apple)) {
  problems.push(`${APPLE} no longer renders through the shared renderer, so the icon on an iPhone can drift from the one in the manifest`)
} else if (lib && !/catch/.test(lib.split('buddyForToken')[1] ?? '')) {
  problems.push(
    `the buddy lookup in ${LIB} no longer fails soft. It runs when a child taps their Home Screen icon, so a database that is briefly unreachable would give them a broken tile they cannot fix and cannot describe.`,
  )
} else {
  ok.push('a database that cannot be reached costs a family the difference between two icons, never the icon itself')
}

if (problems.length > 0) {
  console.error('check-home-icon FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of lib/kid/home-icon.tsx for the shared tablet case this protects.')
  process.exit(1)
}
console.log('check-home-icon ok: two children on one tablet get two different icons, and neither carries a name')
for (const line of ok) console.log('  ' + line)
