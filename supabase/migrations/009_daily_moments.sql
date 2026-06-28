-- 009_daily_moments.sql
-- Moment cards: each row is a real parenting scenario with DiGi context

CREATE TABLE IF NOT EXISTS public.daily_moments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  category       text NOT NULL CHECK (category IN ('Morning','Digital','School','Food','Evening','Transitions','Emotions')),
  age_bands      text[] NOT NULL DEFAULT '{}',
  icon           text NOT NULL DEFAULT '💡',
  science_brief  text NOT NULL,
  digi_opener    text NOT NULL,
  solutions      jsonb NOT NULL DEFAULT '[]',
  expert_note    text,
  sort_order     integer NOT NULL DEFAULT 0,
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Completions: parent marks a moment as done today
CREATE TABLE IF NOT EXISTS public.moment_completions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id    uuid REFERENCES public.children(id) ON DELETE SET NULL,
  moment_id   uuid NOT NULL REFERENCES public.daily_moments(id) ON DELETE CASCADE,
  completed_on date NOT NULL DEFAULT CURRENT_DATE,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT moment_completions_unique UNIQUE (user_id, moment_id, completed_on)
);

ALTER TABLE public.daily_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_completions ENABLE ROW LEVEL SECURITY;

-- Everyone can read moments
CREATE POLICY "moments_readable_by_all" ON public.daily_moments
  FOR SELECT USING (true);

-- Users manage their own completions
CREATE POLICY "completions_own" ON public.moment_completions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_moments_category  ON public.daily_moments (category);
CREATE INDEX IF NOT EXISTS idx_daily_moments_sort      ON public.daily_moments (sort_order);
CREATE INDEX IF NOT EXISTS idx_completions_user_date   ON public.moment_completions (user_id, completed_on DESC);
