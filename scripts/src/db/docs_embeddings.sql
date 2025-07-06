-- 1. Ensure the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Table definition (idempotent)
CREATE TABLE IF NOT EXISTS docs_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_name TEXT NOT NULL,
    function_name TEXT,
    doc_type TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    linked_packages TEXT[],
    doc_priority TEXT DEFAULT 'medium', -- low, medium, high
    content TEXT NOT NULL,
    embedding vector(768),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_docs_embeddings_embedding 
  ON docs_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_docs_embeddings_doc_type
  ON docs_embeddings(doc_type);

CREATE INDEX IF NOT EXISTS idx_docs_embeddings_package_doc_type
  ON docs_embeddings(package_name, doc_type);

-- 4. Drop old functions
DROP FUNCTION IF EXISTS match_docs_in_package(vector, text, int, text);
DROP FUNCTION IF EXISTS match_docs(vector, int, text);
DROP FUNCTION IF EXISTS match_docs_in_packages(vector, text[], int, text);

-- 5. Package-scoped search using cosine distance (<#>), similarity = 1 − distance
CREATE OR REPLACE FUNCTION match_docs_in_package(
    query_embedding vector,
    pkg_name TEXT,
    k INT DEFAULT 5,
    doc_type_filter TEXT DEFAULT NULL,
    doc_priority TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    package_name TEXT,
    function_name TEXT,
    doc_type TEXT,
    doc_priority TEXT,
    file_path TEXT,
    linked_packages TEXT[],
    content TEXT,
    similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT
      id,
      package_name,
      function_name,
      doc_type,
      doc_priority,
      file_path,
      linked_packages,
      content,
      1 - (embedding <#> query_embedding) AS similarity
    FROM docs_embeddings
    WHERE package_name = pkg_name
      AND (doc_type_filter IS NULL OR doc_type = doc_type_filter)
      AND (doc_priority IS NULL OR doc_priority = doc_priority)
    ORDER BY embedding <#> query_embedding
    LIMIT k;
$$;

-- Multi-package search
CREATE OR REPLACE FUNCTION match_docs_in_packages(
    query_embedding vector,
    pkg_names TEXT[],
    k INT DEFAULT 5,
    doc_type_filter TEXT DEFAULT NULL,
    doc_priority TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    package_name TEXT,
    function_name TEXT,
    doc_type TEXT,
    doc_priority TEXT,
    file_path TEXT,
    linked_packages TEXT[],
    content TEXT,
    similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT
      id,
      package_name,
      function_name,
      doc_type,
      doc_priority,
      file_path,
      linked_packages,
      content,
      1 - (embedding <#> query_embedding) AS similarity
    FROM docs_embeddings
    WHERE package_name = ANY(pkg_names)
      AND (doc_type_filter IS NULL OR doc_type = doc_type_filter)
      AND (doc_priority IS NULL OR doc_priority = doc_priority)
    ORDER BY embedding <#> query_embedding
    LIMIT k;
$$;

-- 6. Global search using cosine distance (<#>), similarity = 1 − distance
CREATE OR REPLACE FUNCTION match_docs(
    query_embedding vector,
    k INT DEFAULT 5,
    doc_type_filter TEXT DEFAULT NULL,
    doc_priority TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    package_name TEXT,
    function_name TEXT,
    doc_type TEXT,
    doc_priority TEXT,
    file_path TEXT,
    linked_packages TEXT[],
    content TEXT,
    similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
    SELECT
      id,
      package_name,
      function_name,
      doc_type,
      doc_priority,
      file_path,
      linked_packages,
      content,
      1 - (embedding <#> query_embedding) AS similarity
    FROM docs_embeddings
    WHERE (doc_type_filter IS NULL OR doc_type = doc_type_filter)
      AND (doc_priority IS NULL OR doc_priority = doc_priority)
    ORDER BY embedding <#> query_embedding
    LIMIT k;
$$;