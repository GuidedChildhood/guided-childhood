'use client'

import { useRouter } from 'next/navigation'
import WelcomeWalkthrough from '@/components/onboarding/WelcomeWalkthrough'

// The seven cards, no celebration, and every way out goes back to Settings.

export default function HowItWorksClient({ childName }: { childName: string }) {
  const router = useRouter()
  return (
    <WelcomeWalkthrough
      childName={childName}
      celebrate={false}
      onFinish={dest => router.push(dest === 'checkin' ? '/dashboard' : '/dashboard/settings')}
    />
  )
}
