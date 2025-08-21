import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';

const NPM_PUBLISHING_CONFIG = {
  scripts: {
    changeset: 'changeset',
    'ci:release': 'turbo clean && changeset publish',
    'ci:version': 'changeset version && npm install',
  },
  devDependencies: {
    '@changesets/cli': '^2.27.1',
  },
};

export const initCommand = new Command('init')
  .description('Initialize a new project or add features to an existing one.')
  .option('--experimental', 'Enable experimental features')
  .action(initAction);

async function initAction(options: { experimental?: boolean }) {
  if (!options.experimental) {
    console.log(
      chalk.yellow('This command is experimental. Use --experimental to run.')
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
    
    const templateDir = path.resolve(__dirname, 'npm-publishing');
    const targetDir = process.cwd();

    try {
      copyTemplates(templateDir, targetDir);
      console.log(chalk.green('NPM publishing workflow initialized successfully!'));

      await updatePackageJson(targetDir);
    } catch (error) {
      console.error(chalk.red('Error initializing project:'), error);
    }
  }
}

function copyTemplates(src: string, dest: string) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name.replace(/\.txt$/, ''));

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyTemplates(srcPath, destPath);
    } else if (entry.name.endsWith('.txt')) {
      const templateContent = fs.readFileSync(srcPath, 'utf-8');
      fs.writeFileSync(destPath, templateContent);
      console.log(chalk.green(`✅ Created ${path.relative(process.cwd(), destPath)}`));
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
    ...packageJson.scripts,
    ...NPM_PUBLISHING_CONFIG.scripts,
  };

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...NPM_PUBLISHING_CONFIG.devDependencies,
  };

  await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(chalk.green('`package.json` updated successfully!'));
}
