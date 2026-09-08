import { db as supabase } from '@/lib/supabase/server-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

// The questions heads, governors and parents actually ask, answered in
// plain words. Short on purpose: every long answer lives in its own Hub
// document, and each answer points there.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }

const FAQS = [
  { q: 'Is this compliant with the new RSHE guidance?', a: 'The scheme is mapped module by module to the July 2025 statutory guidance that becomes compulsory in September 2026, including its newly named topics (deepfakes, misogynistic online cultures, online gambling, harms of pornography, illegal online behaviours). The full matrix is in the Hub under RSHE 2025 mapping, printable for your inspection file.' },
  { q: 'Can parents see the materials?', a: 'Yes, all of them, at any time, and our licence explicitly permits it. The parent pack in the Hub is built for your consultation, and any lesson can be shown to a parent on request. We would rather a parent read a lesson than worry about it.' },
  { q: 'What pupil data does it hold?', a: 'None. Your school signs in with a class code, not accounts, and the platform holds no pupil names, no logins, no photographs, no profiling and no advertising. The record of learning is the printed learning record in the child’s book, which stays in school where it belongs. The data protection pack in the Hub gives your DPO the full picture.' },
  { q: 'Do we need pupil devices?', a: 'No. One projector teaches the whole lesson, and every lesson has a complete paper fallback: the printed pack runs the lesson with no screen at all.' },
  { q: 'How much preparation does a lesson need?', a: 'The night before: read the teacher one pager (five minutes) and tick the prep list. Every slide carries a word for word script, so a non specialist can teach any module. The print room generates every worksheet, booklet and named quiz in two clicks.' },
  { q: 'Who teaches the sensitive topics, and how are staff supported?', a: 'Your own teachers, from fully scripted lessons in a deliberately calm register. Ten modules are safeguarding flagged: each carries a DSL note with disclosure handling written into the scripts and a ten minute staff briefing in the Hub, and the Hub&rsquo;s induction page runs the whole staff room through the scheme in fifteen minutes.' },
  { q: 'What evidence does it give us for Ofsted?', a: 'Paper you can put in front of an inspector, generated from the taught curriculum so it cannot drift: the statutory mapping matrix, the year plan, every lesson’s run sheet and answer key, and the printed learning record each child colours in their book. Delivery itself is recorded in your own systems, exactly as your other subjects are, because this platform deliberately holds no pupil data to record it against.' },
  { q: 'Does this replace our PSHE scheme?', a: 'No. It is the digital literacy and online safety spine, designed to slot inside your wider PSHE provision alongside whatever you use for the rest. The mapping matrix shows exactly which statutory topics it covers and which it deliberately leaves to your broader scheme.' },
  { q: 'What happens when the guidance changes again?', a: 'The volatile facts (the ban timeline, platform lists, statistics, named AI tools) live in a config layer reviewed monthly, not in lesson copy. When the world changes, the config changes and every affected page regenerates. No waiting for a new edition.' },
  { q: 'Does subscribing make us compliant?', a: 'No product can make a school compliant, and we will not pretend otherwise. We provide the taught curriculum mapped to every relevant requirement, the documents that evidence it, and the scripts and briefings that support your staff. Your school remains responsible for its policies, its parent consultation and viewing route, its safeguarding systems, its filtering and monitoring, and its own judgement of provision. The policy pack in the Hub sets out both sides of that line in full.' },
]

export default async function FaqPage() {

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton />
        </div>

        <div style={mono}>For heads, governors and parents</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 18px' }}>
          Common questions
        </h1>

        {FAQS.map(f => (
          <div key={f.q} style={{ borderBottom: '1.5px solid var(--border)', padding: '14px 0' }}>
            <p style={{ ...body, fontWeight: 800, marginBottom: '6px' }}>{f.q}</p>
            <p style={body}>{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
