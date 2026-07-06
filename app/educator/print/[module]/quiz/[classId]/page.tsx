import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { parseSlides, type ChoiceSlide } from '@/lib/content/lesson-slides'
import PrintButton from '../../PrintButton'

// The personalised end of lesson quiz (JP brief, 6 Jul 2026): one page
// per pupil, name already printed from the class list, the exit checks
// as tick box questions plus the commitment line. Teacher prints once,
// hands out, no name writing, and every sheet is per child evidence for
// the record. Oak conventions: "Tick 1 correct answer.", checkbox rows.

const page: React.CSSProperties = { pageBreakAfter: 'always', padding: '26px 20px' }
const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55 }

export default async function PersonalisedQuizPage({ params }: { params: Promise<{ module: string; classId: string }> }) {
  const { module: moduleId, classId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: lesson }, { data: cls }, { data: pupils }] = await Promise.all([
    supabase.from('school_lessons').select('module_id, title, key_stage, slides').eq('module_id', moduleId).maybeSingle(),
    supabase.from('school_classes').select('id, name, year_group').eq('id', classId).maybeSingle(),
    supabase.from('pupils').select('id, display_name').eq('class_id', classId).order('display_name'),
  ])
  if (!lesson || !cls) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const checks = (slides.filter(s => s.type === 'choice') as ChoiceSlide[]).slice(-3)
  const roster = (pupils ?? []).length > 0 ? pupils! : [{ id: 'blank', display_name: '' }]

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff' }}>
      <div className="no-print" style={{ padding: '20px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={mono}>End of lesson quiz · one page per pupil, names printed · {roster.length} sheets</span>
        <PrintButton />
      </div>

      {roster.map((pupil, pi) => (
        <section key={pupil.id} style={{ ...page, pageBreakAfter: pi === roster.length - 1 ? 'auto' : 'always' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--ink)', paddingBottom: '10px', marginBottom: '16px' }}>
            <div>
              <div style={mono}>{lesson.key_stage} · {cls.name} · End of lesson quiz</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--ink)', margin: '4px 0 0' }}>{lesson.title}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={mono}>Detective</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', minWidth: '140px', borderBottom: pupil.display_name ? 'none' : '2px solid var(--border)' }}>
                {pupil.display_name || ' '}
              </div>
            </div>
          </div>

          {checks.map((c, qi) => (
            <div key={qi} style={{ marginBottom: '16px' }}>
              <p style={{ ...body, fontWeight: 700, marginBottom: '4px' }}>{qi + 1}. {c.question}</p>
              <p style={{ ...mono, fontSize: '9px', marginBottom: '8px' }}>Tick 1 correct answer.</p>
              {c.options.map((o, oi) => (
                <p key={oi} style={{ ...body, display: 'flex', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ flexShrink: 0, width: '16px', height: '16px', border: '2px solid var(--ink)', borderRadius: '3px', display: 'inline-block', marginTop: '2px' }} />
                  <span><strong>{String.fromCharCode(97 + oi)})</strong> {o.text}</span>
                </p>
              ))}
            </div>
          ))}

          <div style={{ background: 'var(--gold-lt)', border: '2px solid var(--gold)', borderRadius: '12px', padding: '12px 16px', marginTop: '8px' }}>
            <p style={{ ...body, fontWeight: 700, marginBottom: '6px' }}>My commitment: the next time I see a shocking post I will...</p>
            <div style={{ borderBottom: '2px solid var(--gold-dark)', height: '26px' }} />
          </div>

          <p style={{ ...mono, marginTop: '14px' }}>⭐ Three checks, under a minute. Case closed.</p>
        </section>
      ))}
    </main>
  )
}
