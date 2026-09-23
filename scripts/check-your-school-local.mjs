// The school's safeguarding details stay in the browser they were typed in.
//
// The panel that asks for them says, in words beside the fields: "Stored in
// this browser only. Nothing is sent to us, no account is made." On 23
// September 2026 the store grew from the lead's name to five fields, a
// colleague's name among them, and moved onto an open page, so the promise now
// covers more and is read by more people. This guard is the promise in code.
//
//   1. the store itself makes no network call and names no database
//   2. a server file may render the components built on the store, never
//      read the store itself
//   3. a client file holding the details runs no server action, and none of
//      its network calls carries them (the lesson player posts a completion
//      in the parents app, which is fine, because the lead is not in it)
//
//   node scripts/check-your-school-local.mjs
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

let bad = 0
const say = (okay, msg) => { console.log(`${okay ? 'ok  ' : 'FAIL'} ${msg}`); if (!okay) bad += 1 }

const STORE = 'shared/schools-your-school.ts'
const store = readFileSync(STORE, 'utf8')
say(!/\bfetch\(|XMLHttpRequest|sendBeacon|['"]use server['"]|supabase|server-db/.test(store), `${STORE} makes no network call and names no database`)
say(/localStorage/.test(store), `${STORE} keeps the details in localStorage`)

// Anything that names the details, in the store's words or the player's prop.
const DETAILS = /\b(schoolLead|leadName|leadWhere|deputyName|reportRoute|policyTitle|readYourSchool|useYourSchool\w*|schoolRows|leadLine)\b/
// The text of a call from its name to its closing bracket, so a check reads
// the arguments and nothing after them.
function callText(src, at) {
  let depth = 0
  for (let i = src.indexOf('(', at); i > -1 && i < src.length; i++) {
    if (src[i] === '(') depth += 1
    else if (src[i] === ')' && (depth -= 1) === 0) return src.slice(at, i + 1)
  }
  return src.slice(at)
}

// Everything that touches the details, directly or through the two components.
const files = execSync("git ls-files 'schools/**/*.tsx' 'schools/**/*.ts' 'shared/**/*.tsx' 'shared/**/*.ts'", { encoding: 'utf8' })
  .split('\n').filter(Boolean).filter(f => f !== STORE)
const touches = files.filter(f => /schools-your-school|YourSchoolLead|YourSchoolPanel/.test(readFileSync(f, 'utf8')))
say(touches.length > 0, `${touches.length} files touch the school's details`)
for (const f of touches) {
  const src = readFileSync(f, 'utf8')
  const client = /^\s*['"]use client['"]/.test(src)
  // A server page may render the components; it may not read the store.
  const readsStore = /from '@gc\/shared\/schools-your-school'/.test(src) && /\b(readYourSchool|writeYourSchool)\(/.test(src)
  say(client || !readsStore, `${f} ${client ? 'is a client file' : 'is a server file that only renders the components'}`)
  // The details exist only in client code, so that is where a send would leak them.
  if (!client) continue
  say(!/['"]use server['"]|<form[^>]*\baction=\{/.test(src), `${f} runs no server action`)
  const leaks = [...src.matchAll(/\bfetch\(|sendBeacon\(|new XMLHttpRequest/g)]
    .filter(m => DETAILS.test(callText(src, m.index)))
    .map(m => src.slice(0, m.index).split('\n').length)
  say(leaks.length === 0, `${f} sends none of the details${leaks.length ? ` (line ${leaks.join(', ')})` : ''}`)
}

if (bad) { console.error(`\n${bad} problem(s)`); process.exit(1) }
console.log("\nthe school's details stay on the screen they were typed on")
