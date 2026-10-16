// The concern loop: a worry a parent names reaches its words, and tonight's
// step fits the worry.
//
// Review board, 13 October 2026 (first-phone-worry-gets-its-words). The ledger
// slugs onboarding and the check in write had never been in the category
// table, so phones-and-messaging and seen-something scored null and a parent
// at really tough was offered no Get the words button, and controller-fights
// landed on packed lunch scripts. Separately the first phone worry shared the
// bedtime Tonight step, so a child with no phone was sent to bed without one.
//
// What this holds:
//   A. Every concern slug the product writes for a named worry has an EXACT
//      category, not a keyword guess: LABEL, the onboarding map, the typed
//      worry matcher and the device issues table.
//   B. Where the device issues table names a category for a slug, the two
//      tables agree, so the issue card and the Get the words button open the
//      same shelf.
//   C. The first phone worry gets its own step when the child has no phone,
//      with the phone plan script, the ladder and the agreement, and keeps the
//      bedtime step when they do.
//   D. The phone plan script and the agreement printable are real.
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-concern-loop.mjs

import { readFileSync } from 'node:fs'
import { CONCERN_TO_CATEGORY, categoryForConcern } from '../lib/content/signal-map.ts'
import { LABEL, ONBOARDING_TO_SLUG } from '../lib/concerns/worry-map.ts'
import { DEVICE_ISSUES } from '../lib/content/device-issues.ts'
import { tonightFor, PHONE_PLAN_SCRIPT, PHONE_LADDER_HREF, PHONE_AGREEMENT_HREF } from '../lib/pathway/tonight.ts'
import { scriptTitles } from './lib/script-titles.mjs'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const CATEGORIES = new Set(['screen-time', 'social-media', 'gaming', 'staying-safe', 'mood-confidence', 'family-rules', 'school-and-ai', 'everyday-routines'])

// ── A. Every ledger slug has an exact category ──────────────────────────────
const normaliseSrc = readFileSync(new URL('../lib/concerns/normalise.ts', import.meta.url), 'utf8')
const typedSlugs = [...normaliseSrc.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map(m => m[1])
const issueSlugs = DEVICE_ISSUES.map(i => i.proof.concernSlug).filter(Boolean)
const slugs = [...new Set([...Object.keys(LABEL), ...Object.values(ONBOARDING_TO_SLUG), ...typedSlugs, ...issueSlugs])]
check('found the ledger vocabulary', slugs.length >= 9, `${slugs.length} slugs`)
for (const slug of slugs) {
  const cat = CONCERN_TO_CATEGORY[slug]
  check(`${slug} has an exact category`, !!cat && CATEGORIES.has(cat), `got ${cat ?? 'nothing'}`)
}

// The three the board named, pinned.
check('phones-and-messaging leads to the family deal', categoryForConcern('phones-and-messaging', 'Phones and messaging') === 'family-rules')
check('seen-something leads to staying safe', categoryForConcern('seen-something', 'What they come across online') === 'staying-safe')
check('controller-fights leads to gaming, not routines', categoryForConcern('controller-fights', 'Controller fights') === 'gaming')

// ── B. The two tables agree ─────────────────────────────────────────────────
for (const issue of DEVICE_ISSUES) {
  const slug = issue.proof.concernSlug
  if (!slug) continue
  check(`${issue.key}: ${slug} opens the ${issue.proof.category} shelf in both tables`,
    CONCERN_TO_CATEGORY[slug] === issue.proof.category, `signal map says ${CONCERN_TO_CATEGORY[slug]}`)
}

// ── C. The first phone gets its own step ────────────────────────────────────
const base = { childName: 'Maya', bedtimeStartMin: 1200, deviceTrust: 'ask', blocksScreensJob: null, scriptHref: '/dashboard/scripts?child=c', timerHref: '/dashboard/quests/timer?child=c' }
const noPhone = tonightFor({ ...base, slug: 'phones-and-messaging', hasOwnPhone: false, wordsHref: '/dashboard/scripts/9653?child=c' })
check('no phone yet: the step is the first phone, not phones to bed', noPhone?.key === 'phone' && noPhone.label === 'The first phone', `${noPhone?.key} ${noPhone?.label}`)
check('and it never mentions a bedroom or charging tonight', !/bedroom|charges outside/i.test(noPhone?.line ?? ''), noPhone?.line)
check('and it is never a flat no', /never a flat no/.test(noPhone?.line ?? ''))
check('Read the words opens the phone plan script', noPhone?.href === '/dashboard/scripts/9653?child=c' && noPhone.hrefLabel === 'Read the words', noPhone?.href)
check('the ladder and the agreement sit under it',
  noPhone?.more?.some(m => m.href === PHONE_LADDER_HREF) && noPhone?.more?.some(m => m.href === PHONE_AGREEMENT_HREF))
const fallback = tonightFor({ ...base, slug: 'phones-and-messaging', hasOwnPhone: false, wordsHref: null })
check('a missing script row falls back to a real shelf, not nothing', fallback?.href === base.scriptHref, fallback?.href)
const hasPhone = tonightFor({ ...base, slug: 'phones-and-messaging', hasOwnPhone: true })
check('a child with their own phone keeps the bedtime step', hasPhone?.key === 'bedtime', hasPhone?.key)
check('bedtime screens is untouched', tonightFor({ ...base, slug: 'bedtime-screens' })?.key === 'bedtime')

const route = readFileSync(new URL('../app/api/daily/tonight/route.ts', import.meta.url), 'utf8')
check('the one tap accepts the phone step', /MECHANISMS = new Set\([^)]*'phone'/.test(route))
const page = readFileSync(new URL('../app/(dashboard)/dashboard/tonight/page.tsx', import.meta.url), 'utf8')
check('the Tonight page has an icon for it and shows the extra links', /phone: 'phone'/.test(page) && /plan\.more/.test(page))

// ── D. The things it points at are real ─────────────────────────────────────
const titles = scriptTitles()
const plan = titles.find(t => t.title === PHONE_PLAN_SCRIPT)
check('the phone plan script is a seeded row', !!plan, PHONE_PLAN_SCRIPT)
check('and it is a family rules script', plan?.category === 'family-rules', plan?.category)
const registry = readFileSync(new URL('../lib/printables/registry.ts', import.meta.url), 'utf8')
check('the family phone agreement is a printable', /key: 'family-phone-agreement'/.test(registry))
const printablesPage = readFileSync(new URL('../app/(dashboard)/dashboard/printables/page.tsx', import.meta.url), 'utf8')
check('and its card carries the id the link lands on', /id=\{p\.key\}/.test(printablesPage))
const phoneSetup = readFileSync(new URL('../app/(dashboard)/dashboard/phone-setup/page.tsx', import.meta.url), 'utf8')
check('the phone ladder is on the phone setup page', /PHONE_LADDER/.test(phoneSetup))

// ── E. The Tonight tap closes the loop (tonight-tap-closes-loop) ────────────
//
// The tap writes one linked event against the worry the page showed, the
// ledger accepts it, What is working can say it, and Read the words opens
// that worry's own script rather than the whole index.
const migration = (() => { try { return readFileSync(new URL('../supabase/migrations/380_a_tonight_tap_joins_the_ledger.sql', import.meta.url), 'utf8') } catch { return '' } })()
check('migration 380 lets the ledger hold a tried event', /concern_events_event_check[\s\S]*'tried'/.test(migration))
check('and a tonight link', /concern_events_linked_type_check[\s\S]*'tonight'/.test(migration))
const events = readFileSync(new URL('../lib/concerns/events.ts', import.meta.url), 'utf8')
check('the event writer knows both', /\| 'tried'/.test(events) && /ConcernLinkType = [^\n]*'tonight'/.test(events))
check('the tap writes it, once a day, against the page\'s own worry',
  /ignoreDuplicates: true/.test(route) && /readTopConcern/.test(route) && /event: 'tried'[^\n]*linkedType: 'tonight'/.test(route))
check('and a tried event never carries a score', !/event: 'tried'[^\n}]*score/.test(route))
const { usedWords } = await import('../lib/working/movement.ts')
check('What is working can name it', usedWords('tonight') === "tonight's step", usedWords('tonight'))

const { pickTopConcern, worryScriptTitles } = await import('../lib/pathway/tonight.ts')
check('the top worry is open before improving, then the most flagged',
  pickTopConcern([
    { id: 'a', status: 'improving', times_flagged: 9 },
    { id: 'b', status: 'open', times_flagged: 1 },
    { id: 'c', status: 'open', times_flagged: 4 },
  ])?.id === 'c')
const seeded = new Set(titles.map(t => t.title))
for (const slug of [...new Set(issueSlugs)]) {
  const list = worryScriptTitles(slug, '8-10')
  check(`${slug} has words to open, and the first is a real row`, list.length > 0 && seeded.has(list[0]), list[0])
}
const moodYoung = worryScriptTitles('mood-after-screens', '8-10')[0]
const moodOlder = worryScriptTitles('mood-after-screens', '13-15')[0]
check('the age decides which script leads', moodYoung !== moodOlder, `${moodYoung} / ${moodOlder}`)
const words = tonightFor({ ...base, slug: 'mood-after-screens', wordsHref: '/dashboard/scripts/412?child=c' })
check('Read the words opens the worry\'s script, not the index', words?.href === '/dashboard/scripts/412?child=c', words?.href)
const morning = tonightFor({ ...base, slug: 'morning-tv', wordsHref: '/dashboard/scripts/77?child=c' })
check('the morning step too', morning?.href === '/dashboard/scripts/77?child=c', morning?.href)
const other = tonightFor({ ...base, slug: 'social-media', wordsHref: '/dashboard/scripts/category/social-media?child=c' })
check('a worry with no issue opens its shelf', other?.href === '/dashboard/scripts/category/social-media?child=c', other?.href)
const timer = tonightFor({ ...base, slug: 'wont-put-down', wordsHref: '/dashboard/scripts/1?child=c' })
check('a timer step still opens the timer', timer?.href === base.timerHref, timer?.href)

console.log(failures ? `\n${failures} failed` : '\nall passed')
process.exit(failures ? 1 : 0)
