import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { momentLook } from '@/lib/content/moment-look'

// The public face of a shared moment card. A parent shares a moment from
// the app into a WhatsApp group or social feed; this page is what the
// link opens, in the exact colours of the card they shared. No login,
// the wisdom in full, one taste of the practical help, and the pathway
// as the next step. daily_moments is publicly readable by design.

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
  const supabase = await createClient()
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

export default async function SharedMomentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const moment = await getMoment(id)
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
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: 3 }}>
            A moment from Guided Childhood
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: '#fff', lineHeight: 1.2, margin: 0 }}>
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

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
            {moment.science_brief}
          </p>

          {solutions.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.65)', borderRadius: '14px', padding: '14px 16px',
              borderLeft: `3px solid ${look.band}`,
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: look.band, marginBottom: 6 }}>
                Try this tonight
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                {String(solutions[0])}
              </p>
            </div>
          )}

          {moment.expert_note && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              {moment.expert_note}
            </p>
          )}
        </div>
      </div>

      {/* The invitation, not a hard sell */}
      <div style={{ width: 'min(100%, 520px)', marginTop: '18px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: '14px' }}>
          There is a card like this for every hard moment, and the exact words to say, from age 4 to 16.
        </p>
        <Link
          href="/starter-pack"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '16px', padding: '14px 28px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Get your free starter pack
        </Link>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '16px', letterSpacing: '0.06em' }}>
          guidedchildhood.co.uk
        </p>
      </div>
    </div>
  )
}
