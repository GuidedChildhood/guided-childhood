#!/usr/bin/env node
// Captures real product screens for the series at phone width (390 x 844,
// three times density). The films never invent a screen: every phone in
// them is one of these, taken from the running app's /dev and /ref pages
// (they 404 in production, work locally). Look only: some dev pages have
// buttons that post for real, so nothing is clicked.
//   node tools/capture.mjs http://localhost:3000 screens/
import { chromium } from 'playwright'
const [base, out = 'screens/'] = process.argv.slice(2)
const PAGES = {
  'kid-ask-gate': '/dev/kid-ask?block=1',
  'kid-ask': '/dev/kid-ask',
  'device-time': '/dev/device-time',
  'device-time-popup': '/dev/device-time?view=popup',
  'timer-short': '/dev/timer-short',
  'parent-timer': '/dev/parent-timer',
  'notification-cards': '/dev/notification-cards',
  'quest-status': '/dev/quest-status',
  'kid-day-done': '/dev/kid-day-done',
  'kid-home-done': '/dev/kid-home?today=done',
  'kid-today': '/ref-kid-today',
  'kid-five': '/ref-kid-five',
  'time-tiers': '/ref-time-tiers',
  'timer-nudge': '/ref-timer-nudge',
  'ask-first-child': '/ref-ask-first?view=child',
  'ask-first-parent': '/ref-ask-first?view=parent',
  'kid-deal': '/dev/kid-deal',
  'deal-sheet': '/dev/deal-sheet',
  'job-board': '/ref-job-board',
  'quest-board': '/ref-quest-board',
  'concern-scale': '/dev/concern-scale',
  'roundup-card': '/ref-roundup-card',
}
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
const page = await ctx.newPage()
for (const [name, path] of Object.entries(PAGES)) {
  try {
    const r = await page.goto(base + path, { waitUntil: 'networkidle', timeout: 60000 })
    await page.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none!important}' })
    await page.waitForTimeout(1200)
    await page.screenshot({ path: `${out}${name}.png`, fullPage: true })
    console.log(r.status(), name)
  } catch (e) { console.log('FAIL', name, e.message.split('\n')[0]) }
}
await browser.close()
