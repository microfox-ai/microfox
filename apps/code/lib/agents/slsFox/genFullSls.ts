import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import { generateObject } from 'ai';
import path from 'path';
import * as fs from 'fs';
import { anthropic } from '@ai-sdk/anthropic';
import { PackageInfo } from '@/lib/types/PackageInfo';
import { copyDirectory, updateTemplateFiles } from './template';

export const genFullSlsAgent = new AiRouter<any, any, any>();

const fullSlsSchema = z.object({
    packageName: z.string().describe('The name of the package for which to generate the full structure.'),
});

genFullSlsAgent
    .actAsTool('/', {
        description: 'Generates the complete sls structure for a package.',
        inputSchema: fullSlsSchema as any
    })
    .agent('/', async (ctx) => {
        const packageName = ctx.request.params?.packageName as string
        ctx.response.write({ type: 'text', text: `Generating full SLS structure for ${packageName}...\n` });

        try {
            const templateDir = path.join(process.cwd(), 'lib', 'agents', 'slsFox', 'template');
            if (fs.existsSync(ctx.state[packageName].slsDir)) {
                fs.rmSync(ctx.state[packageName].slsDir, { recursive: true, force: true });
            }
            copyDirectory(templateDir, ctx.state[packageName].slsDir);
            updateTemplateFiles(ctx.state[packageName].slsDir, packageName, ctx.state[packageName].packageInfo.description);

            await ctx.next.callAgent('@/slsfox/genSdkMap', { packageName });
            await ctx.next.callAgent('@/slsfox/genOpenApi', { packageName });
            await ctx.next.callAgent('@/slsfox/genOpenApiMd', { packageName });

            ctx.response.write({ type: 'text', text: `Successfully generated serverless structure for ${packageName}.\n` });

        } catch (error: any) {
            ctx.response.write({ type: 'text', text: `Error generating serverless structure: ${error.message}` });
        }
    });
