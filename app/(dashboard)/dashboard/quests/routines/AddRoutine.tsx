'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ROUTINE_PACKS, type RoutinePack } from '@/lib/quests/routines'

// Add a whole week routine, on its own page.
//
// It was a card near the bottom of the Quests page, and the link on Manage jobs
// pointed at a hash on that page, so pressing "add a whole week routine" took a
// parent back to Quests and dropped them somewhere in the middle of it. Justin:
// "at the moment just takes to quest home page but needs to goto add routine
// separate page which then needs a bottom back to add a job".
//
// Same shape as the Manage jobs page it sits beside: a real page, a way back at
// the top, and a way ONWARD at the bottom. The bottom link matters. Adding a
// routine and adding a job are the same errand in a parent's head, so finishing
// one should offer the other rather than leaving them to find their own way.
//
// A routine is a bundle, and adding it is not all or nothing. The jobs are
// listed before they are added, each with a tick, all ticked to start with.
// Untick the school bag if your school bag is not a battle, and the routine
// lands as the four you actually meant.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; child_id: string | null }

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '18px', marginBottom: 14,
}

export default function AddRoutine() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [activeChild, setActiveChild] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)
  const [picks, setPicks] = useState<Record<string, string[]>>({})
  const [adding, setAdding] = useState<string | null>(null)
  const [added, setAdded] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/quests', { cache: 'no-store' })
      const d = await res.json()
      const kids: Child[] = d.children ?? []
      setChildren(kids)
      setQuests(d.quests ?? [])
      setActiveChild(prev => prev ?? kids[0]?.id ?? null)
    } catch { /* the page shows what it has */ }
    setLoading(false)
  }

  const mine = useMemo(() => quests.filter(q => q.child_id === activeChild || q.child_id === null), [quests, activeChild])
  const pickedTitles = (pack: RoutinePack) => picks[pack.key] ?? pack.tasks.map(t => t.title)

  function togglePick(pack: RoutinePack, title: string) {
    setPicks(prev => {
      const current = prev[pack.key] ?? pack.tasks.map(t => t.title)
      const next = current.includes(title) ? current.filter(t => t !== title) : [...current, title]
      return { ...prev, [pack.key]: next }
    })
  }

  async function addPack(pack: RoutinePack) {
    if (!activeChild || adding) return
    const picked = pickedTitles(pack)
    if (picked.length === 0) return
    setAdding(pack.key)
    // Ticked, and not already on the board. Tapping twice never doubles up.
    const fresh = pack.tasks.filter(t => picked.includes(t.title) && !mine.some(q => q.title === t.title))
    for (const t of fresh) {
      await fetch('/api/quests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        // quiet: the summary ping below speaks for the whole routine, so the
        // child gets one notification for one tap rather than one per job.
        body: JSON.stringify({ ...t, child_id: activeChild, quiet: true }),
      }).catch(() => {})
    }
    if (fresh.length > 0) {
      fetch('/api/quests/ping', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: activeChild, message: `New routine: ${pack.emoji} ${pack.name}` }),
      }).catch(() => {})
    }
    await load()
    setAdding(null)
    setOpen(null)
    setAdded(pack.name)
    setTimeout(() => setAdded(null), 3000)
  }

  if (loading) return <div style={{ height: 200, opacity: 0.35 }} aria-hidden />

  const childName = children.find(c => c.id === activeChild)?.name
  const name = childName && childName !== 'Your child' ? childName : 'your child'

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 20px 48px' }}>
      <Link href="/dashboard/quests/manage" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15, color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Manage jobs
      </Link>

      <p className="eyebrow" style={{ marginBottom: 4 }}>Routines</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 6px' }}>
        Add a whole week
      </h1>
      <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        A routine is a set of jobs that lands together. Tap one to see what is in it, untick anything that is not a battle in your house, then add it.
      </p>

      {children.length > 1 && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
          {children.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChild(c.id)}
              style={{
                border: `1.5px solid ${activeChild === c.id ? 'var(--terracotta)' : 'var(--border)'}`,
                background: activeChild === c.id ? 'var(--terracotta-lt)' : '#fff',
                borderRadius: 100, padding: '8px 15px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)',
              }}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {added && (
        <div role="status" style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--retro-green)', color: '#fff',
          borderRadius: 14, padding: '12px 15px', marginBottom: 14,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5,
        }}>
          <span aria-hidden>✓</span> {added} is on {name}&apos;s board
        </div>
      )}

      {ROUTINE_PACKS.map(pack => {
        const isOpen = open === pack.key
        const picked = pickedTitles(pack)
        const already = pack.tasks.filter(t => mine.some(q => q.title === t.title)).length
        const allOn = already === pack.tasks.length

        return (
          <div key={pack.key} style={{ ...CARD, borderColor: isOpen ? 'var(--terracotta)' : 'var(--border)' }}>
            <button
              onClick={() => setOpen(isOpen ? null : pack.key)}
              aria-expanded={isOpen}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
            >
              <span aria-hidden style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{pack.emoji}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: 'var(--ink)', lineHeight: 1.2 }}>
                  {pack.name}
                </span>
                <span style={{ display: 'block', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>
                  {allOn ? 'Already on their board' : pack.blurb}
                </span>
              </span>
              <span aria-hidden style={{ fontSize: 16, color: 'var(--ink-light)', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>

            {isOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
                  {pack.tasks.map(t => {
                    const on = picked.includes(t.title)
                    const onBoard = mine.some(q => q.title === t.title)
                    return (
                      <label key={t.title} style={{
                        display: 'flex', alignItems: 'center', gap: 10, cursor: onBoard ? 'default' : 'pointer',
                        border: '1.5px solid var(--border)', borderRadius: 13, padding: '10px 12px',
                        background: onBoard ? 'var(--cream)' : '#fff', opacity: onBoard ? 0.6 : 1,
                      }}>
                        <input
                          type="checkbox"
                          checked={onBoard || on}
                          disabled={onBoard}
                          onChange={() => togglePick(pack, t.title)}
                          style={{ width: 20, height: 20, flexShrink: 0, accentColor: 'var(--terracotta)' }}
                        />
                        <span aria-hidden style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{t.emoji}</span>
                        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', lineHeight: 1.25 }}>
                          {t.title}
                        </span>
                        <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                          {onBoard ? 'on' : `⭐${t.stars}`}
                        </span>
                      </label>
                    )
                  })}
                </div>
                <button
                  onClick={() => addPack(pack)}
                  disabled={!!adding || allOn}
                  className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: 16.5, opacity: allOn ? 0.5 : 1 }}
                >
                  {allOn ? 'Already added' : adding === pack.key ? 'Adding' : `Add ${picked.filter(p => !mine.some(q => q.title === p)).length} jobs`}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* The way onward, at the bottom, asked for by name. Adding a routine and
          adding a job are the same errand, so finishing one offers the other
          rather than leaving a parent to find their own way back. */}
      <Link
        href="/dashboard/quests/manage"
        className="btn btn-outline"
        style={{ display: 'flex', justifyContent: 'center', marginTop: 22, padding: '15px 20px', fontSize: 16.5, textDecoration: 'none' }}
      >
        ← Back to add a job
      </Link>
    </div>
  )
}
