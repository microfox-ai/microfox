import fs from 'fs';
import path from 'path';

/**
 * Reads and aggregates usage data from the .microfox/pr-usage.json file.
 * Handles file not found and JSON parsing errors gracefully.
 */
export function readUsageData(
  packageDir: string,
): { totalTokens: number; totalCost: number; usageLog: any } | null {
  const usageFilePath = path.join(
    process.cwd().replace('/scripts', ''),
    '.microfox',
    'pr-usage.json',
  );

  if (!fs.existsSync(usageFilePath)) {
    return null;
  }

  try {
    const usageContent = fs.readFileSync(usageFilePath, 'utf-8');
    const usageLog = JSON.parse(usageContent);

    let totalTokens = 0;
    let totalCost = 0;

    for (const modelName in usageLog) {
      if (usageLog.hasOwnProperty(modelName)) {
        const modelData = usageLog[modelName];
        // Calculate total tokens for this model entry if not present
        const entryTokens =
          modelData.usage.totalTokens ??
          modelData.usage.promptTokens + modelData.usage.completionTokens;
        totalTokens += entryTokens;
        totalCost += modelData.cost || 0; // Add cost, default to 0 if missing
      }
    }

    // Recalculate totalTokens from prompt and completion tokens for accuracy
    totalTokens = 0;
    for (const modelName in usageLog) {
      if (usageLog.hasOwnProperty(modelName)) {
        const modelData = usageLog[modelName];
        totalTokens +=
          (modelData.usage.promptTokens || 0) +
          (modelData.usage.completionTokens || 0);
      }
    }

    return { totalTokens, totalCost, usageLog };
  } catch (error) {
    console.error('Error reading or parsing usage file:', error);
    return null;
  }
}
