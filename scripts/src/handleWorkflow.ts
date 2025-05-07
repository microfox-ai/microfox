import { generateSDK } from './genPackage';
import { fixBuildIssues } from './fixBuildIssues';
import fs from 'fs';
import path from 'path';
import { PackageFoxRequest } from './process-issue';
import { fixPackage } from './fixPackage';
import { fixBug } from './fixBug';
import { cleanupUsage } from './ai/usage/cleanupUsage';
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
        // Assuming genPackage takes query and url
        const result = await generateSDK({
          query: packageQuery,
          url: baseUrl,
          isBaseUrl: true,
        }); // Adjust args as needed
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
      case 'pkg-build':
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for pkg-build');
          process.exit(1);
        }
        console.log(`Running fixBuildIssues for package: "${packageName}"`);
        // Assuming fixBuildIssues takes packageName
        await fixBuildIssues(packageName); // Adjust args as needed
        await cleanupUsage();
        break;
      case 'bug': // Example for future bug fixing type
        if (!packageName) {
          console.error('Error: Missing PACKAGE_NAME for pkg-bug');
          process.exit(1);
        }
        console.log(`Running fixPackage for package: "${packageName}"`);
        // Assuming fixPackage takes packageName
        await fixBug(packageName, request); // Adjust args as needed
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
