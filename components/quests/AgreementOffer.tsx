'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// ── THE AGREEMENT MEETS THEM WHERE IT MAKES SENSE ───────────────────────────
//
// Justin, 18 August 2026: "let's remove the agreement as a fourth at setup, it
// might put off parents. Then when they come to add the first job per child
// they get the option to add an agreement, print it, and share it on the
// child's app."
//
// It was step one of setup, which is the worst place it could have been. It is
// the only thing in this product that needs the child in the room, fifteen
// minutes and an actual conversation, and it sat in front of three jobs that
// take a minute each. Four of the six agreements on the live product are signed
// by nobody: families started it because setup said to, and stopped, because it
// is not a thing you finish standing up.
//
// Here it is asked at the first moment a parent is genuinely setting a rule.
// They have just given their child a job worth stars, which is the exact
// question the agreement answers: what are the stars worth, and who decided.
//
// AN OFFER, NOT A STEP. Nothing is blocked, nothing is counted, no tick is
// waiting. It appears once there is at least one job and no signed agreement,
// and it stays until it is done or waved off, because a parent who is not ready
// on Tuesday might be ready on Sunday. Waving it off costs a week, not for ever:
// this is the best thing in the product and a family who never meets it is
// worse off, so it earns one reminder rather than one chance.

const SNOOZE_KEY = 'gc_agreement_offer_snoozed'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export default function AgreementOffer({ childName }: { childName: string | null }) {
  // null until localStorage has been read, which keeps the card off the first
  // paint rather than flashing it at somebody who waved it off yesterday.
  const [snoozedAt, setSnoozedAt] = useState<number | null>(null)
  useEffect(() => {
    try { setSnoozedAt(Number(localStorage.getItem(SNOOZE_KEY) ?? 0)) } catch { setSnoozedAt(0) }
  }, [])

  if (snoozedAt === null) return null
  if (snoozedAt > 0 && Date.now() - snoozedAt < WEEK_MS) return null

  const who = childName && childName !== 'Your child' ? childName : 'your child'

  function snooze() {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now())) } catch { /* private mode */ }
    setSnoozedAt(Date.now())
  }

  return (
    <div style={{
      background: 'var(--stage-2)', border: '1.5px solid var(--stage-2-bold)',
      borderRadius: 20, padding: '20px 20px 22px', marginBottom: '20px',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        margin: '0 0 6px',
      }}>
        While you are here
      </p>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
        letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', margin: '0 0 8px',
      }}>
        Agree what the stars are worth, together
      </h3>
      <p style={{
        fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6,
        margin: '0 0 16px', maxWidth: '52ch',
      }}>
        You have just set {who} a job worth stars. The family agreement is where
        you both decide what those stars buy, so the rule is one you chose
        together rather than one you handed down. Fifteen minutes at the kitchen
        table, then it prints for the fridge and lands on their app.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <Link
          href="/dashboard/agreement?from=quests"
          style={{
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            borderRadius: 16, padding: '13px 22px',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Build it together
        </Link>
        <button
          onClick={snooze}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
            color: 'var(--ink-muted)', textDecoration: 'underline', textUnderlineOffset: '3px',
            padding: '10px 8px',
          }}
        >
          Not this week
        </button>
      </div>
    </div>
  )
}
