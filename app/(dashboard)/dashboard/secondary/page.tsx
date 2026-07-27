import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TRANSITION_STEPS, transitionFor, transitionAsk } from '@/lib/learning/transition'

// The Year 6 into Year 7 phone bridge.
//
// One page, in order, for the six weeks either side of the biggest screen
// decision a family makes. It is reachable any time, but it only leads on Home
// while a child is actually in the window.
//
// The page never tells a parent whether to get the phone. It tells them the
// order, because the order is the part that cannot be redone.

export const metadata = { title: 'Starting secondary — Guided Childhood' }
export const dynamic = 'force-dynamic'

export default async function SecondaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: kids } = await supabase
    .from('children').select('id, name, date_of_birth')
    .eq('parent_id', user.id).order('is_primary', { ascending: false })

  // The child this is actually about: the first one in the window, or the
  // primary child so the page still reads for anyone who opens it early.
  const inWindow = (kids ?? []).map(k => ({ kid: k, state: transitionFor(k.date_of_birth as string | null) }))
  const match = inWindow.find(x => x.state !== null)
  const child = match?.kid ?? (kids ?? [])[0] ?? null
  const state = match?.state ?? null
  const name = child?.name && child.name !== 'Your child' ? child.name : 'your child'

  const ask = state ? transitionAsk(state) : 'My child starts secondary soon. How do we handle the first phone?'

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ← Home
      </Link>

      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '14px 0 4px' }}>
        Year 6 into Year 7
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 34px)', color: 'var(--ink)', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
        {state ? state.headline : 'The first phone'}
      </h1>
      <p style={{ fontSize: 18, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 8px' }}>
        {state
          ? state.line
          : `Whenever ${name} gets there, this is the order that works. It is here early on purpose, because the useful steps are the ones taken before the handset arrives.`}
      </p>

      {/* The one thing this page refuses to do, said out loud rather than
          implied, because a parent arriving here is often hoping we will make
          the decision and it is kinder to be straight about it. */}
      <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green)', borderRadius: 16, padding: '14px 16px', margin: '18px 0 24px' }}>
        <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
          We will not tell you whether to get {name} a phone. Nobody who has not met your child should. What we can give you is the order, and the order is the part you cannot go back and redo.
        </p>
      </div>

      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TRANSITION_STEPS.map((step, i) => (
          <li key={step.key} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--terracotta-dark)' }}>
                {i + 1}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em', margin: 0 }}>
                {step.title}
              </h2>
            </div>
            <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 10px' }}>
              {step.what}
            </p>
            {/* Why it sits at this point in the order, in the quieter voice, so
                a parent skimming the titles can still find the reasoning. */}
            <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0, paddingLeft: 12, borderLeft: '2px solid var(--border)' }}>
              {step.why}
            </p>
            {step.href && (
              <Link
                href={step.href}
                style={{
                  display: 'inline-flex', marginTop: 12, padding: '10px 16px', textDecoration: 'none',
                  background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 13,
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16,
                  boxShadow: '0 3px 0 var(--terracotta-dark)',
                }}
              >
                {step.cta ?? 'Have a look'}
              </Link>
            )}
          </li>
        ))}
      </ol>

      <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 20, padding: '18px 20px', marginTop: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 19, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>
          Every family lands this differently
        </div>
        <p style={{ fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 12px' }}>
          The five steps are the order. What you actually decide inside them is yours, and it depends on things only you know about {name}.
        </p>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(ask)}`}
          style={{
            display: 'inline-flex', padding: '13px 18px', textDecoration: 'none',
            background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 16,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17,
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          Work it through with DiGi
        </Link>
      </div>
    </div>
  )
}
