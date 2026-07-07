-- Guided Childhood — Morning rescue scripts (3 scripts, sort orders 9501 to 9503)
-- The moment BEFORE the morning TV battle: they will not get up at all,
-- usually because last night ran late and the routine slipped. The arc
-- every one of these carries: this is common, no panic, no shouting, no
-- parent guilt, then the plan that fixes it tonight. All free: this is
-- a panic moment and panic moments are how families find us.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values

(
  'foundation',
  'screen-time',
  'They will not get up in the morning',
  'Last night ran late. The TV stayed on past bedtime because life got busy, and this morning they will not get out of bed. Everyone is tired, the clock is ticking and the day is fraying before it starts.',
  'Good morning sleepy one. Last night went late so this morning feels extra hard. That is okay, it happens. We are going to do it together: feet on the floor first, then breakfast. Tonight we will get your sleep back.',
  'Get UP now! We are late because YOU stayed up watching TV!',
  'A late night happens in every family and it does not make you a bad parent or them a difficult child. A tired small child cannot be hurried by volume; shouting adds panic on top of exhaustion and actually slows the morning down. Naming what happened without blame, then moving together one step at a time, gets feet on the floor faster than any threat.',
  'Fix the night, not the morning. Tell them the plan this afternoon while everyone is calm, never at bedtime: screens off thirty minutes earlier than usual, wind down starts straight after dinner, and tomorrow morning gets ten extra minutes of buffer. One calm early night usually repairs the whole rhythm.',
  'none',
  true,
  9501
),

(
  'builder',
  'screen-time',
  'Will not get out of bed for school',
  'The evening routine slipped, screens ran late, and now your eight to ten year old is buried under the duvet refusing to move. You can feel the shout building and the guilt underneath it.',
  'I know, getting up today is horrible because last night went late. That is on all of us, not just you. Here is the deal: up in two minutes, easy breakfast, and tonight we reset properly so tomorrow does not feel like this.',
  'This is exactly why I said no more TV! Up! NOW!',
  'This age understands cause and effect, so name it once, calmly, and share the responsibility honestly: the routine slipped, it was not their crime. Guilt makes parents either explode or cave, and neither gets a child vertical. A two minute deadline with a concrete next step gives a groggy brain something small enough to actually do.',
  'Reset the routine together this afternoon: agree the screens off time, put the tablet to bed in the kitchen at that time, and let them set their own alarm for the morning. A child who set the alarm argues with the clock, not with you.',
  'none',
  true,
  9502
),

(
  'explorer',
  'screen-time',
  'Impossible to wake after a late night',
  'Your eleven to thirteen year old was on a screen far too late, everyone knows it, and this morning they are immovable and furious at being woken. The temptation is a lecture at full volume.',
  'Rough morning, I know. Last night got away from all of us. Not doing the lecture now, we would both hate it. Up in five, toast is on. Tonight we sort the evening out properly so mornings stop feeling like this.',
  'This is what happens when you stay up all night on that thing! I am taking it away!',
  'At this age a morning lecture lands as an attack and hardens them for the whole day, while confiscation announced in anger turns one bad night into a week long war. Skipping the sermon is not weakness, it is timing: the same conversation lands completely differently at 5pm. Low voice, small deadline, food on: that is what moves a tired almost teen.',
  'Tonight, not this morning, agree the reset together: screens out of the bedroom at an agreed time, their own alarm, their own wake up responsibility for the rest of the week. Write it into the family agreement so the rule belongs to the house, not to your mood.',
  'none',
  true,
  9503
);
