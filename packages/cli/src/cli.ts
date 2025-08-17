import { Command } from 'commander';
import chalk from 'chalk';
import { kickstartCommand } from './commands/kickstart';
import { addCommand } from './commands/add';
import { pushCommand } from './commands/push';
import { statusCommand, logsCommand, metricsCommand } from './commands/status';
import { codeCommand } from './commands/code';
import { installCommand } from './commands/install';
import { updateCommand } from './commands/update';
import { version } from '../package.json';
import { track } from './commands/track.js';
import { trackCi } from './commands/track-ci.js';
import { openapi } from './commands/openapi.js';

const program = new Command();

program
  .name('microfox')
  .description('Universal CLI tool for creating and managing Microfox projects')
  .version(version);

program.addCommand(kickstartCommand);
program.addCommand(pushCommand);
program.addCommand(statusCommand);
program.addCommand(logsCommand);
program.addCommand(metricsCommand);
program.addCommand(codeCommand);
program.addCommand(installCommand);
program.addCommand(updateCommand);
program.addCommand(track);
program.addCommand(trackCi);
program.addCommand(openapi);

program.action(() => {
  // Show help if no command is provided
  if (process.argv.length <= 2) {
    program.help();
  }
});

program.parse(process.argv); 
