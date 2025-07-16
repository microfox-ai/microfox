import { Command } from 'commander';
import { runExperimentalInstall } from '../utils/experimental-installer';

export const installCommand = new Command('install')
  .description('Install packages for local development.')
  .argument('[packages...]', 'Specific packages to install')
  .option('--experimental', 'Enable experimental features')
  .option('--target <name>', 'Specify the target source directory name', 'Microfox')
  .action(async (packages, options) => {
    if (options.experimental) {
      await runExperimentalInstall(packages, options.target);
    } else {
      console.log('This command is only available with the --experimental flag.');
      process.exit(1);
    }
  }); 