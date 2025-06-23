// import { ToolCall, ToolResult } from 'ai';
// import { OpenAPIToolsClient } from './client/OpenAPIToolsClient';

// export const FAKE_HUMAN_INTERACTION_TOOL_NAME = 'FAKE_HUMAN_INTERACTION';

// /**
//  * Processes the result of a tool execution, handling the Human-in-the-Loop (HITL) workflow.
//  * This function should be called after a tool's `execute` function has run.
//  *
//  * @param toolExecutionResult The result from the tool's `execute` function.
//  * @param toolCall The original tool call that triggered the execution.
//  * @param client The OpenAPIToolsClient instance.
//  * @param dataStream The Vercel AI SDK DataStream to write events to.
//  *
//  * @returns A boolean indicating whether the original tool result should be appended to the message history.
//  *          Returns `false` for HITL cases, `true` otherwise.
//  */
// export async function processToolExecution(
//   toolExecutionResult: any,
//   toolCall: ToolCall<string, any>,
//   client: OpenAPIToolsClient,
//   dataStream: any, // Vercel AI SDK WritableStream
// ): Promise<boolean> {
//   // Case 1: Human Intervention is triggered.
//   if (toolExecutionResult?._humanIntervention) {
//     // This is the special marker from SingleOpenAPIToolsClient.
//     // We do not append the original tool result. Instead, we create a new, fake tool call
//     // to signal the UI that we need human input.

//     // The arguments for the fake tool were prepared in SingleOpenAPIToolsClient
//     const { args: fakeToolArgs } = toolExecutionResult;

//     // Create a new unique ID for the fake tool call.
//     const fakeToolCallId = `${toolCall.toolCallId}-human-intervention`;

//     // Stream a 'tool_call' event for the fake tool.
//     dataStream.append({
//       type: 'tool_call',
//       toolCall: {
//         toolCallId: fakeToolCallId,
//         toolName: FAKE_HUMAN_INTERACTION_TOOL_NAME,
//         args: {
//           ...fakeToolArgs,
//           _originalToolCallId: toolCall.toolCallId, // Critical link to the paused tool
//         },
//       },
//     });

//     // The UI will now render based on FAKE_HUMAN_INTERACTION and its args.
//     // It will eventually produce a tool_result for `fakeToolCallId`.
//     // We stop processing here and do not append the original result.
//     return false;
//   }

//   // Case 2: A tool has finished executing. This could be a normal tool or the FAKE_HUMAN_INTERACTION tool.
//   const finalResult = await client.processToolResult(
//     toolCall.toolName,
//     toolCall.toolCallId,
//     toolExecutionResult,
//   );

//   if (finalResult) {
//     // This is a valid result that should be sent to the AI.
//     // It could be a normal tool's result, or the result of a resumed tool.
//     // In the resumed case, `processToolResult` has already re-executed the original tool
//     // and mapped the result back to the original toolCallId.
//     dataStream.append({
//       type: 'tool_result',
//       toolCallId: finalResult.toolCallId,
//       toolName: toolCall.toolName, // The toolName in the stream should match the call
//       result: finalResult.result,
//     });
//   }
//   // If finalResult is null, it means the FAKE_HUMAN_INTERACTION tool call has just finished,
//   // and its result has been processed to resume the original tool. We don't append anything
//   // extra to the stream in that case, as the resumed tool's result will be streamed instead.

//   // We return true here for normal results, but for resumed results, we need to be careful.
//   // The logic in the calling application should decide whether to append the original message.
//   // We return true to signify that the standard flow can continue.
//   return true;
// }
