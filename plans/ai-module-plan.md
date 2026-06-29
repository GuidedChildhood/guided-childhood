# AI Literacy Module: plan and architecture

A comprehensive AI module for Guided Childhood that teaches children, parents, and teachers how AI works and how to use it wisely, plus a living layer that stays current with AI safety news and new releases, all linked into DiGi.

## The two layers

### 1. Evergreen lessons (the core)
Age-tiered AI literacy content stored in the database (`ai_lessons`), so it is easy to grow over time without a code change, exactly like the scripts. Audiences: ages 7, 9, 11, 13, 16, parents, teachers. Categories: what AI is, how it learns, large language models and chatbots, hallucinations, deepfakes, AI safety, using AI well, privacy and data, AI and feelings, AI at school, bias and fairness.

Each lesson has: the idea, why it matters, one thing to try, a one-line key message, and a `digi_prompt` that hands off to DiGi.

### 2. The living updates layer
A second table (`ai_updates`) holds current items: a new model release, a safety guidance, a fresh scam pattern. These keep the module from going stale.

The honest constraint: **Claude cannot reliably know what is new after its training cutoff.** So the layer cannot just ask Claude "what changed." Instead:

```
trusted source feed  ->  Claude summarises and age-tunes  ->  DRAFT saved  ->  human approves  ->  published to families
```

- **Source feed**: a small set of trusted sources (for example Anthropic news and the model list, plus a couple of reputable child-safety or AI-safety bodies). These are supplied to the refresh route.
- **Claude's job**: summarise each source item into calm, accurate, age-appropriate language for older children, parents, and teachers. It is told to use only facts present in the source and never to invent a release.
- **Human in the loop**: every machine-written item is saved as `status = 'draft'`. Nothing reaches a family until an editor marks it `published`. This is a safety requirement for a children's product, not an optional nicety.

## What is built now

- `supabase/migrations/002_ai_module.sql`: the `ai_lessons` and `ai_updates` tables, with row level security. Lessons are public (educational). Only `published` updates are public; drafts are service-role only.
- `supabase/seed-ai-module.sql`: the evergreen lessons across all seven audiences.
- `app/api/ai-updates/refresh/route.ts`: the draft-only refresh job. Guarded by `CRON_SECRET`, uses the service role and the Claude API (model from `AI_UPDATE_MODEL`, defaulting to the DiGi model), accepts a batch of source items, and writes drafts. It never publishes.
- `lib/config/ai-module.ts`: the model config and target audiences for the feed.
- `app/(dashboard)/dashboard/ai-module/`: the member-facing reader (list by audience, plus a per-lesson page with an Ask DiGi handoff).

## How it links to DiGi

- Every lesson and update carries a `digi_prompt`, and the reader has an Ask DiGi button that opens `/dashboard/digi` pre-filled with that prompt. This is live now.
- A deeper step (next): inject the most relevant `ai_lessons` rows into DiGi's system prompt so DiGi answers AI questions directly from this curated content. This is a small change to `app/api/digi/route.ts` and is noted as a follow-up so it can be reviewed on its own.

## To turn the living layer on (later, needs your go-ahead)

1. Decide the trusted source list.
2. Set `CRON_SECRET` and confirm `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_KEY` in Vercel.
3. Schedule the refresh (a daily or weekly cron that POSTs the latest source items to the route).
4. Add a tiny editor view to approve or reject drafts. Until that exists, drafts can be approved directly in Supabase.

The cost and the child-safety review of auto-drafted content are real decisions, which is why the publish step is deliberately manual.

## Conventions
British English, no dashes as punctuation, Justin's voice, Checker design tokens. Content lives in the database. The model is a config value, never hardcoded.
