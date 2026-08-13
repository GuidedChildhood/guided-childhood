import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getMovements, movementSentence } from '@/lib/working/movement'

// The doorway to What is working, from the passport.
//
// It carries the best true sentence rather than a label, because a card
// reading "See what is working" is a navigation item and a card reading
// "Bedtime went from 5 to 8 over six weeks" is a reason to tap. The page it
// opens says the same thing at the top, so the tap is never a surprise.
//
// Renders nothing at all until there is something honest to say. A doorway
// promising an answer that is not there yet is worse than no doorway: it
// spends the parent's attention and returns an empty room.

export default async function WhatIsWorkingLink() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const movements = await getMovements(supabase, user.id)
  const real = movements.filter(m => m.points.length >= 2 && m.startScore != null && m.endScore != null)
  if (real.length === 0) return null

  const climbed = real.filter(m => (m.endScore as number) > (m.startScore as number))
  const lead = climbed[0] ?? real[0]
  const sentence = movementSentence(lead)
  if (!sentence) return null

  return (
    <Link
      href="/dashboard/what-is-working?from=pathway"
      style={{
        display: 'flex', alignItems: 'center', gap: '13px', textDecoration: 'none',
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
        padding: '16px 18px', marginBottom: '20px',
      }}
    >
      <span aria-hidden style={{
        width: 46, height: 46, borderRadius: '13px', flexShrink: 0,
        background: 'var(--tint-green)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--retro-green)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17.5l5.5-6 4 3.5L21 6" />
          <path d="M15.5 6H21v5.5" />
        </svg>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '3px' }}>
          What is working
        </span>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
          {sentence}
        </span>
        <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '3px', lineHeight: 1.45 }}>
          {real.length === 1 ? 'See the line behind it' : `See all ${real.length} lines`}
        </span>
      </span>
    </Link>
  )
}
