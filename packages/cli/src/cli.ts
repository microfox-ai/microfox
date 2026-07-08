import { Command } from 'commander';
import chalk from 'chalk';
import { buildCommand } from './commands/build';
import { addCommand } from './commands/add';
import { pushCommand } from './commands/push';
import { compileCommand } from './commands/compile';
import { deployCommand } from './commands/deploy';
import { statusCommand, logsCommand, metricsCommand } from './commands/status';
import { codeCommand } from './commands/code';
import { installCommand } from './commands/install';
import { updateCommand } from './commands/update';
import { initCommand } from './commands/init';
import { kickstartCommand } from './commands/kickstart';
import { loginCommand } from './commands/login';
import { logoutCommand } from './commands/logout';
import { version } from '../package.json';
import { track } from './commands/track.js';
import { trackCi } from './commands/track-ci.js';
import { openapi } from './commands/openapi.js';
import { deleteGroupCommand } from './commands/delete-group';

const program = new Command();

program
  .name('microfox')
  .description('Universal CLI tool for creating and managing Microfox projects')
  .version(version)
  .addHelpText(
    'after',
    `
Typical workflow:
  $ microfox login              authenticate once
  $ microfox kickstart my-app   scaffold a new project
  $ microfox deploy             compile + push to the Microfox platform
  $ microfox status latest      check how the deployment went

Run "microfox <command> --help" for details on a specific command.
`
  );

// Build & deploy
program.addCommand(compileCommand.helpGroup('Build & deploy:'));
program.addCommand(pushCommand.helpGroup('Build & deploy:'));
program.addCommand(deployCommand.helpGroup('Build & deploy:'));
program.addCommand(deleteGroupCommand.helpGroup('Build & deploy:'));

// Monitoring
program.addCommand(statusCommand.helpGroup('Monitoring:'));
program.addCommand(logsCommand.helpGroup('Monitoring:'));
program.addCommand(metricsCommand.helpGroup('Monitoring:'));

// Authentication
program.addCommand(loginCommand.helpGroup('Authentication:'));
program.addCommand(logoutCommand.helpGroup('Authentication:'));

// Scaffolding
program.addCommand(kickstartCommand.helpGroup('Scaffolding:'));
program.addCommand(buildCommand.helpGroup('Scaffolding:'));
program.addCommand(addCommand.helpGroup('Scaffolding:'));
program.addCommand(initCommand.helpGroup('Scaffolding:'));

// Utilities
program.addCommand(codeCommand.helpGroup('Utilities:'));
program.addCommand(installCommand.helpGroup('Utilities:'));
program.addCommand(updateCommand.helpGroup('Utilities:'));
program.addCommand(track.helpGroup('Utilities:'));
program.addCommand(trackCi.helpGroup('Utilities:'));
program.addCommand(openapi.helpGroup('Utilities:'));

program.action(() => {
  // Show help if no command is provided
  if (process.argv.length <= 2) {
    program.help();
  }
});

program.parse(process.argv);
