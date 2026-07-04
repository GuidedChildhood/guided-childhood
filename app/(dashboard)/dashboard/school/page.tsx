import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SchoolSetup from '@/components/school/SchoolSetup'

// The school email switch on flow: the letterbox pitch, the source form,
// the private forwarding address with provider steps (Gmail verification
// code surfaced in flow), and the connection management view. All the
// interaction lives in the client component; this page only guards auth.

export default async function SchoolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <SchoolSetup />
    </div>
  )
}
