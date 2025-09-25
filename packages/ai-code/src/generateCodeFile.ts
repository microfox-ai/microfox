// @ts-ignore
import { generateText } from 'ai';
import { LanguageModelV2 } from '@ai-sdk/provider';

type GenerateTextOptions = Parameters<typeof generateText>[0];

export type GenerateCodeFileOptions = Omit<GenerateTextOptions, 'prompt' | 'system' | 'messages'> & {
    systemPrompt: string;
    userPrompt: string;
    model: LanguageModelV2;
}

/**
 * A lean, core AI agent that generates pure code content using the robust,
 * built-in retry mechanism of the AI SDK.
 */
export async function generateCodeFile(options: GenerateCodeFileOptions): Promise<string> {
    const {
        model,
        systemPrompt,
        userPrompt,
        ...args
    } = options;

    const finalSystemPrompt = `${systemPrompt}\n\nCRITICAL: You MUST respond with ONLY the raw code content for the file. Do not include any markdown, explanations, or any text other than the code itself.`;

    const { text } = await generateText({
        model,
        system: finalSystemPrompt,
        prompt: userPrompt,
        ...args,
    });

    // Basic guardrail to remove markdown fences, just in case.
    const cleanedText = text.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
    return cleanedText;
} 