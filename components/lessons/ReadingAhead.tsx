// The reading ahead notice. Sage rather than a warning colour on purpose:
// nothing has gone wrong, and a parent looking at the lesson their child grows
// into next should not be told off for it. It names the child's own stage
// because "this will not count" without "towards what" is the kind of sentence
// that sends someone back to the passport to check.
export default function ReadingAhead({ stageLabel, childName, childStageName }: { stageLabel: string; childName: string; childStageName: string }) {
  return (
    <div style={{
      background: 'var(--tint-green)', border: '2px solid var(--ink)',
      boxShadow: '0 4px 0 var(--ink)', borderRadius: '16px',
      padding: '14px 16px', marginBottom: '18px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)',
        marginBottom: '5px',
      }}>
        Reading ahead
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
        This one is {stageLabel}, so it will not count towards {childName}&rsquo;s {childStageName} stamp. Read it as far ahead as you like, and it counts when they reach it.
      </p>
    </div>
  )
}
