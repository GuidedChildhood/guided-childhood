// LANDSCAPE_CONFIG: the single volatile-data source for the schools product.
// Everything that dates fast lives here. Lessons reference concepts and these
// config keys, never hardcoded platform names, model versions, statute dates
// or statistics. A change in the world is a change to this file only.
//
// REFRESH PROTOCOL (from plans/schools-lesson-build-spec.md section 2.2):
// review on the first working day of each month, and immediately when:
//  - the July 2026 full consultation response lands
//  - Ofcom publishes the age assurance study (due 31 Oct 2026)
//  - Regulations are laid or come into force (expected end 2026 / Spring 2027)
//  - KCSIE, RSHE, or the national curriculum updates
//  - a frontier AI model tier shifts materially
//  - a video model tier shifts materially (longer clips, cheaper identity)
// If a lesson needs a copy edit for a factual change, that lesson has
// hardcoded a volatile fact and must be refactored to pull from here.

import { SOCIAL_MEDIA_LAW, BANNED_PLATFORMS } from './social-media-law'

export const LANDSCAPE_CONFIG = {
  last_reviewed: '2026-07-02',

  // The consumer flag is the source of truth; re-exported here so schools
  // content reads one object. Fourth state (announced, regs pending) is
  // represented on the consumer flag as partial_ban until regs land.
  social_media_law: SOCIAL_MEDIA_LAW,

  ban_timeline: {
    announced: '2026-06-15',
    enabling_act:
      "Children's Wellbeing and Schools Act 2026 (in force 2026-04-29), amends Online Safety Act 2023 (new s214A)",
    full_consultation_response_due: '2026-07',
    ofcom_age_assurance_study_due: '2026-10-31',
    regs_expected_laid: 'before end 2026',
    protections_in_force_expected: 'Spring 2027',
  },

  banned_platforms_in_scope: BANNED_PLATFORMS,
  ban_exemptions_likely: ['educational services', 'e-commerce', 'music streaming'],
  ban_out_of_scope: ['private messaging services'],
  ban_extra_restrictions: [
    'under-16 livestreaming across all platforms',
    'stranger contact features',
    'features off by default for 16 to 17s',
    'gaming feature restrictions',
  ],

  // AI models: reference by TIER and CAPABILITY, never by version inside
  // lesson copy. Teacher context only. Refresh at each review.
  ai_named_examples: {
    note: 'For teacher context only. Lessons teach concepts, not versions.',
    chat_assistants: [
      'ChatGPT (OpenAI)',
      'Claude (Anthropic)',
      'Gemini (Google)',
      'Copilot (Microsoft)',
      'Grok (xAI)',
    ],
    frontier_state: 'GPT-5.x, Claude Opus 4.8 / Fable 5 / Sonnet 5, Gemini 3.x. Version numbers change monthly.',
    agent_examples: [
      'Gemini Spark (cloud agent)',
      'Claude Cowork / Claude Code (desktop agent)',
      'ChatGPT Codex / Operator (coding and browser agents)',
    ],
  },

  // Video generation models for the character beat production line.
  // Same churn rule as DIGI_MODEL: pipeline reads these keys, lesson
  // content never names a video model. Verified against the Higgsfield
  // catalogue 2 Jul 2026. Never build on Sora (API sunsets 24 Sep 2026).
  video_models: {
    identity_beats: process.env.VIDEO_MODEL_IDENTITY ?? 'seedance_2_0',
    dialogue_beats: process.env.VIDEO_MODEL_DIALOGUE ?? 'kling3_0',
    draft_tier: process.env.VIDEO_MODEL_DRAFT ?? 'seedance_2_0_mini',
    fallback: 'gemini_omni',
    long_form_talking: 'kling_avatar_2_0 (via Lipsync Studio, one still + one voice take, up to ~5 min)',
    max_single_clip_seconds: 15,
    voice_engine: 'higgsfield create_voice, one cloned voice per character, created once',
  },

  // Statutory and guidance versions currently in force.
  guidance_in_force: {
    kcsie: 'KCSIE 2025 (in force 1 Sep 2025)',
    rshe: 'Revised RSHE guidance in force 1 Sep 2026 (deepfakes and AI content statutory at KS3/4)',
    dfe_ai: 'Generative AI in education policy paper + product safety expectations (updated Jun 2025)',
    ofsted:
      'New Education Inspection Framework: report cards, 11 areas, safeguarding met/not met (live 10 Nov 2025). Deep dives abolished. Say inspection-ready, never Ofsted prep.',
    curriculum:
      'New national curriculum publishes spring 2027, first teaching Sep 2028. Computing GCSE replaces CS GCSE. Media and financial literacy statutory in Citizenship.',
    media_literacy: 'Government Media Literacy Action Plan (Mar 2026) names deepfakes, AI content, algorithmic manipulation.',
  },

  // Live statistics for CPD and teacher notes. Cite source and date.
  key_stats: {
    cyp_mh_referrals:
      "Over 1 million children referred to mental health services (about 1 in 10), nearly double the 564,000 of 2018 to 19 (Children's Commissioner, 2024 to 25).",
    probable_disorder: '18% of 7 to 16 year olds had a probable mental health disorder (NHS Digital).',
    social_media_use: '81% of 10 to 12s use a social media app; 86% have their own account (Ofcom, 2025).',
    porn_exposure:
      "79% of children see violent pornography before 18; average first exposure age 13 (Children's Commissioner).",
    phone_ownership: '97% of 13 to 15s own a mobile phone (Ofcom, 2025).',
    digital_poverty: '1 in 5 UK children in digital poverty; 57% of low income households lack reliable device or internet access.',
    genai_use: '88% of students now use generative AI, up from 53% the prior year.',
    evidence_nuance:
      'SMART Schools study (Lancet Regional Health Europe, 2025): restrictive school phone policies showed no measurable difference in wellbeing, sleep, physical activity or attainment. The 2025 Orben led review found no established causal link. Use this honesty; do not overclaim.',
  },
} as const

export type LandscapeConfig = typeof LANDSCAPE_CONFIG
