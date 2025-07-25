import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import path from 'path';
import { Project, SourceFile } from 'ts-morph';
import { TrackerContext } from '@microfox/tracker';
import { pathToFileURL } from 'url';
import { findUp } from 'find-up';

export const track = new Command('track')
  .description('Run tracker scripts locally.')
  .option('--file <path>', 'Run a single tracker file instead of all.')
  .action(async (options) => {
    console.log(chalk.greenBright('TRACK-CI command action started.'));
    console.log(chalk.cyan('Starting tracker runner...'));
    const projectRoot = process.cwd();

    let trackerFiles: string[];

    if (options.file) {
      console.log(chalk.yellow(`Running in single-file mode: ${options.file}`));
      trackerFiles = [options.file];
    } else {
      trackerFiles = await glob('**/__track__/**/*.tracker.ts', {
        cwd: projectRoot,
        ignore: '**/node_modules/**',
      });
    }

    if (trackerFiles.length === 0) {
      console.log(chalk.yellow('No tracker files found.'));
      return;
    }

    console.log(chalk.green(`Found ${trackerFiles.length} tracker(s):`));
    for (const file of trackerFiles) {
      console.log(chalk.gray(`- ${file}`));
    }

    for (const trackerPath of trackerFiles) {
      console.log(chalk.blue(`\nExecuting: ${trackerPath}`));
      try {
        const fullTrackerPath = path.resolve(projectRoot, trackerPath);
        const trackerModule = await import(pathToFileURL(fullTrackerPath).href);
        const tracker = trackerModule.default;

        if (!tracker || !tracker.config || typeof tracker.logic !== 'function') {
          console.error(chalk.red(`  Error: Invalid tracker structure in ${trackerPath}. Make sure to use 'defineTracker'.`));
          continue;
        }
        
        const packageJsonPath = await findUp('package.json', { cwd: path.dirname(fullTrackerPath) });
        if (!packageJsonPath) {
          console.error(chalk.red(`  Error: Could not find package.json for tracker: ${trackerPath}`));
          continue;
        }
        const packageRoot = path.dirname(packageJsonPath);
        
        const tsConfigPath = path.resolve(packageRoot, 'tsconfig.json');
        
        const project = new Project({ tsConfigFilePath: tsConfigPath });
        
        const sourceFiles: SourceFile[] = [];
        for (const targetGlob of tracker.config.targets) {
            const files = project.addSourceFilesAtPaths(path.join(packageRoot, targetGlob));
            sourceFiles.push(...files);
        }

        const context: TrackerContext = {
          sourceFiles,
          project,
          log: {
            info: (msg) => console.log(chalk.gray(`  [INFO] ${msg}`)),
            warn: (msg) => console.log(chalk.yellow(`  [WARN] ${msg}`)),
            error: (msg) => console.log(chalk.red(`  [ERROR] ${msg}`)),
          },
        };

        await tracker.logic(context);
        await project.save();
        
        console.log(chalk.green(`  Finished execution for ${path.basename(trackerPath)}`));

      } catch (error) {
        console.error(chalk.red(`  Failed to run tracker ${trackerPath}:`), error);
      }
    }
  }); 