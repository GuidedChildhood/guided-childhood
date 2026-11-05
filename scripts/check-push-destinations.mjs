// Every reminder opens the part of the app it is about (lib/push/destination.ts,
// Justin 5 November 2026). This holds the map to real reminder wording, and
// every page it can open to a page that exists.
//   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-push-destinations.mjs
import { existsSync, readFileSync } from 'node:fs'
import { destinationFor, reminderBody } from '../lib/push/destination.ts'

let failures = 0
const check = (name, ok, detail = '') => { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`) }

const cases = [
  ['Homework for Teo at five', '/dashboard/homework'],
  ['Check Ava has done her spellings', '/dashboard/homework'],
  ['Times tables practice', '/dashboard/homework'],
  ['PE kit in the bag', '/dashboard/school'],
  ['School trip money', '/dashboard/school'],
  ['Start the wind down', '/dashboard/tonight'],
  ['Phone downstairs to charge', '/dashboard/tonight'],
  ['Tablet off at six', '/dashboard/quests/timer'],
  ['Approve the jobs and stars', '/dashboard/quests'],
  ['Do the check in', '/dashboard/checkin'],
  ['Read the family agreement together', '/dashboard/agreement'],
  ['Ring Grandma', '/dashboard/digi'],
]
for (const [text, want] of cases) {
  const got = destinationFor(text).href
  check(`"${text}" opens ${want}`, got === want, got === want ? '' : `got ${got}`)
}
check('a child id rides along', destinationFor('homework', 'abc').href === '/dashboard/homework?child=abc')
check('DiGi stays unscoped', destinationFor('Ring Grandma', 'abc').href === '/dashboard/digi')

const src = readFileSync('lib/push/destination.ts', 'utf8')
const hrefs = [...src.matchAll(/href: '(\/dashboard[^']*)'/g)].map(m => m[1])
for (const h of new Set(hrefs)) check(`${h} is a real page`, existsSync(`app/(dashboard)${h}/page.tsx`))

const body = reminderBody('Homework for Teo at five', destinationFor('homework'))
check('the body says where the tap goes', body.endsWith('Tap to open the homework helper.'), body)
check('a long reminder stays push length', reminderBody('x '.repeat(200), destinationFor('homework')).length <= 170)
const labels = [...src.matchAll(/label: '([^']*)'/g), ...src.matchAll(/label: "([^"]*)"/g)].map(m => m[1]).join(' ')
check('no dashes in the labels', labels.length > 0 && !/[–—]|\s-\s/.test(labels))

const cron = readFileSync('app/api/cron/digi-reminders/route.ts', 'utf8')
check('the reminders cron uses the map for the push and the card', /url: dest\.href/.test(cron) && /href: dest\.href/.test(cron))

console.log(failures ? `\n${failures} failing` : '\npush destinations hold')
process.exit(failures ? 1 : 0)
