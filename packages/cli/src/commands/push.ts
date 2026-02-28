import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';
import chalk from 'chalk';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FormData = require('form-data');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require('archiver');
import * as micromatch from 'micromatch';
import { findServerlessWorkersDir, getPerGroupNames, saveDeploymentRecord, saveDeploymentRecordToRoot } from '../utils/deployment-records';

const API_ENDPOINT_MAPPER = ({ mode, version, port }: { mode?: string, version?: string, port?: number }) => {
  const normalizedMode = mode?.toLowerCase() === 'prod' || mode?.toLowerCase() === 'production' ? 'prod' : 'staging';
  const normalizedVersion = version?.toLowerCase() === 'v2' ? 'v2' : 'v1';

  if (normalizedVersion === 'v2') {
    if (port) {
      return `http://localhost:${port}/api/deployments/local`;
    }
    return `https://${normalizedMode}-v2-cicd.microfox.app/api/deployments/local`;
  } else {
    if (port) {
      return `http://localhost:${port}/api/deployments/new-agent-cli`;
    }
    return `https://${normalizedMode}-v1-cicd.microfox.app/api/deployments/new-agent-cli`;
  }
}

interface FileDirectory {
  type: 'file' | 'directory';
  name: string;
  path: string;
  content?: string;
  children?: FileDirectory[];
}

const getDirectoryFiles = (dir: string, basePath: string = '', ignorePatterns: string[]): FileDirectory[] => {
  const structure: FileDirectory[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const relativePath = path.join(basePath, item.name);
    if (micromatch.isMatch(relativePath, ignorePatterns)) {
      continue;
    }

    if (item.isDirectory()) {
      structure.push(...getDirectoryFiles(path.join(dir, item.name), relativePath, ignorePatterns));
    } else {
      structure.push({
        type: 'file',
        name: item.name,
        path: relativePath.replace(/\\/g, '/'),
        content: fs.readFileSync(path.join(dir, item.name), 'utf-8'),
      });
    }
  }
  return structure;
};

async function createZipArchive(sourceDir: string, ignorePatterns: string[]): Promise<string> {
  const tempDir = await fs.promises.mkdtemp(path.join(tmpdir(), 'microfox-'));
  const zipPath = path.join(tempDir, 'archive.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  const finalizePromise = new Promise<void>((resolve, reject) => {
    output.on('close', () => resolve());
    output.on('error', (err) => reject(err));
    archive.on('warning', (err: any) => {
      if ((err as any).code === 'ENOENT') {
        // ignore file not found warnings
        return;
      }
      reject(err);
    });
    archive.on('error', (err: any) => reject(err));
  });

  archive.pipe(output);
  archive.glob('**/*', {
    cwd: sourceDir,
    dot: true,
    ignore: ignorePatterns,
  });
  await archive.finalize();
  await finalizePromise;
  return zipPath;
}

async function pushAction(groupname?: string, skipGroup?: string): Promise<void> {
  let cwd = process.cwd();

  // If a build output exists in .serverless-workers, deploy from there (single-group or per-group).
  const serverlessDir = findServerlessWorkersDir(cwd);
  if (serverlessDir) {
    cwd = serverlessDir;
    process.chdir(cwd);
  }

  // Ensure microfox.json is available in the working directory.
  // When deploying from .serverless-workers, the config often lives in the parent (agent root).
  let microfoxConfigPath = path.join(cwd, 'microfox.json');
  if (!fs.existsSync(microfoxConfigPath)) {
    const parentConfigPath = path.join(path.dirname(cwd), 'microfox.json');
    if (fs.existsSync(parentConfigPath)) {
      try {
        fs.copyFileSync(parentConfigPath, microfoxConfigPath);
      } catch {
        // If copy fails, we can still read from parentConfigPath below.
      }
      microfoxConfigPath = fs.existsSync(microfoxConfigPath) ? microfoxConfigPath : parentConfigPath;
    }
  }

  if (!fs.existsSync(microfoxConfigPath)) {
    console.error(chalk.red('❌ Error: `microfox.json` not found in the current directory or its parent.'));
    console.log(chalk.yellow('Run this command from the root of an agent project, or from its `.serverless-workers` directory.'));
    process.exit(1);
  }

  console.log(chalk.cyan('🚀 Pushing your agent to Microfox...'));

  const microfoxConfig = JSON.parse(fs.readFileSync(microfoxConfigPath, 'utf-8'));
  const deploymentConfig = microfoxConfig.deployment || {};

  const apiMode = deploymentConfig.apiMode || microfoxConfig.apiMode || microfoxConfig.API_MODE;
  const apiVersion = deploymentConfig.apiVersion || microfoxConfig.apiVersion || microfoxConfig.API_VERSION;
  const apiLocalPort = deploymentConfig.port || microfoxConfig.port || microfoxConfig.PORT;
  const isV2 = (typeof apiVersion === 'string' ? apiVersion.toLowerCase() === 'v2' : false);

  try {
    if (isV2) {
      const projectId: string | undefined = microfoxConfig.projectId || process.env.PROJECT_ID;
      if (!projectId) {
        console.error(chalk.red('❌ Error: `projectId` is required. Add `projectId` to your microfox.json.'));
        process.exit(1);
      }

      const perGroupNames = getPerGroupNames(cwd);
      const skipSet = skipGroup ? new Set(skipGroup.split(',').map((g: string) => g.trim()).filter(Boolean)) : null;
      let groupsToPush: string[];

      if (perGroupNames !== null) {
        groupsToPush = groupname
          ? (perGroupNames.includes(groupname) ? [groupname] : [])
          : perGroupNames.filter((g) => !skipSet?.has(g));
        if (groupsToPush.length === 0) {
          if (groupname) {
            console.error(chalk.red(`❌ No such group: ${groupname}. Available: ${perGroupNames.join(', ')}`));
          } else {
            console.error(chalk.red('❌ No groups to push (all skipped or none match).'));
          }
          process.exit(1);
        }
      } else {
        groupsToPush = [];
      }

      const ignorePatterns: string[] = ['node_modules/**', '.git/**', ...(deploymentConfig.ignorePatterns || microfoxConfig.ignorePatterns || [])];

      const serverlessRoot = cwd;
      const doOnePush = async (archiveCwd: string, group?: string): Promise<void> => {
        console.log(chalk.blue(group ? `📦 Bundling group "${group}" as a ZIP archive...` : '📦 Bundling your agent as a ZIP archive...'));
        const zipPath = await createZipArchive(archiveCwd, ignorePatterns);

        console.log(chalk.blue(group ? `🚚 Uploading archive for group "${group}" to Microfox...` : '🚚 Uploading archive to Microfox...'));
        const form = new FormData();
        form.append('archive', fs.createReadStream(zipPath), {
          filename: 'archive.zip',
          contentType: 'application/zip',
        });
        const publish = microfoxConfig.publish ? { ...microfoxConfig.publish, ...(group ? { group } : {}) } : (group ? { group } : undefined);
        if (publish) {
          form.append('publish', JSON.stringify(publish));
        }

        const headers = {
          ...form.getHeaders(),
          'x-project-id': projectId,
          ...(group ? { 'x-deployment-group': group } : {}),
        } as Record<string, string>;

        const response = await axios.post(
          API_ENDPOINT_MAPPER({ mode: apiMode, version: 'v2', port: apiLocalPort }),
          form,
          {
            headers,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          }
        );

        if (response.status >= 200 && response.status < 300) {
          console.log(chalk.green(group ? `✅ Deployment request accepted for group "${group}"!` : '✅ Deployment request accepted!'));
          if (response.data?.deploymentId) {
            const deploymentId = response.data.deploymentId;
            console.log(chalk.green(`   Deployment ID: ${deploymentId}`));
            if (group != null && group !== '') {
              saveDeploymentRecordToRoot(serverlessRoot, deploymentId, group);
            } else {
              saveDeploymentRecord(archiveCwd, deploymentId);
            }
          } else if (response.data?.runId) {
            const runId = response.data.runId;
            console.log(chalk.green(`   Run ID: ${runId}`));
            if (group != null && group !== '') {
              saveDeploymentRecordToRoot(serverlessRoot, runId, group);
            } else {
              saveDeploymentRecord(archiveCwd, runId);
            }
          }
          if (response.data?.message) {
            console.log(chalk.green(`   Message: ${response.data.message}`));
          }
        } else {
          console.error(chalk.red(`❌ Deployment failed with status: ${response.status}`));
          console.error(response.data);
          throw new Error(`Deployment failed: ${response.status}`);
        }
      };

      if (groupsToPush.length > 0) {
        for (const group of groupsToPush) {
          const groupDir = path.join(cwd, group);
          await doOnePush(groupDir, group);
        }
      } else {
        await doOnePush(cwd);
      }
    } else {
      // v1: old behavior without ZIP
      let agentApiKey: string | undefined;
      const envPath = path.join(cwd, 'env.json');
      if (fs.existsSync(envPath)) {
        try {
          const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8')) as { AGENT_API_KEY?: string };
          agentApiKey = envConfig.AGENT_API_KEY;
        } catch (e) {
          console.warn(chalk.yellow('⚠️  Could not read or parse `env.json`. The AGENT_API_KEY will not be sent.'));
        }
      }

      const stage = deploymentConfig.stage || microfoxConfig.stage || 'prod';
      const defaultIgnore = [
        'node_modules/**',
        '.git/**',
        'dist/**',
        '.build/**',
        '.serverless/**',
        '.DS_Store',
        'package-lock.json',
        'pnpm-lock.yaml',
      ];
      const ignored: string[] = deploymentConfig.ignorePatterns || microfoxConfig.ignored || [];
      const allIgnored = [...defaultIgnore, ...ignored];

      const files: FileDirectory[] = getDirectoryFiles(cwd, '', allIgnored);

      console.log(chalk.blue('📦 Bundling and deploying your agent (v1)...'));
      const response = await axios.post(
        API_ENDPOINT_MAPPER({ mode: apiMode, version: 'v1', port: apiLocalPort }),
        {
          stage,
          isLocal: false,
          dir: files,
          publish: microfoxConfig.publish,
        },
        {
          headers: {
            ...(agentApiKey ? { 'x-agent-api-key': agentApiKey } : {}),
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(chalk.green('✅ Deployment successful!'));
        if (response.data?.runId) {
          const runId = response.data.runId;
          console.log(chalk.green(`   Run ID: ${runId}`));
          // Save run ID as deployment ID for v1
          saveDeploymentRecord(cwd, runId);
        }
        if (response.data?.message) {
          console.log(chalk.green(`   Message: ${response.data.message}`));
        }
      } else {
        console.error(chalk.red(`❌ Deployment failed with status: ${response.status}`));
        console.error(response.data);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(chalk.red('❌ An error occurred during deployment:'));
    if (axios.isAxiosError(error) && error.response) {
      console.error(chalk.red(`   Status: ${error.response.status}`));
      console.error(chalk.red(`   Data: ${JSON.stringify(error.response.data, null, 2)}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

export const pushCommand = new Command('push')
  .description('Deploy your agent to the Microfox platform')
  .argument('[groupname]', 'Deploy only this group (when using per-group layout, e.g. core, default, workflows)')
  .option('--skip-group <groups>', 'Comma-separated list of groups to skip (e.g. "core,workflows")')
  .action(async (groupname: string | undefined, options: { skipGroup?: string } = {}) => {
    try {
      await pushAction(groupname, options.skipGroup);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }); 