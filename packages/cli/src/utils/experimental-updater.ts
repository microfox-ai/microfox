import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';

const CWD_PACKAGE_JSON = path.join(process.cwd(), 'package.json');

function log(message: string, isError = false, isWarning = false) {
  const timestamp = new Date().toLocaleTimeString();
  let prefix;

  if (isError) {
    prefix = chalk.red(`❌ [update-microfox ${timestamp}]`);
  } else if (isWarning) {
    prefix = chalk.yellow(`⚠️  [update-microfox ${timestamp}]`);
  } else {
    prefix = chalk.blue(`ℹ️  [update-microfox ${timestamp}]`);
  }

  console.log(`${prefix} ${message}`);
}

function logSuccess(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(chalk.green(`✅ [update-microfox ${timestamp}] ${message}`));
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function updatePackage(packageName: string, isDev: boolean): boolean {
  log(`Updating package to latest: ${packageName}`);
  const saveFlag = isDev ? '--save-dev' : '--save';
  try {
    execSync(`npm install ${packageName}@latest ${saveFlag}`, { cwd: process.cwd(), stdio: 'pipe' });
    logSuccess(`Successfully updated ${packageName} to the latest version from npm.`);
    return true;
  } catch (error: any) {
    log(`Failed to update ${packageName}: ${error.message}`, true);
    log(`Stderr: ${error.stderr?.toString()}`, true);
    return false;
  }
}

function updateSpecificPackage(packageName: string, isDevFlag: boolean) {
  logSection(`Updating Specific Package: ${packageName}`);

  const packageJson = JSON.parse(fs.readFileSync(CWD_PACKAGE_JSON, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  let isDev = !!devDependencies[packageName];

  if (!dependencies[packageName] && !devDependencies[packageName]) {
    log(`Package "${packageName}" not found in dependencies.`, false, true);
    log(`Attempting to install it as a new package...`, false, true);
    isDev = isDevFlag;
  } else {
    log(`Package found in ${isDev ? 'devDependencies' : 'dependencies'}.`);
  }

  if (updatePackage(packageName, isDev)) {
    logSection(`✅ SUCCESS`);
    logSuccess(`Package ${packageName} updated successfully!`);
  } else {
    log(`Failed to update ${packageName}`, true);
    process.exit(1);
  }
}

function updateAllPackages() {
  logSection('Updating all @microfox/* packages to latest');

  const packageJson = JSON.parse(fs.readFileSync(CWD_PACKAGE_JSON, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  const allDependencies = { ...dependencies, ...devDependencies };

  const microfoxPackages = Object.entries(allDependencies)
    .filter(([name]) => name.startsWith('@microfox/'))
    .map(([name]) => name);

  if (microfoxPackages.length === 0) {
    log('ℹ️  No @microfox/* packages found in package.json.');
    return;
  }

  log(`Found ${microfoxPackages.length} packages to update:`);
  microfoxPackages.forEach(pkg => log(`  - ${pkg}`));

  let successCount = 0;
  let failureCount = 0;

  for (const packageName of microfoxPackages) {
    const isDev = !!devDependencies[packageName];
    if (updatePackage(packageName, isDev)) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  log(`\n📊 Update Summary:`);
  log(`  ✅ Successfully updated: ${successCount} packages`);
  if (failureCount > 0) {
    log(`  ❌ Failed to update: ${failureCount} packages`);
  }
}

export async function runUpdate(packages: string[], options: { dev?: boolean }) {
  try {
    logSection('Microfox Package Updater (Experimental)');

    if (!fs.existsSync(CWD_PACKAGE_JSON)) {
      log(`package.json not found in ${process.cwd()}`, true);
      process.exit(1);
    }

    if (packages.length > 0) {
      log(`Updating ${packages.length} specific package(s)...`);
      packages.forEach(pkg => updateSpecificPackage(pkg, !!options.dev));
      logSection('🎉 All specified packages processed.');
    } else {
      updateAllPackages();
    }
  } catch (error: any) {
    log('', true);
    log(`An unexpected error occurred: ${error.message}`, true);
    if (error.stack) {
      log(`Stack trace: ${error.stack}`, true);
    }
    process.exit(1);
  }
} 