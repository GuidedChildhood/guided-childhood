// Embeddings: turning sentences into meaning vectors so DiGi's memory can be
// searched by what a parent MEANS, not the words they used. The provider is
// config, never hardcoded: EMBEDDING_API_KEY decides everything, and the
// provider is detected from the key shape (Voyage keys start pa-, OpenAI keys
// start sk-). Both are asked for 1024 dimensions so either fits the same
// column, and swapping provider later needs a backfill, not a migration.
//
// Everything here is best effort by design: no key, a timeout, or an API error
// returns null and the caller falls back to the keyword ranking that already
// works. Semantic memory upgrades DiGi; it must never be able to break DiGi.

export const EMBEDDING_DIMENSIONS = 1024

type InputType = 'document' | 'query'

function apiKey(): string | null {
  const key = process.env.EMBEDDING_API_KEY?.trim()
  return key ? key : null
}

export function embeddingsConfigured(): boolean {
  return apiKey() !== null
}

async function callVoyage(key: string, texts: string[], inputType: InputType): Promise<number[][] | null> {
  const model = process.env.EMBEDDING_MODEL?.trim() || 'voyage-3.5-lite'
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, input: texts, input_type: inputType, output_dimension: EMBEDDING_DIMENSIONS }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) return null
  const json = await res.json() as { data?: { index: number; embedding: number[] }[] }
  if (!json.data || json.data.length !== texts.length) return null
  return json.data.sort((a, b) => a.index - b.index).map(d => d.embedding)
}

async function callOpenAI(key: string, texts: string[]): Promise<number[][] | null> {
  const model = process.env.EMBEDDING_MODEL?.trim() || 'text-embedding-3-small'
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, input: texts, dimensions: EMBEDDING_DIMENSIONS }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) return null
  const json = await res.json() as { data?: { index: number; embedding: number[] }[] }
  if (!json.data || json.data.length !== texts.length) return null
  return json.data.sort((a, b) => a.index - b.index).map(d => d.embedding)
}

// Embed up to 128 texts in one call. inputType 'document' for stored memories,
// 'query' for the parent's live question (Voyage tunes each side; OpenAI has
// no such switch and ignores it).
export async function embedTexts(texts: string[], inputType: InputType): Promise<number[][] | null> {
  const key = apiKey()
  if (!key || texts.length === 0) return null
  const batch = texts.slice(0, 128).map(t => t.slice(0, 2000))
  try {
    if (key.startsWith('sk-')) return await callOpenAI(key, batch)
    return await callVoyage(key, batch, inputType)
  } catch {
    return null
  }
}

export async function embedText(text: string, inputType: InputType): Promise<number[] | null> {
  const result = await embedTexts([text], inputType)
  return result?.[0] ?? null
}
