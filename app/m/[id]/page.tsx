import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { momentLook } from '@/lib/content/moment-look'

// The public face of a shared moment card. A parent shares a moment from
// the app into a WhatsApp group or social feed; this page is what the
// link opens, in the exact colours of the card they shared. No login,
// the wisdom in full, one taste of the practical help, and the pathway
// as the next step.
//
// WHY THE ADMIN CLIENT ON A PUBLIC PAGE. The comment here used to end
// "daily_moments is publicly readable by design", and that was the whole
// problem: publicly readable to this page also meant publicly readable to
// anyone who pointed a request at the database with the published anon key,
// all 89 moments at once rather than the one that was shared. Migration 275
// takes that grant away, so this page reads with the service role instead.
//
// That is a narrower door than it sounds. The query below is pinned to one
// UUID that the visitor must already have been given, restricted to active
// rows, and selects six named columns. Nothing about moving to this client
// widens what the page can show; it only stops the same rows being reachable
// without the page.

type MomentRow = {
  id: string
  title: string
  category: string
  science_brief: string
  digi_opener: string
  solutions: string[] | null
  expert_note: string | null
}

async function getMoment(id: string): Promise<MomentRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('daily_moments')
    .select('id, title, category, science_brief, digi_opener, solutions, expert_note')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle()
  return data as MomentRow | null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const moment = await getMoment(id)
  if (!moment) return { title: 'Guided Childhood' }
  return {
    title: `${moment.title} · Guided Childhood`,
    description: moment.science_brief.slice(0, 160),
    openGraph: {
      title: moment.title,
      description: moment.science_brief.slice(0, 160),
    },
  }
}

// Is the person reading this already one of ours?
//
// NEVER SELL SOMETHING TO SOMEONE WHO HAS BOUGHT IT (21 September 2026).
// Justin, signed in and mid trial, followed a moment link out of a DiGi answer
// and met "Get your free starter pack": "this is already a sign up so although
// great to link to relevant card we don't need to offer starter pack". DiGi
// now links the in app card instead, and this page still has to hold, because
// a member also opens shared links from a friend's WhatsApp group.
//
// An error reads as signed out, which is the safe way round: a stranger gets
// the invitation the page was built for, and the worst a member ever sees is
// the offer they see everywhere else.
async function isMember(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return Boolean(user)
  } catch { return false }
}

export default async function SharedMomentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [moment, member] = await Promise.all([getMoment(id), isMember()])
  if (!moment) notFound()

  const look = momentLook(moment.category)
  const solutions = (moment.solutions ?? []).slice(0, 1)

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--deep-teal)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 14px 32px',
    }}>
      <div style={{
        width: 'min(100%, 520px)',
        background: look.tint,
        borderRadius: '26px',
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,0.35)',
      }}>
        {/* Curved band header */}
        <div style={{
          background: look.band,
          padding: '18px 22px 26px',
          borderRadius: '0 0 50% 50% / 0 0 26px 26px',
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>
            A moment from Guided Childhood
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: '#fff', lineHeight: 1.2, margin: 0 }}>
            {moment.category}
          </p>
        </div>

        <div style={{ padding: '24px 24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(1.6rem, 7vw, 2.1rem)', color: 'var(--ink)',
            letterSpacing: '-0.02em', lineHeight: 1.12, margin: 0,
          }}>
            {moment.title}
          </h1>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
            {moment.science_brief}
          </p>

          {solutions.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.65)', borderRadius: 'var(--radius-tile)', padding: '14px 16px',
              borderLeft: `3px solid ${look.band}`,
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: look.band, marginBottom: 6 }}>
                Try this tonight
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                {String(solutions[0])}
              </p>
            </div>
          )}

          {moment.expert_note && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              {moment.expert_note}
            </p>
          )}
        </div>
      </div>

      {/* The invitation for a stranger, the way back in for a member. */}
      <div style={{ width: 'min(100%, 520px)', marginTop: '18px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '14px' }}>
          {member
            ? 'This one is in your app, where you can tell DiGi you tried it, turn it into a quest, or keep it for later.'
            : 'There is a card like this for every hard moment, and the exact words to say, from age 4 to 16.'}
        </p>
        <Link
          href={member ? `/dashboard/moments?card=${moment.id}` : '/starter-pack'}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 'var(--radius-btn)', padding: '14px 28px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
            maxWidth: '100%', boxSizing: 'border-box',
          }}
        >
          {member ? 'Open it in your app' : 'Get your free starter pack'}
        </Link>
        {!member && (
          <p style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.75)', marginTop: '12px' }}>
            Already a member?{' '}
            <Link href="/login" style={{ color: '#fff', fontWeight: 700 }}>Log in</Link>
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', marginTop: '14px', letterSpacing: '0.06em' }}>
          guidedchildhood.co.uk
        </p>
      </div>
    </div>
  )
}
