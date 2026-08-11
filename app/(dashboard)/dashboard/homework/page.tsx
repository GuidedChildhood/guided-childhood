import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import HomeworkDecoder, { type DecoderChild } from './HomeworkDecoder'

// The homework decoder.
//
// The one nightly friction this product had nothing to say about. A parent who
// cannot help is not a parent who does not care, it is a parent looking at a
// method that did not exist when they were at school, worried that helping the
// wrong way will make it worse. Both of those are true and both are fixable
// with a lookup.

export const metadata = { title: 'Homework · Guided Childhood' }
export const dynamic = 'force-dynamic'

export default async function HomeworkPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: kids } = await supabase
    .from('children').select('id, name, date_of_birth')
    .eq('parent_id', user.id).order('is_primary', { ascending: false })

  const children: DecoderChild[] = (kids ?? []).map(k => ({
    id: k.id as string,
    name: k.name && k.name !== 'Your child' ? String(k.name) : 'Your child',
    hasBirthday: !!k.date_of_birth,
  }))

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Back to the tab they came from, not to printables.
          Justin, 11 August 2026: "make sure navigation goes back to what the
          child is learning, not printables."
          Every route into this page now arrives from the learning surface: the
          Homework tab, the This week card, the school chest, DiGi's school chip
          and the explore grid. Sending them to printables on the way out put a
          parent in a section they never chose, and every back tap after that
          kept them there. */}
      <Link href="/dashboard/learning?tab=homework" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← What they are learning
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '14px 0 10px' }}>
        What is this homework?
      </h1>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 20px' }}>
        Paste it in and we will tell you which bit of the national curriculum it comes from, what it is actually for, and one way to help tonight.
      </p>

      {children.length === 0 ? (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: 6 }}>Add your child first</div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            This works off their school year, so we need to know who it is for.
          </p>
        </div>
      ) : (
        <HomeworkDecoder kids={children} />
      )}
    </div>
  )
}
