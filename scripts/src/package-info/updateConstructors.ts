import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PackageInfo } from '../types';
import { getProjectRoot } from '../utils/getProjectRoot';

const ROOT_DIR = getProjectRoot();
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

console.log(`🏠 Root directory: ${ROOT_DIR}`);
console.log(`📦 Packages directory: ${PACKAGES_DIR}`);
console.log(`📂 Current working directory: ${process.cwd()}`);
console.log(`📁 Packages directory exists: ${fs.existsSync(PACKAGES_DIR)}`);

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
  // Check if we have GitHub before/after commit SHAs
  const githubBefore = process.env.GITHUB_BEFORE;
  const githubAfter = process.env.GITHUB_AFTER;
  
  if (githubBefore && githubAfter && githubBefore !== '0000000000000000000000000000000000000000') {
    console.log('🔧 Using GitHub before/after commit comparison');
    console.log(`📋 Comparing: ${githubBefore.substring(0, 8)} → ${githubAfter.substring(0, 8)}`);
    
    try {
      const output = execSync(`git diff --name-status ${githubBefore} ${githubAfter}`, { encoding: 'utf-8' });
      const lines = output.split('\n').filter(Boolean);
      
      let addedFiles: string[] = [];
      let removedFiles: string[] = [];
      let modifiedFiles: string[] = [];
      
      lines.forEach(line => {
        const parts = line.split('\t');
        const status = parts[0];
        const filePath = parts[1];
        
        if (status === 'A') addedFiles.push(filePath);
        else if (status === 'D') removedFiles.push(filePath);
        else if (status === 'M') modifiedFiles.push(filePath);
      });
      
      console.log(`🔍 Found changes from GitHub comparison:`);
      console.log(`  ✅ Added: ${addedFiles.length} files${addedFiles.length > 0 ? ':\n    ' + addedFiles.join('\n    ') : ''}`);
      console.log(`  🗑️ Removed: ${removedFiles.length} files${removedFiles.length > 0 ? ':\n    ' + removedFiles.join('\n    ') : ''}`);
      console.log(`  ✏️ Modified: ${modifiedFiles.length} files${modifiedFiles.length > 0 ? ':\n    ' + modifiedFiles.join('\n    ') : ''}`);
      
      return { added: addedFiles, removed: removedFiles, modified: modifiedFiles };
    } catch (error) {
      console.warn('Failed to get GitHub diff, falling back to other methods');
    }
  }
  
  // Fallback to other git detection methods for local development
  console.log('🔧 Using fallback git-based file change detection');
  
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
          const parts = line.split('\t');
          const status = parts[0];
          const filePath = parts[1];
          
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
            const parts = line.split('\t');
            const status = parts[0];
            const filePath = parts[1];
            
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

  // Helper to check if file exists and has content
  const isFileEmpty = (filePath: string): boolean => {
    try {
      const fullPath = path.join(PACKAGES_DIR, '..', filePath);
      if (!fs.existsSync(fullPath)) {
        return true; // File doesn't exist, treat as empty
      }
      const content = fs.readFileSync(fullPath, 'utf-8').trim();
      return content.length === 0;
    } catch (error) {
      console.warn(`Could not check file content for ${filePath}:`, error);
      return false; // If we can't read it, assume it has content
    }
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
  
  // Process modified files - check if they're actually added or removed based on content
  modified.forEach(filePath => {
    const parsed = parseDocPath(filePath);
    if (parsed) {
      if (isFileEmpty(filePath)) {
        // File is empty, treat as removed
        changes.push({ ...parsed, action: 'removed' });
        console.log(`📝 Modified file ${filePath} is empty, treating as removed`);
      } else {
        // File has content, treat as added (could be new content in previously empty file)
        changes.push({ ...parsed, action: 'added' });
        console.log(`📝 Modified file ${filePath} has content, treating as added`);
      }
    }
  });
  
  return changes;
}

/**
 * Update package-info.json with targeted changes
 */
function updateConstructors(packageName: string, changes: FileChange[]): boolean {
  const pkgDir = path.join(PACKAGES_DIR, packageName);
  const packageInfoPath = path.join(pkgDir, 'package-info.json');

  if (!fs.existsSync(packageInfoPath)) {
    console.warn(`⚠️ No package-info.json found for ${packageName}`);
    return false;
  }

  try {
    const packageInfo: PackageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf-8'));
    
    let hasChanges = false;

    // Process each change
    changes.forEach(change => {
      const { functionality, action } = change;
      
      if (action === 'added') {
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
      } else if (action === 'removed') {
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
      }
    });

    if (hasChanges) {
      // Sort arrays alphabetically by functionality name
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
 * Main function to update constructors for packages with targeted changes
 */
async function main() {
  console.log('🔍 Scanning for docs changes...');
  
  const docChanges = parseDocChanges();
  
  if (docChanges.length === 0) {
    console.log('✅ No docs changes found.');
    return;
  }

  console.log(`📝 Found ${docChanges.length} doc changes:`);
  docChanges.forEach(change => {
    console.log(`  ${change.action === 'added' ? '✅' : '🗑️'} ${change.packageName}/${change.fileName} (${change.action})`);
  });

  // Group changes by package
  const changesByPackage = new Map<string, FileChange[]>();
  docChanges.forEach(change => {
    if (!changesByPackage.has(change.packageName)) {
      changesByPackage.set(change.packageName, []);
    }
    changesByPackage.get(change.packageName)!.push(change);
  });

  let updatedCount = 0;
  
  for (const [packageName, changes] of changesByPackage) {
    console.log(`\n📦 Processing ${packageName}:`);
    if (updateConstructors(packageName, changes)) {
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

export { updateConstructors, getPackagesWithDocsChanges }; 