import Link from 'next/link'
import { PAGE } from '@gc/shared/page-scale'
import {
  academicYear, classesIn, cleanGroup, deliveredLessons, forClass, frLessonKey, latestLevels, shareAtFourOrAbove,
} from '@gc/shared/lesson-records'
import PrintButton from '@/components/PrintButton'
import { eyebrow } from '@/components/ui'
import { assessedCodes, FRENCH_UNITS, FRENCH_YEARS, SKILL_LABEL, soloName, teachingLessons } from '@/lib/languages/french'
import { readDeliveries } from '@/lib/records'
import { body, card, langEyebrow, small } from '../_ui'

// /languages/fr/progress: WHERE EACH CLASS IS (10 November 2026).
//
// The question a head asked: how do we record progress, and how children are
// learning against a fixed progression? The scheme's progression is fixed:
// six half terms a year, six lessons each, three or four national curriculum
// statements assessed per half term. So progress is two things, and this page
// shows both for a class:
//
//   how far through  the lessons delivered in each half term, in order
//   how well         for each statement, how many pupils are at each level,
//                    and the scheme's own headline: the share at SOLO 4 or above
//
// Nothing is typed in here. It is read from what teachers recorded with the
// one button on each lesson (schools.lesson_records), worked out on every
// load, so a lesson marked this morning is on the head's printout this
// afternoon. No pupil is named anywhere: a level is a count.
//
// Delivered and assessed are never merged. A statement nobody has counted
// says "not assessed yet", and no percentage is shown for it.

export const metadata = { title: 'French: progress' }
export const dynamic = 'force-dynamic'

const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

export default async function FrenchProgress({ searchParams }: { searchParams: Promise<{ class?: string }> }) {
  const year = academicYear(new Date())
  const { school, deliveries, failed } = await readDeliveries('fr', year)
  const classes = classesIn(deliveries)
  const asked = cleanGroup((await searchParams).class)
  // One class at a time. Progress through a fixed sequence is a fact about a
  // class, and a page that merged 3A with 4B would describe no real room.
  const group = asked && classes.includes(asked) ? asked : classes[0] ?? null
  const rows = forClass(deliveries, group)
  const done = deliveredLessons(rows)
  const chip = (on: boolean): React.CSSProperties => ({
    ...eyebrow, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 var(--space-3)',
    borderRadius: 'var(--radius-tile)', textDecoration: 'none',
    border: `1.5px solid ${on ? 'var(--terracotta-dark)' : 'var(--border)'}`,
    background: on ? 'var(--stage-1)' : 'var(--white)', color: on ? 'var(--ink)' : 'var(--ink-muted)',
  })
  // Only the years a class has started, unless nothing is recorded at all.
  const started = (y: number) => FRENCH_UNITS.some(u => u.year === y && teachingLessons(u).some(l => done.has(frLessonKey(u.key, l.n))))
  const years = FRENCH_YEARS.filter(started)

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
          <Link href="/languages/fr/plan" style={{ ...eyebrow, color: 'var(--ink-muted)', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>‹ Plan and assess</Link>
          {deliveries.length > 0 && <PrintButton label="Print for the head" />}
        </div>
        <p style={{ ...langEyebrow, marginBottom: 'var(--space-2)' }}>KS2 French · {year.replace('-', ' to ')}</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          {group ? `Progress, ${group}` : 'Progress'}
        </h1>
        <p style={{ ...body, maxWidth: '640px' }}>
          How far this class is through the scheme, and how pupils are doing against each statement. It fills
          itself in from the lessons marked as delivered.
        </p>
      </div>

      {classes.length > 1 && (
        <nav aria-label="Class" className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {classes.map(c => (
            <Link key={c} href={`/languages/fr/progress?class=${encodeURIComponent(c)}`} style={chip(group === c)} aria-current={group === c ? 'true' : undefined}>{c}</Link>
          ))}
        </nav>
      )}

      {!school && (
        <section style={card}><p style={{ ...body, margin: 0 }}>Your school&apos;s record opens with your languages code.</p></section>
      )}
      {failed && (
        <section style={card}><p style={{ ...body, margin: 0, color: 'var(--ink)' }}>The record could not be read just now. Nothing is lost. Try again in a minute.</p></section>
      )}

      {school && !failed && deliveries.length === 0 && (
        <section style={{ ...card, background: 'var(--warm)', boxShadow: 'none' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>Nothing recorded yet this year</h2>
          <p style={{ ...body, margin: '0 0 var(--space-3)' }}>
            Open a lesson, teach it, and press Mark lesson delivered at the end. That one tap is all this page needs.
          </p>
          <Link href="/languages/fr" className="btn btn-gold">Pick a lesson</Link>
        </section>
      )}

      {years.map(y => (
        <section key={y} aria-labelledby={`y${y}`}>
          <h2 id={`y${y}`} style={{ ...eyebrow, margin: 'var(--space-2) 0 var(--space-2)' }}>Year {y}</h2>
          <ol className="gc-fr-prog">
            {FRENCH_UNITS.filter(u => u.year === y).map(u => {
              const lessons = teachingLessons(u)
              const got = lessons.filter(l => done.has(frLessonKey(u.key, l.n)))
              const codes = assessedCodes(u)
              const begun = got.length > 0
              return (
                <li key={u.key} data-begun={begun || undefined}>
                  <div className="gc-fr-prog-head">
                    <div style={{ minWidth: 0 }}>
                      <span style={{ ...eyebrow, display: 'block' }}>Half term {u.ht}</span>
                      {u.ready
                        ? <Link href={`/languages/fr/${u.key}`} lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{u.fr}</Link>
                        : <span lang="fr" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>{u.fr}</span>}
                    </div>
                    <span style={{ ...small, color: begun ? 'var(--ink)' : 'var(--ink-muted)', fontWeight: begun ? 700 : 400, whiteSpace: 'nowrap' }}>
                      {!u.ready ? 'Being written' : lessons.length === 0 ? '' : begun ? `${got.length} of ${lessons.length} delivered` : 'Not started'}
                    </span>
                  </div>

                  {u.ready && lessons.length > 0 && (
                    <ol className="gc-fr-prog-dots" aria-label={`Lessons delivered in ${u.fr}`}>
                      {lessons.map(l => {
                        const on = done.get(frLessonKey(u.key, l.n))
                        return (
                          <li key={l.n} data-on={on ? '' : undefined}>
                            <Link href={`/languages/fr/${u.key}/${l.n}`} aria-label={`Lesson ${l.n}, ${l.title}: ${on ? `delivered ${shortDate(on)}` : 'not delivered yet'}`}>
                              <span aria-hidden className="gc-fr-prog-n">{on ? '✓' : l.n}</span>
                              <span aria-hidden className="gc-fr-prog-when">{on ? shortDate(on) : `Lesson ${l.n}`}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ol>
                  )}

                  {begun && codes.length > 0 && (
                    <ul className="gc-fr-prog-codes">
                      {codes.map(c => {
                        const latest = latestLevels(rows, u.key, c.code)
                        const share = latest ? shareAtFourOrAbove(latest.levels) : null
                        const total = latest ? latest.levels.s3 + latest.levels.s4 + latest.levels.s5 : 0
                        return (
                          <li key={c.code}>
                            <div style={{ minWidth: 0 }}>
                              <span style={{ ...langEyebrow, display: 'block' }}>{c.code} · {SKILL_LABEL[c.code[0]] ?? 'Statement'}</span>
                              <span style={{ ...small, color: 'var(--ink)' }}>{c.pupil}</span>
                            </div>
                            {latest && share !== null ? (
                              <div className="gc-fr-prog-level">
                                <div className="gc-fr-prog-bar" role="img" aria-label={`${latest.levels.s3} pupils at ${soloName(3)}, ${latest.levels.s4} at ${soloName(4)}, ${latest.levels.s5} at ${soloName(5)}`}>
                                  {latest.levels.s3 > 0 && <span data-l="3" style={{ flexGrow: latest.levels.s3 }}>{latest.levels.s3}</span>}
                                  {latest.levels.s4 > 0 && <span data-l="4" style={{ flexGrow: latest.levels.s4 }}>{latest.levels.s4}</span>}
                                  {latest.levels.s5 > 0 && <span data-l="5" style={{ flexGrow: latest.levels.s5 }}>{latest.levels.s5}</span>}
                                </div>
                                <span style={{ ...small, color: 'var(--ink)' }}><b>{share}%</b> at SOLO 4 or above · {total} pupils · {shortDate(latest.on)}</span>
                              </div>
                            ) : (
                              <span style={{ ...small }}>Not assessed yet</span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      {deliveries.length > 0 && (
        <>
          <div className="gc-fr-prog-key" aria-hidden>
            <span><i data-l="3" /> {soloName(3)}</span>
            <span><i data-l="4" /> {soloName(4)}</span>
            <span><i data-l="5" /> {soloName(5)}</span>
          </div>
          <p style={{ ...small, margin: 0 }}>
            This records the lessons delivered and the teacher&apos;s own count of pupils at each level, taken from the
            What I can do sheet. No pupil is named, so each child&apos;s own level stays on the sheet in their book,
            which is what a report to parents is written from. SOLO 3, 4 and 5 are this scheme&apos;s own levels;
            there is no national test in primary languages.
          </p>
        </>
      )}

      <style>{`
        .gc-fr-prog { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-2); }
        .gc-fr-prog > li { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); padding: var(--space-3) var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
        .gc-fr-prog > li:not([data-begun]) { background: transparent; border-style: dashed; }
        .gc-fr-prog-head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--space-3); flex-wrap: wrap; }
        .gc-fr-prog-dots { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: var(--space-2); }
        .gc-fr-prog-dots a { display: flex; flex-direction: column; align-items: center; gap: var(--space-1); min-height: 60px; padding: var(--space-1) 0; text-decoration: none; border-radius: var(--radius-tile); }
        .gc-fr-prog-dots a:focus-visible { outline: 3px solid var(--terracotta); outline-offset: 2px; }
        .gc-fr-prog-n { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); color: var(--ink-muted); background: var(--warm); border: 1px solid var(--border); }
        .gc-fr-prog-dots li[data-on] .gc-fr-prog-n { background: var(--terracotta); border-color: var(--terracotta); color: var(--ink); }
        .gc-fr-prog-when { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); white-space: nowrap; }
        .gc-fr-prog-dots li[data-on] .gc-fr-prog-when { color: var(--ink); font-weight: 600; }
        .gc-fr-prog-codes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .gc-fr-prog-codes > li { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--space-4); align-items: center; padding: var(--space-3) 0; border-top: 1px solid var(--border); }
        .gc-fr-prog-level { display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
        .gc-fr-prog-bar { display: flex; height: 32px; border-radius: var(--radius-tile); overflow: hidden; border: 1px solid var(--border); }
        .gc-fr-prog-bar span { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); color: var(--ink); }
        .gc-fr-prog-bar span[data-l="3"], .gc-fr-prog-key i[data-l="3"] { background: var(--warm); }
        .gc-fr-prog-bar span[data-l="4"], .gc-fr-prog-key i[data-l="4"] { background: var(--butter-lt); }
        .gc-fr-prog-bar span[data-l="5"], .gc-fr-prog-key i[data-l="5"] { background: var(--terracotta); }
        .gc-fr-prog-key { display: flex; flex-wrap: wrap; gap: var(--space-3); font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); }
        .gc-fr-prog-key span { display: inline-flex; align-items: center; gap: var(--space-2); }
        .gc-fr-prog-key i { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--border); display: inline-block; }
        @media (max-width: 640px) {
          .gc-fr-prog > li { padding: var(--space-3); }
          .gc-fr-prog-dots { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .gc-fr-prog-codes > li { grid-template-columns: 1fr; gap: var(--space-2); }
        }
        @media print { .gc-fr-prog > li { break-inside: avoid; } .gc-fr-prog-bar span, .gc-fr-prog-n { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      `}</style>
    </div>
  )
}
