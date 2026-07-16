// A subtle "writing in" reveal for DiGi's insights: each word fades and rises
// in on a gentle stagger, so the note reads as if DiGi is setting it down for
// you rather than snapping in all at once. Pure CSS, so it is hydration safe
// and works without JS; honours prefers-reduced-motion (shows instantly).
// Re-mount it (key by the text) to replay when the insight changes.
export default function WriteIn({
  text, baseDelay = 0, stepMs = 24, style, className,
}: {
  text: string
  baseDelay?: number
  stepMs?: number
  style?: React.CSSProperties
  className?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      <style>{`
        @keyframes gcWriteWord { from { opacity: 0; transform: translateY(0.22em) } to { opacity: 1; transform: translateY(0) } }
        .gc-ww { display: inline-block; white-space: pre; opacity: 0; animation: gcWriteWord 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .gc-ww { animation: none; opacity: 1; transform: none } }
      `}</style>
      {words.map((w, i) => (
        <span key={i} className="gc-ww" style={{ animationDelay: `${baseDelay + Math.min(i, 40) * stepMs}ms` }}>
          {w}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
