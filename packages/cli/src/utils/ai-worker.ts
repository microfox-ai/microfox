import * as fs from 'fs';
import chalk from 'chalk';
import { runCommand } from './run-command';

export interface CompileOptions {
  group?: string;
  skipGroup?: string;
  stage?: string;
  region?: string;
  aiPath?: string;
}

/**
 * Compile the agent's workers into `.serverless-workers/` by invoking the
 * ai-worker CLI's `compile` command (build only — never deploys).
 *
 * The CLI spec can be overridden with the `AI_WORKER_CLI_SPEC` env var for
 * local testing: either an absolute path to a built entry (e.g.
 * .../ai-worker-cli/dist/index.js) or an npm spec (e.g. "@microfox/ai-worker-cli@1.2.3").
 */
export async function runAiWorkerCompile(options: CompileOptions = {}): Promise<void> {
  const args: string[] = ['compile'];
  if (options.group) args.push(options.group);
  if (options.skipGroup) args.push('--skip-group', options.skipGroup);
  if (options.stage) args.push('--stage', options.stage);
  if (options.region) args.push('--region', options.region);
  if (options.aiPath) args.push('--ai-path', options.aiPath);

  const cliSpec = (process.env.AI_WORKER_CLI_SPEC || '').trim();
  const isLocalEntry = cliSpec && (/\.(c|m)?js$/.test(cliSpec) || fs.existsSync(cliSpec));

  if (cliSpec) {
    console.log(chalk.blue(`ℹ️  Using ai-worker CLI override: ${cliSpec}`));
  }

  if (isLocalEntry) {
    await runCommand('node', [cliSpec, ...args]);
  } else {
    await runCommand('npx', [cliSpec || '@microfox/ai-worker-cli@latest', ...args]);
  }
}
