// THE RENDERER. One command turns an issue file into everything an edition
// ships as:
//
//   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs \
//     publishing/cli.ts render 1
//
// into publishing/issues/<NNN>/dist/:
//   guided-planet-<NNN>-print.pdf   print ready: 3mm bleed, full resolution art
//   guided-planet-<NNN>.pdf         the download: A4, lighter art, small file
//   guided-planet-<NNN>-ink.pdf     print friendly: white paper, light skies
//   guided-planet-<NNN>-sources.pdf the companion: every source in full
//   cover.png, pages/page-NN.png    previews for the dashboard, email and social
//   online/index.html               the accessible reading edition
//   online/sources/index.html       the source appendix, linked from page 12
//   report.json                     every check, passed or failed
//   manifest.json                   sha256 of every file, and the content hash
//
// WHY CHROMIUM, AND WHY NOT PAGED.JS. A newspaper page is designed, not
// poured: every page has a fixed set of boxes. Chromium's print to PDF keeps
// text as text (selectable, searchable), embeds the fonts, keeps the vector
// art as vector, and honours @page sizes for the bleed. Paged.js solves flowing
// long text across pages, which this paper never does, and would add a
// dependency and a second layout model. Playwright is already in the repo for
// the free printables (scripts/render-free-printables.mjs), which is the same
// decision made once before. Recorded in publishing/ARCHITECTURE.md.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import QRCode from 'qrcode'
import { chromium, type Browser } from 'playwright'
import { pad3 } from '../engine/html'
import { assetIdFor, PUB, resolveFriends, ROOT } from '../engine/library'
import { contentHash } from '../engine/hash'
import { PAGE_COUNT, type FriendRef, type Issue } from '../engine/schema'
import { validateIssue, type Finding } from '../engine/validate'
import { renderIssue, type RenderContext } from '../templates/index'
import { renderOnline, renderSourcesPage } from '../templates/online'
import { layoutChecks, type LayoutFinding } from './checks'

export const A4 = { w: 210, h: 297 }
const MM_TO_PT = 72 / 25.4
const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

export const issueDir = (n: number) => join(PUB, 'issues', pad3(n))

export function loadIssue(n: number): Issue {
  return JSON.parse(readFileSync(join(issueDir(n), 'issue.json'), 'utf8'))
}

export function allFriends(issue: Issue): FriendRef[] {
  return issue.pages.flatMap(p => ('friend' in p && p.friend ? [p.friend] : []))
}

// An approved generated picture for a slot, if Justin has approved one:
// issues/<NNN>/assets/approved/<slot>.(png|jpg|webp). See higgsfield/README.md.
function approvedArtFor(n: number) {
  const dir = join(issueDir(n), 'assets', 'approved')
  const files = existsSync(dir) ? readdirSync(dir) : []
  return (slot: string) => {
    const f = files.find(x => x.replace(/\.(png|jpe?g|webp)$/, '') === slot)
    return f ? pathToFileURL(join(dir, f)).href : null
  }
}

export async function qrMap(issue: Issue): Promise<Map<string, string>> {
  const urls = issue.pages.flatMap(p => p.template === 'passport' ? [p.sourcesUrl, p.grownUps.url] : [])
  const out = new Map<string, string>()
  for (const u of urls) out.set(u, await QRCode.toString(u, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1A1A2E', light: '#FFFFFF' } }))
  return out
}

export type Variant = 'print' | 'download' | 'ink'

export async function buildHtml(issue: Issue, variant: Variant, bleedMm: number, qrs: Map<string, string>) {
  const friendFiles = await resolveFriends(allFriends(issue), variant === 'print' ? 'print' : 'light')
  const theme = issue.theme ?? 'editorial'
  const sheets = ['newspaper.css', ...(theme === 'boho' ? ['boho.css'] : [])]
  const css = sheets.map(f => readFileSync(join(PUB, 'design', f), 'utf8')).join('\n').replaceAll('FONT_DIR', pathToFileURL(join(ROOT, 'app', 'fonts')).href).replaceAll('DESIGN_DIR', pathToFileURL(join(PUB, 'design')).href)
  const ctx: RenderContext = {
    issue,
    ink: variant === 'ink',
    theme,
    friendSrc: f => pathToFileURL(friendFiles.get(assetIdFor(f)) as string).href,
    approvedArt: approvedArtFor(issue.number),
    qr: u => { const s = qrs.get(u); if (!s) throw new Error(`no QR made for ${u}`); return s },
  }
  return renderIssue(ctx, css, { bleedMm })
}

const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex')

export type RenderReport = {
  issue: string; contentHash: string; renderedAt: string
  editorial: Finding[]
  layout: Record<Variant, LayoutFinding[]>
  pdf: { file: string; pages: number; pageSizePt: [number, number]; fontsEmbedded: boolean; fonts: string[]; bytes: number; ok: boolean; problems: string[] }[]
  images: { page: number; src: string; dpi: number }[]
  qrs: { url: string; ok: boolean }[]
  ok: boolean
}

export async function renderEdition(n: number, opts: { browser?: Browser; previews?: boolean } = {}): Promise<RenderReport> {
  const issue = loadIssue(n)
  const editorial = validateIssue(issue)
  const blocking = editorial.filter(f => f.level === 'error')
  const dist = join(issueDir(n), 'dist')
  const NNN = pad3(n)
  if (blocking.length) {
    const report: RenderReport = { issue: issue.slug, contentHash: contentHash(issue), renderedAt: new Date().toISOString(), editorial, layout: { print: [], download: [], ink: [] }, pdf: [], images: [], qrs: [], ok: false }
    mkdirSync(dist, { recursive: true })
    writeFileSync(join(dist, 'report.json'), JSON.stringify(report, null, 2))
    return report
  }

  rmSync(dist, { recursive: true, force: true })
  mkdirSync(join(dist, 'pages'), { recursive: true })
  mkdirSync(join(dist, 'online', 'sources'), { recursive: true })
  const qrs = await qrMap(issue)
  const browser = opts.browser ?? await chromium.launch(existsSync(EXEC) ? { executablePath: EXEC } : {})
  const page = await browser.newPage({ viewport: { width: 1000, height: 1300 } })
  const layout: Record<Variant, LayoutFinding[]> = { print: [], download: [], ink: [] }
  let images: RenderReport['images'] = []
  let qrList: string[] = []

  const variants: { v: Variant; bleed: number; file: string }[] = [
    { v: 'print', bleed: 3, file: `guided-planet-${NNN}-print.pdf` },
    { v: 'download', bleed: 0, file: `guided-planet-${NNN}.pdf` },
    { v: 'ink', bleed: 0, file: `guided-planet-${NNN}-ink.pdf` },
  ]
  for (const { v, bleed, file } of variants) {
    const html = await buildHtml(issue, v, bleed, qrs)
    const htmlPath = join(dist, `.${v}.html`)
    writeFileSync(htmlPath, html)
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForFunction(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0), null, { timeout: 30000 })
    await page.emulateMedia({ media: 'print' })
    // Print wants 220 dpi or better and refuses under 150. The download and the
    // ink saver use the lighter art on purpose, so they are held to screen
    // and home printer standards instead.
    const dpi = v === 'print' ? { minDpi: 150, warnDpi: 220 } : { minDpi: 96, warnDpi: 150 }
    const res = await page.evaluate(layoutChecks, { safeMm: 12, minBodyPt: 10, minAnyPt: 5.2, ...dpi })
    layout[v] = res.findings
    if (res.pages !== PAGE_COUNT) layout[v].push({ level: 'error', page: 0, rule: 'page-count', detail: `${res.pages} pages laid out` })
    if (v === 'print') { images = res.images; qrList = res.qrs }
    await page.pdf({ path: join(dist, file), preferCSSPageSize: true, printBackground: true, tagged: true, outline: false })
    await page.emulateMedia({ media: 'screen' })
    if (v === 'download') {
      if (opts.previews !== false) {
        const sections = page.locator('section.page')
        for (let i = 0; i < PAGE_COUNT; i++) {
          await sections.nth(i).screenshot({ path: join(dist, 'pages', `page-${String(i + 1).padStart(2, '0')}.png`) })
        }
      }
    }
  }

  // The cover at twice the resolution, for email headers and social.
  if (opts.previews !== false) {
    const big = await browser.newPage({ viewport: { width: 1000, height: 1300 }, deviceScaleFactor: 2 })
    await big.goto(pathToFileURL(join(dist, '.download.html')).href, { waitUntil: 'load' })
    await big.evaluate(() => document.fonts.ready)
    await big.waitForFunction(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0))
    await big.locator('section.page').first().screenshot({ path: join(dist, 'cover.png') })
    await big.close()
  }

  // The accessible online edition and the source appendix, plus the
  // appendix as its own PDF companion.
  writeFileSync(join(dist, 'online', 'index.html'), renderOnline(issue))
  writeFileSync(join(dist, 'online', 'sources', 'index.html'), renderSourcesPage(issue))
  await page.goto(pathToFileURL(join(dist, 'online', 'sources', 'index.html')).href, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.pdf({ path: join(dist, `guided-planet-${NNN}-sources.pdf`), format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' }, printBackground: true, tagged: true })
  await page.close()
  if (!opts.browser) await browser.close()

  const pdf = variants.map(({ v, bleed, file }) => pdfFacts(join(dist, file), bleed, v))
  const qrsChecked = qrList.map(url => ({ url, ok: qrs.has(url) && /^https:\/\/(www\.)?guidedchildhood\.com\//.test(url) }))
  const report: RenderReport = {
    issue: issue.slug, contentHash: contentHash(issue), renderedAt: new Date().toISOString(),
    editorial, layout, pdf, images, qrs: qrsChecked,
    ok: editorial.every(f => f.level !== 'error') && Object.values(layout).every(l => l.every(f => f.level !== 'error')) && pdf.every(p => p.ok) && qrsChecked.every(q => q.ok),
  }
  for (const f of readdirSync(dist)) if (f.startsWith('.') && f.endsWith('.html')) rmSync(join(dist, f))
  writeFileSync(join(dist, 'report.json'), JSON.stringify(report, null, 2) + '\n')
  writeFileSync(join(dist, 'manifest.json'), JSON.stringify(distManifest(dist, report.contentHash), null, 2) + '\n')
  return report
}

// pdfinfo and pdffonts (poppler) read the PDF the way a printer will.
function pdfFacts(file: string, bleed: number, v: Variant) {
  const problems: string[] = []
  const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' })
  const pages = Number((info.match(/Pages:\s+(\d+)/) ?? [])[1])
  const size = (info.match(/Page size:\s+([\d.]+) x ([\d.]+)/) ?? []).slice(1).map(Number) as [number, number]
  const want = [(A4.w + 2 * bleed) * MM_TO_PT, (A4.h + 2 * bleed) * MM_TO_PT]
  if (pages !== PAGE_COUNT) problems.push(`${pages} pages, expected ${PAGE_COUNT}`)
  if (Math.abs(size[0] - want[0]) > 1.5 || Math.abs(size[1] - want[1]) > 1.5) problems.push(`page is ${size.join(' x ')}pt, expected ${want.map(x => x.toFixed(1)).join(' x ')}pt`)
  const fontsOut = execFileSync('pdffonts', [file], { encoding: 'utf8' }).split('\n').slice(2).filter(Boolean)
  const fonts = fontsOut.map(l => l.split(/\s+/)[0])
  const embedded = fontsOut.every(l => / yes\s+(yes|no)\s+(yes|no)\s+\d+\s+\d+\s*$/.test(l) || /\byes\b.*\byes\b/.test(l))
  if (!embedded) problems.push('a font is not embedded')
  if (!fonts.some(f => /Nunito/i.test(f))) problems.push('Nunito is not in the PDF')
  if (!fonts.some(f => /Plex/i.test(f))) problems.push('IBM Plex Mono is not in the PDF')
  const bytes = statSync(file).size
  if (v === 'download' && bytes > 12 * 1024 * 1024) problems.push(`download is ${(bytes / 1048576).toFixed(1)} MB, over the 12 MB email friendly ceiling`)
  return { file: file.split('/').pop() as string, pages, pageSizePt: size, fontsEmbedded: embedded, fonts: [...new Set(fonts.map(f => f.replace(/^[A-Z]{6}\+/, '')))], bytes, ok: problems.length === 0, problems }
}

function distManifest(dist: string, content: string) {
  const files: Record<string, { sha256: string; bytes: number }> = {}
  const walk = (d: string, rel = '') => {
    for (const f of readdirSync(d)) {
      const p = join(d, f), r = rel ? `${rel}/${f}` : f
      if (statSync(p).isDirectory()) walk(p, r)
      else if (f !== 'manifest.json') files[r] = { sha256: sha(p), bytes: statSync(p).size }
    }
  }
  walk(dist)
  return { contentHash: content, files }
}

export function printSummary(r: RenderReport) {
  const all = [...r.editorial.map(f => ({ ...f, where: 'editorial' })), ...Object.entries(r.layout).flatMap(([v, l]) => l.map(f => ({ ...f, where: v })))]
  for (const f of all) console.log(`${f.level === 'error' ? 'FAIL' : 'warn'}  [${f.where}] p${f.page ?? '-'} ${f.rule}: ${f.detail}`)
  for (const p of r.pdf) console.log(`${p.ok ? 'PASS' : 'FAIL'}  ${p.file}: ${p.pages} pages, ${p.pageSizePt.map(x => x.toFixed(1)).join('x')}pt, ${(p.bytes / 1048576).toFixed(2)} MB, fonts ${p.fonts.join(', ')}${p.problems.length ? '  ' + p.problems.join('; ') : ''}`)
  for (const q of r.qrs) console.log(`${q.ok ? 'PASS' : 'FAIL'}  QR ${q.url}`)
  console.log(r.ok ? `\nPASS  ${r.issue} rendered clean (content ${r.contentHash.slice(0, 12)})` : `\nFAIL  ${r.issue} has problems to fix before it can go to proof`)
}
