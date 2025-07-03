import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { embed } from '../embeddings/geminiEmbed.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL or key not set');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MATCH_THRESHOLD = 0.7;
const MATCH_COUNT = 10;
const TABLE_NAME = 'package_infos';
const RPC_FUNCTION_NAME = 'match_package_infos';

export async function findSimilarPackages(
  query: string,
  match_threshold: number = MATCH_THRESHOLD,
  match_count: number = MATCH_COUNT,
) {
  try {
    const embedding = await embed(query);

    const { data: packages, error } = await supabase.rpc(RPC_FUNCTION_NAME, {
      query_embedding: embedding,
      match_threshold: match_threshold,
      match_count: match_count,
    });

    if (error) {
      console.error('Error querying Supabase:', error);
      throw new Error(`Error finding similar packages: ${error.message}`);
    }

    if (!packages || packages.length === 0) {
      console.log('No similar packages found.');
      return [];
    }

    const packagesWithFunctionalities = packages.map((pkg: any) => {
      const functionalities =
        pkg.constructors?.flatMap((c: any) => c.functionalities || []) || [];
      return {
        ...pkg,
        functionalities,
      };
    });

    return packagesWithFunctionalities;
  } catch (err) {
    console.error('An unexpected error occurred:', err);
    throw err;
  }
}

export async function searchPackages(searchTerm: string) {
  console.log(`🔍 Searching for packages containing: "${searchTerm}"`);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id, package_name, package_title, description, platform_type, status, auth_type, documentation, icon, updated_at')
    .or(`package_name.ilike.%${searchTerm}%,package_title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('package_name');

  if (error) {
    console.error('❌ Error searching packages:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('ℹ️  No packages found');
    return;
  }

  return data;
}

export async function getPackageByName(packageName: string) {
  console.log(`🔍 Getting package details for: "${packageName}"`);
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('package_name', packageName)
    .single();

  if (error) {
    console.error('❌ Error getting package:', error);
    return;
  }

  if (!data) {
    console.log('ℹ️  Package not found');
    return;
  }

  return data;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage:
  ts-node scripts/src/package-info/queryPackageInfo.ts <command> <value>

Commands:
  similar <query>      - Find packages with similar descriptions.
  search <term>        - Search packages by name, title, or description.
  get <name>           - Get specific package details by exact name.
`);
    return;
  }

  const command = args[0];
  const value = args.slice(1).join(' ');

  if (!value) {
    console.error('❌ Please provide a value for the command.');
    return;
  }

  console.log(`Running command: "${command}" with value: "${value}"`);

  try {
    let results;
    switch (command) {
      case 'similar':
        results = await findSimilarPackages(value);
        console.log('Found similar packages:', results);
        break;
      case 'search':
        results = await searchPackages(value);
        console.log('Found packages:', results);
        break;
      case 'get':
        results = await getPackageByName(value);
        console.log('Found package:', results);
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        return;
    }
  } catch (error) {
    console.error(`Failed to execute command "${command}":`, error);
  }
}

if (require.main === module) {
  main().catch(console.error);
} 