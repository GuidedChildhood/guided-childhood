export type SaveState = 'saving' | 'saved' | 'failed' | null

// Says what just happened to a job.
//
// Lives beside the day chips, because the days are what a parent comes to the
// job editor to change (usually because one day is carrying too much), and a
// change that saves silently is the one they cannot trust. Nothing renders when
// there is nothing to say, so the row is quiet at rest.
//
// Its own component so it can be seen without logging in. The editor it belongs
// to is behind auth on /dashboard/quests, which meant the first version of this
// shipped having only ever been typechecked, never looked at.
export default function SaveChip({ state }: { state: SaveState }) {
  if (!state) return null
  const failed = state === 'failed'
  return (
    <span
      role="status"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '6px 11px', borderRadius: '100px', whiteSpace: 'nowrap',
        fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700,
        border: `1.5px solid ${failed ? 'var(--terracotta-dark)' : 'var(--retro-green)'}`,
        background: failed ? 'var(--terracotta-lt)' : 'rgba(255,255,255,0.9)',
        color: failed ? 'var(--terracotta-dark)' : 'var(--retro-green)',
        opacity: state === 'saving' ? 0.65 : 1,
      }}
    >
      {state === 'saving' ? 'Saving' : state === 'saved' ? '✓ Saved' : 'Not saved, try again'}
    </span>
  )
}
