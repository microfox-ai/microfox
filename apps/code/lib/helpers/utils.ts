import * as path from 'path';
import * as fs from 'fs';

export async function getProjectRoot(startPath: string = process.cwd()): Promise<string | null> {
  let currentPath = startPath;
  let count = 0
  while (true) {
    const microfoxRootPath = path.join(currentPath, 'microfox-root');
    if (fs.existsSync(microfoxRootPath)) {
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath || count > 10) {
      // Reached the root of the file system
      return null;
    }
    currentPath = parentPath;
  }
} 