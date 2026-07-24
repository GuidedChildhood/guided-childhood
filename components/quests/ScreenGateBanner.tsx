'use client'

import { useEffect, useState } from 'react'
import { DEVICES, type DeviceKey } from '@/lib/quests/device-time'
import { wouldExceedGuide } from '@/lib/quests/daily-guide'
import { PendingAskBox } from '@/components/quests/ParentDeviceTime'

// The screens gate, made visible to the parent on the quests page. The
// pending ask always comes first: device and minutes with Yes, start it and
// Not yet, the same one tap answer as the screen time card. Under it, the
// jobs still blocking the timer, grouped by title with a red count chip for
// repeats (never a comma list), each with a butter Remind button that pushes
// the child if their phone is set up and ALWAYS writes an in app nudge they
// see on their own dashboard. Refreshes on the same poll the card runs.

export type GateJob = { questId: string; title: string; count: number }

type ActiveKid = {
  id: string
  name: string
  request: { id: string; device: DeviceKey; minutes: number } | null
  ageBand?: string | null
  usedToday?: number
}

export default function ScreenGateBanner({
  childId, childName, gateCount, blocking, onAnswered, coView, fixture,
}: {
  childId: string
  childName: string
  // How many before screens jobs are due today at all (zero hides the banner).
  gateCount: number
  // The ones not yet approved, grouped by title.
  blocking: GateJob[]
  // Let the page reload its board after a yes or not yet.
  onAnswered?: () => void
  // Co-view children have no device of their own to press Start, so once the
  // gate is clear the parent starts the timer here, and the minutes are
  // recorded to the week just as a child's own Start would.
  coView?: boolean
  // Fixture only: seed the ask and skip the network, so the ref page can
  // screenshot the banner without a database.
  fixture?: { request: { id: string; device: DeviceKey; minutes: number } | null }
}) {
  const [kid, setKid] = useState<ActiveKid | null>(fixture ? { id: childId, name: childName, request: fixture.request } : null)
  const [busy, setBusy] = useState(false)
  const [reminded, setReminded] = useState<string | null>(null)

  useEffect(() => {
    if (fixture) return
    let live = true
    const load = async () => {
      try {
        const r = await fetch('/api/quests/time/active')
        const d = await r.json()
        if (!live) return
        setKid(((d.children ?? []) as ActiveKid[]).find(k => k.id === childId) ?? null)
      } catch { /* the next poll tries again */ }
    }
    load()
    const t = setInterval(load, 20000)
    return () => { live = false; clearInterval(t) }
  }, [childId, fixture])

  async function answer(status: 'approved' | 'declined') {
    if (!kid?.request || busy) return
    setBusy(true)
    try {
      await fetch('/api/quests/time/request', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: kid.request.id, status }),
      })
      setKid(k => k ? { ...k, request: null } : k)
      onAnswered?.()
    } catch { /* non blocking */ }
    setBusy(false)
  }

  // Co-view start: the parent begins the timer for a child with no device of
  // their own, so the co-watched minutes still land in the week's stats. A
  // gift (no stars spent), since the gate jobs already earned it.
  const [startDevice, setStartDevice] = useState<DeviceKey>('tv')
  const [startMins, setStartMins] = useState(30)
  const [starting, setStarting] = useState(false)
  const [started, setStarted] = useState(false)
  async function startTimer() {
    if (starting) return
    setStarting(true)
    try {
      const r = await fetch('/api/quests/time/parent-start', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, device: startDevice, minutes: startMins, bonus: true }),
      })
      if (r.ok) { setStarted(true); onAnswered?.(); setTimeout(() => setStarted(false), 4000) }
    } catch { /* the tap can be tried again */ }
    setStarting(false)
  }
  const startChip = (active: boolean): React.CSSProperties => ({
    padding: '6px 11px', borderRadius: 100, cursor: 'pointer',
    border: `1.5px solid ${active ? 'var(--terracotta)' : 'var(--border)'}`,
    background: active ? '#fff' : 'rgba(255,255,255,0.55)',
    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--ink)', flexShrink: 0,
  })

  async function remind(job: GateJob) {
    setReminded(job.questId)
    setTimeout(() => setReminded(r => (r === job.questId ? null : r)), 2600)
    try {
      await fetch('/api/quests/nudge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, questId: job.questId }),
      })
    } catch { /* the tap already read as sent; the next one retries */ }
  }

  if (gateCount === 0) return null
  const locked = blocking.length > 0
  const request = kid?.request ?? null

  return (
    <div style={{ marginBottom: '18px' }}>
      {/* The ask first: a child waiting on a yes outranks everything. */}
      {request && (
        <PendingAskBox
          childName={childName}
          request={request}
          exceedsGuide={wouldExceedGuide(kid?.ageBand ?? null, kid?.usedToday ?? 0, request.minutes)}
          busy={busy}
          onApprove={() => answer('approved')}
          onDecline={() => answer('declined')}
        />
      )}

      <div style={{
        background: locked ? 'var(--danger-bg)' : 'var(--stage-4)',
        border: `1.5px solid ${locked ? 'var(--danger)' : 'var(--pastel-pink-deep)'}`,
        borderRadius: '14px', padding: '13px 15px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: locked ? '10px' : 0 }}>
          <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{locked ? '🔒' : '🎉'}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: locked ? 'var(--ink)' : 'var(--stage-4-text)' }}>
              {locked ? 'Screen time is locked' : `Screen time unlocked for ${childName}`}
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              {locked
                ? `Approve the job${blocking.length === 1 && blocking[0].count === 1 ? '' : 's'} below and ${childName}'s timer can start.`
                : `${childName} finished the before screens ${gateCount === 1 ? 'task' : 'tasks'}, so their timer is ready. Enjoy some screen together, they have earned it.`}
            </div>
          </div>
        </div>

        {/* Co-view: no child device to press Start, so the parent starts the
            timer here and the minutes are recorded to the week. */}
        {!locked && coView && (
          <div style={{ marginTop: 12, borderTop: '1px solid var(--pastel-pink-deep)', paddingTop: 12 }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600, marginBottom: 9, lineHeight: 1.45 }}>
              Watching together on a shared screen? Start the timer here so it still counts in {childName}&apos;s week.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {DEVICES.map(d => (
                <button key={d.key} type="button" onClick={() => setStartDevice(d.key)} style={startChip(startDevice === d.key)}>{d.emoji} {d.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {[15, 30, 45, 60].map(m => (
                <button key={m} type="button" onClick={() => setStartMins(m)} style={startChip(startMins === m)}>{m}m</button>
              ))}
            </div>
            <button
              type="button"
              onClick={startTimer}
              disabled={starting}
              style={{
                width: '100%', padding: '10px', borderRadius: 12, border: 'none',
                cursor: starting ? 'default' : 'pointer', background: 'var(--terracotta)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
                boxShadow: starting ? 'none' : '0 3px 0 var(--terracotta-dark)',
              }}
            >
              {starting ? 'Starting…' : started ? 'Started ✓' : `Start ${startMins} minutes`}
            </button>
          </div>
        )}

        {/* The blocking jobs, one row each, grouped by title. */}
        {locked && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {blocking.map(job => (
              <div key={job.questId} style={{
                display: 'flex', alignItems: 'center', gap: '9px',
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: '12px', padding: '9px 12px',
              }}>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {job.title}
                </span>
                {job.count > 1 && (
                  <span style={{
                    flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
                    background: 'var(--danger)', color: '#fff', borderRadius: '100px', padding: '3px 9px',
                  }}>
                    ×{job.count}
                  </span>
                )}
                <button
                  onClick={() => remind(job)}
                  style={{
                    flexShrink: 0, border: 'none', borderRadius: '11px', padding: '8px 13px',
                    cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px',
                    background: reminded === job.questId ? 'var(--tint-sage)' : 'var(--terracotta)',
                    color: 'var(--ink)',
                    boxShadow: reminded === job.questId ? 'none' : '0 3px 0 var(--terracotta-dark)',
                  }}
                >
                  {reminded === job.questId ? 'Sent ✓' : `Remind ${childName}`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
