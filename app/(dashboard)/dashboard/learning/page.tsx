import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildYearView, yearBlurb, type YearView } from '@/lib/learning/year-view'
import LearningYear from './LearningYear'

// What your child is learning.
//
// The front door for the 448 curriculum objectives, which until now reached a
// parent only through a homework decoder they had to find, and a learning sheet
// linked from nowhere at all. Justin asked why we collected all that data and
// how we use it, and said the thing that matters: "if I am not sure what it
// does then parents will not either."
//
// One page, no input required. Their year, their term, what the class is being
// taught, what is coming up at school, and what happens next.

export const metadata = { title: 'What they are learning · Guided Childhood' }
export const dynamic = 'force-dynamic'

export default async function LearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: kids } = await supabase
    .from('children')
    .select('id, name, date_of_birth, is_primary')
    .eq('parent_id', user.id)
    .order('is_primary', { ascending: false })

  const children = (kids ?? []).filter(k => k.name && k.name !== 'Your child')

  // Built for every child at once, so switching between them is instant and a
  // two child family sees one page rather than two visits.
  const views: YearView[] = await Promise.all(
    children.map(c => buildYearView(supabase, {
      id: c.id as string,
      name: c.name as string,
      date_of_birth: (c.date_of_birth as string | null) ?? null,
    })),
  )

  if (views.length === 0) {
    return (
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 20px 48px' }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
          ← Home
        </Link>
        <p className="eyebrow" style={{ marginBottom: 4 }}>At school</p>
        <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 10px' }}>
          What they are learning
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 22 }}>
          Add your child and their birthday, and this fills in with the objectives their class is actually working through this term.
        </p>
        <Link href="/dashboard/settings" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Add your child
        </Link>
      </div>
    )
  }

  return <LearningYear views={views} blurbs={views.map(yearBlurb)} />
}
