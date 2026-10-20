'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BetaTag from '@/components/ui/BetaTag'
import HappyIcon from '@/components/kid/HappyIcon'
import HomeworkCheck from '@/components/learning/HomeworkCheck'
import { CRAYON } from '@gc/shared/happy-news'
import { homeworkBand, helpMoves } from '@/lib/homework/guide'
import type { YearView } from '@/lib/learning/year-view'
import type { WeekBrief } from '@/lib/learning/this-week'

// The reading surface for what a class is being taught this term.
//
// Two shaping decisions, both about the same risk: 448 objectives dumped on a
// parent is not information, it is a wall, and a wall reads as a to do list
// nobody could ever finish.
//
// FIRST, only this term and this year group ever load, which is roughly twenty
// to forty lines rather than four hundred.
//
// SECOND, strands are collapsed by default and the count leads. A parent
// scanning "Number and place value, 8 things" gets the shape of the term in
// four seconds; opening one is a deliberate act, which is the moment the detail
// is actually wanted. This is the same move the passport makes with its five
// rows and it works for the same reason.
//
// ── THREE TABS, ADDED 11 AUGUST 2026 ─────────────────────────────────────────
//
// Justin: "it seems to live on printables so misleading, and navs back to
// printable. Can it have its own place, more apt. Maybe when clicked on gives
// summary, then tab see whole term, another tab get ahead, and another decide
// homework."
//
// He is right about the symptom and the cause is one link. The only two ways
// on from this page were the homework decoder and a printable sheet, and the
// sheet is under /dashboard/printables, so a parent who followed the obvious
// button was in the printables section and every back tap after that kept them
// there. A page about what a class is being taught was behaving like a corner
// of the print shop.
//
// AND THE TABS ALONE DID NOT FIX IT, which this comment claimed for a day.
// Justin, 11 August 2026, having to say it a second time: "make sure navigation
// goes back to what the child is learning, not printables." The tabs were built
// and both destinations kept their back links, so the loop described above was
// still exactly what happened. Those two links now return here, to the tab they
// were launched from. Naming the fault and calling it fixed is not the same as
// fixing it, and a comment that says so is worse than no comment, because the
// next person reads it and believes the job is done.
//
// So the three things you can do with a term are now three peers, named, on the
// page itself, and the printable is one item inside one of them rather than the
// exit:
//
//   The whole term   the objectives, which is what the page always was
//   Get ahead        what is coming, and the sheet to practise it with
//   Homework         the decoder, for the sheet that came home tonight
//
// THE SUMMARY STAYS ABOVE THE TABS. This week at school is the answer to the
// question most parents actually arrived with, so putting it inside a tab would
// hide the best thing on the page behind a choice.
//
// ── HOMEWORK FIRST, ONE SCROLL, NO TABS (17 October 2026) ───────────────────
//
// Justin, with a screenshot of this page: "simplify ... make super helpful ...
// solve problem of homework ... super simple intuitive". Three specialists
// reported the same day (plans/2026-10-17-at-school-homework-plan.md): the
// research says the parent's real questions are how much homework is normal,
// whether tonight's is fine, and how to help without taking over; Mobbin says
// a range bar with a verdict, one big button, and no mode switching; the
// platform map says almost all of it already existed in four other places.
//
// So the page now answers in that order, top to bottom:
//
//   1. How much is normal for their year, and is tonight fine   HomeworkCheck
//   2. Paste in tonight's homework                              the decoder
//   3. Three ways to help tonight                               helpMoves
//   4. This week in class                                       the WeekBrief
//   5. Make it a routine                                        After school quest
//   6. The whole term, what is coming, a practice sheet         quiet rows
//
// The tabs went. They hid the homework help behind a choice on the page a
// parent opens BECAUSE of homework. The term list is still here, one tap
// down, for the parent who wants it.

const CARD: React.CSSProperties = {
  background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)',
  padding: '18px 16px', marginBottom: 16,
}

const H2: React.CSSProperties = {
  margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
  color: 'var(--ink)', lineHeight: 1.25, letterSpacing: '-0.01em',
}

/** What an opened row shows, indented under its title. */
const FOLD: React.CSSProperties = { padding: '2px 4px 16px 60px' }

/** A quiet row at the foot of the page: icon, words, chevron. */
function Row({ icon, title, sub, href, onClick, open }: {
  icon: React.ComponentProps<typeof HappyIcon>['name']; title: string; sub?: string
  href?: string; onClick?: () => void; open?: boolean
}) {
  const inner = (
    <>
      <span aria-hidden style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HappyIcon name={icon} size={28} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{title}</span>
        {sub && <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.4 }}>{sub}</span>}
      </span>
      <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .18s' }}>›</span>
    </>
  )
  const style: React.CSSProperties = {
    width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', textAlign: 'left',
    background: 'none', border: 'none', borderTop: '1.5px solid var(--border)', cursor: 'pointer', textDecoration: 'none', font: 'inherit',
  }
  return href
    ? <Link href={href} style={style}>{inner}</Link>
    : <button onClick={onClick} aria-expanded={open} style={style}>{inner}</button>
}

export default function LearningYear({
  views, blurbs, briefs = [], notes = [], initialTab,
}: {
  views: YearView[]
  blurbs: string[]
  briefs?: (WeekBrief | null)[]
  /** What each child wrote in their own app today, from kid_homework_notes. */
  notes?: (string | null)[]
  /** ?tab=term opens the whole term; anything else lands on the homework view. */
  initialTab?: string | null
}) {
  const [active, setActive] = useState(0)
  const [termOpen, setTermOpen] = useState(initialTab === 'term')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [showWording, setShowWording] = useState(false)
  // Which rows are open. This week opens itself when the page is reached by
  // its anchor from the Today card on Home, so that link still lands on it.
  const [fold, setFold] = useState<Record<string, boolean>>({})
  useEffect(() => {
    if (window.location.hash === '#this-week') setFold(f => ({ ...f, week: true }))
  }, [])
  const toggleFold = (key: string) => setFold(f => ({ ...f, [key]: !f[key] }))
  const v = views[active]
  const blurb = blurbs[active]
  const brief = briefs[active] ?? null
  const note = notes[active] ?? null
  const band = homeworkBand(v.yearGroup)
  const childQs = `child=${encodeURIComponent(v.childId)}`

  const toggle = (key: string) => setOpen(o => ({ ...o, [key]: !o[key] }))

  // One mono line under the title: year, term, week. It replaced a chip and a
  // paragraph, which said the same thing in forty words.
  const frame = [
    band?.yearLabel ?? null,
    v.label ? v.label.replace(/^Year \d+,\s*/, '') : null,
    brief && !brief.preview ? `week ${brief.weekOfTerm}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 16px 60px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 6 }}>
        ← Home
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 4 }}>
        <p className="eyebrow" style={{ margin: 0 }}>At school</p>
        <BetaTag />
      </div>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 6px' }}>
        {v.childName}&rsquo;s homework
      </h1>
      {frame && (
        <p style={{ margin: '0 0 14px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', letterSpacing: '0.02em' }}>
          {frame}
        </p>
      )}

      {/* Which child, only when there is more than one. */}
      {views.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '0 0 16px' }}>
          {views.map((x, i) => {
            const on = i === active
            return (
              <button
                key={x.childId}
                onClick={() => setActive(i)}
                aria-pressed={on}
                style={{
                  minHeight: 44, padding: '8px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                  border: on ? '2px solid var(--ink)' : '2px solid var(--ink-light)',
                  background: on ? CRAYON.sky : 'var(--white)', boxShadow: on ? '0 3px 0 var(--ink)' : 'none',
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)',
                }}
              >
                {x.childName}
                {x.yearGroup !== null && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)', marginLeft: 7 }}>
                    {x.yearGroup === 0 ? 'R' : `Y${x.yearGroup}`}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* No birthday: the ask, and nothing else. Everything on this page is
          derived from it, so offering a half page of guesses underneath would
          be the one thing this feature must never do. */}
      {v.blocked === 'no_birthday' && (
        <div style={{ ...CARD, background: 'var(--cream)' }}>
          <h2 style={H2}>One thing missing</h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            England places a child by their age on 31 August, so their birthday is the only way to know which year group they are actually in. The month on its own is enough if you would rather not give the day.
          </p>
          <Link href="/dashboard/settings" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Add {v.childName}&rsquo;s birthday
          </Link>
        </div>
      )}

      {/* 1. HOW MUCH IS NORMAL, AND IS TONIGHT FINE */}
      {band && <HomeworkCheck band={band} childName={v.childName} tonightNote={note} />}

      {/* 2. THE ONE BUTTON. Paste in tonight's homework: the decoder, which
          names the curriculum objective, says what it is for, and gives one
          way to help. Butter because it is the one thing on this page to tap. */}
      {band && (
        <Link
          href={`/dashboard/homework?${childQs}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none',
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
            boxShadow: 'var(--lift)', padding: '15px 18px', marginBottom: 6,
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
          }}
        >
          <HappyIcon name="homework" size={26} />
          Stuck on tonight&rsquo;s homework?
        </Link>
      )}
      {band && (
        <p style={{ margin: '0 0 20px', textAlign: 'center', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45, textWrap: 'balance' }}>
          Paste it in. We say what it is for and how the school teaches it.
        </p>
      )}

      {/* ── EVERYTHING ELSE, ONE TAP AWAY (17 October 2026) ──────────────────
          Justin: "simplify ux further so only what they need to see and can
          click to expand". What a parent needs at the kitchen table is the
          check and the one button above. Everything below is a row with a
          title and a line that says what is inside, and it opens in place:
          how to help, this week in class, what is coming up, secondary
          school, the routine, the whole term, a practice sheet. Nothing was
          taken away; it waits until it is asked for. */}
      {v.blocked !== 'no_birthday' && (
        <div style={{ marginTop: 6, borderBottom: '1.5px solid var(--border)' }}>
          {/* How a parent helps matters more than how much: backing the
              child's own effort helps, taking over does not
              (lib/homework/guide.ts carries the sources). */}
          {band && (
            <Row icon="hand" title="How to help tonight" sub="Three things that work, for their age" onClick={() => toggleFold('help')} open={fold.help} />
          )}
          {band && fold.help && (
            <div style={FOLD}>
              <ol style={{ listStyle: 'none', margin: '0 0 6px', padding: 0, display: 'grid', gap: 10 }}>
                {helpMoves(band.phase).map((m, i) => (
                  <li key={m} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                    <span aria-hidden style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: CRAYON.teal, border: '2px solid var(--ink)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.45, paddingTop: 3 }}>{m}</span>
                  </li>
                ))}
              </ol>
              <Link href="/dashboard/scripts?cat=school-and-ai" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>
                The words for a homework standoff ›
              </Link>
            </div>
          )}

          {/* This week in class, phase 1 of the curriculum depth plan: the one
              objective the week is on (lib/learning/this-week.ts). The anchor
              is what the Today card on Home lands on, and arriving by it
              opens the row. */}
          {brief && (
            <div id="this-week" style={{ scrollMarginTop: 80 }}>
              <Row
                icon="lessons"
                title={brief.preview ? 'When they go back' : 'This week in class'}
                sub={`${brief.subjectLabel}: ${brief.strand}`}
                onClick={() => toggleFold('week')}
                open={fold.week}
              />
            </div>
          )}
          {brief && fold.week && (
            <div style={FOLD}>
              {/* The dinner table version. A fixed frame rather than a sentence
                  grafted onto DfE text, because their objectives do not
                  survive being rewritten into questions and we quote, never
                  paraphrase. */}
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.5, margin: '0 0 12px' }}>
                At tea, ask {v.childName} to teach you this one. Being the teacher is how you find out if it stuck.
              </p>
              <Link
                href={`/dashboard/quests/manage?title=${encodeURIComponent(brief.questTitle)}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, textDecoration: 'none',
                  background: 'var(--white)', color: 'var(--ink)', border: 'var(--edge)', boxShadow: '0 3px 0 var(--ink)',
                  borderRadius: 'var(--radius-tile)', padding: '9px 14px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                }}
              >
                <HappyIcon name="jobs" size={22} /> Make it a job for stars
              </Link>
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => setShowWording(w => !w)}
                  aria-expanded={showWording}
                  style={{ background: 'none', border: 'none', padding: '6px 0', minHeight: 44, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}
                >
                  {showWording ? 'Hide' : 'What the curriculum says'} ›
                </button>
                {showWording && (
                  <div style={{ margin: '0 0 6px', paddingLeft: 11, borderLeft: '3px solid var(--border)' }}>
                    <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{brief.lead}</p>
                    {brief.parts.map(p => (
                      <p key={p} style={{ margin: '4px 0 0', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{p}</p>
                    ))}
                    {brief.second && (
                      <p style={{ margin: '8px 0 0', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                        Also running: {brief.second.subjectLabel}, {brief.second.lead}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coming up at school. One thing, never a list: five dates is a
              worry, one is a head start. The row names it and when; opening
              it gives the one thing to do, then why. */}
          {v.event && (
            <Row icon="calendar" title={v.event.event.title} sub={`Coming up${v.eventWhen ? `, ${v.eventWhen}` : ''}`} onClick={() => toggleFold('event')} open={fold.event} />
          )}
          {v.event && fold.event && (
            <div style={FOLD}>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, fontWeight: 600, margin: '0 0 8px', maxWidth: '65ch' }}>{v.event.event.doThis}</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, maxWidth: '65ch' }}>{v.event.event.what}</p>
            </div>
          )}

          {/* Secondary school, only inside the real window. */}
          {v.transition && (
            <Row icon="bag" title="Secondary school" sub={v.transition.headline} onClick={() => toggleFold('secondary')} open={fold.secondary} />
          )}
          {v.transition && fold.secondary && (
            <div style={FOLD}>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: '0 0 12px' }}>{v.transition.line}</p>
              <Link href="/dashboard/secondary" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, textDecoration: 'none', background: 'var(--white)', color: 'var(--ink)', border: 'var(--edge)', boxShadow: '0 3px 0 var(--ink)', borderRadius: 'var(--radius-tile)', padding: '9px 16px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)' }}>The five steps ›</Link>
            </div>
          )}

          {/* The routine is the nudge: homework before screens and twenty
              minutes of reading become jobs the child ticks and the parent
              approves, with the after school reminder the app already
              sends. No new push, no new cron. */}
          <Row
            icon="time"
            title="Make it a routine"
            sub={`Homework before screens and twenty minutes of reading, as jobs ${v.childName} ticks`}
            href="/dashboard/quests?routine=after-school"
          />
          {v.subjects.length > 0 && (
            <Row
              icon="read"
              title="The whole term"
              sub={`Everything ${band?.yearLabel ?? 'the class'} covers this term`}
              onClick={() => setTermOpen(o => !o)}
              open={termOpen}
            />
          )}
          {termOpen && (
            <div style={{ padding: '4px 0 14px' }}>
              {v.subjects.map(sub => (
                <div key={sub.subject} style={{ marginBottom: 12 }}>
                  <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                    {sub.label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>{sub.count}</span>
                  </p>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {sub.strands.map(st => {
                      const key = `${sub.subject}:${st.strand}`
                      const isOpen = Boolean(open[key])
                      return (
                        <div key={key} style={{ border: '2px solid var(--border)', borderRadius: 'var(--radius-tile)', background: 'var(--white)', overflow: 'hidden' }}>
                          <button
                            onClick={() => toggle(key)}
                            aria-expanded={isOpen}
                            style={{ width: '100%', minHeight: 44, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px' }}
                          >
                            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>{st.strand}</span>
                            <span aria-hidden style={{ flexShrink: 0, color: 'var(--ink-muted)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>›</span>
                          </button>
                          {isOpen && (
                            <ul style={{ listStyle: 'none', margin: 0, padding: '0 12px 12px', display: 'grid', gap: 8 }}>
                              {st.objectives.map(o => (
                                <li key={o.id} style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                                  {/* Laid out, not edited: every word is still
                                      the Department's and still in their order. */}
                                  {o.parts.length > 0 ? (
                                    <>
                                      <span style={{ display: 'block', color: 'var(--ink)', fontWeight: 600 }}>{o.lead}</span>
                                      <span style={{ display: 'grid', gap: 5, marginTop: 6, paddingLeft: 10, borderLeft: '2px dotted rgba(26,26,46,0.18)' }}>
                                        {o.parts.map((part, i) => <span key={i}>{part}</span>)}
                                      </span>
                                    </>
                                  ) : o.objective}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              {/* Where every line came from: the reason a parent can trust a
                  page that says what school teaches. */}
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '6px 0 0' }}>
                From the national curriculum for England, published by the Department for Education. The wording is theirs. Which term a topic falls in is our ordering, not the school&rsquo;s.
              </p>
            </div>
          )}
          {v.target && (
            <Row icon="print" title="Print a practice sheet" sub="This term's topics, a week or two ahead of the class" href="/dashboard/printables/learning" />
          )}
        </div>
      )}

      {/* The blurb for the years we hold no objectives for, so Reception and
          secondary still get an honest line about why the term list is not
          here. */}
      {(v.blocked === 'too_young' || v.blocked === 'secondary') && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '14px 0 0' }}>{blurb}</p>
      )}
    </div>
  )
}
