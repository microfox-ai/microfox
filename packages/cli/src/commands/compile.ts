import { Command } from 'commander';
import chalk from 'chalk';
import { runAiWorkerCompile } from '../utils/ai-worker';

export const compileCommand = new Command('compile')
  .description('Compile your agent\'s workers into .serverless-workers (build only, no deploy)')
  .argument('[group]', 'Compile only this group (when using per-group layout, e.g. core, default, workflows)')
  .option('--skip-group <groups>', 'Comma-separated list of groups to skip (e.g. "core,workflows")')
  .option('-s, --stage <stage>', 'Stage baked into the generated serverless config')
  .option('-r, --region <region>', 'AWS region baked into the generated serverless config')
  .option('--ai-path <path>', 'Path to the AI directory containing workers (default: app/ai)')
  .addHelpText(
    'after',
    `
Runs the ai-worker CLI's "compile" under the hood and writes the deployable
build into .serverless-workers/. Nothing is uploaded or deployed. With a group
argument or --skip-group, only the selected group builds are (re)generated;
other groups' existing builds are left untouched.

Next steps:
  $ microfox push      upload the compiled build to the Microfox platform
  $ microfox deploy    or do compile + push in one step

Examples:
  $ microfox compile
  $ microfox compile core                 compile only the "core" group
  $ microfox compile --skip-group core    compile everything except core
  $ microfox compile --ai-path src/ai
`
  )
  .action(async (group: string | undefined, options: { skipGroup?: string; stage?: string; region?: string; aiPath?: string }) => {
    try {
      console.log(chalk.cyan('🔨 Compiling your agent...'));
      await runAiWorkerCompile({ ...options, group });
      console.log(chalk.green('✅ Compilation complete! Build written to .serverless-workers/'));
      console.log(chalk.gray('   Deploy it with "microfox push" (or use "microfox deploy" next time).'));
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
