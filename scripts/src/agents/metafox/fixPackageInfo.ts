import { PackageInfo } from '../../types';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

interface FixResult {
  file: string;
  fixed: boolean;
  addedFields: string[];
  errors: string[];
}

// Default values for required fields
const defaultValues = {
  status: 'unstable',
  platformType: 'communication',
  dependencies: [],
  extraInfo: [],
  constructors: [],
};

function fixPackageInfo(filePath: string): FixResult {
  const result: FixResult = {
    file: filePath,
    fixed: false,
    addedFields: [],
    errors: [],
  };

  try {
    // Read the file content
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let modified = false;
    const updatedContent = { ...content };

    // Check and add missing required fields
    for (const [key, defaultValue] of Object.entries(defaultValues)) {
      if (content[key] === undefined) {
        updatedContent[key] = defaultValue;
        result.addedFields.push(key);
        modified = true;
      }
    }

    // Validate the updated content
    const validationResult = PackageInfo.safeParse(updatedContent);

    if (!validationResult.success) {
      result.errors = validationResult.error.errors.map(
        err => `${err.path.join('.')}: ${err.message}`,
      );
    }

    // If we made changes and the validation passed, write the updated content back
    if (modified && validationResult.success) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedContent, null, 2),
        'utf-8',
      );
      result.fixed = true;
    }

    return result;
  } catch (error) {
    result.errors.push(
      `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    return result;
  }
}

function fixAllPackageInfos(): FixResult[] {
  const results: FixResult[] = [];

  // Get the project root directory (two levels up from the script location)
  const scriptDir = __dirname;
  const projectRoot = path.resolve(scriptDir, '../../');

  // Use path.join to create a path relative to the project root
  const packageInfoPattern = path.join(
    projectRoot,
    'packages/**/package-info.json',
  );
  const packageInfoFiles = globSync(packageInfoPattern);

  for (const file of packageInfoFiles) {
    const result = fixPackageInfo(file);
    results.push(result);
  }

  return results;
}

// For GitHub Actions
if (require.main === module) {
  const results = fixAllPackageInfos();

  // Count how many files were fixed
  const fixedCount = results.filter(r => r.fixed).length;
  const errorCount = results.filter(r => r.errors.length > 0).length;

  // Use environment files instead of set-output
  const githubOutputPath = process.env.GITHUB_OUTPUT;
  if (githubOutputPath) {
    fs.appendFileSync(githubOutputPath, `fixed_count=${fixedCount}\n`);
    fs.appendFileSync(githubOutputPath, `error_count=${errorCount}\n`);
  }

  // Log results
  console.log(`Fixed ${fixedCount} package info files`);

  if (errorCount > 0) {
    console.log(`Found errors in ${errorCount} files:`);
    results.forEach(result => {
      if (result.errors.length > 0) {
        console.log(`File: ${result.file}`);
        result.errors.forEach(error => console.log(`  - ${error}`));
      }
    });
  }

  // Log details of fixed files
  results.forEach(result => {
    if (result.fixed) {
      console.log(`Fixed ${result.file}:`);
      result.addedFields.forEach(field =>
        console.log(`  - Added missing field: ${field}`),
      );
    }
  });

  console.log('Package info fix completed! ✨');
}
