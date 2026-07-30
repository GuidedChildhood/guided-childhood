'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import KidAskForJob, { type KidAsk } from '@/components/kid/KidAskForJob'
import KidRemindersPrompt from '@/components/kid/KidRemindersPrompt'

// Fixture reference page: the child's Ask for a job page and the reminders
// prompt, with made up props, so both can be screenshotted without a database.
// Not linked from anywhere.
//
// ?view=empty shows the page a child sees the very first time, which is the one
// that has to read well: no ideas asked yet, nothing waiting, and still obvious
// what to do. It also swaps the reminders prompt to its iPhone variant, where
// the app has to reach the Home Screen before reminders are possible at all.
//
// A client component because KidRemindersPrompt takes an onEnable handler and a
// server fixture cannot pass a function across that boundary. The real screen is
// already a client component, so this is a fixture concern only.

const ASKS: KidAsk[] = [
  { id: 'a1', title: 'Wash the car', emoji: '🚗', status: 'pending' },
  { id: 'a2', title: 'Help with dinner', emoji: '🍽️', status: 'added' },
  { id: 'a3', title: 'Walk to the shop', emoji: '🛒', status: 'declined' },
]

function Fixture() {
  const empty = useSearchParams().get('view') === 'empty'
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <KidRemindersPrompt state={empty ? 'ios' : 'offer'} onEnable={() => {}} childName="Alfie" />

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 6vw, 1.9rem)', color: '#F7F7F5', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 10px' }}>
          Ask for a job
        </h1>
        <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: '0 0 20px' }}>
          Think of something you could do to help, Alfie. Your grown up gets it on their phone and can turn it into a real job with stars.
        </p>

        <KidAskForJob token="000000000000000000" initialAsks={empty ? [] : ASKS} childName="Alfie" />
      </div>
    </div>
  )
}

export default function RefKidSuggest() {
  return <Suspense><Fixture /></Suspense>
}
