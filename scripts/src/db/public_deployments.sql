-- Create or skip existing enum types
DO $$ BEGIN
  CREATE TYPE deploy_stage AS ENUM ('DEV', 'PROD', 'STAGING', 'PREVIEW');
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

DO $$ BEGIN
  CREATE TYPE functiontype AS ENUM ('WEBHOOK', 'CRON', 'MIXED');
EXCEPTION WHEN duplicate_object THEN NULL;
END$$;

-- Table creation if not exists
CREATE TABLE IF NOT EXISTS public_deployments (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  package_name TEXT UNIQUE NOT NULL,
  base_url TEXT NOT NULL,
  stage deploy_stage NOT NULL,
  type functiontype NOT NULL,
  docs TEXT,
  endpoints JSONB[] NOT NULL DEFAULT ARRAY[]::JSONB[],
  schedules JSONB[] NOT NULL DEFAULT ARRAY[]::JSONB[],
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger function to auto-update "updated_at"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger is in place
DROP TRIGGER IF EXISTS trigger_update_public_deployments_updated_at ON public_deployments;
CREATE TRIGGER trigger_update_public_deployments_updated_at
BEFORE UPDATE ON public_deployments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();