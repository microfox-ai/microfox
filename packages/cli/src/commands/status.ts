import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import inquirer from 'inquirer';

const API_BASE_URL = 'https://staging-cicd.microfox.app/api/deployment-status/agent/status/';

async function getRunId(runId?: string): Promise<string> {
    if (runId) {
      return runId;
    }
    const { promptedRunId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'promptedRunId',
        message: 'Please enter the deployment Run ID:',
        validate: (input) => !!input || 'Run ID cannot be empty.',
      },
    ]);
    return promptedRunId;
  }
  

async function getDeploymentData(runId: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}${runId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error(chalk.red(`❌ Error: Deployment with Run ID "${runId}" not found.`));
    } else {
      console.error(chalk.red('❌ An error occurred while fetching deployment status:'));
      console.error(error);
    }
    process.exit(1);
  }
}

async function statusAction(runId?: string): Promise<void> {
    const finalRunId = await getRunId(runId);
    const data = await getDeploymentData(finalRunId);
    const deployment = data.data.deployment;

    console.log(chalk.cyan.bold('🚀 Deployment Status'));
    console.log(chalk.gray('----------------------------------------'));
    console.log(`${chalk.bold('Run ID:')}      ${deployment.sha}`);
    console.log(`${chalk.bold('Status:')}      ${chalk.green(deployment.status)}`);
    console.log(`${chalk.bold('Description:')} ${deployment.statusDescription}`);
    console.log(`${chalk.bold('Stage:')}       ${deployment.stage}`);
    console.log(`${chalk.bold('Start Time:')}  ${deployment.startTime ? new Date(deployment.startTime).toLocaleString() : 'N/A'}`);
    console.log(`${chalk.bold('End Time:')}    ${deployment.endTime ? new Date(deployment.endTime).toLocaleString() : 'N/A'}`);
    console.log(`${chalk.bold('Base URL:')}    ${deployment.baseUrl ? chalk.underline.blue(deployment.baseUrl) : 'N/A'}`);
    console.log(chalk.gray('----------------------------------------'));
}

async function logsAction(runId?: string): Promise<void> {
    const finalRunId = await getRunId(runId);
    const data = await getDeploymentData(finalRunId);
    const logs = data.data.deploymentLogs;

    console.log(chalk.cyan.bold('📜 Deployment Logs'));
    console.log(chalk.gray('----------------------------------------'));
    console.log(logs);
    console.log(chalk.gray('----------------------------------------'));
}

async function metricsAction(runId?: string): Promise<void> {
    const finalRunId = await getRunId(runId);
    const data = await getDeploymentData(finalRunId);
    const metrics = data.data.deployment.metrics;

    console.log(chalk.cyan.bold('📊 Deployment Metrics'));
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
    .argument('[runId]', 'The deployment Run ID')
    .action(async (runId) => {
        try {
            await logsAction(runId);
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