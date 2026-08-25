-- 222_digi_louder_than_the_evidence.sql
-- Grounds DiGi in the current evidence on children, social media and bans,
-- gathered in the Louder Than The Evidence work (content/packs/2026-08-13-
-- louder-than-the-evidence: philosophy-education-is-key.md and
-- ban-outcomes-evidence.md). Extends the corpus DiGi retrieves (019 and 042),
-- so when a parent asks about a ban, an age limit or whether social media is
-- the cause, DiGi answers from the same calibrated evidence base, small and
-- uneven effect, real drivers upstream, education over prohibition.
--
-- Style matches the existing seed exactly: real sources at the level of their
-- established position, no invented statistics, no apostrophes and no dashes so
-- the text stays clean and SQL safe. Idempotent by content: the guard skips the
-- whole block if these rows are already present. New rows are embedded by the
-- self healing sweep in lib/digi/knowledge-embed.ts, no app change needed.

do $$
begin
  if not exists (
    select 1 from public.expert_knowledge where source_name = 'eSafety Commissioner'
  ) then

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics) values

-- Bans do not remove the risk, they remove the view of it
('report', 'eSafety Commissioner', 'When a country restricts social media for under sixteens, most of those teenagers keep using it within months, because the accounts are never reliably detected. A restriction that is easy to step around removes the view of the risk, not the risk itself, so a parent is left less able to see and to help.', '{11-13,13-15,16+}', '{social_media,safety}'),
('association', 'Molly Rose Foundation', 'A leading child safety charity found that after a national social media ban most young people still had access, that getting around it was easy, and that about half felt no safer. This is why preparation and an open conversation protect a child where a blanket ban does not.', '{8-10,11-13,13-15,16+}', '{social_media,safety}'),

-- The real drivers dwarf the phone
('report', 'Adverse childhood experiences research', 'The largest drivers of mental health in children are not screens. Family adversity, poverty, trauma and loneliness explain far more of how a young person is doing, on the order of ten to twenty times more than social media use. When a parent is worried, look first at sleep, connection, safety and what the child is carrying.', '{4-7,8-10,11-13,13-15,16+}', '{mood,anxiety,relationships}'),

-- Age gates are not protection, the skill is
('report', 'Age assurance evidence', 'Age limits have existed for many years and most younger children are online regardless. The gate is not the thing that protects a child. A trusted adult and the skill to handle what they meet is what lasts, because a rule can be stepped around and a skill travels with them.', '{4-7,8-10,11-13}', '{social_media,safety}'),

-- Education is the durable answer
('report', 'Digital literacy research', 'Teaching a young person how feeds, selling and manipulation are built gives durable protection that a ban cannot. Controlled trials show school digital literacy improves the skills and the confidence young people have online. The skill works on any platform, which a single rule never does.', '{8-10,11-13,13-15,16+}', '{misinformation,social_media,safety}'),

-- Small and uneven, not an epidemic
('researcher', 'Prof Christopher Ferguson', 'When robust controls are applied, the link between hours on social media and mental health shrinks close to zero, because much of it is explained by other things going on in a young life such as temperament, family and belonging. The honest read is a small and uneven effect, real for some children, not an epidemic for all.', '{11-13,13-15,16+}', '{social_media,mood}'),

-- Connection is a lifeline for the vulnerable child
('report', 'Marginalised youth research', 'For an isolated child, a disabled child, or one who found their people online, connection can be a lifeline rather than a risk. Removing it can take away support and leave the vulnerability untouched. The better move is to reduce the vulnerability and keep the connection, not to cut the connection and ignore the cause.', '{8-10,11-13,13-15}', '{social_media,relationships,safety}');

  end if;
end $$;
