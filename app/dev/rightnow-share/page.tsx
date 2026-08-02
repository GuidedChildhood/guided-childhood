'use client'

import { useState } from 'react'
import ShareWithChildPanel, { type ShareChild } from '@/components/rightnow/ShareWithChildPanel'

// Layout harness for Share with your child. No auth, no script row, no
// meltdown needed: every state the panel can be in, side by side, at a real
// phone width. The blocked states are the ones worth looking at, because they
// are what a parent sees when the age gate refuses a card.

const KIDS: ShareChild[] = [
  { id: 'a', name: 'Alma', onApp: true, canSend: true, reason: null },
  { id: 'b', name: 'Teo', onApp: true, canSend: true, reason: null },
]

const NOTE = 'I know it is hard to stop when you are in the middle of something good. You did stop, and that took a lot. Tell me about it at tea.'

function Case({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '8px' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export default function Page() {
  const [note, setNote] = useState(NOTE)
  const noop = () => {}

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>
        <Case label="Ready to send, one child">
          <ShareWithChildPanel
            kids={[KIDS[0]]} kidId="a" note={note} blocked={null} busy={false} sent={null}
            onNote={setNote} onPick={noop} onSend={noop} onCancel={noop} onCopy={noop}
          />
        </Case>

        <Case label="Two children on the app">
          <ShareWithChildPanel
            kids={KIDS} kidId="a" note={NOTE} blocked={null} busy={false} sent={null}
            onNote={noop} onPick={noop} onSend={noop} onCancel={noop} onCopy={noop}
          />
        </Case>

        <Case label="DiGi is writing it">
          <ShareWithChildPanel
            kids={KIDS} kidId="a" note="" blocked={null} busy sent={null}
            onNote={noop} onPick={noop} onSend={noop} onCancel={noop} onCopy={noop}
          />
        </Case>

        <Case label="Blocked, card is for an older child">
          <ShareWithChildPanel
            kids={KIDS} kidId="a" note="" busy={false} sent={null}
            blocked="This card is written for an older child, so it is not going to Alma's screen. Read it through with them instead."
            onNote={noop} onPick={noop} onSend={noop} onCancel={noop} onCopy={noop}
          />
        </Case>

        <Case label="No child on the app">
          <ShareWithChildPanel
            kids={[]} kidId={null} note="" blocked={null} busy={false} sent={null}
            onNote={noop} onPick={noop} onSend={noop} onCancel={noop} onCopy={noop}
          />
        </Case>

        <Case label="Sent">
          <ShareWithChildPanel
            kids={KIDS} kidId="a" note={NOTE} blocked={null} busy={false} sent="Alma"
            onNote={noop} onPick={noop} onSend={noop} onCancel={noop} onCopy={noop}
          />
        </Case>
      </div>
    </main>
  )
}
