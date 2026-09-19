// EVERY KEY THE APP READS IS WRITTEN DOWN.
//
// Found 19 September 2026, setting up a new laptop. The template listed 23
// keys and the app read 53. The two that mattered were VAPID_EMAIL and
// VAPID_PRIVATE_KEY: lib/push/send.ts returns early and sends nothing when
// either is missing, with no error and no log, so push simply stops while
// everything else carries on looking healthy. EMBEDDING_API_KEY was the same
// shape, semantic search silently returning nothing for ever.
//
// That is the whole class of bug this guards. A missing key does not crash
// the app, it removes a feature quietly, and the person who set the machine
// up has no way to know. The template is the only place that can tell them,
// and a template nobody checks drifts the moment somebody adds a key.
//
// Two rules:
//
//   A  every env var app/ and lib/ read is in the template or exempt
//   B  nothing is exempt by accident: the exempt list is explicit and every
//      entry carries a reason in the comment below
//
// Scoped to app/ and lib/ on purpose. scripts/ and tools/ are one off
// switches a developer types on the command line, documented where they are
// used, and holding them to a template of runtime config would only teach
// people to add exemptions.
//
// Node builtins only: the concern-guards job runs no npm ci.
//
//   node scripts/check-env-documented.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const TEMPLATE = '.env.local.template'

// Set by the host, never by us.
const HOST_SUPPLIED = new Set([
  'NODE_ENV',
  'VERCEL_ENV', 'NEXT_PUBLIC_VERCEL_ENV', 'VERCEL_DEPLOYMENT_ID', 'VERCEL_GIT_COMMIT_SHA',
])

const fail = []

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx|mjs|js)$/.test(name)) out.push(p)
  }
  return out
}

let template = ''
try { template = readFileSync(TEMPLATE, 'utf8') } catch { fail.push(`${TEMPLATE} is missing, so nothing tells anyone which keys this app needs`) }
const documented = new Set([...template.matchAll(/^([A-Z0-9_]+)=/gm)].map(m => m[1]))

const used = new Map() // name -> first file that reads it
for (const dir of ['app', 'lib']) {
  let files = []
  try { files = walk(dir) } catch { continue }
  for (const f of files) {
    const src = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ')
    for (const m of src.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      if (!used.has(m[1])) used.set(m[1], f)
    }
  }
}

const missing = [...used.entries()]
  .filter(([name]) => !documented.has(name) && !HOST_SUPPLIED.has(name))
  .sort()

if (missing.length) {
  fail.push(
    `A: ${missing.length} key${missing.length === 1 ? ' is' : 's are'} read by the app and not in ${TEMPLATE}. ` +
    `A missing key does not crash anything, it removes a feature quietly, so somebody setting up a machine has no way to find out:\n` +
    missing.map(([name, file]) => `       ${name}  (read in ${file})`).join('\n') +
    `\n     Add each one with a line saying what breaks without it, or set it in the host and add it to HOST_SUPPLIED here with the reason.`,
  )
}

// B: the exempt list stays small and deliberate. A guard whose escape hatch
// grows is a guard being routed around.
if (HOST_SUPPLIED.size > 8) {
  fail.push(`B: the exempt list has grown to ${HOST_SUPPLIED.size}. Each entry must be genuinely set by the host, not a key somebody could not be bothered to document.`)
}

if (fail.length) {
  console.error('check-env-documented FAILED\n')
  for (const f of fail) console.error(`  ${f}\n`)
  process.exit(1)
}
console.log(`check-env-documented: all ${used.size} keys the app reads are documented in ${TEMPLATE} or set by the host.`)
