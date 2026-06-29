-- DiGi daily feedback loop
-- One reflective question per user per day, answered by the parent.
-- Stored responses seed the next day's DiGi context for personalization.

CREATE TABLE IF NOT EXISTS public.digi_feedback (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id         uuid        REFERENCES public.children(id) ON DELETE SET NULL,
  feedback_date    date        NOT NULL DEFAULT CURRENT_DATE,
  question         text        NOT NULL,
  parent_response  text,
  digi_insight     text,  -- DiGi's stored interpretation, used as next-session seed
  responded_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT digi_feedback_user_date_unique UNIQUE (user_id, feedback_date)
);

ALTER TABLE public.digi_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own digi feedback"
  ON public.digi_feedback FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for efficient lookup by user + recent dates
CREATE INDEX IF NOT EXISTS idx_digi_feedback_user_date
  ON public.digi_feedback (user_id, feedback_date DESC);
