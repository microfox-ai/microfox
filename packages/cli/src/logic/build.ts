import fs from 'fs';
import path from 'path';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import * as tar from 'tar';
import { glob } from 'glob';

function processTemplate(
  targetPath: string,
  variables: Record<string, string>,
) {
  const files = glob.sync('**/*', { cwd: targetPath, dot: true });

  for (const file of files) {
    const filePath = path.join(targetPath, file);
    const stat = fs.statSync(filePath);

    // Rename file or directory
    let newPath = filePath;
    for (const [key, value] of Object.entries(variables)) {
      newPath = newPath.replace(new RegExp(`__${key}__`, 'g'), value);
    }
    if (newPath !== filePath) {
      fs.renameSync(filePath, newPath);
    }

    if (stat.isFile()) {
      let content = fs.readFileSync(newPath, 'utf-8');
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(
          new RegExp(`<%=\\s*${key}\\s*%>`, 'g'),
          value,
        );
      }
      // A special case for the package template's changelog
      if (path.basename(newPath) === 'CHANGELOG.md') {
          content = content.replace(
              new RegExp(`<%=\\s*new Date\\(\\).toISOString\\(\\).split\\('T'\\)\\[0\\]\\s*%>`, 'g'),
              new Date().toISOString().split('T')[0],
          );
      }
      fs.writeFileSync(newPath, content);
    }
  }
}

export async function createProjectFromTemplate(
  templateName: string,
  projectName: string,
  destinationPath: string,
) {
  const projectRoot = getWorkingDirectory();
  const templatePath = path.join(
    projectRoot,
    `${templateName}.tar.gz`,
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  const destination = path.join(destinationPath, projectName);
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  await tar.x({
    file: templatePath,
    cwd: destination,
  });
}

export async function createAgentProject(agentName: string) {
  const workingDir = getWorkingDirectory();
  const projectPath = path.join(workingDir, agentName);

  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${agentName}" already exists.`);
  }
  fs.mkdirSync(projectPath, { recursive: true });

  const templatePath = path.resolve(__dirname, 'agent.tar.gz');
  await tar.x({
    file: templatePath,
    cwd: projectPath,
  });
  processTemplate(projectPath, { agentName });
}

export async function createBackgroundAgentProject(agentName: string) {
  const workingDir = getWorkingDirectory();
  const projectPath = path.join(workingDir, agentName);

  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${agentName}" already exists.`);
  }
  fs.mkdirSync(projectPath, { recursive: true });

  const templatePath = path.resolve(
    __dirname,
    'background-agent.tar.gz',
  );
  await tar.x({
    file: templatePath,
    cwd: projectPath,
  });
  processTemplate(projectPath, { agentName });
}

export async function createPackageProject(packageName: string) {
  const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;
  const titleName = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const className = titleName.replace(/ /g, '');
  const description = `A TypeScript SDK for ${titleName}.`;

  const workingDir = getWorkingDirectory();
  const projectPath = path.join(workingDir, simpleName);

  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory "${simpleName}" already exists.`);
  }
  fs.mkdirSync(projectPath, { recursive: true });

  const templatePath = path.resolve(__dirname, 'package.tar.gz');

  await tar.x({
    file: templatePath,
    cwd: projectPath,
  });

  processTemplate(projectPath, {
    packageName,
    simpleName,
    titleName,
    className,
    description,
  });
}
