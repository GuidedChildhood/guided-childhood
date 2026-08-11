// The honest label on something we are still building.
//
// Justin, 11 August 2026, on the term preview: "have a new tag beta so they can
// open to be first to see but still on dev."
//
// Two jobs, and the second is the one that makes it worth having. It sets the
// expectation, so a parent meeting a thin corner of the product reads it as
// early rather than as broken. And it is an invitation: being first to see
// something is a reason to open it, where a silent half finished feature is
// just a disappointment nobody was warned about.
//
// Deliberately small and quiet. A loud badge on a card makes the card about the
// badge, and this is a footnote on somebody else's headline. Mono, uppercase and
// tracked out, which is the same treatment every eyebrow in the product wears,
// so it reads as part of the furniture rather than a sticker on top of it.

export default function BetaTag({ title }: { title?: string }) {
  return (
    <span
      title={title ?? 'Early, and we are still adding to it. Have a look and tell us what is missing.'}
      style={{
        display: 'inline-flex', alignItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--ink-soft)', background: 'var(--cream)',
        border: '1px solid var(--border)', borderRadius: 100,
        padding: '2px 7px', lineHeight: 1.4, whiteSpace: 'nowrap',
        verticalAlign: 'middle',
      }}
    >
      Beta
    </span>
  )
}
