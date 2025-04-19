import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import { z } from 'zod';
import { EXT_PACKAGE_URLS } from './constants';

// Load environment variables
dotenv.config();

// Define the input schema
const InputSchema = z.object({
  githubUrl: z.string().url(),
});

// Define the package info schema based on the existing structure
const PackageInfoSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  path: z.string(),
  dependencies: z.array(z.string()),
  status: z.string(),
  authEndpoint: z.string().optional(),
  documentation: z.string().optional(),
  icon: z.string().optional(),
  readme_map: z
    .object({
      path: z.string(),
      title: z.string(),
      functionalities: z.array(z.string()),
      description: z.string(),
    })
    .optional(),
  constructors: z.array(z.any()).optional(),
  keysInfo: z.array(z.any()).optional(),
  extraInfo: z.array(z.any()).optional(),
});

type PackageInfo = z.infer<typeof PackageInfoSchema>;

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

    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: readmePath,
    });

    if ('content' in response.data) {
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    } else {
      throw new Error('README.md not found or is not a file');
    }
  } catch (error) {
    console.error('Error fetching README.md:', error);
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

    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: packageJsonPath,
    });

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
function createPackageInfo(packageJson: any, readme: string): PackageInfo {
  const packageName = packageJson.name;
  const formattedPackageName = packageName.replace('/', '#');
  const directoryName = `@ext_${formattedPackageName}`;

  return {
    name: packageName,
    title: packageJson.name || 'Unknown Package',
    description: packageJson.description || 'No description available',
    path: `packages/${directoryName}`,
    dependencies: packageJson.dependencies
      ? Object.keys(packageJson.dependencies)
      : [],
    status: 'semiStable',
    authEndpoint: '',
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon: `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${packageName.split('/')[1] || packageName}-icon.svg`,
    readme_map: {
      path: '/README.md',
      title: packageJson.name || 'Unknown Package',
      functionalities: [],
      description: 'The full README for the package',
    },
    constructors: [],
    keysInfo: [],
    extraInfo: [],
  };
}

// Function to process a single GitHub URL
async function processGitHubUrl(
  githubUrl: string,
  octokit: Octokit,
): Promise<void> {
  console.log(`Processing GitHub URL: ${githubUrl}`);

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
  const packageInfo = createPackageInfo(packageJson, readme);

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
  // Initialize Octokit
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  // Process each GitHub URL in the array
  for (const githubUrl of EXT_PACKAGE_URLS) {
    await processGitHubUrl(githubUrl, octokit);
  }

  console.log('All packages processed successfully');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
