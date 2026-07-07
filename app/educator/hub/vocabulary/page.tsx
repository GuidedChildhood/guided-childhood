import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER } from '@/lib/content/schools-curriculum'
import { parseSlides, type KeywordsSlide } from '@/lib/content/lesson-slides'

// The whole scheme vocabulary: every keyword from every module, grouped
// by key stage, generated from the decks so it can never drift.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }

type TeacherNotes = { keywords?: { word: string; definition: string }[] }

export default async function VocabularyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, slides, teacher_notes')
  const byModule = new Map((lessons ?? []).map(l => [l.module_id, l]))

  const wordsFor = (moduleId: string) => {
    const row = byModule.get(moduleId)
    if (!row) return []
    const notes = (row.teacher_notes ?? {}) as TeacherNotes
    if (notes.keywords?.length) return notes.keywords
    const slide = (parseSlides(row.slides) ?? []).find((s): s is KeywordsSlide => s.type === 'keywords')
    return slide?.words.map(w => ({ word: w.word, definition: w.meaning })) ?? []
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>Whole scheme vocabulary · for display walls and planning</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Every word we teach
        </h1>
        <p style={{ ...body, marginBottom: '22px', maxWidth: '600px' }}>
          The key vocabulary of all 21 modules with the pupil facing definitions used in the lessons,
          in teaching order. Generated from the live lessons, so this list and the classrooms always agree.
        </p>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          return (
            <section key={ks} style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)', margin: '0 0 8px' }}>
                {meta.label} <span style={{ fontWeight: 700, fontSize: '0.8em', color: 'var(--ink-muted)' }}>{meta.years}</span>
              </h2>
              {modules.map(m => {
                const words = wordsFor(m.moduleId)
                if (!words.length) return null
                return (
                  <div key={m.moduleId} style={{ border: '1.5px solid var(--border)', borderRadius: '12px', padding: '10px 16px', marginBottom: '8px' }}>
                    <div style={{ ...mono, fontSize: '9px', marginBottom: '4px' }}>M{String(m.n).padStart(2, '0')} · {m.title}</div>
                    {words.map(w => (
                      <p key={w.word} style={{ ...body, fontSize: '12.5px', margin: '3px 0' }}>
                        <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px' }}>{w.word}</strong> · {w.definition}
                      </p>
                    ))}
                  </div>
                )
              })}
            </section>
          )
        })}
      </div>
    </main>
  )
}
