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

interface FileChange {
  packageName: string;
  fileName: string;
  functionality: string;
  action: 'added' | 'removed' | 'modified';
}

/**
 * Get changed files with their change types from GitHub Actions or git
 */
function getChangedFiles(): { added: string[], removed: string[], modified: string[] } {
  // Check if we have GitHub Actions environment variables with file changes
  const addedDocs = process.env.ADDED_DOCS || '';
  const removedDocs = process.env.REMOVED_DOCS || '';
  const modifiedDocs = process.env.MODIFIED_DOCS || '';
  
  if (addedDocs || removedDocs || modifiedDocs) {
    console.log('🔧 Using GitHub Actions file change detection');
    
    const added = addedDocs.split(' ').filter(Boolean);
    const removed = removedDocs.split(' ').filter(Boolean);
    const modified = modifiedDocs.split(' ').filter(Boolean);
    
    console.log(`🔍 Found changes from GitHub Actions:`);
    console.log(`  ✅ Added: ${added.length} files${added.length > 0 ? ':\n    ' + added.join('\n    ') : ''}`);
    console.log(`  🗑️ Removed: ${removed.length} files${removed.length > 0 ? ':\n    ' + removed.join('\n    ') : ''}`);
    console.log(`  ✏️ Modified: ${modified.length} files${modified.length > 0 ? ':\n    ' + modified.join('\n    ') : ''}`);
    
    return { added, removed, modified };
  }
  
  // Fallback to git detection for local development
  console.log('🔧 Using git-based file change detection');
  
  try {
    let addedFiles: string[] = [];
    let removedFiles: string[] = [];
    let modifiedFiles: string[] = [];
    
    // Check if we're in GitHub Actions
    const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
    const eventName = process.env.GITHUB_EVENT_NAME;
    
    if (isGitHubActions) {
      console.log(`🔧 Running in GitHub Actions (event: ${eventName})`);
      
      let diffCommand = '';
      if (eventName === 'pull_request') {
        diffCommand = 'git diff --name-status origin/main...HEAD';
        console.log('📋 Using PR diff strategy');
      } else {
        diffCommand = 'git diff --name-status HEAD~1 HEAD';
        console.log('📋 Using push diff strategy');
      }
      
      try {
        const output = execSync(diffCommand, { encoding: 'utf-8' });
        const lines = output.split('\n').filter(Boolean);
        
        lines.forEach(line => {
          const [status, filePath] = line.split('\t');
          if (status === 'A') addedFiles.push(filePath);
          else if (status === 'D') removedFiles.push(filePath);
          else if (status === 'M') modifiedFiles.push(filePath);
        });
      } catch (error) {
        console.warn('Failed to get detailed diff, falling back to basic diff');
        const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' });
        modifiedFiles = output.split('\n').filter(Boolean);
      }
    } else {
      // Local development
      try {
        // Check staged changes with status
        const stagedOutput = execSync('git diff --name-status --cached', { encoding: 'utf-8' });
        if (stagedOutput.trim()) {
          const lines = stagedOutput.split('\n').filter(Boolean);
          lines.forEach(line => {
            const [status, filePath] = line.split('\t');
            if (status === 'A') addedFiles.push(filePath);
            else if (status === 'D') removedFiles.push(filePath);
            else if (status === 'M') modifiedFiles.push(filePath);
          });
        } else {
          // Check working directory changes
          const workingOutput = execSync('git diff --name-only', { encoding: 'utf-8' });
          modifiedFiles = workingOutput.split('\n').filter(Boolean);
        }
        console.log('📋 Using local diff strategy');
      } catch {
        const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf-8' });
        modifiedFiles = output.split('\n').filter(Boolean);
        console.log('📋 Fallback to HEAD~1 diff');
      }
    }
    
    console.log(`🔍 Found changes:`);
    console.log(`  ✅ Added: ${addedFiles.length} files${addedFiles.length > 0 ? ':\n    ' + addedFiles.join('\n    ') : ''}`);
    console.log(`  🗑️ Removed: ${removedFiles.length} files${removedFiles.length > 0 ? ':\n    ' + removedFiles.join('\n    ') : ''}`);
    console.log(`  ✏️ Modified: ${modifiedFiles.length} files${modifiedFiles.length > 0 ? ':\n    ' + modifiedFiles.join('\n    ') : ''}`);
    
    return { added: addedFiles, removed: removedFiles, modified: modifiedFiles };
  } catch (error) {
    console.warn('Could not get git diff, scanning all packages');
    return { added: [], removed: [], modified: [] };
  }
}

/**
 * Parse file changes to get doc-specific changes
 */
function parseDocChanges(): FileChange[] {
  const { added, removed, modified } = getChangedFiles();
  const changes: FileChange[] = [];
  
  // Helper to extract package and functionality from doc file path
  const parseDocPath = (filePath: string) => {
    const match = filePath.match(/^packages\/([^/]+)\/docs\/(.+)\.md$/);
    if (match) {
      return {
        packageName: match[1],
        fileName: match[2] + '.md',
        functionality: match[2]
      };
    }
    return null;
  };
  
  // Process added files
  added.forEach(filePath => {
    const parsed = parseDocPath(filePath);
    if (parsed) {
      changes.push({ ...parsed, action: 'added' });
    }
  });
  
  // Process removed files
  removed.forEach(filePath => {
    const parsed = parseDocPath(filePath);
    if (parsed) {
      changes.push({ ...parsed, action: 'removed' });
    }
  });
  
  // Process modified files
  modified.forEach(filePath => {
    const parsed = parseDocPath(filePath);
    if (parsed) {
      changes.push({ ...parsed, action: 'modified' });
    }
  });
  
  return changes;
}

/**
 * Create readme info for a specific doc file
 */
function createReadmeInfo(packageName: string, functionality: string): ReadmeInfo | null {
  const docsDir = path.join(PACKAGES_DIR, packageName, 'docs');
  const filePath = path.join(docsDir, `${functionality}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
    
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

  const githubPath = `${GITHUB_BASE_URL}${packageName}/docs/${functionality}.md`;

  return {
      path: githubPath,
      type,
      extension: 'md',
      functionality,
      description
  };
}

/**
 * Update package-info.json with targeted changes
 */
function updateReadmeMapTargeted(packageName: string, changes: FileChange[]): boolean {
  const pkgDir = path.join(PACKAGES_DIR, packageName);
  const packageInfoPath = path.join(pkgDir, 'package-info.json');

  if (!fs.existsSync(packageInfoPath)) {
    console.warn(`⚠️ No package-info.json found for ${packageName}`);
    return false;
  }

  try {
    const packageInfo: PackageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf-8'));
    
    // Initialize readme_map if it doesn't exist
    if (!packageInfo.readme_map) {
      packageInfo.readme_map = {
        description: `The full README for the ${packageInfo.title || packageName}`,
        path: `${GITHUB_BASE_URL}${packageName}/README.md`,
        functionalities: [],
        all_readmes: []
      };
    }

    let hasChanges = false;

    // Process each change
    changes.forEach(change => {
      const { functionality, action } = change;
      
      if (action === 'added') {
        // Add functionality to readme_map functionalities array
        if (!packageInfo.readme_map!.functionalities.includes(functionality)) {
          packageInfo.readme_map!.functionalities.push(functionality);
          hasChanges = true;
          console.log(`  ✅ Added ${functionality} to readme_map.functionalities`);
        }
        
        // Add functionality to all constructors functionalities arrays
        if (packageInfo.constructors) {
          packageInfo.constructors.forEach((constructor, index) => {
            if (!constructor.functionalities.includes(functionality)) {
              constructor.functionalities.push(functionality);
              hasChanges = true;
              console.log(`  ✅ Added ${functionality} to constructors[${index}].functionalities`);
            }
          });
        }
        
        // Create and add readme info to all_readmes array
        const readmeInfo = createReadmeInfo(packageName, functionality);
        if (readmeInfo && !packageInfo.readme_map!.all_readmes?.find(r => r.functionality === functionality)) {
          if (!packageInfo.readme_map!.all_readmes) {
            packageInfo.readme_map!.all_readmes = [];
          }
          packageInfo.readme_map!.all_readmes.push(readmeInfo);
          hasChanges = true;
          console.log(`  ✅ Added ${functionality} to all_readmes`);
        }
        
      } else if (action === 'removed') {
        // Remove functionality from readme_map functionalities array
        const functIndex = packageInfo.readme_map!.functionalities.indexOf(functionality);
        if (functIndex > -1) {
          packageInfo.readme_map!.functionalities.splice(functIndex, 1);
          hasChanges = true;
          console.log(`  🗑️ Removed ${functionality} from readme_map.functionalities`);
        }
        
        // Remove functionality from all constructors functionalities arrays
        if (packageInfo.constructors) {
          packageInfo.constructors.forEach((constructor, index) => {
            const constructorFunctIndex = constructor.functionalities.indexOf(functionality);
            if (constructorFunctIndex > -1) {
              constructor.functionalities.splice(constructorFunctIndex, 1);
              hasChanges = true;
              console.log(`  🗑️ Removed ${functionality} from constructors[${index}].functionalities`);
            }
          });
        }
        
        // Remove readme info from all_readmes array
        if (packageInfo.readme_map!.all_readmes) {
          const readmeIndex = packageInfo.readme_map!.all_readmes.findIndex(r => r.functionality === functionality);
          if (readmeIndex > -1) {
            packageInfo.readme_map!.all_readmes.splice(readmeIndex, 1);
            hasChanges = true;
            console.log(`  🗑️ Removed ${functionality} from all_readmes`);
          }
        }
      }
    });

    if (hasChanges) {
      // Sort arrays alphabetically by functionality name
      packageInfo.readme_map!.functionalities.sort();
      packageInfo.readme_map!.all_readmes?.sort((a, b) => 
        (a.functionality || '').localeCompare(b.functionality || '')
      );
      
      // Sort constructors functionalities arrays
      if (packageInfo.constructors) {
        packageInfo.constructors.forEach(constructor => {
          constructor.functionalities.sort();
        });
      }

      // Write updated package-info.json
      fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2) + '\n');
      console.log(`✅ Updated package-info.json for ${packageName}`);
      return true;
    } else {
      console.log(`ℹ️ No changes needed for ${packageName}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating package-info.json for ${packageName}:`, error);
    return false;
  }
}

/**
 * Get list of packages that have docs changes
 */
function getPackagesWithDocsChanges(): string[] {
  const docChanges = parseDocChanges();
  const packagesWithChanges = new Set<string>();
  
  docChanges.forEach(change => {
    packagesWithChanges.add(change.packageName);
  });
  
  return Array.from(packagesWithChanges);
}

/**
 * Main function to update readme maps for packages with targeted changes
 */
async function main() {
  console.log('🔍 Scanning for docs changes...');
  
  const docChanges = parseDocChanges();
  
  if (docChanges.length === 0) {
    console.log('✅ No docs changes found.');
    return;
  }

  // Filter to only added and removed changes (ignore modifications)
  const relevantChanges = docChanges.filter(change => 
    change.action === 'added' || change.action === 'removed'
  );

  if (relevantChanges.length === 0) {
    console.log('✅ No docs additions or removals found (only modifications).');
    return;
  }

  console.log(`📝 Found ${relevantChanges.length} relevant doc changes:`);
  relevantChanges.forEach(change => {
    console.log(`  ${change.action === 'added' ? '✅' : '🗑️'} ${change.packageName}/${change.fileName} (${change.action})`);
  });

  // Group changes by package
  const changesByPackage = new Map<string, FileChange[]>();
  relevantChanges.forEach(change => {
    if (!changesByPackage.has(change.packageName)) {
      changesByPackage.set(change.packageName, []);
    }
    changesByPackage.get(change.packageName)!.push(change);
  });

  let updatedCount = 0;
  
  for (const [packageName, changes] of changesByPackage) {
    console.log(`\n📦 Processing ${packageName}:`);
    if (updateReadmeMapTargeted(packageName, changes)) {
      updatedCount++;
    }
  }

  console.log(`\n🎉 Updated ${updatedCount}/${changesByPackage.size} package-info.json files`);
  
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

export { updateReadmeMapTargeted as updateReadmeMap, getPackagesWithDocsChanges }; 