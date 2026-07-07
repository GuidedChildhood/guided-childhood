import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/educator/PrintButton'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER } from '@/lib/content/schools-curriculum'

// The parent pack: the whole programme explained for parents, built for
// the consultation the 2025 guidance requires. Family questions pull live
// from each module's parent note so the pack never drifts from the lessons.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.7 }

type ParentNote = { family_question?: string; taught?: string }

export default async function ParentPackPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, parent_note')
  const noteByModule = new Map((lessons ?? []).map(l => [l.module_id, (l.parent_note ?? {}) as ParentNote]))

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/educator/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton label="Print the parent pack" />
        </div>

        <div style={mono}>For parents and carers · share freely, no login needed</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: 'var(--ink)', margin: '6px 0 8px' }}>
          What your child will learn, and why
        </h1>
        <p style={{ ...body, marginBottom: '14px' }}>
          Your school teaches digital life the way it teaches road safety: early, honestly, and in the
          open. This pack shows you every topic in the programme, what your child will be able to do
          after each lesson, and the question that comes home so the conversation continues at your table.
        </p>

        <div style={{ border: '2px solid var(--gold)', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', background: 'var(--cream)' }}>
          <p style={{ ...body, fontWeight: 700, marginBottom: '4px' }}>Our transparency promise</p>
          <p style={body}>
            You can see any teaching material used with your child, at any time, just by asking the
            school. Our licence explicitly permits the school to share every lesson, worksheet and slide
            with you, and nothing in our terms restricts that. If a topic concerns you, ask to see the
            lesson first: we would rather you read it than worry about it.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ ...body, fontWeight: 700, marginBottom: '6px' }}>The honest ground rules of every lesson</p>
          <p style={body}>
            No scare tactics and no lectures: children learn judgement, not just rules. Every statistic
            shown on screen carries its real source. Sensitive topics for older pupils (like online
            pressure, scams and blackmail) are taught calmly, are never graphic, and always end with the
            same message: telling an adult means you are safe, not in trouble. Your child never gets an
            account or login, and the only detail the school enters is a first name and initial for
            printed worksheets.
          </p>
        </div>

        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          return (
            <section key={ks} style={{ marginBottom: '22px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', margin: '0 0 2px' }}>
                {meta.years}
              </h2>
              <p style={{ ...body, fontSize: '12.5px', color: 'var(--ink-muted)', marginBottom: '10px' }}>{meta.strapline}</p>
              {modules.map(m => {
                const note = noteByModule.get(m.moduleId)
                return (
                  <div key={m.moduleId} style={{ border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 16px', marginBottom: '8px' }}>
                    <p style={{ ...body, fontWeight: 800, marginBottom: '2px' }}>{m.title}</p>
                    <p style={{ ...body, fontSize: '12.5px', marginBottom: '4px' }}>{m.blurb}</p>
                    <p style={{ ...body, fontSize: '12.5px' }}>
                      <strong>Afterwards your child can say:</strong> &ldquo;{m.outcome}&rdquo;
                    </p>
                    {note?.family_question && (
                      <p style={{ ...body, fontSize: '12.5px', marginTop: '4px', color: 'var(--green-dark)', fontWeight: 600 }}>
                        The question coming home: {note.family_question}
                      </p>
                    )}
                    {m.dsl && (
                      <p style={{ ...mono, fontSize: '9px', color: 'var(--coral-dark)', marginTop: '6px' }}>
                        Taught with additional safeguarding care · full materials available on request
                      </p>
                    )}
                  </div>
                )
              })}
            </section>
          )
        })}

        <p style={{ ...body, fontSize: '11.5px', color: 'var(--ink-muted)' }}>
          Questions about any lesson? Ask the school office to see the material, or send your question in
          and the PSHE lead will come back to you. This pack was generated from the live curriculum on{' '}
          {new Date().toLocaleDateString('en-GB')}.
        </p>
      </div>
    </main>
  )
}
