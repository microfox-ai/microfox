import { Command } from 'commander';
import { runCommand } from '../utils/run-command';

export const trackCi = new Command('track-ci')
  .description('Generate GitHub Actions workflows from tracker scripts.')
  .action(async () => {
    await runCommand('npx', ['@microfox/tracker-cli@latest', 'track-ci']);
  }); 