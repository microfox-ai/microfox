import {
  GenerateObjectResult,
  UIDataTypes,
  UIMessage,
  UIMessageStreamWriter,
} from 'ai';
import { UITools } from './types.js';
import { customAlphabet } from 'nanoid';

export const findLastElement = <T>(array: T[]) => {
  return array[array.length - 1];
};

export const findFirstElement = <T>(array: T[]) => {
  return array[0];
};

export class StreamWriter<METADATA, TOOLS extends UITools> {
  public writer: UIMessageStreamWriter<UIMessage<METADATA, any, TOOLS>>;
  constructor(writer: UIMessageStreamWriter<UIMessage<METADATA, any, TOOLS>>) {
    this.writer = writer;
  }
  generateId = () => {
    return customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10)();
  };
  writeMessageMetadata = <NEW_METADATA extends METADATA>(
    metadata: NEW_METADATA
  ) => {
    return this.writer.write({
      type: 'message-metadata' as const,
      messageMetadata: metadata as NEW_METADATA,
    });
  };
  writeCustomTool = <K extends keyof TOOLS>(
    tool: {
      toolCallId?: string;
      toolName: K;
      inputTextDelta?: string[];
      input?: any;
      output?: any;
    } & Omit<TOOLS[K], 'toolCallId'>
  ) => {
    const toolCallId = tool.toolName?.toString() + '-' + this.generateId();
    if ('input' in tool && tool.input) {
      this.writer.write({
        type: 'tool-input-available' as const,
        input: tool.input,
        toolCallId: toolCallId || tool.toolCallId || '',
        toolName: tool.toolName as string,
      });
    }
    if (
      (tool.inputTextDelta && tool.inputTextDelta.length > 0) ||
      ('output' in tool && tool.output)
    ) {
      this.writer.write({
        type: 'tool-input-start' as const,
        toolCallId: toolCallId || tool.toolCallId || '',
        toolName: tool.toolName as string,
      });
      if (tool.inputTextDelta) {
        for (const delta of tool.inputTextDelta) {
          this.writer.write({
            type: 'tool-input-delta' as const,
            toolCallId: toolCallId || tool.toolCallId || '',
            inputTextDelta: delta,
          });
        }
      }
    }
    if ('output' in tool && tool.output) {
      this.writer.write({
        type: 'tool-output-available' as const,
        toolCallId: toolCallId || tool.toolCallId || '',
        output: tool.output,
      });
    }
  };
  writeObjectAsTool = <K extends keyof TOOLS>(tool: {
    toolName: K;
    result: GenerateObjectResult<TOOLS[K]['output']>;
  }) => {
    if (!tool.result.object) {
      throw new Error('No object found in the GenerateObjectResult');
    }

    const toolCallId = tool.toolName.toString() + '-' + this.generateId();

    this.writer.write({
      type: 'tool-input-start' as const,
      toolCallId: toolCallId,
      toolName: tool.toolName as string,
    });

    this.writer.write({
      type: 'tool-input-available' as const,
      toolCallId: toolCallId,
      input: {
        usage: tool.result.usage,
        warnings: tool.result.warnings,
        finishReason: tool.result.finishReason,
      },
      toolName: tool.toolName as string,
    });

    this.writer.write({
      type: 'tool-output-available' as const,
      toolCallId: toolCallId,
      output: tool.result.object,
    });
  };
}

export const getTextParts = (message: UIMessage | null | undefined) => {
  if (!message) return [];
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text);
};

export const getTextPartsContent = (message: UIMessage | null | undefined) => {
  if (!message) return '';
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim();
};

export const findLastMessageWith = <T>(
  message: UIMessage[] | null | undefined,
  filters: {
    role?: 'user' | 'assistant' | 'system';
    metadata?: Record<string, any>;
  }
) => {
  if (!message) return null;
  return message
    .filter((m) => {
      if (filters.role && m.role !== filters.role) return false;
      if (filters.metadata) {
        for (const key in filters.metadata) {
        }
      }
      return true;
    })
    .pop();
};
