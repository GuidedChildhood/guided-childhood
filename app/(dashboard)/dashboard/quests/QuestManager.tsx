'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QUEST_TEMPLATES, PLAY_PAYS_WHY } from '@/lib/quests/templates'
import { GAME_PICKS, STAGE_LABELS, AGE_BAND_TO_STAGE, type StageKey } from '@/lib/quests/game-picks'

type QuestTab = 'manage' | 'rewards' | 'games' | 'share'
const TABS: { key: QuestTab; label: string }[] = [
  { key: 'manage', label: 'Quests' },
  { key: 'rewards', label: 'Rewards' },
  { key: 'games', label: 'Games' },
  { key: 'share', label: 'Share' },
]

// The parent's quest manager. Pick from templates or write your own,
// set what each is worth, set the goal the stars buy, then hand the
// quests over: share the kid link for older children or print the sheet
// for little ones.

type Child = { id: string; name: string; age_band: string | null; phone?: string | null }

const AGE_BANDS = ['4-7', '8-10', '11-13', '13-15', '16+'] as const
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; child_id: string | null }
type Goal = { child_id: string; title: string; stars_needed: number; daily_stars: number | null }
type KidLink = { child_id: string; token: string }
type Tick = { quest_id: string; child_id: string | null; status: string; tick_date: string; approved_at: string | null }

const SCHEDULE_LABELS: Record<string, string> = {
  daily: 'Every day', weekdays: 'School days', weekend: 'Weekends', once: 'One off',
}

const card: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)',
  borderRadius: '16px', padding: '20px', marginBottom: '16px',
}

export default function QuestManager() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [links, setLinks] = useState<KidLink[]>([])
  const [activeChild, setActiveChild] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [customTitle, setCustomTitle] = useState('')
  const [goalTitle, setGoalTitle] = useState('')
  const [goalStars, setGoalStars] = useState('20')
  const [dailyStars, setDailyStars] = useState('')
  const [copied, setCopied] = useState(false)
  const [addingChild, setAddingChild] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState<string | null>(null)
  const [phoneDraft, setPhoneDraft] = useState('')
  const [phoneSaved, setPhoneSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [ticked, setTicked] = useState<string | null>(null)
  const [pingResult, setPingResult] = useState<string | null>(null)
  const [contactsSupported, setContactsSupported] = useState(false)
  const [tab, setTab] = useState<QuestTab>('manage')

  useEffect(() => {
    setContactsSupported('contacts' in navigator)
  }, [])

  async function tickForThem(questId: string) {
    setTicked(questId)
    setTimeout(() => setTicked(null), 2000)
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId }),
      })
    } catch { /* refetch on next load */ }
  }

  async function editQuest(questId: string, patch: { stars?: number; schedule?: string }) {
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, ...patch } as Quest : q))
    try {
      await fetch('/api/quests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId, ...patch }),
      })
    } catch { load() }
  }

  async function pickContact() {
    type ContactsNavigator = Navigator & {
      contacts?: { select: (props: string[], opts?: { multiple: boolean }) => Promise<{ tel?: string[] }[]> }
    }
    const nav = navigator as ContactsNavigator
    if (!nav.contacts) return
    try {
      const picked = await nav.contacts.select(['tel'], { multiple: false })
      const tel = picked?.[0]?.tel?.[0]
      if (tel) setPhoneDraft(tel)
    } catch { /* cancelled */ }
  }

  async function addChild() {
    if (!newChildName.trim() || !newChildAge) return
    const res = await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'child', name: newChildName.trim(), age_band: newChildAge }),
    })
    const data = await res.json()
    if (data.child) {
      setAddingChild(false)
      setNewChildName('')
      setNewChildAge(null)
      setActiveChild(data.child.id)
      await load()
    }
  }

  async function savePhone() {
    if (!activeChild) return
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'phone', child_id: activeChild, phone: phoneDraft }),
    })
    setPhoneSaved(true)
    setTimeout(() => setPhoneSaved(false), 2000)
    await load()
  }

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/quests')
      const data = await res.json()
      setChildren(data.children ?? [])
      setQuests(data.quests ?? [])
      setGoals(data.goals ?? [])
      setTicks(data.ticks ?? [])
      setLinks(data.links ?? [])
      if (!activeChild && data.children?.length) setActiveChild(data.children[0].id)
    } catch { /* retry on next action */ } finally { setLoading(false) }
  }, [activeChild])

  useEffect(() => { load() }, [load])

  // The day goal box always shows what is currently set for this child.
  useEffect(() => {
    const g = goals.find(g => g.child_id === activeChild)
    setDailyStars(g?.daily_stars ? String(g.daily_stars) : '')
  }, [activeChild, goals])

  const childQuests = useMemo(
    () => quests.filter(q => q.child_id === activeChild || q.child_id === null),
    [quests, activeChild]
  )
  const goal = goals.find(g => g.child_id === activeChild) ?? null
  const link = links.find(l => l.child_id === activeChild) ?? null
  const child = children.find(c => c.id === activeChild) ?? null

  // Everything approved this week: the tasks the parent agreed the stars
  // for, most recent first. quest_ticks only carries the quest id, so the
  // title and emoji are looked up from the live quest, with a plain
  // fallback for a quest that has since been removed.
  const questById = useMemo(() => new Map(quests.map(q => [q.id, q])), [quests])
  const completed = useMemo(() => ticks
    .filter(t => t.status === 'approved' && (t.child_id === activeChild || t.child_id === null))
    .sort((a, b) => (b.approved_at ?? b.tick_date).localeCompare(a.approved_at ?? a.tick_date)),
    [ticks, activeChild])
  const starsThisWeek = completed.reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)

  // All quests done today: every one of the child's active quests has an
  // approved tick dated today. This is what lights the whole card up.
  const todayStr = new Date().toISOString().slice(0, 10)
  const approvedTodayIds = new Set(
    ticks.filter(t => t.status === 'approved' && t.tick_date === todayStr).map(t => t.quest_id)
  )
  const allDoneToday = childQuests.length > 0 && childQuests.every(q => approvedTodayIds.has(q.id))

  const stageKey: StageKey = AGE_BAND_TO_STAGE[child?.age_band ?? '8-10'] ?? 'builder'

  async function addQuest(t: { title: string; emoji: string; stars: number; schedule: string }) {
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, child_id: activeChild }),
    })
    await load()
  }

  async function removeQuest(id: string) {
    await fetch('/api/quests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quest_id: id }),
    })
    setQuests(prev => prev.filter(q => q.id !== id))
  }

  // From the Games tab: line a game up as the next reward and drop the
  // parent on the Rewards tab to set the star price and save it.
  function useGameAsReward(title: string) {
    setGoalTitle(title)
    setTab('rewards')
  }

  async function saveGoal() {
    const title = goalTitle.trim() || goal?.title
    if (!title || !activeChild) return
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'goal', child_id: activeChild, title,
        stars_needed: Number(goalStars) || goal?.stars_needed || 20,
        daily_stars: dailyStars ? Number(dailyStars) : goal?.daily_stars ?? null,
      }),
    })
    setGoalTitle('')
    await load()
  }

  async function sendPing(message: string) {
    if (!activeChild) return
    setPingResult('Sending...')
    try {
      const res = await fetch('/api/quests/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: activeChild, message }),
      })
      const data = await res.json()
      setPingResult(data?.sent > 0
        ? 'Ping sent ✓ It just landed on their phone.'
        : 'Their phone is not set up for pings yet. Open their quest link on their phone and tap Remind me about my quests. On iPhone, add it to the home screen first.')
    } catch {
      setPingResult('Could not send just now, try again in a moment.')
    }
  }

  async function getLink() {
    if (!activeChild) return
    const res = await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'link', child_id: activeChild }),
    })
    const data = await res.json()
    if (data.token) {
      setLinks(prev => [...prev.filter(l => l.child_id !== activeChild), { child_id: activeChild, token: data.token }])
    }
  }

  async function shareLink() {
    if (!link) return
    const url = `${window.location.origin}/k/${link.token}`
    const text = `Your quests are ready! Tick them off and earn your stars: ${url}`
    try {
      if (navigator.share) await navigator.share({ title: 'Your quests', text, url })
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* cancelled */ }
  }

  if (loading) return <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>One moment...</p>

  const templatesUnused = QUEST_TEMPLATES.filter(t => !childQuests.some(q => q.title === t.title))

  return (
    <div>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '10px' }}>Family Quests</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '10px' }}>
        The deal: quests earn stars
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
        Set the quests, agree what stars buy, and hand them over: their own link for older kids, a printed sheet for little ones. They tick, you approve, stars land.
      </p>

      {/* Child picker plus add another, right here, never back to onboarding */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {children.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveChild(c.id)}
            style={{
              padding: '9px 18px', borderRadius: '100px', cursor: 'pointer',
              border: '1.5px solid var(--border)',
              background: activeChild === c.id ? 'var(--deep-teal)' : '#fff',
              color: activeChild === c.id ? '#fff' : 'var(--ink-soft)',
              fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
            }}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setAddingChild(v => !v)}
          style={{
            padding: '9px 18px', borderRadius: '100px', cursor: 'pointer',
            border: '1.5px dashed var(--terracotta-dark)', background: 'var(--terracotta-lt)',
            color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
          }}
        >
          {children.length === 0 ? 'Add your child' : 'Add another child'} +
        </button>
      </div>

      {(addingChild || children.length === 0) && (
        <div style={card}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '10px' }}>
            {children.length === 0 ? 'First, who is this for?' : 'Add a child'}
          </div>
          <input
            value={newChildName}
            onChange={e => setNewChildName(e.target.value)}
            placeholder="Their first name"
            style={{
              width: '100%', padding: '12px 15px', borderRadius: '12px', marginBottom: '12px',
              border: '1.5px solid var(--border)', background: 'var(--cream)',
              fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', outline: 'none',
            }}
            maxLength={60}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {AGE_BANDS.map(band => (
              <button
                key={band}
                onClick={() => setNewChildAge(band)}
                style={{
                  padding: '9px 16px', borderRadius: '100px', cursor: 'pointer',
                  border: '1.5px solid var(--border)',
                  background: newChildAge === band ? 'var(--deep-teal)' : '#fff',
                  color: newChildAge === band ? '#fff' : 'var(--ink-soft)',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                }}
              >
                {band === '16+' ? 'Ages 16 and up' : `Ages ${band.replace('-', ' to ')}`}
              </button>
            ))}
          </div>
          <button
            onClick={addChild}
            disabled={!newChildName.trim() || !newChildAge}
            style={{
              background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '14px',
              padding: '12px 22px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
              boxShadow: '0 4px 0 var(--terracotta-dark)',
              opacity: (!newChildName.trim() || !newChildAge) ? 0.6 : 1,
            }}
          >
            Add and start their quests
          </button>
        </div>
      )}

      {/* Active quests */}
      {child && (
        <>
          {/* The tabs: everything in its own place instead of one long scroll */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '4px', marginBottom: '18px', width: 'fit-content', maxWidth: '100%', overflowX: 'auto' }}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding: '9px 18px', borderRadius: '100px', cursor: 'pointer', border: 'none', flexShrink: 0,
                  background: tab === t.key ? 'var(--deep-teal)' : 'transparent',
                  color: tab === t.key ? '#fff' : 'var(--ink-soft)',
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'manage' && (
          <>
          {/* All quests done today: the whole thing lights up */}
          {allDoneToday && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--stage-1-bold)', border: '1.5px solid var(--terracotta)',
              borderRadius: '16px', padding: '16px 18px', marginBottom: '16px',
              boxShadow: '0 6px 20px rgba(237,195,95,0.35)',
            }}>
              <span style={{ fontSize: '26px', flexShrink: 0 }}>🌟</span>
              <span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15.5px', color: 'var(--stage-1-text)' }}>
                  Every quest done today
                </span>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--stage-1-text)', opacity: 0.85, marginTop: '2px' }}>
                  {child.name} cleared the lot. The stars are theirs.
                </span>
              </span>
            </div>
          )}
          <div style={{ ...card, ...(allDoneToday ? { borderColor: 'var(--terracotta)', boxShadow: '0 6px 20px rgba(237,195,95,0.18)' } : {}) }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
              {child.name}&apos;s quests
            </div>
            {childQuests.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
                No quests yet. Add from the ideas below.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {childQuests.map(q => {
                const editing = editingId === q.id
                return (
                  <div key={q.id} style={{
                    borderRadius: '14px', background: '#fff', border: '1.5px solid var(--border)',
                    padding: '12px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{q.emoji}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{q.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                          {SCHEDULE_LABELS[q.schedule] ?? q.schedule} · ⭐ {q.stars}
                        </span>
                      </span>
                      <button
                        onClick={() => tickForThem(q.id)}
                        title="They did it, tick it off and land the stars"
                        style={{
                          background: ticked === q.id ? 'var(--tint-sage)' : 'var(--terracotta-lt)',
                          border: '1.5px solid var(--terracotta)', borderRadius: '10px',
                          padding: '7px 12px', cursor: 'pointer', flexShrink: 0,
                          fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: 'var(--ink)',
                        }}
                      >
                        {ticked === q.id ? 'Done ✓' : 'Done today'}
                      </button>
                      <button
                        onClick={() => setEditingId(editing ? null : q.id)}
                        style={{
                          background: 'none', border: '1px solid var(--border)', borderRadius: '10px',
                          padding: '7px 10px', cursor: 'pointer', flexShrink: 0,
                          fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)',
                        }}
                      >
                        {editing ? 'Close' : 'Edit'}
                      </button>
                    </div>

                    {editing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button onClick={() => editQuest(q.id, { stars: q.stars - 1 })} disabled={q.stars <= 1} style={{ width: 30, height: 30, borderRadius: '9px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontWeight: 800 }}>−</button>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, minWidth: '42px', textAlign: 'center' }}>⭐ {q.stars}</span>
                          <button onClick={() => editQuest(q.id, { stars: q.stars + 1 })} disabled={q.stars >= 10} style={{ width: 30, height: 30, borderRadius: '9px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontWeight: 800 }}>+</button>
                        </span>
                        <span style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(['daily', 'weekdays', 'weekend', 'once'] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => editQuest(q.id, { schedule: s })}
                              style={{
                                padding: '6px 12px', borderRadius: '100px', cursor: 'pointer',
                                border: '1.5px solid var(--border)',
                                background: q.schedule === s ? 'var(--deep-teal)' : '#fff',
                                color: q.schedule === s ? '#fff' : 'var(--ink-soft)',
                                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                              }}
                            >
                              {SCHEDULE_LABELS[s]}
                            </button>
                          ))}
                        </span>
                        <button onClick={() => removeQuest(q.id)} style={{
                          marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--danger)', fontWeight: 700,
                        }}>
                          Remove quest
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Templates: play and outside lead, and pay the most */}
          {templatesUnused.length > 0 && (
            <div style={card}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
                Play pays best
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>
                {PLAY_PAYS_WHY}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                {templatesUnused.filter(t => t.play).map(t => (
                  <button
                    key={t.title}
                    onClick={() => addQuest(t)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '11px', height: '100%',
                      padding: '12px 13px', borderRadius: '15px', cursor: 'pointer', textAlign: 'left',
                      border: '1.5px solid var(--terracotta)', background: 'var(--terracotta-lt)',
                      boxShadow: '0 4px 14px rgba(201,154,40,0.14)',
                    }}
                  >
                    <span style={{
                      width: 38, height: 38, borderRadius: '11px', flexShrink: 0,
                      background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>{t.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.25 }}>
                        {t.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                        ⭐ {t.stars}
                      </span>
                    </span>
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--terracotta)', color: 'var(--ink)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', lineHeight: 1,
                      boxShadow: '0 2px 0 var(--terracotta-dark)',
                    }}>+</span>
                  </button>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                Everyday quest ideas, tap to add
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
                {templatesUnused.filter(t => !t.play).map(t => (
                  <button
                    key={t.title}
                    onClick={() => addQuest(t)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '11px', height: '100%',
                      padding: '11px 13px', borderRadius: '15px', cursor: 'pointer', textAlign: 'left',
                      border: '1.5px solid var(--border)', background: '#fff',
                      boxShadow: '0 3px 12px rgba(26,26,46,0.05)',
                    }}
                  >
                    <span style={{
                      width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
                      background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    }}>{t.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.3 }}>
                      {t.title}
                    </span>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--cream)', color: 'var(--terracotta-dark)', border: '1.5px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', lineHeight: 1,
                    }}>+</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <input
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && customTitle.trim()) { addQuest({ title: customTitle.trim(), emoji: '⭐', stars: 1, schedule: 'daily' }); setCustomTitle('') } }}
                  placeholder="Or write your own quest"
                  style={{
                    flex: 1, padding: '11px 14px', borderRadius: '12px',
                    border: '1.5px solid var(--border)', background: 'var(--cream)',
                    fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', outline: 'none',
                  }}
                  maxLength={120}
                />
                <button
                  onClick={() => { if (customTitle.trim()) { addQuest({ title: customTitle.trim(), emoji: '⭐', stars: 1, schedule: 'daily' }); setCustomTitle('') } }}
                  style={{
                    background: 'var(--deep-teal)', color: '#fff', border: 'none', borderRadius: '12px',
                    padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Completed: everything approved this week, the tasks the parent
              agreed the stars for after the child ticked them off */}
          {completed.length > 0 && (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--stage-1-text)' }}>
                  Done and starred this week
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                  ⭐ {starsThisWeek}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {completed.slice(0, 12).map((t, i) => {
                  const q = questById.get(t.quest_id)
                  const when = new Date(`${t.tick_date}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
                  return (
                    <div key={`${t.quest_id}-${t.tick_date}-${i}`} style={{
                      display: 'flex', alignItems: 'center', gap: '11px',
                      padding: '10px 13px', borderRadius: '13px',
                      background: 'var(--tint-green)', border: '1px solid var(--border)',
                    }}>
                      <span style={{
                        width: 30, height: 30, borderRadius: '9px', flexShrink: 0, background: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
                      }}>{q?.emoji ?? '⭐'}</span>
                      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                        {q?.title ?? 'Completed quest'}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--ink-muted)', flexShrink: 0 }}>
                        {when}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)', flexShrink: 0 }}>
                        ⭐ {q?.stars ?? 1}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          </>
          )}

          {tab === 'games' && (
            <GamesTab stageKey={stageKey} childName={child.name} onUse={useGameAsReward} />
          )}

          {tab === 'rewards' && (
          <>
          {/* Star goal */}
          <div style={card}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              What the stars buy
            </div>
            {goal ? (
              <p style={{ fontSize: '14px', color: 'var(--ink)', margin: '0 0 12px' }}>
                Current goal: <strong>{goal.title}</strong> at ⭐ {goal.stars_needed}
                {goal.daily_stars ? <> with a day goal of ⭐ {goal.daily_stars}</> : null}. Set a new one below to replace it.
              </p>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>
                Agree it together: the Saturday film, an hour of Minecraft, the swimming trip. The agreement makes it official.
              </p>
            )}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                value={goalTitle}
                onChange={e => setGoalTitle(e.target.value)}
                placeholder="Saturday film night"
                style={{
                  flex: 2, minWidth: '160px', padding: '11px 14px', borderRadius: '12px',
                  border: '1.5px solid var(--border)', background: 'var(--cream)',
                  fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', outline: 'none',
                }}
                maxLength={120}
              />
              <input
                value={goalStars}
                onChange={e => setGoalStars(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                style={{
                  width: '76px', padding: '11px 14px', borderRadius: '12px',
                  border: '1.5px solid var(--border)', background: 'var(--cream)',
                  fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--ink)', outline: 'none', textAlign: 'center',
                }}
              />
              <button
                onClick={saveGoal}
                style={{
                  background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '12px',
                  padding: '11px 18px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                  boxShadow: '0 3px 0 var(--terracotta-dark)',
                }}
              >
                Set goal
              </button>
            </div>
            {/* Day goal: enough stars in one day completes the day */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Day goal, stars that finish the day:
              </span>
              <input
                value={dailyStars}
                onChange={e => setDailyStars(e.target.value.replace(/\D/g, ''))}
                onBlur={() => { if (goal && dailyStars && Number(dailyStars) !== (goal.daily_stars ?? 0)) saveGoal() }}
                inputMode="numeric"
                placeholder="5"
                style={{
                  width: '64px', padding: '9px 12px', borderRadius: '12px',
                  border: '1.5px solid var(--border)', background: 'var(--cream)',
                  fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--ink)', outline: 'none', textAlign: 'center',
                }}
              />
              <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>
                Hit it and their page says the day is complete
              </span>
            </div>
          </div>

          </>
          )}

          {tab === 'share' && (
          <>
          {/* Hand it over */}
          <div style={{ ...card, background: 'var(--tint-blue)', border: '1.5px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px' }}>
              Hand the quests over
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>
              Older kids get their own private quest page: send the link by message, it opens like a mini app, nothing to install. Little ones get the printed sheet for the fridge.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {link ? (
                <button
                  onClick={shareLink}
                  style={{
                    background: 'var(--deep-teal)', color: '#fff', border: 'none', borderRadius: '14px',
                    padding: '12px 20px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
                  }}
                >
                  {copied ? 'Link copied ✓' : `Send ${child.name} their link`}
                </button>
              ) : (
                <button
                  onClick={getLink}
                  style={{
                    background: 'var(--deep-teal)', color: '#fff', border: 'none', borderRadius: '14px',
                    padding: '12px 20px', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
                  }}
                >
                  Create {child.name}&apos;s quest link
                </button>
              )}
              {link && (
                <a
                  href={`https://wa.me/${(child.phone || '').replace(/[^0-9]/g, '').replace(/^0/, '44')}?text=${encodeURIComponent(`${child.name}, your quests are ready. Tick them off and earn your stars: ${typeof window !== 'undefined' ? window.location.origin : ''}/k/${link.token}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    background: '#25D366', color: '#fff', borderRadius: '14px',
                    padding: '12px 20px', textDecoration: 'none',
                    fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-2.53 4.4c-.15-.34-.3-.35-.44-.35l-.38-.01c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.66s.72 1.93.82 2.06c.1.13 1.4 2.13 3.38 2.99.47.2.84.33 1.13.42.47.15.9.13 1.24.08.38-.06 1.17-.48 1.33-.94.16-.46.16-.86.12-.94-.05-.08-.18-.13-.38-.23s-1.17-.58-1.35-.64c-.18-.07-.31-.1-.44.1-.13.2-.5.64-.62.77-.11.13-.23.15-.42.05a5.5 5.5 0 0 1-1.62-1c-.6-.53-1-1.19-1.12-1.39-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.06-.13.03-.25-.02-.35s-.44-1.09-.61-1.49z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
              <Link
                href="/dashboard/quests/print"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#fff', color: 'var(--ink)', borderRadius: '14px',
                  padding: '12px 20px', textDecoration: 'none', border: '1.5px solid var(--border)',
                  fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
                }}
              >
                Print the sheet
              </Link>
              <Link
                href="/dashboard/quests/crafts"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'var(--butter, #EDC35F)', color: 'var(--ink)', borderRadius: '14px',
                  padding: '12px 20px', textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800,
                  boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
                }}
              >
                🎲 The Game Pack
              </Link>
            </div>

            {/* Their phone number: quests, agreements and sheets go straight
                to their Messages thread, sent from YOUR phone, nothing sent
                by us directly */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                {child.name}&apos;s phone (optional)
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  value={phoneDraft || child.phone || ''}
                  onChange={e => setPhoneDraft(e.target.value)}
                  placeholder="07... their number"
                  inputMode="tel"
                  style={{
                    flex: 1, minWidth: '150px', padding: '10px 14px', borderRadius: '12px',
                    border: '1.5px solid var(--border)', background: '#fff',
                    fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--ink)', outline: 'none',
                  }}
                  maxLength={20}
                />
                {contactsSupported && (
                  <button
                    onClick={pickContact}
                    style={{
                      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px',
                      padding: '10px 14px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)',
                    }}
                  >
                    From contacts
                  </button>
                )}
                <button
                  onClick={savePhone}
                  style={{
                    background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px',
                    padding: '10px 16px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)',
                  }}
                >
                  {phoneSaved ? 'Saved ✓' : 'Save'}
                </button>
                {link && (child.phone || phoneDraft) && (
                  <a
                    href={`sms:${(phoneDraft || child.phone || '').replace(/\s/g, '')}?&body=${encodeURIComponent(`Your quests are ready! Tick them off and earn your stars: ${typeof window !== 'undefined' ? window.location.origin : ''}/k/${link.token}`)}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '12px',
                      padding: '10px 16px', textDecoration: 'none',
                      fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                      boxShadow: '0 3px 0 var(--terracotta-dark)',
                    }}
                  >
                    Text it to their phone
                  </a>
                )}
              </div>
            </div>

            {/* Ping their phone right now, through the quest page reminders */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                Ping {child.name}&apos;s phone now
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 10px' }}>
                One tap and it buzzes on their phone. Works once they have opened their quest link and turned on reminders.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Quest check! A few ticks and the stars are yours ⭐', 'Time to come off the screen now please', 'Dinner in 10 minutes, start wrapping up'].map(msg => (
                  <button
                    key={msg}
                    onClick={() => sendPing(msg)}
                    style={{
                      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px',
                      padding: '9px 14px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                      fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)', textAlign: 'left',
                    }}
                  >
                    {msg.length > 34 ? msg.slice(0, 31) + '...' : msg}
                  </button>
                ))}
              </div>
              {pingResult && (
                <p style={{ fontSize: '12.5px', color: pingResult.startsWith('Ping sent') ? 'var(--terracotta-dark)' : 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.55, margin: '10px 0 0' }}>
                  {pingResult}
                </p>
              )}
            </div>
          </div>
          </>
          )}
        </>
      )}
    </div>
  )
}

// The Games tab: the curated premium picks for this child's stage. Each is
// a real, quality game or creative app, weighted to educational, artistic
// and screen positive, with brilliant offline games in the mix. Use it as
// the reward lines a game up as the next thing the stars buy.
const KIND_STYLE: Record<string, { label: string; bg: string; fg: string }> = {
  digital:  { label: 'Screen', bg: 'var(--stage-2)', fg: 'var(--stage-2-text)' },
  tabletop: { label: 'Offline', bg: 'var(--tint-green)', fg: '#2D5016' },
  creative: { label: 'Create', bg: 'var(--stage-4)', fg: 'var(--stage-4-text)' },
  outdoor:  { label: 'Outside', bg: 'var(--stage-1)', fg: 'var(--stage-1-text)' },
}

function GamesTab({ stageKey, childName, onUse }: { stageKey: StageKey; childName: string; onUse: (title: string) => void }) {
  const picks = GAME_PICKS[stageKey] ?? []
  const label = STAGE_LABELS[stageKey]
  return (
    <div>
      <div style={{ ...card, background: 'var(--deep-teal)', border: 'none', color: '#fff' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
          Best games for {label.name} · {label.ages}
        </div>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: 0 }}>
          The good stuff, picked for {childName}. Real games and creative apps worth their time, with brilliant offline ones too. Line any of them up as the reward the stars buy.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
        {picks.map(g => {
          const k = KIND_STYLE[g.kind] ?? KIND_STYLE.digital
          return (
            <div key={g.title} style={{
              display: 'flex', flexDirection: 'column', height: '100%',
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
              padding: '16px', boxShadow: '0 4px 18px rgba(26,26,46,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: k.bg, color: k.fg, padding: '3px 9px', borderRadius: '100px',
                }}>{k.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {g.category}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '4px' }}>
                {g.title}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                {g.platform}
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px', flex: 1 }}>
                {g.why}
              </p>
              <button
                onClick={() => onUse(g.title)}
                style={{
                  alignSelf: 'flex-start', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
                  borderRadius: '100px', padding: '7px 14px', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)',
                }}
              >
                Use as the reward →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
