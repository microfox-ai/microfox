import * as fs from 'fs';
import * as path from 'path';

export interface DeploymentRecord {
  deploymentId: string;
  timestamp: number;
  date: string;
  /** When using per-group layout, which group this deployment was for. */
  group?: string;
}

const DEPLOYMENTS_DIR = '.serverless-workers';
const DEPLOYMENTS_FILE = 'deployments.json';

function isAlreadyInServerlessWorkersDir(cwd: string): boolean {
  const dirName = path.basename(path.resolve(cwd));
  return dirName === DEPLOYMENTS_DIR;
}

function getDeploymentsPath(cwd: string): string {
  // If we're already inside .serverless-workers, save directly in current directory
  if (isAlreadyInServerlessWorkersDir(cwd)) {
    return path.join(cwd, DEPLOYMENTS_FILE);
  }
  return path.join(cwd, DEPLOYMENTS_DIR, DEPLOYMENTS_FILE);
}

function getDeploymentsDir(cwd: string): string {
  // If we're already inside .serverless-workers, use current directory
  if (isAlreadyInServerlessWorkersDir(cwd)) {
    return cwd;
  }
  return path.join(cwd, DEPLOYMENTS_DIR);
}

export function ensureDeploymentsDir(cwd: string): void {
  const dir = getDeploymentsDir(cwd);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getDeploymentRecords(cwd: string): DeploymentRecord[] {
  const filePath = getDeploymentsPath(cwd);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as DeploymentRecord[];
  } catch {
    return [];
  }
}

export function saveDeploymentRecord(cwd: string, deploymentId: string): void {
  ensureDeploymentsDir(cwd);
  const records = getDeploymentRecords(cwd);
  const newRecord: DeploymentRecord = {
    deploymentId,
    timestamp: Date.now(),
    date: new Date().toISOString(),
  };
  records.push(newRecord);
  const filePath = getDeploymentsPath(cwd);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
}

export function getLatestDeploymentId(cwd: string, n: number = 1): string[] {
  const records = getDeploymentRecords(cwd);
  if (records.length === 0) {
    return [];
  }
  // Sort by timestamp descending (newest first)
  const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
  return sorted.slice(0, n).map(r => r.deploymentId);
}

/** Path to deployments file at serverless root (e.g. .serverless-workers/deployments.json). */
function getDeploymentsPathAtRoot(serverlessRoot: string): string {
  return path.join(serverlessRoot, DEPLOYMENTS_FILE);
}

/** Save a deployment record to the root deployments file, with optional group. */
export function saveDeploymentRecordToRoot(
  serverlessRoot: string,
  deploymentId: string,
  group?: string
): void {
  const filePath = getDeploymentsPathAtRoot(serverlessRoot);
  const records = getDeploymentRecordsFromRoot(serverlessRoot);
  const newRecord: DeploymentRecord = {
    deploymentId,
    timestamp: Date.now(),
    date: new Date().toISOString(),
    ...(group != null && group !== '' ? { group } : {}),
  };
  records.push(newRecord);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
}

/** Read deployment records from the root deployments file. */
export function getDeploymentRecordsFromRoot(serverlessRoot: string): DeploymentRecord[] {
  const filePath = getDeploymentsPathAtRoot(serverlessRoot);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as DeploymentRecord[];
  } catch {
    return [];
  }
}

/** Get latest n deployment IDs from root file, optionally filtered by group. */
export function getLatestDeploymentIdFromRoot(
  serverlessRoot: string,
  n: number = 1,
  group?: string
): string[] {
  let records = getDeploymentRecordsFromRoot(serverlessRoot);
  if (group != null && group !== '') {
    records = records.filter(r => (r.group ?? '') === group);
  }
  if (records.length === 0) {
    return [];
  }
  const sorted = [...records].sort((a, b) => b.timestamp - a.timestamp);
  return sorted.slice(0, n).map(r => r.deploymentId);
}

export function findServerlessWorkersDir(startDir: string): string | null {
  const resolvedStart = path.resolve(startDir);
  
  const looksLikeServerlessWorkersDir = (dir: string): boolean => {
    if (!fs.existsSync(dir)) return false;
    try {
      if (!fs.statSync(dir).isDirectory()) return false;
    } catch { return false; }

    // Single-group layout: serverless.yml at root
    if (fs.existsSync(path.join(dir, 'serverless.yml'))) return true;

    // Per-group layout: any immediate subdir contains serverless.yml (core/default/workflows)
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        if (e.isDirectory() && !e.name.startsWith('.')) {
          if (fs.existsSync(path.join(dir, e.name, 'serverless.yml'))) {
            return true;
          }
        }
      }
    } catch {
      // ignore
    }
    return false;
  };

  // Check if .serverless-workers exists at the same level (current directory)
  const serverlessDirInCurrent = path.join(resolvedStart, DEPLOYMENTS_DIR);
  if (looksLikeServerlessWorkersDir(serverlessDirInCurrent)) {
    return serverlessDirInCurrent;
  }
  
  // Also check in parent directory (at the same level as the current directory)
  const parentDir = path.dirname(resolvedStart);
  const serverlessDirInParent = path.join(parentDir, DEPLOYMENTS_DIR);
  if (looksLikeServerlessWorkersDir(serverlessDirInParent)) {
    return serverlessDirInParent;
  }

  return null;
}

/**
 * When using per-group layout, .serverless-workers has one subdir per group (e.g. core/, default/, workflows/)
 * each containing serverless.yml. If serverless.yml exists at serverlessRoot level, single-group (return null).
 * Otherwise returns the list of group names (subdir names that contain serverless.yml).
 */
export function getPerGroupNames(serverlessRoot: string): string[] | null {
  const rootServerlessYml = path.join(serverlessRoot, 'serverless.yml');
  if (fs.existsSync(rootServerlessYml)) {
    return null;
  }
  const entries = fs.readdirSync(serverlessRoot, { withFileTypes: true });
  const groups: string[] = [];
  for (const e of entries) {
    if (e.isDirectory() && !e.name.startsWith('.')) {
      const groupServerlessYml = path.join(serverlessRoot, e.name, 'serverless.yml');
      if (fs.existsSync(groupServerlessYml)) {
        groups.push(e.name);
      }
    }
  }
  return groups.length > 0 ? groups : null;
}
