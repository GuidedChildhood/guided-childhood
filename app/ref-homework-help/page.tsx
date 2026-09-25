'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import KidHomework from '@/components/kid/KidHomework'

// Layout fixture for the child's homework screen with homework help
// (components/kid/HomeworkHelp). ?young=1 shows the under 10 face, which asks
// the grown up. The browser check answers /api/kid/homework-help itself.
//
// 404s in production via middleware, like every other ref- page.

function Fixture() {
  const young = useSearchParams().get('young') === '1'
  return <KidHomework token="000000000000000000" childName="Teo" note="" holidayTitle={null} coming={null} canHint={!young} />
}

export default function RefHomeworkHelp() {
  return <Suspense fallback={null}><Fixture /></Suspense>
}
