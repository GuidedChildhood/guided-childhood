// ONE SHAPE FOR BOTH DOORS.
//
// Justin, 16 August 2026, looking at the two buttons that decide whether anybody
// ever pays: "think we should remain consistent with button design here so both
// match."
//
// They did not. The founder button was the house button (17px 28px, mono, the
// chunky 0 5px 0 shadow) and "Carry on without a card" was a different thing
// entirely: 15px 24px, display font at a different size and weight, and flat,
// with no shadow at all. Two buttons offered as a genuine choice, drawn as
// though one were a button and the other a link.
//
// That is not a cosmetic difference on this screen. These two are the choice
// between paying now and not, and a flat secondary next to a raised primary is
// the oldest trick in the book for pushing people through the door you prefer.
// We are not doing that. They match in shape, in padding, in type and in the
// depth of the shadow. The ONLY difference is colour, which is how hierarchy is
// supposed to be carried: butter for the one most families want, white with an
// ink edge for the one that costs nothing.
//
// Extracted rather than copied, because the two live in different files and the
// last copy drifted the moment somebody edited one of them.

const BASE: React.CSSProperties = {
  display: 'block', width: '100%', padding: '17px 28px',
  borderRadius: 16,
  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)',
  letterSpacing: '0.08em', textTransform: 'uppercase',
  cursor: 'pointer', textAlign: 'center',
}

/** The founder door. Butter, because it is the one most families want. */
export const PAY_BTN: React.CSSProperties = {
  ...BASE,
  background: 'var(--terracotta)', color: 'var(--ink)',
  border: 'none',
  boxShadow: '0 5px 0 var(--terracotta-dark)',
}

/**
 * The free door. Same button, white.
 *
 * The 2px ink border and the ink shadow give it exactly the weight of the one
 * beside it. It reads as the quieter of two real options rather than as an
 * afterthought, which is what it is: four days, no card, and a parent who takes
 * it has made a choice we offered rather than one they had to hunt for.
 */
export const FREE_BTN: React.CSSProperties = {
  ...BASE,
  background: '#fff', color: 'var(--ink)',
  border: '2px solid var(--ink)',
  boxShadow: '0 5px 0 var(--ink)',
}
