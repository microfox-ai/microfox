import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { glob, globSync } from 'glob';
import { PackageInfo } from '../../types';

interface ValidationError {
  file: string;
  errors: string[];
}

function validatePackageInfo(filePath: string): ValidationError | null {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // First check if the file has a valid status field
    if (
      content.status &&
      (content.status === 'external' ||
        content.status === 'stable' ||
        content.status === 'semiStable')
    ) {
      // Only perform full validation for external or stable packages
      const result = PackageInfo.safeParse(content);

      if (!result.success) {
        return {
          file: filePath,
          errors: result.error.errors.map(
            err => `${err.path.join('.')}: ${err.message}`,
          ),
        };
      }
    } else {
      // For unstable packages, just check if it's valid JSON
      // No need to validate against the full schema
      console.log(
        `Skipping full validation for ${filePath} (status: ${content.status || 'unknown'})`,
      );
    }

    return null;
  } catch (error) {
    return {
      file: filePath,
      errors: [
        `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}

function validateAllPackageInfos(): ValidationError[] {
  const errors: ValidationError[] = [];

  // Get the project root directory (two levels up from the script location)
  const scriptDir = __dirname;
  const projectRoot = path.resolve(scriptDir, '../../');

  // Use path.join to create a path relative to the project root
  const packageInfoPattern = path.join(
    projectRoot,
    'packages/**/package-info.json',
  );
  const packageInfoFiles = globSync(packageInfoPattern);

  // Find all package directories
  const packageDirs = globSync(path.join(projectRoot, 'packages/*/'));

  // Check for missing package-info.json files
  for (const dir of packageDirs) {
    const packageInfoPath = path.join(dir, 'package-info.json');
    if (!packageInfoFiles.includes(packageInfoPath)) {
      errors.push({
        file: dir,
        errors: ['Missing package-info.json file'],
      });
    }
  }

  // Validate existing package-info.json files
  for (const file of packageInfoFiles) {
    const error = validatePackageInfo(file);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

// For GitHub Actions
if (require.main === module) {
  const errors = validateAllPackageInfos();
  if (errors.length > 0) {
    // Use environment files instead of set-output
    const githubOutputPath = process.env.GITHUB_OUTPUT;
    if (githubOutputPath) {
      // Write to the GitHub Actions environment file
      fs.appendFileSync(githubOutputPath, `has_errors=true\n`);
      fs.appendFileSync(
        githubOutputPath,
        `error_message=${JSON.stringify(
          errors.map(err => ({
            file: err.file,
            errors: err.errors,
          })),
        )}\n`,
      );
    } else {
      // Fallback for local execution
      console.log('Validation errors found:');
      errors.forEach(err => {
        console.log(`File: ${err.file}`);
        err.errors.forEach(error => console.log(`  - ${error}`));
      });
    }
    // Don't exit with code 1 to allow the workflow to continue
    console.log(
      'Validation completed with errors. The workflow will continue to write PR comments.',
    );
  } else {
    // Use environment files instead of set-output
    const githubOutputPath = process.env.GITHUB_OUTPUT;
    if (githubOutputPath) {
      fs.appendFileSync(githubOutputPath, `has_errors=false\n`);
    }
    console.log('All package info files are valid! ✨');
  }
}
