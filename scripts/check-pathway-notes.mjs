// A rung's caption never claims more than the rung itself.
//
// Justin, 11 September 2026, with a screenshot of two grey pathway nodes both
// captioned "done today": "its still reading done today in this pathway, why is
// it doing that as we havent done them today".
//
// `withNote` in lib/pathway/daily-tasks.ts exists for ONE job: to say that a
// SIBLING did a household rung, so a tick the parent did not perform is never
// silent. It was called unconditionally, and an empty list walked past both of
// its guards: [].some() is false so it never returned undefined, [].find() is
// undefined so there was no sibling to name, and the last line handed back the
// words "done today" for a day on which nothing had happened.
//
// The pathway is the one screen a parent trusts to tell them what is left
// today. A caption that contradicts its own node costs that trust directly, and
// it is the kind of thing that reads as the app being confused rather than as a
// bug, which is worse.

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

// Comments are not code: a guard its own documentation satisfies is not a guard.
function code(path) {
  return readFileSync(path, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(l => (l.trim().startsWith('//') ? '' : l))
    .join('\n')
}

const src = code('lib/pathway/daily-tasks.ts')

const start = src.indexOf('const withNote =')
if (start === -1) {
  fails.push('withNote is gone from lib/pathway/daily-tasks.ts. It is what names the sibling who ticked a household rung.')
} else {
  const body = src.slice(start, src.indexOf('\n  }', start))

  // 1. The empty list must be answered FIRST, before either guard it fools.
  const guardAt = body.search(/rows\.length === 0\)\s*return undefined/)
  const someAt = body.indexOf('rows.some(')
  if (guardAt === -1) {
    fails.push('withNote no longer returns undefined for an empty list, so a rung nobody has touched is captioned "done today" again.')
  } else if (someAt !== -1 && guardAt > someAt) {
    fails.push('The empty list check in withNote now runs AFTER rows.some(), which is the order that let [] fall through to "done today" in the first place.')
  } else {
    ok.push('withNote answers an empty list before anything else can misread it')
  }

  // 2. The fallback string is still the last resort and not the first answer.
  if (!/return name \?/.test(body)) {
    fails.push('withNote no longer prefers the sibling\'s name over the bare fallback, so a tick by a named child stops saying who did it.')
  } else {
    ok.push('a named sibling is still named rather than reduced to the fallback')
  }
}

// 3. The note must never be the thing that decides a rung is done. If it were,
//    this whole class of bug becomes a wrong tick rather than a wrong caption.
for (const [name, rung] of [['moment', 'momentDone'], ['script', 'scriptDone']]) {
  const line = src.split('\n').find(l => l.includes(`const ${rung} =`))
  if (!line) {
    fails.push(`${rung} is gone, so the ${name} rung no longer has a single place that decides whether it is done.`)
  } else if (/Note/.test(line)) {
    fails.push(`${rung} is computed from the caption. The caption describes the rung; it must never be what decides it.`)
  } else {
    ok.push(`the ${name} rung is decided by its rows, never by its caption`)
  }
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
