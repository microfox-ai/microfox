import { generateSDK } from './agents/packagefox/genPackage';
import { fixBuildIssues } from './agents/packagefox/fixBuildIssues';
import fs from 'fs';
import path from 'path';
import { PackageFoxRequest } from './process-issue';
import { fixPackage } from './agents/packagefox/fixPackage';
import { fixBug } from './agents/packagefox/fixBug';
import { cleanupUsage } from './ai/usage/cleanupUsage';
import { processGitHubUrl } from './agents/packagefox/genExtPackage';
import { generateExternalDocs } from './agents/docfox/genExtDocs';
import { generateDocs } from './agents/docfox/genDocs';
import { generateOAuthPackage } from './agents/packagefox/genOAuthPackage';
import { regenPackage } from './agents/packagefox/regenPackage';
import { generateSLSStructure } from './agents/slsfox/genSls';

/**
 * This script is used to handle the PackageFox workflow.
 * It reads the config file, which contains the requests to be processed.
 * It then processes each request in order.
 *
 * The available requests are:
 * 1. pkg-create: Generate a new package
 * 2. pkg-build: Build the package
 * 3. gen-pkg-sls: Generate SLS files for a package
 * 4. bug: Fix a bug in the package
 * 5. genExt: Generate an extension package
 * 6. genExtDocs: Generate extension documentation
 * 7. genDocs: Generate documentation
 */
async function handleWorkflow() {
  const configPath = path.join(
    process.cwd(),
    '../.microfox/packagefox-build.json',
  );
  console.log(`Reading config file from: ${configPath}`);

  let config: {
    requests: PackageFoxRequest[];
  };
  try {
    const configFileContent = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configFileContent);
  } catch (error) {
    console.error(
      `Error reading or parsing config file at ${configPath}:`,
      error,
    );
    process.exit(1);
  }

  if (!config.requests || config.requests.length === 0) {
    console.warn('No requests found in the config file. Exiting workflow.');
    process.exit(0); // Exit gracefully if no requests
  }

  // Process the first request
  const request = config.requests[0];
  const requestType = request.type;
  const packageQuery = request.query;
  const baseUrl = request.url;
  const packageName = request.packageName;

  console.log('Handling PackageFox Workflow for first request...');
  console.log('Request Type:', requestType);

  try {
    switch (requestType) {
      case 'pkg-create':
        if (!packageQuery || !baseUrl) {
          console.error(
            'Error: Missing PACKAGE_QUERY or BASE_URL for pkg-create',
          );
          process.exit(1);
        }
        console.log(
          `Running genPackage with query: "${packageQuery}", url: "${baseUrl}"`,
        );
        const result = await generateSDK({
          query: packageQuery,
          url: baseUrl,
          isBaseUrl: true,
        });
        if (result) {
          console.log(`✅ SDK generation complete for ${result.packageName}`);
          console.log(`📂 Package location: ${result.packageDir}`);
          await fixBuildIssues(result.packageName);
          await cleanupUsage();
        } else {
          console.log('⚠️ SDK generation completed with warnings or failed.');
          process.exit(1);
        }
        break;
      case 'pkg-recreate':
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for pkg-recreate');
          process.exit(1);
        }
        console.log(`Running regenPackage for package: "${packageName}"`);
        const recreateResult = await regenPackage(packageName, true);
        if (recreateResult) {
          console.log(
            `✅ SDK generation complete for ${recreateResult.packageName}`,
          );
          console.log(`📂 Package location: ${recreateResult.packageDir}`);
          await fixBuildIssues(recreateResult.packageName);
          await cleanupUsage();
        } else {
          console.log('⚠️ SDK generation completed with warnings or failed.');
          process.exit(1);
        }
        break;
      case 'pkg-create-oauth':
        if (!packageQuery || !baseUrl) {
          console.error(
            'Error: Missing PACKAGE_QUERY or BASE_URL for pkg-create-oauth',
          );
          process.exit(1);
        }
        console.log(
          `Running genOAuthPackage with query: "${packageQuery}", url: "${baseUrl}"`,
        );
        const result2 = await generateOAuthPackage({
          query: packageQuery,
          url: baseUrl,
          isBaseUrl: true,
        });
        if (result2) {
          console.log(
            `✅ OAuth package generation complete for ${result2.packageName}`,
          );
          console.log(`📂 Package location: ${result2.packageDir}`);
          await fixBuildIssues(result2.packageName);
          await cleanupUsage();
        } else {
          console.log(
            '⚠️ OAuth package generation completed with warnings or failed.',
          );
          process.exit(1);
        }
        break;
      case 'pkg-build':
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for pkg-build');
          process.exit(1);
        }
        console.log(`Running fixBuildIssues for package: "${packageName}"`);
        await fixBuildIssues(packageName);
        await cleanupUsage();
        break;
      case 'bug':
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for pkg-bug');
          process.exit(1);
        }
        console.log(`Running fixPackage for package: "${packageName}"`);
        await fixBug(packageName, request);
        await cleanupUsage();
        break;
      case 'genExt':
        if (!baseUrl) {
          console.error('Error: Missing BASE_URL for genExt');
          process.exit(1);
        }
        console.log(`Running processGitHubUrl with url: "${baseUrl}"`);
        await processGitHubUrl(baseUrl);
        await cleanupUsage();
        break;
      case 'genExtDocs':
        if (!packageName || !baseUrl) {
          console.error(
            'Error: Missing PACKAGE_NAME or BASE_URL for genExtDocs',
          );
          process.exit(1);
        }
        console.log(
          `Running generateExternalDocs for package: "${packageName}" with url: "${baseUrl}"`,
        );
        const outputDir = path.join(
          process.cwd(),
          '../packages',
          '@ext_' + packageName.replace(/\//g, '#'),
        );
        await generateExternalDocs(baseUrl, packageName, outputDir);
        await cleanupUsage();
        break;
      case 'genDocs':
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for genDocs');
          process.exit(1);
        }
        console.log(`Running generateDocs for package: "${packageName}"`);
        const packageDir = path.join(process.cwd(), '../packages', packageName);
        const packageInfoPath = path.join(packageDir, 'package-info.json');
        const packageInfo = JSON.parse(
          fs.readFileSync(packageInfoPath, 'utf8'),
        );
        const code = fs.readFileSync(
          path.join(packageDir, 'src/index.ts'),
          'utf8',
        );
        await generateDocs(code, packageInfo, packageDir);
        await cleanupUsage();
        break;
      case 'gen-pkg-sls':
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for gen-pkg-sls');
          process.exit(1);
        }
        console.log(`Running gen-pkg-sls for package: "${packageName}"`);
        await generateSLSStructure(packageName.replace('@microfox/', ''));
        await cleanupUsage();
        break;
      default:
        console.error(
          `Error: Unknown or unsupported REQUEST_TYPE: "${requestType}"`,
        );
        process.exit(1);
    }
    console.log('Workflow step completed successfully.');
  } catch (error) {
    console.error('Error during PackageFox workflow execution:', error);
    process.exit(1);
  }
}

handleWorkflow();
