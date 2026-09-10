import type { Metadata } from 'next'
import Dashboard from './Dashboard'

// The AI governance area. Sits under /hub, so it is already behind the school
// access gate (schools/lib/access.ts): /hub/* is not in OPEN_PATHS and adding
// it there is the only way this could leak, which is why nothing here touches
// that list.
//
// No server data is read on this route. Reviews live on the school's own
// device, so this file is a shell and the work is in the client component.

export const metadata: Metadata = {
  title: 'AI governance',
  description: 'Check an AI product before pupils or staff are asked to use it.',
  robots: { index: false, follow: false },
}

export default function AiGovernancePage() {
  return <Dashboard />
}
