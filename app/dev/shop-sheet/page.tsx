'use client'

import { useState } from 'react'
import MonthlyShopSheet from '@/components/shop/MonthlyShopSheet'

// Dev harness for the monthly shop sheet.
//
// The real one shows on the 12th, once, after a delay, behind the popup lock and
// only to a family who has checked in. That is four gates and a clock, so on any
// other day of the month there is no way to look at it at all. This clears the
// month stamp and remounts, which is the one thing the fixture has to be able to
// do; the gates themselves are checked by reading the component, not by waiting
// three weeks.

export default function ShopSheetDevPage() {
  const [n, setN] = useState(0)
  const [note, setNote] = useState('')

  function show() {
    try {
      localStorage.removeItem('gc_shop_sheet_month')
      sessionStorage.removeItem('gc_popup_open')
    } catch { /* private mode */ }
    setNote('Stamp cleared. It still waits out its delay, about a fifth of a second here, where the live app waits seventy.')
    setN(x => x + 1)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '28px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>Dev fixture</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.1rem)', color: 'var(--ink)', margin: '0 0 10px' }}>
          The monthly shop sheet
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px', maxWidth: '60ch' }}>
          On the live app this shows on the 12th only, once that month, after the
          greeting and the setup toast have had their turn, and never to a family
          who has not checked in yet. Here you can clear the month stamp and watch
          it come round again.
        </p>

        <button
          onClick={show}
          style={{
            background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
            borderRadius: 16, padding: '13px 22px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Clear the month stamp and show it again
        </button>

        {note && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '12px' }}>
            {note}
          </p>
        )}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '20px' }}>
          Today is {new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' })}.
          On the live app it only fires on the 12th; this fixture forces it so it can be checked on any day.
        </p>
      </div>

      <MonthlyShopSheet key={n} childName="Olga" devForce />
    </div>
  )
}
