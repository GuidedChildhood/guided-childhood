import WorkingOn from '@/components/tracker/WorkingOn'

// A harness for the moments list with its tools (28 September 2026). The real
// page, /dashboard/pathway/moments, needs a signed in family; this feeds the
// same component three rows shaped like Teo's, one with a climbing rating.

export const dynamic = 'force-dynamic'

export default function DevMomentsToResolve() {
  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
      <WorkingOn
        concerns={[
          { slug: 'bedtime-screens', label: 'Bedtime screens', status: 'open', times_flagged: 4, from: 3, now: 6 },
          { slug: 'wont-put-down', label: 'Won’t put it down', status: 'open', times_flagged: 2, from: null, now: null },
          { slug: 'morning-tv', label: 'Morning TV', status: 'improving', times_flagged: 1, from: 5, now: 8, silver: true },
        ]}
        solvedAlready={2}
        childName="Teo"
        parentEmail="parent@example.com"
      />
    </div>
  )
}
