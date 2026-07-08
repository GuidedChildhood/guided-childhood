import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CURRICULUM, CHARACTERS } from '@/lib/content/schools-curriculum'

// THE PRINT ROOM: every printable for every live module in one place.
// Paper pack, pupil booklets, and named quizzes per class. No Canva,
// no downloads folder: everything generates from the lesson row and
// prints from the browser.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
  color: 'var(--green-dark)', textDecoration: 'none',
  border: '1.5px solid var(--border)', borderRadius: '12px',
  padding: '8px 14px', background: '#fff',
}

export default async function PrintRoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('school_educators')
    .select('school_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()
  if (!membership) redirect('/educator')

  const [{ data: lessons }, { data: classes }] = await Promise.all([
    supabase.from('school_lessons').select('module_id, title, key_stage, year_band').order('sort_order'),
    supabase.from('school_classes').select('id, name').eq('school_id', membership.school_id).order('created_at'),
  ])

  const manifestByModule = new Map(CURRICULUM.map(m => [m.moduleId, m]))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '4px' }}>Everything on paper, one place</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
          The print room
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '560px', marginBottom: '30px' }}>
          Every pack generates from the lesson itself, so a wording change updates every page.
          Print from your browser: the paper pack for the classroom, colour booklets per pupil,
          and quizzes with your pupils&rsquo; names already on them.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(lessons ?? []).map(l => {
            const manifest = manifestByModule.get(l.module_id)
            const ch = manifest ? CHARACTERS[manifest.character] : null
            return (
              <div key={l.module_id} style={{
                background: '#fff', border: `2px solid ${ch?.accent ?? 'var(--border)'}`,
                borderRadius: '22px', padding: '18px 20px',
                boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  {ch && <span style={{ fontSize: '18px' }}>{ch.emblem}</span>}
                  <span style={eyebrow}>{l.key_stage} · {l.year_band}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', marginBottom: '12px' }}>
                  {l.title}
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link href={`/educator/print/${l.module_id}`} style={linkStyle}>Paper pack</Link>
                  <Link href={`/educator/print/${l.module_id}/booklet`} style={linkStyle}>Pupil booklet</Link>
                  <Link href={`/educator/print/${l.module_id}/organiser`} style={linkStyle}>Knowledge organiser</Link>
                  <Link href={`/educator/print/${l.module_id}/overview`} style={linkStyle}>Unit overview</Link>
                  {(classes ?? []).map(c => (
                    <Link key={c.id} href={`/educator/print/${l.module_id}/quiz/${c.id}`} style={linkStyle}>
                      Named quizzes · {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
          {(lessons ?? []).length === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)' }}>
              No live modules yet. Packs appear here the moment a module ships.
            </p>
          )}

          {(classes ?? []).length > 0 && (
            <div style={{
              background: 'var(--warm)', border: '2px solid var(--gold)',
              borderRadius: '20px', padding: '18px 20px',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', marginBottom: '4px' }}>
                Certificates 🏆
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '12px' }}>
                The Digital Detective Award, one per pupil with names already printed.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(classes ?? []).map(c => (
                  <Link key={c.id} href={`/educator/print/certificates/${c.id}`} style={linkStyle}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
