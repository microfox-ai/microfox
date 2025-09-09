import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import { checkPackageNameAndPrompt } from '../utils/npmChecker';

export async function createAgentProject(agentName: string): Promise<void> {
  const workingDir = getWorkingDirectory();
  const agentDir = path.join(workingDir, agentName);

  if (fs.existsSync(agentDir)) {
    throw new Error(`Directory already exists at ${agentDir}`);
  }

  console.log(
    chalk.blue(`🚀 Creating agent ${chalk.bold(agentName)} at ${agentDir}\n`),
  );

  fs.mkdirSync(agentDir, { recursive: true });

  const templatePath = path.resolve(
    __dirname,
    '../templates/agent-template.txt',
  );
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  const fileSections = templateContent.split('--- filename: ').slice(1);

  for (const section of fileSections) {
    const lines = section.split('\n');
    const filePath = lines.shift()!.trim();
    const content = lines.join('\n').replace(/<%= agentName %>/g, agentName);

    const destPath = path.join(agentDir, filePath);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, content);
    console.log(chalk.green(`✅ Created ${filePath}`));
  }
}

export async function createPackageProject(packageName: string): Promise<void> {
  const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;
  const titleName = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const description = `A TypeScript SDK for ${titleName}.`;
  const className =
    simpleName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Sdk';

  const workingDir = getWorkingDirectory();
  const packageDir = path.join(workingDir, simpleName);

  if (fs.existsSync(packageDir)) {
    throw new Error(`Directory already exists at ${packageDir}`);
  }

  console.log(
    chalk.blue(
      `🚀 Creating package ${chalk.bold(packageName)} at ${packageDir}\n`,
    ),
  );

  fs.mkdirSync(packageDir, { recursive: true });

  const templatePath = path.resolve(
    __dirname,
    '../templates/package-template.txt',
  );
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  const fileSections = templateContent.split('--- filename: ').slice(1);

  for (const section of fileSections) {
    const lines = section.split('\n');
    const filePath = lines
      .shift()!
      .trim()
      .replace(/<%= simpleName %>/g, simpleName);
    let content = lines.join('\n');

    content = content.replace(/<%= packageName %>/g, packageName);
    content = content.replace(/<%= simpleName %>/g, simpleName);
    content = content.replace(/<%= titleName %>/g, titleName);
    content = content.replace(/<%= description %>/g, description);
    content = content.replace(/<%= className %>/g, className);

    const destPath = path.join(packageDir, filePath);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, content);
    console.log(chalk.green(`✅ Created ${filePath}`));
  }

  const docsDir = path.join(packageDir, 'docs');
  const docsConstructors = path.join(docsDir, 'constructors');
  const docsFunctions = path.join(docsDir, 'functions');

  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(docsConstructors, { recursive: true });
  fs.mkdirSync(docsFunctions, { recursive: true });
}

export async function createBackgroundAgentProject(
  agentName: string,
): Promise<void> {
  const workingDir = getWorkingDirectory();
  const agentDir = path.join(workingDir, agentName);

  if (fs.existsSync(agentDir)) {
    throw new Error(`Directory already exists at ${agentDir}`);
  }

  console.log(
    chalk.blue(
      `🚀 Creating background agent ${chalk.bold(agentName)} at ${agentDir}\n`,
    ),
  );

  fs.mkdirSync(agentDir, { recursive: true });

  const templateDir = path.resolve(__dirname, '../templates/background-agent');

  const copyTemplates = (src: string, dest: string) => {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name.replace(/\.txt$/, ''));

      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyTemplates(srcPath, destPath);
      } else if (entry.name.endsWith('.txt')) {
        const templateContent = fs.readFileSync(srcPath, 'utf-8');
        const content = templateContent.replace(/<%= agentName %>/g, agentName);
        fs.writeFileSync(destPath, content);
        console.log(
          chalk.green(`✅ Created ${path.relative(agentDir, destPath)}`),
        );
      }
    }
  };

  copyTemplates(templateDir, agentDir);
}
