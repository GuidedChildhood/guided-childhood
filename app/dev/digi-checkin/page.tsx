import { notFound } from 'next/navigation'
import DigiDeviceCheckin from '@/components/digi/DigiDeviceCheckin'

// Dev only fixture: renders the device check in card with sample data so
// the design can be checked without a signed in parent or session history.
// Never reachable in production.

export const dynamic = 'force-dynamic'

const FIXTURES = [
  {
    promptId: 'console_heavy',
    childId: 'fixture-child-1',
    childName: 'Alfie',
    device: 'console',
    question: "I can see the console is Alfie's favourite. Is coming off it calm, or is it turning into a fight?",
    chatMessage: "The console is Alfie's favourite by a distance and coming off it is the hard part.",
    pathway: { label: 'Open the come off the game script', href: '/dashboard/scripts' },
  },
  {
    promptId: 'new_device',
    childId: 'fixture-child-2',
    childName: 'Maya',
    device: 'console',
    question: 'First week with the console I see. Want the set up guide and the words for time on it?',
    chatMessage: 'We have a new console in the house and Maya loves it already.',
    pathway: { label: 'Open the device set up guides', href: '/dashboard/devices' },
  },
  {
    promptId: 'over_guide',
    childId: 'fixture-child-3',
    childName: 'Maya',
    device: null,
    question: 'Screen ran ahead of the healthy amount for Maya this week. Want to look at it together?',
    chatMessage: "Maya's screen time ran ahead of the healthy guide for her age this week.",
    pathway: { label: 'Write the deal down together', href: '/dashboard/agreement' },
  },
]

export default function DigiCheckinFixturePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', background: 'var(--cream)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', marginBottom: 20 }}>
        Device check in fixtures
      </h1>
      {FIXTURES.map(f => <DigiDeviceCheckin key={f.promptId} fixture={f} />)}
    </main>
  )
}
