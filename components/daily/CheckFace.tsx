// The five check in faces, really tough to going great. Face n posts band n
// onto the stored 1 to 10 scale (see the long note in ConcernCheckIn).
//
// Lifted out of ConcernCheckIn on 18 November 2026 so the starter pack result
// page can draw the real instrument rather than a bar chart the app does not
// have. One drawing, two places: change a face here and both follow.

export default function Face({ band, filled, past, size = 40 }: { band: number; filled: boolean; past: boolean; size?: number }) {
  const fill = filled ? 'var(--terracotta)' : past ? '#DCD7CB' : '#FEF7E0'
  const op = filled ? 1 : past ? 0.8 : 0.62
  // Indexed by band, 1 to 5; slot 0 is never drawn.
  const mouth = [
    '',
    'M13 28.5 Q20 21.5 27 28.5',
    'M13.5 27.5 Q20 23.5 26.5 27.5',
    'M13.5 26.5 L26.5 26.5',
    'M13.5 24 Q20 30.5 26.5 24',
    'M12.5 23 Q20 34 27.5 23 Z',
  ][Math.min(5, Math.max(1, band))]
  const grin = band === 5
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden style={{ display: 'block' }}>
      <circle cx="20" cy="20" r="17.5" fill={fill} stroke="var(--ink)" strokeOpacity={op} strokeWidth={filled ? 2.2 : 1.8} />
      {grin ? (
        <>
          <path d="M11 16.5 Q14 12.5 17 16.5" fill="none" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2.1" strokeLinecap="round" />
          <path d="M23 16.5 Q26 12.5 29 16.5" fill="none" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2.1" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="14" cy="16.5" r="2.1" fill="var(--ink)" fillOpacity={op} />
          <circle cx="26" cy="16.5" r="2.1" fill="var(--ink)" fillOpacity={op} />
        </>
      )}
      {band === 1 && (
        <>
          <path d="M10.5 11.5 L16 13.5" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2" strokeLinecap="round" />
          <path d="M29.5 11.5 L24 13.5" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      <path d={mouth} fill={grin ? 'var(--ink)' : 'none'} fillOpacity={op} stroke="var(--ink)" strokeOpacity={op} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {filled && <circle cx="13" cy="10.5" r="2.4" fill="#fff" fillOpacity="0.85" />}
    </svg>
  )
}
