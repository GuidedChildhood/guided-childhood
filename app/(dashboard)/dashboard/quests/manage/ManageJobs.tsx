'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QUEST_TEMPLATES, type QuestTemplate } from '@/lib/quests/templates'
import ShareQrButton from '@/components/quests/ShareQrButton'
import SentToast from '@/components/ui/SentToast'

// Add a job, on its own page, with the three jobs of this page split into
// three tabs.
//
// It used to be a panel that expanded inside the Quests page, so "manage jobs"
// meant scrolling a long page to a card that then had a Close button on it.
// Justin, twice: "it should clearly goto a new page not scroll", and "every
// time job added it give you option to add another not scrolling away". That
// half is done: this is a real page and the composer never closes.
//
// What was left was the arrival. Justin, 31 July, on Chrome: adding a job "has
// to be effortless" and it is not. The page stacked all three jobs it does on
// top of each other, so the composer was followed by a used before chip row,
// then six full width idea rows, then a show all toggle, then the board, then
// the waiting queue. Whichever of the three you came for, you scrolled past the
// other two, and the one with a person waiting on it could be either above or
// below the fold depending on the day.
//
// So: tabs. Add a job, waiting for you to agree, waiting for the child. Three
// separate jobs, three separate screens, each one landing on itself.
//
// Mobbin first, per CLAUDE.md. Superlist is Justin's own pick and the three
// screens he linked are exactly this composer:
//   mobbin.com/screens/56fef9c7-0c74-48e6-8072-929ff3d8ab52  quick add, chips under the input
//   mobbin.com/screens/9f3a195c-f97a-465c-b193-260d3a809b4b  the chip resolves in place
//   mobbin.com/screens/ca834342-5966-435e-ad64-76121031a6a9  added items stack, keyboard stays up
// Pulled and read again in this session. The lesson taken from all three is
// that the suggestions live UNDER the input as chips on one or two wrapped
// rows, not as a tall scrolling list, so the whole composer is one thumb reach
// and the confirmation never displaces the input. Ours were full width rows at
// 56px each, which is what turned six suggestions into most of a phone screen.
// Tiimo supplies the value pill per row, so a chip still says what it is worth.
//
// The job model itself is untouched here and stays that way: multi add, the
// schedule and band persisting between adds, repeats, bands, cancel,
// schedule_days and the soft guide at five jobs are all built and all correct.
// This file is layout and navigation.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; child_id: string | null }
type Tick = { id: string; quest_id: string; child_id: string | null; status: string; tick_date: string }
type Ask = { id: string; child_id: string | null; title: string; status: string }

type TabKey = 'add' | 'agree' | 'theirs'

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
// The chip, which is now the only shape a suggestion takes on this page.
const CHIP: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: '1.5px solid var(--border)', borderRadius: 100, background: '#fff',
  padding: '8px 13px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--ink)',
}
// A quiet line for a tab with nothing in it. An empty tab has to say so in
// words, because an empty panel reads as a page that failed to load.
const EMPTY: React.CSSProperties = {
  fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0,
}

function isTab(v: string | null): v is TabKey {
  return v === 'add' || v === 'agree' || v === 'theirs'
}

export default function ManageJobs({
  initialChild = null, initialTab = null,
}: {
  initialChild?: string | null
  initialTab?: string | null
} = {}) {
  // The pairing card, once the child actually has the app.
  //
  // Justin: "can this be clever enough to know if set up, or only come up once
  // a week if not, or a dismiss."
  //
  // The clever half already worked: hasApp reads kid_links and the card is a
  // different card entirely when a child has no app, amber and asking to be
  // dealt with. What it did not do was ever stop. Once a family is set up the
  // card is pure information, and a permanent banner on the page a parent
  // opens most is a banner they stop seeing, taking the space with it.
  //
  // So it can be put away for a week. A week rather than for ever because a
  // code is exactly what a parent needs again on the day a phone is replaced
  // or a second child gets one, and a dismissal that never returns is how they
  // end up unable to find it.
  //
  // Only the settled version can be dismissed. The no app yet card is an
  // unfinished setup and stays until it is done.
  const [codeCardHidden, setCodeCardHidden] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [previous, setPrevious] = useState<Quest[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [asks, setAsks] = useState<Ask[]>([])
  const [links, setLinks] = useState<{ child_id: string }[]>([])
  const [activeChild, setActiveChild] = useState<string | null>(initialChild)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [custom, setCustom] = useState('')
  // What the bottom confirmation is saying, null when nothing.
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const [allIdeas, setAllIdeas] = useState(false)
  // Add opens first. It is the reason the page exists and the reason Justin
  // asked for it, so it is never anything else on arrival unless the link that
  // brought you here said otherwise.
  const [tab, setTab] = useState<TabKey>(isTab(initialTab) ? initialTab : 'add')

  useEffect(() => { load() }, [])

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
      // A child named on the URL wins, as long as this family actually has
      // them. Otherwise the first child, the way it always did.
      setActiveChild(prev => {
        if (prev && kids.some(k => k.id === prev)) return prev
        return kids[0]?.id ?? null
      })
    } catch { /* the page shows what it has */ }
    setLoading(false)
  }

  // Names the child, because this page can be pointed at either of them and a
  // bare "Added Make your bed" does not say whose board it landed on.
  function flash(title: string) {
    const who = children.find(c => c.id === activeChild)?.name
    setJustAdded(who ? `${title} sent to ${who}` : `${title} added`)
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
      // The bell and the red count on the way in both drop at once, so the
      // number a parent just cleared is not still sitting there behind them.
      try { window.dispatchEvent(new Event('gc:notifs-changed')) } catch { /* SSR */ }
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

  // Per child, because one child having a phone says nothing about the next.
  const codeKey = activeChild ? `gc_code_card_hidden_${activeChild}` : null
  useEffect(() => {
    if (!codeKey) return
    try {
      const until = Number(window.localStorage.getItem(codeKey) ?? 0)
      setCodeCardHidden(Number.isFinite(until) && until > Date.now())
    } catch { setCodeCardHidden(false) }
  }, [codeKey])

  function hideCodeCard() {
    setCodeCardHidden(true)
    if (!codeKey) return
    try {
      window.localStorage.setItem(codeKey, String(Date.now() + 7 * 86400000))
    } catch { /* private mode. It stays hidden for this visit, which is enough. */ }
  }
  const childName = children.find(c => c.id === activeChild)?.name
  const name = childName && childName !== 'Your child' ? childName : 'your child'

  // Everything on this tab strip that has a number, so the tab can carry it.
  // The agree count is the only one that goes red: it is the only one with a
  // child standing at the other end of it whose stars are not theirs yet.
  const agreeCount = waiting.length + myAsks.length

  if (loading) {
    return <div style={{ height: 200, opacity: 0.35 }} aria-hidden />
  }

  const TABS: { key: TabKey; label: string; count: number; alert: boolean }[] = [
    { key: 'add', label: 'Add a job', count: 0, alert: false },
    { key: 'agree', label: 'Waiting for you', count: agreeCount, alert: true },
    { key: 'theirs', label: `Waiting for ${name === 'your child' ? 'them' : name}`, count: mine.length, alert: false },
  ]

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 20px 48px' }}>
      <Link href="/dashboard/quests" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15, color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Quests
      </Link>

      <p className="eyebrow" style={{ marginBottom: 4 }}>Jobs</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 6px' }}>
        {childName && childName !== 'Your child' ? `${childName}'s jobs` : 'Your jobs'}
      </h1>
      <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        Add as many as you like. Nothing here closes on you.
      </p>

      {/* The child picker sits ABOVE the tabs, because it scopes all three of
          them. Switching child inside a tab keeps you on that tab, which is
          right: a parent agreeing one child's jobs then switching to the other
          wants the agree list again, not the composer. */}
      {children.length > 1 && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
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

      {/* The tab strip. Three jobs, three screens.
          Counts live on the tabs so a parent can see what is behind the two
          they are not looking at without opening either, which is the whole
          reason the stack failed: the waiting queue was real information the
          layout could hide. */}
      <div
        role="tablist"
        aria-label="Jobs"
        style={{
          display: 'flex', gap: 6, marginBottom: 18, padding: 4,
          background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 100,
        }}
      >
        {TABS.map(t => {
          const on = tab === t.key
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '9px 8px', borderRadius: 100, cursor: 'pointer',
                border: 'none', background: on ? '#fff' : 'transparent',
                boxShadow: on ? '0 2px 0 rgba(26,26,46,0.07)' : 'none',
                fontFamily: 'var(--font-display)', fontWeight: on ? 800 : 600,
                fontSize: 13, color: on ? 'var(--ink)' : 'var(--ink-soft)',
                lineHeight: 1.2, textAlign: 'center',
              }}
            >
              {/* Wraps rather than clips. Held on one line at 390 wide these
                  read "Waitin..." and "Waitin...", which is two tabs a parent
                  cannot tell apart: the truncation eats the only words that
                  distinguish them. Given two lines they fit in full. */}
              <span>{t.label}</span>
              {t.count > 0 && (
                <span style={{
                  flexShrink: 0, minWidth: 20, padding: '1px 6px', borderRadius: 100,
                  fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700,
                  background: t.alert ? '#E5484D' : 'var(--border)',
                  color: t.alert ? '#fff' : 'var(--ink-soft)',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Add a job ───────────────────────────────────────────────── */}
      {tab === 'add' && (
        <>
          {/* How the job actually reaches them.
              A parent adding jobs on their own phone has no way of knowing
              whether any of it lands anywhere. Justin: "when adult adds they
              need to know, should it prompt scan this code on child's phone to
              get it added, and show QR code or manage yourself here". So the
              answer sits right where the adding happens, and it says which of
              the two worlds this family is in rather than making them guess.

              Only on this tab. On the other two it is answering a question
              nobody asked: agreeing a job the child already ticked is proof
              enough that the sending works.

              Once a family is set up it can also be put away for a week with
              the ✕, which is the other half of the same idea: this card earns
              its space while the answer is still in doubt and stops earning it
              the moment the answer is yes. The no app yet version has no ✕,
              because that one is an unfinished setup rather than information. */}
          {activeChild && !(hasApp && codeCardHidden) && (
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
              {hasApp && (
                <button
                  type="button"
                  onClick={hideCodeCard}
                  aria-label="Hide this for a week"
                  title="Hide this for a week"
                  style={{
                    flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
                    padding: '4px 6px', fontSize: 17, lineHeight: 1, color: 'var(--ink-muted)',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* The composer. It never moves and never closes.
              The confirmation is a viewport toast pinned near the bottom, not a
              slot above the input, so it reaches a parent wherever on this card
              they tapped. The old slot fired off the top of the screen when the
              tap came from a chip further down, which is what Justin saw: a job
              that appeared to send nothing, so you tap again. */}
          <section style={CARD}>
            <h2 style={H2}>Add a job</h2>
            <p style={SUB}>Tap one, or write your own. It stays open, so add as many as you want.</p>

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
                style={{ flex: 1, minWidth: 260, fontSize: 16 }}
              />
              <button
                onClick={() => { if (custom.trim()) { add({ title: custom.trim(), emoji: '⭐', stars: 2, schedule: 'daily' }); setCustom('') } }}
                disabled={busy || !custom.trim()}
                className="btn btn-gold"
                // Grows into whatever the row leaves it. On a phone the input
                // takes the full width and this drops beneath it, where a
                // small left aligned button reads as an orphan; letting it
                // grow makes it the full width action it should be there.
                style={{ flexGrow: 1, minWidth: 120, padding: '12px 20px', fontSize: 15.5, opacity: custom.trim() ? 1 : 0.5 }}
              >
                Add it
              </button>
            </div>

            {/* Chips under the input, both rows of them, which is the Superlist
                shape. These were a chip row and then six full width rows at
                56px each, so the suggestions alone ran most of a phone screen
                and the board was pushed off the bottom of it. As chips the same
                fourteen suggestions fit in the space the six rows took. */}
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
                      style={CHIP}
                    >
                      <span aria-hidden>{q.emoji}</span>{q.title}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-light)', margin: '0 0 8px' }}>
              Or tap an idea
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {(allIdeas ? ideas : ideas.slice(0, 8)).map((t: QuestTemplate) => (
                <button key={t.title} onClick={() => add(t)} disabled={busy} style={CHIP}>
                  <span aria-hidden>{t.emoji}</span>
                  {t.title}
                  {/* The value pill, from Tiimo. A chip that does not say what
                      it pays is asking a parent to add a job blind. */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                    ⭐{t.stars}
                  </span>
                </button>
              ))}
            </div>
            {ideas.length > 8 && (
              <button onClick={() => setAllIdeas(v => !v)} style={{ ...LINK_BTN, marginTop: 10 }}>
                {allIdeas ? 'Show fewer' : `Show all ${ideas.length} ideas`}
              </button>
            )}
          </section>

          {/* One line, so a parent adding their fourth job can see it landing
              without leaving the composer to check. The full list is a tab
              away, and the tab already carries the count. */}
          {mine.length > 0 && (
            <button
              onClick={() => setTab('theirs')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: 14,
                padding: '13px 15px', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--ink)' }}>{mine.length} job{mine.length === 1 ? '' : 's'}</strong> on {name}&apos;s board already
              </span>
              <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--terracotta)' }}>
                See them →
              </span>
            </button>
          )}
        </>
      )}

      {/* ── Waiting for you to agree ────────────────────────────────── */}
      {tab === 'agree' && (
        <>
          {agreeCount === 0 && (
            <section style={CARD}>
              <h2 style={H2}>Nothing waiting</h2>
              <p style={{ ...EMPTY }}>
                Everything {name} has ticked is agreed and the stars have landed. This fills up on its own when they tick something.
              </p>
            </section>
          )}

          {/* Jobs the child says are done. First, because somebody is waiting
              on it and the stars are not theirs until this happens. */}
          {waiting.length > 0 && (
            <section style={{ ...CARD, borderColor: 'var(--terracotta)' }}>
              <h2 style={H2}>{name} says {waiting.length === 1 ? 'this is' : 'these are'} done</h2>
              <p style={SUB}>The stars land the moment you agree.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {waiting.map(t => {
                  const q = questById.get(t.quest_id)
                  return (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', borderRadius: 14, padding: '10px 12px' }}>
                      <span aria-hidden style={{ fontSize: 19, lineHeight: 1, flexShrink: 0 }}>{q?.emoji ?? '⭐'}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.3 }}>
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

          {/* What the child asked for. Their own idea, which is the best kind,
              and it is waiting on the same yes, so it belongs on this tab. */}
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
        </>
      )}

      {/* ── Waiting for the child ───────────────────────────────────── */}
      {tab === 'theirs' && (
        <section style={CARD}>
          <h2 style={H2}>On {name}&apos;s board</h2>
          <p style={SUB}>
            {mine.length === 0
              ? 'Nothing yet.'
              : `${mine.length} job${mine.length === 1 ? '' : 's'} running, waiting on ${name === 'your child' ? 'them' : name}.`}
          </p>
          {mine.length === 0 ? (
            <button onClick={() => setTab('add')} className="btn btn-gold" style={{ padding: '12px 20px', fontSize: 15.5 }}>
              Add the first one
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {mine.map(q => (
                <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', borderRadius: 14, padding: '10px 12px' }}>
                  <span aria-hidden style={{ fontSize: 19, lineHeight: 1, flexShrink: 0 }}>{q.emoji}</span>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.3 }}>
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
      )}

      {/* The three other places a parent goes from here, all real pages.
          Justin asked for the timer and the balance as their own buttons and
          their own pages, because starting twenty minutes of TV and reading the
          week are different jobs done at different moments.

          Outside the tabs, because they are the way OUT of this page and the
          way out should not move about depending on which tab you are on. */}
      {/* Chunky, per the design system, and left aligned with the arrow pushed
          to the edge.
          btn-outline sets box-shadow: none, so three of them stacked read as
          three flat rectangles rather than as buttons: the one shape in this
          product that is meant to look pressable was the one with no depth.
          The label leads and the arrow sits right, so the eye lands on the
          words rather than on the middle of an empty box. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        {[
          { href: '/dashboard/quests/routines', label: 'Add a whole week routine' },
          { href: '/dashboard/quests/timer', label: 'Start the screen timer' },
          { href: '/dashboard/stats', label: 'Balance and stats' },
        ].map(b => (
          <Link
            key={b.href}
            href={b.href}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              background: '#fff', color: 'var(--ink)',
              border: '1.5px solid var(--terracotta)',
              borderRadius: 16,
              boxShadow: '0 4px 0 var(--terracotta)',
              padding: '15px 18px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
            }}
          >
            <span>{b.label}</span>
            <span aria-hidden style={{ color: 'var(--terracotta-dark)', fontSize: 18 }}>→</span>
          </Link>
        ))}
      </div>
      <SentToast message={justAdded} onDone={() => setJustAdded(null)} />
    </div>
  )
}
