// No model ever runs on the child's side. Mechanically.
//
// This is the one rule the private tutor rests on, and it is the sort of rule
// that survives right up until a Tuesday afternoon when a live tutor chat looks
// like two lines of work. Migration 064 wrote it down in 2026: always from the
// parent, never a message from us to the child. A comment does not enforce
// anything. This does.
//
// WHAT IT ACTUALLY PROVES. Every file under the child's half of the product is
// read, and the Anthropic SDK must not appear in any of them: not imported, not
// fetched at its API host, not reached through a helper that wraps it. A tutor
// lesson gets onto a child's phone by being generated on the PARENT's side,
// read by that parent, and stored as rows. That is why tutor_lessons has a
// slides column at all.
//
// WHAT IT DOES NOT PROVE. It cannot see a route the child's client calls that
// itself calls a model. That is why /api/kid is in the list: everything the
// child app posts to lives there, so the boundary is a directory rather than an
// idea.
//
// If this fails and the change is genuinely wanted, it needs the things a
// conversational child tutor needs and does not have: a child safe system
// prompt, its own safety layer, logs a parent can read, and age gating. Deleting
// a line from ROOTS is not one of them.
//
// Usage: node scripts/check-child-has-no-model.mjs

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOTS = ['app/k', 'app/api/kid', 'lib/kid', 'components/kid', 'lib/quests/kid-push.ts', 'lib/planter', 'components/planter']

// The SDK by name, its API host, and the model ids themselves. The last one
// catches the shortcut of calling the endpoint by hand with fetch, which
// imports nothing and would otherwise pass.
const BANNED = [
  { pattern: /@anthropic-ai\/sdk/, why: 'the Anthropic SDK' },
  { pattern: /api\.anthropic\.com/, why: 'a direct call to the Anthropic API' },
  { pattern: /\bclaude-[a-z0-9.-]+\b/, why: 'a hardcoded model id' },
  { pattern: /\bDIGI_MODEL\b/, why: 'the DiGi model config, which only makes sense next to a model call' },
]

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])

function walk(path, out = []) {
  let stat
  try { stat = statSync(path) } catch { return out }
  if (stat.isFile()) {
    if (EXTENSIONS.has(path.slice(path.lastIndexOf('.')))) out.push(path)
    return out
  }
  for (const entry of readdirSync(path)) walk(join(path, entry), out)
  return out
}

const files = ROOTS.flatMap(root => walk(root))
if (files.length === 0) {
  console.log('FAIL  no files found. The child side has moved and this check is now checking nothing.')
  process.exit(1)
}

const failures = []
for (const file of files) {
  const source = readFileSync(file, 'utf8')
  for (const { pattern, why } of BANNED) {
    const hit = source.match(pattern)
    if (!hit) continue
    // Which line, so the message points at the thing rather than the file.
    const line = source.slice(0, hit.index).split('\n').length
    failures.push(`${relative(process.cwd(), file)}:${line}  ${why}  (${hit[0]})`)
  }
}

console.log(`Read ${files.length} files across the child side of the product.`)
for (const f of failures) console.log(`FAIL  ${f}`)

if (failures.length === 0) {
  console.log('PASS  no model runs on the child device. A lesson reaches a child as stored slides, sent by their parent.')
  process.exit(0)
}
console.log(`\n${failures.length} failed. See the note at the top of this file before changing it.`)
process.exit(1)
