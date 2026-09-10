import { notFound } from 'next/navigation'
import SavingPathway from '@/components/starter/SavingPathway'

// Dev fixture: the screen a parent sees between tapping Continue with Google
// and landing in the product.
//
//   /dev/starter-finishing            with the child's name off the blob
//   /dev/starter-finishing?name=      the fallback, when the blob had no name
//
// It cannot be reached by walking the funnel: it needs a live session arriving
// back from a provider, and the session lookup answers from storage in under a
// frame whenever there is not one. Two attempts to catch it in place on 10
// September 2026 caught the screen after it, which is how it ended up here.

export default async function StarterFinishingFixture({
  searchParams,
}: { searchParams: Promise<{ name?: string }> }) {
  // Never on the live site, the same gate every other fixture here uses.
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') notFound()
  const { name } = await searchParams
  return <SavingPathway childName={name === undefined ? 'Nia' : name} />
}
