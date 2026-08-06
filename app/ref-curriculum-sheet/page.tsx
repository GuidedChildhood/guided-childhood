import CurriculumSheet, { type CurriculumTask } from '@/components/printables/CurriculumSheet'
import { groupByStrand, TASKS_PER_SHEET } from '@/lib/printables/curriculum-sheets'

// Layout fixture for the toolkit sheet, the printable built for children who
// have outgrown colouring in.
//
// The objectives below are the REAL Year 6 maths ones, copied from
// curriculum_objectives, longest strand first. They are here rather than
// fetched so the page renders with no database and no login, and so the fixture
// shows the genuine line lengths: "multiply multi digit numbers up to 4 digits
// by a two digit whole number using the formal written method of long
// multiplication" is what actually has to fit in a task box, not a convenient
// short one.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const YEAR_6_MATHS: CurriculumTask[] = [
  { id: '1', strand: 'Fractions (including decimals and percentages)', objective: 'use common factors to simplify fractions; use common multiples to express fractions in the same denomination' },
  { id: '2', strand: 'Fractions (including decimals and percentages)', objective: 'compare and order fractions, including fractions greater than 1' },
  { id: '3', strand: 'Fractions (including decimals and percentages)', objective: 'add and subtract fractions with different denominators and mixed numbers, using the concept of equivalent fractions' },
  { id: '4', strand: 'Fractions (including decimals and percentages)', objective: 'multiply simple pairs of proper fractions, writing the answer in its simplest form' },
  { id: '5', strand: 'Fractions (including decimals and percentages)', objective: 'divide proper fractions by whole numbers' },
  { id: '6', strand: 'Fractions (including decimals and percentages)', objective: 'associate a fraction with division and calculate decimal fraction equivalents for a simple fraction' },
  // A second strand, so the fixture also proves the grouping rather than
  // just the layout.
  { id: '7', strand: 'Algebra', objective: 'use simple formulae' },
  { id: '8', strand: 'Algebra', objective: 'generate and describe linear number sequences' },
  { id: '9', strand: 'Algebra', objective: 'express missing number problems algebraically' },
]

export default function RefCurriculumSheet() {
  const picks = groupByStrand(YEAR_6_MATHS)

  return (
    <main className="cs-page" style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 12px 60px' }}>
      {/* The wrapper's own padding is screen furniture. Left in place for print
          it adds to every sheet and tips 297mm over onto a second side. */}
      <style>{`@media print { .cs-page { padding: 0 !important; background: #fff !important; min-height: 0 !important } }`}</style>

      <div className="cs-noprint" style={{ maxWidth: '210mm', margin: '0 auto 20px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
        }}>
          Reference
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
          color: 'var(--ink)', margin: '4px 0 6px',
        }}>
          The toolkit sheet
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
          One strand per sheet, {TASKS_PER_SHEET} tasks, real Year 6 maths objectives.
          Print this page to check it lands on one A4 side per sheet.
        </p>
      </div>

      {picks.map(p => (
        <CurriculumSheet
          key={p.strand}
          childName="Teo"
          yearGroup={6}
          subject="maths"
          term="autumn"
          strand={p.strand}
          tasks={p.tasks}
        />
      ))}
    </main>
  )
}
