import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { downloadAndExtractTemplate } from '../utils/templates';

const NPM_PUBLISHING_CONFIG = {
  scripts: {
    changeset: 'changeset',
    'ci:release': 'turbo clean && changeset publish',
    'ci:version': 'changeset version && npm install',
  },
  devDependencies: {
    '@changesets/cli': '^2.27.10',
    eslint: '8.57.1',
    prettier: '^3.3.3',
    tsup: '^8',
    turbo: '2.3.3',
    typescript: '5.6.3',
  },
  packageManager: 'npm@10.2.4',
  engines: {
    node: '>=20.0.0',
  },
};

export const initCommand = new Command('init')
  .description('Initialize a new project or add features to an existing one.')
  .option('--experimental', 'Enable experimental features')
  .action(initAction);

async function initAction(options: { experimental?: boolean }) {
  if (!options.experimental) {
    console.log(
      chalk.yellow('This command is experimental. Use --experimental to run.'),
    );
    return;
  }

  const { feature } = await inquirer.prompt([
    {
      type: 'list',
      name: 'feature',
      message: 'Which feature would you like to initialize?',
      choices: ['NPM Publishing Workflows'],
    },
  ]);

  if (feature === 'NPM Publishing Workflows') {
    console.log(chalk.green('Initializing NPM Publishing Workflows...'));

    const targetDir = process.cwd();

    try {
      await downloadAndExtractTemplate('npm-publishing', targetDir);

      console.log(
        chalk.green('NPM publishing workflow initialized successfully!'),
      );

      await updatePackageJson(targetDir);
    } catch (error) {
      console.error(chalk.red('Error initializing project:'), error);
    }
  }
}

async function updatePackageJson(targetDir: string) {
  const packageJsonPath = path.join(targetDir, 'package.json');

  let packageJson: any = {};

  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(packageJsonContent);
  } else {
    packageJson = {
      name: 'new-package',
      version: '1.0.0',
    };
  }

  packageJson.scripts = {
    ...NPM_PUBLISHING_CONFIG.scripts,
    ...packageJson.scripts,
  };

  packageJson.devDependencies = {
    ...NPM_PUBLISHING_CONFIG.devDependencies,
    ...packageJson.devDependencies,
  };

  if (!packageJson.packageManager) {
    packageJson.packageManager = NPM_PUBLISHING_CONFIG.packageManager;
  }

  packageJson.engines = {
    ...NPM_PUBLISHING_CONFIG.engines,
    ...packageJson.engines,
  };

  await fs.promises.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
  );

  console.log(chalk.green('`package.json` updated successfully!'));
}
