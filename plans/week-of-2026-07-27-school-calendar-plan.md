# 27 Jul 2026: three things the curriculum data unlocks

Branch `claude/guided-childhood-build-cknxds`, from main at 3e498f5. Lane:
platform code. Open PRs at claim time: none touching `lib/learning`, Home cards
or `/dashboard/school`. **No migration**, so no number to claim.

The analysis behind this: the 448 rows tell us a child's exact year group, and
the England statutory calendar is fixed and identical for every family. That is
a prediction engine that needs no assessment. Nothing here scores a child.

## The shared foundation: `lib/learning/calendar.ts`

One place that answers "what is coming for this year group, and when". Every
date is approximate on purpose and the copy says "around", because the checks
move by a few days each year and a wrong date read as a promise is worse than a
vague one that is right.

| event | year | roughly |
| --- | --- | --- |
| new school year | all | early September |
| secondary application deadline | 6 | 31 October |
| KS2 SATs | 6 | week of the second Monday in May |
| tables check | 4 | three weeks from the first Monday in June |
| phonics screening | 1 | week of the second Monday in June |
| end of year, moving up | all | late July |

`seasonFor` in digi-context.ts already hardcodes a thinner version of this by
month. It gets rewired to read the calendar so there is one truth, and its
existing contract is kept so the DiGi route does not change.

## 1. The Year 6 to Year 7 phone bridge

The highest value moment in the product. Secondary transfer is when a child gets
their first phone, and the curriculum data now tells us per child exactly when a
family enters that window: Year 6, May onward, through the summer.

`/dashboard/secondary`, plus a Home card inside the window. A staged pathway,
never allow or deny: what actually changes at secondary, deciding what the phone
is for, the agreement before the phone rather than after, a staged start, and
the first month.

The pathway steps are a fixed list in `lib/learning/transition.ts`, the same
shape as `lib/setup/steps.ts`. Not database rows: these are not scripts, and the
scripts table rule is about the words DiGi hands a parent to say.

## 2. The seasonal head start

`components/home/SchoolAheadCard.tsx`. Inside an event's lead window, Home says
what is coming, what it actually is, and one thing worth doing. Four to six
weeks ahead, so it is a head start rather than a warning.

## 3. The homework decoder

`/dashboard/homework` and `app/api/learning/decode/route.ts`. A parent pastes
the homework, DiGi names the statutory objective behind it, says what it is for
in plain words, and gives one way to help tonight.

Pure lookup, no assessment. Nothing is stored, the same rule the sheet follows.
Two disciplines carried over: the objectives handed to DiGi are only ever the
ones for that child's year, and the ids it returns are revalidated against that
set, because a model is no more an authority than a client is.

## The rules that travel with all three

Unchanged from digi-context.ts and they matter more than the features:

1. Never say or imply a child is behind, ahead, or at any level. We have no
   assessment.
2. Quote the published wording or say plainly that we are putting it in simpler
   words.
3. Never claim the school is teaching this now. Our term ordering is ours.
4. Say nothing at all rather than guess: no birthday, an age outside Years 1 to
   6, or an empty curriculum map all mean these surfaces stay quiet.
