// PUBLICATION, ONE CHANNEL AT A TIME, NEVER TWICE.
//
//   npm run planet -- publish <n> <channel>
//
// Refuses unless the issue holds a final approval and the files about to go
// out are the files that were approved (workflow.ts checks both hashes).
// Every channel records a release keyed on issue, channel and PDF hash, so a
// second run of the same channel is a no op that says so, which is what
// "idempotent publishing" means here: a retried job can never send the email
// twice or post the paper twice.
//
// What each channel does, honestly:
//   website    copies the online edition, PDFs and cover into
//              public/guided-planet/<slug>/ and adds the two rewrites that
//              make /guided-planet/<slug> and /sources resolve. It changes the
//              working tree only: the founder merges the pull request, and
//              the merge is the publication.
//   mailchimp  creates a DRAFT campaign through the Mailchimp API when its
//              three settings exist. It never sends: Justin presses send.
//   drive, linkedin, instagram, facebook, schools
//              no API here. Recorded as 'manual' with the exact steps in
//              package/checklist.md, done by Justin (or a Claude session with
//              the Drive connector, for drive).
//
// The first successful channel moves the issue to PUBLISHED.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pad3 } from '../engine/html'
import { contentHash, sha256 } from '../engine/hash'
import { ROOT } from '../engine/library'
import type { Store } from '../engine/store'
import { authorisationFor, current, transition, type Actor } from '../engine/workflow'
import { issueDir, loadIssue } from '../pdf-engine/render'

export const CHANNELS = ['website', 'mailchimp', 'drive', 'linkedin', 'instagram', 'facebook', 'schools'] as const
export type Channel = typeof CHANNELS[number]

// deps lets a test point the files and the website at temporary folders.
export async function publish(n: number, channel: Channel, store: Store, requester: Actor, deps: { fetch?: typeof fetch; dir?: string; webRoot?: string } = {}) {
  const issue = loadIssue(n)
  const dir = deps.dir ?? issueDir(n)
  const web = deps.webRoot ?? ROOT
  const NNN = pad3(n)
  const pdf = join(dir, 'dist', `guided-planet-${NNN}.pdf`)
  const pdfHash = sha256(readFileSync(pdf))
  // The founder publishes directly; the routine publishes only under the
  // founder's dashboard authorisation for this channel and this exact PDF.
  const actor = requester.kind === 'founder' ? requester : await authorisationFor(store, n, channel, pdfHash)
  if (!actor) throw new Error(`no publication authorised for ${channel} on this PDF. Justin authorises it in the dashboard.`)
  const key = `${n}:${channel}:${pdfHash}`
  const before = await store.getRelease(n, channel)
  if (before && before.key === key && before.status !== 'failed') return { already: true, release: before }

  const st = await current(store, n)
  if (st.state !== 'FINAL_APPROVED' && st.state !== 'PUBLISHED') throw new Error(`issue ${n} is ${st.state}; publication needs final approval`)
  if (st.approvedContentHash !== contentHash(issue)) throw new Error('the issue changed after final approval')
  if (st.approvedPdfHash !== pdfHash) throw new Error('the PDF changed after final approval')
  if (!existsSync(join(dir, 'package'))) throw new Error(`build the package first: npm run planet -- package ${n}`)

  let status: 'prepared' | 'sent' | 'manual' = 'manual'
  let external: string | undefined
  const detail: Record<string, unknown> = {}

  if (channel === 'website') {
    const out = join(web, 'public', 'guided-planet', issue.slug)
    mkdirSync(out, { recursive: true })
    cpSync(join(dir, 'dist', 'online'), out, { recursive: true })
    for (const f of [`guided-planet-${NNN}.pdf`, `guided-planet-${NNN}-ink.pdf`, `guided-planet-${NNN}-sources.pdf`, 'cover.png']) {
      if (existsSync(join(dir, 'dist', f))) cpSync(join(dir, 'dist', f), join(out, f))
    }
    addRewrites(web, issue.slug)
    status = 'prepared'
    detail.path = `public/guided-planet/${issue.slug}/`
    detail.next = 'Commit, open the pull request, and merge it. The merge deploys the page.'
  } else if (channel === 'mailchimp') {
    const { MAILCHIMP_API_KEY: k, MAILCHIMP_SERVER: dc, MAILCHIMP_AUDIENCE_ID: list } = process.env
    if (!k || !dc || !list) throw new Error('Mailchimp is not connected: set MAILCHIMP_API_KEY, MAILCHIMP_SERVER (for example us21) and MAILCHIMP_AUDIENCE_ID. See publishing/README.md.')
    const words = JSON.parse(readFileSync(join(dir, 'distribution.json'), 'utf8'))
    const f = deps.fetch ?? fetch
    const auth = { Authorization: `Basic ${Buffer.from(`gp:${k}`).toString('base64')}`, 'Content-Type': 'application/json' }
    const base = `https://${dc}.api.mailchimp.com/3.0`
    const made = await f(`${base}/campaigns`, { method: 'POST', headers: auth, body: JSON.stringify({ type: 'regular', recipients: { list_id: list }, settings: { subject_line: words.email.subject, preview_text: words.email.preview, title: `The Guided Planet ${NNN}`, from_name: 'The Guided Planet', reply_to: process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com' } }) })
    if (!made.ok) throw new Error(`Mailchimp refused the campaign: HTTP ${made.status}`)
    const id = (await made.json()).id as string
    const html = readFileSync(join(dir, 'package', 'email.html'), 'utf8')
    const put = await f(`${base}/campaigns/${id}/content`, { method: 'PUT', headers: auth, body: JSON.stringify({ html }) })
    if (!put.ok) throw new Error(`Mailchimp refused the campaign content: HTTP ${put.status}`)
    status = 'prepared'
    external = id
    detail.next = 'A draft campaign is waiting in Mailchimp. Check it and press send there.'
  } else {
    detail.next = `Manual: see issues/${NNN}/package/checklist.md, row "${channel}".`
  }

  const release = { issue: n, channel, key, status, at: new Date().toISOString(), external, detail }
  await store.putRelease(release)
  await store.addEvent({ issue: n, at: release.at, actor, action: 'release', detail: { channel, status, key } })
  if (st.state === 'FINAL_APPROVED' && status === 'prepared') {
    await transition(store, n, 'PUBLISHED', actor, { contentHash: contentHash(issue), pdfHash, channel })
  }
  return { already: false, release }
}

// The two rewrites that let /guided-planet/<slug> and its sources page resolve
// to the static files. Idempotent: an existing rewrite is not added again.
function addRewrites(root: string, slug: string) {
  const p = join(root, 'vercel.json')
  const v = JSON.parse(readFileSync(p, 'utf8'))
  v.rewrites = v.rewrites ?? []
  const want = [
    { source: `/guided-planet/${slug}`, destination: `/guided-planet/${slug}/index.html` },
    { source: `/guided-planet/${slug}/sources`, destination: `/guided-planet/${slug}/sources/index.html` },
  ]
  for (const r of want) if (!v.rewrites.some((x: { source: string }) => x.source === r.source)) v.rewrites.push(r)
  writeFileSync(p, JSON.stringify(v, null, 2) + '\n')
}
