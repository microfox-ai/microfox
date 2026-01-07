import { Command } from 'commander';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command';

export const compileCommand = new Command('compile')
  .description('Compile your agent without deploying (runs npx ai-worker-cli@latest push --skip-deploy)')
  .action(async () => {
    try {
      console.log(chalk.cyan('🔨 Compiling your agent...'));
      await runCommand('npx', ['@microfox/ai-worker-cli@latest', 'push', '--skip-deploy']);
      console.log(chalk.green('✅ Compilation complete!'));
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
