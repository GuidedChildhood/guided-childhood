import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewScriptForm from './NewScriptForm'

// Founder only: write a new script for the library, quick, from the dashboard.
// A parent request can send us here with the problem pre-filled as the situation.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export default async function NewScriptPage({ searchParams }: { searchParams: Promise<{ problem?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  const { problem } = await searchParams

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 56px' }}>
      <Link href="/dashboard/insights" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)', textDecoration: 'none' }}>← Insights</Link>
      <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '10px 0 6px' }}>Add a script</h1>
      <p style={{ color: 'var(--ink-muted)', fontSize: 14.5, marginBottom: 24 }}>
        Write it once here and it joins the library for every parent. {problem ? 'Pre-filled from a parent request.' : ''}
      </p>
      <NewScriptForm prefillSituation={problem} />
    </div>
  )
}
