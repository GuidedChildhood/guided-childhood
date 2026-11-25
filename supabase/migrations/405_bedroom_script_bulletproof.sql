-- Guided Childhood, Migration 405
-- The bedroom script, made bulletproof (Justin, 25 November 2026).
-- Plan: plans/2026-11-25-ready-before-16-plan.md
--
-- A Mumsnet parent said a child would answer the old line with "OK, I'll put
-- it on do not disturb", and that the reason has to be about that child
-- ("football tomorrow"), not a general one. So the Say line now carries the
-- child's own reason as a blank, and the three answers a child actually gives
-- go in if_they_push_back, which the script page shows under "If they push
-- back" (components/scripts/ScriptDepth.tsx).
--
-- The row is "Devices and sleep" (builder), the phone at night script, the
-- same talk as the Bedroom Rule in lib/content/stages.ts and the script cards.
--
-- Evidence: "tend to sleep worse" rests on Carter and others, JAMA Pediatrics,
-- 2016, a meta analysis that found bedtime access to a portable device was
-- associated with too little and poorer sleep. It is an association, and the
-- why says so. No other source is added here.
--
-- Title, situation and category are unchanged, so the script's embedding
-- (built from those three, migration 131) stays valid.
-- Idempotent: setting the same text twice changes nothing.

update public.scripts
set say_this = $sy$At night, phones charge in the kitchen. Mine too. Your body does its growing and sorting while you sleep, and you've got [their thing tomorrow, like football]. You get it back at breakfast.$sy$,
    if_they_push_back = $ip$If they say "I'll put it on do not disturb": "Good idea for the day. At night it still sits next to you, and kids with a phone in their room tend to sleep worse, even on silent. Kitchen it is."

If they say "but I need it for my alarm": "Fair. We'll get you a proper alarm clock."

If they say "you have yours": "Mine's in the kitchen too. Same rule for all of us."$ip$,
    why_it_works = $wy$Children with a phone or tablet in the bedroom at night tend to sleep less and sleep worse, even when they are not using it (Carter and others, JAMA Pediatrics, 2016). That is an association across many studies, not proof that the phone is the cause, but it is why do not disturb is not the answer: the phone is still next to them. A reason that belongs to your child, like football tomorrow, lands better than a general one, and the adults charging in the kitchen too leaves a sharp child nothing to pick apart. Charging yours alongside theirs turns a rule into a family habit, which holds far better.$wy$
where id = 'ded831b8-927e-4688-92fe-43cc6c8645c3';
