import { Command } from 'commander';
import chalk from 'chalk';
import { kickstartCommand } from './commands/kickstart';
import { addCommand } from './commands/add';
import { pushCommand } from './commands/push';
import { statusCommand, logsCommand, metricsCommand } from './commands/status';
import { codeCommand } from './commands/code';
import { version } from '../package.json';

const program = new Command();

program
  .name('microfox')
  .description('Universal CLI tool for creating and managing Microfox projects')
  .version(version);

program
  .command('kickstart')
  .description('Kickstart a new TypeScript SDK or agent package')
  .action(async () => {
    try {
      console.log(chalk.blue('🚀 Package Kickstarter\n'));
      await kickstartCommand();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('add')
  .description('Add features to a Microfox project')
  .action(async () => {
    try {
      await addCommand();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('push')
  .description('Deploy your agent to the Microfox platform')
  .action(async () => {
    try {
      await pushCommand();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('status [runId]')
  .description('Check the deployment status of your agent')
  .action(async (runId) => {
    try {
      await statusCommand(runId);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('logs [runId]')
  .description('View the deployment logs for your agent')
  .action(async (runId) => {
    try {
      await logsCommand(runId);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('metrics [runId]')
  .description('View the deployment metrics for your agent')
  .action(async (runId) => {
    try {
      await metricsCommand(runId);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program
  .command('code')
  .description('Run the code agent for your project')
  .action(async () => {
    try {
      await codeCommand();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Show help if no command is provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv); 