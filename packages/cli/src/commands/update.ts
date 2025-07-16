import { Command } from 'commander';
import { runUpdate } from '../utils/experimental-updater';

export const updateCommand = new Command('update')
  .description('Update @microfox packages to the latest versions from npm.')
  .argument('[packages...]', 'Specific packages to update')
  .option('--experimental', 'Enable experimental features')
  .option('--dev', 'Update packages in devDependencies')
  .action(async (packages, options) => {
    if (options.experimental) {
      await runUpdate(packages, options);
    } else {
      console.log('This command is only available with the --experimental flag.');
      process.exit(1);
    }
  }); 