import * as tar from 'tar';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import chalk from 'chalk';
import ora from 'ora';
import minimist from 'minimist';

async function getGitignorePatterns(directory) {
  const gitignorePath = path.join(directory, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf-8');
    return gitignoreContent
      .split('\n')
      .filter((line) => line && !line.startsWith('#'));
  }
  return [];
}

async function packDirectory(sourceDir) {
  const spinner = ora(`Packing directory: ${sourceDir}`).start();

  try {
    const gitignorePatterns = await getGitignorePatterns(sourceDir);
    const ignorePatterns = [
      'node_modules/**',
      '.next/**',
      '.chat/**',
      '.studio/**',
      '.env',
      ...gitignorePatterns,
    ];

    const files = await glob('**/*', {
      cwd: sourceDir,
      ignore: ignorePatterns,
      nodir: true,
      dot: true,
    });

    const outputFileName = `${path.basename(sourceDir)}.tar.gz`;
    const outputDir = path.resolve(process.cwd(), 'packages/cli/src/templates');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputFilePath = path.join(outputDir, outputFileName);

    await tar.c(
      {
        gzip: true,
        file: outputFilePath,
        cwd: sourceDir,
      },
      files,
    );

    spinner.succeed(
      chalk.green(`✓ Successfully packed into ${outputFilePath}`),
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to pack directory.'));
    console.error(error);
  }
}

const args = minimist(process.argv.slice(2));
const sourceDir = args._[0];

if (!sourceDir) {
  console.error(chalk.red('Error: Please provide a directory path to pack.'));
  process.exit(1);
}

packDirectory(sourceDir);
