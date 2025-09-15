import fs from 'fs';
import path from 'path';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import * as tar from 'tar';
import { glob } from 'glob';
import { downloadAndExtractTemplate } from '../utils/templates';

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
  isLocal: boolean,
) {
  const destination = path.join(destinationPath, projectName);
  if (fs.existsSync(destination)) {
    throw new Error(
      `Directory "${projectName}" already exists at ${destinationPath}`,
    );
  }
  fs.mkdirSync(destination, { recursive: true });

  if (isLocal) {
    const templatePath = path.resolve(process.cwd(), templateName);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Local template not found at ${templatePath}`);
    }

    const stats = fs.statSync(templatePath);
    if (stats.isDirectory()) {
      const items = fs.readdirSync(templatePath);
      for (const item of items) {
        const srcPath = path.join(templatePath, item);
        const destPath = path.join(destination, item);
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    } else if (
      templatePath.endsWith('.tar.gz') ||
      templatePath.endsWith('.tar')
    ) {
      await tar.x({
        file: templatePath,
        cwd: destination,
        strip: 1, // Assumes template is in a subdirectory
      });
    } else {
      throw new Error(
        `Local template must be a directory or a .tar.gz/.tar file.`,
      );
    }
  } else {
    await downloadAndExtractTemplate(templateName, destination);
  }
}

export async function createAgentProject(agentName: string) {
  const workingDir = getWorkingDirectory();
  await createProjectFromTemplate('agent', agentName, workingDir, false);
  const projectPath = path.join(workingDir, agentName);
  processTemplate(projectPath, { agentName });
}

export async function createBackgroundAgentProject(agentName: string) {
  const workingDir = getWorkingDirectory();
  await createProjectFromTemplate('background-agent', agentName, workingDir, false);
  const projectPath = path.join(workingDir, agentName);
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
  await createProjectFromTemplate('package', simpleName, workingDir, false);
  const projectPath = path.join(workingDir, simpleName);

  processTemplate(projectPath, {
    packageName,
    simpleName,
    titleName,
    className,
    description,
  });
}
