import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import readlineSync from 'readline-sync';
import { getWorkingDirectory } from '../utils/getProjectRoot';

async function addBackgroundAgentFunctions(name: string): Promise<void> {
  const workingDir = getWorkingDirectory();
  const functionsDir = path.join(workingDir, 'src', 'functions', name);

  // if (fs.existsSync(functionsDir)) {
  //   throw new Error(`Directory already exists at ${functionsDir}`);
  // }

  console.log(
    chalk.blue(
      `🚀 Adding background agent functions ${chalk.bold(name)} at ${functionsDir}\n`,
    ),
  );

  fs.mkdirSync(functionsDir, { recursive: true });

  const templateDir = path.resolve(__dirname, 'background-agent', 'src', 'functions');

  const entries = fs.readdirSync(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);
    const destPath = path.join(functionsDir, entry.name.replace(/\.txt$/, ''));

    if (!entry.isDirectory() && entry.name.endsWith('.txt')) {
      const templateContent = fs.readFileSync(srcPath, 'utf-8');
      const content = templateContent.replace(/<%= agentName %>/g, name);
      fs.writeFileSync(destPath, content);
      console.log(chalk.green(`✅ Created ${path.relative(workingDir, destPath)}`));
    }
  }
}

async function addAction(): Promise<void> {
  console.log(chalk.cyan("✨ Add new features to your project!\n"));

  const workingDir = getWorkingDirectory();
  const microfoxConfigPath = path.join(workingDir, 'microfox.json');
  if (!fs.existsSync(microfoxConfigPath)) {
    console.log(chalk.red('Error: `microfox.json` not found in the current directory.'));
    console.log(chalk.red('Please run this command from the root of a Microfox project.'));
    return;
  }

  const { featureType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'featureType',
      message: 'Select what you want to add:',
      choices: ['background_agent_functions'],
    },
  ]);

  if (!featureType) {
    console.log(chalk.yellow('Operation cancelled.'));
    return;
  }

  if (featureType === 'background_agent_functions') {
    const functionName = readlineSync.question(
      chalk.yellow('📦 Enter a name for the new functions: '),
    );

    if (!functionName.trim()) {
      throw new Error('Function name cannot be empty');
    }

    await addBackgroundAgentFunctions(functionName.trim());

    console.log(
      chalk.green(
        `\n🎉 Successfully added background agent functions ${chalk.bold(functionName)}!`,
      ),
    );
    console.log(chalk.gray(`📍 Located at src/functions/${functionName.trim()}`));
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log(chalk.yellow('   1. Check the new files in src/functions/'));
    console.log(chalk.yellow('   2. Update your agent logic to use the new functions.'));
  }
}

export const addCommand = new Command('add')
    .description('Add features to a Microfox project')
    .action(async () => {
        try {
            await addAction();
        } catch (error) {
            console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
            process.exit(1);
        }
    }); 