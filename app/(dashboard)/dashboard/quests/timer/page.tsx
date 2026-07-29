import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ParentDeviceTime from '@/components/quests/ParentDeviceTime'

// The screen timer, on its own page.
//
// It was a card at the top of Balance and stats, which meant starting twenty
// minutes of TV required opening a page about weekly averages and scrolling
// past a chart. Justin asked for it as its own button and its own page, and he
// is right: starting a timer is a thing you do in the moment with a child
// standing next to you, and reading the week is a thing you do sitting down.
// They do not belong on the same screen.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Screen timer — Guided Childhood' }

export default async function TimerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '22px 20px 48px' }}>
      <Link href="/dashboard/quests" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 15, color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginBottom: 16 }}>
        ← Quests
      </Link>
      <p className="eyebrow" style={{ marginBottom: 4 }}>Screen timer</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 6px' }}>
        Start some screen time
      </h1>
      <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 20px' }}>
        No phone of their own? Start it here and it still counts in the balance, on the same countdown you both watch.
      </p>

      <ParentDeviceTime userId={user.id} />

      <Link
        href="/dashboard/stats"
        className="btn btn-outline"
        style={{ display: 'flex', justifyContent: 'center', marginTop: 22, padding: '15px 20px', fontSize: 16.5, textDecoration: 'none' }}
      >
        See the week and the balance →
      </Link>
    </div>
  )
}
