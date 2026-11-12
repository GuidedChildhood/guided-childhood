import Link from 'next/link'
import QuizSheet, { type QuizQuestion } from '@/components/QuizSheet'
import { quizQuestions, type QuizBank } from '@/lib/quiz'
import { readDeliveries } from '@/lib/records'
import { db as supabase } from '@/lib/supabase/server-db'
import { academicYear, classesIn, cleanGroup, forClass, yearLabel, type Delivery } from '@gc/shared/lesson-records'
import { CURRICULUM, KEY_STAGE_ORDER } from '@gc/shared/schools-curriculum'
import { lessonsForYear, yearName, YEARS_OF } from '@gc/shared/schools-progression'

// /print/look-back: THE LOOK BACK QUIZ (11 November 2026, the progression
// review, amendment 7).
//
// Every lesson ends on an exit quiz and is then never asked about again,
// which is the opposite of what makes learning stay. This is the quiz for the
// end of a term: questions the scheme already has, drawn from the lessons a
// class has ALREADY been taught, on one sheet, with the answer copy naming the
// lesson each came from.
//
// NOTHING IS WRITTEN FOR IT. Every question, answer and teaching point is an
// exit quiz question from the lesson row, word for word. So it cannot ask
// about something a lesson did not teach, and it changes when a lesson does.
//
// TWO WAYS IN, and the first is the better one:
//   ?class=6B   the lessons this school has recorded as delivered to 6B this
//               year. A lesson the class was judged to need again, or still
//               developing, gets one more question than the rest.
//   ?y=4        the lessons suggested for Year 4, for a school with no record
//               yet. The page says which lessons it assumed.
//
// The pick is steady: the same class and the same record give the same sheet,
// so the question copy and the answer copy can never disagree.

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false }, title: 'Look back quiz' }

const MAX = 12

type Row = { module_id: string; title: string; key_stage: string; character_cast: string | null; teacher_notes: { exit_quiz?: QuizBank } | null }

// `want` questions spread evenly through a lesson's bank, first to last.
function spread(bank: QuizQuestion[], want: number): QuizQuestion[] {
  const n = Math.min(want, bank.length)
  return Array.from({ length: n }, (_, k) => bank[Math.floor((k * bank.length) / n)])
}

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const chip = (on: boolean): React.CSSProperties => ({
  ...mono, display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 var(--space-3)', borderRadius: 'var(--radius-tile)', textDecoration: 'none',
  border: `1.5px solid ${on ? 'var(--green-dark)' : 'var(--border)'}`, background: on ? 'var(--butter-lt)' : 'var(--white)', color: on ? 'var(--ink)' : 'var(--ink-muted)',
})

export default async function LookBack({ searchParams }: { searchParams: Promise<{ class?: string; y?: string; answers?: string }> }) {
  const sp = await searchParams
  const answers = sp.answers !== undefined
  const year = academicYear(new Date())
  const { deliveries } = await readDeliveries('digital', year)
  const classes = classesIn(deliveries)
  const asked = cleanGroup(sp.class)
  const yearGroups = KEY_STAGE_ORDER.flatMap(ks => YEARS_OF[ks])
  const y = /^\d{1,2}$/.test(sp.y ?? '') && yearGroups.includes(Number(sp.y)) ? Number(sp.y) : null
  const group = asked && classes.includes(asked) ? asked : y === null ? classes[0] ?? null : null

  // Which lessons, in the scheme's own order, and how each one went.
  const latest = new Map<string, Delivery>()
  if (group) for (const d of forClass(deliveries, group)) latest.set(d.lessonKey, d)
  const lessons = group ? CURRICULUM.filter(m => latest.has(m.moduleId)) : y !== null ? lessonsForYear(y) : []
  const base = lessons.length <= 3 ? 3 : lessons.length <= 5 ? 2 : 1

  let questions: QuizQuestion[] = []
  let keyStage: string | null = null
  let cast: string | null = null
  if (lessons.length > 0) {
    const { data } = await supabase.from('school_lessons')
      .select('module_id, title, key_stage, character_cast, teacher_notes').in('module_id', lessons.map(m => m.moduleId))
    const rows = new Map(((data ?? []) as Row[]).map(r => [r.module_id, r]))
    for (const m of lessons) {
      const r = rows.get(m.moduleId)
      if (!r) continue
      keyStage ??= r.key_stage; cast ??= r.character_cast
      const went = latest.get(m.moduleId)?.assessment
      const want = base + (went === 'revisit' || went === 'developing' ? 1 : 0)
      questions.push(...spread(quizQuestions(r.teacher_notes?.exit_quiz), want).map(q => ({ ...q, source: r.title })))
    }
    questions = questions.slice(0, MAX)
  }

  const who = group ?? (y !== null ? yearName(y) : '')
  const query = group ? `class=${encodeURIComponent(group)}` : y !== null ? `y=${y}` : ''
  const other = `/print/look-back?${query}${answers ? '' : '&answers=1'}`

  return (
    <>
      <div className="no-print" style={{ maxWidth: '740px', margin: '0 auto', padding: 'var(--space-4) var(--space-2) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Link href="/hub" style={{ ...mono, textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>← The Hub</Link>
        {classes.length > 0 && (
          <nav aria-label="Class" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span style={mono}>What a class has been taught</span>
            {classes.map(c => <Link key={c} href={`/print/look-back?class=${encodeURIComponent(c)}`} style={chip(group === c)} aria-current={group === c ? 'true' : undefined}>{c}</Link>)}
          </nav>
        )}
        <nav aria-label="Year group" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'center' }}>
          <span style={mono}>{classes.length > 0 ? 'Or a year group, as suggested' : 'Pick a year group'}</span>
          {yearGroups.map(n => <Link key={n} href={`/print/look-back?y=${n}`} style={chip(y === n)} aria-current={y === n ? 'true' : undefined}>{n === 0 ? 'R' : n}</Link>)}
        </nav>
        {lessons.length > 0 && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55, margin: 0 }}>
            {group
              ? `Drawn from the ${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'} recorded as delivered to ${group} in ${yearLabel(year)}: `
              : `Drawn from the ${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'} suggested for ${who}. Record your lessons and this follows what the class has really had: `}
            {lessons.map(m => m.title).join(', ')}.
          </p>
        )}
      </div>

      {questions.length > 0 ? (
        <QuizSheet
          kind="lookback"
          moduleId=""
          otherHref={other}
          title={`Look back, ${who}`}
          yearBand={group ? yearLabel(year) : 'Suggested lessons'}
          keyStage={keyStage}
          characterCast={cast}
          questions={answers ? questions : questions.map(q => ({ ...q, source: undefined }))}
          answers={answers}
        />
      ) : (
        <main style={{ maxWidth: '740px', margin: '0 auto', padding: 'var(--space-4) var(--space-2) var(--space-6)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>The look back quiz</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0, maxWidth: '620px' }}>
            One sheet of questions from the lessons a class has already been taught, for the end of a term. Pick a
            year group above, or mark a lesson delivered and the quiz will follow what your class has really had.
          </p>
        </main>
      )}
    </>
  )
}
