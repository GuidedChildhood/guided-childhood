'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import type { SchoolAction } from './SchoolActionsCard'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'
import { isHeldForHolidays } from '@/lib/school/child-items'
import type { Region } from '@/lib/learning/holidays'
import { nextUp, whenWords, countLine, type UpEntry } from '@/lib/school/next-up'
import { momentImageSrc } from '@/lib/content/moment-images'

// NEXT UP: the one answer the calendar page opens on.
//
// Justin, 22 November 2026: the page "seems a bit messy with explaining what's
// coming next", and should be "super simple", things "popping up" and
// "disappearing", "but makes sure nothing is missed ... a parent's best
// friend". Plan: plans/2026-11-22-calendar-next-up.md.
//
// Mobbin, 22 November 2026. Future Pro opens on one large card for the single
// next thing with its action on it
// (https://mobbin.com/screens/2b5839c4-0519-4df7-9341-bd7fd3a0f60b). Givingli
// puts a date tile beside every event so the day is read before the words
// (https://mobbin.com/screens/63358752-d05d-4453-b5e9-fd524e2760ef). Slack's
// Later list keeps Complete on the row itself
// (https://mobbin.com/screens/50e0695f-9503-45f9-b9b9-4ebb1e8067d2). Translated
// into our own cream, ink and butter, never a copy of theirs.
//
// So: the single next thing, large, with one Done. Under it the rest of the
// next seven days, each a row that rises into place and leaves when it is
// ticked. Overdue sits on top and only a tick moves it. One line counts what
// is left, and anything further out folds to a line with its number, so a
// short page never means something was dropped.
//
// What goes where is lib/school/next-up.ts, tested. This file only draws it.
// Ticking uses the same PATCH the full card uses, so there is one writer.

type Entry = UpEntry<SchoolAction>

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const KIND_WORD: Record<string, string> = {
  kit: 'Bring', bring: 'Bring', payment: 'Pay', homework: 'Homework', event: 'Event', deadline: 'Deadline', notice: 'Note',
}

// Local date, never toISOString: a British summer evening is still today.
function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parts(iso: string | null): { dow: string; day: string; month: string } | null {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  const local = new Date(y, m - 1, d)
  return { dow: DAYS[local.getDay()], day: String(d), month: MONTHS[m - 1] }
}

// COLOUR SAYS WHAT KIND OF THING IT IS (22 November 2026, Justin: "add some
// colour to match site so design is super friendly"). The same five pastels
// the full card's kind chips already use, so yellow is kit here and there.
// The date tile and the chip carry the strong pastel, the row its soft tint.
// How soon it is stays with the words and the pill, so colour never has to
// mean two things at once. Overdue alone overrides it, in the danger pair.
const KIND_LOOK: Record<string, { soft: string; bold: string; ink: string; art: string | null }> = {
  kit: { soft: 'var(--stage-1)', bold: 'var(--stage-1-bold)', ink: 'var(--stage-1-text)', art: 'bag' },
  bring: { soft: 'var(--stage-1)', bold: 'var(--stage-1-bold)', ink: 'var(--stage-1-text)', art: 'bag' },
  homework: { soft: 'var(--stage-2)', bold: 'var(--stage-2-bold)', ink: 'var(--stage-2-text)', art: 'homework' },
  payment: { soft: 'var(--stage-3)', bold: 'var(--stage-3-bold)', ink: 'var(--stage-3-text)', art: null },
  deadline: { soft: 'var(--stage-4)', bold: 'var(--stage-4-bold)', ink: 'var(--stage-4-text)', art: null },
  event: { soft: 'var(--stage-5)', bold: 'var(--stage-5-bold)', ink: 'var(--stage-5-text)', art: 'dropoff' },
  notice: { soft: 'var(--tint-green)', bold: 'var(--tint-sage)', ink: 'var(--sage-ink)', art: null },
}
function look(e: Entry) {
  if (e.days != null && e.days < 0) return { soft: 'var(--danger-bg)', bold: 'var(--danger-bg)', ink: 'var(--danger)', art: KIND_LOOK[e.item.kind]?.art ?? null }
  return KIND_LOOK[e.item.kind] ?? KIND_LOOK.notice
}

function KindChip({ e }: { e: Entry }) {
  const l = look(e)
  return (
    <span style={{
      display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xs)',
      background: l.bold, color: l.ink, borderRadius: 'var(--radius-pill)', padding: '1px 9px', verticalAlign: 'middle',
    }}>{KIND_WORD[e.item.kind] ?? 'Note'}</span>
  )
}

function tone(days: number | null): { bg: string; ink: string } {
  if (days != null && days < 0) return { bg: 'var(--danger-bg)', ink: 'var(--danger)' }
  if (days === 0) return { bg: 'var(--terracotta)', ink: 'var(--ink)' }
  if (days === 1) return { bg: 'var(--terracotta-lt)', ink: 'var(--ink)' }
  return { bg: 'var(--white)', ink: 'var(--ink)' }
}

function DateTile({ entry, big = false }: { entry: Entry; big?: boolean }) {
  const p = parts(entry.dateIso)
  const l = look(entry)
  const t = { bg: l.bold, ink: l.ink }
  const size = big ? 76 : 58
  return (
    <div aria-hidden style={{
      width: size, minWidth: size, height: size, borderRadius: 'var(--radius-tile)', border: 'var(--edge)',
      background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      lineHeight: 1,
    }}>
      {p ? (
        <>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: big ? 'var(--text-sm)' : 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.dow}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: big ? '2rem' : '1.5rem', fontWeight: 900, margin: '2px 0 1px' }}>{p.day}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.month}</span>
        </>
      ) : (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, textAlign: 'center', padding: '0 4px', lineHeight: 1.3 }}>No date</span>
      )}
    </div>
  )
}

function Tick({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function meta(e: Entry): string {
  const bits: string[] = []
  if (e.item.child_name) bits.push(e.item.child_name)
  if (e.routine) bits.push(`Every ${DAY_FULL[e.item.recurs_weekday as number]}`)
  const time = e.item.due_time ? String(e.item.due_time).slice(0, 5) : null
  if (time) bits.push(time)
  return bits.join(', ')
}

export default function SchoolNextUp({ actions, region = 'uk' }: { actions: SchoolAction[]; region?: Region }) {
  const router = useRouter()
  // Null until mounted, so the server and the first client render agree.
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => { setToday(localToday()) }, [])

  // Ticked here and already on its way out, before the server list catches up.
  const [gone, setGone] = useState<Set<string>>(new Set())
  const [undo, setUndo] = useState<{ id: string; title: string; routine: boolean } | null>(null)
  const [showLater, setShowLater] = useState(false)
  const rowRefs = useRef(new Map<string, HTMLElement>())
  const listRef = useRef<HTMLDivElement>(null)
  const reduce = useRef(false)
  useEffect(() => { reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches }, [])

  // The full card below ticks things too. When it does, bring this in step.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null
    const on = () => { if (t) clearTimeout(t); t = setTimeout(() => router.refresh(), 900) }
    window.addEventListener(NOTIFS_CHANGED_EVENT, on)
    return () => { window.removeEventListener(NOTIFS_CHANGED_EVENT, on); if (t) clearTimeout(t) }
  }, [router])

  const lists = useMemo(() => {
    if (!today) return null
    const [y, m, d] = today.split('-').map(Number)
    const live = actions.filter(a => !gone.has(a.id))
    return nextUp(live, today, a => isHeldForHolidays(
      { recurs_weekday: a.recurs_weekday, runs_in_holidays: a.runs_in_holidays }, new Date(y, m - 1, d), region,
    ))
  }, [actions, gone, today, region])

  // Each thing rises into place, one after another, the first time it is seen.
  const seen = useRef(new Set<string>())
  useEffect(() => {
    if (!lists) return
    const fresh: HTMLElement[] = []
    for (const [id, el] of rowRefs.current) if (!seen.current.has(id)) { seen.current.add(id); fresh.push(el) }
    if (!fresh.length || reduce.current) return
    gsap.fromTo(fresh, { opacity: 0, y: 18, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.36, ease: 'power2.out', stagger: 0.08, clearProps: 'transform,opacity' })
  }, [lists])

  if (!lists) {
    // Before the clock is in: hold the space, say nothing that could be wrong.
    return <div style={{ minHeight: 180 }} aria-hidden />
  }

  const queue: Entry[] = [...lists.overdue, ...lists.soon]
  const hero = queue[0] ?? null
  const rest = queue.slice(1)
  const tucked: Entry[] = [...lists.later, ...lists.undated]

  async function tick(e: Entry) {
    const id = e.item.id
    const el = rowRefs.current.get(id)
    const leave = () => {
      rowRefs.current.delete(id)
      setGone(s => new Set(s).add(id))
      setUndo({ id, title: e.item.title, routine: e.routine })
    }
    if (el && !reduce.current) {
      gsap.to(el, { x: 60, opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, duration: 0.34, ease: 'power2.in', onComplete: leave })
    } else leave()
    try {
      await fetch('/api/school/actions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e.routine ? { id, clear_today: true } : { id, status: 'done' }),
      })
      window.dispatchEvent(new Event(NOTIFS_CHANGED_EVENT))
    } catch { /* it still holds for this view, and the next load is the truth */ }
  }

  async function putBack() {
    if (!undo) return
    const { id } = undo
    setUndo(null)
    try {
      await fetch('/api/school/actions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'open' }),
      })
    } catch { /* the next load is the truth */ }
    seen.current.delete(id)
    setGone(s => { const n = new Set(s); n.delete(id); return n })
    router.refresh()
  }

  const setRef = (id: string) => (el: HTMLElement | null) => { if (el) rowRefs.current.set(id, el); else rowRefs.current.delete(id) }

  const row = (e: Entry) => (
    <div key={e.item.id} ref={setRef(e.item.id)} style={{
      display: 'flex', alignItems: 'center', gap: 12, background: look(e).soft, border: 'var(--edge)',
      borderRadius: 'var(--radius-card)', padding: '10px 12px', marginBottom: 10, overflow: 'hidden',
    }}>
      <DateTile entry={e} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.25, margin: 0, overflowWrap: 'anywhere' }}>
          {e.item.title}
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4, margin: '2px 0 0' }}>
          <strong style={{ color: e.days != null && e.days < 0 ? 'var(--danger)' : 'var(--ink)' }}>{whenWords(e.days)}</strong>
          {meta(e) ? `, ${meta(e)}` : ''}{' '}<KindChip e={e} />
        </p>
      </div>
      <button onClick={() => tick(e)} aria-label={`Done: ${e.item.title}`} style={{
        width: 48, minWidth: 48, height: 48, borderRadius: '50%', border: 'var(--edge)', background: 'var(--white)',
        color: 'var(--sage-ink)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Tick />
      </button>
    </div>
  )

  return (
    <section aria-label="Coming up from school">
      {/* The one line that proves nothing is missed. */}
      <p style={{
        display: 'inline-block', fontSize: 'var(--text-base)', fontWeight: 800, margin: '0 0 14px', padding: '6px 14px',
        borderRadius: 'var(--radius-pill)', border: 'var(--edge)',
        background: lists.overdue.length ? 'var(--danger-bg)' : 'var(--tint-green)',
        color: lists.overdue.length ? 'var(--danger)' : 'var(--sage-ink)',
      }}>
        {countLine(lists)}
      </p>

      {undo && (
        <div role="status" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'var(--ink)', color: 'var(--white)',
          borderRadius: 'var(--radius-card)', padding: '8px 8px 8px 16px', marginBottom: 12,
        }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, minWidth: 0, overflowWrap: 'anywhere' }}>Ticked off: {undo.title}</span>
          {!undo.routine && (
            <button onClick={putBack} style={{
              minHeight: 44, padding: '0 16px', borderRadius: 'var(--radius-pill)', border: '2px solid var(--white)', background: 'transparent',
              color: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', cursor: 'pointer', flexShrink: 0,
            }}>Put it back</button>
          )}
        </div>
      )}

      {hero ? (
        <div key={hero.item.id} ref={setRef(hero.item.id)} style={{
          background: look(hero).soft, border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)',
          padding: '18px 16px 16px', marginBottom: 16, overflow: 'hidden', position: 'relative',
        }}>
          {/* The house picture for this kind of thing, where there is one. */}
          {look(hero).art && momentImageSrc(look(hero).art as string) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={momentImageSrc(look(hero).art as string) as string} alt="" width={68} height={68} style={{
              position: 'absolute', top: 12, right: 12, width: 68, height: 68, borderRadius: '50%', border: 'var(--edge)',
              objectFit: 'cover', background: 'var(--cream)',
            }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <DateTile entry={hero} big />
            <div style={{ flex: 1, minWidth: 0, paddingRight: look(hero).art ? 64 : 0 }}>
              <span style={{
                display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)',
                background: tone(hero.days).bg, color: tone(hero.days).ink, border: 'var(--edge)',
                borderRadius: 'var(--radius-pill)', padding: '3px 12px', marginBottom: 6,
              }}>
                {hero.days != null && hero.days < 0 ? `Still to do, ${whenWords(hero.days).toLowerCase()}` : `Next up, ${whenWords(hero.days).toLowerCase()}`}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.25rem, 5.4vw, 1.6rem)', letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', margin: 0, overflowWrap: 'anywhere' }}>
                {hero.item.title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '6px 0 0' }}>{meta(hero)}{meta(hero) ? ' ' : ''}<KindChip e={hero} /></p>
            </div>
          </div>
          {hero.item.detail && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '12px 0 0' }}>{hero.item.detail}</p>
          )}
          <button onClick={() => tick(hero)} style={{
            marginTop: 14, width: '100%', minHeight: 52, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-btn)',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', cursor: 'pointer',
          }}>
            <Tick /> {hero.routine ? 'Done for today' : 'Done'}
          </button>
        </div>
      ) : (
        <div ref={setRef('all-clear')} style={{
          display: 'flex', alignItems: 'center', gap: 14, background: 'var(--tint-sage, var(--cream))', border: 'var(--edge)',
          borderRadius: 'var(--radius-card)', padding: '18px 16px', marginBottom: 16,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/digi-squad/DiGi-star.png" alt="" width={64} height={64} style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0, lineHeight: 1.2 }}>All clear this week</h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '4px 0 0', lineHeight: 1.45 }}>
              Nothing from school in the next 7 days. Add a letter or a screenshot below when one comes home.
            </p>
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div ref={listRef}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 10px' }}>Then</h3>
          {rest.map(row)}
        </div>
      )}

      {tucked.length > 0 && (
        <div style={{ marginBottom: 4 }}>
          <button onClick={() => setShowLater(v => !v)} aria-expanded={showLater} style={{
            width: '100%', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            background: 'var(--tint-blue)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '0 16px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)', marginBottom: showLater ? 10 : 0,
          }}>
            <span>Later and every week</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>{tucked.length} {showLater ? '▲' : '▼'}</span>
          </button>
          {showLater && tucked.map(row)}
        </div>
      )}
    </section>
  )
}
