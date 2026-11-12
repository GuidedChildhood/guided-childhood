#!/usr/bin/env node
// THE SCHOOL'S RECORD GUARD (10 November 2026).
//
// schools.lesson_records (migration 391) is the first thing the schools app
// has ever stored about a lesson being taught. It rests on three promises, and
// each of them fails silently if it breaks, so each is held here with no
// database and no browser:
//
//   1. NO SCHOOL FROM THE BROWSER. The actions derive the school from the
//      signed cookie. Nothing a caller sends can name a school, so one school
//      cannot read or write another's record.
//   2. NO PUPIL, EVER. A class is a short label, a level is a count, a note is
//      280 characters. The rules that enforce that are pure, and are run here.
//   3. THE TABLE IS UNREACHABLE EXCEPT THROUGH THE SERVER. Row level security
//      on, nothing granted to anon or authenticated, no policy for either.
//
// It also holds the sums a head reads: a lesson counted once however often it
// was taught, and a class's level counts never added to themselves.
//
// Run: node --experimental-strip-types scripts/check-lesson-records.mjs
import { readdirSync, readFileSync } from 'node:fs'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}
const read = p => readFileSync(p, 'utf8')
const code = src => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// 1. No school from the browser.
const actions = code(read('schools/app/records/actions.ts'))
const lib = code(read('schools/lib/records.ts'))
ok('the actions file is a server file', /^\s*'use server'/.test(read('schools/app/records/actions.ts')))
for (const name of ['lessonRecord', 'markDelivered', 'assessDelivery', 'undoDelivery']) {
  const m = actions.match(new RegExp(`export async function ${name}\\(input: \\{([^}]*)\\}`))
  ok(`${name} exists`, !!m)
  ok(`${name} takes no school from its caller`, !!m && !/school|ref\b/i.test(m[1]), 'the school is read from the signed cookie, never from an argument')
}
for (const name of ['markDelivered', 'assessDelivery', 'undoDelivery']) {
  const body = actions.split(`export async function ${name}(`)[1]?.split('\nexport async function ')[0] ?? ''
  ok(`${name} asks who the school is before it touches the table`,
    body.indexOf('await recordsSchool(') > -1 && body.indexOf('await recordsSchool(') < (body.indexOf('recordsDb.from(') === -1 ? Infinity : body.indexOf('recordsDb.from(')))
  ok(`${name} stops when there is no school`, /if \(!ref\) return \{ ok: false, error: NO_SCHOOL \}/.test(body))
}
ok('every update is narrowed to the school that owns the row',
  (actions.match(/recordsDb\.from\('lesson_records'\)\s*\.update\(/g) ?? []).length === 2
  && (actions.match(/recordsDb\.from\('lesson_records'\)\s*\.update\([^\n]*\n\s*\.eq\('id', before\.id\)\.eq\('school_ref', ref\)/g) ?? []).length === 2)
ok('a single record is only ever read with its school', /\.eq\('id', id\)\.eq\('school_ref', ref\)/.test(lib))
ok('a list is only ever read with its school', /\.eq\('school_ref', ref\)\.eq\('subject', subject\)/.test(lib))
ok('the school is derived from the verified cookie', /tokenAccess\(token\)/.test(lib) && /languagesTokenAccess\(token\)/.test(lib))
ok('the record button never sends a school',
  !/school_ref|schoolRef/.test(code(read('schools/components/records/RecordLesson.tsx'))))
ok('the server client is not imported by the record button',
  !/server-db|lib\/records'/.test(read('schools/components/records/RecordLesson.tsx')))

// 3. The table.
const sql = read('supabase/migrations/391_lesson_records.sql').replace(/--[^\n]*/g, '')
for (const t of ['lesson_records', 'lesson_record_events']) {
  ok(`${t} has row level security on`, new RegExp(`alter table schools\\.${t} enable row level security`).test(sql))
  ok(`${t} is revoked from anon and authenticated`, new RegExp(`revoke all on schools\\.${t} from anon, authenticated`).test(sql))
  ok(`${t} grants nothing to anon or authenticated`, !new RegExp(`grant[^;]*on schools\\.${t} to[^;]*(anon|authenticated)`).test(sql))
}
ok('no policy opens the tables to a browser role', !/create policy/i.test(sql))
ok('the events table cannot be updated or deleted by the server role', /grant select, insert on schools\.lesson_record_events to service_role/.test(sql))
ok('a note is capped at 280 characters in the database', /note\s+text check \(note is null or length\(note\) <= 280\)/.test(sql))

// 2. The rules, run.
const R = await import('../shared/lesson-records.ts')
const d = iso => new Date(`${iso}T12:00:00Z`)
ok('the academic year runs September to August',
  R.academicYear(d('2026-11-10')) === '2026-27' && R.academicYear(d('2027-08-31')) === '2026-27' && R.academicYear(d('2027-09-01')) === '2027-28')
ok('a class is a short label in capitals', R.cleanGroup(' 4b ') === '4B' && R.cleanGroup('year  5') === 'YEAR 5' && R.cleanGroup('Maple') === 'MAPLE')
ok('a class label cannot carry punctuation or run long',
  R.cleanGroup("Mrs O'Brien's class") === null && R.cleanGroup('a'.repeat(17)) === null && R.cleanGroup('') === null && R.cleanGroup('4B; drop') === null)
ok('two classes together are two labels, once each', JSON.stringify(R.cleanGroups('6b, 6C, 6B')) === '["6B","6C"]')
ok('no class is no record, and thirteen is too many', R.cleanGroups('') === null && R.cleanGroups([]) === null && R.cleanGroups(Array.from({ length: 13 }, (_, i) => `C${i}`)) === null)
ok('one bad label refuses the whole list', R.cleanGroups(['4B', 'Tom S.']) === null)
ok('year groups are read from the label where it says',
  JSON.stringify(R.yearGroupsOf(['6B', 'YEAR 5', 'Y4 OAK', 'MAPLE', 'RECEPTION'])) === '[0,4,5,6]')
ok('a level is three whole counts for a statement the lesson names',
  JSON.stringify(R.cleanLevels({ S1: { s3: '4', s4: 20, s5: 6 }, X9: { s3: 1, s4: 1, s5: 1 } }, ['S1', 'R1'])) === '{"S1":{"s3":4,"s4":20,"s5":6}}')
ok('a level cannot be a name, a fraction, a negative or a crowd',
  Object.keys(R.cleanLevels({ S1: { s3: 'Tom', s4: 1, s5: 1 }, R1: { s3: 1.5, s4: 1, s5: 1 }, W1: { s3: -1, s4: 1, s5: 1 }, L1: { s3: 100, s4: 100, s5: 1 } }, ['S1', 'R1', 'W1', 'L1'])).length === 0)
ok('a statement nobody was counted for is not recorded', Object.keys(R.cleanLevels({ S1: { s3: 0, s4: 0, s5: 0 } }, ['S1'])).length === 0)
ok('the share at SOLO 4 or above is the scheme\'s own sum', R.shareAtFourOrAbove({ s3: 4, s4: 20, s5: 6 }) === 87 && R.shareAtFourOrAbove({ s3: 0, s4: 0, s5: 0 }) === null)
ok('a judgement is one of three words', R.cleanJudgement('secure') === 'secure' && R.cleanJudgement('great') === null && R.cleanJudgement('not_assessed') === null)
ok('objective marks keep only real objectives and real judgements',
  JSON.stringify(R.cleanObjectiveMarks({ 0: 'secure', 1: 'excellent', 7: 'revisit' }, 3)) === '{"0":"secure"}')
ok('a note is one line of at most 280 characters', R.cleanNote('  two\n lines ') === 'two lines' && R.cleanNote('x'.repeat(400)).length === 280 && R.cleanNote('   ') === null)
ok('undo lasts ten minutes', R.canUndo('2026-11-10T10:00:00Z', new Date('2026-11-10T10:09:00Z')) && !R.canUndo('2026-11-10T10:00:00Z', new Date('2026-11-10T10:11:00Z')))
ok('a lesson cannot be recorded in the future or years back',
  R.cleanDeliveredOn('2026-11-09', d('2026-11-10')) === '2026-11-09' && R.cleanDeliveredOn('2026-11-11', d('2026-11-10')) === null && R.cleanDeliveredOn('2020-01-01', d('2026-11-10')) === null && R.cleanDeliveredOn('2026-02-31', d('2026-11-10')) === null)
ok('a French lesson key round trips', JSON.stringify(R.parseFrLessonKey(R.frLessonKey('y3-ht2', 5))) === '{"unitKey":"y3-ht2","n":5}' && R.parseFrLessonKey('y3-ht2') === null)

// The sums a head reads.
const row = (id, lessonKey, deliveredOn, groups, marks = {}) => ({ id, subject: 'fr', lessonKey, deliveredOn, academicYear: '2026-27', groups, assessment: 'not_assessed', marks, note: null, createdAt: `${deliveredOn}T10:00:00Z` })
const rows = [
  row('a', 'y3-ht2/1', '2026-11-03', ['3A']),
  row('b', 'y3-ht2/1', '2026-11-04', ['3A']),                                   // taught again
  row('c', 'y3-ht2/5', '2026-11-10', ['3A'], { S1: { s3: 10, s4: 15, s5: 5 } }),
  row('d', 'y3-ht2/6', '2026-11-17', ['3A'], { S1: { s3: 4, s4: 20, s5: 6 } }), // counted again, later
  row('e', 'y3-ht2/6', '2026-11-18', ['3B', '3C'], { S1: { s3: 20, s4: 30, s5: 10 } }), // two classes, one count
  row('f', 'y4-ht2/1', '2026-11-10', ['4B']),
]
ok('a lesson taught twice is one lesson delivered', R.deliveredLessons(R.forClass(rows, '3A')).size === 3)
ok('a lesson is dated from the first time it was taught', R.deliveredLessons(rows).get('y3-ht2/1') === '2026-11-03')
ok('classes are listed once, in order', JSON.stringify(R.classesIn(rows)) === '["3A","3B","3C","4B"]')
ok('one class never sees another class\'s lessons', R.deliveredLessons(R.forClass(rows, '4B')).size === 1)
const latest = R.latestLevels(R.forClass(rows, '3A'), 'y3-ht2', 'S1')
ok('a class\'s level is its latest count, not the sum of its counts', latest?.levels.s4 === 20 && latest?.on === '2026-11-17')
const both = R.latestLevels(rows, 'y3-ht2', 'S1')
ok('a count shared by two classes is added once', both?.levels.s3 === 4 + 20 && both?.levels.s4 === 20 + 30 && both?.levels.s5 === 6 + 10)
ok('a statement nobody counted has no level', R.latestLevels(rows, 'y3-ht2', 'R1') === null && R.latestLevels(rows, 'y4-ht2', 'S1') === null)

// WHAT GOOD LOOKS LIKE, ON EVERY LESSON (11 November 2026). The three
// judgement buttons each carry a line saying what that judgement looks like
// in this lesson. A lesson without them leaves a teacher guessing where the
// line is, which is the gap the progression review found on 33 of 37.
const lessonFiles = ['content/modules', 'content/standalone'].flatMap(d => readdirSync(d).filter(f => f.endsWith('.json')).map(f => `${d}/${f}`))
for (const f of lessonFiles) {
  const m = JSON.parse(read(f))
  const d = R.descriptorsOf(m.assessment)
  ok(`${m.module_id} says what secure, developing and needs revisiting look like`, !!d, 'assessment.teacher_judgement.descriptors needs all three lines')
  if (!d) continue
  ok(`${m.module_id} uses the one judgement scale`, JSON.stringify(m.assessment.teacher_judgement.scale) === '["secure","developing","revisit"]')
  for (const j of R.JUDGEMENTS) {
    const n = d[j].trim().split(/\s+/).length
    ok(`${m.module_id} ${j} descriptor is one line a teacher can read on a button`, n >= 6 && n <= 22, `${n} words`)
    ok(`${m.module_id} ${j} descriptor carries no dash`, !/[‐-―]| - /.test(d[j]))
  }
}
ok('a lesson with two descriptor lines shows none', R.descriptorsOf({ teacher_judgement: { descriptors: { secure: 'a', developing: 'b' } } }) === null)
ok('the older shape is still read', R.descriptorsOf({ teacher_judgement: { secure: 'a', developing: 'b', needs_support: 'c' } })?.revisit === 'c')

// The spreadsheet file: a note a teacher typed can never run as a formula.
ok('a cell that would open as a formula is made text', R.csvCell('=SUM(A1)') === "'=SUM(A1)" && R.csvCell('+44') === "'+44" && R.csvCell('@x') === "'@x")
ok('a comma or a quote is quoted', R.csvCell('Gaming: time, spend') === '"Gaming: time, spend"' && R.csvCell('say "no"') === '"say ""no"""')
ok('a year in the address is only ever one the school has', R.cleanYear('2025-26', ['2026-27', '2025-26']) === '2025-26' && R.cleanYear('1999-00', ['2026-27']) === null && R.cleanYear("x' or 1=1", ['2026-27']) === null)
for (const route of ['schools/app/hub/progress/export/route.ts', 'schools/app/languages/fr/progress/export/route.ts']) {
  const src = code(read(route))
  ok(`${route} reads the school from the cookie and takes none from the address`, /readDeliveries\(/.test(src) && !/school_ref|schoolRef/.test(src))
  ok(`${route} refuses a caller with no school`, /if \(!school\) return new Response\([^)]*status: 403/.test(src))
  ok(`${route} is never cached`, /no-store/.test(src))
}

// The quiz counts: three whole numbers, and a count can never exceed the room.
ok('quiz counts need the pupils and at least one count', R.cleanQuizCounts({ pupils: '30' }) === null && R.cleanQuizCounts({ starter: 4 }) === null)
ok('a count larger than the room is dropped', R.cleanQuizCounts({ pupils: 30, starter: 31, exit: 20 })?.starter === null && R.cleanQuizCounts({ pupils: 30, starter: 31 }) === null)
ok('quiz counts hold nothing but numbers', JSON.stringify(R.cleanQuizCounts({ pupils: '30', starter: '18', exit: '26', name: 'a child' })) === '{"pupils":30,"starter":18,"exit":26}')
ok('a room over 120 is not a class', R.cleanQuizCounts({ pupils: 500, exit: 3 }) === null)
const quizRows = [row('q1', 'ks2-04', '2026-11-03', ['6B'], { _quiz: { pupils: 30, starter: 15, exit: 27 } }), row('q2', 'ks2-05', '2026-11-10', ['6B'], { _quiz: { pupils: 20, starter: null, exit: 13 } }), row('q3', 'ks2-06', '2026-11-11', ['6B'])]
const shares = R.quizShares(quizRows)
ok('quiz shares are over the pupils counted for that quiz', shares.starter === 50 && shares.exit === 80 && shares.lessons === 2)
ok('the quiz counts do not read as a judgement by objective', Object.keys(R.cleanObjectiveMarks({ _quiz: { pupils: 3 }, 0: 'secure' }, 3)).join() === '0')

// The legal text has to say what the product now does.
const dpa = read('schools/lib/legal/dpa.ts'); const privacy = read('schools/lib/legal/privacy.ts')
ok('the DPA no longer says a lesson sends nothing to the server, full stop', !/the classroom player sends nothing to the server\.`/.test(dpa))
ok('the DPA names the lesson record', /The School's lesson record/.test(dpa) && /Mark lesson delivered/.test(dpa))
ok('the privacy notice names the lesson record', /Mark lesson delivered/.test(privacy) && !/The classroom player sends us nothing\. There is no record/.test(privacy))

if (failed) {
  console.error(`\n${failed} lesson record check${failed === 1 ? '' : 's'} failed.`)
  process.exit(1)
}
console.log('PASS  the school is read from the cookie, no pupil can be recorded, and the sums count lessons once')
