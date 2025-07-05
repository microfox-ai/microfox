import { describe, it, expect } from 'vitest';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { generateCodeV0 } from '../generateCode.v0';
import { generateProject } from '../generateProject';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const TEST_TIMEOUT = 600000; // 10 minutes for complex generation
const verbose = true;
const log = (message: string, data?: any) => verbose && console.log(message, data || '');

const anthropicModel = anthropic('claude-3-5-sonnet-20240620');
const googleModel = google('gemini-2.5-pro-preview-06-05');

describe('Code Generation E2E Tests', () => {
  let outputDir: string;

  beforeAll(async () => {
    outputDir = path.resolve(__dirname, '../../test-output');
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(outputDir, { recursive: true });
  });

  it('should generate a large, single file using generateCodeV0', async () => {
    log('\\n--- Starting Single File Generation Test (generateCodeV0) ---\\n');
    const systemPrompt = `You are a senior TypeScript developer...`; // Abridged for brevity
    const userPrompt = `Create a single, comprehensive TypeScript file named 'data-processor.ts'...`; // Abridged

    let fileGenerated = false;
    let lineCount = 0;

    await generateCodeV0({
      model: anthropicModel,
      submodel: googleModel,
      systemPrompt,
      userPrompt,
      dir: outputDir,
      verbose,
      onFileSubmit: async (filePath, content) => {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content);
        log(`[generateCodeV0] File generated successfully at: ${filePath}`);
        lineCount = content.split('\\n').length;
        log(`[generateCodeV0] Line count: ${lineCount}`);
        fileGenerated = true;
      },
    });

    expect(fileGenerated).toBe(true);
    expect(lineCount).toBeGreaterThan(100); // Check for a substantial file
  }, TEST_TIMEOUT);

  it('should generate a multi-file project using generateProject', async () => {
    log('\\n--- Starting Multi-File Project Generation Test (generateProject) ---\\n');
    const systemPrompt = `You are an expert full-stack software developer...`; // Abridged
    const userPrompt = `Create a complete Node.js Express application in TypeScript...`; // Abridged

    const projectOutputDir = path.join(outputDir, 'multi-file-test');

    const result = await generateProject({
      model: anthropicModel,
      submodel: googleModel,
      systemPrompt,
      userPrompt,
      dir: projectOutputDir,
      verbose,
      writeFile: async (filePath, content) => {
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, content);
        log(`[generateProject] File generated: ${filePath}`);
      },
    });

    expect(result.generatedFiles.size).toBeGreaterThanOrEqual(3);
    expect(Array.from(result.generatedFiles.keys())).toContain(path.join(projectOutputDir, 'package.json'));
    expect(Array.from(result.generatedFiles.keys())).toContain(path.join(projectOutputDir, 'src', 'types', 'product.ts'));
    expect(Array.from(result.generatedFiles.keys())).toContain(path.join(projectOutputDir, 'src', 'app.ts'));

  }, TEST_TIMEOUT);
}); 