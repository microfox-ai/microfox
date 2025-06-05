export type GoogleImageModelId =
  | 'gemini-2.0-flash-preview-image-generation'
  | 'imagen-3.0-generate-002'
  | (string & {});

export type GoogleLanguageModelId =
  | 'gemini-2.5-pro-preview-05-06'
  | 'gemini-2.5-pro-preview-05-06-long-context'
  | 'gemini-2.5-flash-preview-05-20'
  | 'gemini-2.5-flash-preview-05-20-thinking'
  | 'gemini-2.5-flash-preview-native-audio-dialog'
  | 'gemini-2.5-flash-exp-native-audio-thinking-dialog'
  | 'gemini-2.5-flash-preview-tts'
  | 'gemini-2.5-pro-preview-tts'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-audio'
  | 'gemini-2.0-flash-live-001'
  | 'gemini-2.0-flash-live-001-audio'
  | 'gemini-2.0-flash-lite'
  | 'gemini-2.0-flash-preview-image-generation'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-pro-long-context'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-long-context'
  | 'gemini-1.5-flash-8b'
  | 'gemini-1.5-flash-8b-long-context'
  | 'gemini-2.0-pro-exp-02-05'
  | 'gemini-2.0-flash-thinking-exp-01-21'
  | 'gemini-exp-1206'
  | 'gemini-exp-1121'
  | 'gemini-exp-1114'
  | 'gemini-1.5-pro-exp-0827'
  | 'gemini-1.5-pro-exp-0801'
  | 'gemini-1.5-flash-8b-exp-0924'
  | 'gemini-1.5-flash-8b-exp-0827'
  | (string & {});

export type GoogleEmbeddingModelId =
  | 'gemini-embedding-exp'
  | 'text-embedding-004'
  | 'embedding-001'
  | (string & {});

export interface GoogleGenerativeAISettings {
  /**
  Optional.
  The name of the cached content used as context to serve the prediction.
  Format: cachedContents/{cachedContent}
     */
  cachedContent?: string;
  /**
   * Optional. Enable structured output. Default is true.
   *
   * This is useful when the JSON Schema contains elements that are
   * not supported by the OpenAPI schema version that
   * Google Generative AI uses. You can use this to disable
   * structured outputs if you need to.
   */
  structuredOutputs?: boolean;
  /**
  Optional. A list of unique safety settings for blocking unsafe content.
     */
  safetySettings?: Array<{
    category:
      | 'HARM_CATEGORY_UNSPECIFIED'
      | 'HARM_CATEGORY_HATE_SPEECH'
      | 'HARM_CATEGORY_DANGEROUS_CONTENT'
      | 'HARM_CATEGORY_HARASSMENT'
      | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
      | 'HARM_CATEGORY_CIVIC_INTEGRITY';
    threshold:
      | 'HARM_BLOCK_THRESHOLD_UNSPECIFIED'
      | 'BLOCK_LOW_AND_ABOVE'
      | 'BLOCK_MEDIUM_AND_ABOVE'
      | 'BLOCK_ONLY_HIGH'
      | 'BLOCK_NONE'
      | 'OFF';
  }>;
  /**
   * Optional. Enables timestamp understanding for audio-only files.
   *
   * https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/audio-understanding
   */
  audioTimestamp?: boolean;
  /**
  Optional. When enabled, the model will use Google search to ground the response.
  
  @see https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview
     */
  useSearchGrounding?: boolean;
}
