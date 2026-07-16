import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ButtonLink } from '@/components/ui/Button'
import { getSetupState } from '@/lib/setup/flags'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Set up — Guided Childhood' }

// The Setup hub: all the one time setup in one calm place, out of the daily
// Home. Each step is a plain card, one line of what it does, one button.
// Done steps drop to the bottom, quiet. This is the whole of setup; Home
// just points here until it is finished.

const STEP_ICON: Record<string, string> = {
  daily: '🌅', push: '🔔', quests: '⭐', school: '🏫', childLink: '📲', agreement: '🤝',
}

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { steps, flags, doneCount, total, complete } = await getSetupState(supabase, user.id)
  const todo = steps.filter(s => !flags[s.key])
  const done = steps.filter(s => flags[s.key])

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <div style={{ marginBottom: '18px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>One time setup</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>Set up</h1>
        {/* Progress: one clear bar, not a wall of words */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '10px', borderRadius: '100px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((doneCount / Math.max(1, total)) * 100)}%`, height: '100%', borderRadius: '100px', background: 'var(--terracotta)', transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>
            {doneCount}/{total}
          </span>
        </div>
      </div>

      {complete && (
        <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--stage-1-bold)', borderRadius: '16px', padding: '18px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '1.8rem' }}>🎉</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--ink)' }}>You are all set up</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>Everything below is ready. Change any of it any time.</div>
          </div>
        </div>
      )}

      {todo.length > 0 && (
        <>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>To do</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
            {todo.map((s, i) => (
              <div key={s.key} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                background: '#fff', border: i === 0 ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                borderRadius: '16px', padding: '16px 18px',
                boxShadow: i === 0 ? '0 4px 16px rgba(201,154,40,0.14)' : '0 2px 10px rgba(26,26,46,0.04)',
              }}>
                <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '12px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  {STEP_ICON[s.key] ?? '•'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.25 }}>{s.title}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '2px' }}>{shortWhat(s.key)}</div>
                </div>
                <ButtonLink href={s.href} variant="primary" size="md" style={{ flexShrink: 0 }}>
                  {i === 0 ? 'Start' : 'Set up'}
                </ButtonLink>
              </div>
            ))}
          </div>
        </>
      )}

      {done.length > 0 && (
        <>
          <p className="eyebrow" style={{ marginBottom: '10px' }}>Done</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {done.map(s => (
              <Link key={s.key} href={s.href} style={{
                display: 'flex', alignItems: 'center', gap: '13px', textDecoration: 'none',
                background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '14px', padding: '13px 16px',
              }}>
                <span style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '10px', background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>
                  {STEP_ICON[s.key] ?? '•'}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>{s.title}</span>
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#1F7A54', background: '#D4EDDF', borderRadius: '100px', padding: '3px 9px' }}>✓ Done</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// The hub keeps copy tight: one short line per step, not the long onboarding
// paragraph the guided path used.
function shortWhat(key: string): string {
  const map: Record<string, string> = {
    daily: 'Two minutes: the moment, the words, the check in.',
    push: 'Three gentle nudges a day, at screen time moments.',
    quests: 'Jobs earn stars, stars buy the screen time you agree.',
    school: 'PE kit, library day, clubs. Reminds you both weekly.',
    childLink: 'Their own private link, opens like an app on their phone.',
    agreement: 'Decided together, signed. It powers what stars buy.',
  }
  return map[key] ?? ''
}
