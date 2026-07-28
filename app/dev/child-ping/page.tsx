'use client'
import { useState } from 'react'
import ChildPing from '@/components/quests/ChildPing'

// Harness for the phone ping buttons. No auth.
//
// The real one is on the Quests board behind a login, which is how it sat at
// line 2109 of a 2283 line file for so long without anyone looking at it.
export default function Page() {
  const [result, setResult] = useState<string | null>(null)
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 18, padding: 16 }}>
        <ChildPing
          childName="Gus"
          result={result}
          onSend={m => setResult(m.startsWith('Time for bed')
            ? 'Their phone is not set up for pings yet. Open their quest link on their phone and tap Remind me about my quests.'
            : 'Ping sent ✓ It just landed on their phone.')}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7, marginTop: 14 }}>
        Time for bed fakes the not set up path, everything else fakes success.
      </p>
    </main>
  )
}
