import { createClient } from '@supabase/supabase-js';
import { embed } from './geminiEmbed';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const TABLE = 'api_embeddings';

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
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  console.log(`📦 Package API search in "${packageName}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const { data, error } = await supabase.rpc('match_apis_by_package_name', {
    query_embedding: qEmb,
    package_name: packageName,
    k: limit,
    stage_filter: stage === '*' ? null : stage,
  });
  if (error) throw error;

  console.log(`\n🎯 Top ${limit} package results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    (data as any[]).map(r => ({
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
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  console.log(`🌍 API search for type "${apiType}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const { data, error } = await supabase.rpc('match_apis', {
    query_embedding: qEmb,
    k: limit,
    stage_filter: stage === '*' ? null : stage,
    api_type: apiType,
  });
  if (error) throw error;

  console.log(`\n🎯 Top ${limit} package results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    (data as any[]).map(r => ({
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
  const qEmb = await embed(query);
  console.log('🧠 Query embedding obtained');

  console.log(`🌍 Global API search${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}…`);

  const { data, error } = await supabase.rpc('match_apis', {
    query_embedding: qEmb,
    k: limit,
    stage_filter: stage === '*' ? null : stage,
    api_type: null,
  });
  if (error) throw error;

  console.log(`\n🎯 Top ${limit} global results for "${query}"${stage ? (stage === '*' ? ' (all stages)' : ` with stage "${stage}"`) : ''}:`);
  console.table(
    (data as any[]).map(r => ({
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