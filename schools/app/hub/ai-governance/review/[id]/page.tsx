import type { Metadata } from 'next'
import Review from './Review'

// One tool's review. Behind the school access gate with the rest of /hub.
//
// The id in the path is a local identifier for a record on this device, not a
// key into anything of ours. There is no row to fetch and no tenancy to check,
// because nothing about a school's review reaches our server at all.

export const metadata: Metadata = {
  title: 'AI tool review',
  robots: { index: false, follow: false },
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <Review id={id} />
}
