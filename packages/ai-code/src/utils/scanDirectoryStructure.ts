import * as fs from 'fs';
import * as path from 'path';
import { DirectoryStructure } from '../types';

const IGNORED_DIRS = new Set(['node_modules', 'dist', 'build', '.next', '.git', 'coverage']);
const IGNORED_EXTENSIONS = new Set(['.log', '.lock', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.env']);


export function formatDirectoryStructure(node: DirectoryStructure, depth = 0): string {
    let output = '  '.repeat(depth) + `- ${node.name} (${node.type})\n`;
    if (node.children) {
      for (const child of node.children) {
        output += formatDirectoryStructure(child, depth + 1);
        }
    }
    return output;
}

/**
 * Recursively scans a directory and builds a tree structure representing its contents.
 * All paths in the output are relative to the initial `dirPath` and use forward slashes.
 * @param dirPath The absolute path to the directory to scan.
 * @param baseDir The original root directory to make paths relative to.
 * @returns A DirectoryStructure object, or null if the path should be ignored.
 */
function scan(dirPath: string, baseDir: string): DirectoryStructure | null {
  const name = path.basename(dirPath);

  if (IGNORED_DIRS.has(name)) {
    return null;
  }

  try {
    const stats = fs.statSync(dirPath);
    // Calculate the path relative to the base directory and normalize slashes
    const relativePath = path.relative(baseDir, dirPath).replace(/\\/g, '/');

    if (stats.isDirectory()) {
      const children = fs
        .readdirSync(dirPath)
        .map(child => {
          const childPath = path.join(dirPath, child);
          return scan(childPath, baseDir);
        })
        .filter((child): child is DirectoryStructure => child !== null);

      if (children.length === 0 && dirPath !== baseDir) {
        // Return null for empty directories to exclude them, but not for the root
        // return null;
      }
      
      return {
        path: relativePath,
        type: 'directory',
        name,
        children,
      };
    } else if (stats.isFile()) {
      const ext = path.extname(name);
      if (IGNORED_EXTENSIONS.has(ext)) {
        return null;
      }
      return {
        path: relativePath,
        type: 'file',
        name,
      };
    }
  } catch (error: any) {
    // Ignore errors for symlinks or permission-denied files
    if (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'EPERM') {
      return null;
    }
    throw error;
  }

  return null;
}

/**
 * Scans a directory and builds a tree structure representing its contents.
 * This is the entry point for the recursive scan.
 * @param dirPath The absolute path to the directory to scan.
 * @returns A DirectoryStructure object with relative paths.
 */
export function scanDirectoryStructure(dirPath: string): DirectoryStructure | null {
  // The initial call uses dirPath as its own baseDir, so the root path is '.'
  const baseDir = dirPath;
  return scan(dirPath, baseDir);
} 