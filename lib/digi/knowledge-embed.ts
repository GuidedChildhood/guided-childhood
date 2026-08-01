import { createAdminClient } from '@/lib/supabase/admin'
import { embedTexts, embeddingsConfigured } from '@/lib/digi/embeddings'

// Keeping the research bank embedded.
//
// Every finding needs a meaning vector before match_expert_knowledge can find
// it. Rows arrive three ways: the original migrations, the fortnightly research
// updater once Justin approves a candidate, and a migration adding a researcher
// by hand. Only one of those three passes through application code, so a hook on
// the approval route alone would leave every migration written row unsearchable.
//
// So this is a SWEEP, not a hook: find anything without an embedding and embed
// it. Idempotent, cheap when there is nothing to do, and it self heals after a
// migration, a provider swap or a failed batch.
//
// Best effort throughout. No key, a timeout or an API error leaves the embedding
// null, and a null embedding simply means that row is invisible to semantic
// search while remaining fully available to the keyword scoring that has always
// worked. Semantic retrieval upgrades DiGi. It must never be able to break DiGi.

export interface KnowledgeEmbedResult {
  configured: boolean
  missing: number
  embedded: number
  failed: number
}

/** Embed every active finding that has no vector yet. */
export async function embedMissingKnowledge(limit = 256): Promise<KnowledgeEmbedResult> {
  if (!embeddingsConfigured()) {
    return { configured: false, missing: 0, embedded: 0, failed: 0 }
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('expert_knowledge')
    .select('id, source_name, finding')
    .eq('active', true)
    .is('embedding', null)
    .limit(limit)

  if (error || !data || data.length === 0) {
    return { configured: true, missing: 0, embedded: 0, failed: 0 }
  }

  // The source name goes in with the finding. A parent asking "what does Amy
  // Orben actually say" is asking by name, and a vector built from the finding
  // alone has no idea whose it is.
  const texts = data.map(r => `${r.source_name}. ${r.finding}`)

  let embedded = 0
  let failed = 0
  // 128 is the provider batch ceiling in embedTexts, so chunk to match rather
  // than silently sending 256 and having half of them dropped.
  for (let i = 0; i < texts.length; i += 128) {
    const slice = data.slice(i, i + 128)
    const vectors = await embedTexts(texts.slice(i, i + 128), 'document')
    if (!vectors) {
      failed += slice.length
      continue
    }
    // One row at a time. An upsert of the whole batch would need every column,
    // and getting that wrong overwrites a finding with a partial row. Slower and
    // safe beats faster and destructive on the corpus DiGi cites by name.
    for (let j = 0; j < slice.length; j++) {
      const { error: writeError } = await admin
        .from('expert_knowledge')
        .update({ embedding: vectors[j] })
        .eq('id', slice[j].id)
      if (writeError) failed++
      else embedded++
    }
  }

  return { configured: true, missing: data.length, embedded, failed }
}
