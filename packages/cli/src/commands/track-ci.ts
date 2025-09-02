import { Command } from 'commander';
import chalk from 'chalk';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';
import { pathToFileURL } from 'url';
import yaml from 'js-yaml';
import { findUp } from 'find-up';

export const trackCi = new Command('track-ci')
  .description('Generate GitHub Actions workflows from tracker scripts.')
  .option('--file <path>', 'Generate a workflow for a single tracker file.')
  .action(async (options) => {
    console.log(chalk.cyan('Generating GitHub Actions workflow...'));
    const projectRoot = process.cwd();

    let trackerFiles: string[];

    if (options.file) {
      // If a single file is specified, use it
      const filePath = path.resolve(projectRoot, options.file);
      try {
        await fs.access(filePath);
        trackerFiles = [options.file]; // Use the relative path provided
        console.log(chalk.blue(`Processing single tracker file: ${options.file}`));
      } catch {
        console.error(chalk.red(`Error: Tracker file not found at ${filePath}`));
        return;
      }
    } else {
      // Otherwise, search for all tracker files
      trackerFiles = await glob('**/__track__/**/*.tracker.ts', {
        cwd: projectRoot,
        ignore: '**/node_modules/**',
      });
    }

    if (trackerFiles.length === 0) {
      console.log(chalk.yellow('No tracker files found to generate workflows from.'));
      return;
    }

    const workflow: any = {
      name: 'Automated Trackers',
      on: {},
      jobs: {},
    };

    for (const trackerPath of trackerFiles) {
      try {
        const fullTrackerPath = path.resolve(projectRoot, trackerPath);
        const trackerModule = await import(pathToFileURL(fullTrackerPath).href);
        const tracker = trackerModule.default;

        if (tracker && tracker.config && tracker.config.github) {
          const jobName = tracker.config.github.name.replace(/\s+/g, '-').toLowerCase();
          const { on, commit } = tracker.config.github;

          // --- MERGE TRIGGERS (logic is the same) ---
          for (const key of Object.keys(on)) {
            if (key === 'schedule') {
              workflow.on.schedule = [...(workflow.on.schedule || []), ...on[key]];
            } else {
              if (!workflow.on[key]) workflow.on[key] = {};
              if (on[key].branches) {
                workflow.on[key].branches = [...(workflow.on[key].branches || []), ...on[key].branches];
              }
              if (on[key].paths) {
                workflow.on[key].paths = [...(workflow.on[key].paths || []), ...on[key].paths];
              }
            }
          }
          // --- End Merging ---

          // --- GENERATE PRECISE 'IF' CONDITION FOR THE JOB ---
          const conditions: string[] = [];
          if (on.push) {
            conditions.push("github.event_name == 'push'");
          }
          if (on.pull_request) {
            conditions.push("github.event_name == 'pull_request'");
          }
          if (on.schedule) {
            on.schedule.forEach((s: any) => {
              conditions.push(`github.event.schedule == '${s.cron}'`);
            });
          }
          const ifCondition = conditions.join(' || ');
          // --- END 'IF' CONDITION ---

          const job: any = {
            if: ifCondition,
            'runs-on': 'ubuntu-latest',
            ...(tracker.config.github.env && { env: tracker.config.github.env }),
          };

          const checkoutStep: any = {
            name: 'Checkout Code',
            uses: 'actions/checkout@v4',
          };

          // --- CONFIGURE CHECKOUT AND PERMISSIONS FOR COMMIT ---
          if (commit && commit.enabled) {
            if (commit.patEnvName) {
              checkoutStep.with = { token: `\${{ secrets.${commit.patEnvName} }}` };
              console.log(chalk.green(`  Configuring checkout to use PAT from secret: ${commit.patEnvName}`));
            } else {
              checkoutStep.with = { token: `\${{ secrets.GITHUB_TOKEN }}` };
              job.permissions = { contents: 'write' };
              console.log(chalk.green('  Configuring checkout to use GITHUB_TOKEN and setting write permissions.'));
            }
          }

          const steps: any[] = [
            checkoutStep,
            { name: 'Setup Node.js', uses: 'actions/setup-node@v4', with: { 'node-version': '20' } },
            { name: 'Install Dependencies', run: 'npm install' },
            { name: 'Run Tracker', run: `npx microfox track --file ${trackerPath}` },
          ];

          // --- ADD COMMIT STEP IF CONFIGURED ---
          if (commit && commit.enabled) {
            const commitMessage = commit.message || 'ci: Automatic changes from tracker';
            // Using a trimmed template literal for a clean multiline script in the final YAML
            const runScript = `git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'
git add .
if git diff --staged --quiet; then
  echo "No changes to commit."
else
  git commit -m "${commitMessage}"
  git push
fi`.trim();

            steps.push({
              name: 'Commit and Push Changes',
              run: runScript,
            });
            console.log(chalk.green(`  Added formatted commit step for job: ${tracker.config.github.name}`));
          }
          // --- END COMMIT STEP ---

          job.steps = steps;
          workflow.jobs[jobName] = job;

          console.log(chalk.green(`  Added job: ${tracker.config.github.name} with condition: "${ifCondition}"`));
        }
      } catch (error) {
        console.error(chalk.red(`  Failed to process tracker ${trackerPath}:`), error);
      }
    }

    // --- Safer Cleanup and Deduplication ---
    if (workflow.on.push) {
      if (workflow.on.push.branches) workflow.on.push.branches = [...new Set(workflow.on.push.branches)];
      if (workflow.on.push.paths) workflow.on.push.paths = [...new Set(workflow.on.push.paths)];
      if (workflow.on.push.branches?.length === 0) delete workflow.on.push.branches;
      if (workflow.on.push.paths?.length === 0) delete workflow.on.push.paths;
      if (Object.keys(workflow.on.push).length === 0) delete workflow.on.push;
    }
    if (workflow.on.pull_request) {
      if (workflow.on.pull_request.branches) workflow.on.pull_request.branches = [...new Set(workflow.on.pull_request.branches)];
      if (workflow.on.pull_request.paths) workflow.on.pull_request.paths = [...new Set(workflow.on.pull_request.paths)];
      if (workflow.on.pull_request.branches?.length === 0) delete workflow.on.pull_request.branches;
      if (workflow.on.pull_request.paths?.length === 0) delete workflow.on.pull_request.paths;
      if (Object.keys(workflow.on.pull_request).length === 0) delete workflow.on.pull_request;
    }
    if (workflow.on.schedule?.length === 0) delete workflow.on.schedule;
    // --- End Cleanup ---

    const workflowYaml = yaml.dump(workflow);

    // --- INTELLIGENT OUTPUT PATH DISCOVERY ---
    let githubDir = await findUp('.github', { type: 'directory' });
    if (!githubDir) {
        // If not found, create it at the project root
        githubDir = path.resolve(projectRoot, '.github');
        console.log(chalk.yellow('Could not find .github directory. Creating one at project root.'));
    }
    const outputPath = path.resolve(githubDir, 'workflows', 'trackers.yml');
    // --- END DISCOVERY ---

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, workflowYaml);

    console.log(chalk.cyan(`\nSuccessfully generated workflow at ${outputPath}`));
  }); 