import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import axios from 'axios';
import FormData from 'form-data';
import archiver from 'archiver';
import micromatch from 'micromatch';

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
  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'microfox-'));
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

async function pushAction(): Promise<void> {
  const cwd = process.cwd();
  const microfoxConfigPath = path.join(cwd, 'microfox.json');

  if (!fs.existsSync(microfoxConfigPath)) {
    console.error(chalk.red('❌ Error: `microfox.json` not found in the current directory.'));
    console.log(chalk.yellow('This command must be run from the root of an agent project.'));
    process.exit(1);
  }

  console.log(chalk.cyan('🚀 Pushing your agent to Microfox...'));

  const microfoxConfig = JSON.parse(fs.readFileSync(microfoxConfigPath, 'utf-8'));
  const apiMode = microfoxConfig.apiMode || microfoxConfig.API_MODE;
  const apiVersion = microfoxConfig.apiVersion || microfoxConfig.API_VERSION;
  const apiLocalPort = microfoxConfig.port || microfoxConfig.PORT;
  const isV2 = (typeof apiVersion === 'string' ? apiVersion.toLowerCase() === 'v2' : false);

  try {
    if (isV2) {
      const ignorePatterns: string[] = ['node_modules/**', '.git/**', ...(microfoxConfig.ignorePatterns || [])];

      console.log(chalk.blue('📦 Bundling your agent as a ZIP archive...'));
      const zipPath = await createZipArchive(cwd, ignorePatterns);

      console.log(chalk.blue('🚚 Uploading archive to Microfox...'));
      const form = new FormData();
      form.append('archive', fs.createReadStream(zipPath), {
        filename: 'archive.zip',
        contentType: 'application/zip',
      });

      const projectId: string | undefined = microfoxConfig.projectId || process.env.PROJECT_ID;
      if (!projectId) {
        console.error(chalk.red('❌ Error: `projectId` is required. Add `projectId` to your microfox.json or set env MICROFOX_PROJECT_ID.'));
        process.exit(1);
      }

      const headers = {
        ...form.getHeaders(),
        'x-project-id': projectId,
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
        console.log(chalk.green('✅ Deployment request accepted!'));
        if (response.data?.deploymentId) {
          console.log(chalk.green(`   Deployment ID: ${response.data.deploymentId}`));
        } else if (response.data?.runId) {
          console.log(chalk.green(`   Run ID: ${response.data.runId}`));
        }
        if (response.data?.message) {
          console.log(chalk.green(`   Message: ${response.data.message}`));
        }
      } else {
        console.error(chalk.red(`❌ Deployment failed with status: ${response.status}`));
        console.error(response.data);
        process.exit(1);
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

      const stage = microfoxConfig.stage || 'prod';
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
      const ignored: string[] = microfoxConfig.ignored || [];
      const allIgnored = [...defaultIgnore, ...ignored];

      const files: FileDirectory[] = getDirectoryFiles(cwd, '', allIgnored);

      console.log(chalk.blue('📦 Bundling and deploying your agent (v1)...'));
      const response = await axios.post(
        API_ENDPOINT_MAPPER({ mode: apiMode, version: 'v1', port: apiLocalPort }),
        {
          stage,
          isLocal: false,
          dir: files,
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
          console.log(chalk.green(`   Run ID: ${response.data.runId}`));
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
  .action(async () => {
    try {
      await pushAction();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }); 