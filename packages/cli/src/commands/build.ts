import { Command } from 'commander';
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import inquirer from 'inquirer';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import { checkPackageNameAndPrompt } from '../utils/npmChecker';
import {
  createAgentProject,
  createBackgroundAgentProject,
  createPackageProject,
} from '../logic/build';
import path from 'path';

async function kickstartAction(): Promise<void> {
  console.log(chalk.cyan("🚀 Let's kickstart your new project!\n"));

  const { boilerplateType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'boilerplateType',
      message: 'Select boilerplate type:',
      choices: ['package', 'agent'],
    },
  ]);

  if (!boilerplateType) {
    console.log(chalk.yellow('Operation cancelled.'));
    return;
  }

  if (boilerplateType === 'agent') {
    const { agentType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'agentType',
        message: 'Select agent type:',
        choices: ['plain', 'background'],
      },
    ]);

    if (agentType === 'plain') {
      const agentName = readlineSync.question(
        chalk.yellow('📦 Enter agent name: '),
      );

      if (!agentName.trim()) {
        throw new Error('Agent name cannot be empty');
      }
      await createAgentProject(agentName.trim());

      console.log(
        chalk.green(
          `\n🎉 Successfully created agent ${chalk.bold(agentName)}!`,
        ),
      );
      console.log(
        chalk.gray(
          `📍 Located at ${path.join(getWorkingDirectory(), agentName)}`,
        ),
      );
      console.log(chalk.yellow('\n💡 Next steps:'));
      console.log(chalk.yellow(`   1. cd ${agentName}`));
      console.log(chalk.yellow('   2. npm install'));
      console.log(chalk.yellow('   3. Configure your env.json'));
      console.log(chalk.yellow('   4. npm run dev'));
      console.log(chalk.yellow('   5. Start developing your agent!'));
    } else if (agentType === 'background') {
      const agentName = readlineSync.question(
        chalk.yellow('📦 Enter agent name: '),
      );

      if (!agentName.trim()) {
        throw new Error('Agent name cannot be empty');
      }
      await createBackgroundAgentProject(agentName.trim());

      console.log(
        chalk.green(
          `\n🎉 Successfully created background agent ${chalk.bold(agentName)}!`,
        ),
      );
      console.log(
        chalk.gray(
          `📍 Located at ${path.join(getWorkingDirectory(), agentName)}`,
        ),
      );
      console.log(chalk.yellow('\n💡 Next steps:'));
      console.log(chalk.yellow(`   1. cd ${agentName}`));
      console.log(chalk.yellow('   2. npm install'));
      console.log(chalk.yellow('   3. Configure your env.json'));
      console.log(chalk.yellow('   4. npm run dev'));
      console.log(chalk.yellow('   5. Start developing your agent!'));
    }
  } else if (boilerplateType === 'package') {
    // Ask for package name interactively
    const packageName = readlineSync.question(
      chalk.yellow('📦 Enter package name: '),
    );

    if (!packageName.trim()) {
      throw new Error('Package name cannot be empty');
    }

    // Check npm availability and get final package name
    const finalPackageName = await checkPackageNameAndPrompt(
      `@microfox/${packageName.trim()}`,
    );
    await createPackageProject(finalPackageName);

    const simpleName = finalPackageName.includes('/')
      ? finalPackageName.split('/')[1]
      : finalPackageName;

    console.log(
      chalk.green(
        `\n🎉 Successfully created package ${chalk.bold(finalPackageName)}!`,
      ),
    );
    console.log(
      chalk.gray(
        `📍 Located at ${path.join(getWorkingDirectory(), simpleName)}`,
      ),
    );
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log(chalk.yellow(`   1. cd ${simpleName}`));
    console.log(chalk.yellow('   2. npm install'));
    console.log(chalk.yellow('   3. npm run build'));
    console.log(chalk.yellow('   4. npm test'));
    console.log(chalk.yellow('   5. Start developing your SDK!'));
    console.log(
      chalk.gray(
        `\n📚 Your package is ready to be published to npm as "${finalPackageName}"`,
      ),
    );
  } else {
    console.log(
      chalk.red(
        'Invalid boilerplate type selected. Please choose "package" or "agent".',
      ),
    );
  }
}

export const buildCommand = new Command('build')
  .description('Kickstart a new TypeScript SDK or agent package')
  .action(async () => {
    try {
      console.log(
        chalk.yellow(
          'Warning: The "build" command is deprecated and will be removed in a future version. Please use "kickstart" instead.',
        ),
      );
      console.log(chalk.blue('🚀 Package Kickstarter\n'));
      await kickstartAction();
    } catch (error) {
      console.error(
        chalk.red('❌ Error:'),
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  });
