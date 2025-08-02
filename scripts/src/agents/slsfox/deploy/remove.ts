import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { STAGE } from './constants';
import { createClient } from '@supabase/supabase-js';
import { RagUpstashSdk } from '@microfox/rag-upstash';

// Initialize RAG client - uses environment variables UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN
const ragClient = new RagUpstashSdk({
  upstashUrl: process.env.MICROFOX_UPSTASH_VECTOR_REST_URL || "",
  upstashToken: process.env.MICROFOX_UPSTASH_VECTOR_REST_TOKEN || "",
});
/**
 * Remove a Serverless function
 * @param {string} packagePath - Directory of the package
 * @returns {Promise<boolean>} - Success status
 */
async function removePackageSls(packagePath: string): Promise<boolean> {
  try {
    const slsPath = path.join(packagePath, 'sls');
    const serverlessYmlPath = path.join(slsPath, 'serverless.yml');
    if (!fs.existsSync(serverlessYmlPath)) {
      console.error(`serverless.yml not found for ${packagePath}`);
      return false;
    }

    const packageName = path.basename(packagePath);
    console.log(`Removing ${packageName}`);

    // Change to function directory
    process.chdir(slsPath);

    // Remove using serverless framework
    const removeCommand = `serverless remove --stage ${STAGE}`;
    console.log('Running command:', removeCommand);

    execSync(removeCommand, { stdio: 'inherit' });
    console.log('Function removed successfully');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Remove from Supabase database
    const { data, error } = await supabase
      .from('api_mcps')
      .delete()
      .eq('package_name', packageName);

    console.log('Function deleted successfully from database');

    // Clean up Upstash RAG data
    try {
      console.log(`Cleaning up Upstash RAG data for ${packageName}...`);
      
      // 1. Delete package endpoints from global namespace
      console.log(`Deleting endpoints for package: ${packageName} from global namespace`);
      
      // Get all endpoints for this package from Supabase
      const { data: packageEndpoints, error: fetchError } = await supabase
        .from('api_embeddings')
        .select('id')
        .eq('package_name', packageName);
      
      if (!fetchError && packageEndpoints && packageEndpoints.length > 0) {
        const endpointIds = packageEndpoints.map(ep => ep.id);
        console.log(`Deleting ${endpointIds.length} endpoints from api-embeddings namespace`);
        
        for (const endpointId of endpointIds) {
          try {
            await ragClient.deleteDocFromRAG(endpointId, 'api-embeddings');
          } catch (deleteError) {
            console.error(`Error deleting endpoint ${endpointId}:`, deleteError);
          }
        }
      }
      
      // 2. Delete MCP data from global namespace
      const mcpId = `mcp-${packageName}`;
      console.log(`Deleting MCP data: ${mcpId}`);
      await ragClient.deleteDocFromRAG(mcpId, 'api-mcps');
      
      console.log(`Successfully cleaned up Upstash RAG data for ${packageName}`);
    } catch (ragError) {
      console.error(`Error cleaning up Upstash RAG data for ${packageName}:`, ragError);
      // Don't fail the removal if RAG cleanup fails
    }

    return true;
  } catch (error) {
    console.error(`Error removing sls function for package ${path.basename(packagePath)}:`, error);
    return false;
  }
}

export default removePackageSls; 