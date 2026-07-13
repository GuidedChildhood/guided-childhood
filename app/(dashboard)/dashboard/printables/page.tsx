import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PRINTABLES, printablesForStage } from '@/lib/printables/registry'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import PrintableActions from './PrintableActions'

// The Printables library: the offline pathway. Beautiful colouring book
// sheets a family prints and completes away from screens, each worth
// stars through the quest approve loop. The child's stage set leads, the
// whole library follows.

export const metadata = { title: 'Printables — Guided Childhood' }

const SETTING_LABEL: Record<string, string> = {
  indoors: 'Indoors', outdoors: 'Outdoors', anywhere: 'Anywhere',
}

export default async function PrintablesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('name, age_band')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const stageId = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand).id : 2
  const forChild = printablesForStage(stageId)
  const forChildKeys = new Set(forChild.map(p => p.key))
  const others = PRINTABLES.filter(p => !forChildKeys.has(p.key))
  const childName = child?.name && child.name !== 'Your child' ? child.name : null

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
    boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
  }

  function Section({ title, sub, items }: { title: string; sub: string; items: typeof PRINTABLES }) {
    if (items.length === 0) return null
    return (
      <section style={{ marginBottom: '34px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
          {title}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 14px' }}>{sub}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {items.map(p => (
            <div key={p.key} style={card}>
              {/* The pinned preview, the sheet styled the way it lives in a home */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.previewUrl} alt={`${p.title} preview`} style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                    {p.emoji} {p.title}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {[p.minutes, SETTING_LABEL[p.setting], p.skill].map(chip => (
                      <span key={chip} style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        background: 'var(--cream)', color: 'var(--ink-soft)',
                        border: '1px solid var(--border)', borderRadius: '100px', padding: '3px 9px',
                      }}>{chip}</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0, flex: 1 }}>
                  {p.blurb}
                </p>
                <PrintableActions printable={p} />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', marginBottom: '8px' }}>Printables</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '10px' }}>
        The offline pathway
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '28px', maxWidth: '560px' }}>
        Print it, put the crayons out, and the screens look after themselves. Every finished sheet is worth stars: add it to the quest list, they hand the page back, you approve, the stars land in their bank.
      </p>

      {/* The builder: pick from the idea pool or write your own, then print */}
      <a
        href="/dashboard/printables/builder"
        style={{
          display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none',
          background: 'var(--tint-sage)', border: '1.5px solid var(--border)', borderRadius: '20px',
          padding: '18px 22px', marginBottom: '34px',
        }}
      >
        <span style={{ fontSize: '30px', lineHeight: 1 }} aria-hidden>✏️</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Build your own bucket list
          </span>
          <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: '3px' }}>
            Pick from our ideas or write your own, put their name on it, and print a list that is completely yours.
          </span>
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
          Open the builder →
        </span>
      </a>

      <Section
        title={childName ? `Made for ${childName}` : 'Made for their age'}
        sub="The sheets that fit their stage right now."
        items={forChild}
      />
      <Section
        title="The whole library"
        sub="Everything else, for siblings, rainy Sundays and growing into."
        items={others}
      />
    </div>
  )
}
