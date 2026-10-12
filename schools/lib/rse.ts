import { CURRICULUM, type CurriculumModule } from '@gc/shared/schools-curriculum'

// THE THREE LESSONS THAT TEACH INTO THE RELATIONSHIPS AND SEX EDUCATION BLOCK.
//
// The parents page used to say this programme teaches no sex education, which
// decided the withdrawal question for the school. Three lessons map to the RSE
// guidance's own requirements on intimate images, consent and harassment, and
// how pornography distorts relationships (shared/schools-rshe-2026.ts: ks3-14
// on RSHE-S-RR-11 and OSA-11, ks4-16 on BS-1, BS-6 and OSA-5, ks4-17 on BS-11).
// Whether any part of them counts as sex education in a given school is that
// school's call, made in its RSHE policy, and so is a withdrawal request (the
// sync plan panel's Ofsted lens, 9 October 2026, F3).
//
// So the pages name the three, say the school decides, and point at the
// parent note, which a school can send home before the lesson rather than
// after it. The run sheet for each of the three says so in its Before list,
// which is what makes the offer on the parents page true.
export const RSE_MODULE_IDS = [
  'ks3-14-bodies-image-pressure',
  'ks4-16-consent-images-law',
  'ks4-17-sextortion',
] as const

export const RSE_MODULES: CurriculumModule[] = RSE_MODULE_IDS
  .map(id => CURRICULUM.find(m => m.moduleId === id))
  .filter((m): m is CurriculumModule => !!m)

export const isRseModule = (moduleId: string) => (RSE_MODULE_IDS as readonly string[]).includes(moduleId)
