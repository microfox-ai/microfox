import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import { generateObject } from 'ai';
import dedent from 'dedent';
import * as fs from 'fs';
import * as path from 'path';
import { google } from '@ai-sdk/google';

export const genOpenApiMdAgent = new AiRouter();

const schema = z.object({
  packageName: z.string().describe('The name of the package (e.g., "google-sheets").'),
});

function camelCaseToTitle(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

async function generateOpenAPIMarkdown(
  packageInfo: any,
  slsDir: string,
): Promise<string> {
  const openapiPath = path.join(slsDir, 'openapi.json');
  if (!fs.existsSync(openapiPath)) {
    throw new Error('openapi.json not found, cannot generate markdown.');
  }
  const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

  // Programmatically generate Functionality section
  let functionalityMarkdown = '## Functionality\n\nThe API provides the following functionalities:\n\n';
  let i = 1;
  for (const pathKey in openapi.paths) {
    const pathData = openapi.paths[pathKey]?.post;
    if (pathData) {
      const title = camelCaseToTitle(pathData.operationId);
      functionalityMarkdown += `### ${i}. ${title} (\`${pathKey}\`)\n\n`;
      functionalityMarkdown += `**Summary:** ${pathData.summary}\n\n`;
      functionalityMarkdown += `**Description:** ${pathData.description}\n\n`;
      i++;
    }
  }

  // Generate Introduction using AI
  const introSchema = z.object({
    introduction: z.string().describe('A concise, one-paragraph introduction to the API, explaining its purpose and key capabilities based on the provided functionality.'),
  });

  const systemPrompt = dedent`You are an expert technical writer. Your task is to write a compelling introductory paragraph for an API documentation based on the provided package information and functionality list.

  Follow this structure exactly:
  
  1.  Start with: "This agent provides a comprehensive interface for interacting with the [Package Title] API."
  2.  Continue with: "It's a single entry-point API for all Microfox [Package Title] SDK functions, exposed via a wrapper Lambda."
  3.  Conclude with a sentence that summarizes the capabilities, for example: "This allows you to perform various operations such as [summarize the functionalities] with powerful filtering and customization options."
  
  The final output should be a single, coherent paragraph. Do not use markdown or lists.`;

  const userPrompt = dedent`Please generate a one-paragraph introduction for the following API.

  **Package Information:**
  Title: ${packageInfo.title}
  Description: ${packageInfo.description}

  **API Functionality:**
  ${functionalityMarkdown}
  `;
  
  const { object: result } = await generateObject({
    model: google('gemini-1.5-pro-latest'),
    system: systemPrompt,
    prompt: userPrompt,
    schema: introSchema,
  });

  const introduction = result.introduction;

  // 5. Assemble final markdown
  const finalMarkdown = dedent`
    # Microfox ${packageInfo.title} API

    ${introduction}

    ${functionalityMarkdown.trim()}

  `;

  return finalMarkdown.trim();
}

genOpenApiMdAgent
  .actAsTool('/', {
    description: 'Generates the openapi.md file.',
    inputSchema: schema as any,
  })
  .agent('/', async (ctx) => {
    const { packageName } = ctx.request;

    try {
      const markdownContent = await generateOpenAPIMarkdown(ctx.state[packageName].packageInfo, ctx.state[packageName].slsDir);
      const markdownPath = path.join(ctx.state[packageName].slsDir, 'openapi.md');
      fs.writeFileSync(markdownPath, markdownContent);
      ctx.response.write({
        type: 'text',
        text: `Successfully generated openapi.md at: ${markdownPath}`,
      });
    } catch (error: any) {
      ctx.response.write({ type: 'text', text: `Error generating openapi.md: ${error.message}` });
    }
  });
