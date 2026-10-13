-- 375: DiGi's research bank agrees the ending too.
--
-- Migration 371 took every "give a two or five minute warning" out of the
-- scripts and moment cards, because the one close study of screen endings
-- found warned endings were followed by more upset, and what helped was the
-- ending agreed before the screen went on (Hiniker, Suh, Cao and Kientz, CHI
-- 2016). On 13 October 2026 live DiGi still told a parent "Give a warning...
-- Five minutes before" for a 9 year old's bedtime TV. The prompt is fixed in
-- lib/digi/system.ts in the same change; these are the three rows of
-- expert_knowledge that retrieval could still hand DiGi saying the opposite.
--
-- THE EDITS
--   Child Mind Institute, transitions: "Predictable warnings help: a countdown
--     the child can see, five more minutes then..." goes. What the row says
--     about the transition being the problem, and naming what comes next,
--     stays; the runway is now the agreement made beforehand.
--   West Suffolk NHS sleep leaflet: the row stretched a bedtime routine's
--     "heads up thirty minutes out, countdown reminders" to the end of a
--     screen after school. The bedtime sequence and the cue phrase stay; the
--     screen's ending is a step in that sequence, agreed before it goes on.
--   Hiniker et al: "went far better" and "made transitions worse" overstate a
--     diary study, the same overstatement 371 corrected in script 9650. It
--     now says what was found.
--
-- Each update is guarded on the exact current finding, so a replay or a row
-- rewritten since changes nothing, and the old text is written out in each
-- statement, so this file is its own undo. Embeddings are left alone, as in
-- 371: no edit changes what a row is about. The check at the end aborts if
-- any active finding still carries the warning advice.

begin;

-- ── Child Mind Institute, helping kids with transitions ───────────────────
update public.expert_knowledge
   set finding = 'Young children struggle with the transition itself, not only with the thing being ended, so the screen off protest at 4 to 7 is a transition problem before it is a defiance problem. Predictability helps: a routine the child knows, and naming what comes next. A sudden stop with no runway reliably produces the meltdown parents then misread as addiction. The runway is the ending agreed before the screen goes on, not a warning at the end: the one close study of screen endings found warned endings were followed by more upset, not less (Hiniker et al, CHI 2016).'
 where source_name = 'Child Mind Institute, helping kids with transitions'
   and finding = 'Young children struggle with the transition itself, not only with the thing being ended, so the screen off protest at 4 to 7 is a transition problem before it is a defiance problem. Predictable warnings help: a countdown the child can see, five more minutes then we turn it off and get ready for bed, and naming what comes next. A sudden stop with no runway reliably produces the meltdown parents then misread as addiction.';

-- ── West Suffolk NHS Foundation Trust, sleep leaflet ──────────────────────
update public.expert_knowledge
   set finding = 'The NHS paediatric sleep leaflet gives the shape of a bedtime that works: four or five activities in the same order, and the same cue phrase every time, longer where a child has ADHD. Where a screen is part of the evening, its ending is one of those steps, agreed before the screen goes on rather than counted down at the end: the sequence and the cue are what the child learns, not the argument (UK).'
 where source_name = 'West Suffolk NHS Foundation Trust, Sleep: a guide for school aged children, 2022'
   and finding = 'The NHS paediatric sleep leaflet gives the shape of a transition that works: a heads up thirty minutes out, countdown reminders, four or five activities in the same order, and the same cue phrase every time, longer where a child has ADHD. The same shape works for the end of a screen after school: the sequence and the cue are what the child learns, not the argument (UK).';

-- ── Hiniker et al, Screen Time Tantrums (CHI 2016) ────────────────────────
update public.expert_knowledge
   set finding = 'For under sixes the hardest moment is the end, not the start. In 27 interviews and a 28 family diary study, endings set by the technology (the show finished, the device timed out) went more smoothly than endings called by a parent, and endings with a spoken two minute warning were followed by more upset, not less. Let the episode end itself or set the device to end it, and agree the stopping point before it starts.'
 where source_name = 'Hiniker et al, Screen Time Tantrums (CHI 2016)'
   and finding = 'For under sixes the hardest moment is the end, not the start. In 27 interviews and a 28 family diary study, endings set by the technology (the show finished, the device timed out) went far better than endings called by a parent, and the spoken two minute warning made transitions worse. Let the episode end itself or set the device to end it, and agree the stopping point before it starts.';

do $$
begin
  if exists (select 1 from public.expert_knowledge
              where active
                and finding ~* 'predictable warnings help|five more minutes then we turn it off|countdown reminders|heads up thirty minutes out|went far better than endings called by a parent') then
    raise exception '375 aborted, a finding still advises a warning before a screen ends';
  end if;
end $$;

commit;
