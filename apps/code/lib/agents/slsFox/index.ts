import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { getPackageInfo } from '../../middlewares/getPackageInfo';
import { getPackageDocs } from '../../middlewares/getPackageDocs';
import { genFullSlsAgent } from './genFullSls';
import { genOpenApiAgent } from './genOpenApi';
import { genOpenApiMdAgent } from './genOpenApiMd';
import { genSdkMapAgent } from './genSdkMap';
import { genPathSpecAgent } from './genPathSpec';

export const slsfoxAgent = new AiRouter<any, any, any>();

const schema = z.object({
  packageName: z.string().optional().describe('The name of the package (e.g., "google-sheets").'),
  query: z.string().optional().describe('A natural language prompt for what to build or update.'),
});

slsfoxAgent
  .use('/', getPackageInfo)
  .use('/', getPackageDocs)
  .actAsTool('/', {
    description: 'Generates or updates the serverless structure for a package based on a prompt.',
    inputSchema: schema as any,
  })
  .agent('/', async (ctx) => {
    const { query, packageName: initialPackageName } = ctx.request.params as z.infer<typeof schema>;

    if (!query && !initialPackageName) {
      ctx.response.write({ type: 'text', text: `Either a query or a package name is required.` });
      return;
    }

    if (!query){
      await ctx.next.callAgent('/genFullSls', { packageName: initialPackageName });
      return;
    }

    ctx.response.write({ type: 'text', text: 'Deciding which tool to use...\n' });

    const { toolCalls } = await generateText({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `You are an expert system for managing serverless package structures. Based on the user's request, decide which tool to call. Extract the packageName and any other relevant parameters from the request.

User Request: ${query || `Generate full structure for ${initialPackageName}`}`,
      tools: {
        generateFullSls: ctx.next.agentAsTool('/genFullSls'),
        generateOpenApi: ctx.next.agentAsTool('/genOpenApi'),
        generateOpenApiMd: ctx.next.agentAsTool('/genOpenApiMd'),
        generateSdkMap: ctx.next.agentAsTool('/genSdkMap'),
        generatePathSpec: ctx.next.agentAsTool('/genPathSpec'),
      }
    });

    ctx.response.write({ type: 'text', text: `\nExecution complete. Tool Calls:\n${JSON.stringify(toolCalls)}` });
  });


slsfoxAgent.agent('/genFullSls', genFullSlsAgent)
slsfoxAgent.agent('/genOpenApi', genOpenApiAgent)
slsfoxAgent.agent('/genOpenApiMd', genOpenApiMdAgent)
slsfoxAgent.agent('/genSdkMap', genSdkMapAgent)
slsfoxAgent.agent('/genPathSpec', genPathSpecAgent)
