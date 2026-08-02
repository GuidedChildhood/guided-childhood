'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { YearView } from '@/lib/learning/year-view'

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

const CARD: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18,
  padding: '18px', marginBottom: 14,
}

export default function LearningYear({ views, blurbs }: { views: YearView[]; blurbs: string[] }) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const v = views[active]
  const blurb = blurbs[active]

  const toggle = (key: string) => setOpen(o => ({ ...o, [key]: !o[key] }))

  return (
    <div style={{ maxWidth: 660, margin: '0 auto', padding: '22px 20px 60px' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Home
      </Link>

      <p className="eyebrow" style={{ marginBottom: 4 }}>At school</p>
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

      {/* Coming up at school. One thing, never a list: five dates is a worry,
          one is a head start. */}
      {v.event && (
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
      {v.transition && (
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
      {v.subjects.map(sub => (
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

      {/* Where to go with it. The decoder and the sheet both read these same
          objectives, and the sheet in particular was reachable only by typing
          the URL, which is why nobody had ever seen it. */}
      {v.blocked === null && (
        <div style={{ ...CARD, background: 'var(--cream)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', margin: '0 0 4px' }}>
            Do something with it
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
            Both of these read the same list you just scrolled.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            <Link href="/dashboard/homework" className="btn btn-outline" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
              <span>Decode a piece of homework</span>
              <span aria-hidden>→</span>
            </Link>
            <Link href="/dashboard/printables/learning" className="btn btn-outline" style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
              <span>Print a practice sheet</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Where every line came from. Not a footnote for its own sake: the whole
          reason a parent can trust a page that tells them what school teaches
          is being able to see it is not our opinion. */}
      {v.subjects.length > 0 && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.55, marginTop: 18 }}>
          Taken from the national curriculum programmes of study for England, published by the Department for Education. The wording is theirs. Which term a topic falls in is our ordering, not the school&rsquo;s, so a class may reach something sooner or later than this shows.
        </p>
      )}
    </div>
  )
}
