#!/usr/bin/env node
// THE SCHOOL VERSION'S OWN MUST FIXES, HELD (sync plan F, 9 October 2026).
//
// A twelve lens panel read the schools teach, run and print routes against the
// 34 decks and found seven faults a school would meet on its first lesson. Each
// was fixed in one PR, and each is the kind that comes back quietly: a page
// that renders fine and says the wrong thing. So each gets one line here.
//
//   F1  The seventeen safeguarding flagged lessons open with the teacher script
//       folded and one teacher only screen first; every other lesson keeps it
//       open (the 13 September decision).
//   F2  The printed start and exit cards use the player's own shuffle, and the
//       answer key reads its letters off that same order. Evaluated, not read:
//       across all 34 decks no letter may carry more than half the answers.
//   F3  The parents page and the policy text never decide the sex education
//       question for the school, and the three lessons they name are real
//       modules mapped to the RSE block.
//   F4  The run sheet computes the core from the deck's extension marks and
//       never prints a promised 55.
//   F5  ks4-28 sits after ks4-15, the lesson it calls itself the sequel to.
//   F7  A look for line stored as a list renders as a list.
//   F8  A SEND note stored as plain text still renders a SEND card.
//
// No database, no browser. Runs in `npm run checkin-guard`, which CI calls.
import { readFileSync, readdirSync } from 'node:fs'
import { printedOptions } from '../shared/option-order.ts'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}
const read = f => readFileSync(f, 'utf8')

// ── F1 ──────────────────────────────────────────────────────────────────────
{
  const teach = read('schools/app/teach/[module]/page.tsx')
  const tracked = read('schools/components/tracker/TrackedPlayer.tsx')
  const gate = read('schools/components/tracker/BeforeSlideOne.tsx')
  const player = read('shared/components/LessonPlayer.tsx')
  ok('F1 the teach route reads the flag off FLAGGED_MODULES', /FLAGGED_MODULES\.some\(m => m\.moduleId === moduleId\)/.test(teach) && /flagged=\{flagged\}/.test(teach))
  ok('F1 the wrapper folds the script on exactly the flagged lessons', /scriptFolded=\{flagged\}/.test(tracked))
  ok('F1 the wrapper shows the before screen until the teacher starts', /if \(!started\) return <BeforeSlideOne/.test(tracked))
  ok('F1 the player starts the script from the prop, open by default',
    /scriptFolded = false,/.test(player) && /useState\(!scriptFolded\)/.test(player),
    'the 13 September decision keeps it open on every lesson that is not flagged')
  for (const [what, re] of [['the lead', /Your safeguarding lead/], ['the quiet exit', /The quiet exit/], ['the fold', /Your script is folded/]]) {
    ok(`F1 the before screen names ${what}`, re.test(gate))
  }
}

// ── F2 ──────────────────────────────────────────────────────────────────────
{
  const pack = read('schools/app/print/[module]/page.tsx')
  ok('F2 the pack prints cards through printedOptions', /printedOptions\(moduleId, slides\.indexOf\(c\)/.test(pack))
  ok('F2 no card maps its authored options directly',
    !/\(startCard\.options \?\? \[\]\)\.map/.test(pack) && !/\(c\.options \?\? \[\]\)\.map/.test(pack),
    'authored order put the right answer at A on 57 of 68 exit questions')
  ok('F2 the card key prints', /data-card-key/.test(pack) && /Answer: \{k\.answer\}/.test(pack))
  // One shuffle for the board and the paper. A second copy in the player
  // could drift, and the key would then letter a card the board never deals.
  const player = read('shared/components/LessonPlayer.tsx')
  ok('F2 the player and the paper share one shuffle',
    /import \{ optionOrder \} from '\.\.\/option-order'/.test(player) && !/function optionOrder\(/.test(player),
    'import optionOrder from shared/option-order.ts rather than keeping a copy')

  const tally = {}
  let n = 0
  for (const f of readdirSync('content/modules').filter(x => x.endsWith('.json'))) {
    const m = JSON.parse(read(`content/modules/${f}`))
    const choices = m.slides.map((s, i) => ({ s, i })).filter(x => x.s.type === 'choice')
    for (const { s, i } of choices.slice(-2)) {
      const { answer } = printedOptions(m.module_id, i, s.options ?? [])
      tally[answer] = (tally[answer] ?? 0) + 1
      n += 1
    }
  }
  const top = Math.max(...Object.values(tally))
  ok('F2 no printed letter carries more than half the exit answers', top * 2 <= n, JSON.stringify(tally))
}

// ── F3 ──────────────────────────────────────────────────────────────────────
{
  const parents = read('schools/app/hub/parents/page.tsx')
  const policy = read('schools/app/hub/policy/page.tsx')
  const rse = read('schools/lib/rse.ts')
  const manifest = read('shared/schools-curriculum.ts')
  const rshe = read('shared/schools-rshe-2026.ts')
  const decides = /(does not|do not|never) (teach|deliver|cover)[^.]{0,40}sex education|sex education[^.]{0,40}which this programme does not/i
  ok('F3 the parents page does not settle the sex education question', !decides.test(parents))
  ok('F3 the policy text does not settle it either', !decides.test(policy))
  ok('F3 both name the lessons from one list', /RSE_MODULES/.test(parents) && /RSE_MODULES/.test(policy))
  const ids = [...(rse.match(/RSE_MODULE_IDS = \[([^\]]*)\]/) || [, ''])[1].matchAll(/'([^']+)'/g)].map(x => x[1])
  ok('F3 three lessons are named', ids.length === 3, ids.join(', '))
  const rseBlock = rshe.split(/\n  \{\n/).filter(b => /block: 'Relationships and sex education'/.test(b)).join('\n')
  for (const id of ids) {
    ok(`F3 ${id} is a real module`, manifest.includes(`moduleId: '${id}'`))
    ok(`F3 ${id} maps to the RSE block`, rseBlock.includes(`'${id}'`))
  }
  ok('F3 the run sheet sends the parent note before those three', /isRseModule\(lesson\.module_id\)/.test(read('schools/app/lesson/[module]/run/page.tsx')))
}

// ── F4 ──────────────────────────────────────────────────────────────────────
{
  const run = read('schools/app/lesson/[module]/run/page.tsx')
  ok('F4 the core is computed from the deck', /\.filter\(r => r\.slide\.extension\)/.test(run) && /const coreMinutes = totalMinutes - /.test(run))
  ok('F4 the run sheet never promises 55', !/\b55\b/.test(run.replace(/^\s*\/\/.*$/gm, '')))
  ok('F4 check-lesson-core rides a script CI runs', /check-lesson-core\.mjs/.test(JSON.parse(read('package.json')).scripts['checkin-guard']))
}

// ── F5 ──────────────────────────────────────────────────────────────────────
{
  const manifest = read('shared/schools-curriculum.ts')
  const at = id => manifest.indexOf(`moduleId: '${id}'`)
  ok('F5 ks4-28 comes after ks4-15', at('ks4-15-manipulation-persuasion') > -1 && at('ks4-28-the-money-and-the-odds') > at('ks4-15-manipulation-persuasion'),
    'ks4-28 calls itself the direct sequel to manipulation and persuasion')
}

// ── F7 and F8 ───────────────────────────────────────────────────────────────
{
  const player = read('shared/components/LessonPlayer.tsx')
  ok('F7 the talk task reads look for lines as a list', /const lookFor = lookForLines\(slide\.lookFor as unknown\)/.test(player) && /data-look-for-list/.test(player))
  const lesson = read('schools/app/lesson/[module]/page.tsx')
  ok('F8 a plain text SEND note renders', /typeof notes\.send === 'string'/.test(lesson) && /\{sendText && <p/.test(lesson))
}

console.log(failed
  ? `\ncheck-schools-must-fixes: ${failed} failing`
  : 'check-schools-must-fixes: the flagged fold, the print shuffle, the RSE wording, the core minutes, the KS4 order, the look for lists and the SEND text all hold.')
process.exit(failed ? 1 : 0)
