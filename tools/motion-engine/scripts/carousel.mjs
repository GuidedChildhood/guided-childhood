#!/usr/bin/env node
// Render one evidence carousel: Instagram slides, a LinkedIn PDF, and on
// request a motion version. The recurring series Justin started with GDC 064
// (26 November 2026). Part of the motion engine; the outputs sit beside the
// research card in content/motion/GDC-NNN/ and are recorded the same way.
//
//   node scripts/carousel.mjs <carousel.json> [--motion] [--portrait] [--out dir]
//
// Nothing renders unless the gate passes. The words live in the spec and the
// look in carousel/template.html; both are the editable sources.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { checkCarousel } from './carousel-gate.mjs'

const ENGINE = dirname(dirname(fileURLToPath(import.meta.url)))
const ROOT = join(ENGINE, '..', '..')
const TEMPLATE = join(ENGINE, 'carousel', 'template.html')
const args = process.argv.slice(2)
const specPath = args.find((a) => !a.startsWith('--'))
if (!specPath) { console.error('usage: node scripts/carousel.mjs <carousel.json> [--motion] [--portrait] [--out dir]'); process.exit(2) }
const spec = JSON.parse(readFileSync(resolve(specPath), 'utf8'))
const outIdx = args.indexOf('--out')
const outDir = resolve(outIdx > -1 ? args[outIdx + 1] : join(dirname(resolve(specPath)), 'carousel'))

/** The text whose figures may appear: cleared figures for a radar story, the approved copy otherwise. */
export function clearedText(spec) {
  const parts = [...(spec.clearedFigures || [])]
  for (const f of spec.clearedFrom || []) {
    const p = join(ROOT, f)
    if (existsSync(p)) parts.push(readFileSync(p, 'utf8'))
  }
  if (spec.researchId) {
    process.env.RADAR_REGISTER ||= join(ROOT, 'content/research-register')
    const line = spawnSync('node', ['-e', `import('${pathToFileURL(join(ROOT, 'scripts/radar/register.mjs')).href}').then(r=>{const x=r.get(${JSON.stringify(spec.researchId)});process.stdout.write(JSON.stringify(x?.claudeReview?.verifiedStatistics||[]))})`], { cwd: ROOT, encoding: 'utf8' })
    try { parts.push(...JSON.parse(line.stdout || '[]')) } catch { /* reported by the gate as uncleared figures */ }
  }
  return parts.join('\n')
}

if (spec.draft && !spec.notForPublication) { console.error('HOLD  the spec is still a draft. A person checks the pages, then sets "draft": false.'); process.exit(1) }
const gate = checkCarousel(spec, clearedText(spec))
for (const w of gate.warnings) console.log(`NOTE  ${w}`)
if (gate.verdict !== 'PASS') { for (const r of gate.reasons) console.error(`HOLD  ${r}`); process.exit(1) }

mkdirSync(outDir, { recursive: true })
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
// The repository pins its own Playwright; in the cloud container the installed
// browser lives at /opt/pw-browsers/chromium. On a laptop Playwright finds its own.
const PW = '/opt/pw-browsers/chromium'
const browser = await chromium.launch(existsSync(PW) && !process.env.CAROUSEL_OWN_BROWSER ? { executablePath: PW } : {})
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
const slug = spec.notForPublication ? 'demo' : `gdc-${spec.gdc}`
const pngs = []
const jpegs = []
const total = spec.pages.length
for (const [i, p] of spec.pages.entries()) {
  const data = { kicker: p.kicker, lines: p.lines, footer: spec.footer, index: i + 1, total, seed: 7 + i * 11, source: i === total - 1 ? spec.source : '' }
  // A query per page forces a fresh load; a hash change alone keeps the old page.
  await page.goto(`${pathToFileURL(TEMPLATE).href}?page=${i + 1}#${encodeURIComponent(JSON.stringify(data))}`)
  await page.waitForSelector('body[data-ready="1"]')
  // JPEG at quality 92: the paper grain makes a PNG about 1.5 MB a slide for no
  // visible gain, and Instagram recompresses to JPEG anyway.
  const file = join(outDir, `${slug}-slide-${i + 1}.jpg`)
  await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1350 } })
  pngs.push(file)
  jpegs.push(readFileSync(file))
}
// Portrait pages, rendered at their own size for the portrait motion cut.
const portrait = []
if (args.includes('--portrait')) {
  await page.setViewportSize({ width: 1080, height: 1920 })
  for (const [i, p] of spec.pages.entries()) {
    const data = { kicker: p.kicker, lines: p.lines, footer: spec.footer, index: i + 1, total, seed: 7 + i * 11, source: i === total - 1 ? spec.source : '', h: 1920 }
    await page.goto(`${pathToFileURL(TEMPLATE).href}?portrait=${i + 1}#${encodeURIComponent(JSON.stringify(data))}`)
    await page.waitForSelector('body[data-ready="1"]')
    const file = join(outDir, `${slug}-portrait-${i + 1}.jpg`)
    await page.screenshot({ path: file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1920 } })
    portrait.push(file)
  }
}
await browser.close()

// The LinkedIn document: the same slides, one per page, as a PDF, printed by
// the same browser so nothing else needs installing.
const pdf = join(outDir, `${slug}-linkedin-carousel.pdf`)
{
  const b = await chromium.launch(existsSync(PW) && !process.env.CAROUSEL_OWN_BROWSER ? { executablePath: PW } : {})
  const pg = await b.newPage()
  const imgs = jpegs.map((b) => `<img src="data:image/jpeg;base64,${b.toString('base64')}">`).join('')
  await pg.setContent(`<!doctype html><style>@page{size:1080px 1350px;margin:0}html,body{margin:0}img{display:block;width:1080px;height:1350px;page-break-after:always}img:last-child{page-break-after:auto}</style>${imgs}`)
  await pg.pdf({ path: pdf, width: '1080px', height: '1350px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
  await b.close()
}

// The motion version: each page held long enough to read, a soft cross fade,
// the last page held for the end hold in the settings.
const outputs = { slides: pngs, pdf, ...(portrait.length ? { portraitSlides: portrait } : {}) }
if (args.includes('--motion')) {
  const settings = JSON.parse(readFileSync(join(ROOT, 'config/content-engine.json'), 'utf8'))
  const endHold = settings.motion?.endHoldSeconds ?? 5
  const hold = (p) => Math.max(3.5, Math.min(7, 1.5 + (p.kicker + ' ' + p.lines.join(' ')).split(/\s+/).length * 0.28))
  const holds = spec.pages.map((p, i) => hold(p) + (i === total - 1 ? endHold : 0))
  const fade = 0.5
  const sizes = [['', pngs]]
  if (portrait.length) sizes.push(['-portrait', portrait])
  for (const [tag, frames] of sizes) {
    const inputs = frames.flatMap((f, i) => ['-loop', '1', '-t', String(holds[i] + fade), '-i', f])
    let chain = frames.map((_, i) => `[${i}:v]format=yuv420p,setsar=1,fps=30[v${i}]`).join(';')
    let last = 'v0'; let offset = 0
    for (let i = 1; i < frames.length; i++) { offset += holds[i - 1]; chain += `;[${last}][v${i}]xfade=transition=fade:duration=${fade}:offset=${offset.toFixed(2)}[x${i}]`; last = `x${i}` }
    const mp4 = join(outDir, `${slug}-motion${tag}.mp4`)
    const ff = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', chain, '-map', `[${last}]`, '-c:v', 'libx264', '-crf', process.env.MOTION_CRF || '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4], { encoding: 'utf8' })
    if (ff.status !== 0) { console.error(ff.stderr); process.exit(1) }
    outputs[`motion${tag}`] = mp4
  }
}
writeFileSync(join(outDir, 'carousel-render.json'), JSON.stringify({ renderedAt: new Date().toISOString(), gdc: spec.gdc, outputs: Object.fromEntries(Object.entries(outputs).map(([k, v]) => [k, Array.isArray(v) ? v.map((x) => x.replace(ROOT + '/', '')) : v.replace(ROOT + '/', '')])) }, null, 2) + '\n')
console.log(`PASS  ${total} slides, the LinkedIn PDF${outputs.motion ? ', the motion version' : ''}${outputs['motion-portrait'] ? ' and the portrait cut' : ''} in ${outDir.replace(ROOT + '/', '')}`)
for (const f of Object.values(outputs).flat()) console.log(`  ${f.replace(ROOT + '/', '')}  ${Math.round(statSync(f).size / 1024)} KB`)

