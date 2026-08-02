'use client'

import DigiWondering from '@/components/digi/DigiWondering'

// Layout harness for DiGi's wondering card. The interesting state is the one
// after a parent answers, which is where DiGi's reply now lands instead of a
// thank you, so this page exists to be driven with the feedback API stubbed:
// GET null so the question shows, POST returning an insight, or POST returning
// none so the fallback line can be read too.
export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <DigiWondering />
      </div>
    </main>
  )
}
