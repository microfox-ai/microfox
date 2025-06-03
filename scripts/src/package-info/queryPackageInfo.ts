import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PACKAGE_INFO_TABLE = 'package_infos';

async function searchPackages(searchTerm: string) {
  console.log(`🔍 Searching for packages containing: "${searchTerm}"`);
  
  const { data, error } = await supabase
    .from(PACKAGE_INFO_TABLE)
    .select('id, package_name, package_title, description, platform_type, status, auth_type, documentation, icon, updated_at')
    .or(`package_name.ilike.%${searchTerm}%, package_title.ilike.%${searchTerm}%, description.ilike.%${searchTerm}%`)
    .order('package_name');

  if (error) {
    console.error('❌ Error searching packages:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('ℹ️  No packages found');
    return;
  }

  console.log(`\n✅ Found ${data.length} packages:`);
  data.forEach((pkg: any, index: number) => {
    console.log(`\n${index + 1}. ${pkg.package_name}`);
    console.log(`   Title: ${pkg.package_title}`);
    console.log(`   Type: ${pkg.platform_type}`);
    console.log(`   Status: ${pkg.status}`);
    console.log(`   Auth: ${pkg.auth_type || 'none'}`);
    console.log(`   Description: ${pkg.description}`);
    console.log(`   Updated: ${new Date(pkg.updated_at).toLocaleDateString()}`);
  });
}

async function getPackageByName(packageName: string) {
  console.log(`🔍 Getting package details for: "${packageName}"`);
  
  const { data, error } = await supabase
    .from(PACKAGE_INFO_TABLE)
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

  console.log(`\n✅ Package Details:`);
  console.log(`   Name: ${data.package_name}`);
  console.log(`   Title: ${data.package_title}`);
  console.log(`   Path: ${data.package_path}`);
  console.log(`   Type: ${data.platform_type}`);
  console.log(`   Status: ${data.status}`);
  console.log(`   Auth: ${data.auth_type || 'none'}`);
  console.log(`   Description: ${data.description}`);
  console.log(`   Documentation: ${data.documentation}`);
  console.log(`   Dependencies: ${JSON.parse(data.dependencies || '[]').join(', ')}`);
  console.log(`   Constructors: ${JSON.parse(data.constructors).map((c: any) => c.name).join(', ')}`);
  console.log(`   Updated: ${new Date(data.updated_at).toLocaleDateString()}`);
}

async function getPackagesByPlatformType(platformType: string) {
  console.log(`🔍 Getting packages by platform type: "${platformType}"`);
  
  const { data, error } = await supabase
    .from(PACKAGE_INFO_TABLE)
    .select('id, package_name, package_title, description, status, auth_type, documentation, icon, updated_at')
    .eq('platform_type', platformType)
    .order('package_name');

  if (error) {
    console.error('❌ Error getting packages by platform type:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('ℹ️  No packages found for this platform type');
    return;
  }

  console.log(`\n✅ Found ${data.length} ${platformType} packages:`);
  data.forEach((pkg: any, index: number) => {
    console.log(`${index + 1}. ${pkg.package_name} - ${pkg.description}`);
  });
}

async function getPackagesByStatus(status: string) {
  console.log(`🔍 Getting packages by status: "${status}"`);
  
  const { data, error } = await supabase
    .from(PACKAGE_INFO_TABLE)
    .select('id, package_name, package_title, description, platform_type, auth_type, documentation, icon, updated_at')
    .eq('status', status)
    .order('package_name');

  if (error) {
    console.error('❌ Error getting packages by status:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('ℹ️  No packages found for this status');
    return;
  }

  console.log(`\n✅ Found ${data.length} ${status} packages:`);
  data.forEach((pkg: any, index: number) => {
    console.log(`${index + 1}. ${pkg.package_name} (${pkg.platform_type}) - ${pkg.description}`);
  });
}

async function getAllPackages() {
  console.log(`🔍 Getting all packages...`);
  
  const { data, error } = await supabase
    .from(PACKAGE_INFO_TABLE)
    .select('package_name, package_title, platform_type, status, auth_type, updated_at')
    .order('package_name');

  if (error) {
    console.error('❌ Error getting all packages:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('ℹ️  No packages found');
    return;
  }

  console.log(`\n✅ Found ${data.length} total packages:`);
  data.forEach((pkg: any, index: number) => {
    console.log(`${index + 1}. ${pkg.package_name} (${pkg.platform_type}/${pkg.status}) - ${pkg.auth_type || 'none'}`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage:
  npm run query:package-info search <term>     - Search packages by name/title/description
  npm run query:package-info get <name>        - Get specific package details
  npm run query:package-info platform <type>   - Get packages by platform type
  npm run query:package-info status <status>   - Get packages by status
  npm run query:package-info all               - Get all packages

Examples:
  npm run query:package-info search reddit
  npm run query:package-info get "@microfox/reddit"
  npm run query:package-info platform communication
  npm run query:package-info status stable
  npm run query:package-info all
    `);
    return;
  }

  const command = args[0];
  const value = args[1];

  switch (command) {
    case 'search':
      if (!value) {
        console.error('❌ Please provide a search term');
        return;
      }
      await searchPackages(value);
      break;
    case 'get':
      if (!value) {
        console.error('❌ Please provide a package name');
        return;
      }
      await getPackageByName(value);
      break;
    case 'platform':
      if (!value) {
        console.error('❌ Please provide a platform type');
        return;
      }
      await getPackagesByPlatformType(value);
      break;
    case 'status':
      if (!value) {
        console.error('❌ Please provide a status');
        return;
      }
      await getPackagesByStatus(value);
      break;
    case 'all':
      await getAllPackages();
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      break;
  }
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
}); 