// Builds an issue of The Guided Times: the PDFs, the page turning reader,
// the page previews and the listing photos.
//
//   node content/printables/guided-times/build.mjs [issue-1] [print|reader|listing|taster|app]
//
// THE APP EDITION (app, never part of a full build): print.html?edition=app,
// the paper without its shop or Etsy lines, to public/printables as
// guided-times-N-colour.pdf, -colourin.pdf (ink friendly) and the card
// guided-times-N.png, A4 only. Free in the app, like every Etsy download.
//
// Needs playwright-core and a Chrome: the system Chrome on this Mac and the
// main checkout's playwright-core, unless CHROME and PW_CORE say otherwise
// (the same as build-pack.mjs).
//
// ONE PAGE, FOUR PAPERS. Every page is 740 by 1000 CSS pixels (195.8 by
// 264.6 mm). It is centred on A4 (7 mm at the sides, 16 mm top and bottom)
// and on US Letter (10 mm at the sides, 7 mm top and bottom) without scaling
// or reflowing, and the screen PDF is exactly the page.
//
// THE READER IS ONE FILE. The pages are lifted out of print.html after
// paper.js has drawn them, and every font and picture goes inside the file
// as data, so it opens offline from a downloads folder with no account and
// no internet. Etsy does not accept .html, so it ships in a zip.

import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const PW = process.env.PW_CORE ?? '/Users/justinphillips/guided-childhood/node_modules/playwright-core'
const { chromium } = require(PW)
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const issue = process.argv[2] ?? 'issue-1'
const only = process.argv[3]
const DIR = join(ROOT, issue)
const N = Number(issue.split('-')[1])
const SLUG = `The-Guided-Times-Issue-${N}`
if (!existsSync(join(DIR, 'print.html'))) { console.error('No such issue:', issue); process.exit(1) }

const PAPERS = {
  a4: '@page { size: 210mm 297mm; margin: 16.2mm 7.1mm; }',
  letter: '@page { size: 215.9mm 279.4mm; margin: 7.4mm 10.05mm; }',
  screen: '@page { size: 740px 1000px; margin: 0; }',
}

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined })
const ready = async page => {
  await page.evaluate(() => document.fonts.ready)
  // Every picture decoded before anything is printed: a PDF with a missing
  // Friend never ships (the Planet Post's rule).
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 30000 })
  await page.waitForTimeout(300)
}
const open = async (page, ink = false, edition = '') => {
  await page.goto('file://' + join(DIR, 'print.html') + (edition ? `?edition=${edition}` : ''))
  if (ink) await page.evaluate(() => document.body.classList.add('ink'))
  await ready(page)
}

// Nothing may spill out of its page: a box pushed past the folio is a page
// a parent prints with a line missing. Fails the build rather than ship it.
async function checkOverflow(page) {
  const bad = await page.evaluate(() => {
    const out = []
    for (const pg of document.querySelectorAll('.gt-page')) {
      const body = pg.querySelector('.gt-body'), r = body.getBoundingClientRect()
      for (const el of body.querySelectorAll('*')) {
        const e = el.getBoundingClientRect()
        if (e.width === 0 || e.height === 0) continue
        if (getComputedStyle(el).position === 'absolute') continue
        if (e.bottom > r.bottom + 1.5 || e.right > r.right + 1.5) { out.push(`page ${pg.dataset.page}: <${el.tagName.toLowerCase()} class="${el.className}"> runs ${Math.round(Math.max(e.bottom - r.bottom, e.right - r.right))}px over`); break }
      }
      if (body.scrollHeight > body.clientHeight + 1) out.push(`page ${pg.dataset.page}: body content is ${body.scrollHeight - body.clientHeight}px too tall`)
    }
    return out
  })
  if (bad.length) { console.error('OVERFLOW\n  ' + bad.join('\n  ')); process.exitCode = 1 }
  return bad
}

if (!only || only === 'print') {
  const out = join(DIR, 'product'); mkdirSync(out, { recursive: true })
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } })
  const pdf = async (name, paper, ink) => {
    await open(page, ink)
    await page.addStyleTag({ content: PAPERS[paper] })
    await page.emulateMedia({ media: 'print' })
    await page.pdf({ path: join(out, name), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
    await page.emulateMedia({ media: 'screen' })
    console.log('pdf', name)
  }
  await open(page); await checkOverflow(page)
  await pdf(`${SLUG}-A4.pdf`, 'a4', false)
  await pdf(`${SLUG}-US-Letter.pdf`, 'letter', false)
  await pdf(`${SLUG}-Read-On-Screen.pdf`, 'screen', false)
  const ink = join(DIR, 'build/ink'); rmSync(ink, { recursive: true, force: true }); mkdirSync(ink, { recursive: true })
  await page.goto('about:blank')
  for (const [name, paper] of [[`${SLUG}-Ink-Friendly-A4.pdf`, 'a4'], [`${SLUG}-Ink-Friendly-US-Letter.pdf`, 'letter']]) {
    await open(page, true); await page.addStyleTag({ content: PAPERS[paper] })
    await page.emulateMedia({ media: 'print' })
    await page.pdf({ path: join(ink, name), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
    await page.emulateMedia({ media: 'screen' })
    console.log('pdf', name)
  }
  rmSync(join(out, `${SLUG}-Ink-Friendly.zip`), { force: true })
  execFileSync('zip', ['-j', '-q', join(out, `${SLUG}-Ink-Friendly.zip`), ...readdirSync(ink).map(f => join(ink, f))])
  console.log('zip', `${SLUG}-Ink-Friendly.zip`)

  // Page previews, colour and ink friendly, for the check by eye and the listing photos.
  for (const [dir, inkOn] of [['preview', false], ['preview-ink', true]]) {
    const pv = join(DIR, 'images', dir); rmSync(pv, { recursive: true, force: true }); mkdirSync(pv, { recursive: true })
    const p2 = await browser.newPage({ viewport: { width: 900, height: 1100 }, deviceScaleFactor: 2 })
    await open(p2, inkOn)
    const pages = p2.locator('.gt-page'), n = await pages.count()
    for (let i = 0; i < n; i++) await pages.nth(i).screenshot({ path: join(pv, `page-${String(i + 1).padStart(2, '0')}.png`) })
    console.log(dir, n)
    await p2.close()
  }
}

if (!only || only === 'reader') {
  // Lift the drawn pages out of print.html.
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } })
  await open(page)
  let pages = await page.evaluate(() => document.getElementById('pages').innerHTML)
  const title = await page.title()
  await page.close()

  // Every picture into the file. Friends and shop pages are shrunk and turned
  // into WebP in Chrome itself, so the reader stays a few megabytes.
  const conv = await browser.newPage()
  const srcs = [...new Set([...pages.matchAll(/src="([^"]+)"/g)].map(m => m[1]))]
  for (const src of srcs) {
    const file = join(DIR, src)
    const data = readFileSync(file).toString('base64')
    const mime = extname(file) === '.svg' ? 'image/svg+xml' : 'image/png'
    const max = src.includes('/shop/') ? 520 : 360
    const url = mime === 'image/png'
      ? await conv.evaluate(async ({ data, max }) => {
          const im = new Image(); im.src = 'data:image/png;base64,' + data; await im.decode()
          const s = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight))
          const c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * s); c.height = Math.round(im.naturalHeight * s)
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height)
          return c.toDataURL('image/webp', 0.86)
        }, { data, max })
      : `data:${mime};base64,${data}`
    pages = pages.split(`src="${src}"`).join(`src="${url}"`)
  }
  await conv.close()

  const fontCss = readFileSync(join(ROOT, 'fonts/local-fonts.css'), 'utf8').replace(/url\('([^']+)'\)/g, (_, f) => `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'fonts', f)).toString('base64')})`)
  const paperCss = readFileSync(join(ROOT, 'paper.css'), 'utf8')
  const readerCss = readFileSync(join(ROOT, 'reader/reader.css'), 'utf8')
  const readerJs = readFileSync(join(ROOT, 'reader/reader.js'), 'utf8')
  const shell = readFileSync(join(ROOT, 'reader/reader.html'), 'utf8')
  const html = shell
    .replace('{{TITLE}}', title)
    .replace('{{STYLE}}', () => fontCss + '\n' + paperCss + '\n' + readerCss)
    .replace('{{PAGES}}', () => pages)
    .replace('{{SCRIPT}}', () => readerJs)
  const build = join(DIR, 'build/reader'); rmSync(build, { recursive: true, force: true }); mkdirSync(build, { recursive: true })
  const htmlName = `${SLUG}-Turn-The-Pages.html`
  writeFileSync(join(build, htmlName), html)
  writeFileSync(join(build, 'How-to-open-it.txt'), readFileSync(join(ROOT, 'reader/how-to-open.txt'), 'utf8').replaceAll('{{FILE}}', htmlName))
  const out = join(DIR, 'product'); mkdirSync(out, { recursive: true })
  const zip = join(out, `${SLUG}-Turn-The-Pages.zip`); rmSync(zip, { force: true })
  execFileSync('zip', ['-j', '-q', zip, join(build, htmlName), join(build, 'How-to-open-it.txt')])
  console.log('reader', htmlName, Math.round(statSync(join(build, htmlName)).size / 1024), 'KB; zip', Math.round(statSync(zip).size / 1024), 'KB')
}

// THE FREE TASTER (6 November 2026): four pages, free on the website for an
// email (lib/magnets/registry.ts, app/(marketing)/free/guided-times). It goes
// straight into the site's public folder, beside the Planet Post's files, with
// a 740 by 1000 preview of each page for the web page. Run after print: its
// last page shows the full issue's page previews.
if (!only || only === 'taster') {
  const PUB = join(ROOT, '../../../public/printables/free')
  const base = `guided-times-${N}-taster`
  mkdirSync(PUB, { recursive: true })
  // The closing page's eight small pages: 240 px copies, so the emailed PDF
  // stays light rather than carrying eight full renders.
  const thumbs = join(DIR, 'images/thumbs'); rmSync(thumbs, { recursive: true, force: true }); mkdirSync(thumbs, { recursive: true })
  for (const f of readdirSync(join(DIR, 'images/preview'))) execFileSync('sips', ['-Z', '240', join(DIR, 'images/preview', f), '--out', join(thumbs, f)], { stdio: 'ignore' })
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } })
  await open(page, false, 'taster'); await checkOverflow(page)
  for (const [suffix, paper] of [['a4', 'a4'], ['letter', 'letter']]) {
    await open(page, false, 'taster'); await page.addStyleTag({ content: PAPERS[paper] })
    await page.emulateMedia({ media: 'print' })
    await page.pdf({ path: join(PUB, `${base}-${suffix}.pdf`), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
    await page.emulateMedia({ media: 'screen' })
    console.log('taster pdf', `${base}-${suffix}.pdf`)
  }
  const pv = await browser.newPage({ viewport: { width: 900, height: 1100 } })
  await open(pv, false, 'taster')
  const pages = pv.locator('.gt-page'), n = await pages.count()
  for (let i = 0; i < n; i++) await pages.nth(i).screenshot({ path: join(PUB, `${base}-p${i + 1}.png`) })
  console.log('taster previews', n)
}

if (only === 'app') {
  // Issue 2 on carries the shop on its back page (back2), and without it that
  // page is half empty. It needs an app back page of its own before it goes in.
  if (/'back2'/.test(readFileSync(join(DIR, 'issue.js'), 'utf8'))) throw new Error(`${issue} has the shop on its back page: give it an app back page before an app edition`)
  if (!/\n  app: \{/.test(readFileSync(join(DIR, 'issue.js'), 'utf8'))) throw new Error(`${issue}/issue.js has no app lines for the back page`)
  const OUT = join(ROOT, '../../../public/printables'), key = `guided-times-${N}`
  const page = await browser.newPage({ viewport: { width: 900, height: 1100 } })
  await open(page, false, 'app'); await checkOverflow(page)
  for (const [name, ink] of [[`${key}-colour.pdf`, false], [`${key}-colourin.pdf`, true]]) {
    await open(page, ink, 'app'); await page.addStyleTag({ content: PAPERS.a4 })
    await page.emulateMedia({ media: 'print' })
    await page.pdf({ path: join(OUT, name), preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
    await page.emulateMedia({ media: 'screen' })
    console.log('app pdf', name, await page.locator('.gt-page').count(), 'pages')
  }
  // The card is page one of the colour PDF, as for every app printable.
  execFileSync('pdftoppm', ['-png', '-f', '1', '-l', '1', '-scale-to', '1400', '-singlefile', join(OUT, `${key}-colour.pdf`), join(OUT, key)])
  console.log('app card', `${key}.png`)
}

if ((!only || only === 'listing') && existsSync(join(DIR, 'listing/images.html'))) {
  const dir = join(DIR, 'listing/images'); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true })
  const page = await browser.newPage({ viewport: { width: 2000, height: 2000 } })
  await page.goto('file://' + join(DIR, 'listing/images.html'))
  await ready(page)
  const frames = page.locator('.frame'), n = await frames.count()
  for (let i = 0; i < n; i++) {
    const id = await frames.nth(i).getAttribute('data-name')
    await frames.nth(i).screenshot({ path: join(dir, `${id}.png`) })
  }
  console.log('listing images', n)
  // Real life photos: the real front page on the Christmas table and the
  // breakfast table (../scene-composite.mjs), named 01c and 01d so they sit
  // with the cover. Justin, 6 November 2026: real images for every listing.
  for (const [i, s] of ['christmas-table', 'table-breakfast'].entries()) {
    execFileSync(process.execPath, [join(ROOT, '..', 'scene-composite.mjs'), s, join(DIR, 'images/preview/page-01.png'), join(dir, `01${'cd'[i]}-real-${s}.jpg`)], { stdio: 'inherit' })
  }
}

for (const f of existsSync(join(DIR, 'product')) ? readdirSync(join(DIR, 'product')) : []) {
  const mb = statSync(join(DIR, 'product', f)).size / 1048576
  if (mb > 20) { console.error(`${f} is ${mb.toFixed(1)} MB, Etsy takes 20 MB a file`); process.exitCode = 1 }
}
await browser.close()
