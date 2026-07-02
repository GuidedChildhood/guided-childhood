# Guided Childhood — Schools Lesson Build Spec v2
### Research knowledge base + 21-module map + video layer + teacher workspace + data layer + pilot offer + build plan
**Last reviewed: 2 July 2026** · Owner: JP · Product: Guided Childhood Schools (The Social Billboard)

> **v2 note.** This merges JP's SCHOOLS_LESSON_BUILD_SPEC.md (2 Jul 2026) with the platform's existing build assets (week 10 curriculum plan, DiGi Squad character reference, lessons player, migrations 013 to 017) and the new research streams. Nothing from v1 has been removed. New in v2: Section 9 (video layer), Section 10 (reference lesson, fully scripted), Section 11 (teacher workspace), Section 12 (data, marking and reporting), Section 13 (pilot offer and go-to-school motion), Section 14 (coding and IT integration), Section 15 (competitor best parts), Section 16 (build plan alongside the parents platform), updated build prompt.
>
> **Research status (updated 2 Jul 2026, evening).** Four deep research streams were commissioned. Landed and folded in: the full AI video study (Section 9), the school evidence/reporting study (Section 12), the curriculum bodies deep dive (Oak, NCCE, PSHE Association, Jigsaw; Sections 3 and 15), the CPD/safeguarding vendors dive (National College, Qoria, Diana Award, Papaya; Section 15), and the MIS landscape (Sections 12 and 16). Still pending after a research-window pause: the UK charities and paid-primary competitor clusters, the line-by-line statutory checklist (Computing PoS bullets, AILit 22 competencies, Ofsted's 11 areas, DfE AI expectations), NCCE unit mapping, GDPR/DPO detail, marking-automation landscape, and pilot norms. Remaining **[RESEARCH PENDING]** tags mark exactly those. Nothing pending blocks Phases 1 to 2 of the build.

---

## 0. How to use this file

This is the single source of truth for building the schools scheme of work in Claude Code. It has two jobs:

1. Make sure every lesson includes everything statutory and evidence-critical, so nothing is missed.
2. Make sure everything promised on the schools landing page is actually delivered in the build.

The file is split into a **durable spine** (rarely changes) and a **volatile layer** (changes as the world changes, held in config so a legislative or model change is a config edit, not a rewrite). This mirrors the existing `social_media_law` flag pattern on the consumer site.

Feed Claude Code Sections 1 to 6 as context for content work, Sections 9 to 14 for platform work, then run the build prompt in Section 17.

---

## 1. THE DURABLE SPINE (rarely changes)

### 1.1 The thesis (never drifts)
- The platform is neither pro-ban nor anti-ban.
- Core line: **the ban removes the apps, it does not raise the child.** Guided Childhood is the education the ban leaves behind.
- Defensibility is anchored to the EfCW framework, not to platform-specific or model-specific content. This survives any legislative or technological outcome.

### 1.2 Education for a Connected World — the 8 strands (the curriculum spine)
Every lesson maps to at least one strand. The schools page claims "all 8 UKCIS framework areas covered," so all 8 must appear across the scheme with a printable mapping document.

1. Self-image and identity
2. Online relationships
3. Online reputation
4. Online bullying
5. Managing online information
6. Health, wellbeing and lifestyle
7. Privacy and security
8. Copyright and ownership

### 1.3 Stage model for the SCHOOLS product
The schools product runs on **Key Stages / year groups (EYFS to Year 13)**, not the five consumer stages. Keep the consumer five-stage naming for the parent product only. Schools think in Key Stages; the landing page is already written in KS terms. Do not mix the two systems in schools output.

### 1.4 Pedagogical principles (how every lesson is built)
Drawn from how Oak National Academy and the NCCE Teach Computing Curriculum actually build lessons, so Guided Childhood content slots into real classroom practice and mirrors the Oak model (the stated benchmark for the schools offering).

- **One clear, specific action per lesson.** Not a list of rules. A skill the child can use that night. (Already promised on the page. Hold the line on it.)
- **Spiral curriculum.** Strands revisited each stage, each time consolidating and extending prior learning.
- **Rosenshine's principles of instruction.** Review prior learning, small steps, model, check for understanding, guided then independent practice.
- **Cognitive load management (Sweller) and multimedia principles (Mayer).** Chunk into learning cycles. Strip redundant images and text from slides. Mayer's segmenting principle is also why the video layer is beats, not films (Section 9).
- **Retrieval practice.** Every lesson opens with a quick recall of the last.
- **Accessible by design.** Accessible fonts, high contrast, captions, no reliance on home device access (see 1.6).

### 1.5 The human skills AI cannot replace (thread through every stage)
From the OECD/EC AILit framework and WEF future-of-work evidence. These are the durable learning outcomes that survive model churn: critical thinking, judgement, ethical reasoning, empathy, collaboration, creativity, adaptability. Every AI-related lesson must end on a human skill, not a tool feature.

### 1.6 Equity design principle (the digital divide)
1 in 5 UK children live in digital poverty. Around 45% of families with children fail the Minimum Digital Living Standard, and 57% of low-income households lack reliable device or internet access. AI use has split further: 88% of students now use generative AI, but advantaged pupils use it far more effectively. Build consequences:
- Never assume a child has a personal device, home broadband, or a paid AI tool.
- Every lesson works on paper. Digital extension is optional, never required.
- The "readiness at 16" and AI modules explicitly address the second divide: not just access, but skilled, critical use.
- The video layer needs one teacher screen only. Pupils never need devices to watch.

### 1.7 School DiGi guardrails (safeguarding advisor)
- **Pathways only.** Never outputs allow or deny decisions. Only personalised pathways calibrated to context.
- School DiGi serves educators (safeguarding queries, statutory questions, lesson prep), not pupils directly.
- GDPR compliant. No pupil personal data processed without lawful basis. Aligns to DfE Generative AI product safety expectations (logging, transparency, child-safety-first).
- Every safeguarding-adjacent lesson carries a DSL note and links to the concern form.

### 1.8 The TRUST framework
The scheme is grounded in JP's TRUST framework. **Do not invent or paraphrase the TRUST acronym or its components.** Pull the canonical TRUST definitions from the existing Guided Childhood master docs and reference them verbatim. If the canonical source is not in context, stop and ask JP rather than fabricating.

### 1.9 The character principle (new in v2)
Characters are a door, not a dependency: every lesson works without them, but the character video beat is the signature and the differentiator (no UK competitor animates its mascot as the actual teacher, see Section 15). The DiGi Squad reference (`digi-squad/README.md` in the platform repo) is the single source of truth for design, voice rules and canonical intro lines. The Jigsaw distancing technique is law: the character voices the struggle so the child agrees with the character instead of being challenged. Character casting by key stage is defined in Section 9.4; the squad kids carry primary, the UK animal guides and DiGi carry secondary, so secondary pupils never feel babied.

---

## 2. THE VOLATILE LAYER (config-driven, refresh on cadence)

Everything that dates fast lives here. Lessons reference **concepts and config keys**, never hardcoded platform names, model versions, statutes-in-force dates, or statistics. A change in the world is a change to this block only.

### 2.1 Config schema (extend the existing site config)

```js
const LANDSCAPE_CONFIG = {
  last_reviewed: "2026-07-02",

  // Extends the existing social_media_law flag.
  // Existing enum was: "none" | "partial_ban" | "full_ban_u16"
  // Current reality needs a fourth state: announced but regulations not yet laid.
  social_media_law: "u16_ban_confirmed_regs_pending",
  // Allowed: none | partial_ban | u16_ban_confirmed_regs_pending | full_ban_u16_in_force

  ban_timeline: {
    announced: "2026-06-15",
    enabling_act: "Children's Wellbeing and Schools Act 2026 (in force 2026-04-29), amends Online Safety Act 2023 (new s214A)",
    full_consultation_response_due: "2026-07",     // imminent — check for landed response
    ofcom_age_assurance_study_due: "2026-10-31",
    regs_expected_laid: "before end 2026",
    protections_in_force_expected: "Spring 2027"
  },

  // Kept as config data, not hardcoded in lessons, until Regulations land.
  banned_platforms_in_scope: ["Instagram","YouTube","TikTok","Snapchat","Facebook","X"],
  // Highest-impact unresolved detail: YouTube-in-scope confirmation.
  ban_exemptions_likely: ["educational services","e-commerce","music streaming"],
  ban_out_of_scope: ["private messaging services"],
  ban_extra_restrictions: ["under-16 livestreaming across all platforms","stranger contact features","features off by default for 16–17s","gaming feature restrictions"],

  // AI models: reference by TIER and CAPABILITY, never by version number inside lesson copy.
  // This list is illustrative and expires fast. Refresh at each review.
  ai_named_examples: {
    note: "For teacher context only. Lessons teach concepts, not versions.",
    chat_assistants: ["ChatGPT (OpenAI)","Claude (Anthropic)","Gemini (Google)","Copilot (Microsoft)","Grok (xAI)"],
    frontier_state_2026_07: "GPT-5.x, Claude Opus 4.8 / Fable 5 / Sonnet 5, Gemini 3.x. Version numbers change monthly.",
    agent_examples: ["Gemini Spark (cloud agent)","Claude Cowork / Claude Code (desktop agent)","ChatGPT Codex / Operator (coding + browser agents)"]
  },

  // NEW in v2: video generation models, same churn rule as DIGI_MODEL.
  // Lesson content never names a video model; the production pipeline reads these keys.
  video_models: {
    identity_beats: "seedance_2_0",        // reference-driven identity, start/end frame chaining, 4-15s, native audio
    dialogue_beats: "kling3_0",            // multi-shot, audio sync, 3-15s
    draft_tier: "seedance_2_0_mini",       // cheap iteration before final renders
    fallback: "gemini_omni",               // reference-driven, 4-10s, native audio
    max_single_clip_seconds: 15,           // hard catalogue ceiling as of 2026-07; stitch beyond this
    voice_engine: "higgsfield create_voice (one cloned voice per character, created once)"
  },

  // Statutory / guidance versions currently in force.
  guidance_in_force: {
    kcsie: "KCSIE 2025 (in force 1 Sep 2025)",
    rshe: "Revised RSHE guidance in force 1 Sep 2026",
    dfe_ai: "Generative AI in education policy paper + product safety expectations (updated Jun 2025)",
    ofsted: "New Education Inspection Framework, report cards, 11 areas, safeguarding met/not met (live 10 Nov 2025)",
    curriculum: "New national curriculum publishes spring 2027, first teaching Sep 2028. Computing GCSE replaces CS GCSE; media/financial literacy statutory in Citizenship."
  },

  // Live statistics used in CPD and teacher notes. Cite source + date. Refresh at review.
  key_stats: {
    cyp_mh_referrals: "Over 1 million children referred to mental health services (~1 in 10), nearly double the 564,000 of 2018–19 (Children's Commissioner, 2024–25).",
    probable_disorder: "18% of 7–16 year-olds had a probable mental health disorder (NHS Digital).",
    social_media_use: "81% of 10–12s use a social media app; 86% have their own account (Ofcom, 2025).",
    porn_exposure: "79% of children see violent pornography before 18; average first exposure age 13 (Children's Commissioner).",
    phone_ownership: "97% of 13–15s own a mobile phone (Ofcom, 2025).",
    digital_poverty: "1 in 5 UK children in digital poverty; 57% of low-income households lack reliable device/internet access.",
    genai_use: "88% of students now use generative AI, up from 53% the prior year.",
    evidence_nuance: "SMART Schools study (Lancet Regional Health Europe, 2025): restrictive school phone policies showed no measurable difference in wellbeing, sleep, physical activity or attainment; pupils compensate outside school. The 2025 Orben-led review found no established causal link. Use this honesty; do not overclaim."
  }
};
```

### 2.2 Refresh protocol (the "updates as fast as it changes" mechanism)
- **Cadence:** review this config on the first working day of each month, and immediately on any of these triggers:
  - The July 2026 full consultation response lands (imminent).
  - Ofcom publishes the age-assurance study (due 31 Oct 2026).
  - Regulations are laid / come into force (expected before end 2026 / Spring 2027).
  - KCSIE, RSHE, or the national curriculum updates.
  - A frontier AI model tier shifts materially (new agent capability, not a version bump).
  - A video model tier shifts materially (longer coherent clips, cheaper identity consistency): update `video_models`, re-render nothing until a refresh is scheduled.
- **What changes vs what does not:** update the config keys. Lesson copy should not need editing because it references concepts and config keys. If a lesson needs a copy edit for a factual change, that lesson has hardcoded a volatile fact and must be refactored to pull from config.
- **Set the DiGi model** via the existing swappable `DIGI_MODEL` config value (claude-fable-5 preferred, latest Opus or Sonnet as fallback).

---

## 3. INSTITUTION AND GUIDANCE MAP (who sets the rules)

For CPD, the statutory alignment document, and teacher context. Each item gives the "so what" for the build.

- **DfE — Curriculum and Assessment Review (final report 5 Nov 2025, gov response same day).** New curriculum spring 2027, first teaching Sep 2028. Computing GCSE replaces CS GCSE (adds digital literacy, data, AI). New post-16 data science and AI qualification. Digital literacy sits in Computing; online harms and responsible use in RSHE; critical evaluation of misinformation and financial/scam literacy in statutory Citizenship. **So what:** your scheme is ahead of the standard if it delivers AI literacy and financial/scam literacy now. Say so on the page (already implied by "stay ahead of the standard").
- **DfE — KCSIE 2025 (in force 1 Sep 2025).** Added misinformation, disinformation and conspiracy theories to content risks. Pulled in generative AI product safety expectations. Filtering and monitoring must be actively understood and managed, including AI-generated material, with SLT accountable. **So what:** misinformation and AI content is now a safeguarding harm, not just a curriculum topic. DSL notes must reflect this.
- **DfE — Generative AI in education (policy paper + product safety expectations, updated Jun 2025).** Human oversight always. Only approved tools. No pupil personal data without lawful basis. Review homework/assessment for AI. Funded Oak's Aila lesson assistant, £1m for AI marking, £3m content store, edtech evidence board. **So what:** your staff AI tools policy template must map to this. School DiGi must demonstrably comply. The marking automation in Section 12 is designed to these expectations (teacher always approves, nothing autonomous touches a pupil record).
- **DfE — RSHE (revised guidance in force 1 Sep 2026).** One-stop RSHE hub covers digital safety (AI, deepfakes, online harms), misogyny, body image, mental health, pornography. **So what:** this is where pornography, misogyny, body image and consent live statutorily. Close those gaps here.
- **Ofsted — new framework (live 10 Nov 2025).** Report cards, 11 evaluation areas, five-point scale, safeguarding judged separately (met / not met). AI not judged in isolation, assessed through existing lenses. "The biggest risk is doing nothing." **So what:** your "Ofsted evidence, ready to print" promise must map every lesson to the statutory expectations behind the toolkit, and show impact, not just coverage. Section 12's evidence pack is that promise delivered as a generated report, not a filing job.
- **UKCIS — Education for a Connected World (2020, DfE recommended).** The 8 strands. **So what:** the spine. All 8 must be covered and mapped.
- **NSPCC.** Safeguarding research and school resources; KCSIE summary briefings. **So what:** cite as a safeguarding authority in DSL notes and CPD.
- **Children's Commissioner.** Mental health referral data, pornography exposure data, mobile phone policy census (99.8% of primary and 90% of secondary schools restrict phones). **So what:** primary evidence source for the demand-side case.
- **NHS Digital / NHS England.** Mental Health of Children and Young People prevalence data. **So what:** the clinical baseline for CPD.
- **Oak National Academy + NCCE (Teach Computing Curriculum, Raspberry Pi Foundation).** The lesson-design benchmark. New Oak digital literacy lessons Years 1 to 9. Aila AI lesson assistant. **So what:** mirror their lesson anatomy so teachers recognise the format. Section 14 maps our modules to NCCE units for the coding and IT mix-in.
- **SWGfL / Project Evolve, PSHE Association, Internet Matters, Childnet.** Online safety resource ecosystem, EfCW-aligned. **So what:** position Guided Childhood as the parent-reaching, evidence-informed, fully-resourced layer these do not provide.
- **OECD / EC — AILit framework ("Empowering Learners for the Age of AI", final 2026).** Four domains: Engage with AI, Create with AI, Manage AI, Design AI. 22 competencies. Feeds PISA 2029 assessment. **So what:** structure your AI literacy thread to these four domains so it is future-proof and internationally aligned.

**Research landed so far (2 Jul 2026), the confirmed tailwind:**
- **Oak digital literacy is the benchmark to beat:** 54 free lessons, Years 1 to 9, launched ~30 Jun 2026 with Raspberry Pi: nine units (one per year), six one-hour lessons each, five threads (information and data; communication and participation; content creation; safety, security and wellbeing; digital problem-solving), covering AI safety, bias, misinformation, personal data. Fixed anatomy per lesson: starter quiz, video, worksheet, exit quiz. It is the DfE-adjacent reference implementation of the post-review curriculum, two years ahead of statutory rollout; it has no characters, no tracking platform, no parent layer and stops at Year 9. Our scheme must map to its thread language and beat it on delivery.
- **RSHE 2026 makes deepfakes and AI-generated content statutory at KS3/4 from September 2026** (age-appropriate foundations recommended at primary). Module 12 lands exactly on a brand-new statutory requirement.
- **Curriculum and Assessment Review (Nov 2025):** media literacy and misinformation skills embedded across the curriculum; statutory primary citizenship including media literacy; broader Computing GCSE with data and AI (first teaching 2028); possible post-16 data science and AI qualification. Government **Media Literacy Action Plan (Mar 2026)** names deepfakes, AI content and algorithmic manipulation as required understanding.
- **KCSIE 2025:** schools must self-assess against DfE filtering and monitoring standards with an at-least-annual review, the four Cs expanded, misinformation/disinformation and gen-AI risks named. Our DSL notes and CPD speak this language.
- **RSHE 2026 transparency duty:** schools must make all curriculum materials available to parents on request; our one-click parent materials export turns a compliance burden into a feature.

**[RESEARCH PENDING — remainder]** Still to fold in when the research window reopens: the statutory Computing programme-of-study bullets per key stage, the AILit 22 competencies (final 2026 text), Ofsted's 11 evaluation areas in detail, the DfE AI product safety expectations line by line, and the consolidated EYFS to Year 13 statutory targets checklist. Do not make public "we hit every government target" claims until that checklist is verified.

---

## 4. THE EVIDENCE BASE (cite per module; honesty is the moat)

Matched to the researchers named on the landing page (Orben, Odgers, Przybylski, Livingstone) plus current UK sources. Every claim in a lesson or CPD slide must be defensible to a hostile expert (the Odgers test).

- **Demand side (strong):** referrals over 1 million (~1 in 10), nearly double 2018–19; 18% of 7–16s with a probable disorder; 81% of 10–12s on social media; 79% see violent porn by 18, average age 13; 97% of 13–15s own a phone.
- **Causation (contested, and that is the point):** the 2025 Orben-led academic review found the screentime evidence mixed, no causal link established. Przybylski's work supports a "not just time, but what and how" reading. Livingstone frames a rights-and-participation lens, not just harm.
- **Phone-free schools (mixed):** Policy Exchange and Smartphone Free Childhood report fewer safeguarding incidents and staff-time savings; UNESCO 2023 backs restriction. But the SMART Schools study (Goodyear et al., Lancet Regional Health Europe, 2025) found no measurable wellbeing, sleep, activity or attainment benefit, because pupils compensate after school. Children's Commissioner census: nearly all schools already restrict phones.
- **The honest synthesis (your line):** restriction changes the environment, not the child. Removing apps does not build judgement. That is the education gap Guided Childhood fills. Bake this into KS4 "readiness at 16" and the CPD so teachers never overclaim.

---

## 5. THE 21-MODULE MAP (build target)

Two layers in every stage: **behaviour and routines** first, then **digital literacy skills**. Landing-page topics are preserved verbatim and the eight gap-fills are folded in. Each module lists the EfCW strand(s), statutory hook, evidence anchor, and the single action outcome. Section 9.4 assigns each module its character; Section 14 tags the coding and IT mix-in points.

> Gap-fills are marked **[GAP-FILL]**. These close the eight items missing from the current topic lists so the "all 8 UKCIS areas" and statutory claims hold.

### EYFS (Reception) — 1 module
1. **Screens and kindness / real vs not real (seed of AI literacy)**
   Behaviour: co-viewing, gentle routines, screens with a grown-up. Literacy: some things on a screen are real, some are made up (seed of "is this real or made by a computer"). EfCW: 1, 6. Statutory: EYFS PSED, RSHE foundations. Evidence: EYSTAG under-5s screen report. Action: "I can ask a grown-up if something on a screen is real." Character: Sofia + DiGi Junior.

### KS1 (Years 1–2) — 2 modules
2. **Kind screens, calm bodies**
   Behaviour: how screens make my body and mood feel; stopping and telling. Literacy: being kind on screens; who to tell. EfCW: 4, 6. Statutory: RSHE, EfCW. Evidence: wellbeing baseline. Action: "I can name how I feel after screen time and tell a grown-up." Character: Sofia.
3. **Real, pretend, or made by a computer [GAP-FILL: AI literacy early]**
   Behaviour: co-viewing choices. Literacy: photos and videos can be changed or made up; AI can make pictures. EfCW: 5. Statutory: EfCW managing information. Evidence: AILit "Engage with AI" domain. Action: "I can spot that a picture might not be real." Character: Zara (junior detective mode) + DiGi Junior.

### KS2 (Years 3–6) — 6 modules
4. **Screen routines that work** (after-school, bedtime and sleep, mealtimes, homework avoidance)
   EfCW: 6. Statutory: RSHE health/wellbeing. Evidence: sleep displacement research. Action: one routine the child sets tonight. Character: Oliver.
5. **Gaming: time, intensity, and spend [scam/financial seed, GAP-FILL]**
   Behaviour: gaming intensity, boredom, snacking, physical health. Literacy: loot boxes, in-game spend, "free" that costs. EfCW: 6, 7. Statutory: Citizenship financial literacy (fraud/scam prevention). Evidence: gambling-style mechanics. Action: "I can spot when a game is trying to get me to spend." Character: Oliver.
6. **How algorithms work**
   Literacy: why the feed shows what it shows; the loop that keeps you scrolling. EfCW: 5, 6. Statutory: Computing, EfCW. Evidence: attention economy. Action: "I can explain why my feed keeps me watching." Character: DiGi (the existing pilot video `2052451b` seeds this module). Coding mix-in: paper algorithm + Scratch ranking rule (Section 14).
7. **Privacy and digital reputation**
   Literacy: what is private, what lasts, your digital footprint. EfCW: 3, 7. Statutory: EfCW privacy/reputation. Evidence: footprint permanence. Action: "I can decide what not to share." Character: Sofia.
8. **Being kind and safe with others online (online bullying) [GAP-FILL: EfCW strand 4 explicit]**
   Behaviour: group chats and fallout. Literacy: recognising, reporting and not being a bystander to online bullying. EfCW: 2, 4. Statutory: RSHE, anti-bullying (Ofsted). Evidence: cyberbullying prevalence. Action: "I know three things to do if someone is unkind online." Character: Sofia + Zara.
9. **My work and other people's work (copyright and ownership) [GAP-FILL: EfCW strand 8]**
   Literacy: owning what you make; using others' images/music/words; AI and where content comes from. EfCW: 8. Statutory: EfCW copyright/ownership, Computing. Evidence: AILit "Create with AI". Action: "I can credit work that is not mine." Character: Zara.

### KS3 (Years 7–9) — 6 modules
10. **Mood and screens**
    Behaviour: mood changes after screens; the honest, mixed evidence. Literacy: noticing patterns; agency over habits. EfCW: 6. Statutory: RSHE mental health. Evidence: Orben/Przybylski "what and how, not just time." Action: one honest self-check the pupil runs for a week. Character: Brock the badger + DiGi.
11. **Social media, group chats, and the workarounds** (VPNs, friends' accounts, rules being tested)
    Literacy: how social platforms work; VPNs and workarounds; why rules exist. EfCW: 2, 4, 7. Statutory: EfCW, Online Safety Act education duty. Evidence: workaround behaviour. Action: "I can explain the risk behind a workaround I might be tempted by." Character: Vix the fox (street-smart is the right voice for workarounds).
12. **Misinformation, deepfakes and AI content** ← REFERENCE LESSON, fully scripted in Section 10
    Literacy: spotting manipulated and AI-generated content; misinformation, disinformation, conspiracy theories (KCSIE content harms). EfCW: 5. Statutory: KCSIE 2025, Citizenship media literacy, DfE AI. Evidence: KCSIE content-risk expansion. Action: "I can run three checks before I believe or share something." Character: Zara (Y7 to Y8 register) with Vix cameo.
13. **Scams, fraud and money online [GAP-FILL: statutory financial literacy]**
    Literacy: phishing, fake offers, crypto and get-rich hype, account theft. EfCW: 7. Statutory: Citizenship digital financial literacy (fraud/scam prevention). Evidence: fraud exposure in teens. Action: "I can spot a scam's three tells." Character: Vix.
14. **Bodies, image and pressure online (body image + pornography exposure) [GAP-FILL: statutory RSHE]**
    Literacy: edited/idealised bodies; healthy self-image; age-appropriate handling of pornography exposure and why it distorts. EfCW: 1, 6. Statutory: RSHE 2026 (body image, pornography). Evidence: Children's Commissioner porn-exposure data. Action: "I can name one way images online are made to make me feel worse." Character: DiGi only (character comedy is wrong here; DiGi carries the calm register). DSL note.

### KS4 (Years 10–11) — 5 modules
15. **Manipulation and persuasion**
    Literacy: dark patterns, influence, engineered outrage, who profits. EfCW: 5, 6. Statutory: Citizenship, RSHE. Evidence: attention economy. Action: "I can name the technique being used on me." Character: Vix.
16. **Consent, images and the law (image-sharing) [GAP-FILL: distinct from sextortion]**
    Literacy: consent, sharing images, the law on under-18 images, pressure. EfCW: 2, 7. Statutory: RSHE, law. Evidence: image-based abuse data. Action: "I know the law and my options before anything is shared." Character: DiGi only. DSL note.
17. **Sextortion**
    Literacy: recognising, refusing, reporting, and the "you are not in trouble" message. EfCW: 2, 4. Statutory: RSHE, safeguarding. Evidence: NCA/IWF sextortion rise. DSL note mandatory. Action: "I know exactly who to tell and that it is not my fault." Character: DiGi only, minimal animation, maximum calm.
18. **Radicalisation and misogyny [GAP-FILL: name misogyny explicitly]**
    Literacy: pipelines, incel-adjacent and extremist content, gendered harm, misogyny. EfCW: 2, 5. Statutory: Prevent, KCSIE, RSHE (misogyny). Evidence: KCSIE/RSHE naming. DSL note mandatory. Action: "I can recognise when content is grooming my beliefs." Character: DiGi only. DSL note.
19. **Readiness at 16 (the ban world) — CROWN MODULE**
    Behaviour + literacy for the confirmed under-16 ban. Sub-topics (from config, not hardcoded): age verification mechanics; the workaround trap; the 15-to-16 cliff edge (zero to adult overnight); school-gate social fallout; what the ban does and does not do. Teach the honest line: the ban removes apps, it does not build judgement. EfCW: all, esp 5, 6, 7. Statutory: Online Safety Act, Children's Wellbeing and Schools Act 2026. Evidence: SMART Schools nuance + Australia ban outcomes. Action: "I can plan how I will handle full access when it arrives." Character: Vix + DiGi. Cross-reference: the algorithm literacy project's "arrival at 16" material (first-week audit, arriving with habits beats arriving with rules) is the consumer-side twin of this module; keep the two in step.

### KS5 (Years 12–13) — 2 modules
20. **AI mastery and data rights** (Engage, Create, Manage, Design AI)
    Literacy: using AI well and critically; prompts, verification, bias, hallucination; agents and automation; data rights, profiling, consent. EfCW: 5, 7, 8. Statutory: DfE AI, AILit alignment. Evidence: AILit 4 domains, 88% student use / skill divide. Action: "I can use an AI tool and defend where I checked its work." Character: DiGi + motion graphics (no squad kids at KS5). Coding mix-in: build a small agent workflow (Section 14).
21. **Digital identity and the future of work**
    Literacy: identity, reputation and portfolio online; automation, agents, self-driving systems, the jobs AI reshapes; the human skills that endure. EfCW: 1, 3. Statutory: careers, Citizenship. Evidence: WEF future-of-jobs, AILit human-skills. Action: "I can name the human skills I am building that AI cannot replace." Character: DiGi + motion graphics.

---

## 6. LESSON SCHEMA (the concrete build object)

Every one of the 21 modules is built to this schema. Landing page promises every lesson has: plan, worksheet, slides, parent note. Add DSL note where safeguarding-adjacent. v2 adds the video beats block and the assessment block (these power Sections 9 to 12).

```json
{
  "module_id": "ks3-12-misinfo-deepfakes",
  "title": "Misinformation, deepfakes and AI content",
  "stage": "KS3",
  "year_band": "Years 7–9",
  "layer": ["behaviour_and_routines", "digital_literacy"],
  "efcw_strands": [5],
  "statutory_hooks": ["KCSIE 2025 content risks", "Citizenship media literacy", "DfE AI in education"],
  "ailit_domains": ["Engage with AI", "Manage AI"],
  "evidence_anchor": "KCSIE 2025 content-risk expansion; Orben 2025 review",
  "single_action_outcome": "I can run three checks before I believe or share something.",
  "assets": {
    "lesson_plan": { "retrieval_starter": true, "learning_cycles": 3, "model_then_practice": true, "check_for_understanding": true, "plenary_action": true },
    "worksheet": { "paper_first": true, "digital_extension_optional": true },
    "slides": { "low_cognitive_load": true, "captions": true, "high_contrast": true },
    "parent_note": { "one_action_to_reinforce": true, "no_login_required": true },
    "dsl_note": { "required": true, "concern_form_linked": true }
  },
  "video_beats": [
    { "beat": "intro", "character": "zara", "seconds": 12, "board_text": "REAL OR MADE?", "model_ref": "video_models.dialogue_beats", "script_ref": "section-10" },
    { "beat": "concept", "character": "zara", "seconds": 10, "board_text": "THREE CHECKS", "model_ref": "video_models.identity_beats" },
    { "beat": "pause", "character": "digi_junior", "seconds": 8, "reuse_library": true },
    { "beat": "mission", "character": "zara", "seconds": 8, "board_text": "CHECK BEFORE YOU SHARE", "model_ref": "video_models.identity_beats" }
  ],
  "assessment": {
    "retrieval_starter": { "questions": 4, "auto_marked": true },
    "in_lesson_checks": { "count": 2, "auto_marked": true },
    "exit_quiz": { "questions": 5, "auto_marked": true },
    "teacher_judgement": { "scale": ["working_towards", "met", "exceeded"], "one_tap": true },
    "action_commitment": { "captured": true, "revisited_next_lesson": true }
  },
  "config_refs": ["banned_platforms_in_scope", "ai_named_examples", "key_stats.evidence_nuance"],
  "copy_rules": { "no_dashes_as_punctuation": true, "one_action_not_a_rules_list": true },
  "accessibility": { "works_without_home_device": true, "video_needs_teacher_screen_only": true, "paper_fallback_complete": true }
}
```

Also build to schema: **6 assemblies (KS1 to KS5)**, **primary and secondary parent evening packs**, the **2-hour CPD module** (research, the cliff edge, TRUST framework, what children encounter now, safe classroom practice and disclosure response, certificate), and the **policy templates** (school digital behaviour policy, staff AI tools policy mapped to DfE 2025, online safety statement, statutory alignment document for governors).

---

## 7. SOURCES (key, with dates for the refresh log)

- Curriculum and Assessment Review final report + government response, GOV.UK, 5 Nov 2025.
- Keeping Children Safe in Education 2025, DfE (in force 1 Sep 2025); NSPCC summary briefing.
- Generative artificial intelligence in education (policy paper + product safety expectations), DfE, updated Jun 2025.
- Relationships, Sex and Health Education revised guidance, DfE (in force 1 Sep 2026).
- Ofsted Education Inspection Framework and report cards (live 10 Nov 2025); "How Ofsted will consider AI", 27 Jun 2025.
- Education for a Connected World, UKCIS, 2020.
- Social media ban for under-16s announcement, GOV.UK, 15 Jun 2026; "Growing up in the online world" consultation (2 Mar–26 May 2026, 116,211 responses); Children's Wellbeing and Schools Act 2026; House of Commons Library briefing CBP-10468.
- Children's and Young People's Mental Health Services 2024–25, Children's Commissioner.
- Mental Health of Children and Young People, NHS Digital.
- Ofcom Children and Parents: Media Use and Attitudes, 2025.
- SMART Schools study, Goodyear et al., Lancet Regional Health Europe, 2025; Orben-led screentime review, 2025.
- Screen time: impacts on education and wellbeing, Education Committee; Mobile phones in schools (England), House of Commons Library CBP-10241.
- Oak National Academy computing curriculum + digital literacy Years 1–9; NCCE Teach Computing Curriculum (Raspberry Pi Foundation).
- OECD/EC AILit framework, "Empowering Learners for the Age of AI" (review draft May 2025, final 2026).
- Digital poverty: Digital Poverty Alliance, techUK, Minimum Digital Living Standard; DSIT Digital Inclusion Action Plan.
- **[v2 additions]** Higgsfield model catalogue (queried 2 Jul 2026): Seedance 2.0 / 2.0 Mini, Kling 3.0, Wan 2.7, Gemini Omni Flash capabilities and clip ceilings. Guo, Kim & Rubin (2014) MOOC video engagement research; Mayer, Multimedia Learning (segmenting principle). Week 10 curriculum plan and DiGi Squad character reference (platform repo). Further sources land with the four research streams.

---

# PART TWO — THE v2 LAYERS

---

## 9. THE VIDEO LAYER — Pixar-style character video, done cheaply and repeatably

### 9.1 The core finding (Higgsfield catalogue, 2 Jul 2026)

Every video model in the catalogue tops out at **15 seconds per generation**. There is no single-shot 60 second character video today. That constraint is not a problem, it is the design: short character beats threaded through the lesson beat the one long film on every axis that matters (cost, refresh cost, attention, Mayer's segmenting principle, and the existing slide player already supports interleaved video slides).

**Model assignments (held in `LANDSCAPE_CONFIG.video_models`, never in lesson copy):**

| Job | Model | Why | Clip length |
|---|---|---|---|
| Identity beats (character on screen, no dialogue or VO layered later) | **Seedance 2.0** | Reference-driven identity: feed the character's canonical still as `image_references`, chain scenes with start/end frames, native audio optional, up to 4K | 4 to 15s |
| Dialogue beats (character speaks to camera/class) | **Kling 3.0** | Multi-shot in one generation, audio sync; proven by the four rendered classroom pilots | 3 to 15s |
| Drafts and iteration | **Seedance 2.0 Mini** | Same reference-driven pipeline at budget price; approve motion and staging cheaply before a std/4K final | 4 to 15s |
| Fallback | **Gemini Omni Flash** | Reference-driven with native audio if primary models are unavailable | 4 to 10s |
| Character voices | **create_voice** (one cloned voice per character, created once) | Oliver always sounds like Oliver across every lesson; voice-over can be regenerated without re-rendering the animation, which is the cheap refresh path |

**Research verified (2 Jul 2026), the wider market picture:**

| Model | Max single gen | Character consistency tooling | Native dialogue/lip-sync | Notes |
|---|---|---|---|---|
| Kling 3.0 (Jan 2026) | 3 to 15s | Elements (up to 4 ref images or a ref video, reusable across prompts), Bind Subject in i2v | Yes, lip-synced dialogue, 5 languages, up to 6 shots per gen | Strongest all-rounder; extends from last frame to ~30s before quality drops |
| Seedance 2.0 (Feb 2026) | 4 to 15s, 4K | Up to 9 image refs + @-tagging in prompt; ~70/30 identity/motion ref weighting | Yes, joint audio-video gen | Best-in-class reference-driven identity for a recurring cast |
| Veo 3.1 | 4/6/8s + Extend chaining | Start frame | Yes, best audio fidelity | Premium price (~$0.40/s with audio); short base clips |
| Sora 2 | was 25s Pro | — | — | **Dead end: consumer app discontinued Apr 2026, API sunsets 24 Sep 2026. Build nothing on it.** |
| Runway Gen-4.5 | ~10s (60s claim unverified) | References | No native dialogue | Not on Higgsfield, expensive per second |
| Hailuo/MiniMax 2.3 | 6 or 10s | Start/end frame | No | Cheap, expressive character motion; VO in post |

Cost benchmarks (verified July 2026): roughly $0.20 to $1.50 per beat-length clip on Higgsfield credits, $5 to $20 in generation credits per finished 90 second explainer including 2 to 3 takes per beat. The whole 21-module video layer stays comfortably in the low hundreds of pounds.

**Two production facts that change the plan for the better:**
- **Kling AI Avatar 2.0 (via Higgsfield Lipsync Studio) produces up to ~5 continuous minutes of talking character from one still + one audio track.** That is the cheap path for assembly films, CPD segments and parent-evening videos: one on-model still, one scripted voice take, no stitching. Classroom lessons stay on beats; long-form talking segments use Avatar.
- **Post-sync beats native dialogue for a series.** Native lip-synced dialogue (Kling 3.0, Seedance 2.0) regenerates a slightly different voice each time. The series-grade pipeline is: render the beat silent, generate the line in the character's locked cloned voice (Higgsfield `create_voice` / Speak v2, or ElevenLabs Professional Voice Cloning at ~£22/month tier), then drive the mouth with Kling Lipsync / lipsync-2. For many beats, skip lip-sync entirely and run narrator VO over character action, which is cheaper, more reliable and pedagogically fine (Mayer's voice principle).

**Character consistency recipe (what actually works, per practitioner guides):** one 4-view character sheet per character (front, three-quarter left and right, back; neutral, even lighting), generated once with an image model and locked as canonical. Every clip is image-first: an on-model still seeds the generation; text-only prompting reinvents the character and is never used. Bold silhouettes and one distinctive colour or accessory marker per character drift least, which the DiGi Squad designs (capes, colour tokens, the gold star) already satisfy. Fresh generations cut in an editor beat long extension chains.

**The market context that makes this a moat:** mass-produced "AI slop" kids' channels are now a documented problem (Bloomberg, Dec 2025; YouTube demoting repetitive AI material in 2026), and no major UK edtech (Oak, Bitesize, Twinkl) has announced generative character animation at scale. Human-scripted, curriculum-aligned, teacher-reviewed character video with locked voices is exactly the quality line procurement will care about; the Toonstar/HarperCollins deal (2026) proves the human-story-plus-AI-pipeline model at commercial scale.

### 9.2 The three video formats

1. **Character beats (8 to 15 seconds), the workhorse.** One idea, one or two shots, board text carries the title. Rendered per lesson. This is what "characters pop up through the lesson" means in practice: intro beat, one or two concept beats, the DiGi Junior pause beat, and the mission beat, interleaved with slides and checks. Four to five beats per lesson, roughly 45 to 60 seconds of animation total.
2. **Stitched explainers (60 to 90 seconds), one per module, optional.** Four to six beats chained (each beat's final frame becomes the next beat's `start_image`, so the scene carries), one continuous cloned-voice narration laid over silent renders. Used for the assembly versions, the parent evening packs, and the marketing site. Never required in the classroom flow.
3. **The pause library (reusable).** DiGi Junior breathing/check-in beats rendered once as a library of 6 to 8 clips and reused across every lesson. Zero marginal cost per lesson.

### 9.3 Why beats, not films (the pedagogy, citations verified)

- Guo, Kim & Rubin (2014, 6.9M edX sessions): median engagement collapses after ~6 minutes even for adult learners; almost nobody finishes 9+ minute videos. That is the adult ceiling; school-age bands run lower (practical bands: ages 5 to 7, 1 to 3 min; 7 to 11, 2 to 5 min; 11 to 16, 4 to 6 min, always followed by an activity). Our 8 to 15 second beats inside an interactive lesson sit far inside every threshold.
- Mayer's segmenting principle (verified: his classic experiments segment a 2.5 minute animation into 8 to 10 second learner-paced chunks): learning improves when content arrives in short segments with a continue control. Our beat-plus-check structure is literally the experimental condition that wins.
- BBC Bitesize class clips run ~1 to 5 minutes; Oak lessons chunk video + quiz + task, the video is one segment of the lesson, never the lesson. Our anatomy matches the UK reference implementations.
- Mayer's segmenting principle: learning improves when content arrives in learner-paced chunks. The beat structure IS segmentation.
- Rosenshine: each beat opens a learning cycle (model), the slide and check that follow are the practice. The character never lectures for a minute; the character hands over.
- Refresh economics: when the world changes, re-rendering a 10 second beat (or just re-laying its voice track) costs pennies against re-producing a 3 minute film.

### 9.4 Character casting by key stage (secondary must never feel babied)

| Stage | On-screen cast | Register |
|---|---|---|
| EYFS to KS1 | Sofia, DiGi Junior | Gentle, playful, co-viewing energy |
| KS2 | Oliver (habits/gaming), Zara (truth/privacy detective), Sofia (safety), DiGi Junior pause | The squad proper, capes and superpowers |
| KS3 | Zara (Y7 to Y8 truth topics), Vix the fox (workarounds, scams, street-smart topics), Brock the badger (wellbeing), DiGi anchor | Squad kids retire gradually; animal guides carry edge |
| KS4 | Vix, DiGi only. Sensitive modules (16, 17, 18) are DiGi only with minimal, calm animation | No capes. Wry, direct, respectful |
| KS5 | DiGi + motion graphics | Near-adult; character as brand voice, not teacher |

Canonical designs, voice rules, intro lines and existing Higgsfield job IDs live in `digi-squad/README.md`. The four rendered classroom pilots (DiGi `2052451b`, Oliver `73a1ddee`, Zara `08e5094c`, Sofia `95e07492`) are the house style reference. The UK animal guides have stills (`8365a8ff` fox, `4edb2fc5` badger, etc.) but no motion or voice yet: rendering their first beats is a build task.

### 9.5 The production line (mechanical, per lesson)

1. Script the beats using the screenplay template (Section 10 shows the full worked example): CHARACTER / SETTING / BOARD / MOOD / per-shot ACTION + LINE. One idea per beat, max two shots, board text is the lesson title in the child's language.
2. Draft render on `draft_tier`, approve staging.
3. Final render: dialogue beats on `dialogue_beats`, silent identity beats on `identity_beats` with the character still as reference.
4. Voice: character's cloned voice via `create_voice` (created once per character), laid over silent beats where used.
5. Drop mp4 URLs into the lesson's `video_beats` JSON. The existing slide player renders them.
6. Log job IDs in the character reference doc, per the established convention.

Cost posture (benchmarks verified in 9.1): with beats at this length and Mini for drafts, the whole 21-module scheme's video layer (roughly 90 to 100 beats plus the pause library) is a low-hundreds-of-pounds render budget, refreshable per beat. Long-form talking segments (assemblies, CPD, parent evening) use the Avatar route (one still + one voice take, up to ~5 minutes) instead of stitching, which is cheaper still.

---

## 10. THE REFERENCE LESSON, FULLY SCRIPTED
### KS3 Module 12: Misinformation, deepfakes and AI content (Years 7–9, 55 to 60 minutes)

This is the end-to-end worked example the whole build copies: every beat scripted, every check written, every asset named. JP approves this lesson before the full build (build prompt, Section 17).

**Single action outcome:** "I can run three checks before I believe or share something."
**The three checks (locked wording, used in class, worksheet, parent note and quiz):**
1. **Who made this, and how do they know?** (source)
2. **What do other places say?** (corroboration)
3. **How is it trying to make me feel?** (emotional manipulation, the deepfake tell)

### 10.1 Lesson flow (60 minutes)

| Time | Segment | Asset |
|---|---|---|
| 0:00 | **VIDEO BEAT 1: Zara intro** (12s) | Beat script below |
| 0:01 | Retrieval starter, 4 auto-marked questions on last lesson | Player check / paper card |
| 0:06 | **Learning cycle 1: content can be manufactured.** Teacher models with three invented posts (one true, one edited, one AI-made). Pupils vote before the reveal. | Slides 2 to 4 |
| 0:14 | **VIDEO BEAT 2: Zara, the three checks** (10s) | Beat script below |
| 0:15 | Check for understanding 1 (2 questions, auto-marked) | Player check |
| 0:17 | **Learning cycle 2: guided practice.** Class runs the three checks together on two more invented items (one deepfake-style video described, one screenshot chain). | Slides 5 to 7 |
| 0:27 | **VIDEO BEAT 3: DiGi Junior pause** (8s, from library) | Pause library |
| 0:28 | **Learning cycle 3: independent practice.** Worksheet: six invented items, run the checks, verdict each (believe / pause / do not share). Paper-first. | Worksheet |
| 0:43 | Check for understanding 2 + whole-class corrections; teacher pulls two pupil verdicts and reasons | Player check |
| 0:48 | **VIDEO BEAT 4: Zara mission beat** (8s) | Beat script below |
| 0:49 | Exit quiz, 5 auto-marked questions + action commitment capture ("the next time I see a shocking post I will...") | Player quiz |
| 0:55 | Plenary: the human skill closer (judgement, not tools). Family question handed out via parent note. | Slide 9, parent note |

Teacher admin for the lesson: take the register in the player (one tap), everything else records itself. Target: under five minutes of teacher admin including the one-tap judgements (Section 11).

### 10.2 The video beat scripts (the screenplay format every module copies)

**BEAT 1 — INTRO (dialogue beat, `video_models.dialogue_beats`, 12s, 16:9)**
```
CHARACTER: Zara (canonical still e29b139c as reference)
SETTING:   secondary classroom, slightly older staging than the KS2 pilots,
           Zara at the board, magnifying glass prop on the desk
BOARD:     REAL OR MADE?
MOOD:      sharp, playful, detective energy dialled to Y8

SHOT 1 (0 to 6s)
  ACTION:  Zara flips a photo card in her hand, holds it up to the class, eyebrow raised
  LINE:    "Detective question. This photo got two million shares. It is completely fake."
SHOT 2 (6 to 12s)
  ACTION:  she taps the board, REAL OR MADE? underlined; leans in to camera
  LINE:    "Today you learn the three checks that catch it in under a minute. Case open."
```

**BEAT 2 — CONCEPT (identity beat, `video_models.identity_beats`, 10s, silent render + cloned voice)**
```
CHARACTER: Zara
SETTING:   same classroom, board now shows three ticks stacked vertically
BOARD:     THE THREE CHECKS
MOOD:      focused, confiding

SHOT 1 (0 to 10s)
  ACTION:  Zara counts on three fingers, each count lands a tick on the board behind her
  VOICE:   "Who made it. What do other places say. And the big one: how is it trying
            to make me FEEL? Fakes aim for your feelings, because feelings share fast."
```

**BEAT 3 — PAUSE (from the DiGi Junior pause library, 8s)**
```
CHARACTER: DiGi Junior
ACTION:    bounces in beside the worksheet graphic, waves
VOICE:     "BEEP BOOP! Half-time check. Take one breath. Has anything today
            surprised you? Tell your neighbour in five words."
```

**BEAT 4 — MISSION (identity beat, 8s)**
```
CHARACTER: Zara
SETTING:   classroom door, bag over shoulder, case-closed energy
BOARD:     CHECK BEFORE YOU SHARE
MOOD:      warm, handing over the badge

SHOT 1 (0 to 8s)
  ACTION:  Zara holds up her detective badge, then points it at the camera
  VOICE:   "Your mission: next shocking post you see, run the three checks before
            you even THINK about sharing. You are the detective now. Case closed."
```

### 10.3 The checks (written, auto-marked)

**Retrieval starter (last lesson: workarounds module)** — 4 multiple choice, auto-marked, e.g. "Ali is offered a VPN to get round an age check. The risk that matters most is..." (options + one correct).

**Check 1 (after Beat 2):**
1. "A video makes you furious the moment you see it. Which check does that feeling trigger?" → check 3, feelings.
2. "A post says 'scientists confirm...' with no name and no link. Which check fails first?" → check 1, source.

**Exit quiz (5 questions, auto-marked, feeds the pupil record):** items testing each check plus one transfer item (a described deepfake voice message) plus one honest-nuance item ("True or false: if a photo is AI-made it is always a lie" → false, the point is checking, not paranoia).

**Action commitment (captured in the player or on the paper exit card):** free text, one line, revisited as next lesson's retrieval starter question 4. This is the retention loop: every lesson opens by asking whether last lesson's action happened.

### 10.4 The paper fallback (equity rule made concrete)

One printed pack per lesson, generated from the same lesson JSON: retrieval card, the three-checks bookmark, the six-item worksheet, the exit card. A school with one projector and no pupil devices runs the identical lesson; a school with nothing but a photocopier still runs it (the beats are described in the teacher script: "Zara would say..."). No pupil login exists in either mode (Section 12).

### 10.5 The satellite assets

- **Parent note (one page, no login):** what we taught, the three checks verbatim, one reinforcement action ("ask your child to run the checks on one thing in your own feed this week"), the family question: "What is the most convincing fake you have ever seen, and how did you find out?"
- **Teacher notes block:** learning objective, the statutory tags (KCSIE 2025 content risks, Citizenship media literacy, EfCW strand 5), timing guide, misconception list (three), differentiation (support: pre-sorted verdict cards; stretch: who benefits when this spreads), disclosure note.
- **DSL note:** misinformation is now a KCSIE content harm; what a disclosure in this lesson might sound like; the school's reporting route; link to the concern form.
- **Fridge sheet + certificate:** generated print routes, per the week 10 materials table.

---

## 11. THE TEACHER WORKSPACE — Jigsaw, but software (and better)

The benchmark: Jigsaw gives schools a complete, loved, printed scheme. Its weaknesses are exactly where software wins: nothing marks itself, nothing tracks itself, evidence is a filing job, and the mascot is a soft toy. We ship the Jigsaw completeness with the admin automated. Design target: **a teacher runs a full lesson with under five minutes of admin, and a subject lead produces any report in under one minute.**

### 11.1 What the teacher gets (screen by screen)

1. **Plan.** Year-at-a-glance grid per year group: modules, dates, statutory coverage filling in as lessons complete. Drag to reorder. One click into any lesson.
2. **Prepare.** Lesson page: the plan, the beats, the slides, every printable (single "print the paper pack" button), the teacher notes, the DSL note where flagged. School DiGi sits here for prep questions ("give me a tighter starter for a low-literacy Y8 set").
3. **Teach.** Full-screen player: slides, video beats, checks. Works on one projector screen. Class-paced (teacher advances) with optional pupil-paced mode where schools have devices. One-tap register at the start.
4. **Mark.** Auto-marked checks land instantly per pupil (or per class in no-device mode via the show-of-hands tally the teacher taps in). One-tap judgement per pupil: working towards / met / exceeded, defaulting to met so the teacher only touches exceptions. Optional: photograph a paper worksheet set and file it as evidence against the lesson in one action.
5. **Record.** Per-pupil timeline: checks, judgements, action commitments, pupil-voice quotes (teacher can dictate or type one line), evidence photos. Per-class and per-year rollups.
6. **Report.** One-click generated documents (Section 12.4): coverage matrix, class progress, governor pack, Ofsted evidence pack, parent evening pack, DSL summary of flagged lessons taught. PDF and CSV.
7. **CPD.** The 2-hour module, self-serve, with the certificate generated on completion and logged for the school's records.

### 11.2 The time-saving ledger (what we automate that Jigsaw cannot)

| Task | Manual scheme | Guided Childhood |
|---|---|---|
| Marking low-stakes checks | Teacher marks or skips | Auto-marked, instant, recorded |
| Coverage tracking for Ofsted | Spreadsheet someone maintains | Generated from completion data |
| Evidence file | Ring binder, photocopies | Timeline per pupil, photo capture, one-click pack |
| Written feedback | Per-book comments | AI-drafted class and pupil summaries, teacher approves every word before anything is saved (DfE human-oversight expectation) |
| Reports to SLT/governors | Written termly by the lead | Generated termly, lead edits headline paragraph only |
| Parent communication | Letters written per topic | Parent note auto-attached per lesson, no login |
| Certificates and fridge sheets | Bought or made | Print routes from lesson data |

The AI marking line must stay honest and DfE-compliant: multiple choice is deterministic auto-marking (no AI claim needed); free-text summaries are AI-drafted, always teacher-approved, never autonomous, and never processing more pupil data than the check responses themselves. **[RESEARCH PENDING: DfE AI marking pilot findings and product safety expectation details to cite in the policy template.]**

### 11.3 Print is a feature, not a fallback

Jigsaw's material feel is loved. Every screen has a print twin: the paper pack per lesson, the bookmark, the year plan poster for the staffroom wall, the coverage matrix for the governor meeting, the certificate. The print stylesheet work from week 10 (fridge sheets, certificates) extends to the whole schools product.

---

## 12. DATA, MARKING AND REPORTING — the database schools access (or we report)

### 12.1 Identity model: class codes, not pupil accounts (the GDPR moat)

The lowest-friction, lowest-risk model that still yields per-pupil evidence:

- **No pupil logins, no pupil emails, no dates of birth.** A class exists as a code; pupils exist as first name plus initial (or a school-chosen alias), created by CSV paste or typed in once by the teacher.
- In no-device classrooms the teacher records whole-class tallies and exception judgements; per-pupil auto-marking activates only where schools run pupil-paced mode on school devices via the class code (still no accounts, a session picks a name from the class list).
- This keeps the DPIA small, keeps us out of age-verification territory, and matches market norms, now research-confirmed: teacher-facing curriculum schemes (Kapow, Jigsaw, SCARF, Project Evolve) run on teacher accounts and manually managed class lists with **no MIS integration at all**; MIS-synced pupil logins (Purple Mash via Wonde/Xporter) appear only where pupils log in at scale. Google/Microsoft SSO is the light-weight middle path if schools ask. The ICO's 2024 audit of 28 edtech providers found widespread DPIA and contract failures, and schools DPIA every new edtech service, so the smaller our data footprint, the faster procurement goes.

### 12.2 Schema sketch (extends the existing Supabase project, RLS per school)

```
school_accounts        (id, name, urn, phase, licence_tier, pilot_until, created_at)
school_educators       (id, school_id, email, role: teacher|lead|dsl|head, ...)
school_classes         (id, school_id, year_group, name, class_code)
pupils                 (id, class_id, display_name)            -- first name + initial ONLY
school_lessons         (the 21 modules: content JSON incl. video_beats, assessment)
lesson_deliveries      (id, class_id, lesson_id, taught_at, teacher_id, mode: class|pupil_paced)
check_responses        (id, delivery_id, pupil_id nullable, check_id, response, correct, auto)
teacher_judgements     (id, delivery_id, pupil_id, level: wt|met|exceeded)
action_commitments     (id, delivery_id, pupil_id nullable, text, followed_up)
evidence_items         (id, delivery_id, kind: photo|quote|note, storage_ref, caption)
generated_reports      (id, school_id, kind, period, storage_ref, generated_at)
```

RLS: educators see only their school; DSL role sees the DSL layer; our service role generates reports. School DiGi reads a school's aggregate data only, never pupil rows, per the guardrails in 1.7.

### 12.3 Marking automation (cheap, compliant, honest)

- **Tier 1 (deterministic, free):** all multiple-choice and structured checks auto-mark in the database. This is 90% of the marking load and needs no AI claim at all.
- **Tier 2 (AI-assisted, teacher-approved):** end-of-module class summary and per-pupil comment drafts generated from check data and judgements (via the existing Anthropic API integration, `DIGI_MODEL` config). The teacher approves or edits every output; nothing unapproved persists to a pupil record. Logged, per DfE expectations.
- **Tier 3 (explicitly out of scope for now):** autonomous AI marking of extended writing. Not needed for this scheme's check formats, and staying out keeps the product safety posture simple.

### 12.4 Reporting: schools access it, or we report (both, from the same data)

- **Self-serve (schools access):** the teacher workspace dashboards plus one-click generated documents: EfCW coverage matrix, statutory alignment evidence, class and year progress, pupil timeline export, governor pack, parent evening pack.
- **We report (the concierge tier and the pilot):** termly, we generate and email the head a school report: coverage, participation, progress headlines, pupil-voice quotes, next term's plan. During pilots this is how impact is proven with zero school effort, and it doubles as the case-study raw material.
- **The inspection evidence pack (the landing page promise), contents now research-confirmed against what schools actually use:** one click, one date-stamped versioned PDF containing: (1) coverage map vs frameworks, one page each for EfCW 8 strands (age-banded), statutory RSHE online safety outcomes, Computing NC digital literacy objectives, and the KCSIE four Cs, RAG-rated; (2) per-class and per-year completion with gaps flagged; (3) assessment summary, start-of-year vs now, anonymised; (4) pupil voice samples (a named evidence source in Ofsted's new methodology); (5) parent engagement record, including the on-demand parent materials export that RSHE 2026 makes a statutory transparency expectation; (6) a one-page curriculum rationale in intent/implementation/impact language plus a governor-ready summary formatted to drop into the head's safeguarding report; (7) an optional mapping note to the relevant 360 Degree Safe curriculum aspects (SWGfL's self-review tool, 11,000+ schools, the de facto standard the online safety lead already works in).

**Copy caution (research-confirmed):** under the Nov 2025 framework Ofsted abolished deep dives, states schools should not create documents just for inspection, and grades safeguarding met/not met on a report card. So the pack is marketed as evidence of what the school already does, "inspection-ready" or "governor-ready", never literal "Ofsted prep". Update the landing page line accordingly.

### 12.5 GDPR posture

- Data minimisation by design (12.1). UK/EU hosting (Supabase region pinned). One page DPIA template and a signed DPA ship in the school onboarding pack. Data deleted on contract end plus a grace period, and exportable to the school as CSV at any time.
- No pupil personal data ever sent to an AI model. Tier 2 drafting operates on check aggregates and first-name-initial labels only, under the school's instruction as controller.
- Safeguarding boundary, now research-confirmed as the right call: CPOMS and MyConcern integrate with monitoring/filtering/MIS tools, never with curriculum schemes, and touching safeguarding records would put us in the highest-risk data category and the school's safeguarding audit surface. **Signpost, don't integrate** is the settled posture: in-lesson guidance says "follow your school's safeguarding policy and record in your school's system", and all pack data stays aggregated and anonymised. This keeps us in curriculum procurement, not safeguarding-platform procurement.

---

## 13. THE PILOT OFFER AND GO-TO-SCHOOL MOTION

### 13.1 The free pilot (the proposal to schools)

**Offer: one full term, free, whole key stage of their choosing.** Includes:

1. **Launch assembly** for the key stage (in person where feasible, or the assembly film cut from the module explainers).
2. **One twilight CPD session** (the 2-hour module compressed to 60 minutes for INSET; full module self-serve after).
3. **Full platform access** for every teacher in the key stage: lessons, player, marking, printables.
4. **Printed starter pack**: year plan poster, three-checks bookmarks class set, the paper packs for the term's modules.
5. **DSL briefing** (30 minutes, remote) plus the policy template pack.
6. **The end-of-term impact report**, generated by us (12.4): participation, progress, coverage against statutory expectations, pupil voice. This report is the sales artifact: it is the thing the head shows governors, and the thing we anonymise into case studies.

**In exchange (written into the pilot agreement):** a named school lead, the scheme actually timetabled (minimum one lesson per fortnight), a 20-minute end-of-term feedback call, and permission to use anonymised outcomes as a case study.

**Conversion:** pilot ends at a natural budget moment with the impact report in hand; the licence quote arrives with the report. Founder pricing for pilot schools locked for two years.

**Pricing anchors (research-verified):** Jigsaw whole-school runs from ~£795/yr primary and ~£600/yr secondary; PSHE Association school membership ~£145/yr; National College whole-school memberships are quote-based, directionally several hundred to low four figures; Papaya charges £125 per workshop visit to independents; the free tier of the market (Oak, NCCE, Project Evolve) is strong on content and empty on delivery, characters, marking and parents. Position against Jigsaw as the ceiling-setter: **primary £595 to £795 per year, secondary £995 to £1,295, published openly** (quote-hiding is the market's bad habit and our differentiator), MAT deals per school with a cap, school visits priced separately (Papaya's £125 anchors low; a half-day visit with assembly + model lesson + twilight CPD justifies £350 to £500 within a travel radius, free inside a pilot).

### 13.2 Timed to the school year

| When | Motion |
|---|---|
| May to July | Recruit September pilots (heads plan timetables now). Conference/cluster visits. |
| September | Pilot cohort 1 launches (assembly + INSET slot in the September INSET calendar). |
| December | Cohort 1 impact reports + licence quotes land before budget planning. |
| October to November | Recruit January pilots (cohort 2). |
| January | Cohort 2 launches. |
| February to April | Budget season: convert both cohorts; MAT-level conversations using cohort case studies. |
| June to July | Renewal season + cohort 3 recruitment; publish the year's anonymised impact digest. |

### 13.3 School visits and what they are for

Visits are conversion theatre and evidence gathering, not delivery dependency (the product must not need us in the building). A visit day: launch assembly, one model lesson taught by us with the class teacher observing, twilight CPD, head/DSL debrief. Price visits into the paid tier (or offer as the pilot sweetener within a travel radius); everything a visit does also exists as video and self-serve material so remote schools get the full product.

### 13.4 Materials for heads and leads (the buyer-facing pack)

One printed and one PDF pack: the one-page proposal (offer, evidence stance, price), the statutory alignment document, the EfCW coverage matrix, a sample impact report, the DPIA/DPA bundle, two case studies, and the honest-evidence one-pager (the Odgers test as a selling point: "we will never overclaim to your governors").

---

## 14. CODING AND IT MIX-IN (Computing alignment)

Digital literacy earns its statutory Computing footing when it touches real computing artefacts, and the new Computing GCSE direction (digital literacy, data, AI folded in) rewards schemes that bridge. Per-module optional "plugged extensions", never required (equity rule):

| Module | Plugged extension | Computing hook |
|---|---|---|
| 6 (KS2 algorithms) | Build the paper algorithm, then implement the ranking rule in Scratch (sort a list by score) | KS2 PoS: design, write and debug programs |
| 7 (KS2 privacy) | Inspect what a form collects; build a "data minimisation" Scratch quiz | KS2/KS3 data awareness |
| 12 (KS3 misinformation) | Metadata detective: examine an image file's data trail; reverse image search walkthrough | KS3 PoS: multiple applications, data critically |
| 13 (KS3 scams) | Spot-the-phish inbox simulation (static HTML, no live accounts) | KS3 online safety in PoS |
| 19 (KS4 readiness) | Age-verification mechanics explainer: how estimation and verification actually work | KS4 PoS: technology safety, privacy |
| 20 (KS5 AI mastery) | Build a small agent workflow (prompt chain with a verification step) and defend where it was checked | AILit "Design AI"; new post-16 direction |

**[RESEARCH PENDING]** The curriculum stream returns the NCCE Teach Computing unit map; on arrival, tag each module with the NCCE unit it complements so a computing lead can slot us into an existing long-term plan without displacement. The algorithm literacy project in this repo (Parts 4, 5, 8, 9: paper algorithm, Python engine, simulations, lesson plans) is ready-made source material for modules 6, 12 and 20's extensions.

---

## 15. COMPETITOR BEST PARTS AND THE INDUSTRY-LEADING BAR
*(Research verified 2 Jul 2026 across curriculum bodies, CPD/safeguarding vendors and MIS-adjacent platforms. Two clusters, UK charities and paid primary platforms, complete after the research window reopens; positions below are stable.)*

### 15.1 Best part worth taking, per competitor

| Competitor | What they are | Best part worth taking |
|---|---|---|
| **Jigsaw PSHE** (~£795/yr primary, £600/yr secondary) | Whole-school mindful PSHE, mascot per year group | The mascot as **distancing tool** (children disclose through Jack or Jem, not as themselves), the fixed lesson ritual, and the Jigsaw Families parallel programme. Already absorbed; our advance: the mascot actually teaches, in motion, and the admin marks itself |
| **Oak National Academy** (free; 54 digital literacy lessons Y1 to 9 launched ~30 Jun 2026 with Raspberry Pi) | DfE-adjacent reference implementation | The fixed four-part anatomy repeated identically at scale: starter quiz, video, worksheet, **exit quiz as instant "did it land" signal**. Its 9-unit spiral (6 one-hour lessons per year, five threads incl. AI safety) is the public analogue to study and beat |
| **NCCE Teach Computing + Barefoot** (free) | Statutory computing scheme | The **learning graph**: a visible per-unit map of which concepts depend on which, so a teacher sees why lesson 4 precedes lesson 5. Add one per key stage |
| **PSHE Association** (~£80 to £145/yr membership) | National PSHE body | **The law and the help route inside every sensitive lesson** (their deepfakes pack always answers "is this illegal" and "where does a child go"). This is the calibrated-pathway pattern; adopt it as a rule for modules 16 to 18 |
| **National Online Safety / The National College** (quote-based, ~46,000 schools) | CPD and compliance platform | **The #WakeUpWednesday cadence**: a free, weekly, branded one-page guide on whatever app is scaring parents this week. Schools distribute it for them; the paid product feels permanently current. Copy the mechanic: a weekly Guided Childhood one-pager driven from LANDSCAPE_CONFIG |
| **Smoothwall / Qoria** (per-pupil quote; "1 in 3 UK schools") | Filtering/monitoring infrastructure | **The school-as-distribution-channel parent app play**: school buys, every family gets the parent app free through the school. Our parents platform is exactly this wedge with pedagogy attached; the schools product should hand every pilot family a Guided Childhood parent tier |
| **Be Strong Online (Diana Award)** (free, dated) | Peer-led digital resilience | **The ambassador identity**: Year 9+ pupils trained as named peer trainers delivering short sessions to younger years. Proven, zero teacher time, currently unserved with anything modern. A "DiGi Guide" pupil ambassador role with a progression system out-executes it |
| **Papaya Talks** (free state / £125 independent, SFC talks partner) | GP-founded live talks | **Founder credibility + movement piggyback + the KS2 timing thesis** (intervene before the smartphone arrives, parent and child in parallel). Mirror: JP-fronted assemblies, and lean into the pre-smartphone KS2 window in sales copy |
| **Project Evolve (SWGfL)** (free, ~a third of UK schools) | EfCW resource bank | EfCW coverage tracking and knowledge maps are **table stakes**; it defines what "evidence" means in this niche. We must map to it, never fight it on coverage; we win on delivery, video, marking, parents |

### 15.2 The gaps, now confirmed

- **Nobody free has characters, ritual or parent engagement. Nobody paid has serious AI literacy yet.** (Direct quote of the research synthesis.)
- Nobody combines character-led pupil content with parent engagement: National College is posters and adult CPD, Qoria is plumbing, Diana Award is dated packs, Papaya is live talks, Oak is neutral by design.
- Character video at secondary does not exist anywhere in the market. No UK edtech has announced generative character animation at scale.
- Compliance sellers hide pricing behind quotes; a published, honest price is itself a differentiator.
- The 2026 tailwinds: RSHE makes deepfakes and AI content statutory at KS3/4 from Sep 2026; the Curriculum Review puts media literacy into statutory primary citizenship from 2028; the government Media Literacy Action Plan (Mar 2026) names algorithmic manipulation. We are two years ahead of statutory if we ship now, exactly as the landing page claims.

### 15.3 The industry-leading checklist (what winning concretely requires)

1. Character video that actually teaches, EYFS to KS5, secondary included (unique).
2. Marking, evidence and reporting automated to near zero teacher time (nobody in the niche has it).
3. EfCW + RSHE + KCSIE + Computing mapping generated, not filed (Project Evolve tracks coverage; nobody generates the governor pack).
4. Parent reach as product, not PDF: the Qoria-style school-to-home bridge with our parent platform (unique with pedagogy).
5. AI literacy from KS1 and the ban-world crown module (statutory tailwind, nobody paid is there).
6. A weekly WakeUpWednesday-class artefact to stay permanently current (config-driven, cheap for us).
7. Honest evidence framing as a trust feature (the Odgers test as a selling point).
8. Published pricing.

---

## 16. BUILD PLAN — running alongside the parents platform

### 16.1 The operating principle

One repo, one Supabase project, two products. The schools build reuses the parents platform's proven parts (slide player, deck components, print routes, DiGi API route, scripts/lessons table patterns) rather than forking them. The parents platform keeps shipping weekly; schools work is structured so no phase blocks a parents release.

- Routes: `(schools)` route group (`/educator/...` already reserved in middleware).
- Database: new tables per Section 12.2 in the same project, RLS-separated (decision already logged 2026-06-27: separate Stripe product, same Supabase, GDPR-critical separation).
- School DiGi: same `DIGI_MODEL` config, separate system prompt (safeguarding-trained, not parenting-trained; decision logged).
- Content: `school_lessons` table, seeded by migration, never hardcoded (rule 6).

### 16.2 Phases (each phase ships something a pilot school could touch)

| Phase | Deliverable | Gate |
|---|---|---|
| **1. Reference lesson end to end** | LANDSCAPE_CONFIG scaffolded; schema migrated; Module 12 built exactly as Section 10 (beats rendered, checks live, paper pack printing); teacher can run it with a test class | JP approves the reference lesson (the build prompt's existing gate) |
| **2. Teacher workspace MVP** | Plan/Prepare/Teach/Mark screens; class codes; auto-marked checks; register; print packs | A real teacher runs a lesson unassisted |
| **3. Content at scale** | All 21 modules written to schema and seeded; video beats rendered on the Section 9 production line; animal guides get first renders + voices | Coverage matrix shows all 8 EfCW strands |
| **4. Reporting + evidence** | Record/Report screens; generated documents (coverage, governor pack, Ofsted pack, impact report); CPD module + certificate; policy templates | A subject lead generates every report in under a minute |
| **5. Pilot machinery** | Onboarding flow (school signup, DPA, class setup), pilot agreement, buyer pack (13.4), assembly films cut from explainers | First pilot school onboarded end to end |

Sequencing against the weekly rhythm: phases are the schools track; the Monday plan for each week names which track (parents or schools) each day serves, and Friday's ship check covers both. Research-pending sections (3, 9.1, 11.2, 12.1, 12.5, 13.1, 14, 15) must be resolved before Phase 5's outward-facing claims, but Phases 1 and 2 need none of them.

### 16.3 What is deliberately NOT in the build

- No pupil accounts, emails, or home access in v1 (the parent note is paper/PDF, no login, by design).
- No safeguarding case recording (signpost to CPOMS/MyConcern, stay a curriculum product).
- No MIS integration in v1, now research-confirmed as the market norm for curriculum schemes: teacher-managed classes first, optional Google/Microsoft SSO second, Wonde only if pupil-level rostering at scale becomes a selling point (vendor-pays model, custom-quoted, typically hundreds of pounds per year up; Bromcom's direct partner API is free and Arbor + SIMS + Bromcom cover ~90% of English state schools when the day comes; Arbor is now no. 1 at ~44% and consolidating).
- No autonomous AI marking of extended writing.
- No LMS/SCORM packaging until a MAT asks and pays.

---

## 17. THE CLAUDE CODE BUILD PROMPT (v2)

> Paste this into Claude Code with Sections 1 to 6 and 9 to 16 of this file as context.

```
You are building the Guided Childhood Schools product: 21 modules (EYFS to Year 13), the character
video layer, the teacher workspace, the data/marking/reporting layer, plus 6 assemblies, parent
evening packs, a 2-hour CPD module, 4 policy templates, and the pilot machinery.

NON-NEGOTIABLE RULES
1. Build from the 21-module map in Section 5. Preserve every landing-page topic verbatim and
   deliver all eight [GAP-FILL] modules/threads. If any EfCW strand (1–8) is not covered across
   the finished scheme, the build fails the "all 8 UKCIS areas covered" claim. Verify coverage of
   all 8 before finishing and output a coverage matrix.
2. Every lesson uses the Section 6 schema and ships: lesson plan, worksheet, slides, video beats,
   auto-marked checks, parent note, and a DSL note where safeguarding-adjacent. Every lesson ends
   on ONE clear, specific action the child can use that night. Never a list of rules.
3. Split durable vs volatile. Lessons reference concepts and LANDSCAPE_CONFIG keys. Never hardcode
   platform names, AI model versions, video model versions, statute-in-force dates, or statistics
   into lesson copy. If a fact would date, pull it from config.
4. Copy rule: no dashes as punctuation in any user-facing output (plans, worksheets, slides, parent
   notes, assemblies). Write around them. Age ranges in data format (e.g. 4–16) are the only
   exception. Hyphenated compounds are fine.
5. Evidence discipline (the Odgers test): every factual claim must be defensible to a hostile
   expert. Where evidence is mixed (phone-free schools, screentime causation), say so honestly. Do
   not overclaim. Use the line: the ban removes the apps, it does not raise the child.
6. School DiGi is pathways-only. It never outputs allow/deny. It serves educators, not pupils.
   GDPR compliant. Set the model via DIGI_MODEL config.
7. TRUST framework: use the canonical definitions from the Guided Childhood master docs verbatim.
   Do not invent the acronym or its components. If the canonical source is not in context, stop and
   ask JP.
8. Equity: every lesson works on paper with no home device, broadband, or paid AI tool assumed.
   Video needs one teacher screen only. Digital is an optional extension.
9. Pedagogy: build each lesson to Rosenshine (retrieval starter, small steps, model, check, guided
   then independent practice, plenary action), chunk into learning cycles, manage cognitive load,
   keep slides sparse and accessible (captions, high contrast). Video is beats (8 to 15s), never
   films, per Section 9.
10. Ahead-of-standard positioning: deliver AI literacy from KS1 up (not only KS5) using the OECD
    AILit four domains (Engage, Create, Manage, Design), and deliver financial/scam literacy, since
    both become statutory under the new curriculum. Note this in the statutory alignment document.
11. Characters per the Section 9.4 casting table and digi-squad/README.md voice rules. Distancing
    technique always. Sensitive modules (16, 17, 18) are DiGi only. Secondary is never babied.
12. Data: class codes not pupil accounts; first name + initial only; no pupil data to AI models;
    deterministic auto-marking first; AI-drafted feedback always teacher-approved (Section 12).
13. Teacher time is the metric: under five minutes admin per lesson, under one minute per report.

DELIVERABLES
A. The 21 modules, each to the Section 6 schema, with video beat scripts in the Section 10 format.
B. A statutory alignment document mapping every lesson to: EfCW strand(s), Online Safety Act, RSHE
   2026, KCSIE 2025, DfE AI guidance, and the relevant Curriculum and Assessment Review outcomes.
   Print-ready for governors and Ofsted.
C. An EfCW 8-strand coverage matrix proving all 8 are covered.
D. 6 assemblies (KS1–KS5), primary and secondary parent evening packs.
E. 2-hour CPD module (research, the cliff edge, TRUST framework, what children encounter now, safe
   classroom practice, disclosure response, certificate).
F. 4 policy templates (school digital behaviour policy, staff AI tools policy aligned to DfE 2025,
   online safety statement for the school website, statutory alignment document for governors).
G. A LANDSCAPE_CONFIG file (Section 2 schema, including video_models) as the single volatile-data
   source, with the refresh protocol as a comment block.
H. The teacher workspace (Section 11 screens) and the data layer (Section 12 schema and reports).
I. The pilot pack (Section 13.4) and onboarding flow.

BUILD ORDER
Phases per Section 16.2. Phase 1 first: confirm TRUST definitions are in context (else ask JP),
scaffold LANDSCAPE_CONFIG, migrate the schema, build the reference lesson (KS3 module 12, exactly
as scripted in Section 10) end to end for JP to approve. Nothing beyond Phase 1 until approved.
Final gap check before any phase closes: all 8 EfCW strands, all landing-page topics, all eight
[GAP-FILL] items, no hardcoded volatile facts, no dashes in user-facing copy.

WORKFLOW
Produce deliverables staged for review, not deployed. JP approves the reference lesson before the
full build. Nothing ships until approved. The parents platform release rhythm is never blocked by
schools work.
```

---
*Refresh log: v1 created 2 Jul 2026. v2 merge (video layer, reference lesson script, teacher workspace, data layer, pilot offer, coding mix-in, build plan) 2 Jul 2026. Four research streams pending; fold in on arrival. Next review: 1 Aug 2026 or on any config trigger in 2.2.*
