import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSchoolHoliday, holidayOn } from '@/lib/learning/holidays'
import { getFamilyRegion } from '@/lib/learning/region'
import { nextTermTarget } from '@/lib/learning/term'
import { ukToday } from '@/lib/kid/five-a-day'
import KidHomework from '@/components/kid/KidHomework'

// The homework row, as somewhere to put the homework.
//
// It used to be a self tick that recorded nothing: no parent could see what was
// set, and the child got no credit for the work itself. Justin: "can it be they
// click and it's a free type note to store their homework, and if holidays let's
// just research our data on curriculum and just a quick summary what is coming
// up next term to get them prepared and they mark as read and it completes."
//
// So the row has two faces, and which one a child gets is decided by whether
// their school is out:
//
//   Term time   a note. Writing it is the completion.
//   Holidays    what is coming up when they go back, read off the curriculum
//               objectives we already hold. Reading it is the completion.
//
// The holiday face matters more than it looks. Setting homework in the holidays
// is the fastest way to make this row the thing a child dreads, and there is no
// homework to record anyway. A short, honest "here is what is next" is the
// version of preparation that does not cost a child their holiday.
//
// Same trust model as the rest of the child app: the link token is the auth,
// there is no account, and the token scopes everything to one child.

export const dynamic = 'force-dynamic'

export default async function KidHomeworkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links').select('user_id, child_id').eq('token', token).maybeSingle()
  if (!link) notFound()

  const { data: child } = await supabase
    .from('children').select('name, date_of_birth').eq('id', link.child_id).maybeSingle()

  const region = await getFamilyRegion(supabase, link.user_id).catch(() => 'uk' as const)
  const now = new Date()
  const onHoliday = isSchoolHoliday(now, region)
  const holidayTitle = holidayOn(now, region)?.title ?? null

  // What is already written for today, so reopening the row shows the note back
  // rather than an empty box that reads as a lost save.
  const { data: existing } = await supabase
    .from('kid_homework_notes').select('note')
    .eq('child_id', link.child_id).eq('day', ukToday()).maybeSingle()

  // The holiday summary, read off the curriculum objectives we already hold.
  //
  // Only attempted on a holiday and only when we know the child's birthday,
  // because the year group comes from it and a guessed year group would show a
  // child work that is not theirs. Missing either simply falls back to the note,
  // which is always a usable screen.
  let coming: { label: string; subjects: { subject: string; objectives: string[] }[] } | null = null
  const dob = (child as { date_of_birth?: string | null } | null)?.date_of_birth
  if (onHoliday && dob) {
    const target = nextTermTarget(new Date(dob), now)
    if (target) {
      const termName = target.term === 'autumn' ? 'Autumn' : target.term === 'spring' ? 'Spring' : 'Summer'
      // Objectives for that term, plus the ones marked 'all' which run across
      // the whole year. Capped per subject: this is a taster to take the fear
      // out of going back, not a syllabus to read on a beach.
      const { data: rows } = await supabase
        .from('curriculum_objectives')
        .select('subject, objective, term, sort_order')
        .eq('year_group', target.yearGroup)
        .in('term', [target.term, 'all'])
        .order('sort_order', { ascending: true })

      const bySubject = new Map<string, string[]>()
      for (const r of (rows ?? []) as { subject: string; objective: string }[]) {
        const list = bySubject.get(r.subject) ?? []
        if (list.length < 4) list.push(r.objective)
        bySubject.set(r.subject, list)
      }
      if (bySubject.size > 0) {
        coming = {
          label: `Year ${target.yearGroup}, ${termName} term`,
          subjects: [...bySubject.entries()].map(([subject, objectives]) => ({ subject, objectives })),
        }
      }
    }
  }

  return (
    <KidHomework
      token={token}
      childName={child?.name && child.name !== 'Your child' ? child.name : ''}
      note={(existing as { note?: string } | null)?.note ?? ''}
      holidayTitle={onHoliday ? holidayTitle : null}
      coming={coming}
    />
  )
}
