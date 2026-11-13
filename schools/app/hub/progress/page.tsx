import Link from 'next/link'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import {
  academicYear, classesIn, cleanGroup, cleanYear, forClass, JUDGEMENT_LABEL, JUDGEMENTS, quizCountsIn, quizShares, yearLabel, type Delivery, type Judgement,
} from '@gc/shared/lesson-records'
import { AREA_ORDER, AREAS, areaOf } from '@gc/shared/passport-areas'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER, positionOf } from '@gc/shared/schools-curriculum'
import { suggestedYear, yearName } from '@gc/shared/schools-progression'
import InShort from '@/components/InShort'
import PrintButton from '@/components/PrintButton'
import { asList } from '@/lib/notes'
import { readDeliveries, recordYears } from '@/lib/records'
import { db as supabase } from '@/lib/supabase/server-db'

// /hub/progress: WHERE EACH CLASS IS IN THE DIGITAL SCHEME (11 November 2026).
//
// The French scheme's author answered her head's question with three rules,
// and they carry straight across (plans/2026-11-10-lesson-run-and-records-plan.md):
//
//   1. progress is shown against a FIXED sequence, lesson by lesson
//   2. it is reported as how many are below, at and above, never as a mark
//   3. what matters is what happens next: what needs teaching again
//
// So this page is the same three things for the digital lessons, for one
// class at a time: the lessons of its key stage in order, with the date each
// was taught and the teacher's judgement of the class; the judgements added
// up; and the objectives marked "needs revisiting", which is the list to
// teach from.
//
// Nothing is typed in here. It is read from the one button on each lesson
// (schools.lesson_records) and worked out on every load. No pupil is named.
//
// Delivered and assessed are never merged. A lesson taught and not judged
// reads "not assessed", and is left out of every count of judgements.
//
// The tracker (/hub/tracker) is still this laptop's own run sheet ticks. This
// is the school's record, the same on every laptop.
//
// THREE THINGS A SUBJECT LEAD ASKED OF IT (11 November 2026, the progression
// review, amendment 5):
//   - EVERY CLASS AT ONCE. One class at a time answers a teacher. A lead wants
//     the grid: each lesson down the side, each class across, so the class that
//     is three lessons behind is a gap you can see. ?class=all.
//   - LAST YEAR. The record is kept by academic year and only this year's was
//     reachable. ?year= offers the years the school has rows in, nothing else.
//   - OUT OF THE PAGE. One spreadsheet file of the school's own rows
//     (./export), for the school that already keeps its evidence somewhere.

export const metadata = { title: 'Class progress' }
export const dynamic = 'force-dynamic'

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const bodyText: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65 }
const smallText: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55 }
const panel: React.CSSProperties = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)' }

const shortDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
const isJudgement = (v: unknown): v is Judgement => typeof v === 'string' && (JUDGEMENTS as string[]).includes(v)

export default async function ClassProgress({ searchParams }: { searchParams: Promise<{ class?: string; year?: string }> }) {
  const sp = await searchParams
  const thisYear = academicYear(new Date())
  const years = await recordYears('digital', thisYear)
  const year = cleanYear(sp.year, years) ?? thisYear
  const { school, deliveries, failed } = await readDeliveries('digital', year)
  const classes = classesIn(deliveries)
  const everyClass = sp.class === 'all' && classes.length > 1
  const asked = cleanGroup(sp.class)
  const group = everyClass ? null : asked && classes.includes(asked) ? asked : classes[0] ?? null
  const rows = forClass(deliveries, group)
  const here = (to: { class?: string; year?: string }) => {
    const q = new URLSearchParams()
    const c = to.class ?? (everyClass ? 'all' : group ?? '')
    const y = to.year ?? year
    if (c) q.set('class', c)
    if (y !== thisYear) q.set('year', y)
    const tail = q.toString()
    return tail ? `/hub/progress?${tail}` : '/hub/progress'
  }

  // The latest record of each lesson for this class: the date it was first
  // taught, and the judgement from the most recent time.
  const byLesson = new Map<string, { first: string; latest: Delivery }>()
  for (const d of rows) {
    const had = byLesson.get(d.lessonKey)
    byLesson.set(d.lessonKey, { first: had && had.first < d.deliveredOn ? had.first : d.deliveredOn, latest: d })
  }
  const stages = KEY_STAGE_ORDER.filter(ks => CURRICULUM.some(m => m.keyStage === ks && byLesson.has(m.moduleId)))
  const inScope = CURRICULUM.filter(m => stages.includes(m.keyStage))

  // EVERY CLASS: the latest record of each lesson, class by class. A lesson
  // taught to two classes together counts for both, which is what happened.
  const grid = new Map<string, Map<string, Delivery>>()
  if (everyClass) {
    for (const d of deliveries) for (const g of d.groups) {
      const row = grid.get(d.lessonKey) ?? new Map<string, Delivery>()
      row.set(g, d)
      grid.set(d.lessonKey, row)
    }
  }
  const taughtBy = (c: string) => inScope.filter(m => grid.get(m.moduleId)?.has(c)).length

  // The objectives, read once, only for the lessons that carry a mark.
  const marked = [...byLesson.values()].filter(v => Object.values(v.latest.marks).some(m => m === 'revisit')).map(v => v.latest.lessonKey)
  const iCan = new Map<string, string[]>()
  if (marked.length > 0) {
    const { data } = await supabase.from('school_lessons').select('module_id, teacher_notes').in('module_id', marked)
    for (const r of (data ?? []) as { module_id: string; teacher_notes: { i_can?: unknown } | null }[]) iCan.set(r.module_id, asList(r.teacher_notes?.i_can))
  }
  const revisit = inScope.flatMap(m => {
    const rec = byLesson.get(m.moduleId)?.latest
    if (!rec) return []
    const lines = Object.entries(rec.marks).filter(([, v]) => v === 'revisit').map(([i]) => iCan.get(m.moduleId)?.[Number(i)]).filter((t): t is string => !!t)
    const whole = rec.assessment === 'revisit'
    return lines.length > 0 || whole ? [{ m, lines, whole }] : []
  })

  const tally = (list: typeof inScope) => {
    const out = { secure: 0, developing: 0, revisit: 0, unassessed: 0, delivered: 0 }
    for (const m of list) {
      const rec = byLesson.get(m.moduleId)?.latest
      if (!rec) continue
      out.delivered += 1
      if (isJudgement(rec.assessment)) out[rec.assessment] += 1
      else out.unassessed += 1
    }
    return out
  }
  const all = tally(inScope)
  const judged = all.secure + all.developing + all.revisit
  // The two quizzes, where a teacher counted them: the latest record of each
  // lesson for this class, so a lesson taught twice is counted once.
  const quiz = quizShares([...byLesson.values()].map(v => v.latest))

  const chip = (on: boolean): React.CSSProperties => ({
    ...mono, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 var(--space-3)',
    borderRadius: 'var(--radius-tile)', textDecoration: 'none',
    border: `1.5px solid ${on ? 'var(--green-dark)' : 'var(--border)'}`,
    background: on ? 'var(--butter-lt)' : 'var(--white)', color: on ? 'var(--ink)' : 'var(--ink-muted)',
  })

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <style>{`@media print { @page { size: A4 portrait; margin: 12mm; } body { background: var(--white) !important; } .no-print { display: none !important; } }`}</style>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>← The Hub</Link>
          {deliveries.length > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <a href={`/hub/progress/export${year !== thisYear ? `?year=${year}` : ''}`} className="gc-prog-get">Download as a spreadsheet</a>
              <PrintButton label="Print this record" />
            </span>
          )}
        </div>

        <div>
          <div style={{ ...mono, color: 'var(--green-dark)', marginBottom: 'var(--space-1)' }}>Your school&apos;s record · {yearLabel(year)}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
            {everyClass ? 'Progress, every class' : group ? `Progress, ${group}` : 'Class progress'}
          </h1>
          <p style={{ ...bodyText, maxWidth: '640px', margin: 0 }}>
            {everyClass
              ? 'Every lesson down the side and every class across, so a gap is something you can see. It fills itself in from the Mark lesson delivered button, and it is the same on every laptop.'
              : 'Where this class is in the scheme, how each lesson went, and what to teach again. It fills itself in from the Mark lesson delivered button, and it is the same on every laptop.'}
          </p>
        </div>

        <InShort title="How this record works, in short" fold={deliveries.length > 0} points={[
          <>Tap <b>Mark lesson delivered</b> at the end of a lesson. That one tap is the record.</>,
          <>A judgement is <b>optional</b>: secure, developing or needs revisiting, for the class as a whole, against that lesson&apos;s own descriptors.</>,
          <>Quiz counts are optional too, and are <b>class totals</b>.</>,
          <><b>No pupil is ever named.</b> The record is about a class, and it is the same on every laptop.</>,
          <>Anything judged as needing a revisit lands on a list to <b>teach again</b>. That list is the reason to judge at all.</>,
        ]} />

        {years.length > 1 && (
          <nav aria-label="School year" className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {years.map(y => (
              <Link key={y} href={here({ year: y, class: '' })} style={chip(year === y)} aria-current={year === y ? 'true' : undefined}>{yearLabel(y)}</Link>
            ))}
          </nav>
        )}

        {classes.length > 1 && (
          <nav aria-label="Class" className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {classes.map(c => (
              <Link key={c} href={here({ class: c })} style={chip(group === c)} aria-current={group === c ? 'true' : undefined}>{c}</Link>
            ))}
            <Link href={here({ class: 'all' })} style={chip(everyClass)} aria-current={everyClass ? 'true' : undefined}>Every class</Link>
          </nav>
        )}

        {everyClass && stages.map(ks => {
          const list = CURRICULUM.filter(m => m.keyStage === ks)
          const cols = classes.filter(c => list.some(m => grid.get(m.moduleId)?.has(c)))
          if (cols.length === 0) return null
          return (
            <section key={ks} aria-labelledby={`all-${ks}`}>
              <h2 id={`all-${ks}`} style={{ ...mono, margin: '0 0 var(--space-2)' }}>{KEY_STAGE_META[ks].label} · {KEY_STAGE_META[ks].years}</h2>
              <div style={{ ...panel, padding: 0, overflowX: 'auto' }} tabIndex={0} role="region" aria-label={`${KEY_STAGE_META[ks].label}, every class`}>
                <table className="gc-prog-grid">
                  <thead>
                    <tr>
                      <th scope="col">Lesson</th>
                      {cols.map(c => <th key={c} scope="col"><Link href={here({ class: c })}>{c}</Link></th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(m => (
                      <tr key={m.moduleId}>
                        <th scope="row"><Link href={`/lesson/${m.moduleId}`}>{m.title}</Link></th>
                        {cols.map(c => {
                          const d = grid.get(m.moduleId)?.get(c)
                          const j = d && isJudgement(d.assessment) ? d.assessment : null
                          return (
                            <td key={c} data-j={d ? j ?? 'none' : undefined}>
                              {d ? <><b>{shortDate(d.deliveredOn)}</b><span>{j ? JUDGEMENT_LABEL[j] : 'Not assessed'}</span></> : <span className="gc-prog-gap">Not taught</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row">Delivered</th>
                      {cols.map(c => <td key={c}><b>{list.filter(m => grid.get(m.moduleId)?.has(c)).length} of {list.length}</b></td>)}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>
          )
        })}
        {everyClass && (
          <p style={{ ...smallText, margin: 0 }}>
            {classes.map(c => `${c}: ${taughtBy(c)} delivered`).join(' · ')}. Pick a class above for what it needs teaching again.
          </p>
        )}

        {!school && <section style={panel}><p style={{ ...bodyText, margin: 0 }}>Your school&apos;s record opens with your school code.</p></section>}
        {failed && <section style={panel}><p style={{ ...bodyText, margin: 0, color: 'var(--ink)' }}>The record could not be read just now. Nothing is lost. Try again in a minute.</p></section>}

        {school && !failed && deliveries.length === 0 && (
          <section style={{ ...panel, background: 'var(--warm)' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>Nothing recorded yet this year</h2>
            <p style={{ ...bodyText, margin: '0 0 var(--space-3)' }}>
              Teach a lesson, then press Mark lesson delivered at the foot of its page or its run sheet. That one tap is all this page needs.
            </p>
            <Link href="/curriculum" className="btn btn-gold">Pick a lesson</Link>
          </section>
        )}

        {!everyClass && all.delivered > 0 && (
          <section aria-label="How the lessons went" style={panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0 }}>
                {all.delivered} of {inScope.length} lessons delivered
              </h2>
              <span style={smallText}>{judged} judged · {all.unassessed} not assessed</span>
            </div>
            {judged > 0 ? (
              <>
                <div className="gc-prog-bar" role="img" aria-label={`${all.secure} lessons secure, ${all.developing} developing, ${all.revisit} needing revisiting`}>
                  {all.revisit > 0 && <span data-j="revisit" style={{ flexGrow: all.revisit }}>{all.revisit}</span>}
                  {all.developing > 0 && <span data-j="developing" style={{ flexGrow: all.developing }}>{all.developing}</span>}
                  {all.secure > 0 && <span data-j="secure" style={{ flexGrow: all.secure }}>{all.secure}</span>}
                </div>
                <div className="gc-prog-key" aria-hidden>
                  {[...JUDGEMENTS].reverse().map(j => <span key={j}><i data-j={j} /> {JUDGEMENT_LABEL[j]}</span>)}
                </div>
              </>
            ) : (
              <p style={{ ...smallText, margin: 'var(--space-2) 0 0' }}>No lesson has been judged yet. A judgement is optional, and one tap after marking a lesson delivered.</p>
            )}
          </section>
        )}

        {!everyClass && quiz.lessons > 0 && (
          <section aria-labelledby="quizzes" style={panel}>
            <h2 id="quizzes" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-1)' }}>What the class arrived with, and left with</h2>
            <p style={{ ...smallText, margin: '0 0 var(--space-3)' }}>
              From the quiz counts on {quiz.lessons} {quiz.lessons === 1 ? 'lesson' : 'lessons'}. The starter looks back at earlier lessons and the exit quiz is about the lesson
              just taught, so these are two different quizzes and not a gain score.
            </p>
            <div className="gc-prog-two">
              <div>
                <b>{quiz.starter === null ? 'Not counted' : `${quiz.starter}%`}</b>
                <span>got most of the starter quiz right: the earlier learning was still there</span>
              </div>
              <div>
                <b>{quiz.exit === null ? 'Not counted' : `${quiz.exit}%`}</b>
                <span>got most of the exit quiz right: the lesson landed</span>
              </div>
            </div>
          </section>
        )}

        {!everyClass && revisit.length > 0 && (
          <section aria-labelledby="revisit" style={{ ...panel, borderLeft: '4px solid var(--coral-dark)' }}>
            <h2 id="revisit" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 var(--space-1)' }}>To teach again</h2>
            <p style={{ ...smallText, margin: '0 0 var(--space-3)' }}>What this class was judged to need again. This list is the reason to record a judgement at all.</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {revisit.map(({ m, lines, whole }) => (
                <li key={m.moduleId}>
                  <Link href={`/lesson/${m.moduleId}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{m.title}</Link>
                  {whole && lines.length === 0 && <span style={{ ...smallText, display: 'block' }}>The lesson as a whole.</span>}
                  {lines.length > 0 && (
                    <ul style={{ ...smallText, color: 'var(--ink)', margin: 'var(--space-1) 0 0', paddingLeft: 'var(--space-4)' }}>
                      {lines.map(t => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {!everyClass && stages.map(ks => {
          const list = CURRICULUM.filter(m => m.keyStage === ks)
          const t = tally(list)
          return (
            <section key={ks} aria-labelledby={`ks-${ks}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', margin: '0 0 var(--space-2)' }}>
                <h2 id={`ks-${ks}`} style={{ ...mono, margin: 0 }}>{KEY_STAGE_META[ks].label} · {KEY_STAGE_META[ks].years}</h2>
                <span style={{ ...smallText, color: 'var(--ink)', fontWeight: 700 }}>{t.delivered} of {list.length} delivered</span>
              </div>
              <ol className="gc-prog-list">
                {list.map(m => {
                  const rec = byLesson.get(m.moduleId)
                  const j = rec && isJudgement(rec.latest.assessment) ? rec.latest.assessment : null
                  const q = rec ? quizCountsIn(rec.latest.marks) : null
                  const counted = q ? [q.starter !== null ? `starter ${q.starter} of ${q.pupils}` : '', q.exit !== null ? `exit ${q.exit} of ${q.pupils}` : ''].filter(Boolean).join(', ') : ''
                  return (
                    <li key={m.moduleId} data-on={rec ? '' : undefined}>
                      <span aria-hidden className="gc-prog-n">{rec ? '✓' : positionOf(m.moduleId)?.index ?? ''}</span>
                      <span style={{ flex: '1 1 auto', minWidth: 0 }}>
                        <Link href={`/lesson/${m.moduleId}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: rec ? 'var(--ink)' : 'var(--ink-muted)', textDecoration: 'none' }}>{m.title}</Link>
                        <span style={{ ...smallText, display: 'block' }}>{rec ? `Taught ${shortDate(rec.first)}${counted ? ` · ${counted}` : ''}` : `Not taught yet${suggestedYear(m.moduleId) === null ? '' : ` · suggested for ${yearName(suggestedYear(m.moduleId)!)}`}`}</span>
                      </span>
                      {rec && <span className="gc-prog-j" data-j={j ?? 'none'}>{j ? JUDGEMENT_LABEL[j] : 'Not assessed'}</span>}
                    </li>
                  )
                })}
              </ol>
            </section>
          )
        })}

        {!everyClass && all.delivered > 0 && (
          <section aria-labelledby="areas">
            <h2 id="areas" style={{ ...mono, margin: '0 0 var(--space-2)' }}>By the four things the passport records</h2>
            <div style={{ ...panel, padding: 0, overflowX: 'auto' }}>
              <table className="gc-prog-areas">
                <thead><tr><th scope="col">Area</th><th scope="col">Delivered</th>{JUDGEMENTS.map(j => <th key={j} scope="col">{JUDGEMENT_LABEL[j]}</th>)}</tr></thead>
                <tbody>
                  {AREA_ORDER.map(a => {
                    const list = inScope.filter(m => areaOf(m.moduleId) === a)
                    if (list.length === 0) return null
                    const t = tally(list)
                    return (
                      <tr key={a}>
                        <th scope="row">{AREAS[a].name}</th>
                        <td>{t.delivered} of {list.length}</td>
                        {JUDGEMENTS.map(j => <td key={j}>{t[j] > 0 ? t[j] : ''}</td>)}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!everyClass && group && all.delivered > 0 && (
          <p className="no-print" style={{ ...smallText, margin: 0, color: 'var(--ink)' }}>
            End of term?{' '}
            <Link href={`/print/look-back?class=${encodeURIComponent(group)}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Print a look back quiz for {group}</Link>,
            drawn from the lessons above, with one more question on anything judged developing or needing revisiting.
          </p>
        )}

        {deliveries.length > 0 && (
          <p style={{ ...smallText, margin: 0 }}>
            This records lessons delivered and the teacher&apos;s own judgement of the class. It is not a measure of pupil
            outcomes, and no pupil is named. A lesson taught and not judged is shown as not assessed and is left out of every count.
          </p>
        )}
      </div>

      <style>{`
        .gc-prog-bar { display: flex; height: 36px; border-radius: var(--radius-tile); overflow: hidden; border: 1px solid var(--border); margin-top: var(--space-3); }
        .gc-prog-bar span { display: inline-flex; align-items: center; justify-content: center; min-width: 36px; font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); color: var(--ink); }
        .gc-prog-bar span[data-j="secure"], .gc-prog-key i[data-j="secure"] { background: var(--terracotta); }
        .gc-prog-bar span[data-j="developing"], .gc-prog-key i[data-j="developing"] { background: var(--butter-lt); }
        .gc-prog-bar span[data-j="revisit"], .gc-prog-key i[data-j="revisit"] { background: var(--warm); }
        .gc-prog-key { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-2); font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); }
        .gc-prog-key span { display: inline-flex; align-items: center; gap: var(--space-2); }
        .gc-prog-key i { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--border); display: inline-block; }
        .gc-prog-list { list-style: none; margin: 0; padding: 0; background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); overflow: hidden; }
        .gc-prog-list > li { display: flex; align-items: center; gap: var(--space-3); min-height: 60px; padding: var(--space-2) var(--space-4); }
        .gc-prog-list > li + li { border-top: 1px solid var(--border); }
        .gc-prog-n { flex: none; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 900; font-size: var(--text-sm); color: var(--ink-muted); background: var(--warm); border: 1px solid var(--border); }
        .gc-prog-list > li[data-on] .gc-prog-n { background: var(--green-dark); border-color: var(--green-dark); color: var(--white); }
        .gc-prog-j { flex: none; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: var(--space-1) var(--space-2); border-radius: var(--radius-tile); border: 1px solid var(--border); color: var(--ink); white-space: nowrap; }
        .gc-prog-j[data-j="secure"] { background: var(--terracotta); border-color: var(--terracotta); }
        .gc-prog-j[data-j="developing"] { background: var(--butter-lt); }
        .gc-prog-j[data-j="revisit"] { background: var(--warm); border-color: var(--coral-dark); }
        .gc-prog-j[data-j="none"] { color: var(--ink-muted); border-style: dashed; }
        .gc-prog-areas { border-collapse: collapse; width: 100%; min-width: 520px; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); }
        .gc-prog-areas th, .gc-prog-areas td { padding: var(--space-2) var(--space-3); border-top: 1px solid var(--border); text-align: left; font-weight: 400; }
        .gc-prog-areas thead th { border-top: 0; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); }
        .gc-prog-areas tbody th { font-weight: 700; }
        .gc-prog-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
        .gc-prog-two > div { background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius-tile); padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-1); }
        .gc-prog-two b { font-family: var(--font-display); font-weight: 900; font-size: var(--text-2xl); color: var(--ink); line-height: 1.1; }
        .gc-prog-two span { font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink-muted); line-height: 1.5; }
        @media (max-width: 560px) { .gc-prog-two { grid-template-columns: minmax(0, 1fr); } }
        .gc-prog-get { font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--terracotta-dark); text-underline-offset: 3px; min-height: 44px; display: inline-flex; align-items: center; }
        .gc-prog-grid { border-collapse: collapse; width: 100%; font-family: var(--font-body); font-size: var(--text-sm); color: var(--ink); }
        .gc-prog-grid th, .gc-prog-grid td { padding: var(--space-2) var(--space-3); border-top: 1px solid var(--border); border-left: 1px solid var(--border); text-align: left; vertical-align: top; font-weight: 400; }
        .gc-prog-grid th:first-child { border-left: 0; position: sticky; left: 0; background: var(--white); min-width: 180px; max-width: 280px; font-weight: 700; }
        .gc-prog-grid thead th { border-top: 0; font-family: var(--font-mono); font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-muted); white-space: nowrap; }
        .gc-prog-grid a { color: var(--ink); text-decoration: none; }
        .gc-prog-grid a:hover, .gc-prog-grid a:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
        .gc-prog-grid td { min-width: 104px; }
        .gc-prog-grid td b, .gc-prog-grid td span { display: block; }
        .gc-prog-grid td span { font-size: var(--text-xs); color: var(--ink-muted); }
        .gc-prog-grid td[data-j="secure"] { background: var(--terracotta); }
        .gc-prog-grid td[data-j="secure"] span { color: var(--ink); }
        .gc-prog-grid td[data-j="developing"] { background: var(--butter-lt); }
        .gc-prog-grid td[data-j="revisit"] { background: var(--warm); box-shadow: inset 4px 0 0 var(--coral-dark); }
        .gc-prog-grid td[data-j="revisit"] span { color: var(--ink); font-weight: 700; }
        .gc-prog-grid tfoot th, .gc-prog-grid tfoot td { background: var(--cream); }
        @media (max-width: 560px) { .gc-prog-list > li { padding: var(--space-2) var(--space-3); flex-wrap: wrap; } .gc-prog-j { margin-left: calc(32px + var(--space-3)); } }
        @media print { .gc-prog-list > li, section { break-inside: avoid; } .gc-prog-bar span, .gc-prog-n, .gc-prog-j, .gc-prog-grid td { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      `}</style>
    </main>
  )
}
