-- 1. Table definition for storing package-info.json content
CREATE TABLE IF NOT EXISTS package_infos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_name TEXT NOT NULL UNIQUE,
    package_title TEXT,
    package_path TEXT,
    platform_type TEXT DEFAULT 'communication',
    auth_type TEXT,
    auth_endpoint TEXT,
    webhook_endpoint TEXT,
    oauth2_scopes JSON,
    description TEXT,
    dependencies JSON,
    added_dependencies TEXT[],
    status TEXT,
    documentation TEXT,
    icon TEXT,
    constructors JSON,
    keys_info JSON,
    key_instructions JSON,
    extra_info JSON,
    raw_content JSON,
    raw_manifest JSON,
    file_path TEXT,
    github_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    embedding vector(768)
);

-- 2. Indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_package_infos_package_name
  ON package_infos(package_name);

CREATE INDEX IF NOT EXISTS idx_package_infos_platform_type
  ON package_infos(platform_type);

CREATE INDEX IF NOT EXISTS idx_package_infos_status
  ON package_infos(status);

CREATE INDEX IF NOT EXISTS idx_package_infos_auth_type
  ON package_infos(auth_type);

CREATE INDEX IF NOT EXISTS idx_package_infos_updated_at
  ON package_infos(updated_at);

CREATE INDEX IF NOT EXISTS idx_package_infos_embedding
  ON package_infos USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- 3. RPC function for searching packages
CREATE OR REPLACE FUNCTION match_package_infos (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  package_name TEXT,
  package_title TEXT,
  description TEXT,
  constructors JSON,
  added_dependencies TEXT[],
  status TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    p.id,
    p.package_name,
    p.package_title,
    p.description,
    p.constructors,
    p.added_dependencies,
    p.status,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM
    package_infos AS p
  WHERE
    1 - (p.embedding <=> query_embedding) > match_threshold
  ORDER BY
    similarity DESC
  LIMIT match_count;
$$; 