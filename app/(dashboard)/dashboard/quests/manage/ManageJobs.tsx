'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { QUEST_TEMPLATES, type QuestTemplate } from '@/lib/quests/templates'
import ShareQrButton from '@/components/quests/ShareQrButton'

// Manage jobs, on its own page.
//
// It used to be a panel that expanded inside the Quests page, so "manage jobs"
// meant scrolling a long page to a card that then had a Close button on it.
// Justin, twice: "it should clearly goto a new page not scroll", and "every
// time job added it give you option to add another not scrolling away".
//
// Mobbin first, per CLAUDE.md. Todoist is the direct answer to the second half:
// adding a task drops a small "Task added" pill at the top while the composer
// stays exactly where it is, empty and ready for the next one. Nothing moves,
// nothing collapses, and you can add six things without your thumb leaving the
// same spot. Superlist, Amie and Evernote all do the same thing, a dedicated
// compose surface where the confirmation never displaces the input.
//
// Three jobs on this page, which is what Justin asked for: mark one done, add
// one, and answer what the child has asked for. Everything else about quests
// stays on the Quests page.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; child_id: string | null }
type Tick = { id: string; quest_id: string; child_id: string | null; status: string; tick_date: string }
type Ask = { id: string; child_id: string | null; title: string; status: string }

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '18px 18px 20px', marginBottom: 16,
}
const H2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19,
  color: 'var(--ink)', margin: '0 0 4px', letterSpacing: '-0.02em',
}
const SUB: React.CSSProperties = { fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }
const LINK_BTN: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
  color: 'var(--terracotta)', letterSpacing: '0.04em', padding: '6px 4px',
}

export default function ManageJobs() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [previous, setPrevious] = useState<Quest[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [asks, setAsks] = useState<Ask[]>([])
  const [links, setLinks] = useState<{ child_id: string }[]>([])
  const [activeChild, setActiveChild] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [custom, setCustom] = useState('')
  // The Todoist pill. What was just added, held briefly, ABOVE the composer so
  // the composer never moves.
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [allIdeas, setAllIdeas] = useState(false)
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { load() }, [])
  useEffect(() => () => { if (addedTimer.current) clearTimeout(addedTimer.current) }, [])

  async function load() {
    try {
      const res = await fetch('/api/quests', { cache: 'no-store' })
      const d = await res.json()
      const kids: Child[] = d.children ?? []
      setChildren(kids)
      setQuests(d.quests ?? [])
      setPrevious(d.previous ?? [])
      setTicks(d.ticks ?? [])
      setAsks((d.requests ?? []).filter((r: Ask) => r.status === 'pending'))
      setLinks(d.links ?? [])
      setActiveChild(prev => prev ?? kids[0]?.id ?? null)
    } catch { /* the page shows what it has */ }
    setLoading(false)
  }

  function flash(title: string) {
    setJustAdded(title)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setJustAdded(null), 2600)
  }

  async function add(t: { title: string; emoji: string; stars: number; schedule: string }) {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/api/quests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, child_id: activeChild }),
      })
      flash(t.title)
      await load()
    } finally { setBusy(false) }
  }

  async function remove(id: string) {
    if (busy) return
    setBusy(true)
    setQuests(qs => qs.filter(q => q.id !== id))
    try {
      await fetch('/api/quests', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: id }),
      })
      await load()
    } finally { setBusy(false) }
  }

  async function approve(tickId: string) {
    if (busy) return
    setBusy(true)
    setTicks(ts => ts.filter(t => t.id !== tickId))
    try {
      await fetch('/api/quests/approve', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tick_id: tickId, decision: 'approve' }),
      })
      await load()
    } finally { setBusy(false) }
  }

  async function decideAsk(id: string, decision: 'added' | 'declined') {
    if (busy) return
    setBusy(true)
    setAsks(a => a.filter(x => x.id !== id))
    try {
      await fetch('/api/quests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_decide', request_id: id, decision }),
      })
      await load()
    } finally { setBusy(false) }
  }

  const mine = useMemo(() => quests.filter(q => q.child_id === activeChild || q.child_id === null), [quests, activeChild])
  const myPrevious = useMemo(() => previous.filter(q => q.child_id === activeChild || q.child_id === null), [previous, activeChild])
  const waiting = useMemo(() => ticks.filter(t => t.status === 'pending' && (t.child_id === activeChild || t.child_id === null)), [ticks, activeChild])
  const myAsks = useMemo(() => asks.filter(a => a.child_id === activeChild || a.child_id === null), [asks, activeChild])
  const questById = useMemo(() => new Map(quests.map(q => [q.id, q])), [quests])

  // Ideas we have not already put on their board. Play first, because play pays
  // the most stars and is the job families most often forget counts.
  const usedTitles = new Set(mine.map(q => q.title.toLowerCase()))
  const ideas = QUEST_TEMPLATES
    .filter(t => !usedTitles.has(t.title.toLowerCase()))
    .sort((a, b) => Number(!!b.play) - Number(!!a.play))

  const hasApp = !!activeChild && links.some(l => l.child_id === activeChild)
  const childName = children.find(c => c.id === activeChild)?.name
  const name = childName && childName !== 'Your child' ? childName : 'your child'

  if (loading) {
    return <div style={{ height: 200, opacity: 0.35 }} aria-hidden />
  }

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 20px 48px' }}>
      <Link href="/dashboard/quests" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15, color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Quests
      </Link>

      <p className="eyebrow" style={{ marginBottom: 4 }}>Manage jobs</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 6px' }}>
        {childName && childName !== 'Your child' ? `${childName}'s jobs` : 'Your jobs'}
      </h1>
      <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        Add as many as you like. Nothing here closes on you.
      </p>

      {/* How the job actually reaches them.
          A parent adding jobs on their own phone has no way of knowing whether
          any of it lands anywhere. Justin: "when adult adds they need to know,
          should it prompt scan this code on child's phone to get it added, and
          show QR code or manage yourself here". So the answer sits right where
          the adding happens, and it says which of the two worlds this family is
          in rather than making them guess. */}
      {activeChild && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          background: hasApp ? 'var(--cream)' : 'var(--terracotta-lt)',
          border: `1.5px solid ${hasApp ? 'var(--border)' : 'var(--terracotta)'}`,
          borderRadius: 16, padding: '13px 15px', marginBottom: 16,
        }}>
          <span style={{ flex: 1, minWidth: 180, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.5 }}>
            {hasApp
              ? <>Anything you add here appears on {name}&apos;s phone straight away.</>
              : <><strong>{name} has no app yet.</strong> Scan a code on their phone to set it up, or carry on and mark jobs off yourself here.</>}
          </span>
          <ShareQrButton
            childId={activeChild}
            childName={childName}
            label={hasApp ? 'Show the code again' : 'Scan on their phone'}
            style={{ flexShrink: 0 }}
          />
        </div>
      )}

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

      {/* 1. Mark one done. First, because somebody is waiting on it and the
             stars are not theirs until this happens. */}
      {waiting.length > 0 && (
        <section style={{ ...CARD, borderColor: 'var(--terracotta)' }}>
          <h2 style={H2}>Waiting on you</h2>
          <p style={SUB}>{name} says {waiting.length === 1 ? 'this is' : 'these are'} done. The stars land the moment you agree.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {waiting.map(t => {
              const q = questById.get(t.quest_id)
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', borderRadius: 14, padding: '10px 12px' }}>
                  <span aria-hidden style={{ fontSize: 19, lineHeight: 1, flexShrink: 0 }}>{q?.emoji ?? '⭐'}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q?.title ?? 'A job'}
                    </span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: 1 }}>
                      {t.tick_date}
                    </span>
                  </span>
                  <button onClick={() => approve(t.id)} disabled={busy} className="btn btn-gold" style={{ flexShrink: 0, padding: '9px 16px', fontSize: 14.5 }}>
                    Done ✓
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 2. What the child asked for. Their own idea, which is the best kind. */}
      {myAsks.length > 0 && (
        <section style={CARD}>
          <h2 style={H2}>{name} asked for {myAsks.length === 1 ? 'this' : 'these'}</h2>
          <p style={SUB}>A job they thought of themselves. Say yes and it goes straight on their board.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {myAsks.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', borderRadius: 14, padding: '10px 12px', flexWrap: 'wrap' }}>
                <span style={{ flex: 1, minWidth: 140, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.3 }}>
                  {a.title}
                </span>
                <button onClick={() => decideAsk(a.id, 'added')} disabled={busy} className="btn btn-gold" style={{ flexShrink: 0, padding: '9px 16px', fontSize: 14.5 }}>
                  Yes, add it
                </button>
                <button onClick={() => decideAsk(a.id, 'declined')} disabled={busy} style={{ ...LINK_BTN, color: 'var(--ink-muted)' }}>
                  Not this one
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Add. The composer never moves and never closes. */}
      <section style={CARD}>
        <h2 style={H2}>Add a job</h2>
        <p style={SUB}>Tap an idea or write your own. It stays open, so add as many as you want.</p>

        {/* The confirmation sits ABOVE the input, which is the whole trick.
            Todoist does this and it is why you can add six things without your
            thumb moving: the thing that changes is never the thing you are
            about to touch. */}
        {/* Fixed height, and the pill is pinned to ONE line.
            First pass let the job title wrap, so a long one made the pill two
            lines tall and pushed the input down 26px, measured. A confirmation
            that moves the thing you are about to touch is the bug it was meant
            to prevent, so the title truncates and the slot never changes size. */}
        <div style={{ height: 38, marginBottom: 10 }}>
          {justAdded && (
            <div role="status" style={{
              display: 'flex', alignItems: 'center', gap: 8, maxWidth: '100%',
              background: 'var(--retro-green)', color: '#fff', borderRadius: 100,
              padding: '9px 15px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5,
              whiteSpace: 'nowrap', overflow: 'hidden',
            }}>
              <span aria-hidden style={{ flexShrink: 0 }}>✓</span>
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>Added {justAdded}</span>
              <span style={{ flexShrink: 0, opacity: 0.85, fontWeight: 600 }}>· add another</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <input
            className="input"
            value={custom}
            onChange={e => setCustom(e.target.value.slice(0, 80))}
            onKeyDown={e => {
              if (e.key === 'Enter' && custom.trim()) {
                add({ title: custom.trim(), emoji: '⭐', stars: 2, schedule: 'daily' })
                setCustom('')
              }
            }}
            placeholder="Write your own: feed the dog, violin"
            style={{ flex: 1, minWidth: 180, fontSize: 16 }}
          />
          <button
            onClick={() => { if (custom.trim()) { add({ title: custom.trim(), emoji: '⭐', stars: 2, schedule: 'daily' }); setCustom('') } }}
            disabled={busy || !custom.trim()}
            className="btn btn-gold"
            style={{ flexShrink: 0, padding: '12px 20px', fontSize: 15.5, opacity: custom.trim() ? 1 : 0.5 }}
          >
            Add it
          </button>
        </div>

        {myPrevious.length > 0 && (
          <>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', margin: '0 0 8px' }}>
              You have used these before
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
              {myPrevious.slice(0, 10).map(q => (
                <button
                  key={q.id}
                  onClick={() => add({ title: q.title, emoji: q.emoji, stars: q.stars, schedule: q.schedule })}
                  disabled={busy}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, border: '1.5px solid var(--border)',
                    borderRadius: 100, background: '#fff', padding: '8px 13px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--ink)',
                  }}
                >
                  <span aria-hidden>{q.emoji}</span>{q.title}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Six, then ask. Printing all twenty seven made this page six and a
            half thousand pixels tall, which is the scrolling the page was built
            to get rid of. Six is enough to recognise the idea and get on. */}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 8px' }}>
          Or tap an idea
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {(allIdeas ? ideas : ideas.slice(0, 6)).map((t: QuestTemplate) => (
            <button
              key={t.title}
              onClick={() => add(t)}
              disabled={busy}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left',
                padding: '11px 13px', borderRadius: 14, cursor: 'pointer',
                background: '#fff', border: '1.5px solid var(--border)',
              }}
            >
              <span aria-hidden style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{t.emoji}</span>
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.25 }}>
                {t.title}
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                ⭐{t.stars}
              </span>
            </button>
          ))}
        </div>
        {ideas.length > 6 && (
          <button onClick={() => setAllIdeas(v => !v)} style={{ ...LINK_BTN, marginTop: 10 }}>
            {allIdeas ? 'Show fewer' : `Show all ${ideas.length} ideas`}
          </button>
        )}
      </section>

      {/* 4. Everything currently on their board, so "what have we got" is
             answered on the same page rather than back on Quests. */}
      <section style={CARD}>
        <h2 style={H2}>On {name}&apos;s board</h2>
        <p style={SUB}>{mine.length === 0 ? 'Nothing yet. Add one above.' : `${mine.length} job${mine.length === 1 ? '' : 's'} running.`}</p>
        {mine.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {mine.map(q => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', borderRadius: 14, padding: '10px 12px' }}>
                <span aria-hidden style={{ fontSize: 19, lineHeight: 1, flexShrink: 0 }}>{q.emoji}</span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.title}
                </span>
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--terracotta-dark)' }}>⭐{q.stars}</span>
                <button onClick={() => remove(q.id)} disabled={busy} style={{ ...LINK_BTN, color: 'var(--ink-muted)' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* A real button, and it goes to a real page.
          It was a small mono text link pointing at a hash on the Quests page,
          so it read as a footnote and then dumped a parent back into the middle
          of the page they had just left. Justin: the button "needs to be bigger"
          and "needs to goto add routine separate page". */}
      {/* The three other places a parent goes from here, all real pages.
          Justin asked for the timer and the balance as their own buttons and
          their own pages, because starting twenty minutes of TV and reading the
          week are different jobs done at different moments. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 6 }}>
        <Link href="/dashboard/quests/routines" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', padding: '15px 20px', fontSize: 16.5, textDecoration: 'none' }}>
          Add a whole week routine →
        </Link>
        <Link href="/dashboard/quests/timer" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', padding: '15px 20px', fontSize: 16.5, textDecoration: 'none' }}>
          Start the screen timer →
        </Link>
        <Link href="/dashboard/stats" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'center', padding: '15px 20px', fontSize: 16.5, textDecoration: 'none' }}>
          Balance and stats →
        </Link>
      </div>
    </div>
  )
}
