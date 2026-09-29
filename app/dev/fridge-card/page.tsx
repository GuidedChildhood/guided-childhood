'use client'

import { useEffect, useState } from 'react'
import ScriptFridgeCard from '@/components/rightnow/ScriptFridgeCard'

// Harness for the script fridge card (29 September 2026). The card only shows
// in print, so press Cmd P here, or ?crisis=1 for the crisis wording. The
// words are the whining card from Justin's screenshot, one of the longest.

export default function DevFridgeCard() {
  const [ready, setReady] = useState(false)
  const [crisis, setCrisis] = useState(false)
  useEffect(() => { setCrisis(new URLSearchParams(location.search).has('crisis')); setReady(true) }, [])
  return (
    <div style={{ padding: 24, fontFamily: 'var(--font-body)' }}>
      <p>Print this page to see the fridge card.</p>
      {ready && (
        <ScriptFridgeCard
          moment="Whining"
          script={{
            title: 'When the whining starts',
            say_this: 'I can hear that something feels hard for you right now. It sounds like you really want me to listen. I do want to hear you, and my ears work best with your normal voice. Take a breath, then tell me again and I am all yours.',
            not_this: 'Do not say stop whining or I am not listening to you, because it shames the feeling and invites a power struggle instead of teaching a better way to ask.',
            crisis,
          }}
        />
      )}
    </div>
  )
}
