// THE ACCESSIBLE ONLINE EDITION.
//
// The same issue file, written out as one plain, semantic web page: real
// headings in order, every picture with its alt text, every activity as text a
// screen reader can follow, every citation a link to its source. No layout
// tricks, one column, readable at 200 percent zoom and on a phone at 320px.
// It is also what the website page and the email link to, so it carries the
// whole paper rather than a teaser.
//
// Its own small stylesheet uses the same tokens as the print design system.

import { DESTINATIONS, type Activity, type Block, type Issue, type Page } from '../engine/schema'
import { esc, pad3, plain } from '../engine/html'

const CSS = `
:root{--cream:#F9F8F6;--ink:#1A1A2E;--ink-soft:#52526A;--butter:#EDC35F;--gold-ink:#7A5A0E;--tint:#FFF6DE;--rule:#D9D5CC}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--cream:#16162A;--ink:#F3F1EC;--ink-soft:#C9C7D6;--gold-ink:#EDC35F;--tint:#2A2618;--rule:#3A3A55}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--cream);color:var(--ink);font:500 1.075rem/1.6 Nunito,system-ui,sans-serif}
a{color:inherit;text-decoration-color:var(--butter);text-decoration-thickness:.16em;text-underline-offset:.18em}
a:focus-visible{outline:3px solid var(--butter);outline-offset:2px}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:16px;background:var(--butter);color:#1A1A2E;padding:8px 12px;border-radius:10px}
main{max-width:42rem;margin:0 auto;padding:24px 16px 80px}
header.mast{border-bottom:3px solid var(--ink);padding-bottom:12px;margin-bottom:28px}
.eyebrow{font:600 .78rem/1.3 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-ink);margin:0 0 6px}
h1{font:900 clamp(2.2rem,8vw,3.4rem)/1 Nunito,system-ui,sans-serif;letter-spacing:-.03em;margin:0}
h2{font:900 clamp(1.5rem,5vw,2rem)/1.1 Nunito,system-ui,sans-serif;letter-spacing:-.015em;margin:0 0 8px}
h3{font:800 1.15rem/1.25 Nunito,system-ui,sans-serif;margin:20px 0 6px}
.standfirst{font-weight:600;font-size:1.15rem;color:var(--ink-soft)}
article{border-top:1px solid var(--rule);padding:32px 0}
.box{background:var(--tint);border-radius:16px;padding:14px 18px;margin:16px 0}
.box>:first-child{margin-top:0}
.says{border-left:4px solid var(--butter);padding:4px 0 4px 14px;font-weight:700}
.refs{font-size:.92rem;color:var(--ink-soft)}
.refs li{margin:4px 0}
sup a{font:700 .7rem "IBM Plex Mono",monospace;text-decoration:none;background:var(--ink);color:var(--cream);border-radius:99px;padding:1px 5px}
img{max-width:100%;height:auto;display:block;border-radius:16px}
.cta{display:inline-block;background:var(--butter);color:#1A1A2E;font-weight:800;text-decoration:none;padding:12px 18px;border-radius:16px;box-shadow:0 5px 0 #C99A28}
`

function cite(s: string, refs: string[]) {
  return esc(s).replace(/\[\[(s\d+)\]\]/g, (_m, id: string) => {
    const n = refs.indexOf(id) + 1
    return `<sup><a href="sources/#${id}" aria-label="source ${n || id}">${n || id}</a></sup>`
  })
}

const blocks = (bs: Block[], refs: string[]) => bs.map(b =>
  b.type === 'subhead' ? `<h3>${cite(b.text, refs)}</h3>` :
  b.type === 'list' ? `<ul>${b.items.map(i => `<li>${cite(i, refs)}</li>`).join('')}</ul>` :
  `<p>${cite(b.text, refs)}</p>`).join('\n')

function activity(a: Activity, refs: string[]) {
  const c = (s: string) => cite(s, refs)
  switch (a.kind) {
    case 'pixel-grid': return `<div class="box"><h3>${c(a.title)}</h3><p>${c(a.intro)}</p><p>You need an 8 by 8 grid: draw one with a ruler, eight squares across and eight down.</p><ol>${a.steps.map(s => `<li>${c(s)}</li>`).join('')}</ol><p>Colours: ${a.palette.map(p => esc(p.name)).join(', ')}.</p></div>`
    case 'blueprint': return `<div class="box"><h3>${c(a.title)}</h3><p>${c(a.intro)}</p><ol>${a.prompts.map(p => `<li><b>${esc(p.label)}.</b> ${c(p.hint)}</li>`).join('')}</ol></div>`
    case 'postcard': return `<div class="box"><h3>${c(a.title)}</h3><p>${c(a.intro)}</p><p>On the front: ${esc(a.front)}. On the back: a message. ${a.lines.map(c).join('. ')}.</p></div>`
    case 'card-game': return `<div class="box"><h3>${c(a.title)}</h3><p>Players: ${esc(a.players)}. You need: ${a.youNeed.map(esc).join(', ')}.</p><h3>Set up</h3><ol>${a.setup.map(s => `<li>${c(s)}</li>`).join('')}</ol><h3>Play</h3><ol>${a.rounds.map(s => `<li>${c(s)}</li>`).join('')}</ol><h3>The cards</h3><ul>${a.cards.map(k => `<li>${esc(k.label)} (${esc(k.topic)})</li>`).join('')}</ul><h3>Talk about it</h3><ul>${a.talk.map(t => `<li>${c(t)}</li>`).join('')}</ul></div>`
    case 'week': return `<div class="box"><ol>${a.days.map(d => `<li><b>${esc(d.day)}: ${c(d.title)}.</b> ${c(d.task)}</li>`).join('')}</ol>${a.reflect ? `<p>On day seven, talk about: ${a.reflect.map(esc).join('; ')}.</p>` : ''}</div>`
    case 'passport': return `<div class="box"><h3>${c(a.title)}</h3><p>${c(a.intro)}</p><ul>${a.stamps.map(s => `<li>${esc(s.label)} (page ${s.page})</li>`).join('')}</ul></div>`
  }
}

function friendLine(p: Page) {
  const f = 'friend' in p ? p.friend : undefined
  const t = 'friendSays' in p ? p.friendSays : p.template === 'welcome' ? p.bloopSays : undefined
  if (!f || !t) return ''
  const name = f.id === 'digi' ? 'DiGi' : f.id[0].toUpperCase() + f.id.slice(1)
  return `<p class="says">${esc(name)} says: ${esc(plain(t))}</p>`
}

function article(p: Page, issue: Issue): string {
  const refs: string[] = 'refs' in p ? p.refs : []
  const where = 'destination' in p && p.destination ? `<p class="eyebrow">Page ${p.n} · ${esc(DESTINATIONS[p.destination].name)}</p>` : `<p class="eyebrow">Page ${p.n}</p>`
  const refList = refs.length ? `<h3>Where this came from</h3><ol class="refs">${refs.map(id => { const s = issue.sources.find(x => x.id === id)!; return `<li><a href="${esc(s.url)}">${esc(s.org)}, ${esc(s.title)}</a>${s.published ? `, ${esc(s.published)}` : ''}</li>` }).join('')}</ol>` : ''
  const fig = (a: { alt: string }) => `<p><i>Picture: ${esc(a.alt)}</i></p>`
  switch (p.template) {
    case 'cover': return ''
    case 'welcome': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2>${blocks(p.letter, [])}<p><b>${esc(p.signoff.name)}</b>, ${esc(p.signoff.role)}</p>${fig(p.map)}${friendLine(p)}</article>`
    case 'feature': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, refs)}</p>${fig(p.art)}${blocks(p.body, refs)}${p.facts ? `<div class="box"><h3>Fact file</h3><ul>${p.facts.map(f => `<li><b>${cite(f.value, refs)}</b>: ${cite(f.label, refs)}${f.note ? ` (${esc(f.note)})` : ''}</li>`).join('')}</ul></div>` : ''}${friendLine(p)}${p.activity ? activity(p.activity, refs) : ''}${refList}</article>`
    case 'showcase': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, refs)}</p>${p.facts ? `<ul>${p.facts.map(f => `<li><b>${cite(f.value, refs)}</b> ${cite(f.label, refs)}</li>`).join('')}</ul>` : ''}${blocks(p.body, refs)}${p.projects.map(x => `<h3>${esc(x.name)}</h3><p><i>By ${esc(x.maker)}, ${esc(x.where)}</i></p><p>${cite(x.what, refs)} ${cite(x.why, refs)}</p>`).join('')}${refList}</article>`
    case 'activity': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, refs)}</p>${friendLine(p)}${activity(p.activity, refs)}${p.tips ? `<h3>${esc(p.tipsLabel ?? 'Tips')}</h3><ul>${p.tips.map(t => `<li>${cite(t, refs)}</li>`).join('')}</ul>` : ''}${refList}</article>`
    case 'research': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, refs)}</p>${p.kinds.map(k => `<h3>${esc(k.name)}</h3><p>${cite(k.examples, refs)} ${cite(k.says, refs)}</p>`).join('')}<h3>What the research found</h3>${blocks(p.found, refs)}<h3>What it cannot tell us yet</h3>${blocks(p.cannot, refs)}<div class="box"><h3>Talk about it together</h3><ol>${p.askTogether.map(q => `<li>${cite(q, refs)}</li>`).join('')}</ol></div>${friendLine(p)}${refList}</article>`
    case 'investigation': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, refs)}</p>${fig(p.art)}${p.clues.map((c, i) => `<h3>Clue ${i + 1}: ${cite(c.title, refs)}</h3><p>${cite(c.text, refs)}</p>`).join('')}${friendLine(p)}${blocks(p.body, refs)}<div class="box"><h3>Try this, no account needed</h3><ul>${p.tryThis.map(t => `<li>${cite(t, refs)}</li>`).join('')}</ul></div>${refList}</article>`
    case 'list': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, refs)}</p><ol>${p.items.map(x => `<li><h3><a href="${esc(x.url)}">${esc(x.name)}</a></h3><p>${cite(x.what, refs)} ${cite(x.why, refs)}</p><p>Who for: ${cite(x.who, refs)}. Account: ${cite(x.account, refs)}.${x.offline ? ` Offline: ${cite(x.offline, refs)}.` : ''}</p></li>`).join('')}</ol>${p.grownUps ? `<p><b>For grown ups.</b> ${cite(p.grownUps, refs)}</p>` : ''}${friendLine(p)}${refList}</article>`
    case 'passport': return `<article id="p${p.n}">${where}<h2>${esc(p.headline)}</h2><p class="standfirst">${cite(p.standfirst, [])}</p>${activity(p.activity, [])}<h3>Next month: ${esc(p.next.edition)}</h3><ul>${p.next.teasers.map(t => `<li>${esc(t)}</li>`).join('')}</ul><div class="box"><h3>For grown ups</h3><p>${esc(p.grownUps.line)}</p><p><a class="cta" href="${esc(p.grownUps.url)}">${esc(p.grownUps.cta)}</a></p></div></article>`
  }
}

const head = (issue: Issue, title: string) => `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(issue.tagline)}"><style>${CSS}</style></head>`

export function renderOnline(issue: Issue): string {
  const cover = issue.pages[0] as Extract<Page, { template: 'cover' }>
  return `${head(issue, `The Guided Planet, Issue ${pad3(issue.number)}: ${issue.edition}`)}<body><a class="skip" href="#content">Skip to the paper</a><main id="content">
  <header class="mast"><p class="eyebrow">Issue ${pad3(issue.number)} · ${esc(issue.month)} · ${esc(issue.edition)}</p><h1>The Guided Planet</h1><p class="standfirst">${esc(issue.tagline)}</p></header>
  <section aria-labelledby="cover-h"><h2 id="cover-h">${esc(cover.headline)}</h2><p class="standfirst">${esc(plain(cover.deck))}</p><p><i>Cover picture: ${esc(cover.art.alt)}</i></p>
  <p><a href="guided-planet-${pad3(issue.number)}.pdf">Download the printable paper (PDF)</a> · <a href="guided-planet-${pad3(issue.number)}-ink.pdf">Ink saver version</a> · <a href="sources/">Every source</a></p></section>
  ${issue.pages.map(p => article(p, issue)).join('\n')}
  </main></body></html>`
}

export function renderSourcesPage(issue: Issue): string {
  const used = new Map<string, number[]>()
  for (const p of issue.pages) for (const id of ('refs' in p ? p.refs : [])) used.set(id, [...(used.get(id) ?? []), p.n])
  const rows = issue.sources.filter(s => used.has(s.id)).map(s => `<li id="${s.id}"><h3><a href="${esc(s.url)}">${esc(s.org)}, ${esc(s.title)}</a></h3>
    <p>${s.published ? `Published ${esc(s.published)}. ` : ''}Checked ${esc(s.accessed)}. ${esc(s.evidence[0].toUpperCase() + s.evidence.slice(1))}. Used on page ${used.get(s.id)!.join(', ')}.</p>
    <p><b>What it supports:</b> ${esc(s.supports)}</p>${s.quote ? `<blockquote>${esc(s.quote)}</blockquote>` : ''}${s.note ? `<p><b>Worth knowing:</b> ${esc(s.note)}</p>` : ''}</li>`).join('')
  return `${head(issue, `Sources, The Guided Planet Issue ${pad3(issue.number)}`)}<body><main>
  <header class="mast"><p class="eyebrow">The Guided Planet · Issue ${pad3(issue.number)} · ${esc(issue.month)}</p><h1>Where every fact came from</h1>
  <p class="standfirst">Every fact in this issue, the source it came from, the words on that source that back it up, and anything a careful reader should know about it.</p></header>
  <ol class="refs" style="font-size:1rem;color:var(--ink)">${rows}</ol></main></body></html>`
}
