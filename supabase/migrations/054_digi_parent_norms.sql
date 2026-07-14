-- Guided Childhood — Migration 054
-- DiGi gets proactive and kind. Two small changes that let DiGi lead on the
-- parent's own mental health and point them at exactly what to do next:
--
-- 1. digi_prompts.href: a proactive prompt can now deep link to the one place
--    it is about (open Lessons to share a printable, for example), so the
--    notification links to what needs doing instead of only opening a chat.
--
-- 2. Seed expert_knowledge with a parent wellbeing "normal moments" library:
--    the everyday moments that quietly make parents feel like they are failing
--    (feeling guilty for working while the child is around, a rushed and
--    shouty school run, losing your temper, needing space, the child saying I
--    am bored), each paired with what research actually says is normal and one
--    small, permission giving thing to do. DiGi retrieves and cites these in
--    chat and leans on them for its parent_care prompts, so the reassurance is
--    grounded in real positions, never invented. The point is never to guilt a
--    parent, only to stand beside them.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only. Text carries no apostrophes
-- and no dashes so it stays clean and SQL safe.

alter table public.digi_prompts add column if not exists href text;

-- The normal moments library. Real figures represented at the level of their
-- established position, no invented statistics. Guarded on the normal_moments
-- topic so a re-run never double inserts.
insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics)
select source_type, source_name, finding, age_bands, topics
from (values
  ('researcher', 'Dr Ellen Galinsky', 'When children were asked what they would change, they did not wish for more hours with their parents, they wished their parents were less stressed and less tired. A short stretch of calm, present time counts for more than being available and frazzled all day, so working while your child is nearby is not the harm it feels like.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,normal_moments,routines}'),
  ('expert', 'Donald Winnicott', 'Children are not helped by a perfect parent, they are helped by an ordinary devoted one who gets it right often enough and repairs the rest. The good enough parent is the healthy one. Reaching for perfect only adds a pressure that helps nobody in the house.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,normal_moments,relationships}'),
  ('researcher', 'Dr Ed Tronick', 'In warm everyday relationships a parent and child are out of step with each other much of the time, and what builds a childs security is the coming back together after a rough patch, not never slipping. Losing your patience and then repairing teaches more than a flawless day ever could.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,normal_moments,relationships,mood}'),
  ('researcher', 'Dr Teresa Belton', 'Empty, boring time is where children learn to generate their own ideas. I am bored is not a problem for you to fix, it is the doorway to imagination, so it is genuinely fine to let it sit rather than fill it with a screen. The child in the back of the car with nothing to do is doing something.', '{4-7,8-10,11-13}', '{parent_wellbeing,normal_moments,screen_time}'),
  ('researcher', 'Dr Peter Gray', 'Children grow in confidence from time spent playing and solving small problems without an adult stepping in. Stepping back is a gift and not neglect, and it hands the parent a little room to breathe at the same time. Encourage a child to potter alone and you are building independence, not ignoring them.', '{4-7,8-10,11-13,13-15}', '{parent_wellbeing,normal_moments,routines}'),
  ('expert', 'Dr Emma Svanberg', 'Feeling guilty is one of the most common things parents report, and it is usually a sign of how much you care rather than evidence you are getting it wrong. Guilt that you notice and then set down is far healthier than guilt you let run the show.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,normal_moments,mood}'),
  ('association', 'Anna Freud Centre', 'A parent does not need to be calm every minute, they need to be a steady base a child can return to. Occasional stress followed by warmth and repair is exactly how a child learns that relationships survive hard moments, so one shouty school run does not undo the good.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,normal_moments,relationships}'),
  ('researcher', 'Dr Kristin Neff', 'Treating yourself with the same kindness you would offer a friend lowers your stress and leaves you more patient with your child, while harsh self criticism does the reverse. Giving yourself a break is not indulgence, it is the thing that lets you show up again tomorrow.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,normal_moments,mood}')
) as seed(source_type, source_name, finding, age_bands, topics)
where not exists (select 1 from public.expert_knowledge where 'normal_moments' = any(topics));
