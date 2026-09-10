'use client'

// THE AI TOOLS A SCHOOL HAS LOOKED AT, WORST FIRST.
//
// Client side because a review lives on the school's own device: the schools
// app has no accounts to hang it off and no school row to scope it to
// (schools/lib/access.ts, and the audit in
// plans/week-of-2026-09-07-school-ai-governance-plan.md). Nothing on this page
// reaches our server, which is also why there is no tenancy risk to get wrong.
//
// WHAT THIS PAGE WILL NEVER DO: invent a provider change. The brief asked for
// alerts like "this product introduced persistent memory since your last
// review" and was right to add "only when backed by actual stored data". We do
// not watch vendors, so the only alerts here are ones the school's own record
// supports: a review that is overdue, or one that was never finished.

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QUESTIONS } from '@gc/shared/ai-governance/questions'
import { assess, STATUS_LABEL } from '@gc/shared/ai-governance/rating'
import { BrowserReviewStore, newReview, storageAvailable, toExport, fromExport, isOverdue } from '@gc/shared/ai-governance/storage'
import type { Review } from '@gc/shared/ai-governance/types'
import { chip, STATUS_RATING } from './ratings'
import { panel, eyebrow, btnGold, btnQuiet, input, label as labelStyle, h1 } from '@/components/ui'

const store = new BrowserReviewStore()
const today = () => new Date().toISOString().slice(0, 10)
const msg = (e: unknown) => e instanceof Error ? e.message : 'That did not work.'

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[] | null>(null)
  const [canStore, setCanStore] = useState(true)
  // One slot for anything that went wrong in the buttons below it: a refused
  // write, a file that is not one of ours. Both appear in the same place
  // because both are answers to the same click.
  const [problem, setProblem] = useState('')

  useEffect(() => {
    setCanStore(storageAvailable())
    store.list().then(setReviews)
  }, [])

  const rows = useMemo(() => (reviews ?? []).map(r => {
    const result = assess(r, QUESTIONS)
    return { review: r, result, status: r.decision ?? result.suggested, overdue: isOverdue(r, today()) }
  }), [reviews])

  const counts = useMemo(() => ({
    all: rows.length,
    approved: rows.filter(r => r.status === 'approve').length,
    conditional: rows.filter(r => r.status === 'approve-with-conditions').length,
    review: rows.filter(r => r.status === 'review-required' || r.status === 'do-not-deploy-yet').length,
    overdue: rows.filter(r => r.overdue).length,
  }), [rows])

  // Worst first, then overdue, then most recently touched. A school opening
  // this page should see the thing that needs them, not the alphabet.
  const ordered = useMemo(() => {
    const rank = { 'do-not-deploy-yet': 0, 'review-required': 1, 'approve-with-conditions': 2, 'approve': 3 } as const
    return [...rows].sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status]
      return b.review.updatedAt.localeCompare(a.review.updatedAt)
    })
  }, [rows])

  async function addTool() {
    setProblem('')
    const id = globalThis.crypto?.randomUUID?.() ?? String(Date.now())
    const r = newReview(id, new Date().toISOString())
    // Without this the button does nothing at all on a device that will not
    // store: no new review, no navigation, no explanation.
    try { await store.save(r) } catch (e) { setProblem(msg(e)); return }
    window.location.href = `/hub/ai-governance/review/${id}`
  }

  async function doExport() {
    const all = await store.list()
    const blob = new Blob([toExport(all)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `ai-reviews-${today()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function doImport(file: File) {
    setProblem('')
    const { reviews: incoming, error } = fromExport(await file.text())
    if (error) { setProblem(error); return }
    let saved = 0
    try {
      for (const r of incoming) { await store.save(r); saved += 1 }
    } catch (e) {
      // Say how far it got. A half finished import that reports nothing is
      // worse than one that failed outright, because the list looks right.
      setProblem(`${msg(e)} ${saved} of ${incoming.length} came across before it stopped.`)
    }
    setReviews(await store.list())
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <Link href="/hub" style={{ ...eyebrow, textDecoration: 'none', display: 'inline-block', marginBottom: '14px' }}>
          ← The Hub
        </Link>

        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '4px' }}>Before it reaches children</div>
        <h1 style={{ ...h1, margin: '0 0 10px' }}>AI governance</h1>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)',
          lineHeight: 1.65, maxWidth: '620px', marginBottom: '24px',
        }}>
          Check an AI product before pupils or staff are asked to use it. Ten sections, a rating on each
          of eight things that matter, and a record you can hand to your governors. Children need
          preparing for AI, and no amount of preparing should have to make up for a product that was
          unsafe to buy.
        </p>

        {!canStore && (
          <div style={{ ...panel, background: 'var(--stage-1)', marginBottom: '18px' }}>
            <strong style={labelStyle}>This browser will not let us save anything.</strong>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '6px 0 0' }}>
              Reviews are kept on this device, and this one has storage switched off. You can still work
              through a review and print it, but it will not be here when you come back. Your IT lead can
              usually allow site storage for this address.
            </p>
          </div>
        )}

        {/* The counts, and the one that matters most is last on purpose: a
            school reads left to right and should finish on what needs them. */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '22px' }}>
          {[
            { n: counts.all, label: 'Tools reviewed' },
            { n: counts.approved, label: 'Approved' },
            { n: counts.conditional, label: 'With conditions' },
            { n: counts.review, label: 'Need a decision' },
            { n: counts.overdue, label: 'Overdue for review' },
          ].map(c => (
            <div key={c.label} style={{ ...panel, padding: '14px 16px', borderRadius: '16px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: 'var(--ink)', lineHeight: 1 }}>{c.n}</div>
              <div style={{ ...eyebrow, marginTop: '6px' }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
          <button onClick={addTool} style={btnGold}>Review a tool</button>
          <button onClick={doExport} style={btnQuiet} disabled={!rows.length}>Export all</button>
          <label style={{ ...btnQuiet, display: 'inline-flex', alignItems: 'center' }}>
            Import
            <input
              type="file" accept="application/json" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) void doImport(f) }}
            />
          </label>
        </div>
        {problem && (
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--stage-3-text)', fontSize: '15px', marginBottom: '18px' }}>{problem}</p>
        )}

        {reviews === null ? null : ordered.length === 0 ? (
          <div style={{ ...panel, textAlign: 'center', padding: '38px 24px' }}>
            <div style={{ fontSize: '34px', marginBottom: '10px' }} aria-hidden>🔍</div>
            <strong style={{ ...labelStyle, fontSize: '17px' }}>Nothing reviewed yet.</strong>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '8px auto 0', maxWidth: '420px' }}>
              Start with whichever AI tool is closest to being put in front of pupils. A first pass takes
              about twenty minutes and you can stop and come back.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {ordered.map(({ review, result, status, overdue }) => (
              <Link
                key={review.id}
                href={`/hub/ai-governance/review/${review.id}`}
                style={{ ...panel, textDecoration: 'none', display: 'block', color: 'inherit' }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)' }}>
                      {review.product || 'Untitled review'}
                    </div>
                    <div style={{ ...eyebrow, marginTop: '4px' }}>
                      {review.provider || 'Provider not recorded'}
                      {review.facing ? ` · ${review.facing === 'pupil' ? 'Pupil facing' : review.facing === 'teacher' ? 'Staff' : 'Admin'}` : ''}
                    </div>
                  </div>
                  <span style={chip(STATUS_RATING[status])}>{STATUS_LABEL[status]}</span>
                </div>

                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)',
                  marginTop: '10px', display: 'flex', gap: '14px', flexWrap: 'wrap',
                }}>
                  <span>{result.progress.answered} of {result.progress.total} answered</span>
                  {review.nextReviewOn && (
                    <span style={overdue ? { color: 'var(--stage-3-text)', fontWeight: 700 } : undefined}>
                      {overdue ? 'Review was due ' : 'Review due '}{review.nextReviewOn}
                    </span>
                  )}
                  {review.history.length > 0 && <span>{review.history.length} earlier version{review.history.length === 1 ? '' : 's'}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)',
          lineHeight: 1.6, marginTop: '26px', maxWidth: '620px',
        }}>
          These reviews are kept on this device and are never sent to us. Use Export to put a copy where
          your school keeps its records, which is where a DPIA belongs anyway, and Import to bring it onto
          another machine. Nothing here is legal advice: where an answer needs your DPO or your DSL, the
          question says so.
        </p>
      </div>
    </main>
  )
}
