import { createClient } from '@supabase/supabase-js';
import { RagUpstashSdk } from '@microfox/rag-upstash';
import { FilterHelpers } from '@microfox/rag-upstash';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TABLE = 'api_embeddings';

// Initialize RAG client - uses environment variables UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN
const ragClient = new RagUpstashSdk({
  upstashUrl: process.env.MICROFOX_UPSTASH_VECTOR_REST_URL || "",
  upstashToken: process.env.MICROFOX_UPSTASH_VECTOR_REST_TOKEN || "",
});

// Debug RAG client configuration
console.log('RAG Client Config:', {
  upstashUrl: process.env.MICROFOX_UPSTASH_VECTOR_REST_URL ? 'SET' : 'NOT SET',
  upstashToken: process.env.MICROFOX_UPSTASH_VECTOR_REST_TOKEN ? 'SET' : 'NOT SET'
});

interface ApiSearchResult {
  id: string;
  package_name: string;
  base_url: string;
  endpoint_path?: string;
  http_method?: string;
  doc_text: string;
  stage: string;
  api_type: string;
  metadata: any;
  similarity: number;
  created_at: string;
  updated_at: string;
}

/**
 * Search APIs using Upstash RAG and fetch full data from Supabase
 * @param {string} query - Search query
 * @param {string} packageName - Package name (optional)
 * @param {string} stage - Stage filter (optional)
 * @param {number} limit - Number of results
 * @param {string} apiType - API type filter
 * @returns {Promise<ApiSearchResult[]>} - Search results
 */
async function searchApisWithUpstash(
  query: string,
  packageName?: string,
  stage: string | null = null,
  limit: number = 10,
  apiType: string = 'package-sls'
): Promise<ApiSearchResult[]> {
  try {
    console.log(`Searching APIs with query: "${query}"`);
    console.log(`Filters: package_name=${packageName}, api_type=${apiType}, stage=${stage}`);

    // Build filter for Upstash RAG
    const filterBuilder = FilterHelpers;
    let filter: any = filterBuilder.and(
      filterBuilder.eq('api_type', apiType)
    );

    if (stage && stage !== '*') {
      filter = filterBuilder.and(
        filter,
        filterBuilder.eq('stage', stage)
      );
    }

    const results: ApiSearchResult[] = [];

    // 1. Search in global endpoints namespace
    const endpointNamespace = 'api-embeddings';
    console.log(`Searching endpoints in namespace: ${endpointNamespace}`);

    let endpointFilter = filter;
    if (packageName) {
      endpointFilter = filterBuilder.and(filter, filterBuilder.eq('package_name', packageName));
    }

    const endpointResults = await ragClient.queryDocsFromRAG({
      data: query,
      topK: limit,
      filter: endpointFilter,
      includeData: false,
      includeMetadata: true
    }, endpointNamespace);

    // Fetch full data from Supabase
    for (const ragResult of endpointResults) {
      if (ragResult.metadata?.supabase_id) {
        const { data: supabaseData, error } = await supabase
          .from('api_embeddings')
          .select('*')
          .eq('id', ragResult.metadata.supabase_id)
          .single();

        if (!error && supabaseData) {
          results.push({
            ...supabaseData,
            similarity: (ragResult as any).score || (ragResult as any).similarity || 0
          });
        }
      }
    }

    // 2. Search in global MCP namespace
    console.log('Searching MCP data in namespace: api-mcps');
    const mcpResults = await ragClient.queryDocsFromRAG({
      data: query,
      topK: limit,
      filter: filter,
      includeData: false,
      includeMetadata: true
    }, 'api-mcps');

    // Fetch full MCP data from Supabase
    for (const ragResult of mcpResults) {
      if (ragResult.metadata?.supabase_id) {
        const { data: supabaseData, error } = await supabase
          .from('api_mcps')
          .select('*')
          .eq('id', ragResult.metadata.supabase_id)
          .single();

        if (!error && supabaseData) {
          results.push({
            ...supabaseData,
            similarity: (ragResult as any).score || (ragResult as any).similarity || 0
          });
        }
      }
    }

    // Sort by similarity and limit results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

  } catch (error) {
    console.error('Error searching APIs with Upstash:', error);
    throw error;
  }
}

/**
 * List APIs by project ID
 */
async function listByPackage(packageName: string, stage: string | null = null, limit = 10) {
  const query = supabase
    .from(TABLE)
    .select('package_name,base_url,endpoint_path,http_method,stage,api_type,updated_at')
    .eq('package_name', packageName)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (stage && stage !== '*') {
    query.eq('stage', stage);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n📦 APIs in package "${packageName}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    data!.map((r: any) => ({
      package_name: r.package_name,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      api_type: r.api_type,
    }))
  );
}

/**
 * List all public APIs
 */
async function listPackageSlsApis(stage: string | null = null, limit = 10, apiType: string = 'package-sls') {
  const query = supabase
    .from(TABLE)
    .select('package_name,base_url,endpoint_path,http_method,stage,api_type,updated_at')
    .eq('api_type', apiType)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (stage && stage !== '*') {
    query.eq('stage', stage);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n🌍 APIs of type "${apiType}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    data!.map((r: any) => ({
      package_name: r.package_name,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      api_type: r.api_type,
    }))
  );
}

/**
 * List all APIs in the system, regardless of project or visibility
 */
async function listAllApis(stage: string | null = null, limit = 10) {
  const query = supabase
    .from(TABLE)
    .select('package_name,base_url,endpoint_path,http_method,stage,api_type,updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (stage && stage !== '*') {
    query.eq('stage', stage);
  }

  const { data, error } = await query;
  if (error) throw error;

  console.log(`\n🌍 All APIs${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    data!.map((r: any) => ({
      package_name: r.package_name,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      api_type: r.api_type,
    }))
  );
}

/**
 * Perform semantic search on APIs by project
 */
async function searchByPackage(packageName: string, query: string, stage: string | null = null, limit = 10) {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  console.log('🧠 Query embedding obtained');

  console.log(`📦 Package API search in "${packageName}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const results = await searchApisWithUpstash(query, packageName, stage, limit);

  console.log(`\n🎯 Top ${limit} package results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    results.map(r => ({
      package_name: r.package_name,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      api_type: r.api_type,
      similarity: r.similarity,
    }))
  );
}

/**
 * Perform semantic search on public APIs
 */
async function searchPackageSlsApis(query: string, stage: string | null = null, limit = 10, apiType: string = 'package-sls') {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  console.log('🧠 Query embedding obtained');

  console.log(`🌍 API search for type "${apiType}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const results = await searchApisWithUpstash(query, undefined, stage, limit, apiType);

  console.log(`\n🎯 Top ${limit} package results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    results.map(r => ({
      package_name: r.package_name,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      api_type: r.api_type,
      similarity: r.similarity,
    }))
  );
}

/**
 * Perform semantic search on all APIs
 */
async function searchAllApis(query: string, stage: string | null = null, limit = 10) {
  console.log(`\n🔍 Embedding query: "${query}"…`);
  console.log('🧠 Query embedding obtained');

  console.log(`🌍 Global API search${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const results = await searchApisWithUpstash(query, undefined, stage, limit);

  console.log(`\n🎯 Top ${limit} global results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    results.map(r => ({
      package_name: r.package_name,
      base_url: r.base_url,
      endpoint_path: r.endpoint_path,
      http_method: r.http_method,
      stage: r.stage,
      api_type: r.api_type,
      similarity: r.similarity,
    }))
  );
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2);

  // Get action (the only required argument)
  if (args.length === 0) {
    showUsage();
    process.exit(1);
  }

  const action = args[0].toLowerCase();

  // The next arguments depend on the action
  switch (action) {
    case 'package': {
      // package <packageName> [stage] ["query"]
      const packageName = args[1];
      if (!packageName) {
        console.error('❌ Missing package name');
        showUsage();
        process.exit(1);
      }

      let stage: string | null = null;
      let query: string | null = null;

      // Check if the next arg is a stage or a query
      if (args[2] && !args[2].startsWith('"') && !args[2].startsWith("'")) {
        stage = args[2];
        query = args[3];
      } else {
        query = args[2];
      }

      if (query) {
        await searchByPackage(packageName, query, stage);
      } else {
        await listByPackage(packageName, stage);
      }
      break;
    }

    case 'type': {
      // type [stage] ["query"]
      let stage: string | null = null;
      let query: string | null = null;

      // Check if the next arg is a stage or a query
      if (args[1] && !args[1].startsWith('"') && !args[1].startsWith("'")) {
        stage = args[1];
        query = args[2];
      } else {
        query = args[1];
      }

      if (query) {
        await searchPackageSlsApis(query, stage);
      } else {
        await listPackageSlsApis(stage);
      }
      break;
    }

    case 'all': {
      // all [stage] ["query"]
      let stage: string | null = null;
      let query: string | null = null;

      // Check if the next arg is a stage or a query
      if (args[1] && !args[1].startsWith('"') && !args[1].startsWith("'")) {
        stage = args[1];
        query = args[2];
      } else {
        query = args[1];
      }

      if (query) {
        await searchAllApis(query, stage);
      } else {
        await listAllApis(stage);
      }
      break;
    }

    default:
      console.error(`❌ Unknown action: ${action}`);
      showUsage();
      process.exit(1);
  }

  console.log('\n✅ Done');
}

function showUsage() {
  console.error(
    '❌ Usage:\n' +
    ' 1) Package APIs:         ts-node queryApis.ts package <packageName> [stage] ["query"]\n' +
    ' 2) Type APIs:            ts-node queryApis.ts type [stage] ["query"]\n' +
    ' 3) All APIs:             ts-node queryApis.ts all [stage] ["query"]\n' +
    '\nExamples:\n' +
    ' - List package APIs:     ts-node queryApis.ts package my-chatbot\n' +
    ' - All stages explicitly: ts-node queryApis.ts package my-chatbot "*"\n' +
    ' - Search package APIs:   ts-node queryApis.ts package my-chatbot "send message"\n' +
    ' - With specific stage:   ts-node queryApis.ts package my-chatbot PROD "send message"\n' +
    ' - List type APIs:         ts-node queryApis.ts type\n' +
    ' - Search all APIs:       ts-node queryApis.ts all "user authentication"'
  );
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
}); 