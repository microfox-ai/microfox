import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { STAGE } from './constants';
import { createClient } from '@supabase/supabase-js';

/**
 * Remove a Serverless function
 * @param {string} packagePath - Directory of the package
 * @returns {Promise<boolean>} - Success status
 */
async function removePackageSls(packagePath: string): Promise<boolean> {
  try {
    const slsPath = path.join(packagePath, 'sls');
    const serverlessYmlPath = path.join(slsPath, 'serverless.yml');
    if (!fs.existsSync(serverlessYmlPath)) {
      console.error(`serverless.yml not found for ${packagePath}`);
      return false;
    }

    const packageName = path.basename(packagePath);
    console.log(`Removing ${packageName}`);

    // Change to function directory
    process.chdir(slsPath);

    // Remove using serverless framework
    const removeCommand = `serverless remove --stage ${STAGE}`;
    console.log('Running command:', removeCommand);

    execSync(removeCommand, { stdio: 'inherit' });
    console.log('Function removed successfully');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('public_deployments')
      .delete()
      .eq('package_name', packageName);

    console.log('Function deleted successfully from database');

    return true;
  } catch (error) {
    console.error(`Error removing sls function for package ${path.basename(packagePath)}:`, error);
    return false;
  }
}

export default removePackageSls; 