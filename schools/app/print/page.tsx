import { anon as supabase } from '@/lib/supabase/anon'
import Link from 'next/link'
import { CURRICULUM, CHARACTERS } from '@gc/shared/schools-curriculum'

// THE PRINT ROOM: every printable for every live module in one place.
// Paper pack, pupil booklets, and named quizzes per class. No Canva,
// no downloads folder: everything generates from the lesson row and
// prints from the browser.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
  color: 'var(--green-dark)', textDecoration: 'none',
  border: '1.5px solid var(--border)', borderRadius: '12px',
  padding: '8px 14px', background: '#fff',
}

export const revalidate = 3600

export default async function PrintRoomPage() {

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band')
    .order('sort_order')

  const manifestByModule = new Map(CURRICULUM.map(m => [m.moduleId, m]))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: '4px' }}>Everything on paper, one place</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', color: 'var(--ink)', letterSpacing: '-0.01em', margin: '0 0 10px' }}>
          The print room
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '560px', marginBottom: '30px' }}>
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
                  {ch && <span style={{ fontSize: 'var(--text-lg)' }}>{ch.emblem}</span>}
                  <span style={eyebrow}>{l.key_stage} · {l.year_band}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '12px' }}>
                  {l.title}
                </h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Link href={`/print/${l.module_id}`} style={linkStyle}>Paper pack</Link>
                  <Link href={`/print/${l.module_id}/booklet`} style={linkStyle}>Pupil booklet</Link>
                  <Link href={`/print/${l.module_id}/organiser`} style={linkStyle}>Knowledge organiser</Link>
                  <Link href={`/print/${l.module_id}/overview`} style={linkStyle}>Unit overview</Link>
                </div>
              </div>
            )
          })}
          {(lessons ?? []).length === 0 && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-muted)' }}>
              No live modules yet. Packs appear here the moment a module ships.
            </p>
          )}

        </div>
      </div>
    </main>
  )
}
