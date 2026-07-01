# Week 8 — Platform Polish: No Black, Lessons Hub, Mobile Pass

**Date:** 2026-07-01
**Branch:** claude/agent-management-guided-childhood-lDYLl
**Status:** Approved, building

---

## What we are building

A cross-platform expert pass, not a single feature. Four things, in order:

1. Remove every dark/black section background across the whole site (13 locations found by audit). Nothing near-black anywhere, even for high-contrast CTA sections. Use terracotta or stage pastels instead.
2. A new Lessons hub, separate from the existing AI module. Organized by stage (1 to 5), same visual pattern as Scripts. Each lesson can carry a YouTube video link. Content is written once and lightly reframed for parent-facing vs school-facing (reusing the audience pattern already proven in ai_lessons). Folds in the AI safety and literacy pack as one of its categories.
3. Confirm the Digital Health Check is reachable from inside the dashboard, not just marketing pages.
4. Mobile pass at 375px on the homepage and the new Lessons hub. Duolingo-calibre feel: chunky, tappable, no dense text blocks.

---

## Dark background locations to fix

| File | Line | Section |
|---|---|---|
| app/page.tsx | 2253 | Footer |
| app/(marketing)/join/page.tsx | 489, 581 | CTA / overlay sections |
| app/(marketing)/ban-workarounds/page.tsx | 307 | Section |
| app/(marketing)/schools/page.tsx | 137 | Content box |
| app/(marketing)/starter-pack/page.tsx | 112, 320, 339, 393 | Hero + content boxes |
| app/(marketing)/scripts/page.tsx | 253 | Section |
| app/(marketing)/digi-squad/page.tsx | 180 | Section |
| app/(marketing)/pathway/page.tsx | 347 | Section |
| app/globals.css | 155, 584 | .btn-ink, .placard-back-face |

Replacement approach: footers and CTA sections that need strong contrast get `var(--terracotta-dark)` background with white text (on brand, not black). Content boxes on light pages get a stage pastel or cream with a terracotta border instead of a dark fill.

---

## Lessons hub

### Why separate from ai_lessons

ai_lessons is AI-literacy specific and already working (do not touch its schema). The Lessons hub is the general digital parenting curriculum: screen habits, safety conversations, wellbeing, online risks, by stage. It surfaces ai_lessons content alongside its own as one category so parents see everything in one place.

### Schema (migration 013)

```sql
create table lessons (
  id          uuid primary key default uuid_generate_v4(),
  stage_id    text not null check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  audience    text not null default 'parent' check (audience in ('parent','teacher')),
  category    text not null, -- screen_habits / safety / wellbeing / online_risks / ai_safety
  title       text not null,
  the_idea    text not null,
  why_it_matters text not null,
  try_this    text not null,
  key_message text not null,
  digi_prompt text not null,
  video_url   text, -- optional YouTube link, Justin pastes these in
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
```

RLS: public read (educational content, same pattern as ai_lessons and scripts).

### Route

`/dashboard/lessons` — hub, grouped by stage like `/dashboard/scripts`
`/dashboard/lessons/[id]` — detail page, same 4-part idea/why/try/remember layout as scripts and ai-module, plus video embed if `video_url` present

### Seed content

Seed 2 lessons per stage (10 total) covering screen habits and safety conversations, written in Justin's voice, grounded in the research already cited elsewhere in the app (Odgers, Orben and Przybylski, Livingstone). Justin adds more content and video links directly in Supabase afterward.

---

## Non-negotiables

- No dashes in copy.
- Justin's voice: warm, plain, direct.
- Design tokens only, no black backgrounds.
- Mobile checked at 375px before calling this done.
