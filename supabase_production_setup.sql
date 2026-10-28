-- WE4ALL MILLION-USER PRODUCTION SCHEMA + OTA APP UPDATE REGISTRY
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public.we4all_state_sync (
  id TEXT PRIMARY KEY DEFAULT 'master_state',
  app_version TEXT DEFAULT '2.5.0',
  release_notes TEXT DEFAULT 'Initial WE4ALL Multi-Portal Release',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.we4all_state_sync ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read we4all_state_sync" ON public.we4all_state_sync;
CREATE POLICY "Allow public read we4all_state_sync"
  ON public.we4all_state_sync FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public upsert we4all_state_sync" ON public.we4all_state_sync;
CREATE POLICY "Allow public upsert we4all_state_sync"
  ON public.we4all_state_sync FOR ALL USING (true) WITH CHECK (true);