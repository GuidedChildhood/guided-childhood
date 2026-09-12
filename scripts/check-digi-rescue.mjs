// A parent must never be left with nothing, and the row must say so.
//
// Justin, 12 September 2026: DiGi's silent replies. digi_latency held ten
// messages that returned nothing, every one the family lane, eight of them
// after a tool fired. The rescue for that shipped on 6 September and the last
// silent reply was the 5th, so it is very probably cured. "Very probably" is
// the problem: only six messages have gone through since, none of them the
// failing shape, and the table CANNOT tell us either way.
//
// It cannot because the apology path clears fullText so the apology is never
// filed as the answer. Correct, and it means the row reads replied false with
// zero characters whether the parent got a warm apology or a blank screen.
// Those are two different products and one row.
//
// So this guard holds three rules about every path that gives up:
//
//   1. It attempted rescuePlain first. Giving up without one tool free try is
//      the bug we already fixed twice, on 19 August and again on 6 September.
//   2. It told the parent something.
//   3. It recorded that the apology went out, so the next occurrence says
//      whether the parent was told or told nothing.
//
// Structural on purpose. It reads where the answer is thrown away and looks
// backwards for the rescue, the apology and the reason, so rewording a comment
// cannot satisfy it and reshaping the code cannot silently drop the rescue.
//
//   node scripts/check-digi-rescue.mjs

import { readFileSync } from 'node:fs'

const FILE = process.argv[2] ?? 'app/api/digi/route.ts'
const raw = readFileSync(FILE, 'utf8')

// COMMENTS ARE NOT EVIDENCE, AND THEY MUST NOT CROWD OUT EVIDENCE EITHER.
//
// Two reasons this runs on code with the comments blanked. The obvious one is
// the rule of this repo: a guard its own documentation satisfies is not a
// guard, so the word "rescuePlain" inside a paragraph explaining rescuePlain
// must never count as the call. The one that actually bit: the give up paths
// below carry long notes about why they exist, and those notes filled the look
// back window so completely that the real call sat outside it and the guard
// failed on correct code.
//
// Comment characters become spaces and newlines are kept, so every index and
// every line number still points at the real file.
function blankComments(s) {
  let out = ''
  let i = 0
  // 'code' | 'line' | 'block' | 'sq' | 'dq' | 'tpl'
  let state = 'code'
  const blank = (ch) => (ch === '\n' ? '\n' : ' ')
  while (i < s.length) {
    const ch = s[i]
    const next = s[i + 1]
    if (state === 'code') {
      if (ch === '/' && next === '/') { state = 'line'; out += '  '; i += 2; continue }
      if (ch === '/' && next === '*') { state = 'block'; out += '  '; i += 2; continue }
      if (ch === "'") { state = 'sq' }
      else if (ch === '"') { state = 'dq' }
      else if (ch === '`') { state = 'tpl' }
      out += ch; i += 1; continue
    }
    if (state === 'line') {
      if (ch === '\n') { state = 'code'; out += '\n'; i += 1; continue }
      out += ' '; i += 1; continue
    }
    if (state === 'block') {
      if (ch === '*' && next === '/') { state = 'code'; out += '  '; i += 2; continue }
      out += blank(ch); i += 1; continue
    }
    // inside a string: copy it through, honouring escapes
    if (ch === '\\') { out += s.slice(i, i + 2); i += 2; continue }
    if ((state === 'sq' && ch === "'") || (state === 'dq' && ch === '"') || (state === 'tpl' && ch === '`')) {
      state = 'code'
    }
    out += ch; i += 1; continue
  }
  return out
}

// MEASURE THE LOOK BACK IN CODE, NOT IN PROSE.
//
// The window has to be small or a path borrows its neighbour's rescue. But a
// window measured in raw characters is mostly comment here, and the notes above
// these paths are long enough to push the real call out of it. So the file is
// compacted to its code, whitespace runs collapsed, with every kept character
// remembering where it came from. Six hundred characters of that is six hundred
// characters of actual code.
const blanked = blankComments(raw)
let code = ''
const origin = []
let pendingSpace = false
for (let i = 0; i < blanked.length; i += 1) {
  const ch = blanked[i]
  if (/\s/.test(ch)) { pendingSpace = code.length > 0; continue }
  if (pendingSpace) { code += ' '; origin.push(i); pendingSpace = false }
  code += ch; origin.push(i)
}

// ANCHOR ON GIVING UP, NOT ON THE APOLOGY.
//
// The first version iterated over the WARM_ERROR sends, and a mutation test
// caught it out: deleting one send simply left one fewer thing to check, so a
// path that stopped telling the parent anything passed clean. The guard was
// only ever as strong as the code it happened to find.
//
// Clearing fullText is the moment DiGi gives up: the answer is thrown away and
// the row will read replied false. That is the thing that must never happen
// quietly, so that is what the guard counts. Each one has to prove three
// things about the code just above it.
//
// The declaration at the top of the stream body is not a give up, so an
// assignment introduced by let, const or var does not count as one.
const gives = []
const giveRe = /(^|[^.\w])(let |const |var )?fullText ?= ?(''|""|``)/g
let g
while ((g = giveRe.exec(code)) !== null) {
  if (g[2]) continue
  gives.push(g.index + g[0].length)
}

const problems = []

if (gives.length === 0) {
  problems.push("Nothing in this route throws the answer away any more. Either that is a real improvement and this guard needs rewriting, or the give up moved somewhere it is no longer visible.")
}

gives.forEach((at, i) => {
  // EACH PATH MUST CARRY ITS OWN RESCUE.
  //
  // The window starts after the previous give up so a path can only ever be
  // satisfied by code that is actually its own.
  const floor = i === 0 ? 0 : gives[i - 1] + 1
  const region = code.slice(Math.max(floor, at - 600), at)
  const line = raw.slice(0, origin[at - 1] ?? 0).split('\n').length

  if (!/await rescuePlain\(\)/.test(region)) {
    problems.push(`line ${line}: DiGi gives up with no rescuePlain() before it. A parent must get one tool free attempt first.`)
  }
  if (!/controller\.enqueue\(encoder\.encode\(WARM_ERROR\)\)/.test(region)) {
    problems.push(`line ${line}: DiGi gives up without telling the parent anything. That is the blank screen.`)
  }
  if (!/failReason ?= ?[`\'"]apology/.test(region)) {
    problems.push(`line ${line}: DiGi gives up and failReason never records that the apology went out. The row will read the same as a blank screen.`)
  }
})

if (problems.length > 0) {
  console.error('check-digi-rescue FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why these rules exist.')
  process.exit(1)
}

console.log(`check-digi-rescue ok: ${gives.length} give up paths, each one rescued, told and recorded.`)
