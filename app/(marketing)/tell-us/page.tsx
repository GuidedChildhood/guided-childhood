import type { Metadata } from 'next'
import Link from 'next/link'
import { askTokenValid, leadAskTokenValid } from '@/lib/asks/stalled'
import TellUsForm from '@/components/asks/TellUsForm'

// WHERE A PARENT WHO STOPPED TELLS US WHY (Justin, 15 November 2026).
//
// Opened from a signed link in an email, with no sign in, because the parent
// this is for may never have got past the plan choice. Question one is a
// single tap, which is the pattern every leaving survey on Mobbin uses
// (Givingli, Neo Financial, Blue Apron): a reason first, words second.

export const metadata: Metadata = {
  title: 'Tell us what stopped you | Guided Childhood',
  robots: { index: false, follow: false },
}

export default async function TellUsPage({ searchParams }: { searchParams: Promise<{ u?: string; l?: string; k?: string }> }) {
  const { u, l, k } = await searchParams
  // l is a stage check visitor with no account (16 November 2026), u an account.
  const lead = !!l && leadAskTokenValid(l, k)
  const ok = lead || askTokenValid(u, k)
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '32px 16px 64px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-soft)', margin: '0 0 10px' }}>
          Guided Childhood
        </p>
        {ok ? (
          <TellUsForm who={lead ? { l: l as string } : { u: u as string }} k={k as string} />
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', lineHeight: 1.15, margin: '0 0 12px' }}>
              This link has expired
            </h1>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 20px' }}>
              Open the newest email from Justin and tap the button there, or reply to it with whatever you wanted to say. He reads every one.
            </p>
            <Link href="/" className="btn btn-gold">Back to Guided Childhood</Link>
          </>
        )}
      </div>
    </main>
  )
}
