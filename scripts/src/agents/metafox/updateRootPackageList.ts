import fs from 'fs';
import path from 'path';
import { PackageInfo } from '../../types';

// Define interface for package data
interface PackageData {
  dir: string; // Directory name (e.g., 'my-package')
  path: string; // Relative path from root (e.g., 'packages/my-package')
  name: string; // From package.json (e.g., '@scope/my-package')
  version: string; // From package.json
  status: string; // From package-info.json
  title?: string; // From package-info.json
  logo?: string; // Relative path from package root, from package-info.json
  docsPath?: string; // Relative path from package root, from package-info.json
  stats?: string; // From package-info.json
  authType?: 'apikey' | 'oauth2' | 'none'; // From package-info.json
}

const ROOT_DIR = path.join(process.cwd(), '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');
const OUTPUT_PATH = path.join(ROOT_DIR, 'packages-list.json');
const README_PATH = path.join(ROOT_DIR, 'README.md');

const MARKERS = {
  stable: {
    start: '<!-- STABLE_PACKAGES_TABLE_START -->',
    end: '<!-- STABLE_PACKAGES_TABLE_END -->',
    title: 'Stable Packages',
    includeAuthType: true,
  },
  semiStable: {
    start: '<!-- SEMI_STABLE_PACKAGES_TABLE_START -->',
    end: '<!-- SEMI_STABLE_PACKAGES_TABLE_END -->',
    title: 'Semi-Stable Packages',
    includeAuthType: true,
  },
  oauth: {
    start: '<!-- OAUTH_CONNECTORS_TABLE_START -->',
    end: '<!-- OAUTH_CONNECTORS_TABLE_END -->',
    title: 'OAuth Connectors',
    includeAuthType: false,
  },
};

/**
 * Generates Markdown table rows for a list of packages.
 */
function generateMarkdownTable(
  packages: PackageData[],
  includeAuthType: boolean,
): string {
  const header = ['Package', 'Links', 'Stats'];
  const separator = header.map(() => '---');

  const rows = packages.map(pkg => {
    const logoHtml = pkg.logo
      ? `<img src="${pkg.logo}" alt="${
          pkg.title || pkg.name
        } logo" width="16" height="16">`
      : '';
    const titleDisplay = `${logoHtml} ${pkg.title || pkg.name}`;

    // Create shield badges for NPM and documentation
    const npmBadge = `[![npm version](https://img.shields.io/npm/v/${pkg.name}.svg)](https://www.npmjs.com/package/${pkg.name})`;
    const docsBadge = pkg.docsPath
      ? `[![Documentation](https://img.shields.io/badge/docs-available-green.svg)](${pkg.docsPath})`
      : 'N/A';

    const linksDisplay = `${npmBadge} ${docsBadge}`;
    const authTypeDisplay = pkg.authType
      ? pkg.authType === 'apikey'
        ? '![API Key](https://img.shields.io/badge/auth-API%20Key-green.svg)'
        : pkg.authType === 'oauth2'
          ? '![OAuth](https://img.shields.io/badge/auth-OAuth-blue.svg)'
          : '![None](https://img.shields.io/badge/auth-None-gray.svg)'
      : '';
    const statsDisplay = pkg.stats
      ? `${pkg.stats} ${authTypeDisplay}`
      : authTypeDisplay;

    const row = [titleDisplay, linksDisplay, statsDisplay];
    return `| ${row.join(' | ')} |`;
  });

  return `| ${header.join(' | ')} |\n| ${separator.join(' | ')} |\n${rows.join(
    '\n',
  )}`;
}

/**
 * Updates a specific section in the README content.
 */
function updateReadmeSection(
  readmeContent: string,
  markerStart: string,
  markerEnd: string,
  newTable: string,
  title: string,
): string {
  const startIdx = readmeContent.indexOf(markerStart);
  const endIdx = readmeContent.indexOf(markerEnd);

  const sectionHeader = `### ${title}\n\n`;
  const newSectionContent = `${markerStart}\n${sectionHeader}${newTable}\n${markerEnd}`;

  if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
    // Replace existing section
    return `${readmeContent.substring(
      0,
      startIdx,
    )}${newSectionContent}${readmeContent.substring(endIdx + markerEnd.length)}`;
  } else {
    // Append new section
    console.log(`ℹ️ Markers for "${title}" not found, appending section.`);
    return `${readmeContent}\n\n${newSectionContent}`;
  }
}

/**
 * Updates the README.md file with package tables.
 */
function updateReadme(allPackagesData: PackageData[]) {
  console.log('📝 Updating README.md...');
  try {
    let readmeContent = fs.readFileSync(README_PATH, 'utf8');
    let changed = false;

    // --- Update Stable Packages Table ---
    const stablePackages = allPackagesData.filter(p => p.status === 'stable');
    if (stablePackages.length > 0) {
      const stableTable = generateMarkdownTable(stablePackages, true);
      const newReadmeContent = updateReadmeSection(
        readmeContent,
        MARKERS.stable.start,
        MARKERS.stable.end,
        stableTable,
        MARKERS.stable.title,
      );
      if (newReadmeContent !== readmeContent) {
        readmeContent = newReadmeContent;
        changed = true;
      }
    } else {
      // If no stable packages, ensure the section is removed or empty
      const startIdx = readmeContent.indexOf(MARKERS.stable.start);
      const endIdx = readmeContent.indexOf(MARKERS.stable.end);
      if (startIdx !== -1 && endIdx !== -1) {
        const emptySection = `${MARKERS.stable.start}\n${MARKERS.stable.end}`;
        const newReadmeContent = `${readmeContent.substring(0, startIdx)}${emptySection}${readmeContent.substring(endIdx + MARKERS.stable.end.length)}`;
        if (readmeContent !== newReadmeContent) {
          readmeContent = newReadmeContent;
          changed = true;
        }
      }
    }

    // --- Update Semi-Stable Packages Table ---
    const semiStablePackages = allPackagesData.filter(
      p => p.status === 'semiStable',
    );
    if (semiStablePackages.length > 0) {
      const semiStableTable = generateMarkdownTable(semiStablePackages, true);
      const newReadmeContent = updateReadmeSection(
        readmeContent,
        MARKERS.semiStable.start,
        MARKERS.semiStable.end,
        semiStableTable,
        MARKERS.semiStable.title,
      );
      if (newReadmeContent !== readmeContent) {
        readmeContent = newReadmeContent;
        changed = true;
      }
    } else {
      // If no semi-stable packages, ensure the section is removed or empty
      const startIdx = readmeContent.indexOf(MARKERS.semiStable.start);
      const endIdx = readmeContent.indexOf(MARKERS.semiStable.end);
      if (startIdx !== -1 && endIdx !== -1) {
        const emptySection = `${MARKERS.semiStable.start}\n${MARKERS.semiStable.end}`;
        const newReadmeContent = `${readmeContent.substring(0, startIdx)}${emptySection}${readmeContent.substring(endIdx + MARKERS.semiStable.end.length)}`;
        if (readmeContent !== newReadmeContent) {
          readmeContent = newReadmeContent;
          changed = true;
        }
      }
    }

    // --- Update OAuth Connectors Table ---
    const oauthConnectors = allPackagesData.filter(
      p => p.status === 'oauthConnector', // Assuming this is the status name
    );
    if (oauthConnectors.length > 0) {
      const oauthTable = generateMarkdownTable(oauthConnectors, false);
      const newReadmeContent = updateReadmeSection(
        readmeContent,
        MARKERS.oauth.start,
        MARKERS.oauth.end,
        oauthTable,
        MARKERS.oauth.title,
      );
      if (newReadmeContent !== readmeContent) {
        readmeContent = newReadmeContent;
        changed = true;
      }
    } else {
      // If no oauth connectors, ensure the section is removed or empty
      const startIdx = readmeContent.indexOf(MARKERS.oauth.start);
      const endIdx = readmeContent.indexOf(MARKERS.oauth.end);
      if (startIdx !== -1 && endIdx !== -1) {
        const emptySection = `${MARKERS.oauth.start}\n${MARKERS.oauth.end}`;
        const newReadmeContent = `${readmeContent.substring(0, startIdx)}${emptySection}${readmeContent.substring(endIdx + MARKERS.oauth.end.length)}`;
        if (readmeContent !== newReadmeContent) {
          readmeContent = newReadmeContent;
          changed = true;
        }
      }
    }

    // Write back to README if changes were made
    if (changed) {
      fs.writeFileSync(README_PATH, readmeContent);
      console.log('✅ README.md updated successfully.');
    } else {
      console.log('ℹ️ No changes needed for README.md.');
    }
  } catch (error) {
    console.error('❌ Error updating README.md:', error);
    // Don't exit process, just log error
  }
}

/**
 * Generates statistics string for a package based on its info
 */
function generatePackageStats(pkgInfo: PackageInfo | null): string {
  if (!pkgInfo) return 'N/A';

  const stats: string[] = [];

  // Count constructors
  let keysCount = 0;
  if (pkgInfo.constructors && pkgInfo.constructors.length > 0) {
    stats.push(`${pkgInfo.constructors.length} constructors`);
    for (const constructor of pkgInfo.constructors) {
      keysCount +=
        (constructor.requiredKeys?.length ?? 0) +
        (constructor.internalKeys?.length ?? 0) +
        (constructor.botConfig?.length ?? 0);
    }
  }
  stats.push(`${keysCount} keys`);
  return stats.length > 0 ? stats.join(', ') : 'N/A';
}

/**
 * List all packages in the packages directory, save their paths to packages-list.json,
 * and update the root README.md with tables for specific package types.
 */
async function updatePackageList() {
  try {
    console.log('📁 Scanning packages directory...');

    // Check if packages directory exists
    if (!fs.existsSync(PACKAGES_DIR)) {
      console.log('⚠️ No packages directory found');
      return;
    }

    // Read all directories in packages folder
    const packageDirs = fs.readdirSync(PACKAGES_DIR).filter(file => {
      const fullPath = path.join(PACKAGES_DIR, file);
      return fs.statSync(fullPath).isDirectory() && !file.startsWith('.'); // Ignore hidden dirs
    });

    const allPackagesData: PackageData[] = [];
    const statusPackages: Record<string, string[]> = {}; // For packages-list.json

    // Process each package directory
    for (const dir of packageDirs) {
      const packageJsonPath = path.join(PACKAGES_DIR, dir, 'package.json');
      const packageInfoPath = path.join(PACKAGES_DIR, dir, 'package-info.json');
      const relativePath = `packages/${dir}`; // Path relative to root

      let pkgJson: any = {};
      let pkgInfo: PackageInfo | null = null;

      // Read package-info.json
      if (fs.existsSync(packageInfoPath)) {
        try {
          pkgInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));
        } catch (error) {
          console.warn(
            `⚠️ Error reading package-info.json for ${dir}:`,
            (error as Error).message,
          );
          // Continue even if package-info is missing/corrupt, use defaults
        }
      } else {
        console.warn(`⚠️ No package-info.json found for ${dir}`);
        // Use defaults if package-info is missing
      }

      const status = pkgInfo?.status || 'unknown';

      // Maintain structure for packages-list.json
      const statusKey = `${status}Packages`;
      if (!statusPackages[statusKey]) {
        statusPackages[statusKey] = [];
      }
      statusPackages[statusKey].push(relativePath);

      // Read package.json
      if (fs.existsSync(packageJsonPath)) {
        try {
          pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        } catch (error) {
          console.warn(
            `⚠️ Error reading package.json for ${dir}:`,
            (error as Error).message,
          );
          continue; // Skip package if essential files are unreadable
        }
      } else {
        console.warn(`⚠️ No package.json found for ${dir}, skipping.`);
        continue;
      }

      // Collect data for README and general processing
      const packageData: PackageData = {
        dir: dir,
        path: relativePath,
        name: pkgJson.name || dir,
        version: pkgJson.version || '0.0.0',
        status: status,
        title: pkgInfo?.title,
        logo: pkgInfo?.icon,
        docsPath: `https://github.com/microfox-ai/microfox/tree/main/packages/${dir}/README.md`,
        stats: generatePackageStats(pkgInfo),
        authType: pkgInfo?.authType,
      };
      allPackagesData.push(packageData);
    } // End of package processing loop

    // --- Update packages-list.json ---
    const newPackageListOutput = {
      ...statusPackages,
      total: packageDirs.length,
      generatedAt: new Date().toISOString(),
    };

    let shouldUpdatePackageList = true;
    if (fs.existsSync(OUTPUT_PATH)) {
      try {
        const existingContent = JSON.parse(
          fs.readFileSync(OUTPUT_PATH, 'utf8'),
        );
        const { generatedAt: _, ...existingData } = existingContent;
        const { generatedAt: __, ...newData } = newPackageListOutput;
        shouldUpdatePackageList =
          JSON.stringify(existingData) !== JSON.stringify(newData);
      } catch (error) {
        console.warn(
          `⚠️ Error reading existing ${path.basename(OUTPUT_PATH)}, will overwrite:`,
          (error as Error).message,
        );
        shouldUpdatePackageList = true; // Force update if existing is corrupt
      }
    }

    if (shouldUpdatePackageList) {
      fs.writeFileSync(
        OUTPUT_PATH,
        JSON.stringify(newPackageListOutput, null, 2),
      );
      console.log(`📝 Updated package list in ${path.basename(OUTPUT_PATH)}`);
    } else {
      console.log(
        `ℹ️ No changes detected in package data for ${path.basename(
          OUTPUT_PATH,
        )}, skipping update`,
      );
    }

    // --- Update README.md ---
    updateReadme(allPackagesData); // Call the README update function

    console.log(`✅ Processed ${allPackagesData.length} packages.`);

    // Log status counts from collected data
    const statusCounts: Record<string, number> = {};
    allPackagesData.forEach(p => {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`📊 ${status}: ${count} packages`);
    });
  } catch (error) {
    console.error('❌ Error updating package lists:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  updatePackageList();
}
