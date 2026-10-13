// THE MONTHLY ROUTINE.
//
// One function, run on a schedule (the GitHub workflow guided-planet.yml) or
// by hand (`npm run planet -- cycle`). It looks at each open issue's state and
// does the next AUTOMATIC step, then stops. It never opens a founder gate.
//
//   WEEK ONE   DRAFT → RESEARCHED → VERIFIED → EDITORIAL REVIEW  (asks approval one)
//   WEEK TWO   APPROVED → DESIGNING                              (drafts the pages)
//   WEEK THREE DESIGNING → PROOF READY                           (art, render, checks; asks approval two)
//   WEEK FOUR  FINAL APPROVED: build the package, wait for publication
//
// Every step is idempotent: run it twice and the second run finds the work
// done and moves on. A step that fails is logged as an event with its error
// and retried on the next run; it does not stop other issues, and a failed
// image or video job never stops anything, because every art slot has a
// vector default.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pad3 } from '../engine/html'
import { contentHash, sha256, storiesHash } from '../engine/hash'
import { PUB } from '../engine/library'
import type { Store } from '../engine/store'
import { current, GateError, transition, waitingOn, type Actor } from '../engine/workflow'
import { issueDir, renderEdition } from '../pdf-engine/render'
import { runResearch } from '../research/run'
import { rank, shortlist, type Candidate } from '../research/scoring'

export const ROUTINE: Actor = { kind: 'automation', id: 'guided-planet-cycle' }

export type Notify = (subject: string, body: string) => Promise<void>

export const issueNumbers = () => readdirSync(join(PUB, 'issues')).filter(d => /^\d{3}$/.test(d)).map(Number).sort((a, b) => a - b)

// A folder holding only a sample (a structure test) is not an edition yet.
// The routine opens it like any other when its month comes (writing
// plan.json), and drafting then writes the real issue over the sample.
const isSampleFile = (n: number) => { const f = join(issueDir(n), 'issue.json'); return existsSync(f) && !!JSON.parse(readFileSync(f, 'utf8')).sample }
export const isOpen = (n: number) => existsSync(join(issueDir(n), 'plan.json')) || (existsSync(join(issueDir(n), 'issue.json')) && !isSampleFile(n))
const realIssues = () => issueNumbers().filter(isOpen)

export function previousHeadlines(before: number): string[] {
  return issueNumbers().filter(n => n < before).flatMap(n => {
    const f = join(issueDir(n), 'issue.json')
    if (!existsSync(f)) return []
    const issue = JSON.parse(readFileSync(f, 'utf8'))
    return issue.sample ? [] : issue.pages.flatMap((p: { headline?: string }) => (p.headline ? [p.headline] : []))
  })
}

export function loadCandidates(n: number): Candidate[] {
  const f = join(issueDir(n), 'research.json')
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')).candidates : []
}

export function proposedStories(n: number) {
  const ranked = rank(loadCandidates(n).map(c => ({ ...c, scores: c.scores })), previousHeadlines(n))
  return shortlist(ranked)
}

// The next edition's plan, written when the routine opens it: the month, and
// an edition name once one is chosen. Read for the dashboard row before the
// issue file exists.
export function planFor(n: number): { slug: string; edition: string; month: string } {
  const f = join(issueDir(n), 'issue.json')
  if (existsSync(f)) { const i = JSON.parse(readFileSync(f, 'utf8')); return { slug: i.slug, edition: i.edition, month: i.month } }
  const p = join(issueDir(n), 'plan.json')
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : { slug: `issue-${pad3(n)}`, edition: 'Edition to be named', month: 'Month to be set' }
}

// Week one of a month opens the next edition, once the last one has its
// final approval. A sample issue is a structure test and is never followed.
export function openNextIssue(lastState: string | null, today = new Date()): number | null {
  const last = realIssues().at(-1) ?? 0
  if (last && lastState !== 'FINAL_APPROVED' && lastState !== 'PUBLISHED') return null
  if (today.getUTCDate() > 7) return null
  const n = last + 1
  const dir = issueDir(n)
  if (existsSync(join(dir, 'plan.json'))) return null
  mkdirSync(dir, { recursive: true })
  const next = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1))
  writeFileSync(join(dir, 'plan.json'), JSON.stringify({ slug: `issue-${pad3(n)}`, edition: 'Edition to be named', month: next.toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }) }, null, 2) + '\n')
  return n
}

export const selectionHash = (stories: Candidate[]) => storiesHash(stories.map(s => ({ id: s.id, headline: s.headline, sourceUrl: s.source.url })))

export async function step(store: Store, n: number, notify: Notify, log: (s: string) => void = console.log): Promise<string> {
  const s = await current(store, n)
  const dir = issueDir(n)
  const NNN = pad3(n)
  try {
    switch (s.state) {
      case 'DRAFT': {
        if (!existsSync(join(dir, 'research.json'))) {
          const r = await runResearch(n, dir, { previous: previousHeadlines(n) })
          if (!r.ok) return `issue ${NNN}: ${r.reason}`
        }
        const count = loadCandidates(n).length
        if (count < 5) return `issue ${NNN}: only ${count} candidates, waiting for more research`
        await transition(store, n, 'RESEARCHED', ROUTINE, { candidates: count })
        return `issue ${NNN}: researched, ${count} candidates`
      }
      case 'RESEARCHED': {
        const picked = proposedStories(n)
        if (picked.length < 5) return `issue ${NNN}: ${picked.length} verified stories on the shortlist, five are needed. Check the flagged candidates in research.json.`
        await transition(store, n, 'VERIFIED', ROUTINE, { shortlist: picked.map(c => c.id) })
        return `issue ${NNN}: verified, ${picked.length} stories on the shortlist`
      }
      case 'VERIFIED': {
        const picked = proposedStories(n)
        await transition(store, n, 'EDITORIAL_REVIEW', ROUTINE, { storiesHash: selectionHash(picked) })
        await notify(`The Guided Planet ${NNN}: approval one`, `Here are the proposed stories for Issue ${NNN}. Approve or request changes.\n\n${picked.map((c, i) => `${i + 1}. ${c.headline} (${c.total}/100, ${c.source.org})`).join('\n')}`)
        return `issue ${NNN}: asked for approval one`
      }
      case 'APPROVED': {
        // Drafting the pages: Claude writes issue.json from the approved
        // stories in the previous issue's templates (editorial/draft.ts). With
        // no API key, a Claude Code routine writes the file instead; either
        // way, design starts when the file exists.
        if (!existsSync(join(dir, 'issue.json')) || isSampleFile(n)) {
          if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) return `issue ${NNN}: approved, waiting for the drafted pages (issue.json)`
          const decided = await store.storyDecisions(n)
          const approved = loadCandidates(n).filter(c => decided[c.id]?.decision === 'approved')
          const { draftIssue } = await import('../editorial/draft')
          const plan = planFor(n)
          const r = await draftIssue(n, approved.length ? approved : proposedStories(n), { month: plan.month, edition: plan.edition })
          if (!r.ok) return `issue ${NNN}: drafted, but ${r.findings.length} checks still fail; see dist/report.json`
        }
        await transition(store, n, 'DESIGNING', ROUTINE)
        return `issue ${NNN}: designing`
      }
      case 'DESIGNING': {
        const report = await renderEdition(n)
        if (!report.ok) {
          await store.addEvent({ issue: n, at: new Date().toISOString(), actor: ROUTINE, action: 'render-failed', detail: { errors: [...report.editorial, ...Object.values(report.layout).flat()].filter(f => f.level === 'error').slice(0, 40) } })
          return `issue ${NNN}: the render has errors, see dist/report.json; it will try again next run`
        }
        const issue = JSON.parse(readFileSync(join(dir, 'issue.json'), 'utf8'))
        const pdfHash = sha256(readFileSync(join(dir, 'dist', `guided-planet-${NNN}.pdf`)))
        await transition(store, n, 'PROOF_READY', ROUTINE, { contentHash: contentHash(issue), pdfHash, renderOk: true })
        await notify(`The Guided Planet ${NNN}: approval two`, `Here is the finished newspaper. Approve publication or request revisions.`)
        return `issue ${NNN}: proof ready, asked for approval two`
      }
      default: {
        const w = waitingOn(s)
        return w ? `issue ${NNN}: waiting on Justin. ${w}` : `issue ${NNN}: ${s.state.toLowerCase().replace('_', ' ')}, nothing to do`
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    await store.addEvent({ issue: n, at: new Date().toISOString(), actor: ROUTINE, action: e instanceof GateError ? 'refused' : 'error', detail: { error: msg, state: s.state } })
    log(`issue ${NNN}: ${msg}`)
    return `issue ${NNN}: failed (${msg}); logged and will retry`
  }
}

export async function cycle(store: Store, notify: Notify, log: (s: string) => void = console.log) {
  const out: string[] = []
  const real = realIssues()
  const lastState = real.length ? (await current(store, real.at(-1)!)).state : null
  const opened = openNextIssue(lastState)
  if (opened) out.push(`issue ${pad3(opened)}: opened for next month's research`)
  for (const n of issueNumbers()) {
    if (!isOpen(n)) continue // a sample never enters the workflow until its month opens it
    if ((await current(store, n)).state === 'PUBLISHED') continue
    out.push(await step(store, n, notify, log))
  }
  return out
}
