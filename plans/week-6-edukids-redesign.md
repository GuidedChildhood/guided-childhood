# Week 6 — Edukids Design Redesign

**Date:** 2026-06-30
**Goal:** Apply Edukids visual design language to homepage, starter-pack, and static landing pages.

## What the Edukids design shows
- Warm cream/beige background
- Bold display headlines with colored accent words
- Child + parent photography on colored geometric shape cutouts (circles, rounded rects)
- Dark brown/near-black stats bar with large white numbers
- Stage progression pathway ("tree walkthrough") with photo cards
- Script category cards in Edukids program-card style (colored bg + photo)
- Playful decorative doodles/illustrations
- Warm rounded pill CTAs

## What we're building

### 1. Hero redesign (app/page.tsx)
- Keep existing headline copy (it's good)
- Add two "photo shape cards" on the right:
  - Card 1: Parent + young child (ages 4-10) on stage-1/2 green rounded shape
  - Card 2: Teen on phone (ages 11-16) on terracotta rounded shape
- Photo slots styled for real photos to be dropped in later
- Remove floating problem chips (less visually clean)

### 2. Stage Pathway Walkthrough (NEW SECTION)
- Added after stats bar
- Title: "Your guided pathway from first screen to digital independence"
- 5 connected stage cards in a visual path
- Each stage card: photo placeholder + stage info + device type + key concerns
- Desktop: horizontal flow with dotted connector lines
- Mobile: vertical scroll

### 3. Script Category Cards (Edukids program cards)
- Added after or replacing the flip cards section
- 6 cards: First Device, Social Media, Gaming, Safety, Wellbeing, AI and Tech
- Each: colored background + photo placeholder + script count + CTA

### 4. Starter-pack result screen
- Result screen gets photo shape cards showing the recommended stage

## Decisions
- Photo placeholders use CSS art (colored bg + emoji) — drop in real photos later
- Keep ALL existing section content, just upgrade visual treatment of hero and add new sections
- Stage pathway is the priority "tree walkthrough" the user wants
- No dashes in any copy per CLAUDE.md
