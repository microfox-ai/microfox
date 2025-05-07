import { LanguageModelUsage } from 'ai';
import { tokenCosts } from '../tokenCosts';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface UsageLog {
  [modelName: string]: {
    usage: LanguageModelUsage;
    cost: number;
  };
}

/**
 * Logs the usage of a language model to a file
 * @param modelName - The name of the model (e.g. 'claude-3-5-sonnet-20240620')
 * @param usage - The usage data to log
 */
export function logUsage(modelName: string, usage: LanguageModelUsage) {
  const usageDir = join(process.cwd().replace('/scripts', ''), '.microfox');
  const usageFile = join(usageDir, 'pr-usage.json');

  // Ensure directory exists
  if (!existsSync(usageDir)) {
    mkdirSync(usageDir, { recursive: true });
  }

  // Read existing usage or create new
  let currentUsage: UsageLog = {};
  if (existsSync(usageFile)) {
    try {
      currentUsage = JSON.parse(readFileSync(usageFile, 'utf-8'));
    } catch (error) {
      console.error('Error reading usage file:', error);
    }
  }

  // Calculate cost
  const modelCosts = tokenCosts[modelName];
  if (!modelCosts) {
    throw new Error(`No cost configuration found for model: ${modelName}`);
  }

  const cost =
    usage.promptTokens * modelCosts.inputTokenCost +
    usage.completionTokens * modelCosts.outputTokenCost;

  // Update usage
  if (!currentUsage[modelName]) {
    currentUsage[modelName] = {
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      cost: 0,
    };
  }

  currentUsage[modelName].usage.promptTokens += usage.promptTokens;
  currentUsage[modelName].usage.completionTokens += usage.completionTokens;
  currentUsage[modelName].cost += cost;

  // Write updated usage
  writeFileSync(usageFile, JSON.stringify(currentUsage, null, 2));
}
