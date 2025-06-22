import { z } from 'zod';

/**
 * A constant for the pseudo-tool name to avoid magic strings and provide a single
 * point of reference. The application layer will intercept calls to this tool.
 */
export const HUMAN_INTERACTION_TOOL_NAME = 'requestHumanInput';

/**
 * Defines the schema for the arguments that the LLM must provide when it wants
 * to request input from a human.
 */
export const humanInputSchema = z.object({
  type: z
    .enum(['approval', 'text_input'])
    .describe(
      'The type of interaction required. "approval" for a yes/no confirmation, "text_input" for freeform text.',
    ),
  message: z
    .string()
    .describe(
      'The clear and specific question or prompt to display to the human.',
    ),
});

/**
 * The tool definition that will be merged into the toolset provided to the AI model.
 * It describes the tool and its parameters, guiding the LLM on how and when to use it.
 * It intentionally lacks an `execute` function, as it is not meant to be executed
 * directly but rather intercepted by the application.
 */
export const humanInteractionToolDefinition = {
  [HUMAN_INTERACTION_TOOL_NAME]: {
    description:
      'Call this tool ONLY when you need to ask the user for information or confirmation. Use this before calling any other tool if you are missing required parameters.',
    parameters: humanInputSchema,
  },
};
