import { Command } from 'commander';
import chalk from 'chalk';
import { runAiWorkerCompile } from '../utils/ai-worker';
import { pushAction } from './push';

export const deployCommand = new Command('deploy')
  .description('Compile and push in one step (equivalent to "microfox compile" then "microfox push")')
  .argument('[groupname]', 'Compile and push only this group (e.g. core, default, workflows)')
  .option('--skip-group <groups>', 'Comma-separated list of groups to skip (e.g. "core,workflows")')
  .option('-s, --stage <stage>', 'Stage baked into the generated serverless config')
  .option('-r, --region <region>', 'AWS region baked into the generated serverless config')
  .option('--ai-path <path>', 'Path to the AI directory containing workers (default: app/ai)')
  .option('--skip-compile', 'Push the existing .serverless-workers build without recompiling', false)
  .addHelpText(
    'after',
    `
Examples:
  $ microfox deploy                      compile + push all groups
  $ microfox deploy core                 compile + push only the "core" group
  $ microfox deploy --skip-group core    compile + push everything except core
  $ microfox deploy --skip-compile       push the last build without recompiling

After deploying:
  $ microfox status latest               check the deployment status
  $ microfox logs latest                 view the deployment logs
`
  )
  .action(
    async (
      groupname: string | undefined,
      options: {
        skipGroup?: string;
        stage?: string;
        region?: string;
        aiPath?: string;
        skipCompile?: boolean;
      } = {}
    ) => {
      try {
        if (options.skipCompile) {
          console.log(chalk.yellow('⏭️  Skipping compile (--skip-compile), pushing the existing build...'));
        } else {
          console.log(chalk.cyan('🔨 Step 1/2 — Compiling your agent...'));
          await runAiWorkerCompile({ ...options, group: groupname });
          console.log(chalk.green('✅ Compilation complete!'));
          console.log(chalk.cyan('🚀 Step 2/2 — Pushing to the Microfox platform...'));
        }
        await pushAction(groupname, options.skipGroup);
      } catch (error) {
        console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    }
  );
