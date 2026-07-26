-- The child phone handover prompt, and how a family answers it.
--
-- Half the product lives on the child's side: the jobs are ticked there, the
-- device time is earned there, the printables are asked for there. A parent can
-- run the parent side for weeks without realising, so on the second open we ask
-- once, properly, with the reasons.
--
-- handover_choice records how they answered, and it is a real preference rather
-- than a dismissal. 'paper' means this family does it on paper, which is an
-- entirely legitimate answer and on brand: plenty of families will not give a
-- child a phone and we should be the platform that respects that. Once it is
-- set, the prompt never returns. 'linked' is written when they set it up.
--
-- handover_asks caps the nagging. A parent who answers neither way is asked a
-- small number of times and then left alone, falling back to the quiet prompt
-- that already sits on the Quests page. An overlay on login is the most
-- intrusive surface we have and the fastest way to make it hated is to let it
-- ask forever.

alter table public.profiles
  add column if not exists handover_choice text,
  add column if not exists handover_asks int not null default 0;

alter table public.profiles
  drop constraint if exists profiles_handover_choice_check;

alter table public.profiles
  add constraint profiles_handover_choice_check
  check (handover_choice is null or handover_choice in ('paper', 'linked'));
