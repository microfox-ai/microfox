import { describe, it, expect, beforeAll } from 'vitest';
import { OpenApiToolset, createOpenApiToolset } from '../client/Toolset';

const REDDIT_MONITOR_API_SCHEMA = {
  docData: {
    info: {
      title: 'Reddit Monitor API',
      contact: {
        name: 'API Support',
        email: 'support@microfox.app',
      },
      version: '1.0.0',
      description: 'API for monitoring and configuring Reddit post tracking',
    },
    paths: {
      '/user/config': {
        post: {
          summary: 'Create or update user configuration',
          responses: {
            '200': {
              schema: {
                type: 'object',
                properties: {
                  config: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                      },
                      userId: {
                        type: 'string',
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                      },
                      phoneNumber: {
                        type: 'string',
                      },
                      indexingLimits: {
                        type: 'object',
                      },
                      reportSchedule: {
                        type: 'string',
                      },
                    },
                  },
                  message: {
                    type: 'string',
                    example: 'User configuration updated successfully',
                  },
                },
              },
              description: 'Successful response',
            },
            '400': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Missing required fields',
                  },
                },
              },
              description: 'Bad request',
            },
            '500': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'An unexpected error occurred',
                  },
                },
              },
              description: 'Internal server error',
            },
          },
          parameters: [
            {
              in: 'body',
              name: 'body',
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  status: {
                    enum: ['active', 'inactive', 'suspended'],
                    type: 'string',
                    description: "User's status",
                  },
                  userId: {
                    type: 'string',
                    description: 'Unique identifier for the user',
                  },
                  phoneNumber: {
                    type: 'string',
                    description: "User's phone number",
                  },
                  indexingLimits: {
                    type: 'object',
                    properties: {
                      posts: {
                        type: 'number',
                      },
                      monitors: {
                        type: 'number',
                      },
                      subreddits: {
                        type: 'number',
                      },
                    },
                    description: 'Indexing limits for the user',
                  },
                  reportSchedule: {
                    enum: ['daily', 'weekly', 'monthly'],
                    type: 'string',
                    description: 'Reporting schedule',
                  },
                },
              },
              required: true,
              description: 'The user configuration details',
            },
          ],
          description:
            "This endpoint creates or updates a user's configuration.",
        },
      },
      '/user/request': {
        post: {
          summary: 'Process a new user request to find subreddits.',
          responses: {
            '200': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Request processed and Notion report created.',
                  },
                  subreddits: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                  },
                  notionPageUrl: {
                    type: 'string',
                    example: 'https://www.notion.so/...',
                  },
                  monitorConfigId: {
                    type: 'string',
                    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
                  },
                },
              },
              description: 'Successful response.',
            },
            '400': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Missing required fields.',
                  },
                },
              },
              description: 'Bad request.',
            },
            '500': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'An unexpected error occurred',
                  },
                },
              },
              description: 'Internal server error.',
            },
          },
          parameters: [
            {
              in: 'body',
              name: 'body',
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  query: {
                    type: 'string',
                    description:
                      'A natural language query to find subreddits for.',
                  },
                  userId: {
                    type: 'string',
                    description: 'Unique identifier for the user.',
                  },
                  subreddits: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    description:
                      'A pre-defined list of subreddits to use, bypassing AI discovery.',
                  },
                  monitorConfigId: {
                    type: 'string',
                    description:
                      'Optional ID of an existing monitor configuration to update.',
                  },
                },
              },
              required: true,
              description: 'The user request details.',
            },
          ],
          description:
            'Takes a user query to find and score relevant subreddits, or accepts a list of subreddits. Creates a Notion report with the findings.',
        },
      },
      '/monitor/config/update': {
        post: {
          summary: 'Create or update a monitor configuration',
          responses: {
            '200': {
              schema: {
                type: 'object',
                properties: {
                  config: {
                    $ref: '#/definitions/MonitorConfig',
                  },
                  message: {
                    type: 'string',
                    example: 'Monitor configuration updated successfully',
                  },
                },
              },
              description: 'Successful response.',
            },
            '400': {
              description: 'Bad request',
            },
            '500': {
              description: 'Internal server error',
            },
          },
          parameters: [
            {
              in: 'body',
              name: 'body',
              schema: {
                type: 'object',
                required: ['userId'],
                properties: {
                  title: {
                    type: 'string',
                    description:
                      'Title of the monitor configuration. Required for creation.',
                  },
                  userId: {
                    type: 'string',
                    description: 'Unique identifier for the user. Required.',
                  },
                  isActive: {
                    type: 'boolean',
                    description: 'Set the monitor to active or inactive.',
                  },
                  subreddits: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                        },
                        priority: {
                          enum: ['high', 'medium', 'low'],
                          type: 'string',
                        },
                      },
                    },
                    description: 'List of subreddits to monitor.',
                  },
                  targetAudience: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        keywords: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        description: {
                          type: 'string',
                        },
                      },
                    },
                    description: 'Target audience details.',
                  },
                  monitorConfigId: {
                    type: 'string',
                    description:
                      'Unique identifier for the monitor configuration. If not provided, a new one will be created.',
                  },
                },
              },
              required: true,
              description: 'The monitor configuration details.',
            },
          ],
          definitions: {
            MonitorConfig: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                title: {
                  type: 'string',
                },
                userId: {
                  type: 'string',
                },
                isActive: {
                  type: 'boolean',
                },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                },
                subreddits: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                      priority: {
                        enum: ['high', 'medium', 'low'],
                        type: 'string',
                      },
                    },
                  },
                },
                targetAudience: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      keywords: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      description: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          description:
            'This endpoint creates a new monitor configuration if `monitorConfigId` is not provided, or updates an existing one if it is. `userId` is always required.',
        },
      },
    },
    openapi: '3.0.1',
    servers: [
      {
        url: 'https://api.microfox.com/c/ef5c8ddc-d096-4b35-8d47-916f80018a38',
        description: 'Production server',
      },
    ],
    definitions: {
      MonitorConfig: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          userId: {
            type: 'string',
          },
          isActive: {
            type: 'boolean',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
          subreddits: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                priority: {
                  enum: ['high', 'medium', 'low'],
                  type: 'string',
                },
              },
            },
          },
          targetAudience: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                keywords: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                description: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

const BASE_URL = 'https://oqhy1z9bch.execute-api.us-east-1.amazonaws.com/prod';

describe('Reddit Monitor API Toolkit', () => {
  let toolkit: OpenApiToolset;

  beforeAll(async () => {
    // Create toolkit with the Reddit Monitor API schema
    toolkit = await createOpenApiToolset({
      schema: {
        type: 'object',
        schema: REDDIT_MONITOR_API_SCHEMA.docData,
        url: BASE_URL,
      },
      name: 'reddit-monitor-api',
    });
  });

  describe('Toolkit Initialization', () => {
    it('should initialize successfully with the Reddit Monitor API schema', async () => {
      expect(toolkit).toBeDefined();
      expect(typeof toolkit.init).toBe('function');
      expect(typeof toolkit.tools).toBe('function');
      expect(typeof toolkit.listOperations).toBe('function');
      const tools = await toolkit.tools();
      console.log(tools.executions);
      console.log(tools.tools);
      console.log(tools.metadata);
    });

    it('should list available operations', async () => {
      const operations = await toolkit.listOperations();
      expect(operations).toBeDefined();
      expect(operations.operations).toBeInstanceOf(Array);
      expect(operations.operations.length).toBeGreaterThan(0);

      // Check for expected operations
      const operationIds = operations.operations.map(op => op.id);
      expect(operationIds).toContain('reddit-monitor-api-post_user_config');
      expect(operationIds).toContain('reddit-monitor-api-post_user_request');
      expect(operationIds).toContain(
        'reddit-monitor-api-post_monitor_config_update',
      );
      console.log(operations);
    });
  });

  // describe('Tool Generation', () => {
  //   it('should generate tools from the schema', async () => {
  //     const toolResult = await toolkit.tools();
  //     expect(toolResult).toBeDefined();
  //     expect(toolResult.tools).toBeInstanceOf(Array);
  //     expect(toolResult.tools.length).toBeGreaterThan(0);

  //     // Check for expected tools
  //     const toolNames = Object.keys(toolResult.tools);
  //     expect(toolNames).toContain('post_user_config');
  //     expect(toolNames).toContain('post_user_request');
  //     expect(toolNames).toContain('post_monitor_config_update');
  //   });

  //   it('should generate tools with proper descriptions', async () => {
  //     const toolResult = await toolkit.tools();
  //     const userConfigTool = toolResult.tools['post_user_config'];

  //     expect(userConfigTool).toBeDefined();
  //     expect(userConfigTool?.description).toContain(
  //       'Create or update user configuration',
  //     );
  //   });

  //   it('should generate tools with proper parameters', async () => {
  //     const toolResult = await toolkit.tools();
  //     const userConfigTool = toolResult.tools['post_user_config'];

  //     expect(userConfigTool).toBeDefined();
  //     expect(userConfigTool?.inputSchema).toBeDefined();
  //   });
  // });

  // describe('API Operation Calls', () => {
  //   it('should be able to call user config operation', async () => {
  //     const testUserId = 'test-user-123';
  //     const testConfig = {
  //       userId: testUserId,
  //       status: 'active',
  //       phoneNumber: '+1234567890',
  //       indexingLimits: {
  //         posts: 100,
  //         monitors: 5,
  //         subreddits: 10,
  //       },
  //       reportSchedule: 'daily',
  //     };

  //     // Note: This would make an actual API call, so we'll just test the structure
  //     // In a real test, you might want to mock the HTTP calls
  //     expect(() => {
  //       toolkit.callOperation(
  //         'reddit-monitor-api:post_user_config',
  //         testConfig,
  //       );
  //     }).not.toThrow();
  //   });

  //   it('should be able to call user request operation', async () => {
  //     const testRequest = {
  //       userId: 'test-user-123',
  //       query:
  //         'Find subreddits about artificial intelligence and machine learning',
  //     };

  //     expect(() => {
  //       toolkit.callOperation(
  //         'reddit-monitor-api:post_user_request',
  //         testRequest,
  //       );
  //     }).not.toThrow();
  //   });

  //   it('should be able to call monitor config update operation', async () => {
  //     const testMonitorConfig = {
  //       userId: 'test-user-123',
  //       title: 'AI and ML Monitoring',
  //       isActive: true,
  //       subreddits: [
  //         { name: 'artificial', priority: 'high' },
  //         { name: 'MachineLearning', priority: 'medium' },
  //       ],
  //       targetAudience: [
  //         {
  //           keywords: ['AI', 'machine learning', 'deep learning'],
  //           description: 'AI and ML enthusiasts',
  //         },
  //       ],
  //     };

  //     expect(() => {
  //       toolkit.callOperation(
  //         'reddit-monitor-api:post_monitor_config_update',
  //         testMonitorConfig,
  //       );
  //     }).not.toThrow();
  //   });
  // });

  // describe('Error Handling', () => {
  //   it('should handle invalid operation IDs', () => {
  //     expect(() => {
  //       toolkit.callOperation('invalid-operation', {});
  //     }).toThrow('Invalid operation ID format');
  //   });

  //   it('should handle missing client names', () => {
  //     expect(() => {
  //       toolkit.callOperation('nonexistent-client:operation', {});
  //     }).toThrow('Client "nonexistent-client" not found');
  //   });
  // });

  // describe('Tool Options', () => {
  //   it('should support disabled executions', async () => {
  //     const toolResult = await toolkit.tools({
  //       disabledExecutions: ['post_user_config'],
  //     });

  //     expect(toolResult).toBeDefined();
  //     expect(toolResult.tools).toBeInstanceOf(Array);

  //     // The disabled tool should still be present but marked as disabled
  //     const userConfigTool = toolResult.tools['post_user_config'];
  //     expect(userConfigTool).toBeDefined();
  //   });

  //   it('should support disable all executions', async () => {
  //     const toolResult = await toolkit.tools({
  //       disableAllExecutions: true,
  //     });

  //     expect(toolResult).toBeDefined();
  //     expect(toolResult.tools).toBeInstanceOf(Array);
  //     expect(toolResult.tools.length).toBeGreaterThan(0);
  //   });
  // });
});
