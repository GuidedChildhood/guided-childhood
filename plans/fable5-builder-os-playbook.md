# Fable 5 Builder OS Playbook

Written 2026-07-01. Source: Chris's video on maximising the 7 day Fable 5 access window using his Builder OS skill set. This document turns that video into a repeatable step by step system, then adapts it to how we already work on Guided Childhood.

The core insight of the video: Fable 5 is exceptional at one shotting the full foundation of an app, but only if you hand it complete spec documents up front. So you spend the cheap time (Opus, or any model, before the window) doing all the planning, and you spend the expensive Fable 5 time doing nothing but building from those specs.

---

## Part 1. The system in one paragraph

Plan first, build second, and never mix the two. For every product idea, produce three documents before touching Fable 5: a product vision (strategy, audience, brand voice), a PRD (technical spec: stack, data model, API, user stories), and a product roadmap (phased build plan where every task is a checkbox). Then, when Fable 5 access lands, one prompt: read the roadmap and the PRD, and work the loop until every box is ticked. The checkboxes make the build resumable if a session dies, and phase goals force end to end verification before moving on.

---

## Part 2. Prep before the Fable 5 window opens

Do all of this on Opus 4.8 (or whatever you have). None of it needs Fable 5.

1. **List the projects.** Write down 3 to 5 things you actually want built. For us that list is at the end of this document. The video's advice: if you plan 3 to 5 projects in advance, the 7 days becomes 3 to 5 shipped foundations instead of one half planned mess.
2. **One folder per project.** Each idea gets its own clean folder opened as its own Claude Code project. Do not plan two products in one session.
3. **Install the skills (optional).** The video uses `npx skills add build-products/builder-os` inside Claude Code. That gives you nine skills across four phases: idea (idea generator, idea validator), planning and design (product planner, design system), build (build MVP), and launch. If we skip Builder OS, Part 4 and Part 5 of this document replicate the parts that matter.
4. **Set the session up for planning.** High effort matters here: max reasoning, best available model. Skill installation does not need it. Planning does. Cheap planning produces cheap specs, and the spec is the whole game.

---

## Part 3. The planning workflow, step by step

This is the product planner flow from the video. Run it once per project.

**Step 1. Start a new session and invoke the planner.**
Prompt: "Use the product planner skill in this project to help me plan my product." If not using Builder OS, say: "Interview me about my product idea, then produce three documents: product-vision.md, prd.md, product-roadmap.md" and paste the templates from Part 4.

**Step 2. Give a dense idea brief.** One paragraph covering: what it is, what platform (web app, dashboard, MCP server, etc), the two or three core capabilities, who it is for, and the purpose behind it (the single source of truth it becomes). Chris's eyropper brief named the product, the surface (web dashboard), the storage format (design.md), the access layer (MCP for local coding agents), and the reason it exists. Match that density.

**Step 3. Answer the interview honestly and narrowly.** The planner asks rounds of questions. The video's guidance on each:

- **About you.** Your background, skills, and existing distribution. It uses this to shape the product toward what you can actually sell. Lean into the audience you already have.
- **Target customer.** Pick the narrowest segment that resonates hard. The most common failure the video calls out: building for everyone. One specific subset, not a broad base.
- **Transformation.** The before and after in one line. Pick the sharpest option offered, not the safest.
- **Capabilities and magic moment.** Confirm the feature list and the moment where the product clicks for a new user. Cut anything that does not serve that moment.
- **One liner.** The tagline. Choose the version that is not locked to a niche you might outgrow.
- **Primary buyer.** The single persona who pays first. Not the user, the buyer.
- **Business model.** The planner suggests one (freemium in the video: free for individuals, paid for teams). It also drafts 90 day success criteria, a six month vision, and a rough go to market. The go to market should be your existing channels, not imaginary ones.
- **Brand voice.** Do not accept the default. Chris pushed "confident and precise" toward "tongue in cheek like Mailchimp." Steer it. This is what stops the copy sounding like AI slop.
- **Tech stack.** The planner suggests one; override where you have conviction. Chris swapped Polar for Stripe with managed payments to keep merchant of record. We always override to our stack (Part 6).
- **Coding tool.** Say Claude Code. This changes how the PRD and roadmap are written.

**Step 4. Generate the three documents.** Approve generation. Review each one before calling planning done.

**Step 5. Optionally generate the design system first.** The video recommends producing a design.md (the design system spec) before the build so the product does not come out generic. For us this is already solved: Checker tokens, Hanken Grotesk plus IBM Plex Mono, the README colour block. Paste our tokens into the PRD instead.

---

## Part 4. The three documents and what each must contain

**product-vision.md**: strategy, audience, and brand voice. Who it is for, the transformation, the one liner, the business model, 90 day success criteria, six month vision, go to market sketch, and the voice rules.

**prd.md**: the technical spec the coding agent builds from. Must include: product summary, objective, market differentiation, magic moment, success criteria, architecture overview, chosen tech stack with reasons, repository structure (actual file tree), cost estimate for the first thousand users, full data model, API specification, and user stories. Specificity is the point: file paths, package names, table shapes.

**product-roadmap.md**: the phased build plan. Must include: a build philosophy section, phases (the video's example: foundation, then MCP and magic moment, then the core library, then payments, then polish and launch prep), a goal line for every phase, every task as a markdown checkbox, and an agent session guide explaining how to resume. The checkboxes are load bearing: they are what makes a dead session resumable with "carry on from where you left off."

---

## Part 5. The build loop (what the build MVP skill actually does)

When Fable 5 access is live, one prompt per project: "Build the full application using the build MVP skill" (or paste this loop if not using Builder OS). The loop, repeated until every roadmap task is checked:

1. Find the first unchecked task in product-roadmap.md.
2. Read what the task needs, referencing the PRD and any notes on the task.
3. Implement exactly as specified: file paths, package names, everything.
4. Test and verify that task works before moving on.
5. Mark the checkbox complete.
6. At every phase boundary, run an end to end test with browser use and confirm the phase's goal line is actually true before starting the next phase.

If the session stops, dies, or compacts: new session, "continue from the first unchecked task in the roadmap." Nothing is lost because state lives in the document, not the conversation.

After the one shot: review the result in the browser yourself (mobile and desktop), fix polish items, deploy. The video is clear that Fable 5 one shots the foundation, not the finished product. The last mile is still yours.

---

## Part 6. Adapting this to Guided Childhood

We already run a version of this system. The mapping:

| Builder OS artifact | Our equivalent |
|---|---|
| product-vision.md | guided-childhood-build/README.md plus research docs |
| prd.md | guided-childhood-build /docs/ specs |
| product-roadmap.md | /plans/week-N-plan.md files |
| Agent session guide | CLAUDE.md plus /plans/decisions.md |
| design.md | README colour tokens plus DESIGN_SYSTEM.md |

What the video adds that we should adopt:

1. **Checkbox tasks with phase goals in every week plan.** Our week plans describe work; they should also be executable loops. Every task a checkbox, every phase a one line goal, and an instruction block at the top telling the agent to work the Part 5 loop. This makes any plan resumable after compaction, which is already our weak point.
2. **A verification step per task, not per session.** Test each task before ticking it, and browser test end to end at phase boundaries. This matches non-negotiable 5 (mobile and desktop checked in DevTools before declaring done) but moves it inside the loop instead of the end.
3. **Stack overrides are ours, always.** Any planning session for anything we build: Next.js 16, Supabase, Stripe (founder rate capped at 50 in code), Anthropic API with DIGI_MODEL as env var defaulting to claude-fable-5, Vercel, GSAP only for motion. Never accept Convex, Clerk, Polar, or Inter from a planner default.
4. **Voice is steered, never defaulted.** Justin's voice: warm, plain, direct, no AI isms, no dashes in copy. Paste that into any brand voice step.

---

## Part 7. The 7 day window plan

Caveat first: the 7 day access figure comes from the video. Verify the actual terms on your subscription before planning around it.

**Before the window (now, on Opus):**
- Day 0: Write the spec documents for the two or three biggest unbuilt pieces. Candidates from our roadmap: the schools platform buildout (schools/01 plus docs/09), the retention system (docs/08 save flow), and the digital parenting hub content engine. Each gets a roadmap file in /plans/ with checkbox tasks and phase goals in the Part 4 format.

**During the window (Fable 5):**
- Days 1 and 2: One shot the biggest spec. Work the loop, let it run, verify phase boundaries.
- Days 3 and 4: Second spec. Same pattern.
- Day 5: Third spec or deep polish passes on the first build.
- Days 6 and 7: Reserve. Fixes, mobile and desktop checks, deploy, and anything the loops left unchecked.

**Rule for the window:** no planning on Fable 5. If a spec turns out to be wrong mid build, drop back to a normal session to fix the spec, then resume the loop. Fable 5 time is build time only.

---

## Decisions to log after this is approved

- Adopt checkbox plus phase goal format for all /plans/ week plans going forward.
- Adopt the per task verify loop for build sessions.
- Confirm the actual Fable 5 access terms and set the window schedule.
