import * as fs from 'fs';
import * as path from 'path';

export function parseTemplate(templateContent: string): Map<string, string> {
  const files = new Map<string, string>();
  const fileSections = templateContent.split('--- filename: ');

  for (const section of fileSections) {
    if (!section.trim()) {
      continue;
    }

    const firstLineEnd = section.indexOf('\n');
    const filePath = section.substring(0, firstLineEnd).trim();
    const content = section.substring(firstLineEnd + 1);

    files.set(filePath, content);
  }

  return files;
}

export function createProjectFromParsedTemplate(
  destination: string,
  files: Map<string, string>,
  variables: Record<string, string>,
) {
  for (const [filePath, content] of files.entries()) {
    let finalContent = content;
    for (const [key, value] of Object.entries(variables)) {
      finalContent = finalContent.replace(
        new RegExp(`<%=\\s*${key}\\s*%>`, 'g'),
        value,
      );
    }
    
    // A special case for the package template's changelog
    if (filePath === 'CHANGELOG.md') {
        finalContent = finalContent.replace(
            new RegExp(`<%=\\s*new Date\\(\\).toISOString\\(\\).split\\('T'\\)\\[0\\]\\s*%>`, 'g'),
            new Date().toISOString().split('T')[0],
        );
    }

    // Replace file path variables
    let finalPath = filePath;
    for (const [key, value] of Object.entries(variables)) {
        finalPath = finalPath.replace(
          new RegExp(`<%=\\s*${key}\\s*%>`, 'g'),
          value,
        );
    }

    const destinationPath = path.join(destination, finalPath);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.writeFileSync(destinationPath, finalContent);
  }
}
