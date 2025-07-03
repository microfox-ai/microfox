// ci-deploy.ts
import * as fs from 'fs';
import * as path from 'path';
import deployPackageSls from './deploy';
import removePackageSls from './remove';
import { detectChangedPackageSls } from './detect-changes';
import { setEnvironmentVariables } from './environment';
import { getProjectRoot } from '../../../utils/getProjectRoot';

interface OverwriteConfigPackage {
  enabled?: boolean;
  destroy?: boolean;
}

interface OverwriteConfig {
  [packageName: string]: OverwriteConfigPackage;
}

/**
 * Process a single package
 * @param {string} packageName - Package name
 * @param {object} packageConfig - Package configuration from overwrite.json
 * @returns {Promise<boolean>} - Success status
 */
async function processPackage(packageName: string, projectRoot: string, packageConfig: OverwriteConfigPackage = {}): Promise<boolean> {
  const packagePath = path.join(projectRoot, 'packages', packageName);
  const slsPath = path.join(packagePath, `sls`);

  console.log(`Setting environment variables for ${packageName}`);
  setEnvironmentVariables(slsPath)

  // Skip disabled packages
  if (packageConfig.enabled === false) {
    console.log(`Skipping ${packageName} (disabled in config)`);
    return true;
  }

  console.log(`\nProcessing ${packageName} sls deployment...`);

  try {
    // Check if package already exists
    const serverlessConfigPath = path.join(packagePath, `sls`, `serverless.yml`);
    if (fs.existsSync(serverlessConfigPath)) {
      console.log(`Serverless config found for ${packageName}`);
      if (packageConfig.destroy === true) {
        // Destroy package if marked for destruction
        console.log(`Destroying ${packageName}...`);
        return await removePackageSls(packagePath);
      }
      return await deployPackageSls(packagePath);
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${packageName}:`, error);
    return false;
  }
}

async function main(): Promise<void> {
  try {
    // Detect changed packages
    const changedPackagesSls = detectChangedPackageSls();
    console.log('Changed packages:', JSON.stringify(changedPackagesSls, null, 2));

    // Load overwrite config if it exists
    let overwriteConfig: OverwriteConfig = {};
    const overwritePath = path.join(__dirname, 'overwrite.json');
    if (fs.existsSync(overwritePath)) {
      try {
        overwriteConfig = JSON.parse(fs.readFileSync(overwritePath, 'utf8'));
        console.log('Loaded overwrite.json configuration');
      } catch (err) {
        console.error('Error parsing overwrite.json:', err);
        process.exit(1);
      }
    }

    // Process each package directory
    const packageNames = changedPackagesSls.map(({ packageName }) => packageName);
    const projectRoot = getProjectRoot();
    const results = await Promise.all(
      packageNames.map(packageName =>
        processPackage(
          packageName,
          projectRoot,
          overwriteConfig[packageName]
        )
      )
    );

    const success = results.every(result => result);

    if (!success) {
      console.error('\nSome deployments failed');
      process.exit(1);
    }

    console.log('\nCI deployment completed successfully');
  } catch (error) {
    console.error('CI deployment failed:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 