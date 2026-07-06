'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QUEST_TEMPLATES } from '@/lib/quests/templates'

// The parent's quest manager. Pick from templates or write your own,
// set what each is worth, set the goal the stars buy, then hand the
// quests over: share the kid link for older children or print the sheet
// for little ones.

type Child = { id: string; name: string; age_band: string | null; phone?: string | null }

const AGE_BANDS = ['4-7', '8-10', '11-13', '13-15', '16+'] as const
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; child_id: string | null }
type Goal = { child_id: string; title: string; stars_needed: number }
type KidLink = { child_id: string; token: string }

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
  const [links, setLinks] = useState<KidLink[]>([])
  const [activeChild, setActiveChild] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [customTitle, setCustomTitle] = useState('')
  const [goalTitle, setGoalTitle] = useState('')
  const [goalStars, setGoalStars] = useState('20')
  const [copied, setCopied] = useState(false)
  const [addingChild, setAddingChild] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState<string | null>(null)
  const [phoneDraft, setPhoneDraft] = useState('')
  const [phoneSaved, setPhoneSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [ticked, setTicked] = useState<string | null>(null)
  const [contactsSupported, setContactsSupported] = useState(false)

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
      setLinks(data.links ?? [])
      if (!activeChild && data.children?.length) setActiveChild(data.children[0].id)
    } catch { /* retry on next action */ } finally { setLoading(false) }
  }, [activeChild])

  useEffect(() => { load() }, [load])

  const childQuests = useMemo(
    () => quests.filter(q => q.child_id === activeChild || q.child_id === null),
    [quests, activeChild]
  )
  const goal = goals.find(g => g.child_id === activeChild) ?? null
  const link = links.find(l => l.child_id === activeChild) ?? null
  const child = children.find(c => c.id === activeChild) ?? null

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

  async function saveGoal() {
    if (!goalTitle.trim() || !activeChild) return
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'goal', child_id: activeChild, title: goalTitle.trim(), stars_needed: Number(goalStars) || 20 }),
    })
    setGoalTitle('')
    await load()
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
          <div style={card}>
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

          {/* Templates */}
          {templatesUnused.length > 0 && (
            <div style={card}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
                Quest ideas, tap to add
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {templatesUnused.map(t => (
                  <button
                    key={t.title}
                    onClick={() => addQuest(t)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '9px 14px', borderRadius: '100px', cursor: 'pointer',
                      border: '1.5px solid var(--border)', background: '#fff',
                      fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--ink)',
                    }}
                  >
                    <span>{t.emoji}</span> {t.title} <span style={{ color: 'var(--terracotta-dark)', fontWeight: 800 }}>+</span>
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

          {/* Star goal */}
          <div style={card}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              What the stars buy
            </div>
            {goal ? (
              <p style={{ fontSize: '14px', color: 'var(--ink)', margin: '0 0 12px' }}>
                Current goal: <strong>{goal.title}</strong> at ⭐ {goal.stars_needed}. Set a new one below to replace it.
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
          </div>

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
          </div>
        </>
      )}
    </div>
  )
}
