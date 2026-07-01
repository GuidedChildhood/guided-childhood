# Week 9 — Landing page, expert-checked scripts, and the lesson pipeline

**Date:** 2026-07-01
**Branch:** claude/agent-management-guided-childhood-lDYLl
**Status:** Approved. Building one day at a time, not merging to main yet.

Justin asked for this to be paced, one piece a day, not all at once. This is that schedule.

## Day 1: Homepage redesign (today, in progress)

- New narrative section built from the digital literacy divide argument Justin supplied: OECD found the access gap closed but a literacy gap opened in its place, LSE calls this the second digital divide, reframed through the swimming and deep water analogy (we teach children to swim in stages with a parent in the water, we do not ban the pool). Placed right after the hero and research strip, before the pathway cards, so the site makes the case for teaching over banning before it shows the pathway that does exactly that.
- Swap the static DiGi star icon for the existing animated `DigiCharacter` component (idle, speak, happy, thinking, wave) in every spot DiGi appears on the homepage. It is built but currently unused on this page. Add one new scroll triggered moment of DiGi moving through the new narrative section.
- SEO pass: sharpen title and meta description, extend the structured data (Article schema for the new section), confirm every image has real alt text, confirm heading order, check sitemap.xml and robots.txt exist and are correct.
- Verify on mobile and desktop in the browser before calling it done, per the non-negotiables.

## Day 2: Expert check every script

Right now the 100 plus scripts in the database were written in Justin's voice against general research. This pass checks and sharpens them against named experts, so every script holds up if a parent's health visitor or a journalist asks "who says this works."

Reference panel:
- **Dr Becky Kennedy** (Good Inside) — already the model for the app's tone, sturdy leadership over permissive or authoritarian parenting.
- **Catherine Knibbs** — UK child trauma and cyber psychology specialist, the right voice for anything about online harm, secrecy, or a child being scared by something they saw.
- **Sue Atkins** — UK parenting coach, practical and structural fixes, good check on whether a script is actually usable at 7pm on a Tuesday.
- **Dr Tanya Byron** — clinical psychologist who wrote the UK government's Byron Review on children and technology. Adding her as the fourth reference gives the panel a policy-credible, UK-specific anchor. Flag this pick to Justin on the day, swap for someone else if he wants a different fourth name.

Work:
1. Pull every script plus the full list of parent problems already named across the site (the 12 behaviour issues, 8 digital gaps, and the placard front-text problems), so we have one master list of what parents actually struggle with.
2. Check that master list has full coverage. Any real, common problem with no matching script gets a new one written.
3. Every existing script gets checked against the panel above for accuracy, then sharpened where the current wording is soft or generic.

## Day 3: Family agreements and contracts

The deferred feature from the pathway spine work. Age appropriate negotiated agreements, not top down rules, built on the same expert panel (Dr Becky's sturdy leadership, Catherine Knibbs on trauma informed boundaries, Sue Atkins on what actually holds at home). Printable, stored per stage.

## Day 4 to 5: Full lesson curriculum and the production pipeline

- Complete the stage by stage lesson curriculum (the AI module and Lessons hub currently have scaffolding, not a full syllabus).
- Decide and build the production method for lesson content. The earlier decision was slide based teaching, not video embeds, so the default path is animated in app slides built as React and GSAP, which stay on brand and do not depend on external video hosting. If Justin wants an actual video output as well (for marketing or for parents who prefer to watch), that becomes a separate export step on top of the same slide content, not a second content system to maintain.

## Non-negotiables carried over

No dashes in copy. Design tokens only. GSAP only for motion. Mobile and desktop checked before anything is marked done.
