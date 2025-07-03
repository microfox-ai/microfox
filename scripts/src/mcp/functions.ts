import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';

export const getProjectRoot = () => {
  return path.resolve(__dirname, '..', '..', '..');
};

/**
 * Returns an array of full paths to all documentation files for a given package.
 * @param packageName The name of the package directory (e.g., 'reddit').
 * @returns An array of strings, where each string is the full path to a .md file.
 */
export function getPackageDocsPath(packageName: string): string[] {
  const projectRoot = getProjectRoot();
  const packageDir = path.join(projectRoot, 'packages', packageName);
  const docsDir = path.join(packageDir, 'docs');
  const docFiles: string[] = [];

  if (!fs.existsSync(docsDir)) {
    console.warn(`Docs directory not found for package: ${packageName}`);
    return docFiles;
  }

  function findMarkdownFiles(directory: string) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findMarkdownFiles(fullPath);
      } else if (file.endsWith('.md')) {
        docFiles.push(fullPath);
      }
    }
  }

  findMarkdownFiles(docsDir);
  return docFiles;
}

/**
 * Returns an array of full paths to all code files in the 'src' directory for a given package.
 * @param packageName The name of the package directory (e.g., 'reddit').
 * @returns An array of strings, where each string is the full path to a code file.
 */
export function getPackageCodeFilesPath(packageName: string): string[] {
  const projectRoot = getProjectRoot();
  const packageDir = path.join(projectRoot, 'packages', packageName);
  const srcDir = path.join(packageDir, 'src');
  const codeFiles: string[] = [];

  if (!fs.existsSync(srcDir)) {
    console.warn(`'src' directory not found for package: ${packageName}`);
    return codeFiles;
  }

  function findFiles(directory: string) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== '__tests__') {
          findFiles(fullPath);
        }
      } else if (!file.endsWith('.test.ts') && !file.endsWith('.spec.ts')) {
        codeFiles.push(fullPath);
      }
    }
  }

  findFiles(srcDir);
  return codeFiles;
}

/**
 * Returns an array of function names for a given package.
 * It reads the 'docs/functions' directory and extracts names from the .md filenames.
 * @param packageName The name of the package directory (e.g., 'reddit').
 * @returns An array of strings, where each string is a function name.
 */
export function getAllFunctionsOfPackage(packageName: string): string[] {
  const projectRoot = getProjectRoot();
  const functionsDir = path.join(projectRoot, 'packages', packageName, 'docs', 'functions');
  const functionNames: string[] = [];

  if (!fs.existsSync(functionsDir)) {
    console.warn(`'docs/functions' directory not found for package: ${packageName}`);
    return functionNames;
  }

  const files = fs.readdirSync(functionsDir);

  for (const file of files) {
    if (file.endsWith('.md')) {
      functionNames.push(path.basename(file, '.md'));
    }
  }

  return functionNames;
}

export async function updateMicrofoxDocs(
  branch: string,
  filepath: string,
  updatedContent: string,
  baseBranch: string = 'main'
) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable not set.');
  }

  const octokit = new Octokit({ auth: token });
  const owner = 'microfox-ai';
  const repo = 'microfox';

  // 1. Get the latest commit SHA of the base branch
  const { data: baseBranchData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });
  const baseSha = baseBranchData.object.sha;

  // 2. Create a new branch from the base branch SHA
  try {
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: baseSha,
    });
    console.log(`Branch '${branch}' created.`);
  } catch (error: any) {
    if (error.status === 422) {
      console.log(`Branch '${branch}' already exists. Proceeding...`);
    } else {
      throw error;
    }
  }

  // 3. Get the current SHA of the file to be updated
  let fileSha: string | undefined;
  try {
    const { data: fileData } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filepath,
      ref: branch,
    });
    if ('sha' in fileData) {
      fileSha = fileData.sha;
    }
  } catch (error: any) {
    if (error.status !== 404) {
      throw error; // Rethrow if it's not a 'file not found' error
    }
    console.log(`File '${filepath}' not found on branch '${branch}'. Creating new file.`);
  }

  // 4. Create or update the file content
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filepath,
    message: `docs: update ${filepath}`,
    content: Buffer.from(updatedContent).toString('base64'),
    branch: branch,
    sha: fileSha, // Provide SHA if updating an existing file
  });
  console.log(`File '${filepath}' created/updated on branch '${branch}'.`);

  // 5. Create a pull request
  const { data: pr } = await octokit.rest.pulls.create({
    owner,
    repo,
    title: `Docs update for ${filepath}`,
    head: branch,
    base: baseBranch,
    body: `This PR was automatically generated to update documentation for \`${filepath}\`.`,
    maintainer_can_modify: true,
  });
  console.log(`Pull request created: ${pr.html_url}`);

  return { pullRequestUrl: pr.html_url };
}

export async function reportCodeError(
  packageName: string,
  errorMessage: string,
  functionName?: string
) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable not set.');
  }

  const octokit = new Octokit({ auth: token });
  const owner = 'microfox-ai';
  const repo = 'microfox';

  const title = functionName
    ? `Bug in ${packageName}/${functionName}`
    : `Bug in package: ${packageName}`;

  const body = `
## Bug Report

**Package:** \`${packageName}\`
${functionName ? `**Function:** \`${functionName}\`` : ''}

### Error Message:
\`\`\`
${errorMessage}
\`\`\`
  `;

  const { data: issue } = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body,
    labels: ['bug', 'reported-by-tool'],
  });

  console.log(`Issue created: ${issue.html_url}`);

  return { issueUrl: issue.html_url };
} 