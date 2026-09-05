'use client'

import { useCallback, useEffect, useState } from 'react'
import { currentChildId } from '@/lib/children/current'
import Link from 'next/link'
import { questDueToday } from '@/lib/quests/due'
import { STAR_MINUTES } from '@/lib/quests/templates'
import Button from '@/components/ui/Button'
import TimeEarnedPrompt from '@/components/quests/TimeEarnedPrompt'
import DevicePickerChips, { type DevicePick } from '@/components/devices/DevicePickerChips'
import { DEVICES, ACTIVITIES, asksActivity, type ActivityKey } from '@/lib/quests/device-time'
import type { FamilyDevice } from '@/lib/devices/family'

// The family quest board on Home: every child's day at a glance, big
// enough to matter. The approve queue leads (kid ticked, one tap lands
// the stars), then each child shows their quest dots and minutes earned,
// and expands to today's list so a parent can tick any quest right here
// without leaving Home.
//
// The saving goal is NOT here. StarSummary owns it, bar and redeem button
// together, one screen up the same page.

type Child = { id: string; name: string }
type Quest = { id: string; title: string; emoji: string; stars: number; schedule: string; schedule_days?: number[] | null; child_id: string | null }
type Tick = { id: string; quest_id: string; child_id: string | null; tick_date: string; status: string }
type Goal = { child_id: string; title: string; stars_needed: number; daily_stars: number | null }
type Ask = { id: string; child_id: string; title: string; emoji: string; status: string; swap_quest_id?: string | null }
type Bank = { child_id: string; earned: number; spent: number; balance: number; minutes: number }
// Minutes banked above the weekly cap, spendable only while school is out.
type HolidayBank = { childId: string; remaining: number; spendableNow: boolean; holidayTitle: string | null }

// THE WAITING FOR YOU ROW, and why it needs its own rules.
//
// Justin, with a screenshot of "Please can I do the My Kindness Bucket List
// printable" reading one word per line down a column about eighty pixels wide,
// while the card itself ran off the side of the phone.
//
// Both symptoms are the same cause. The row was a flex line holding an emoji,
// the sentence, an Add button and a dismiss, with both buttons at flexShrink 0.
// The buttons plus gaps plus padding come to roughly two hundred and sixty
// unshrinkable pixels, so on a 390px phone the sentence was handed about ninety,
// which is narrower than the word "Kindness" in this weight. Every word wrapped.
// And because a flex line cannot go below its own min content width, the card
// then pushed wider than the screen and took the whole page with it.
//
// A shorter title would have hidden this rather than fixed it. These titles are
// GENERATED from what a child asked for, so their length is not ours to control
// and truncating one would hide the thing the parent is being asked to approve.
// The layout has to survive a long one instead.
//
// So the row wraps. The sentence asks for 190px and takes a whole line of its
// own when it cannot have that, the two buttons travel together and drop
// beneath it right aligned, and anywhere lets a single freakish word break
// rather than shove the card off the phone.
const ASK_ROW: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
  background: 'var(--tint-blue)', border: '2px solid var(--ink)',
  borderRadius: '14px', padding: '11px 14px',
}

const ASK_TEXT: React.CSSProperties = {
  flex: '1 1 190px', minWidth: 0, overflowWrap: 'anywhere',
  fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4,
}

// marginLeft auto so that on the wrapped layout the pair sits against the right
// edge under the sentence, which is where a thumb already is, rather than
// floating under the emoji.
const ASK_ACTIONS: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto',
}

const ASK_DISMISS: React.CSSProperties = {
  background: 'none', border: '1px solid var(--border)', borderRadius: '10px',
  padding: '8px 10px', cursor: 'pointer', fontSize: 'var(--text-base)',
  color: 'var(--ink-muted)', flexShrink: 0,
}

export default function QuestBoard() {
  const [children, setChildren] = useState<Child[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [ticks, setTicks] = useState<Tick[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [asks, setAsks] = useState<Ask[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [holidayBanks, setHolidayBanks] = useState<HolidayBank[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openChild, setOpenChild] = useState<string | null>(null)
  const [spendNote, setSpendNote] = useState<string | null>(null)
  // Which screen the marked minutes went on, per child, because this board
  // lists the whole family and two children are rarely on the same one. Unset
  // until asked: a default would write a guess into the week's breakdown.
  const [spendPick, setSpendPick] = useState<Record<string, DevicePick>>({})
  const [spendActivity, setSpendActivity] = useState<Record<string, ActivityKey>>({})
  const [homeDevices, setHomeDevices] = useState<FamilyDevice[]>([])
  const [showDone, setShowDone] = useState(false)
  // What the last yes just landed. The board approves too, so it owes the
  // parent the same sentence the agree tab does.
  const [earned, setEarned] = useState<{ childName: string; stars: number } | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/quests')
      const data = await res.json()
      setChildren(data.children ?? [])
      setQuests(data.quests ?? [])
      setTicks(data.ticks ?? [])
      setGoals(data.goals ?? [])
      setAsks(data.requests ?? [])
      setBanks(data.banks ?? [])
      setHolidayBanks(data.holidayBanks ?? [])
    } catch { /* stays hidden */ } finally { setLoaded(true) }
  }, [])

  // Keep the board live: a child ticking a quest lands as a pending approval
  // the parent should see without a refresh. Poll gently, and refetch the
  // moment the tab is looked at again, so Waiting on you is never stale.
  useEffect(() => {
    load()
    const id = setInterval(load, 15000)
    const onVis = () => { if (!document.hidden) load() }
    window.addEventListener('focus', load)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      window.removeEventListener('focus', load)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [load])

  // The child asked for this quest. Yes makes it real (2 stars, one off,
  // adjustable any time in Manage), no closes it kindly.
  async function decideAsk(askId: string, decision: 'added' | 'declined') {
    setAsks(prev => prev.map(a => a.id === askId ? { ...a, status: decision } : a))
    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_decide', request_id: askId, decision, stars: 2, schedule: 'once' }),
      })
      if (decision === 'added') load()
    } catch { load() }
  }

  // The screens in this house, so the picker offers Ella's iPad rather than
  // the word tablet. No devices listed falls back to the five kinds.
  useEffect(() => {
    let on = true
    fetch('/api/devices/family')
      .then(r => r.json())
      .then((d: { devices?: FamilyDevice[] }) => {
        if (on) setHomeDevices((d.devices ?? []).filter(x => !x.retiredAt))
      })
      .catch(() => { /* the picker falls back to the kinds */ })
    return () => { on = false }
  }, [])

  // Screen time was used: the stars come off the bank right here, and the same
  // minutes land in the week's breakdown against the screen they went on.
  async function spend(childId: string, minutes: number) {
    const pick = spendPick[childId]
    if (!pick) return
    try {
      const res = await fetch('/api/quests/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: childId, minutes,
          device: pick.kind,
          familyDeviceId: pick.familyDeviceId,
          activity: spendActivity[childId] ?? null,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setBanks(prev => prev.map(b => b.child_id === childId
          ? { ...b, spent: b.spent + data.spent_stars, balance: data.balance, minutes: data.balance_minutes }
          : b))
        const on = data.device_label ? ` on ${data.device_label}` : ''
        setSpendNote(`${data.spent_minutes} minutes marked as used${on}, ⭐ ${data.balance} left in the bank`)
      } else {
        setSpendNote(data.error ?? 'Could not mark that just now')
      }
      setTimeout(() => setSpendNote(null), 3500)
    } catch { /* next load reconciles */ }
  }

  async function decide(tickId: string, decision: 'approve' | 'reject') {
    // Read the job and the child before the tick changes state: the stars are
    // the message, and a rejection has nothing to say here.
    const tick = ticks.find(t => t.id === tickId)
    const q = tick ? quests.find(x => x.id === tick.quest_id) : undefined
    if (decision === 'approve' && q) {
      setEarned({
        childName: children.find(c => c.id === tick?.child_id)?.name ?? 'Your child',
        stars: Number(q.stars) || 1,
      })
    }
    setTicks(prev => prev.map(t => t.id === tickId ? { ...t, status: decision === 'approve' ? 'approved' : 'rejected' } : t))
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tick_id: tickId, decision }),
      })
      // Drop the bell and the Waiting on you banner at once, and the child's
      // own app hears the yes on its next poll.
      try { window.dispatchEvent(new Event('gc:notifs-changed')) } catch { /* SSR */ }
    } catch { load() }
  }

  async function tickQuest(questId: string, childId: string) {
    const today = new Date().toISOString().slice(0, 10)
    setTicks(prev => [...prev, {
      id: `local-${questId}`, quest_id: questId, child_id: childId,
      tick_date: today, status: 'approved',
    }])
    try {
      await fetch('/api/quests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The caller already resolved which child this tick is for, and the
        // optimistic row above uses it. currentChildId() reads ?child= from a
        // URL that never carries one on this page, so it sent null and a null
        // tick banks stars for every child.
        body: JSON.stringify({ quest_id: questId, child_id: childId }),
      })
    } catch { load() }
  }

  const pendingAsks = asks.filter(a => a.status === 'pending')
  if (!loaded || (quests.length === 0 && pendingAsks.length === 0)) return null

  const questById = new Map(quests.map(q => [q.id, q]))
  const pending = ticks.filter(t => t.status === 'pending')
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div style={{
      background: '#fff', border: '2px solid var(--ink)',
      borderRadius: '20px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          Family Quests
        </span>
      </div>

      <TimeEarnedPrompt earned={earned} onDismiss={() => setEarned(null)} />

      {/* The kids' own quest ideas: one tap makes it real */}
      {pendingAsks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {pendingAsks.map(a => {
            const childName = children.find(c => c.id === a.child_id)?.name ?? 'Your child'
            // A swap ask names both halves of the trade, so the yes is an
            // informed one. The old job comes off their board with the yes
            // when it is theirs alone; a whole family job stays for the
            // siblings. Yes keeps the old job's stars, like for like.
            const swapOld = a.swap_quest_id ? quests.find(q => q.id === a.swap_quest_id) : undefined
            return (
              <div key={a.id} style={ASK_ROW}>
                <span style={{ fontSize: 'var(--text-lg)' }}>{swapOld ? '🔁' : a.emoji}</span>
                <span style={ASK_TEXT}>
                  {swapOld
                    ? <>{childName} asks to swap <strong>{swapOld.title}</strong> for <strong>{a.title}</strong></>
                    : <>{childName} pitched a quest: <strong>{a.title}</strong></>}
                  <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}> · their idea</span>
                </span>
                <div style={ASK_ACTIONS}>
                  <Button variant="primary" size="sm" onClick={() => decideAsk(a.id, 'added')} style={{ flexShrink: 0 }}>
                    {swapOld ? 'Swap it' : 'Add it ⭐2'}
                  </Button>
                  <button
                    onClick={() => decideAsk(a.id, 'declined')}
                    aria-label="Not this time"
                    style={ASK_DISMISS}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Approve queue: the kid is waiting on you */}
      {pending.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {pending.map(t => {
            const q = questById.get(t.quest_id)
            const childName = children.find(c => c.id === t.child_id)?.name ?? 'Your child'
            if (!q) return null
            return (
              <div key={t.id} style={{ ...ASK_ROW, background: 'var(--terracotta-lt)', borderColor: 'var(--terracotta)' }}>
                <span style={{ fontSize: 'var(--text-lg)' }}>{q.emoji}</span>
                <span style={ASK_TEXT}>
                  {childName} ticked <strong>{q.title}</strong>
                  <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}> · ⭐ {q.stars} = {q.stars * STAR_MINUTES} min</span>
                </span>
                <div style={ASK_ACTIONS}>
                  <Button variant="primary" size="sm" onClick={() => decide(t.id, 'approve')} style={{ flexShrink: 0 }}>
                    Approve
                  </Button>
                  <button
                    onClick={() => decide(t.id, 'reject')}
                    aria-label="Not done yet"
                    style={ASK_DISMISS}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Every child, big and glanceable, expandable to tick */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children.map(c => {
          const childQuests = quests.filter(q => q.child_id === c.id || q.child_id === null)
          if (childQuests.length === 0) return null
          const dueToday = childQuests.filter(q => questDueToday(q.schedule, q.schedule_days))
          const doneIds = new Set(
            ticks.filter(t => t.tick_date === today && t.status !== 'rejected' && (t.child_id === c.id || t.child_id === null)).map(t => t.quest_id)
          )
          const doneToday = dueToday.filter(q => doneIds.has(q.id)).length
          const weekStars = ticks
            .filter(t => t.status === 'approved' && (t.child_id === c.id || t.child_id === null))
            .reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)
          const bank = banks.find(b => b.child_id === c.id)
          const balance = bank ? bank.balance : weekStars
          // Two different kinds of time, and this row used to add them up.
          const holiday = holidayBanks.find(h => h.childId === c.id)
          const goal = goals.find(g => g.child_id === c.id)
          const todayStars = ticks
            .filter(t => t.tick_date === today && t.status !== 'rejected' && (t.child_id === c.id || t.child_id === null))
            .reduce((sum, t) => sum + (questById.get(t.quest_id)?.stars ?? 1), 0)
          const dayGoalHit = !!goal?.daily_stars && todayStars >= goal.daily_stars
          const isOpen = openChild === c.id
          return (
            <div key={c.id} style={{
              borderRadius: '16px', background: 'var(--cream)', border: '2px solid var(--ink)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => { setShowDone(false); setOpenChild(isOpen ? null : c.id) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>
                      {c.name}
                    </span>
                    {/* "This week", said out loud. It used to read "⭐ 116 =
                        580 min of screen time left", which was this week's
                        earned stars and the holiday bank summed into one
                        figure with no seam. In August that number climbs past
                        anything a week could hold and the feature working as
                        designed reads as a runaway bug. Naming the window is
                        the whole fix: these stars reset, the banked minutes
                        below them do not. */}
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                      ⭐ {balance} = {balance * STAR_MINUTES} min this week
                    </span>
                  </span>
                  {/* The holiday bank, on its own line and never added to the
                      one above. Minutes earned past the weekly cap, which
                      survive the reset and can only be spent while school is
                      out. Silent at zero, because a bank nobody has paid into
                      is not news.

                      "during", not "this". Every title in META carries its
                      own article already ("the summer holidays", "half term",
                      "spring break"), so "this ${title}" read as "spend this
                      the summer holidays" on the one branch a parent sees
                      most, the holidays actually being open. */}
                  {holiday && holiday.remaining > 0 && (
                    <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4, marginBottom: '6px' }}>
                      {holiday.spendableNow
                        ? <>Plus <strong style={{ color: 'var(--ink)' }}>{holiday.remaining} min</strong> to spend{holiday.holidayTitle ? ` during ${holiday.holidayTitle}` : ' now'}</>
                        : <>Plus <strong style={{ color: 'var(--ink)' }}>{holiday.remaining} min</strong> saved for the school holidays</>}
                    </span>
                  )}
                  {/* Today's quest dots */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink-soft)' }}>
                      {/* The instruction that used to run on here, "tap to see
                          the tasks, agree the waiting ones and send more", was
                          three lines of telling a parent what a row with a
                          chevron on it does. The chevron already says it. */}
                      {doneToday} of {dueToday.length} done today
                    </span>
                    {goal?.daily_stars ? (
                      <span style={{
                        fontSize: 'var(--text-xs)', fontWeight: 800, marginLeft: '4px',
                        fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                        color: dayGoalHit ? 'var(--ink)' : 'var(--ink-muted)',
                        background: dayGoalHit ? 'var(--terracotta)' : 'var(--cream)',
                        border: dayGoalHit ? 'none' : '1px solid var(--border)',
                        borderRadius: '100px', padding: '3px 8px',
                      }}>
                        {dayGoalHit ? 'Day goal hit 🎉' : `Day goal ⭐ ${Math.min(todayStars, goal.daily_stars)}/${goal.daily_stars}`}
                      </span>
                    ) : null}
                  </span>
                  {/* The Saving for bar used to be here too. StarSummary a
                      screen up already draws it, and owns it properly: it
                      carries the goal reached celebration and the redeem
                      button, which this copy never had. Two bars for one goal,
                      one of them a dead end.

                      The balance line above STAYS. That one is not a duplicate:
                      this board lists every child, StarSummary only ever shows
                      the selected one, so for a family with two children this
                      row is the only place both balances appear at once. */}
                </span>
                <span style={{ color: 'var(--ink-light)', fontSize: 'var(--text-md)', flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                  →
                </span>
              </button>

              {/* Expanded: tick today's quests right here */}
              {isOpen && (
                <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {/* Screen time used comes straight off the bank */}
                  {balance > 0 && (() => {
                    // Which screen, then how long. Marking time used to record
                    // a bare number, so a family who marks by hand read an
                    // almost empty week on the balance report while the stars
                    // drained away. Asked once per child, then it stays picked.
                    const pick = spendPick[c.id] ?? null
                    const needsActivity = pick != null && asksActivity(pick.kind)
                    const ready = pick != null && (!needsActivity || spendActivity[c.id] != null)
                    return (
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: '9px',
                        background: '#fff', border: '1px solid var(--border)', borderRadius: '11px',
                        padding: '10px 12px',
                      }}>
                        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)' }}>
                          Screen time used. Which screen?
                        </span>
                        <DevicePickerChips
                          devices={homeDevices}
                          fallback={DEVICES}
                          value={pick}
                          onChange={next => {
                            setSpendPick(prev => ({ ...prev, [c.id]: next }))
                            // A different device asks a different question, so
                            // last time's answer never rides along to this one.
                            if (!asksActivity(next.kind)) {
                              setSpendActivity(prev => {
                                const { [c.id]: _drop, ...rest } = prev
                                return rest
                              })
                            }
                          }}
                        />
                        {needsActivity && (
                          <>
                            {/* A computer is the one device whose bucket cannot
                                be read off the device. Homework counted as
                                watching is the bug this question stops. */}
                            <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)' }}>
                              What were they doing?
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {ACTIVITIES.map(a => {
                                const on = spendActivity[c.id] === a.key
                                return (
                                  <button
                                    key={a.key}
                                    type="button"
                                    onClick={() => setSpendActivity(prev => ({ ...prev, [c.id]: a.key }))}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: '6px',
                                      padding: '8px 12px', borderRadius: '100px',
                                      border: `2px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                                      background: on ? 'var(--terracotta-lt)' : '#fff',
                                      color: on ? 'var(--terracotta)' : 'var(--ink)',
                                      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <span aria-hidden style={{ fontSize: 'var(--text-base)', lineHeight: 1 }}>{a.emoji}</span>
                                    {a.label}
                                  </button>
                                )
                              })}
                            </div>
                          </>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)' }}>
                            How long?
                          </span>
                          {[15, 30, 60].map(m => (
                            <button
                              key={m}
                              onClick={() => spend(c.id, m)}
                              disabled={!ready}
                              style={{
                                background: 'var(--cream)', border: '2px solid var(--ink)',
                                borderRadius: '100px', padding: '6px 12px',
                                cursor: ready ? 'pointer' : 'default',
                                opacity: ready ? 1 : 0.5,
                                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)',
                              }}
                            >
                              {m} min
                            </button>
                          ))}
                        </div>
                        {!ready && (
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
                            {pick == null ? 'Pick the screen first.' : 'Pick what they were doing first.'}
                          </span>
                        )}
                      </div>
                    )
                  })()}
                  {spendNote && (
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--terracotta-dark)', margin: 0 }}>
                      {spendNote}
                    </p>
                  )}
                  {/* Managed from the board, not only from inside the page.
                      This was one small mono link pointing at /dashboard/quests,
                      which is the page the board is already on, so a parent who
                      wanted to add a job for this particular child was returned
                      to the top of where they started and had to find the way in
                      again. Both of these are real buttons now, both land on the
                      right tab, and both carry the child with them so the page
                      opens already pointed at the one whose row was tapped. */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link
                      href={`/dashboard/quests/manage?child=${c.id}`}
                      style={{
                        flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '6px', padding: '11px 14px', borderRadius: '12px', textDecoration: 'none',
                        background: 'var(--terracotta)', color: 'var(--ink)',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                        boxShadow: '0 3px 0 var(--terracotta-dark)',
                      }}
                    >
                      + Add a job for {c.name}
                    </Link>
                    <Link
                      href={`/dashboard/quests/manage?child=${c.id}&tab=theirs`}
                      style={{
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '11px 14px', borderRadius: '12px', textDecoration: 'none',
                        background: '#fff', border: '2px solid var(--ink)', color: 'var(--ink-soft)',
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
                      }}
                    >
                      Manage
                    </Link>
                  </div>
                  {/* What is still to do stays up top, big and tappable. */}
                  {(() => {
                    const todo = dueToday.filter(q => !doneIds.has(q.id))
                    const done = dueToday.filter(q => doneIds.has(q.id))
                    return (
                      <>
                        {todo.length === 0 && done.length > 0 && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '11px 13px', borderRadius: '11px',
                            background: 'var(--tint-sage)', border: '1px solid var(--border)',
                          }}>
                            <span style={{ fontSize: 'var(--text-md)' }}>🎉</span>
                            <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)' }}>
                              All done for today
                            </span>
                          </div>
                        )}
                        {todo.map(q => (
                          <button
                            key={q.id}
                            onClick={() => tickQuest(q.id, c.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '10px 12px', borderRadius: '11px',
                              background: '#fff', border: '1px solid var(--border)', cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span style={{ fontSize: 'var(--text-md)' }}>{q.emoji}</span>
                            <span style={{ flex: 1, fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
                              {q.title}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--terracotta-dark)', flexShrink: 0 }}>
                              Tick · ⭐{q.stars}
                            </span>
                          </button>
                        ))}
                        {/* The agreed ones drop off into a quiet, foldable line so the
                            list never grows into a pile of Done rows. */}
                        {done.length > 0 && (
                          <div>
                            <button
                              onClick={() => setShowDone(s => !s)}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '9px 12px', borderRadius: '11px', background: 'none',
                                border: '1px dashed var(--border)', cursor: 'pointer', textAlign: 'left',
                              }}
                            >
                              <span style={{ fontSize: 'var(--text-base)' }}>✓</span>
                              <span style={{ flex: 1, fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink-muted)' }}>
                                {done.length} done today
                              </span>
                              <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-light)', transform: showDone ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                                →
                              </span>
                            </button>
                            {showDone && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                                {done.map(q => (
                                  <div key={q.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '9px 12px', borderRadius: '11px',
                                    background: 'var(--tint-sage)', border: '1px solid var(--border)',
                                  }}>
                                    <span style={{ fontSize: 'var(--text-md)', opacity: 0.7 }}>{q.emoji}</span>
                                    <span style={{ flex: 1, fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', textDecoration: 'line-through', opacity: 0.6 }}>
                                      {q.title}
                                    </span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>
                                      Done ✓
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
