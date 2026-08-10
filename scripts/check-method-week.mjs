// The method week: does it hold together, and does it say anything we cannot
// stand behind?
//
// Justin, 10 August 2026: "emails to show this one week" about the timer, the
// offline balance, and jobs done equals device time.
//
// Two things are worth checking automatically, and they are the two that are
// easy to get wrong by hand and impossible to see by reading: the pacing, and
// the claims. A number in an email is a promise and a research name is a
// citation, so both get checked rather than trusted.
//
// It drives /dev/method-week rather than importing the templates, because node
// cannot resolve the extensionless imports the app uses, and because a check
// that reads the REAL render is worth more than one that reads a copy of it.
//
// Usage, with the app running on :3000
//   node scripts/check-method-week.mjs        (or BASE=http://localhost:3001)

import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3000'
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } })
const consoleErrors = []
page.on('pageerror', e => consoleErrors.push(e.message.slice(0, 120)))
await page.goto(`${BASE}/dev/method-week`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

// Pull each email back out of its frame as the text a parent actually reads.
const emails = await page.evaluate(() =>
  [...document.querySelectorAll('section[data-email]')].map(s => {
    const doc = s.querySelector('iframe')?.contentDocument
    return {
      key: s.getAttribute('data-email'),
      subject: s.querySelector('[data-subject]')?.textContent?.trim() ?? '',
      text: (doc?.body?.innerText ?? '').replace(/\s+/g, ' ').trim(),
      links: [...(doc?.querySelectorAll('a') ?? [])].map(a => a.getAttribute('href') ?? ''),
    }
  }))

check('four emails render', emails.length === 4, emails.map(e => e.key).join(', '))
check('nothing threw', consoleErrors.length === 0, consoleErrors.join(' | '))
check('each has a subject', emails.every(e => e.subject.length > 8))
check('each subject is distinct', new Set(emails.map(e => e.subject)).size === emails.length)
check('each has real body copy', emails.every(e => e.text.length > 600),
  emails.map(e => `${e.key}:${e.text.length}`).join(' '))

// ── The house rules ─────────────────────────────────────────────────────────
for (const e of emails) {
  check(`${e.key}: no dashes in the copy`, !/[-–—]/.test(e.text),
    (e.text.match(/.{0,30}[-–—].{0,30}/) ?? [''])[0])
}
check('every email names the child', emails.every(e => e.text.includes('Teo')))
check('no placeholder leaked through', emails.every(e => !/undefined|null|Your child/.test(e.text)))
check('each has one thing to do today', emails.every(e => /One thing to do today/.test(e.text)))
check('each carries the unsubscribe',
  emails.every(e => e.links.some(h => h.includes('example.com/unsubscribe'))))
check('each has a way into the app',
  emails.every(e => e.links.some(h => /\/dashboard/.test(h))))

// ── The claims ──────────────────────────────────────────────────────────────
//
// These four are about our own method, which we can describe without borrowing
// anybody's authority for it. So the rule they are held to is the strict one:
// cite nobody, quote no numbers, promise no outcomes.
const ALL = emails.map(e => e.text).join(' ')
check('no borrowed authority', !/\b(study|studies|research shows|scientists|according to)\b/i.test(ALL),
  (ALL.match(/.{0,40}(study|studies|research shows|scientists|according to).{0,40}/i) ?? [''])[0])
check('no statistics we cannot trace', !/\b\d{1,3}\s?%|\b\d+ per cent/i.test(ALL))
check('no promises about outcomes', !/\bwill (?:reduce|improve|stop|fix|cure)\b/i.test(ALL),
  (ALL.match(/.{0,40}will (?:reduce|improve|stop|fix|cure).{0,40}/i) ?? [''])[0])

// ── The four things Justin named all actually get taught ────────────────────
const by = k => emails.find(e => e.key === k)?.text ?? ''
check('the timer is taught', /timer/i.test(by('method-timer')))
check('jobs done equals device time is taught', /jobs done equals device time/i.test(by('method-earned')))
check('the offline half is taught', /offline|not a screen/i.test(by('method-offline')))
check('and the week is summed up', /what a week of this looks like/i.test(by('method-week')))

await browser.close()
console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
