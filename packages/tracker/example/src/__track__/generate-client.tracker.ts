import { defineTracker } from '@microfox/tracker';
import type { TrackerLogic } from '@microfox/tracker';
import { generateCodeV0 } from '@microfox/ai-code';
import * as fs from 'fs/promises';
import { anthropic } from '@ai-sdk/anthropic';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const logic: TrackerLogic = async ({ sourceFiles, log, project }) => {
    log.info('Running advanced AI client generator tracker...');

    for (const sourceFile of sourceFiles) {
        const userSchemaInterface = sourceFile.getInterface('UserSchema');
        if (!userSchemaInterface) {
            log.warn(`Could not find 'UserSchema' interface in ${sourceFile.getBaseName()}.`);
            continue;
        }

        const schemaText = userSchemaInterface.getFullText();
        const typesPath = path.join(sourceFile.getDirectoryPath(), 'types.ts');
        
        log.info(`Writing UserSchema to ${typesPath}...`);
        await fs.writeFile(typesPath, `export ${schemaText}`);
        project.addSourceFileAtPath(typesPath);
        log.info('Successfully wrote types file.');

        const generationPrompt = `
      Based on the following TypeScript interface, which will be imported from './types',
      create a complete and well-documented API client class named 'ApiClient'.
      The client should have methods for get, create, and update operations.
      Include JSDoc comments and basic try/catch error handling.

      Do not include the UserSchema interface in the output file; it should be imported.
    `;

        log.info('Prompt constructed. Calling AI to generate the client...');

        await generateCodeV0({
            model: anthropic('claude-4-opus-20250514'),
            systemPrompt: `You are a senior TypeScript developer. Your task is to write clean, maintainable code.
You will be creating a client file that imports its types from a './types.ts' file.`,
            userPrompt: generationPrompt,
            dir: sourceFile.getDirectoryPath(),
            onFileSubmit: async (filePath, content) => {
                log.info(`AI proposed to write file at: ${filePath}`);
                const clientPath = path.join(sourceFile.getDirectoryPath(), 'client.ts');
                
                const finalContent = `import { UserSchema } from './types';\n\n${content}`;
                
                await fs.writeFile(clientPath, finalContent);
                log.info(`Successfully wrote generated client to ${clientPath}`);
                project.addSourceFileAtPath(clientPath);
            }
        });
    }
};

export default defineTracker(
    {
        targets: ['src/schema.ts'],
        github: {
            name: 'generate-client-from-schema',
            on: {
                push: {
                    branches: ['main'],
                    paths: ['src/schema.ts'],
                },
                schedule: [
                    { cron: '0 0 * * *' } // Runs every day at midnight
                ]
            }
        }
    },
    logic
); 
