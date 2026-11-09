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
// DIGI'S QUESTIONS (7 November 2026). The same goes for a question handed to
// DiGi: /dashboard/digi?q=<words> or ?ask=<words>. Those words were often a
// child's name and the family's own ("Olga asked to keep her phone till
// nine"), and they cannot be caught by a parameter name, since q is just q.
// So the rule for DiGi is stricter and simpler: a q= or ask= on a DiGi link
// may only carry a string fixed in the code. Anything computed, a template
// ${...} or a string joined on, fails, because this script cannot tell a
// variable holding a script title from one holding a child's name. Hand the
// question over with DigiAskLink or holdDigiPrompt (client) or digiPromptHref
// (server) instead; lib/digi/handoff.ts says why.
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

// A DiGi link: /dashboard/digi?... or a bare digi?... on the same line.
const DIGI_LINK = /\/dashboard\/digi\?|\bdigi\?/
// ?q=${  &ask=' +  is a computed question. ${encodeURIComponent('fixed words')}
// is let through: a literal is the same for every family and names nobody.
// The } and quotes catch a q= that follows an optional part, as in
// ?${childId ? `child=${childId}&` : ''}ask=${...}.
const DIGI_COMPUTED = /[?&}'"`](?:q|ask)=(?:\$\{(?!encodeURIComponent\(\s*(['"])[^'"`$]*\1\s*\)\})|['"`]\s*\+)/
// A DiGi URL built with URLSearchParams or searchParams.set and a q or ask.
const DIGI_PARAMS = /URLSearchParams\(\s*\{[^}]*\b(?:q|ask)\s*:|searchParams\.(?:set|append)\(\s*['"`](?:q|ask)['"`]/

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
let digiProblems = 0
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
      } else if (DIGI_LINK.test(line) && (DIGI_COMPUTED.test(line) || DIGI_PARAMS.test(line))) {
        problems.push(`${file}:${i + 1}  ${raw.trim().slice(0, 160)}  (a computed question for DiGi)`)
        digiProblems++
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
  if (digiProblems) {
    console.error('\nA question for DiGi: use DigiAskLink or holdDigiPrompt in client code, or')
    console.error('digiPromptHref (sealed for the parent) on the server. See lib/digi/handoff.ts.')
  }
  process.exit(1)
}
console.log(`check-no-pii-in-urls ok: ${files} files, no name, email or computed DiGi question put into a URL.`)
