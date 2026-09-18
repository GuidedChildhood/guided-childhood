#!/usr/bin/env node
// COUNT THE CARDS A TEACHER ACTUALLY SEES, and how many sit inside another one.
//
// Not a guard. A measuring instrument, kept because the claim it settled is the
// kind anybody would want to re-check, and because the first two answers it
// gave were both wrong in a way that reading the JSX could never have shown.
//
// Usage, with the schools app running on :3230 and SCHOOLS_ACCESS_SECRET set:
//   node scripts/count-schools-cards.mjs
//
// FIRST ANSWER, WRONG: 1,062 boxes, 67 percent nested. It counted every table
// cell with a rule as a box. A table with rules is a table.
//
// SECOND ANSWER, ALSO WRONG: 150 cards, 22 percent nested, concentrated on the
// curriculum and lesson pages. Printing what those nested cards actually WERE
// finished the argument: all 25 on the curriculum page are the one "Ready to
// teach" link at the foot of each module card, styled as a button, which the
// control filter missed because it is an <a> and not a <button>. Of the eight
// on the lesson page, three are pills, one is the passport card itself, and
// four are the passport area tiles inside it, which is precisely what
// --radius-tile exists for: "the small tiles inside a card".
//
// THIRD ANSWER, AND THE ONE THAT STOOD: the schools app has no nested card
// problem. Every candidate is a button, a pill, or a tile inside a card.
//
// That is why this file prints the background, border, radius and first words
// of each nested card rather than a number. A number would have been believed.
const { chromium } = require('/home/user/guided-childhood/node_modules/playwright')
const crypto = require('node:crypto')
const secret = process.env.SCHOOLS_ACCESS_SECRET, expires = Date.now() + 86400000, payload = `pilot|${expires}`
const cookie = { name: 'gc_schools_access', value: `${payload}|${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`, domain: 'localhost', path: '/' }
;(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addCookies([cookie])
  const p = await ctx.newPage()
  for (const [name, path] of [['lesson','/lesson/ks2-25-stay-the-maker'],['curriculum','/curriculum']]) {
    await p.goto('http://localhost:3230' + path, { waitUntil: 'networkidle' }).catch(()=>{})
    const out = await p.evaluate(() => {
      const isBox = el => { const s=getComputedStyle(el); if(s.display==='none')return false
        const bw=parseFloat(s.borderTopWidth)||0, bg=s.backgroundColor
        return (bw>0&&s.borderTopStyle!=='none')||(bg&&bg!=='rgba(0, 0, 0, 0)')||(s.boxShadow&&s.boxShadow!=='none') }
      const TABLE=new Set(['TD','TH','TR','THEAD','TBODY','TABLE']), CTL=new Set(['BUTTON','INPUT','SELECT','TEXTAREA','LABEL','SUMMARY'])
      const isCard = el => { if(TABLE.has(el.tagName)||CTL.has(el.tagName))return false
        // an <a> painted as a button is a control, whatever its tag says
        if(el.closest('button, input, select, textarea, label'))return false
        if(el.tagName==='A'||el.closest('a'))return false
        const r=el.getBoundingClientRect(); if(r.width<120||r.height<40)return false
        const s=getComputedStyle(el); return parseFloat(s.borderRadius)>0||(s.boxShadow&&s.boxShadow!=='none') }
      const cards=[...document.querySelectorAll('main *')].filter(isBox).filter(isCard), set=new Set(cards)
      const rows=[]
      for(const el of cards){ let d=0,a=el.parentElement
        while(a&&a!==document.body){ if(set.has(a))d++; a=a.parentElement }
        if(d>=1){ const s=getComputedStyle(el)
          rows.push({d, tag:el.tagName.toLowerCase(), bg:s.backgroundColor, bd:s.borderTopWidth+' '+s.borderTopColor,
            r:s.borderRadius, text:(el.textContent||'').trim().slice(0,52)}) } }
      const key=r=>r.d+'|'+r.bg+'|'+r.bd+'|'+r.r
      const seen=new Map(); for(const r of rows){ const k=key(r); if(!seen.has(k))seen.set(k,{...r,n:0}); seen.get(k).n++ }
      return [...seen.values()].sort((a,b)=>b.d-a.d||b.n-a.n)
    })
    console.log(`\n--- ${name}: ${out.reduce((s,r)=>s+r.n,0)} nested cards, ${out.length} distinct kinds ---`)
    for (const r of out) console.log(`  x${String(r.n).padStart(3)}  depth ${r.d}  bg ${r.bg.padEnd(22)} border ${r.bd.padEnd(26)} r ${r.r.padEnd(10)} "${r.text}"`)
  }
  await b.close()
})()
