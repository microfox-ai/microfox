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
    added_dependencies JSON,
    status TEXT,
    documentation TEXT,
    icon TEXT,
    readme_map JSON,
    constructors JSON,
    keys_info JSON,
    key_instructions JSON,
    extra_info JSON,
    raw_content JSON,
    file_path TEXT,
    github_url TEXT,
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