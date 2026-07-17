'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QUEST_TEMPLATES, PLAY_PAYS_WHY, STAR_MINUTES } from '@/lib/quests/templates'
import { ROUTINE_PACKS, type RoutinePack } from '@/lib/quests/routines'
import ChildLinkShare from '@/components/quests/ChildLinkShare'
import StarSummary from '@/components/quests/StarSummary'
import ScreenBalanceInsight from '@/components/quests/ScreenBalanceInsight'
import { questDueToday } from '@/lib/quests/due'
import { STAGE_LABELS, AGE_BAND_TO_STAGE, type StageKey } from '@/lib/quests/game-picks'
import { gamesForStage } from '@/lib/quest-games/registry'
import { PRINTABLES } from '@/lib/printables/registry'
import { deviceLabel, deviceEmoji } from '@/lib/quests/device-time'

// When a child asks for a printable their pitch reads either "Print the
// {title} sheet" (full access, no printer at home) or "Please can I do the
// {title} printable" (locked, asking to unlock it). Match either form back to
// the sheet so the parent always gets a real print link right here, not just
// the words. Missing the second form was why a child's printable ask landed
// in notifications with no way to open it.
function printableForAsk(title: string) {
  return PRINTABLES.find(p =>
    title === `Print the ${p.title} sheet` ||
    title === `Please can I do the ${p.title} printable`
  ) ?? null
}

type QuestTab = 'manage' | 'rewards' | 'games' | 'share'
const TABS: { key: QuestTab; label: string; icon: string; hint: string }[] = [
  { key: 'manage', label: 'Quests', icon: '⭐', hint: 'Set the tasks' },
  { key: 'rewards', label: 'Rewards', icon: '🎁', hint: 'Prizes to save for' },
  { key: 'games', label: 'Games', icon: '🎲', hint: 'Play to learn' },
  { key: 'share', label: 'Share', icon: '📲', hint: 'Phone or QR code' },
]

// The parent's quest manager. Pick from templates or write your own,
// set what each is worth, set the goal the stars buy, then hand the
// quests over: share the kid link for older children or print the sheet
// for little ones.

type Child = { id: string; name: string; age_band: string | null; phone?: string | null; use_mode?: string | null }

const AGE_BANDS = ['4-7', '8-10', '11-13', '13-15', '16+'] as const
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; schedule_days?: number[] | null; child_id: string | null; blocks_screens?: boolean }
type Goal = { child_id: string; title: string; stars_needed: number; daily_stars: number | null; achieved_at: string | null }
type KidLink = { child_id: string; token: string }
type Tick = { quest_id: string; child_id: string | null; status: string; tick_date: string; approved_at: string | null }
type Ask = { id: string; child_id: string; title: string; emoji: string; status: string; created_at: string }
type Bank = { child_id: string; earned: number; spent: number; balance: number; minutes: number }
type Spend = { id: string; child_id: string; stars: number; minutes: number; note?: string | null; created_at: string }
type Session = { id: string; child_id: string; device: string; minutes: number; stars: number; ends_at: string; started_at: string }

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
  const [newChildMode, setNewChildMode] = useState<'own' | 'coview'>('own')
  const [phoneDraft, setPhoneDraft] = useState('')
  const [phoneSaved, setPhoneSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [ticked, setTicked] = useState<string | null>(null)
  const [firstTask, setFirstTask] = useState('')
  const [firstMsg, setFirstMsg] = useState<string | null>(null)
  const [handMode, setHandMode] = useState<'phone' | 'paper'>('phone')
  const [pingResult, setPingResult] = useState<string | null>(null)
  const [pingDraft, setPingDraft] = useState('')
  // Quests done today fold into a quiet strip, so the manage list stays what is
  // still live rather than a long wall of ticked off rows.
  const [showParentDone, setShowParentDone] = useState(false)
  const [contactsSupported, setContactsSupported] = useState(false)
  const [tab, setTab] = useState<QuestTab>('manage')
  const [asksList, setAsksList] = useState<Ask[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [spends, setSpends] = useState<Spend[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [usage, setUsage] = useState<Record<string, number>>({})
  const [askStars, setAskStars] = useState<Record<string, number>>({})
  const [askSchedule, setAskSchedule] = useState<Record<string, string>>({})
  const [spendMsg, setSpendMsg] = useState<string | null>(null)

  // Open straight to a tab when linked with ?tab=, so the setup step Send
  // your child their phone link lands on Share, not the default Quests tab.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab')
    if (t === 'share' || t === 'rewards' || t === 'games' || t === 'manage') setTab(t)
  }, [])

  useEffect(() => {
    setContactsSupported('contacts' in navigator)
  }, [])

  async function tickForThem(questId: string) {
    const quest = quests.find(q => q.id === questId)
    // Land the tick locally straight away so the button stays Done and the
    // card can light up, instead of flashing Done then bouncing back.
    const today = new Date().toISOString().slice(0, 10)
    setTicked(questId)
    setTicks(prev => {
      const already = prev.some(t => t.quest_id === questId && t.tick_date === today)
      if (already) {
        return prev.map(t => t.quest_id === questId && t.tick_date === today
          ? { ...t, status: 'approved', approved_at: new Date().toISOString() } : t)
      }
      return [...prev, {
        quest_id: questId, child_id: quest?.child_id ?? activeChild,
        status: 'approved', tick_date: today, approved_at: new Date().toISOString(),
      }]
    })
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId }),
      })
      await load()
    } catch { /* the optimistic tick stands, next load reconciles */ }
  }

  async function editQuest(questId: string, patch: { stars?: number; schedule?: string; schedule_days?: number[] | null; blocks_screens?: boolean }) {
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
      body: JSON.stringify({ action: 'child', name: newChildName.trim(), age_band: newChildAge, use_mode: newChildMode }),
    })
    const data = await res.json()
    if (data.child) {
      setAddingChild(false)
      setNewChildName('')
      setNewChildAge(null)
      setNewChildMode('own')
      setActiveChild(data.child.id)
      await load()
    }
  }

  // Change how the active child uses it, from the share tab.
  async function setUseMode(mode: 'own' | 'coview') {
    if (!activeChild) return
    await fetch('/api/quests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'usemode', child_id: activeChild, use_mode: mode }),
    })
    await load()
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
      setAsksList(data.requests ?? [])
      setBanks(data.banks ?? [])
      setSpends(data.spends ?? [])
      setSessions(data.sessions ?? [])
      setUsage(data.usage ?? {})
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
  // A four to seven year old has no personal phone, and we never advise one
  // at this age. Their quests are done on paper with a grown up, so the whole
  // hand over reframes to the printed sheet rather than a phone link.
  const youngChild = stageKey === 'foundation'

  // A four to seven year old never gets a phone handover, so the hand it
  // over switch defaults to paper for them and phone for everyone else.
  useEffect(() => {
    setHandMode(youngChild ? 'paper' : 'phone')
  }, [activeChild, youngChild])

  async function addQuest(t: { title: string; emoji: string; stars: number; schedule: string }) {
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...t, child_id: activeChild }),
    })
    // Ping their phone so a new quest shows up right away, not only next time
    // they open their page. Best effort, same as the before screens add.
    if (activeChild) {
      fetch('/api/quests/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: activeChild, message: `New quest: ${t.emoji} ${t.title}` }),
      }).catch(() => {})
    }
    await load()
  }

  // Add a whole routine at once: each of its quests that is not already set,
  // one summary ping to the child, one reload. Tapping twice never doubles up
  // because anything already on the list is skipped.
  const [addingRoutine, setAddingRoutine] = useState<string | null>(null)
  async function addRoutine(pack: RoutinePack) {
    if (!activeChild || addingRoutine) return
    setAddingRoutine(pack.key)
    const fresh = pack.tasks.filter(t => !childQuests.some(q => q.title === t.title))
    for (const t of fresh) {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, child_id: activeChild }),
      }).catch(() => {})
    }
    if (fresh.length > 0) {
      fetch('/api/quests/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: activeChild, message: `New routine: ${pack.emoji} ${pack.name}` }),
      }).catch(() => {})
    }
    await load()
    setAddingRoutine(null)
  }

  // The spotted it prompt: the bedroom is not tidy, homework is not done.
  // One tap makes it a one off quest flagged before screens, at the top of
  // the child's list, on the printed contract, with a best effort ping to
  // their device.
  async function addBeforeScreens(title: string) {
    const t = title.trim()
    if (!activeChild || !t) return
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: t, emoji: '📵', stars: 1, schedule: 'once', child_id: activeChild, blocks_screens: true }),
    })
    setFirstTask('')
    setFirstMsg('On their list, marked before screens ✓')
    setTimeout(() => setFirstMsg(null), 3500)
    fetch('/api/quests/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_id: activeChild, message: `Before screens today: ${t}` }),
    }).catch(() => {})
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


  // Answer a child's quest pitch: added makes it real with the stars and
  // rhythm chosen here, declined closes it kindly on their page.
  async function decideAsk(ask: Ask, decision: 'added' | 'declined') {
    setAsksList(prev => prev.map(a => a.id === ask.id ? { ...a, status: decision } : a))
    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_decide', request_id: ask.id, decision,
          stars: askStars[ask.id] ?? 2,
          schedule: askSchedule[ask.id] ?? 'once',
        }),
      })
      if (decision === 'added') await load()
    } catch { load() }
  }

  // Screen time was used: mark the minutes, the stars come off the bank.
  async function spendTime(minutes: number) {
    if (!activeChild) return
    try {
      const res = await fetch('/api/quests/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: activeChild, minutes }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanks(prev => prev.map(b => b.child_id === activeChild
          ? { ...b, spent: b.spent + data.spent_stars, balance: data.balance, minutes: data.balance_minutes }
          : b))
        setSpends(prev => [{
          id: `local-${Date.now()}`, child_id: activeChild,
          stars: data.spent_stars, minutes: data.spent_minutes,
          created_at: new Date().toISOString(),
        }, ...prev])
        setSpendMsg(`${data.spent_minutes} minutes marked as used ✓`)
      } else {
        setSpendMsg(data.error ?? 'Could not mark that just now')
      }
      setTimeout(() => setSpendMsg(null), 3500)
    } catch { load() }
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

  // The parent marks the saving goal done: the child saved enough and the
  // real reward is handed over, so the stars are spent and the goal closes.
  async function redeemGoal() {
    if (!activeChild) return
    await fetch('/api/quests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'goal_redeem', child_id: activeChild }),
    }).catch(() => {})
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
      <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '20px' }}>
        Real chores and jobs, agreed with you, that earn stars. No phone needed: print the sheet, or tick them off here yourself.
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
                onClick={() => { setNewChildAge(band); setNewChildMode(['4-7', '8-10'].includes(band) ? 'coview' : 'own') }}
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

          {/* How they use it: their own app, or together on your device. */}
          {newChildAge && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                How will {newChildName.trim() || 'they'} use it?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {([
                  ['coview', '👀 Together on your device', 'You open it on your phone and do it together, no device in their hands. What the evidence points to for under 11, and what we recommend.'],
                  ['own', '📱 Their own app', 'If they already have their own device you can set it up here. Your family, your call, we just point the way.'],
                ] as const).map(([m, label, hint]) => (
                  <button key={m} onClick={() => setNewChildMode(m)} aria-pressed={newChildMode === m} style={{
                    textAlign: 'left', padding: '10px 13px', borderRadius: '12px', cursor: 'pointer',
                    background: newChildMode === m ? 'var(--terracotta-lt)' : '#fff',
                    border: newChildMode === m ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                  }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>{label}</span>
                    <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '1px' }}>{hint}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
          {/* The star system at a glance: rate, stars and minutes, what is
              waiting, what is to do, the goal, the timer, one glance. */}
          {(() => {
            const today = new Date().toISOString().slice(0, 10)
            const tickedToday = new Set(ticks.filter(t => t.tick_date === today).map(t => t.quest_id))
            const dueToday = childQuests.filter(q => questDueToday(q.schedule, q.schedule_days))
            const g = goals.find(gg => gg.child_id === activeChild)
            const gBalance = banks.find(b => b.child_id === activeChild)?.balance ?? 0
            return (
              <StarSummary
                childName={child.name}
                balanceStars={gBalance}
                weekStars={starsThisWeek}
                pending={ticks.filter(t => t.child_id === activeChild && t.status === 'pending').length}
                todo={dueToday.filter(q => !tickedToday.has(q.id)).length}
                goal={g ? { title: g.title, stars_needed: g.stars_needed } : null}
                goalReached={!!g && !g.achieved_at && gBalance >= g.stars_needed}
                goalAchieved={!!g?.achieved_at}
                onGoalDone={redeemGoal}
                onSetGoal={() => { setTab('manage'); setTimeout(() => document.getElementById('star-goal')?.scrollIntoView({ behavior: 'smooth' }), 60) }}
                timerRunning={sessions.some(s => s.child_id === activeChild)}
                sessionEndsAt={sessions.find(s => s.child_id === activeChild)?.ends_at ?? null}
                onApprove={() => { if (ticks.some(t => t.child_id === activeChild && t.status === 'pending')) { window.location.href = '/dashboard#quest-board' } else { setTab('manage'); setTimeout(() => document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }), 60) } }}
                onTodo={() => { setTab('manage'); setTimeout(() => document.getElementById('my-todo')?.scrollIntoView({ behavior: 'smooth' }), 60) }}
                onScreenTime={() => document.getElementById('screen-time')?.scrollIntoView({ behavior: 'smooth' })}
                onShare={() => { setTab('share'); setTimeout(() => document.getElementById('quest-tabs')?.scrollIntoView({ behavior: 'smooth' }), 60) }}
              />
            )
          })()}

          {/* The screens gate, made visible to the parent: when a quest is
              flagged before screens, the child's timer stays locked until you
              approve it. This line says plainly whether it is locked and on
              what, or unlocked, so the parent knows the timer state at a glance
              the same way the child does. */}
          {(() => {
            const gate = childQuests.filter(q => q.blocks_screens && questDueToday(q.schedule, q.schedule_days))
            if (gate.length === 0) return null
            const blocking = gate.filter(q => !approvedTodayIds.has(q.id))
            const locked = blocking.length > 0
            return (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '18px',
                background: locked ? 'var(--danger-bg)' : 'var(--tint-sage)',
                border: `1.5px solid ${locked ? 'var(--danger)' : 'var(--deep-teal)'}`,
                borderRadius: '14px', padding: '12px 15px',
              }}>
                <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{locked ? '🔒' : '✅'}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>
                    {locked ? 'Screen time is locked' : 'Screen time is unlocked'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {locked
                      ? `Waiting on: ${blocking.map(q => q.title).join(', ')}. Approve ${blocking.length === 1 ? 'it' : 'them'} and ${child.name}'s timer can start.`
                      : `${child.name} finished the before screens ${gate.length === 1 ? 'task' : 'tasks'}, so the timer is ready to go.`}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* DiGi's calm, age aware read on the child's screen time balance,
              evidence led and never a hard limit. */}
          <ScreenBalanceInsight
            childName={child.name}
            ageBand={child.age_band}
            balanceStars={banks.find(b => b.child_id === activeChild)?.balance ?? 0}
            weekStars={starsThisWeek}
            timerRunning={sessions.some(s => s.child_id === activeChild)}
            usedTodayMinutes={usage[activeChild ?? ''] ?? 0}
            earnedTodayStars={completed.filter(t => t.tick_date === todayStr).reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)}
          />

          {/* Hand it over: the one decision, made simple. To their phone,
              or onto paper. Everything else lives in the tabs below. */}
          <div style={card}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '10px' }}>
              Hand it to {child.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '14px' }}>
              {([['phone', '📱', 'To their phone', 'A private page, sent by you'], ['paper', '🖨️', 'The offline pack', 'Print it, tick it off here']] as const).map(([mode, icon, title, sub]) => (
                <button
                  key={mode}
                  onClick={() => setHandMode(mode)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                    background: handMode === mode ? 'var(--terracotta-lt)' : '#fff',
                    border: `2px solid ${handMode === mode ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: '16px', padding: '14px 16px', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '26px', lineHeight: 1 }}>{icon}</span>
                  <span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>{title}</span>
                    <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--ink-soft)', marginTop: '2px' }}>{sub}</span>
                  </span>
                </button>
              ))}
            </div>

            {handMode === 'phone' ? (
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {link ? (
                      <>
                        <button onClick={shareLink} style={{
                          background: 'var(--terracotta)', border: 'none', borderRadius: '12px', padding: '11px 18px', cursor: 'pointer',
                          fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)',
                          boxShadow: '0 3px 0 var(--terracotta-dark)',
                        }}>
                          {copied ? 'Link copied ✓' : `📤 Send ${child.name} the link`}
                        </button>
                        <button onClick={() => sendPing('Quest check! Come and see your stars ⭐')} style={{
                          background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '11px 18px', cursor: 'pointer',
                          fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)',
                        }}>
                          🔔 Ping their phone
                        </button>
                      </>
                    ) : (
                      <button onClick={getLink} style={{
                        background: 'var(--terracotta)', border: 'none', borderRadius: '12px', padding: '11px 18px', cursor: 'pointer',
                        fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)',
                        boxShadow: '0 3px 0 var(--terracotta-dark)',
                      }}>
                        🔑 Create {child.name}&apos;s private link
                      </button>
                    )}
                  </div>
                  {pingResult && <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>{pingResult}</p>}
                  <div style={{ background: 'var(--tint-sage)', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                      One private page, and it is safe
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        'Nothing to install, no login, no messages',
                        'Only your family holds the link',
                        'Stars land only when you approve them here',
                      ].map(line => (
                        <li key={line} style={{ display: 'flex', gap: '8px', fontSize: '12.5px', color: 'var(--ink)', lineHeight: 1.4 }}>
                          <span aria-hidden style={{ color: 'var(--retro-green)', fontWeight: 900, flexShrink: 0 }}>✓</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* What they see: the real child page */}
                <div style={{ flex: '0 0 118px', textAlign: 'center' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', border: '4px solid var(--ink)', boxShadow: '0 10px 26px rgba(26,26,46,0.18)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/marketing/kid-page.png" alt="The child's quest page" style={{ width: '100%', display: 'block' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '6px' }}>
                    What they see
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '16px', color: 'var(--ink)', marginBottom: '3px' }}>
                  The offline pack
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
                  Four things to print, tap any one to open it ready for the printer.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                  {[
                    ['🖨️', 'Quest sheet', '/dashboard/quests/print'],
                    ['📜', 'Device contract', '/dashboard/quests/contract'],
                    ['🎲', 'Game pack', '/dashboard/quests/crafts'],
                    ['✂️', 'Printables', '/dashboard/printables'],
                  ].map(([icon, label, href]) => (
                    <a key={href} href={href} style={{
                      display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
                      background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: '14px', padding: '13px 15px',
                    }}>
                      <span style={{ fontSize: '22px', lineHeight: 1 }}>{icon}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>{label}</span>
                    </a>
                  ))}
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                  No phone needed. Print it for the fridge, tick quests off here yourself, and the stars still land in {child.name}&apos;s bank.
                </p>
              </div>
            )}
          </div>

          {/* The front door: four big labelled buttons with an icon and a line
              of what each is for, so a parent knows exactly where to go. */}
          <div id="quest-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '18px', scrollMarginTop: '80px' }}>
            {TABS.map(t => {
              const on = tab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '11px', textAlign: 'left', cursor: 'pointer',
                    background: on ? 'var(--terracotta-lt)' : '#fff',
                    border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: '16px', padding: '12px 14px',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>{t.icon}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>{t.label}</span>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginTop: '2px' }}>{t.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {tab === 'manage' && (
          <>
          {/* Device time in progress: a live countdown next to the child who
              is on their screen right now, tracking the same clock they see. */}
          {sessions.filter(s => s.child_id === activeChild).map(s => (
            <ParentTimePill key={s.id} session={s} childName={child.name} />
          ))}

          {/* Get it on their phone: the most important quest setup step after
              adding quests, surfaced prominently on the main tab until the
              child's link exists, then it steps back. */}
          {!link && (
            <button
              onClick={() => setTab('share')}
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
                background: 'var(--deep-teal)', borderRadius: '18px', padding: '16px 18px', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}
            >
              <span style={{ width: 42, height: 42, borderRadius: '12px', background: 'var(--terracotta)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>{youngChild ? '🖨️' : '📲'}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: '#fff' }}>
                  {youngChild ? `Print ${child.name}'s quest sheet` : `Put ${child.name}'s quests on their phone`}
                </span>
                <span style={{ display: 'block', fontSize: '12.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.45, marginTop: '2px' }}>
                  {youngChild
                    ? 'At this age quests work best on paper, done with you. No phone needed. Print the sheet for the fridge.'
                    : 'Send their own private quest page by message. It opens like a mini app, nothing to install.'}
                </span>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', flexShrink: 0 }}>→</span>
            </button>
          )}
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
          {/* The child's own quest pitches: set the stars and rhythm, one
              tap makes it a real quest, their page tells them the news */}
          {asksList.filter(a => a.child_id === activeChild && a.status === 'pending').length > 0 && (
            <div style={{ ...card, background: 'var(--tint-blue)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '4px' }}>
                {child.name} pitched these quests
              </div>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>
                Their own ideas, from their quest page. Set the stars, say yes, and it lands on their list.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {asksList.filter(a => a.child_id === activeChild && a.status === 'pending').map(a => {
                  const stars = askStars[a.id] ?? 2
                  const schedule = askSchedule[a.id] ?? 'once'
                  const sheet = printableForAsk(a.title)
                  return (
                    <div key={a.id} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{a.emoji}</span>
                        <span style={{ flex: 1, minWidth: 0, fontSize: '14px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>
                          {a.title}
                        </span>
                      </div>
                      {/* A printable ask gets a real print link, so the parent
                          can open the sheet the moment their child asks, then
                          set what the finished page is worth and add it. */}
                      {sheet && (
                        <a
                          href={`/api/printables/${sheet.key}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
                            background: 'var(--deep-teal)', color: '#fff', textDecoration: 'none',
                            borderRadius: '11px', padding: '9px 15px',
                            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                            boxShadow: '0 3px 0 rgba(0,0,0,0.25)',
                          }}
                        >
                          🖨️ Print {sheet.title}
                        </a>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button onClick={() => setAskStars(prev => ({ ...prev, [a.id]: Math.max(1, stars - 1) }))} style={{ width: 30, height: 30, borderRadius: '9px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontWeight: 800 }}>−</button>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, minWidth: '42px', textAlign: 'center' }}>⭐ {stars}</span>
                          <button onClick={() => setAskStars(prev => ({ ...prev, [a.id]: Math.min(10, stars + 1) }))} style={{ width: 30, height: 30, borderRadius: '9px', border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer', fontWeight: 800 }}>+</button>
                        </span>
                        <span style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(['once', 'daily', 'weekdays', 'weekend'] as const).map(s => (
                            <button
                              key={s}
                              onClick={() => setAskSchedule(prev => ({ ...prev, [a.id]: s }))}
                              style={{
                                padding: '6px 12px', borderRadius: '100px', cursor: 'pointer',
                                border: '1.5px solid var(--border)',
                                background: schedule === s ? 'var(--deep-teal)' : '#fff',
                                color: schedule === s ? '#fff' : 'var(--ink-soft)',
                                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                              }}
                            >
                              {SCHEDULE_LABELS[s]}
                            </button>
                          ))}
                        </span>
                        <span style={{ display: 'inline-flex', gap: '8px', marginLeft: 'auto' }}>
                          <button
                            onClick={() => decideAsk(a, 'added')}
                            style={{
                              background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
                              borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
                              fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800,
                              boxShadow: '0 3px 0 var(--terracotta-dark)',
                            }}
                          >
                            Add it
                          </button>
                          <button
                            onClick={() => decideAsk(a, 'declined')}
                            style={{
                              background: 'none', border: '1px solid var(--border)', borderRadius: '10px',
                              padding: '8px 12px', cursor: 'pointer',
                              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)',
                            }}
                          >
                            Not now
                          </button>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Do this first: the spotted it prompt and the printed contract */}
          <div style={card}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
              📵 Do this first
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
              Something to do before screens go on? Send it now. It jumps to the top of {child.name}&apos;s list and pings their phone.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {['🛏️ Tidy your bedroom', '📚 Homework finished', '🎒 Bag packed for tomorrow'].map(chip => (
                <button
                  key={chip}
                  onClick={() => addBeforeScreens(chip.slice(chip.indexOf(' ') + 1))}
                  style={{
                    background: '#fff', border: '1.5px solid var(--border)', borderRadius: '100px',
                    padding: '8px 14px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontSize: '12.5px', fontWeight: 700, color: 'var(--ink)',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                value={firstTask}
                onChange={e => setFirstTask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addBeforeScreens(firstTask) }}
                placeholder="Or type it: feed the dog, violin practice..."
                style={{
                  flex: 1, minWidth: '200px', border: '1.5px solid var(--border)', borderRadius: '12px',
                  padding: '10px 14px', fontSize: '13.5px', fontFamily: 'inherit', color: 'var(--ink)',
                }}
              />
              <button
                onClick={() => addBeforeScreens(firstTask)}
                disabled={!firstTask.trim()}
                style={{
                  background: 'var(--terracotta)', border: 'none', borderRadius: '12px',
                  padding: '10px 18px', cursor: firstTask.trim() ? 'pointer' : 'default',
                  opacity: firstTask.trim() ? 1 : 0.5,
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, color: 'var(--ink)',
                  boxShadow: '0 3px 0 var(--terracotta-dark)',
                }}
              >
                Send it
              </button>
            </div>
            {firstMsg && (
              <p style={{ fontSize: '12.5px', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '10px 0 0' }}>{firstMsg}</p>
            )}
            <a
              href="/dashboard/quests/contract"
              style={{
                display: 'inline-block', marginTop: '12px',
                fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700,
                color: 'var(--terracotta-dark)', textDecoration: 'none',
              }}
            >
              Print the device time contract →
            </a>
          </div>

          <div id="my-todo" style={{ ...card, scrollMarginTop: '80px', ...(allDoneToday ? { borderColor: 'var(--terracotta)', boxShadow: '0 6px 20px rgba(237,195,95,0.18)' } : {}) }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
              {child.name}&apos;s quests
            </div>
            {childQuests.length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
                No quests yet. Add from the ideas below.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Still to do first, done today sinks to the bottom and dims,
                  so the live list is always what is left. A stable sort keeps
                  the order within each group, and a freshly added quest, being
                  not done, lands at the top. */}
              {(() => {
                const isDone = (q: typeof childQuests[number]) => approvedTodayIds.has(q.id) || ticked === q.id
                const sorted = [...childQuests].sort((a, b) => Number(isDone(a)) - Number(isDone(b)))
                const openL = sorted.filter(x => !isDone(x))
                const doneL = sorted.filter(x => isDone(x))
                const row = (q: typeof childQuests[number]) => {
                const editing = editingId === q.id
                const sheet = printableForAsk(q.title)
                const doneToday = approvedTodayIds.has(q.id) || ticked === q.id
                return (
                  <div key={q.id} style={{
                    borderRadius: '14px', background: doneToday ? 'var(--cream)' : '#fff', border: '1.5px solid var(--border)',
                    padding: '12px 14px', opacity: doneToday ? 0.72 : 1, transition: 'opacity 0.3s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{q.emoji}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{q.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                          {SCHEDULE_LABELS[q.schedule] ?? q.schedule} · ⭐ {q.stars}{q.blocks_screens ? ' · 📵 before screens' : ''}
                        </span>
                      </span>
                      {/* A print quest carries a real print link, so the sheet
                          is one tap away whenever the parent is ready. */}
                      {sheet && (
                        <a
                          href={`/api/printables/${sheet.key}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Open ${sheet.title} to print`}
                          style={{
                            background: 'var(--deep-teal)', color: '#fff', textDecoration: 'none',
                            border: 'none', borderRadius: '10px',
                            padding: '7px 12px', flexShrink: 0,
                            fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800,
                          }}
                        >
                          🖨️ Print
                        </a>
                      )}
                      <button
                        onClick={() => !doneToday && tickForThem(q.id)}
                        disabled={doneToday}
                        title={doneToday ? 'Done and stars landed' : 'Check they did it, then tap to land the stars'}
                        style={{
                          background: doneToday ? 'var(--tint-sage)' : 'var(--terracotta-lt)',
                          border: '1.5px solid var(--terracotta)', borderRadius: '10px',
                          padding: '7px 12px', cursor: doneToday ? 'default' : 'pointer', flexShrink: 0,
                          fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 800, color: 'var(--ink)',
                        }}
                      >
                        {doneToday ? 'Done ✓' : 'Done?'}
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
                          {(['daily', 'weekdays', 'weekend', 'once'] as const).map(s => {
                            const activeDays = (q.schedule_days?.length ?? 0) > 0
                            return (
                              <button
                                key={s}
                                onClick={() => editQuest(q.id, { schedule: s, schedule_days: null })}
                                style={{
                                  padding: '6px 12px', borderRadius: '100px', cursor: 'pointer',
                                  border: '1.5px solid var(--border)',
                                  background: (!activeDays && q.schedule === s) ? 'var(--deep-teal)' : '#fff',
                                  color: (!activeDays && q.schedule === s) ? '#fff' : 'var(--ink-soft)',
                                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                                }}
                              >
                                {SCHEDULE_LABELS[s]}
                              </button>
                            )
                          })}
                        </span>
                        {/* Or pick exact days: how three times a week is really set. */}
                        <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {[[1, 'M'], [2, 'T'], [3, 'W'], [4, 'T'], [5, 'F'], [6, 'S'], [0, 'S']].map(([n, l]) => {
                            const on = (q.schedule_days ?? []).includes(n as number)
                            return (
                              <button
                                key={`${n}`}
                                onClick={() => {
                                  const cur = q.schedule_days ?? []
                                  const next = on ? cur.filter(d => d !== n) : [...cur, n as number]
                                  editQuest(q.id, { schedule_days: next.length ? next : null })
                                }}
                                title="Pick the exact days"
                                style={{
                                  width: 26, height: 26, borderRadius: '8px', cursor: 'pointer',
                                  border: on ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                                  background: on ? 'var(--terracotta)' : '#fff',
                                  color: on ? 'var(--ink)' : 'var(--ink-muted)',
                                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                                }}
                              >
                                {l}
                              </button>
                            )
                          })}
                        </span>
                        <button
                          onClick={() => editQuest(q.id, { blocks_screens: !q.blocks_screens })}
                          title="Screens wait until this one is done and approved"
                          style={{
                            padding: '6px 12px', borderRadius: '100px', cursor: 'pointer',
                            border: `1.5px solid ${q.blocks_screens ? 'var(--terracotta)' : 'var(--border)'}`,
                            background: q.blocks_screens ? 'var(--terracotta-lt)' : '#fff',
                            color: q.blocks_screens ? 'var(--terracotta-dark)' : 'var(--ink-soft)',
                            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                          }}
                        >
                          📵 Screens wait{q.blocks_screens ? ' ✓' : ''}
                        </button>
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
                }
                return (
                  <>
                    {openL.map(row)}
                    {doneL.length > 0 && (
                      <>
                        {/* Done today, folded away to keep the live list short */}
                        <button
                          onClick={() => setShowParentDone(s => !s)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                            width: '100%', cursor: 'pointer', textAlign: 'left',
                            background: 'var(--cream)', border: '1.5px solid var(--border)',
                            borderRadius: '12px', padding: '11px 14px',
                            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)',
                          }}
                        >
                          <span>✓ {doneL.length} done today</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                            {showParentDone ? 'Hide ▲' : 'Show ▼'}
                          </span>
                        </button>
                        {showParentDone && doneL.map(row)}
                      </>
                    )}
                  </>
                )
              })()}
            </div>
          </div>

          {/* Routines: a whole moment of the week added in one tap */}
          <div style={card}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
              Routines
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px' }}>
              Add a whole moment of the week in one tap: the school morning, the bedtime wind down, the weekend reset. Each drops in its jobs on the right days. You can edit or remove any of them after.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '10px' }}>
              {ROUTINE_PACKS.map(pack => {
                const already = pack.tasks.filter(t => childQuests.some(q => q.title === t.title)).length
                const allIn = already === pack.tasks.length
                return (
                  <div key={pack.key} style={{ border: '1.5px solid var(--border)', borderRadius: '15px', padding: '13px 14px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{pack.emoji}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>{pack.name}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0, flex: 1 }}>{pack.blurb}</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--ink-muted)' }}>
                      {pack.tasks.length} jobs{already > 0 && !allIn ? ` · ${already} already set` : ''}
                    </div>
                    <button
                      onClick={() => addRoutine(pack)}
                      disabled={allIn || addingRoutine === pack.key}
                      style={{
                        width: '100%', padding: '10px', borderRadius: '12px', border: 'none',
                        cursor: allIn || addingRoutine === pack.key ? 'default' : 'pointer',
                        background: allIn ? 'var(--tint-sage)' : 'var(--terracotta)',
                        color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
                        boxShadow: allIn ? 'none' : '0 3px 0 var(--terracotta-dark)',
                      }}
                    >
                      {allIn ? 'All set ✓' : addingRoutine === pack.key ? 'Adding…' : `Add this routine`}
                    </button>
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
            <GamesTab stageKey={stageKey} childName={child.name} childId={activeChild} onShare={sendPing} />
          )}

          {tab === 'rewards' && (
          <>
          {/* The screen time bank: earned, used, what is left. Marking time
              as used is one tap, so the deal stays honest both ways. */}
          {(() => {
            const bank = banks.find(b => b.child_id === activeChild)
            const balance = bank?.balance ?? 0
            const childSpends = spends.filter(s => s.child_id === activeChild).slice(0, 6)
            return (
              <div style={{ ...card, background: 'var(--deep-teal)', border: 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
                  {child.name}&apos;s screen time bank
                </div>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {[
                    { label: 'In the bank', value: `⭐ ${balance}`, sub: `${balance * STAR_MINUTES} min` },
                    { label: 'Earned ever', value: `⭐ ${bank?.earned ?? 0}`, sub: `${(bank?.earned ?? 0) * STAR_MINUTES} min` },
                    { label: 'Used', value: `⭐ ${bank?.spent ?? 0}`, sub: `${(bank?.spent ?? 0) * STAR_MINUTES} min` },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>{s.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: '#fff', lineHeight: 1.1 }}>{s.value}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                    Screen time used:
                  </span>
                  {[15, 30, 60].map(m => (
                    <button
                      key={m}
                      onClick={() => spendTime(m)}
                      disabled={balance <= 0}
                      style={{
                        background: balance > 0 ? 'var(--terracotta)' : 'rgba(255,255,255,0.15)',
                        color: balance > 0 ? 'var(--ink)' : 'rgba(255,255,255,0.5)',
                        border: 'none', borderRadius: '100px', padding: '8px 14px',
                        cursor: balance > 0 ? 'pointer' : 'default',
                        fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                        boxShadow: balance > 0 ? '0 3px 0 var(--terracotta-dark)' : 'none',
                      }}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
                {spendMsg && (
                  <p style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--terracotta)', margin: '10px 0 0' }}>
                    {spendMsg}
                  </p>
                )}
                {childSpends.length > 0 && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                    {childSpends.map(s => (
                      <p key={s.id} style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', margin: '0 0 4px', lineHeight: 1.5 }}>
                        {s.minutes > 0 ? `${s.minutes} min used` : (s.note ?? 'Reward')} · ⭐ {s.stars} · {new Date(s.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Star goal */}
          <div id="star-goal" style={card}>
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
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
              Older kids get their own private page, sent by message. Little ones get the printed sheet for the fridge.
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
                {['You can watch now, you earned it ⭐', 'Please finish your chores first', 'Quest check! A few ticks and the stars are yours ⭐', 'Time to come off the screen now please', 'Turn the TV off please', 'Time to start your homework', 'Dinner in 10 minutes, start wrapping up', 'Please come downstairs', 'Time for bed now please'].map(msg => (
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
              {/* Type any quick message of your own */}
              <form
                onSubmit={e => { e.preventDefault(); const m = pingDraft.trim(); if (m) { sendPing(m); setPingDraft('') } }}
                style={{ display: 'flex', gap: '8px', marginTop: '10px' }}
              >
                <input
                  value={pingDraft}
                  onChange={e => setPingDraft(e.target.value)}
                  maxLength={140}
                  placeholder="Or type your own quick message"
                  style={{
                    flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: '12px',
                    border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
                    fontSize: '13px', color: 'var(--ink)', background: '#fff',
                  }}
                />
                <button
                  type="submit"
                  disabled={!pingDraft.trim()}
                  style={{
                    flexShrink: 0, background: pingDraft.trim() ? 'var(--terracotta)' : 'var(--border)',
                    color: 'var(--ink)', border: 'none', borderRadius: '12px', padding: '10px 16px',
                    cursor: pingDraft.trim() ? 'pointer' : 'default',
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                    boxShadow: pingDraft.trim() ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  Send
                </button>
              </form>
              {pingResult && (
                <p style={{ fontSize: '12.5px', color: pingResult.startsWith('Ping sent') ? 'var(--terracotta-dark)' : 'var(--ink-soft)', fontWeight: 600, lineHeight: 1.55, margin: '10px 0 0' }}>
                  {pingResult}
                </p>
              )}
            </div>
          </div>

          {/* More ways to share: QR, copy, email, and co-view on this device,
              for no phone, no WhatsApp, or a very young child. */}
          {link && <ChildLinkShare token={link.token} childName={child.name} ageBand={child.age_band} useMode={child.use_mode} onSetMode={setUseMode} />}
          </>
          )}
        </>
      )}
    </div>
  )
}

// A live device time countdown on the parent board: the same clock the
// child sees, ticking off the shared end time, so a parent can glance and
// know how long is left on the screen right now.
function ParentTimePill({ session, childName }: { session: Session; childName: string }) {
  const [remaining, setRemaining] = useState<number>(() => Math.round((new Date(session.ends_at).getTime() - Date.now()) / 1000))
  useEffect(() => {
    const end = new Date(session.ends_at).getTime()
    const tick = () => setRemaining(Math.round((end - Date.now()) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [session.ends_at])
  if (remaining <= 0) return null
  const mm = Math.floor(remaining / 60)
  const ss = String(Math.max(0, remaining % 60)).padStart(2, '0')
  const low = remaining <= 60
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px',
      background: '#fff', border: `1.5px solid ${low ? '#C0533E' : 'var(--terracotta)'}`,
      borderRadius: '16px', padding: '14px 16px', boxShadow: '0 4px 14px rgba(201,154,40,0.12)',
    }}>
      <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{deviceEmoji(session.device)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>
          {childName} is on the {deviceLabel(session.device)}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)' }}>
          {session.stars} star{session.stars === 1 ? '' : 's'} spent · {session.minutes} min booked
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: low ? '#C0533E' : 'var(--ink)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
        {mm}:{ss}
      </div>
    </div>
  )
}

// The Games tab: the star games we built, age matched to this child's
// stage. These are the CHILD's games, not the parent's: every one already
// lives on the child's quest link. The parent's job here is to look one
// over (Preview) and nudge the child to play it (Send to child), never to
// play it themselves. A four to seven year old sees only their gentle
// games, never an eleven year old's.
const STAGEKEY_TO_NUM: Record<StageKey, number> = {
  foundation: 1, builder: 2, explorer: 3, shaper: 4, independent: 5,
}

function GamesTab({ stageKey, childName, childId, onShare }: {
  stageKey: StageKey
  childName: string
  childId: string | null
  onShare: (message: string) => void
}) {
  const games = gamesForStage(STAGEKEY_TO_NUM[stageKey] ?? 2)
  const label = STAGE_LABELS[stageKey]
  const [shared, setShared] = useState<string | null>(null)
  return (
    <div>
      <div style={{ ...card, background: 'var(--deep-teal)', border: 'none', color: '#fff' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '6px' }}>
          {childName}&apos;s games · {label.name} · {label.ages}
        </div>
        <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: 0 }}>
          These are {childName}&apos;s games, already on their quest link and matched to their stage. Every one teaches something real and pays stars into their bank. Preview any to see what they will play, or send one to nudge them to play it now.
        </p>
      </div>

      {games.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          More games for this stage are on the way. In the meantime the daily deck and quests keep the stars coming.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
          {games.map(g => (
            <div key={g.key} style={{
              display: 'flex', flexDirection: 'column', height: '100%',
              background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
              padding: '16px', boxShadow: '0 4px 18px rgba(26,26,46,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.7rem', flexShrink: 0 }}>{g.emoji}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2 }}>
                  {g.title}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                {g.stage} · ⭐ {g.stars} · On their link
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px', flex: 1 }}>
                {g.blurb}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { onShare(`Play ${g.title} on your quests, worth ${g.stars} stars ⭐`); setShared(g.key); setTimeout(() => setShared(s => s === g.key ? null : s), 2600) }}
                  disabled={!childId}
                  style={{
                    textDecoration: 'none', cursor: childId ? 'pointer' : 'default',
                    background: shared === g.key ? 'var(--tint-sage)' : 'var(--terracotta)', color: 'var(--ink)',
                    border: 'none', borderRadius: '12px', padding: '9px 16px',
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                    boxShadow: shared === g.key ? 'none' : '0 3px 0 var(--terracotta-dark)',
                    opacity: childId ? 1 : 0.6,
                  }}
                >
                  {shared === g.key ? 'Sent ✓' : `Send to ${childName}`}
                </button>
                <Link
                  href={`/dashboard/quests/play/${g.key}`}
                  style={{
                    textDecoration: 'none', alignSelf: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700,
                    color: 'var(--ink-soft)', padding: '6px 4px',
                  }}
                >
                  Preview
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
