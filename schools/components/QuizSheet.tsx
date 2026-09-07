import PrintButton from '@/components/PrintButton'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import Link from 'next/link'

// THE QUIZ SHEET, one side of A4, in the Oak pattern.
//
// Oak ships two quizzes per lesson and each one ships twice: a question
// version to photocopy and an answer version for the teacher. That is the
// whole borrow. The content is ours, the shape is theirs, and it is a good
// shape because the answer version is what makes a quiz runnable by a non
// specialist covering the lesson at ten minutes' notice.
//
// One component, two routes, two versions. The version is a query parameter
// rather than a fourth route, because the sheets must never drift apart: a
// reworded question that only lands on one of them is worse than no sheet.
//
// Our addition on top of Oak: every answer carries a teaching point, so the
// answer version tells the teacher what to DO with a wrong answer rather
// than only what the right one was. That is the difference between marking
// and teaching, and it is why the answer sheet is worth printing.
//
// Formats come from the data (migration 269) and are mixed on purpose:
// tick_one, true_false, match, fill_blank, short_answer.

export type QuizQuestion = {
  format: 'tick_one' | 'true_false' | 'match' | 'fill_blank' | 'short_answer'
  question: string
  options?: string[]
  pairs?: { left: string; right: string }[]
  answer: string
  teaching_point: string
}

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: '#666',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '14px', color: '#111', lineHeight: 1.6,
}
const rule: React.CSSProperties = { borderBottom: '1px solid #999', height: '22px' }

// A tick box, drawn rather than an input, because this sheet is filled in
// with a pencil and is never submitted anywhere.
function Box({ ticked = false }: { ticked?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '16px', height: '16px', flexShrink: 0,
      border: '1.5px solid #111', borderRadius: '4px',
      fontSize: '12px', lineHeight: 1, fontWeight: 900,
      background: ticked ? '#FEF7E0' : '#fff',
    }}>
      {ticked ? '✓' : ''}
    </span>
  )
}

// The right hand column of a match question is rotated by one so no item sits
// beside its own pair. Deterministic, so the question version a class filled
// in last term still lines up with the answer version printed today. A single
// pair cannot be scrambled and is left alone.
function rotated<T>(xs: T[]): T[] {
  return xs.length < 2 ? xs : [...xs.slice(1), xs[0]]
}

const LETTERS = 'ABCDEFGH'

function Question({ q, n, answers }: { q: QuizQuestion; n: number; answers: boolean }) {
  return (
    <div style={{ marginBottom: '16px', breakInside: 'avoid' }}>
      <p style={{ ...body, fontWeight: 700, margin: '0 0 8px' }}>
        {n}. {q.question}
      </p>

      {q.format === 'tick_one' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '14px' }}>
          {(q.options ?? []).map(o => (
            <span key={o} style={{ ...body, display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Box ticked={answers && o === q.answer} />{o}
            </span>
          ))}
        </div>
      )}

      {q.format === 'true_false' && (
        <div style={{ display: 'flex', gap: '22px', paddingLeft: '14px' }}>
          {['True', 'False'].map(o => (
            <span key={o} style={{ ...body, display: 'flex', alignItems: 'center', gap: '9px' }}>
              <Box ticked={answers && o === q.answer} />{o}
            </span>
          ))}
        </div>
      )}

      {q.format === 'match' && (
        <div style={{ paddingLeft: '14px' }}>
          {answers ? (
            // The answer version drops the scramble and prints the pairing
            // straight, because a teacher marking twenty sheets should not
            // have to solve the puzzle themselves first.
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {(q.pairs ?? []).map(p => (
                <span key={p.left} style={body}>
                  <strong>{p.left}</strong> goes with {p.right.toLowerCase()}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {(q.pairs ?? []).map((p, i) => (
                  <span key={p.left} style={{ ...body, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ ...mono, color: '#111' }}>{i + 1}</span>
                    {p.left}
                    <span style={{ borderBottom: '1px solid #999', display: 'inline-block', width: '34px' }} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {rotated(q.pairs ?? []).map((p, i) => (
                  <span key={p.right} style={{ ...body, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ ...mono, color: '#111' }}>{LETTERS[i]}</span>
                    {p.right}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(q.format === 'fill_blank' || q.format === 'short_answer') && !answers && (
        <div style={{ paddingLeft: '14px' }}>
          <div style={rule} />
          {q.format === 'short_answer' && <div style={{ ...rule, marginTop: '8px' }} />}
        </div>
      )}

      {/* Only where the answer is not already visible. On a tick one or a
          true or false the ticked box IS the answer, and restating it below
          just gives a teacher marking twenty sheets more to read past. */}
      {answers && !['match', 'tick_one', 'true_false'].includes(q.format) && (
        <p style={{ ...body, paddingLeft: '14px', margin: '6px 0 0' }}>
          <strong>Answer. </strong>{q.answer}
        </p>
      )}

      {/* Ours, not Oak's: what to do about a wrong answer, not only what the
          right one was. It is the reason a cover teacher can run this. */}
      {answers && (
        <p style={{
          ...body, fontSize: '12.5px', color: '#444', margin: '6px 0 0',
          paddingLeft: '14px', borderLeft: '2px solid #EDC35F', marginLeft: '14px',
        }}>
          {q.teaching_point}
        </p>
      )}
    </div>
  )
}

export default function QuizSheet({
  kind, moduleId, title, yearBand, questions, answers,
}: {
  kind: 'starter' | 'exit'
  moduleId: string
  title: string
  yearBand: string
  questions: QuizQuestion[]
  answers: boolean
}) {
  const name = kind === 'starter' ? 'Starter quiz' : 'Exit quiz'
  const purpose = kind === 'starter'
    ? 'What they need to know before this lesson. Run it cold, before you teach anything.'
    : 'What they know now. Run it at the end, and mark it against the answer sheet.'
  const other = answers ? `/print/${moduleId}/${kind}-quiz` : `/print/${moduleId}/${kind}-quiz?answers=1`

  return (
    <main style={{ background: '#fff', color: '#111', padding: '28px 30px', maxWidth: '820px', margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
        <PrintButton label={`Print the ${answers ? 'answers' : 'quiz'}`} />
        <Link href={other} style={{ ...mono, color: '#C99A28', textDecoration: 'none' }}>
          {answers ? 'The question version →' : 'The answer version →'}
        </Link>
      </div>

      <div style={mono}>
        {answers ? 'Teacher copy, answers' : 'Photocopy per pupil'} · {yearBand} · {name}
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px',
        letterSpacing: '-0.02em', lineHeight: 1.15, margin: '6px 0 4px',
      }}>
        {title}
      </h1>

      {answers ? (
        <p style={{ ...body, color: '#444', margin: '0 0 18px' }}>{purpose}</p>
      ) : (
        <p style={{ ...body, margin: '8px 0 18px' }}>
          Name: <span style={{ borderBottom: '1px solid #999', display: 'inline-block', width: '220px' }} />
          &nbsp;&nbsp;Date: <span style={{ borderBottom: '1px solid #999', display: 'inline-block', width: '120px' }} />
        </p>
      )}

      {questions.map((q, i) => (
        <Question key={i} q={q} n={i + 1} answers={answers} />
      ))}

      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#666', lineHeight: 1.5, marginTop: '18px' }}>
        {kind === 'starter'
          ? 'This is a readiness check, not a test of the child. Nothing here is recorded, and a class that struggles with it is telling you where to start rather than failing anything.'
          : 'This checks what the lesson taught, not what a child is worth. Nothing here is recorded and no score leaves the room.'}
      </p>

      <PrintBrandFooter />
    </main>
  )
}
