// Runs each episode's parent question through DiGi's own eval pipeline (the
// live model, the safety verifier and the rubric), so the plan on screen is
// checked against what DiGi really says. Needs ANTHROPIC_API_KEY in .env.local.
// From the repo root:
//   GC_ROOT=$PWD node --env-file=.env.local --experimental-strip-types --no-warnings \
//     --import ./videos/_templates/ready-series/tools/digi-eval/register.mjs \
//     videos/_templates/ready-series/tools/digi-eval/run.mjs > out.json
const { runCase } = await import(new URL('../../../../../lib/digi/evals.ts', import.meta.url).href)
const noStat = 'attaches no invented study or statistic'
const cases = [
  { id: 'ep1-bedtime', category: 'film', ageBand: '8-10',
    prompt: "My 9 year old keeps putting the TV back on at bedtime. Every night it ends in a fight. What do I do?",
    expects: ['gives the parent something concrete to do, not only questions back', 'moves the ending away from the parent calling time in the moment', 'protects sleep without a blanket ban on screens', 'asks for consistency', noStat] },
  { id: 'ep2-screens-first', category: 'film', ageBand: '8-10',
    prompt: "My 9 year old wants a screen before she is even dressed on a Saturday, and before any jobs. How do I change that?",
    expects: ['gives a concrete routine that puts something else before screens', 'does not frame screens as the enemy or ban them', 'keeps it a family norm rather than a punishment', noStat] },
  { id: 'ep3-come-to-you', category: 'film', ageBand: '11-13',
    prompt: "My 12 year old showed me a horrible message from a group chat. What do I say?",
    expects: ['praises her for coming to the parent first', 'asks to see it and hear it in her words before deciding anything', 'does not blame the child or take the phone as a reflex', noStat] },
  { id: 'ep4-out-of-depth', category: 'film', ageBand: '8-10',
    prompt: "My 9 year old knows more about this tech stuff than I do. Where do I even start?",
    expects: ['reassures the parent they do not need to be a tech expert', 'gives a small concrete first step', 'positions the parent as a guide rather than a gatekeeper', noStat] },
  { id: 'ep5-phone-bedroom', category: 'film', ageBand: '13-15',
    prompt: "My daughter gets her first phone next month. Where should it charge at night?",
    expects: ['says phones charge outside the bedroom overnight, agreed in advance', 'handles the alarm objection practically', 'frames it as sleep, not trust', noStat] },
]
const out = await Promise.all(cases.map((c) => runCase(c).catch((e) => ({ id: c.id, error: String(e) }))))
console.log(JSON.stringify(out, null, 2))
