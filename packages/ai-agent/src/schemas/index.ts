import { z } from 'zod';

/**
 * Describes the plan for generating a single file.
 */
export const FilePlanSchema = z.object({
  fileName: z.string().describe("The name of the file without the extension."),
  fileExtension: z.string().describe("The file extension (e.g., 'ts', 'tsx', 'js')."),
  path: z.string().describe("The relative path where the file should be created (e.g., 'src/components')."),
  type: z.enum(['typescript', 'javascript', 'json', 'markdown', 'yaml', 'text', 'other']).describe('The type of file.'),
  codeBrief: z.string().describe("A brief, one-sentence description of what this file contains."),
  dependencies: z.array(z.string()).optional().describe('A list of other full file names that this file depends on.'),
});
