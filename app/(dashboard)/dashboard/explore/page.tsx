import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ExploreGrid from '@/components/home/ExploreGrid'

// Everything else, on its own page.
//
// This grid used to sit on Home underneath a second grid that did the same job,
// which is how a platform this size ends up feeling like a wall. Home now shows
// the five places a parent actually goes and one door to here. Nothing has been
// removed: every tile that was on Home is on this page, grouped, with a way
// back at the top.

export const metadata = { title: 'Everything else · Guided Childhood' }

export default async function ExplorePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // The Tonight's script tile deep links to the script a parent has been given
  // today when Home worked one out. Reached from here we have no such pick, so
  // it goes to the library, which is the honest version of the same door.
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 48px' }}>
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 18,
          fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
          color: 'var(--ink-muted)', textDecoration: 'none',
        }}
      >
        ‹ Back to home
      </Link>

      <p className="eyebrow" style={{ marginBottom: '4px' }}>Every part, one tap</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
        Everything else
      </h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: '17px', lineHeight: 1.6, marginBottom: '22px' }}>
        The rest of the platform, grouped. Home keeps the five you use most, and this is where the depth lives.
      </p>

      <ExploreGrid scriptHref="/dashboard/scripts" />
    </div>
  )
}
