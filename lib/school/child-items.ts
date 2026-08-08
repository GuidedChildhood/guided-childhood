// Which school reminders a child gets to see.
//
// This rule lived inline on the child's home page, and now two screens need it:
// the today and tomorrow banner, and the week viewer Justin asked for. Written
// twice it would drift, and the way it would drift is a payment reminder
// appearing on a nine year old's phone.
//
// The rule itself: some kinds are obviously the child's own business and go to
// them without anybody deciding anything, and everything else only reaches them
// when the grown up chose to send it.

/** Kinds that are the child's own business, so they go through by default. */
export const CHILD_KINDS = new Set(['kit', 'event', 'homework'])

export type ChildVisibleAction = {
  kind: string
  recurs_weekday?: number | null
  sent_to_child?: boolean | null
  auto_send_to_child?: boolean | null
}

/**
 * Should this reminder show on the child's phone?
 *
 * A weekly routine reaches them when the grown up ticked "send it to their
 * phone too" on it, a one off when it was actually sent. Either way the child
 * kinds pass regardless, because a PE kit is a thing a child needs and not a
 * thing a parent should have to remember to forward every week.
 */
export function isChildVisible(a: ChildVisibleAction): boolean {
  if (CHILD_KINDS.has(a.kind)) return true
  return a.recurs_weekday != null ? !!a.auto_send_to_child : !!a.sent_to_child
}
