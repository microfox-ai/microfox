import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import dotenv from 'dotenv';
import { z } from 'zod';
import { PackageInfo } from '../../types';
import { generateObject } from 'ai';
import { models } from '../../ai/models';

// Load environment variables
dotenv.config();

// Define the input schema
const InputSchema = z.object({
  githubUrl: z.string().url(),
});

// Function to extract owner, repo, and path from GitHub URL
function extractGitHubInfo(githubUrl: string): {
  owner: string;
  repo: string;
  path: string;
} {
  // Handle URLs with /tree/ or /blob/ in them
  const regex =
    /github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:tree|blob)\/[^\/]+\/(.+))?/;
  const match = githubUrl.match(regex);

  if (!match) {
    throw new Error(`Invalid GitHub URL: ${githubUrl}`);
  }

  return {
    owner: match[1],
    repo: match[2],
    path: match[3] || '',
  };
}

// Function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to fetch README.md from GitHub
async function fetchReadme(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
): Promise<string> {
  try {
    // Try to find README.md in the specified path
    const readmePath = path ? `${path}/README.md` : 'README.md';

    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path: readmePath,
      },
    );

    if ('content' in response.data) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } else {
      throw new Error('README.md not found or is not a file');
    }
  } catch (error) {
    console.error('Error fetching path:', path);
    // If the path contains 'package/' and the initial attempt failed, try the parent root
    if (path && path.includes('packages/')) {
      try {
        const response = await octokit.request(
          'GET /repos/{owner}/{repo}/contents/{path}',
          {
            owner,
            repo,
            path: 'README.md',
          },
        );

        if ('content' in response.data) {
          return Buffer.from(response.data.content, 'base64').toString('utf-8');
        }
      } catch (parentError) {
        console.error(
          'Error fetching README.md from parent root:',
          parentError,
        );
      }
    } else {
      console.error('Error fetching README.md:', error);
    }
    return '';
  }
}

// Function to fetch package.json from GitHub
async function fetchPackageJson(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
): Promise<any> {
  try {
    // Try to find package.json in the specified path
    const packageJsonPath = path ? `${path}/package.json` : 'package.json';

    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner,
        repo,
        path: packageJsonPath,
      },
    );

    if ('content' in response.data) {
      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8',
      );
      return JSON.parse(content);
    } else {
      throw new Error('package.json not found or is not a file');
    }
  } catch (error) {
    console.error('Error fetching package.json:', error);
    return null;
  }
}

// Function to create package-info.json
async function createPackageInfo(packageJson: any, readme: string) {
  const packageName = packageJson.name;
  const formattedPackageName = packageName.replace('/', '#');
  const directoryName = `@ext_${formattedPackageName}`;

  // Search for the logo
  const logoDir = path.join(__dirname, '../../logos');
  let listItemsInDirectory: string[] = [];
  if (fs.existsSync(logoDir)) {
    listItemsInDirectory = fs.readdirSync(logoDir);
  } else {
    console.warn(`Logo directory not found: ${logoDir}`);
  }

  let icon = '';
  if (listItemsInDirectory.length > 0) {
    try {
      const { object: logo } = await generateObject({
        model: models.googleGeminiPro,
        system: `You are a helpful assistant that searches the correct logo file slug (without extension) for the package based on its title and description. Pick the most relevant logo slug from the provided list. If no relevant logo is found, do not return a logo slug.`,
        prompt: `Available logo file slugs (without extensions like .svg): ${listItemsInDirectory.map(f => f.replace('.svg', '')).join(', ')}. Pick the most appropriate logo slug for the package titled "${packageJson.name}" with description: "${packageJson.description}".`,
        schema: z.object({
          logo: z
            .string()
            .describe(
              'Picked slug of the logo (e.g., "google-sheets", "slack")',
            )
            .optional(),
        }),
      });
      console.log('logo picked:', logo);
      if (logo.logo) {
        const logoFileName = listItemsInDirectory.find(f =>
          f.startsWith(logo.logo + '.'),
        );
        if (logoFileName) {
          icon = `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${logoFileName}`;
          console.log(`Icon set to: ${icon}`);
        } else {
          console.warn(
            `Selected logo slug "${logo.logo}" does not correspond to a file in the logos directory.`,
          );
        }
      }
    } catch (logoError) {
      console.error('Error generating logo suggestion:', logoError);
    }
  } else {
    console.log('No logos found in directory to select from.');
  }

  return {
    name: packageName,
    title: packageJson.name || 'Unknown Package',
    description: packageJson.description || 'No description available',
    platformType: 'tool',
    path: `packages/${directoryName}`,
    dependencies: packageJson.dependencies
      ? Object.keys(packageJson.dependencies)
      : [],
    status: 'external',
    authEndpoint: '',
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon:
      icon ||
      `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${packageName.split('/')[1] || packageName}-icon.svg`,
    constructors: [],
    extraInfo: [],
  } as PackageInfo;
}

// Function to process a single GitHub URL
export async function processGitHubUrl(githubUrl: string): Promise<void> {
  console.log(`Processing GitHub URL: ${githubUrl}`);

  // Initialize Octokit
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  // Validate input
  try {
    InputSchema.parse({ githubUrl });
  } catch (error) {
    console.error('Invalid input:', error);
    return;
  }

  // Extract GitHub info
  const { owner, repo, path: repoPath } = extractGitHubInfo(githubUrl);

  // Fetch README.md and package.json from GitHub
  const readme = await fetchReadme(octokit, owner, repo, repoPath);
  const packageJson = await fetchPackageJson(octokit, owner, repo, repoPath);

  if (!packageJson) {
    console.error('Failed to fetch package.json');
    return;
  }

  // Create package info
  const packageInfo = await createPackageInfo(packageJson, readme);

  // Create directory
  const formattedPackageName = packageJson.name.replace('/', '#');
  const directoryName = `@ext_${formattedPackageName}`;
  const directoryPath = path.join(process.cwd(), '../packages', directoryName);

  ensureDirectoryExists(directoryPath);

  // Save README.md
  fs.writeFileSync(path.join(directoryPath, 'README.md'), readme);

  // Save package.json as @ext_package.json
  fs.writeFileSync(
    path.join(directoryPath, `@ext_package.json`),
    JSON.stringify(packageJson, null, 2),
  );

  // Save package-info.json
  fs.writeFileSync(
    path.join(directoryPath, 'package-info.json'),
    JSON.stringify(packageInfo, null, 2),
  );

  console.log(`Successfully created package in ${directoryPath}`);
}

// Main function
async function main() {
  // Get GitHub URL from command line arguments
  const githubUrl = process.argv[2];

  if (!githubUrl) {
    console.error('Please provide a GitHub URL as a command line argument');
    process.exit(1);
  }

  // Process the GitHub URL
  await processGitHubUrl(githubUrl);
  console.log('Package processed successfully');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}
