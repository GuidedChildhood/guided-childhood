// The child never chats with a model. Mechanically.
//
// This is the one rule the private tutor rests on, and it is the sort of rule
// that survives right up until a Tuesday afternoon when a live tutor chat looks
// like two lines of work. Migration 064 wrote it down in 2026: always from the
// parent, never a message from us to the child. A comment does not enforce
// anything. This does.
//
// THE RULE, as Justin decided it (the route on 25 September 2026, the wording
// on 14 October 2026): the child never chats with a model. The only thing a
// model does on the child's side is one fixed card, the homework hint for ages
// 10 and over, and that is ONE route, named below, held to a short list of
// conditions. It is not an exception for model calls that look small. A second
// route, a streamed reply, a follow up box or a younger age is a new decision,
// not an edit to this file.
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

const ROOTS = ['app/k', 'app/api/kid', 'lib/kid', 'components/kid', 'lib/quests/kid-push.ts', 'lib/planet', 'components/planet']

// The SDK by name, its API host, and the model ids themselves. The last one
// catches the shortcut of calling the endpoint by hand with fetch, which
// imports nothing and would otherwise pass.
const BANNED = [
  { pattern: /@anthropic-ai\/sdk/, why: 'the Anthropic SDK' },
  { pattern: /api\.anthropic\.com/, why: 'a direct call to the Anthropic API' },
  { pattern: /\bclaude-[a-z0-9.-]+\b/, why: 'a hardcoded model id' },
  { pattern: /\bDIGI_MODEL\b/, why: 'the DiGi model config, which only makes sense next to a model call' },
]

// The one route on the child's side that may call a model, and what must stay
// true of it. Each condition is a way the fixed card turns into a chat.
//   age gate      checked on the server, before the model is called, so a
//                 child under 10 cannot reach it by editing the screen
//   one call      a single request and a single reply, nothing in a loop
//   not streamed  a card arrives whole; a stream is a conversation's shape
//   fixed shape   the reply is parsed into the card's fields or refused
//   no history    the route reads no stored messages for the child
// Only the SDK and the model config are allowed there. A hand made fetch to the
// API host or a hardcoded model id still fails, here as everywhere.
const CARD_ROUTE = 'app/api/kid/homework-help/route.ts'
const CARD_ROUTE_EXEMPT = new Set(['the Anthropic SDK', 'the DiGi model config, which only makes sense next to a model call'])
const CARD_ROUTE_RULES = [
  { ok: s => s.indexOf('mayHaveHints(dob, band)') !== -1 && s.indexOf('mayHaveHints(dob, band)') < s.indexOf('callDigi({'), why: 'the age gate must run on the server before the model is called' },
  { ok: s => (s.match(/\.messages\.create\(/g) ?? []).length === 1, why: 'the route must make exactly one model request' },
  { ok: s => !/\.stream\(|stream:\s*true|text\/event-stream|ReadableStream/.test(s), why: 'the card must arrive whole, never streamed' },
  { ok: s => /parseHintCard\(/.test(s), why: 'the reply must be parsed into the fixed card or refused' },
  { ok: s => !/\.from\(['"](messages|chat|conversation|tutor)/.test(s), why: 'the route must not read a stored conversation' },
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
  const isCard = relative(process.cwd(), file) === CARD_ROUTE
  if (isCard) {
    for (const { ok, why } of CARD_ROUTE_RULES) if (!ok(source)) failures.push(`${CARD_ROUTE}  ${why}`)
  }
  for (const { pattern, why } of BANNED) {
    if (isCard && CARD_ROUTE_EXEMPT.has(why)) continue
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
  console.log('PASS  the child never chats with a model. A lesson reaches a child as stored slides, sent by their parent; the one fixed hint card is the only other thing.')
  process.exit(0)
}
console.log(`\n${failures.length} failed. See the note at the top of this file before changing it.`)
process.exit(1)
