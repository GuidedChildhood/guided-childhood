import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FriendsPoster from '@/components/printables/FriendsPoster'
import { streakCurrency } from '@/lib/pathway/streak-unlock'

// The Planet Friends poster, built for one child on the day it is printed.
//
// Justin, 8 August 2026: "let's give away of printing a poster sticker sheet
// from achieving these."
//
// Nothing about the sheet is stored, the same rule the learning sheet follows:
// the count is read fresh every time, so a poster printed today is true today
// and reprinting it next month shows the month's work.
//
// THE COUNT IS THE SAME FUNCTION THE APP USES, not a second sum written here.
// streakCurrency is what the sticker book, the child's road and the celebration
// all read, and this morning a child was shown four Friends they had not earned
// because two surfaces disagreed. A sheet on a fridge is the one copy nobody
// can quietly correct later, so it gets its numbers from the same place or it
// does not get printed.

export const metadata = { title: 'Planet Friends poster · Guided Childhood' }
export const dynamic = 'force-dynamic'

export default async function FriendsPosterPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>
}) {
  const { child: childParam } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: kids } = await supabase
    .from('children').select('id, name').eq('parent_id', user.id).order('is_primary', { ascending: false })
  const children = kids ?? []
  const child = children.find(c => c.id === childParam) ?? children[0] ?? null

  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.13em', textTransform: 'uppercase',
  }

  const shell = (body: React.ReactNode) => (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px 60px' }}>
      <div className="fp-noprint">
        <Link href="/dashboard/printables" style={{ ...eyebrow, color: 'var(--ink-muted)', textDecoration: 'none' }}>
          ← Printables
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(26px, 7vw, 32px)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '14px 0 8px' }}>
          The Planet Friends poster
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
          The ones they have brought home, in colour to cut out and stick up. The
          ones still coming, in line art to colour in while they work towards them.
        </p>
      </div>
      {body}
    </div>
  )

  if (!child) {
    return shell(
      <div className="fp-noprint" style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: 6 }}>
          Add your child first
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
          The poster carries their name and what they have actually earned, so it
          needs to know who it is for.
        </p>
      </div>
    )
  }

  // Both counters, combined the one way the rest of the app combines them.
  const [{ count: jobStreaks }, { count: completedDays }] = await Promise.all([
    supabase.from('job_streaks').select('id', { count: 'exact', head: true }).eq('child_id', child.id),
    supabase.from('kid_days').select('id', { count: 'exact', head: true })
      .eq('child_id', child.id).not('completed_at', 'is', null),
  ])
  const fullDays = streakCurrency(jobStreaks ?? 0, completedDays ?? 0)

  return shell(
    <>
      {children.length > 1 && (
        <div className="fp-noprint" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {children.map(c => (
            <Link
              key={c.id}
              href={`/dashboard/printables/friends?child=${c.id}`}
              style={{
                textDecoration: 'none', borderRadius: 100, padding: '7px 14px',
                border: `1.5px solid ${c.id === child.id ? 'var(--terracotta)' : 'var(--border)'}`,
                background: c.id === child.id ? 'var(--terracotta-lt)' : '#fff',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <FriendsPoster childName={child.name as string} fullDays={fullDays} />
    </>
  )
}
