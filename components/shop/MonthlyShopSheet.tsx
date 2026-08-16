'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isShopDay } from '@/lib/home/next-up'
import { POPUP_DELAY, openPopup, closePopup, whenClear } from '@/lib/ui/popupQueue'

// THE SHOP, ONCE A MONTH, AND ONLY ONCE.
//
// Justin's original job: "A shop icon joins the daily rotation once a month,
// never as the daily lead."
//
// The ROTATION half of that shipped on 13 August: lib/home/next-up.ts carries a
// MONTHLY tier that sits between the two items which jump the queue and the
// eleven that take turns, so the shop can never be the daily lead. This is the
// other half, the one that actually gets seen, because a card under Today on the
// 12th is still a card a busy parent scrolls past.
//
// ── WHY IT REUSES isShopDay RATHER THAN KEEPING ITS OWN DATE ────────────────
//
// One definition of "the 12th, in London". Two would drift the first time
// anybody moved it, and the failure would be silent and strange: the card under
// Today appearing on one day and the sheet on another, which reads as the app
// being confused about what month it is.
//
// ── AND WHY A DATE ALONE IS NOT ENOUGH ──────────────────────────────────────
//
// isShopDay is true for the WHOLE of the 12th, so a parent who opens the app
// three times that day would meet this three times. The month stamp below is
// what makes "once a month" true rather than "once a day, one day a month".
// Dismissing counts: closing a shop sheet IS an answer, the same reading
// InstallPrompt settled on after Justin said its three day snooze was "annoying".
//
// It takes the shared popup lock, so it queues behind DiGi's greeting and the
// setup toast instead of landing on top of them. It sits last in the delay
// order on purpose: a greeting and an unlocked feature both matter more to a
// parent's day than a shop does.

const SEEN_KEY = 'gc_shop_sheet_month'

/** Year and month in London, so the stamp turns over with the shop day. */
function londonMonth(now = new Date()): string {
  return now.toLocaleDateString('en-CA', { timeZone: 'Europe/London' }).slice(0, 7)
}

export default function MonthlyShopSheet({ childName, devForce = false }: {
  childName?: string | null
  /**
   * Skip the day check and the delay. ONLY for app/dev/shop-sheet.
   *
   * Without it this component is unlookable for eleven months of the year: it
   * fires on the 12th, once, after about seventy seconds. A fixture that can
   * only be used on one day is a fixture nobody uses, and the alternative is
   * checking the design by reading the code, which is how four things were
   * misdiagnosed on this project already. /dev 404s on the live deployment.
   *
   * It does NOT skip the month stamp, so the fixture still proves the thing
   * most likely to be got wrong, which is that it shows once and stops.
   */
  devForce?: boolean
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!devForce && !isShopDay()) return
    let seen: string | null = null
    try { seen = localStorage.getItem(SEEN_KEY) } catch { return /* private mode: never nag */ }
    if (seen === londonMonth()) return

    // Behind the greeting and the toast. 69 seconds is the next step in the
    // ladder in popupQueue, and the lock means the number is a floor rather
    // than an appointment: if the toast is still up this waits for it.
    return whenClear(devForce ? 200 : POPUP_DELAY.coach + 3_000, () => {
      openPopup('shop')
      setOpen(true)
    })
  }, [devForce])

  // Written when it is SHOWN, not when it is acted on, so closing it, tapping
  // through and ignoring it all cost the same month.
  function dismiss() {
    try { localStorage.setItem(SEEN_KEY, londonMonth()) } catch { /* private mode */ }
    closePopup('shop')
    setOpen(false)
  }

  if (!open) return null

  const name = childName && childName !== 'Your child' ? childName : 'your child'

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 130,
        background: 'rgba(26,26,46,0.5)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="The printed passport"
        style={{
          width: 'min(100%, 480px)', background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '22px 22px calc(20px + env(safe-area-inset-bottom))',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
          <button
            onClick={dismiss}
            aria-label="Close"
            style={{
              width: 34, height: 34, borderRadius: '50%', border: 'none',
              background: 'var(--cream)', cursor: 'pointer',
              fontSize: 'var(--text-lg)', color: 'var(--ink-muted)', lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* The Planet Friends are what is being sold, so they are the picture.
            The email sized copies rather than the 512 square app art: this is a
            small sheet on a phone and the big ones are 122 to 141 KB each. */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '12px' }} aria-hidden>
          {['pebble', 'bloop', 'orbit', 'nova', 'cosmo'].map((k, i) => (
            <img
              key={k}
              src={`/digi-squad/friends/email/${k}.png`}
              alt=""
              width={56}
              height={56}
              style={{ width: 56, height: 56, marginLeft: i === 0 ? 0 : -8 }}
            />
          ))}
        </div>

        <p className="eyebrow" style={{ textAlign: 'center', margin: '0 0 6px' }}>Once a month</p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
          color: 'var(--ink)', letterSpacing: '-0.02em', textAlign: 'center', margin: '0 0 8px',
        }}>
          {name}&apos;s passport, printed
        </h2>
        <p style={{
          fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55,
          textAlign: 'center', margin: '0 0 18px',
        }}>
          Their real one as a little booklet, every stamp they have earned in it, and
          the Planet Friends sticker sheet to go with it. We only mention this once a month.
        </p>

        {/* The shop lives at /dashboard/keepsakes again. This sheet was built
            while the passport was briefly a tabbed page with the shop as a
            tab; that design was reversed the same day, and the tab URL is now
            only a redirect kept for links already in the wild. New surfaces
            link the real page. */}
        <Link
          href="/dashboard/keepsakes"
          onClick={dismiss}
          style={{
            display: 'block', textAlign: 'center', background: 'var(--terracotta)',
            color: 'var(--ink)', borderRadius: 16, padding: '15px 22px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Have a look
        </Link>

        {/* Subway's pattern, and it is the honest one: the second choice is a
            plain full width button rather than a grey whisper under the first.
            A shop sheet that makes "no" hard to find is the kind of thing this
            product does not do. */}
        <button
          onClick={dismiss}
          style={{
            display: 'block', width: '100%', marginTop: '10px',
            background: 'none', border: 'none', cursor: 'pointer', padding: '13px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'var(--ink-muted)',
          }}
        >
          Not this month
        </button>
      </div>
    </div>
  )
}
