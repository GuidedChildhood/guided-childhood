'use client'

import { useState } from 'react'
import Link from 'next/link'
import BetaTag from '@/components/ui/BetaTag'
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

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '18px', marginBottom: 14,
}

// SHORT LABELS, MEASURED RATHER THAN GUESSED. "The whole term" pushed the third
// tab off the right edge of a 390 phone, and a tab a parent cannot see is a tab
// that does not exist, whichever way the row scrolls. Three words that fit beat
// three that read slightly better and hide one.
type TabKey = 'term' | 'ahead' | 'homework'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'term', label: 'The term' },
  { key: 'ahead', label: 'Get ahead' },
  { key: 'homework', label: 'Homework' },
]

export default function LearningYear({
  views, blurbs, briefs = [], initialTab,
}: {
  views: YearView[]
  blurbs: string[]
  briefs?: (WeekBrief | null)[]
  /** Which tab the link asked for, from ?tab=. Anything unknown falls to the term. */
  initialTab?: string | null
}) {
  const [active, setActive] = useState(0)
  // A link can name its tab, so DiGi's "make sense of that homework" chip lands
  // on the decoder rather than on the term list with the decoder one tap away.
  // A promise in a chip label that the destination does not keep is worse than
  // no chip. Unknown values fall back rather than showing an empty page.
  const [tab, setTab] = useState<TabKey>(
    TABS.some(t => t.key === initialTab) ? (initialTab as TabKey) : 'term'
  )
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const v = views[active]
  const blurb = blurbs[active]
  const brief = briefs[active] ?? null

  const toggle = (key: string) => setOpen(o => ({ ...o, [key]: !o[key] }))

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '22px 20px 60px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Home
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 4 }}>
        <p className="eyebrow" style={{ margin: 0 }}>At school</p>
        <BetaTag />
      </div>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 8px' }}>
        What {v.childName} is learning
      </h1>

      {/* Which child, only when there is more than one. */}
      {views.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '14px 0 4px' }}>
          {views.map((x, i) => (
            <button
              key={x.childId}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              style={{
                padding: '9px 15px', borderRadius: 100, cursor: 'pointer',
                border: `1.5px solid ${i === active ? 'var(--terracotta)' : 'var(--border)'}`,
                background: i === active ? 'var(--terracotta-lt)' : '#fff',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)',
              }}
            >
              {x.childName}
              {x.yearGroup !== null && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginLeft: 7 }}>
                  Y{x.yearGroup}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* The year and term, stated once and plainly, so everything below has a
          frame. Without this a parent cannot tell whether they are reading this
          term, this year, or the whole of primary. */}
      {v.label && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '8px 13px', margin: '14px 0 12px' }}>
          <span aria-hidden>🎒</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{v.label}</span>
        </div>
      )}

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 20px' }}>{blurb}</p>

      {/* THIS WEEK AT SCHOOL, phase 1 of the curriculum depth plan: the one
          objective the week is on, walked deterministically through the term
          (see lib/learning/this-week.ts), with the two things a parent can do
          with it. The anchor is what the Today card row on Home lands on. In
          the holidays it previews what starts when they go back, said as a
          preview, because "this week" in August would be a small lie. */}
      {brief && (
        <div id="this-week" style={{ ...CARD, borderColor: 'var(--terracotta)', scrollMarginTop: 80 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 6 }}>
            {brief.preview
              ? `When they go back · Year ${brief.yearGroup}`
              : `This week at school · week ${brief.weekOfTerm} of term`}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink-muted)', marginBottom: 4 }}>
            {brief.subjectLabel} · {brief.strand}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            {brief.lead}
          </h2>
          {brief.parts.length > 0 && (
            <ul style={{ margin: '0 0 10px', paddingLeft: 20 }}>
              {brief.parts.map(p => (
                <li key={p} style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 3 }}>{p}</li>
              ))}
            </ul>
          )}
          {brief.second && (
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>
              Also running: <strong>{brief.second.subjectLabel}</strong>, {brief.second.lead}
            </p>
          )}
          {/* The dinner table version. A fixed frame rather than a sentence
              grafted onto DfE text, because their objectives do not survive
              being rewritten into questions and we quote, never paraphrase. */}
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.55, margin: '0 0 14px' }}>
            The dinner table version: ask them to teach YOU this one. Children love being the teacher, and teaching it back is how you find out if it stuck.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link
              href={`/dashboard/quests/manage?title=${encodeURIComponent(brief.questTitle)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
                background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 12,
                padding: '11px 15px', fontFamily: 'var(--font-display)', fontWeight: 800,
                fontSize: 'var(--text-base)', boxShadow: '0 3px 0 var(--terracotta-dark)',
              }}
            >
              ⭐ Make it a job
            </Link>
            <Link
              href="/dashboard/homework"
              style={{
                display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
                background: '#fff', color: 'var(--ink)', border: '1.5px solid var(--border)',
                borderRadius: 12, padding: '11px 15px', fontFamily: 'var(--font-display)',
                fontWeight: 800, fontSize: 'var(--text-base)',
              }}
            >
              How the school teaches it
            </Link>
          </div>
        </div>
      )}

      {/* No birthday: the ask, and nothing else. Everything on this page is
          derived from it, so offering a half page of guesses underneath would
          be the one thing this feature must never do. */}
      {v.blocked === 'no_birthday' && (
        <div style={{ ...CARD, background: 'var(--cream)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 6px' }}>
            One thing missing
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            England places a child by their age on 31 August, so their birthday is the only way to know which year group they are actually in. The month on its own is enough if you would rather not give the day.
          </p>
          <Link href="/dashboard/settings" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Add {v.childName}&rsquo;s birthday
          </Link>
        </div>
      )}

      {/* The three things you can do with a term, as peers.
          Buttons rather than links, because switching a panel is not navigation
          and a parent who taps back should leave the page rather than walk
          through three tabs to get out of it. */}
      {v.blocked === null && (
        <div role="tablist" aria-label="What they are learning" style={{
          display: 'flex', gap: 7, margin: '4px 0 16px', overflowX: 'auto',
          marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20,
          scrollbarWidth: 'none',
        }}>
          {TABS.map(t => {
            const on = tab === t.key
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.key)}
                style={{
                  flexShrink: 0, cursor: 'pointer', borderRadius: 100, padding: '10px 14px',
                  border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                  background: on ? 'var(--terracotta-lt)' : '#fff',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-base)', color: 'var(--ink)',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Coming up at school. One thing, never a list: five dates is a worry,
          one is a head start. */}
      {tab === 'ahead' && v.event && (
        <div style={{ ...CARD, borderColor: 'var(--terracotta)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 6 }}>
            Coming up {v.eventWhen ? `· ${v.eventWhen}` : ''}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {v.event.event.title}
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 10px' }}>
            {v.event.event.what}
          </p>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, fontWeight: 600, margin: 0 }}>
            {v.event.event.doThis}
          </p>
        </div>
      )}

      {/* Secondary school. Only inside the real window, and it takes the lead
          over the term list when it is live, because in that fortnight it is
          the only thing a parent is actually thinking about. */}
      {tab === 'ahead' && v.transition && (
        <div style={{ ...CARD, background: 'var(--tint-blue, #D8E8F8)', borderColor: 'transparent' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>
            Secondary school
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            {v.transition.headline}
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            {v.transition.line}
          </p>
          <Link href="/dashboard/secondary" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            The five steps
          </Link>
        </div>
      )}

      {/* The term itself. */}
      {tab === 'term' && v.subjects.map(sub => (
        <div key={sub.subject} style={CARD}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: 0, letterSpacing: '-0.02em' }}>
              {sub.label}
            </h2>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
              {sub.count} {sub.count === 1 ? 'thing' : 'things'}
            </span>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
            {sub.strands.map(st => {
              const key = `${sub.subject}:${st.strand}`
              const isOpen = Boolean(open[key])
              return (
                <div key={key} style={{ border: '1.5px solid var(--border)', borderRadius: 13, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggle(key)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                      background: isOpen ? 'var(--cream)' : '#fff', border: 'none', cursor: 'pointer',
                      padding: '13px 14px',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
                      {st.strand}
                    </span>
                    <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)' }}>
                      {st.objectives.length}
                    </span>
                    <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', color: 'var(--ink-muted)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }}>›</span>
                  </button>
                  {isOpen && (
                    <ul style={{ listStyle: 'none', margin: 0, padding: '2px 14px 14px', display: 'grid', gap: 9 }}>
                      {st.objectives.map(o => (
                        <li key={o.id} style={{ display: 'flex', gap: 9, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                          <span aria-hidden style={{ flexShrink: 0, color: 'var(--terracotta-dark)', fontWeight: 900 }}>·</span>
                          {/* The Department writes its long objectives as one
                              sentence ending "by:" and then six clauses split
                              by semicolons. Laid out, not edited: every word is
                              still theirs and still in their order. */}
                          {o.parts.length > 0 ? (
                            <span>
                              <span style={{ display: 'block', color: 'var(--ink)', fontWeight: 600 }}>{o.lead}</span>
                              {/* A rule rather than a bullet glyph, because the
                                  obvious glyph for a sub point is a dash and
                                  this product does not put dashes in front of
                                  a parent. */}
                              <span style={{ display: 'grid', gap: 6, marginTop: 7, paddingLeft: 11, borderLeft: '2px solid var(--border)' }}>
                                {o.parts.map((part, i) => (
                                  <span key={i} style={{ display: 'block' }}>{part}</span>
                                ))}
                              </span>
                            </span>
                          ) : (
                            <span>{o.objective}</span>
                          )}
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

      {/* GET AHEAD. What is coming, and the one thing to do about it.
          The printable lives INSIDE this tab rather than being the way off the
          page, which is the whole of Justin's "it seems to live on printables"
          complaint: the sheet is a tool this page offers, not the section this
          page belongs to. */}
      {tab === 'ahead' && v.blocked === null && (
        <div style={{ ...CARD, background: 'var(--cream)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 4px' }}>
            Something to practise
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            Built from the same objectives as the term list, so it is what the class is on rather than worksheets off the internet.
          </p>
          <Link href="/dashboard/printables/learning" className="btn btn-outline" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
            <span>Print a practice sheet</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      {/* Nothing dated in the diary is a real answer and worth saying, rather
          than an empty tab that reads as broken. */}
      {tab === 'ahead' && v.blocked === null && !v.event && !v.transition && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '0 0 14px' }}>
          Nothing dated coming up for {v.childName} that we know about. The sheet above is still the useful thing: it is this term&rsquo;s objectives, a week or two before the class gets to them.
        </p>
      )}

      {/* HOMEWORK. The decoder, which reads these same objectives, said as the
          thing it is for rather than as a menu item. */}
      {tab === 'homework' && v.blocked === null && (
        <div style={{ ...CARD, background: 'var(--cream)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 4px' }}>
            Make sense of what came home
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            Paste in the homework, or the bit of it nobody can follow, and it comes back in plain words with the method the school is actually using. Most of the arguments at that table are about the method rather than the maths.
          </p>
          <Link href="/dashboard/homework" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
            <span>Decode a piece of homework</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      {/* Where every line came from. Not a footnote for its own sake: the whole
          reason a parent can trust a page that tells them what school teaches
          is being able to see it is not our opinion.
          On the term tab, because that is the tab making the claim. */}
      {tab === 'term' && v.subjects.length > 0 && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.55, marginTop: 18 }}>
          Taken from the national curriculum programmes of study for England, published by the Department for Education. The wording is theirs. Which term a topic falls in is our ordering, not the school&rsquo;s, so a class may reach something sooner or later than this shows. We are adding sheets and games for these as we go.
        </p>
      )}
    </div>
  )
}
