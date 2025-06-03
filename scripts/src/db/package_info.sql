-- 1. Table definition for storing package-info.json content
CREATE TABLE IF NOT EXISTS package_infos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_name TEXT NOT NULL UNIQUE,
    package_title TEXT NOT NULL,
    package_path TEXT NOT NULL,
    platform_type TEXT NOT NULL DEFAULT 'communication',
    auth_type TEXT,
    auth_endpoint TEXT,
    webhook_endpoint TEXT,
    oauth2_scopes JSONB,
    description TEXT NOT NULL,
    dependencies JSONB,
    added_dependencies JSONB,
    status TEXT NOT NULL,
    documentation TEXT NOT NULL,
    icon TEXT NOT NULL,
    readme_map JSONB NOT NULL,
    constructors JSONB NOT NULL,
    keys_info JSONB NOT NULL,
    key_instructions JSONB,
    extra_info JSONB NOT NULL,
    raw_content JSONB NOT NULL,
    file_path TEXT NOT NULL,
    github_url TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
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