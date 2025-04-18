import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Build the package
 */
export async function buildPackage(packageDir: string): Promise<boolean> {
  try {
    const originalDir = process.cwd();
    process.chdir(packageDir);
    console.log('🔨 Building the package...');
    await execAsync('npm run build');
    console.log(`✨ Build completed successfully!`);
    // Return to original directory
    process.chdir(originalDir);
    return true;
  } catch (error) {
    console.warn(
      `⚠️ Could not automatically build the package. Please build it manually.`,
    );
    return false;
  }
}
