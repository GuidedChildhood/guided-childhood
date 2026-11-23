import { db as supabase } from '@/lib/supabase/server-db'
import InShort from '@/components/InShort'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { CURRICULUM, KEY_STAGE_META, KEY_STAGE_ORDER } from '@gc/shared/schools-curriculum'
import { PAGE_SHELL } from '@gc/shared/page-scale'
import { RSE_MODULES } from '@/lib/rse'
import { RefFold, JumpChips, RefGroup, RefPageKit } from '@/components/RefFold'

export const metadata = { title: 'The parent pack' }

// The parent pack: the whole programme explained for parents, built for
// the consultation the 2025 guidance requires. Family questions pull live
// from each module's parent note so the pack never drifts from the lessons.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }

type ParentNote = { family_question?: string; taught?: string }

export const revalidate = 3600

export default async function ParentPackPage() {

  const { data: lessons } = await supabase
    .from('school_lessons')
    .select('module_id, parent_note')
  const noteByModule = new Map((lessons ?? []).map(l => [l.module_id, (l.parent_note ?? {}) as ParentNote]))

  return (
    <main style={{ minHeight: '100vh', background: 'var(--white)', padding: PAGE_SHELL }}>
      <RefPageKit />
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton label="Print the parent pack" />
        </div>

        <div style={mono}>For parents and carers · share freely, no login needed</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          What your child will learn, and why
        </h1>
        <p style={{ ...body, marginBottom: 'var(--space-4)' }}>
          Every topic your child will meet, what they can do afterwards, and the question that comes home.
        </p>

        <div style={{ margin: '0 0 var(--space-4)' }}>
          <InShort points={[
            <>The <b>question that comes home</b> after each lesson, so the conversation carries on at your table.</>,
            <>You have a <b>right to see the materials</b>. Ask the school and they can show you any of it.</>,
            <>No scare tactics, nothing graphic, and <b>no pupil accounts or data</b>.</>,
          ]} />
        </div>

        <JumpChips items={[
          { href: '#rights', label: 'Your rights' },
          ...KEY_STAGE_ORDER.filter(ks => CURRICULUM.some(m => m.keyStage === ks)).map(ks => ({ href: `#${ks.toLowerCase()}`, label: KEY_STAGE_META[ks].years })),
        ]} />

        <RefGroup id="rights">Your rights and the ground rules</RefGroup>

        <RefFold title="Your right to see the materials" hint="Any lesson, worksheet or slide, just by asking the school">
          <p style={body}>
            The statutory RSHE guidance, in force from September 2026, gives you the right to know what
            your child is taught and requires the school to set out how you can view curriculum
            materials. This pack and the open curriculum map are that route for this programme: you can
            see any teaching material used with your child, at any time, just by asking the school. Our
            licence explicitly permits the school to share every lesson, worksheet and slide with you,
            and no confidentiality clause in our terms restricts that. If a topic concerns you, ask to
            see the lesson first: we would rather you read it than worry about it.
          </p>
        </RefFold>

        <RefFold title="Where the withdrawal rules fit" hint="Most of it has no withdrawal right. Three lessons are the school's call">
          {/* The school decides, not this page (sync plan F3). This used to say
              the programme teaches no sex education, which settled the
              withdrawal question on the school's behalf while three lessons
              map to the RSE block. schools/lib/rse.ts names them and says why. */}
          <p style={body}>
            Most of this programme is digital literacy and online safety, which sit within relationships
            education, health education and computing. There is no parental right of withdrawal from
            those subjects.
          </p>
          <p style={{ ...body, marginTop: '8px' }}>
            Three lessons go further and teach parts of the relationships and sex education guidance:
            consent, intimate images and the law, and how pornography gives a distorted picture of
            relationships.
          </p>
          <ul data-rse-lessons style={{ ...body, paddingLeft: '20px', margin: '6px 0' }}>
            {RSE_MODULES.map(m => (
              <li key={m.moduleId}><strong>{m.title}</strong> ({m.yearBand})</li>
            ))}
          </ul>
          <p style={body}>
            Whether any part of these counts as sex education is your school&rsquo;s decision, set out in
            its RSHE policy, and so is how a request to withdraw is handled. Before each of the three, the
            school can send home that lesson&rsquo;s parent note, so you can read what it covers before your
            child is in the room. You can ask to see the whole lesson too.
          </p>
        </RefFold>

        <RefFold title="The honest ground rules of every lesson" hint="No scare tactics, real sources, never graphic, no pupil data">
          <p style={body}>
            No scare tactics and no lectures: children learn judgement, not just rules. Every statistic
            shown on screen carries its real source. Sensitive topics for older pupils (like online
            pressure, scams and blackmail) are taught calmly, are never graphic, and always end with the
            same message: telling an adult means you are safe, not in trouble. Your child never gets an
            account or login, and the platform holds no pupil data at all: where a name appears, it is
            handwritten on a printed worksheet that stays at school.
          </p>
        </RefFold>

        <RefGroup>What your child learns, by age</RefGroup>
        {KEY_STAGE_ORDER.map(ks => {
          const meta = KEY_STAGE_META[ks]
          const modules = CURRICULUM.filter(m => m.keyStage === ks)
          if (modules.length === 0) return null
          return (
            <RefFold key={ks} id={ks.toLowerCase()} title={meta.years} hint={`${meta.strapline} ${modules.length} ${modules.length === 1 ? 'lesson' : 'lessons'}.`}>
              {modules.map(m => {
                const note = noteByModule.get(m.moduleId)
                return (
                  <div key={m.moduleId} style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-3) 0', breakInside: 'avoid' }}>
                    <p style={{ ...body, fontWeight: 800, marginBottom: '2px' }}>{m.title}</p>
                    <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '4px' }}>{m.blurb}</p>
                    <p style={{ ...body, fontSize: 'var(--text-base)' }}>
                      <strong>Afterwards your child can say:</strong> &ldquo;{m.outcome}&rdquo;
                    </p>
                    {note?.family_question && (
                      <p style={{ ...body, fontSize: 'var(--text-base)', marginTop: '4px', color: 'var(--green-dark)', fontWeight: 600 }}>
                        The question coming home: {note.family_question}
                      </p>
                    )}
                    {m.dsl && (
                      <p style={{ ...mono, fontSize: 'var(--text-sm)', color: 'var(--coral-dark)', marginTop: '6px' }}>
                        Taught with additional safeguarding care · full materials available on request
                      </p>
                    )}
                  </div>
                )
              })}
            </RefFold>
          )
        })}

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          Questions about any lesson? Ask the school office to see the material, or send your question in
          and the PSHE lead will come back to you. This pack was generated from the live curriculum on{' '}
          {new Date().toLocaleDateString('en-GB')}.
        </p>
      </div>
    </main>
  )
}
