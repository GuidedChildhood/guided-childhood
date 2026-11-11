// The founder dashboard. One page, phone first, built from the repository.
//
// Requirement 6 of the repair brief lists eight things it must show. Each is a
// section here and each is computed from the register, the post register and
// the sync state at build time. Nothing on the page is typed in by hand, so it
// cannot drift from the facts the way the three manifests had.
//
// It is a static page on purpose. It says when it was built and from which
// commit, in the header, because a dashboard that looks live and is not is the
// same failure as a snapshot treated as current. `npm run radar-dashboard`
// rebuilds it.
//
// Same tokens as the Post Desk (tools/post-desk/head.html): Nunito, IBM Plex
// Mono, the gold, chunky edges. Justin already reads that page every morning.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import * as reg from './register.mjs'
import { githubFacts, parsePostRegister } from './contract.mjs'
import { syncState } from './sync.mjs'
import { preflight, founderStatus } from './pipeline.mjs'
import { loadRun, STAGES } from './daily.mjs'
import { recentReceipts } from './candidates.mjs'
import { eligibility } from './qa.mjs'

// The one page Justin copies posts from. Never a second one.
const POST_DESK = 'https://claude.ai/artifact/Xb6Jt6JAm2d3wrF7WXxeGY'

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const when = (iso) => {
  if (!iso) return 'never'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getUTCDate()} ${M[d.getUTCMonth()]}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
}
// A source title is a citation, but this is a page Justin reads, and the house
// rule is no dashes in anything he reads. A range becomes "to", anything else
// a comma.
const plain = (s) => String(s || '').replace(/(\d)\s*[\u2010-\u2015\u2212]\s*/g, '$1 to ').replace(/\s*[\u2010-\u2015\u2212]\s*/g, ', ')
const clip = (raw, n = 110) => { const s = plain(raw); return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s }

/** Sort every record into exactly one place on the board. */
export function collect() {
  const all = reg.all()
  const facts = githubFacts()
  const sync = syncState()
  const pre = preflight()
  const today = new Date().toISOString().slice(0, 10)

  const g = { discovered: [], awaitingReview: [], readyForProduction: [], awaitingQa: [], awaitingApproval: [], published: [], blocked: [] }

  for (const r of all) {
    const row = { id: r.studyId, title: r.title, number: r.gdcPostNumber || null, band: r.relevanceBand, score: r.relevanceScore || 0,
      priority: r.editorialPriority || null, firstFound: r.firstFound, fullText: !!r.fullTextAvailable }

    // A HOLD from any gate wins: the reason matters more than the stage.
    if (r.status === 'HOLD' || r.status === 'REJECTED') {
      g.blocked.push({ ...row, stage: r.status === 'HOLD' ? 'PARKED' : 'REJECTED', reasons: [r.changeReason || 'no reason recorded'], at: r.lastChecked })
      continue
    }
    if (r.gate?.verdict === 'HOLD' && r.status !== 'PUBLISHED') {
      g.blocked.push({ ...row, stage: r.gate.stage, reasons: r.gate.reasons || [], at: r.gate.at })
      continue
    }
    if (r.status === 'PUBLISHED') { g.published.push({ ...row, url: r.publishedUrl, evidence: r.publishedCheck?.verdict || 'not recorded', at: r.publishedAt }); continue }
    if (r.status === 'APPROVED') { g.awaitingApproval.push({ ...row, founder: 'APPROVED', note: 'You approved it. Post it and send me the link, and it is marked published once the link answers.', approved: true }); continue }
    if (r.status === 'ASSETS READY' && founderStatus(r) === 'CHANGES REQUESTED') { g.awaitingApproval.push({ ...row, founder: 'CHANGES REQUESTED', note: `You asked for changes: ${r.founderDecision?.note || ''} The new version comes back here once it has been checked again.` }); continue }
    if (r.status === 'ASSETS READY') { g.awaitingApproval.push({ ...row, founder: 'READY FOR JUSTIN', note: 'Checked and reviewed. It is on the Post Desk, ready for you to read and copy.' }); continue }
    if (r.status === 'EDITORIAL READY') {
      const el = eligibility(r)
      if (el.verdict !== 'PASS') { g.blocked.push({ ...row, stage: 'ELIGIBILITY', reasons: el.reasons, at: r.lastChecked }); continue }
      if (r.pack) {
        const waiting = r.packReview?.verdict === 'PASS'
          ? (r.packDrive?.verified ? 'Ready to move forward.' : 'Reviewed. Waiting for a verified save to Drive.')
          : 'Passed the automatic checks. Waiting for my review of the pack.'
        g.awaitingQa.push({ ...row, note: waiting })
      } else {
        g.readyForProduction.push({ ...row, note: 'Handoff is ready. Waiting for ChatGPT to write the pack.', handoffVersion: r.handoff?.version || null })
      }
      continue
    }
    if (r.status === 'VERIFIED' && r.claudeStatus !== 'CLAUDE REVIEWED') { g.awaitingReview.push(row); continue }
    g.discovered.push({ ...row, isNew: String(r.firstFound).slice(0, 10) === today })
  }

  g.discovered.sort((a, b) => b.score - a.score)
  g.awaitingReview.sort((a, b) => b.score - a.score)

  // Published posts come from the post register, which is the authority for
  // what went out. A row that rests on Justin's word says so.
  const posted = parsePostRegister().filter((x) => x.posted).map((x) => ({
    number: x.number, title: x.title,
    evidence: /NO URL CAPTURED/i.test(x.state) ? 'on your word, no link captured' : 'recorded as posted',
  })).reverse()

  // Things blocked that are not a single story: the sync and the ground rules.
  const systemBlocks = []
  for (const reason of pre.reasons) systemBlocks.push({ stage: 'PREFLIGHT', reason })
  for (const f of sync.recentFailures || []) systemBlocks.push({ stage: 'DRIVE SAVE', reason: `${f.role}: ${(f.verification?.problems || []).join('; ') || 'verification failed'}`, at: f.at })

  // Today's run, and what came in through the inbox. Both are read from the
  // files the run itself wrote, so this page reports the run and never infers it.
  const run = loadRun(today)
  const stages = STAGES.map(([name, who]) => {
    const e = run.stages.find((x) => x.stage === name)
    return { name, who, verdict: e ? e.verdict : 'NOT RUN', at: e?.at || null, reason: e?.reasons?.[0] || '', attempts: e?.attempts || 0 }
  })
  const inbox = recentReceipts(3)

  return { g, posted, facts, sync, pre, systemBlocks, run, stages, inbox, builtAt: new Date().toISOString(), newToday: g.discovered.filter((x) => x.isNew).length }
}

function storyRow(r, { showNote = true } = {}) {
  const chips = [
    r.founder ? `<span class="chip good">${esc(r.founder)}</span>` : '',
    r.number ? `<span class="chip num">GDC ${esc(String(r.number).padStart(3, '0'))}</span>` : '',
    r.priority ? `<span class="chip">${esc(r.priority)}</span>` : '',
    r.band ? `<span class="chip">${esc(r.band)}</span>` : '',
    r.fullText ? '<span class="chip">full text</span>' : '',
    r.isNew ? '<span class="chip good">new today</span>' : '',
  ].join('')
  return `<li class="row">
    <div class="rt">${esc(clip(r.title))}</div>
    <div class="chips">${chips}</div>
    ${showNote && r.note ? `<div class="note">${esc(r.note)}</div>` : ''}
    <div class="meta">${esc(r.id)}</div>
  </li>`
}

function section({ id, title, count, tone = '', lede, body, empty }) {
  return `<section class="band" id="${id}">
  <div class="head"><h2>${esc(title)}</h2><span class="count ${tone}">${count}</span></div>
  ${lede ? `<p class="lede">${esc(lede)}</p>` : ''}
  ${count ? body : `<p class="empty">${esc(empty)}</p>`}
</section>`
}

export function render(d = collect()) {
  const { g, posted, facts, sync, systemBlocks } = d
  const needsYou = g.awaitingApproval.length
  const blockedCount = g.blocked.length + systemBlocks.length
  const syncTone = sync.verdict === 'CURRENT' ? 'good' : 'bad'
  const syncWord = { CURRENT: 'In step', STALE: 'Out of date', 'NEVER SYNCED': 'Never synced' }[sync.verdict] || sync.verdict

  const tiles = [
    ['#discovered', 'New research', g.discovered.length, ''],
    ['#review', 'Awaiting my review', g.awaitingReview.length, ''],
    ['#production', 'Ready for ChatGPT', g.readyForProduction.length, ''],
    ['#qa', 'Drafts in checking', g.awaitingQa.length, ''],
    ['#approval', 'Waiting for you', needsYou, needsYou ? 'gold' : ''],
    ['#published', 'Posted', posted.length + g.published.length, ''],
    ['#blocked', 'Blocked', blockedCount, blockedCount ? 'bad' : 'good'],
    ['#sync', 'Drive', syncWord, syncTone],
  ].map(([href, label, n, tone]) => `<a class="tile ${tone}" href="${href}"><span class="n">${esc(n)}</span><span class="l">${esc(label)}</span></a>`).join('')

  const headline = needsYou
    ? `${needsYou} pack${needsYou === 1 ? '' : 's'} waiting for your yes.`
    : blockedCount
      ? `Nothing needs your approval. ${blockedCount} thing${blockedCount === 1 ? ' is' : 's are'} blocked.`
      : g.readyForProduction.length
        ? `${g.readyForProduction.length} stor${g.readyForProduction.length === 1 ? 'y is' : 'ies are'} ready for ChatGPT to write.`
        : g.awaitingQa.length
          ? `${g.awaitingQa.length} draft${g.awaitingQa.length === 1 ? ' is' : 's are'} being checked.`
          : 'Nothing needs you right now.'

  const blockedBody = `<ul class="list">${
    systemBlocks.map((b) => `<li class="row bad"><div class="chips"><span class="chip bad">${esc(b.stage)}</span></div><div class="why">${esc(b.reason)}</div>${b.at ? `<div class="meta">${esc(when(b.at))}</div>` : ''}</li>`).join('')
  }${
    g.blocked.map((b) => `<li class="row bad">
      <div class="rt">${esc(clip(b.title))}</div>
      <div class="chips"><span class="chip bad">HOLD at ${esc(b.stage)}</span>${b.number ? `<span class="chip num">GDC ${esc(String(b.number).padStart(3, '0'))}</span>` : ''}</div>
      ${b.reasons.slice(0, 4).map((x) => `<div class="why">${esc(clip(x, 260))}</div>`).join('')}
      ${b.reasons.length > 4 ? `<div class="meta">and ${b.reasons.length - 4} more</div>` : ''}
      <div class="meta">${esc(b.id)}  ${esc(when(b.at))}</div>
    </li>`).join('')
  }</ul>`

  const syncBody = `<ul class="list">${
    ['stage2Brief', 'manifest', 'postRegister'].map((role) => {
      const r = sync.roles[role]
      const name = { stage2Brief: 'The start here document ChatGPT opens first', manifest: 'The queue', postRegister: 'The list of taken post numbers' }[role]
      if (!r) return `<li class="row bad"><div class="rt">${name}</div><div class="chips"><span class="chip bad">never verified in Drive</span></div><div class="why">ChatGPT has nothing safe to read for this yet.</div></li>`
      return `<li class="row ${r.current ? '' : 'bad'}"><div class="rt">${name}</div>
        <div class="chips"><span class="chip ${r.current ? 'good' : 'bad'}">${r.current ? 'in step' : 'out of date'}</span><span class="chip">${esc(String(r.verifiedAt).toLowerCase())}</span></div>
        ${r.staleBy ? `<div class="why">${esc(r.staleBy)}</div>` : ''}
        <div class="meta">checked ${esc(when(r.at))}  from ${esc(String(r.snapshotCommit).slice(0, 8))}</div></li>`
    }).join('')
  }${
    Object.entries(sync.roles).filter(([k]) => k.startsWith('handoff:')).map(([k, r]) => `<li class="row ${r.current ? '' : 'bad'}"><div class="rt">Handoff ${esc(k.split(':')[1])}</div>
      <div class="chips"><span class="chip ${r.current ? 'good' : 'bad'}">${r.current ? 'in step' : 'out of date'}</span><span class="chip">${esc(String(r.verifiedAt).toLowerCase())}</span></div>
      <div class="meta">checked ${esc(when(r.at))}</div></li>`).join('')
  }</ul>`

  const list = (rows, opt) => `<ul class="list">${rows.map((r) => storyRow(r, opt)).join('')}</ul>`
  const more = (rows, n) => (rows.length > n ? `<p class="meta more">and ${rows.length - n} more in the register</p>` : '')

  return `<title>Radar Desk</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>
/* One column on a phone: the answer first, eight counts, then each count's list in pipeline order. */
:root{
  --bg:#F9F8F6; --card:#FFFFFF; --fg:#1A1A2E; --soft:#52526A; --line:#EAEAF0;
  --gold:#EDC35F; --gold-dark:#C99A28; --done:#2F8F6B; --done-bg:#E5F3EC; --warn:#B4552F; --warn-bg:#FBEDE6;
  --display:'Nunito',ui-rounded,system-ui,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1D1A12;--card:#2E2818;--fg:#FFF9E8;--soft:#CFC5A8;--line:#3E3726;--gold-dark:#EDC35F;--done:#5FC49B;--done-bg:#1F3329;--warn:#E89472;--warn-bg:#3A2319;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#1D1A12;--card:#2E2818;--fg:#FFF9E8;--soft:#CFC5A8;--line:#3E3726;--gold-dark:#EDC35F;--done:#5FC49B;--done-bg:#1F3329;--warn:#E89472;--warn-bg:#3A2319;color-scheme:dark}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
body{background:var(--bg);color:var(--fg);font-family:var(--display);font-size:16px;line-height:1.45;margin:0}
.wrap{max-width:780px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 72px;display:flex;flex-direction:column;gap:30px}
.eyebrow{font-family:var(--mono);font-weight:600;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-dark)}
h1{font-weight:900;font-size:clamp(28px,7vw,42px);line-height:1.05;letter-spacing:-.02em;margin:6px 0 0;text-wrap:balance}
h2{font-weight:900;font-size:21px;margin:0;letter-spacing:-.01em}
h3{font-weight:900;font-size:16px;margin:0}
p{margin:0}
.lede{color:var(--soft);font-weight:600;max-width:62ch;font-size:15px}
.built{font-family:var(--mono);font-size:11.5px;color:var(--soft);letter-spacing:.04em;margin-top:10px}
.tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
@media (min-width:620px){.tiles{grid-template-columns:repeat(4,minmax(0,1fr))}}
.tile{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:2px;text-decoration:none;color:inherit;min-width:0}
.tile .n{font-weight:900;font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
.tile .l{font-family:var(--mono);font-weight:600;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--soft)}
.tile.gold{border:2px solid var(--gold);box-shadow:0 5px 0 var(--gold-dark)}
.tile.bad{border-color:var(--warn)} .tile.bad .n{color:var(--warn)}
.tile.good .n{color:var(--done)}
.tile:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid var(--fg);outline-offset:2px}
section.band{display:flex;flex-direction:column;gap:12px;scroll-margin-top:16px}
.head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.count{font-family:var(--mono);font-weight:600;font-size:13px;min-width:32px;text-align:center;padding:4px 10px;border-radius:999px;background:var(--card);border:1px solid var(--line);color:var(--soft);font-variant-numeric:tabular-nums}
.count.gold{background:var(--gold);color:#1A1A2E;border-color:var(--gold-dark)}
.count.bad{color:var(--warn);border-color:var(--warn);background:var(--warn-bg)}
.count.good{color:var(--done);border-color:var(--done);background:var(--done-bg)}
.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.row{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;min-width:0}
.row.bad{border-color:var(--warn)}
.rt{font-weight:800;font-size:15.5px;line-height:1.3;overflow-wrap:anywhere}
.note{font-weight:700;font-size:14.5px;color:var(--fg)}
.why{font-weight:600;font-size:14.5px;color:var(--warn);overflow-wrap:anywhere}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chip{font-family:var(--mono);font-weight:600;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:8px;background:var(--bg);color:var(--soft);border:1px solid var(--line)}
.chip.num{background:var(--gold);color:#1A1A2E;border-color:var(--gold-dark)}
.chip.bad{color:var(--warn);border-color:var(--warn);background:var(--warn-bg)}
.chip.good{color:var(--done);border-color:var(--done);background:var(--done-bg)}
.meta{font-family:var(--mono);font-size:11.5px;color:var(--soft);letter-spacing:.04em;overflow-wrap:anywhere}
.more{padding-left:4px}
.empty{font-weight:600;color:var(--soft);font-size:15px;background:var(--card);border:1px dashed var(--line);border-radius:16px;padding:14px 16px}
.flow{display:flex;flex-direction:column;gap:0}
.step{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:6px}
.step .who{font-family:var(--mono);font-weight:600;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-dark)}
.step p{font-weight:600;font-size:14.5px;color:var(--soft)}
.step.you{border:2px solid var(--gold);box-shadow:0 5px 0 var(--gold-dark)}
.arrow{align-self:center;font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--soft);padding:8px 0;text-align:center;text-transform:uppercase}
.arrow b{color:var(--warn);font-weight:600}
.stores{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.manual{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px}
.manual ul{margin:10px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:8px;font-weight:600;color:var(--soft);font-size:15px}
.manual li b{color:var(--fg)}
</style>
<div class="wrap">
  <header>
    <div class="eyebrow">Guided Childhood  Research Radar</div>
    <h1>${esc(headline)}</h1>
    <p class="built">Built ${esc(when(d.builtAt))} from ${esc(facts.repo.shortCommit)}${facts.repo.dirty ? ', with uncommitted changes' : ''}. This page does not update itself.</p>
  </header>

  <nav class="tiles" aria-label="Pipeline counts">${tiles}</nav>

  ${section({ id: 'approval', title: 'Waiting for you', count: g.awaitingApproval.length, tone: g.awaitingApproval.length ? 'gold' : '',
    lede: 'Packs that passed every check and my review. Nothing goes out until you say yes, and nothing is marked posted without a link that answers.',
    body: list(g.awaitingApproval) + `<p class="lede"><a href="${POST_DESK}">Open the Post Desk</a> to read it, copy it and post it. Then send me the link.</p>`, empty: 'No pack is waiting for your approval.' })}

  ${section({ id: 'run', title: "Today's run", count: `${d.stages.filter((x) => x.verdict === 'PASS').length} of ${d.stages.length}`, tone: d.stages.some((x) => ['HOLD', 'ERROR'].includes(x.verdict)) ? 'bad' : d.stages.every((x) => x.verdict === 'PASS') ? 'good' : '',
    lede: 'Each stage of the day, in order, with what it said. A stage marked NOT RUN did not happen, which is different from finding nothing.',
    body: `<ul class="list">${d.stages.map((x) => `<li class="row"><div class="rt">${esc(x.name)}</div><div class="chips"><span class="chip ${x.verdict === 'PASS' ? 'good' : ['HOLD', 'ERROR'].includes(x.verdict) ? 'bad' : ''}">${esc(x.verdict)}</span><span class="chip">${x.who === 'claude' ? 'Claude' : 'script'}</span>${x.at ? `<span class="chip">${esc(when(x.at))}</span>` : ''}</div>${x.reason ? `<div class="note">${esc(plain(x.reason).slice(0, 260))}</div>` : ''}</li>`).join('')}</ul>`,
    empty: 'Nothing has run today.' })}

  ${section({ id: 'inbox', title: 'The candidate inbox', count: d.inbox.reduce((n, b) => n + b.results.length, 0),
    lede: 'Research sent in through the Drive inbox, who sent it, and what became of each one. A candidate is not cleared until it has been through the evidence check.',
    body: `<ul class="list">${d.inbox.flatMap((b) => b.results.map((x) => `<li class="row"><div class="rt">${esc(clip(x.title || x.candidateId))}</div><div class="chips"><span class="chip ${x.outcome === 'INGESTED' ? 'good' : x.outcome === 'HELD' ? 'bad' : ''}">${esc(x.outcome)}</span><span class="chip">${esc(String(b.ingestedAt).slice(0, 10))}</span></div>${(x.reasons || [])[0] ? `<div class="note">${esc(plain(x.reasons[0]).slice(0, 220))}</div>` : ''}<div class="meta">${esc(x.researchId || x.candidateId)}, sent by ${esc(clip(b.createdBy, 60))}</div></li>`)).join('')}</ul>`,
    empty: 'Nothing has come through the inbox yet.' })}

  ${section({ id: 'blocked', title: 'Blocked, and why', count: blockedCount, tone: blockedCount ? 'bad' : 'good',
    lede: 'Anything that failed a check stops here with its reason. It does not carry on quietly.',
    body: blockedBody, empty: 'Nothing is blocked.' })}

  ${section({ id: 'production', title: 'Ready for ChatGPT', count: g.readyForProduction.length,
    lede: 'Reviewed research with a handoff written. The next free post number is GDC ' + facts.postRegister.nextFree + '.',
    body: list(g.readyForProduction), empty: 'No story is waiting to be written.' })}

  ${section({ id: 'qa', title: 'Drafts in checking', count: g.awaitingQa.length,
    lede: 'Packs ChatGPT has written that are between the automatic checks and my review.',
    body: list(g.awaitingQa), empty: 'No draft is being checked.' })}

  ${section({ id: 'review', title: 'Awaiting my review', count: g.awaitingReview.length,
    lede: 'These passed the automatic evidence checks. None is treated as verified until I have reviewed it claim by claim and stored that review.',
    body: list(g.awaitingReview.slice(0, 6), { showNote: false }) + more(g.awaitingReview, 6), empty: 'Nothing is waiting for review.' })}

  ${section({ id: 'discovered', title: 'New research', count: g.discovered.length,
    lede: `${d.newToday} first seen today. Found by the radar and not yet checked. Strongest match to our subject first.`,
    body: list(g.discovered.slice(0, 6), { showNote: false }) + more(g.discovered, 6), empty: 'Nothing new has been found.' })}

  ${section({ id: 'published', title: 'Posted', count: posted.length + g.published.length,
    lede: 'From the post register, which only you move to posted.',
    body: `<ul class="list">${
      g.published.map((p) => `<li class="row"><div class="rt">${esc(clip(p.title))}</div><div class="chips"><span class="chip good">link checked</span></div><div class="meta">${esc(p.url || '')}</div></li>`).join('')
    }${
      posted.map((p) => `<li class="row"><div class="rt">${esc(plain(p.title))}</div><div class="chips"><span class="chip num">GDC ${esc(p.number)}</span><span class="chip">${esc(p.evidence)}</span></div></li>`).join('')
    }</ul>`, empty: 'Nothing is recorded as posted.' })}

  ${section({ id: 'sync', title: 'Drive, last checked copy', count: syncWord, tone: syncTone,
    lede: `Last successful synchronisation: ${when(sync.lastSuccessAt)}. A copy only counts once it has been read back out of Drive and compared with what was sent.`,
    body: syncBody, empty: '' })}

  <section class="band" id="how">
    <div class="head"><h2>How a story moves</h2></div>
    <div class="flow">
      <div class="step"><span class="who">Stage 1  Claude</span><h3>Find it, check it, review it</h3><p>The radar finds research, checks the record, and I review it claim by claim. Only a stored review makes a story ready.</p></div>
      <div class="arrow">handoff written to GitHub, copied to Drive, read back and compared<br><b>stops if unreviewed or the number clashes</b></div>
      <div class="step"><span class="who">Stage 2  ChatGPT</span><h3>Write the pack</h3><p>Reads the queue, the handoff and the list of taken numbers from Drive, then writes the posts using only the cleared figures.</p></div>
      <div class="arrow">pack saved to Drive<br><b>stops if the copy is out of date</b></div>
      <div class="step"><span class="who">Stage 3  Claude</span><h3>Check the pack</h3><p>Length, figures, repeats of old posts, links, the closing question, the number. Then my own read of it.</p></div>
      <div class="arrow">only a pack with no failures moves<br><b>any failure stops it here with the reason</b></div>
      <div class="step you"><span class="who">Stage 4  You</span><h3>Approve, post, send the link</h3><p>You say yes. You post it. You give me the link, and only a link that answers marks it posted.</p></div>
    </div>
  </section>

  <section class="band" id="stores">
    <div class="head"><h2>Where the truth lives</h2></div>
    <div class="stores">
      <div class="step"><span class="who">GitHub  the authority</span><p>Post numbers, every version of every research record, and what was published. ${facts.postRegister.rows} numbers taken, ${facts.researchRegister.total} research records.</p></div>
      <div class="step"><span class="who">Drive  the shared desk</span><p>Stamped copies of the queue, the numbers and each handoff, plus the packs. Each copy says which commit it came from.</p></div>
    </div>
  </section>

  <section class="manual" id="manual">
    <h2>What still needs a person</h2>
    <ul>
      <li><b>Copying to Drive is something I do in a session.</b> A script cannot reach Drive on its own, so the copy happens when I run, and I check it afterwards.</li>
      <li><b>ChatGPT cannot see GitHub.</b> It reads the Drive copies. If it claims a number, the check catches it, but only when its pack comes back.</li>
      <li><b>ChatGPT starts when you ask it or when its own schedule fires.</b> I cannot start it.</li>
      <li><b>Approval and posting are yours.</b> That is on purpose.</li>
    </ul>
  </section>
</div>
`
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const out = process.argv[2] || join(process.cwd(), 'tools/radar-dashboard/index.html')
  mkdirSync(dirname(out), { recursive: true })
  const d = collect()
  writeFileSync(out, render(d))
  console.log(`dashboard written to ${out}`)
  const c = d.g
  console.log(`discovered ${c.discovered.length}  awaiting review ${c.awaitingReview.length}  ready ${c.readyForProduction.length}  in checking ${c.awaitingQa.length}  waiting for Justin ${c.awaitingApproval.length}  blocked ${c.blocked.length + d.systemBlocks.length}  sync ${d.sync.verdict}`)
}
