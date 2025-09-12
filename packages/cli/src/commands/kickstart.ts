import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import readlineSync from 'readline-sync';
import {
  createAgentProject,
  createBackgroundAgentProject,
  createPackageProject,
  createProjectFromTemplate,
} from '../logic/build';
import { checkPackageNameAndPrompt } from '../utils/npmChecker';
import path from 'path';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import { execa } from 'execa';

async function runCommand(command: string, args: string[]) {
  try {
    await execa(command, args, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Failed to run command: ${command} ${args.join(' ')}`);
  }
}

export const kickstartCommand = new Command('kickstart')
  .description('Kickstart a new Microfox project')
  .argument('[project-name]', 'Name of the project to initialize')
  .option(
    '-t, --template <template>',
    'Template to use for initialization',
  )
  .option(
    '--path <path>',
    'Path where to initialize the project',
    process.cwd(),
  )
  .action(async (projectName, options) => {
    try {
      console.log(chalk.blue('🚀 Kickstarting Microfox...'));

      if (options.template) {
        let finalProjectName = projectName;
        if (!finalProjectName) {
          finalProjectName = readlineSync.question(
            chalk.yellow('📦 Enter project name: '),
          );
        }
        if (!finalProjectName?.trim()) {
          throw new Error('Project name cannot be empty');
        }

        await createProjectFromTemplate(
          options.template,
          finalProjectName,
          options.path,
        );

        console.log(
          chalk.green(
            `\n🎉 Successfully created project ${chalk.bold(
              finalProjectName,
            )} from template ${chalk.bold(options.template)}!`,
          ),
        );
        console.log(
          chalk.gray(
            `📍 Located at ${path.join(options.path, finalProjectName)}`,
          ),
        );
        console.log(chalk.yellow('\n💡 Next steps:'));
        console.log(chalk.yellow(`   1. cd ${path.join(options.path, finalProjectName)}`));
        console.log(chalk.yellow('   2. npm install'));
        console.log(chalk.yellow('   3. Start developing your project!'));
        return;
      }

      const { projectType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'projectType',
          message: 'What do you want to build?',
          choices: ['agent', 'microsdk'],
        },
      ]);

      if (projectType === 'microsdk') {
        const packageName = readlineSync.question(
          chalk.yellow('📦 Enter package name: '),
        );

        if (!packageName.trim()) {
          throw new Error('Package name cannot be empty');
        }

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
      } else if (projectType === 'agent') {
        const { framework } = await inquirer.prompt([
          {
            type: 'list',
            name: 'framework',
            message: 'Select the framework for your agent:',
            choices: ['nextjs (recommended)', 'x (beta)'],
          },
        ]);

        if (framework === 'nextjs (recommended)') {
          const args = ['@microfox/ai-studio-cli@latest', 'init'];
          if (projectName) {
            args.push(projectName);
          }

          if (options.template) {
            args.push('--template', options.template);
          }

          if (options.path && options.path !== process.cwd()) {
            args.push('--path', options.path);
          }
          await runCommand('npx', args);

          console.log(
            chalk.green('✅ AI Studio project kickstarted successfully!'),
          );
        } else if (framework === 'x (beta)') {
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
                `\n🎉 Successfully created background agent ${chalk.bold(
                  agentName,
                )}!`,
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
        }
      }
    } catch (error: any) {
      console.error(chalk.red('❌ Error kickstarting project:'), error.message);
      process.exit(1);
    }
  });
