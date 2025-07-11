import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { genPathSpecAgent } from './genPathSpec';

export const genOpenApiAgent = new AiRouter();

const schema = z.object({
  packageName: z.string().describe('The name of the package (e.g., "google-sheets").'),
});


function initOpenAPi(
  packageName: string,
  slsDir: string,
  packageInfo: any,
): void {
  const openapiPath = path.join(slsDir, 'openapi.json');
  const sdkPackageJsonPath = path.join(slsDir, '..', 'package.json');
  const sdkPackageJson = fs.existsSync(sdkPackageJsonPath)
    ? JSON.parse(fs.readFileSync(sdkPackageJsonPath, 'utf8'))
    : { version: '1.0.0' };

  let openapi: any = {};

  openapi.openapi = '3.0.1';
  openapi.info = {
    title: `${packageInfo.title} API`,
    version: sdkPackageJson.version,
    mcp_version: '1.0.1',
    description:
      packageInfo.description ||
      `Single entry-point API for all ${packageInfo.title} functions via a wrapper Lambda`,
    contact: {
      name: 'Microfox Dev Support',
      email: 'support@microfox.com',
    },
  };
  openapi.servers = [
    {
      url: `https://api.microfox.com/c/${packageName}`,
      description: 'Unified wrapper endpoint',
    },
  ];
  openapi.components = {
    'x-auth-packages': [
      {
        packageName: packageInfo.name,
      },
    ],
  };

  // Overwrite paths with latest from individual files
  openapi.paths = {};

  fs.writeFileSync(openapiPath, JSON.stringify(openapi, null, 2));
  console.log(`✅ created openapi.json at: ${openapiPath}`);
}

genOpenApiAgent
  .actAsTool('/', {
    description: 'Generates the complete OpenAPI specification by iterating through all functions.',
    inputSchema: schema as any,
  })
  .agent('/', async (ctx) => {
    const packageName = ctx.request.params?.packageName as string

    try {
      const openapiDir = path.join(ctx.state[packageName].slsDir, 'openapi');
      if (!fs.existsSync(openapiDir)) {
        fs.mkdirSync(openapiDir, { recursive: true });
      }

      initOpenAPi(packageName, ctx.state[packageName].slsDir, ctx.state[packageName].packageInfo);

      for (const constructor of ctx.state[packageName].packageInfo.constructors) {
        for (const funcName of constructor.functionalities) {
          if (!ctx.state[packageName].docs.functions[funcName]) {
            console.warn(`⚠️ Function ${funcName} not found in package docs, skipping.`);
            continue;
          }
          console.log('genOpenApiAgent', packageName, funcName);
          ctx.request.functionName = funcName;
          await ctx.next.callAgent('/genPathSpec', {
            packageName,
            functionName: funcName,
          });
        }
      }

      ctx.response.write({ type: 'text', text: 'Successfully generated OpenAPI specification.' });

    } catch (error: any) {
      ctx.response.write({ type: 'text', text: `Error generating OpenAPI spec: ${error.message}` });
    }
  });

genOpenApiAgent.agent('/genPathSpec', genPathSpecAgent)
