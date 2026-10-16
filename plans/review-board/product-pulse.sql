-- The weekly board's read of real behaviour. READ ONLY: one select, no writes.
--
-- Why this exists: app/api/admin/product-pulse/route.ts is the product pulse,
-- but it answers only to Justin's signed in session, which a Friday routine
-- does not have. A routine that holds the Supabase connector runs this one
-- select instead, saves the single json it returns to its scratch folder, and
-- hands it to the board:
--
--   npm run review-board -- pulse --rows <that file>
--
-- The arithmetic is NOT here. This returns rows (parent ids and dates only,
-- nothing a family typed) and lib/home/habit-metrics.ts and
-- lib/home/value-signals.ts do the sums, the same functions the admin route
-- uses, so the two can never disagree. The ids are pseudonymous uuids: keep
-- the file in scratch, never commit it, and only the one line the board
-- prints goes into the report.
--
-- The five signals are defined in lib/home/value-signals.ts. If a column
-- named here is missing the query fails, and the board prints unknown.

select jsonb_build_object(
  'generatedAt', now(),
  'today', (now() at time zone 'Europe/London')::date,
  -- Every parent with at least one child: the denominator.
  'families', (select coalesce(jsonb_agg(distinct parent_id), '[]'::jsonb)
                 from public.children where parent_id is not null),
  -- Completed days, sixty days back, as lib/home/habit-metrics.ts reads them.
  'sessions', (select coalesce(jsonb_agg(jsonb_build_object('user_id', user_id, 'session_date', session_date)), '[]'::jsonb)
                 from public.daily_sessions
                where completed_at is not null
                  and session_date >= ((now() at time zone 'Europe/London')::date - 60)),
  'signals', jsonb_build_object(
    'memory', (select coalesce(jsonb_agg(distinct user_id), '[]'::jsonb)
                 from public.digi_memory where active),
    'childLink', (select coalesce(jsonb_agg(distinct user_id), '[]'::jsonb)
                    from public.kid_links where last_seen_at is not null),
    -- A worry with two scored check ins.
    'secondCheckIn', (select coalesce(jsonb_agg(distinct user_id), '[]'::jsonb)
                        from (select user_id
                                from public.concern_events
                               where score is not null
                               group by user_id, concern_id
                              having count(*) >= 2) c),
    -- The parent said how a script went.
    'scriptVerdict', (select coalesce(jsonb_agg(distinct user_id), '[]'::jsonb)
                        from public.concern_events
                       where linked_type = 'script' and answer is not null),
    -- The parent answered DiGi's "how did that go?".
    'followUpAnswered', (select coalesce(jsonb_agg(distinct user_id), '[]'::jsonb)
                           from public.digi_outcomes where verdict is not null)
  )
) as pulse_rows;
