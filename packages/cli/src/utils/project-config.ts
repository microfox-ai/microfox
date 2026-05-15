import * as fs from 'fs';
import * as path from 'path';

export const MICROFOX_CONFIG_FILENAMES = ['microfox.json', 'microfox.config.json'] as const;

function findConfigInDir(dir: string): string | null {
  for (const filename of MICROFOX_CONFIG_FILENAMES) {
    const configPath = path.join(dir, filename);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  return null;
}

export function resolveMicrofoxConfigPath(cwd: string): string | null {
  const localPath = findConfigInDir(cwd);
  if (localPath) {
    return localPath;
  }

  const parentPath = findConfigInDir(path.dirname(cwd));
  if (parentPath) {
    return parentPath;
  }

  return null;
}

export function ensureMicrofoxConfigInCwd(cwd: string): string | null {
  const localPath = findConfigInDir(cwd);
  if (localPath) {
    return localPath;
  }

  const parentDir = path.dirname(cwd);
  for (const filename of MICROFOX_CONFIG_FILENAMES) {
    const parentPath = path.join(parentDir, filename);
    if (!fs.existsSync(parentPath)) {
      continue;
    }

    const destinationPath = path.join(cwd, filename);
    try {
      fs.copyFileSync(parentPath, destinationPath);
      return destinationPath;
    } catch {
      return parentPath;
    }
  }

  return null;
}
