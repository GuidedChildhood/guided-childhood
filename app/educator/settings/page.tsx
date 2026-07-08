import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateProfile, updateSchool } from '../actions'
import { panel, eyebrow, sectionEyebrow, input, label, btnGold, h1 } from '@/components/educator/ui'

// Settings: who you are and what your school is. Class and pupil edits
// live on each class page, where the context is. Data minimisation holds:
// your display name is yours, pupils stay first name and initial only.

const ROLES = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'lead', label: 'PSHE lead' },
  { value: 'dsl', label: 'Designated Safeguarding Lead' },
  { value: 'head', label: 'Head or SLT' },
]
const PHASES = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'all_through', label: 'All through' },
  { value: 'special', label: 'Special' },
  { value: 'other', label: 'Other' },
]

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { saved, error } = await searchParams

  const { data: membership } = await supabase
    .from('school_educators')
    .select('school_id, role, display_name')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()
  if (!membership) redirect('/educator')

  const { data: school } = await supabase
    .from('school_accounts')
    .select('name, phase, urn')
    .eq('id', membership.school_id)
    .maybeSingle()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '28px 20px 90px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/educator" style={{ ...eyebrow, textDecoration: 'none' }}>← Workspace</Link>
        <h1 style={{ ...h1, margin: '14px 0 6px' }}>Settings</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '22px' }}>
          Your details and your school. To rename a class or edit pupils, open the class and use Edit there.
        </p>

        {saved && (
          <div style={{ background: 'var(--green-lt)', border: '2px solid var(--green-dark)', borderRadius: '14px', padding: '12px 16px', marginBottom: '18px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--green-dark)' }}>
            Saved.
          </div>
        )}
        {error && (
          <div style={{ background: 'var(--coral-lt)', border: '2px solid var(--coral)', borderRadius: '14px', padding: '12px 16px', marginBottom: '18px', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--coral-dark, #8F3F04)', lineHeight: 1.55, overflowWrap: 'anywhere' }}>
            {error}
          </div>
        )}

        {/* You */}
        <form action={updateProfile} style={{ ...panel, marginBottom: '16px' }}>
          <div style={sectionEyebrow}>You</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={label}>
              Your name
              <input name="display_name" defaultValue={membership.display_name ?? ''} placeholder="Ms Okafor" style={{ ...input, marginTop: '6px' }} />
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                Shown on your dashboard greeting. However you like to be addressed at school.
              </span>
            </label>
            <label style={label}>
              Your role
              <select name="role" defaultValue={membership.role} style={{ ...input, marginTop: '6px' }}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </label>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)' }}>
              Signed in as {user.email}
            </div>
            <button type="submit" style={{ ...btnGold, alignSelf: 'flex-start' }}>Save your details</button>
          </div>
        </form>

        {/* Your school */}
        <form action={updateSchool} style={panel}>
          <div style={sectionEyebrow}>Your school</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={label}>
              School name
              <input name="name" required defaultValue={school?.name ?? ''} placeholder="St Example Primary" style={{ ...input, marginTop: '6px' }} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={label}>
                Phase
                <select name="phase" defaultValue={school?.phase ?? 'primary'} style={{ ...input, marginTop: '6px' }}>
                  {PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </label>
              <label style={label}>
                URN <span style={{ fontWeight: 400, color: 'var(--ink-muted)' }}>optional</span>
                <input name="urn" defaultValue={school?.urn ?? ''} placeholder="123456" style={{ ...input, marginTop: '6px' }} />
              </label>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--ink-muted)' }}>
              The DfE unique reference number, used on your coverage reports. You can add it later.
            </span>
            <button type="submit" style={{ ...btnGold, alignSelf: 'flex-start' }}>Save the school</button>
          </div>
        </form>
      </div>
    </main>
  )
}
