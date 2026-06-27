-- Daily practice sessions: one per user per day
-- Tracks whether the user has completed their daily card deck
-- Used for streak calculation and dashboard completion state

CREATE TABLE IF NOT EXISTS public.daily_sessions (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_date    date        NOT NULL DEFAULT CURRENT_DATE,
  cards_completed integer     NOT NULL DEFAULT 0,
  script_shown    integer,    -- sort_order of the review script shown today
  completed_at    timestamptz,
  CONSTRAINT daily_sessions_user_date_unique UNIQUE (user_id, session_date)
);

ALTER TABLE public.daily_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own daily sessions"
  ON public.daily_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
