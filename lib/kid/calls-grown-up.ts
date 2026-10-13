// What a child calls the grown up, read softly (migration 376). Used by the
// child's own app and by every note that names the grown up to the child, so
// "Dad asked" and "Dad says well done" come from the one setting. A database
// before migration 376 has no column, so the read returns null and every
// caller falls back the way it did: "Mum or Dad" on the child's home, "Your
// grown up" inside a note the grown up wrote themselves.

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export async function readCallsGrownUp(supabase: Client, childId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.from('children').select('calls_grown_up').eq('id', childId).maybeSingle()
    if (error) return null
    const v = ((data as { calls_grown_up?: string | null } | null)?.calls_grown_up ?? '').trim()
    return v.length > 0 ? v : null
  } catch {
    return null
  }
}

/** The grown up named inside a note they sent: their own word, or "Your grown up". */
export function senderWord(calls: string | null): string {
  return calls ?? 'Your grown up'
}

/** The words a parent can pick from in Settings, and the length the column allows. */
export const CALLS_CHOICES = ['Mum', 'Dad', 'Mummy', 'Daddy'] as const
export const CALLS_MAX = 24
