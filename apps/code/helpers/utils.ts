import * as path from 'path';
import * as fs from 'fs';

export function getProjectRoot(): string {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
    currentDir = path.dirname(currentDir);
  }
  return path.join(currentDir, '..', '..', '..')
}
