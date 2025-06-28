import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  getPackageDocsPath,
  getPackageCodeFilesPath,
  getAllFunctionsOfPackage,
  updateMicrofoxDocs,
  reportCodeError,
} from './functions';

const server = new McpServer({
  name: 'Microfox-MCP',
  version: '1.0.0',
});

// #region Tools
server.tool(
  'getPackageDocsPath',
  {
    packageName: z.string().describe('The name of the package (e.g., "reddit")'),
  },
  async ({ packageName }: { packageName: string }) => {
    const docPaths = getPackageDocsPath(packageName);
    if (docPaths.length === 0) {
      return {
        content: [
          { type: 'text', text: `No docs found for package '${packageName}'.` },
        ],
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(docPaths, null, 2) }],
    };
  }
);

server.tool(
  'getPackageCodeFilesPath',
  {
    packageName: z
      .string()
      .describe('The name of the package (e.g., "reddit")'),
  },
  async ({ packageName }: { packageName: string }) => {
    const codeFiles = getPackageCodeFilesPath(packageName);
    if (codeFiles.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No code files found for package '${packageName}'.`,
          },
        ],
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(codeFiles, null, 2) }],
    };
  }
);

server.tool(
  'getAllFunctionsOfPackage',
  {
    packageName: z
      .string()
      .describe('The name of the package (e.g., "reddit")'),
  },
  async ({ packageName }: { packageName: string }) => {
    const functions = getAllFunctionsOfPackage(packageName);
    if (functions.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No functions found for package '${packageName}'.`,
          },
        ],
      };
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(functions, null, 2) }],
    };
  }
);

server.tool(
  'updateMicrofoxDocs',
  {
    branch: z.string().describe('The name of the new branch to create'),
    filepath: z.string().describe('The full path to the file to be updated'),
    updatedContent: z
      .string()
      .describe('The new content to write to the file'),
  },
  async ({
    branch,
    filepath,
    updatedContent,
  }: {
    branch: string;
    filepath: string;
    updatedContent: string;
  }) => {
    try {
      const result = await updateMicrofoxDocs(branch, filepath, updatedContent);
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created PR: ${result.pullRequestUrl}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to update docs: ${error.message}`,
          },
        ],
      };
    }
  }
);

server.tool(
  'reportCodeError',
  {
    packageName: z
      .string()
      .describe('The name of the package where the error occurred'),
    errorMessage: z.string().describe('The error message to report'),
    functionName: z
      .string()
      .optional()
      .describe('The name of the function where the error occurred'),
  },
  async ({
    packageName,
    errorMessage,
    functionName,
  }: {
    packageName: string;
    errorMessage: string;
    functionName?: string;
  }) => {
    try {
      const result = await reportCodeError(
        packageName,
        errorMessage,
        functionName
      );
      return {
        content: [
          {
            type: 'text',
            text: `Successfully created issue: ${result.issueUrl}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to report error: ${error.message}`,
          },
        ],
      };
    }
  }
);
// #endregion

async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
