#!/usr/bin/env node
// Captures DiGi's real "Checking back, as promised" card (DigiPrompts, the
// How did that go card with its three answers) from /dev/home-tail. The card
// fetches /api/digi/prompts, which needs a signed in parent, so the route is
// stubbed here with one follow up, exactly as the house browser checks do.
// The component, its layout and its answer wording are the real ones.
//   node tools/capture-followup.mjs http://localhost:3000 screens/
import { chromium } from 'playwright'
const [base, out = 'screens/'] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
const page = await ctx.newPage()
await page.route('**/api/digi/prompts', (r) => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ prompts: [
  { id: 'f1', kind: 'follow_up', title: 'Bedtime and the TV', body: 'The ending you agreed, a week on. How many went without a fight?', href: null, outcome_id: 'o1' },
] }) }))
await page.goto(base + '/dev/home-tail', { waitUntil: 'networkidle', timeout: 60000 })
await page.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none!important}' })
await page.waitForTimeout(1500)
await page.screenshot({ path: `${out}digi-followup.png`, fullPage: true })
console.log('ok digi-followup')
await browser.close()
