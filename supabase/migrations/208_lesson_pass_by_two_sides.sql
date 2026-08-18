-- Guided Childhood — Migration 208
-- A parent and a child can BOTH pass the same lesson for the same child.
--
-- lesson_pass_by exists to answer "which side passed this", because the road to
-- social media is only walked when there is one of each: a parent who has read
-- about grooming and a thirteen year old who has not is exactly the gap it
-- closes. lib/pathway/social-road.ts reads it for precisely that.
--
-- Migration 162 gave it two partial unique indexes:
--
--     lesson_pass_by_parent_once  (user_id, lesson_id) where child_id is null
--     lesson_pass_by_child_once   (user_id, lesson_id, child_id) where child_id is not null
--
-- Neither mentions `who`, and under the old doctrine neither needed to: a
-- parent's row ALWAYS had a null child, so the two indexes never met.
--
-- Justin's rule of 18 August 2026 ends that: "lessons are child related not
-- family." A parent watching a lesson with Alma is watching it FOR Alma, so the
-- parent's row now names her. The moment it does, both sides of that lesson for
-- that child collide in lesson_pass_by_child_once, and the second insert is
-- rejected as a duplicate. The completion routes swallow duplicates on purpose,
-- so nobody is told: the road would simply never show a leg as complete,
-- because it can only ever record whichever side went first.
--
-- Adding `who` to the child index is the whole fix. One row per side per child
-- per lesson, which is what the table was named for.
--
-- LOOSENING, never tightening: anything unique on (user_id, lesson_id,
-- child_id) is already unique with `who` added, so no existing row can violate
-- the replacement. And lesson_pass_by is empty today, verified in the live
-- database on 18 August, so there is nothing to migrate either way.

drop index if exists public.lesson_pass_by_child_once;

create unique index if not exists lesson_pass_by_child_once
  on public.lesson_pass_by (user_id, lesson_id, child_id, who)
  where child_id is not null;

-- The parent's family wide row is untouched. It still means what it always
-- meant, "this parent covered this lesson for the household", which is what the
-- rows written before today are, and what the grandfather rule in the passport
-- lane reads them as.
