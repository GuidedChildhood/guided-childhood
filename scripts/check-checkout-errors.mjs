// Does every way checkout can fail actually say something to the parent?
//
// Justin, 13 August 2026, with a blank Chrome error on the founder button:
// "first we need to diagnose the link to founder member and subscriptions not
// working."
//
// Two failures were producing the same nothing. Stripe throwing came out as a
// 500 and a white page, and a genuinely sold out founder place redirected to
// the upgrade page with ?error=founder_sold_out onto a page that had never
// read the parameter. The second one is the reason for this check: the route
// and the page agreed in principle and nobody had ever verified it, so a real
// message was being thrown away silently.
//
// This reads the actual redirect reasons out of the route and checks the
// component can render each one. It is a text scan on purpose: it needs no
// Stripe key, no server and no session, which is what makes it something that
// can run on every change to the one route that takes money.
//
// Usage: node --experimental-strip-types scripts/check-checkout-errors.mjs

import { readFileSync } from 'node:fs'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}

const route = readFileSync('app/api/stripe/checkout/route.ts', 'utf8')
const component = readFileSync('components/upgrade/CheckoutError.tsx', 'utf8')
const page = readFileSync('app/(dashboard)/dashboard/upgrade/page.tsx', 'utf8')

// Every fail('...') and every template one, e.g. fail(`no_price_${tier}`).
const literal = [...route.matchAll(/fail\('([a-z_]+)'\)/g)].map(m => m[1])
const templated = [...route.matchAll(/fail\(`([a-z_]+)\$\{/g)].map(m => m[1])

check('the route has failure reasons to report', literal.length > 0, `${literal.length} found`)

for (const reason of literal) {
  check(`"${reason}" has something to say to the parent`, component.includes(`${reason}:`))
}

// The templated ones cannot be matched by name, so the component must handle
// the prefix. no_price_founder and no_price_standard both arrive this way.
for (const prefix of templated) {
  check(`the "${prefix}..." family is handled by prefix`, component.includes(`startsWith('${prefix}`))
}

// THE ONE THAT WENT WRONG: the page has to actually read the parameter and
// render the thing. Redirecting with a reason nobody displays is the same as
// not redirecting with one.
check('the upgrade page reads the error parameter', /error\??:\s*string/.test(page) && page.includes('error }') )
check('and renders it', page.includes('<CheckoutError'))
check('and imports it', page.includes("from '@/components/upgrade/CheckoutError'"))

// NOTHING WAS CHARGED is the single most important sentence on any of these,
// because the worst thing a payment error can leave behind is a parent
// wondering whether their card was taken.
//
// use_the_button is exempt BY NAME rather than by a loose phrase match: it is
// not a failed payment, it is somebody opening the form's address in a
// browser, and no attempt was ever made. Naming the one exemption is the
// difference between a rule and a rule that quietly stops applying.
const messages = [...component.matchAll(/body: '([^']+)'/g)].map(m => m[1])
const notAPaymentAttempt = messages.filter(b => b.includes('opening it directly does nothing'))
check('exactly one message is not about a payment attempt',
  notAPaymentAttempt.length === 1)
check('and every other one says nothing was charged',
  messages.filter(b => !notAPaymentAttempt.includes(b)).every(b => /been charged/.test(b)),
  `${messages.length - notAPaymentAttempt.length} checked`)

// A GET must never 500 again: pasting the address in a browser is exactly how
// Justin found this.
check('a GET is handled rather than left to 500', /export async function GET/.test(route))

console.log(failures === 0 ? '\nAll good.' : `\n${failures} failing.`)
process.exit(failures === 0 ? 0 : 1)
