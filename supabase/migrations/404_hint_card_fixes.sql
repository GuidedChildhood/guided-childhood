-- Guided Childhood, Migration 404
-- Hint card fixes (Justin, 23 November 2026: "pick up the hint card fixes").
-- Plan: plans/2026-11-23-hint-card-fixes-plan.md
--
-- 1. Say what the evidence says. Stanford SCALE's review "The Evidence Base on
--    AI in K-12" (November 2026, 52 controlled studies) files Bastani 2025
--    (hints beat answers) and Cao 2026 (answers beat hints) as conflicting.
--    The free script from 261 and the knowledge row from 263 gave Bastani's
--    17 and 127 percent as settled. Both now say one trial, that a later one
--    disagreed, and what the review does find. The rule itself stays.
-- 2. Parents can see hint card use: how many hints a day and in which
--    subjects. Only the count and DiGi's one or two word subject. The
--    homework, the photo and the child's go at it are never stored (354).
--
-- Idempotent: the text updates match on the old wording, the columns use
-- if not exists.

update public.scripts
set why_it_works = replace(why_it_works, $t$The rule comes from a randomised trial with nearly a thousand secondary pupils. A chatbot that gave answers lifted their practice scores and then left them 17 percent worse on the exam once it was taken away. A version that gave only hints lifted practice by 127 percent and largely avoided the harm. Answers replace thinking; hints scaffold it. The rule "explain and quiz, never answer" is that trial in one sentence a nine year old can hold.$t$, $t$The rule leans on a randomised trial with nearly a thousand secondary pupils in Turkey: those given a chatbot that handed out answers did worse on the exam once it was taken away than those whose tutor only gave hints. It is one trial. A later study of American college students found answers with an explanation did better than hints, and a 2026 Stanford review of 52 studies calls the two results conflicting. What that review does find is that AI tends to go better when it supports the learning than when it produces the work, though neither way reliably improves it. So "explain and quiz, never answer" is a sensible default a nine year old can hold, not a proven cure, and the way to know if it is working is to watch whether they can do it without the chatbot.$t$)
where title = 'Ask the AI together, hints not answers'
  and position($t$The rule comes from a randomised trial with nearly a thousand secondary pupils. A chatbot that gave answers lifted their practice scores and then left them 17 percent worse on the exam once it was taken away. A version that gave only hints lifted practice by 127 percent and largely avoided the harm. Answers replace thinking; hints scaffold it. The rule "explain and quiz, never answer" is that trial in one sentence a nine year old can hold.$t$ in why_it_works) > 0;

-- The vector goes with the old wording, so it is cleared and the knowledge
-- embed sweep (lib/digi/knowledge-embed.ts) gives the row a fresh one.
update public.expert_knowledge
set embedding = null,
    finding = $t$In a randomised trial with nearly 1,000 high school pupils in Turkey, those given a chatbot that handed out answers did worse on the unassisted exam than those whose tutor only gave hints. It is one trial: a 2026 preprint with US college students found answers with an explanation beat hints, and Stanford's 2026 review of 52 studies calls the pair conflicting, finding only that AI used to support learning tends to do better than AI used to produce the work. Set the rule at home as a default rather than a proven fix: AI may explain and quiz, it may not answer. Ask it something together, check what it says against a book or a person, and watch whether they can do it without the chatbot.$t$
where source_name = 'Bastani et al, PNAS 2025 (AI in the maths classroom)'
  and finding = $t$In a randomised trial with nearly 1,000 high school pupils, a chatbot that gave answers lifted practice scores and then left pupils 17% worse on the unassisted exam; a version that only gave hints lifted practice by 127% and largely avoided the harm. Set the rule at home: AI may explain and quiz, it may not answer. Ask it something together and check what it says against a book or a person.$t$;

alter table public.kid_homework_help_uses
  add column if not exists hints    integer not null default 0,
  add column if not exists subjects text[]  not null default '{}';

comment on column public.kid_homework_help_uses.hints is
  'Hint cards DiGi gave this child today. Shown to the parent.';
comment on column public.kid_homework_help_uses.subjects is
  'The one or two word subjects DiGi named today (Maths, Spelling). Never the homework itself.';
