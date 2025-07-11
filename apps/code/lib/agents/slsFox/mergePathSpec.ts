import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import path from 'path';
import * as fs from 'fs';

export const genPathSpecAgent = new AiRouter();

const schema = z.object({
    packageName: z.string().describe('The name of the package.'),
});

genPathSpecAgent
    .actAsTool('/', {
        description: 'Merges all OpenAPI path specifications in the openapi directory into the sls openapi.json file.',
        inputSchema: schema as any,
    })
    .agent('/', async (ctx) => {
        const packageName = ctx.request.params?.packageName as string
        const slsOpenapiPath = path.join(ctx.state[packageName].slsDir, 'openapi.json');
        let slsOpenapi = JSON.parse(fs.readFileSync(slsOpenapiPath, 'utf8'));

        const openapiDir = path.join(ctx.state[packageName].slsDir, 'openapi');
        if (!fs.existsSync(openapiDir)) {
            throw new Error(`OpenAPI directory not found: ${openapiDir}`);
        }
        const openApiFiles = fs.readdirSync(openapiDir);

        for (const file of openApiFiles) {
            const openApiPath = path.join(openapiDir, file);
            const filePathSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
            slsOpenapi.paths[file.replace('.json', '')] = filePathSpec;
        }
        fs.writeFileSync(slsOpenapiPath, JSON.stringify(slsOpenapi, null, 2));

        ctx.response.write({ type: 'text', text: 'Successfully merged path specs.' });
    });
