// The one test fixture pack, shared by the pipeline test and by any manual
// check of the return path through Drive.
//
// It is a FIXTURE. It was written to pass the house rules using only the five
// figures the real review of GDC-RR-0754a1641c cleared. It is not a draft for
// publication, and nothing that imports it can publish it.

export const FIXTURE_ID = 'GDC-RR-0754a1641c'

export const FIXTURE_BODY = [
  'I nearly used a number this week that would have made my argument look much stronger.',
  'A new meta-analysis pooled 12 studies on social media and adolescent mental health and reported a correlation of r = 0.308. That is far bigger than the figures I usually quote, and I will be honest that part of me wanted it to be true.',
  'I build a product for parents who are worried about exactly this. A bigger number would sell it better.',
  'So I read past the headline figure, and one line stopped me. The heterogeneity was 93.85 percent. In plain terms, the studies inside it disagree with each other so much that averaging them tells you very little about any one child.',
  'That is not a criticism of the researchers. They ran the checks you would hope for and reported what they found. It is a limit on what the result can carry.',
  'A pooled figure from a handful of studies that disagree is not stronger evidence than one large, careful cohort that follows the same teenagers over time. It only looks stronger because it is one tidy number.',
  'Here is what I think it does show. Something real is going on for some children, and it is not evenly spread. The paper found the link looked different at different school stages, which is a reason to ask which child, and when, before asking how much.',
  'Here is what it does not show. It does not show that social media causes the harm, and it does not tell a parent anything about their own son or daughter.',
  'I would rather be trusted with a small true number than believed with a large shaky one. If the response to this is going to be proportional to the evidence, that has to cut both ways, including when the evidence flatters me.',
  'The paper is linked in the comments.',
  'When did you last turn down a statistic that suited you?',
].join('\n\n')

export const fixturePack = (sourceCommit, handoffVersion = 1) => ({
  researchId: FIXTURE_ID,
  gdcPostNumber: '054',
  sourceCommit,
  handoffVersion,
  status: 'DRAFT',
  linkedin: {
    body: FIXTURE_BODY,
    firstComment: 'The paper is here: https://doi.org/10.1177/13591045261487468 . The strongest objection is that a pooled estimate is still the best single summary we have. I think that holds when the studies broadly agree, and these do not.',
  },
  // Instagram, Facebook and a per platform visual brief are core from 24
  // November 2026, so the passing fixture carries them. No figures, so the
  // cleared list is not stretched by the adaptations.
  instagram: { caption: 'A new review says the effect is much bigger. We read the studies inside it and decided not to lean on the headline. Here is why, in plain words.' },
  facebook: { caption: 'If you saw a headline this week saying screens are far worse than we thought, this is for you. We read what sits underneath it. When did a statistic that suited you turn out to be weaker than it looked?' },
  visual: { brief: 'LINKEDIN: research card, one hero figure, cream ground, one accent, 1080 by 1350. INSTAGRAM: the same card as the first slide, 1080 by 1350. FACEBOOK: the card at 1200 by 630. MOTION: the figure writes on over four seconds, then a five second still hold.', assetsUsed: ['.claude/skills/viral-post/stat-card.html'] },
})

/** The fixture as the text of a pack document, in the layout Stage 2 uses. */
export function fixturePackText(sourceCommit, { handoffVersion = 1 } = {}) {
  const p = fixturePack(sourceCommit)
  return [
    `RESEARCH ID: ${p.researchId}`, `GDC POST NUMBER: ${p.gdcPostNumber}`, `HANDOFF VERSION: ${handoffVersion}`, `SOURCE COMMIT: ${sourceCommit}`, 'STATUS: DRAFT', '',
    '=== LINKEDIN POST ===', '(250 to 450 words. The closing question is the last sentence. No link. No dashes.)', p.linkedin.body, '',
    '=== FIRST COMMENT ===', p.linkedin.firstComment, '',
    '=== INSTAGRAM CAPTION ===', p.instagram.caption, '',
    '=== FACEBOOK CAPTION ===', p.facebook.caption, '',
    '=== NEWSLETTER ===', '',
    '=== VISUAL BRIEF ===', p.visual.brief, '',
    '=== ASSETS USED ===', p.visual.assetsUsed[0], '',
    '=== SOURCES ===', 'https://doi.org/10.1177/13591045261487468',
  ].join('\n')
}
