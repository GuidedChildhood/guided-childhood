
### 15. The school email promo screen and the sibling question (Justin, post launch review)
Two additions from the first live walkthrough:

**School email promo.** Once inbound routing is live, promote it in two places: a dashboard card ("Add your school's email and your child's tasks, dates and kit days build themselves into alerts") and a new email in the lifecycle chain (day 10 or so: connect your school email). The promo screen explains what we extract (dates, kit, payments, homework) and that the raw email is never stored.

**Multiple children.** Onboarding currently captures one child; the children table already supports many (is_primary flag). Needed: an "Add another child" flow in settings and on the dashboard, a child switcher, per child stage content and daily trail, per child concerns and routines, and alerts that always name which child they are about. One account, one subscription, every sibling on their own stage. Design question to resolve: whether the daily loop interleaves children in one trail or the parent switches between trails.

### 16. Second live review batch (Justin, 3 Jul evening)
1. **Pill nav** (BUILT 3 Jul): segmented pill tabs on the desktop dashboard nav, dark espresso pill for the active tab, soft white wash on hover, matching the agency reference Justin supplied.
2. **Pathway clear on every login:** the first thing after login orients the parent on their pathway position before anything else competes.
3. **Feature education email chain:** extend the lifecycle emails so each feature gets its own short email over the first weeks: the tracker, the agreement, devices, moments, the curriculum and lessons, the AI module. One feature per email, one action each.
4. **Tracker rebuilt around daily goals and streaks:** daily goals with achieved or not, a Duolingo style streak (current streak, longest, freeze rule to forgive one missed day), PWA push tied to the streak state. The weekly wellbeing check stays as the Friday ritual; the daily layer sits on top. Device follow ups feed it: the devices the family registered generate daily tasks when issues arise.
5. **Lessons tab as digital home schooling:** link the built but hidden lessons hub into the nav as the home of the monthly curriculum, and start filling content from the week 10 plan. The animation section (squad video beats) starts here.
