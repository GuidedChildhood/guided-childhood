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

/**
 * BOTH DOORS, ONE BUTTON. Same colour, not just the same shape.
 *
 * The first attempt at this matched the shape and kept the free door white with
 * an ink edge, on the reasoning that colour is how hierarchy is supposed to be
 * carried. Justin, looking at it: "this is not fixed, as buttons are meant to
 * be same colour and fit in with any other buttons."
 *
 * He is right twice over. The house button IS butter with a butter shadow, and
 * it is butter everywhere else in the product, so a white outline button on this
 * screen is not a quieter version of our button, it is a button from a different
 * app. And on THIS screen in particular there should be no hierarchy at all:
 * these two are a genuine choice between paying now and not, the four days are
 * identical either way, and any visual nudge toward the paying one is a nudge we
 * have no business making.
 *
 * So there is one style and both doors use it. The words are what differ, which
 * is the honest place for the difference to live.
 */
export const DOOR_BTN: React.CSSProperties = {
  ...BASE,
  background: 'var(--terracotta)', color: 'var(--ink)',
  border: 'none',
  boxShadow: '0 5px 0 var(--terracotta-dark)',
}

/** Both names kept, pointing at the same object, so neither caller reads as the
 *  odd one out and nobody is tempted to give one of them its own colour again. */
export const PAY_BTN = DOOR_BTN
export const FREE_BTN = DOOR_BTN
