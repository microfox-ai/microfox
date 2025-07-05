-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create enum type for stages if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'deployment_stage') THEN
    CREATE TYPE deployment_stage AS ENUM ('DEV', 'STAGING', 'PREVIEW', 'PROD');
  END IF;
END
$$;

-- Main embeddings table
CREATE TABLE IF NOT EXISTS api_embeddings (
  id                         UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name               TEXT             NOT NULL,
  base_url                   TEXT             NOT NULL,
  schema_path                TEXT             NULL,                 -- e.g. "/docs.json"
  endpoint_path              TEXT             NOT NULL,             -- e.g. "/api/send-message"
  http_method                TEXT             NOT NULL,             -- e.g. "POST"
  doc_text                   TEXT             NOT NULL,             -- concatenated context sent to embedder
  embedding                  VECTOR(768)      NULL,                 -- Gemini/text-embedding-004
  api_type                   TEXT             NOT NULL DEFAULT 'package-sls',            -- e.g. "package-sls", "micro-agent"
  stage                      deployment_stage NOT NULL DEFAULT 'STAGING',
  metadata                   JSONB            NULL,
  created_at                 TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at                 TIMESTAMPTZ      NOT NULL DEFAULT now()
);

-- ANN index for fast similarity search
CREATE INDEX IF NOT EXISTS idx_api_embeddings_embedding
  ON api_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Filter indexes
CREATE INDEX IF NOT EXISTS idx_api_embeddings_package_name
  ON api_embeddings(package_name);

CREATE INDEX IF NOT EXISTS idx_api_embeddings_stage
  ON api_embeddings(stage);

-- Function to search API embeddings by package name
CREATE OR REPLACE FUNCTION match_apis_by_package_name(
    query_embedding VECTOR,
    package_name TEXT,
    k INT DEFAULT 5,
    stage_filter deployment_stage DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    package_name TEXT,
    base_url TEXT,
    endpoint_path TEXT,
    http_method TEXT,
    doc_text TEXT,
    stage deployment_stage,
    similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT
      id,
      package_name,
      base_url,
      endpoint_path,
      http_method,
      doc_text,
      stage,
      1 - (embedding <#> query_embedding) AS similarity
    FROM api_embeddings
    WHERE package_name = package_name
      AND (stage_filter IS NULL OR stage = stage_filter)
    ORDER BY embedding <#> query_embedding
    LIMIT k;
$$;

-- Function for global API search
CREATE OR REPLACE FUNCTION match_apis(
    query_embedding VECTOR,
    k INT DEFAULT 5,
    stage_filter deployment_stage DEFAULT NULL,
    api_type TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    package_name TEXT,
    base_url TEXT,
    endpoint_path TEXT,
    http_method TEXT,
    doc_text TEXT,
    stage deployment_stage,
    similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT
      id,
      package_name,
      base_url,
      endpoint_path,
      http_method,
      doc_text,
      stage,
      1 - (embedding <#> query_embedding) AS similarity
    FROM api_embeddings
    WHERE (stage_filter IS NULL OR stage = stage_filter)
    ORDER BY embedding <#> query_embedding
    LIMIT k;
$$;
