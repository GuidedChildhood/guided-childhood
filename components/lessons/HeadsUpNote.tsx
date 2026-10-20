import BackTo from '@/components/nav/BackTo'

// The note before a heavy lesson, as the parent reads it
// (app/(dashboard)/dashboard/lessons/heads-up). Markup only: the page works out
// the state, so the same note can be checked on a preview with no database.

const label: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'block', marginBottom: 4,
}
const card: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', boxShadow: 'var(--lift)',
  padding: '14px 16px', margin: '0 0 12px',
}
const body: React.CSSProperties = { margin: 0, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }

export default function HeadsUpNote({
  title, backHref, readyLine, ready, status, state, copy, kid, waiting, childId, lessonId,
}: {
  title: string
  backHref: string
  readyLine: string | null
  ready: string | null
  status: string | null
  state: string
  copy: { covers: string | null; sayThis: string | null; tryThis: string | null }
  /** The child's name, capitalised for the start of a sentence. */
  kid: string
  waiting: boolean
  childId: string
  lessonId: string
}) {
  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 640, margin: '0 auto' }}>
      <BackTo fallback={{ href: backHref, label: 'Their lessons' }} />
      <p className="eyebrow" style={{ marginBottom: 4 }}>Before the lesson</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.2 }}>
        {title}
      </h1>

      {readyLine && (
        <p role="status" data-heads-up-ready={ready} style={{
          background: 'var(--tint-green)', border: '1.5px solid #2D5016', borderRadius: 'var(--radius-tile)',
          padding: '10px 14px', margin: '0 0 14px', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.5,
        }}>{readyLine}</p>
      )}

      {status && (
        <p data-heads-up-state={state} style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          {status}
        </p>
      )}

      {copy.covers && (
        <section style={card}>
          <span style={label}>What it covers</span>
          <p style={body}>{copy.covers}</p>
        </section>
      )}
      {copy.sayThis && (
        <section style={{ ...card, background: 'var(--cream)' }}>
          <span style={label}>One thing to say</span>
          <p style={{ ...body, fontWeight: 700 }}>&ldquo;{copy.sayThis}&rdquo;</p>
        </section>
      )}
      <section style={card}>
        <span style={label}>If something comes up</span>
        {/* One string, not JSX text: a wrapped text node holding an entity
            drops the space after {kid} when compiled ("Teocan"). */}
        <p style={body}>{`Stay calm and listen first. ${kid} can also call Childline free on 0800 1111, and their school's safeguarding lead is there to help too.`}</p>
      </section>

      {waiting && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 18 }}>
          <form method="post" action="/dashboard/lessons/heads-up/ready" style={{ margin: 0 }}>
            <input type="hidden" name="child" value={childId} />
            <input type="hidden" name="lesson" value={lessonId} />
            <button type="submit" data-heads-up-ready-button style={{
              display: 'inline-flex', alignItems: 'center', padding: '12px 20px', borderRadius: 'var(--radius-btn)', cursor: 'pointer',
              background: 'var(--terracotta)', border: 'var(--edge)', boxShadow: '0 5px 0 var(--terracotta-dark)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)',
            }}>
              Ready, open it now
            </button>
          </form>
          <a href={`/dashboard/lessons/do-together?child=${childId}&lesson=${lessonId}`} data-do-together style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Or do it together
          </a>
        </div>
      )}

      {copy.tryThis && (
        <section style={{ ...card, marginTop: 22 }}>
          <span style={label}>If you have five minutes</span>
          <p style={body}>{copy.tryThis}</p>
        </section>
      )}
    </div>
  )
}
