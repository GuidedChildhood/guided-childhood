-- Guided Childhood — Sibling device fight scripts (sort orders 9504 to 9506)
-- The Help now sibling situation had no real script to find, so the
-- matcher grabbed whatever mentioned sharing. These three are the real
-- thing: the turn war, one per age band, free like every panic moment.

insert into public.scripts
  (stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order)
values

(
  'foundation',
  'screen-time',
  'Sibling fight over the device',
  'Two children, one tablet, and the volume is climbing. Somebody snatched, somebody screamed, and both are now appealing to you as judge and jury.',
  'Stop, both of you. The tablet sits on the side while we sort this out. It is one turn each, ten minutes, and the timer decides when, not the loudest voice. Who was mid turn? Then that turn finishes first.',
  'Right, that is it, NOBODY gets it now!',
  'Taking the device away punishes the child who was wronged along with the one who snatched, and teaches neither of them anything about turns. A visible timer moves the battle from you against them to everyone against the clock. The waiting child screams because waiting feels endless; a named number of minutes gives them certainty, and certainty is what the scream was really asking for.',
  'Agree the turn rule tonight while everyone is calm: fixed turns, a timer both can see, and whoever snatches sits out their next turn. Add Waited for my turn as a family quest so patience literally earns stars, and put the rule in the family agreement so it belongs to the house.',
  'none',
  true,
  9504
),

(
  'builder',
  'screen-time',
  'The device turn war',
  'The console or tablet is shared, the turns are disputed, and an eight to ten year old is bellowing that it is not fair while a sibling clings to the controller.',
  'Pause it, right now, mid game is fine. The rule stands: turns are ten minutes and the timer is the referee. If the arguing carries on, the screen has a rest and nobody loses their turn, it just waits for calm.',
  'You are older, you should know better. Give it to her!',
  'Making the older child give way every time breeds a quiet resentment that surfaces for years, and it teaches the younger one that protest wins hardware. A timer is a referee with no favourites, which removes the whole point of fighting. Pausing instead of confiscating protects the fair turn, so the row stops paying out for either side.',
  'Set the turn lengths together tonight, put a visible timer next to the shared screen, and agree that snatching costs your next turn. Write it into the family agreement and let them decorate the timer, ownership is half the peace.',
  'none',
  true,
  9505
),

(
  'explorer',
  'screen-time',
  'Sharing the screen with a younger sibling',
  'Your eleven to thirteen year old was mid game when a younger sibling demanded the screen, and now you have one furious almost teen and one wailing small person.',
  'I know it is properly annoying when your game gets cut off, and I am not doing that to you. Your turn is protected too, that is the deal both ways. Help me set the rota and you will always know exactly when the screen is yours, guaranteed.',
  'Oh just let them have it, they are little!',
  'At this age fairness is the entire currency, and just let them have it reads as your turn does not count. Protecting the older child''s slot buys their genuine buy in, and a bought in older sibling becomes the enforcer of the system instead of its loudest victim. The rota does the arguing so nobody else has to.',
  'Make a screen rota for shared devices tonight, on the fridge, each child''s protected slot named in writing. Timer as referee, swaps allowed only when both agree, and check how it went at the Friday agreement review.',
  'none',
  true,
  9506
);
