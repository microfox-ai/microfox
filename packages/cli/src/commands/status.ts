import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const ENDPOINT_BASE = ({ mode, version, port }: { mode?: string; version?: string; port?: number }) => {
  const normalizedMode = mode?.toLowerCase() === 'prod' || mode?.toLowerCase() === 'production' ? 'prod' : 'staging';
  const normalizedVersion = version?.toLowerCase() === 'v2' ? 'v2' : 'v1';
  if (port) return `http://localhost:${port}`;
  if (normalizedVersion === 'v2') return `https://${normalizedMode}-v2-cicd.microfox.app`;
  return `https://${normalizedMode}-v1-cicd.microfox.app`;
};

function readMicrofoxConfig(cwd: string) {
  const configPath = path.join(cwd, 'microfox.json');
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('❌ Error: `microfox.json` not found in the current directory.'));
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, any>;
}

async function getIdentifier(promptLabel: 'Run ID' | 'Deployment ID', provided?: string): Promise<string> {
  if (provided) return provided;
  const { id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: `Please enter the ${promptLabel}:`,
      validate: (input: string) => !!input || `${promptLabel} cannot be empty.`,
    },
  ]);
  return id as string;
}
  

async function fetchV1Status(runId: string, cfg: any) {
  const deploymentConfig = cfg.deployment || {};
  const mode = deploymentConfig.apiMode || cfg.apiMode || cfg.API_MODE;
  const port = deploymentConfig.port || cfg.port || cfg.PORT;
  const base = ENDPOINT_BASE({ mode, version: 'v1', port });
  const url = `${base}/api/deployment-status/agent/status/${runId}`;
  return axios.get(url);
}

async function fetchV2Deployment(deploymentId: string, cfg: any) {
  const deploymentConfig = cfg.deployment || {};
  const mode = deploymentConfig.apiMode || cfg.apiMode || cfg.API_MODE;
  const port = deploymentConfig.port || cfg.port || cfg.PORT;
  const base = ENDPOINT_BASE({ mode, version: 'v2', port });
  const url = `${base}/api/deployments/${deploymentId}`;
  const projectId: string | undefined = cfg.projectId || process.env.PROJECT_ID;
  if (!projectId) {
    console.error(chalk.red('❌ Error: `projectId` is required for v2. Add `projectId` to your microfox.json'));
    process.exit(1);
  }
  return axios.get(url, { headers: { 'x-project-id': projectId } });
}

async function statusAction(idArg?: string): Promise<void> {
  const cwd = process.cwd();
  const cfg = readMicrofoxConfig(cwd);
  const deploymentConfig = cfg.deployment || {};
  const apiVersion = deploymentConfig.apiVersion || cfg.apiVersion || cfg.API_VERSION;
  const isV2 = apiVersion?.toLowerCase?.() === 'v2';

  if (!isV2) {
    const runId = await getIdentifier('Run ID', idArg);
    const resp = await fetchV1Status(runId, cfg);
    const deployment = resp.data.data.deployment;

    console.log(chalk.cyan.bold('🚀 Deployment Status (v1)'));
    console.log(chalk.gray('----------------------------------------'));
    console.log(`${chalk.bold('Run ID:')}      ${deployment.sha}`);
    console.log(`${chalk.bold('Status:')}      ${chalk.green(deployment.status)}`);
    console.log(`${chalk.bold('Description:')} ${deployment.statusDescription}`);
    console.log(`${chalk.bold('Stage:')}       ${deployment.stage}`);
    console.log(`${chalk.bold('Start Time:')}  ${deployment.startTime ? new Date(deployment.startTime).toLocaleString() : 'N/A'}`);
    console.log(`${chalk.bold('End Time:')}    ${deployment.endTime ? new Date(deployment.endTime).toLocaleString() : 'N/A'}`);
    console.log(`${chalk.bold('Base URL:')}    ${deployment.baseUrl ? chalk.underline.blue(deployment.baseUrl) : 'N/A'}`);
    console.log(chalk.gray('----------------------------------------'));
    return;
  }

  // v2
  const deploymentId = await getIdentifier('Deployment ID', idArg);
  try {
    const resp = await fetchV2Deployment(deploymentId, cfg);
    const dep = resp.data;

    console.log(chalk.cyan.bold('🚀 Deployment Status (v2)'));
    console.log(chalk.gray('----------------------------------------'));
    console.log(`${chalk.bold('Deployment ID:')} ${dep._id || deploymentId}`);
    console.log(`${chalk.bold('Project ID:')}    ${dep.projectId || 'N/A'}`);
    console.log(`${chalk.bold('Status:')}        ${chalk.green(dep.status)}`);
    if (dep.error?.message) console.log(`${chalk.bold('Error:')}         ${dep.error.message}`);
    const start = dep.metrics?.timing?.startTime ? new Date(dep.metrics.timing.startTime).toLocaleString() : 'N/A';
    const end = dep.metrics?.timing?.endTime ? new Date(dep.metrics.timing.endTime).toLocaleString() : 'N/A';
    console.log(`${chalk.bold('Start Time:')}    ${start}`);
    console.log(`${chalk.bold('End Time:')}      ${end}`);
    console.log(`${chalk.bold('Base URL:')}      ${dep.baseUrl ? chalk.underline.blue(dep.baseUrl) : 'N/A'}`);
    console.log(chalk.gray('----------------------------------------'));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error(chalk.red(`❌ Error: Deployment with ID "${deploymentId}" not found.`));
    } else {
      console.error(chalk.red('❌ An error occurred while fetching deployment status:'));
      console.error(error);
    }
    process.exit(1);
  }
}

type LogsOptions = { step?: string; limit?: number; cursor?: string };

async function logsAction(idArg?: string, options: LogsOptions = {}): Promise<void> {
  const cwd = process.cwd();
  const cfg = readMicrofoxConfig(cwd);
  const deploymentConfig = cfg.deployment || {};
  const apiVersion = deploymentConfig.apiVersion || cfg.apiVersion || cfg.API_VERSION;
  const isV2 = apiVersion?.toLowerCase?.() === 'v2';

  if (!isV2) {
    // Preserve existing behavior for v1
    try {
      const runId = await getIdentifier('Run ID', idArg);
      const resp = await fetchV1Status(runId, cfg);
      const logs = resp.data.data.deploymentLogs;
      console.log(chalk.cyan.bold('📜 Deployment Logs (v1)'));
      console.log(chalk.gray('----------------------------------------'));
      console.log(logs);
      console.log(chalk.gray('----------------------------------------'));
    } catch (error) {
      console.error(chalk.red('❌ An error occurred while fetching deployment logs:'));
      console.error(error);
      process.exit(1);
    }
    return;
  }

  // v2 logs via /deployments/:deploymentId/logs
  const deploymentId = await getIdentifier('Deployment ID', idArg);
  const mode = deploymentConfig.apiMode || cfg.apiMode || cfg.API_MODE;
  const port = deploymentConfig.port || cfg.port || cfg.PORT;
  const base = ENDPOINT_BASE({ mode, version: 'v2', port });
  const url = `${base}/api/deployments/${deploymentId}/logs`;
  const projectId: string | undefined = cfg.projectId || process.env.PROJECT_ID;
  if (!projectId) {
    console.error(chalk.red('❌ Error: `projectId` is required for v2. Add `projectId` to your microfox.json.'));
    process.exit(1);
  }
  try {
    const resp = await axios.get(url, { headers: { 'x-project-id': projectId } });
    const logs = resp.data?.logs || {};

    const printSection = (title: string, entries: any[]) => {
      const sorted = [...(entries || [])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      console.log(chalk.bold.underline(title));
      if (!sorted.length) {
        console.log(chalk.gray('  (no entries)'));
        return;
      }
      for (const entry of sorted) {
        const ts = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '';
        console.log(`${ts} ${entry.message ?? ''}`.trim());
      }
      console.log('');
    };

    console.log(chalk.cyan.bold('📜 Deployment Logs (v2)'));
    console.log(chalk.gray('----------------------------------------'));
    printSection('compiling', logs.compiling || []);
    printSection('deploying', logs.deploying || []);
    printSection('post_deployment', logs.post_deployment || []);
    console.log(chalk.gray('----------------------------------------'));
  } catch (error) {
    console.error(chalk.red('❌ An error occurred while fetching deployment logs (v2):'));
    console.error(error);
    process.exit(1);
  }
}

async function metricsAction(idArg?: string): Promise<void> {
  const cwd = process.cwd();
  const cfg = readMicrofoxConfig(cwd);
  const deploymentConfig = cfg.deployment || {};
  const apiVersion = deploymentConfig.apiVersion || cfg.apiVersion || cfg.API_VERSION;
  const isV2 = apiVersion?.toLowerCase?.() === 'v2';

  if (!isV2) {
    const runId = await getIdentifier('Run ID', idArg);
    try {
      const resp = await fetchV1Status(runId, cfg);
      const metrics = resp.data.data.deployment.metrics;

      console.log(chalk.cyan.bold('📊 Deployment Metrics (v1)'));
      console.log(chalk.gray('----------------------------------------'));

      console.log(chalk.bold.underline('System'));
      console.log(`  Platform:    ${metrics.system.platform}`);
      console.log(`  Architecture:  ${metrics.system.arch}`);
      console.log(`  Node Version:  ${metrics.system.nodeVersion}`);

      console.log(chalk.bold.underline('\nTiming (ms)'));
      for (const [step, duration] of Object.entries(metrics?.timing?.stepDurations || {})) {
        console.log(`  ${step}:`.padEnd(15) + `${duration ? `${duration}ms` : 'N/A'}`);
      }
      console.log(`  Total Duration:`.padEnd(15) + `${metrics?.timing?.totalDuration ? `${metrics.timing.totalDuration}ms` : 'N/A'}`);

      console.log(chalk.bold.underline('\nResources'));
      console.log(chalk.bold('  CPU:'));
      console.log(`    Peak:        ${metrics?.resources?.cpu?.peak ? `${metrics?.resources?.cpu?.peak}${metrics?.resources?.cpu?.usageUnits}` : 'N/A'}`);
      console.log(`    Average:     ${metrics?.resources?.cpu?.average ? `${metrics?.resources?.cpu?.average}${metrics?.resources?.cpu?.usageUnits}` : 'N/A'}`);
      console.log(chalk.bold('  Memory:'));
      console.log(`    Peak:        ${metrics?.resources?.memory?.peak ? `${metrics?.resources?.memory?.peak.toFixed(2)}${metrics?.resources?.memory?.usageUnits}` : 'N/A'}`);
      console.log(`    Average:     ${metrics?.resources?.memory?.average ? `${metrics?.resources?.memory?.average.toFixed(2)}${metrics?.resources?.memory?.usageUnits}` : 'N/A'}`);
      console.log(chalk.bold('  Disk:'));
      console.log(`    Final Size:  ${metrics?.resources?.diskSize?.final ? `${(metrics?.resources?.diskSize?.final / (1024 * 1024)).toFixed(2)} MB` : 'N/A'}`);

      console.log(chalk.gray('----------------------------------------'));
    } catch (error) {
      console.error(chalk.red('❌ An error occurred while fetching deployment metrics:'));
      console.error(error);
      process.exit(1);
    }
    return;
  }

  // v2
  const deploymentId = await getIdentifier('Deployment ID', idArg);
  try {
    const resp = await fetchV2Deployment(deploymentId, cfg);
    const metrics = resp.data?.metrics || {};

    console.log(chalk.cyan.bold('📊 Deployment Metrics (v2)'));
    console.log(chalk.gray('----------------------------------------'));

    // Timing
    console.log(chalk.bold.underline('Timing'));
    const start = metrics?.timing?.startTime ? new Date(metrics.timing.startTime).toLocaleString() : 'N/A';
    const end = metrics?.timing?.endTime ? new Date(metrics.timing.endTime).toLocaleString() : 'N/A';
    console.log(`  Start:         ${start}`);
    console.log(`  End:           ${end}`);
    if (metrics?.timing?.totalDurationMs != null) {
      console.log(`  Total:         ${metrics.timing.totalDurationMs} ms`);
    }
    if (metrics?.timing?.stepDurationsMs) {
      for (const [step, duration] of Object.entries(metrics.timing.stepDurationsMs)) {
        console.log(`  ${step}:`.padEnd(15) + `${duration ?? 'N/A'} ms`);
      }
    }

    // Resources
    console.log(chalk.bold.underline('\nResources'));
    if (metrics?.resources?.cpu) {
      console.log(chalk.bold('  CPU:'));
      if (metrics.resources.cpu.peakPercent != null) console.log(`    Peak:        ${metrics.resources.cpu.peakPercent}%`);
      if (metrics.resources.cpu.averagePercent != null) console.log(`    Average:     ${metrics.resources.cpu.averagePercent}%`);
    }
    if (metrics?.resources?.memory) {
      console.log(chalk.bold('  Memory:'));
      if (metrics.resources.memory.peakMb != null) console.log(`    Peak:        ${metrics.resources.memory.peakMb} MB`);
      if (metrics.resources.memory.averageMb != null) console.log(`    Average:     ${metrics.resources.memory.averageMb} MB`);
    }
    if (metrics?.resources?.disk) {
      console.log(chalk.bold('  Disk:'));
      if (metrics.resources.disk.imageSizeMb != null) console.log(`    Image Size:  ${metrics.resources.disk.imageSizeMb} MB`);
    }

    // Network
    if (metrics?.network?.deploymentDataTransfer) {
      console.log(chalk.bold.underline('\nNetwork'));
      const net = metrics.network.deploymentDataTransfer;
      if (net.ingressMb != null) console.log(`  Ingress:       ${net.ingressMb} MB`);
      if (net.egressMb != null) console.log(`  Egress:        ${net.egressMb} MB`);
    }

    console.log(chalk.gray('----------------------------------------'));
  } catch (error) {
    console.error(chalk.red('❌ An error occurred while fetching deployment metrics (v2):'));
    console.error(error);
    process.exit(1);
  }
}

export const statusCommand = new Command('status')
    .description('Check the deployment status of your agent')
    .argument('[runId]', 'The deployment Run ID')
    .action(async (runId) => {
        try {
            await statusAction(runId);
        } catch (error) {
            // Error is already handled in getDeploymentData, just exit
        }
    });

export const logsCommand = new Command('logs')
    .description('View the deployment logs for your agent')
    .argument('[id]', 'The Run ID (v1) or Deployment ID (v2)')
    .option('-s, --step <step>', 'Log step: compiling|deploying|post_deployment', 'deploying')
    .option('-l, --limit <limit>', 'Number of log lines to fetch (default 100)', (value) => parseInt(value, 10))
    .option('-c, --cursor <cursor>', 'Pagination cursor (ISO timestamp)')
    .action(async (id, opts) => {
        try {
            await logsAction(id, opts);
        } catch (error) {
            // Error is already handled in getDeploymentData, just exit
        }
    });

export const metricsCommand = new Command('metrics')
    .description('View the deployment metrics for your agent')
    .argument('[runId]', 'The deployment Run ID')
    .action(async (runId) => {
        try {
            await metricsAction(runId);
        } catch (error) {
            // Error is already handled in getDeploymentData, just exit
        }
    }); 