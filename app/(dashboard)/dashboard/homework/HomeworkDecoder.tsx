'use client'

import { useState } from 'react'
import Link from 'next/link'
import TutorLessonCard from '@/components/learning/TutorLessonCard'

// Paste the homework, get back what it is.
//
// The box is the whole interface. A parent doing this is standing at the
// kitchen table at half past six with a worksheet they do not understand, and
// anything between them and an answer is a reason to give up and say "just do
// your best".

type Match = { id: string; subject: string; strand: string; objective: string }
type Result =
  | { ok: true; yearGroup: number; plain: string; help: string; watch: string; matches: Match[]; childName?: string | null }
  | { ok: false; reason: 'no_birthday' | 'out_of_range' | 'no_curriculum' | 'no_match'; childName?: string | null }

export type DecoderChild = { id: string; name: string; hasBirthday: boolean }

export default function HomeworkDecoder({ kids }: { kids: DecoderChild[] }) {
  const [childId, setChildId] = useState(kids[0]?.id ?? '')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const child = kids.find(k => k.id === childId) ?? kids[0] ?? null

  async function decode() {
    if (busy || text.trim().length < 3) return
    setBusy(true); setError(''); setResult(null)
    try {
      const r = await fetch('/api/learning/decode', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, childId }),
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok) setResult(d as Result)
      else setError(d.error ?? 'That did not go through. Have another go in a moment.')
    } catch {
      setError('That did not go through. Have another go in a moment.')
    }
    setBusy(false)
  }

  const label: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
  }

  return (
    <div>
      {kids.length > 1 && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
          {kids.map(k => (
            <button
              key={k.id}
              onClick={() => { setChildId(k.id); setResult(null) }}
              style={{
                padding: '9px 15px', borderRadius: 100, cursor: 'pointer',
                background: k.id === childId ? 'var(--deep-teal)' : 'var(--cream)',
                color: k.id === childId ? '#fff' : 'var(--ink-soft)',
                border: `1px solid ${k.id === childId ? 'var(--deep-teal)' : 'var(--border)'}`,
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
              }}
            >
              {k.name}
            </button>
          ))}
        </div>
      )}

      {child && !child.hasBirthday ? (
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>
            We need {child.name}&apos;s birthday first
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 12px' }}>
            Homework only means something against a school year, and school places a child by their age on 31 August. Without the birthday we would be guessing the year, and a decode against the wrong year is worse than none.
          </p>
          <Link href="/dashboard/settings" style={{ display: 'inline-flex', padding: '11px 17px', textDecoration: 'none', background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 14, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', boxShadow: '0 3px 0 var(--terracotta-dark)' }}>
            Add the birthday
          </Link>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '16px 18px' }}>
            <div style={{ ...label, marginBottom: 8 }}>What does the homework say</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={5}
              placeholder="Type it or paste it in. Even a photo caption or one confusing line is enough."
              style={{
                width: '100%', resize: 'vertical', padding: '12px 13px',
                border: '1.5px solid var(--border)', borderRadius: 13,
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)',
                lineHeight: 1.5, background: 'var(--cream)',
              }}
            />
            <button
              onClick={decode}
              disabled={busy || text.trim().length < 3}
              style={{
                width: '100%', marginTop: 12, padding: '14px', cursor: busy ? 'default' : 'pointer',
                background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 16,
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)',
                boxShadow: '0 4px 0 var(--terracotta-dark)',
                opacity: busy || text.trim().length < 3 ? 0.6 : 1,
              }}
            >
              {busy ? 'Reading it' : 'What is this asking for?'}
            </button>
          </div>

          {error && (
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--terracotta-dark)', fontWeight: 700, margin: '12px 0 0' }}>{error}</p>
          )}

          {result && !result.ok && (
            <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 20px', marginTop: 14 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginBottom: 6 }}>
                {result.reason === 'no_match' ? 'Not one we can place' : 'Nothing to match it against yet'}
              </div>
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
                {result.reason === 'no_match'
                  ? 'That does not line up with anything in the national curriculum for their year. It may be a school’s own project, a topic piece, or reading. Saying nothing is the honest answer here rather than reaching for the nearest thing.'
                  : result.reason === 'out_of_range'
                  ? 'These follow the national curriculum for Years 1 to 6, and they are outside that for now.'
                  : 'The curriculum for their year is not in yet, so there is nothing honest to match against.'}
              </p>
            </div>
          )}

          {result && result.ok && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'var(--tint-sage)', border: '1.5px solid var(--retro-green)', borderRadius: 20, padding: '18px 20px' }}>
                <div style={{ ...label, color: 'var(--retro-green-dark)', marginBottom: 6 }}>What it is asking for</div>
                <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{result.plain}</p>
              </div>

              {result.help && (
                <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 20, padding: '18px 20px' }}>
                  <div style={{ ...label, color: 'var(--terracotta-dark)', marginBottom: 6 }}>One thing to do tonight</div>
                  <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{result.help}</p>
                </div>
              )}

              {/* The tutor, offered the moment we know what the homework is.
                  A decode tells the parent what it is, which helps the parent
                  and does nothing for the child, who still has to learn it.
                  This is the other half, and it sits here rather than at the
                  bottom because a parent who has read the answer stops
                  scrolling. Keyed on the matches so a second decode offers a
                  lesson about the new homework rather than the old one. */}
              {child && result.matches.length > 0 && (
                <TutorLessonCard
                  key={result.matches.map(m => m.id).join(',')}
                  childId={child.id}
                  childName={child.name}
                  objectiveIds={result.matches.map(m => m.id)}
                  homework={text}
                />
              )}

              {result.watch && (
                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '16px 18px' }}>
                  <div style={{ ...label, marginBottom: 6 }}>Where parents usually trip up</div>
                  <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>{result.watch}</p>
                </div>
              )}

              {/* The published wording, last and quiet. It is the proof rather
                  than the answer: a parent wants to know what to do, and the
                  statutory line is what lets them check we did not make it up. */}
              {result.matches.length > 0 && (
                <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: '16px 18px' }}>
                  <div style={{ ...label, marginBottom: 8 }}>
                    Year {result.yearGroup}, the curriculum wording
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {result.matches.map(m => (
                      <li key={m.id}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 2 }}>
                          {m.subject} · {m.strand}
                        </div>
                        <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.5 }}>{m.objective}</div>
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 0' }}>
                    Word for word from the national curriculum in England. It says what the year covers, not how {result.childName && result.childName !== 'Your child' ? result.childName : 'your child'} is doing, and not that their school is teaching it this week.
                  </p>
                </div>
              )}

              <Link
                href={`/dashboard/digi?q=${encodeURIComponent(`We are stuck on this homework: ${text.slice(0, 300)}`)}`}
                style={{
                  display: 'inline-flex', justifyContent: 'center', padding: '13px 18px', textDecoration: 'none',
                  background: '#fff', color: 'var(--ink)', borderRadius: 16, border: '1.5px solid var(--border)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                }}
              >
                Still stuck? Ask DiGi
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
