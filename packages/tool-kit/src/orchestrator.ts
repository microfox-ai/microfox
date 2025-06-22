import {
  CoreMessage,
  generateText,
  GenerateTextResult,
  LanguageModel,
  ToolSet,
} from 'ai';
import {
  humanInteractionToolDefinition,
  HUMAN_INTERACTION_TOOL_NAME,
} from './human-interaction';
import { PendingHumanInputAction } from './types';

/**
 * Represents the possible outcomes of processing a chat turn.
 * It can be either a standard AI response or a signal that human input is required.
 */
export type ProcessChatResult =
  | {
      type: 'ai_response';
      result: GenerateTextResult<ToolSet, unknown>;
    }
  | { type: 'human_interaction_required'; data: PendingHumanInputAction };

/**
 * Options for the processChat function.
 */
export interface ProcessChatOptions {
  model: LanguageModel;
  messages: CoreMessage[];
  tools: ToolSet;
  system?: string;
}

/**
 * Processes a chat turn, handling the full cycle of generating an AI response
 * and intercepting calls for human interaction.
 *
 * @param options - The options for processing the chat.
 * @returns A result object indicating whether the flow should continue with an
 * AI response or pause for human input.
 */
export async function processChat(
  options: ProcessChatOptions,
): Promise<ProcessChatResult> {
  const { model, messages, tools, system } = options;

  // 1. Merge the provided tools with our special human interaction tool.
  const toolSetWithHumanInteraction = {
    ...tools,
    ...humanInteractionToolDefinition,
  };

  // 2. Call the AI model.
  const result = await generateText({
    model,
    messages,
    system,
    tools: toolSetWithHumanInteraction,
  });

  // 3. Intercept the call for human input, if it exists.
  const humanInteractionCall = result.toolCalls?.find(
    call => call.toolName === HUMAN_INTERACTION_TOOL_NAME,
  );

  if (humanInteractionCall) {
    // A human interaction is required.
    // Construct the data contract to send back to the client.
    const pendingAction: PendingHumanInputAction = {
      status: 'requires_human_input',
      interaction: {
        toolCallId: humanInteractionCall.toolCallId,
        // The AI SDK already validates this against the schema.
        args: humanInteractionCall.args as any,
      },
      messages: messages, // Return the state for the stateless continuation.
    };

    return {
      type: 'human_interaction_required',
      data: pendingAction,
    };
  }

  // 4. If no interception occurred, return the standard AI response.
  return {
    type: 'ai_response',
    result: result,
  };
}
