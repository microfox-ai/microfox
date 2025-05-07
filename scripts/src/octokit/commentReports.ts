import fs from 'fs';
import path from 'path';
import { readUsageData } from '../ai/usage/readUsageData';
import { prCommentor } from './octokit';

// Helper function to extract step name from a table row
function getStepName(
  line: string,
  emojis: Record<string, string>,
): string | null {
  if (!line.startsWith('|') || line.startsWith('|------')) return null; // Ignore header/separator
  const cellContent = line.split('|')[1]?.trim();
  if (!cellContent) return null;

  for (const step in emojis) {
    if (cellContent.startsWith(`${emojis[step]} ${step}`)) {
      return step;
    }
  }
  return null; // Should not happen if emojis are correct
}
/**
 * Create or update research report markdown comment
 */

export async function updateResearchReport(
  step: string,
  data: {
    status?: 'success' | 'failure' | 'in-progress';
    usage?: any;
    totalTokens?: number;
    details?: Record<string, any>;
  },
  packageDir: string,
): Promise<void> {
  const reportPath = path.join(packageDir, 'research-report.md');
  let report: string;

  if (!fs.existsSync(reportPath)) {
    report = `# Packagefox: Research Report

| Step | Status | Details | Token Usage | Total Tokens |
|------|--------|---------|-------------|--------------|
`;
  } else {
    report = fs.readFileSync(reportPath, 'utf8');
  }

  const emojiMap: Record<string, string> = {
    generateMetadata: '📝',
    extractLinks: '🔗',
    analyzeLinks: '🔍',
    extractContentFromUrls: '📄',
    summarizeContent: '📊',
  };

  const status = data.status === 'success' ? '✅' : '⏳';
  const details = data.details
    ? Object.entries(data.details)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>')
    : '';
  const tokenUsage = data.usage
    ? `${data.usage.promptTokens} + ${data.usage.completionTokens} = ${data.usage.totalTokens}`
    : '-';
  const totalTokens = data.totalTokens ? data.totalTokens.toString() : '-';

  const newRow = `| ${emojiMap[step]} ${step} | ${status} | ${details} | ${tokenUsage} | ${totalTokens} |\n`;

  const lines = report.split('\n');
  const stepIndex = lines.findIndex(line => line.includes(step));
  let insertIndex = -1;

  if (stepIndex !== -1) {
    insertIndex = stepIndex;
    lines.splice(stepIndex, 1);
  } else {
    const separatorIndex = lines.findIndex(line => line.startsWith('|------'));
    if (separatorIndex !== -1) {
      insertIndex = separatorIndex + 1;
    } else {
      insertIndex = 3;
    }
  }

  lines.splice(insertIndex, 0, newRow);

  // Separate header/separator lines from data lines
  const separatorIndex = lines.findIndex(line => line.startsWith('|------'));
  const headerLines = lines.slice(0, separatorIndex + 1);
  let dataLines = lines
    .slice(separatorIndex + 1)
    .filter(line => line.trim() !== ''); // Filter empty lines

  // Sort data lines based on predefined step order
  dataLines.sort((a, b) => {
    const stepA = getStepName(a, emojiMap);
    const stepB = getStepName(b, emojiMap);
    const indexA = stepA ? researchSteps.indexOf(stepA) : -1;
    const indexB = stepB ? researchSteps.indexOf(stepB) : -1;

    // Handle cases where a step might not be in the predefined list (shouldn't happen ideally)
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // Reconstruct the report
  report = headerLines.join('\n') + '\n' + dataLines.join('\n');

  // Add or update usage footer
  const usageData = readUsageData(packageDir);
  const footerMarker = '\n\n---\n**Total Usage:**';
  const footerContent = `Tokens: ${usageData?.totalTokens} | Cost: $${usageData?.totalCost.toFixed(4)}`;
  const footerLine = `${footerMarker} ${footerContent}`;

  const footerIndex = report.indexOf(footerMarker);

  if (usageData) {
    if (footerIndex !== -1) {
      // Update existing footer
      report = report.substring(0, footerIndex) + footerLine;
    } else {
      // Append new footer
      report += footerLine;
    }
  } else if (footerIndex !== -1) {
    // Remove footer if usage data is no longer available
    report = report.substring(0, footerIndex);
  }

  // Ensure directory exists before writing
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);

  if (process.env.PR_NUMBER) {
    await prCommentor.createOrUpdateComment(
      {
        body: report,
      },
      'Packagefox: Research Report',
    );
  }
}
/**
 * Create or update build report markdown comment
 */

export async function updateBuildReport(
  step: string,
  data: {
    status?: 'success' | 'failure' | 'in-progress';
    details?: Record<string, any>;
    error?: any;
  },
  packageDir: string,
): Promise<void> {
  const reportPath = path.join(packageDir, 'build-report.md');
  let report: string;

  if (!fs.existsSync(reportPath)) {
    report = `# Packagefox: Build Report

| Step | Status | Details | Error |
|------|--------|---------|-------|
`;
  } else {
    report = fs.readFileSync(reportPath, 'utf8');
  }

  const emojiMap: Record<string, string> = {
    build: '🏗️',
    fix: '🔧',
    analyze: '🔍',
    apply: '✏️',
    cleanup: '🧹',
  };

  const statusMap: Record<string, string> = {
    success: '✅',
    failure: '❌',
    'in-progress': '⏳',
  };

  const status = data.status ? statusMap[data.status] : '⏳';
  const details = data.details
    ? Object.entries(data.details)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>')
    : '';
  const error = data.error ? JSON.stringify(data.error, null, 2) : '';

  const newRow = `| ${emojiMap[step]} ${step} | ${status} | ${details} | ${error} |\n`;

  const lines = report.split('\n');
  const stepIndex = lines.findIndex(line => line.includes(step));
  let insertIndex = -1;

  if (stepIndex !== -1) {
    insertIndex = stepIndex;
    lines.splice(stepIndex, 1);
  } else {
    const separatorIndex = lines.findIndex(line => line.startsWith('|------'));
    if (separatorIndex !== -1) {
      insertIndex = separatorIndex + 1;
    } else {
      insertIndex = 3;
    }
  }

  lines.splice(insertIndex, 0, newRow);

  // Separate header/separator lines from data lines
  const separatorIndex = lines.findIndex(line => line.startsWith('|------'));
  const headerLines = lines.slice(0, separatorIndex + 1);
  let dataLines = lines
    .slice(separatorIndex + 1)
    .filter(line => line.trim() !== ''); // Filter empty lines

  // Sort data lines based on predefined step order
  dataLines.sort((a, b) => {
    const stepA = getStepName(a, emojiMap);
    const stepB = getStepName(b, emojiMap);
    const indexA = stepA ? buildSteps.indexOf(stepA) : -1;
    const indexB = stepB ? buildSteps.indexOf(stepB) : -1;

    // Handle cases where a step might not be in the predefined list
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // Reconstruct the report
  report = headerLines.join('\n') + '\n' + dataLines.join('\n');

  // Add or update usage footer
  const usageData = readUsageData(packageDir);
  const footerMarker = '\n\n---\n**Total Usage:**';
  const footerContent = `Tokens: ${usageData?.totalTokens} | Cost: $${usageData?.totalCost.toFixed(4)}`;
  const footerLine = `${footerMarker} ${footerContent}`;

  const footerIndex = report.indexOf(footerMarker);

  if (usageData) {
    if (footerIndex !== -1) {
      // Update existing footer
      report = report.substring(0, footerIndex) + footerLine;
    } else {
      // Append new footer
      report += footerLine;
    }
  } else if (footerIndex !== -1) {
    // Remove footer if usage data is no longer available
    report = report.substring(0, footerIndex);
  }

  // Ensure directory exists before writing
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);

  if (process.env.PR_NUMBER) {
    await prCommentor.createOrUpdateComment(
      {
        body: report,
      },
      'Packagefox: Build Report',
    );
  }
}
/**
 * Create or update documentation report markdown comment
 */

export async function updateDocReport(
  step: string,
  data: {
    status?: 'success' | 'failure' | 'in-progress';
    details?: Record<string, any>;
    error?: any;
  },
  packageDir: string,
): Promise<void> {
  const reportPath = path.join(packageDir, 'doc-report.md');
  let report: string;

  if (!fs.existsSync(reportPath)) {
    report = `# Packagefox: Documentation Report

| Step | Status | Details | Error |
|------|--------|---------|-------|
`;
  } else {
    report = fs.readFileSync(reportPath, 'utf8');
  }

  const emojiMap: Record<string, string> = {
    generate: '📝',
    validate: '✅',
    save: '💾',
    build: '🏗️',
  };

  const statusMap: Record<string, string> = {
    success: '✅',
    failure: '❌',
    'in-progress': '⏳',
  };

  const status = data.status ? statusMap[data.status] : '⏳';
  const details = data.details
    ? Object.entries(data.details)
        .map(([key, value]) => `${key}: ${value}`)
        .join('<br>')
    : '';
  const error = data.error ? JSON.stringify(data.error, null, 2) : '';

  const newRow = `| ${emojiMap[step]} ${step} | ${status} | ${details} | ${error} |\n`;

  const lines = report.split('\n');
  const stepIndex = lines.findIndex(line => line.includes(step));
  let insertIndex = -1;

  if (stepIndex !== -1) {
    insertIndex = stepIndex;
    lines.splice(stepIndex, 1);
  } else {
    const separatorIndex = lines.findIndex(line => line.startsWith('|------'));
    if (separatorIndex !== -1) {
      insertIndex = separatorIndex + 1;
    } else {
      insertIndex = 3;
    }
  }

  lines.splice(insertIndex, 0, newRow);

  // Separate header/separator lines from data lines
  const separatorIndex = lines.findIndex(line => line.startsWith('|------'));
  const headerLines = lines.slice(0, separatorIndex + 1);
  let dataLines = lines
    .slice(separatorIndex + 1)
    .filter(line => line.trim() !== ''); // Filter empty lines

  // Sort data lines based on predefined step order
  dataLines.sort((a, b) => {
    const stepA = getStepName(a, emojiMap);
    const stepB = getStepName(b, emojiMap);
    const indexA = stepA ? docSteps.indexOf(stepA) : -1;
    const indexB = stepB ? docSteps.indexOf(stepB) : -1;

    // Handle cases where a step might not be in the predefined list
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  // Reconstruct the report
  report = headerLines.join('\n') + '\n' + dataLines.join('\n');

  // Add or update usage footer
  const usageData = readUsageData(packageDir);
  const footerMarker = '\n\n---\n**Total Usage:**';
  const footerContent = `Tokens: ${usageData?.totalTokens} | Cost: $${usageData?.totalCost.toFixed(4)}`;
  const footerLine = `${footerMarker} ${footerContent}`;

  const footerIndex = report.indexOf(footerMarker);

  if (usageData) {
    if (footerIndex !== -1) {
      // Update existing footer
      report = report.substring(0, footerIndex) + footerLine;
    } else {
      // Append new footer
      report += footerLine;
    }
  } else if (footerIndex !== -1) {
    // Remove footer if usage data is no longer available
    report = report.substring(0, footerIndex);
  }

  // Ensure directory exists before writing
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);

  if (process.env.PR_NUMBER) {
    await prCommentor.createOrUpdateComment(
      {
        body: report,
      },
      'Packagefox: Documentation Report',
    );
  }
}
/**
 * Create or update code generation report markdown comment
 */

export async function updateCodeGenReport(
  data: {
    files: Record<string, string>;
    setupInfo: {
      authType: string;
      authSdk?: string;
      oauth2Scopes?: string[];
      setupInfo: string;
    };
    totalBytes: number;
  },
  packageDir: string,
): Promise<void> {
  const reportPath = path.join(packageDir, 'codegen-report.md');
  let report: string;

  if (!fs.existsSync(reportPath)) {
    report = `# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
`;
  } else {
    report = fs.readFileSync(reportPath, 'utf8');
  }

  // Add file information
  const fileRows = Object.entries(data.files)
    .map(([file, content]) => {
      const size = Buffer.byteLength(content, 'utf8');
      return `| ${file} | ${size} |`;
    })
    .join('\n');

  // Add setup information
  const setupInfo = `
## Setup Information
- **Auth Type**: ${data.setupInfo.authType}
${data.setupInfo.authSdk ? `- **Auth SDK**: ${data.setupInfo.authSdk}` : ''}
${data.setupInfo.oauth2Scopes?.length ? `- **OAuth2 Scopes**: ${data.setupInfo.oauth2Scopes.join(', ')}` : ''}
- **Setup Info**: ${data.setupInfo.setupInfo}
`;

  // Add usage footer
  const usageData = readUsageData(packageDir);
  const footerMarker = '\n\n---\n**Total Usage:**';
  const footerContent = `Total Bytes: ${data.totalBytes} | Tokens: ${usageData?.totalTokens} | Cost: $${usageData?.totalCost.toFixed(4)}`;
  const footerLine = `${footerMarker} ${footerContent}`;

  // Construct final report
  report = `# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
${fileRows}
${setupInfo}
${footerLine}`;

  // Ensure directory exists before writing
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, report);

  if (process.env.PR_NUMBER) {
    await prCommentor.createOrUpdateComment(
      {
        body: report,
      },
      'Packagefox: Code Generation Report',
    );
  }
} // Define the expected order of steps for each report type

export const researchSteps = [
  'generateMetadata',
  'extractLinks',
  'analyzeLinks',
  'extractContentFromUrls',
  'summarizeContent',
];
export const buildSteps = ['build', 'fix', 'analyze', 'apply', 'cleanup'];
export const docSteps = ['generate', 'validate', 'save', 'build'];
