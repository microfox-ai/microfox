import { prCommentor } from '../../octokit/octokit';
import { readUsageData } from './readUsageData';
import fs from 'fs';
import path from 'path';

export async function cleanupUsage(): Promise<void> {
  // Read current usage data
  const usageData = readUsageData(process.cwd().replace('/scripts', ''));

  // If there is usage data, create a comment with the stats
  if (usageData) {
    let modelBreakdown = '';
    for (const [model, data] of Object.entries(usageData.usageLog)) {
      const modelData = data as any;
      modelBreakdown += `
### ${model}
- Prompt Tokens: ${modelData.usage.promptTokens.toLocaleString()}
- Completion Tokens: ${modelData.usage.completionTokens.toLocaleString()}
- Total Tokens: ${(modelData.usage.promptTokens + modelData.usage.completionTokens).toLocaleString()}
- Cost: $${modelData.cost.toFixed(4)}`;

      // Add cost per token if available
      const totalTokens =
        modelData.usage.promptTokens + modelData.usage.completionTokens;
      if (totalTokens > 0) {
        const costPerToken = modelData.cost / totalTokens;
        modelBreakdown += `\n- Cost per Token: $${costPerToken.toFixed(6)}`;
      }
    }

    const commentBody = `## 📊 Ai Usage Statistics Summary

### Total Usage
- Total Tokens: ${usageData.totalTokens.toLocaleString()}
- Total Cost: $${usageData.totalCost.toFixed(4)}

### Model Breakdown${modelBreakdown}

This usage data has been reset for the next session.`;

    await prCommentor.createComment({
      body: commentBody,
    });
  }

  // Reset the usage data
  const usageFilePath = path.join(
    process.cwd().replace('/scripts', ''),
    '.microfox',
    'pr-usage.json',
  );

  // Ensure directory exists
  const usageDir = path.dirname(usageFilePath);
  if (!fs.existsSync(usageDir)) {
    fs.mkdirSync(usageDir, { recursive: true });
  }

  // Write empty usage object
  fs.writeFileSync(usageFilePath, JSON.stringify({}, null, 2));
}
