import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BackTo from '@/components/nav/BackTo'
import LiteracyCheckIn from '@/components/pathway/LiteracyCheckIn'
import { getChildren } from '@/lib/children/server'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'One question this week · Guided Childhood' }

// ── THE FOUR STRANDS QUESTION NEEDED A HOME ─────────────────────────────────
//
// DiGi's weekly strand question used to sit at the bottom of the Progress page.
// It came off on 18 August with the other blocks Justin moved to the rotations:
// "again, this in the passport should be something that pops up on home page
// weekly rotation."
//
// It came off before its rotation item existed, so for a few hours it was
// rendered NOWHERE, and that is worse than it sounds. lib/pathway/literacy-
// status.ts reads answers on a 28 DAY window, so a form nobody can reach does
// not fail loudly, it quietly ages out: the four strand readings on the
// passport keep displaying, correctly, right up until they are a month old and
// based on nothing. A fuse already lit rather than a gap to get to later.
//
// So this is the page the weekly item points at. Deliberately small: one
// question, the answer, DiGi's warm read of it, and the way back. It is not a
// dashboard, because the whole promise of the item is one minute.
//
// The child comes from ?child= like everywhere else, and the rail in the layout
// puts it there. The stage decides WHICH strand is asked (social media
// questions only from 13), so a family with a nine year old and a fifteen year
// old genuinely gets two different questions, which is the entire reason this
// became per child in migration 209.

export default async function StrandsPage({
  searchParams,
}: { searchParams: Promise<{ child?: string; from?: string }> }) {
  const { child: childParam, from } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { child } = await getChildren<{
    id: string; name: string | null; age_band: string | null; is_primary: boolean | null
  }>(supabase, user.id, childParam, 'id, name, age_band')

  const stage = getStageFromAgeBand((child?.age_band as AgeBand) ?? '11-13')
  const name = child?.name && child.name !== 'Your child' ? child.name : 'your child'

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 20px 48px' }}>
      {/* The rotation item sends ?from=home, so the way back is Today. Anyone
          arriving from the passport gets the passport. BackTo owns that map. */}
      <BackTo from={from} fallback={{ href: '/dashboard', label: 'Home' }} />

      <div style={{ margin: '10px 0 18px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>This week</p>
        <h1 style={{ fontSize: 'clamp(1.7rem, 5.5vw, 2.2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: '8px' }}>
          One question, one minute
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          DiGi asks one thing about {name} each week, reads your answer back, and
          the four strands on the passport learn from it. There is no score and
          nothing to revise for.
        </p>
      </div>

      <LiteracyCheckIn stageId={stage.id} />

      {/* Answered already this week: the component renders nothing at all, so
          the page would be a heading over empty space. This says so plainly
          rather than leaving a parent wondering whether it failed to load. */}
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
        padding: '18px 20px', marginTop: '16px',
      }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          If there is no question above, you have already answered this week.
          It comes back next week with a different one.
        </p>
      </div>
    </div>
  )
}
