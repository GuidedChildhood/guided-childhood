import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LearningSheet, { type SheetObjective } from '@/components/learning/LearningSheet'
import { sheetTarget, sheetLabel } from '@/lib/learning/term'

// The learning sheet, assembled for this child on this day.
//
// Nothing about the sheet is stored. The year group and the term are worked out
// from the child's birthday and today's date, and the objectives are read fresh,
// so correcting an objective improves every sheet printed after it rather than
// leaving old copies quietly wrong.
//
// It shows only what is genuinely in the curriculum table. Where there is
// nothing for a child's year yet, it says so plainly rather than falling back to
// the nearest year, because a sheet testing the wrong year is worse than no
// sheet: a parent believes it and acts on it.

export const metadata = { title: 'Learning sheet · Guided Childhood' }
export const dynamic = 'force-dynamic'

const SUBJECTS = ['maths', 'english', 'reading'] as const
type Subject = typeof SUBJECTS[number]

export default async function LearningSheetPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; child?: string }>
}) {
  const { subject: subjectParam, child: childParam } = await searchParams
  const subject: Subject = SUBJECTS.includes(subjectParam as Subject) ? subjectParam as Subject : 'maths'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: kids } = await supabase
    .from('children').select('id, name, date_of_birth').eq('parent_id', user.id).order('is_primary', { ascending: false })
  const children = kids ?? []
  const child = children.find(c => c.id === childParam) ?? children[0] ?? null

  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.13em', textTransform: 'uppercase',
  }
  const wrap = { maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }

  const shell = (body: React.ReactNode) => (
    <div style={wrap}>
      <Link href="/dashboard/printables" style={{ ...eyebrow, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Printables
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '14px 0 18px' }}>
        Where they are at school
      </h1>
      {body}
    </div>
  )

  const note = (title: string, line: string) => (
    <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>{title}</div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{line}</p>
    </div>
  )

  if (!child) {
    return shell(note('Add your child first', 'The sheet is built around their school year, so we need to know who it is for.'))
  }

  if (!child.date_of_birth) {
    return shell(note(
      `We need ${child.name}'s birthday`,
      'School places a child by their age on 31 August, so without the birthday we would be guessing the year group, and a sheet for the wrong year is worse than none. Add it in settings and this fills in.',
    ))
  }

  const target = sheetTarget(new Date(`${String(child.date_of_birth).slice(0, 10)}T00:00:00Z`), new Date())
  if (!target) {
    return shell(note(
      'Not this age yet',
      `These sheets follow the school curriculum for Years 1 to 6. ${child.name} is outside that for now, so there is nothing here that would be honest to show.`,
    ))
  }

  // Two shapes of objective live in this table. Maths is sequenced by term, so
  // it is read for the term the child is actually in. English is not: the
  // programmes of study set reading and writing out for the whole year and
  // there is no honest way to say which term a school teaches handwriting in,
  // so those rows carry the term 'all' and come back whatever the date is.
  const { data: rows } = await supabase
    .from('curriculum_objectives')
    .select('id, strand, objective, term')
    .eq('curriculum', 'england')
    .eq('year_group', target.yearGroup)
    .eq('subject', subject)
    .in('term', [target.term, 'all'])
    .order('sort_order', { ascending: true })

  const objectives: SheetObjective[] = (rows ?? []).map(r => ({
    id: r.id as string, strand: r.strand as string, objective: r.objective as string,
  }))

  // When nothing on the sheet is term specific, the heading must not claim a
  // term. It says Year 4, not Year 4 autumn term, because the second one would
  // be a claim about the school's plan that we have no basis for.
  const wholeYear = objectives.length > 0 && (rows ?? []).every(r => r.term === 'all')

  const tabs = (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
      {SUBJECTS.map(s => (
        <Link
          key={s}
          href={`/dashboard/printables/learning?subject=${s}&child=${child.id}`}
          style={{
            padding: '10px 16px', borderRadius: 13, textDecoration: 'none',
            background: s === subject ? 'var(--terracotta)' : '#fff',
            border: `1.5px solid ${s === subject ? 'var(--terracotta)' : 'var(--border)'}`,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
            textTransform: 'capitalize',
          }}
        >
          {s}
        </Link>
      ))}
    </div>
  )

  if (objectives.length === 0) {
    return shell(
      <>
        {tabs}
        {note(
          'Not written yet',
          `${sheetLabel(target)} ${subject} is not in the curriculum map yet. It is deliberately blank rather than filled in from memory, because a sheet that tests the wrong thing is worse than no sheet at all.`,
        )}
      </>
    )
  }

  return shell(
    <>
      {tabs}
      {wholeYear ? (
        <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green)', borderRadius: 16, padding: '13px 15px', marginBottom: 14 }}>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            Reading and writing are set out for the whole school year rather than term by term, so this is everything Year {target.yearGroup} covers, not just this term.
          </p>
        </div>
      ) : target.lookingBack && (
        <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 16, padding: '13px 15px', marginBottom: 14 }}>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            School is out, so this looks back over the year {child.name} has just finished rather than the one starting in September.
          </p>
        </div>
      )}
      {/* ONE SHEET PER SUBJECT PER CHILD, AND THE KEY IS WHAT MAKES THAT TRUE.
          Justin, 11 August 2026, with a screenshot of the Reading tab: "we did
          the maths as tricky and it confirmed, and reading??? So they need to be
          separate."

          The subject tabs are links, so switching them is a navigation, but the
          component lands back in the same position in the same tree and React
          keeps its state. LearningSheet holds two pieces of state that are ONLY
          true of one subject: which objectives were ticked as tricky, and
          whether the sheet has been finished.

          So finishing maths and tapping Reading carried the finished card
          straight over, and then made it worse than a stale card: the tick list
          still held MATHS objective ids while the objectives prop had become the
          READING ones, nothing matched, and the card told a parent their child
          had not flagged anything as tricky, minutes after they had flagged
          something as tricky.

          Keying on the subject and the child gives each one its own component
          instance, so switching tabs starts a fresh sheet, which is what a tab
          has always looked like it did. */}
      <LearningSheet
        key={`${child.id}:${subject}`}
        childId={child.id}
        childName={child.name && child.name !== 'Your child' ? child.name : 'your child'}
        yearGroup={target.yearGroup}
        subject={subject}
        term={target.term}
        label={wholeYear ? `Year ${target.yearGroup}` : sheetLabel(target)}
        objectives={objectives}
      />
    </>
  )
}
