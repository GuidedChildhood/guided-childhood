// THE PUBLICATION PACKAGE.
//
// Everything an edition goes out with, made from the approved issue and its
// distribution words (issues/<NNN>/distribution.json), into
// issues/<NNN>/package/:
//
//   landing.md                  the website page copy
//   email.html, email.txt       the campaign, for Mailchimp or Resend
//   school-email.md             the note to heads and DSLs
//   captions.md                 LinkedIn (with its first comment), Instagram, Facebook
//   alt-text.md                 every picture's alt text, for every channel
//   video-scripts.md            the trailer, three teasers, Bloop's explainer
//   social/ig-01.png ... 07     the 1080 by 1350 carousel (Instagram, and
//                               Facebook as a single first card)
//   social/linkedin-carousel.pdf  the same cards as a LinkedIn document post
//   social/square.png           1080 by 1080 for where a square is wanted
//   social/story.png            1080 by 1920
//   social/linkedin-launch.png  1200 by 627 landscape
//   motion/cover-reveal-*.mp4   the cover reveal, made in code (motion.ts)
//   checklist.md                what happens next, channel by channel
//
// It REFUSES to build unless the issue is FINAL APPROVED or PUBLISHED and the
// approved hashes match the files on disk, because a package is the thing
// that goes out. Every caption is marked DRAFT until it passes
// drive-post-review: the package prepares, Justin posts.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { esc, pad3, plain } from '../engine/html'
import { contentHash, sha256 } from '../engine/hash'
import { PUB, ROOT } from '../engine/library'
import { DESTINATIONS, type Issue, type Page } from '../engine/schema'
import { artSlots, copyStrings } from '../engine/validate'
import { issueDir, loadIssue } from '../pdf-engine/render'
import type { Store } from '../engine/store'
import { current } from '../engine/workflow'
import { renderMotion } from './motion'

type Words = {
  email: { subject: string; preview: string; intro: string; why: string; signoff: string }
  landing: { title: string; standfirst: string; body: string[] }
  school: { subject: string; body: string[]; signoff: string }
  social: { linkedin: string; linkedinFirstComment: string; instagram: string; facebook: string }
  scripts: { name: string; seconds: number; beats: string[] }[]
}

const EXEC = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

export async function buildPackage(n: number, store: Store, opts: { force?: 'sample' } = {}) {
  const issue = loadIssue(n)
  const dir = issueDir(n)
  const NNN = pad3(n)
  const pdf = join(dir, 'dist', `guided-planet-${NNN}.pdf`)
  if (!existsSync(pdf)) throw new Error(`render issue ${n} first`)
  const st = await current(store, n)
  if (opts.force !== 'sample') {
    if (st.state !== 'FINAL_APPROVED' && st.state !== 'PUBLISHED') throw new Error(`issue ${n} is ${st.state}. The package is built after final approval, never before.`)
    if (st.approvedContentHash !== contentHash(issue)) throw new Error('the issue has changed since final approval')
    if (st.approvedPdfHash !== sha256(readFileSync(pdf))) throw new Error('the PDF has changed since final approval')
  }
  const words: Words = JSON.parse(readFileSync(join(dir, 'distribution.json'), 'utf8'))
  const out = join(dir, opts.force === 'sample' ? 'package-preview' : 'package')
  mkdirSync(join(out, 'social'), { recursive: true })
  mkdirSync(join(out, 'motion'), { recursive: true })

  const stories = storyLines(issue)
  const downloadUrl = `${issue.onlineUrl}/guided-planet-${NNN}.pdf`
  const draft = '> DRAFT. Not ready until it has passed .claude/skills/content-engine/drive-post-review.md.\n\n'

  writeFileSync(join(out, 'landing.md'), `${draft}# ${words.landing.title}\n\n## Issue ${NNN}: ${issue.edition}, ${issue.month}\n\n${words.landing.standfirst}\n\n${words.landing.body.join('\n\n')}\n\n## Inside\n\n${stories.map(s => `- Page ${s.page}: ${s.title}`).join('\n')}\n\n[Download the paper (PDF)](${downloadUrl}) · [Ink saver version](${issue.onlineUrl}/guided-planet-${NNN}-ink.pdf) · [Read it online](${issue.onlineUrl}/) · [Every source](${issue.onlineUrl}/sources/)\n`)

  writeFileSync(join(out, 'email.html'), emailHtml(issue, words, stories, downloadUrl))
  writeFileSync(join(out, 'email.txt'), `${words.email.subject}\n\n${words.email.intro}\n\n${stories.map(s => `Page ${s.page}: ${s.title}`).join('\n')}\n\n${words.email.why}\n\nDownload: ${downloadUrl}\nRead online: ${issue.onlineUrl}/\n\n${words.email.signoff}\n`)
  writeFileSync(join(out, 'school-email.md'), `${draft}Subject: ${words.school.subject}\n\n${words.school.body.join('\n\n')}\n\nDownload: ${downloadUrl}\nSources for every fact: ${issue.onlineUrl}/sources/\n\n${words.school.signoff}\n`)
  writeFileSync(join(out, 'captions.md'), `${draft}# Captions, Issue ${NNN}\n\n## LinkedIn (Justin's voice, no link in the body)\n\n${words.social.linkedin}\n\n**First comment:** ${words.social.linkedinFirstComment.replace('LINK', downloadUrl)}\n\n## Instagram (the family account)\n\n${words.social.instagram}\n\n## Facebook (single image, the first card)\n\n${words.social.facebook.replace('LINK', downloadUrl)}\n`)
  writeFileSync(join(out, 'alt-text.md'), `# Alt text, Issue ${NNN}\n\n${issue.pages.flatMap(p => artSlots(p).map(a => `- **Page ${p.n}, ${a.slot}.** ${a.alt}`)).join('\n')}\n\n## Social cards\n\n${socialCards(issue).map((c, i) => `- **Card ${i + 1}.** ${c.alt}`).join('\n')}\n`)
  writeFileSync(join(out, 'video-scripts.md'), videoScripts(issue, words))

  await renderSocial(issue, out)
  await renderMotion(issue, join(dir, 'dist', 'cover.png'), join(out, 'motion'))
  writeFileSync(join(out, 'checklist.md'), checklist(issue, downloadUrl))

  // The package's own copy goes through the same dash and stock phrase guard.
  const copy = join(out, '.copy-check.md')
  writeFileSync(copy, [words.email.intro, words.email.why, ...words.landing.body, words.landing.standfirst, ...words.school.body, words.social.linkedin, words.social.instagram, words.social.facebook, ...words.scripts.flatMap(s => s.beats)].join('\n\n') + '\n')
  execFileSync('node', [join(ROOT, 'scripts/check-ai-tells.mjs'), copy], { stdio: 'inherit' })
  return out
}

function storyLines(issue: Issue) {
  return issue.pages.filter(p => p.n > 2).map(p => ({ page: p.n, title: 'headline' in p ? plain(p.headline) : '', destination: 'destination' in p ? p.destination : undefined }))
}

function emailHtml(issue: Issue, w: Words, stories: ReturnType<typeof storyLines>, url: string) {
  // Email safe: tables, inline styles, system fonts after Nunito, no script.
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(w.email.subject)}</title></head>
<body style="margin:0;background:#F9F8F6;color:#1A1A2E;font-family:Nunito,Arial,sans-serif">
<span style="display:none;max-height:0;overflow:hidden">${esc(w.email.preview)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9F8F6"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px">
<tr><td style="padding:28px 28px 8px"><p style="margin:0;font:600 12px/1.3 'IBM Plex Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:#7A5A0E">Issue ${pad3(issue.number)} · ${esc(issue.month)}</p>
<h1 style="margin:6px 0 0;font:900 34px/1 Nunito,Arial,sans-serif">The Guided Planet</h1></td></tr>
<tr><td style="padding:12px 28px"><img src="${esc(issue.onlineUrl)}/cover.png" width="544" alt="The cover of The Guided Planet Issue ${pad3(issue.number)}: ${esc(issue.coverHeadline)}" style="display:block;width:100%;height:auto;border-radius:12px"></td></tr>
<tr><td style="padding:8px 28px;font-size:17px;line-height:1.55"><p>${esc(w.email.intro)}</p>
<ul style="padding-left:20px">${stories.map(s => `<li>${esc(s.title)} <span style="color:#65657C">(page ${s.page})</span></li>`).join('')}</ul>
<p>${esc(w.email.why)}</p>
<p style="margin:24px 0"><a href="${esc(url)}" style="display:inline-block;background:#EDC35F;color:#1A1A2E;font-weight:800;text-decoration:none;padding:14px 20px;border-radius:16px;box-shadow:0 5px 0 #C99A28">Download the paper</a></p>
<p><a href="${esc(issue.onlineUrl)}/" style="color:#1A1A2E">Read it online</a> · <a href="${esc(issue.onlineUrl)}/sources/" style="color:#1A1A2E">Every source</a></p>
<p>${esc(w.email.signoff)}</p></td></tr>
<tr><td style="padding:16px 28px 28px;font-size:13px;color:#52526A">The Guided Planet is made by The Guided Digital Childhood. *|LIST:ADDRESSLINE|* · <a href="*|UNSUB|*" style="color:#52526A">Unsubscribe</a></td></tr>
</table></td></tr></table></body></html>`
}

// ── THE SOCIAL CARDS ────────────────────────────────────────────────────────
// brand/GDC_SOCIAL_VISUAL_SYSTEM.md format 3: cream, editorial, the REAL page
// preview as the hero, one gold detail, 88px padding so the 3:4 grid crop
// never touches anything meaningful, and a last card that asks for a save and
// a send rather than a click.

type Card = { eyebrow: string; title: string; body?: string; image?: string; alt: string; last?: boolean }

function socialCards(issue: Issue): Card[] {
  const pick = (n: number) => issue.pages.find(p => p.n === n) as Page
  const lead = issue.pages.filter(p => ['feature', 'showcase', 'research', 'investigation', 'activity'].includes(p.template) && p.n !== 5 && p.n !== 11).slice(0, 5)
  return [
    { eyebrow: `Issue ${pad3(issue.number)} · ${issue.month}`, title: issue.coverHeadline, body: 'A free newspaper for children 7 to 12, and the grown ups who read with them.', image: 'pages/page-01.png', alt: `The cover of The Guided Planet, Issue ${pad3(issue.number)}. ${(pick(1) as Extract<Page, { template: 'cover' }>).art.alt}` },
    ...lead.map(p => ({ eyebrow: `Page ${p.n} · ${'destination' in p && p.destination ? DESTINATIONS[p.destination].name : ''}`, title: 'headline' in p ? plain(p.headline) : '', body: 'standfirst' in p ? plain(p.standfirst) : undefined, image: `pages/page-${String(p.n).padStart(2, '0')}.png`, alt: `Page ${p.n} of the paper: ${'headline' in p ? plain(p.headline) : ''}.` })),
    { eyebrow: 'Free to print', title: 'Save it for the weekend. Send it to the family whose kids love space.', body: 'Twelve pages. No phone or account needed for any activity.', alt: 'A closing card asking you to save the post for the weekend and send it to a family whose children love space.', last: true },
  ]
}

async function renderSocial(issue: Issue, out: string) {
  const dist = join(issueDir(issue.number), 'dist')
  const font = pathToFileURL(join(ROOT, 'app', 'fonts')).href
  const css = `@font-face{font-family:Nunito;src:url('${font}/nunito-latin-wght-normal.woff2');font-weight:200 1000}
@font-face{font-family:'IBM Plex Mono';src:url('${font}/ibm-plex-mono-latin-600-normal.woff2');font-weight:600}
*{box-sizing:border-box;margin:0}body{background:#F9F8F6;font-family:Nunito;color:#1A1A2E}
.card{width:1080px;height:1350px;padding:88px;display:flex;flex-direction:column;background:#F9F8F6;position:relative;overflow:hidden}
.eyebrow{font:600 24px/1 'IBM Plex Mono';letter-spacing:.14em;text-transform:uppercase;color:#7A5A0E}
h1{font:900 76px/1 Nunito;letter-spacing:-.03em;margin-top:22px;text-wrap:balance}
p.body{font:600 32px/1.35 Nunito;color:#52526A;margin-top:22px;text-wrap:pretty}
.hero{flex:1;min-height:0;margin-top:44px;display:flex;align-items:flex-start;justify-content:center}
.hero img{max-height:100%;max-width:100%;border-radius:18px;box-shadow:0 14px 40px rgba(26,26,46,.22);border:2px solid #1A1A2E}
.foot{display:flex;justify-content:space-between;align-items:center;margin-top:36px;font:600 22px/1 'IBM Plex Mono';letter-spacing:.12em;text-transform:uppercase;color:#52526A}
.gold{position:absolute;left:88px;right:88px;bottom:150px;height:6px;background:repeating-linear-gradient(90deg,#EDC35F 0 6px,transparent 6px 22px);border-radius:3px}
.last{background:#1A1A2E;color:#F9F8F6}.last h1{color:#F9F8F6;font-size:84px}.last p.body{color:rgba(249,248,246,.85)}.last .eyebrow{color:#EDC35F}.last .foot{color:rgba(249,248,246,.7)}`
  const page = (c: Card) => `<div class="card${c.last ? ' last' : ''}"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${esc(c.title)}</h1>${c.body ? `<p class="body">${esc(c.body)}</p>` : ''}
    ${c.image ? `<div class="hero"><img src="${pathToFileURL(join(dist, c.image)).href}" alt="${esc(c.alt)}"></div>` : '<div style="flex:1"></div><div class="gold"></div>'}
    <div class="foot"><span>The Guided Planet</span><span>guidedchildhood.com</span></div></div>`
  const cards = socialCards(issue)
  const browser = await chromium.launch(existsSync(EXEC) ? { executablePath: EXEC } : {})
  const tab = await browser.newPage({ viewport: { width: 1080, height: 1350 } })
  const html = (body: string) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`
  const tmp = join(out, '.cards.html')
  writeFileSync(tmp, html(cards.map(page).join('')))
  await tab.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
  await tab.evaluate(() => document.fonts.ready)
  const els = tab.locator('.card')
  for (let i = 0; i < cards.length; i++) await els.nth(i).screenshot({ path: join(out, 'social', `ig-${String(i + 1).padStart(2, '0')}.png`) })
  await tab.addStyleTag({ content: '@page{size:1080px 1350px;margin:0}' })
  await tab.pdf({ path: join(out, 'social', 'linkedin-carousel.pdf'), width: '1080px', height: '1350px', printBackground: true })
  // The other shapes: the cover card re cut to square, story and landscape.
  for (const [name, w, h] of [['square', 1080, 1080], ['story', 1080, 1920], ['linkedin-launch', 1200, 627]] as const) {
    await tab.setViewportSize({ width: w, height: h })
    const landscape = w > h
    writeFileSync(tmp, html(`<div class="card" style="width:${w}px;height:${h}px;padding:${landscape ? 56 : 88}px;${landscape ? 'flex-direction:row;gap:48px;align-items:center' : ''}">
      <div style="${landscape ? 'flex:1' : ''}"><p class="eyebrow">Issue ${pad3(issue.number)} · ${esc(issue.month)}</p><h1 style="${landscape ? 'font-size:64px' : ''}">${esc(issue.coverHeadline)}</h1><p class="body" style="${landscape ? 'font-size:26px' : ''}">A free newspaper for children 7 to 12.</p></div>
      <div class="hero" style="${landscape ? 'margin:0;height:100%;flex:none;width:400px' : ''}"><img src="${pathToFileURL(join(dist, 'pages', 'page-01.png')).href}" alt=""></div>
      ${landscape ? '' : '<div class="foot"><span>The Guided Planet</span><span>guidedchildhood.com</span></div>'}</div>`))
    await tab.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
    await tab.evaluate(() => document.fonts.ready)
    await tab.locator('.card').first().screenshot({ path: join(out, 'social', `${name}.png`) })
  }
  await browser.close()
  execFileSync('rm', ['-f', tmp])
}

function videoScripts(issue: Issue, w: Words) {
  const cover = issue.pages[0] as Extract<Page, { template: 'cover' }>
  const stories = storyLines(issue).filter(s => [3, 4, 6, 7, 9].includes(s.page))
  return `# Video scripts, Issue ${pad3(issue.number)}

Silent format rules apply (.claude/skills/silent-ugc): the text does the work, no voice needed, no synthetic person, and the last frame is the free download. Bloop is the approved cutout animated in code, never generated.

## The animated cover reveal (made, in motion/)
Eight seconds. The masthead settles, the night sky fades up, the space station glides in, Bloop rises onto the hill, the headline lands: "${esc(cover.headline)}". Rendered from the real cover by publishing/distribution/motion.ts in 9:16, 1:1 and 16:9 at zero credits.

## The 30 second trailer
Concept: Bloop looks up at the International Space Station as The Guided Planet unfolds to reveal its five stories.

| Time | Picture | Text on screen |
| --- | --- | --- |
| 0 to 4s | Night sky over the Guided Planet. Bloop on the hill, looking up. The station glides across. | The good side of screens. |
${stories.map((s, i) => `| ${4 + i * 4} to ${8 + i * 4}s | The paper unfolds to page ${s.page}. | ${esc(s.title)} |`).join('\n')}
| 24 to 30s | The paper folds back to the cover. | Free to print. Issue ${pad3(issue.number)} of The Guided Planet. |

Production: the unfold is our own pages, so it is built in code from the page previews (no generated pages, ever). A Higgsfield sky plate behind the opening shot is optional and needs a credit budget.

${w.scripts.map(s => `## ${s.name} (${s.seconds}s)\n\n${s.beats.map((b, i) => `${i + 1}. ${b}`).join('\n')}`).join('\n\n')}

## Bloop's digital literacy explainer (45s)
1. Bloop, thinking pose, beside the recommendation machine from page 8. Text: Who chose the next video?
2. Signals drop in one at a time: watched, liked, skipped, searched. Text: It uses the clues you leave.
3. The machine hums, a card slides out: NEXT UP? Text: Then it makes a guess.
4. Text: You still hold the play button.
5. Paper cards on a table. Text: Play Become the Algorithm. Free paper, page 9.
`
}

function checklist(issue: Issue, url: string) {
  const NNN = pad3(issue.number)
  return `# Publishing Issue ${NNN}, channel by channel

Nothing here posts by itself. \`npm run planet -- publish ${issue.number} <channel>\` records each step against the approved PDF hash, and refuses to run a channel twice.

| Channel | How | What it needs |
| --- | --- | --- |
| Website | \`publish ${issue.number} website\` copies dist/online, the PDFs and the cover into public/guided-planet/${issue.slug}/ on a branch and opens a pull request. Merging it deploys. | Justin merges the pull request. |
| Google Drive | A Claude session uploads the package with the Google Drive connector into "Guided Childhood Research / The Guided Planet / Issue ${NNN}". | The connector on the session. |
| Email | \`publish ${issue.number} mailchimp\` creates a DRAFT campaign from email.html; Justin presses send in Mailchimp. Or Resend, through sendEmail, which keeps the one email a week floor. | MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID, or a decision to use Resend. |
| LinkedIn | Justin posts linkedin-carousel.pdf as a document with the caption; the link goes in the first comment. | Justin. |
| Instagram | Justin posts ig-01 to ig-07 as a carousel with the caption; link in bio. | Justin. |
| Facebook | Justin posts ig-01.png as a single image with the caption. | Justin. |
| Schools | school-email.md, sent from Justin's own address to the schools list. | Justin. |

Download link once the website step merges: ${url}
`
}

export const _test = { socialCards, storyLines, copyStrings }
