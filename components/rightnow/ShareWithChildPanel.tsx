'use client'

// The Share with your child panel, lifted out of RightNowButton so it can be
// checked on its own at a phone width (/dev/rightnow-share) without an account,
// a script row or a meltdown to trigger it. Purely presentational: every fetch,
// every gate and every piece of state still lives in RightNowButton.

export type ShareChild = {
  id: string
  name: string
  // Has an app of their own, so there is a screen to send to at all.
  onApp: boolean
  // On the app AND the card suits their age.
  canSend: boolean
  reason: string | null
}

export default function ShareWithChildPanel({
  kids, kidId, note, blocked, busy, sent,
  onNote, onPick, onSend, onCancel, onCopy,
}: {
  kids: ShareChild[]
  kidId: string | null
  note: string
  blocked: string | null
  busy: boolean
  sent: string | null
  onNote: (value: string) => void
  onPick: (childId: string) => void
  onSend: () => void
  onCancel: () => void
  onCopy: () => void
}) {
  // "Send to Alma's screen", or "their screen" while the name is still loading.
  function possessive(): string {
    const name = kids.find(k => k.id === kidId)?.name
    return name ? `${name}'s` : 'their'
  }

  return (

          <div style={{
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: '16px', padding: '16px', marginBottom: '2px',
            boxShadow: '0 3px 0 var(--border)',
          }}>
            {sent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span aria-hidden style={{ fontSize: 'var(--text-xl)' }}>💛</span>
                <p style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4 }}>
                  Sent to {sent}. It is waiting on their screen.
                </p>
              </div>
            ) : blocked || (!busy && !note) ? (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <span aria-hidden style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>📖</span>
                  <p style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5 }}>
                    {blocked
                      ?? (kids.some(k => k.onApp)
                        ? (kids.find(k => k.onApp && k.reason)?.reason ?? 'Read this one through with them instead.')
                        : 'Read this through with your child. When they are on the app you can send it straight to their screen.')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onCopy}
                  style={{
                    width: '100%', background: 'var(--cream)', border: '1.5px solid var(--border)',
                    color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 'var(--text-base)', borderRadius: '14px', padding: '12px',
                    cursor: 'pointer', boxShadow: '0 3px 0 var(--border)',
                  }}
                >
                  Copy the words
                </button>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: '10px' }}>
                  {busy && !note
                    ? 'Writing it for them'
                    : `What ${kids.find(k => k.id === kidId)?.name ?? 'they'} will read`}
                </div>

                {/* More than one child on the app: whose screen. */}
                {kids.filter(k => k.onApp).length > 1 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    {kids.filter(k => k.onApp).map(k => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => onPick(k.id)}
                        style={{
                          background: k.id === kidId ? 'var(--terracotta)' : 'var(--white)',
                          border: '1.5px solid var(--border)', borderRadius: '999px',
                          padding: '7px 14px', cursor: 'pointer',
                          fontFamily: 'var(--font-display)', fontWeight: 700,
                          fontSize: 'var(--text-sm)', color: 'var(--ink)',
                        }}
                      >
                        {k.name}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  value={note}
                  onChange={e => onNote(e.target.value)}
                  rows={4}
                  placeholder={busy ? '' : 'The note they will read'}
                  aria-label="The note your child will read"
                  style={{
                    width: '100%', boxSizing: 'border-box', resize: 'vertical',
                    background: 'var(--tint-sage)', border: '1.5px solid #D6E5DF',
                    borderRadius: '14px', padding: '13px 14px', marginBottom: '10px',
                    fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)',
                    color: 'var(--ink)', lineHeight: 1.5,
                    animation: busy && !note ? 'rightnow-pulse 1.2s ease-in-out infinite' : undefined,
                  }}
                />
                {/* Nothing to change, and nothing on its way, while it is
                    still being written. */}
                {!(busy && !note) && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginBottom: '12px' }}>
                    Change any of it before it goes.
                  </p>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => onCancel()}
                    style={{
                      background: 'var(--white)', border: '1.5px solid var(--border)',
                      color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: 'var(--text-base)', borderRadius: '14px', padding: '12px 16px',
                      cursor: 'pointer', boxShadow: '0 3px 0 var(--border)',
                    }}
                  >
                    Not now
                  </button>
                  <button
                    type="button"
                    onClick={onSend}
                    disabled={busy || !note.trim()}
                    style={{
                      flex: 1, background: 'var(--terracotta)', border: 'none',
                      color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 'var(--text-base)', borderRadius: '14px', padding: '12px 16px',
                      cursor: busy || !note.trim() ? 'default' : 'pointer',
                      opacity: busy || !note.trim() ? 0.55 : 1,
                      boxShadow: '0 4px 0 var(--terracotta-dark)',
                    }}
                  >
                    {busy && !note ? 'Writing' : busy ? 'Sending' : `Send to ${possessive()} screen`}
                  </button>
                </div>
              </>
            )}
          </div>
  )
}
