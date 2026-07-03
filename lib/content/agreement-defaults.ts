import type { StageId } from '@/lib/pathway/progress'
import { banIsActive } from '@/lib/config/social-media-law'

// Starting points for the family agreement builder, calibrated per stage.
// These are openers for a negotiation at the kitchen table, not rules to
// impose: every line is editable and the discussion prompts push the
// family to talk before they type. Grounded in the platform's research
// base: structure over surveillance, repair over punishment, the bedroom
// rule from day one, readiness over age gates.

export interface AgreementSectionDefaults {
  familyValues: string
  bedroomRuleTime: string
  bedroomRuleLocation: string
  socialMediaTerms: string
  whenThingsGoWrong: string
}

export const AGREEMENT_PROMPTS = {
  familyValues: 'Talk first: what do we actually want screens to do for our family?',
  bedroomRule: 'Negotiate the time and the place together. A rule your child helped set is a rule that holds.',
  socialMediaTerms: 'This is a readiness conversation, not an age gate. Agree what ready looks like.',
  whenThingsGoWrong: 'The promise that matters most. Say it out loud to each other before you write it down.',
  extraAgreements: 'Anything specific to your house: gaming nights, the car, mealtimes, homework.',
} as const

const DEFAULTS: Record<StageId, AgreementSectionDefaults> = {
  foundation: {
    familyValues:
      'Screens are one of the fun things in our house, not the main thing. We watch together, we talk about what we see, and when the screen goes off we do something together.',
    bedroomRuleTime:
      'Screens finish an hour before bedtime. When the timer goes off, screens go down, every time.',
    bedroomRuleLocation:
      'Devices charge in the kitchen overnight. Bedrooms are for sleep.',
    socialMediaTerms:
      'No social media at this age. Videos and games happen on the family device, together, in the same room.',
    whenThingsGoWrong:
      'If something on a screen feels scary or strange, come and tell us straight away. Nobody ever gets in trouble for telling. We sort it out together.',
  },
  builder: {
    familyValues:
      'We decided together how screens work in our house. Screens are for creating, learning and having fun, and they never replace sleep, friends or moving our bodies.',
    bedroomRuleTime:
      'All screens finish an hour before lights out, every night, weekends included.',
    bedroomRuleLocation:
      'Every device sleeps in the kitchen charging station. No screens in bedrooms overnight, and that includes the grown ups.',
    socialMediaTerms:
      'Not yet. Before any social media we will have the algorithm conversation and agree together what ready looks like.',
    whenThingsGoWrong:
      'If anything online feels weird or wrong, telling a parent is always the right move. We help first and ask questions later, and telling us never costs you the device.',
  },
  explorer: {
    familyValues:
      'We know the algorithm is built to keep us watching. In this family the humans decide, not the feed. We talk about what we see online, the good and the bad.',
    bedroomRuleTime:
      'Phones go on charge an hour before sleep.',
    bedroomRuleLocation:
      'Phones sleep in the kitchen, not the bedroom. That rule is for everyone in the house, parents included.',
    socialMediaTerms:
      'Social media starts with readiness, not a birthday. First the algorithm conversation, then we agree together which app and which settings, and for the first month we look at the feed together.',
    whenThingsGoWrong:
      'If anyone online makes you uncomfortable, or asks you to keep a secret, you tell us immediately. We will not explode and we will not take the phone. We help first.',
  },
  shaper: {
    familyValues:
      'Your online life is real life and we treat it with respect. Trust is the deal in this family: we do not read your messages, and you keep the door open.',
    bedroomRuleTime:
      'Phones go on charge an hour before sleep, school nights especially.',
    bedroomRuleLocation:
      'Phones charge outside bedrooms overnight. Sleep beats scrolling, for all of us.',
    socialMediaTerms: banIsActive
      ? 'The law is changing what apps are allowed, so we work out the new digital life together instead of pretending nothing changed. If you ever find a way around a ban, a parent is a safe person to tell, not the person to hide it from.'
      : 'What we post shapes our footprint. We think before posting, and we never post about someone else without asking them first.',
    whenThingsGoWrong:
      'If anything goes wrong online, a parent is your first call, not your last. No overreaction, no instant confiscation. We fix it together.',
  },
  independent: {
    familyValues:
      'You are building your own digital life now. Our job is backup, not control. We stay interested, you stay honest, and the big decisions get talked through as near equals.',
    bedroomRuleTime:
      'We each choose a switch off time that protects our sleep, and we hold each other to it.',
    bedroomRuleLocation:
      'Where your devices sleep is your call now. We still recommend out of the bedroom, and we still do it ourselves.',
    socialMediaTerms:
      'Your accounts are yours. We talk about what they say about you to the world, and anything that affects the family gets decided together.',
    whenThingsGoWrong:
      'Whatever happens online, a scam, a leaked photo, anything, you can bring it to us and get help with no lecture attached. First call, full support, always.',
  },
}

export function getAgreementDefaults(stageId: StageId | null): AgreementSectionDefaults {
  return DEFAULTS[stageId ?? 'explorer'] ?? DEFAULTS.explorer
}
