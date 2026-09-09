'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ResultScreen from '@/app/(marketing)/starter-pack/ResultScreen'
import { getStageFromAgeBand } from '@/lib/content/stages'

// Layout fixture for the starter quiz reveal, the last screen before we ask a
// parent for money.
//
// It exists because the reveal is only reachable by completing the quiz, which
// ends in a Supabase signup, so the one screen with the most riding on it was
// also the one screen nobody could open and look at. There is a
// ?preview=result path on the real page but it is gated to NODE_ENV
// development, and this container cannot hydrate a dev server, so it is
// unreachable exactly when it is needed.
//
// The fixture family deliberately ticks Something else and types a worry in
// their own words, because that is the path that was broken (their words were
// captured in the quiz and never passed to this screen) and a fixture that
// only covers the tidy case would not have caught it.
//
// Same as every other ref-* page: real component, fake data, 404 in production
// via middleware.

// ?risk=1 renders the same screen with a typed worry that trips the gate in
// lib/concerns/risk, because the path where a parent types something
// frightening is the one that most needs looking at and the one nobody would
// ever reach by accident.
function Reveal() {
  const risk = useSearchParams().get('risk') === '1'
  const stage = getStageFromAgeBand('11-13')
  return (
    <ResultScreen
      stage={stage}
      accent={{ bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' }}
      challenge="mood_changes"
      worry="something_else"
      worries={['something_else', 'mood_after_screens', 'social_media']}
      worryOther={risk ? 'she said she doesn\u2019t want to be here any more' : 'speaking on phone a lot as friend has a new one'}
      feeling="anxious"
      childName="Alma"
    />
  )
}

export default function RefReveal() {
  return <Suspense><Reveal /></Suspense>
}
