import { readFileSync } from 'node:fs'

// THE SCHOOL TO HOME BRIDGE, AND THE PROMISES AROUND IT.
//
// Built 16 September 2026 with the per child passport work
// (plans/2026-09-16-per-child-passport-plan.md). Five rules, each one a
// thing that would fail quietly rather than loudly.
//
// Quiet is the word that matters. A missing QR still prints a sheet, a
// price on the supplies page still renders, a second copy of the zine fold
// still folds until the day the two copies disagree. None of those break a
// build, and all of them cost a real thing: a family who never arrives, a
// promise to a school we cannot keep, thirty ruined sheets in a classroom.

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')

let failed = 0
const ok = (name, detail = '') => console.log(`PASS  ${name}${detail ? `  ${detail}` : ''}`)
const bad = (name, why) => { failed++; console.log(`FAIL  ${name}\n      ${why}`) }
const check = (name, cond, why) => cond ? ok(name) : bad(name, why)

// ── 1. The parent note carries BOTH doors ─────────────────────────────────
//
// The QR is for the parent with a phone and no account; the printed code is
// for the one who already has the app, and for the photocopy that smudged
// the QR. Losing either halves the bridge and nothing goes red.
for (const sheet of ['schools/app/print/[module]/page.tsx', 'schools/app/print/[module]/booklet/page.tsx']) {
  const src = read(sheet)
  const hasQr = /homeCodeQr\(/.test(src) && /dangerouslySetInnerHTML=\{\{ __html: qr \}\}/.test(src)
  const hasUrl = /homeCodeLabel\(homeCode\)/.test(src)
  const hasCode = /\{homeCode\}/.test(src)
  check(`${sheet.split('/').slice(-2).join('/')} prints the QR`, hasQr, 'the QR is the front door the code never had')
  check(`${sheet.split('/').slice(-2).join('/')} prints the URL`, hasUrl, 'a smudged QR still needs somewhere to type')
  check(`${sheet.split('/').slice(-2).join('/')} prints the code`, hasCode, 'a parent who already has the app just types it')
}

// ── 2. The QR points at a route that exists ───────────────────────────────
//
// A QR on thirty sheets in thirty book bags pointing at a 404 is the worst
// failure on this page, and the one nothing else would catch.
const qrSrc = read('schools/lib/qr.ts')
const m = qrSrc.match(/\/home-code\/\$\{shortHomeCode\(homeCode\)\}/g)
check('the QR points at /home-code/[code]', (m?.length ?? 0) >= 2,
  'homeCodeUrl and homeCodeLabel must both build the same path')
let landing = ''
try { landing = read('app/(marketing)/home-code/[code]/page.tsx') } catch { /* caught below */ }
check('the /home-code/[code] route exists', landing.length > 0,
  'the QR is printed on paper we cannot recall: this route can never be deleted')
check('the landing page normalises the code', /normaliseHomeCode\(/.test(landing),
  'a parent typing the code by hand gets the same forgiveness as the card')
check('the landing page is not indexed', /robots:\s*\{\s*index:\s*false/.test(landing),
  'a code on a sheet of paper does not belong in a search index')

// ── 3. /join keeps its one rule ───────────────────────────────────────────
//
// Non negotiable 9: every CTA on /join routes to /starter-pack. The code
// needed a signed out door and the tempting one was a query on /join.
check('the code does not ride in on /join', !/href=["'`]\/join/.test(landing),
  'the home code has its own route so that /join can keep routing to /starter-pack')

// ── 4. The supplies page quotes, it does not price ────────────────────────
//
// Justin, 16 September 2026: "yes build and quote form." There is no
// supplier and no landed cost, and a price on a school page is a promise
// finance will hold us to. This rule comes out the day a supplier is signed,
// deliberately, by a person who has decided to.
const supplies = read('schools/app/supplies/page.tsx') + read('schools/app/supplies/SupplyForm.tsx')
const priced = supplies.match(/£\s?\d/g)
check('the supplies page names no price', !priced,
  `found ${priced?.join(', ')}. There is no supplier and no landed cost yet, so a price here is a promise we cannot keep.`)
check('the supplies page asks for a quote', /Ask for a quote/.test(supplies),
  'the button says what actually happens: a person replies with a number')
const action = read('schools/app/supplies/actions.ts')
check('the supplies form does not demand a PO', !/if \(!poNumber\)/.test(action),
  'asking a teacher for a purchase order before we have given them a price is asking them to leave')
check('the supplies form asks for no pupil data', !/pupil_name|child_name|class_list/.test(action + supplies),
  'the box goes to the school office. The schools app holds no pupil data and the DPA is written on that.')

// ── 5. One fold, shared ───────────────────────────────────────────────────
//
// Both apps fold the same passport: the schools app prints the class edition
// of one page, the parents app the child's own book of five. Two copies of
// an imposition is two things that can drift, and a drifted imposition is
// thirty ruined sheets.
const zine = read('shared/zine.ts')
check('the imposition lives in shared', /export const ZINE_TOP/.test(zine) && /export const ZINE_BOTTOM/.test(zine),
  'shared/zine.ts is the one description of the fold')
const schoolsZine = read('schools/lib/passport-print.ts')
check('the schools app re-exports the shared fold', /export \{[^}]*ZINE_TOP[^}]*\} from '@gc\/shared\/zine'/.test(schoolsZine),
  'a second copy of the fold is a second thing that can drift')
const sheet = read('components/pathway/PassportZineSheet.tsx')
check('the parents app uses the shared fold', /from '@gc\/shared\/zine'/.test(sheet),
  'same fold, same sheet, one description')
check('the parents sheet takes props rather than reading', !/createClient|supabase/.test(sheet),
  'layout with no reads is what lets ref-passport-zine check the fiddly part without a login')

console.log(failed === 0 ? '\ncheck-passport-bridge: ok' : `\ncheck-passport-bridge: ${failed} failed`)
// ── 6. No surface promises a passport the code does not fill ──────────────
//
// Since 12 October (migration 373) a class lesson and the home code fill
// nothing: only the child's own short check at home fills a page, and the
// coverage the code writes is shown on no screen. The 24 November bridge
// audit found seven places still saying otherwise
// (plans/2026-11-24-school-home-bridge-audit.md). The QR rules above check
// the doors are printed; this one checks the words around them.
const PROMISE_FILES = [
  'schools/app/print/[module]/page.tsx',
  'schools/app/print/[module]/booklet/page.tsx',
  'schools/app/hub/passport/page.tsx',
  'schools/app/page.tsx',
  'schools/app/philosophy/page.tsx',
  'schools/app/lesson/[module]/page.tsx',
  'app/(marketing)/home-code/[code]/page.tsx',
  'components/lessons/SchoolCodeCard.tsx',
]
const FALSE_PROMISES = [
  [/earns? credit/i, 'a class lesson earns no passport credit'],
  [/lesson goes onto your child/i, 'the code puts nothing on the passport'],
  [/filled at home with the home code/i, 'the child\'s own check fills the page, not the code'],
  [/records? (that|it) .{0,70}passport/i, 'the code writes nothing onto the passport'],
  [/(is on|shows)[^.]{0,30}record/i, 'no screen shows the coverage the code writes'],
  [/passport record and notes/i, 'the note it writes is shown nowhere'],
]
for (const f of PROMISE_FILES) {
  const src = read(f)
  const hit = FALSE_PROMISES.find(([re]) => re.test(src))
  check(`${f.split('/').slice(-2).join('/')} promises only what the code does`, !hit,
    hit ? `${hit[1]} (matched ${hit[0]})` : '')
}

process.exit(failed === 0 ? 0 : 1)
