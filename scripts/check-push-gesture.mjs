// Nothing may be awaited before we ask for notification permission.
//
// Justin, 15 September 2026: "it says when instructions to add to home screen
// to then click quest and it will ask for notifications but it is not working."
//
// ── THE SHAPE OF THE BUG ────────────────────────────────────────────────────
//
// The child's enableReminders in app/k/[token]/KidQuestScreen.tsx read:
//
//     const reg = await navigator.serviceWorker.register('/sw.js')
//     await navigator.serviceWorker.ready
//     const perm = await Notification.requestPermission()
//
// Notification.requestPermission is only granted a prompt while the document
// still holds TRANSIENT USER ACTIVATION: the browser's short lived record that
// a human just tapped. An await on a promise that settles in a later task ends
// it, and serviceWorker.ready routinely takes hundreds of milliseconds the
// first time a worker installs. So on an iPhone the sheet never opened, the
// call answered 'default' or rejected, and a child tapped Yes please and
// watched nothing happen.
//
// The parent's card had the same sequence in the right order, which is the
// part worth noticing: two hand written copies of one flow, one correct and one
// not, and no way for the fix on one to reach the other.
//
// ── WHAT THIS GUARD ENFORCES ────────────────────────────────────────────────
//
// Two rules, either of which alone would have caught it:
//
//   1. Only lib/push/enable.ts may call Notification.requestPermission. Every
//      other surface goes through enablePush, so the order is not theirs to
//      get wrong.
//   2. Inside enablePush, requestPermission is the FIRST await. If an await
//      appears before it, the permission prompt is already lost.
//
// Neither TypeScript nor the build can see this: the ordering is legal code
// that fails only on a real phone held by a real child, which is the most
// expensive place to find anything.
//
//   node scripts/check-push-gesture.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const OWNER = 'lib/push/enable.ts'
const problems = []
const notes = []

function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) walk(full, out)
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(full)
  }
  return out
}

const files = ['app', 'components', 'lib', 'schools'].flatMap(r => walk(join(ROOT, r)))
const strip = src => src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')

// ── RULE 1: one owner for the call ──────────────────────────────────────────
let callers = 0
for (const file of files) {
  const rel = file.replace(ROOT + '/', '')
  const code = strip(readFileSync(file, 'utf8'))
  if (!/Notification\s*\.\s*requestPermission/.test(code)) continue
  callers++
  if (rel !== OWNER) {
    problems.push(
      `${rel}: calls Notification.requestPermission directly. Only ${OWNER} may, because the call has to be the first await after the tap or iOS never opens the prompt. Use enablePush from '@/lib/push/enable' instead.`,
    )
  }
}
if (callers === 0) {
  problems.push(`found no Notification.requestPermission call anywhere, so this guard is not looking at anything`)
}

// ── RULE 2: it is the first await inside the owner ───────────────────────────
const ownerPath = join(ROOT, OWNER)
let owner
try { owner = strip(readFileSync(ownerPath, 'utf8')) } catch { owner = null }
if (owner === null) {
  problems.push(`${OWNER} is missing, so the shared enable path this guard protects no longer exists`)
} else {
  const fnAt = owner.indexOf('export async function enablePush')
  if (fnAt === -1) {
    problems.push(`${OWNER}: no exported enablePush, so callers have nothing correct to use`)
  } else {
    const body = owner.slice(fnAt)
    const ask = body.search(/Notification\s*\.\s*requestPermission/)
    if (ask === -1) {
      problems.push(`${OWNER}: enablePush never asks for permission`)
    } else {
      // Everything before the call, MINUS the `await` that belongs to the call
      // itself: `perm = await Notification.requestPermission()` is the correct
      // shape, and a naive search would flag its own await.
      const before = body.slice(0, ask).replace(/\bawait\s*$/, '')
      const firstAwait = before.search(/\bawait\b/)
      if (firstAwait !== -1) {
        const line = before.slice(firstAwait).split('\n')[0].trim().slice(0, 90)
        problems.push(
          `${OWNER}: enablePush awaits something before it asks for permission ("${line}"). ` +
          `An await spends the user activation, so iOS will not open the permission sheet and the tap does nothing. ` +
          `Ask first, then register and subscribe.`,
        )
      } else {
        notes.push('enablePush asks for permission before it awaits anything else')
      }
    }
  }
}

// ── RULE 3: the save is checked, not assumed ────────────────────────────────
if (owner && !/res\s*\.\s*ok/.test(owner)) {
  problems.push(
    `${OWNER}: the Response from the save is never checked. A 500 would leave a child told their reminders are on with nothing stored, which is how the last one hid.`,
  )
} else if (owner) {
  notes.push('the save response is checked before success is reported')
}

if (problems.length > 0) {
  console.error('check-push-gesture FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why the toolchain cannot see this.')
  process.exit(1)
}
console.log(`check-push-gesture ok: ${callers} caller of Notification.requestPermission, in ${OWNER}`)
for (const n of notes) console.log('  ' + n)
