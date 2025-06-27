import { generateObject, LanguageModelV2 } from 'ai';
import { z, ZodType } from 'zod';

/**
 * A robust wrapper around the 'generateObject' function from the Vercel AI SDK.
 * This function is designed to handle complex Zod schemas without triggering
 * the 'Type instantiation is excessively deep and possibly infinite' TypeScript error.
 *
 * It uses a type assertion (`as any`) internally to bypass the problematic
 * type inference in the SDK, while still providing strong type safety for the
 * function's inputs and outputs.
 *
 * @param model An instance of a Vercel AI LanguageModelV2.
 * @param schema The Zod schema to guide the object generation.
 * @param prompt The user-facing prompt for the AI.
 * @param system A system-level prompt to guide the AI's behavior.
 * @returns A promise that resolves to a structured object matching the provided schema.
 */
export async function generateStructuredObject<T extends ZodType<any, any, any>>({
  model,
  schema,
  prompt,
  system,
}: {
  model: LanguageModelV2;
  schema: T;
  prompt: string;
  system: string;
}): Promise<z.infer<T>> {
  // Using `as any` here to bypass the faulty type checking in the Vercel AI SDK's
  // `generateObject` function, which struggles with complex/nested Zod schemas.
  // This is a targeted workaround for a known library issue.
  const { object } = await generateObject({
    model,
    schema: schema as any,
    prompt,
    system,
  });

  return object;
} 