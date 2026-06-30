# Week 7 — Digital Parenting Hub: Device Safety, AI Literacy, Agreements

**Date:** 2026-06-30
**Branch:** claude/agent-management-guided-childhood-lDYLl
**Status:** Approved, building

---

## What we are building

The AI module becomes the foundation of a full Digital Parenting Resource Centre inside the dashboard. Four interconnected areas that update constantly, driven by the `social_media_law` flag, the child's stage, and the devices a parent registers. DiGi guides through each area. Everything is step-by-step, tick-off trackable, and grounded in actual research.

---

## Phase 1: Device Safety Hub (Week 7, Priority 1)

**Goal:** Parents register the devices their family uses, get a step-by-step safety checklist per device per age. Tick off progress. Pre-ban and post-ban content adapts automatically.

### What a parent sees
1. "Register your devices" — a short input (device type, what your child uses it for, age band)
2. For each device: a collapsible checklist of safety steps — settings to change, parental controls to enable, conversations to have
3. Each item is tick-offable. Progress ring shows completion.
4. Content adapts to `social_media_law` flag (pre-ban: focus on controls + conversations; post-ban: focus on workaround resilience + messaging safety)
5. DiGi CTA on each section: "Ask DiGi about [device] at this age"

### Database
```sql
create table parent_devices (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  device_type text not null, -- phone_ios / phone_android / tablet / laptop / console / smart_tv / smart_speaker
  label       text,          -- "Jake's iPad" or left blank
  age_band    text,          -- inherits from profile or overridden
  created_at  timestamptz not null default now()
);

create table device_checklist_completions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  device_id   uuid not null references parent_devices(id) on delete cascade,
  item_key    text not null,  -- e.g. "screen_time_limits", "app_restrictions"
  completed_at timestamptz not null default now(),
  constraint device_checklist_unique unique (user_id, device_id, item_key)
);
```

### Checklist content (stored in DB, not hardcoded)
```sql
create table device_checklist_items (
  id          uuid primary key default uuid_generate_v4(),
  device_type text not null,
  item_key    text not null,
  title       text not null,
  description text not null,
  how_to      text not null,   -- plain step-by-step instructions
  age_bands   text[] not null default '{}', -- empty = all ages
  law_flag    text not null default 'none', -- none / partial_ban / full_ban_u16
  sort_order  int not null default 0
);
```

### Route
`/dashboard/devices` — main device hub
`/dashboard/devices/[deviceId]` — single device checklist

---

## Phase 2: AI Literacy Pathway (Week 7, Priority 2)

**Goal:** Expand the current check-in into a proper AI readiness pathway for parents. Step-by-step guides for each major AI tool the child is likely to use. Research-backed. DiGi-guided.

### What a parent sees
1. **AI Check-in** (already built) — 3 questions → recommendation
2. **Settings guide per AI tool** — for ChatGPT: how to enable safe mode, how to check usage, what it is and is not for. For Google Gemini, Siri, school AI tools (Oak, Century). Each tool has a 4-step guide (same pattern as scripts).
3. **How to teach prompting** — age-appropriate guide: what a good prompt looks like, how to show your child to be specific, how to check the answer
4. **What to believe** — trust calibration: 4 categories (can trust / check it / never trust / ask a person instead)
5. **Research corner** — 3-4 plain-language summaries of the actual research (Orben and Przybylski on screen time, Odgers on social media, Heitner on digital mentorship). No jargon.

### Database
New content category in `ai_lessons`: add `category` values for `settings_guide`, `prompting`, `trust_calibration`, `research_brief`

Or a new table `ai_guides` (parallel to `ai_lessons` but with different columns):
```sql
create table ai_guides (
  id          uuid primary key default uuid_generate_v4(),
  tool        text not null,       -- chatgpt / gemini / siri / school_ai / general
  audience    text not null,       -- parent / age_11 / age_13 / age_16
  title       text not null,
  step_1      text not null,
  step_2      text not null,
  step_3      text not null,
  step_4      text not null,
  digi_prompt text not null,
  sort_order  int not null default 0
);
```

### Route
`/dashboard/ai-module` — already exists, expands with new sections below the check-in

---

## Phase 3: Screen Time and Homework Agreements (Week 8, Priority 1)

**Goal:** Parents get science-backed screen time recommendations by age, then build a family agreement with DiGi's help. Tick off when completed.

### What a parent sees
1. **Research brief** — plain summary: what Orben and Przybylski's Goldilocks hypothesis actually says. What the WHO guidelines say. No panic, no ban agenda. Calibrated.
2. **Recommended baselines by age** — a simple table showing typical research ranges for recreational screen time by age (not a rule, a reference point)
3. **Agreement builder** — 5 items the family chooses together:
   - Where devices sleep (bedroom / kitchen / living room)
   - Screen-free times (meals / morning / bedtime)
   - First device rules (when, which type, what for)
   - Social media readiness signals (what does ready look like for your family)
   - What happens when things go wrong (who does the child tell first)
4. Each item has a "talk tonight" script — short version of the relevant library script
5. DiGi generates a custom agreement in the family's voice

### Database
```sql
create table family_agreements (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  agreement   jsonb not null default '{}', -- stores the 5 items
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint  family_agreements_user_unique unique (user_id)
);
```

### Route
`/dashboard/agreements` — new route

---

## Phase 4: DiGi Integration Throughout (Ongoing)

Every hub section gets:
- A DiGi CTA with a pre-filled prompt relevant to that section and the child's stage
- DiGi can generate a custom agreement in plain English
- DiGi knows which device the parent registered and can give device-specific advice

The `app/api/digi/route.ts` system prompt injection (lines 110-127) gets extended to include:
- Registered devices
- Agreement status (completed / in progress / not started)
- AI literacy check-in answers

---

## Build order (this week)

### Already done
- [x] AI readiness check-in with lesson recommendation (PR #42)
- [x] `ai_literacy_checkins` migration (012)

### This session
- [x] Week 7 plan written
- [ ] Fix script detail page readability (Say this text too small — biggest quick win)
- [ ] Migration 013: `parent_devices` + `device_checklist_items` + `device_checklist_completions`
- [ ] `/dashboard/devices` page: device registration + checklist UI
- [ ] Seed `device_checklist_items` with iOS phone content for Stage 3 (ages 11-13)

### Next session
- [ ] Seed checklist content for all device types and age bands
- [ ] `ai_guides` table + seed for ChatGPT + Siri parent guides
- [ ] Migration 014: `family_agreements`
- [ ] `/dashboard/agreements` page

---

## Non-negotiables for all new content

- No dashes in copy. Ever.
- Research citations must be accurate (Orben and Przybylski, Odgers, Heitner — see deep research output)
- `social_media_law` flag drives pre/post ban content in device checklists
- DiGi CTA on every section. Pre-filled prompt. Stage-aware.
- Mobile-first. Every checklist must work on a phone in one hand.
- Justin's voice throughout: warm, plain, direct. No AI-isms.

---

## Design pattern for all new sections

Match the scripts pattern:
- Eyebrow label (IBM Plex Mono, 10px, uppercase)
- Bold heading (Hanken Grotesk 700-800)
- Card-based content with numbered steps and terracotta circle numbers
- Stage pastel backgrounds on cards
- Tick-off items: white background, `var(--border)` checkbox, terracotta check on completion
- DiGi CTA block at the bottom of each section (same as script detail page)
