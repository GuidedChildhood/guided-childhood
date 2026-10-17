import Link from 'next/link'
import type { PageCount } from '@/lib/pathway/page-count'
import type { NextStep } from '@/lib/pathway/passport-next'

// ONE PASSPORT PAGE, IN THREE ANSWERS (Justin's brief on PR 1312, 16 October 2026).
//
// Under the picture, in this order and in few words: how far the page is
// (one count, one bar split by who), the one next step, and what the child
// has actually learnt. Learnt is only what is recorded: a school lesson
// passed with its check, never a lesson opened or watched (plan T10).

export type LearntLesson = { id: string; title: string; outcome: string | null }

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}
const card: React.CSSProperties = {
  background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)',
  padding: '16px 18px', margin: '0 0 14px',
}

export type SkillCount = { label: string; done: number; total: number }

export function PassportProgress({
  n, page, eyebrow, kid, count, skills = [],
}: { n: number; page: string; eyebrow: string; kid: string; count: PageCount
  /** AI and social media lessons on this page, the child's own passes (passport journey plan, PR 4). */
  skills?: SkillCount[] }) {
  // One segment per item when the page is small enough to count by eye,
  // otherwise one bar per group, so a long page never reads as a barcode.
  const groups = [
    { key: 'lessons', label: `${kid} ${count.lessons.done} of ${count.lessons.total} lessons`, done: count.lessons.done, total: count.lessons.total },
    { key: 'scripts', label: `You ${count.scripts.done} of ${count.scripts.total} talks`, done: count.scripts.done, total: count.scripts.total },
    { key: 'check', label: count.check.done ? 'Big check passed' : 'Big check', done: count.check.done ? 1 : 0, total: 1 },
  ].filter(g => g.total > 0)
  const perItem = count.total <= 18
  return (
    <section data-block="progress" id="page" style={{ ...card, background: `var(--stage-${n})`, scrollMarginTop: 84 }}>
      <p style={{ ...mono, margin: '0 0 4px' }}>{eyebrow}</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 2px', lineHeight: 1.15 }}>
        {page}
      </h2>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: `var(--stage-${n}-text)`, margin: '0 0 12px', lineHeight: 1.1 }}>
        {count.done} of {count.total} done
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }} aria-hidden>
        {groups.map(g => (
          <div key={g.key} style={{ flex: perItem ? g.total : g.key === 'check' ? 1 : 3, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {perItem
                ? Array.from({ length: g.total }, (_, i) => (
                    <span key={i} style={{ flex: 1, height: 10, borderRadius: 6, background: i < g.done ? 'var(--terracotta)' : 'var(--border)', border: i < g.done ? '1.5px solid var(--terracotta-dark)' : '1.5px solid transparent' }} />
                  ))
                : (
                  <span style={{ flex: 1, height: 10, borderRadius: 6, background: 'var(--border)', overflow: 'hidden', display: 'block' }}>
                    <span style={{ display: 'block', height: '100%', width: `${Math.round((g.done / g.total) * 100)}%`, background: 'var(--terracotta)' }} />
                  </span>
                )}
            </div>
          </div>
        ))}
      </div>
      <p style={{ ...mono, margin: '8px 0 0', color: 'var(--ink)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
        {groups.map(g => g.label).join(' · ')}
      </p>
      {skills.length > 0 && (
        <p data-skills style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '8px 0 0', lineHeight: 1.5 }}>
          Built on this page: {skills.map(k => `${k.label} ${k.done} of ${k.total}`).join(', ')}.
        </p>
      )}
    </section>
  )
}

export function PassportNextCard({ step }: { step: NextStep }) {
  return (
    <section data-block="next" id="next-step" style={{ ...card, scrollMarginTop: 84 }}>
      <p style={{ ...mono, margin: '0 0 6px', color: 'var(--terracotta-dark)' }}>Next · {step.chip}</p>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.25 }}>
        {step.title}
      </h3>
      {step.how && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: step.button ? '0 0 14px' : 0 }}>{step.how}</p>
      )}
      {step.button && (
        <Link href={step.button.href} className="btn btn-gold" style={{ display: 'inline-flex', minHeight: 44 }}>
          {step.button.label}
        </Link>
      )}
    </section>
  )
}

export function PassportLearnt({ kid, lessons }: { kid: string; lessons: LearntLesson[] }) {
  const first = lessons.slice(0, 4)
  const rest = lessons.slice(4)
  const row = (l: LearntLesson) => (
    <li key={l.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
      <span aria-hidden style={{
        flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--tint-green)',
        border: '1.5px solid #2D5016', color: '#2D5016', fontWeight: 900, fontSize: 13,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
      }}>✓</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>{l.title}</span>
        {l.outcome && <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{l.outcome}</span>}
      </span>
    </li>
  )
  return (
    <section data-block="learnt" style={card}>
      <p style={{ ...mono, margin: '0 0 2px' }}>What {kid} has learnt</p>
      {lessons.length === 0 ? (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '6px 0 0' }}>
          Nothing passed on this page yet. Every lesson ends with a short check, and only a pass shows here.
        </p>
      ) : (
        <>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', margin: '0 0 6px' }}>
            {lessons.length} lesson{lessons.length === 1 ? '' : 's'} passed, each one with its check.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{first.map(row)}</ul>
          {rest.length > 0 && (
            <details>
              <summary style={{ cursor: 'pointer', ...mono, color: 'var(--ink)', padding: '8px 0 0' }}>And {rest.length} more</summary>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{rest.map(row)}</ul>
            </details>
          )}
        </>
      )}
    </section>
  )
}
