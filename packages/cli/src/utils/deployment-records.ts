import * as fs from 'fs';
import * as path from 'path';

interface DeploymentRecord {
  deploymentId: string;
  timestamp: number;
  date: string;
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

export function findServerlessWorkersDir(startDir: string): string | null {
  const resolvedStart = path.resolve(startDir);
  
  // Check if .serverless-workers exists at the same level (current directory)
  const serverlessDirInCurrent = path.join(resolvedStart, DEPLOYMENTS_DIR);
  const configPathInCurrent = path.join(serverlessDirInCurrent, 'microfox.json');
  
  if (fs.existsSync(serverlessDirInCurrent) && fs.existsSync(configPathInCurrent)) {
    return serverlessDirInCurrent;
  }
  
  // Also check in parent directory (at the same level as the current directory)
  const parentDir = path.dirname(resolvedStart);
  const serverlessDirInParent = path.join(parentDir, DEPLOYMENTS_DIR);
  const configPathInParent = path.join(serverlessDirInParent, 'microfox.json');
  
  if (fs.existsSync(serverlessDirInParent) && fs.existsSync(configPathInParent)) {
    return serverlessDirInParent;
  }

  return null;
}
