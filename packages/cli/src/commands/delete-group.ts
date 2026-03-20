import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { findServerlessWorkersDir } from '../utils/deployment-records';

const ENDPOINT_BASE = ({ mode, version, port }: { mode?: string; version?: string; port?: number }) => {
  const normalizedMode = mode?.toLowerCase() === 'prod' || mode?.toLowerCase() === 'production' ? 'prod' : 'staging';
  const normalizedVersion = version?.toLowerCase() === 'v2' ? 'v2' : 'v1';
  if (port) return `http://localhost:${port}`;
  if (normalizedVersion === 'v2') return `https://${normalizedMode}-v2-cicd.microfox.app`;
  return `https://${normalizedMode}-v1-cicd.microfox.app`;
};

function resolveMicrofoxConfig(startCwd: string): Record<string, any> {
  const cwd = startCwd;

  // 1) Try microfox.json in the current directory first.
  const configPath = path.join(cwd, 'microfox.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, any>;
  }

  // 2) Fall back to microfox.json in parent directory (common when cwd is `.serverless-workers`).
  const parentConfigPath = path.join(path.dirname(cwd), 'microfox.json');
  if (fs.existsSync(parentConfigPath)) {
    return JSON.parse(fs.readFileSync(parentConfigPath, 'utf-8')) as Record<string, any>;
  }

  // 3) If not found at root, fall back to `.serverless-workers`.
  const serverlessDir = findServerlessWorkersDir(cwd);
  if (serverlessDir) {
    const inServerlessPath = path.join(serverlessDir, 'microfox.json');
    const inServerlessParentPath = path.join(path.dirname(serverlessDir), 'microfox.json');

    // Mirror `push.ts`: if config exists only in parent, copy it into serverless dir for consistency.
    if (!fs.existsSync(inServerlessPath) && fs.existsSync(inServerlessParentPath)) {
      try {
        fs.copyFileSync(inServerlessParentPath, inServerlessPath);
      } catch {
        // Non-fatal: we can still read from parent.
      }
    }

    const finalConfigPath = fs.existsSync(inServerlessPath) ? inServerlessPath : inServerlessParentPath;
    if (fs.existsSync(finalConfigPath)) {
      return JSON.parse(fs.readFileSync(finalConfigPath, 'utf-8')) as Record<string, any>;
    }
  }

  console.error(chalk.red('❌ Error: `microfox.json` not found. Run from project root or `.serverless-workers`.'));
  process.exit(1);
}

async function deleteGroupAction(group: string): Promise<void> {
  const normalizedGroup = group?.trim();
  if (!normalizedGroup) {
    console.error(chalk.red('❌ Error: group name is required.'));
    process.exit(1);
  }

  const cfg = resolveMicrofoxConfig(process.cwd());
  const deploymentConfig = cfg.deployment || {};
  const apiVersion = (deploymentConfig.apiVersion || cfg.apiVersion || cfg.API_VERSION || '').toString().toLowerCase();
  if (apiVersion !== 'v2') {
    console.error(chalk.red('❌ Error: `delete-group` is supported only for v2 deployments.'));
    process.exit(1);
  }

  const mode = deploymentConfig.apiMode || cfg.apiMode || cfg.API_MODE;
  const port = deploymentConfig.port || cfg.port || cfg.PORT;
  const base = ENDPOINT_BASE({ mode, version: 'v2', port });

  const projectId: string | undefined = cfg.projectId || process.env.PROJECT_ID;
  if (!projectId) {
    console.error(chalk.red('❌ Error: `projectId` is required. Add `projectId` to your microfox.json.'));
    process.exit(1);
  }

  const url = `${base}/api/projects/${encodeURIComponent(projectId)}/groups/${encodeURIComponent(normalizedGroup)}`;
  console.log(chalk.cyan(`🧹 Requesting deletion for group "${normalizedGroup}"...`));

  try {
    const response = await axios.delete(url, {
      headers: {
        'x-project-id': projectId,
      },
      data: {
        group: normalizedGroup,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(chalk.green('✅ Group resource deletion initiated.'));
      if (response.data?.message) {
        console.log(chalk.green(`   Message: ${response.data.message}`));
      }
      if (response.data?.workerName) {
        console.log(chalk.green(`   Worker: ${response.data.workerName}`));
      }
      return;
    }

    console.error(chalk.red(`❌ Failed with status ${response.status}`));
    process.exit(1);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(chalk.red(`❌ Error: ${error.response.status}`));
      const message = error.response.data?.error || error.response.data?.message;
      if (message) {
        console.error(chalk.red(`   ${message}`));
      } else {
        console.error(chalk.red(`   ${JSON.stringify(error.response.data)}`));
      }
    } else {
      console.error(chalk.red('❌ Failed to delete group resources.'));
      console.error(error);
    }
    process.exit(1);
  }
}

export const deleteGroupCommand = new Command('delete-group')
  .description('Delete resources for a specific project group (v2)')
  .argument('<group>', 'Group name to delete (e.g. default, core, workflows)')
  .action(async (group: string) => {
    await deleteGroupAction(group);
  });
