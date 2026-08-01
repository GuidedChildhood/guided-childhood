import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { embedMissingKnowledge } from '@/lib/digi/knowledge-embed'

// Keep the research bank searchable by meaning.
//
// Daily and almost always a no op: it only does work when a finding has arrived
// without a vector, which happens when Justin approves a candidate or a migration
// adds a researcher by hand. Migrations are the reason this is a sweep rather
// than a hook on the approval route: a row written by SQL never passes through
// application code, so a hook would leave it permanently invisible to semantic
// search while looking perfectly fine in the table.
//
// Runs before the daily insight agent so a finding approved yesterday is
// searchable by the time anyone asks a question that needs it.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const result = await embedMissingKnowledge()

  // Said out loud rather than reported as a bland ok. A bank that is quietly
  // unembedded looks identical to one that is fully embedded from the outside,
  // and that is exactly the kind of silence this whole change exists to end.
  return NextResponse.json({
    ok: true,
    ...result,
    note: result.configured
      ? undefined
      : 'EMBEDDING_API_KEY is not set, so nothing was embedded and retrieval stays on keyword scoring.',
  })
}

export const GET = withHeartbeat('knowledge-embed', handler)
