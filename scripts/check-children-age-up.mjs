// Every child is created with a birthday, so every child gets older.
//
// Justin, 11 September 2026: "second child needs to age up", and then, after
// the parity sweep found two more: "run checks that everything wired for the
// first child is working for multiple children".
//
// THE FAULT, STATED ONCE. app/api/cron/age-up selects children with
// `.not('date_of_birth', 'is', null)`. A child created with an age BAND and no
// birthday is invisible to it for ever. They sit on the band their parent
// picked while the product moves on around them: wrong lessons, wrong stamps,
// wrong screen guide, wrong contract. On a product whose whole promise is a
// pathway from 4 to 16, that child never walks it.
//
// It was in FOUR separate places, because there are four ways to create a
// child and each was written at a different time: the starter pack (correct
// since August), the setup card, the Quests page, and the onboarding wizard
// with its siblings. Three of the four were wrong. That is not a bug, it is a
// shape, and a shape comes back unless something watches for it.
//
// So: every insert into `children` carries date_of_birth. No exceptions, and
// a new way to add a child fails here on the day it is written rather than on
// the day a parent notices their second child is still eleven.

import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const fails = []
const ok = []

function code(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .map(l => (l.trim().startsWith('//') ? '' : l))
    .join('\n')
}

// ── 1. Every insert into children carries a birthday ───────────────────────
//
// Found by grep rather than a fixed list, so a FIFTH way to add a child is
// caught the moment it is written. That is the whole point: a list would have
// had three correct entries and no idea the other three existed.
const files = execSync(
  `grep -rl "from('children')" --include=*.ts --include=*.tsx app lib components || true`,
  { encoding: 'utf8' },
).split('\n').filter(Boolean)

let inserts = 0
for (const file of files) {
  const src = code(readFileSync(file, 'utf8'))
  // Each .from('children').insert( ... ) and the object it is given.
  const re = /\.from\('children'\)\s*\.insert\(/g
  let m
  while ((m = re.exec(src)) !== null) {
    inserts++
    // Read to the matching close, so a multi row insert is covered too.
    let depth = 1
    let i = m.index + m[0].length
    while (i < src.length && depth > 0) {
      if (src[i] === '(') depth++
      else if (src[i] === ')') depth--
      i++
    }
    let body = src.slice(m.index, i)

    // An insert is often handed a variable built further up
    // (`.insert(rows)`), and the fields are in that variable, not in the call.
    // Reading only the call would flag every one of those as missing a
    // birthday, which is the first thing this guard did. So when the argument
    // is a bare name, follow it back to where it was built and read that
    // instead. A guard that cries wolf gets switched off, and then it is worth
    // less than nothing.
    const arg = body.slice(body.indexOf('.insert(') + 8, -1).trim()
    if (/^[A-Za-z_$][\w$]*$/.test(arg)) {
      const decl = src.lastIndexOf(`const ${arg} =`, m.index)
      if (decl === -1) {
        const line = src.slice(0, m.index).split('\n').length
        fails.push(`${file}:${line} inserts a child from \`${arg}\`, which this guard cannot find the construction of. Build the rows inline, or name the variable somewhere it can be followed, so the birthday can be checked.`)
        continue
      }
      body = src.slice(decl, i)
    }

    if (!/date_of_birth/.test(body)) {
      const line = src.slice(0, m.index).split('\n').length
      fails.push(`${file}:${line} inserts a child with no date_of_birth. The age up cron selects on that column, so this child would never move up a band. Ask for a birthday (components/children/BirthdayFields) and derive the band from it.`)
    }
  }
}
if (inserts === 0) {
  fails.push('No child inserts found at all. Either the table was renamed or this guard has stopped looking in the right place, and a guard that checks nothing passes everything.')
} else if (!fails.length) {
  ok.push(`all ${inserts} places that create a child store a birthday`)
}

// ── 1b. AND EVERY FORM THAT ASKS THE API TO CREATE ONE SENDS IT ───────────
//
// The direct inserts are only half the ways in. The setup card and the Quests
// page do not touch the table: they POST { action: 'child' } to /api/quests and
// it inserts for them. Check 1 cannot see those at all, which mutation testing
// proved by deleting the birthday from the setup card and watching this guard
// stay green.
//
// The endpoint still accepts a bare age_band, deliberately, so older callers
// keep working. That tolerance is exactly what makes a form quietly dropping
// the birthday survive: it does not error, it just creates a child who never
// grows up. So the forms are checked too.
const posters = execSync(
  `grep -rl "action: 'child'" --include=*.ts --include=*.tsx app components || true`,
  { encoding: 'utf8' },
).split('\n').filter(Boolean).filter(f => !f.includes('api/quests/route.ts'))

if (posters.length === 0) {
  fails.push("No form was found posting action: 'child'. Either they were renamed or this guard has stopped looking where the forms live.")
} else {
  for (const file of posters) {
    const src = code(readFileSync(file, 'utf8'))
    if (!/date_of_birth/.test(src)) {
      fails.push(`${file} asks the API to create a child without sending date_of_birth. The endpoint will accept it and store a child with no birthday, who then never ages up.`)
    }
  }
  if (!fails.length) ok.push(`all ${posters.length} forms that ask the API to create a child send a birthday`)
}

// ── 2. The band is derived from the birthday, not trusted from the wire ────
const quests = code(readFileSync('app/api/quests/route.ts', 'utf8'))
if (!/bandForAge\(dob\)/.test(quests)) {
  fails.push('/api/quests no longer derives the age band from the birthday. A band sent by a client and a birthday stored beside it are two answers to one question, and they drift the moment a child has a birthday.')
} else {
  ok.push('the add child endpoint derives the band from the birthday it stores')
}

// ── 3. The cron still sweeps every child, not just the first ───────────────
const cron = code(readFileSync('app/api/cron/age-up/route.ts', 'utf8'))
if (/is_primary/.test(cron)) {
  fails.push('The age up cron now filters on is_primary. It exists precisely to move EVERY child up, and a filter here is how the second child stops ageing again.')
} else if (!/date_of_birth/.test(cron)) {
  fails.push('The age up cron no longer reads date_of_birth, so nothing decides when a child moves up a band.')
} else {
  ok.push('the age up cron still sweeps every child on the account')
}

for (const line of ok) console.log(`PASS  ${line}`)
if (fails.length) {
  console.error('')
  for (const f of fails) console.error(`FAIL  ${f}`)
  process.exit(1)
}
console.log('\nall passed')
