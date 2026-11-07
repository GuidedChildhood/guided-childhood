// No name or email address in a URL.
//
// A URL is not a private place. It is written into the server's request logs,
// into any analytics on the page, into browser history on a shared machine,
// and into the Referer header of the next request. On 6 November 2026 the
// funnel audit (Research Pack 11, fix 8) found the schools pilot email built
// /pricing?school=&name=&email=, and the sweep after it found the same habit
// in the lead stop link (?e=), the starter link (?e=), the sign up and sign in
// redirects (?email=) and DiGi's add a child offer (?add_child=<a child's
// name>). Each now carries an opaque token, or nothing, and resolves the
// person on the server or from this device's own storage.
//
// This keeps it that way. It looks for a query parameter whose NAME says it
// holds a person (email, e, name, contact, the school's name, a child's name)
// being given a VALUE in code: a template ${...}, a string joined on, or a key
// in a URLSearchParams object. Reading such a parameter is not flagged, so the
// routes can still honour old links already sitting in inboxes.
//
// If this fires on something that is genuinely not a person (a device name,
// say), rename the parameter rather than adding an exception: the name is
// what a reader of the logs will take it to be.
//
//   node scripts/check-no-pii-in-urls.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOTS = ['app', 'lib', 'components', 'schools/app', 'schools/lib', 'schools/components', 'shared', 'middleware.ts', 'schools/proxy.ts']
const SKIP_DIRS = new Set(['node_modules', '.next', 'dev'])
const PERSON = '(?:email|e|name|first_?name|last_?name|full_?name|contact|contact_?name|school|school_?name|child_?name|parent_?name|add_child)'

// ?email=${x}  &name=' + x  ?add_child=${encodeURIComponent(n)}, and a query
// part built on its own to be joined later: [`email=${x}`, ...].join('&')
const ASSIGNED = new RegExp(`(?:[?&]|['"\`])${PERSON}=(?:\\$\\{|['"\`]\\s*\\+)`, 'i')
// new URLSearchParams({ email: r.email, ... }) and .searchParams.set('email', x)
const PARAMS_OBJECT = new RegExp(`URLSearchParams\\(\\s*\\{[^}]*\\b${PERSON}\\s*:`, 'i')
const PARAMS_SET = new RegExp(`searchParams\\.(?:set|append)\\(\\s*['"\`]${PERSON}['"\`]`, 'i')

function* walk(p) {
  const st = statSync(p, { throwIfNoEntry: false })
  if (!st) return
  if (st.isFile()) { if (/\.(ts|tsx|js|mjs)$/.test(p) && !/\.test\.(ts|mjs)$/.test(p)) yield p; return }
  for (const name of readdirSync(p)) if (!SKIP_DIRS.has(name)) yield* walk(join(p, name))
}

// Where a value goes into the parameter is code; a comment describing the old
// shape is not. Line comments and block comment lines are blanked first.
const code = line => line.replace(/^\s*(\/\/|\*|\/\*).*$/, '').replace(/\s\/\/\s.*$/, '')

const problems = []
let files = 0
for (const root of ROOTS) {
  for (const file of walk(root)) {
    files++
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((raw, i) => {
      const line = code(raw)
      if (!line) return
      // `schools/app/s/[code]` sets ?school=<a school CODE>, the newsletter
      // link, not a name: it is the one parameter called school that is not
      // a person, and it is spelled out here rather than hidden in the regex.
      if (/searchParams\.set\('school', code!?\)/.test(line)) return
      if (ASSIGNED.test(line) || PARAMS_OBJECT.test(line) || PARAMS_SET.test(line)) {
        problems.push(`${file}:${i + 1}  ${raw.trim().slice(0, 160)}`)
      }
    })
  }
}

if (problems.length) {
  console.error('check-no-pii-in-urls FAILED\n')
  for (const p of problems) console.error(`  ${p}`)
  console.error('\nA name or an email in a URL ends up in logs, analytics, history and Referer headers.')
  console.error('Carry an opaque token and resolve it on the server (lib/email/link-token.ts,')
  console.error('schools/lib/pilot-prefill.ts), or hand it over in this device\'s storage.')
  process.exit(1)
}
console.log(`check-no-pii-in-urls ok: ${files} files, no name or email put into a URL.`)
