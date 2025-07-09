import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';
import micromatch from 'micromatch';

interface FileDirectory {
  type: 'file' | 'directory';
  name: string;
  path: string;
  content?: string;
  children?: FileDirectory[];
}

const API_ENDPOINT = 'https://staging-cicd.microfox.app/api/deployments/new-agent-cli';

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

export async function pushCommand(): Promise<void> {
  const cwd = process.cwd();
  const microfoxConfigPath = path.join(cwd, 'microfox.json');

  if (!fs.existsSync(microfoxConfigPath)) {
    console.error(chalk.red('❌ Error: `microfox.json` not found in the current directory.'));
    console.log(chalk.yellow('This command must be run from the root of an agent project.'));
    process.exit(1);
  }

  console.log(chalk.cyan('🚀 Pushing your agent to Microfox...'));

  const microfoxConfig = JSON.parse(fs.readFileSync(microfoxConfigPath, 'utf-8'));
  const stage = microfoxConfig.stage || 'prod';
  const ignored: string[] = microfoxConfig.ignored || [];

  const defaultIgnore = ['node_modules/**', '.git/**', 'dist/**', '.serverless/**', '.DS_Store'];
  const allIgnored = [...defaultIgnore, ...ignored];

  const files: FileDirectory[] = getDirectoryFiles(cwd, '', allIgnored);

  // console.log(JSON.stringify(files, null, 2));
  
  try {
    console.log(chalk.blue('📦 Bundling and deploying your agent...'));
    const response = await axios.post(API_ENDPOINT, {
      stage,
      isLocal: false,
      dir: files,
    });

    if (response.status === 200) {
      console.log(chalk.green('✅ Deployment successful!'));
      console.log(chalk.green(`   Run ID: ${response.data.runId}`));
      console.log(chalk.green(`   Message: ${response.data.message}`));
    } else {
      console.error(chalk.red(`❌ Deployment failed with status: ${response.status}`));
      console.error(response.data);
      process.exit(1);
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