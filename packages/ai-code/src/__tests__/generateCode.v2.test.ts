import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { generateCodeV2 } from '../generateCode.v2';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const tempDir = path.join(__dirname, 'test-output-live');

describe('generateCodeV2 Live Test', () => {

  beforeAll(async () => {
    await fs.mkdir(tempDir, { recursive: true });
  });

  /*
  afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });
  */

  it('should generate and update a file in chunks using live AI calls', async () => {
    const codeModel = anthropic('claude-4-opus-20250514');
    const submodel = google('gemini-2.5-pro-preview-06-05');
    
    let finalContentFromSubmit = '';
    let finalPathFromSubmit = '';
    let chunkCount = 0;
    let pathFromPlan: string | null = null;

    const onFileSubmit = async (filePath: string, content: string) => {
      finalPathFromSubmit = filePath;
      finalContentFromSubmit = content;
      console.log(`Live test: File submission hook called for ${filePath}`);
    };

    const onChunkSubmit = async ({ chunk, stop, filePlan }: any) => {
      chunkCount++;
      console.log(`Received chunk ${chunkCount}, appending to file.`);

      if (!pathFromPlan) {
        const fullFileName = `${filePlan.fileName}.${filePlan.fileExtension}`;
        pathFromPlan = path.join(tempDir, filePlan.path, fullFileName);
        await fs.mkdir(path.dirname(pathFromPlan), { recursive: true });
        await fs.writeFile(pathFromPlan, '', 'utf-8');
      }
      
      await fs.appendFile(pathFromPlan!, chunk, 'utf-8');

      if (chunkCount >= 3) {
        console.log('Stopping generation after 3 chunks.');
        stop();
      }
    };
    
    await generateCodeV2({
      model: codeModel,
      submodel,
      systemPrompt: 'You are a master programmer tasked with generating a complete, runnable TypeScript file.',
      userPrompt: 'Generate a very large utility library with a wide variety of functions for array, object, and string manipulation. The total line count should exceed 1000 lines. The code should be well-documented with TSDoc comments.',
      dir: tempDir,
      onFileSubmit: onFileSubmit,
      onChunkSubmit: onChunkSubmit,
      verbose: true,
    });

    expect(chunkCount).toBe(3);
    expect(finalContentFromSubmit.length).toBeGreaterThan(0);
    expect(pathFromPlan).not.toBeNull();
    expect(finalPathFromSubmit).toBe(pathFromPlan);

    const fileContentFromDisk = await fs.readFile(pathFromPlan!, 'utf-8');
    expect(fileContentFromDisk).toBe(finalContentFromSubmit);
    
    const lineCount = fileContentFromDisk.split('\n').length;
    console.log(`Generated file has ${lineCount} lines.`);
    expect(lineCount).toBeGreaterThan(100);

  }, 1200000);
}); 