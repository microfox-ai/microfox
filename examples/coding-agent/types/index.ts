// src/types/index.ts

export interface TaskAnalysis {
    type: 'code_generation' | 'code_modification' | 'code_review' | 'other';
    language?: string;
    requirements: string[];
    constraints?: string[];
    context?: string;
    complexity: 'low' | 'medium' | 'high';
  }
  
  export interface PromptConfig {
    maxTokens?: number;
    temperature?: number;
    thinkingBudget?: number;
  }