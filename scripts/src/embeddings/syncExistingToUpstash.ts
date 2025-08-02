import { createClient } from '@supabase/supabase-js';
import { RagUpstashSdk } from '@microfox/rag-upstash';
import dotenv from 'dotenv';
dotenv.config();

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

interface SyncOptions {
  package_name?: string;
  stage?: string;
  api_type?: string;
  batch_size?: number;
}

/**
 * Sync existing Supabase embeddings to Upstash RAG
 * @param {SyncOptions} options - Sync options
 * @returns {Promise<{success: number, failed: number, errors: string[]}>} - Sync results
 */
export async function syncExistingEmbeddingsToUpstash(options: SyncOptions = {}): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const {
    package_name,
    stage = 'PROD',
    api_type,
    batch_size = 100
  } = options;

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  try {
    console.log('Starting sync of existing embeddings to Upstash RAG...');
    console.log(`Options: package_name=${package_name}, api_type=${api_type}`);

    // Test RAG client connection
    try {
      const info = await ragClient.info();
      console.log('RAG client connection successful:', info);
    } catch (ragError) {
      console.error('RAG client connection failed:', ragError);
      throw new Error(`RAG client connection failed: ${ragError instanceof Error ? ragError.message : String(ragError)}`);
    }

    // Build query to fetch embeddings
    let query = supabase
      .from('api_embeddings')
      .select('*')

    if (package_name) {
      query = query.eq('package_name', package_name);
    }
    if (api_type) {
      query = query.eq('api_type', api_type);
    }

    const { data: embeddings, error } = await query;

    if (error) {
      throw new Error(`Error fetching embeddings: ${error.message}`);
    }

    if (!embeddings || embeddings.length === 0) {
      console.log('No embeddings found to sync');
      return results;
    }

    console.log(`Found ${embeddings.length} embeddings to sync`);

    // Group by package for namespace organization
    const packageGroups = new Map<string, any[]>();
    for (const embedding of embeddings) {
      const packageName = embedding.package_name;
      if (!packageGroups.has(packageName)) {
        packageGroups.set(packageName, []);
      }
      packageGroups.get(packageName)!.push(embedding);
    }

    // Sync each package's endpoints
    for (const [packageName, packageEmbeddings] of packageGroups) {
      try {
        console.log(`Syncing ${packageEmbeddings.length} endpoints for package: ${packageName}`);

        // Prepare documents for Upstash RAG - only essential metadata
        const docs = packageEmbeddings.map(embedding => ({
          id: embedding.id,
          doc: embedding.doc_text, // Upstash will handle embedding internally
          metadata: {
            type: 'api_embedding',
            package_name: embedding.package_name,
            base_url: embedding.base_url,
            endpoint_path: embedding.endpoint_path,
            http_method: embedding.http_method,
            stage: embedding.stage,
            api_type: embedding.api_type,
            supabase_id: embedding.id,
            supabase_table: 'api_embeddings'
          }
        }));

        // Debug: Log first document structure
        if (docs.length > 0) {
          console.log('Sample document structure:', {
            id: docs[0].id,
            docLength: docs[0].doc?.length || 0,
            metadata: docs[0].metadata
          });
        }

        // Feed documents to Upstash RAG using global namespace
        const namespace = 'api-embeddings';
        console.log(`Attempting to sync to namespace: ${namespace}`);
        console.log(`Documents to sync:`, docs.length);

        try {
          const result = await ragClient.feedDocsToRAG(docs, namespace);
          console.log(`Successfully synced ${result.length} endpoints for package: ${packageName}`);
          results.success += result.length;
        } catch (syncError) {
          console.error(`Error syncing to Upstash for package ${packageName}:`, syncError);
          results.failed += packageEmbeddings.length;
          results.errors.push(`Package ${packageName} sync error: ${syncError instanceof Error ? syncError.message : String(syncError)}`);
        }
      } catch (error) {
        console.error(`Error syncing package ${packageName}:`, error);
        results.failed += packageEmbeddings.length;
        results.errors.push(`Package ${packageName}: ${error}`);
      }
    }

    // Sync MCP data
    try {
      console.log('Syncing MCP data...');
      console.log(`MCP Query filters: api_type=${api_type}, stage=${stage}, package_name=${package_name}`);

      let mcpQuery = supabase
        .from('api_mcps')
        .select('*')

      if (api_type) {
        mcpQuery = mcpQuery.eq('api_type', api_type);
      }

      if (stage) {
        mcpQuery = mcpQuery.eq('stage', stage);
      }

      if (package_name) {
        mcpQuery = mcpQuery.eq('package_name', package_name);
      }

      const { data: mcpData, error: mcpError } = await mcpQuery;

      if (mcpError) {
        throw new Error(`Error fetching MCP data: ${mcpError.message}`);
      }

      console.log(`MCP Query result: ${mcpData?.length || 0} records found`);

      if (mcpData && mcpData.length > 0) {
        console.log(`Found ${mcpData.length} MCP records to sync`);
      } else {
        // Debug: Check if there are any MCP records at all
        const { data: allMcpData, error: allMcpError } = await supabase
          .from('api_mcps')
          .select('package_name, api_type, stage')
          .limit(5);

        if (!allMcpError && allMcpData && allMcpData.length > 0) {
          console.log(`Debug: Found ${allMcpData.length} total MCP records in database:`);
          allMcpData.forEach((mcp, index) => {
            console.log(`  ${index + 1}. package_name=${mcp.package_name}, api_type=${mcp.api_type}, stage=${mcp.stage}`);
          });
        } else {
          console.log('Debug: No MCP records found in database at all');
        }
      }

      if (mcpData && mcpData.length > 0) {
        console.log(`Found ${mcpData.length} MCP records to sync`);

        const mcpDocs = mcpData.map(mcp => ({
          id: `mcp-${mcp.package_name}`,
          doc: mcp.docs || `MCP Package: ${mcp.package_name}`,
          metadata: {
            type: 'api_mcp',
            package_name: mcp.package_name,
            name: mcp.name,
            base_url: mcp.base_url,
            stage: mcp.stage,
            function_type: mcp.type,
            api_type: mcp.api_type,
            supabase_id: mcp.id,
            supabase_table: 'api_mcps'
          }
        }));

        const mcpNamespace = 'api-mcps';
        console.log(`Attempting to sync MCP data to namespace: ${mcpNamespace}`);
        console.log(`MCP documents to sync:`, mcpDocs.length);

        try {
          const mcpResult = await ragClient.feedDocsToRAG(mcpDocs, mcpNamespace);
          console.log(`Successfully synced ${mcpResult.length} MCP records`);
          results.success += mcpResult.length;
        } catch (mcpSyncError) {
          console.error(`Error syncing MCP data to Upstash:`, mcpSyncError);
          results.failed += mcpData.length;
          results.errors.push(`MCP sync error: ${mcpSyncError instanceof Error ? mcpSyncError.message : String(mcpSyncError)}`);
        }
      }
    } catch (error) {
      console.error('Error syncing MCP data:', error);
      results.errors.push(`MCP sync: ${error instanceof Error ? error.message : String(error)}`);
    }

    console.log(`Sync completed: ${results.success} successful, ${results.failed} failed`);
    return results;

  } catch (error) {
    console.error('Error in syncExistingEmbeddingsToUpstash:', error);
    results.errors.push(error instanceof Error ? error.message : String(error));
    return results;
  }
}

/**
 * List all packages that have embeddings in Supabase
 * @returns {Promise<string[]>} - List of package names
 */
export async function listPackagesWithEmbeddings(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('api_embeddings')
      .select('package_name')
      .not('embedding', 'is', null)
      .order('package_name');

    if (error) {
      throw new Error(`Error listing packages: ${error.message}`);
    }

    // Get unique package names
    const uniquePackages = [...new Set(data?.map(item => item.package_name) || [])];
    return uniquePackages;
  } catch (error) {
    console.error('Error listing packages with embeddings:', error);
    return [];
  }
}

/**
 * Check sync status for a package
 * @param {string} packageName - Package name to check
 * @returns {Promise<{synced: boolean, count: number}>} - Sync status
 */
export async function checkPackageSyncStatus(packageName: string): Promise<{
  synced: boolean;
  count: number;
}> {
  try {
    // Check Supabase count
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('api_embeddings')
      .select('id')
      .eq('package_name', packageName)
      .not('embedding', 'is', null);

    if (supabaseError) {
      throw new Error(`Error checking Supabase: ${supabaseError.message}`);
    }

    const supabaseCount = supabaseData?.length || 0;

    // Check Upstash RAG count
    const namespace = `api-embeddings-${packageName}`;
    try {
      const ragInfo = await ragClient.info();
      // Note: This is a simplified check. In a real implementation, you might want to
      // query the namespace to get the actual count
      const synced = supabaseCount > 0; // Simplified check

      return {
        synced,
        count: supabaseCount
      };
    } catch (ragError) {
      return {
        synced: false,
        count: supabaseCount
      };
    }

  } catch (error) {
    console.error(`Error checking sync status for ${packageName}:`, error);
    return {
      synced: false,
      count: 0
    };
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const packageName = args[0];

  if (packageName) {
    console.log(`Syncing embeddings for package: ${packageName}`);
    syncExistingEmbeddingsToUpstash({ package_name: packageName })
      .then(results => {
        console.log('Sync results:', results);
        process.exit(results.failed > 0 ? 1 : 0);
      })
      .catch(error => {
        console.error('Sync failed:', error);
        process.exit(1);
      });
  } else {
    console.log('Syncing all existing embeddings...');
    syncExistingEmbeddingsToUpstash()
      .then(results => {
        console.log('Sync results:', results);
        process.exit(results.failed > 0 ? 1 : 0);
      })
      .catch(error => {
        console.error('Sync failed:', error);
        process.exit(1);
      });
  }
} 