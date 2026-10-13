// The CLI commands beyond check and render. See publishing/cli.ts for the list.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pad3 } from '../engine/html'
import { contentHash, sha256 } from '../engine/hash'
import { PUB } from '../engine/library'
import { FileStore, type Store } from '../engine/store'
import { current, decideStory, LABEL, transition, waitingOn, type Actor } from '../engine/workflow'
import { brief, briefMarkdown } from '../higgsfield/brief'
import { buildPackage } from '../distribution/package'
import { CHANNELS, publish, type Channel } from '../distribution/publish'
import { issueDir, loadIssue } from '../pdf-engine/render'
import { cycle, planFor, proposedStories, ROUTINE, selectionHash, type Notify } from './cycle'

// The file store, unless the database is configured and not opted out of.
export async function openStore(): Promise<{ store: Store; kind: 'file' | 'supabase' }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && key && process.env.PLANET_STORE !== 'file') {
    const { createClient } = await import('@supabase/supabase-js')
    const { SupabaseStore } = await import('../engine/store-supabase')
    const meta = (n: number) => planFor(n)
    return { store: new SupabaseStore(createClient(url, key), meta), kind: 'supabase' }
  }
  return { store: new FileStore(join(PUB, 'issues')), kind: 'file' }
}

// Founder notifications go through the house email helper as operational
// mail (never counted against a parent's one email a week), or to the log.
export const notifyFounder: Notify = async (subject, body) => {
  const to = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'
  if (!process.env.RESEND_API_KEY) { console.log(`[notify] ${subject}\n${body}`); return }
  const { sendEmail } = await import('../../lib/email/index')
  const link = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.guidedchildhood.com'}/dashboard/admin/planet`
  await sendEmail({ to, subject, kind: 'operational', key: 'guided-planet', html: `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#1A1A2E"><p>${body.replace(/\n/g, '<br>')}</p><p><a href="${link}">Open the newspaper desk</a></p></div>` })
}

const FOUNDER_LOCAL: Actor = { kind: 'founder', id: 'local-cli' }

export async function run(cmd: string | undefined, arg: string | undefined) {
  const n = Number(arg)
  const { store, kind } = await openStore()
  switch (cmd) {
    case 'status': {
      const s = await current(store, n)
      console.log(`Issue ${pad3(n)}: ${LABEL[s.state]} (${kind} store)`)
      const w = waitingOn(s); if (w) console.log(w)
      for (const e of (await store.events(n)).slice(-12)) console.log(`  ${e.at}  ${e.actor.kind}  ${e.action}${e.to ? ` → ${e.to}` : ''}${e.detail?.why ? `  (${e.detail.why})` : ''}`)
      return
    }
    case 'cycle': {
      for (const line of await cycle(store, notifyFounder)) console.log(line)
      return
    }
    case 'higgsfield': {
      const ledger = await store.generations(n)
      const budget = (await store.budget(n))?.credits ?? null
      const b = brief(loadIssue(n), ledger, budget)
      const out = join(issueDir(n), 'higgsfield')
      mkdirSync(out, { recursive: true })
      writeFileSync(join(out, 'brief.json'), JSON.stringify(b, null, 2) + '\n')
      writeFileSync(join(out, 'brief.md'), briefMarkdown(loadIssue(n), b))
      console.log(`wrote issues/${pad3(n)}/higgsfield/brief.md: ${b.requests.filter(r => r.runnable).length} runnable of ${b.requests.length}, budget ${b.budget ?? 'none'}`)
      return
    }
    case 'package': {
      const sample = process.argv.includes('--preview')
      const out = await buildPackage(n, store, sample ? { force: 'sample' } : {})
      console.log(`wrote ${out.replace(PUB + '/', 'publishing/')}`)
      return
    }
    case 'publish': {
      const channel = process.argv[4] as Channel
      if (!CHANNELS.includes(channel)) throw new Error(`publish <n> <${CHANNELS.join('|')}>`)
      // On the file store the person at the keyboard is the founder. With the
      // database connected this runs as the routine, under the authorisation
      // Justin gave in the dashboard, and refuses without one.
      const r = await publish(n, channel, store, kind === 'file' ? FOUNDER_LOCAL : ROUTINE)
      console.log(r.already ? `${channel}: already done for this PDF, nothing sent twice` : `${channel}: ${r.release.status}. ${String(r.release.detail?.next ?? '')}`)
      return
    }
    // Local approvals, for running the whole workflow on the file store (tests,
    // a demo, or before migration 377 is applied). With the database connected
    // the founder approves in the dashboard and these refuse.
    case 'approve-stories':
    case 'approve-final':
    case 'request-changes': {
      if (kind !== 'file') throw new Error('approvals happen in the dashboard when the database is connected')
      const s = await current(store, n)
      if (cmd === 'approve-stories') {
        const picked = proposedStories(n)
        for (const c of picked) await decideStory(store, n, c.id, 'approved', FOUNDER_LOCAL)
        await transition(store, n, 'APPROVED', FOUNDER_LOCAL, { storiesHash: selectionHash(picked) })
      } else if (cmd === 'approve-final') {
        const NNN = pad3(n)
        await transition(store, n, 'FINAL_APPROVED', FOUNDER_LOCAL, { contentHash: contentHash(loadIssue(n)), pdfHash: sha256(readFileSync(join(issueDir(n), 'dist', `guided-planet-${NNN}.pdf`))) })
      } else {
        await transition(store, n, s.state === 'EDITORIAL_REVIEW' ? 'RESEARCHED' : 'DESIGNING', FOUNDER_LOCAL, { note: process.argv.slice(4).join(' ') || 'changes requested' })
      }
      console.log(`Issue ${pad3(n)}: ${LABEL[(await current(store, n)).state]}`)
      return
    }
    case 'budget': {
      const credits = Number(process.argv[4])
      if (kind !== 'file') throw new Error('set the credit budget in the dashboard when the database is connected')
      if (!Number.isFinite(credits) || credits < 0) throw new Error('budget <n> <credits>')
      await store.setBudget(n, credits, FOUNDER_LOCAL.id)
      console.log(`Issue ${pad3(n)}: Higgsfield budget ${credits} credits`)
      return
    }
    // What Justin authorised in the dashboard, carried out by the routine:
    // build the package if it is missing, then run each authorised channel
    // that has not run for this PDF. publish() refuses anything else.
    case 'publish-authorised': {
      const s = await current(store, n)
      if (s.state !== 'FINAL_APPROVED' && s.state !== 'PUBLISHED') { console.log(`Issue ${pad3(n)}: ${LABEL[s.state]}, nothing to publish`); return }
      const auths = (await store.events(n)).filter(e => e.action === 'publication-authorised' && e.detail?.pdfHash === s.approvedPdfHash)
      const wanted = [...new Set(auths.flatMap(e => (e.detail?.channels as string[]) ?? []))].filter((c): c is Channel => (CHANNELS as readonly string[]).includes(c))
      if (!wanted.length) { console.log(`Issue ${pad3(n)}: no publication authorised yet`); return }
      if (!existsSync(join(issueDir(n), 'package'))) await buildPackage(n, store)
      for (const ch of wanted) {
        try {
          const r = await publish(n, ch, store, ROUTINE)
          console.log(r.already ? `${ch}: already done` : `${ch}: ${r.release.status}. ${String(r.release.detail?.next ?? '')}`)
        } catch (e) { console.log(`${ch}: ${(e as Error).message}`) }
      }
      return
    }
    // The Higgsfield ledger. A Claude session that runs a generation through
    // the Higgsfield connector records it here with the credits Higgsfield
    // reported; Justin approves or rejects it in the dashboard; art-pull then
    // fetches every approved final into assets/approved/<slot>.png, where the
    // renderer uses it in place of the vector default.
    case 'art-record': {
      const [slot, tier, job, url, credits, recipe, model] = process.argv.slice(4)
      if (!slot || (tier !== 'draft' && tier !== 'final') || !url) throw new Error('art-record <n> <slot> <draft|final> <job id> <url> <credits> [recipe] [model]')
      const b = brief(loadIssue(n), await store.generations(n), (await store.budget(n))?.credits ?? null)
      const req = b.requests.find(r => r.slot === slot && r.tier === tier)
      await store.addGeneration({ id: `${n}-${slot}-${tier}-${job}`, issue: n, slot, tier, recipe: recipe ?? req?.recipe ?? 'unknown', model: model ?? req?.model ?? 'unknown', prompt: req?.prompt ?? '', status: 'completed', credits: credits ? Number(credits) : undefined, estimate: req?.estimate ?? undefined, job, url, at: new Date().toISOString() })
      console.log(`recorded ${slot} ${tier}, ${credits ?? 'unknown'} credits. Approve it in the dashboard.`)
      return
    }
    case 'art-pull': {
      const approved = (await store.generations(n)).filter(g => g.status === 'approved' && g.tier === 'final' && g.url)
      const dir = join(issueDir(n), 'assets', 'approved')
      mkdirSync(dir, { recursive: true })
      for (const g of approved) {
        const res = await fetch(g.url as string)
        if (!res.ok) { console.log(`${g.slot}: could not fetch (${res.status})`); continue }
        writeFileSync(join(dir, `${g.slot}.png`), Buffer.from(await res.arrayBuffer()))
        console.log(`${g.slot}: approved art in place`)
      }
      if (!approved.length) console.log('no approved finals yet; every page keeps its own drawings')
      return
    }
    case 'links': {
      const { checkLinks } = await import('./links')
      const res = await checkLinks(loadIssue(n))
      for (const r of res) console.log(`${r.ok ? 'PASS' : r.level === 'warn' ? 'warn' : 'FAIL'}  ${r.status ?? '---'}  ${r.url}${r.note ? `  ${r.note}` : ''}`)
      process.exit(res.some(r => !r.ok && r.level === 'error') ? 1 : 0)
    }
    case 'sync': {
      const { sync } = await import('./sync')
      console.log(await sync(n))
      return
    }
    default:
      console.log('usage: npm run planet -- <check|render|status|cycle|higgsfield|package|publish|publish-authorised|art-record|art-pull|links|sync|budget|approve-stories|approve-final|request-changes> <issue>')
      if (cmd) process.exit(1)
  }
}

