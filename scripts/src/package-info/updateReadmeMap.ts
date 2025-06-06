import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PackageInfo } from '../types';

const PACKAGES_DIR = path.resolve(process.cwd(), '..', 'packages');
const GITHUB_BASE_URL = 'https://github.com/microfox-ai/microfox/blob/main/packages/';

interface ReadmeInfo {
  path: string;
  type: 'main' | 'constructor' | 'functionality';
  extension: 'md' | 'txt' | 'html';
  functionality?: string;
  description?: string;
}

/**
 * Get changed files from git since last commit or from staging area
 */
function getChangedFiles(): string[] {
  try {
    // Get both staged and unstaged changes
    const output = execSync('git diff --name-only HEAD', { encoding: 'utf-8' });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.warn('Could not get git diff, scanning all packages');
    return [];
  }
}

/**
 * Get list of packages that have docs changes
 */
function getPackagesWithDocsChanges(): string[] {
  const changedFiles = getChangedFiles();
  const packagesWithChanges = new Set<string>();

  // If no git changes detected, scan all packages
  if (changedFiles.length === 0) {
    return fs.readdirSync(PACKAGES_DIR).filter(pkg => {
      const pkgDir = path.join(PACKAGES_DIR, pkg);
      const docsDir = path.join(pkgDir, 'docs');
      return fs.existsSync(docsDir) && fs.statSync(pkgDir).isDirectory();
    });
  }

  // Find packages with docs changes
  changedFiles.forEach(file => {
    const match = file.match(/^packages\/([^/]+)\/docs\/(.+\.md)$/);
    if (match) {
      packagesWithChanges.add(match[1]);
    }
  });

  return Array.from(packagesWithChanges);
}

/**
 * Scan docs directory and generate readme info
 */
function scanDocsDirectory(packageName: string, docsDir: string): ReadmeInfo[] {
  const readmeInfos: ReadmeInfo[] = [];
  
  if (!fs.existsSync(docsDir)) {
    return readmeInfos;
  }

  const mdFiles = fs.readdirSync(docsDir)
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .sort();

  for (const file of mdFiles) {
    const filePath = path.join(docsDir, file);
    const functionality = path.basename(file, '.md');
    
    // Try to extract description from the file content
    let description = `Documentation for ${functionality}`;
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      // Look for first paragraph or description
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#') && !line.startsWith('```') && line.length > 20) {
          description = line;
          break;
        }
      }
    } catch (error) {
      console.warn(`Could not read ${filePath} for description`);
    }

    // Determine type based on common patterns
    let type: 'main' | 'constructor' | 'functionality' = 'functionality';
    if (functionality.toLowerCase().includes('create') || 
        functionality.toLowerCase().includes('init') ||
        functionality.toLowerCase().includes('sdk')) {
      type = 'constructor';
    }

    const githubPath = `${GITHUB_BASE_URL}${packageName}/docs/${file}`;

    readmeInfos.push({
      path: githubPath,
      type,
      extension: 'md',
      functionality,
      description
    });
  }

  return readmeInfos;
}

/**
 * Update package-info.json for a specific package
 */
function updateReadmeMap(packageName: string): boolean {
  const pkgDir = path.join(PACKAGES_DIR, packageName);
  const packageInfoPath = path.join(pkgDir, 'package-info.json');
  const docsDir = path.join(pkgDir, 'docs');

  if (!fs.existsSync(packageInfoPath)) {
    console.warn(`⚠️ No package-info.json found for ${packageName}`);
    return false;
  }

  try {
    const packageInfo: PackageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf-8'));
    
    // Scan current docs directory
    const currentReadmeInfos = scanDocsDirectory(packageName, docsDir);
    
    // Initialize readme_map if it doesn't exist
    if (!packageInfo.readme_map) {
      packageInfo.readme_map = {
        description: `The full README for the ${packageInfo.title || packageName}`,
        path: `${GITHUB_BASE_URL}${packageName}/README.md`,
        functionalities: [],
        all_readmes: []
      };
    }

    // Update functionalities list and all_readmes
    packageInfo.readme_map.functionalities = currentReadmeInfos.map(info => info.functionality!);
    packageInfo.readme_map.all_readmes = currentReadmeInfos;

    // Write updated package-info.json
    fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2) + '\n');
    
    console.log(`✅ Updated package-info.json for ${packageName} (${currentReadmeInfos.length} docs)`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating package-info.json for ${packageName}:`, error);
    return false;
  }
}

/**
 * Main function to update readme maps for all packages with docs changes
 */
async function main() {
  console.log('🔍 Scanning for packages with docs changes...');
  
  const packagesWithChanges = getPackagesWithDocsChanges();
  
  if (packagesWithChanges.length === 0) {
    console.log('✅ No packages with docs changes found.');
    return;
  }

  console.log(`📝 Found ${packagesWithChanges.length} packages with docs changes:`);
  packagesWithChanges.forEach(pkg => console.log(`  - ${pkg}`));

  let updatedCount = 0;
  
  for (const packageName of packagesWithChanges) {
    if (updateReadmeMap(packageName)) {
      updatedCount++;
    }
  }

  console.log(`🎉 Updated ${updatedCount}/${packagesWithChanges.length} package-info.json files`);
  
  if (updatedCount > 0) {
    console.log('📚 Next steps: The updated package-info.json files will be indexed automatically.');
  }
}

// Allow this script to be run directly or imported
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { updateReadmeMap, getPackagesWithDocsChanges }; 