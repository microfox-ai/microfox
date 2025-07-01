import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { version } from '../package.json';

const program = new Command();

program
  .name('microfox')
  .description('Universal CLI tool for creating modern TypeScript packages')
  .version(version);

program
  .command('init <packageName>')
  .description('Initialize a new npm package with modern TypeScript setup')
  .action(async (packageName: string) => {
    try {
      console.log(chalk.blue('📦 Package Initializer\n'));
      await initCommand(packageName);
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