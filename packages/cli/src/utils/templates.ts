import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);
const GITHUB_REPO_URL = 'https://github.com/microfox-ai/microfox';

async function downloadTarball(url: string, dest: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download tarball: ${response.statusText}`);
  }
  if (!response.body) {
    throw new Error('Response body is null');
  }
  // @ts-ignore
  await pipeline(response.body, fs.createWriteStream(dest));
}

export async function downloadAndExtractTemplate(
  template: string,
  destination: string,
): Promise<void> {
  const spinner = ora(
    `Downloading template '${chalk.cyan(template)}' from GitHub...`,
  ).start();
  try {
    const tarballUrl = `${GITHUB_REPO_URL}/raw/main/templates/${template}.tar.gz`;
    const tempTarballPath = path.join(destination, 'template.tar.gz');

    await downloadTarball(tarballUrl, tempTarballPath);

    spinner.text = 'Extracting template...';
    await execa('tar', ['-xzf', tempTarballPath, '-C', destination]);

    fs.unlinkSync(tempTarballPath); // Clean up the tarball

    spinner.succeed(chalk.green('Template downloaded and extracted successfully!'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to download or extract template.'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    throw error;
  }
}
