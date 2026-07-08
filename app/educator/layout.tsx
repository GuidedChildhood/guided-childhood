import { createClient } from '@/lib/supabase/server'
import EducatorNav from '@/components/educator/EducatorNav'

// Shared shell for the whole educator workspace: the top bar with the
// school name and one consistent way to Home, the Curriculum map and the
// Print room. Auth redirects stay in each page (some pages have their own
// no membership states to render).

export default async function EducatorLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let schoolName: string | undefined
  if (user) {
    const { data: membership } = await supabase
      .from('school_educators')
      .select('school_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
    if (membership) {
      const { data: school } = await supabase
        .from('school_accounts')
        .select('name')
        .eq('id', membership.school_id)
        .maybeSingle()
      schoolName = school?.name
    }
  }

  return (
    <>
      <EducatorNav schoolName={schoolName} />
      {children}
    </>
  )
}
