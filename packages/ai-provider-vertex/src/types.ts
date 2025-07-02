export type VertexLanguageModelId =
  // Gemini
  | 'gemini-2.0-flash-001'
  | 'gemini-2.0-flash-exp'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'
  // Anthropic on Vertex
  | 'claude-3-7-sonnet@20250219'
  | 'claude-3-5-sonnet-v2@20241022'
  | 'claude-3-5-sonnet@20240620'
  | 'claude-3-5-haiku@20241022'
  | 'claude-3-sonnet@20240229'
  | 'claude-3-haiku@20240307'
  | 'claude-3-opus@20240229'
  | (string & {});

export type VertexChatSettings = {
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
};

export type VertexEmbeddingModelId =
  | 'text-embedding-004'
  | (string & {});

export type VertexImageModelId =
  | 'imagen-3.0-generate-002'
  | 'imagen-3.0-fast-generate-001'
  | (string & {}); 