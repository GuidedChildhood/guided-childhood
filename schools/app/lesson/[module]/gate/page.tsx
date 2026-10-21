import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db as supabase } from '@/lib/supabase/server-db'
import { isStandaloneModule, standaloneTitle, standaloneYears } from '@/lib/taster'
import StandaloneGate from '@/app/taster/StandaloneGate'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'

// THE EMAIL GATE IN FRONT OF A STANDALONE LESSON (21 October 2026).
//
// Never reached by its own URL. proxy.ts rewrites a standalone lesson's pages
// here for a visitor with no school code and no free lesson cookie, so the
// address bar still reads /lesson/<module> (or its run sheet, player or
// pack), and the link Votes for Schools was sent keeps working. Typed
// directly, this path meets the code door like any other.
//
// What the gate shows is what makes the email worth giving: the lesson's own
// question, what changes for a child, and what opens. Then the two boxes.
// Then, apart and quieter, the other thing a teacher here might want: a
// pilot of the scheme. Separate on purpose (Justin asked for "another button
// to request pilot"), so asking for a pilot is never the price of the lesson.

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module: moduleId } = await params
  return { title: standaloneTitle(moduleId) ?? 'Free lesson' }
}

type GateLesson = {
  title: string
  single_action_outcome: string | null
  teacher_notes: { essential_question?: string } | null
}

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}
const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65,
}

export default async function StandaloneGatePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  if (!isStandaloneModule(moduleId)) notFound()

  const { data } = await supabase
    .from('school_lessons')
    .select('title, single_action_outcome, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  const lesson = data as GateLesson | null
  const title = lesson?.title ?? standaloneTitle(moduleId) ?? 'Free lesson'
  const question = lesson?.teacher_notes?.essential_question
  const years = standaloneYears(moduleId)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        <p style={{ ...eyebrow, marginBottom: '12px' }}>
          Free lesson{years ? ` · ${years.band}` : ''}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page,
          color: 'var(--ink)', margin: '0 0 var(--space-3)', textWrap: 'balance',
        }}>
          {title}
        </h1>
        {question && (
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, ...PAGE.lead, color: 'var(--ink)', margin: '0 0 var(--space-3)' }}>
            {question}
          </p>
        )}
        {lesson?.single_action_outcome && (
          <p style={{
            fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 600,
            fontSize: 'var(--text-lg)', color: 'var(--terracotta-dark)', lineHeight: 1.5, margin: '0 0 var(--space-4)',
          }}>
            {lesson.single_action_outcome}
          </p>
        )}

        <section style={{
          background: 'var(--white)', border: '2px solid var(--terracotta)',
          borderRadius: 'var(--radius-card)', padding: 'clamp(20px, 4vw, 30px)', marginBottom: '22px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)', ...PAGE.section, marginBottom: 'var(--space-2)' }}>
            Tell us where you teach and it opens.
          </h2>
          <p style={{ ...body, marginBottom: '20px' }}>
            The lesson plan, the slides with a script on every one, and the printable pack, free
            for {years?.anyClass ?? 'any class'}. You only do this once.
          </p>
          <StandaloneGate moduleId={moduleId} />
        </section>

        <section style={{
          background: 'var(--tint-amber)', borderRadius: 'var(--radius-card)',
          padding: 'clamp(18px, 4vw, 26px)', display: 'flex', flexWrap: 'wrap',
          gap: 'var(--space-3)', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ flex: '1 1 260px' }}>
            <p style={{ ...eyebrow, color: 'var(--stage-1-text)', marginBottom: '6px' }}>For your whole school</p>
            <p style={{ ...body, color: 'var(--stage-1-text)', margin: 0 }}>
              Want lessons like this all year? Ask for a free one term pilot of the full scheme.
            </p>
          </div>
          <Link href={`/pilot?from=${moduleId}`} className="btn btn-outline">Request a pilot</Link>
        </section>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: '18px' }}>
          Already have a school code?{' '}
          <Link href={`/unlock?next=/lesson/${moduleId}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>Enter it here</Link>
          {' '}and you go straight in.{' '}
          <Link href="/privacy" style={{ color: 'var(--terracotta-dark)', fontWeight: 700 }}>How we look after your details</Link>.
        </p>
      </div>
    </main>
  )
}
