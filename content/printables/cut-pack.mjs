// Two jobs, both done on finished product PDFs, never by redrawing a page:
//
//   node content/printables/cut-pack.mjs <slug>      one product
//   node content/printables/cut-pack.mjs all         every product below
//
// 1. SPIN OFFS (Justin, 11 November 2026: more listings, so the shop shows up
//    in more searches). A spin off is a few pages of a bigger pack sold on
//    their own at the entry price: the pages are copied out of the parent's
//    three product PDFs exactly as they are.
//
// 2. A TRUE LAST PAGE for the older games (A to Z Showdown, Ice Cream Shop,
//    School Year Planner, Word Fishing). Their last pages promised a bonus of
//    their own at /etsy-bonus (a Christmas round, market price cards, a
//    decoding game, a sticker pack), and that page gives none of them: it
//    gives the Starter Pack for an email. Their last page is swapped here for
//    the thank you page that says so. Rerun this after any rebuild of those
//    packs, until their print.html carries the same page.
//
// Both end on the same page: ../pack-finish.js with no Passport sticker (a
// thank you, the gift /etsy-bonus really gives, the review line), rendered
// in the Calm Down Corner Kit's print.html so it matches the house sheets,
// in A4, US Letter (the A4 sheet at 94 percent, as build-pack.mjs) and ink
// friendly. Form fields are not carried over, so no spin off says fillable.
//
// Then run pdf-previews.mjs for the page previews (this script does).
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const PW = process.env.PW_CORE ?? '/Users/justinphillips/guided-childhood/node_modules/playwright-core'
const PDFLIB = process.env.PDF_LIB ?? '/Users/justinphillips/guided-childhood/node_modules/pdf-lib'
const { chromium } = require(PW)
const { PDFDocument, PDFName } = require(PDFLIB)
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const REVIEW = 'a kind review on Etsy helps another family find it.'

// parent, the parent's page numbers, and the two lines of the last page.
const SPIN = {
  'star-breathing-poster': { parent: 'calm-down-kit', pages: [3, 5],
    intro: 'This sign and poster come from The Calm Down Corner Kit, in the same Etsy shop. The whole kit adds the feelings cards, twelve calm choice cards, a page for after the storm and the words for a grown up to say.',
    thanks: `If the star earns a place on your wall, ${REVIEW}` },
  'feelings-cards': { parent: 'calm-down-kit', pages: [4, 6],
    intro: 'These cards come from The Calm Down Corner Kit, in the same Etsy shop. The whole kit adds the calm corner sign, the star breathing poster, a page for after the storm and the words for a grown up to say.',
    thanks: `If these cards help a big feeling get a little smaller, ${REVIEW}` },
  'weekly-routine-chart': { parent: 'planet-day-flip-chart', pages: [12, 13],
    intro: 'These two charts come from The Planet Day Flip Chart, in the same Etsy shop. The whole flip chart adds 120 picture cards and a chart for morning, after school and bedtime that your child builds and flips through the day.',
    thanks: `If the ticks add up in your house, ${REVIEW}` },
  'routine-picture-cards': { parent: 'planet-day-flip-chart', pages: [14, 15, 16, 17, 18, 23],
    intro: 'These cards come from The Planet Day Flip Chart, in the same Etsy shop. The whole flip chart adds 60 more cards for jobs, screen time and family time, and the chart your child sticks them on and flips through the day.',
    thanks: `If these cards make a morning run a little smoother, ${REVIEW}` },
  'car-bingo': { parent: 'are-we-nearly-there', pages: [4, 5, 6],
    intro: 'These games come from Are We Nearly There?, in the same Etsy shop. The whole pack adds twenty questions, would you rather, a journey map to colour, doodles for the road and a deal for the tablet you agree before you set off.',
    thanks: `If these made a long journey a little easier, ${REVIEW}` },
  'devices-sleep-here-sign': { parent: 'where-phones-sleep', pages: [3, 4],
    intro: 'These signs come from Where Phones Sleep, in the same Etsy shop. The whole pack adds the bedtime charging line for the fridge, charging spot labels, tonight\'s screen plan, phones in the basket for mealtimes and the family tech rules.',
    thanks: `If the shelf in your kitchen fills up at bedtime, ${REVIEW}` },
  'family-tech-rules': { parent: 'where-phones-sleep', pages: [9, 8],
    intro: 'These pages come from Where Phones Sleep, in the same Etsy shop. The whole pack adds the Devices sleep here poster, the bedtime charging line for the fridge, charging spot labels and tonight\'s screen plan.',
    thanks: `If these rules get signed in your house, ${REVIEW}` },
  'screen-time-tokens': { parent: 'earn-your-screen-time', pages: [5, 6],
    intro: 'These tokens and cards come from Earn Your Screen Time, in the same Etsy shop. The whole pack adds the weekly star charts for ages 5 to 7 and 8 to 11 that earn the tokens in the first place.',
    thanks: `If a token handed over ends a screen time argument in your house, ${REVIEW}` },
}
// The older games: their three product PDFs, and the lines of the new last page.
const SWAP = {
  'a-to-z-showdown': { files: ['a-to-z-showdown-A4.pdf', 'a-to-z-showdown-USLetter.pdf', 'a-to-z-showdown-A4-ink-friendly.pdf'],
    intro: 'You raced the alphabet. Keep the score sheets in the box: in a month you will see the greens grow, and that is the best kind of winning.',
    thanks: `If the wheel came out again the next night, ${REVIEW}` },
  'ice-cream-shop': { files: ['ice-cream-shop-A4.pdf', 'ice-cream-shop-USLetter.pdf', 'ice-cream-shop-A4-ink-friendly.pdf'],
    intro: 'The ice cream shop is open. Let your child run the till as often as they like: the one behind the counter does the counting, and that is where the learning lives.',
    thanks: `If the shop filled a rainy afternoon and sneaked in some coin practice, ${REVIEW}` },
  'school-year-planner': { files: ['school-year-planner-A4.pdf', 'school-year-planner-USLetter.pdf', 'school-year-planner-A4-ink-friendly.pdf'],
    intro: 'Your year is planned. Print a fresh homework page whenever one fills up, and keep the planner where your child can reach it without asking.',
    thanks: `If this planner makes the school week a little calmer, ${REVIEW}` },
  'word-fishing': { files: ['word-fishing-A4.pdf', 'word-fishing-USLetter.pdf', 'word-fishing-A4-ink-friendly.pdf'],
    intro: 'You caught the words. Five minutes of fishing a day beats an hour on Sunday, so leave the pond where your child can find it.',
    thanks: `If your kitchen became a fishing lake, ${REVIEW}` },
}

const which = process.argv[2]
const slugs = which === 'all' ? [...Object.keys(SPIN), ...Object.keys(SWAP)] : [which]
if (!which || slugs.some(s => !SPIN[s] && !SWAP[s])) {
  console.error('Usage: node cut-pack.mjs <all|' + [...Object.keys(SPIN), ...Object.keys(SWAP)].join('|') + '>')
  process.exit(1)
}

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined })
const host = await browser.newPage()
await host.goto('file://' + join(ROOT, 'calm-down-kit/print.html'))
await host.evaluate(() => document.fonts.ready)
// The three renders of the last page: A4, US Letter, ink friendly.
const finishPages = async ({ intro, thanks }) => {
  await host.evaluate(o => {
    document.querySelectorAll('.sheet').forEach(s => { if (!('finish' in s.dataset)) s.remove() })
    const el = document.querySelector('[data-finish]')
    el.dataset.finish = JSON.stringify({ pack: '', noun: '', pages: [], ...o })
    el.innerHTML = ''
  }, { intro, thanks })
  await host.addScriptTag({ path: join(ROOT, 'pack-finish.js') })
  await host.waitForFunction(() => [...document.images].every(i => i.complete))
  await host.waitForTimeout(300)
  const pdf = async (ink, letter) => {
    await host.evaluate(ink => document.body.classList.toggle('ink', ink), ink)
    await host.evaluate(letter => {
      document.getElementById('letter-page')?.remove()
      if (letter) document.head.insertAdjacentHTML('beforeend', '<style id="letter-page">@page{size:215.9mm 279.4mm;margin:0 0 0 9.25mm;}</style>')
    }, letter)
    await host.waitForTimeout(200)
    return host.pdf(letter
      ? { printBackground: true, width: '215.9mm', height: '279.4mm', scale: 0.94, margin: { left: '9.25mm', top: '0mm', right: '0mm', bottom: '0mm' } }
      : { printBackground: true, format: 'A4' })
  }
  return [await pdf(false, false), await pdf(false, true), await pdf(true, false)] // A4, Letter, ink
}

const assemble = async (srcFile, pageNumbers, finishBytes, title) => {
  const src = await PDFDocument.load(readFileSync(srcFile))
  const out = await PDFDocument.create()
  const idx = pageNumbers ?? src.getPageIndices().slice(0, -1).map(i => i + 1) // a swap keeps all but the last
  for (const p of await out.copyPages(src, idx.map(n => n - 1))) {
    p.node.delete(PDFName.of('Annots')) // no orphaned form fields
    out.addPage(p)
  }
  const fin = await PDFDocument.load(finishBytes)
  out.addPage((await out.copyPages(fin, [0]))[0])
  out.setTitle(title); out.setAuthor('Guided Childhood'); out.setCreator('Guided Childhood')
  return out.save()
}

for (const slug of slugs) {
  const cfg = SPIN[slug] ?? SWAP[slug]
  const fin = await finishPages(cfg)
  mkdirSync(join(ROOT, slug, 'product'), { recursive: true })
  if (SPIN[slug]) {
    const names = ['A4', 'USLetter', 'A4-ink-friendly']
    for (const [i, n] of names.entries()) {
      const bytes = await assemble(join(ROOT, cfg.parent, 'product', `${cfg.parent}-${n}.pdf`), cfg.pages, fin[i], slug)
      writeFileSync(join(ROOT, slug, 'product', `${slug}-${n}.pdf`), bytes)
    }
    console.log(slug, 'cut from', cfg.parent, 'pages', cfg.pages.join(', '), 'plus the thank you page')
  } else {
    for (const [i, f] of cfg.files.entries()) {
      const file = join(ROOT, slug, 'product', f)
      writeFileSync(file, await assemble(file, null, fin[i], slug))
    }
    console.log(slug, 'last page swapped for the thank you page')
  }
  execFileSync(process.execPath, [join(ROOT, 'pdf-previews.mjs'), slug, SPIN[slug] ? `${slug}-A4.pdf` : cfg.files[0]], { stdio: 'inherit' })
}
await browser.close()
