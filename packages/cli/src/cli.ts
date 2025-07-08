import { Command } from 'commander';
import chalk from 'chalk';
import { kickstartCommand } from './commands/kickstart';
import { pushCommand } from './commands/push';
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

// Show help if no command is provided
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv); 