import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { embedTexts, embeddingsConfigured } from '@/lib/digi/embeddings'
import { NextResponse } from 'next/server'

// Founder facing, on demand: embed the memories that do not have a vector yet,
// one batch of up to 100 per call. The insights board keeps calling until
// remaining hits zero, so the whole history becomes searchable by meaning.

export const maxDuration = 120
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  if (!embeddingsConfigured()) {
    return NextResponse.json({ error: 'EMBEDDING_API_KEY is not set in Vercel yet' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: rows, error } = await admin
    .from('digi_memory')
    .select('id, content')
    .is('embedding', null)
    .eq('active', true)
    .limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let embedded = 0
  if (rows && rows.length > 0) {
    const vectors = await embedTexts(rows.map(r => r.content as string), 'document')
    if (!vectors) {
      return NextResponse.json({ error: 'The embedding call failed. Check the key and try again.' }, { status: 502 })
    }
    for (let i = 0; i < rows.length; i++) {
      const { error: upErr } = await admin
        .from('digi_memory')
        .update({ embedding: vectors[i] })
        .eq('id', rows[i].id)
      if (!upErr) embedded++
    }
  }

  const { count } = await admin
    .from('digi_memory')
    .select('id', { count: 'exact', head: true })
    .is('embedding', null)
    .eq('active', true)

  return NextResponse.json({ ok: true, embedded, remaining: count ?? 0 })
}
