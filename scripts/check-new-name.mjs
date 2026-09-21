// The rules for noticing a name we have not met.
//
// lib/digi/new-name.ts decides whether to offer a parent "add this child".
// It is a pile of heuristics over free text, which is the kind of code that
// rots quietly: a stop list entry deleted by accident, a regex loosened to fix
// one case, and suddenly the app is offering to add Minecraft as a nine year
// old. None of that is visible to TypeScript or to a build.
//
// So the behaviour is pinned here: the cases that MUST fire, the cases that
// must NEVER fire, and the reason each one exists. Node builtins only, so it
// runs in the concern-guards job with nothing installed.
//
//   node scripts/check-new-name.mjs

import { readFileSync } from 'node:fs'

const SRC = 'lib/digi/new-name.ts'

// The module is TypeScript, and this guard runs with no build step, so the
// function is read and evaluated directly. The types are the only thing
// stripped: the rules under test are the real ones, not a copy of them.
const source = readFileSync(SRC, 'utf8')
  .replace(/^import[^\n]*\n/gm, '')
  .replace(/export /g, '')
  .replace(/:\s*Set<string>/g, '')
  .replace(/const lowered = new Set<string>\(\)/, 'const lowered = new Set()')
  .replace(/function firstWord\(name: string\): string/, 'function firstWord(name)')
  .replace(/function newNamesIn\(texts: string\[\], known: string\[\] = \[\]\): string\[\]/, 'function newNamesIn(texts, known = [])')
  .replace(/function addChildHref\(name: string\): string/, 'function addChildHref(name)')
  .replace(/const found: string\[\] = \[\]/, 'const found = []')

let newNamesIn, addChildHref
try {
  ;({ newNamesIn, addChildHref } = new Function(`${source}; return { newNamesIn, addChildHref }`)())
} catch (err) {
  console.error('check-new-name FAILED\n')
  console.error(`  ${SRC} could not be evaluated: ${err.message}`)
  console.error('  The guard strips types by hand, so a new type annotation in this file needs a line adding above.')
  process.exit(1)
}

const FIRES = [
  {
    why: 'the case this was built for: Justin asked about a 9 year old called Olga while only Timbotee was set up',
    texts: ['Olga who is 9 seems to fell left out as I am concentrating on football with my 4 year old'],
    known: ['Timbotee'],
    want: ['Olga'],
  },
  {
    why: 'the follow up question on Home names her too, which is where he noticed it',
    texts: ['Quick one for tomorrow: when Olga gets her ten minutes, does she choose something with you or something on her own?'],
    known: ['Timbotee'],
    want: ['Olga'],
  },
  {
    why: 'a plain sibling mention with an age',
    texts: ['My son Rueben is 12 and will not come off the Xbox'],
    known: [],
    want: ['Rueben'],
  },
  {
    why: 'two new names in one message, both offered',
    texts: ['Bea and Otto are 7 and 9 and they fight over the tablet every day'],
    known: [],
    want: ['Bea', 'Otto'],
  },
  {
    why: 'a name that also turns up in our own writing is still this family’s child',
    texts: ['Alma is 6 and her brother takes the iPad off her'],
    known: ['Timbotee'],
    want: ['Alma'],
  },
]

const NEVER = [
  { why: 'a child we already have', texts: ['Timbotee is asking for a tablet, he is 5'], known: ['Timbotee'] },
  { why: 'the same child written the way the parent types it', texts: ['Timbotee and her sister are 8'], known: ['Timbotee Smith'] },
  { why: 'a game', texts: ['He plays Roblox for hours, my son is 9'], known: [] },
  { why: 'a game we have never heard of, because of the verb in front of it', texts: ['She keeps playing Prodigy, my daughter is 8'], known: [] },
  { why: 'an app called something', texts: ['There is an app called Yoto that she uses, she is 6'], known: [] },
  { why: 'a teacher', texts: ['Miss Davies says my son is tired every morning'], known: [] },
  { why: 'a day of the week at the start of a sentence', texts: ['Monday is the worst, she cries getting ready'], known: [] },
  { why: 'a month', texts: ['Since September my daughter has been up late'], known: [] },
  { why: 'a place', texts: ['We moved to London and my son will not settle'], known: [] },
  { why: 'a grandparent', texts: ['Nan lets him have her phone, he is 7'], known: [] },
  { why: 'a word the parent also wrote in lower case', texts: ['Football is all he talks about, he plays football every day'], known: [] },
  { why: 'a name with no family cue anywhere near it', texts: ['Barnaby Road is where the school is'], known: [] },
  { why: 'nothing at all', texts: [''], known: [] },
  { why: 'DiGi itself', texts: ['DiGi said my daughter is old enough, she is 10'], known: [] },
  { why: 'a sentence about screens with no name in it', texts: ['she is 9 and will not come off the tablet in the mornings'], known: [] },
]

const problems = []

for (const c of FIRES) {
  const got = newNamesIn(c.texts, c.known)
  const same = got.length === c.want.length && got.every((g, i) => g === c.want[i])
  if (!same) problems.push(`MISSED   ${c.why}\n           wanted [${c.want.join(', ')}], got [${got.join(', ')}]`)
}

for (const c of NEVER) {
  const got = newNamesIn(c.texts, c.known)
  if (got.length > 0) problems.push(`WRONG    ${c.why}\n           offered [${got.join(', ')}] and should have offered nothing`)
}

// The offer has to reach the form that already exists, with the name in it.
const href = addChildHref('Olga')
if (href !== '/dashboard/quests?add_child=Olga') {
  problems.push(`LINK     addChildHref points at "${href}". QuestManager reads ?add_child= to open its add child form with the name filled in.`)
}
if (addChildHref('Mary Jane') !== '/dashboard/quests?add_child=Mary%20Jane') {
  problems.push('LINK     addChildHref does not encode a name with a space, which would break the link.')
}

if (problems.length > 0) {
  console.error('check-new-name FAILED\n')
  for (const p of problems) console.error(`  ${p}\n`)
  console.error('Loosening a rule to pass one case is how this ends up offering to add Minecraft as a child.')
  process.exit(1)
}
console.log(`check-new-name ok: ${FIRES.length} names offered, ${NEVER.length} left alone.`)
