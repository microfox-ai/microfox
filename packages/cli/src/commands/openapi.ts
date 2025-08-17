import { Command } from 'commander';
import openapiTS from 'openapi-typescript';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

export const openapi = new Command('openapi:gen')
  .description('Generate TypeScript types from an OpenAPI specification')
  .argument('<input>', 'The path or URL to the OpenAPI specification')
  .option('-o, --output <output>', 'The path to the output file')
  .action(async (input, options) => {
    try {
      console.log('✨ openapi-typescript');
      const output = await openapiTS(input);
      const outputPath = options.output ? resolve(process.cwd(), options.output) : resolve(process.cwd(), 'sdk.d.ts');
      writeFileSync(outputPath, output as string);
      console.log(`🚀 ${input} -> ${options.output || 'sdk.d.ts'}`);
    } catch (err) {
      console.error(err);
    }
  });