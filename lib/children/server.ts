import { pickChild, type SelectableChild } from './select'

// Reading "which child is this page about" ONCE, so sixteen pages stop each
// having their own opinion.
//
// The old shape, repeated on every page that shows a child anything:
//
//     .from('children').select(...).eq('parent_id', user.id)
//       .eq('is_primary', true).single()
//
// Two things are wrong with it and both bite in a family with two children.
//
// It ignores the parent's choice. ChildSwitcher writes ?child=<id> into the
// URL, so the pills move, and then the page fetches the primary child anyway
// and every number on it stays where it was. The parent is told they switched
// and nothing switched.
//
// And is_primary was never a reliable answer even for one child. Nothing
// guaranteed one per family until migration 203, and the live account had FOUR
// children flagged primary, so .single() came back as an error with no row and
// the page rendered its empty state to a parent with five children.
//
// So: read the list, ordered so first is stable, and let pickChild apply the
// param with the primary child as the fallback. Existing links and bookmarks
// with no param behave exactly as they did.
//
// See plans/multi-child-two-session-contract.md. The rule both sessions work
// to is that ?child= is the only way to say which child, and is_primary is
// only ever a fallback, never a filter.

type ChildClient = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

/**
 * Every child on the account plus the one this page is about.
 *
 * `columns` is whatever the page needs. `id` and `is_primary` are added for
 * you if you leave them out, because the switcher needs the first and the
 * fallback needs the second, and forgetting either fails quietly rather than
 * loudly.
 *
 * `kids` is always returned, even when the param names nobody, because the
 * switcher has to draw every pill regardless of which one is lit.
 */
export async function getChildren<T extends SelectableChild = SelectableChild>(
  supabase: ChildClient,
  userId: string,
  childParam: string | null | undefined,
  columns = 'id, name, is_primary',
): Promise<{ kids: T[]; child: T | null }> {
  const needed = columns
    .split(',')
    .map(c => c.trim())
    .filter(Boolean)
  for (const required of ['id', 'is_primary']) {
    if (!needed.includes(required)) needed.push(required)
  }

  const { data } = await supabase
    .from('children')
    .select(needed.join(', '))
    .eq('parent_id', userId)
    // Primary first, then oldest, so "the first one" means the same thing on
    // every load rather than whatever the planner felt like returning.
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })

  const kids = ((data ?? []) as unknown) as T[]
  return { kids, child: pickChild(kids, childParam) }
}
