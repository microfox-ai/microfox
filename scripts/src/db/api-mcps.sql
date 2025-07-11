-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

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
CREATE TABLE IF NOT EXISTS api_mcps (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  package_name TEXT UNIQUE NOT NULL,
  base_url TEXT NOT NULL,
  stage deploy_stage NOT NULL,
  type functiontype NOT NULL,
  docs TEXT,
  embedding VECTOR(768) NULL,                 -- Gemini/text-embedding-004
  api_type TEXT NOT NULL DEFAULT 'package-sls', -- e.g. "package-sls", "micro-agent"
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ANN index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_api_mcps_embedding
  ON api_mcps
  USING hnsw (embedding vector_cosine_ops);

-- Filter index
CREATE INDEX IF NOT EXISTS idx_api_mcps_api_type
  ON api_mcps(api_type);

-- Trigger function to auto-update "updated_at"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger is in place
DROP TRIGGER IF EXISTS trigger_update_api_mcps_updated_at ON api_mcps;
CREATE TRIGGER trigger_update_api_mcps_updated_at
BEFORE UPDATE ON api_mcps
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- Function for global mcp search
CREATE OR REPLACE FUNCTION match_mcps(
    query_embedding VECTOR,
    api_type TEXT DEFAULT NULL,
    match_count INT DEFAULT 5,
    match_threshold float DEFAULT 0.5
)
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    package_name TEXT,
    base_url TEXT,
    stage deploy_stage,
    api_type TEXT,
    type functiontype,
    similarity FLOAT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE SQL STABLE
AS $$
    SELECT
      m.id,
      m.name,
      m.package_name,
      m.base_url,
      m.stage,
      m.api_type,
      m.type,
      1 - (m.embedding <#> query_embedding) AS similarity,
      m.metadata,
      m.created_at,
      m.updated_at
    FROM api_mcps AS m
    WHERE (m.embedding <#> query_embedding) < 1 - match_threshold
      AND (api_type IS NULL OR m.api_type = api_type)
    ORDER BY m.embedding <#> query_embedding
    LIMIT match_count;
$$;