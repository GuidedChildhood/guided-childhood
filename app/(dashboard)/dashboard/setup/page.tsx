import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getSetupState } from '@/lib/setup/flags'
import SetupQuest from '@/components/setup/SetupQuest'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Setup Quest · Guided Childhood' }

// The Setup Quest. The things a family does once, and then never again.
//
// The page is thin on purpose: every rule about what counts as done lives in
// lib/setup/flags.ts, and everything about how the steps are drawn lives in
// components/setup/SetupQuest.tsx. This reads the state and hands it over.
//
// See plans/setup-quest-three-steps.md for why it is three rather than seven.

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { flags, child, children, complete } = await getSetupState(supabase, user.id)

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <div style={{ marginBottom: '18px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Setting up</p>
        <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
          {complete ? 'Setup Quest' : 'Four things and you are set'}
        </h1>
        {!complete && (
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            One at a time. Each one goes green as you finish it and stays that way.
          </p>
        )}
      </div>

      <SetupQuest flags={flags} child={child} children={children} userId={user.id} />
    </div>
  )
}
