import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

const CWD_PACKAGE_JSON = path.join(process.cwd(), 'package.json');
const CWD_NODE_MODULES = path.join(process.cwd(), 'node_modules');
let MICROFOX_NODE_MODULES: string;

function log(message: string, isError = false, isWarning = false) {
  const timestamp = new Date().toLocaleTimeString();
  let prefix;

  if (isError) {
    prefix = chalk.red(`❌ [install-microfox ${timestamp}]`);
  } else if (isWarning) {
    prefix = chalk.yellow(`⚠️  [install-microfox ${timestamp}]`);
  } else {
    prefix = chalk.blue(`ℹ️  [install-microfox ${timestamp}]`);
  }

  console.log(`${prefix} ${message}`);
}

function logSuccess(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(chalk.green(`✅ [install-microfox ${timestamp}] ${message}`));
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function findSourceDir(targetDirName: string): string | null {
    let currentDir = process.cwd();
    for (let i = 0; i < 10; i++) {
        const gitDir = path.join(currentDir, '.git');
        if (fs.existsSync(gitDir)) {
            const parentDir = path.dirname(currentDir);
            const microfoxDir = path.join(parentDir, targetDirName);
            if (fs.existsSync(microfoxDir)) {
                return microfoxDir;
            }
        }
        const parent = path.dirname(currentDir);
        if (parent === currentDir) {
            break;
        }
        currentDir = parent;
    }
    return null;
}

function copyDirectory(src: string, dest: string): boolean {
  try {
    const normalizedSrc = path.resolve(src);
    const normalizedDest = path.resolve(dest);

    log(`Copying from: ${normalizedSrc}`);
    log(`Copying to: ${normalizedDest}`);

    if (!fs.existsSync(normalizedDest)) {
      fs.mkdirSync(normalizedDest, { recursive: true });
    }

    const isWindows = process.platform === 'win32';

    if (isWindows) {
      try {
        execSync(`robocopy "${normalizedSrc}" "${normalizedDest}" /E /NFL /NDL /NJH /NJS /nc /ns /np`, { stdio: 'pipe' });
      } catch (error: any) {
        if (error.status !== 1 && error.status !== 0) {
          throw error;
        }
      }
    } else {
      execSync(`cp -r "${normalizedSrc}/." "${normalizedDest}"`, { stdio: 'pipe' });
    }

    if (fs.existsSync(normalizedDest) && fs.readdirSync(normalizedDest).length > 0) {
      log(`✅ Copied ${normalizedSrc} -> ${normalizedDest}`);
      return true;
    } else {
      log(`❌ Copy verification failed: destination is empty`);
      return false;
    }
  } catch (error: any) {
    log(`❌ Failed to copy ${src} -> ${dest}: ${error.message}`);
    return false;
  }
}

function updatePackageJson(packageName: string): boolean {
  try {
    log(`Updating package.json to add ${packageName} with "*" version...`);

    if (!fs.existsSync(CWD_PACKAGE_JSON)) {
      log(`Package.json file not found at: ${CWD_PACKAGE_JSON}`, true);
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(CWD_PACKAGE_JSON, 'utf8'));

    const existingVersion = packageJson.dependencies?.[packageName] || packageJson.devDependencies?.[packageName];
    if (existingVersion && existingVersion !== '*') {
      log(`Package ${packageName} already exists with version: ${existingVersion}`, false, true);
      log(`Updating to "*" for local development...`, false, true);
    }

    if (!packageJson.dependencies) {
      packageJson.dependencies = {};
    }

    packageJson.dependencies[packageName] = '*';

    if (packageJson.devDependencies?.[packageName]) {
      delete packageJson.devDependencies[packageName];
      log(`Moved ${packageName} from devDependencies to dependencies`);
    }

    fs.writeFileSync(CWD_PACKAGE_JSON, JSON.stringify(packageJson, null, 2) + '\n');

    logSuccess(`Added ${packageName}: "*" to package.json`);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      log(`Package.json file not found at: ${CWD_PACKAGE_JSON}`, true);
    } else if (error instanceof SyntaxError) {
      log(`Invalid JSON in package.json: ${error.message}`, true);
    } else if (error.code === 'EACCES') {
      log(`Permission denied writing to package.json`, true);
    } else {
      log(`Failed to update package.json: ${error.message}`, true);
    }
    return false;
  }
}

function installSpecificPackage(packageName: string) {
  logSection(`Installing Specific Package: ${packageName}`);

  if (!packageName || typeof packageName !== 'string' || !packageName.startsWith('@microfox/')) {
    log(`Invalid package name format: "${packageName}". Must start with "@microfox/"`, true);
    process.exit(1);
  }

  const packageShortName = packageName.replace('@microfox/', '');
  if (!packageShortName || packageShortName.trim() === '') {
    log(`Invalid package name: "${packageName}"`, true);
    process.exit(1);
  }

  const microfoxDir = path.join(MICROFOX_NODE_MODULES, '@microfox');
  const srcDir = path.join(microfoxDir, packageShortName);

  log(`Searching for package: ${packageName}`);
  log(`Source directory: ${srcDir}`);

  if (!fs.existsSync(microfoxDir)) {
    log(`Microfox packages directory not found at: ${microfoxDir}`, true);
    process.exit(1);
  }

  if (!fs.existsSync(srcDir)) {
    log(`Package "${packageName}" not found in source packages`, true);
    log(`Searched in: ${srcDir}`, true);
    process.exit(1);
  }

  if (!updatePackageJson(packageName)) {
    process.exit(1);
  }

  const microfoxScopeDir = path.join(CWD_NODE_MODULES, '@microfox');
  if (!fs.existsSync(microfoxScopeDir)) {
    fs.mkdirSync(microfoxScopeDir, { recursive: true });
  }

  const destDir = path.join(CWD_NODE_MODULES, '@microfox', packageShortName);

  log(`Copying package files...`);
  if (copyDirectory(srcDir, destDir)) {
    logSection(`✅ SUCCESS`);
    logSuccess(`Package ${packageName} installed for local development!`);
    log(`Package location: ${destDir}`);
  } else {
    log(`Failed to copy package files`, true);
    process.exit(1);
  }
}

function installAllPackages() {
  log('Installing all @microfox/* packages with "*" version from package.json...');

  const packageJson = JSON.parse(fs.readFileSync(CWD_PACKAGE_JSON, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const microfoxPackages = Object.entries(dependencies)
    .filter(([name, version]) => name.startsWith('@microfox/') && version === '*')
    .map(([name]) => name);

  if (microfoxPackages.length === 0) {
    log('ℹ️  No @microfox/* packages with "*" version found in package.json');
    return;
  }

  log(`Found ${microfoxPackages.length} @microfox/* packages to install:`);
  microfoxPackages.forEach(pkg => log(`  - ${pkg}`));

  const microfoxScopeDir = path.join(CWD_NODE_MODULES, '@microfox');
  if (!fs.existsSync(microfoxScopeDir)) {
    fs.mkdirSync(microfoxScopeDir, { recursive: true });
  }

  let successCount = 0;
  let failureCount = 0;

  for (const packageName of microfoxPackages) {
    const packageShortName = packageName.replace('@microfox/', '');
    const srcDir = path.join(MICROFOX_NODE_MODULES, '@microfox', packageShortName);
    const destDir = path.join(CWD_NODE_MODULES, '@microfox', packageShortName);

    if (!fs.existsSync(srcDir)) {
      log(`⚠️  Package ${packageName} not found in source node_modules, skipping...`);
      failureCount++;
      continue;
    }

    if (copyDirectory(srcDir, destDir)) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  log(`\n📊 Installation Summary:`);
  log(`  ✅ Successfully installed: ${successCount} packages`);
  if (failureCount > 0) {
    log(`  ❌ Failed to install: ${failureCount} packages`);
  }
}

export async function runExperimentalInstall(packages: string[], targetDirName: string) {
  try {
    logSection('Microfox Local Package Installer (Experimental)');
    log(`Started at: ${new Date().toLocaleString()}`);
    log(`Working directory: ${process.cwd()}`);

    const sourceDir = findSourceDir(targetDirName);
    if (!sourceDir) {
        log(`Could not find source directory '${targetDirName}' in any parent of a .git directory.`, true)
        log(`Searched up to 10 levels from ${process.cwd()}`, true)
        process.exit(1);
    }
    log(`Found source directory at: ${sourceDir}`);
    MICROFOX_NODE_MODULES = path.join(sourceDir, 'node_modules');

    if (!fs.existsSync(MICROFOX_NODE_MODULES)) {
      log(`Source node_modules directory not found at: ${MICROFOX_NODE_MODULES}`, true);
      log(`Please run 'npm install' or 'pnpm install' in ${sourceDir}`, true);
      process.exit(1);
    }

    if (!fs.existsSync(CWD_PACKAGE_JSON)) {
      log(`package.json not found in current directory: ${CWD_PACKAGE_JSON}`, true);
      process.exit(1);
    }

    if (packages.length > 0) {
      log(`Installing ${packages.length} specific package(s)...`);
      for (let i = 0; i < packages.length; i++) {
        const packageName = packages[i];
        log(`\n[${i + 1}/${packages.length}] Processing: ${packageName}`);
        installSpecificPackage(packageName);
      }
      logSection('🎉 All Specified Packages Installed Successfully');
    } else {
      installAllPackages();
    }
  } catch (error: any) {
    log('', true);
    log(`Unexpected error occurred: ${error.message}`, true);
    if (error.stack) {
      log(`Stack trace: ${error.stack}`, true);
    }
    process.exit(1);
  }
} 