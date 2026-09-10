// A worry raised outside the check in arrives inside it with somewhere to go.
//
// Justin, 14 August 2026: "if doing great we can stop asking at check in unless
// they raise another moment then we add to check in, or any issue raised in
// digi we can add to check in."
//
// The adding half always worked: a concern raised in a DiGi chat on Tuesday is
// picked up by Wednesday's loader like any other. What never worked is what it
// arrived AS. The row carried no note of where it came from, so the one worry
// on the page the parent had actually asked for help about looked identical to
// the four the app had guessed at, and it carried no next move either, because
// the Ask DiGi and script buttons belonged to a DIP, and a dip needs a last
// time to have dipped from. A first ever row has none, so the row that most
// needed help was the only one structurally unable to offer it.
//
// None of that fails a typecheck. All of it is one line away from coming back:
// drop `source` from the select, or narrow the buttons to dips again, and the
// screen still builds, still renders, still saves.

import { readFileSync } from 'node:fs'

const fails = []
const ok = []

// Comments are not code. A guard its own documentation satisfies is not a
// guard: the passport one stayed green after the prop it tested was deleted,
// because the comment explaining the prop still matched.
const code = src => src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map(l => (l.trim().startsWith('//') ? '' : l)).join('\n')

// ── 1. The loader reads where the worry came from ──────────────────────────
const loader = code(readFileSync('lib/checkin/today.ts', 'utf8'))

const select = loader.match(/\.select\('id, slug, label[^']*'\)/)
if (!select) {
  fails.push('The check in no longer selects the concern columns by name. Find the new read and hold source on it.')
} else if (!/source/.test(select[0])) {
  fails.push("The concerns select has lost `source`, so the check in cannot say a worry came from DiGi. It is on the row already: raise.ts has written it since August.")
} else {
  ok.push('the check in reads where each worry came from')
}

// The EXPRESSION, not the file. freshIds.has appears twice in this loader and
// the other one decides the baseline wording, so testing the file as a whole
// passed with the seeding check deleted from isNew.
// Every `isNew:` in the file, because the first is the type declaration and
// the one that matters is the assignment further down.
const isNew = [...loader.matchAll(/isNew:[^\n]*/g)].map(m => m[0]).filter(l => !/boolean/.test(l))
if (isNew.length === 0) {
  fails.push('CheckInRow no longer carries isNew, so nothing downstream can tell a first ever row from a starting set the app seeded.')
} else if (!isNew.some(l => /freshIds\.has/.test(l))) {
  fails.push('isNew is no longer excluding seeded rows. A worry the app guessed at is not news to the parent, and calling it new says "you raised this" about something they never raised.')
} else {
  ok.push('a new worry is the one the parent raised, never one we seeded for them')
}

// ── 2. The screen says so, and offers a next move ──────────────────────────
const card = code(readFileSync('components/daily/ConcernCheckIn.tsx', 'utf8'))

// Twice: the function, and the place it is actually rendered. Once means the
// function survived and the row stopped printing it, which is the same screen
// as never having built it.
const sourceUses = [...card.matchAll(/newSourceLine\(/g)].length
if (sourceUses === 0) {
  fails.push('ConcernCheckIn no longer says where a new worry came from. That line is the only thing telling a parent the app was listening in their DiGi chat.')
} else if (sourceUses < 2) {
  fails.push('newSourceLine is defined and never rendered, so the row is back to saying nothing about where the worry came from.')
} else {
  ok.push('the row says where a new worry came from')
}

const move = card.match(/const nextMove = [^\n]*/)
if (!move) {
  fails.push('The next move rule is gone from ConcernCheckIn. Ask DiGi and See the script are what a raised worry arrives WITH.')
} else if (!/c\.isNew/.test(move[0])) {
  fails.push('The next moves have narrowed back to dips alone. A first ever row has no last time to dip from, so this hides the buttons from exactly the worry the parent asked about.')
} else {
  ok.push('a new worry arrives with its two next moves')
}

// The pills are read by a parent, so they clear the AA floor. Gold on white is
// 2.6 to 1 and was the live pairing here until 10 September.
if (/color: 'var\(--terracotta-dark\)'/.test(card) && /borderRadius: '100px'/.test(card)) {
  const pill = card.match(/const pill: React\.CSSProperties = \{[\s\S]*?\}/)
  if (pill && /color: 'var\(--terracotta-dark\)'/.test(pill[0])) {
    fails.push('The next move pills are gold text on white again, which is 2.6 to 1 and below the 4.5 AA floor. Ink on white, gold on the edge.')
  }
}
if (!fails.some(f => f.includes('2.6 to 1'))) ok.push('the pills are readable, ink on white with a gold edge')

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
