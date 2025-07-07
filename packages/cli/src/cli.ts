import { Command } from 'commander';
import chalk from 'chalk';
import { kickstartCommand } from './commands/kickstart';
import { version } from '../package.json';

const program = new Command();

program
  .name('microfox')
  .description('Universal CLI tool for creating modern TypeScript packages')
  .version(version);

program
  .command('kickstart')
  .description('Kickstart a new TypeScript SDK package with modern tooling')
  .action(async () => {
    try {
      console.log(chalk.blue('🚀 Package Kickstarter\n'));
      await kickstartCommand();
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