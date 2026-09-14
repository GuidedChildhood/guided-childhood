'use client'
import { notFound } from 'next/navigation'
import KidError from '@/app/k/[token]/error'

// Dev only fixture: the child's crash recovery screen, which is otherwise
// only reachable by actually crashing. Never in production.
export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound()
  // The boundary reads the child's token off the address bar in production.
  // A fixture cannot fake that (the router rewrites the URL on hydration), so
  // it hands the same value in directly instead.
  return <KidError error={new Error('fixture')} reset={() => {}} pathname="/k/0123456789abcdef01/ask" />
}
