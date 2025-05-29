import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { getProjectRoot } from '../../../utils/getProjectRoot';

interface PackagePath {
  packageName: string;
  packagePath: string;
}


/**
 * Detects which function directories have changed based on git diff
 * @returns {Array<string>} - Array of paths to sls folders with changes
 */
function detectChangedPackageSls(): PackagePath[] {
  const projectRoot = getProjectRoot();
  const packagesPath = path.join(projectRoot, 'packages');
  // Get all request directories and their functions
  const allPackages = fs
    .readdirSync(packagesPath)
    .filter((name) => {
      const fullPath = path.join(packagesPath, name);
      return (
        fs.statSync(fullPath).isDirectory() &&
        fs.existsSync(path.join(fullPath, 'sls'))
      );
    })
    .map((packageName) => {
      console.log('packageName', packageName);
      const packagePath = path.join(packagesPath, packageName);

      return { packageName, packagePath };
    });

  try {
    // Get the list of changed files between commits
    let diffCommand: string;

    // Check if GITHUB_BEFORE and GITHUB_AFTER environment variables are available
    // These are available in push events and contain the SHA before and after the push
    if (process.env.GITHUB_BEFORE && process.env.GITHUB_AFTER) {
      console.log(`Comparing changes between ${process.env.GITHUB_BEFORE} and ${process.env.GITHUB_AFTER}`);
      diffCommand = `git diff --name-only ${process.env.GITHUB_BEFORE} ${process.env.GITHUB_AFTER}`;
    } else {
      // Fallback to just comparing with the previous commit
      console.log('Using fallback diff method (comparing with previous commit)');
      diffCommand = `git diff --name-only HEAD~1 HEAD`;
    }

    const changedFiles = execSync(diffCommand, { encoding: 'utf8' }).trim().split('\n');
    console.log('Changed files:', changedFiles);

    if (
      !changedFiles ||
      changedFiles.length === 0 ||
      (changedFiles.length === 1 && changedFiles[0] === '')
    ) {
      return [];
    }

    // Find which packages have changes specifically in their sls directory
    const changedSlsPaths = allPackages
      .filter((pkg) => {
        // Check for changes specifically in the sls directory, not the entire package
        const slsPath = path.join('packages', pkg.packageName, 'sls');
        return changedFiles.some((file) => file.startsWith(slsPath));
      })
      .map((pkg) => ({
        packageName: pkg.packageName,
        packagePath: pkg.packagePath,
      }));

    console.log('Changed SLS paths:', changedSlsPaths);
    return changedSlsPaths;
  } catch (error) {
    console.error('Error detecting changed functions:', error);
    // On error, return empty array
    return [];
  }
}

export {
  detectChangedPackageSls,
}; 