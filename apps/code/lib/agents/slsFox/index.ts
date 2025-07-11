import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { getPackageInfo } from '../../middlewares/getPackageInfo';
import { getPackageDocs } from '../../middlewares/getPackageDocs';
import { copyDirectory, updateTemplateFiles } from './template';
import { genOpenApiAgent } from './genOpenApi';
import { genOpenApiMdAgent } from './genOpenApiMd';
import { genSdkMapAgent } from './genSdkMap';

export const slsfoxAgent = new AiRouter();

const schema = z.object({
  packageName: z.string().describe('The name of the package (e.g., "google-sheets").'),
  specificFunctions: z.array(z.string()).optional().describe('Optional list of specific functions to update.'),
});


slsfoxAgent
  .use('/', getPackageInfo)
  .use('/', getPackageDocs)
  .actAsTool('/', {
    description: 'Generates the complete sls structure for a package.',
    inputSchema: schema as any,
  })
  .agent('/', async (ctx) => {
    console.log("sdgdfhgjktjdhdnjdxngxdg", ctx.request)
    console.log("sdgdhfchfcjgj", ctx)
    const packageName = ctx.request.params?.packageName as string
    const specificFunctions = ctx.request.params?.specificFunctions as string[] | undefined

    console.log("packageName", packageName)
    console.log("specificFunctions", specificFunctions)

    if (!packageName) {
      ctx.response.write({ type: 'text', text: `packageName is required` });
      return;
    }

    if (specificFunctions && specificFunctions.length > 0) {
      for (const func of specificFunctions) {
        ctx.request.functionName = func;
        await ctx.next.callAgent('/genOpenApi/genPathSpec', {
          packageName,
          functionName: func,
        });
      }
      ctx.response.write({ type: 'text', text: `Successfully generated openapi.json for ${packageName}'s functions ${specificFunctions.join(', ')}.` });
      return;
    }

    try {
      // Copy template directory
      const templateDir = path.join(process.cwd(), 'lib', 'agents', 'slsFox', 'template');
      if (fs.existsSync(ctx.state[packageName].slsDir)) {
        console.log(`⚠️ SLS directory already exists, removing it first...`);
        fs.rmSync(ctx.state[packageName].slsDir, { recursive: true, force: true });
      }
      copyDirectory(templateDir, ctx.state[packageName].slsDir);
      console.log(`✅ Template copied successfully`);

      // Update template files
      updateTemplateFiles(ctx.state[packageName].slsDir, packageName, ctx.state[packageName].packageInfo.description);

      // Generate sdkInit.ts
      await ctx.next.callAgent('/genSdkMap', {
        packageName,
      });

      // Generate openapi.json
      await ctx.next.callAgent('/genOpenApi', {
        packageName,
      });

      // Generate openapi.md
      await ctx.next.callAgent('/genOpenApiMd', {
        packageName,
      });

      ctx.response.write({ type: 'text', text: `Successfully generated serverless structure for ${packageName}.` });

    } catch (error: any) {
      ctx.response.write({ type: 'text', text: `Error generating serverless structure: ${error.message}` });
    }
  });

slsfoxAgent.agent('/genOpenApi', genOpenApiAgent)
slsfoxAgent.agent('/genOpenApiMd', genOpenApiMdAgent)
slsfoxAgent.agent('/genSdkMap', genSdkMapAgent)