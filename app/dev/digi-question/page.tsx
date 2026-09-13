import { notFound } from 'next/navigation'
import DigiQuestionCard from '@/components/home/DigiQuestionCard'
import IssueOfTheWeek from '@/components/home/IssueOfTheWeek'
import { pickIssue } from '@/lib/home/issue-of-week'

// Dev fixture: the two Home cards that changed on 13 September 2026, the
// once a day question from DiGi and the fix of the week down to its name
// and button. Never on the live site.
export default function DigiQuestionFixture() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') notFound()
  const pick = pickIssue('8-10', [], new Set(), 3)
  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px', fontFamily: 'var(--font-body)', background: 'var(--cream)', minHeight: '100dvh' }}>
      <DigiQuestionCard question="Quick one for tonight: when the timer ends, does Alma usually stop on her own or does the pushback start straight away?" childId={null} />
      {pick && <IssueOfTheWeek pick={{ ...pick, href: pick.script ? `/dashboard/scripts/${pick.script.sort_order}` : '/dashboard/digi' }} childName="Alma" />}
    </main>
  )
}
