# Week 8 (cont.) — Duolingo clarity + Good Inside card mechanics

**Date:** 2026-07-01
**Branch:** claude/agent-management-guided-childhood-lDYLl
**Status:** Approved, building. No new standalone features, polish existing surfaces only.

## Scope

1. Sitewide font swap: Hanken Grotesk → Nunito (display + body), keep IBM Plex Mono for labels/eyebrows. Centralized in globals.css tokens.
2. Card deck redesign (DeckViewer, DailyDeckViewer) to match Good Inside: curved colored header with eyebrow + title, bold black body on pastel card, real flick-away exit animation (rotate + translate off screen, not just fade).
3. Verify daily completions and moment tags actually update /dashboard/tracker. Fix if disconnected.
4. Device Hub: icon set instead of emoji, "Ask DiGi to walk me through this" per device wired to existing DiGi chat with device_guides row as context.
5. Time permitting: lightweight daily-path illustration, script "did this work" feedback capture.

## Non-negotiables carried over

No dashes in copy. Design tokens only. Mobile checked before done. DIGI_MODEL stays config driven (fixed stale claude-sonnet-4-6 to claude-sonnet-5 in lib/config/digi.ts this session).
