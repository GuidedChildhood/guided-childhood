import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSchool, createClass } from './actions'

// The educator workspace home (Phase 2, spec section 11).
// No school yet: a two field setup form. With a school: Plan view,
// classes on the left of the flow, the module list as the year plan.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const card: React.CSSProperties = {
  background: 'var(--warm)', border: '1.5px solid var(--border)',
  borderRadius: '20px', padding: '22px',
}
const input: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: '12px',
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
  fontSize: '15px', background: '#fff', color: 'var(--ink)',
}
const chunkyButton: React.CSSProperties = {
  display: 'inline-block', padding: '12px 22px', borderRadius: '16px',
  background: 'var(--gold)', color: 'var(--ink)', border: 'none',
  boxShadow: '0 5px 0 var(--gold-hover)', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
}

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div style={{
      background: 'var(--coral-lt)', border: '2px solid var(--coral)', borderRadius: '16px',
      padding: '14px 18px', marginBottom: '20px', fontFamily: 'var(--font-body)',
      fontSize: '14px', color: 'var(--coral-dark)', lineHeight: 1.6, overflowWrap: 'anywhere',
    }}>
      <strong style={{ display: 'block', marginBottom: '4px' }}>Something went wrong</strong>
      {message}
    </div>
  )
}

export default async function EducatorHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error: errorMessage } = await searchParams

  const { data: membership, error: membershipError } = await supabase
    .from('school_educators')
    .select('school_id, role, school_accounts(name, phase, licence_tier)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const combinedError = [errorMessage, membershipError ? `Loading your school failed: ${membershipError.message}` : null]
    .filter(Boolean).join(' · ')

  if (!membership) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={eyebrow}>Guided Childhood Schools</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '8px 0 10px' }}>
            Set up your school
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '24px' }}>
            Two fields and you are in. You become the school lead; colleagues can be added later.
          </p>
          <ErrorBox message={combinedError || undefined} />
          <form action={createSchool} style={{ ...card, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              School name
              <input name="name" required placeholder="St Example Primary" style={{ ...input, marginTop: '6px' }} />
            </label>
            <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              Phase
              <select name="phase" style={{ ...input, marginTop: '6px' }}>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="all_through">All through</option>
                <option value="special">Special</option>
                <option value="other">Other</option>
              </select>
            </label>
            <button type="submit" style={chunkyButton}>Create school</button>
          </form>
        </div>
      </main>
    )
  }

  // The embed can be an object, an array, or null (null when the read
  // policy on school_accounts is missing, the half-installed database
  // case). Never crash on it: normalise and fall back to a repair notice.
  const rawSchool = membership.school_accounts as unknown
  const school = (Array.isArray(rawSchool) ? rawSchool[0] : rawSchool) as
    { name: string; phase: string; licence_tier: string } | null | undefined

  if (!school) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '48px 20px' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={eyebrow}>Guided Childhood Schools</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 4.5vw, 1.9rem)', color: 'var(--ink)', margin: '8px 0 12px' }}>
            Your school exists but cannot be read
          </h1>
          <ErrorBox message={combinedError || 'Your educator record was found but the school row could not be read. This means the database security rules are only partially installed. Run the repair migration 026_schools_repair.sql in the Supabase SQL Editor, then reload this page.'} />
        </div>
      </main>
    )
  }

  const [{ data: classes }, { data: lessons }] = await Promise.all([
    supabase.from('school_classes').select('id, name, year_group, class_code').eq('school_id', membership.school_id).order('created_at'),
    supabase.from('school_lessons').select('id, module_id, title, key_stage, year_band, single_action_outcome').order('sort_order'),
  ])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={eyebrow}>Guided Childhood Schools · {school.licence_tier === 'pilot' ? 'Pilot' : 'Licensed'}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '8px 0 28px' }}>
          {school.name}
        </h1>
        <ErrorBox message={combinedError || undefined} />

        <section style={{ marginBottom: '36px' }}>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>Your classes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(classes ?? []).map(c => (
              <Link key={c.id} href={`/educator/classes/${c.id}`} style={{ ...card, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)' }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-muted)', marginLeft: '10px' }}>{c.year_group}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--green-dark)', background: 'var(--green-lt)', padding: '4px 10px', borderRadius: '8px' }}>{c.class_code}</span>
              </Link>
            ))}
            {(classes ?? []).length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>No classes yet. Add your first below.</p>
            )}
          </div>

          <details style={{ marginTop: '16px' }}>
            <summary style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--green-dark)', cursor: 'pointer' }}>Add a class</summary>
            <form action={createClass} style={{ ...card, marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="hidden" name="school_id" value={membership.school_id} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                  Class name
                  <input name="name" required placeholder="8B" style={{ ...input, marginTop: '6px' }} />
                </label>
                <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                  Year group
                  <input name="year_group" required placeholder="Year 8" style={{ ...input, marginTop: '6px' }} />
                </label>
              </div>
              <label style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                Pupils, one per line, first name and initial only
                <textarea name="pupils" rows={6} placeholder={'Amara K\nBen T\nChloe M'} style={{ ...input, marginTop: '6px', resize: 'vertical' }} />
              </label>
              <button type="submit" style={chunkyButton}>Create class</button>
            </form>
          </details>
        </section>

        <section>
          <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '12px' }}>The scheme of work</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(lessons ?? []).map(l => (
              <div key={l.id} style={card}>
                <div style={{ ...eyebrow, marginBottom: '6px' }}>{l.key_stage} · {l.year_band}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', marginBottom: '6px' }}>{l.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '12px' }}>{l.single_action_outcome}</div>
                <span style={{ display: 'flex', gap: '18px' }}>
                  <Link href="/educator/preview" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--green-dark)', textDecoration: 'none' }}>
                    Preview the lesson →
                  </Link>
                  <Link href={`/educator/print/${l.module_id}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--gold-dark)', textDecoration: 'none' }}>
                    Print the paper pack →
                  </Link>
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-light)', marginTop: '16px', lineHeight: 1.6 }}>
            One module live in the pilot preview. The full scheme (21 modules, EYFS to Year 13) lands after the reference lesson is approved.
          </p>
        </section>
      </div>
    </main>
  )
}
