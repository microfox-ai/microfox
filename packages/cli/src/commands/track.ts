import { Command } from 'commander';
import { runCommand } from '../utils/run-command';

export const track = new Command('track')
  .description('Run tracker scripts locally.')
  .option('--file <path>', 'Run a single tracker file instead of all.')
  .action(async (options) => {
    const args = ['@microfox/tracker-cli@latest', 'track'];
    if (options.file) {
      args.push('--file', options.file);
    }
    await runCommand('npx', args);
  }); 