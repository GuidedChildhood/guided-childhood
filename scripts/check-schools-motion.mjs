#!/usr/bin/env node
// THE REDUCED MOTION PROMISE, CHECKED IN A BROWSER THAT IS ACTUALLY ASKING.
//
// shared/tokens.css carried a prefers-reduced-motion block from August and it
// covered one class, .lift. Every rule written after it kept moving: .btn's
// transform, .btn-outline's ground, .input's border, the step arrow. The block
// existed, so the promise looked kept, and a grep for "prefers-reduced-motion"
// found it and said yes. Only a browser told the truth.
//
// So this asks Chromium for reduced motion and reads the computed
// transition-duration back, which is the only version of this check that can
// be right. It also hovers a card link and reads the transform, because the
// other half of a motion language is that something answers at all.
//
// Usage, with the schools app running on :3230 and SCHOOLS_ACCESS_SECRET set:
//   node scripts/check-schools-motion.mjs
//
// Not in CI: it needs a running server, the same reason check-print-fit.mjs is
// not. Run it when you touch motion.
const { chromium } = require('/home/user/guided-childhood/node_modules/playwright')
const crypto = require('node:crypto')
const secret = process.env.SCHOOLS_ACCESS_SECRET, expires = Date.now()+86400000, payload = `pilot|${expires}`
const cookie = { name:'gc_schools_access', value:`${payload}|${crypto.createHmac('sha256',secret).update(payload).digest('hex')}`, domain:'localhost', path:'/' }
const dur = el => getComputedStyle(el).transitionDuration
;(async () => {
  const b = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] })
  let fail = 0
  for (const motion of ['no-preference', 'reduce']) {
    const ctx = await b.newContext({ viewport:{width:1440,height:900}, reducedMotion: motion })
    await ctx.addCookies([cookie]); const p = await ctx.newPage()
    await p.goto('http://localhost:3230/hub', { waitUntil:'networkidle' })
    const r = await p.evaluate(() => {
      const g = document.querySelector('.gc-tap'), btn = document.querySelector('.btn')
      const d = el => el ? getComputedStyle(el).transitionDuration : 'none'
      return { tap: d(g), btn: d(btn), hasTap: !!g, hasBtn: !!btn }
    })
    const want = motion === 'reduce'
    const ok = want ? (r.tap.startsWith('0.00001s') || r.tap === '1e-05s') : r.tap !== '0s'
    console.log(`  reducedMotion=${motion.padEnd(14)} .gc-tap ${r.tap.padEnd(12)} .btn ${r.btn.padEnd(12)} ${ok ? 'PASS' : 'FAIL'}`)
    if (!ok) fail = 1
    if (motion === 'no-preference' && r.hasTap) {
      const el = await p.$('.gc-tap')
      const before = await el.evaluate(e => getComputedStyle(e).transform)
      await el.hover(); await p.waitForTimeout(250)
      const after = await el.evaluate(e => getComputedStyle(e).transform)
      const moved = before !== after
      console.log(`  hover on a card link: ${before} -> ${after}  ${moved ? 'PASS, it answers' : 'FAIL, still inert'}`)
      if (!moved) fail = 1
    }
    await ctx.close()
  }
  await b.close(); process.exit(fail)
})()
