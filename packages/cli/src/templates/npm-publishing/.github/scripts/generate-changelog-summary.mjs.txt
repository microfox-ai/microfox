import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Get the base and head SHAs from environment variables
const baseSha = process.env.GITHUB_BASE_SHA;
const headSha = process.env.GITHUB_HEAD_SHA;

// Get the git diff between base and head
const getDiff = () => {
  try {
    return execSync(`git diff ${baseSha} ${headSha} -- packages/`, {
      encoding: 'utf8',
    });
  } catch (error) {
    console.error('Error getting git diff:', error);
    return '';
  }
};

// Get the list of changed files
const getChangedFiles = () => {
  try {
    return execSync(`git diff --name-only ${baseSha} ${headSha} -- packages/`, {
      encoding: 'utf8',
    })
      .split('\n')
      .filter(file => file);
  } catch (error) {
    console.error('Error getting changed files:', error);
    return [];
  }
};

// Generate summary for each package
const generatePackageSummary = (packageName, diff) => {
  const packageDiff = diff
    .split('\n')
    .filter(line => line.includes(`packages/${packageName}/`));

  // Count changes by type
  const additions = packageDiff.filter(line => line.startsWith('+')).length;
  const deletions = packageDiff.filter(line => line.startsWith('-')).length;

  return {
    package: packageName,
    changes: {
      additions,
      deletions,
      total: additions + deletions,
    },
  };
};

// Main function
const main = () => {
  const diff = getDiff();
  const changedFiles = getChangedFiles();

  // Group files by package
  const packageChanges = new Map();
  changedFiles.forEach(file => {
    const packageName = file.split('/')[1];
    if (!packageName) return;

    if (!packageChanges.has(packageName)) {
      packageChanges.set(
        packageName,
        generatePackageSummary(packageName, diff),
      );
    }
  });

  // Generate changelog entry
  const prBody = process.env.PR_BODY || '';
  const changelogEntry = `## Changes in this PR\n\n`;
  const packageEntries = Array.from(packageChanges.values())
    .map(({ package: packageName, changes }) => {
      return (
        `### ${packageName}\n` +
        `- Total changes: ${changes.total} lines\n` +
        `- Additions: ${changes.additions} lines\n` +
        `- Deletions: ${changes.deletions} lines\n`
      );
    })
    .join('\n');

  // Add PR body if it exists
  const prBodySection = prBody
    ? `\n### Pull Request Description\n\n${prBody}\n`
    : '';

  // Update CHANGELOG.md
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  let changelog = '';

  try {
    changelog = fs.readFileSync(changelogPath, 'utf8');
  } catch (error) {
    console.log('Creating new CHANGELOG.md file');
  }

  const newChangelog =
    changelogEntry + packageEntries + prBodySection + '\n\n' + changelog;
  fs.writeFileSync(changelogPath, newChangelog);

  // Generate changeset for each package
  const changesetContent = Array.from(packageChanges.values())
    .map(({ package: packageName, changes }) => {
      return `---
"${packageName}": patch
---

Changes from PR #${process.env.PR_NUMBER || 'unknown'}: ${process.env.PR_TITLE || 'unknown'}`;
    })
    .join('\n\n');

  // Write changeset file
  const changesetDir = path.join(process.cwd(), '.changeset');
  if (!fs.existsSync(changesetDir)) {
    fs.mkdirSync(changesetDir);
  }

  const changesetFile = path.join(
    changesetDir,
    `generated-${process.env.GITHUB_SHA || Date.now()}.md`,
  );
  fs.writeFileSync(changesetFile, changesetContent);

  console.log('Changelog summary generated successfully');
};

main();
