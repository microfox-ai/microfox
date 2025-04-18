import fs from 'fs';
import path from 'path';

/**
 * List all packages in the packages directory and save their paths to packages-list.json
 * Organizes packages by their status (stable, beta, etc.)
 */
async function updatePackageList() {
  try {
    console.log('📁 Scanning packages directory...');

    // Get the packages directory path
    const packagesDir = path.join(process.cwd(), '../packages');

    // Check if packages directory exists
    if (!fs.existsSync(packagesDir)) {
      console.log('⚠️ No packages directory found');
      return;
    }

    // Read all directories in packages folder
    const packageDirs = fs.readdirSync(packagesDir).filter(file => {
      const fullPath = path.join(packagesDir, file);
      return fs.statSync(fullPath).isDirectory();
    });

    // Initialize status-based package arrays
    const statusPackages: Record<string, string[]> = {};
    // Initialize external packages array
    // Process each package directory
    for (const dir of packageDirs) {
      const packageInfoPath = path.join(packagesDir, dir, 'package-info.json');

      // Check if package-info.json exists
      if (fs.existsSync(packageInfoPath)) {
        try {
          const packageInfo = JSON.parse(
            fs.readFileSync(packageInfoPath, 'utf8'),
          );
          const status = packageInfo.status || 'unknown';
          const index = `${status}Packages`;

          // Initialize array for this index if it doesn't exist
          if (!statusPackages[index]) {
            statusPackages[index] = [];
          }

          // Add package to the appropriate index array
          statusPackages[index].push(`packages/${dir}`);
        } catch (error) {
          console.warn(`⚠️ Error reading package-info.json for ${dir}:`, error);
        }
      } else {
        console.warn(`⚠️ No package-info.json found for ${dir}`);
      }
    }

    // Create the output object
    const output = {
      ...statusPackages,
      total: packageDirs.length,
      generatedAt: new Date().toISOString(),
    };

    // Write to packages-list.json
    fs.writeFileSync(
      path.join(process.cwd(), '../packages-list.json'),
      JSON.stringify(output, null, 2),
    );

    console.log(`✅ Found ${packageDirs.length} packages`);
    console.log('📝 Saved package list to packages-list.json');

    // Log status counts
    Object.entries(statusPackages).forEach(([status, packages]) => {
      console.log(`📊 ${status}: ${packages.length} packages`);
    });
  } catch (error) {
    console.error('❌ Error listing packages:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  updatePackageList();
}
