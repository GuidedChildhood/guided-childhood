'use client'

// The Road to 16 claim on /etsy-bonus. The printable Guided Childhood Passport
// promises the guide free once every page up to the child's age is stamped
// (Justin, 5 November 2026: the guide is the reward, not a product, and it
// unlocks when the family is caught up rather than at sixteen, so it arrives
// while the stages ahead are still ahead). So
// the offer is the Passport's own last page in the app's colours: the burgundy
// and gold of lib/pathway/passport-print-style.ts, the five Planet Friends,
// and the guide's cover.
//
// HONOUR BASED, ON PURPOSE. The family ticks that their pages are stamped
// and the email gate appears. Asking for a photo of the stamps would turn a
// thank you into an inspection, and the stamps are earned at a kitchen table
// we cannot see anyway. The tick is the family saying it out loud, which is
// the Passport's whole idea. The PDFs are public files, so nothing here is a
// lock, and nothing needs to be.

import { useState } from 'react'
import MagnetGate from '@/components/marketing/MagnetGate'
import { BURGUNDY, GOLD, STAGE_COLOURS } from '@/lib/pathway/passport-print-style'

const FRIENDS = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo']

export default function PassportRewardClaim() {
  const [stamped, setStamped] = useState(false)

  return (
    <section id="road-to-16" style={{ marginTop: '44px', scrollMarginTop: '24px' }}>
      <div style={{ background: BURGUNDY, color: GOLD, borderRadius: 'var(--radius-card)', padding: '28px 22px', boxShadow: 'inset 0 0 0 2px rgba(237,195,95,0.5)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 10px', opacity: 0.85 }}>
          Passport up to date?
        </p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/printables/road-to-16/road-to-16-cover.png" alt="The cover of The Road to 16 guide" width={120} height={170}
            style={{ width: '120px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 0 rgba(0,0,0,0.35)', flexShrink: 0 }} />
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', lineHeight: 1.1, margin: '0 0 10px', color: GOLD }}>
              The Road to 16 is yours
            </h2>
            <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, margin: 0, color: '#FBEED0' }}>
              Every page stamped up to your child&apos;s age earns the grown ups guide to the whole journey: balance, the signs to watch for at each stage, every big app with its own minimum age and the setting to lock first, and the school moments from the Year 6 phone ask to the Year 7 group chats.
            </p>
          </div>
        </div>
        <div aria-hidden style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
          {FRIENDS.map((f, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f} src={`/digi-squad/friends/${f}.png`} alt="" width={40} height={40}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF7E8', border: `2px solid ${STAGE_COLOURS[i]}`, objectFit: 'contain' }} />
          ))}
        </div>
      </div>

      <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', margin: '18px 0', padding: '16px 18px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-card)', cursor: 'pointer' }}>
        <input type="checkbox" checked={stamped} onChange={(e) => setStamped(e.target.checked)}
          style={{ width: '22px', height: '22px', marginTop: '2px', flexShrink: 0, accentColor: '#571C2A' }} />
        <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink)' }}>
          <strong>Every page of our Passport up to our child&apos;s age is stamped.</strong> Each one with its talk, its doing and its check, from Pebble onward.
        </span>
      </label>

      {stamped ? (
        <MagnetGate
          slug="road-to-16"
          heading="Send me the Road to 16"
          sub="The full guide, ready to print at home on A4 or US Letter, with an ink saver version too. Pop your email in and it is yours."
        />
      ) : (
        <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
          Not there yet? Every page stays open, so carry on at your own pace. The guide will be here when the page for your child&apos;s age is stamped.
        </p>
      )}
    </section>
  )
}
